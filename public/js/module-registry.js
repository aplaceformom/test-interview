/**
 * Tiny module registry.
 *
 * Server-rendered markup marks its root with data-module="<name>". A client
 * module registers itself here and gets init(root) once the DOM is ready.
 */
(function () {
  'use strict';

  var registry = {};

  function boot(name) {
    var mod = registry[name];
    var root = document.querySelector('[data-module="' + name + '"]');
    if (mod && root) {
      mod.init(root);
    }
  }

  window.registerModule = function registerModule(name, mod) {
    registry[name] = mod;
  };

  document.addEventListener('DOMContentLoaded', function () {
    Object.keys(registry).forEach(boot);
  });
})();
