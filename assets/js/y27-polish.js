/* Year 2027 report polish (loads after the main bundles).
   One numeral system inside the report and its popup: Western digits (2027),
   plus a space between an Arabic letter and a digit that follows it directly. */
(function () {
  'use strict';
  var IND = { '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9' };
  var SKIP = /^(SCRIPT|STYLE|TEXTAREA|INPUT|SELECT|OPTION|CODE)$/;

  function fixText(root) {
    if (!root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        return p && !SKIP.test(p.nodeName) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (t) {
      var v = t.nodeValue;
      if (!v) return;
      var s = v.replace(/[٠-٩]/g, function (d) { return IND[d]; })
               .replace(/([ء-ي])(\d)/g, '$1 $2');
      if (s !== v) t.nodeValue = s;
    });
  }

  function run() {
    fixText(document.getElementById('year2027'));
    document.querySelectorAll('.y27-modal-content').forEach(fixText);
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    (window.requestAnimationFrame || setTimeout)(function () { queued = false; run(); });
  }

  function start() {
    run();
    try { new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
