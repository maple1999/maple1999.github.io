/** TXyun 正式站：构建校验 → 上传独立版本 → 切换 → 检查，失败自动回滚。 */
import { execFileSync, execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SSH_SCRIPTS = resolve(homedir(), '.codex/skills/ssh-skill/scripts').replaceAll('\\', '/');
const HOST = 'TXyun';
const PUBLIC_URL = 'https://www.mapletech.top';
const releaseId = new Date().toISOString().replace(/[-:.]/g, '');
const destination = `/var/www/mapletech.releases/${releaseId}`;
const helper = `/tmp/mapletech-release-${releaseId}.py`;
const env = { ...process.env, PYTHONIOENCODING: 'utf-8' };
const parse = (output) => {
  const start = output.indexOf('{');
  if (start < 0) throw new Error('SSH 工具没有返回 JSON');
  return JSON.parse(output.slice(start));
};
function invoke(script, args) {
  try {
    return parse(execFileSync('python', [`${SSH_SCRIPTS}/${script}.py`, ...args], { encoding: 'utf8', env, maxBuffer: 8 * 1024 * 1024 }));
  } catch (error) {
    if (error.stdout) {
      const result = parse(error.stdout);
      throw new Error(result.stderr || JSON.stringify(result));
    }
    throw error;
  }
}
function ssh(command) {
  const result = invoke('ssh_execute', [HOST, command, '--timeout', '120']);
  if (!result.success || result.exit_code !== 0) throw new Error(result.stderr || result.stdout || '远程命令失败');
  return result.stdout;
}
function upload(local, remote, recursive = false) {
  const args = [HOST, local.replaceAll('\\', '/'), remote, '--no-progress'];
  if (recursive) args.push('--recursive');
  const result = invoke('ssh_upload', args);
  if (!result.success || result.files_failed || !result.files_transferred) throw new Error('上传失败：' + JSON.stringify(result.errors));
  console.log(`已上传 ${result.files_transferred} 个文件`);
}

console.log('构建并校验 TXyun 正式站');
execSync('npm run build', { cwd: ROOT, stdio: 'inherit', env: { ...env, SITE_URL: PUBLIC_URL, NOINDEX: '0' } });

// 新建本站独立版本目录；不覆盖或删除服务器上的任何已有目录。
console.log(`上传版本 ${releaseId}`);
ssh(`test -d /var/www/mapletech && test ! -L /var/www/mapletech.releases && sudo install -d -m 755 /var/www/mapletech.releases && sudo mkdir ${destination} && sudo chown ubuntu:ubuntu ${destination}`);
upload(resolve(ROOT, 'dist'), destination, true);
upload(resolve(ROOT, 'scripts/release-site.py'), helper);
// 发布后的版本只允许 root 修改，静态资源仍可由 nginx 读取。
ssh(`sudo chown -R root:root ${destination} && sudo find ${destination} -type d -exec chmod 755 {} + && sudo find ${destination} -type f -exec chmod 644 {} +`);
const switched = JSON.parse(ssh(`sudo python3 ${helper} activate ${destination}`));
console.log(`已切换版本；回滚版本：${switched.previous}`);

try {
  for (const path of ['/', '/en/', '/academic/', '/academic/zh/', '/zh/', '/career/', '/cv/Shizhao_Gao_Product_Manager_ZH.pdf', '/cv/Shizhao_Gao_Vision_Engineer_ZH.pdf', '/cv/Shizhao_Gao_CV_EN.pdf', '/cv/Shizhao_Gao_CV_ZH.pdf', '/robots.txt', '/sitemap.xml']) {
    // 在服务器本机验证 TLS/SNI，避免客户端网络波动导致错误回滚。
    const code = ssh(`curl -sS --resolve www.mapletech.top:443:127.0.0.1 --max-time 15 -o /dev/null -w '%{http_code}' ${PUBLIC_URL}${path}`).trim();
    if (code !== '200') throw new Error(`${path} 返回 ${code}`);
    console.log(`200 ${path}`);
  }
  const notFound = ssh(`curl -sS --resolve www.mapletech.top:443:127.0.0.1 --max-time 15 -o /dev/null -w '%{http_code}' ${PUBLIC_URL}/__mapletech_missing_page__`).trim();
  if (notFound !== '404') throw new Error('404 页面检查失败');
  for (const name of ['Recommendation_Jun_Li.pdf', 'Recommendation_Qiming_Li.pdf']) {
    const code = ssh(`curl -sS --resolve www.mapletech.top:443:127.0.0.1 --max-time 15 -o /dev/null -w '%{http_code}' ${PUBLIC_URL}/letters/${name}`).trim();
    if (!['404', '410'].includes(code)) throw new Error(`推荐信仍可公开访问：${name} (${code})`);
    console.log(`${code} /letters/${name}`);
  }
} catch (error) {
  console.error('发布检查失败，恢复上一版');
  ssh(`sudo python3 ${helper} rollback ${switched.previous}`);
  throw error;
}
ssh(`unlink ${helper}`);
console.log(`发布完成：${PUBLIC_URL}/`);
