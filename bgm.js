export function mountBgm(player) {
  const audio = player.querySelector('audio');
  const toggle = player.querySelector('#bgm-toggle');
  const slider = player.querySelector('#bgm-volume');
  const level = player.querySelector('#bgm-level');
  const status = player.querySelector('#bgm-status');
  let context, gain;

  function announce(message, visible = false) {
    status.textContent = message;
    status.classList.toggle('sr-only', !visible);
  }

  function setVolume() {
    const value = Number(slider.value);
    if (gain) gain.gain.value = value / 100;
    else audio.volume = value / 100;
    level.textContent = `${value}%`;
    slider.setAttribute('aria-valuetext', `${value}%`);
  }

  setVolume();
  // Some mobile browsers reserve the media element's volume for system controls.
  if (audio.volume !== Number(slider.value) / 100) {
    try {
      context = new AudioContext();
      gain = context.createGain();
      setVolume();
      context.createMediaElementSource(audio).connect(gain).connect(context.destination);
    } catch {
      void context?.close().catch(() => {});
      context = gain = undefined;
      slider.disabled = true;
      level.hidden = true;
      announce('请使用设备音量键调节背景音乐。');
    }
  }

  function syncPlayback() {
    const playing = !audio.paused && !audio.ended;
    const label = playing ? '暂停背景音乐' : '播放背景音乐';
    toggle.toggleAttribute('data-playing', playing);
    toggle.setAttribute('aria-label', label);
    toggle.title = `${label} · count it from zero`;
  }

  function reportError() {
    syncPlayback();
    announce('背景音乐暂时无法播放。', true);
  }

  function play() {
    announce('');
    if (context?.state === 'suspended' || context?.state === 'interrupted') {
      void context.resume().catch(reportError);
    }
    if (audio.error) audio.load();
    void audio.play().catch(error => {
      if (error.name === 'NotAllowedError') announce('点按播放键开启背景音乐。');
      else if (error.name !== 'AbortError') reportError();
    });
  }

  slider.addEventListener('input', setVolume);
  for (const event of ['play', 'pause', 'ended']) audio.addEventListener(event, syncPlayback);
  audio.addEventListener('error', reportError);
  toggle.addEventListener('click', () => {
    if (audio.paused) play();
    else audio.pause();
  });
  player.hidden = false;
  if (!slider.disabled && (!context || context.state === 'running')) play();
}
