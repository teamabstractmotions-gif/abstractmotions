(function () {
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (!form) return;

  function encode(data) {
    return Object.keys(data)
      .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]); })
      .join('&');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var hp = form.querySelector('[name="bot-field"]');
    if (hp && hp.value) return;

    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = value; });

    status.textContent = 'Sending…';
    status.removeAttribute('data-state');

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode(data),
    })
      .then(function (res) {
        if (res.ok) {
          status.textContent = 'Thanks — your message is in. We\\'ll reply within two business days.';
          status.setAttribute('data-state', 'ok');
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      })
      .catch(function () {
        status.textContent = 'Something went wrong sending that. You can also email teamabstractmotions@gmail.com directly.';
        status.setAttribute('data-state', 'err');
      });
  });
})();