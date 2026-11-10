/* كتلة "اشرح + استثمر في ذاتك" أسفل صفحات الأدوات. عرض فقط. */
(function () {
  function ic(p) { return '<svg class="pill-i" viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>'; }
  var CFG = {
    lifepath: {
      t1: 'ما هو مسار الحياة؟', t2: 'كيف تقرأ مسارك',
      def: ['مسار الحياة رقم يُستخرج من يوم ميلادك وشهره وسنته، فيكشف الاتجاه الأكبر لرحلتك والدرس الذي جئت لتتقنه. هو أشبه ببوصلة داخلية تفسّر لماذا تميل إلى أمور وتنفر من أخرى.', 'وليس الرقم قدرًا مغلقًا، بل خريطة طريق تساعدك على قراءة مراحلك واختيار خطواتك بوعي.'],
      read: [['رقمك الحاكم', 'الرقم الذي يصف هويتك العميقة وبصمتك التي وُلدت بها.'], ['دروس وتحديات', 'المواطن التي تتكرر فيها العقبات، وما تريد أن تعلّمك إياه.'], ['دورات العمر الكبرى', 'المراحل التي تمر بها رحلتك ونقاط الانتقال بين كل مرحلة وأخرى.'], ['طريق ازدهارك', 'البيئة والعمل الأنسب لتزدهر فيها طاقتك.']],
      gold: [['افهم دورات عمرك الكبرى', 'اعرف متى تبدأ مرحلتك التالية وكيف تستعد لها', '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', '#featured-content/pinnacles-cycles'], ['اكتشف بيئة ازدهارك وعملك', 'اعرف الطريق الأنسب لطاقتك ومواهبك', '<path d="M12 21V11"/><path d="M12 11c0-4 3-6 7-6 0 4-3 6-7 6zM12 14c0-3-2.500-5-6-5 0 3 2.500 5 6 5z"/>', '#featured-content']]
    },
    chart: {
      anchor: '.seo-authority-block',
      def: ['الخريطة الفلكية صورة للسماء لحظة ولادتك: أين كانت الشمس والقمر والكواكب، وفي أي برج وأي بيت. من هذه الصورة تُقرأ طباعك، وطريقتك في الحب والعمل، وما يحرّكك من الداخل.', 'هي ليست حكمًا على حياتك، بل لغة تساعدك على فهم نفسك بوضوح أكبر، ثم اختيار خطوتك التالية بثقة.'],
      read: [['الكواكب', 'كل كوكب يمثل جانبًا فيك: العقل والعاطفة والرغبة والحدود. موقعه في البرج يحدد أسلوب تعبيره.'], ['البيوت الاثنا عشر', 'مجالات حياتك: الذات والمال والعلاقات والعمل. البيت الذي يسكنه الكوكب يخبرك أين يظهر أثره.'], ['الجوانب', 'الزوايا بين الكواكب تكشف التفاهم أو التوتر بين أجزاء شخصيتك، ومن أين تأتي قوتك ومن أين تأتي حيرتك.'], ['العناصر والطبائع', 'توزيع النار والأرض والهواء والماء يوضح مزاجك العام وما تحتاجه لتتوازن.']],
      gold: [['افهم علاقاتك وحبك من خريطتك', 'اعرف لماذا تنجذب لأشخاص بعينهم وكيف تحب', '<circle cx="12" cy="12" r="9"/><path d="M12 17s-5-3.200-5-6.600A2.800 2.800 0 0 1 12 9a2.800 2.800 0 0 1 5 1.400C17 13.800 12 17 12 17z"/>', '#featured-content/how-to-start-natal-chart'], ['اكتشف موهبتك ومسارك من خريطتك', 'اعرف ما خُلقت لتتقنه وأين تجد رزقك', '<circle cx="12" cy="12" r="9"/><path d="M12 6.500l1.600 3.400 3.700.5-2.700 2.600.7 3.700L12 14.900 8.700 16.700l.7-3.700L6.700 10.400l3.700-.5z"/>', '#featured-content/how-to-start-natal-chart']]
    }
  };
  function build(id, c) {
    var sec = document.getElementById(id); if (!sec || sec.querySelector('.aq-mx-about')) return;
    var ab = document.createElement('div'); ab.className = 'aq-mx-about';
    ab.innerHTML = '<section class="aq-mx-def"><h3><span></span>' + (c.t1||'ما هي الخريطة الفلكية؟') + '<span></span></h3>' + c.def.map(function (t) { return '<p>' + t + '</p>'; }).join('') + '</section>'
      + '<section class="aq-mx-read"><h3><span></span>' + (c.t2||'كيف تقرأ خريطتك') + '<span></span></h3><ol class="aq-mx-num">' + c.read.map(function (r, i) { return '<li><b>' + '١٢٣٤٥٦'.charAt(i) + '</b><div><strong>' + r[0] + '</strong><p>' + r[1] + '</p></div></li>'; }).join('') + '</ol></section>'
      + '<section class="aq-mx-gold"><h3><span></span>استثمر في ذاتك<span></span></h3>' + c.gold.map(function (g) { return '<a class="aq-gold" href="' + g[3] + '"><span class="aq-gold-i">' + ic(g[2]) + '</span><span class="aq-gold-t"><b>' + g[0] + '</b><small>' + g[1] + '</small></span></a>'; }).join('') + '</section>';
    var an = c.anchor && sec.querySelector(c.anchor);
    if (an) an.parentNode.insertBefore(ab, an); else sec.appendChild(ab);
  }
  function init() { Object.keys(CFG).forEach(function (k) { build(k, CFG[k]); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
