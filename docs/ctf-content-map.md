# CTF Content Map — 30 Real-World Incident Challenges

**IDS Learning Lab — Bank Kasus Investigasi Insiden Keamanan Siber**  
*Complete 30-Challenge Taxonomy & Flag Mapping*

---

## Master Challenge Registry

| # | ID | Alias | Category | Difficulty | Challenge Title & Core Threat Vector | Security Flag |
|---|---|---|---|---|---|---|
| **01** | `RC-CTF-001` | `ctf-001` | Authentication | Beginner | SSH Santai Tapi Brute Force (Dictionary Attack) | `FLAG{SSH_SANTAI_TAPI_BRUTE_FORCE}` |
| **02** | `RC-CTF-002` | `ctf-002` | Authentication | Intermediate | Password Spraying vs Human Error (AD Kerberos) | `FLAG{AKU_BUKAN_BOT_CUMA_SALAH_PASSWORD}` |
| **03** | `RC-CTF-003` | `ctf-003` | Authentication | Intermediate | Off-Hours Access & Log Analysis (RDP 3389) | `FLAG{LOG_DULU_BARU_PANIK}` |
| **04** | `RC-CTF-004` | `ctf-004` | Authentication | Intermediate | Credential Stuffing & Suspicious IP Detection | `FLAG{IP_NYA_NAKAL_BANG}` |
| **05** | `RC-CTF-005` | `ctf-005` | Authentication | Advanced | API Token Misuse & Root Privilege Escalation | `FLAG{ROOT_JANGAN_DIAJAK_MAIN}` |
| **06** | `RC-CTF-006` | `ctf-006` | Web | Intermediate | Weak Credential & Log4j Remote Code Execution | `FLAG{PASSWORD123_BELUM_TAHUN_2010}` |
| **07** | `RC-CTF-007` | `ctf-007` | Web | Beginner | SQLi Authentication Bypass & Auth Log Audit | `FLAG{AUTH_LOG_TAHU_SEGALANYA}` |
| **08** | `RC-CTF-008` | `ctf-008` | Web | Beginner | Path Traversal & Linux Log Grep (/etc/passwd) | `FLAG{GREP_SAMPAI_KETEMU}` |
| **09** | `RC-CTF-009` | `ctf-009` | Web | Intermediate | WAF Alert Triage: False Positive Analysis | `FLAG{FALSE_POSITIVE_TAPI_BAPER}` |
| **10** | `RC-CTF-010` | `ctf-010` | Web | Advanced | Incomplete Packet Capture & Insufficient Evidence | `FLAG{NEED_MORE_EVIDENCE_BRO}` |
| **11** | `RC-CTF-011` | `ctf-011` | Web | Advanced | Confluence Pre-Auth RCE: Confirmed True Positive | `FLAG{TP_KETEMU_JUGA_AKHIRNYA}` |
| **12** | `RC-CTF-012` | `ctf-012` | Network | Advanced | DNS Tunneling & Alert Triage (High Volume) | `FLAG{SOC_TIDAK_SEMUA_YANG_MERAH_BAHAYA}` |
| **13** | `RC-CTF-013` | `ctf-013` | Network | Advanced | Cobalt Strike C2 Beaconing & Repeated Source IP | `FLAG{SI_IP_185_KOK_BALIK_LAGI}` |
| **14** | `RC-CTF-014` | `ctf-014` | Network | Beginner | Nmap Port Scan & Timeline Reconstruction | `FLAG{TIMELINE_NYA_JELAS_BOSS}` |
| **15** | `RC-CTF-015` | `ctf-015` | Network | Advanced | SMB Propagation in High-Noise Traffic | `FLAG{LOGNYA_BERISIK_TAPI_KITA_TELITI}` |
| **16** | `RC-CTF-016` | `ctf-016` | Network | Expert | Kerberoasting Attack & Signature Detection | `FLAG{SIGNATURE_KENALAN_LAMA}` |
| **17** | `RC-CTF-017` | `ctf-017` | Network | Intermediate | TCP SYN Flood & Volumetric Anomaly Detection | `FLAG{ANOMALI_TIBA_TIBA_DATANG}` |
| **18** | `RC-CTF-018` | `ctf-018` | Endpoint | Advanced | Kernel Exploit Triage & Triage Decision | `FLAG{JANGAN_ASAL_BLOCK_DULU}` |
| **19** | `RC-CTF-019` | `ctf-019` | Endpoint | Intermediate | Sudoedit Vulnerability & Evidence-Based Reasoning | `FLAG{EVIDENCE_DULU_BARU_NUDUH}` |
| **20** | `RC-CTF-020` | `ctf-020` | Endpoint | Beginner | Cron Reverse Shell & Auth Correlation | `FLAG{SIAPA_SURUH_LOGIN_100_KALI}` |
| **21** | `RC-CTF-021` | `ctf-021` | Endpoint | Intermediate | LOLBAS Certutil Dropper & Incident Response | `FLAG{CTF_DULU_MITIGASI_KEMUDIAN}` |
| **22** | `RC-CTF-022` | `ctf-022` | Endpoint | Advanced | LSASS Memory Dumping & IOC Extraction | `FLAG{IOC_NYA_KETEMU_GES}` |
| **23** | `RC-CTF-023` | `ctf-023` | Cloud | Beginner | AWS S3 Storage Exposure & MITRE ATT&CK Mapping | `FLAG{MITRE_NYA_MANA_BANG}` |
| **24** | `RC-CTF-024` | `ctf-024` | Cloud | Intermediate | Cloud Credential Theft & Stealth Malware Behavior | `FLAG{SI_MALWARE_PURA_PURA_NORMAL}` |
| **25** | `RC-CTF-025` | `ctf-025` | Cloud | Advanced | CloudTrail Log Tampering & Investigation Workflow | `FLAG{404_ATTACKER_NOT_FOUND}` |
| **26** | `RC-CTF-026` | `ctf-026` | Cloud | Expert | Container Escape & Terminal Investigation | `FLAG{TERMINALNYA_CUMA_SIMULASI}` |
| **27** | `RC-CTF-027` | `ctf-027` | Forensics | Intermediate | ProFTPD mod_copy & Critical Evidence Selection | `FLAG{KLIK_SEMUA_LOG_BELUM_TENTU_BENAR}` |
| **28** | `RC-CTF-028` | `ctf-028` | Endpoint | Advanced | Multi-Sensor Correlation: Redis + SSH | `FLAG{SATU_LOG_TIDAK_CUKUP}` |
| **29** | `RC-CTF-029` | `ctf-029` | Malware | Advanced | LAPS-Heuristik Capstone: Ransomware Defense | `FLAG{LAPS_SAMPAI_FLAG}` |
| **30** | `RC-CTF-030` | `ctf-030` | Forensics | Expert | Grand Final SOC Analyst Challenge: Full APT Triage | `FLAG{ANALIS_MUDA_JANGAN_ASAL_TUDUH}` |

---

## Threat Category Distribution

- **Authentication Attacks**: 5 Challenges (`001` - `005`)
- **Web Application Exploitation**: 6 Challenges (`006` - `011`)
- **Network & C2 Intrusion**: 6 Challenges (`012` - `017`)
- **Endpoint & Privilege Escalation**: 6 Challenges (`018` - `022`, `028`)
- **Cloud & Container Infrastructure**: 4 Challenges (`023` - `026`)
- **Advanced Forensics & Malware**: 3 Challenges (`027`, `029`, `030`)

---

## Special Capstone Challenges

### Challenge #29: LAPS-Heuristik Capstone (`FLAG{LAPS_SAMPAI_FLAG}`)
- **Focus**: Complete 4-stage LAPS cycle (Memahami → Merencanakan → Melaksanakan → Meninjau).
- **Evidence Sources**: `sysmon_vssadmin.json`, `suricata_nids.log`, `ransom_note.txt`, and DNS telemetry.
- **Pedagogical Core**: Distinguish real pre-encryption destruction (`vssadmin Delete Shadows /All /Quiet`, `bcdedit recoveryenabled No`) from decoy benign NTP sync traffic. Formulate hypothesis, choose critical evidence, verify True Positive status, and determine immutable 3-2-1 backup strategy before submitting the flag.

### Challenge #30: Grand Final SOC Analyst (`FLAG{ANALIS_MUDA_JANGAN_ASAL_TUDUH}`)
- **Focus**: Highest complexity multi-stage APT attack triage.
- **Evidence Sources**: Unified SIEM correlated timeline, DMZ web access log, Active Directory Kerberos auth log, and perimeter egress NetFlow.
- **Pedagogical Core**: Reconstruct the entire 4-stage APT lifecycle: Initial Access via SQLi webshell → Persistence via scheduled cron → Lateral Movement via SMB port 445 → Exfiltration of 450MB encrypted archive to C2 IP 203.0.113.99. Eliminates 1200 decoy automated scan pings. Demands strict evidence-based reasoning without premature accusations.
