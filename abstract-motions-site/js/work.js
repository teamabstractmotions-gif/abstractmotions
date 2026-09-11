// Work index — renders CMS-driven entries from content/work.json.
// Zero entries is a real, expected launch state: show a deliberate,
// honest empty state rather than fabricating placeholder projects.

(function () {
  var target = document.getElementById('work-target');
  var toolbar = document.getElementById('work-toolbar');
  var filterWrap = document.getElementById('work-filters');
  var CATEGORIES = ['Film', 'Post', 'Motion', 'VFX', 'Digital'];
  var FILTER_THRESHOLD = 8;

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function slugUrl(slug) {
    return 'work/' + encodeURIComponent(slug);
  }

  function renderEmptyState() {
    target.innerHTML =
      '<div class="empty-state">' +
      '<p class="lede">Selected work is in progress — check back soon, or see our process above.</p>' +
      '<a class="text-link" href="index.html#capabilities">See our capabilities and process</a>' +
      '</div>';
  }

  function cardTemplate(entry) {
    var coverHtml = entry.cover
      ? '<img src="' + escapeHtml(entry.cover) + '" alt="" loading="lazy">'
      : '<span class="ph">Cover pending</span>';

    return (
      '<a class="work-card" href="' + slugUrl(entry.slug) + '">' +
      '<div class="work-card__cover">' + coverHtml + '</div>' +
      '<div class="work-card__meta">' +
      '<span class="work-card__title">' + escapeHtml(entry.title) + '</span>' +
      '<span class="work-card__tag mono">' + escapeHtml(entry.category || '') + '</span>' +
      '</div>' +
      '</a>'
    );
  }

  function renderGrid(entries) {
    var grid = document.createElement('div');
    grid.className = 'work-grid';
    grid.innerHTML = entries.map(cardTemplate).join('');
    target.innerHTML = '';
    target.appendChild(grid);
  }

  function applyFilter(all, category) {
    var filtered = category ? all.filter(function (e) { return e.category === category; }) : all;
    renderGrid(filtered);
  }

  function setupFilters(all) {
    if (all.length < FILTER_THRESHOLD) return; // skip filter UI entirely per brief
    var present = CATEGORIES.filter(function (c) {
      return all.some(function (e) { return e.category === c; });
    });
    if (present.length < 2) return;

    toolbar.hidden = false;
    var allBtn = document.createElement('button');
    allBtn.textContent = 'All';
    allBtn.className = 'is-active';
    allBtn.addEventListener('click', function () { select(allBtn, null); });
    filterWrap.appendChild(allBtn);

    present.forEach(function (cat) {
      var btn = document.createElement('button');
      btn.textContent = cat;
      btn.addEventListener('click', function () { select(btn, cat); });
      filterWrap.appendChild(btn);
    });

    function select(activeBtn, category) {
      filterWrap.querySelectorAll('button').forEach(function (b) { b.classList.remove('is-active'); });
      activeBtn.classList.add('is-active');
      applyFilter(all, category);
    }
  }

  fetch('content/work.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var entries = (data && data.entries) || [];
      entries = entries.slice().sort(function (a, b) {
        return new Date(b.date || 0) - new Date(a.date || 0);
      });

      if (!entries.length) {
        renderEmptyState();
        return;
      }

      renderGrid(entries);
      setupFilters(entries);
    })
    .catch(function () {
      renderEmptyState();
    });
})();
