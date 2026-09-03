(() => {
  const timeDisplay = document.getElementById('timeDisplay');
  const timerTitle = document.getElementById('timerTitle');
  const timerMessage = document.getElementById('timerMessage');
  const secondaryLabel = document.getElementById('secondaryLabel');
  const secondaryDisplay = document.getElementById('secondaryDisplay');
  const nextEventLabel = document.getElementById('nextEventLabel');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const manualBellBtn = document.getElementById('manualBellBtn');
  const manualBellCountInput = document.getElementById('manualBellCount');
  const bellVolumeInput = document.getElementById('bellVolume');
  const bellVolumeValue = document.getElementById('bellVolumeValue');
  const clearSavedSettingsBtn = document.getElementById('clearSavedSettingsBtn');
  const clearLocalDataBtn = document.getElementById('clearLocalDataBtn');
  const exportSettingsBtn = document.getElementById('exportSettingsBtn');
  const importSettingsBtn = document.getElementById('importSettingsBtn');
  const importSettingsFile = document.getElementById('importSettingsFile');
  const fileSaveStatus = document.getElementById('fileSaveStatus');
  const eventRows = document.getElementById('eventRows');
  const addEventBtn = document.getElementById('addEventBtn');
  const timelineBar = document.getElementById('timelineBar');
  const timelineProgress = document.getElementById('timelineProgress');
  const timelineMarker = document.getElementById('timelineMarker');
  const eventMarkers = document.getElementById('eventMarkers');
  const startLabel = document.getElementById('startLabel');
  const endLabel = document.getElementById('endLabel');
  const enableTimelineControl = document.getElementById('enableTimelineControl');
  const settingsShell = document.getElementById('settingsShell');
  const settingsToggle = document.getElementById('settingsToggle');
  const saveSettingsCheckbox = document.getElementById('saveSettings');
  const templateList = document.getElementById('templateList');
  const templateHint = document.getElementById('templateHint');
  const addTemplateBtn = document.getElementById('addTemplateBtn');
  const templateLauncher = document.getElementById('templateLauncher');
  const eventGroup = document.querySelector('.event-group');
  const settingsGroups = [...document.querySelectorAll('.settings-group')];
  const basicGroup = document.getElementById('basicGroupHeading')?.closest('.settings-group') || null;
  const templatesGroup = document.getElementById('templatesGroupHeading')?.closest('.settings-group') || null;
  const countModeInputs = document.querySelectorAll('input[name="countMode"]');
  const themeModeInputs = document.querySelectorAll('input[name="themeMode"]');
  const languageModeInputs = document.querySelectorAll('input[name="languageMode"]');

  const DEFAULT_EVENTS_EN = [
    { time: 0,  bell: 0, skipForCountdown: false, title: 'Presentation', message: 'Presentation in progress', sessionEnd: false },
    { time: 9,  bell: 1, skipForCountdown: true,  title: '1st Bell', message: '1 minute remaining', sessionEnd: false },
    { time: 10, bell: 2, skipForCountdown: false, title: 'Q&A', message: 'Q&A time', sessionEnd: false },
    { time: 15, bell: 3, skipForCountdown: false, title: 'Session End', message: 'Session ended', sessionEnd: true },
    { time: 18, bell: 4, skipForCountdown: true,  title: 'OT Alert', message: '3 minutes overtime', sessionEnd: false }
  ];
  const DEFAULT_EVENTS_JA = [
    { time: 0,  bell: 0, skipForCountdown: false, title: '発表', message: '発表中', sessionEnd: false },
    { time: 9,  bell: 1, skipForCountdown: true,  title: '1ベル', message: '残り1分', sessionEnd: false },
    { time: 10, bell: 2, skipForCountdown: false, title: '質疑応答', message: '質疑応答', sessionEnd: false },
    { time: 15, bell: 3, skipForCountdown: false, title: 'セッション終了', message: 'セッション終了です', sessionEnd: true },
    { time: 18, bell: 4, skipForCountdown: true,  title: '超過警告', message: '3分超過', sessionEnd: false }
  ];
  function defaultEventsFor(lang) { return lang === 'ja' ? DEFAULT_EVENTS_JA : DEFAULT_EVENTS_EN; }
  function freshDefaultEvents(lang) { return defaultEventsFor(lang).map((e, i) => ({ ...e, id: makeId(i) })); }
  function matchesDefaultPreset(list, preset) {
    if (!Array.isArray(list) || list.length !== preset.length) return false;
    return list.every((ev, i) => {
      const d = preset[i];
      return eventTimeToSeconds(ev.time) === eventTimeToSeconds(d.time)
        && bellNum(ev.bell) === bellNum(d.bell)
        && !!ev.skipForCountdown === !!d.skipForCountdown
        && String(ev.title ?? '') === d.title
        && String(ev.message ?? '') === d.message
        && !!ev.sessionEnd === !!d.sessionEnd;
    });
  }
  function isUntouchedDefault(list = events) {
    return matchesDefaultPreset(list, DEFAULT_EVENTS_EN) || matchesDefaultPreset(list, DEFAULT_EVENTS_JA);
  }

  let events = freshDefaultEvents('en');
  let running = false;
  let elapsedBeforeStart = 0;
  let startedAt = null;
  let timerHandle = null;
  let fired = new Set();
  let audioCtx = null;
  let draggingTimeline = false;
  let wakeLock = null;
  let language = 'en';

  const SETTINGS_KEY = 'presentationTimerSettingsV47';
  const TEMPLATES_KEY = 'presentationTimerTemplatesV12';
  const TEMPLATE_COUNT_KEY = `${TEMPLATES_KEY}_count`;
  const MAX_TEMPLATES = 6;
  const TEMPLATE_SLOT_KEY = i => `${TEMPLATES_KEY}_slot_${i}`;

  const i18n = {
    en: {
      settings:'Settings', basic:'General', templates:'Templates', events:'Schedule', count:'Count:', down:'Down', up:'Up', theme:'Theme:', light:'Light', dark:'Dark', highContrast:'High Contrast', paper:'Paper', matrix:'Matrix', tokyoNight:'Tokyo Night', cyberpunk:'Cyberpunk', solarized:'Solarized', language:'Language:',
      save:'Auto-save in browser', saveFile:'Save Settings', loadFile:'Load Settings', timelineControl:'Enable timeline control', templateEdit:'Edit', templateRegister:'Save', templateEmpty:'Not saved', templateEditing:'Editing', templateReady:'Saved', templateHint:'Press Edit to modify a template.\nPress Save to save it before using the timer.\nYou can create up to 6 templates.', templateSlot:'Template', templateAdd:'＋ Add Template', templateDelete:'Delete', templateDuplicate:'Duplicate', templatesMain:'Templates', manualBell:'Manual bell count', bellVolume:'Bell volume', previewEvent:'Preview event', switchRunningConfirm:'The timer is running. Switch templates and reset the timer?', clear:'Restore Defaults', clearLocal:'Clear Local Data',
      timeCol:'Time (min.sec)', bellCol:'Bell count', skipForCountdownCol:'Skip for Countdown', titleCol:'Title', messageCol:'Message', sessionEndCol:'Session End', actionsCol:'Order', addEvent:'＋ Add Event',
      hint:'Time is measured from the timer start. Enter 1.30 for 1 min 30 sec. Arrow controls change the value by 1 minute.<br>Skip for Countdown: the event still works, but is ignored as a countdown target.<br>Session End: sets the scheduled end. After this time, the timer automatically switches to overtime. Later alert events still work but are not shown beyond the timeline end.<br>Bell count 0 means no bell.', elapsed:'Elapsed', remaining:'Remaining', overtimeTime:'Overtime', next:'Next', noMore:'No more scheduled events',
      start:'Start', pause:'Pause', reset:'Reset', fullscreen:'Fullscreen', exitFullscreen:'Exit Fullscreen', ring:'Ring', min:'min',
      defaultTitle:'Timer', defaultMessage:'Waiting for the first event'
    },
    ja: {
      settings:'設定', basic:'一般', templates:'テンプレート', events:'スケジュール', count:'表示:', down:'残り時間', up:'経過時間', theme:'テーマ:', light:'Light', dark:'Dark', highContrast:'High Contrast', paper:'Paper', matrix:'Matrix', tokyoNight:'Tokyo Night', cyberpunk:'Cyberpunk', solarized:'Solarized', language:'言語:',
      save:'ブラウザに自動保存', saveFile:'設定を保存', loadFile:'設定を読込', timelineControl:'タイムライン操作を有効化', templateEdit:'編集', templateRegister:'保存', templateEmpty:'未保存', templateEditing:'編集中', templateReady:'保存済み', templateHint:'編集を押すとテンプレートを変更できます。\n保存するとタイマーで使用できるようになります。\nテンプレートは最大6つまで作成できます。', templateSlot:'テンプレート', templateAdd:'＋ テンプレートを追加', templateDelete:'削除', templateDuplicate:'複製', templatesMain:'テンプレート', manualBell:'手動ベル回数', bellVolume:'ベル音量', previewEvent:'イベントをプレビュー', switchRunningConfirm:'タイマーが動作中です。テンプレートを切り替えてタイマーをリセットしますか？', clear:'デフォルトに戻す', clearLocal:'ローカルデータを消去',
      timeCol:'時間（分.秒）', bellCol:'ベル回数', skipForCountdownCol:'カウント対象外', titleCol:'タイトル', messageCol:'メッセージ', sessionEndCol:'セッション終了', actionsCol:'順番', addEvent:'＋ イベントを追加',
      hint:'時間はタイマー開始からの経過時間です。1.30 と入力すると1分30秒です。矢印操作は1分単位です。<br>カウント対象外：イベント自体は動作しますが、カウントダウンの基準から除外します。<br>セッション終了：チェックしたイベントが予定終了時刻になります。この時刻を超えると自動で超過表示になります。それ以降のアラートイベントも動作しますが、タイムライン終端より後には表示しません。<br>ベル回数を0にすると鳴りません。', elapsed:'経過', remaining:'残り', overtimeTime:'超過', next:'次', noMore:'この先のイベントはありません',
      start:'開始', pause:'一時停止', reset:'リセット', fullscreen:'全画面', exitFullscreen:'全画面を終了', ring:'ベルを鳴らす', min:'分',
      defaultTitle:'タイマー', defaultMessage:'最初のイベントを待っています'
    }
  };

  function t(key) { return i18n[language][key] ?? i18n.en[key] ?? key; }
  function makeId(seed='') { return 'ev_' + Date.now().toString(36) + '_' + seed + '_' + Math.random().toString(36).slice(2,8); }
  function num(v, fallback=0) { const n = Number(v); return Number.isFinite(n) ? Math.max(0, n) : fallback; }
  function bellNum(v) { return Math.max(0, Math.min(99, Math.floor(num(v, 0)))); }
  // Event time uses M.SS notation: 1.30 = 1 minute 30 seconds.
  function eventTimeToSeconds(v) {
    const raw = String(v ?? '').trim();
    if (!raw) return 0;
    const match = raw.match(/^(\d+)(?:[.:](\d{0,2}))?$/);
    if (!match) return 0;
    let minutes = Number(match[1]) || 0;
    let seconds = match[2] ? Number(match[2]) || 0 : 0;
    if (seconds >= 60) { minutes += Math.floor(seconds / 60); seconds %= 60; }
    return minutes * 60 + seconds;
  }
  function secondsToEventTime(seconds) {
    const total = Math.max(0, Math.round(Number(seconds) || 0));
    const minutes = Math.floor(total / 60);
    const secs = total % 60;
    return secs ? `${minutes}.${String(secs).padStart(2,'0')}` : String(minutes);
  }
  function eventTimeLabel(v) {
    const sec = eventTimeToSeconds(v);
    return sec % 60 === 0 ? `${Math.floor(sec/60)} ${t('min')}` : `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
  }
  function getCountMode() { return document.querySelector('input[name="countMode"]:checked')?.value || 'down'; }
  function getElapsed() { return elapsedBeforeStart + (running ? (performance.now() - startedAt) / 1000 : 0); }
  function formatTime(seconds) { const s = Math.max(0, Math.floor(seconds)); return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0'); }
  function sortedEvents() { return [...events].sort((a,b) => eventTimeToSeconds(a.time)-eventTimeToSeconds(b.time) || events.indexOf(a)-events.indexOf(b)); }
  function scheduleEndSeconds() {
    const s = sortedEvents();
    const marked = s.find(ev => ev.sessionEnd);
    return marked ? eventTimeToSeconds(marked.time) : (s.length ? eventTimeToSeconds(s[s.length-1].time) : 0);
  }

  function normalizeSessionEnd(preferredId = null) {
    if (!events.length) {
      events.push({time:0,bell:0,skipForCountdown:false,title:'New Event',message:'',sessionEnd:true,id:makeId('fallback')});
      return;
    }
    let chosen = preferredId ? events.find(ev => ev.id === preferredId) : null;
    if (!chosen) chosen = events.find(ev => ev.sessionEnd);
    if (!chosen) {
      const sorted = sortedEvents();
      chosen = sorted[sorted.length - 1];
    }
    events.forEach(ev => { ev.sessionEnd = ev.id === chosen.id; });
    chosen.skipForCountdown = false;
  }

  function renderEventRows() {
    eventRows.innerHTML = '';
    events.forEach((ev, index) => {
      const tr = document.createElement('tr');
      tr.className = 'event-row';
      tr.dataset.id = ev.id;
      tr.innerHTML = `
        <td><input class="event-time" type="number" min="0" step="1" inputmode="decimal" value="${escapeAttr(ev.time)}" aria-label="Time in minutes and seconds; 1.30 means 1 minute 30 seconds"></td>
        <td><input class="event-bell" type="number" min="0" max="99" step="1" inputmode="numeric" value="${escapeAttr(ev.bell)}" aria-label="Bell count"></td>
        <td class="event-skip-for-countdown-cell"><input class="event-skip-for-countdown" type="checkbox" ${ev.skipForCountdown ? 'checked' : ''} aria-label="Skip for countdown"></td>
        <td><input class="event-title" type="text" value="${escapeAttr(ev.title)}" aria-label="Title" ${ev.id === sortedEvents()[0]?.id ? 'required placeholder="Required"' : 'placeholder="Optional — keeps previous title"'}></td>
        <td><input class="event-message" type="text" value="${escapeAttr(ev.message)}" aria-label="Message"></td>
        <td class="event-session-end-cell"><input class="event-session-end" type="checkbox" ${ev.sessionEnd ? 'checked' : ''} aria-label="Session end"></td>
        <td><div class="event-actions">
          <button type="button" class="preview-event" title="${escapeAttr(t('previewEvent'))}" aria-label="${escapeAttr(t('previewEvent'))}">▶</button>
          <button type="button" class="move-up" title="Move up" aria-label="Move up">↑</button>
          <button type="button" class="move-down" title="Move down" aria-label="Move down">↓</button>
          <button type="button" class="delete-event" title="Delete" aria-label="Delete">×</button>
        </div></td>`;
      tr.querySelector('.move-up').disabled = index === 0;
      tr.querySelector('.move-down').disabled = index === events.length - 1;
      tr.querySelector('.delete-event').disabled = events.length === 1;
      eventRows.appendChild(tr);
    });
    renderTimelineMarkers();
  }

  function escapeAttr(value) {
    return String(value ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function syncEventsFromDom() {
    const byId = new Map(events.map(e => [e.id, e]));
    [...eventRows.querySelectorAll('.event-row')].forEach(row => {
      const ev = byId.get(row.dataset.id);
      if (!ev) return;
      ev.time = secondsToEventTime(eventTimeToSeconds(row.querySelector('.event-time').value));
      ev.bell = bellNum(row.querySelector('.event-bell').value);
      ev.skipForCountdown = row.querySelector('.event-skip-for-countdown').checked;
      ev.title = row.querySelector('.event-title').value;
      ev.message = row.querySelector('.event-message').value;
      ev.sessionEnd = row.querySelector('.event-session-end').checked;
    });
  }

  function ensureInitialTitle() {
    const first = sortedEvents()[0];
    if (!first) return;
    if (!String(first.title ?? '').trim()) {
      first.title = language === 'ja' ? 'プレゼンテーション' : 'Presentation';
      const input = eventRows.querySelector(`.event-row[data-id="${first.id}"] .event-title`);
      if (input) input.value = first.title;
    }
  }

  function renderTimelineMarkers() {
    if (!eventMarkers) return;
    eventMarkers.innerHTML = '';
    const end = scheduleEndSeconds();
    const denom = Math.max(end, 1);
    sortedEvents().forEach(ev => {
      const sec = eventTimeToSeconds(ev.time);
      if (sec > end + 1e-6) return;
      const pct = Math.min(100, Math.max(0, sec/denom*100));
      const marker = document.createElement('div');
      marker.className = 'timeline-event-marker'
        + (bellNum(ev.bell)>0 && !ev.skipForCountdown ? ' has-bell' : '')
        + (ev.skipForCountdown ? ' is-skipped' : '');
      marker.style.left = `${pct}%`;
      marker.title = `${eventTimeLabel(ev.time)} · ${ev.title || 'Event'} · ${ev.bell} bell(s)`;
      eventMarkers.appendChild(marker);

      // Countdown targets get a normal time label on the bar and the event title below it.
      if (!ev.skipForCountdown && sec > 0 && sec < end) {
        const timeLabel = document.createElement('div');
        timeLabel.className = 'timeline-event-time';
        timeLabel.style.left = `${pct}%`;
        timeLabel.textContent = eventTimeLabel(ev.time);
        eventMarkers.appendChild(timeLabel);

        if (ev.title) {
          const label = document.createElement('div');
          label.className = 'timeline-event-label';
          label.style.left = `${pct}%`;
          label.textContent = ev.title;
          eventMarkers.appendChild(label);
        }
      }

      // Skipped events are intentionally lightweight: a small chip above the bar.
      if (ev.skipForCountdown && sec > 0 && sec < end) {
        const chip = document.createElement('div');
        chip.className = 'timeline-skip-chip';
        chip.style.left = `${pct}%`;
        chip.innerHTML = `${escapeAttr(eventTimeLabel(ev.time))}${bellNum(ev.bell)>0 ? '<span class="bell-mini" aria-hidden="true"></span>' : ''}`;
        chip.title = ev.title || 'Skipped countdown event';
        eventMarkers.appendChild(chip);
      }
    });
  }

  function getState(elapsed) {
    const s = sortedEvents();
    let current = null;
    let nextEvent = null;
    let nextTarget = null;
    for (const ev of s) {
      const sec = eventTimeToSeconds(ev.time);
      if (sec <= elapsed + 1e-6) current = ev;
      else {
        if (!nextEvent) nextEvent = ev;
        if (!nextTarget && !ev.skipForCountdown) nextTarget = ev;
      }
    }
    return { current, nextEvent, nextTarget, sorted:s };
  }

  function getDisplayTitle(elapsed) {
    // The first (earliest) event provides the initial title. Later events only
    // replace it when their Title field is non-empty.
    let title = '';
    for (const ev of sortedEvents()) {
      const sec = eventTimeToSeconds(ev.time);
      if (sec > elapsed + 1e-6) break;
      const candidate = String(ev.title ?? '').trim();
      if (candidate) title = candidate;
    }
    if (title) return title;
    const firstTitle = String(sortedEvents()[0]?.title ?? '').trim();
    return firstTitle || t('defaultTitle');
  }

  function update() {
    const elapsed = getElapsed();
    const mode = getCountMode();
    const end = scheduleEndSeconds();
    const { current, nextEvent, nextTarget } = getState(elapsed);
    // Countdown targets never extend beyond Session End. Events after Session End
    // can still fire bells and update Title/Message, but they do not restart a countdown.
    const countdownTarget = nextTarget && eventTimeToSeconds(nextTarget.time) <= end + 1e-6 ? nextTarget : null;

    timerTitle.textContent = getDisplayTitle(elapsed);
    // Messages are event-specific and are never inherited. Empty means hidden.
    timerMessage.textContent = String(current?.message ?? '').trim();

    const isOvertime = end > 0 && elapsed >= end;
    timerTitle.classList.toggle('overtime', isOvertime);
    timeDisplay.classList.toggle('overtime', isOvertime);
    timerMessage.classList.toggle('overtime-message', isOvertime);

    if (mode === 'up') {
      timeDisplay.textContent = formatTime(elapsed);
      if (end > 0 && elapsed >= end) {
        secondaryLabel.textContent = t('overtimeTime');
        secondaryDisplay.textContent = '+' + formatTime(elapsed - end);
      } else if (countdownTarget) {
        secondaryLabel.textContent = t('remaining');
        secondaryDisplay.textContent = formatTime(eventTimeToSeconds(countdownTarget.time) - elapsed);
      } else {
        secondaryLabel.textContent = t('elapsed');
        secondaryDisplay.textContent = formatTime(elapsed);
      }
    } else if (end > 0 && elapsed >= end) {
      // Once Session End is reached, stay in overtime count-up forever.
      // Later alert events never become countdown targets.
      timeDisplay.textContent = '+' + formatTime(elapsed - end);
      secondaryLabel.textContent = t('elapsed');
      secondaryDisplay.textContent = formatTime(elapsed);
    } else if (countdownTarget) {
      timeDisplay.textContent = formatTime(eventTimeToSeconds(countdownTarget.time) - elapsed);
      secondaryLabel.textContent = t('elapsed');
      secondaryDisplay.textContent = formatTime(elapsed);
    } else {
      timeDisplay.textContent = formatTime(elapsed);
      secondaryLabel.textContent = t('elapsed');
      secondaryDisplay.textContent = formatTime(elapsed);
    }

    nextEventLabel.textContent = nextEvent
      ? `${t('next')}: ${nextEvent.title || 'Event'} · ${eventTimeLabel(nextEvent.time)}${nextEvent.bell > 0 ? ` · Bell×${nextEvent.bell}` : ''}`
      : t('noMore');

    const denom = Math.max(end, 1);
    const pct = Math.min(100, Math.max(0, elapsed/denom*100));
    timelineProgress.style.width = `${pct}%`;
    timelineMarker.style.left = `${pct}%`;
    startLabel.textContent = '0';
    endLabel.textContent = `${Math.round(end/60*10)/10} ${t('min')}`;

    timeDisplay.classList.remove('ending-soon');
    if (elapsed < end && countdownTarget) {
      const remaining = eventTimeToSeconds(countdownTarget.time) - elapsed;
      if (remaining > 0 && remaining <= 5) timeDisplay.classList.add('ending-soon');
    }

    if (running) {
      for (const ev of sortedEvents()) {
        const sec = eventTimeToSeconds(ev.time);
        const key = ev.id;
        if (elapsed >= sec && !fired.has(key)) {
          fired.add(key);
          if (bellNum(ev.bell) > 0) ring(bellNum(ev.bell));
        }
      }
    }
  }

  function syncFiredForElapsed(elapsed) {
    fired.clear();
    sortedEvents().forEach(ev => { if (elapsed >= eventTimeToSeconds(ev.time)) fired.add(ev.id); });
  }

  async function ensureAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state !== 'running') { try { await audioCtx.resume(); } catch (_) {} }
    return audioCtx.state === 'running';
  }

  function getBellVolume() {
    const raw = Number(bellVolumeInput?.value ?? 100);
    return Math.min(1, Math.max(0, Number.isFinite(raw) ? raw / 100 : 0.8));
  }

  function updateBellVolumeLabel() {
    if (bellVolumeValue) bellVolumeValue.textContent = `${Math.round(getBellVolume()*100)}%`;
  }

  function bellStrike(start) {
    const master = audioCtx.createGain();
    master.gain.setValueAtTime(0.0001,start);
    master.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.62 * getBellVolume()),start+0.004);
    master.gain.exponentialRampToValueAtTime(0.0001,start+1.65);
    master.connect(audioCtx.destination);
    [
      {f:740,g:.24,d:1.55},{f:1112,g:.17,d:1.18},{f:1493,g:.12,d:.92},{f:2058,g:.08,d:.66},{f:2785,g:.045,d:.42}
    ].forEach(({f,g,d}) => {
      const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
      osc.type='sine'; osc.frequency.setValueAtTime(f,start);
      gain.gain.setValueAtTime(.0001,start); gain.gain.exponentialRampToValueAtTime(g,start+.003); gain.gain.exponentialRampToValueAtTime(.0001,start+d);
      osc.connect(gain).connect(master); osc.start(start); osc.stop(start+d+.04);
    });
    const click=audioCtx.createOscillator(), clickGain=audioCtx.createGain();
    click.type='triangle'; click.frequency.setValueAtTime(3300,start); clickGain.gain.setValueAtTime(.11,start); clickGain.gain.exponentialRampToValueAtTime(.0001,start+.045);
    click.connect(clickGain).connect(master); click.start(start); click.stop(start+.055);
  }

  async function ring(times) {
    const ready = await ensureAudio();
    if (!ready || times <= 0) return;
    const base = audioCtx.currentTime + .04;
    for (let i=0;i<times;i++) bellStrike(base + i*.25);
  }

  async function requestWakeLock() {
    if (!('wakeLock' in navigator) || !running || document.visibilityState !== 'visible') return;
    try { if (!wakeLock) { wakeLock=await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release',()=>wakeLock=null); } } catch(_){}
  }
  async function releaseWakeLock() { if (!wakeLock) return; try { await wakeLock.release(); } catch(_){} wakeLock=null; }

  function templateSnapshot() {
    syncEventsFromDom();
    ensureInitialTitle();
    return {
      events: events.map(({time,bell,skipForCountdown,title,message,sessionEnd}) => ({time,bell,skipForCountdown,title,message,sessionEnd})),
      countMode: getCountMode(),
      manualBellCount: Math.max(1, bellNum(manualBellCountInput.value)),
      bellVolume: Math.round(getBellVolume()*100),
      timelineControl: !!enableTimelineControl.checked
    };
  }

  const BUILT_IN_TEMPLATES = [
    { type: 'talk', minutes: 10, firstBellLead: 1 },
    { type: 'talk30qa10', minutes: 30 },
    { type: 'coffee', minutes: 10 }
  ];

  function makePresetEvents(presentationMinutes, lang='en', firstBellLead=1) {
    const p = Number(presentationMinutes) || 10;
    const lead = Math.max(1, Number(firstBellLead) || 1);
    const ja = lang === 'ja';
    const remainingMessage = ja
      ? `残り${lead}分`
      : `${lead} minute${lead === 1 ? '' : 's'} remaining`;
    return [
      { time: 0, bell: 0, skipForCountdown: false, title: ja ? '発表' : 'Presentation', message: ja ? '発表中' : 'Presentation in progress', sessionEnd: false },
      { time: Math.max(0, p - lead), bell: 1, skipForCountdown: true, title: ja ? '1ベル' : '1st Bell', message: remainingMessage, sessionEnd: false },
      { time: p, bell: 2, skipForCountdown: false, title: ja ? '質疑応答' : 'Q&A', message: ja ? '質疑応答' : 'Q&A time', sessionEnd: false },
      { time: p + 5, bell: 3, skipForCountdown: false, title: ja ? 'セッション終了' : 'Session End', message: ja ? 'セッション終了です' : 'Session ended', sessionEnd: true },
      { time: p + 8, bell: 4, skipForCountdown: true, title: ja ? '超過警告' : 'OT Alert', message: ja ? '3分超過' : '3 minutes overtime', sessionEnd: false }
    ];
  }

  function make30MinTalkEvents(lang='en') {
    const ja = lang === 'ja';
    return [
      { time: 0,  bell: 0, skipForCountdown: false, title: ja ? '発表' : 'Presentation', message: ja ? '発表中' : 'Presentation in progress', sessionEnd: false },
      { time: 25, bell: 1, skipForCountdown: true,  title: ja ? '1ベル' : '1st Bell', message: ja ? '残り5分' : '5 minutes remaining', sessionEnd: false },
      { time: 29, bell: 2, skipForCountdown: true,  title: ja ? '2ベル' : '2nd Bell', message: ja ? '残り1分' : '1 minute remaining', sessionEnd: false },
      { time: 30, bell: 2, skipForCountdown: false, title: ja ? '質疑応答' : 'Q&A', message: ja ? '質疑応答' : 'Q&A time', sessionEnd: false },
      { time: 40, bell: 3, skipForCountdown: false, title: ja ? '終了' : 'Session End', message: ja ? 'セッション終了です' : 'Session ended', sessionEnd: true }
    ];
  }

  function makeCoffeeBreakEvents(lang='en') {
    const ja = lang === 'ja';
    return [
      { time: 0, bell: 0, skipForCountdown: false, title: ja ? 'コーヒーブレイク' : 'Coffee Break', message: ja ? '休憩中' : 'Break time', sessionEnd: false },
      { time: 10, bell: 2, skipForCountdown: false, title: ja ? '休憩終了' : 'Break End', message: ja ? 'コーヒーブレイク終了です' : 'Coffee break is over', sessionEnd: true }
    ];
  }

  function builtInTemplateName(preset, lang='en') {
    if (preset?.type === 'coffee') return lang === 'ja' ? 'コーヒーブレイク' : 'Coffee Break';
    if (preset?.type === 'talk30qa10') return lang === 'ja' ? '30分発表' : '30 min Talk';
    const minutes = Number(preset?.minutes) || 10;
    return lang === 'ja' ? `${minutes}分発表` : `${minutes} min Talk`;
  }

  function builtInTemplateData(preset, lang='en') {
    if (preset?.type === 'coffee') {
      return { events: makeCoffeeBreakEvents(lang), countMode: 'down', manualBellCount: 4, bellVolume: 100, timelineControl: false };
    }
    if (preset?.type === 'talk30qa10') {
      return { events: make30MinTalkEvents(lang), countMode: 'down', manualBellCount: 4, bellVolume: 100, timelineControl: false };
    }
    return {
      events: makePresetEvents(preset?.minutes || 10, lang, preset?.firstBellLead || 1),
      countMode: 'down', manualBellCount: 4, bellVolume: 100, timelineControl: false
    };
  }

  function defaultTemplateSlot(i, lang='en') {
    const preset = BUILT_IN_TEMPLATES[i];
    if (!preset) {
      return { name: lang === 'ja' ? `テンプレート ${i+1}` : `Template ${i+1}`, data: null, editing: false };
    }
    return { name: builtInTemplateName(preset, lang), data: builtInTemplateData(preset, lang), editing: false };
  }

  function isBuiltInPresetData(data, preset) {
    if (!data || !Array.isArray(data.events) || !preset) return false;
    const en = builtInTemplateData(preset, 'en');
    const ja = builtInTemplateData(preset, 'ja');
    const sameEvents = matchesDefaultPreset(data.events, en.events) || matchesDefaultPreset(data.events, ja.events);
    return sameEvents && (data.countMode || 'down') === 'down' && Number(data.manualBellCount ?? 4) === 4 && Number(data.bellVolume ?? 100) === 100 && !data.timelineControl;
  }

  function localizeBuiltInTemplates(lang) {
    BUILT_IN_TEMPLATES.forEach((preset, i) => {
      const tpl = templates?.[i];
      if (!tpl) return;

      const knownDefaultNames = new Set([
        builtInTemplateName(preset, 'en'),
        builtInTemplateName(preset, 'ja')
      ]);
      // Recognize older built-in names so upgrading keeps the new defaults clean.
      if (i === 1) {
        knownDefaultNames.add('20 min Talk');
        knownDefaultNames.add('20分発表');
      }
      if (i === 2) {
        knownDefaultNames.add('30 min Talk');
        knownDefaultNames.add('30分発表');
      }
      const hasDefaultName = knownDefaultNames.has(String(tpl.name || '').trim());
      const hasDefaultData = isBuiltInPresetData(tpl.data, preset);
      if (!hasDefaultName && !hasDefaultData) return;

      tpl.name = builtInTemplateName(preset, lang);
      if (hasDefaultData || i === 2) tpl.data = builtInTemplateData(preset, lang);
      saveTemplateSlot(i);
    });
  }

  function loadTemplateSlot(i) {
    try {
      const raw = localStorage.getItem(TEMPLATE_SLOT_KEY(i));
      if (!raw) return defaultTemplateSlot(i);
      const item = JSON.parse(raw);
      return {name:String(item?.name || `Template ${i+1}`), data:item?.data || null, editing:false};
    } catch (_) { return defaultTemplateSlot(i); }
  }

  function getSavedTemplateCount() {
    try {
      const n = Number(localStorage.getItem(TEMPLATE_COUNT_KEY));
      if (Number.isInteger(n) && n >= 3 && n <= MAX_TEMPLATES) return n;
    } catch (_) {}
    return 3;
  }

  function loadTemplates() {
    const count = getSavedTemplateCount();
    const slots = Array.from({length:count}, (_,i) => loadTemplateSlot(i));
    slots.slice(0,3).forEach((slot,i) => {
      try { if (!localStorage.getItem(TEMPLATE_SLOT_KEY(i))) localStorage.setItem(TEMPLATE_SLOT_KEY(i), JSON.stringify(slot)); } catch (_) {}
    });
    try { localStorage.setItem(TEMPLATE_COUNT_KEY, String(slots.length)); } catch (_) {}
    return slots;
  }

  let templates = loadTemplates();

  function saveTemplateSlot(i) {
    if (!Number.isInteger(i) || i < 0 || i >= templates.length) return;
    try {
      localStorage.setItem(TEMPLATE_SLOT_KEY(i), JSON.stringify(templates[i]));
      localStorage.setItem(TEMPLATE_COUNT_KEY, String(templates.length));
    } catch (_) {}
  }

  function saveAllTemplates() {
    try { localStorage.setItem(TEMPLATE_COUNT_KEY, String(templates.length)); } catch (_) {}
    templates.forEach((_,i)=>saveTemplateSlot(i));
  }

  let editingTemplateSlot = null;
  let activeTemplateSlot = null;

  function setTimerControlsEnabled(enabled) {
    [startBtn, resetBtn, fullscreenBtn, manualBellBtn].forEach(btn => { if (btn) btn.disabled = !enabled; });
    const wrap = document.querySelector('.controls-wrap');
    if (wrap) wrap.classList.toggle('timer-controls-locked', !enabled);
  }

  function setEventEditorEnabled(enabled) {
    if (!eventGroup) return;
    eventGroup.classList.toggle('template-locked', !enabled);
    eventGroup.querySelectorAll('input, button').forEach(el => { el.disabled = !enabled; });
    setTimerControlsEnabled(!enabled);
  }

  function setFocusedEditingMode() {
    const editing = editingTemplateSlot !== null;

    // During template editing, Basic is visible for context but cannot be changed.
    if (basicGroup) {
      basicGroup.classList.toggle('editing-locked', editing);
      basicGroup.querySelectorAll('input, button').forEach(el => { el.disabled = editing; });
    }

    // Only the currently edited template card remains interactive.
    if (templateList) {
      [...templateList.querySelectorAll('.template-card')].forEach((card, i) => {
        const current = editing && i === editingTemplateSlot;
        card.classList.toggle('editing-current', current);
        card.classList.toggle('editing-other', editing && !current);
        card.querySelectorAll('input, button').forEach(el => {
          if (!editing) {
            if (el.classList.contains('template-name')) el.disabled = true;
            else if (el.classList.contains('delete-template-btn')) el.disabled = true;
            else if (el.classList.contains('duplicate-template-btn')) el.disabled = templates.length >= MAX_TEMPLATES || !templates[i]?.data;
            else el.disabled = false;
          } else {
            el.disabled = !current;
          }
        });
      });
    }

    if (addTemplateBtn) addTemplateBtn.disabled = editing || templates.length >= MAX_TEMPLATES;
    setEventEditorEnabled(editing);
    renderTemplateLauncher();
  }

  function registerTemplate(slot) {
    if (!Number.isInteger(slot) || slot < 0 || slot >= templates.length) return;
    const card = templateList?.querySelector(`.template-card[data-template-slot="${slot}"]`);
    if (card) templates[slot].name = card.querySelector('.template-name').value.trim() || `Template ${slot+1}`;
    const snap = templateSnapshot();
    templates[slot].data = (typeof structuredClone==='function') ? structuredClone(snap) : JSON.parse(JSON.stringify(snap));
    templates[slot].editing = false;
    saveTemplateSlot(slot);
    editingTemplateSlot = null;
    activeTemplateSlot = slot;
    setEventEditorEnabled(false);
    setFocusedEditingMode();
  }

  function beginTemplateEdit(slot) {
    if (!Number.isInteger(slot) || slot < 0 || slot >= templates.length) return;
    if (editingTemplateSlot !== null && editingTemplateSlot !== slot) return;
    editingTemplateSlot = slot;
    templates[slot].editing = true;
    activeTemplateSlot = null;
    if (templates[slot].data) applyTemplateData(templates[slot].data);
    setEventEditorEnabled(true);
    renderTemplates();
    setFocusedEditingMode();
  }

  function addTemplate() {
    if (templates.length >= MAX_TEMPLATES) return;
    const slot = templates.length;
    const snap = templateSnapshot();
    templates.push({name:`Template ${slot+1}`, data:null, editing:true});
    try { localStorage.setItem(TEMPLATE_COUNT_KEY, String(templates.length)); } catch (_) {}
    editingTemplateSlot = slot;
    activeTemplateSlot = null;
    // New templates start as an editable copy of the current settings, but are not usable until Save.
    templates[slot].data = (typeof structuredClone==='function') ? structuredClone(snap) : JSON.parse(JSON.stringify(snap));
    setEventEditorEnabled(true);
    renderTemplates();
    setFocusedEditingMode();
  }

  function duplicateTemplate(slot) {
    if (!Number.isInteger(slot) || slot < 0 || slot >= templates.length || templates.length >= MAX_TEMPLATES || editingTemplateSlot !== null) return;
    const source = templates[slot];
    if (!source?.data) return;
    const copyData = (typeof structuredClone==='function') ? structuredClone(source.data) : JSON.parse(JSON.stringify(source.data));
    const suffix = language === 'ja' ? ' コピー' : ' Copy';
    let name = `${source.name || `${t('templateSlot')} ${slot+1}`}${suffix}`.slice(0,40);
    templates.push({name, data:copyData, editing:false});
    saveAllTemplates();
    renderTemplates();
  }

  function deleteTemplate(slot) {
    if (!Number.isInteger(slot) || slot < 3 || slot >= templates.length) return;
    if (editingTemplateSlot === slot) editingTemplateSlot = null;
    if (activeTemplateSlot === slot) activeTemplateSlot = 0;
    try {
      for (let i=slot;i<templates.length-1;i++) {
        localStorage.setItem(TEMPLATE_SLOT_KEY(i), JSON.stringify(templates[i+1]));
      }
      localStorage.removeItem(TEMPLATE_SLOT_KEY(templates.length-1));
    } catch (_) {}
    templates.splice(slot,1);
    if (editingTemplateSlot !== null && editingTemplateSlot > slot) editingTemplateSlot--;
    if (activeTemplateSlot !== null && activeTemplateSlot > slot) activeTemplateSlot--;
    saveAllTemplates();
    if (editingTemplateSlot === null) setEventEditorEnabled(false);
    renderTemplates();
  }

  function renderTemplates() {
    if (!templateList) return;
    templateList.innerHTML = '';
    templates.forEach((tpl,i) => {
      const card=document.createElement('div');
      card.className='template-card' + (editingTemplateSlot!==null ? (editingTemplateSlot===i?' editing-current':' editing-other') : ''); card.dataset.templateSlot=String(i);
      const isEditing = editingTemplateSlot === i;
      card.innerHTML = `
        <input class="template-name" type="text" maxlength="40" aria-label="Template ${i+1} name" value="${escapeAttr(tpl.name || `Template ${i+1}`)}" ${isEditing?'':'disabled'}>
        <div class="template-mode-row"><span class="template-slot-label">${t('templateSlot')} ${i+1}</span><button class="template-mode-btn${isEditing?' register-mode':''}" type="button" ${(editingTemplateSlot!==null && !isEditing)?'disabled':''}>${isEditing?t('templateRegister'):t('templateEdit')}</button></div>
        <div class="template-card-actions"><button class="duplicate-template-btn" type="button" ${(editingTemplateSlot!==null || !tpl.data || templates.length>=MAX_TEMPLATES)?'disabled':''}>${t('templateDuplicate')}</button>${i>=3?`<button class="delete-template-btn" type="button" ${isEditing?'':'disabled'}>${t('templateDelete')}</button>`:''}</div>
        <div class="template-status">${isEditing?t('templateEditing'):(tpl.data?t('templateReady'):t('templateEmpty'))}</div>`;
      templateList.appendChild(card);
    });
    if (addTemplateBtn) {
      addTemplateBtn.textContent=t('templateAdd');
      addTemplateBtn.disabled=templates.length>=MAX_TEMPLATES || editingTemplateSlot!==null;
    }
    renderTemplateLauncher();
    const editing = editingTemplateSlot !== null;
    if (basicGroup) {
      basicGroup.classList.toggle('editing-locked', editing);
      basicGroup.querySelectorAll('input, button').forEach(el => { el.disabled = editing; });
    }
    setEventEditorEnabled(editing);
  }

  function renderTemplateLauncher() {
    if (!templateLauncher) return;
    templateLauncher.innerHTML = '';
    templates.forEach((tpl,i) => {
      const b=document.createElement('button');
      b.type='button'; b.className='template-launch-btn'+(activeTemplateSlot===i?' active-template':''); b.dataset.templateSlot=String(i);
      b.textContent=tpl?.name || `Template ${i+1}`;
      b.title=tpl?.data ? b.textContent : `${b.textContent} — ${t('templateEmpty')}`;
      b.disabled=!tpl?.data || editingTemplateSlot!==null;
      templateLauncher.appendChild(b);
    });
  }

  function applyTemplateData(data) {
    if (!data || !Array.isArray(data.events) || !data.events.length) return false;
    running=false; elapsedBeforeStart=0; startedAt=null; fired.clear(); cancelAnimationFrame(timerHandle); releaseWakeLock();
    events = data.events.map((e,i) => ({
      time:secondsToEventTime(eventTimeToSeconds(e.time)), bell:bellNum(e.bell), skipForCountdown:!!e.skipForCountdown,
      title:String(e.title??''), message:String(e.message??''), sessionEnd:!!e.sessionEnd, id:makeId(i)
    }));
    ensureInitialTitle();
    normalizeSessionEnd(events.find(e=>e.sessionEnd)?.id || null);
    if (data.countMode === 'up' || data.countMode === 'down') {
      const radio=document.querySelector(`input[name="countMode"][value="${data.countMode}"]`); if(radio)radio.checked=true;
    }
    if (Number.isFinite(data.manualBellCount)) manualBellCountInput.value=Math.max(1,bellNum(data.manualBellCount));
    if (bellVolumeInput && Number.isFinite(Number(data.bellVolume))) bellVolumeInput.value=Math.min(100,Math.max(0,Number(data.bellVolume)));
    updateBellVolumeLabel();
    enableTimelineControl.checked = !!data.timelineControl;
    setTimelineEditable(enableTimelineControl.checked);
    renderEventRows(); syncFiredForElapsed(0); startBtn.textContent=t('start'); update(); persistSettings();
    return true;
  }

  function collectSettings() {
    syncEventsFromDom();
    return { events: events.map(({time,bell,skipForCountdown,title,message,sessionEnd})=>({time,bell,skipForCountdown,title,message,sessionEnd})), countMode:getCountMode(), language, manualBellCount:bellNum(manualBellCountInput.value)||1, bellVolume:Math.round(getBellVolume()*100), timelineControl:!!enableTimelineControl.checked };
  }
  function persistSettings() {
    try {
      localStorage.setItem('presentationTimerSaveSettings', saveSettingsCheckbox.checked ? '1':'0');
      if (saveSettingsCheckbox.checked) localStorage.setItem(SETTINGS_KEY, JSON.stringify(collectSettings()));
      else localStorage.removeItem(SETTINGS_KEY);
    } catch(_){}
  }
  function restoreSettings() {
    try {
      saveSettingsCheckbox.checked = localStorage.getItem('presentationTimerSaveSettings') !== '0';
      if (!saveSettingsCheckbox.checked) return;
      const raw=localStorage.getItem(SETTINGS_KEY); if (!raw) return;
      const st=JSON.parse(raw);
      if (Array.isArray(st.events) && st.events.length) {
        events=st.events.map((e,i)=>({time:secondsToEventTime(eventTimeToSeconds(e.time)),bell:bellNum(e.bell),skipForCountdown:typeof e.skipForCountdown==='boolean'?e.skipForCountdown:false,title:String(e.title??''),message:String(e.message??''),sessionEnd:!!e.sessionEnd,id:makeId(i)}));
        normalizeSessionEnd(events.find(e=>e.sessionEnd)?.id || null);
      }
      if (st.countMode==='up'||st.countMode==='down') document.querySelector(`input[name="countMode"][value="${st.countMode}"]`).checked=true;
      if (st.language==='en'||st.language==='ja') { language=st.language; const r=document.querySelector(`input[name="languageMode"][value="${language}"]`); if(r)r.checked=true; }
      if (Number.isFinite(st.manualBellCount)) manualBellCountInput.value=Math.max(1,bellNum(st.manualBellCount));
      if (bellVolumeInput && Number.isFinite(Number(st.bellVolume))) bellVolumeInput.value=Math.min(100,Math.max(0,Number(st.bellVolume)));
      updateBellVolumeLabel();
      enableTimelineControl.checked = !!st.timelineControl;
      setTimelineEditable(enableTimelineControl.checked);
    } catch(_){}
  }

  function currentTheme() {
    return document.querySelector('input[name="themeMode"]:checked')?.value || 'dark';
  }

  function setFileSaveStatus(message, isError=false) {
    if (!fileSaveStatus) return;
    fileSaveStatus.textContent = message || '';
    fileSaveStatus.classList.toggle('error', !!isError);
  }

  async function exportAllSettings() {
    syncEventsFromDom();
    ensureInitialTitle();
    const payload = {
      app: 'Presentation Timer',
      formatVersion: 2,
      exportedAt: new Date().toISOString(),
      theme: currentTheme(),
      language,
      autoSaveInBrowser: !!saveSettingsCheckbox.checked,
      activeTemplateSlot,
      editingTemplateSlot,
      currentSchedule: collectSettings(),
      templates: templates.map(tpl => ({
        name: String(tpl?.name || ''),
        data: tpl?.data ? JSON.parse(JSON.stringify(tpl.data)) : null
      }))
    };

    const json = JSON.stringify(payload, null, 2);
    const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
    const filename = `presentation-timer-settings-${stamp}.json`;
    const blob = new Blob([json], {type:'application/json'});

    setFileSaveStatus(language === 'ja' ? '保存方法を準備しています…' : 'Preparing save…');

    // 1) Best option: native Save As picker. The user chooses the exact folder/file name.
    try {
      if (typeof window.showSaveFilePicker === 'function') {
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'Presentation Timer settings',
            accept: {'application/json': ['.json']}
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        setFileSaveStatus(language === 'ja' ? '設定ファイルを保存しました。' : 'Settings file saved.');
        return;
      }
    } catch (err) {
      if (err?.name === 'AbortError') {
        setFileSaveStatus(language === 'ja' ? '保存をキャンセルしました。' : 'Save cancelled.');
        return;
      }
    }

    // 2) Mobile fallback: system share sheet, where Files/Drive may be chosen.
    try {
      if (typeof File !== 'undefined' && navigator.share && navigator.canShare) {
        const file = new File([blob], filename, {type:'application/json'});
        if (navigator.canShare({files:[file]})) {
          setFileSaveStatus(language === 'ja' ? '共有先を選択してください。' : 'Choose where to save/share the file.');
          await navigator.share({
            title: language === 'ja' ? 'プレゼンテーションタイマー設定' : 'Presentation Timer Settings',
            files: [file]
          });
          setFileSaveStatus(language === 'ja' ? '共有処理を完了しました。' : 'Share completed.');
          return;
        }
      }
    } catch (err) {
      if (err?.name === 'AbortError') {
        setFileSaveStatus(language === 'ja' ? '共有をキャンセルしました。' : 'Share cancelled.');
        return;
      }
    }

    // 3) Universal fallback: normal browser download. The browser decides the Downloads folder.
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.rel = 'noopener';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      setFileSaveStatus(language === 'ja' ? 'ダウンロードを開始しました。保存先はブラウザ側で決まります。' : 'Download started. The browser chooses the save location.');
    } catch (err) {
      setFileSaveStatus(language === 'ja' ? 'このブラウザではファイル保存を開始できません。ChromeやEdgeで開いてください。' : 'This browser could not start a file save. Try opening the page in Chrome or Edge.', true);
    }
  }

  function normalizeImportedTemplate(raw, i) {
    const fallback = defaultTemplateSlot(i, language);
    if (!raw || typeof raw !== 'object') return fallback;
    const name = String(raw.name || fallback.name || `Template ${i+1}`).slice(0,40);
    const d = raw.data;
    if (!d || !Array.isArray(d.events) || !d.events.length) return {name, data:null, editing:false};
    const importedEvents = d.events.map((e,j) => ({
      time: secondsToEventTime(eventTimeToSeconds(e?.time)),
      bell: bellNum(e?.bell),
      skipForCountdown: !!e?.skipForCountdown,
      title: String(e?.title ?? ''),
      message: String(e?.message ?? ''),
      legacyOvertime: !!e?.overtime,
      sessionEnd: !!e?.sessionEnd
    }));
    // Guarantee exactly one usable Session End and preserve the first title.
    let chosen = importedEvents.find(e => e.sessionEnd) || importedEvents.find(e => e.legacyOvertime) || importedEvents[importedEvents.length-1];
    importedEvents.forEach(e => { e.sessionEnd = e === chosen; delete e.legacyOvertime; });
    chosen.skipForCountdown = false;
    if (!String(importedEvents[0].title || '').trim()) importedEvents[0].title = language === 'ja' ? 'プレゼンテーション' : 'Presentation';
    return {
      name,
      data: {
        events: importedEvents,
        countMode: d.countMode === 'up' ? 'up' : 'down',
        manualBellCount: Math.max(1, bellNum(d.manualBellCount ?? 4)),
        bellVolume: Math.min(100, Math.max(0, Number.isFinite(Number(d.bellVolume)) ? Number(d.bellVolume) : 100)),
        timelineControl: !!d.timelineControl
      },
      editing:false
    };
  }

  function importAllSettings(payload) {
    if (!payload || typeof payload !== 'object' || payload.app !== 'Presentation Timer' || !Array.isArray(payload.templates)) {
      throw new Error('Invalid Presentation Timer settings file.');
    }
    const importedLang = payload.language === 'ja' ? 'ja' : 'en';
    const allowedThemes = ['light','dark','high-contrast','paper','matrix','tokyo-night','cyberpunk','solarized'];
    const importedTheme = allowedThemes.includes(payload.theme) ? payload.theme : 'dark';

    language = importedLang;
    templates = payload.templates.slice(0, MAX_TEMPLATES).map((tpl,i) => normalizeImportedTemplate(tpl,i));
    while (templates.length < 3) templates.push(defaultTemplateSlot(templates.length, language));
    templates.forEach(t => { t.editing = false; });
    editingTemplateSlot = null;

    let requestedActive = Number(payload.activeTemplateSlot);
    if (!Number.isInteger(requestedActive) || requestedActive < 0 || requestedActive >= templates.length || !templates[requestedActive]?.data) requestedActive = 0;
    activeTemplateSlot = requestedActive;

    const langRadio = document.querySelector(`input[name="languageMode"][value="${language}"]`); if (langRadio) langRadio.checked = true;
    const themeRadio = document.querySelector(`input[name="themeMode"][value="${importedTheme}"]`); if (themeRadio) themeRadio.checked = true;
    saveSettingsCheckbox.checked = payload.autoSaveInBrowser !== false;
    applyTheme(importedTheme);

    saveAllTemplates();
    if (templates[activeTemplateSlot]?.data) applyTemplateData(templates[activeTemplateSlot].data);
    setEventEditorEnabled(false);
    setTimerControlsEnabled(true);
    renderTemplates();
    applyLanguage(language);
    persistSettings();
  }

  function applyTheme(theme) {
    const allowed = ['light','dark','high-contrast','paper','matrix','tokyo-night','cyberpunk','solarized'];
    if (!allowed.includes(theme)) theme = 'dark';
    document.body.classList.remove('dark','high-contrast','paper','matrix','tokyo-night','cyberpunk','solarized');
    if (theme !== 'light') document.body.classList.add(theme);
    try { localStorage.setItem('presentationTimerTheme', theme); } catch (_) {}
  }
  function applyLanguage(lang) {
    language = lang==='ja' ? 'ja':'en';
    document.documentElement.lang = language==='ja' ? 'ja':'en';
    document.title = language==='ja' ? '発表タイマー':'Presentation Timer';
    const set=(id,key)=>{ const el=document.getElementById(id); if(el)el.textContent=t(key); };
    set('settingsToggle','settings'); set('basicGroupHeading','basic'); set('templatesGroupHeading','templates'); set('eventsGroupHeading','events'); set('countLabel','count'); set('countDownLabel','down'); set('countUpLabel','up');
    set('themeLabel','theme'); set('lightLabel','light'); set('darkLabel','dark'); set('highContrastLabel','highContrast'); set('paperLabel','paper'); set('matrixLabel','matrix'); set('tokyoNightLabel','tokyoNight'); set('cyberpunkLabel','cyberpunk'); set('solarizedLabel','solarized'); set('languageLabel','language'); set('saveSettingsLabel','save'); set('timelineControlLabel','timelineControl');
    set('manualBellLabel','manualBell'); set('bellVolumeLabel','bellVolume'); set('exportSettingsBtn','saveFile'); set('importSettingsBtn','loadFile'); set('clearSavedSettingsBtn','clear'); set('clearLocalDataBtn','clearLocal'); set('timeColumnLabel','timeCol'); set('bellColumnLabel','bellCol'); set('skipForCountdownColumnLabel','skipForCountdownCol'); set('titleColumnLabel','titleCol'); set('messageColumnLabel','messageCol'); set('sessionEndColumnLabel','sessionEndCol'); set('actionsColumnLabel','actionsCol'); set('addEventBtn','addEvent');
    const hintEl = document.getElementById('scheduleHint');
    if (hintEl) hintEl.innerHTML = t('hint');
    if (templateHint) templateHint.textContent = t('templateHint');
    if (addTemplateBtn) addTemplateBtn.textContent = t('templateAdd');
    if (templateList) renderTemplates();
    startBtn.textContent=running?t('pause'):t('start'); resetBtn.textContent=t('reset'); fullscreenBtn.textContent=document.fullscreenElement?t('exitFullscreen'):t('fullscreen'); manualBellBtn.textContent=t('ring');
    update(); persistSettings();
  }

  function setSettingsOpen(open) { settingsShell.classList.toggle('open',open); settingsToggle.setAttribute('aria-expanded',open?'true':'false'); }
  function setTimelineEditable(enabled) { timelineBar.classList.toggle('timeline-editable',enabled); timelineMarker.setAttribute('aria-disabled',String(!enabled)); }
  function seekTimelineFromClientX(clientX) {
    if (!enableTimelineControl.checked) return;
    const end=scheduleEndSeconds(); if(end<=0)return;
    const rect=timelineBar.getBoundingClientRect(); const ratio=Math.min(1,Math.max(0,(clientX-rect.left)/rect.width)); const newElapsed=ratio*end;
    elapsedBeforeStart=newElapsed; if(running)startedAt=performance.now(); syncFiredForElapsed(newElapsed); update();
  }
  function loop(){ update(); if(running)timerHandle=requestAnimationFrame(loop); }

  function enforceSessionEndUi(target) {
    if (!target?.classList?.contains('event-session-end')) return;
    const row = target.closest('.event-row');
    if (target.checked) {
      eventRows.querySelectorAll('.event-session-end').forEach(cb => { if (cb !== target) cb.checked = false; });
      const skip = row?.querySelector('.event-skip-for-countdown');
      if (skip) skip.checked = false;
    } else if (![...eventRows.querySelectorAll('.event-session-end')].some(cb => cb.checked)) {
      target.checked = true;
    }
  }

  eventRows.addEventListener('input', e => {
    activeTemplateSlot = null; renderTemplateLauncher();
    if (!e.target.matches('input') || e.target.type === 'checkbox') return;
    syncEventsFromDom();
    renderTimelineMarkers();
    syncFiredForElapsed(getElapsed()); update(); persistSettings();
  });
  eventRows.addEventListener('change', e => {
    if (!e.target.matches('input')) return;
    if (e.target.classList.contains('event-bell')) e.target.value=bellNum(e.target.value);
    if (e.target.classList.contains('event-time')) e.target.value=secondsToEventTime(eventTimeToSeconds(e.target.value));
    enforceSessionEndUi(e.target);
    if (e.target.classList.contains('event-skip-for-countdown') && e.target.checked) {
      const row = e.target.closest('.event-row');
      const sessionEnd = row?.querySelector('.event-session-end');
      if (sessionEnd?.checked) e.target.checked = false;
    }
    syncEventsFromDom();
    ensureInitialTitle();
    normalizeSessionEnd(events.find(ev => ev.sessionEnd)?.id || null);
    if (e.target.type === 'checkbox') renderEventRows();
    else renderTimelineMarkers();
    update(); persistSettings();
  });
  let previewRestoreTimer = null;
  async function previewEvent(ev) {
    if (!ev) return;
    if (previewRestoreTimer) clearTimeout(previewRestoreTimer);
    timerTitle.textContent = String(ev.title || '').trim() || getDisplayTitle(getElapsed());
    timerMessage.textContent = String(ev.message || '').trim();
    timerTitle.classList.remove('overtime');
    timerMessage.classList.remove('overtime-message');
    if (bellNum(ev.bell) > 0) await ring(bellNum(ev.bell));
    previewRestoreTimer = setTimeout(() => { update(); previewRestoreTimer = null; }, 1800);
  }

  eventRows.addEventListener('click', e => {
    const btn=e.target.closest('button'); if(!btn)return;
    syncEventsFromDom();
    const row=btn.closest('.event-row'); const idx=events.findIndex(ev=>ev.id===row.dataset.id); if(idx<0)return;
    if(btn.classList.contains('preview-event')) { previewEvent(events[idx]); return; }
    if(btn.classList.contains('move-up') && idx>0) [events[idx-1],events[idx]]=[events[idx],events[idx-1]];
    else if(btn.classList.contains('move-down') && idx<events.length-1) [events[idx+1],events[idx]]=[events[idx],events[idx+1]];
    else if(btn.classList.contains('delete-event') && events.length > 1) events.splice(idx,1);
    else return;
    normalizeSessionEnd(events.find(ev => ev.sessionEnd)?.id || null);
    renderEventRows(); syncFiredForElapsed(getElapsed()); update(); persistSettings();
  });
  addEventBtn.addEventListener('click', () => {
    syncEventsFromDom();
    const maxTimeSeconds = events.length ? Math.max(...events.map(ev => eventTimeToSeconds(ev.time))) : -60;
    events.push({time:secondsToEventTime(maxTimeSeconds + 60),bell:0,skipForCountdown:false,title:'',message:'',sessionEnd:false,id:makeId(events.length)});
    renderEventRows(); update(); persistSettings();
    eventRows.querySelector('tr:last-child .event-title')?.focus();
  });

  if (templateList) {
    templateList.addEventListener('input', e => {
      if (!e.target.classList.contains('template-name')) return;
      const card=e.target.closest('.template-card'); const slot=Number(card?.dataset.templateSlot);
      if (!Number.isInteger(slot) || slot<0 || slot>=templates.length || editingTemplateSlot !== slot) return;
      templates[slot].name=e.target.value;
      renderTemplateLauncher();
    });

    templateList.addEventListener('click', e => {
      const card=e.target.closest('.template-card'); const slot=Number(card?.dataset.templateSlot);
      if (!Number.isInteger(slot) || slot<0 || slot>=templates.length) return;
      const duplicateBtn=e.target.closest('.duplicate-template-btn');
      if (duplicateBtn) { duplicateTemplate(slot); return; }
      const deleteBtn=e.target.closest('.delete-template-btn');
      if (deleteBtn) { deleteTemplate(slot); return; }
      const btn=e.target.closest('.template-mode-btn'); if(!btn)return;
      if (editingTemplateSlot === slot) registerTemplate(slot);
      else beginTemplateEdit(slot);
      renderTemplates();
    });
  }

  if (addTemplateBtn) addTemplateBtn.addEventListener('click', addTemplate);

  if (templateLauncher) {
    templateLauncher.addEventListener('click', e => {
      const btn=e.target.closest('.template-launch-btn'); if(!btn)return;
      const slot=Number(btn.dataset.templateSlot);
      if (!Number.isInteger(slot) || slot<0 || slot>=templates.length) return;
      const tpl=templates[slot];
      if (!tpl?.data || editingTemplateSlot === slot) return;
      if (running && slot !== activeTemplateSlot && !window.confirm(t('switchRunningConfirm'))) return;
      if (applyTemplateData(tpl.data)) { activeTemplateSlot=slot; editingTemplateSlot=null; setEventEditorEnabled(false); renderTemplates(); }
    });
  }

  startBtn.addEventListener('click', async()=>{
    await ensureAudio();
    if(!running){ running=true; startedAt=performance.now(); startBtn.textContent=t('pause'); requestWakeLock(); loop(); }
    else { elapsedBeforeStart=getElapsed(); running=false; startedAt=null; cancelAnimationFrame(timerHandle); startBtn.textContent=t('start'); releaseWakeLock(); update(); }
  });
  resetBtn.addEventListener('click',()=>{ running=false; elapsedBeforeStart=0; startedAt=null; fired.clear(); cancelAnimationFrame(timerHandle); startBtn.textContent=t('start'); releaseWakeLock(); update(); });
  manualBellBtn.addEventListener('click',()=>{ const n=Math.max(1,bellNum(manualBellCountInput.value)); manualBellCountInput.value=n; ring(n); });
  manualBellCountInput.addEventListener('input',()=>{ if(editingTemplateSlot!==null){activeTemplateSlot=null;renderTemplateLauncher();} persistSettings(); });
  if (bellVolumeInput) bellVolumeInput.addEventListener('input',()=>{ updateBellVolumeLabel(); if(editingTemplateSlot!==null){activeTemplateSlot=null;renderTemplateLauncher();} persistSettings(); });
  saveSettingsCheckbox.addEventListener('change',persistSettings);
  countModeInputs.forEach(i=>i.addEventListener('change',()=>{ if(editingTemplateSlot!==null){activeTemplateSlot=null;renderTemplateLauncher();} update();persistSettings();}));
  themeModeInputs.forEach(i=>i.addEventListener('change',()=>{applyTheme(i.value);persistSettings();}));
  languageModeInputs.forEach(i=>i.addEventListener('change',()=>{
    syncEventsFromDom();
    const nextLang = i.value === 'ja' ? 'ja' : 'en';

    // Translate only untouched built-in presets. Custom template text is never overwritten.
    localizeBuiltInTemplates(nextLang);
    if (activeTemplateSlot !== null && activeTemplateSlot < 3 && templates[activeTemplateSlot]?.data && isBuiltInPresetData(templates[activeTemplateSlot].data, BUILT_IN_TEMPLATES[activeTemplateSlot])) {
      applyTemplateData(templates[activeTemplateSlot].data);
    } else if (isUntouchedDefault(events)) {
      events = freshDefaultEvents(nextLang);
      normalizeSessionEnd(events.find(ev => ev.sessionEnd)?.id || null);
      renderEventRows();
      syncFiredForElapsed(getElapsed());
    }
    applyLanguage(nextLang);
  }));
  settingsToggle.addEventListener('click',()=>setSettingsOpen(!settingsShell.classList.contains('open')));
  enableTimelineControl.addEventListener('change',()=>{if(editingTemplateSlot!==null){activeTemplateSlot=null;renderTemplateLauncher();} setTimelineEditable(enableTimelineControl.checked);draggingTimeline=false;persistSettings();});

  timelineBar.addEventListener('pointerdown',e=>{if(!enableTimelineControl.checked)return;draggingTimeline=true;if(timelineBar.setPointerCapture)timelineBar.setPointerCapture(e.pointerId);seekTimelineFromClientX(e.clientX);e.preventDefault();});
  timelineBar.addEventListener('pointermove',e=>{if(!draggingTimeline||!enableTimelineControl.checked)return;seekTimelineFromClientX(e.clientX);e.preventDefault();});
  const stopDrag=e=>{if(!draggingTimeline)return;draggingTimeline=false;if(e&&timelineBar.releasePointerCapture&&timelineBar.hasPointerCapture?.(e.pointerId))timelineBar.releasePointerCapture(e.pointerId);};
  timelineBar.addEventListener('pointerup',stopDrag); timelineBar.addEventListener('pointercancel',stopDrag);

  fullscreenBtn.addEventListener('click',async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}catch(_){}});
  document.addEventListener('fullscreenchange',()=>{document.body.classList.toggle('fullscreen',!!document.fullscreenElement);fullscreenBtn.textContent=document.fullscreenElement?t('exitFullscreen'):t('fullscreen');});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&running)requestWakeLock();});
  document.addEventListener('keydown',e=>{const tag=document.activeElement?.tagName;if(e.code==='Space'&&!['INPUT','BUTTON'].includes(tag)){e.preventDefault();startBtn.click();}if(e.key.toLowerCase()==='r'&&tag!=='INPUT')resetBtn.click();if(e.key.toLowerCase()==='f'&&tag!=='INPUT')fullscreenBtn.click();});

  if (exportSettingsBtn) exportSettingsBtn.addEventListener('click', () => {
    exportAllSettings();
  });
  if (importSettingsBtn && importSettingsFile) {
    importSettingsBtn.addEventListener('click', () => importSettingsFile.click());
    importSettingsFile.addEventListener('change', async () => {
      const file = importSettingsFile.files?.[0];
      importSettingsFile.value = '';
      if (!file) return;
      try {
        const text = await file.text();
        importAllSettings(JSON.parse(text));
      } catch (err) {
        alert(language === 'ja' ? '設定ファイルを読み込めませんでした。' : 'Could not load the settings file.');
      }
    });
  }

  clearSavedSettingsBtn.addEventListener('click',()=>{
    const selectedLanguage = document.querySelector('input[name="languageMode"]:checked')?.value === 'ja' ? 'ja' : 'en';
    const selectedThemeRaw = document.querySelector('input[name="themeMode"]:checked')?.value;
    const selectedTheme = ['light','dark','high-contrast','paper','matrix','tokyo-night','cyberpunk','solarized'].includes(selectedThemeRaw) ? selectedThemeRaw : 'dark';
    language = selectedLanguage;

    // Restore the whole app to its built-in 10 min Talk / 30 min Talk / Coffee Break templates.
    // Language and theme are intentionally preserved.
    try {
      localStorage.removeItem(SETTINGS_KEY);
      for (let i=0; i<MAX_TEMPLATES; i++) localStorage.removeItem(TEMPLATE_SLOT_KEY(i));
      localStorage.removeItem(TEMPLATE_COUNT_KEY);
    } catch (_) {}

    templates = BUILT_IN_TEMPLATES.map((_,i) => defaultTemplateSlot(i, language));
    saveAllTemplates();
    editingTemplateSlot = null;
    activeTemplateSlot = 0;

    document.querySelector('input[name="countMode"][value="down"]').checked = true;
    manualBellCountInput.value = 4;
    if (bellVolumeInput) bellVolumeInput.value = 100; updateBellVolumeLabel();
    enableTimelineControl.checked = false;
    setTimelineEditable(false);
    saveSettingsCheckbox.checked = true;

    const langRadio = document.querySelector(`input[name="languageMode"][value="${language}"]`); if (langRadio) langRadio.checked = true;
    const themeRadio = document.querySelector(`input[name="themeMode"][value="${selectedTheme}"]`); if (themeRadio) themeRadio.checked = true;
    applyTheme(selectedTheme);

    running=false; elapsedBeforeStart=0; startedAt=null; fired.clear(); cancelAnimationFrame(timerHandle); releaseWakeLock();
    applyTemplateData(templates[0].data);
    setEventEditorEnabled(false);
    setTimerControlsEnabled(true);
    renderTemplates();
    applyLanguage(language);
    update();
    persistSettings();
  });


  if (clearLocalDataBtn) clearLocalDataBtn.addEventListener('click', () => {
    const message = language === 'ja'
      ? 'このタイマーがブラウザに保存した設定をすべて削除します。テーマやテンプレートも初期状態（Dark）に戻ります。続けますか？'
      : 'Delete all settings saved by this timer in this browser? Theme and templates will return to the default state (Dark).';
    if (!window.confirm(message)) return;
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('presentationTimer')) keys.push(key);
      }
      keys.forEach(key => localStorage.removeItem(key));
    } catch (_) {}
    window.location.reload();
  });

  try{const savedTheme=localStorage.getItem('presentationTimerTheme');const theme=['light','dark','high-contrast','paper','matrix','tokyo-night','cyberpunk','solarized'].includes(savedTheme)?savedTheme:'dark';const r=document.querySelector(`input[name="themeMode"][value="${theme}"]`);if(r)r.checked=true;applyTheme(theme);}catch(_){applyTheme('dark');}
  restoreSettings();
  updateBellVolumeLabel();
  ensureInitialTitle();
  normalizeSessionEnd(events.find(ev => ev.sessionEnd)?.id || null);
  renderEventRows();
  // All three built-in templates are available immediately. Start with Template 1 active.
  editingTemplateSlot = null;
  activeTemplateSlot = 0;
  if (templates[0]?.data) applyTemplateData(templates[0].data);
  setEventEditorEnabled(false);
  setTimerControlsEnabled(true);
  setTimelineEditable(false);
  setSettingsOpen(false);
  renderTemplates();
  applyLanguage(language);
  update();
})();
