/* Retires the old public #pay page. The 2027 checkout (which has a draft in sessionStorage) is untouched. */
(function(){'use strict';
 function go(){if(location.hash==='#pay'){var d=null;try{d=sessionStorage.getItem('aq-year2027-checkout');}catch(_){}if(!d)location.replace('#home');}}
 window.addEventListener('hashchange',go);go();
})();
