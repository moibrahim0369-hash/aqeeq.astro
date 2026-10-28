/* محرك التوقعات اليومية - عقيق أسترو
   نظام فلكي-نفسي: توقعات ديناميكية بناءً على العبورات الفعلية
   كل برج: cosmic_psychology + body_alert + actionable_blueprint */

(function () {
  'use strict';

  /* --- شفرات الكواكب والبيوت لكل برج --- */
  const TRANSITS = {
    aries: {
      label: 'الحمل',
      emoji: '♈',
      house: 8,
      psychology: 'التراجع بتاعك بيكشف أسرار قديمة أو ديون نفسية مكبوتة. في الأعماق في حاجة تحتاج مواجهة صادقة، ماتهربش من الحقيقة.',
      bodyAlert: 'العضو: الجهاز الهضمي والأمعاء | السبب: كتم مشاعر وخوف من فقدان التحكم | الحل: تنفس عميق وتفريغ المشاعر بكتابة أو حوار صريح.',
      blueprint: ['١. اسأل نفسك: "إيه الحقيقة اللي ماحبش أواجهها؟" واكتبها في ورقة خاصة.', '٢. ماتاخدش قرار مالي أو زواجي حاسم دلوقتي - الرؤية غير واضحة.', '٣. كلمة السر اليوم: "أنا قوي بصدقي، وأنا أستحق الحقيقة بدل الوهم."']
    },
    taurus: {
      label: 'الثور',
      emoji: '♉',
      house: 7,
      psychology: 'شريكك أو عدوك أو الشخص اللي قدامك - بتحصل مراجعة للعلاقة. كلام قديم هيرجع يطفو، وفيه تصحيح حاسم لازم يحصل في الحدود بينكم.',
      bodyAlert: 'العضو: الحلق والرقبة | السبب: احتباس كلمات كان نفسك تقولها وبلع غصة خوف | الحل: اشرب ماء دافي واكتب عتابك ورا ما توجه الشخص.',
      blueprint: ['١. قاعدة الـ 10 ثوانٍ: قبل رد على أي رسالة مستفزة، عد لـ 10 واسأل: "هل ده وقته؟"', '٢. ممنوع توقيع عقود أو انفصال نهائي - أجلها لغاية استقامة الموقف.', '٣. كلمة السر: "أنا أملك هدوئي الداخلي، وكلام الآخرين ما يحدد قيمتي."']
    },
    gemini: {
      label: 'الجوزاء',
      emoji: '♊',
      house: 6,
      psychology: 'روتين الشغل بيفتح فيه ثغرات - تفاصيل فاتتك أو زميل بيسبب مشاكل. صحتك الجسدية محتاجة انتباه من البداية دي - ماتهملش الإرهاق.',
      bodyAlert: 'العضو: الجهاز العصبي والعضلات | السبب: ضغط من كتر التفاصيل والقلق من الأداء | الحل: يوم راحة كامل من الشاشات - امش في مكان هادي.',
      blueprint: ['١. راجع مشاريعك الشغلية: فيه خطأ صغير بيفرق بشكل كبير.', '٢. تواصل مع زملائك بهدوء - توضيح الرسالة أهم من السرعة.', '٣. كلمة السر: "أنا منظم وواعي بالتفاصيل، وكفاي قلق من الكمال."']
    },
    cancer: {
      label: 'السرطان',
      emoji: '♋',
      house: 5,
      psychology: 'مشروعك الإبداعي أو علاقتك الرومانسية - في خلل بسيط بيحتاج تصحيح. لو في أطفال في حياتك، هم بيحتاجوا اهتمام أكتر شوية.',
      bodyAlert: 'العضو: القلب والصدر | السبب: خوف من رفض أو عدم قبول الآخرين | الحل: اعترف بمخاوفك لشخص بتثق فيه وقول شعورك بصراحة.',
      blueprint: ['١. لو في علاقة - قول الحقيقة اللي في قلبك بدل لما تتراكم.', '٢. مشروعك الإبداعي محتاج حب واهتمام - ماتتركيش على عشان الضغوط.', '٣. كلمة السر: "حبي حقيقي وأستحق قبول بدون شروط."']
    },
    leo: {
      label: 'الأسد',
      emoji: '♌',
      house: 4,
      psychology: 'البيت والعيلة - في توتر مع حد قريب جداً أو مشكلة في الأساسيات اللي تستند عليها. ركز على الأمان النفسي بدل المظهر الخارجي.',
      bodyAlert: 'العضو: البطن والجهاز الهضمي | السبب: عدم الشعور بالأمان في المنزل | الحل: قضِ وقت في مكان تحبه بداخل البيت وسمح لنفسك برخاوة.',
      blueprint: ['١. كلم والديك أو أقاربك - في حاجة تحتاج توضيح بين البيت.', '٢. هديك نفسك باهتمام: ركنة هادية وشاي دافي كفايات.', '٣. كلمة السر: "بيتي آمن، وجذوري قوية."']
    },
    virgo: {
      label: 'العذراء',
      emoji: '♍',
      house: 3,
      psychology: 'التواصل والأخبار - كلام يتقال غير صحيح أو في تشويش في الرسائل. أخيك أو زملاء قد تحصل معهم حاجة. فرّق بين ما تسمعه وما تفترضه.',
      bodyAlert: 'العضو: الرقبة والأذنين | السبب: عدم الاستماع الحقيقي والحكم المتسرع | الحل: استمع أكتر ما تتكلم - كل مرة اسمع طرفك التاني كامل.',
      blueprint: ['١. قبل ما توزع معلومة - تأكد إن صحيحة من مصدرين.', '٢. كلم الشخص مباشرة بدل لما تتكلم وراه - الوضوح يحل نصف المشاكل.', '٣. كلمة السر: "أنا مستمع حقيقي، وكلامي محسوب."']
    },
    libra: {
      label: 'الميزان',
      emoji: '♎',
      house: 2,
      psychology: 'الفلوس والقيمة الذاتية - في خلل في ميزانيتك أو شعور بعدم الاستحقاق. قيمتك الحقيقية مش اللي تاخده من الناس.',
      bodyAlert: 'العضو: المعدة والجهاز المالي (الحرفي والمجازي) | السبب: خوف من الفقر أو عدم الكفاية | الحل: رتّب فلوسك بوضوح وعمل ميزانية بسيطة.',
      blueprint: ['١. مراجعة فلوسك دلوقتي - في مصرف بتجاهله أو دخل ماحسبته.', '٢. ماتتسرعش في شراء أي حاجة غالية - الرؤية غير واضحة.', '٣. كلمة السر: "أنا مستحق الوفرة والأمان المالي."']
    },
    scorpio: {
      label: 'العقرب',
      emoji: '♏',
      house: 1,
      psychology: 'أنت وحدك - في تصحيح جسيم لهويتك أو صورتك. أنت بتتغيّر من جواك وقرار كبير بتقرّر تاخده بخصوصك.',
      bodyAlert: 'العضو: الرأس والعيون | السبب: رؤية جديدة بتطلب توديع الشخص اللي كنت عليه | الحل: نوم عميق وتأمل صباحي - دي فترة ولادة جديدة.',
      blueprint: ['١. اسأل نفسك: "مين اللي أنا بدون الناس؟" - الإجابة هي الحقيقة.', '٢. قرار كبير في الطريق - استنى لتصفية الرؤية شوية.', '٣. كلمة السر: "أنا الممثل الرئيسي في حياتي، وقراراتي صح."']
    },
    sagittarius: {
      label: 'القوس',
      emoji: '♐',
      house: 12,
      psychology: 'العقل الباطن والروح - أحلام وحكايات قديمة بتيجي على السطح. في حاجة من الماضي نفسك تتحرر منها - اليوم فرصتك.',
      bodyAlert: 'العضو: الدماغ والنوم واللاوعي | السبب: رغبة مكبوتة في الحرية والهروب | الحل: خلوة ساعة في مكان هادي - حط نفسك قدام مشاعرك.',
      blueprint: ['١. اكتب أحلامك اللي بتتكرر - فيه رسالة فيها لك.', '٢. سيب مساحة للخلوة والتأمل - ماتملأش الوقت بنشاطات.', '٣. كلمة السر: "أنا حر من ماضيي، وخياراتي الجديدة تنتظرني."']
    },
    capricorn: {
      label: 'الجدي',
      emoji: '♑',
      house: 11,
      psychology: 'الأصدقاء والشبكات الاجتماعية - في سوء فهم مع مجموعة أو صديق قريب. مش كل واحد قريب ليك يستحق قربك دي.',
      bodyAlert: 'العضو: الأرجل والحركة | السبب: عدم الحرية في الاختيارات وعلاقات ملتزمة بقوة | الحل: استرخِ وقول لا بدون ذنب - أنت مش مسؤول عن كل حد.',
      blueprint: ['١. فيه ناس بتأثر عليك بسلبية - ابعدها بهدوء وبحب لنفسك.', '٢. مشروع مشترك بتحتاج تراجع شروطه - أنت مش وحدك المسؤول.', '٣. كلمة السر: "أنا أختار الناس والأماكن اللي بتحترمني."']
    },
    aquarius: {
      label: 'الدلو',
      emoji: '♒',
      house: 10,
      psychology: 'السمعة المهنية والمنصب - صورتك العامة محتاجة تصحيح أو قد تتأثر. شغلك أو سمعتك في تغيير - اهتم بالتفاصيل.',
      bodyAlert: 'العضو: الركبة والعظام | السبب: عدم الثقة في قوتك المهنية والخوف من الحكم | الحل: استقم بجسدك - الثقة بتظهر من الحضور الفيزيائي.',
      blueprint: ['١. راجع سيرتك الذاتية والمشاريع بتاعتك - فيه تحديث محتاج.', '٢. اتكلم مع مديرك أو زملاء بوضوح - الشفافية توديك أبعد.', '٣. كلمة السر: "سمعتي بنيّة على قيمتي الحقيقية."']
    },
    pisces: {
      label: 'الحوت',
      emoji: '♓',
      house: 9,
      psychology: 'السفر والتعليم والقانون - في حاجة متعلقة بورقة أو دراسة أو رحلة محتاج تعديل. معتقداتك تتراجع وتتغيّر - اسمح لنفسك تتعلمي.',
      bodyAlert: 'العضو: الفخذان والأعصاب | السبب: عدم وضوح الرؤية المستقبلية والخوف من الاتجاه الخاطئ | الحل: اقرا أو تعلم حاجة جديدة - المعرفة هي النور.',
      blueprint: ['١. في حاجة معلوماتية بتحتاج تتأكد منها قانونياً - اسأل خبير.', '٢. مش الوقت المناسب للسفر البعيد - أجله شوية.', '٣. كلمة السر: "أنا متعلم مدى الحياة، وحقيقتي تتطور."']
    }
  };

  /* --- عرض التوقعة في الـ UI --- */
  window.showDailyForecast = function(signKey) {
    const transit = TRANSITS[signKey];
    if (!transit) return;

    const today = new Date();
    const date = today.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const html = `
      <div class="forecast-modal-overlay" onclick="if(event.target === this) this.remove()">
        <div class="forecast-modal">
          <button class="sheet-x" onclick="this.closest('.forecast-modal-overlay').remove()">✕</button>
          <div class="forecast-content">
            <div class="forecast-header">
              <span class="forecast-emoji">${transit.emoji}</span>
              <h2>${transit.label}</h2>
              <p class="forecast-date">${date}</p>
              <p class="forecast-transit">House ${transit.house}</p>
            </div>

            <div class="forecast-sections">
              <div class="forecast-section">
                <h3>🌙 شفرة السماء</h3>
                <p>${transit.psychology}</p>
              </div>

              <div class="forecast-section">
                <h3>💫 علم النفس الجسدي</h3>
                <p>${transit.bodyAlert}</p>
              </div>

              <div class="forecast-section">
                <h3>✨ روشتة النور</h3>
                <ul class="blueprint-list">
                  ${transit.blueprint.map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const modal = document.createElement('div');
    modal.innerHTML = html;
    document.body.appendChild(modal.firstElementChild);
  };

  /* --- CSS للـ Modal --- */
  if (!document.getElementById('forecast-style')) {
    const style = document.createElement('style');
    style.id = 'forecast-style';
    style.textContent = `
      .forecast-modal-overlay {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,.85);
        display: flex; align-items: center; justify-content: center;
        z-index: 9999;
      }
      .forecast-modal {
        background: linear-gradient(135deg, #1a0e2e 0%, #16213e 100%);
        border: 1px solid #d6ae5e;
        border-radius: 16px;
        padding: 2.5rem;
        max-width: 500px;
        color: #ddd;
        position: relative;
        max-height: 85vh;
        overflow-y: auto;
      }
      .forecast-header {
        text-align: center;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #d6ae5e40;
      }
      .forecast-emoji {
        font-size: 3rem;
        display: block;
        margin-bottom: 1rem;
      }
      .forecast-header h2 {
        color: #d6ae5e;
        margin: 0.5rem 0;
        font-size: 1.8rem;
      }
      .forecast-date {
        color: #999;
        font-size: 0.95rem;
        margin: 0.5rem 0 0;
      }
      .forecast-transit {
        color: #b6bdd0;
        font-size: 0.85rem;
        margin: 0.5rem 0 0;
      }
      .forecast-sections {
        display: flex;
        flex-direction: column;
        gap: 1.8rem;
      }
      .forecast-section h3 {
        color: #d6ae5e;
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
      }
      .forecast-section p {
        margin: 0;
        line-height: 1.7;
        font-size: 0.95rem;
        color: #ccc;
      }
      .blueprint-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .blueprint-list li {
        margin: 0.8rem 0;
        padding-left: 1.5rem;
        position: relative;
        line-height: 1.6;
        font-size: 0.95rem;
      }
      .blueprint-list li::before {
        content: "✦";
        position: absolute;
        left: 0;
        color: #d6ae5e;
      }
      .sheet-x {
        position: absolute;
        top: 1.5rem;
        left: 1.5rem;
        background: none;
        border: none;
        color: #d6ae5e;
        font-size: 1.5rem;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }
})();
