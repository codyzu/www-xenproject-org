import clsx from 'clsx';
import Toggle from '../Toggle.tsx';

export default function TestLegend({
  isHwTestsVisible,
  isQemuTestsVisible,
  onToggleHwTests,
  onToggleQemuTests,
}: {
  readonly isHwTestsVisible: boolean;
  readonly isQemuTestsVisible: boolean;
  readonly onToggleHwTests: () => void;
  readonly onToggleQemuTests: () => void;
}) {
  return (
    <div className="uno-grid uno-grid-cols-1 sm:uno-grid-cols-2 uno-gap-x-8">
      <LegendControl
        label="Hardware Tests"
        description="Hardware tests are run on dedicated runners hosting real hardware."
        colors="uno-bg-gradient-from-teal-400 uno-bg-gradient-via-amber-40 uno-bg-gradient-to-red-400"
        isEnabled={isHwTestsVisible}
        onToggle={onToggleHwTests}
      />
      <LegendControl
        label="Qemu Tests"
        description="Qemu tests run on the next available runner in a cloud of potential test runners. Refer to the job logs to determine the exact runner."
        colors="uno-bg-gradient-from-sky-400 uno-bg-gradient-via-violet-400 uno-bg-gradient-to-fuchsia-400"
        isEnabled={isQemuTestsVisible}
        onToggle={onToggleQemuTests}
      />
    </div>
  );
}

function LegendControl({
  description,
  label,
  colors,
  isEnabled,
  onToggle,
  className,
}: {
  readonly description: string;
  readonly label: string;
  readonly colors: string;
  readonly isEnabled: boolean;
  readonly onToggle: () => void;
  readonly className?: string;
}) {
  return (
    <div className={clsx('uno-flex uno-flex-col uno-text-sm uno-gap-1', className)}>
      <div className="uno-flex uno-flex-row uno-justify-between uno-items-end">
        <div className="uno-text-base uno-font-semibold">{label}</div>
        <div className="uno-flex uno-flex-row uno-gap-2 uno-items-center">
          <div className="uno-font-mono">{isEnabled ? 'hide' : 'show'} </div>
          <Toggle isEnabled={isEnabled} onToggle={onToggle} />
        </div>
      </div>
      <div
        className={clsx(
          'uno-w-full uno-h-2 uno-bg-gradient-to-r  uno-rounded-full uno-shadow-lg uno-shadow-gray',
          colors,
        )}
      />
      <div className="uno-text-xs">{description}</div>
    </div>
  );
}
