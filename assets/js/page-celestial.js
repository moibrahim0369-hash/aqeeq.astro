(function(){var M={matrix:'matrix',chart:'chart',sky:'sky',lifepath:'lifepath','lifepath-compat':'lifepath'};
Object.keys(M).forEach(function(id){var s=document.getElementById(id);if(!s||s.querySelector(':scope>.aqa-art'))return;
var d=document.createElement('div');d.className='aqa-art'+(id==='lifepath-compat'?' aqa-mirror':'');d.setAttribute('aria-hidden','true');
d.style.setProperty('--aqa-img','url('+new URL('assets/art/celestial-'+M[id]+'.svg',document.baseURI).href+')');s.insertBefore(d,s.firstChild);});})();
