/**
 * CTF Verified Open-Source References & Security Advisories
 * Documenting the real-world factual inspirations behind each educational challenge.
 * All challenge scenarios run in local sandboxed synthetic environments.
 */

export const CTF_SOURCES = {
  'cisa-aa21-131a': {
    id: 'cisa-aa21-131a',
    sourceType: 'security_advisory',
    sourceName: 'CISA Cybersecurity Advisory AA21-131A',
    title: 'Russian SVR Targets Remote Work Environments with Password Spraying and Brute Force',
    sourceUrl: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-131a',
    publicationDate: '2021-05-07',
    mitreTechniques: ['T1110.001', 'T1110.003']
  },
  'cve-2021-44228': {
    id: 'cve-2021-44228',
    sourceType: 'vulnerability_database',
    sourceName: 'NIST NVD & Apache Security Advisory',
    title: 'Apache Log4j2 JNDI Features Remote Code Execution (Log4Shell)',
    sourceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2021-44228',
    publicationDate: '2021-12-10',
    mitreTechniques: ['T1190', 'T1059']
  },
  'cve-2022-22965': {
    id: 'cve-2022-22965',
    sourceType: 'vulnerability_database',
    sourceName: 'VMware Tanzu / Spring Security Advisory',
    title: 'Spring Framework RCE via Data Binding on JDK 9+ (Spring4Shell)',
    sourceUrl: 'https://tanzu.vmware.com/security/cve-2022-22965',
    publicationDate: '2022-03-31',
    mitreTechniques: ['T1190']
  },
  'cve-2021-23017': {
    id: 'cve-2021-23017',
    sourceType: 'vulnerability_database',
    sourceName: 'Nginx Security Advisory & NIST NVD',
    title: '1-byte Memory Overwrite in Nginx DNS Resolver and Alias Traversal',
    sourceUrl: 'https://mailman.nginx.org/pipermail/nginx-announce/2021/000300.html',
    publicationDate: '2021-05-25',
    mitreTechniques: ['T1006', 'T1190']
  },
  'owasp-top10-sqli': {
    id: 'owasp-top10-sqli',
    sourceType: 'educational_framework',
    sourceName: 'OWASP Foundation A03:2021',
    title: 'OWASP Top 10 Injection Vulnerabilities Case Studies',
    sourceUrl: 'https://owasp.org/Top10/A03_2021-Injection/',
    publicationDate: '2021-09-24',
    mitreTechniques: ['T1190']
  },
  'cve-2017-5638': {
    id: 'cve-2017-5638',
    sourceType: 'incident_report',
    sourceName: 'US Government Accountability Office (GAO) Equifax Investigation',
    title: 'Apache Struts 2 Jakarta Multipart Parser OGNL Execution',
    sourceUrl: 'https://www.gao.gov/products/gao-18-559',
    publicationDate: '2018-08-30',
    mitreTechniques: ['T1190', 'T1059']
  },
  'mitre-t1505-003': {
    id: 'mitre-t1505-003',
    sourceType: 'threat_intelligence',
    sourceName: 'MITRE ATT&CK & CISA Alert AA22-277A',
    title: 'Server Software Component: Web Shell Backdoors and Persistence Detection',
    sourceUrl: 'https://attack.mitre.org/techniques/T1505/003/',
    publicationDate: '2022-10-04',
    mitreTechniques: ['T1505.003', 'T1059.006']
  },
  'mitre-t1071-004': {
    id: 'mitre-t1071-004',
    sourceType: 'threat_intelligence',
    sourceName: 'Unit 42 / Palo Alto Networks Threat Brief',
    title: 'DNS Tunneling and Data Exfiltration Analysis Techniques',
    sourceUrl: 'https://unit42.paloaltonetworks.com/dns-tunneling-how-dns-can-be-abused-by-malicious-actors/',
    publicationDate: '2021-04-13',
    mitreTechniques: ['T1071.004', 'T1048.003']
  },
  'mitre-t1071-001': {
    id: 'mitre-t1071-001',
    sourceType: 'threat_intelligence',
    sourceName: 'Mandiant M-Trends Report & MITRE ATT&CK',
    title: 'Cobalt Strike Malleable C2 Beaconing and Jitter Detection in TLS',
    sourceUrl: 'https://attack.mitre.org/techniques/T1071/001/',
    publicationDate: '2022-04-20',
    mitreTechniques: ['T1071.001', 'T1573.002']
  },
  'cve-2017-0144': {
    id: 'cve-2017-0144',
    sourceType: 'security_advisory',
    sourceName: 'Microsoft Security Bulletin MS17-010 / US-CERT',
    title: 'EternalBlue SMBv1 Remote Code Execution and Lateral Worming',
    sourceUrl: 'https://learn.microsoft.com/en-us/security-updates/securitybulletins/2017/ms17-010',
    publicationDate: '2017-03-14',
    mitreTechniques: ['T1210', 'T1021.002']
  },
  'cisa-ad-kerberoasting': {
    id: 'cisa-ad-kerberoasting',
    sourceType: 'threat_intelligence',
    sourceName: 'SpecterOps / CISA Active Directory Attack Surface Guide',
    title: 'Kerberoasting Attack on Service Principal Names (SPN)',
    sourceUrl: 'https://attack.mitre.org/techniques/T1558/003/',
    publicationDate: '2022-01-15',
    mitreTechniques: ['T1558.003', 'T1003']
  },
  'cve-2021-3156': {
    id: 'cve-2021-3156',
    sourceType: 'vulnerability_database',
    sourceName: 'Qualys Security Advisory & Sudo Project',
    title: 'Baron Samedit: Heap-based Buffer Overflow in Sudo (sudoedit -s)',
    sourceUrl: 'https://www.qualys.com/2021/01/26/cve-2021-3156/baron-samedit-heap-based-overflow-sudo.txt',
    publicationDate: '2021-01-26',
    mitreTechniques: ['T1068']
  },
  'cve-2022-0847': {
    id: 'cve-2022-0847',
    sourceType: 'vulnerability_database',
    sourceName: 'Max Kellermann Disclosure & Linux Kernel Team',
    title: 'The Dirty Pipe Vulnerability in Linux Kernel 5.8+ (Arbitrary File Overwrite)',
    sourceUrl: 'https://dirtypipe.cm4all.com/',
    publicationDate: '2022-03-07',
    mitreTechniques: ['T1068', 'T1565.001']
  },
  'cve-2022-26134': {
    id: 'cve-2022-26134',
    sourceType: 'security_advisory',
    sourceName: 'Atlassian Security Advisory & CISA KEV Catalog',
    title: 'Atlassian Confluence Server and Data Center OGNL Injection',
    sourceUrl: 'https://confluence.atlassian.com/doc/confluence-security-advisory-2022-06-02-1130377146.html',
    publicationDate: '2022-06-02',
    mitreTechniques: ['T1190', 'T1059.004']
  },
  'cve-2015-3306': {
    id: 'cve-2015-3306',
    sourceType: 'vulnerability_database',
    sourceName: 'ProFTPD Security Alert & Rapid7 Disclosure',
    title: 'ProFTPD mod_copy Arbitrary Copying without Authentication',
    sourceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2015-3306',
    publicationDate: '2015-05-18',
    mitreTechniques: ['T1190', 'T1505.003']
  },
  'aws-s3-exposure-cases': {
    id: 'aws-s3-exposure-cases',
    sourceType: 'threat_intelligence',
    sourceName: 'CISA & AWS Well-Architected Security Pillar',
    title: 'Cloud Data Storage Misconfiguration and Public Bucket Enumeration',
    sourceUrl: 'https://attack.mitre.org/techniques/T1530/',
    publicationDate: '2022-08-11',
    mitreTechniques: ['T1530', 'T1078.004']
  },
  'mitre-t1053-cron': {
    id: 'mitre-t1053-cron',
    sourceType: 'threat_intelligence',
    sourceName: 'MITRE ATT&CK & CISA Alert AA20-258A',
    title: 'Scheduled Task/Job: Cron Persistence on Linux Infrastructure',
    sourceUrl: 'https://attack.mitre.org/techniques/T1053/003/',
    publicationDate: '2020-09-15',
    mitreTechniques: ['T1053.003']
  },
  'mitre-t1218-certutil': {
    id: 'mitre-t1218-certutil',
    sourceType: 'threat_intelligence',
    sourceName: 'LOLBAS Project & CISA Malware Analysis',
    title: 'System Binary Proxy Execution: Certutil as Payload Dropper',
    sourceUrl: 'https://attack.mitre.org/techniques/T1218.011/',
    publicationDate: '2021-03-12',
    mitreTechniques: ['T1218.011', 'T1105']
  },
  'mitre-t1003-lsass': {
    id: 'mitre-t1003-lsass',
    sourceType: 'threat_intelligence',
    sourceName: 'Microsoft Defender Security Research & MITRE ATT&CK',
    title: 'OS Credential Dumping: LSASS Memory Minidump and Mimikatz',
    sourceUrl: 'https://attack.mitre.org/techniques/T1003/001/',
    publicationDate: '2021-11-04',
    mitreTechniques: ['T1003.001']
  },
  'mitre-t1552-git-keys': {
    id: 'mitre-t1552-git-keys',
    sourceType: 'security_advisory',
    sourceName: 'TruffleHog / GitGuardian Threat Report',
    title: 'Unsecured Credentials: Hardcoded Cloud IAM Access Keys in Source Repositories',
    sourceUrl: 'https://attack.mitre.org/techniques/T1552/001/',
    publicationDate: '2022-02-18',
    mitreTechniques: ['T1552.001', 'T1078.004']
  },
  'mitre-t1562-cloudtrail': {
    id: 'mitre-t1562-cloudtrail',
    sourceType: 'threat_intelligence',
    sourceName: 'AWS Incident Response Guide & MITRE ATT&CK',
    title: 'Impair Defenses: Disabling CloudTrail Logging and Evasion',
    sourceUrl: 'https://attack.mitre.org/techniques/T1562/001/',
    publicationDate: '2022-06-14',
    mitreTechniques: ['T1562.001']
  },
  'mitre-t1611-docker-escape': {
    id: 'mitre-t1611-docker-escape',
    sourceType: 'security_advisory',
    sourceName: 'Aqua Security / CNCF Cloud Native Security Whitepaper',
    title: 'Container Escape via Exposed Host Docker Socket Mounting',
    sourceUrl: 'https://attack.mitre.org/techniques/T1611/',
    publicationDate: '2021-10-09',
    mitreTechniques: ['T1611', 'T1068']
  },
  'redis-unauth-rce': {
    id: 'redis-unauth-rce',
    sourceType: 'security_advisory',
    sourceName: 'Unit 42 / Redis Security Documentation',
    title: 'Exposed Redis Server Rogue Key Injection and Authorized_Keys RCE',
    sourceUrl: 'https://redis.io/docs/management/security/',
    publicationDate: '2020-07-22',
    mitreTechniques: ['T1190', 'T1078']
  },
  'cisa-ransomware-vss': {
    id: 'cisa-ransomware-vss',
    sourceType: 'security_advisory',
    sourceName: 'CISA Joint Cybersecurity Advisory AA23-061A',
    title: 'Ransomware Inhibiting System Recovery: Vssadmin and Bcdedit Abuse',
    sourceUrl: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-061a',
    publicationDate: '2023-03-02',
    mitreTechniques: ['T1490', 'T1486']
  },
  'cisa-apt-playbook': {
    id: 'cisa-apt-playbook',
    sourceType: 'threat_intelligence',
    sourceName: 'CISA & FBI Joint Advisory AA22-110A',
    title: 'Advanced Persistent Threat (APT) End-to-End Attack Lifecycle and Triage',
    sourceUrl: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-110a',
    publicationDate: '2022-04-28',
    mitreTechniques: ['T1190', 'T1059', 'T1053', 'T1021', 'T1041']
  }
};

