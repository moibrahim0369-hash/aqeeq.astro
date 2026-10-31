import { supabase } from './supabase-client.js';

(() => {
  'use strict';

  const account = document.querySelector('#acct-user');
  if (!account) return;

  const actions = account.querySelector('.acct-actions-stack');
  const header = account.querySelector('.acct-user-header');
  if (!actions || !header) return;

  const panel = document.createElement('section');
  panel.className = 'profile-completion';
  panel.innerHTML = `
    <div class="profile-completion-heading">
      <div>
        <span class="profile-eyebrow">YOUR COSMIC PROFILE</span>
        <h3>كمّل ملفك الشخصي</h3>
        <p>بيانات الميلاد هتساعدنا نربط حسابك بقراءاتك وخرائطك.</p>
      </div>
      <div class="profile-avatar" aria-hidden="true"><span>✧</span></div>
    </div>
    <form id="profile-completion-form" novalidate>
      <div class="profile-avatar-row">
        <label class="profile-avatar-upload" for="profile-avatar-file">إضافة صورة شخصية</label>
        <input id="profile-avatar-file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden>
        <span id="profile-avatar-status" class="profile-help">اختياري، حتى 5 ميجابايت</span>
      </div>
      <div class="profile-form-grid">
        <label>الاسم الأول<input id="profile-first-name" name="first_name" maxlength="80" autocomplete="given-name" required></label>
        <label>اسم العائلة<input id="profile-last-name" name="last_name" maxlength="80" autocomplete="family-name" required></label>
        <label class="profile-wide">تاريخ الميلاد<input id="profile-birth-date" name="birth_date" type="date" min="1900-01-01" required></label>
        <label class="profile-wide">وقت الميلاد<input id="profile-birth-time" name="birth_time" type="time"></label>
        <label class="profile-unknown-time profile-wide">
          <input id="profile-time-unknown" type="checkbox">
          <span>مش عارف وقت ميلادي</span>
        </label>
        <label>مدينة الميلاد<input id="profile-birth-city" name="birth_city" maxlength="120" autocomplete="address-level2" required placeholder="مثال: القاهرة"></label>
        <label>الدولة<input id="profile-birth-country" name="birth_country" maxlength="120" autocomplete="country-name" required placeholder="مثال: مصر"></label>
      </div>
      <p id="profile-form-message" class="profile-form-message" role="status" aria-live="polite" hidden></p>
      <button class="btn profile-save-button" id="profile-save-button" type="submit">حفظ واستكمال الحساب</button>
    </form>
  `;

  header.insertAdjacentElement('afterend', panel);
  panel.hidden = true;
  actions.hidden = true;
  const form = panel.querySelector('#profile-completion-form');
  const saveButton = panel.querySelector('#profile-save-button');
  const message = panel.querySelector('#profile-form-message');
  const timeInput = panel.querySelector('#profile-birth-time');
  const unknownTime = panel.querySelector('#profile-time-unknown');
  const avatarInput = panel.querySelector('#profile-avatar-file');
  const avatarStatus = panel.querySelector('#profile-avatar-status');
  let currentUser = null;
  let profile = null;
  let avatarChanged = false;

  const showMessage = (text, ok = false) => {
    message.textContent = text;
    message.hidden = !text;
    message.dataset.state = ok ? 'success' : 'error';
  };
  const setBusy = busy => {
    saveButton.disabled = busy;
    saveButton.textContent = busy ? 'جارٍ الحفظ…' : 'حفظ واستكمال الحساب';
  };
  const isComplete = row => Boolean(
    row?.first_name?.trim()
    && row?.last_name?.trim()
    && row?.birth_date
    && row?.birth_city?.trim()
    && row?.birth_country?.trim()
    && (row.birth_time_unknown || row.birth_time)
  );

  unknownTime.addEventListener('change', () => {
    timeInput.disabled = unknownTime.checked;
    if (unknownTime.checked) timeInput.value = '';
  });

  async function loadProfile(user) {
    currentUser = user;
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, first_name, last_name, birth_date, birth_time, birth_time_unknown, birth_city, birth_country, avatar_path, profile_completed_at')
      .eq('id', user.id)
      .maybeSingle();
    if (error) throw error;
    profile = data || null;

    panel.querySelector('#profile-first-name').value = profile?.first_name || '';
    panel.querySelector('#profile-last-name').value = profile?.last_name || '';
    panel.querySelector('#profile-birth-date').value = profile?.birth_date || '';
    timeInput.value = profile?.birth_time ? String(profile.birth_time).slice(0, 5) : '';
    unknownTime.checked = profile?.birth_time_unknown === true;
    timeInput.disabled = unknownTime.checked;
    panel.querySelector('#profile-birth-city').value = profile?.birth_city || '';
    panel.querySelector('#profile-birth-country').value = profile?.birth_country || '';

    const avatar = panel.querySelector('.profile-avatar');
    if (profile?.avatar_path) {
      const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(profile.avatar_path);
      if (publicData?.publicUrl) {
        avatar.innerHTML = '';
        const img = document.createElement('img');
        img.src = publicData.publicUrl;
        img.alt = 'الصورة الشخصية';
        avatar.append(img);
      }
    }

    const complete = isComplete(profile);
    panel.hidden = false;
    actions.hidden = !complete;
    panel.classList.toggle('profile-is-complete', complete);
    saveButton.textContent = complete ? 'حفظ التعديلات' : 'حفظ واستكمال الحساب';
    if (complete) showMessage('ملفك مكتمل. تقدر تعدّل بياناتك في أي وقت.', true);
  }

  avatarInput.addEventListener('change', async () => {
    const file = avatarInput.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type) || file.size > 5 * 1024 * 1024) {
      avatarInput.value = '';
      avatarStatus.textContent = 'اختار صورة JPG أو PNG أو WebP أو AVIF بحجم أقل من 5 ميجابايت.';
      return;
    }
    if (!currentUser) return;
    avatarStatus.textContent = 'جارٍ رفع الصورة…';
    const extension = ({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif'})[file.type];
    const path = `${currentUser.id}/avatar.${extension}`;
    const { error } = await supabase.storage.from('avatars').upload(path, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: '3600'
    });
    if (error) {
      avatarStatus.textContent = 'تعذر رفع الصورة. جرّب صورة أخرى.';
      return;
    }
    const { error: updateError } = await supabase.from('profiles')
      .update({ avatar_path: path, updated_at: new Date().toISOString() })
      .eq('id', currentUser.id);
    if (updateError) {
      avatarStatus.textContent = 'الصورة اترفعت لكن تعذر حفظ ربطها بالحساب.';
      return;
    }
    profile = { ...(profile || {}), avatar_path: path };
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const avatar = panel.querySelector('.profile-avatar');
    avatar.innerHTML = '';
    const img = document.createElement('img');
    img.src = data.publicUrl;
    img.alt = 'الصورة الشخصية';
    avatar.append(img);
    avatarStatus.textContent = 'تم تحديث الصورة الشخصية.';
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    showMessage('');
    if (!currentUser) return showMessage('سجّل الدخول الأول.');
    const firstName = panel.querySelector('#profile-first-name').value.trim();
    const lastName = panel.querySelector('#profile-last-name').value.trim();
    const birthDate = panel.querySelector('#profile-birth-date').value;
    const birthCity = panel.querySelector('#profile-birth-city').value.trim();
    const birthCountry = panel.querySelector('#profile-birth-country').value.trim();
    const timeUnknown = unknownTime.checked;
    const birthTime = timeUnknown ? null : timeInput.value;

    if (!firstName || !lastName || !birthDate || !birthCity || !birthCountry || (!timeUnknown && !birthTime)) {
      return showMessage('كمّل الاسم وتاريخ الميلاد ومدينة ودولة الميلاد، وحدد وقت الميلاد أو اختار إنك مش عارفه.');
    }
    if (birthDate > new Date().toISOString().slice(0, 10)) {
      return showMessage('تاريخ الميلاد مينفعش يكون في المستقبل.');
    }

    setBusy(true);
    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
        birth_date: birthDate,
        birth_time: birthTime,
        birth_time_unknown: timeUnknown,
        birth_city: birthCity,
        birth_country: birthCountry,
        profile_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase.from('profiles')
        .upsert({ id: currentUser.id, ...payload }, { onConflict: 'id' });
      if (error) throw error;
      profile = { ...(profile || {}), ...payload };
      actions.hidden = false;
      panel.classList.add('profile-is-complete');
      saveButton.textContent = 'حفظ التعديلات';
      showMessage('تم حفظ ملفك بنجاح. حسابك جاهز دلوقتي.', true);
    } catch (error) {
      showMessage('حصلت مشكلة أثناء الحفظ. راجع اتصالك وحاول تاني.');
    } finally {
      setBusy(false);
    }
  });

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || !session?.user) {
      currentUser = null;
      profile = null;
      panel.hidden = true;
      actions.hidden = false;
      return;
    }
    if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') {
      loadProfile(session.user).catch(() => {
        panel.hidden = false;
        actions.hidden = true;
        showMessage('مش قادرين نحمّل ملفك دلوقتي. حدّث الصفحة وحاول تاني.');
      });
    }
  });

  supabase.auth.getSession().then(({ data }) => {
    if (data.session?.user) loadProfile(data.session.user).catch(() => {
      panel.hidden = false;
      actions.hidden = true;
      showMessage('مش قادرين نحمّل ملفك دلوقتي. حدّث الصفحة وحاول تاني.');
    });
  });
})();
