/**
 * Simulated Terminal Component
 * Provides a sandboxed educational CLI environment without needing a backend.
 * Supports commands: help, cat, grep, clear, date, whoami, ifconfig.
 */

import { createElement } from '../utils/dom.js';
import { addXP } from '../modules/gamification/xpSystem.js';
import { logEvent } from '../modules/analytics/eventLogger.js';

export function createSimulatedTerminal({
  initialLogs = [
    '08:14:32 WIB sshd[1402]: Failed password for invalid user root from 192.168.1.45 port 49152 ssh2',
    '08:14:35 WIB sshd[1405]: Failed password for invalid user admin from 192.168.1.45 port 49154 ssh2',
    '08:14:38 WIB sshd[1409]: Failed password for invalid user test from 192.168.1.45 port 49156 ssh2',
    '08:14:41 WIB sshd[1415]: Failed password for invalid user oracle from 192.168.1.45 port 49158 ssh2',
    '08:15:03 WIB NIDS[2001221]: ET SCAN Potential SSH Brute Force COUNT=94 DST=192.168.1.10:22',
    '08:16:10 WIB sshd[1430]: Accepted password for root from 192.168.1.45 port 49170 ssh2'
  ]
}) {
  const container = createElement('div', { className: 'terminal-container card' });

  const header = createElement('div', {
    className: 'terminal-header',
    children: [
      createElement('div', {
        className: 'terminal-dot-group',
        children: [
          createElement('span', { className: 'terminal-dot dot-red' }),
          createElement('span', { className: 'terminal-dot dot-yellow' }),
          createElement('span', { className: 'terminal-dot dot-green' })
        ]
      }),
      createElement('span', { className: 'terminal-title', text: 'student@ids-soc-lab:~ (Bash Sandbox)' })
    ]
  });

  const screen = createElement('div', { className: 'terminal-screen' });

  // Initial welcome message
  const welcome = createElement('div', {
    className: 'terminal-output',
    html: `IDS Lab Interactive Shell v1.0 [Sandboxed Environment]<br>Ketik <code>help</code> untuk melihat daftar perintah investigasi yang tersedia.<br>`
  });
  screen.appendChild(welcome);

  const inputRow = createElement('div', { className: 'terminal-input-row' });
  const prompt = createElement('span', { className: 'terminal-prompt', text: 'student@ids-lab:~$ ' });

  const input = createElement('input', {
    className: 'terminal-input',
    attributes: {
      type: 'text',
      autocapitalize: 'off',
      autocomplete: 'off',
      spellcheck: 'false',
      placeholder: 'contoh: grep failed auth.log'
    }
  });

  inputRow.appendChild(prompt);
  inputRow.appendChild(input);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = input.value.trim();
      if (!rawCmd) return;

      appendCommandLine(rawCmd);
      executeCommand(rawCmd);
      input.value = '';
      screen.scrollTop = screen.scrollHeight;
    }
  });

  function appendCommandLine(cmd) {
    const cmdLine = createElement('div', {
      className: 'terminal-history-cmd',
      html: `<span class="terminal-prompt">student@ids-lab:~$ </span><span class="cmd-text">${escapeHtml(cmd)}</span>`
    });
    screen.appendChild(cmdLine);
  }

  function appendOutput(html) {
    const out = createElement('div', {
      className: 'terminal-output',
      html
    });
    screen.appendChild(out);
  }

  function executeCommand(cmd) {
    const parts = cmd.toLowerCase().split(/\s+/);
    const main = parts[0];

    logEvent('terminal_command_run', { command: cmd });

    if (main === 'help') {
      appendOutput(`
Daftar perintah yang didukung:
  <b>cat auth.log</b>            - Tampilkan seluruh catatan autentikasi
  <b>grep &lt;keyword&gt; auth.log</b> - Saring baris berdasarkan kata kunci (contoh: <code>grep failed auth.log</code>)
  <b>grep 192.168.1.45 auth.log</b> - Saring event dari IP tertentu
  <b>whoami</b>                  - Informasi identitas akun aktif
  <b>clear</b>                   - Bersihkan layar terminal
      `);
      addXP(5, 'Menjalankan Perintah Terminal');
    } else if (main === 'clear') {
      screen.innerHTML = '';
    } else if (main === 'whoami') {
      appendOutput('student (Junior SOC Analyst - Lab Session)');
    } else if (main === 'cat') {
      if (parts[1] === 'auth.log') {
        appendOutput(initialLogs.map(l => escapeHtml(l)).join('<br>'));
      } else {
        appendOutput(`cat: ${escapeHtml(parts[1] || '')}: File tidak ditemukan. Gunakan <code>cat auth.log</code>`);
      }
    } else if (main === 'grep') {
      const keyword = parts[1] ? parts[1].replace(/['"]/g, '') : '';
      const file = parts[2];

      if (!keyword) {
        appendOutput('Gunakan format: <code>grep &lt;kata-kunci&gt; auth.log</code>');
        return;
      }

      const matches = initialLogs.filter(line => line.toLowerCase().includes(keyword.toLowerCase()));
      if (matches.length > 0) {
        appendOutput(matches.map(l => highlightMatches(l, keyword)).join('<br>'));
        addXP(10, `Grep Log untuk "${keyword}"`);
      } else {
        appendOutput(`[grep] Tidak ada baris yang cocok dengan "${escapeHtml(keyword)}" pada ${escapeHtml(file || 'auth.log')}`);
      }
    } else {
      appendOutput(`bash: ${escapeHtml(main)}: Perintah tidak dikenali. Ketik <code>help</code> untuk panduan.`);
    }
  }

  function highlightMatches(text, kw) {
    const escaped = escapeHtml(text);
    const regex = new RegExp(`(${escapeRegex(kw)})`, 'gi');
    return escaped.replace(regex, '<span class="hl-match">$1</span>');
  }

  container.appendChild(header);
  container.appendChild(screen);
  container.appendChild(inputRow);

  return container;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
