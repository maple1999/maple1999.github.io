"""仅切换 /var/www/mapletech 的静态版本，不操作 nginx 或其他服务。"""
import argparse
import fcntl
import json
import os
from pathlib import Path
import shutil

ROOT = Path('/var/www/mapletech')
RELEASES = Path('/var/www/mapletech.releases')


def checked_release(raw):
    path = Path(raw)
    if RELEASES.resolve() != RELEASES or path.parent != RELEASES or path.resolve() != path:
        raise RuntimeError('Release must be a real directory directly under ' + str(RELEASES))
    if not path.is_dir() or not (path / 'index.html').is_file():
        raise RuntimeError('Release is missing index.html')
    return path


def activate(target, preserve_assets):
    if ROOT.is_symlink():
        previous = checked_release(str(ROOT.resolve()))
        legacy = None
    elif ROOT.is_dir() and ROOT.resolve() == ROOT:
        previous = RELEASES / ('legacy-' + target.name)
        if previous.exists():
            raise RuntimeError('Backup already exists; refusing to overwrite it')
        legacy = previous
    else:
        raise RuntimeError('Unexpected website root; refusing to touch it')

    # 保留旧版哈希资源，已打开的页面仍可继续读取其 CSS 和图片。
    if preserve_assets:
        source = ROOT / '_astro'
        destination = target / '_astro'
        destination.mkdir(exist_ok=True)
        if source.is_dir():
            for file in source.iterdir():
                if file.is_file() and not file.is_symlink() and not (destination / file.name).exists():
                    shutil.copy2(file, destination / file.name)

    pending = ROOT.with_name('mapletech.pending-' + target.name)
    if pending.exists() or pending.is_symlink():
        raise RuntimeError('Pending website link already exists')
    pending.symlink_to(target, target_is_directory=True)
    moved = False
    try:
        if legacy is not None:
            ROOT.rename(legacy)
            moved = True
        os.replace(pending, ROOT)
    except Exception:
        if moved and not ROOT.exists() and not ROOT.is_symlink():
            legacy.rename(ROOT)
        if pending.is_symlink():
            pending.unlink()
        raise
    return previous


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('action', choices=['activate', 'rollback'])
    parser.add_argument('release')
    args = parser.parse_args()
    target = checked_release(args.release)
    if args.action == 'activate':
        for required in ['academic/index.html', 'academic/zh/index.html', 'zh/index.html', 'career/index.html', 'cv/Shizhao_Gao_Product_Manager_ZH.pdf', 'cv/Shizhao_Gao_Vision_Engineer_ZH.pdf', 'robots.txt', 'sitemap.xml']:
            if not (target / required).is_file():
                raise RuntimeError('Missing required output: ' + required)
    with open('/var/lock/mapletech-deploy.lock', 'a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        previous = activate(target, args.action == 'activate')
    print(json.dumps({'active': str(target), 'previous': str(previous)}))


if __name__ == '__main__':
    main()
