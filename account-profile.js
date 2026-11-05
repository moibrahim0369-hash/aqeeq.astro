/**
 * ============================================================================
 * AQEEQ ASTRO — PERSONAL ACCOUNT ("YOU" EXPERIENCE) & PROFILE COMPLETION
 * ============================================================================
 * يدير تجربة الحساب الشخصي بعد تسجيل الدخول (بالبريد أو Google OAuth):
 *   1. بطاقة الهوية الشخصية والفلكية (Profile Summary Card) مع صورة الحساب أو الأحرف الأولى
 *   2. استكمال الملف الشخصي الموجّه بعد الدخول عبر Google (Guided Profile Onboarding)
 *   3. الاسم الأول، اسم العائلة، والاسم المفضّل للعرض (Preferred Display Name)
 *   4. تاريخ الميلاد، وقت الميلاد (مع خيار "لا أعرف وقت ميلادي بدقة")، ومدينة/دولة الميلاد
 *   5. صورة شخصية اختيارية قابلة للتخطي مع معاينة فورية
 *   6. مزامنة فورية مع حاسبات خريطة الميلاد، مسار الحياة، ومصفوفة القدر
 */
(function () {
  var AVATAR_BUCKET = 'avatars';
  var PROFILE_COLS = 'id, first_name, last_name, birth_date, birth_time, birth_time_unknown, birth_city, birth_country, avatar_path, profile_completed_at';
  var DISMISS_KEY = 'aqeeq_profile_prompt_dismissed_v1';
  var LOCAL_CACHE_KEY = 'aqeeq_profile_cache_v1';
  var PREF_NAME_KEY = 'aqeeq_preferred_name_v1';
  var currentUser = null;
  var currentProfile = null;
  var selectedAvatarFile = null;
  var isEditingProfile = false;

  function $(id) { return document.getElementById(id); }

  // أعمدة القاعدة: avatar_path و profile_completed_at. نضيف أسماء مشتقة يستعملها باقي الكود.
  function normalizeProfile(row) {
    if (!row) return row;
    row.avatar_url = row.avatar_path || null;
    row.profile_completed = Boolean(row.profile_completed_at);
    return row;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getInitials(first, last, pref, email) {
    var source = (pref || [first, last].filter(Boolean).join(' ') || email || 'ع').trim();
    var parts = source.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + ' ' + parts[1].charAt(0)).toUpperCase();
    }
    return source.slice(0, 2).toUpperCase();
  }

  function syncWithPlatformCache(profile, prefName) {
    if (!profile || !profile.birth_date) return;
    var fullName = (prefName || [profile.first_name, profile.last_name].filter(Boolean).join(' ')).trim();
    var cachePayload = {
      name: fullName,
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      preferredName: prefName || '',
      date: profile.birth_date,
      time: profile.birth_time ? String(profile.birth_time).slice(0, 5) : '12:00',
      noTime: Boolean(profile.birth_time_unknown),
      city: profile.birth_city || '',
      country: profile.birth_country || ''
    };
    try {
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(cachePayload));
      if (prefName !== undefined) {
        localStorage.setItem(PREF_NAME_KEY, prefName);
      }
    } catch (_) {}

    // تعبئة الحقول في الحاسبات تلقائياً إن كانت فارغة
    var fName = $('f-name');
    var fDate = $('f-date');
    var fTime = $('f-time');
    var fUnk  = $('f-unknown');
    var fCity = $('f-city');
    if (fName && !fName.value && fullName) fName.value = fullName;
    if (fDate && !fDate.value && profile.birth_date) fDate.value = profile.birth_date;
    if (fTime && profile.birth_time) fTime.value = String(profile.birth_time).slice(0, 5);
    if (fUnk) fUnk.checked = Boolean(profile.birth_time_unknown);
    if (fCity && !fCity.value && profile.birth_city) fCity.value = profile.birth_city;

    var lpName = $('lp-name');
    var lpDate = $('lp-date');
    if (lpName && !lpName.value && fullName) lpName.value = fullName;
    if (lpDate && !lpDate.value && profile.birth_date) lpDate.value = profile.birth_date;

    var mName = $('m-name');
    var mDate = $('m-date');
    if (mName && !mName.value && fullName) mName.value = fullName;
    if (mDate && !mDate.value && profile.birth_date) mDate.value = profile.birth_date;

    if (window.AqeeqPlatform && typeof window.AqeeqPlatform.syncProfileToPlatform === 'function') {
      window.AqeeqPlatform.syncProfileToPlatform();
    }
  }

  function fillCountries() {
    var sel = $('profile-birth-country');
    var geo = window.AQEEQ_GEO || [];
    if (!sel || sel.options.length > 1) return;
    geo.forEach(function (c) {
      var o = document.createElement('option');
      o.value = c.name; o.textContent = c.name;
      sel.appendChild(o);
    });
  }

  function fillRegions(country, selected) {
    var sel = $('profile-birth-city');
    if (!sel) return;
    var geo = window.AQEEQ_GEO || [];
    var hit = geo.filter(function (c) { return c.name === country; })[0];
    sel.innerHTML = '';
    var first = document.createElement('option');
    first.value = ''; first.textContent = hit ? 'اختر المحافظة / الولاية' : 'اختر الدولة أولًا';
    sel.appendChild(first);
    if (hit) {
      var list = hit.regions.slice();
      // قيمة محفوظة سابقًا خارج القائمة تبقى متاحة حتى لا تضيع
      if (selected && list.indexOf(selected) === -1) list.unshift(selected);
      list.forEach(function (r) {
        var o = document.createElement('option');
        o.value = r; o.textContent = r;
        sel.appendChild(o);
      });
    }
    sel.disabled = !hit;
    sel.value = selected || '';
  }

  function setPlaceValues(city, country) {
    var cs = $('profile-birth-country');
    if (!cs) return;
    if (country && !Array.prototype.some.call(cs.options, function (o) { return o.value === country; })) {
      var o = document.createElement('option');
      o.value = country; o.textContent = country;
      cs.appendChild(o);
    }
    cs.value = country || '';
    fillRegions(country || '', city || '');
  }

  function dismissProfilePrompt() {
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch (_) {}
    location.hash = '#home';
  }

  function ensureProfileElements() {
    var userCard = $('acct-user');
    if (!userCard || $('account-profile-completion')) return;

    var section = document.createElement('section');
    section.id = 'account-profile-completion';
    section.className = 'profile-completion';
    section.hidden = true;
    section.innerHTML =
      /* 1. بطاقة الهوية الشخصية والفلكية (تظهر عند اكتمال الملف الشخصي) */
      '<div id="profile-summary-card" class="profile-summary-card" hidden>' +
        '<div class="profile-summary-top">' +
          '<div class="profile-summary-identity">' +
            '<div class="profile-avatar-circle" id="profile-summary-avatar">ع</div>' +
            '<div class="profile-summary-Titles">' +
              '<h3 id="profile-summary-name">عضو عقيق أسترو</h3>' +
              '<p id="profile-summary-email" dir="ltr"></p>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="btn ghost sm" id="profile-edit-btn">' +
            '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>' +
            '<span>تعديل البيانات الشخصية</span>' +
          '</button>' +
        '</div>' +
        '<div class="profile-summary-grid">' +
          '<div class="profile-summary-item">' +
            '<span>تاريخ الميلاد</span>' +
            '<strong id="profile-summary-date" dir="ltr">—</strong>' +
          '</div>' +
          '<div class="profile-summary-item">' +
            '<span>وقت الميلاد</span>' +
            '<strong id="profile-summary-time">—</strong>' +
          '</div>' +
          '<div class="profile-summary-item">' +
            '<span>مكان الميلاد</span>' +
            '<strong id="profile-summary-place">—</strong>' +
          '</div>' +
        '</div>' +
        '<div class="profile-quick-launch">' +
          '<span class="profile-quick-launch-label">انتقل مباشرة لقراءاتك الشخصية ببياناتك المحفوظة:</span>' +
          '<div class="profile-quick-links">' +
            '<a href="#chart" class="profile-quick-pill" data-quick-calc="chart">خريطة الميلاد</a>' +
            '<a href="#lifepath" class="profile-quick-pill" data-quick-calc="lifepath">مسار الحياة</a>' +
            '<a href="#matrix" class="profile-quick-pill" data-quick-calc="matrix">مصفوفة القدر</a>' +
            '<a href="#tarot-chamber" class="profile-quick-pill">محراب التاروت</a>' +
          '</div>' +
        '</div>' +
      '</div>' +

      /* 2. نموذج استكمال أو تعديل البيانات الشخصية والفلكية */
      '<div id="profile-form-wrapper">' +
        '<div class="profile-onboarding-banner" id="profile-onboarding-banner">' +
          '<button type="button" id="profile-close-btn" class="profile-close-btn" aria-label="إغلاق وإكمال البيانات لاحقًا"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
          '<h4>' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>' +
            '<span id="profile-banner-title">استكمال بياناتك الفلكية والشخصية</span>' +
          '</h4>' +
          '<p id="profile-banner-desc">لماذا نطلب بيانات ميلادك؟ يُستخدم <b>تاريخ الميلاد</b> لحساب برجك الشمسي ومسار حياتك ومصفوفة القدر، بينما يُستخدم <b>وقت ومكان الميلاد</b> لتحديد البرج الطالع والبيوت الاثني عشر في خريطة الميلاد (ويمكنك اختيار «لا أعرف وقت ميلادي بدقة» في أي وقت).</p>' +
        '</div>' +

        '<form id="profile-completion-form" class="cform" novalidate>' +
          '<div class="profile-photo-row">' +
            '<img id="profile-avatar-preview" class="profile-photo-preview" alt="صورة الملف الشخصي" hidden />' +
            '<div class="profile-avatar-circle" id="profile-avatar-fallback">ع</div>' +
            '<div class="profile-photo-actions">' +
              '<label for="profile-avatar-file" class="profile-photo-btn">' +
                '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>' +
                '<span>اختيار صورة شخصية (اختياري)</span>' +
              '</label>' +
              '<input id="profile-avatar-file" type="file" accept="image/*" hidden />' +
              '<span class="profile-photo-hint">يمكنك تخطي الصورة وسيتم عرض أحرف اسمك الأولى بأناقة</span>' +
            '</div>' +
          '</div>' +

          '<div class="profile-form-grid">' +
            '<div class="field">' +
              '<label for="profile-first-name">الاسم الأول *</label>' +
              '<input id="profile-first-name" type="text" maxlength="80" autocomplete="given-name" placeholder="مثال: سارة" required />' +
            '</div>' +
            '<div class="field">' +
              '<label for="profile-last-name">اسم العائلة *</label>' +
              '<input id="profile-last-name" type="text" maxlength="80" autocomplete="family-name" placeholder="مثال: المنصور" required />' +
            '</div>' +
            '<div class="field field-full">' +
              '<label for="profile-preferred-name">الاسم المفضّل للعرض في تقاريرك (اختياري)</label>' +
              '<input id="profile-preferred-name" type="text" maxlength="80" placeholder="كيف تحب أن نخاطبك داخل المنصة؟" />' +
            '</div>' +
            '<div class="field">' +
              '<label for="profile-birth-date">تاريخ الميلاد *</label>' +
              '<input id="profile-birth-date" type="date" dir="ltr" required />' +
            '</div>' +
            '<div class="field">' +
              '<label for="profile-birth-time">وقت الميلاد (للطالع والبيوت)</label>' +
              '<input id="profile-birth-time" type="time" dir="ltr" />' +
              '<label class="profile-checkbox-row" for="profile-time-unknown">' +
                '<input id="profile-time-unknown" type="checkbox" />' +
                '<span>لا أعرف وقت ميلادي بدقة (حساب خريطة شمسية)</span>' +
              '</label>' +
            '</div>' +
            '<div class="field">' +
              '<label for="profile-birth-country">دولة الميلاد *</label>' +
              '<select id="profile-birth-country" required><option value="">اختر الدولة</option></select>' +
            '</div>' +
            '<div class="field">' +
              '<label for="profile-birth-city">المحافظة / الولاية / المدينة *</label>' +
              '<select id="profile-birth-city" required disabled><option value="">اختر الدولة أولًا</option></select>' +
            '</div>' +
          '</div>' +

          '<div class="profile-privacy-note">' +
            'بيانات ميلادك محفوظة بخصوصية تامة في حسابك الشخصي فقط، وتُستخدم لتعبئة حاسباتك الفلكية وتخصيص تقاريرك دون الحاجة لإعادة إدخالها في كل مرة.' +
          '</div>' +

          '<p id="profile-msg" class="ferr" role="alert" hidden></p>' +
          '<div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:14px;">' +
            '<button id="profile-save" class="btn" type="submit" style="flex:1;">حفظ البيانات وتحديث هويتي الفلكية</button>' +
            '<button id="profile-cancel-edit" class="btn ghost" type="button" hidden>إلغاء التعديل</button>' +
          '</div>' +
        '</form>' +
      '</div>';

    var actionsStack = userCard.querySelector('.acct-actions-stack');
    if (actionsStack) {
      userCard.insertBefore(section, actionsStack);
    } else {
      userCard.appendChild(section);
    }

    fillCountries();
    $('profile-birth-country').addEventListener('change', function () { fillRegions(this.value, ''); });
    $('profile-close-btn').addEventListener('click', dismissProfilePrompt);
    $('profile-time-unknown').addEventListener('change', syncBirthTimeUnknownState);
    ($('profile-avatar-file') || $('profile-avatar')).addEventListener('change', onAvatarChanged);
    $('profile-completion-form').addEventListener('submit', onProfileSubmit);
    $('profile-edit-btn').addEventListener('click', function () {
      isEditingProfile = true;
      updateViewMode();
    });
    $('profile-cancel-edit').addEventListener('click', function () {
      isEditingProfile = false;
      updateViewMode();
    });

    // أزرار الانتقال السريع للحاسبات مع التعبئة التلقائية
    section.querySelectorAll('[data-quick-calc]').forEach(function (link) {
      link.addEventListener('click', function () {
        if (currentProfile) {
          var pref = $('profile-preferred-name') ? $('profile-preferred-name').value.trim() : '';
          syncWithPlatformCache(currentProfile, pref);
        }
      });
    });
  }

  function showProfileMsg(text, ok) {
    var msg = $('profile-msg');
    if (!msg) return;
    if (!text) {
      msg.hidden = true;
      msg.textContent = '';
      msg.classList.remove('ok');
      return;
    }
    msg.hidden = false;
    msg.textContent = text;
    msg.classList.toggle('ok', Boolean(ok));
  }

  function setProfileLoading(loading) {
    var btn = $('profile-save');
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? 'جارٍ حفظ بياناتك الفلكية...' : 'حفظ البيانات وتحديث هويتي الفلكية';
  }

  function syncBirthTimeUnknownState() {
    var unknown = $('profile-time-unknown');
    var birthTime = $('profile-birth-time');
    if (!unknown || !birthTime) return;
    if (unknown.checked) {
      birthTime.value = '';
      birthTime.disabled = true;
    } else {
      birthTime.disabled = false;
    }
  }

  function setAvatarPreview(url, initialsText) {
    var img = $('profile-avatar-preview');
    var fallback = $('profile-avatar-fallback');
    var summaryAvatar = $('profile-summary-avatar');

    if (url) {
      if (img) {
        img.src = url;
        img.hidden = false;
      }
      if (fallback) fallback.hidden = true;
      if (summaryAvatar) {
        summaryAvatar.innerHTML = '<img src="' + escapeHtml(url) + '" alt="صورة الحساب" />';
      }
    } else {
      if (img) {
        img.removeAttribute('src');
        img.hidden = true;
      }
      if (fallback) {
        fallback.hidden = false;
        fallback.textContent = initialsText || 'ع';
      }
      if (summaryAvatar) {
        summaryAvatar.textContent = initialsText || 'ع';
      }
    }
  }

  function onAvatarChanged(e) {
    var file = e.target.files && e.target.files[0];
    selectedAvatarFile = null;
    if (!file) return;
    if (!file.type || file.type.indexOf('image/') !== 0) {
      showProfileMsg('اختار ملف صورة صالح (JPG أو PNG أو WebP).');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showProfileMsg('حجم الصورة كبير. الحد الأقصى ٥ ميجابايت.');
      e.target.value = '';
      return;
    }
    selectedAvatarFile = file;
    showProfileMsg('');
    setAvatarPreview(URL.createObjectURL(file));
  }

  function splitFullName(fullName) {
    var clean = (fullName || '').trim().replace(/\s+/g, ' ');
    if (!clean) return { firstName: '', lastName: '' };
    var parts = clean.split(' ');
    return {
      firstName: parts.shift() || '',
      lastName: parts.join(' ')
    };
  }

  function isProfileComplete(profile) {
    if (!profile) return false;
    var hasFirst = Boolean((profile.first_name || '').trim());
    var hasLast = Boolean((profile.last_name || '').trim());
    var hasBirthDate = Boolean(profile.birth_date);
    var hasCity = Boolean((profile.birth_city || '').trim());
    var hasCountry = Boolean((profile.birth_country || '').trim());
    var hasTimeChoice = Boolean(profile.birth_time_unknown) || Boolean(profile.birth_time);
    return Boolean(profile.profile_completed) && hasFirst && hasLast && hasBirthDate && hasCity && hasCountry && hasTimeChoice;
  }

  function updateViewMode() {
    var summaryCard = $('profile-summary-card');
    var formWrapper = $('profile-form-wrapper');
    var cancelBtn = $('profile-cancel-edit');
    var bannerTitle = $('profile-banner-title');
    if (!summaryCard || !formWrapper) return;

    var complete = isProfileComplete(currentProfile);
    if (complete && !isEditingProfile) {
      summaryCard.hidden = false;
      formWrapper.hidden = true;
    } else {
      summaryCard.hidden = true;
      formWrapper.hidden = false;
      if (cancelBtn) cancelBtn.hidden = !complete;
      if (bannerTitle) {
        bannerTitle.textContent = complete
          ? 'تعديل بياناتك الشخصية والفلكية'
          : 'أهلاً بك في عقيق أسترو · استكمال ملفك الفلكي';
      }
    }
  }

  function fillProfileForm(profile, user) {
    var meta = (user && user.user_metadata) || {};
    var split = splitFullName(meta.full_name || meta.name || '');
    var first = (profile && profile.first_name) || meta.first_name || split.firstName || '';
    var last = (profile && profile.last_name) || meta.last_name || split.lastName || '';
    var storedPref = '';
    try { storedPref = localStorage.getItem(PREF_NAME_KEY) || ''; } catch (_) {}
    var pref = meta.preferred_name || storedPref || '';

    $('profile-first-name').value = first;
    $('profile-last-name').value = last;
    if ($('profile-preferred-name')) $('profile-preferred-name').value = pref;
    $('profile-birth-date').value = (profile && profile.birth_date) || '';
    $('profile-birth-time').value = (profile && profile.birth_time ? String(profile.birth_time).slice(0, 5) : '');
    $('profile-time-unknown').checked = Boolean(profile && profile.birth_time_unknown);
    setPlaceValues(profile && profile.birth_city, profile && profile.birth_country);

    var initials = getInitials(first, last, pref, user && user.email);
    setAvatarPreview((profile && profile.avatar_url) || meta.avatar_url || meta.picture || '', initials);
    syncBirthTimeUnknownState();

    // تحديث بطاقة الملخص الشخصي
    var displayTitle = pref || [first, last].filter(Boolean).join(' ').trim() || (user && user.email) || 'عضو عقيق أسترو';
    if ($('profile-summary-name')) $('profile-summary-name').textContent = displayTitle;
    if ($('profile-summary-email')) $('profile-summary-email').textContent = (user && user.email) || '';
    if ($('profile-summary-date')) $('profile-summary-date').textContent = (profile && profile.birth_date) || 'غير محدد';
    if ($('profile-summary-time')) {
      $('profile-summary-time').textContent = (profile && profile.birth_time_unknown)
        ? 'وقت غير محدد (خريطة شمسية)'
        : ((profile && profile.birth_time ? String(profile.birth_time).slice(0, 5) : 'غير محدد'));
    }
    if ($('profile-summary-place')) {
      var placeStr = [profile && profile.birth_city, profile && profile.birth_country].filter(Boolean).join('، ');
      $('profile-summary-place').textContent = placeStr || 'غير محدد';
    }

    if (profile && profile.birth_date) {
      syncWithPlatformCache(profile, pref);
    }
  }

  function applyCompletionGate(profile) {
    var complete = isProfileComplete(profile);
    var actions = $('profile-summary-actions') || $('account-actions') || { hidden: false };
    actions.hidden = !complete;
    var buyBtn = $('acct-buy');
    var reportBtn = $('acct-generate-report');
    var userCard = $('acct-user');

    if (userCard) {
      userCard.setAttribute('data-profile-complete', complete ? 'true' : 'false');
    }
    if (buyBtn) {
      buyBtn.disabled = !complete;
      buyBtn.title = complete ? '' : 'أكمل بيانات ملفك الشخصي أولًا';
    }
    if (reportBtn && !complete) {
      reportBtn.disabled = true;
    }
    updateViewMode();
  }

  async function ensureInitialProfileRow(user) {
    var sb = window.aqeeqSupabase;
    var meta = user.user_metadata || {};
    var split = splitFullName(meta.full_name || meta.name || '');
    var payload = {
      id: user.id,
      first_name: meta.first_name || split.firstName || null,
      last_name: meta.last_name || split.lastName || null,
      avatar_path: meta.avatar_url || meta.picture || null
    };

    var res = await sb
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select(PROFILE_COLS)
      .single();

    if (res.error) throw res.error;
    return normalizeProfile(res.data);
  }

  async function fetchOrCreateProfile(user) {
    var sb = window.aqeeqSupabase;
    var res = await sb
      .from('profiles')
      .select(PROFILE_COLS)
      .eq('id', user.id)
      .maybeSingle();

    if (res.error) throw res.error;
    if (res.data) return normalizeProfile(res.data);
    return ensureInitialProfileRow(user);
  }

  async function uploadAvatarIfNeeded(user) {
    if (!selectedAvatarFile) {
      return (currentProfile && currentProfile.avatar_url) || (user.user_metadata && (user.user_metadata.avatar_url || user.user_metadata.picture)) || null;
    }

    var sb = window.aqeeqSupabase;
    var file = selectedAvatarFile;
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Avatar file size exceeds 5MB limit');
    }
    var ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    var path = user.id + '/avatar-' + Date.now() + '.' + ext;
    var uploadRes = await sb.storage.from('avatars').upload(path, selectedAvatarFile, {
      cacheControl: '3600',
      upsert: true,
      contentType: selectedAvatarFile.type
    });

    if (uploadRes.error) throw uploadRes.error;
    var pub = sb.storage.from(AVATAR_BUCKET).getPublicUrl(path);
    return pub && pub.data ? pub.data.publicUrl : null;
  }

  async function onProfileSubmit(e) {
    e.preventDefault();
    if (!currentUser || !window.aqeeqSupabase) return;
    showProfileMsg('');

    var firstName = $('profile-first-name').value.trim();
    var lastName = $('profile-last-name').value.trim();
    var preferredName = $('profile-preferred-name') ? $('profile-preferred-name').value.trim() : '';
    var birthDate = $('profile-birth-date').value;
    var birthTimeUnknown = $('profile-time-unknown').checked;
    var birthTime = birthTimeUnknown ? null : ($('profile-birth-time').value || null);
    var birthCity = $('profile-birth-city').value.trim();
    var birthCountry = $('profile-birth-country').value.trim();

    if (!firstName || !lastName) {
      showProfileMsg('يرجى كتابة الاسم الأول واسم العائلة.');
      return;
    }
    if (!birthDate) {
      showProfileMsg('يرجى اختيار تاريخ الميلاد لحساب هويتك الفلكية.');
      return;
    }
    if (!birthTimeUnknown && !birthTime) {
      showProfileMsg('يرجى إدخال وقت الميلاد أو تفعيل خيار «لا أعرف وقت ميلادي بدقة».');
      return;
    }
    if (!birthCity || !birthCountry) {
      showProfileMsg('يرجى اختيار دولة الميلاد ثم المحافظة أو المدينة.');
      return;
    }

    setProfileLoading(true);
    try {
      var avatarUrl = await uploadAvatarIfNeeded(currentUser);
      var timeUnknown = birthTimeUnknown;
      var res = await window.aqeeqSupabase
        .from('profiles')
        .upsert({ id: currentUser.id, first_name: firstName, last_name: lastName, birth_date: birthDate, birth_time: birthTime, birth_time_unknown: timeUnknown, birth_city: birthCity, birth_country: birthCountry, avatar_path: avatarUrl, profile_completed_at: new Date().toISOString(), updated_at: new Date().toISOString() }, { onConflict: 'id' })
        .select(PROFILE_COLS)
        .single();

      if (res.error) throw res.error;

      // حفظ الاسم المفضّل في بيانات المستخدم المحلية وبيانات الجلسة
      try {
        localStorage.setItem(PREF_NAME_KEY, preferredName);
        if (preferredName && window.aqeeqSupabase.auth && typeof window.aqeeqSupabase.auth.updateUser === 'function') {
          window.aqeeqSupabase.auth.updateUser({ data: { preferred_name: preferredName } }).catch(function () {});
        }
      } catch (_) {}

      currentProfile = normalizeProfile(res.data);
      selectedAvatarFile = null;
      isEditingProfile = false;
      fillProfileForm(currentProfile, currentUser);
      applyCompletionGate(currentProfile);
      showProfileMsg('تم حفظ ملفك الشخصي وتحديث هويتك الفلكية بنجاح.', true);
    } catch (err) {
      console.error('Profile completion save failed:', err);
      showProfileMsg('تعذر حفظ البيانات حاليًا. تحقق من اتصالك وحاول مرة أخرى.');
    } finally {
      setProfileLoading(false);
    }
  }

  async function handleUserSession(session) {
    ensureProfileElements();
    var section = $('account-profile-completion');
    if (!section) return;

    var user = session && session.user ? session.user : null;
    currentUser = user;
    selectedAvatarFile = null;

    if (!user) {
      currentProfile = null;
      section.hidden = true;
      return;
    }

    section.hidden = false;
    showProfileMsg('');
    try {
      currentProfile = await fetchOrCreateProfile(user);
      isEditingProfile = !isProfileComplete(currentProfile);
      fillProfileForm(currentProfile, user);
      applyCompletionGate(currentProfile);

      var dismissed = false;
      try { dismissed = sessionStorage.getItem(DISMISS_KEY) === '1'; } catch (_) {}
      if (!isProfileComplete(currentProfile) && !dismissed && location.hash !== '#account') {
        location.hash = '#account';
      }
    } catch (err) {
      console.error('Failed to load profile completion state:', err);
      fillProfileForm(null, user);
      applyCompletionGate(null);
      showProfileMsg('تعذر تحميل بيانات الملف الشخصي. يرجى المحاولة مرة أخرى.');
    }
  }

  function initProfileCompletion() {
    if (!window.aqeeqSupabase) return;
    ensureProfileElements();

    window.aqeeqSupabase.auth.getSession().then(function (res) {
      var session = res && res.data ? res.data.session : null;
      handleUserSession(session);
    });

    window.aqeeqSupabase.auth.onAuthStateChange(function (_event, session) {
      handleUserSession(session);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileCompletion);
  } else {
    initProfileCompletion();
  }
})();
