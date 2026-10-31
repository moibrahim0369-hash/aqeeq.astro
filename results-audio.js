/* Aqeq Astro — optional reading ambience
   Presentation-only interaction layer. No calculation or result data is touched. */
(() => {
  "use strict";

  const STORAGE_KEY = "aqeq-reading-sound";
  let audioContext = null;
  let enabled = localStorage.getItem(STORAGE_KEY) !== "off";

  const resultSelectors = [
    ".result:not([hidden])",
    ".syn-result:not([hidden])",
    "#cp-out:not([hidden])",
    "#eam-result:not([hidden])"
  ];

  function visibleResults() {
    return resultSelectors
      .flatMap((selector) => [...document.querySelectorAll(selector)])
      .filter((element, index, all) => all.indexOf(element) === index);
  }

  function ensureAudio() {
    if (!enabled) return null;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    if (!audioContext) audioContext = new AudioCtor();
    if (audioContext.state === "suspended") audioContext.resume();
    return audioContext;
  }

  function chime(kind = "chapter") {
    const ctx = ensureAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    const frequencies = kind === "detail" ? [392, 523.25] : [261.63, 392];
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequencies[0], now);
    oscillator.frequency.exponentialRampToValueAtTime(frequencies[1], now + 0.24);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1350, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.022, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.56);
  }

  function addToggle(root) {
    if (root.querySelector("[data-aq-sound-toggle]")) return;
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "aq-reading-sound-toggle";
    toggle.dataset.aqSoundToggle = "true";
    toggle.setAttribute("aria-pressed", String(enabled));
    toggle.title = "تشغيل أو كتم الصوت الهادئ";
    toggle.textContent = enabled ? "صوت هادئ" : "الصوت مكتوم";
    toggle.addEventListener("click", () => {
      enabled = !enabled;
      localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
      toggle.setAttribute("aria-pressed", String(enabled));
      toggle.textContent = enabled ? "صوت هادئ" : "الصوت مكتوم";
      if (enabled) chime("detail");
    });
    const topBar = root.querySelector(".result-top-bar, .cp-result-head, .eam-result-head");
    if (topBar) topBar.append(toggle);
    else root.prepend(toggle);
  }

  function decorateResults() {
    visibleResults().forEach(addToggle);
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[role=tab], .aqm-tabs button, .cp-accordion > summary, .aqm-details > summary, .aqm-chakra-toggle");
    if (!target || !visibleResults().some((root) => root.contains(target))) return;
    decorateResults();
    chime(target.matches("summary, .aqm-chakra-toggle") ? "detail" : "chapter");
  }, { passive: true });

  const observer = new MutationObserver(decorateResults);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] });
  decorateResults();
})();
