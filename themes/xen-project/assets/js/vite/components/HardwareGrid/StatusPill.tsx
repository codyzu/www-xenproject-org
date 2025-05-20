import {h} from 'preact';
import clsx from 'clsx';

const statusStyles = {
  // These are hardcoded status values from GitLab
  /* eslint-disable @typescript-eslint/naming-convention */
  SUCCESS: {
    icon: 'i-fa6-solid-circle-check',
    color: 'uno-text-green-500',
  },
  FAILED: {
    icon: 'i-fa6-solid-circle-xmark',
    color: 'uno-text-red-500',
  },
  CREATED: {
    icon: 'i-fa6-solid-clock',
    color: 'uno-text-yellow-500',
  },
  PENDING: {
    icon: 'i-fa6-solid-clock',
    color: 'uno-text-yellow-500',
  },
  RUNNING: {
    icon: 'i-fa6-solid-clock',
    color: 'uno-text-yellow-500',
  },
  DEFAULT: {
    icon: 'i-fa6-solid-circle-question',
    color: 'uno-text-gray-500',
  },
  /* eslint-enable @typescript-eslint/naming-convention */
};

export type Status = keyof typeof statusStyles;

export function StatusPill({status, label}: {readonly status: string; readonly label?: string}) {
  const style = statusStyles[status as Status] || statusStyles.DEFAULT;
  return (
    <div className="uno-flex uno-items-center uno-gap-2 uno-text-right uno-rounded-full uno-p-x-1 uno-p-r-2 uno-p-y-1 uno-bg-secondary uno-text-white">
      <div className={clsx(style.icon, style.color, 'uno-text-base')} title={status} />
      <div className="uno-text-xs">{label}</div>
    </div>
  );
}
