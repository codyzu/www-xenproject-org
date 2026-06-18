import clsx from 'clsx';

const logoAssets = import.meta.glob('../../../static/img/logos/*.(svg|png)', {
  query: '?url',
  import: 'default',
  eager: true,
  // TODO: vite 7 will support base paths
  // This might remove the need to drop the `/static` prefix in the URLs
  // Base: '../../../static',
});

export default function LogoWheel() {
  const logos = Object.entries(logoAssets as Record<string, string>)
    .toSorted(([pathA], [pathB]) => pathA.localeCompare(pathB))
    .map(([buildPath, assetUrl], index) => {
      const url = assetUrl;
      const angle = ((index * 360) / Object.keys(logoAssets).length + 270) % 360; // Start at the top (270 degrees)
      return {
        alt:
          buildPath
            .split('/')
            .at(-1)
            ?.replace(/\.(svg|png)$/, '')
            .replaceAll('-', ' ') ?? 'Logo',
        // Remove the `/static` prefix from the URL since hugo serves the static files from the root
        url: url.replace(/^\/static/, ''),
        angle,
      };
    });

  return (
    <div className="uno-w-full uno-min-h-0 uno-max-h-full uno-max-w-full uno-aspect-ratio-square uno-relative">
      <div
        className={clsx(
          'uno-absolute uno-top-1/2 uno-left-1/2 uno-w-82% uno-h-82% uno-translate-x-[-50%] uno-translate-y-[-50%]',
          'uno-border-solid uno-border-10 uno-border-action',
          'uno-rounded-full',
          'uno-shadow-xl uno-shadow-gray-400',
        )}
      />
      <div className="i-fa6-solid-handshake uno-h-30% uno-w-30% uno-absolute uno-top-1/2 uno-left-1/2 uno-translate-x-[-50%] uno-translate-y-[-50%] uno-text-action" />
      <ul className="uno-list-none uno-h-full uno-w-full uno-m-0">
        {logos.map((logo) => (
          <li
            key={logo.url}
            className={clsx(
              'uno-h-20% uno-w-20%',
              'uno-absolute uno-top-1/2 uno-left-1/2',
              'uno-origin-center',
              'uno-object-contain',
              'uno-m-0',
            )}
            style={{
              // Unocss doesn't support multiple transforms in teh same property yet, so set the element style directly
              transform: `translate(-50%, -50%) rotate(${logo.angle}deg) translate(200%) rotate(-${logo.angle}deg)`,
            }}
          >
            <div className="uno-relative uno-h-full uno-w-full hover:uno-scale-140 uno-duration-200 uno-ease-out">
              <div className="uno-absolute uno-left-0 uno-top-0 uno-w-full uno-h-full uno-rounded-full uno-border-solid uno-border-action uno-border-4 uno-bg-surface-secondary uno-shadow-xl uno-shadow-gray-400" />
              <div
                className={clsx(
                  'uno-h-full uno-w-full',
                  'uno-flex uno-items-center uno-justify-center',
                  'uno-absolute uno-top-0 uno-left-0 uno-p-2',
                )}
              >
                <img className="uno-w-full uno-h-full uno-object-contain" src={logo.url} alt={logo.alt} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
    // </div>
  );
}
