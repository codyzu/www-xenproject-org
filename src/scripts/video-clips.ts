const initializeVideoClips = () => {
  for (const player of document.querySelectorAll<HTMLElement>('[data-video-clip-player]')) {
    const playButton = player.querySelector<HTMLElement>('[data-video-clip-play]');
    if (!playButton || playButton.dataset.ready === 'true') continue;
    playButton.dataset.ready = 'true';

    playButton.addEventListener('click', (event) => {
      event.preventDefault();
      const {videoId} = player.dataset;
      if (!videoId) return;

      const parameters = new URLSearchParams({
        start: player.dataset.start ?? '0',
        autoplay: '1',
        rel: '0',
        playsinline: '1',
      });
      if (player.dataset.end) parameters.set('end', player.dataset.end);

      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${parameters}`;
      iframe.title = player.dataset.iframeTitle ?? 'YouTube video clip';
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      iframe.className = 'uno-h-full uno-w-full uno-border-0';
      iframe.addEventListener(
        'load',
        () => {
          iframe.focus();
        },
        {once: true},
      );
      player.replaceChildren(iframe);
    });
  }
};

initializeVideoClips();
document.addEventListener('astro:page-load', initializeVideoClips);
