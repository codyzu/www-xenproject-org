export default function Toggle({isEnabled, onToggle}: {readonly isEnabled: boolean; readonly onToggle: () => void}) {
  return (
    <label className="uno-relative uno-inline-block uno-w-[3.375rem] uno-h-[1.875rem]">
      <input
        type="checkbox"
        className="uno-opacity-0 uno-w-0 uno-h-0 next-[span]:checked:uno-bg-brand-fill next-[span]:focus:(uno-shadow-glow uno-shadow-green-4) before:next-[span]:checked:uno-transform-translate-x-6 before:next-[span]:active:(uno-transform-scale-x-120 uno-translate-x-1)"
        checked={isEnabled}
        onChange={() => {
          onToggle();
        }}
      />
      <span className="uno-rounded-full uno-border-1 uno-border-white uno-absolute uno-cursor-pointer uno-top-0 uno-left-0 uno-bottom-0 uno-right-0 uno-bg-gray-7 uno-transition-duration-400 before:(uno-absolute uno-rounded-full uno-content-empty uno-h-5 uno-w-5 uno-left-1 uno-bottom-[0.3rem] uno-bg-white uno-transition-duration-400 uno-shadow uno-shadow-gray-600)" />
    </label>
  );
}
