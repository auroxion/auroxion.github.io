    'use strict';
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    // ===== YEAR =====
    $('#year').textContent = new Date().getFullYear();

    // ===== HEADER SCROLL STATE =====
    const header = $('header');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ===== MOBILE NAV =====
    const navToggle = $('.nav-toggle');
    const navMenu = $('#nav-menu');
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    $$('#nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // ===== MOTION =====
    // The hero entrance is handled purely in CSS (one deliberate moment).
    // Everything else on the page is static on load — no scattered scroll-triggered
    // fade-ins, which is both calmer and avoids any risk of content getting stuck
    // hidden if a user navigates by anchor link rather than by scrolling.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== ARIA — TELEGRAM CHAT DEMO =====
    const tgMsgsEl   = $('#tg-msgs');
    const tgStatusEl = $('#tg-status-txt');

    // Script: each entry is one event in the animated chat replay.
    // kind: 'date' | 'out' | 'in' | 'in-code'
    const TG_SCRIPT = [
      { kind: 'date', text: 'June 20' },
      { kind: 'out',  text: '/status', time: '22:47' },
      { kind: 'in-code', title: 'Status \u2014 Aria',
        code: 'Telegram ID:  0123456789\nDB keys:      4 (3 active)\nEnv keys:     2\nModel:        gemini-2.0-flash\nWatchers:     0 active',
        time: '22:47' },
      { kind: 'date', text: 'June 22' },
      { kind: 'out',  text: '/autowatch "guard my server"', time: '14:23' },
      { kind: 'in',   text: 'Created 4 watchers:\nsystem \u00b7 process \u00b7 url \u00b7 log\n\nMonitoring active \u2014 alerts trigger on anomalies.', time: '14:23' },
      { kind: 'out',  text: 'analyze nginx errors from last 24h', time: '14:25' },
      { kind: 'in',   text: 'Pattern analysis complete.\nTop issue: upstream timeout (67%)\n\nReport delivered to this chat.', time: '14:26' },
    ];

    // Double-check SVG (read receipt) for outgoing bubbles
    const TICK_SVG = `<svg viewBox="0 0 18 9" aria-hidden="true"><polyline points="1,4 5,8 11,1" fill="none"/><polyline points="8,4 12,8 17,1" fill="none"/></svg>`;

    function tgDateSep(text) {
      const d = document.createElement('div');
      d.className = 'tg-datesep';
      d.innerHTML = `<span>${text}</span>`;
      return d;
    }

    function tgBubble(entry) {
      const row = document.createElement('div');
      row.className = `tg-row ${entry.kind === 'out' ? 'out' : 'in'}`;

      // Avatar (incoming only)
      if (entry.kind !== 'out') {
        const av = document.createElement('div');
        av.className = 'tg-row-av';
        av.textContent = 'A';
        row.appendChild(av);
      }

      const bub = document.createElement('div');
      bub.className = 'tg-bub';

      if (entry.kind === 'in-code') {
        // Bold title line + monospace block
        const title = document.createElement('strong');
        title.style.cssText = 'display:block;font-size:13.5px;margin-bottom:2px;';
        title.textContent = entry.title;
        bub.appendChild(title);
        const code = document.createElement('div');
        code.className = 'tg-code';
        code.textContent = entry.code;
        bub.appendChild(code);
      } else {
        const span = document.createElement('span');
        span.style.whiteSpace = 'pre-line';
        span.textContent = entry.text;
        bub.appendChild(span);
      }

      // Meta: time + tick
      const meta = document.createElement('div');
      meta.className = 'tg-meta';
      meta.innerHTML = entry.time;
      if (entry.kind === 'out') {
        const tick = document.createElement('span');
        tick.className = 'tg-tick';
        tick.innerHTML = TICK_SVG;
        meta.appendChild(tick);
      }
      bub.appendChild(meta);

      row.appendChild(bub);
      return row;
    }

    function tgTypingRow() {
      const row = document.createElement('div');
      row.className = 'tg-typing-row';
      row.id = 'tg-typing';
      row.innerHTML = `
        <div class="tg-row-av">A</div>
        <div class="tg-typing-bub">
          <div class="tg-dot"></div>
          <div class="tg-dot"></div>
          <div class="tg-dot"></div>
        </div>`;
      return row;
    }

    function tgScroll() {
      if (tgMsgsEl) tgMsgsEl.scrollTop = tgMsgsEl.scrollHeight;
    }

    function runTgDemo() {
      if (!tgMsgsEl) return;
      tgMsgsEl.innerHTML = '';
      if (tgStatusEl) { tgStatusEl.textContent = 'bot'; tgStatusEl.classList.remove('typing'); }

      let i = 0;
      const delays = { out: 750, in: 850, 'in-code': 1100, date: 300 };

      const step = () => {
        if (i >= TG_SCRIPT.length) {
          setTimeout(runTgDemo, 5000);
          return;
        }
        const entry = TG_SCRIPT[i];

        if (entry.kind === 'date') {
          tgMsgsEl.appendChild(tgDateSep(entry.text));
          tgScroll();
          i++;
          setTimeout(step, delays.date);
          return;
        }

        if (entry.kind === 'out') {
          tgMsgsEl.appendChild(tgBubble(entry));
          tgScroll();
          i++;
          setTimeout(step, delays.out);
          return;
        }

        // Incoming message: show typing indicator + header status first
        if (tgStatusEl) { tgStatusEl.textContent = 'typing'; tgStatusEl.classList.add('typing'); }
        const typingEl = tgTypingRow();
        tgMsgsEl.appendChild(typingEl);
        tgScroll();

        const typingDuration = entry.kind === 'in-code' ? 1300 : 950;
        setTimeout(() => {
          typingEl.remove();
          if (tgStatusEl) { tgStatusEl.textContent = 'online'; tgStatusEl.classList.remove('typing'); }
          tgMsgsEl.appendChild(tgBubble(entry));
          tgScroll();
          i++;
          setTimeout(step, delays[entry.kind] || 850);
        }, typingDuration);
      };

      step();
    }

    if (tgMsgsEl) {
      if (reduceMotion) {
        // Static fallback: render all messages immediately
        TG_SCRIPT.forEach(entry => {
          if (entry.kind === 'date') tgMsgsEl.appendChild(tgDateSep(entry.text));
          else tgMsgsEl.appendChild(tgBubble(entry));
        });
        tgScroll();
      } else {
        const tgObserver = new IntersectionObserver((entries) => {
          entries.forEach(e => {
            if (e.isIntersecting) { runTgDemo(); tgObserver.unobserve(e.target); }
          });
        }, { threshold: 0.35 });
        tgObserver.observe($('.tg-mockup'));
      }
    }

    // ===== GITHUB LIVE STATS =====
    const GITHUB_USER = 'piratheon';
    const FALLBACK_STARS = { 'rika-agent': 42, 'ori': 18, 'aion-dl': 31, 'Harpocrates': 27, 'clpbrd': 15 };

    const ghCache = {
      get(key) {
        try {
          const raw = sessionStorage.getItem(`gh_${key}`);
          if (!raw) return null;
          const { value, expiry } = JSON.parse(raw);
          if (Date.now() > expiry) { sessionStorage.removeItem(`gh_${key}`); return null; }
          return value;
        } catch { return null; }
      },
      set(key, value, ttlMinutes = 60) {
        try {
          sessionStorage.setItem(`gh_${key}`, JSON.stringify({ value, expiry: Date.now() + ttlMinutes * 60000 }));
        } catch { /* sessionStorage unavailable — silently skip caching */ }
      }
    };

    async function fetchRepoStars(repo) {
      const cached = ghCache.get(repo);
      if (cached !== null) return cached;
      try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo}`, {
          headers: { Accept: 'application/vnd.github.v3+json' }
        });
        if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
        const data = await res.json();
        const stars = typeof data.stargazers_count === 'number' ? data.stargazers_count : (FALLBACK_STARS[repo] ?? 0);
        ghCache.set(repo, stars);
        return stars;
      } catch (err) {
        console.warn(`rika-portfolio: falling back to cached star count for ${repo}:`, err.message);
        return FALLBACK_STARS[repo] ?? 0;
      }
    }

    async function hydrateProjectStats() {
      const rows = $$('.project-row[data-repo]');
      for (const row of rows) {
        const repo = row.dataset.repo;
        const starsEl = row.querySelector('.project-stars');
        const countEl = row.querySelector('.count');
        if (!starsEl || !countEl) continue;
        const stars = await fetchRepoStars(repo);
        starsEl.classList.remove('is-loading');
        countEl.textContent = stars.toLocaleString();
      }
    }
    document.addEventListener('DOMContentLoaded', () => setTimeout(hydrateProjectStats, 300));

    // ===== COPY TON WALLET ADDRESS =====
    const copyBtn = $('#copy-ton');
    const tonAddressEl = $('#ton-address');
    copyBtn?.addEventListener('click', async () => {
      const address = tonAddressEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(address);
        copyBtn.classList.add('copied');
        copyBtn.querySelector('span').textContent = 'Copied';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.querySelector('span').textContent = 'Copy address';
        }, 2000);
      } catch (err) {
        console.error('rika-portfolio: clipboard write failed:', err);
        copyBtn.querySelector('span').textContent = 'Select & copy manually';
      }
    });
