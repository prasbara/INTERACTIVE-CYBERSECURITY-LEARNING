/**
 * CTF Categories Definition
 * 7 Primary Threat Vector Categories for Real-World Incident Analysis
 * Zero emojis, clean vector icon identifiers.
 */

export const CTF_CATEGORIES = [
  {
    id: 'authentication',
    name: 'Authentication Attacks',
    icon: 'lock',
    iconName: 'lock',
    description: 'Serangan brute-force, password spraying, credential stuffing, dan anomali login akun.',
    color: '#ef4444'
  },
  {
    id: 'web',
    name: 'Web Application Attacks',
    icon: 'network',
    iconName: 'network',
    description: 'Eksploitasi celah web seperti SQL Injection, Command Injection, Path Traversal, dan Web Shell.',
    color: '#f59e0b'
  },
  {
    id: 'malware',
    name: 'Malware & Execution',
    icon: 'cpu',
    iconName: 'cpu',
    description: 'Skrip jahat, stager PowerShell terobfuskasi, backdoor persistence, dan downloader behavior.',
    color: '#8b5cf6'
  },
  {
    id: 'network',
    name: 'Network & C2 Attacks',
    icon: 'radar',
    iconName: 'radar',
    description: 'Pemindaian port, DNS tunneling, HTTPS beaconing command & control, dan anomali volume trafik.',
    color: '#0ea5e9'
  },
  {
    id: 'endpoint',
    name: 'Endpoint & Privilege Escalation',
    icon: 'server',
    iconName: 'server',
    description: 'Eksploitasi kernel lokal, manipulasi cron job, bypass autentikasi sudo, dan credential dumping.',
    color: '#10b981'
  },
  {
    id: 'cloud',
    name: 'Cloud & IAM Security',
    icon: 'database',
    iconName: 'database',
    description: 'Kebocoran kunci API, penyalahgunaan role IAM, ekspos bucket data, dan audit CloudTrail.',
    color: '#6366f1'
  },
  {
    id: 'forensics',
    name: 'Forensics & Multi-Stage APT',
    icon: 'search',
    iconName: 'search',
    description: 'Rekonstruksi linimasa serangan multi-fase dari initial access, lateral movement hingga exfiltration.',
    color: '#ec4899'
  }
];

export const CTF_CATEGORIES_MAP = Object.fromEntries(CTF_CATEGORIES.map(c => [c.id, c]));

// Support dictionary indexing on CTF_CATEGORIES
CTF_CATEGORIES.forEach(c => {
  CTF_CATEGORIES[c.id] = c;
});

export function getCategoryById(categoryId) {
  return CTF_CATEGORIES_MAP[categoryId] || {
    id: 'general',
    name: 'General Security',
    icon: 'shield',
    iconName: 'shield',
    description: 'Investigasi insiden keamanan jaringan.',
    color: '#64748b'
  };
}
