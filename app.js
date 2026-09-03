(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const els={timeline:$('#timeline'),markerLayer:$('#markerLayer'),segments:$('#segments'),phases:$('#phaseLabels'),tbody:$('#scheduleBody'),startLabel:$('#startLabel'),endLabel:$('#endLabel'),toolbar:$('#editorToolbar'),edit:$('#editToggle'),templateEditor:$('#templateEditor'),templateTitle:$('#templateTitle'),startPause:$('#startPause'),reset:$('#resetBtn'),ring:$('#ringBtn'),main:$('#mainTime'),title:$('#activeTitle'),msg:$('#activeMessage'),next:$('#nextInfo'),playhead:$('#playhead'),snap:$('#snapSelect'),timelineControl:$('#timelineControl'),otEnabled:$('#overtimeAlertEnabled'),manualBell:$('#manualBellCount'),theme:$('#themeSelect'),language:$('#languageSelect'),timerSize:$('#timerSizeSelect'),volume:$('#bellVolume'),volumeLabel:$('#volumeLabel'),settings:$('#settingsPanel'),settingsToggle:$('#settingsToggle'),fullscreen:$('#fullscreenBtn'),mainTpl:$('#mainTemplateButtons'),saveStatus:$('#saveStatus'),loadFileInput:$('#loadFileInput'),scheduleCard:$('#scheduleCard'),runtimeStage:$('#runtimeStage'),editBottomStage:$('#editBottomStage'),timelineCard:document.querySelector('.timeline-card'),timerCard:$('#timerCard'),addTemplate:$('#addTemplate'),duplicateTemplate:$('#duplicateTemplate'),deleteTemplate:$('#deleteTemplate'),templateCount:$('#templateCount'),editModeStatus:$('#editModeStatus')};
const KEY='presentationTimer.visual.v16';
const uid=()=>crypto?.randomUUID?.()||('m'+Date.now()+Math.random());
const defaults={
 '10 min Talk':{isDefault:true,start:0,end:900,snap:30,countMode:'down',timelineControl:false,manualBellCount:4,volume:100,endMeta:{bell:3,title:'Session End',message:'Session finished'},overtimeAlert:{enabled:true,offset:180,bell:4,title:'OT Alert',message:'3 minutes overtime'},markers:[{type:'event',time:0,bell:0,title:'Presentation',message:'Presentation in progress'},{type:'alert',time:540,bell:1,title:'1st Bell',message:'1 minute remaining'},{type:'event',time:600,bell:2,title:'Q&A',message:'Q&A time'}]},
 '30 min Talk':{isDefault:true,start:0,end:2400,snap:30,countMode:'down',timelineControl:false,manualBellCount:4,volume:100,endMeta:{bell:3,title:'Session End',message:'Session finished'},overtimeAlert:{enabled:true,offset:180,bell:4,title:'OT Alert',message:'3 minutes overtime'},markers:[{type:'event',time:0,bell:0,title:'Presentation',message:'Presentation in progress'},{type:'alert',time:1500,bell:1,title:'1st Bell',message:'5 minutes remaining'},{type:'alert',time:1740,bell:2,title:'2nd Bell',message:'1 minute remaining'},{type:'event',time:1800,bell:2,title:'Q&A',message:'Q&A time'}]},
 'Coffee Break':{isDefault:true,start:0,end:600,snap:30,countMode:'down',timelineControl:false,manualBellCount:4,volume:100,endMeta:{bell:3,title:'Coffee Break End',message:'Break is over'},overtimeAlert:{enabled:false,offset:180,bell:4,title:'OT Alert',message:'3 minutes overtime'},markers:[{type:'event',time:0,bell:0,title:'Coffee Break',message:'Break time'}]}
};
const i18n={
 en:{settings:'Settings',fullscreen:'Fullscreen',edit:'Edit',general:'General',theme:'Theme',language:'Language',timerSize:'Timer Font Size (px)',save:'Save Settings',load:'Load Settings',restore:'Restore Defaults',clear:'Clear Local Data',templateSettings:'Template Settings',templateTitle:'Template title',snap:'Snap',countMode:'Count mode',timelineControl:'Enable Timeline Control',otAlert:'Overtime Alert',manualBell:'Manual Bell Count',volume:'Bell Volume',saveEdit:'Save',tool:'Tool',select:'Select',alert:'Alert Bell',event:'Event',hint:'Choose a tool, then click the session area. Grab markers or the Session End handle to move them.',type:'Type',time:'Time',bellCount:'Bell count',title:'Title',message:'Message',schedule:'Schedule',sync:'Timeline and rows stay synchronized.',ring:'Ring',reset:'Reset',startBtn:'Start',pause:'Pause',next:'Next',overtime:'Overtime',presentation:'Presentation',presentationMsg:'Presentation in progress',alertName:'Alert Bell',eventName:'Event',end:'Session End',otName:'OT Alert',confirmClear:'Clear all saved Presentation Timer settings?',confirmRestore:'Restore default templates and settings?',confirmSwitch:'Timer is running. Switch template and reset?',switchTitle:'Switch template?',switchMessage:'Save the current changes before switching?',switchSave:'Save & Switch',switchDiscard:'Discard & Switch',switchCancel:'Cancel',saveOk:'Settings saved.',loadOk:'Settings loaded.',badFile:'Could not load this settings file.',addTemplate:'＋ Add Template',duplicate:'Duplicate',deleteTemplate:'Delete',maxTemplates:'You can create up to 10 templates.',confirmDeleteTemplate:'Delete this template?',cannotDeleteDefault:'Default templates cannot be deleted.',newTemplate:'New Template',copySuffix:'Copy',editModeAuto:'Edit Mode · Changes are saved automatically'},
 ja:{settings:'設定',fullscreen:'全画面',edit:'編集',general:'一般設定',theme:'Theme',language:'言語',timerSize:'タイマー文字サイズ (px)',save:'設定を保存',load:'設定を読み込む',restore:'デフォルトに戻す',clear:'ローカルデータを消去',templateSettings:'テンプレート設定',templateTitle:'テンプレート名',snap:'スナップ',countMode:'カウント方式',timelineControl:'タイムライン操作を有効化',otAlert:'超過アラート',manualBell:'手動ベル回数',volume:'ベル音量',saveEdit:'保存',tool:'ツール',select:'選択',alert:'お知らせベル',event:'イベント',hint:'ツールを選んでセッション領域をクリック。マーカーやセッション終了ハンドルはつかんで移動できます。',type:'種類',time:'時刻',bellCount:'ベル回数',title:'タイトル',message:'メッセージ',schedule:'スケジュール',sync:'タイムラインと行は同期します。',ring:'ベル',reset:'リセット',startBtn:'開始',pause:'一時停止',next:'次',overtime:'超過',presentation:'発表',presentationMsg:'発表中',alertName:'お知らせベル',eventName:'イベント',end:'セッション終了',otName:'超過アラート',confirmClear:'保存されているPresentation Timerのデータをすべて消去しますか？',confirmRestore:'デフォルトのテンプレートと設定に戻しますか？',confirmSwitch:'タイマー動作中です。テンプレートを切り替えてリセットしますか？',switchTitle:'テンプレートを切り替えますか？',switchMessage:'現在の編集内容を保存してから切り替えますか？',switchSave:'保存して切替',switchDiscard:'破棄して切替',switchCancel:'キャンセル',saveOk:'設定を保存しました。',loadOk:'設定を読み込みました。',badFile:'この設定ファイルを読み込めませんでした。',addTemplate:'＋ テンプレート追加',duplicate:'複製',deleteTemplate:'削除',maxTemplates:'テンプレートは最大10個まで作成できます。',confirmDeleteTemplate:'このテンプレートを削除しますか？',cannotDeleteDefault:'デフォルトテンプレートは削除できません。',newTemplate:'新規テンプレート',copySuffix:'コピー',editModeAuto:'編集モード · 変更は自動保存されます'}
};
function hydrate(t){const x=structuredClone(t);x.isDefault=!!x.isDefault;x.start=0;x.timelineControl=!!x.timelineControl;x.manualBellCount=x.manualBellCount??4;x.volume=x.volume??100;x.snap=x.snap||30;x.endMeta=x.endMeta||{bell:3,title:'Session End',message:'Session finished'};x.overtimeAlert={enabled:false,offset:180,bell:4,title:'OT Alert',message:'3 minutes overtime',...(x.overtimeAlert||{})};x.markers=(x.markers||[]).filter(m=>m.type!=='end').map(m=>({...m,id:m.id||uid()}));return x}
function freshStore(lang='en',theme='dark'){return {theme,language:lang,timerSize:300,selected:'10 min Talk',templates:Object.fromEntries(Object.entries(defaults).map(([k,v])=>[k,hydrate(v)]))}}
let store=freshStore();try{let raw=localStorage.getItem(KEY);if(!raw)raw=localStorage.getItem('presentationTimer.visual.v14');const s=JSON.parse(raw);if(s?.templates)store={...store,...s};store.timerSize=Number(store.timerSize)||300}catch{};Object.keys(store.templates||{}).forEach(name=>{
  const tpl=store.templates[name];
  if(['10 min Talk','30 min Talk','Coffee Break'].includes(name)&&tpl.isDefault===undefined)tpl.isDefault=true;
  if(tpl?.isDefault && ['10 min Talk','30 min Talk','Coffee Break'].includes(name)){
    tpl.markers=tpl.markers||[];
    const hasStartEvent=tpl.markers.some(m=>m.type==='event'&&Number(m.time)===0);
    if(!hasStartEvent){
      tpl.markers.unshift(name==='Coffee Break'
        ? {type:'event',time:0,bell:0,title:'Coffee Break',message:'Break time'}
        : {type:'event',time:0,bell:0,title:'Presentation',message:'Presentation in progress'});
    }
  }
});if(!store.templates[store.selected])store.selected=Object.keys(store.templates)[0];
let state=hydrate(store.templates[store.selected]),edit=false,tool='select',selectedId=null,running=false,startedAt=0,elapsedBefore=0,raf=0,fired=new Set(),endFired=false,otFired=false,editViewMax=0;
const tr=k=>i18n[store.language||'en'][k]||i18n.en[k]||k;

function localizeDefaultTemplates(lang){
  const ja=lang==='ja';

  const specs=[
    {
      enName:'10 min Talk', jaName:'10分発表',
      markerMap:{
        'Presentation':['発表','Presentation'],
        'Presentation in progress':['発表中','Presentation in progress'],
        '1st Bell':['ベル1','1st Bell'],
    '1鈴':['ベル1','1st Bell'],
        '1 minute remaining':['残り1分','1 minute remaining'],
        'Q&A':['質疑応答','Q&A'],
        'Q&A time':['質疑応答','Q&A time']
      }
    },
    {
      enName:'30 min Talk', jaName:'30分発表',
      markerMap:{
        'Presentation':['発表','Presentation'],
        'Presentation in progress':['発表中','Presentation in progress'],
        '1st Bell':['ベル1','1st Bell'],
        '5 minutes remaining':['残り5分','5 minutes remaining'],
        '2nd Bell':['ベル2','2nd Bell'],
    '2鈴':['ベル2','2nd Bell'],
        '1 minute remaining':['残り1分','1 minute remaining'],
        'Q&A':['質疑応答','Q&A'],
        'Q&A time':['質疑応答','Q&A time']
      }
    },
    {
      enName:'Coffee Break', jaName:'休憩',
      markerMap:{
        'Coffee Break':['休憩','Coffee Break'],
        'Break time':['休憩時間','Break time']
      }
    }
  ];

  const pairs={
    'Presentation':['発表','Presentation'],
    'Presentation in progress':['発表中','Presentation in progress'],
    '1st Bell':['ベル1','1st Bell'],
    '2nd Bell':['ベル2','2nd Bell'],
    '1 minute remaining':['残り1分','1 minute remaining'],
    '5 minutes remaining':['残り5分','5 minutes remaining'],
    'Q&A':['質疑応答','Q&A'],
    'Q&A time':['質疑応答','Q&A time'],
    'Session End':['セッション終了','Session End'],
    'Session finished':['セッション終了','Session finished'],
    'OT Alert':['超過アラート','OT Alert'],
    '3 minutes overtime':['3分超過','3 minutes overtime'],
    'Coffee Break':['休憩','Coffee Break'],
    'Break time':['休憩時間','Break time'],
    'Coffee Break End':['休憩終了','Coffee Break End'],
    'Break is over':['休憩終了','Break is over']
  };

  const convert=(value)=>{
    if(typeof value!=='string')return value;
    for(const [en,[j,e]] of Object.entries(pairs)){
      if(value===en || value===j || value===e) return ja?j:e;
    }
    return value;
  };

  specs.forEach(spec=>{
    const oldName=store.templates[spec.enName]?spec.enName:(store.templates[spec.jaName]?spec.jaName:null);
    if(!oldName)return;
    const tpl=store.templates[oldName];
    if(!tpl || !tpl.isDefault)return;

    (tpl.markers||[]).forEach(m=>{
      m.title=convert(m.title);
      m.message=convert(m.message);
    });

    if(tpl.endMeta){
      tpl.endMeta.title=convert(tpl.endMeta.title);
      tpl.endMeta.message=convert(tpl.endMeta.message);
    }
    if(tpl.overtimeAlert){
      tpl.overtimeAlert.title=convert(tpl.overtimeAlert.title);
      tpl.overtimeAlert.message=convert(tpl.overtimeAlert.message);
    }

    const newName=ja?spec.jaName:spec.enName;
    if(newName!==oldName){
      delete store.templates[oldName];
      store.templates[newName]=tpl;
      if(store.selected===oldName)store.selected=newName;
    }
  });

  if(!store.templates[store.selected])store.selected=Object.keys(store.templates)[0];
  state=hydrate(store.templates[store.selected]);
}
function parseTime(v){v=String(v).trim();let m=v.match(/^\+?(\d+)(?::|\.)(\d{1,2})$/);if(m)return +m[1]*60+Math.min(59,+m[2]);if(/^\+?\d+$/.test(v))return +v.replace('+','')*60;return NaN}
function fmt(sec){sec=Math.max(0,Math.round(sec));return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function snapSec(v){const s=+state.snap||30;return Math.round(v/s)*s}
function sorted(){return [...state.markers].sort((a,b)=>a.time-b.time||(a.type==='event'?1:-1))}
function calcEditMax(){const base=state.end+Math.max(300,state.end*.25);const ot=state.overtimeAlert?.enabled?state.end+(state.overtimeAlert.offset||180)+120:0;return Math.max(base,ot)}
function timelineMax(){return edit?(editViewMax||calcEditMax()):state.end}
function pct(t){const max=Math.max(1,timelineMax()-state.start);return ((t-state.start)/max)*100}
function saveStore(){store.templates[store.selected]=hydrate(state);localStorage.setItem(KEY,JSON.stringify(store))}
function applyTheme(v){document.body.className=document.body.className.replace(/\b(light|dark|high-contrast|paper|matrix|tokyo-night|cyberpunk|solarized)\b/g,'').trim();document.body.classList.add(v);store.theme=v;localStorage.setItem(KEY,JSON.stringify(store))}

function applyTimerSize(size){
  let px=Number(size);
  if(!Number.isFinite(px))px=300;
  px=Math.max(72,Math.min(320,Math.round(px)));
  store.timerSize=px;
  document.documentElement.style.setProperty('--timer-font-size', `${px}px`);
  if(els.timerSize && document.activeElement!==els.timerSize)els.timerSize.value=px;
}

function applyLanguage(){document.documentElement.lang=store.language||'en';els.settingsToggle.textContent=tr('settings');els.fullscreen.textContent=tr('fullscreen');els.edit.textContent=edit?tr('saveEdit'):tr('edit');$('#generalHeading').textContent=tr('general');$('#themeLabel').textContent='Theme';$('#languageLabel').textContent=tr('language');if($('#timerSizeLabel'))$('#timerSizeLabel').textContent=tr('timerSize');$('#saveFile').textContent=tr('save');$('#loadFile').textContent=tr('load');$('#restoreDefaults').textContent=tr('restore');$('#clearData').textContent=tr('clear');$('#templateSettingsLabel').textContent=tr('templateSettings');$('#templateTitleLabel').textContent=tr('templateTitle');$('#snapLabel').textContent=tr('snap');$('#countModeLabel').textContent=tr('countMode');$('#timelineControlLabel').textContent=tr('timelineControl');$('#overtimeAlertLabel').textContent=`${tr('otAlert')} (+${fmt(state.overtimeAlert?.offset||180)})`;$('#manualBellLabel').textContent=tr('manualBell');$('#volumeText').textContent=tr('volume');$('#toolLabel').textContent=tr('tool');$('#selectTool').textContent=tr('select');$('#alertTool').textContent=tr('alert');$('#eventTool').textContent=tr('event');$('#toolbarHint').textContent=tr('hint');$('#scheduleHeading').textContent=tr('schedule');$('#syncHint').textContent=tr('sync');$('#thTime').textContent=tr('time');$('#thType').textContent=tr('type');$('#thBell').textContent=tr('bellCount');$('#thTitle').textContent=tr('title');$('#thMessage').textContent=tr('message');$('#thActions').textContent=store.language==='ja'?'操作':'Actions';els.reset.textContent=tr('reset');els.ring.textContent=tr('ring');els.startPause.textContent=running?tr('pause'):tr('startBtn');els.addTemplate.textContent=tr('addTemplate');els.duplicateTemplate.textContent=tr('duplicate');els.deleteTemplate.textContent=tr('deleteTemplate');if(els.editModeStatus)els.editModeStatus.textContent=tr('editModeAuto');renderTable();updateDisplay()}
function renderTemplates(){els.mainTpl.innerHTML='';Object.keys(store.templates).forEach(name=>{const b=document.createElement('button');b.textContent=name;b.classList.toggle('active',name===store.selected);b.disabled=false;b.onclick=()=>switchTemplate(name);els.mainTpl.appendChild(b)});const count=Object.keys(store.templates).length;els.templateCount.textContent=`${count} / 10`;els.addTemplate.disabled=edit||count>=10;els.duplicateTemplate.disabled=edit||count>=10;els.deleteTemplate.disabled=edit||!!state.isDefault||count<=1;els.deleteTemplate.title=state.isDefault?tr('cannotDeleteDefault'):tr('deleteTemplate')}
function saveCurrentTemplateWhileEditing(){
  // Save the current in-memory state without leaving Edit Mode.
  // If the title was changed, rename the template when that name is available.
  const oldName=store.selected;
  const typedName=(els.templateTitle?.value||'').trim();
  let finalName=typedName||oldName;
  if(finalName!==oldName && store.templates[finalName]){
    // Avoid an interrupting prompt during rapid template switching.
    // Keep the existing template name if the requested name is already in use.
    finalName=oldName;
    if(els.templateTitle)els.templateTitle.value=oldName;
  }
  if(finalName!==oldName){
    delete store.templates[oldName];
    store.selected=finalName;
  }
  store.templates[store.selected]=hydrate(state);
  saveStore();
}
function performTemplateSwitch(name,{keepEdit=false}={}){
  resetTimer();
  store.selected=name;
  state=hydrate(store.templates[name]);
  selectedId=null;
  editViewMax=edit?calcEditMax():0;
  syncControls();
  saveStore();
  render();
  if(keepEdit){
    document.body.classList.add('editing');
    els.templateEditor.classList.remove('hidden');
    els.toolbar.classList.remove('hidden');
    els.scheduleCard.classList.remove('hidden');
    moveToEditStage();
    if(els.editModeStatus)els.editModeStatus.classList.remove('hidden');
  }
}
function switchTemplate(name){
  if(name===store.selected)return;
  if(edit){
    saveCurrentTemplateWhileEditing();
    performTemplateSwitch(name,{keepEdit:true});
    return;
  }
  const inFullscreen=!!(document.fullscreenElement||document.webkitFullscreenElement);
  if(running&&!inFullscreen&&!confirm(tr('confirmSwitch')))return;
  performTemplateSwitch(name);
}
function uniqueTemplateName(base){let name=base.trim()||tr('newTemplate'),i=2;while(store.templates[name])name=`${base} ${i++}`;return name}
function addTemplate(copyCurrent=true){if(edit)return;if(Object.keys(store.templates).length>=10){alert(tr('maxTemplates'));return}resetTimer();const base=tr('newTemplate'),name=uniqueTemplateName(base);const src=copyCurrent?hydrate(state):hydrate(defaults['10 min Talk']);src.isDefault=false;store.templates[name]=src;store.selected=name;state=hydrate(src);saveStore();syncControls();render();startEdit()}
function duplicateTemplate(){if(edit)return;if(Object.keys(store.templates).length>=10){alert(tr('maxTemplates'));return}resetTimer();const base=`${store.selected} ${tr('copySuffix')}`;const name=uniqueTemplateName(base);const src=hydrate(state);src.isDefault=false;store.templates[name]=src;store.selected=name;state=hydrate(src);saveStore();syncControls();render()}
function deleteCurrentTemplate(){if(edit)return;if(state.isDefault){alert(tr('cannotDeleteDefault'));return}if(!confirm(tr('confirmDeleteTemplate')))return;const names=Object.keys(store.templates),idx=names.indexOf(store.selected);delete store.templates[store.selected];const left=Object.keys(store.templates);store.selected=left[Math.max(0,Math.min(idx,left.length-1))];state=hydrate(store.templates[store.selected]);resetTimer();saveStore();syncControls();render()}
function syncControls(){els.snap.value=String(state.snap||30);$$('input[name="countMode"]').forEach(r=>r.checked=r.value===(state.countMode||'down'));els.timelineControl.checked=!!state.timelineControl;els.otEnabled.checked=!!state.overtimeAlert?.enabled;$('#overtimeAlertLabel').textContent=`${tr('otAlert')} (+${fmt(state.overtimeAlert?.offset||180)})`;els.manualBell.value=state.manualBellCount??4;els.volume.value=state.volume??100;els.volumeLabel.textContent=`${state.volume??100}%`;els.theme.value=store.theme||'dark';els.language.value=store.language||'en';if(els.timerSize)els.timerSize.value=Number(store.timerSize)||300;els.templateTitle.value=store.selected;applyTheme(store.theme||'dark');applyTimerSize(Number(store.timerSize)||300);document.body.classList.toggle('timeline-control-enabled',!!state.timelineControl)}

function syncFullscreenWidth(){
  const row=document.getElementById('mainTemplateButtons');
  if(!row)return;
  const buttons=[...row.querySelectorAll('button')].filter(b=>b.offsetParent!==null);
  if(!buttons.length)return;
  const left=Math.min(...buttons.map(b=>b.getBoundingClientRect().left));
  const right=Math.max(...buttons.map(b=>b.getBoundingClientRect().right));
  const width=Math.max(0,Math.round(right-left));
  if(width>0)document.documentElement.style.setProperty('--template-row-width',`${width}px`);
}

function render(){const max=timelineMax();els.startLabel.textContent='0:00';els.endLabel.textContent=fmt(max);els.timeline.style.setProperty('--session-pct',`${clamp(pct(state.end),0,100)}%`);renderTemplates();renderMarkers();renderSegments();renderTable();updateDisplay();showSelectedInMain();requestAnimationFrame(syncFullscreenWidth)}
function renderMarkers(){els.markerLayer.innerHTML='';sorted().forEach(m=>makeMarker(m));makeMarker({id:'__end__',type:'end',time:state.end,bell:state.endMeta?.bell||0,title:state.endMeta?.title||tr('end'),message:state.endMeta?.message||''},'end');if(edit&&state.overtimeAlert?.enabled){makeMarker({id:'__ot__',type:'ot',time:state.end+(state.overtimeAlert.offset||180),bell:state.overtimeAlert.bell||0,title:state.overtimeAlert.title||tr('otName'),message:state.overtimeAlert.message||''},'ot')}}
function makeMarker(m,special=''){const e=document.createElement('div');e.className=`marker ${m.type}${m.id===selectedId?' selected':''}`;e.dataset.id=m.id;e.style.left=`${clamp(pct(m.time),0,100)}%`;const icon=m.type==='alert'||m.type==='ot'?'<span class="simple-bell" aria-hidden="true"></span>':m.type==='end'?'<span class="simple-end" aria-hidden="true"></span>':'';const timeLabel=m.type==='ot'?`+${fmt(m.time-state.end)}`:fmt(m.time);e.innerHTML=`<div class="marker-dot">${icon}</div><div class="marker-time">${timeLabel}</div>`;els.markerLayer.appendChild(e);attachDrag(e,m,special)}
function renderSegments(){const max=timelineMax();const sessionPct=clamp((state.end/max)*100,0,100);els.segments.style.width=`${sessionPct}%`;els.segments.style.right='auto';const events=sorted().filter(m=>m.type==='event'&&m.time>0&&m.time<state.end),bounds=[0,...events.map(m=>m.time),state.end];els.segments.innerHTML='';for(let i=0;i<bounds.length-1;i++){const s=document.createElement('div');s.className='segment';s.style.width=`${(bounds[i+1]-bounds[i])/state.end*100}%`;els.segments.appendChild(s)}els.phases.innerHTML='';const starts=[{time:0,title:tr('presentation')},...events.map(e=>({time:e.time,title:e.title||tr('eventName')}))];starts.forEach((p,i)=>{const n=starts[i+1]?.time??state.end,l=document.createElement('div');l.className='phase-label';l.style.left=`${pct((p.time+n)/2)}%`;l.textContent=p.title;els.phases.appendChild(l)})}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderTable(){const rows=[...sorted(),{boundary:'end',type:'end',time:state.end,bell:state.endMeta?.bell||0,title:state.endMeta?.title||tr('end'),message:state.endMeta?.message||''}];if(state.overtimeAlert?.enabled)rows.push({boundary:'ot',type:'ot',time:state.overtimeAlert.offset||180,bell:state.overtimeAlert.bell||0,title:state.overtimeAlert.title||tr('otName'),message:state.overtimeAlert.message||''});els.tbody.innerHTML='';rows.forEach(r=>{let typeText=r.boundary==='end'?tr('end'):r.boundary==='ot'?tr('otName'):(r.type==='alert'?tr('alertName'):tr('eventName'));const trEl=document.createElement('tr');if(!edit){trEl.innerHTML=`<td>${r.boundary==='ot'?'+':''}${fmt(r.time)}</td><td><span class="type-pill ${r.boundary||r.type}">${esc(typeText)}</span></td><td>${r.bell||0}</td><td>${esc(r.title||'')}</td><td>${esc(r.message||'')}</td><td></td>`}else{trEl.innerHTML=`<td><input class="table-time" value="${r.boundary==='ot'?'+':''}${fmt(r.time)}" inputmode="numeric"></td><td><span class="type-pill ${r.boundary||r.type}">${esc(typeText)}</span></td><td><input class="table-bell" type="number" min="0" max="8" value="${r.bell||0}"></td><td><input class="table-title" value="${esc(r.title||'')}"></td><td><input class="table-message" value="${esc(r.message||'')}"></td><td class="table-actions"></td>`;const ti=trEl.querySelector('.table-time'),bi=trEl.querySelector('.table-bell'),tt=trEl.querySelector('.table-title'),mi=trEl.querySelector('.table-message'),actions=trEl.querySelector('.table-actions');const preview=document.createElement('button');preview.type='button';preview.textContent=store.language==='ja'?'試聴':'Preview';preview.className='mini-action';preview.onclick=async ev=>{ev.stopPropagation();selectedId=r.boundary==='end'?'__end__':r.boundary==='ot'?'__ot__':r.id;showSelectedInMain();const m=selectedMarker();if(m?.bell)await ring(m.bell);renderTable()};actions.appendChild(preview);if(!r.boundary){const del=document.createElement('button');del.type='button';del.textContent=store.language==='ja'?'削除':'Delete';del.className='mini-action danger-soft';del.onclick=ev=>{ev.stopPropagation();state.markers=state.markers.filter(m=>m.id!==r.id);if(selectedId===r.id)selectedId=null;render()};actions.appendChild(del)}
 if(r.boundary==='end'){trEl.classList.toggle('selected-row',selectedId==='__end__');trEl.onclick=e=>{if(e.target.matches('input,button'))return;selectedId='__end__';render()};ti.onchange=()=>{const v=parseTime(ti.value),minEnd=Math.max(30,...state.markers.map(m=>m.time+(state.snap||30)));if(Number.isFinite(v)&&v>=minEnd){state.end=snapSec(v);editViewMax=Math.max(editViewMax,calcEditMax());selectedId='__end__';render()}else ti.value=fmt(state.end)};bi.onchange=()=>{state.endMeta.bell=clamp(+bi.value||0,0,8);selectedId='__end__';showSelectedInMain()};tt.oninput=()=>{state.endMeta.title=tt.value;selectedId='__end__';showSelectedInMain()};mi.oninput=()=>{state.endMeta.message=mi.value;selectedId='__end__';showSelectedInMain()}}
 else if(r.boundary==='ot'){trEl.classList.toggle('selected-row',selectedId==='__ot__');trEl.onclick=e=>{if(e.target.matches('input,button'))return;selectedId='__ot__';render()};ti.onchange=()=>{const v=parseTime(ti.value);if(Number.isFinite(v)&&v>0){state.overtimeAlert.offset=Math.max(state.snap||30,snapSec(v));editViewMax=Math.max(editViewMax,calcEditMax());selectedId='__ot__';render()}else ti.value=`+${fmt(state.overtimeAlert.offset)}`};bi.onchange=()=>{state.overtimeAlert.bell=clamp(+bi.value||0,0,8);selectedId='__ot__';showSelectedInMain()};tt.oninput=()=>{state.overtimeAlert.title=tt.value;selectedId='__ot__';showSelectedInMain()};mi.oninput=()=>{state.overtimeAlert.message=mi.value;selectedId='__ot__';showSelectedInMain()}}
 else{trEl.classList.toggle('selected-row',r.id===selectedId);trEl.onclick=e=>{if(e.target.matches('input,button'))return;selectedId=r.id;render()};ti.onchange=()=>{const v=parseTime(ti.value);if(Number.isFinite(v)){r.time=clamp(snapSec(v),0,state.end);selectedId=r.id;render()}else ti.value=fmt(r.time)};bi.onchange=()=>{r.bell=clamp(+bi.value||0,0,8);selectedId=r.id;showSelectedInMain()};tt.oninput=()=>{r.title=tt.value;selectedId=r.id;renderSegments();showSelectedInMain()};mi.oninput=()=>{r.message=mi.value;selectedId=r.id;showSelectedInMain()}}
 }els.tbody.appendChild(trEl)})}
function selectedMarker(){if(selectedId==='__end__')return {id:'__end__',type:'end',time:state.end,bell:state.endMeta?.bell||0,title:state.endMeta?.title||tr('end'),message:state.endMeta?.message||''};if(selectedId==='__ot__'&&state.overtimeAlert?.enabled)return {id:'__ot__',type:'ot',time:state.end+(state.overtimeAlert.offset||180),offset:state.overtimeAlert.offset||180,bell:state.overtimeAlert.bell||0,title:state.overtimeAlert.title||tr('otName'),message:state.overtimeAlert.message||''};return state.markers.find(x=>x.id===selectedId)}
function showSelectedInMain(){if(!edit)return false;const m=selectedMarker();if(!m)return false;els.title.textContent=m.title||(m.type==='alert'?tr('alertName'):m.type==='event'?tr('eventName'):m.type==='ot'?tr('otName'):tr('end'));els.msg.textContent=m.message||'';els.main.textContent=m.type==='ot'?`+${fmt(m.offset)}`:fmt(m.time);els.next.textContent=`${m.type==='ot'?tr('otName'):m.type==='end'?tr('end'):m.type==='alert'?tr('alertName'):tr('eventName')} · ${m.type==='ot'?'+':''}${fmt(m.type==='ot'?m.offset:m.time)} · Bell ×${m.bell||0}`;els.playhead.style.left=`${clamp(pct(m.time),0,100)}%`;els.playhead.style.opacity='1';document.body.classList.remove('session-over');return true}
function attachDrag(el,m,special=''){el.onpointerdown=e=>{if(!edit||e.button>0)return;e.preventDefault();e.stopPropagation();selectedId=m.id;tool='select';setToolButtons();el.classList.add('dragging','selected');showSelectedInMain();const pointerId=e.pointerId;try{el.setPointerCapture(pointerId)}catch{};const move=ev=>{if(ev.pointerId!==pointerId)return;ev.preventDefault();const r=els.timeline.getBoundingClientRect(),x=clamp(ev.clientX-r.left,0,r.width),abs=snapSec(x/r.width*timelineMax());if(special==='end'){const minEnd=Math.max(30,...state.markers.map(x=>x.time+(state.snap||30)));state.end=clamp(abs,minEnd,timelineMax());m.time=state.end}else if(special==='ot'){const raw=Math.max(state.snap||30,abs-state.end);state.overtimeAlert.offset=Math.max(state.snap||30,snapSec(raw));m.time=state.end+state.overtimeAlert.offset}else{m.time=clamp(abs,0,state.end)};el.style.left=`${clamp(pct(m.time),0,100)}%`;const timeEl=el.querySelector('.marker-time');if(timeEl)timeEl.textContent=special==='ot'?`+${fmt(state.overtimeAlert.offset)}`:fmt(m.time);renderSegments();renderTable();showSelectedInMain()};const finish=ev=>{if(ev.pointerId!==pointerId)return;window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',finish);window.removeEventListener('pointercancel',finish);try{if(el.hasPointerCapture(pointerId))el.releasePointerCapture(pointerId)}catch{}el.classList.remove('dragging');editViewMax=Math.max(calcEditMax(),state.end+Math.max(300,state.end*.25));render()};window.addEventListener('pointermove',move,{passive:false});window.addEventListener('pointerup',finish);window.addEventListener('pointercancel',finish)}}
function setToolButtons(){$$('.tool').forEach(b=>b.classList.toggle('active',b.dataset.tool===tool))}
$$('.tool').forEach(b=>b.onclick=()=>{tool=b.dataset.tool;setToolButtons()});
els.timeline.onclick=e=>{if(!edit)return;if(tool==='select'||e.target.closest('.marker'))return;const r=els.timeline.getBoundingClientRect(),abs=snapSec((e.clientX-r.left)/r.width*timelineMax());const t=clamp(abs,0,state.end);const m={id:uid(),type:tool,time:t,bell:tool==='alert'?1:0,title:tool==='alert'?tr('alertName'):tr('eventName'),message:''};state.markers.push(m);selectedId=m.id;tool='select';setToolButtons();render()};
let scrubbing=false,scrubPointer=null;
function scrubTo(clientX){const r=els.timeline.getBoundingClientRect(),ratio=clamp((clientX-r.left)/r.width,0,1);elapsedBefore=ratio*state.end;if(running)startedAt=performance.now();const now=elapsedBefore;fired=new Set(sorted().filter(m=>m.time<=now).map(m=>m.id));endFired=now>=state.end;otFired=!!(state.overtimeAlert?.enabled&&now>=state.end+(state.overtimeAlert.offset||180));updateDisplay()}
els.timeline.addEventListener('pointerdown',e=>{if(edit||!state.timelineControl||e.button>0)return;e.preventDefault();scrubbing=true;scrubPointer=e.pointerId;document.body.classList.add('scrubbing');if(running)cancelAnimationFrame(raf);try{els.timeline.setPointerCapture(e.pointerId)}catch{}scrubTo(e.clientX)});
els.timeline.addEventListener('pointermove',e=>{if(!scrubbing||e.pointerId!==scrubPointer)return;e.preventDefault();scrubTo(e.clientX)},{passive:false});
function stopScrub(e){if(!scrubbing||e.pointerId!==scrubPointer)return;scrubbing=false;document.body.classList.remove('scrubbing');try{els.timeline.releasePointerCapture(e.pointerId)}catch{}scrubPointer=null;if(running){startedAt=performance.now();cancelAnimationFrame(raf);tick()}}
els.timeline.addEventListener('pointerup',stopScrub);els.timeline.addEventListener('pointercancel',stopScrub);
function moveToEditStage(){els.editBottomStage.classList.remove('hidden');els.editBottomStage.appendChild(els.timelineCard);els.editBottomStage.appendChild(els.timerCard)}
function moveToRuntimeStage(){els.runtimeStage.appendChild(els.timerCard);els.runtimeStage.appendChild(els.timelineCard);els.editBottomStage.classList.add('hidden')}
function startEdit(){if(running)return;edit=true;editViewMax=calcEditMax();document.body.classList.add('editing');els.edit.textContent=tr('saveEdit');els.templateEditor.classList.remove('hidden');els.toolbar.classList.remove('hidden');els.scheduleCard.classList.remove('hidden');els.settings.classList.add('hidden');selectedId=null;if(els.editModeStatus){els.editModeStatus.textContent=tr('editModeAuto');els.editModeStatus.classList.remove('hidden')}moveToEditStage();syncControls();render()}
function finishEdit(){const newName=els.templateTitle.value.trim()||store.selected;if(newName!==store.selected){if(store.templates[newName]&&newName!==store.selected){alert('A template with this name already exists.');return}delete store.templates[store.selected];store.selected=newName}store.templates[store.selected]=hydrate(state);edit=false;editViewMax=0;document.body.classList.remove('editing');selectedId=null;els.edit.textContent=tr('edit');els.toolbar.classList.add('hidden');els.templateEditor.classList.add('hidden');els.scheduleCard.classList.add('hidden');if(els.editModeStatus)els.editModeStatus.classList.add('hidden');moveToRuntimeStage();saveStore();render()}
els.edit.onclick=()=>edit?finishEdit():startEdit();els.addTemplate.onclick=()=>addTemplate(true);els.duplicateTemplate.onclick=duplicateTemplate;els.deleteTemplate.onclick=deleteCurrentTemplate;
els.snap.onchange=()=>{state.snap=+els.snap.value;editViewMax=calcEditMax();render()};
$$('input[name="countMode"]').forEach(r=>r.onchange=()=>{if(r.checked){state.countMode=r.value;updateDisplay()}});
els.timelineControl.onchange=()=>{state.timelineControl=els.timelineControl.checked;document.body.classList.toggle('timeline-control-enabled',state.timelineControl)};
els.otEnabled.onchange=()=>{state.overtimeAlert.enabled=els.otEnabled.checked;editViewMax=calcEditMax();if(!state.overtimeAlert.enabled&&selectedId==='__ot__')selectedId=null;render()};
els.manualBell.onchange=()=>state.manualBellCount=clamp(+els.manualBell.value||4,1,8);els.theme.onchange=()=>applyTheme(els.theme.value);if(els.timerSize){
  const applyTimerSizeInput=()=>{
    const raw=Number(els.timerSize.value);
    if(!Number.isFinite(raw))return;
    applyTimerSize(raw);
    saveStore();
  };
  els.timerSize.addEventListener('input', applyTimerSizeInput);
  els.timerSize.addEventListener('change', ()=>{
    applyTimerSize(els.timerSize.value);
    saveStore();
  });
}
els.language.onchange=()=>{store.language=els.language.value;localizeDefaultTemplates(store.language);saveStore();applyLanguage();syncControls();render()};els.volume.oninput=()=>{state.volume=+els.volume.value;els.volumeLabel.textContent=`${state.volume}%`};
function elapsed(){return running?elapsedBefore+(performance.now()-startedAt)/1000:elapsedBefore}
function activeAt(now){return sorted().filter(m=>m.type==='event'&&m.time<=now).at(-1)||{title:store.selected||tr('presentation'),message:''}}
function nextTarget(now){return sorted().find(m=>m.type==='event'&&m.time>now)||{time:state.end,title:state.endMeta?.title||tr('end')}}
function updateDisplay(){if(showSelectedInMain())return;const e=elapsed(),now=e,isOver=now>=state.end,otActive=isOver&&state.overtimeAlert?.enabled&&now>=state.end+(state.overtimeAlert.offset||180),active=otActive?{title:state.overtimeAlert.title||tr('otName'),message:state.overtimeAlert.message||''}:isOver?{title:state.endMeta?.title||tr('end'),message:state.endMeta?.message||''}:activeAt(now),next=nextTarget(now);els.title.textContent=active.title||store.selected||tr('presentation');els.msg.textContent=active.message||'';if(isOver){const over=Math.max(0,now-state.end);if(state.countMode==='up'){els.main.textContent=fmt(e);els.next.textContent=`${tr('overtime')} +${fmt(over)}`}else{els.main.textContent=`+${fmt(over)}`;els.next.textContent=tr('overtime')}}else{els.main.textContent=state.countMode==='up'?fmt(e):fmt(Math.max(0,next.time-now));els.next.textContent=`${tr('next')}: ${next.title||tr('eventName')} at ${fmt(next.time)}`}els.playhead.style.left=`${clamp(now/state.end,0,1)*100}%`;els.playhead.style.opacity=e>0?'1':'0';document.body.classList.toggle('session-over',isOver)}
function tick(){const now=elapsed();sorted().forEach(m=>{if(!fired.has(m.id)&&now>=m.time){fired.add(m.id);if(m.bell)ring(m.bell)}});if(!endFired&&now>=state.end){endFired=true;if(state.endMeta?.bell)ring(state.endMeta.bell)}if(state.overtimeAlert?.enabled&&!otFired&&now>=state.end+(state.overtimeAlert.offset||180)){otFired=true;if(state.overtimeAlert.bell)ring(state.overtimeAlert.bell);els.title.textContent=state.overtimeAlert.title||tr('otName');els.msg.textContent=state.overtimeAlert.message||''}updateDisplay();if(running)raf=requestAnimationFrame(tick)}
els.startPause.onclick=()=>{if(edit)return;if(running){elapsedBefore=elapsed();running=false;cancelAnimationFrame(raf);els.startPause.textContent=tr('startBtn');updateDisplay()}else{startedAt=performance.now();running=true;els.startPause.textContent=tr('pause');tick()}};
function resetTimer(){running=false;cancelAnimationFrame(raf);elapsedBefore=0;fired.clear();endFired=false;otFired=false;els.startPause.textContent=tr('startBtn');document.body.classList.remove('session-over');updateDisplay()}els.reset.onclick=resetTimer;
let audioCtx=null;async function ensureAudio(){try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;if(!audioCtx||audioCtx.state==='closed')audioCtx=new AC();if(audioCtx.state==='suspended')await audioCtx.resume();return audioCtx}catch(err){console.warn('AudioContext unavailable',err);return null}}
function strikeBell(ctx,t,vol){const master=ctx.createGain();master.gain.setValueAtTime(.0001,t);master.gain.exponentialRampToValueAtTime(Math.max(.001,.62*vol),t+.008);master.gain.exponentialRampToValueAtTime(.0001,t+.42);master.connect(ctx.destination);[880,1320,1760].forEach((hz,idx)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=idx===0?'sine':'triangle';o.frequency.setValueAtTime(hz,t);g.gain.setValueAtTime(idx===0?.72:idx===1?.24:.12,t);o.connect(g).connect(master);o.start(t);o.stop(t+.44)})}
async function ring(count=1){const ctx=await ensureAudio();if(!ctx)return false;const vol=clamp((state.volume??100)/100,0,1);if(vol<=0)return true;const n=clamp(Math.round(+count||1),1,8),base=ctx.currentTime+.015;for(let i=0;i<n;i++)strikeBell(ctx,base+i*.30,vol);return true}
els.ring.addEventListener('pointerdown',()=>{ensureAudio()},{passive:true});els.ring.onclick=()=>{ring(state.manualBellCount??4)};
els.settingsToggle.onclick=e=>{if(edit)return;e.stopPropagation();els.settings.classList.toggle('hidden')};
document.addEventListener('pointerdown',e=>{if(els.settings.classList.contains('hidden'))return;if(els.settings.contains(e.target)||els.settingsToggle.contains(e.target))return;els.settings.classList.add('hidden')});
els.fullscreen.onclick=async()=>{if(document.body.classList.contains('editing'))return;try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch{}};
$('#saveFile').onclick=()=>{saveStore();const blob=new Blob([JSON.stringify({app:'Presentation Timer',version:16,savedAt:new Date().toISOString(),data:store},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`presentation-timer-settings-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);els.saveStatus.textContent=tr('saveOk')};
$('#loadFile').onclick=()=>els.loadFileInput.click();els.loadFileInput.onchange=async()=>{const f=els.loadFileInput.files?.[0];if(!f)return;try{const j=JSON.parse(await f.text()),d=j.data||j;if(!d?.templates)throw 0;store={...freshStore(d.language||'en',d.theme||'dark'),...d};if(!store.templates[store.selected])store.selected=Object.keys(store.templates)[0];state=hydrate(store.templates[store.selected]);saveStore();syncControls();applyLanguage();render();els.saveStatus.textContent=tr('loadOk')}catch{els.saveStatus.textContent=tr('badFile')}finally{els.loadFileInput.value=''}};
$('#restoreDefaults').onclick=()=>{if(confirm(tr('confirmRestore'))){const lang=store.language||'en',theme=store.theme||'dark';store=freshStore(lang,theme);state=hydrate(store.templates[store.selected]);saveStore();syncControls();applyLanguage();render()}};
$('#clearData').onclick=()=>{if(confirm(tr('confirmClear'))){localStorage.removeItem(KEY);location.reload()}};
document.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;if(e.code==='Space'){e.preventDefault();els.startPause.click()}if(e.key.toLowerCase()==='r')els.reset.click();if(e.key.toLowerCase()==='f')els.fullscreen.click()});window.addEventListener('pagehide',()=>{if(!edit)saveStore()});
syncControls();applyLanguage();localizeDefaultTemplates(store.language||'en');
render();
})();


function updateFullscreenButtonLabelV18(){
  const btn = document.getElementById("fullscreenBtn");
  if (!btn) return;
  const active = !!(document.fullscreenElement || document.webkitFullscreenElement);
  const lang = (document.getElementById("languageSelect")?.value || "en");
  btn.textContent = active
    ? (lang === "ja" ? "全画面を終了" : "Exit Fullscreen")
    : (lang === "ja" ? "全画面表示" : "Fullscreen");
}
document.addEventListener("fullscreenchange", updateFullscreenButtonLabelV18);
document.addEventListener("webkitfullscreenchange", updateFullscreenButtonLabelV18);
window.addEventListener("load", updateFullscreenButtonLabelV18);
document.getElementById("languageSelect")?.addEventListener("change", updateFullscreenButtonLabelV18);

window.addEventListener('resize',syncFullscreenWidth);
