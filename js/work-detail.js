// Work detail — one reusable template driven by content/work.json.
// The slug comes from the URL path (/work/<slug>, rewritten by Netlify to
// this file — see netlify.toml) with a ?slug= fallback for local testing.

(function () {
  var target = document.getElementById('detail-target');

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Minimal, dependency-free markdown: paragraphs + **bold** + *italic*.
  function renderBody(md) {
    if (!md) return '';
    var escaped = escapeHtml(md);
    var withInline = escaped
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
    return withInline
      .split(/\n\s*\n/)
      .map(function (p) { return '<p class="body">' + p.trim().replace(/\n/g, '<br>') + '</p>'; })
      .join('');
  }

  function getSlug() {
    var params = new URLSearchParams(location.search);
    if (params.get('slug')) return params.get('slug');
    var parts = location.pathname.split('/').filter(Boolean);
    var i = parts.indexOf('work');
    if (i !== -1 && parts[i + 1]) return decodeURIComponent(parts[i + 1]);
    return null;
  }

  function embedForVideo(url) {
    if (/youtube\.com|youtu\.be/.test(url)) {
      var id = (url.match(/(?:v=|youtu\.be\/)([\w-]+)/) || [])[1];
      return id
        ? '<iframe src="https://www.youtube.com/embed/' + id + '" title="Project video" allowfullscreen loading="lazy"></iframe>'
        : '<video src="' + escapeHtml(url) + '" controls></video>';
    }
    if (/vimeo\.com/.test(url)) {
      var vid = (url.match(/vimeo\.com\/(\d+)/) || [])[1];
      return vid
        ? '<iframe src="https://player.vimeo.com/video/' + vid + '" title="Project video" allowfullscreen loading="lazy"></iframe>'
        : '<video src="' + escapeHtml(url) + '" controls></video>';
    }
    return '<video src="' + escapeHtml(url) + '" controls></video>';
  }

  function renderNotFound() {
    target.innerHTML =
      '<div class="wrap">' +
      '<div class="empty-state">' +
      '<p class="lede">We couldn\'t find that project.</p>' +
      '<a class="text-link" href="work.html">Back to work</a>' +
      '</div></div>';
  }

  function renderEntry(entry) {
    document.getElementById('doc-title').textContent = entry.title + ' — Abstract Motions';
    var descMeta = document.getElementById('meta-desc');
    if (descMeta) descMeta.setAttribute('content', entry.description || 'Selected work from Abstract Motions.');

    var coverHtml = '';
    if (entry.coverVideo) {
      coverHtml = '<div class="detail-cover">' + embedForVideo(entry.coverVideo) + '</div>';
    } else if (entry.cover) {
      coverHtml = '<div class="detail-cover"><img src="' + escapeHtml(entry.cover) + '" alt="' + escapeHtml(entry.title) + '"></div>';
    }

    var tagsHtml =
      '<div class="detail-tags">' +
      '<span>' + escapeHtml(entry.category || '') + '</span>' +
      (entry.year ? '<span>' + escapeHtml(entry.year) + '</span>' : '') +
      (entry.isSpecWork ? '<span class="spec-tag">Spec project</span>' : '') +
      '</div>';

    var creditsHtml = entry.credits
      ? '<dl class="detail-credits"><dt>Credits / role</dt><dd>' + escapeHtml(entry.credits) + '</dd></dl>'
      : '';

    target.innerHTML =
      '<div class="wrap">' +
      '<div class="detail-head">' + tagsHtml +
      '<h1 class="heading" style="font-size:clamp(2rem,4.5vw,3.5rem);">' + escapeHtml(entry.title) + '</h1>' +
      '</div>' +
      coverHtml +
      '<div class="detail-body">' +
      '<div>' +
      '<p class="body">' + escapeHtml(entry.description) + '</p>' +
      renderBody(entry.body) +
      '</div>' +
      creditsHtml +
      '</div>' +
      '</div>';
  }

  var slug = getSlug();
  if (!slug) { renderNotFound(); return; }

  fetch('content/work.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var entries = (data && data.entries) || [];
      var entry = entries.find(function (e) { return e.slug === slug; });
      if (!entry) { renderNotFound(); return; }
      renderEntry(entry);
    })
    .catch(renderNotFound);
})();
