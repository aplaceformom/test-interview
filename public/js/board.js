/**
 * Availability board — client behaviour.
 *
 * No React runs in the browser. This file finds the server-rendered markup
 * and wires up filtering plus the live refresh.
 */
(function () {
  'use strict';

  var POLL_MS = 8000;
  var CLOCK_MS = 20000;

  function relativeFromNow(value) {
    var then = new Date(value).getTime();
    var minutes = Math.round((Date.now() - then) / 60000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return minutes + ' minutes ago';

    var hours = Math.round(minutes / 60);
    if (hours < 24) return hours + ' hours ago';

    var days = Math.round(hours / 24);
    if (days < 365) return days + ' days ago';

    return Math.round(days / 365) + ' years ago';
  }

  function rate(cents) {
    return '$' + Math.round(cents / 100).toLocaleString('en-US') + '/mo';
  }

  function availability(units) {
    if (units === 0) return 'Waitlist only';
    if (units === 1) return '1 unit available';
    return units + ' units available';
  }

  function cardHtml(community) {
    var updated = relativeFromNow(community.updatedAt);
    var availClass = community.availableUnits === 0
      ? 'card__avail card__avail--none'
      : 'card__avail';

    return '<li class="card" data-community-id="' + community.id + '">'
      + '<div class="card__head">'
      + '<h2 class="card__name">' + community.name + '</h2>'
      + '<span class="card__rate">' + rate(community.monthlyRateCents) + '</span>'
      + '</div>'
      + '<p class="card__meta">' + community.city + ', ' + community.state
      + ' &middot; ' + community.careType + '</p>'
      + '<p class="' + availClass + '">' + availability(community.availableUnits) + '</p>'
      + '<p class="card__updated">Updated '
      + '<time class="js-updated" data-updated="' + updated + '">' + updated + '</time>'
      + '</p>'
      + '</li>';
  }

  function render(root, communities) {
    var list = root.querySelector('.js-list');
    var count = root.querySelector('.js-count');

    list.innerHTML = communities.map(cardHtml).join('');
    count.textContent = communities.length + ' communities';
  }

  /** Keeps the "Updated ..." labels honest as the page sits open. */
  function tick(root) {
    var stamps = root.querySelectorAll('.js-updated');
    for (var i = 0; i < stamps.length; i++) {
      stamps[i].textContent = relativeFromNow(stamps[i].getAttribute('data-updated'));
    }
  }

  /** Rates and unit counts move during the day; names and cities do not. */
  function patchRates(root, communities) {
    communities.forEach(function (community) {
      var card = root.querySelector('[data-community-id="' + community.id + '"]');
      if (!card) return;

      card.querySelector('.card__rate').textContent = rate(community.monthlyRateCents);
      card.querySelector('.card__avail').textContent = availability(community.availableUnits);
    });
  }

  function initBoard(root) {
    var input = root.querySelector('.js-filter');

    input.addEventListener('input', function (event) {
      var term = event.target.value.trim();

      fetch('/api/communities?q=' + encodeURIComponent(term))
        .then(function (res) { return res.json(); })
        .then(function (communities) {
          render(root, communities);
        });
    });

    // Inventory moves fast — keep rates and availability fresh.
    setInterval(function () {
      fetch('/api/communities')
        .then(function (res) { return res.json(); })
        .then(function (communities) {
          patchRates(root, communities);
        });
    }, POLL_MS);

    setInterval(function () {
      tick(root);
    }, CLOCK_MS);
  }

  window.registerModule('board', { init: initBoard });

  // TODO: drop this once every page has moved to the module registry.
  document.addEventListener('DOMContentLoaded', function () {
    var root = document.querySelector('[data-module="board"]');
    if (root) {
      initBoard(root);
    }
  });
})();
