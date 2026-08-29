// Small HTML-fragment helpers shared by the site build.
//
// This mirrors scripts/partials.mjs in the companion blog repo
// (https://github.com/piratheon/blog) on purpose: both sites are built
// from the same shape (head + header + page content + footer) so the
// header/footer stay in visual and structural sync across properties.
// The portfolio has exactly one page, so `header()`/`footer()` here don't
// need the `prefix`-based path math the blog uses for nested post pages.

export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function head({ title, description, config }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" href="${config.icon}" type="image/svg+xml">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="theme-color" content="#0a0e0c" />
  <title>${escapeHtml(title)}</title>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/style.css" />
</head>
<body>
  <a href="#main" class="sr-only">Skip to main content</a>
`;
}

/**
 * Unified primary navigation shared with the blog: Portfolio / Field Notes / GitHub.
 * `config.nav` supplies any trailing links (currently just GitHub) so both
 * site.config.json files stay the single source of truth for external links.
 */
export function header({ config, activePath }) {
  const navItems = [
    { label: config.shortTitle || 'Portfolio', href: 'index.html' },
    { label: 'Field Notes', href: config.blogUrl },
    ...config.nav,
  ];
  const links = navItems
    .map((item) => {
      const isActive = activePath && item.href === activePath;
      return `<li><a href="${item.href}"${isActive ? ' class="is-active" aria-current="page"' : ''}>${escapeHtml(item.label)}</a></li>`;
    })
    .join('\n      ');

  return `  <header>
    <div class="container header-inner">
      <a href="#hero" class="wordmark" aria-label="${escapeHtml(config.author)} — home">
        <img src="${config.icon}" alt="" width="20" height="20" />
        <span>${escapeHtml(config.brand)}</span>
      </a>

      <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="nav-menu">
        <span></span><span></span><span></span>
      </button>

      <nav>
        <ul id="nav-menu">
      ${links}
        </ul>
      </nav>
    </div>
  </header>
`;
}

export function footer({ config }) {
  return `  <footer>
    <div class="container">
      <p class="footer-echo">Piratheon</p>
      <div class="footer-bottom">
        <ul class="footer-social">
          <li><a href="https://github.com/piratheon" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>GitHub</a></li>
          <li><a href="mailto:chafiq.dev@gmail.com"><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>Email</a></li>
          <li><a href="https://t.me/piratheon" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M11.944 17.97L4.58 13.62 19.54 3.5l-1.36 13.03H4.58z"/></svg>Telegram</a></li>
          <li><a href="https://facebook.com/piratheon" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.852V15.466h-2.916v-3.092h2.916V9.81c0-2.888 1.733-4.474 4.383-4.474 1.27 0 2.368.094 2.682.137v3.118h-1.83c-1.43 0-1.704.68-1.704 1.676v2.176h3.407l-.447 3.092h-2.96v6.464C19.612 23.027 24 18.062 24 12.073z"/></svg>Facebook</a></li>
          <li><a href="https://instagram.com/piratheon" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.265.058 2.128.26 2.89.558.763.298 1.407.694 2.05 1.337.643.643 1.039 1.287 1.337 2.05.298.762.5 1.625.558 2.89.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.058 1.265-.26 2.128-.558 2.89-.298.763-.694 1.407-1.337 2.05-.643.643-1.287 1.039-2.05 1.337-.762.298-1.625.5-2.89.558-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.265-.058-2.128-.26-2.89-.558-.763-.298-1.407-.694-2.05-1.337-.643-.643-1.039-1.287-1.337-2.05-.298-.762-.5-1.625-.558-2.89-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.058-1.265.26-2.128.558-2.89.298-.763.694-1.407 1.337-2.05.643-.643 1.287-1.039 2.05-1.337.762-.298 1.625-.5 2.89-.558 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.28.058-2.149.26-2.91.558-.76.298-1.404.694-2.047 1.337-.643.643-1.039 1.287-1.337 2.047-.298.761-.5 1.63-.558 2.91-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.058 1.28.26 2.149.558 2.91.298.76.694 1.404 1.337 2.047.643.643 1.287 1.039 2.047 1.337.761.298 1.63.5 2.91.558 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.28-.058 2.149-.26 2.91-.558.76-.298 1.404-.694 2.047-1.337.643-.643 1.039-1.287 1.337-2.047.298-.761.5-1.63.558-2.91.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.28-.26-2.149-.558-2.91-.298-.76-.694-1.404-1.337-2.047-.643-.643-1.287-1.039-2.047-1.337-.761-.298-1.63-.5-2.91-.558-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>Instagram</a></li>
          <li><a href="https://reddit.com/user/piratheon" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 1024 1024"><path d="M584 548a36 36 0 1 0 72 0 36 36 0 1 0-72 0zm144-108a35.9 35.9 0 0 0-32.5 20.6c18.8 14.3 34.4 30.7 45.9 48.8A35.98 35.98 0 0 0 728 440zM512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm245 477.9c4.6 13.5 7 27.6 7 42.1 0 99.4-112.8 180-252 180s-252-80.6-252-180c0-14.5 2.4-28.6 7-42.1A72.01 72.01 0 0 1 296 404c27.1 0 50.6 14.9 62.9 37 36.2-19.8 80.2-32.8 128.1-36.1l58.4-131.1c4.3-9.8 15.2-14.8 25.5-11.8l91.6 26.5a54.03 54.03 0 0 1 101.6 25.6c0 29.8-24.2 54-54 54-23.5 0-43.5-15.1-50.9-36.1L577 308.3l-43 96.5c49.1 3 94.2 16.1 131.2 36.3 12.3-22.1 35.8-37 62.9-37 39.8 0 72 32.2 72 72-.1 29.3-17.8 54.6-43.1 65.8zm-171.3 83c-14.9 11.7-44.3 24.3-73.7 24.3s-58.9-12.6-73.7-24.3c-9.3-7.3-22.7-5.7-30 3.6-7.3 9.3-5.7 22.7 3.6 30 25.7 20.4 65 33.5 100.1 33.5 35.1 0 74.4-13.1 100.2-33.5 9.3-7.3 10.9-20.8 3.6-30a21.46 21.46 0 0 0-30.1-3.6zM296 440a35.98 35.98 0 0 0-13.4 69.4c11.5-18.1 27.1-34.5 45.9-48.8A35.9 35.9 0 0 0 296 440zm72 108a36 36 0 1 0 72 0 36 36 0 1 0-72 0z"/></svg>Reddit</a></li>
          <li><a href="https://aur.archlinux.org/account/piratheon" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 32 32"><path d="M15.188 0.807c-1.354 3.313-2.167 5.484-3.672 8.703 0.922 0.979 2.057 2.12 3.896 3.406-1.979-0.818-3.328-1.635-4.339-2.484-1.927 4.026-4.948 9.75-11.073 20.76 4.818-2.781 8.547-4.495 12.026-5.151-0.146-0.641-0.234-1.333-0.229-2.063l0.005-0.151c0.078-3.089 1.682-5.458 3.583-5.297s3.38 2.792 3.307 5.88c-0.016 0.578-0.083 1.135-0.198 1.656 3.443 0.672 7.135 2.38 11.885 5.125-0.938-1.724-1.771-3.281-2.573-4.76-1.255-0.974-2.568-2.245-5.24-3.62 1.839 0.479 3.151 1.031 4.177 1.646-8.12-15.109-8.771-17.12-11.557-23.651zM30.531 28.479v-0.828h-0.313v-0.115h0.75v0.115h-0.313v0.828h-0.125zM31.099 28.479v-0.943h0.188l0.224 0.667c0.021 0.063 0.036 0.109 0.042 0.141 0.010-0.031 0.031-0.083 0.052-0.151l0.224-0.656h0.172v0.943h-0.12v-0.792l-0.276 0.792h-0.115l-0.271-0.802v0.802h-0.12z"/></svg>AUR</a></li>
        </ul>
        <p class="copyright">&copy; <span id="year"></span> ${escapeHtml(config.author)}.</p>
      </div>
    </div>
  </footer>
`;
}
