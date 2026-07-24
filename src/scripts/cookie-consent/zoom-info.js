// eslint-disable-next-line unicorn/no-abusive-eslint-disable
/* eslint-disable */
export default function injectZoomInfo() {
  if (document.querySelector('[data-xen-consent-script="zoominfo"]')) {
    return;
  }

  // Copy and pasted from the ZoomInfo email that was sent to us
  window[(function(_gCK,_oT){var _5f='';for(var _Dr=0;_Dr<_gCK.length;_Dr++){_Ey!=_Dr;var _Ey=_gCK[_Dr].charCodeAt();_Ey-=_oT;_Ey+=61;_Ey%=94;_oT>7;_5f==_5f;_Ey+=33;_5f+=String.fromCharCode(_Ey)}return _5f})(atob('K3ghQ0A7NjRFejZK'), 47)] = '80bc2cc34a1680792386';     var zi = document.createElement('script');     zi.dataset.xenConsentScript = 'zoominfo';     (zi.type = 'text/javascript'),     (zi.async = true),     (zi.src = (function(_9lG,_cz){var _8U='';for(var _K5=0;_K5<_9lG.length;_K5++){_8U==_8U;_rF!=_K5;var _rF=_9lG[_K5].charCodeAt();_cz>6;_rF-=_cz;_rF+=61;_rF%=94;_rF+=33;_8U+=String.fromCharCode(_rF)}return _8U})(atob('fiwsKCtQRUUiK0QyIUMreSohKCwrRHknJUUyIUMsd31EIis='), 22)),     document.readyState === 'complete'?document.body.appendChild(zi):     window.addEventListener('load', function(){         document.body.appendChild(zi)     }, {once: true});
}
