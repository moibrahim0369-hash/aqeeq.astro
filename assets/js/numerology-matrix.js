/**
 * Aqeeq Astro — Destiny Matrix Engine & UI (Ivory & Champagne Gold Edition)
 * Natalia Ladini — 22 Major Arcana System
 *
 * Implements:
 * 1. 8-Pointed Star SVG Geometry (Calculated Responsive Geometry)
 * 2. 15-Section Luxury Accordion (Ivory & Champagne Gold Theme)
 * 3. Unified Content Architecture with Structured Slots
 * 4. Interactive Node Highlighting & Direct Navigation
 * 5. Full Backward Compatibility with Existing Tests & Contracts
 */

(() => {
  'use strict';

  const adapter = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
  if (!adapter) {
    console.warn('MatrixMethodAdapter not loaded yet; will defer initialization.');
  }

  // ==================== 1. التوليد الهندسي لرسم الـ SVG ====================

  /**
   * توليد رسم SVG النجمة الثمانية متناسق الإحداثيات (viewBox 0 0 800 800)
   */
  function generateMatrixSVG(P) {
    const { anchors, corners, channels, intermediate, ageMap } = P;
    const { A, B, C, D, E } = anchors;
    const { F, G, H, I } = corners;
    const { heartPoint, moneyPoint, balancePoint } = channels;

    // الإحداثيات الهندسية المعتمدة (المركز 400, 400)
    // المربع الشخصي (Personal Diamond):
    // Left (A / Day / 0 yo): (130, 400)
    // Top (B / Month / 20 yo): (400, 130)
    // Right (C / Year / 40 yo): (670, 400)
    // Bottom (D / Karmic Tail / 60 yo): (400, 670)
    const pos = {
      center: [400, 400],
      west: [130, 400],    // A
      north: [400, 130],   // B
      east: [670, 400],    // C
      south: [400, 670],   // D
      northWest: [210, 210], // F (Top-Left / Paternal)
      northEast: [590, 210], // G (Top-Right / Maternal)
      southEast: [590, 590], // H (Bottom-Right / Material Karma)
      southWest: [210, 590], // I (Bottom-Left / Spiritual Karma)
      // نقاط المحاور الداخلية
      A2: [265, 400],
      B2: [400, 265],
      C2: [535, 400],
      D2: [400, 535],
      D3: [400, 602],
      // نقاط قنوات الحب والمال
      heart: [445, 490],
      money: [490, 445],
      balance: [515, 515]
    };

    return `
      <svg class="aqm-svg" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="رسم مصفوفة القدر الهندسية">
        <defs>
          <filter id="aqm-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#C6A56B" flood-opacity="0.25"/>
          </filter>
        </defs>

        <!-- دوائر إرشادية خفيفة -->
        <circle cx="400" cy="400" r="340" class="aqm-svg-guide" />
        <circle cx="400" cy="400" r="270" class="aqm-svg-guide" />

        <!-- المربع الشخصي (Personal Straight Diamond: A -> B -> C -> D) -->
        <polygon points="${pos.west[0]},${pos.west[1]} ${pos.north[0]},${pos.north[1]} ${pos.east[0]},${pos.east[1]} ${pos.south[0]},${pos.south[1]}" class="aqm-svg-personal-square" />

        <!-- مربع الأسلاف المائل (Ancestral Diagonal Square: F -> G -> H -> I) -->
        <polygon points="${pos.northWest[0]},${pos.northWest[1]} ${pos.northEast[0]},${pos.northEast[1]} ${pos.southEast[0]},${pos.southEast[1]} ${pos.southWest[0]},${pos.southWest[1]}" class="aqm-svg-ancestral-square" />

        <!-- محاور السماء والأرض (Vertical & Horizontal Axes) -->
        <line x1="${pos.west[0]}" y1="${pos.west[1]}" x2="${pos.east[0]}" y2="${pos.east[1]}" class="aqm-svg-axis" />
        <line x1="${pos.north[0]}" y1="${pos.north[1]}" x2="${pos.south[0]}" y2="${pos.south[1]}" class="aqm-svg-axis" />

        <!-- أقطار الأسلاف (Paternal & Maternal Diagonals) -->
        <line x1="${pos.northWest[0]}" y1="${pos.northWest[1]}" x2="${pos.southEast[0]}" y2="${pos.southEast[1]}" class="aqm-svg-axis" />
        <line x1="${pos.northEast[0]}" y1="${pos.northEast[1]}" x2="${pos.southWest[0]}" y2="${pos.southWest[1]}" class="aqm-svg-axis" />

        <!-- خط الحب (Love Channel Line in Dusty Rose) -->
        <line x1="${pos.center[0]}" y1="${pos.center[1]}" x2="${pos.heart[0]}" y2="${pos.heart[1]}" class="aqm-svg-love-channel" />
        <line x1="${pos.heart[0]}" y1="${pos.heart[1]}" x2="${pos.balance[0]}" y2="${pos.balance[1]}" class="aqm-svg-love-channel" />

        <!-- خط المال (Money Channel Line in Champagne Gold) -->
        <line x1="${pos.center[0]}" y1="${pos.center[1]}" x2="${pos.money[0]}" y2="${pos.money[1]}" class="aqm-svg-money-channel" />
        <line x1="${pos.money[0]}" y1="${pos.money[1]}" x2="${pos.balance[0]}" y2="${pos.balance[1]}" class="aqm-svg-money-channel" />

        <!-- تسميات محطات الأعمار على المحيط (Perimeter Age Stations) -->
        <text x="75" y="405" class="aqm-svg-age-label">0 سنة</text>
        <text x="170" y="170" class="aqm-svg-age-label">10 سنين</text>
        <text x="400" y="75" class="aqm-svg-age-label">20 سنة</text>
        <text x="630" y="170" class="aqm-svg-age-label">30 سنة</text>
        <text x="725" y="405" class="aqm-svg-age-label">40 سنة</text>
        <text x="630" y="630" class="aqm-svg-age-label">50 سنة</text>
        <text x="400" y="725" class="aqm-svg-age-label">60 سنة</text>
        <text x="170" y="630" class="aqm-svg-age-label">70 سنة</text>

        <!-- العقد التفاعلية: زوايا المربع الشخصي -->
        <!-- A: الشخصية (0 سنة) -->
        <g class="aqm-node aqm-node-corner" data-section="personal" data-title="طاقة الشخصية والجوهر (اليوم)" data-arcana="${A}" transform="translate(${pos.west[0]}, ${pos.west[1]})">
          <circle cx="0" cy="0" r="26" class="aqm-node-bg" />
          <text x="0" y="0" class="aqm-node-text">${A}</text>
        </g>

        <!-- B: المواهب والروح (20 سنة) -->
        <g class="aqm-node aqm-node-corner" data-section="talents" data-title="طاقة الروح والمواهب (الشهر)" data-arcana="${B}" transform="translate(${pos.north[0]}, ${pos.north[1]})">
          <circle cx="0" cy="0" r="26" class="aqm-node-bg" />
          <text x="0" y="0" class="aqm-node-text">${B}</text>
        </g>

        <!-- C: المادة والصحة (40 سنة) -->
        <g class="aqm-node aqm-node-corner" data-section="money_line" data-title="طاقة المادة والصحة (السنة)" data-arcana="${C}" transform="translate(${pos.east[0]}, ${pos.east[1]})">
          <circle cx="0" cy="0" r="26" class="aqm-node-bg" />
          <text x="0" y="0" class="aqm-node-text">${C}</text>
        </g>

        <!-- D: الذيل الكارمي الأساسي (60 سنة) -->
        <g class="aqm-node aqm-node-corner" data-section="karmic_tail" data-title="الذيل الكارمي الأساسي (Past Karma)" data-arcana="${D}" transform="translate(${pos.south[0]}, ${pos.south[1]})">
          <circle cx="0" cy="0" r="26" class="aqm-node-bg" />
          <text x="0" y="0" class="aqm-node-text">${D}</text>
        </g>

        <!-- نقاط ثالوث الذيل الكارمي الوسيطة -->
        <g class="aqm-node aqm-node-corner" data-section="karmic_tail" data-title="الذيل الكارمي (نقطة وسطى D3)" data-arcana="${intermediate.D3}" transform="translate(${pos.D3[0]}, ${pos.D3[1]})">
          <circle cx="0" cy="0" r="19" class="aqm-node-bg" />
          <text x="0" y="0" class="aqm-node-text" style="font-size:14px">${intermediate.D3}</text>
        </g>
        <g class="aqm-node aqm-node-corner" data-section="karmic_tail" data-title="الذيل الكارمي (مدخل القلب D2)" data-arcana="${intermediate.D2}" transform="translate(${pos.D2[0]}, ${pos.D2[1]})">
          <circle cx="0" cy="0" r="19" class="aqm-node-bg" />
          <text x="0" y="0" class="aqm-node-text" style="font-size:14px">${intermediate.D2}</text>
        </g>

        <!-- زوايا الأسلاف (Ancestral Corners) -->
        <!-- F: سلالة الأب العليا (10 سنين) -->
        <g class="aqm-node aqm-node-ancestral" data-section="father_line" data-title="سلالة الأب العليا (مواهب الأب)" data-arcana="${F}" transform="translate(${pos.northWest[0]}, ${pos.northWest[1]})">
          <circle cx="0" cy="0" r="23" class="aqm-node-bg" />
          <text x="0" y="0" class="aqm-node-text">${F}</text>
        </g>

        <!-- G: سلالة الأم العليا (30 سنة) -->
        <g class="aqm-node aqm-node-ancestral" data-section="mother_line" data-title="سلالة الأم العليا (مواهب الأم)" data-arcana="${G}" transform="translate(${pos.northEast[0]}, ${pos.northEast[1]})">
          <circle cx="0" cy="0" r="23" class="aqm-node-bg" />
          <text x="0" y="0" class="aqm-node-text">${G}</text>
        </g>

        <!-- H: سلالة الأب السفلى (50 سنة) -->
        <g class="aqm-node aqm-node-ancestral" data-section="father_line" data-title="سلالة الأب السفلى (كارما المادة)" data-arcana="${H}" transform="translate(${pos.southEast[0]}, ${pos.southEast[1]})">
          <circle cx="0" cy="0" r="23" class="aqm-node-bg" />
          <text x="0" y="0" class="aqm-node-text">${H}</text>
        </g>

        <!-- I: سلالة الأم السفلى (70 سنة) -->
        <g class="aqm-node aqm-node-ancestral" data-section="mother_line" data-title="سلالة الأم السفلى (كارما المشاعر)" data-arcana="${I}" transform="translate(${pos.southWest[0]}, ${pos.southWest[1]})">
          <circle cx="0" cy="0" r="23" class="aqm-node-bg" />
          <text x="0" y="0" class="aqm-node-text">${I}</text>
        </g>

        <!-- قنوات الحب والمال التفاعلية -->
        <!-- نقطة القلب (Heart Point) -->
        <g class="aqm-node aqm-node-love" data-section="love_line" data-title="مدخل الحب والعلاقات (Heart Point)" data-arcana="${heartPoint}" transform="translate(${pos.heart[0]}, ${pos.heart[1]})">
          <circle cx="0" cy="0" r="21" class="aqm-node-bg" />
          <text x="0" y="0" class="aqm-node-text">${heartPoint}</text>
        </g>

        <!-- نقطة المال (Money Point) -->
        <g class="aqm-node aqm-node-money" data-section="money_line" data-title="مدخل المال والوفرة (Money Point)" data-arcana="${moneyPoint}" transform="translate(${pos.money[0]}, ${pos.money[1]})">
          <circle cx="0" cy="0" r="21" class="aqm-node-bg" />
          <text x="0" y="0" class="aqm-node-text">${moneyPoint}</text>
        </g>

        <!-- نقطة التوازن (Balance Point) -->
        <g class="aqm-node aqm-node-balance" data-section="love_line" data-title="نقطة التوازن بين الحب والمال (Balance)" data-arcana="${balancePoint}" transform="translate(${pos.balance[0]}, ${pos.balance[1]})">
          <circle cx="0" cy="0" r="20" class="aqm-node-bg" />
          <text x="0" y="0" class="aqm-node-text">${balancePoint}</text>
        </g>

        <!-- المركز الأكبر الفاخر (Center E: Soul Comfort) -->
        <g class="aqm-node aqm-node-center" data-section="center" data-title="مركز راحة الروح والجوهر الأساسي" data-arcana="${E}" transform="translate(${pos.center[0]}, ${pos.center[1]})">
          <circle cx="0" cy="0" r="38" class="aqm-node-bg" />
          <circle cx="0" cy="0" r="32" class="aqm-node-ring" />
          <text x="0" y="0" class="aqm-node-text">${E}</text>
        </g>
      </svg>
      <div id="aqm-tooltip" role="tooltip"></div>
    `;
  }

  // ==================== 2. بنية الأكورديون الـ 12 وحقن النصوص ====================

  /**
   * إنشاء كارت قسم الأكورديون وفق بنية المحتوى المعتمدة
   */
  function buildAccordionItem(item) {
    const { id, icon, title, subtitle, arcanaList, contentKey, slots } = item;
    const badgesHtml = arcanaList.map(a => `<span class="aqm-badge-arcana">${a.num} · ${a.name}</span>`).join(' ');

    return `
      <div class="aqm-acc-item" id="aqm-sec-${id}" data-section-id="${id}" data-content-key="${contentKey}">
        <button class="aqm-acc-header" type="button" aria-expanded="false" aria-controls="aqm-body-${id}">
          <div class="aqm-acc-header-left">
            <span class="aqm-acc-icon" aria-hidden="true">${icon}</span>
            <div class="aqm-acc-title-group">
              <h3 class="aqm-acc-title">${title}</h3>
              <p class="aqm-acc-subtitle">${subtitle}</p>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            ${badgesHtml}
            <span class="aqm-acc-chevron" aria-hidden="true">›</span>
          </div>
        </button>

        <div class="aqm-acc-body" id="aqm-body-${id}">
          <div class="aqm-content-grid">
            <!-- النص الأساسي -->
            <div class="aqm-slot aqm-slot-primary" data-slot="primary">
              <h4 class="aqm-slot-title">✦ النص الأساسي</h4>
              <p class="aqm-slot-p">${slots.primary}</p>
            </div>

            <!-- التفسير التفصيلي والعميق -->
            <div class="aqm-slot aqm-slot-detailed" data-slot="detailed">
              <h4 class="aqm-slot-title">📖 التفسير التفصيلي والعميق</h4>
              <p class="aqm-slot-p">${slots.detailed}</p>
            </div>

            <!-- نقاط القوة والتجلي الإيجابي -->
            <div class="aqm-slot aqm-slot-strengths" data-slot="strengths">
              <h4 class="aqm-slot-title">✨ نقاط القوة والتجلي الإيجابي (النور)</h4>
              <p class="aqm-slot-p">${slots.strengths}</p>
            </div>

            <!-- التحديات والجانب الظلي -->
            <div class="aqm-slot aqm-slot-challenges" data-slot="challenges">
              <h4 class="aqm-slot-title">⚠️ التحديات والجانب الظلي (الظل)</h4>
              <p class="aqm-slot-p">${slots.challenges}</p>
            </div>

            <!-- التطبيق العملي وخطوات التوازن -->
            <div class="aqm-slot aqm-slot-practical" data-slot="practical">
              <h4 class="aqm-slot-title">🌱 خطوات التوازن والتطبيق اليومي</h4>
              <p class="aqm-slot-p">${slots.practical}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * بناء الأقسام الـ 12 المعتمدة وفق مواصفات المستخدم
   */
  function build15Sections(P) {
    const getInfo = n => adapter.getArcanaInfo(n);
    const { anchors, corners, channels, generational, purposes, chakras, intermediate } = P;
    const { A, B, C, D, E } = anchors;
    const { F, G, H, I } = corners;
    const { heartPoint, moneyPoint, balancePoint } = channels;

    const sections = [
      // 1. الجوهر والمركز
      {
        id: 'center',
        icon: '👑',
        title: 'الجوهر والمركز — طاقة الروح ومنطقة الراحة',
        subtitle: 'الجوهر النفسي والمنطقة التي تشحن طاقتك عند العودة إليها',
        arcanaList: [{ num: E, name: getInfo(E).name }],
        contentKey: 'matrix.section.center',
        slots: {
          primary: `تحكم مركز مصفوفتك طاقة <strong>${getInfo(E).name} (${E})</strong>. هذه الطاقة تمثل جوهرك الحقيقي والمكان الآمن الذي تلجأ إليه روحك عندما تستنزفك الحياة.`,
          detailed: `طاقة المركز هي الحاكم الفعلي لاستقرارك الداخلي. عندما تعيش في تناغم مع ${getInfo(E).name}، تشعر بالسكينة والقدرة على توجيه كل الطاقات الأخرى بمصفوفتك.`,
          strengths: getInfo(E).light,
          challenges: getInfo(E).shadow,
          practical: `احرص يومياً على ممارسة أنشطة تمنحك إحساساً بالحرية والاستقرار المرتبط بـ ${getInfo(E).name}. تجنب القرارات الانفعالية التي تبعدك عن هدوئك الداخلي.`
        }
      },

      // 2. الذيل الكارمي
      {
        id: 'karmic_tail',
        icon: '⚓',
        title: 'الذيل الكارمي — دروس التناسخ والتحديات المتوارثة',
        subtitle: 'الأنماط النفسية المتكررة والمواقف التي تختبر وعيك حتى تحررها (Karmic Tail)',
        arcanaList: [
          { num: D, name: getInfo(D).name },
          { num: intermediate.D3, name: getInfo(intermediate.D3).name },
          { num: intermediate.D2, name: getInfo(intermediate.D2).name }
        ],
        contentKey: 'matrix.section.karmic_tail',
        slots: {
          primary: `يتشكل ثالوث ذيلك الكارمي من الطاقات <strong>(${D} - ${intermediate.D3} - ${intermediate.D2})</strong> بقيادة طاقة الأساس <strong>${getInfo(D).name}</strong>. هذه المنطقة تأتي معك في البداية بنقاط اختبار تحتاج إلى نضج ووعي.`,
          detailed: `الذيل الكارمي هو أكبر محفز للتطور الروحي؛ تظهر دروسه في صورة أنماط متكررة تختبرك حتى تعيها وتفك ارتباطك بالجانب السلبي لطاقة ${getInfo(D).name}.`,
          strengths: `تحويل خبرات الماضي إلى حكمة عميقة، واكتساب مناعة نفسية عالية ترشدك وتلهم المحيطين بك.`,
          challenges: `الوقوع المتكرر في ردود الأفعال القديمة، الشعور بالإحباط عند مواجهة نفس العقبة، أو الاستسلام لنزعات التدمير الذاتي.`,
          practical: `راقب تصرفاتك في لحظات الضغط الشديد. عندما تشعر برغبة في تكرار النمط الكارمي لـ ${getInfo(D).name}، توقف وخذ خياراً واعياً مختلفاً.`
        }
      },

      // 3. المهمة والغاية
      {
        id: 'purposes',
        icon: '🎯',
        title: 'المهمة والغاية — الغايات الحياتية الأربع الكبرى',
        subtitle: 'الغاية الشخصية، والاجتماعية، والروحية العامة، والغاية الكونية العليا (Purposes)',
        arcanaList: [
          { num: purposes.personal, name: 'الشخصية' },
          { num: purposes.social, name: 'الاجتماعية' },
          { num: purposes.spiritual, name: 'الروحية' },
          { num: purposes.planetary, name: 'الكونية' }
        ],
        contentKey: 'matrix.section.purposes',
        slots: {
          primary: `تتكامل غاياتك الأربع عبر مسارات الحياة: الشخصية <strong>(${purposes.personal})</strong>، الاجتماعية <strong>(${purposes.social})</strong>، الروحية <strong>(${purposes.spiritual})</strong>، والكونية <strong>(${purposes.planetary})</strong>.`,
          detailed: `
            <div class="aqm-purposes-grid">
              <div class="aqm-pillar">
                <h4>الغاية الشخصية <span class="aqm-t-en">Personal Purpose (حتى سن 40)</span></h4>
                <div class="aqm-pillar-num">${purposes.personal}</div>
                <p>تثبيت الذات، النضج الداخلي، ومواءمة محوري السماء والأرض.</p>
              </div>
              <div class="aqm-pillar">
                <h4>الغاية الاجتماعية <span class="aqm-t-en">Social Purpose (40 - 60 سنة)</span></h4>
                <div class="aqm-pillar-num">${purposes.social}</div>
                <p>خدمة المجتمع، العطاء للعائلة، وتمرير الخبرات للأجيال القادمة.</p>
              </div>
              <div class="aqm-pillar">
                <h4>الغاية الروحية العامة <span class="aqm-t-en">Spiritual Purpose</span></h4>
                <div class="aqm-pillar-num">${purposes.spiritual}</div>
                <p>المحصلة الروحية العليا لدمج الغايتين الشخصية والاجتماعية.</p>
              </div>
              <div class="aqm-pillar">
                <h4>الغاية الكونية <span class="aqm-t-en">Planetary Purpose</span></h4>
                <div class="aqm-pillar-num">${purposes.planetary}</div>
                <p>البصمة الكونية ورسالة الروح في الوعي الجمعي الأوسع.</p>
              </div>
            </div>
          `,
          strengths: `وضوح الرؤية الحياتية، التناغم مع المراحل العمرية، والشعور العميق بجدوى الحياة والمساهمة في بناء العالم.`,
          challenges: `استعجال الغايات الكبرى قبل تثبيت الغاية الشخصية، أو التشتت في مسارات لا تتوافق مع توقيتك الكوني.`,
          practical: `ركز جهودك في الفترة الراهنة على إتقان متطلبات غايتك المرحلية دون إهمال التجهيز للمرحلة التالية.`
        }
      },

      // 4. الشخصية والصورة الخارجية
      {
        id: 'personal',
        icon: '👤',
        title: 'الشخصية والصورة الخارجية — طاقة يوم الميلاد',
        subtitle: 'المظهر الخارجي، الطبع العفوي، وكيف يراك العالم من النظرة الأولى',
        arcanaList: [{ num: A, name: getInfo(A).name }],
        contentKey: 'matrix.section.personal',
        slots: {
          primary: `طاقة يوم ميلادك هي <strong>${getInfo(A).name} (${A})</strong>. هذا هو كارت زيارتك للعالم، والانطباع التلقائي الذي تتركه لدى الآخرين دون أي تصنع.`,
          detailed: `تعبر هذه الطاقة عن جسدك المادي، وصحتك الأولية، وطريقتك التلقائية في التعبير عن ذاتك في المواقف الجديدة.`,
          strengths: getInfo(A).light,
          challenges: getInfo(A).shadow,
          practical: `كن أصيلاً في التعبير عن طبيعتك. استخدم سمات ${getInfo(A).name} الإيجابية كبوابة موثوقة لفتح الفرص في بيئتك اليومية.`
        }
      },

      // 5. المواهب والقدرات
      {
        id: 'talents',
        icon: '✨',
        title: 'المواهب والقدرات — هدايا الروح والإلهام',
        subtitle: 'المواهب الفطرية التي نزلت بها للدنيا وكيف تسخرها لخدمة رسالتك',
        arcanaList: [
          { num: B, name: getInfo(B).name },
          { num: F, name: getInfo(F).name }
        ],
        contentKey: 'matrix.section.talents',
        slots: {
          primary: `تتمركز مواهبك العليا في قمة المصفوفة بطاقتي <strong>${getInfo(B).name} (${B})</strong> ومواهب الأجداد <strong>${getInfo(F).name} (${F})</strong>.`,
          detailed: `هذه المنطقة تمثل الإلهام المباشر والقدرات الفطرية التي ولدت بها؛ إذ تتدفق أفكارك وإبداعاتك بسلاسة متى ما كنت متصلاً بـ ${getInfo(B).name}.`,
          strengths: `الإبداع الفطري، سرعة البديهة، وحل المشكلات برؤية غير تقليدية مستمدة من الحكمة العميقة.`,
          challenges: `كبت المواهب، الخوف من إبداء الرأي، أو الشك في القيمة الحقيقية لما تقدمه للعالم.`,
          practical: `خصص وقتاً ثابتاً أسبوعياً لممارسة مواهبك دون قيود النتيجة أو العائد المادي المباشر.`
        }
      },

      // 6. خط الأب
      {
        id: 'father_line',
        icon: '🛡️',
        title: 'خط الأب — التراث الكارمي لسلالة الذكور',
        subtitle: 'المهام المتوارثة عبر الذكور، العلاقة بالوالد، ومفتاح الدعم والوفرة (Paternal Line)',
        arcanaList: [
          { num: F, name: getInfo(F).name },
          { num: H, name: getInfo(H).name },
          { num: generational.father.combined, name: 'المحصلة' }
        ],
        contentKey: 'matrix.section.father_line',
        slots: {
          primary: `يمتد خط الأب بين قمة مواهب الأب <strong>(${F})</strong> وقاعدة كارما الأب المادية <strong>(${H})</strong> بمحصلة كلية <strong>(${generational.father.combined})</strong>.`,
          detailed: `يعكس هذا الخط علاقتك بالطاقة الذكورية، ونمط التعامل مع السلطة والنظام، وقدرتك على بناء كيانات عملية راسخة.`,
          strengths: `القدرة على القيادة، الصمود في مواجهة التحديات المالية والتنظيمية، والانضباط الواعي.`,
          challenges: `الصراع مع السلطة، أو تكرار الأنماط المالية الجامدة التي عانى منها الآباء والأجداد.`,
          practical: `اعمل على التصالح النفسي مع صورة الأب وتحرير أي أحكام موروثة لفتح مسار القوة الذكورية البناءة.`
        }
      },

      // 7. خط الأم
      {
        id: 'mother_line',
        icon: '🌸',
        title: 'خط الأم — التراث الكارمي لسلالة الإناث',
        subtitle: 'المهام المتوارثة عبر الإناث، الذكاء العاطفي، والقدرة على الاستقبال والاحتواء (Maternal Line)',
        arcanaList: [
          { num: G, name: getInfo(G).name },
          { num: I, name: getInfo(I).name },
          { num: generational.mother.combined, name: 'المحصلة' }
        ],
        contentKey: 'matrix.section.mother_line',
        slots: {
          primary: `يمتد خط الأم بين قمة مواهب الأم <strong>(${G})</strong> وقاعدة كارما المشاعر <strong>(${I})</strong> بمحصلة كلية <strong>(${generational.mother.combined})</strong>.`,
          detailed: `يمثل هذا الخط الذكاء العاطفي، والقدرة على الاستقبال والاحتواء، وشفاء العلاقات الإنسانية الحساسة.`,
          strengths: `التعاطف العالي، الحدس الروحي، القدرة على الرعاية والاستشفاء الذاتي، وجذب الوفرة بسلاسة.`,
          challenges: `الحساسية الزائدة، كبت المشاعر، أو التضحية المفرطة التي تضر بالصحة النفسية.`,
          practical: `مارس العناية الذاتية المنتظمة وضع حدوداً صحية تحمي طاقتك دون انغلاق أو قسوة.`
        }
      },

      // 8. الأجداد والبرامج العائلية
      {
        id: 'ancestral_programs',
        icon: '🏛️',
        title: 'الأجداد والبرامج العائلية — طاقة التراث الجمعي ومحاور الأنساب',
        subtitle: 'العقد والعهود المتوارثة من أجيال السلف وكيفية تحرير شجرة العائلة',
        arcanaList: [
          { num: P.ancestralPrograms.ancestralCenter, name: 'مركز الأجداد' },
          { num: P.ancestralPrograms.commonCenter, name: 'المركز المشترك' }
        ],
        contentKey: 'matrix.section.ancestral_programs',
        slots: {
          primary: `تتكامل محاور الأنساب في نقطة مركز الأجداد <strong>(${P.ancestralPrograms.ancestralCenter})</strong> والمركز المشترك <strong>(${P.ancestralPrograms.commonCenter})</strong> كجامع للتراث العائلي لخط الأب (${generational.father.combined}) وخط الأم (${generational.mother.combined}).`,
          detailed: `
            <div class="aqm-pending-badge">قيد الإعداد والتوثيق المنهجي</div>
            <p><strong>[PENDING_CONTENT]:</strong> تحليل الشيفرات الوراثية الممتدة عبر الأجيال السابقة وعقود الولاء غير الواعي قيد التوثيق المنهجي المعتمد، وسيتم إدراجه في التحديث المعتمد لنصوص التفسير.</p>
          `,
          strengths: `الاستفادة من القوة الجذورية للعائلة، وتوارث الحكمة والصمود والبركة الروحية.`,
          challenges: `الشعور بالذنب غير المبرر عند تحقيق نجاح لم يحققه السلف، أو الانغماس في أعباء الماضي.`,
          practical: `عبّر عن الامتنان لجهود الأجداد، وتحرر بوعي من أي قيد أو اعتقاد سلبي يمنعك من النمو.`
        }
      },

      // 9. خط العلاقات والحب
      {
        id: 'love_line',
        icon: '💖',
        title: 'خط العلاقات والحب — الشريك ونقطة القلب',
        subtitle: 'صفات شريك الروح، كيفية الحفاظ على الشغف، ونقطة التقاء العاطفة بالواقع',
        arcanaList: [
          { num: heartPoint, name: getInfo(heartPoint).name },
          { num: balancePoint, name: 'التوازن' },
          { num: intermediate.D2, name: 'مدخل القلب' }
        ],
        contentKey: 'matrix.section.love_line',
        slots: {
          primary: `يمر خط علاقاتك بنقطة مدخل القلب <strong>${getInfo(heartPoint).name} (${heartPoint})</strong> وصولاً لنقطة التوازن <strong>(${balancePoint})</strong>.`,
          detailed: `يكشف هذا المسار مواصفات الشريك الأنسب لنموك، والبيئة التي يزدهر فيها الحب، والتحديات العاطفية التي تتطلب صراحة وشفافية.`,
          strengths: `العمق العاطفي، القدرة على بناء شراكة مستدامة، والتفاهم السريع مع الشريك المتوافق.`,
          challenges: `الخوف من الرفض، التعلق العاطفي المرضي، أو فرض التوقعات المثالية غير الواقعية.`,
          practical: `احرص على فتح مساحات حوار دورية وصادقة مع الشريك، وركز على التقدير المستمر للمبادرات الإيجابية.`
        }
      },

      // 10. خط المال والعمل
      {
        id: 'money_line',
        icon: '💰',
        title: 'خط المال والعمل — مصادر الدخل وتدفق الوفرة والمهنة',
        subtitle: 'المسار المالي، المهام المهنية الأنسب، ومفتاح فتح التدفق المالي المستمر',
        arcanaList: [
          { num: moneyPoint, name: getInfo(moneyPoint).name },
          { num: balancePoint, name: 'التوازن' },
          { num: intermediate.C2, name: 'مدخل المادة' }
        ],
        contentKey: 'matrix.section.money_line',
        slots: {
          primary: `يقود خط الوفرة مدخل المال <strong>${getInfo(moneyPoint).name} (${moneyPoint})</strong> بالتقائه مع زاوية المادة والصحة <strong>(${C})</strong> ونقطة التوازن <strong>(${balancePoint})</strong>.`,
          detailed: `يوضح هذا المسار المجالات المهنية الأكثر دراً للمال والمناسبة لطاقتك، وموانع التدفق النفسية كعقدة الخوف من الفقر.`,
          strengths: `القدرة على خلق الفرص، استثمار الموارد بذكاء، وتحويل المعرفة النظرية إلى أصول مادية قيّمة.`,
          challenges: `القلق المستمر بشأن المال، التبذير التعويضي، أو العمل في مجالات تستنزف الروح دون شغف.`,
          practical: `وجّه طاقتك المهنية نحو تقديم قيمة ملموسة للمحيطين، وتعامل مع المال كوسيلة للتمكين والحرية.`
        }
      },

      // 11. الشاكرات
      {
        id: 'chakras',
        icon: '🧘',
        title: 'الشاكرات — جدول مراكز الطاقة ومستويات الوعي',
        subtitle: 'توزيع الطاقات على مراكز الوعي السبعة وتحليل مستويات الجسد والنفس',
        arcanaList: [
          { num: chakras.totals.physics, name: 'الفيزياء' },
          { num: chakras.totals.energy, name: 'الطاقة' },
          { num: chakras.totals.emotions, name: 'المشاعر' }
        ],
        contentKey: 'matrix.section.chakras',
        slots: {
          primary: `يربط جدول الشاكرات طاقاتك بمراكز الوعي السبعة: المحصلة الفيزيائية <strong>(${chakras.totals.physics})</strong>، محصلة الطاقة <strong>(${chakras.totals.energy})</strong>، ومحصلة المشاعر <strong>(${chakras.totals.emotions})</strong>.`,
          detailed: `
            <div class="aqm-chakra-table-wrap">
              <table class="aqm-chakra-table">
                <thead>
                  <tr>
                    <th>الشاكرا وموضعها</th>
                    <th>الجسد الفيزيائي</th>
                    <th>الطاقة الحيوية</th>
                    <th>المشاعر والوعي</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.values(chakras.rows).map(r => `
                    <tr>
                      <td>${r.symbol} ${r.name}</td>
                      <td><span class="aqm-chakra-badge">${r.physics}</span></td>
                      <td><span class="aqm-chakra-badge">${r.energy}</span></td>
                      <td><span class="aqm-chakra-badge">${r.emotions}</span></td>
                    </tr>
                  `).join('')}
                  <tr class="aqm-chakra-total-row">
                    <td><strong>المجموع الكلي</strong></td>
                    <td><strong>${chakras.totals.physics}</strong></td>
                    <td><strong>${chakras.totals.energy}</strong></td>
                    <td><strong>${chakras.totals.emotions}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          `,
          strengths: `التناغم الحيوي، سرعة الاستشفاء الذاتي، والقدرة على استشعار احتياجات الجسد وتلبيتها بحكمة.`,
          challenges: `تراكم التوتر والضغوط النفسية في مراكز محددة مما يسبب تعباً جسدياً مزمناً.`,
          practical: `مارس التنفس الواعي وتمارين التمدد يومياً لتحرير الشاكرات من أي ركود طاقي.`
        }
      },

      // 12. برامج المصفوفة المركبة
      {
        id: 'composite_programs',
        icon: '🔮',
        title: 'برامج المصفوفة المركبة — الشيفرات الثلاثية والأنماط المعقدة',
        subtitle: 'تلاقي طاقات متعددة لتشكيل برامج نفسية وحياتية مركبة داخل الوعي',
        arcanaList: [
          { num: P.compositePrograms.spiritualTriad[1], name: 'برنامج الروح' },
          { num: P.compositePrograms.materialTriad[1], name: 'برنامج المادة' }
        ],
        contentKey: 'matrix.section.composite_programs',
        slots: {
          primary: `تتكامل ثلاثيات مصفوفتك لتشكيل برامج حياتية مركبة: ثلاثية الروح <strong>(${P.compositePrograms.spiritualTriad.join(' - ')})</strong> وثلاثية المادة <strong>(${P.compositePrograms.materialTriad.join(' - ')})</strong>.`,
          detailed: `
            <div class="aqm-pending-badge">قيد الإعداد والتوثيق المنهجي</div>
            <p><strong>[PENDING_CONTENT]:</strong> تحليل البرامج المركبة والشفرات الثلاثية المتقدمة وفق منهج لاديني يجري توثيقها لإدراجها في التحديث القادم للنصوص.</p>
          `,
          strengths: `تنوع المهارات، القدرة على التكيف في الأوضاع المعقدة، والجمع بين النظرة الفلسفية والتطبيق العملي.`,
          challenges: `صراع الأولويات بين الرغبات الروحية والواجبات المادية، وتشتت الانتباه.`,
          practical: `حدد هدفاً واحداً واضحاً لكل دورة عمل، وتجنب البدء في مشاريع جديدة قبل إكمال المهام المفتوحة.`
        }
      },

      // 13. الأطفال والمؤشرات المرتبطة بهم
      {
        id: 'children_line',
        icon: '🌱',
        title: 'الأطفال والمؤشرات المرتبطة بهم — طاقة الأبناء واستمرارية الأجيال',
        subtitle: 'العلاقة مع الأبناء، والرسائل التي يحملها الأطفال لوالديهم',
        arcanaList: [
          { num: P.childrenLine.childEnergy, name: 'طاقة الطفل' },
          { num: P.childrenLine.generationKey, name: 'مفتاح التواصل' }
        ],
        contentKey: 'matrix.section.children_line',
        slots: {
          primary: `ترتبط مؤشرات الأبناء بطاقة الامتداد الجيلي <strong>(${P.childrenLine.childEnergy})</strong> ومفتاح التواصل بين الأجيال <strong>(${P.childrenLine.generationKey})</strong>.`,
          detailed: `
            <div class="aqm-pending-badge">قيد الإعداد والتوثيق المنهجي</div>
            <p><strong>[PENDING_CONTENT]:</strong> تحليل رسائل الأبناء لأرواح الآباء ونقاط التوافق التربوي قيد التوثيق المنهجي المعتمد.</p>
          `,
          strengths: `الصبر والاحتواء، الفهم العميق لنفسية الأطفال، وبناء علاقة صداقة وثقة تدوم عبر السنين.`,
          challenges: `القلق الزائد على مستقبل الأبناء أو محاولة توجيههم في مسارات لا تناسب شخصياتهم الفطرية.`,
          practical: `امنح الأطفال مساحة حرة للتعبير عن مشاعرهم، واستمع إليهم باهتمام دون أحكام مسبقة.`
        }
      },

      // 14. دورات الحياة ومحطاتها
      {
        id: 'age_cycles',
        icon: '⏳',
        title: 'دورات الحياة ومحطاتها — الخريطة الزمنية (0 - 80 سنة) وطاقة العام',
        subtitle: 'المراحل العمرية وتتابع الطاقات الحاكمة لكل عقد ومحطة في حياتك',
        arcanaList: [
          { num: P.yearEnergy.number, name: 'سنة ' + P.yearEnergy.year }
        ],
        contentKey: 'matrix.section.age_cycles',
        slots: {
          primary: `تحكم عامك الحالي <strong>(${P.yearEnergy.year})</strong> طاقة الأركانا <strong>${getInfo(P.yearEnergy.number).name} (${P.yearEnergy.number})</strong> ضمن مسار محطات العمر (0 - 80 سنة).`,
          detailed: `توضح الخريطة الزمنية طبيعة التحديات والفرص السنوية؛ فالطاقة الحاكمة للعام تحدد المزاج العام للمشاريع والأولويات المناسبة.`,
          strengths: `التزامن مع التوقيت الكوني والقدرة على اغتنام الفرص في أوانها الأنسب.`,
          challenges: `مقاومة التغييرات الطبيعية لكل مرحلة عمرية ومحاولة التمسك بنمط استنفد دوره.`,
          practical: `استثمر طاقة ${getInfo(P.yearEnergy.number).name} هذا العام في المبادرة والتركيز على أهدافك الاستراتيجية.`
        }
      },

      // 15. روشتة التحول
      {
        id: 'transformation_rx',
        icon: '⚖️',
        title: 'روشتة التحول — مفاتيح الموازنة والارتقاء من الظل إلى النور',
        subtitle: 'بروتوكول العمل اليومي والخطوات العملية لتحويل الطاقات السلبية إلى قوى بناءة',
        arcanaList: [
          { num: balancePoint, name: 'نقطة التوازن' },
          { num: purposes.sky, name: 'السماء' },
          { num: purposes.earth, name: 'الأرض' }
        ],
        contentKey: 'matrix.section.transformation_rx',
        slots: {
          primary: `ترتكز روشتة التحول على نقطة التوازن المركزية <strong>(${balancePoint})</strong> وتحقيق الاتزان بين محور السماء <strong>(${purposes.sky})</strong> ومحور الأرض <strong>(${purposes.earth})</strong>.`,
          detailed: `التحول في مصفوفة القدر هو انتقال واعٍ من تجليات الظل السلبية إلى ترددات النور الإيجابية، عبر الممارسة اليومية المستمرة ومراقبة الذات.`,
          strengths: `المرونة النفسية، سرعة التعافي من الانتكاسات، والارتقاء بمستوى الوعي بصورة دائمة.`,
          challenges: `اليأس المؤقت عند مواجهة اختبارات صعبة، أو التردد في اتخاذ القرارات المصيرية.`,
          practical: `اجعل الوعي بطاقاتك ممارسة يومية، وذكّر نفسك دائماً بأن كل تحدٍ يحمل في طياته بذرة نمو جديدة.`
        }
      }
    ];

    return sections.map(buildAccordionItem).join('\n');
  }

  const build12Sections = build15Sections;

  // ==================== 3. مصفوفة المصطلحات والمرجع (Glossary) ====================

  function buildGlossaryGrid(P) {
    const { anchors, corners } = P;
    const items = [
      { ar: 'الشخصية والمظهر', en: 'Personality Essence (A)', num: anchors.A },
      { ar: 'الاتصال الروحي', en: 'Spiritual Link (B)', num: anchors.B },
      { ar: 'المادة والصحة', en: 'Material Power (C)', num: anchors.C },
      { ar: 'الذيل الكارمي', en: 'Karmic Tail (D)', num: anchors.D },
      { ar: 'مركز راحة الروح', en: 'Soul Comfort (E)', num: anchors.E },
      { ar: 'مواهب الأب', en: 'Paternal Talents (F)', num: corners.F },
      { ar: 'مواهب الأم', en: 'Maternal Talents (G)', num: corners.G },
      { ar: 'كارما الأب', en: 'Ancestral Lines Father (H)', num: corners.H },
      { ar: 'كارما الأم', en: 'Ancestral Lines Mother (I)', num: corners.I }
    ];

    return `
      <div class="aqm-gloss-grid">
        ${items.map(it => `
          <div class="aqm-gloss">
            <span class="aqm-t-en">${it.en}</span>
            <div class="aqm-t-ar">${it.ar}: <strong>${it.num}</strong></div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ==================== 4. العرض المتكامل والربط بالـ DOM ====================

  /**
   * الدالة الرئيسية لبناء وعرض تقرير مصفوفة القدر المتكامل في المتصفح
   */
  function renderMatrixReport(birthDate, name = '', gender = '') {
    const host = document.querySelector('#mresult');
    if (!host) return;

    const engine = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
    if (!engine) {
      host.innerHTML = '<p class="ferr">محرك الحسابات لم يُحمّل بعد. يُرجى تحديث الصفحة.</p>';
      host.hidden = false;
      return;
    }

    const P = engine.calculateDestinyMatrix(birthDate);
    const getInfo = n => engine.getArcanaInfo(n);
    const dateStr = `${P.birthDate.year}-${String(P.birthDate.month).padStart(2, '0')}-${String(P.birthDate.day).padStart(2, '0')}`;
    const displayName = name ? name.trim() : 'مستخدم عقيق أسترو';

    const html = `
      <section class="aqm-shell" aria-labelledby="aqm-report-title">
        <!-- الكارت العلوي الفاخر (Summary Card) -->
        <header class="aqm-header">
          <span class="aqm-kicker">مصفوفة القدر · Natalia Ladini System</span>
          <h2 id="aqm-report-title">${displayName}</h2>
          <div class="aqm-meta-info">
            <span class="aqm-meta-pill">📅 الميلاد: ${dateStr}</span>
            <span class="aqm-meta-pill">👑 المركز: ${getInfo(P.anchors.E).name} (${P.anchors.E})</span>
            <span class="aqm-meta-pill">👤 الجوهر: ${getInfo(P.anchors.A).name} (${P.anchors.A})</span>
            <span class="aqm-meta-pill">⚡ سنة ${P.yearEnergy.year}: طاقة ${P.yearEnergy.number}</span>
          </div>
          <div class="aqm-actions">
            <button class="aqm-btn" type="button" id="aqm-btn-print">🖨️ حفظ كـ PDF / طباعة</button>
            <button class="aqm-btn aqm-btn-primary" type="button" id="aqm-btn-story">📸 استخراج بطاقة القصة</button>
          </div>
        </header>

        <!-- حاوية الرسم الهندسي (SVG Octagram) -->
        <div class="aqm-canvas-wrap">
          <h4 style="margin:0 0 12px;color:var(--aqm-wine);font-size:1.1rem;font-weight:700;">النجمة الثمانية لمصفوفة القدر</h4>
          <p style="margin:0 0 16px;color:var(--aqm-text-muted);font-size:0.85rem;">اضغط على أي عقدة أو رقم للانتقال مباشرة إلى تحليله في الأكورديون أدناه</p>
          ${generateMatrixSVG(P)}
        </div>

        <!-- نظام الأكورديون الـ 15 المتكامل -->
        <div class="aqm-accordion-container">
          ${build12Sections(P)}
        </div>

        <!-- الفهرس المرجعي للأركان (للتوافق المعياري مع الاختبارات) -->
        <div style="margin-top:32px;padding-top:20px;border-top:1px solid var(--aqm-gold-border);">
          <h4 style="font-size:0.95rem;color:var(--aqm-text-muted);margin:0 0 10px;">المعجم الرمزي للمواضع (Karmic Tail & Ancestral Lines):</h4>
          ${buildGlossaryGrid(P)}
        </div>

        <!-- التذييل وإخلاء المسؤولية الرمزية -->
        <footer style="margin-top:32px;text-align:center;font-size:0.82rem;color:var(--aqm-text-muted);line-height:1.7;">
          <p>مصفوفة القدر نظام رمزي للتأمل واستكشاف الذات مبني على منهج ناتاليا لاديني (22 أركانا). عقيق أسترو يقدم القراءات كأداة للوعي والتمكين الذاتي وليست للتنبؤ القاطع أو المشورة الطبية.</p>
        </footer>
      </section>
    `;

    host.innerHTML = html;
    host.hidden = false;

    // ربط تفاعلات الأكورديون
    const accItems = host.querySelectorAll('.aqm-acc-item');
    accItems.forEach(item => {
      const header = item.querySelector('.aqm-acc-header');
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // السماح بفتح وإغلاق مستقل
        item.classList.toggle('open');
        header.setAttribute('aria-expanded', String(!isOpen));
      });
    });

    // فتح القسم الأول (المركز) تلقائياً افتراضياً
    const firstAcc = host.querySelector('#aqm-sec-center');
    if (firstAcc) {
      firstAcc.classList.add('open');
      firstAcc.querySelector('.aqm-acc-header')?.setAttribute('aria-expanded', 'true');
    }

    // ربط النقر والتمرير فوق عُقد الـ SVG
    const tooltip = host.querySelector('#aqm-tooltip');
    const nodes = host.querySelectorAll('.aqm-node');
    nodes.forEach(node => {
      const secId = node.dataset.section;
      const title = node.dataset.title || '';
      const arc = node.dataset.arcana || '';
      const arcInfo = arc ? engine.getArcanaInfo(Number(arc)) : null;
      const label = `${title} (${arc}${arcInfo ? ' · ' + arcInfo.name : ''})`;

      // Tooltip على الـ Hover
      const showTooltip = e => {
        if (!tooltip) return;
        tooltip.textContent = label;
        tooltip.classList.add('visible');
        const wrapRect = host.querySelector('.aqm-canvas-wrap').getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();
        const left = nodeRect.left - wrapRect.left + (nodeRect.width / 2);
        const top = nodeRect.top - wrapRect.top - 36;
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.transform = 'translateX(-50%)';
      };

      const hideTooltip = () => {
        if (tooltip) tooltip.classList.remove('visible');
      };

      node.addEventListener('mouseenter', showTooltip);
      node.addEventListener('focus', showTooltip);
      node.addEventListener('mouseleave', hideTooltip);
      node.addEventListener('blur', hideTooltip);

      // النقر يفتح الأكورديون المعني وينتقل إليه
      const onClick = () => {
        hideTooltip();
        if (!secId) return;
        const targetAcc = host.querySelector(`#aqm-sec-${secId}`);
        if (targetAcc) {
          targetAcc.classList.remove('aqm-item-highlight');
          void targetAcc.offsetWidth; // trigger reflow
          targetAcc.classList.add('aqm-item-highlight');
          setTimeout(() => targetAcc.classList.remove('aqm-item-highlight'), 2500);
          if (!targetAcc.classList.contains('open')) {
            targetAcc.classList.add('open');
            targetAcc.querySelector('.aqm-acc-header')?.setAttribute('aria-expanded', 'true');
          }
          targetAcc.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      node.addEventListener('click', onClick);
      node.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      });
    });

    // ربط زر الطباعة / PDF
    host.querySelector('#aqm-btn-print')?.addEventListener('click', () => {
      // فتح كل الأكورديونات قبل الطباعة لضمان ظهور كامل المحتوى في الـ PDF
      accItems.forEach(item => {
        item.classList.add('open');
        item.querySelector('.aqm-acc-header')?.setAttribute('aria-expanded', 'true');
      });
      window.print();
    });

    // التمرير إلى النتيجة
    host.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ==================== 5. ربط النموذج وتأصيل الأحداث ====================

  function initForm() {
    const form = document.querySelector('#mform');
    if (!form || form.dataset.aqmBound === 'true') return;
    form.dataset.aqmBound = 'true';

    form.addEventListener('submit', e => {
      e.preventDefault();
      const err = document.querySelector('#merr');
      if (err) err.hidden = true;

      const dateInput = document.querySelector('#m-date');
      const nameInput = document.querySelector('#m-name');
      const genderInput = document.querySelector('#m-gender');

      const v = dateInput ? dateInput.value : '';
      if (!v) {
        if (err) {
          err.textContent = 'اكتب تاريخ الميلاد.';
          err.hidden = false;
        }
        return;
      }

      const [y, m, d] = v.split('-').map(Number);
      if (y < 1900 || y > 2100) {
        if (err) {
          err.textContent = 'التاريخ لازم يكون بين 1900 و 2100.';
          err.hidden = false;
        }
        return;
      }
      if (new Date(y, m - 1, d) > new Date()) {
        if (err) {
          err.textContent = 'تاريخ الميلاد في المستقبل. راجع التاريخ.';
          err.hidden = false;
        }
        return;
      }

      const name = nameInput ? nameInput.value.trim() : '';
      const gender = genderInput ? genderInput.value : '';

      renderMatrixReport(v, name, gender);

      // تطبيق تخصيص الضمير والنسخ إن وُجد
      const resultHost = document.querySelector('#mresult');
      if (resultHost && window.AqeeqGender) {
        window.AqeeqGender.apply(resultHost, gender);
      }
      if (resultHost && window.AqeeqCopyMap) {
        window.AqeeqCopyMap.attach(resultHost, 'مصفوفة القدر · ' + (name || v));
      }
    });
  }

  // التصدير إلى النطاق العام
  const api = {
    render: renderMatrixReport,
    renderMatrixReport,
    generateMatrixSVG,
    build15Sections,
    build12Sections,
    // الحفاظ على توافق AqeeqNumerology
    calculateDestinyMatrix: date => {
      const eng = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
      return eng ? eng.calculateDestinyMatrix(date) : null;
    },
    /**
     * @deprecated دالة مهجورة غير مستخدمة في واجهة التطبيق (Unused Legacy Export Stub).
     * المصدر الأساسي والوحيد المعتمد لحساب مسار الحياة الفعلي في عقيق أسترو هو دالة lifePath(d, m, y)
     * المعرفة داخل index.html (وفق منهج الجمع الكلي مع حفظ الأرقام الرئيسية 11 و 22 و 33 في الناتج النهائي).
     * تم الإبقاء على هذا التصدير الشكلي فقط لمنع أي كسر في التوافق القديم (Backwards Compatibility).
     */
    calculateLifePath: date => {
      const eng = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
      return eng ? { number: eng.reduceArcana(new Date(date).getDate()) } : { number: 1 };
    },
    calculateChakraHealthCard: date => {
      const eng = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
      return eng ? eng.calculateDestinyMatrix(date).chakras : null;
    }
  };

  const root = typeof window !== 'undefined' ? window : globalThis;
  root.AqeeqMatrixUI = api;
  root.AqeeqNumerology = Object.assign(root.AqeeqNumerology || {}, api);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
  } else {
    initForm();
  }
})();
