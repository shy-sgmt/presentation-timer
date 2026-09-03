(() => {
  const installBtn = document.getElementById('installAppBtn');
  const status = document.getElementById('installAppStatus');
  if (!installBtn || !status) return;

  let deferredPrompt = null;

  const isJa = () => document.documentElement.lang === 'ja';
  const setText = () => {
    installBtn.textContent = isJa() ? 'アプリをインストール' : 'Install App';
  };
  const setStatus = (en, ja) => {
    status.textContent = isJa() ? ja : en;
  };

  setText();
  document.querySelectorAll('input[name="languageMode"]').forEach(input => {
    input.addEventListener('change', () => {
      setTimeout(setText, 0);
      if (status.dataset.kind === 'fileMode') {
        setStatus('Standalone file mode: use 00_START_HERE.html.', 'スタンドアローン版では 00_START_HERE.html から起動できます。');
      }
    });
  });

  const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (standalone) {
    installBtn.hidden = true;
    setStatus('App is installed.', 'アプリとしてインストール済みです。');
  }

  if (location.protocol === 'file:') {
    installBtn.hidden = true;
    status.dataset.kind = 'fileMode';
    setStatus('Standalone file mode: use 00_START_HERE.html.', 'スタンドアローン版では 00_START_HERE.html から起動できます。');
    return;
  }

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch(err => {
        console.warn('Service worker registration failed:', err);
      });
    });
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    if (!standalone) {
      installBtn.hidden = false;
      setStatus('This timer can be installed as an app.', 'このタイマーをアプリとしてインストールできます。');
    }
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) {
      setStatus('Use your browser menu and choose “Install app” or “Add to Home Screen”.', 'ブラウザのメニューから「アプリをインストール」または「ホーム画面に追加」を選んでください。');
      return;
    }
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setStatus('Installation started.', 'インストールを開始しました。');
    } else {
      setStatus('Installation cancelled.', 'インストールをキャンセルしました。');
    }
    deferredPrompt = null;
    installBtn.hidden = true;
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installBtn.hidden = true;
    setStatus('App installed.', 'アプリをインストールしました。');
  });
})();
