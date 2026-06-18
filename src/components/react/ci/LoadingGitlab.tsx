import clsx from 'clsx';
import {useEffect, useMemo, useState} from 'react';

export default function LoadingGitlab() {
  const messages = useMemo(
    () => [
      {icon: 'i-fa6-solid-plug-circle-bolt', text: 'Contacting GitLab servers...'},
      {icon: 'i-fa6-solid-satellite', text: 'Connecting to satellite feed...'},
      {icon: 'i-fa6-solid-gears', text: 'Crunching the numbers...'},
    ],
    [],
  );

  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage((previousIcon) => {
        const currentIndex = messages.indexOf(previousIcon);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [messages]);

  return (
    <div className="uno-flex uno-flex-col uno-items-center uno-animate-pulse uno-text-secondary uno-font-mono">
      <div className={clsx('uno-text-5xl uno-animate-bounce', message.icon)} />
      <div className="uno-text-xl uno-animate-pulse">{message.text}</div>
    </div>
  );
}
