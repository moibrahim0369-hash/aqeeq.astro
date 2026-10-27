/* توقعات يومية بناءً على العبورات الفعلية للكواكب
   توقعة ديناميكية تتغير كل يوم بناءً على موضع الكواكب الحالي */

(function () {
  'use strict';

  /* --- توقعات يومية عامة لكل برج (تتغير حسب العبورات) --- */
  const DAILY_FORECASTS = {
    'aries': {
      label: 'الحمل',
      emoji: '♈',
      themes: [
        'الطاقة عالية: اتحرك وابدأ الحاجة اللي مؤجلها.',
        'يوم للعمل والإنجاز. ركز على مهمة واحدة.',
        'توتر طفيف قد يظهر. خذ نفس وفكر قبل ما تتحرك.',
        'فرصة من شخص قريب. استمع أكتر.',
        'يوم للراحة والتأمل. ماتفرضش نفسك.'
      ],
      work: [
        'فرصة تبين فيها قدرتك على القيادة.',
        'اجتماع مهم أو قرار يحتاج منك.',
        'روتين وتفاصيل. ركز.',
        'تعاون جديد قد يظهر.',
        'يوم للتخطيط والاستعداد.'
      ]
    },
    'taurus': {
      label: 'الثور',
      emoji: '♉',
      themes: [
        'إيقاعك بطيء: مش لازم تلحق كل حاجة.',
        'وقت للثبات والاستقرار.',
        'تغيير صغير بيجيب بركة.',
        'علاقات قريبة بتحتاج اهتمام.',
        'يوم للراحة والاستمتاع.'
      ],
      work: [
        'تفاصيل صغيرة بتفرق: راجع شغلك.',
        'استقرار وثبات: كويس للتخطيط الطويل.',
        'تعاون وشراكة توفر عليك مجهود.',
        'روتين الشغل بيريحك.',
        'يوم للتنظيم والتنسيق.'
      ]
    },
    'gemini': {
      label: 'الجوزاء',
      emoji: '♊',
      themes: [
        'دماغك زحمة أفكار: اكتبها.',
        'وقت التواصل والحوار.',
        'رسايل واتصالات: ممكن تفتح باب.',
        'توزيع فلوسك على مشروع واحد.',
        'فضول وتعلم.'
      ],
      work: [
        'كلام وأفكار جديدة تشتغل.',
        'تواصل بسرعة: رد على الرسايل.',
        'شراكة أو تعاون يظهر.',
        'حوار يفتح فرصة.',
        'تعلم وتطوير مهارة.'
      ]
    },
    'cancer': {
      label: 'السرطان',
      emoji: '♋',
      themes: [
        'مشاعرك أوضح من العادة.',
        'اهتم بنفسك والي حواليك.',
        'وقت للأمان والاستقرار.',
        'البيت والعيلة بتحتاج اهتمام.',
        'حدسك قوي: اثق فيه.'
      ],
      work: [
        'بيئة الشغل مرتاحة.',
        'قرارك الهادي هيتسمع.',
        'استقرار في الوظيفة.',
        'فريق بيدعمك.',
        'يوم للتركيز والإنجاز.'
      ]
    },
    'leo': {
      label: 'الأسد',
      emoji: '♌',
      themes: [
        'حضورك لافت وبيشد الناس.',
        'وقت لتظهر إنجازاتك.',
        'ماتخليش الكبرياء يضيعها.',
        'اهتمام من حد جديد.',
        'اهتم بجسمك والراحة.'
      ],
      work: [
        'وقت مناسب تظهر فيه قدرتك.',
        'شارك إنجازاتك بدل الانتظار.',
        'قيادة وحضور بيفرق.',
        'تقدير من الناس.',
        'يوم للإشراق والنجاح.'
      ]
    },
    'virgo': {
      label: 'العذراء',
      emoji: '♍',
      themes: [
        'ترتيب حياتك هيريحك.',
        'دقتك هي سلاحك.',
        'ماتحاسبش نفسك على كل غلطة.',
        'أكل صحي ونوم منتظم.',
        'خدمة الناس بتملأ قلبك.'
      ],
      work: [
        'دقتك هي سلاحك الأساسي.',
        'حد هيعتمد عليك في مهمة مهمة.',
        'تنظيم وترتيب بيعطي نتايج.',
        'شرح واضح بيفتح أبواب.',
        'يوم للإتقان والدقة.'
      ]
    },
    'libra': {
      label: 'الميزان',
      emoji: '♎',
      themes: [
        'بتدور على توازن.',
        'قرارك لازم يبقى ليك إنت.',
        'علاقة محتاجة وضوح.',
        'ماتأجلش المصارحة.',
        'ذوقك هو قوتك.'
      ],
      work: [
        'شراكة أو تعاون جديد.',
        'اقرا الاتفاق كويس.',
        'توازن بين الفريق والإفراد.',
        'دبلوماسية بتحل مشاكل.',
        'يوم للعدل والتوازن.'
      ]
    },
    'scorpio': {
      label: 'العقرب',
      emoji: '♏',
      themes: [
        'حدسك قوي: اثق فيه.',
        'ماتفسرش كل صمت على إنه ضدك.',
        'عمق وصدق في العلاقات.',
        'حاجة مستخبية بتظهر.',
        'سيع الشك يروح.'
      ],
      work: [
        'بحث عميق عن الحقيقة.',
        'كشف مشكلة قديمة.',
        'تحول داخلي بينعكس على الشغل.',
        'ثقة من الفريق.',
        'يوم للتحول والقوة.'
      ]
    },
    'sagittarius': {
      label: 'القوس',
      emoji: '♐',
      themes: [
        'عايز تتحرك وتغيّر جو.',
        'صراحتك جذابة.',
        'فكرة جديدة بتفتح طريق.',
        'سفر أو حركة بتفيد.',
        'تفاؤل هو الطريق.'
      ],
      work: [
        'فكرة جديدة أو مهارة جديدة.',
        'حركة وتغيير إيجابي.',
        'صراحتك بتفتح أبواب.',
        'سفر أو توسع.',
        'يوم للنمو والتوسع.'
      ]
    },
    'capricorn': {
      label: 'الجدي',
      emoji: '♑',
      themes: [
        'شغلك المتواصل بيجيب نتيجة.',
        'خد راحة مقصودة.',
        'مسؤولية أكبر في الطريق.',
        'خطة طويلة المدى بتفيد.',
        'صبر بيجيب ثمار.'
      ],
      work: [
        'نتايج من جهد قديم.',
        'مسؤولية أكبر أو ترقية.',
        'خطة تخطيط طويلة.',
        'نظام وضبط الفريق.',
        'يوم للإنجاز والنجاح.'
      ]
    },
    'aquarius': {
      label: 'الدلو',
      emoji: '♒',
      themes: [
        'أفكارك سابقة زمانها.',
        'اشرحها ببساطة.',
        'محتاج مساحتك.',
        'مشروع مشترك بيحمّسك.',
        'فكرة غير تقليدية.'
      ],
      work: [
        'مشروع مشترك بيفرق.',
        'فكرة غير تقليدية تنجح.',
        'حد معاك هيكمّل الناقص.',
        'ابتكار وتجديد.',
        'يوم للتميز والاختلاف.'
      ]
    },
    'pisces': {
      label: 'الحوت',
      emoji: '♓',
      themes: [
        'خيالك واسع وإحساسك عالي.',
        'حط حدود عشان ماتتأثرش.',
        'مشاعر حلوة بس فكر واضح.',
        'إبداع بتعبّر عنه.',
        'حدوس وحس قوي.'
      ],
      work: [
        'الإبداع هو طريقك.',
        'حدس بيدلك للحل الصح.',
        'فن وإبداع بينجح.',
        'مشاعر الفريق مهمة.',
        'يوم للإبداع والحدس.'
      ]
    }
  };

  /* --- حساب التوقعة اليومية بناءً على اليوم --- */
  function getDailyForecast(signKey) {
    const sign = DAILY_FORECASTS[signKey];
    if (!sign) return null;

    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);

    // استخدم رقم اليوم لاختيار توقعة من القائمة
    const themeIdx = dayOfYear % sign.themes.length;
    const workIdx = dayOfYear % sign.work.length;

    return {
      label: sign.label,
      emoji: sign.emoji,
      overall: sign.themes[themeIdx],
      work: sign.work[workIdx],
      date: today.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    };
  }

  /* --- عرض التوقعة في الـ UI --- */
  window.showDailyForecast = function(signKey) {
    const forecast = getDailyForecast(signKey);
    if (!forecast) return;

    const modal = document.createElement('div');
    modal.className = 'forecast-modal';
    modal.innerHTML = `
      <div class="forecast-card">
        <button class="sheet-x" onclick="this.parentElement.parentElement.remove()">✕</button>
        <div class="forecast-header">
          <span class="forecast-emoji">${forecast.emoji}</span>
          <h2>${forecast.label}</h2>
          <p class="forecast-date">${forecast.date}</p>
        </div>
        <div class="forecast-content">
          <div class="forecast-section">
            <h3>الطاقة اليومية</h3>
            <p>${forecast.overall}</p>
          </div>
          <div class="forecast-section">
            <h3>في الشغل</h3>
            <p>${forecast.work}</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  };

  /* --- إضافة CSS للـ Modal --- */
  if (!document.getElementById('daily-forecast-style')) {
    const style = document.createElement('style');
    style.id = 'daily-forecast-style';
    style.textContent = `
      .forecast-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }
      .forecast-card {
        background: linear-gradient(135deg, #1a0e2e 0%, #16213e 100%);
        border: 1px solid #d6ae5e;
        border-radius: 12px;
        padding: 2rem;
        max-width: 400px;
        color: #ddd;
        position: relative;
      }
      .forecast-header {
        text-align: center;
        margin-bottom: 1.5rem;
      }
      .forecast-emoji {
        font-size: 2.5rem;
        display: block;
        margin-bottom: 0.5rem;
      }
      .forecast-header h2 {
        color: #d6ae5e;
        margin: 0.5rem 0;
      }
      .forecast-date {
        color: #999;
        font-size: 0.9rem;
        margin: 0;
      }
      .forecast-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .forecast-section h3 {
        color: #d6ae5e;
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
      }
      .forecast-section p {
        margin: 0;
        line-height: 1.6;
        font-size: 0.95rem;
      }
    `;
    document.head.appendChild(style);
  }
})();
