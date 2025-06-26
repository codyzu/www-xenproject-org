import clsx from 'clsx';

const logos = import.meta.glob('../../../../../../static/img/logos/*.(svg|png)', {
  query: '?url',
  import: 'default',
  eager: true,
  // Base: '../../../../../../static',
});

export default function LogoWheel() {
  console.log('logos', logos);

  const l = Object.entries(logos as Record<string, string>)
    .toSorted(([pathA], [pathB]) => pathA.localeCompare(pathB))
    .map(([_, logo], index) => {
      const url = logo;
      const angle = ((index * 360) / Object.keys(logos).length + 270) % 360; // Start at the top (270 degrees)
      return {
        url: url.replace(/^\/static/, ''),
        angle,
      };
    });

  console.log('l', l);

  return (
    <div className="uno-h-600px uno-w-400px uno-relative">
      {l.map((logo) => (
        <div
          key={logo.url}
          className={clsx(
            'uno-h-100px uno-w-100px',
            'uno-transform-rotate-10-bak',
            'uno-absolute',
            'uno-top-1/2',
            'uno-left-1/2',
            'uno-origin-center',
            'uno-object-contain',
            // 'uno-bg-gradient-radial uno-bg-gradient-stops-[rgb(81,126,185)_0%,rgba(255,255,255,0)_60%]',
            // 'hover:uno-transform-scale-200',
            '',
          )}
          style={{transform: `rotate(${logo.angle}deg) translate(200px) rotate(-${logo.angle}deg)`}}
        >
          <div className="uno-absolute uno-left-0 uno-top-0 uno-w-full uno-h-full uno-bg-blue/10 uno-rounded-full uno-border-solid uno-border-blue uno-border-4" />
          <img
            // Key={logo.url}
            className={clsx(
              // 'uno-h-80px uno-w-80px',
              // 'uno-transform-rotate-10-bak',
              // 'uno-absolute',
              // 'uno-top-1/2',
              // 'uno-left-1/2',
              // 'uno-origin-center',
              'uno-w-full uno-h-full',
              'uno-object-contain',

              'uno-absolute uno-top-0 uno-left-0 uno-p-2',

              'hover:(uno-transform-scale-120-bak uno-animate-jello) uno-duration-300',

              // 'uno-bg-gradient-radial uno-bg-gradient-stops-[rgb(81,126,185)_0%,rgba(255,255,255,0)_60%]',
              // 'hover:uno-transform-scale-200',
              '',
            )}
            src={logo.url}
          />
        </div>
      ))}
    </div>
  );
}
