import {useEffect, useState} from 'preact/hooks';

type CookieBannerProps = {
  readonly onAccept: () => void;
};

export default function CookieBanner({onAccept}: CookieBannerProps) {
  const consentKey = 'cookieConsent';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(consentKey);
    if (consent === 'true') {
      onAccept();
    } else {
      setVisible(true);
    }
  }, [onAccept]);

  const handleAccept = () => {
    localStorage.setItem(consentKey, 'true');
    setVisible(false);
    onAccept();
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="uno-fixed uno-bottom-0 uno-left-0 uno-w-full uno-bg-black uno-bg-opacity-80 uno-text-white uno-p-8 uno-z-50 uno-flex uno-justify-between uno-items-center uno-text-lg uno-flex-wrap sm:uno-flex-nowrap uno-gap-4 uno-min-h-15%"
    >
      <div className="uno-flex uno-justify-start uno-items-start uno-gap-8 uno-flex-shrink-1">
        <span className="i-fa6-solid-cookie-bite uno-w-10 uno-h-10 sm:uno-w-16 sm:uno-h-16 uno-flex-shrink-0" />
        <span className="uno-mr-4 uno-flex-shrink-1">
          We use a single tracking cookie to help the Linux Foundation understand interest in Xen Project. This helps us
          follow up and improve your experience with our open source community.
        </span>
      </div>
      <button
        type="button"
        id="cookie-accept"
        className="uno-bg-blue-400 uno-text-black uno-border-none uno-px-4 uno-py-2 uno-cursor-pointer uno-rounded uno-text-lg uno-justify-self-end"
        aria-label="Accept cookies"
        onClick={handleAccept}
      >
        Accept
      </button>
    </div>
  );
}
