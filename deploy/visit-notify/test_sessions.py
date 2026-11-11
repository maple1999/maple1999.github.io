import json
import tempfile
import unittest
from email import message_from_string
from email.header import decode_header, make_header
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode

from sessions import Collector, build_email

CFG = dict(daily_limit=40, smtp_user='sender@example.com', mail_to='owner@example.com', site_label='测试网站', skip_hosting=False)
BASE = 1790035200
PDF = '/cv/Shizhao_Gao_CV_EN.pdf'


def record(path, seconds=0, method='GET', status='200', ua='Mozilla/5.0 Firefox/130'):
    return dict(ip='8.8.8.8', ua=ua, method=method, status=status, bytes='5000', path=path,
                ref='https://www.mapletech.top/academic/', ts=datetime.fromtimestamp(BASE+seconds, timezone.utc).strftime('%d/%b/%Y:%H:%M:%S %z'))


def beacon(n=1, seconds=0, route='/academic/', kind='tick', sid='a'*32, pid='b'*32, elapsed=None):
    p = dict(v='2', sid=sid, pid=pid, n=n, t=seconds if elapsed is None else elapsed, p=route, e=kind)
    if kind == 'download': p['f'] = PDF
    return record('/_visit?'+urlencode(p), seconds, 'POST', '204')


class SessionsTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.path = str(Path(self.tmp.name)/'state.db')
        self.c = Collector(self.path, CFG)

    def tearDown(self):
        self.c.db.close()
        self.tmp.cleanup()

    def rows(self):
        return self.c.db.execute('SELECT * FROM sessions').fetchall()

    def test_session_summary_and_restart(self):
        self.c.ingest(record('/academic/'))
        self.c.ingest(beacon(kind='start'))
        self.c.ingest(beacon(2, 30))
        self.c.ingest(beacon(4, 45))
        self.c.ingest(beacon(3, 40, kind='download'))  # Out-of-order download.
        self.c.ingest(beacon(3, 40, kind='download'))  # Retry does not double count.
        self.c.ingest(record(PDF, 46, status='206'))
        self.c.ingest(record(PDF, 47, status='206'))
        self.c.ingest(beacon(1, 50, '/career/?role=vision', 'start', pid='c'*32, elapsed=0))
        self.c.ingest(beacon(2, 80, '/career/?role=vision', pid='c'*32, elapsed=30))
        self.c.db.commit()
        self.c.db.close()
        self.c = Collector(self.path, CFG)
        data = json.loads(self.rows()[0]['data'])
        self.assertEqual(len(data['pages']), 2)
        self.assertEqual(sum(p['seconds'] for p in data['pages'].values()), 75)
        self.assertEqual(data['files'][PDF]['clicks'], 1)
        self.assertEqual(data['files'][PDF]['requests'], 1)
        messages = []
        send = lambda cfg, msg: messages.append(msg) or True
        self.c.flush(BASE+379, send, lambda ip: {})
        self.assertEqual(messages, [])
        self.c.flush(BASE+381, send, lambda ip: {})
        self.assertEqual(len(messages), 1)
        content = messages[0].get_payload(decode=True).decode('utf8')
        self.assertIn('1 分 15 秒', content)
        self.assertIn('视觉算法工程师', content)
        self.assertIn('点击 1 次；HTTP 文件请求 1 组', content)
        self.c.ingest(beacon(5, 90))
        self.c.flush(BASE+1000, send, lambda ip: {})
        self.assertEqual(len(messages), 1)

    def test_log_only_unknown_duration(self):
        self.c.ingest(record('/academic/zh/'))
        self.c.ingest(record('/_astro/style.css', 1))
        self.c.ingest(record('/career/?role=product', 20))
        row = self.rows()[0]
        self.assertEqual(row['confirmed'], 1)
        content = build_email(CFG, row, {}, 1).get_payload(decode=True).decode('utf8')
        self.assertIn('未知（未收到浏览器计时）', content)

    def test_subject_location_survives_mail_encoding(self):
        self.c.ingest(beacon(kind='start'))
        for n, seconds in enumerate([30, 60, 75], 2):
            self.c.ingest(beacon(n=n, seconds=seconds))
        row = self.rows()[0]
        for geo, expected in [
            ({'country': '德国', 'regionName': '巴伐利亚', 'city': '慕尼黑'}, '德国 · 慕尼黑'),
            ({'country': '中国', 'regionName': '上海', 'city': ''}, '中国 · 上海'),
            ({'country': '新加坡', 'city': '新加坡'}, '新加坡'),
            ({}, '属地未知'),
        ]:
            with self.subTest(geo=geo):
                msg = message_from_string(build_email(CFG, row, geo, 1).as_string())
                subject = str(make_header(decode_header(msg['Subject'])))
                self.assertEqual(subject, f'访问汇总 · {expected} · 1 页 · 1 分 15 秒 · 0 附件')
                self.assertIn('IP：8.8.8.8', msg.get_payload(decode=True).decode('utf8'))

    def test_tabs_and_filtering(self):
        self.c.ingest(beacon())
        self.c.ingest(beacon(sid='d'*32))
        self.c.ingest(record(PDF, 1))
        self.assertEqual(len(self.rows()), 2)
        self.assertTrue(all(not json.loads(r['data'])['files'] for r in self.rows()))
        self.c.ingest(record('/playground/', 2))
        bad = beacon(sid='e'*32); bad['ref'] = 'https://evil.example/'
        self.c.ingest(bad)
        self.c.ingest(record('/academic/', 3, ua='Mozilla HeadlessChrome'))
        self.assertEqual(len(self.rows()), 2)

    def test_retry_and_quota(self):
        self.c.ingest(beacon())
        self.c.flush(BASE+301, lambda *_: False, lambda _: {})
        self.assertEqual(self.rows()[0]['status'], 'pending')
        self.assertEqual(self.rows()[0]['attempts'], 1)
        self.c.flush(BASE+500, lambda *_: self.fail('Too early'), lambda _: {})
        self.c.put_meta('sent_today', 40)
        self.c.flush(BASE+700, lambda *_: self.fail('Quota'), lambda _: {})
        self.assertEqual(self.rows()[0]['status'], 'pending')
        self.c.put_meta('sent_today', 0)
        self.c.flush(BASE+701, lambda *_: True, lambda _: {})
        self.assertEqual(self.rows()[0]['status'], 'sent')

    def test_unknown_attachment_and_invalid_counter(self):
        for suffix in ['&f=%2Fetc%2Fpasswd', '&n=oops']:
            r = beacon(kind='download'); r['path'] += suffix
            self.c.ingest(r)
        self.assertEqual(len(self.rows()), 0)

    def test_scanners_and_search_crawlers_never_notify(self):
        for ua in ['Mozilla/5.0 ForestEngine/1.0', 'Mozilla/5.0 Googlebot/2.1',
                   'Mozilla/5.0 bingbot/2.0', 'Mozilla/5.0 sqlmap/1.0']:
            self.c.ingest(record('/academic/', ua=ua))
            self.c.ingest(record(PDF, ua=ua))
            event = beacon(); event['ua'] = ua
            self.c.ingest(event)
        self.assertEqual(len(self.rows()), 0)

    def test_favicon_does_not_confirm_visit(self):
        self.c.ingest(record('/'))
        self.c.ingest(record('/favicon.svg', 1))
        self.c.ingest(record('/favicon.ico', 2))
        self.c.flush(BASE+400, lambda *_: self.fail('Icon-only visit sent'), lambda _: {})
        self.assertEqual(self.rows()[0]['status'], 'filtered')

    def test_direct_pdf_is_preserved_without_timing(self):
        self.c.ingest(record(PDF))
        messages = []
        self.c.flush(BASE+301, lambda _, msg: messages.append(msg) or True, lambda _: {})
        self.assertEqual(len(messages), 1)
        self.assertIn('HTTP 文件请求 1 组', messages[0].get_payload(decode=True).decode('utf8'))

    def test_pending_scanner_rechecked_after_upgrade(self):
        self.c.ingest(beacon())
        self.c.db.execute("UPDATE sessions SET ua='Mozilla/5.0 ForestEngine/1.0'")
        self.c.flush(BASE+301, lambda *_: self.fail('Pending bot sent'), lambda _: {})
        self.assertEqual(self.rows()[0]['status'], 'filtered')


if __name__ == '__main__':
    unittest.main()
