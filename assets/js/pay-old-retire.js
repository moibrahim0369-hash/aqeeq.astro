/* Retires the old public #pay page. The 2027 checkout and the karmic tail checkout (each has a draft in sessionStorage) are untouched. */
(function(){'use strict';
 function go(){if(location.hash==='#pay'){var d=null;try{d=sessionStorage.getItem('aq-year2027-checkout')||sessionStorage.getItem('aq-karmic-checkout');}catch(_){}if(!d)location.replace('#home');}}
 window.addEventListener('hashchange',go);go();
})();
