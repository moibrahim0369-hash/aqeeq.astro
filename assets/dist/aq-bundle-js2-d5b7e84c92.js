/* astronomy.min.js */
/*
 MIT


    Astronomy library for JavaScript (browser and Node.js).
    https://github.com/cosinekitty/astronomy

    MIT License

    Copyright (c) 2019-2025 Don Cross <cosinekitty@gmail.com>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/
var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.createTemplateTagFirstArg=function(r){return r.raw=r};$jscomp.createTemplateTagFirstArgWithRaw=function(r,u){r.raw=u;return r};$jscomp.arrayIteratorImpl=function(r){var u=0;return function(){return u<r.length?{done:!1,value:r[u++]}:{done:!0}}};$jscomp.arrayIterator=function(r){return{next:$jscomp.arrayIteratorImpl(r)}};$jscomp.makeIterator=function(r){var u="undefined"!=typeof Symbol&&Symbol.iterator&&r[Symbol.iterator];return u?u.call(r):$jscomp.arrayIterator(r)};
$jscomp.getGlobal=function(r){r=["object"==typeof globalThis&&globalThis,r,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var u=0;u<r.length;++u){var e=r[u];if(e&&e.Math==Math)return e}throw Error("Cannot find global object");};$jscomp.global=$jscomp.getGlobal(this);$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;$jscomp.ISOLATE_POLYFILLS=!1;$jscomp.FORCE_POLYFILL_PROMISE=!1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(r,u,e){if(r==Array.prototype||r==Object.prototype)return r;r[u]=e.value;return r};$jscomp.IS_SYMBOL_NATIVE="function"===typeof Symbol&&"symbol"===typeof Symbol("x");$jscomp.TRUST_ES6_POLYFILLS=!$jscomp.ISOLATE_POLYFILLS||$jscomp.IS_SYMBOL_NATIVE;$jscomp.polyfills={};$jscomp.propertyToPolyfillSymbol={};
$jscomp.POLYFILL_PREFIX="$jscp$";var $jscomp$lookupPolyfilledValue=function(r,u){var e=$jscomp.propertyToPolyfillSymbol[u];if(null==e)return r[u];e=r[e];return void 0!==e?e:r[u]};$jscomp.polyfill=function(r,u,e,C){u&&($jscomp.ISOLATE_POLYFILLS?$jscomp.polyfillIsolated(r,u,e,C):$jscomp.polyfillUnisolated(r,u,e,C))};
$jscomp.polyfillUnisolated=function(r,u,e,C){e=$jscomp.global;r=r.split(".");for(C=0;C<r.length-1;C++){var A=r[C];if(!(A in e))return;e=e[A]}r=r[r.length-1];C=e[r];u=u(C);u!=C&&null!=u&&$jscomp.defineProperty(e,r,{configurable:!0,writable:!0,value:u})};
$jscomp.polyfillIsolated=function(r,u,e,C){var A=r.split(".");r=1===A.length;C=A[0];C=!r&&C in $jscomp.polyfills?$jscomp.polyfills:$jscomp.global;for(var w=0;w<A.length-1;w++){var Q=A[w];if(!(Q in C))return;C=C[Q]}A=A[A.length-1];e=$jscomp.IS_SYMBOL_NATIVE&&"es6"===e?C[A]:null;u=u(e);null!=u&&(r?$jscomp.defineProperty($jscomp.polyfills,A,{configurable:!0,writable:!0,value:u}):u!==e&&(void 0===$jscomp.propertyToPolyfillSymbol[A]&&($jscomp.propertyToPolyfillSymbol[A]=$jscomp.IS_SYMBOL_NATIVE?$jscomp.global.Symbol(A):
$jscomp.POLYFILL_PREFIX+A),$jscomp.defineProperty(C,$jscomp.propertyToPolyfillSymbol[A],{configurable:!0,writable:!0,value:u})))};$jscomp.polyfill("Math.log10",function(r){return r?r:function(u){return Math.log(u)/Math.LN10}},"es6","es3");$jscomp.polyfill("Number.isFinite",function(r){return r?r:function(u){return"number"!==typeof u?!1:!isNaN(u)&&Infinity!==u&&-Infinity!==u}},"es6","es3");
$jscomp.polyfill("Math.hypot",function(r){return r?r:function(u){if(2>arguments.length)return arguments.length?Math.abs(arguments[0]):0;var e,C,A;for(e=A=0;e<arguments.length;e++)A=Math.max(A,Math.abs(arguments[e]));if(1E100<A||1E-100>A){if(!A)return A;for(e=C=0;e<arguments.length;e++){var w=Number(arguments[e])/A;C+=w*w}return Math.sqrt(C)*A}for(e=C=0;e<arguments.length;e++)w=Number(arguments[e]),C+=w*w;return Math.sqrt(C)}},"es6","es3");
$jscomp.polyfill("Number.MAX_SAFE_INTEGER",function(){return 9007199254740991},"es6","es3");$jscomp.polyfill("Number.isInteger",function(r){return r?r:function(u){return Number.isFinite(u)?u===Math.floor(u):!1}},"es6","es3");$jscomp.polyfill("Number.isSafeInteger",function(r){return r?r:function(u){return Number.isInteger(u)&&Math.abs(u)<=Number.MAX_SAFE_INTEGER}},"es6","es3");
$jscomp.polyfill("Math.cbrt",function(r){return r?r:function(u){if(0===u)return u;u=Number(u);var e=Math.pow(Math.abs(u),1/3);return 0>u?-e:e}},"es6","es3");
(function(r){"object"===typeof exports&&"undefined"!==typeof module?module.exports=r():"function"===typeof define&&define.amd?define([],r):("undefined"!==typeof window?window:"undefined"!==typeof global?global:"undefined"!==typeof self?self:this).Astronomy=r()})(function(){return function(){function r(u,e,C){function A(N,T){if(!e[N]){if(!u[N]){var ka="function"==typeof require&&require;if(!T&&ka)return ka(N,!0);if(w)return w(N,!0);T=Error("Cannot find module '"+N+"'");throw T.code="MODULE_NOT_FOUND",
T;}T=e[N]={exports:{}};u[N][0].call(T.exports,function(sa){return A(u[N][1][sa]||sa)},T,T.exports,r,u,e,C)}return e[N].exports}for(var w="function"==typeof require&&require,Q=0;Q<C.length;Q++)A(C[Q]);return A}return r}()({1:[function(r,u,e){function C(a){switch(a){case m.Sun:return 2.959122082855911E-4;case m.Mercury:return 4.912547451450812E-11;case m.Venus:return 7.243452486162703E-10;case m.Earth:return 8.887692390113509E-10;case m.Moon:return 1.093189565989891E-11;case m.EMB:return 8.997011346712498E-10;
case m.Mars:return 9.549535105779258E-11;case m.Jupiter:return 2.825345909524226E-7;case m.Saturn:return 8.459715185680659E-8;case m.Uranus:return 1.292024916781969E-8;case m.Neptune:return 1.524358900784276E-8;case m.Pluto:return 2.18869976542597E-12;default:throw"Do not know mass product for body: "+a;}}function A(a){if(!0!==a&&!1!==a)throw console.trace(),"Value is not boolean: "+a;return a}function w(a){if(!Number.isFinite(a))throw console.trace(),"Value is not a finite number: "+a;return a}function Q(a){return a-
Math.floor(a)}function N(a,b){var c=a.x*a.x+a.y*a.y+a.z*a.z;if(1E-8>Math.abs(c))throw"AngleBetween: first vector is too short.";var d=b.x*b.x+b.y*b.y+b.z*b.z;if(1E-8>Math.abs(d))throw"AngleBetween: second vector is too short.";a=(a.x*b.x+a.y*b.y+a.z*b.z)/Math.sqrt(c*d);return-1>=a?180:1<=a?0:e.RAD2DEG*Math.acos(a)}function T(a){a=ld.indexOf(a);return 0<=a?md[a]:null}function ka(a){return(a=T(a))&&0<a.dist?a:null}function sa(a){var b=2E3+(a-14)/365.24217;if(-500>b)return a=(b-1820)/100,-20+32*a*a;
if(500>b){a=b/100;b=a*a;var c=a*b;return 10583.6-1014.41*a+33.78311*b-5.952053*c-.1798452*b*b+.022174192*b*c+.0090316521*c*c}if(1600>b)return a=(b-1E3)/100,b=a*a,c=a*b,1574.2-556.01*a+71.23472*b+.319781*c-.8503463*b*b-.005050998*b*c+.0083572073*c*c;if(1700>b)return a=b-1600,b=a*a,120-.9808*a-.01532*b+a*b/7129;if(1800>b)return a=b-1700,b=a*a,8.83+.1603*a-.0059285*b+1.3336E-4*a*b-b*b/1174E3;if(1860>b){a=b-1800;b=a*a;c=a*b;var d=b*b;return 13.72-.332447*a+.0068612*b+.0041116*c-3.7436E-4*d+1.21272E-5*
b*c-1.699E-7*c*c+8.75E-10*c*d}if(1900>b)return a=b-1860,b=a*a,c=a*b,7.62+.5737*a-.251754*b+.01680668*c-4.473624E-4*b*b+b*c/233174;if(1920>b)return a=b-1900,b=a*a,-2.79+1.494119*a-.0598939*b+.0061966*a*b-1.97E-4*b*b;if(1941>b)return a=b-1920,b=a*a,21.2+.84493*a-.0761*b+.0020936*a*b;if(1961>b)return a=b-1950,b=a*a,29.07+.407*a-b/233+a*b/2547;if(1986>b)return a=b-1975,b=a*a,45.45+1.067*a-b/260-a*b/718;if(2005>b)return a=b-2E3,b=a*a,c=a*b,63.86+.3345*a-.060374*b+.0017275*c+6.51814E-4*b*b+2.373599E-5*
b*c;if(2050>b)return a=b-2E3,62.92+.32217*a+.005589*a*a;if(2150>b)return a=(b-1820)/100,-20+32*a*a-.5628*(2150-b);a=(b-1820)/100;return-20+32*a*a}function Vb(a){return a+Wb(a)/86400}function v(a){return a instanceof O?a:new O(a)}function Xb(a){a=a.tt/36525;return(((((-4.34E-8*a-5.76E-7)*a+.0020034)*a-1.831E-4)*a-46.836769)*a+84381.406)/3600}function da(a){if(!$a||1E-6<Math.abs($a.tt-a.tt)){var b=a.tt/36525;var c=(1287104.79305+1.295965810481E8*b)%1296E3*4.84813681109536E-6;var d=(335779.526232+1.7395272628478E9*
b)%1296E3*4.84813681109536E-6,f=(450160.398036-6962890.5431*b)%1296E3*4.84813681109536E-6,g=Math.sin(f),h=Math.cos(f),l=(-172064161-174666*b)*g+33386*h,k=(92052331+9086*b)*h+15377*g;h=2*(d-(1072260.70369+1.602961601209E9*b)%1296E3*4.84813681109536E-6+f);g=Math.sin(h);h=Math.cos(h);l+=(-13170906-1675*b)*g-13696*h;k+=(5730336-3015*b)*h-4587*g;h=2*(d+f);g=Math.sin(h);h=Math.cos(h);l+=(-2276413-234*b)*g+2796*h;k+=(978459-485*b)*h+1374*g;h=2*f;g=Math.sin(h);h=Math.cos(h);l+=(2074554+207*b)*g-698*h;k+=
(-897492+470*b)*h-291*g;g=Math.sin(c);h=Math.cos(c);c=-1.35E-4+1E-7*(l+((1475877-3633*b)*g+11817*h));b=3.88E-4+1E-7*(k+((73871-184*b)*h-1924*g));g=Xb(a);$a={tt:a.tt,dpsi:c,deps:b,ee:c*Math.cos(g*e.DEG2RAD)/15,mobl:g,tobl:g+b/3600}}return $a}function Yb(a,b){var c=a*e.DEG2RAD;a=Math.cos(c);c=Math.sin(c);return[b[0],b[1]*a-b[2]*c,b[1]*c+b[2]*a]}function ea(a){function b(D,G,P,fa){for(var L=[],ta=0;ta<=G-D;++ta){var ua=L,ub=ua.push,vb,Zb=P,nd=fa,$b=[];for(vb=0;vb<=nd-Zb;++vb)$b.push(0);ub.call(ua,{min:Zb,
array:$b})}return{min:D,array:L}}function c(D,G,P){D=D.array[G-D.min];return D.array[P-D.min]}function d(D,G,P){D=y.array[D-y.min];D.array[G-D.min]=P}function f(D,G,P){D=x.array[D-x.min];D.array[G-D.min]=P}function g(D,G,P,fa,L){L(D*P-G*fa,G*P+D*fa)}function h(D){return Math.sin(U*D)}function l(D,G,P,fa){var L={x:1,y:0};D=[0,D,G,P,fa];for(G=1;4>=G;++G)0!==D[G]&&g(L.x,L.y,c(y,D[G],G),c(x,D[G],G),function(ta,ua){return L.x=ta,L.y=ua});return L}function k(D,G,P,fa,L,ta,ua,ub){L=l(L,ta,ua,ub);q+=D*L.y;
t+=G*L.y;ab+=P*L.x;va+=fa*L.x}++e.CalcMoonCount;a=a.tt/36525;var n,p,q,t,y=b(-6,6,1,4),x=b(-6,6,1,4);var z=a*a;var ab=t=q=0;var va=3422.7;var la=h(.19833+.05611*a);var ha=h(.27869+.04508*a);var V=h(.16827-.36903*a);var ba=h(.34734-5.37261*a);var La=h(.10498-5.37899*a);var bb=h(.42681-.41855*a),od=h(.14943-5.37511*a);var cb=.84*la+.31*ha+14.27*V+7.26*ba+.28*La+.24*bb;var wb=2.94*la+.31*ha+14.27*V+9.34*ba+1.12*La+.83*bb;var db=-6.4*la-1.89*bb;ha=.21*la+.31*ha+14.27*V-88.7*ba-15.3*La+.24*bb-1.86*od;
V=cb-db;la=-3.332E-6*h(.59734-5.37261*a)-5.39E-7*h(.35498-5.37899*a)-6.4E-8*h(.39943-5.37511*a);cb=U*Q(.60643382+1336.85522467*a-3.13E-6*z)+cb/ia;wb=U*Q(.37489701+1325.55240982*a+2.565E-5*z)+wb/ia;db=U*Q(.99312619+99.99735956*a-4.4E-7*z)+db/ia;ha=U*Q(.25909118+1342.2278298*a-8.92E-6*z)+ha/ia;La=U*Q(.82736186+1236.85308708*a-3.97E-6*z)+V/ia;for(n=1;4>=n;++n){switch(n){case 1:V=wb;z=4;ba=1.000002208;break;case 2:V=db;z=3;ba=.997504612-.002495388*a;break;case 3:V=ha;z=4;ba=1.000002708+139.978*la;break;
case 4:V=La;z=6;ba=1;break;default:throw"Internal error: I = "+n;}d(0,n,1);d(1,n,Math.cos(V)*ba);f(0,n,0);f(1,n,Math.sin(V)*ba);for(p=2;p<=z;++p)g(c(y,p-1,n),c(x,p-1,n),c(y,1,n),c(x,1,n),function(D,G){return d(p,n,D),f(p,n,G)});for(p=1;p<=z;++p)d(-p,n,c(y,p,n)),f(-p,n,-c(x,p,n))}k(13.902,14.06,-.001,.2607,0,0,0,4);k(.403,-4.01,.394,.0023,0,0,0,3);k(2369.912,2373.36,.601,28.2333,0,0,0,2);k(-125.154,-112.79,-.725,-.9781,0,0,0,1);k(1.979,6.98,-.445,.0433,1,0,0,4);k(191.953,192.72,.029,3.0861,1,0,0,2);
k(-8.466,-13.51,.455,-.1093,1,0,0,1);k(22639.5,22609.07,.079,186.5398,1,0,0,0);k(18.609,3.59,-.094,.0118,1,0,0,-1);k(-4586.465,-4578.13,-.077,34.3117,1,0,0,-2);k(3.215,5.44,.192,-.0386,1,0,0,-3);k(-38.428,-38.64,.001,.6008,1,0,0,-4);k(-.393,-1.43,-.092,.0086,1,0,0,-6);k(-.289,-1.59,.123,-.0053,0,1,0,4);k(-24.42,-25.1,.04,-.3,0,1,0,2);k(18.023,17.93,.007,.1494,0,1,0,1);k(-668.146,-126.98,-1.302,-.3997,0,1,0,0);k(.56,.32,-.001,-.0037,0,1,0,-1);k(-165.145,-165.06,.054,1.9178,0,1,0,-2);k(-1.877,-6.46,
-.416,.0339,0,1,0,-4);k(.213,1.02,-.074,.0054,2,0,0,4);k(14.387,14.78,-.017,.2833,2,0,0,2);k(-.586,-1.2,.054,-.01,2,0,0,1);k(769.016,767.96,.107,10.1657,2,0,0,0);k(1.75,2.01,-.018,.0155,2,0,0,-1);k(-211.656,-152.53,5.679,-.3039,2,0,0,-2);k(1.225,.91,-.03,-.0088,2,0,0,-3);k(-30.773,-34.07,-.308,.3722,2,0,0,-4);k(-.57,-1.4,-.074,.0109,2,0,0,-6);k(-2.921,-11.75,.787,-.0484,1,1,0,2);k(1.267,1.52,-.022,.0164,1,1,0,1);k(-109.673,-115.18,.461,-.949,1,1,0,0);k(-205.962,-182.36,2.056,1.4437,1,1,0,-2);k(.233,
.36,.012,-.0025,1,1,0,-3);k(-4.391,-9.66,-.471,.0673,1,1,0,-4);k(.283,1.53,-.111,.006,1,-1,0,4);k(14.577,31.7,-1.54,.2302,1,-1,0,2);k(147.687,138.76,.679,1.1528,1,-1,0,0);k(-1.089,.55,.021,0,1,-1,0,-1);k(28.475,23.59,-.443,-.2257,1,-1,0,-2);k(-.276,-.38,-.006,-.0036,1,-1,0,-3);k(.636,2.27,.146,-.0102,1,-1,0,-4);k(-.189,-1.68,.131,-.0028,0,2,0,2);k(-7.486,-.66,-.037,-.0086,0,2,0,0);k(-8.096,-16.35,-.74,.0918,0,2,0,-2);k(-5.741,-.04,0,-9E-4,0,0,2,2);k(.255,0,0,0,0,0,2,1);k(-411.608,-.2,0,-.0124,0,0,
2,0);k(.584,.84,0,.0071,0,0,2,-1);k(-55.173,-52.14,0,-.1052,0,0,2,-2);k(.254,.25,0,-.0017,0,0,2,-3);k(.025,-1.67,0,.0031,0,0,2,-4);k(1.06,2.96,-.166,.0243,3,0,0,2);k(36.124,50.64,-1.3,.6215,3,0,0,0);k(-13.193,-16.4,.258,-.1187,3,0,0,-2);k(-1.187,-.74,.042,.0074,3,0,0,-4);k(-.293,-.31,-.002,.0046,3,0,0,-6);k(-.29,-1.45,.116,-.0051,2,1,0,2);k(-7.649,-10.56,.259,-.1038,2,1,0,0);k(-8.627,-7.59,.078,-.0192,2,1,0,-2);k(-2.74,-2.54,.022,.0324,2,1,0,-4);k(1.181,3.32,-.212,.0213,2,-1,0,2);k(9.703,11.67,-.151,
.1268,2,-1,0,0);k(-.352,-.37,.001,-.0028,2,-1,0,-1);k(-2.494,-1.17,-.003,-.0017,2,-1,0,-2);k(.36,.2,-.012,-.0043,2,-1,0,-4);k(-1.167,-1.25,.008,-.0106,1,2,0,0);k(-7.412,-6.12,.117,.0484,1,2,0,-2);k(-.311,-.65,-.032,.0044,1,2,0,-4);k(.757,1.82,-.105,.0112,1,-2,0,2);k(2.58,2.32,.027,.0196,1,-2,0,0);k(2.533,2.4,-.014,-.0212,1,-2,0,-2);k(-.344,-.57,-.025,.0036,0,3,0,-2);k(-.992,-.02,0,0,1,0,2,2);k(-45.099,-.02,0,-.001,1,0,2,0);k(-.179,-9.52,0,-.0833,1,0,2,-2);k(-.301,-.33,0,.0014,1,0,2,-4);k(-6.382,-3.37,
0,-.0481,1,0,-2,2);k(39.528,85.13,0,-.7136,1,0,-2,0);k(9.366,.71,0,-.0112,1,0,-2,-2);k(.202,.02,0,0,1,0,-2,-4);k(.415,.1,0,.0013,0,1,2,0);k(-2.152,-2.26,0,-.0066,0,1,2,-2);k(-1.44,-1.3,0,.0014,0,1,-2,2);k(.384,-.04,0,0,0,1,-2,-2);k(1.938,3.6,-.145,.0401,4,0,0,0);k(-.952,-1.58,.052,-.013,4,0,0,-2);k(-.551,-.94,.032,-.0097,3,1,0,0);k(-.482,-.57,.005,-.0045,3,1,0,-2);k(.681,.96,-.026,.0115,3,-1,0,0);k(-.297,-.27,.002,-9E-4,2,2,0,-2);k(.254,.21,-.003,0,2,-2,0,-2);k(-.25,-.22,.004,.0014,1,3,0,-2);k(-3.996,
0,0,4E-4,2,0,2,0);k(.557,-.75,0,-.009,2,0,2,-2);k(-.459,-.38,0,-.0053,2,0,-2,2);k(-1.298,.74,0,4E-4,2,0,-2,0);k(.538,1.14,0,-.0141,2,0,-2,-2);k(.263,.02,0,0,1,1,2,0);k(.426,.07,0,-6E-4,1,1,-2,-2);k(-.304,.03,0,3E-4,1,-1,2,0);k(-.372,-.19,0,-.0027,1,-1,-2,2);k(.418,0,0,0,0,0,4,0);k(-.33,-.04,0,0,3,0,2,0);z=-526.069*l(0,0,1,-2).y;z+=-3.352*l(0,0,1,-4).y;z+=44.297*l(1,0,1,-2).y;z+=-6*l(1,0,1,-4).y;z+=20.599*l(-1,0,1,0).y;z+=-30.598*l(-1,0,1,-2).y;z+=-24.649*l(-2,0,1,0).y;z+=-2*l(-2,0,1,-2).y;z+=-22.571*
l(0,1,1,-2).y;z+=10.985*l(0,-1,1,-2).y;q+=.82*h(.7736-62.5512*a)+.31*h(.0466-125.1025*a)+.35*h(.5785-25.1042*a)+.66*h(.4591+1335.8075*a)+.64*h(.313-91.568*a)+1.14*h(.148+1331.2898*a)+.21*h(.5918+1056.5859*a)+.44*h(.5784+1322.8595*a)+.24*h(.2275-5.7374*a)+.28*h(.2965+2.6929*a)+.33*h(.3132+6.3368*a);a=ha+t/ia;a=(1.000002708+139.978*la)*(18518.511+1.189+ab)*Math.sin(a)-6.24*Math.sin(3*a)+z;return{geo_eclip_lon:U*Q((cb+q/ia)/U),geo_eclip_lat:Math.PI/648E3*a,distance_au:ia*pd/(.999953253*va)}}function ac(a,
b){return[a.rot[0][0]*b[0]+a.rot[1][0]*b[1]+a.rot[2][0]*b[2],a.rot[0][1]*b[0]+a.rot[1][1]*b[1]+a.rot[2][1]*b[2],a.rot[0][2]*b[0]+a.rot[1][2]*b[1]+a.rot[2][2]*b[2]]}function wa(a,b,c){b=Ma(b,c);return ac(b,a)}function Ma(a,b){a=a.tt/36525;var c=84381.406,d=((((3.337E-7*a-4.67E-7)*a-.00772503)*a+.0512623)*a-.025754)*a+c;c*=4.84813681109536E-6;var f=((((-9.51E-8*a+1.32851E-4)*a-.00114045)*a-1.0790069)*a+5038.481507)*a*4.84813681109536E-6;d*=4.84813681109536E-6;var g=((((-5.6E-8*a+1.70663E-4)*a-.00121197)*
a-2.3814292)*a+10.556403)*a*4.84813681109536E-6;a=Math.sin(c);c=Math.cos(c);var h=Math.sin(-f);f=Math.cos(-f);var l=Math.sin(-d);d=Math.cos(-d);var k=Math.sin(g),n=Math.cos(g);g=n*f-h*k*d;var p=n*h*c+k*d*f*c-a*k*l,q=n*h*a+k*d*f*a+c*k*l,t=-k*f-h*n*d,y=-k*h*c+n*d*f*c-a*n*l;k=-k*h*a+n*d*f*a+c*n*l;h*=l;n=-l*f*c-a*d;a=-l*f*a+d*c;if(b===F.Into2000)return new J([[g,p,q],[t,y,k],[h,n,a]]);if(b===F.From2000)return new J([[g,t,h],[p,y,n],[q,k,a]]);throw"Invalid precess direction";}function ca(a){if(!eb||eb.tt!==
a.tt){var b=a.tt/36525,c=15*da(a).ee,d=(.779057273264+.00273781191135448*a.ut+a.ut%1)%1*360;0>d&&(d+=360);b=((c+.014506+((((-3.68E-8*b-2.9956E-5)*b-4.4E-7)*b+1.3915817)*b+4612.156534)*b)/3600+d)%360/15;0>b&&(b+=24);eb={tt:a.tt,st:b}}return eb.st}function bc(a){a=v(a);return ca(a)}function xb(a,b){var c=a.latitude*e.DEG2RAD,d=Math.sin(c);c=Math.cos(c);var f=1/Math.hypot(c,.996647180302104*d),g=a.height/1E3,h=6378.1366*f+g;b=(15*b+a.longitude)*e.DEG2RAD;a=Math.sin(b);b=Math.cos(b);return{pos:[h*c*b/
e.KM_PER_AU,h*c*a/e.KM_PER_AU,(6335.438815127603*f+g)*d/e.KM_PER_AU],vel:[-7.292115E-5*h*c*a*86400/e.KM_PER_AU,7.292115E-5*h*c*b*86400/e.KM_PER_AU,0]}}function xa(a,b,c){b=Na(b,c);return ac(b,a)}function Na(a,b){a=da(a);var c=a.mobl*e.DEG2RAD,d=a.tobl*e.DEG2RAD,f=4.84813681109536E-6*a.dpsi;a=Math.cos(c);c=Math.sin(c);var g=Math.cos(d),h=Math.sin(d);d=Math.cos(f);var l=Math.sin(f);f=-l*a;var k=-l*c,n=l*g,p=d*a*g+c*h,q=d*c*g-a*h;l*=h;var t=d*a*h-c*g;a=d*c*h+a*g;if(b===F.From2000)return new J([[d,n,
l],[f,p,t],[k,q,a]]);if(b===F.Into2000)return new J([[d,f,k],[n,p,q],[l,t,a]]);throw"Invalid precess direction";}function fb(a,b,c){return c===F.Into2000?wa(xa(a,b,c),b,c):xa(wa(a,b,c),b,c)}function cc(a,b){var c=ca(a);b=xb(b,c).pos;return fb(b,a,F.Into2000)}function qd(a){if(!(a instanceof Array)||3!==a.length)return!1;for(var b=0;3>b;++b){if(!(a[b]instanceof Array)||3!==a[b].length)return!1;for(var c=0;3>c;++c)if(!Number.isFinite(a[b][c]))return!1}return!0}function yb(a,b){return new E(a[0],a[1],
a[2],b)}function dc(a,b){b=yb(a,b);var c=b.x*b.x+b.y*b.y,d=Math.sqrt(c+b.z*b.z);if(0===c){if(0===b.z)throw"Indeterminate sky coordinates";return new gb(0,0>b.z?-90:90,d,b)}var f=e.RAD2HOUR*Math.atan2(b.y,b.x);0>f&&(f+=24);return new gb(f,e.RAD2DEG*Math.atan2(a[2],Math.sqrt(c)),d,b)}function ya(a,b){var c=a*e.DEG2RAD;a=Math.cos(c);c=Math.sin(c);return[a*b[0]+c*b[1],a*b[1]-c*b[0],b[2]]}function hb(a,b,c,d,f){a=v(a);za(b);w(c);w(d);var g=Math.sin(b.latitude*e.DEG2RAD),h=Math.cos(b.latitude*e.DEG2RAD),
l=Math.sin(b.longitude*e.DEG2RAD),k=Math.cos(b.longitude*e.DEG2RAD);b=Math.sin(d*e.DEG2RAD);var n=Math.cos(d*e.DEG2RAD),p=Math.sin(c*e.HOUR2RAD),q=Math.cos(c*e.HOUR2RAD),t=[h*k,h*l,g];g=[-g*k,-g*l,h];l=[l,-k,0];h=-15*ca(a);a=ya(h,t);t=ya(h,g);l=ya(h,l);b=[n*q,n*p,b];p=b[0]*a[0]+b[1]*a[1]+b[2]*a[2];n=b[0]*t[0]+b[1]*t[1]+b[2]*t[2];t=b[0]*l[0]+b[1]*l[1]+b[2]*l[2];q=Math.hypot(n,t);0<q?(n=-e.RAD2DEG*Math.atan2(t,n),0>n&&(n+=360)):n=0;p=e.RAD2DEG*Math.atan2(q,p);q=d;if(f&&(d=p,f=Oa(f,90-p),p-=f,0<f&&3E-4<
p)){c=Math.sin(p*e.DEG2RAD);q=Math.cos(p*e.DEG2RAD);t=Math.sin(d*e.DEG2RAD);d=Math.cos(d*e.DEG2RAD);f=[];for(l=0;3>l;++l)f.push((b[l]-d*a[l])/t*c+a[l]*q);q=Math.hypot(f[0],f[1]);0<q?(c=e.RAD2HOUR*Math.atan2(f[1],f[0]),0>c&&(c+=24)):c=0;q=e.RAD2DEG*Math.atan2(f[2],q)}return new ec(n,90-p,c,q)}function za(a){if(!(a instanceof zb))throw"Not an instance of the Observer class: "+a;w(a.latitude);w(a.longitude);w(a.height);if(-90>a.latitude||90<a.latitude)throw"Latitude "+a.latitude+" is out of range. Must be -90..+90.";
return a}function fc(a){a=v(a).AddDays(-1/e.C_AUDAY);var b=Aa(M.Earth,a),c=$jscomp.makeIterator(fb([-b.x,-b.y,-b.z],a,F.From2000));b=c.next().value;var d=c.next().value,f=c.next().value,g=e.DEG2RAD*da(a).tobl;c=Math.cos(g);g=Math.sin(g);a=new E(b,d,f,a);return Ab(a,c,g)}function Pa(a,b,c,d,f){za(c);A(d);A(f);b=v(b);c=cc(b,c);a=W(a,b,f);a=[a.x-c[0],a.y-c[1],a.z-c[2]];if(!d)return dc(a,b);d=fb(a,b,F.From2000);return dc(d,b)}function Ab(a,b,c){var d=a.x,f=a.y*b+a.z*c;c=-a.y*c+a.z*b;var g=Math.hypot(d,
f);b=0;0<g&&(b=e.RAD2DEG*Math.atan2(f,d),0>b&&(b+=360));g=e.RAD2DEG*Math.atan2(c,g);a=new E(d,f,c,a.t);return new gc(a,g,b)}function Qa(a){var b=da(a.t),c=wa([a.x,a.y,a.z],a.t,F.From2000),d=$jscomp.makeIterator(xa(c,a.t,F.From2000));c=d.next().value;var f=d.next().value;d=d.next().value;a=new E(c,f,d,a.t);b=b.tobl*e.DEG2RAD;return Ab(a,Math.cos(b),Math.sin(b))}function Y(a){a=v(a);var b=ea(a),c=b.distance_au*Math.cos(b.geo_eclip_lat);b=[c*Math.cos(b.geo_eclip_lon),c*Math.sin(b.geo_eclip_lon),b.distance_au*
Math.sin(b.geo_eclip_lat)];b=Yb(Xb(a),b);b=wa(b,a,F.Into2000);return new E(b[0],b[1],b[2],a)}function ib(a){var b=v(a);a=ea(b);var c=a.distance_au*Math.cos(a.geo_eclip_lat),d=[c*Math.cos(a.geo_eclip_lon),c*Math.sin(a.geo_eclip_lon),a.distance_au*Math.sin(a.geo_eclip_lat)];c=da(b);d=Yb(c.mobl,d);d=xa(d,b,F.From2000);b=yb(d,b);c=c.tobl*e.DEG2RAD;b=Ab(b,Math.cos(c),Math.sin(c));return new Ba(b.elat,b.elon,a.distance_au)}function Ra(a){a=v(a);var b=a.AddDays(-1E-5),c=a.AddDays(1E-5);b=Y(b);c=Y(c);return new I((b.x+
c.x)/2,(b.y+c.y)/2,(b.z+c.z)/2,(c.x-b.x)/2E-5,(c.y-b.y)/2E-5,(c.z-b.z)/2E-5,a)}function Bb(a){a=v(a);var b=Ra(a);return new I(b.x/82.30056,b.y/82.30056,b.z/82.30056,b.vx/82.30056,b.vy/82.30056,b.vz/82.30056,a)}function ma(a,b,c){var d=1,f=0;a=$jscomp.makeIterator(a);for(var g=a.next();!g.done;g=a.next()){var h=0;g=$jscomp.makeIterator(g.value);for(var l=g.next();!l.done;l=g.next()){var k=$jscomp.makeIterator(l.value);l=k.next().value;var n=k.next().value;k=k.next().value;h+=l*Math.cos(n+b*k)}h*=d;
c&&(h%=U);f+=h;d*=b}return f}function Cb(a,b){var c=1,d=0,f=0,g=0;a=$jscomp.makeIterator(a);for(var h=a.next();!h.done;h=a.next()){var l=0,k=0;h=$jscomp.makeIterator(h.value);for(var n=h.next();!n.done;n=h.next()){var p=$jscomp.makeIterator(n.value);n=p.next().value;var q=p.next().value;p=p.next().value;q+=b*p;l+=n*p*Math.sin(q);0<g&&(k+=n*Math.cos(q))}f+=g*d*k-c*l;d=c;c*=b;++g}return f}function Db(a){return new B(a[0]+4.4036E-7*a[1]-1.90919E-7*a[2],-4.79966E-7*a[0]+.917482137087*a[1]-.397776982902*
a[2],.397776982902*a[1]+.917482137087*a[2])}function hc(a,b,c){var d=c*Math.cos(b);return[d*Math.cos(a),d*Math.sin(a),c*Math.sin(b)]}function Aa(a,b){var c=b.tt/365250,d=ma(a[0],c,!0),f=ma(a[1],c,!1);a=ma(a[2],c,!1);d=hc(d,f,a);return Db(d).ToAstroVector(b)}function Sa(a,b){var c=b/365250,d=ma(a[0],c,!0),f=ma(a[1],c,!1),g=ma(a[2],c,!1),h=Cb(a[0],c),l=Cb(a[1],c);c=Cb(a[2],c);var k=Math.cos(d),n=Math.sin(d),p=Math.cos(f),q=Math.sin(f);a=+(c*p*k)-g*q*k*l-g*p*n*h;h=+(c*p*n)-g*q*n*l+g*p*k*h;l=+(c*q)+g*
p*l;d=hc(d,f,g);f=[a/365250,h/365250,l/365250];d=Db(d);f=Db(f);return new X(b,d,f)}function jb(a,b,c,d){d/=d+2.959122082855911E-4;b=Aa(M[c],b);a.x+=d*b.x;a.y+=d*b.y;a.z+=d*b.z}function R(a,b,c,d){d/=d+2.959122082855911E-4;b=Sa(M[c],b);a.r.incr(b.r.mul(d));a.v.incr(b.v.mul(d));return b}function Ta(a,b,c){a=c.sub(a);c=a.quadrature();return a.mul(b/(c*Math.sqrt(c)))}function Ca(a,b,c,d){return new B(b.x+a*(c.x+a*d.x/2),b.y+a*(c.y+a*d.y/2),b.z+a*(c.z+a*d.z/2))}function Eb(a,b,c){return new B(b.x+a*c.x,
b.y+a*c.y,b.z+a*c.z)}function Fb(a,b){var c=a-b.tt,d=new Da(a),f=Ca(c,b.r,b.v,b.a),g=d.Acceleration(f).mean(b.a);f=Ca(c,b.r,b.v,g);b=b.v.add(g.mul(c));c=d.Acceleration(f);a=new Ua(a,f,b,c);return new ic(d,a)}function jc(a,b){a=Math.floor(a);return 0>a?0:a>=b?b-1:a}function Gb(a){var b=$jscomp.makeIterator(a);a=b.next().value;var c=$jscomp.makeIterator(b.next().value);var d=c.next().value;var f=c.next().value;c=c.next().value;var g=$jscomp.makeIterator(b.next().value);b=g.next().value;var h=g.next().value;
g=g.next().value;d=new X(a,new B(d,f,c),new B(b,h,g));a=new Da(d.tt);f=d.r.add(a.Sun.r);c=d.v.add(a.Sun.v);b=a.Acceleration(f);d=new Ua(d.tt,f,c,b);return new ic(a,d)}function kc(a,b,c){a=Gb(a);for(var d=Math.ceil((b-a.grav.tt)/c),f=0;f<d;++f)a=Fb(f+1===d?b:a.grav.tt+c,a.grav);return a}function Hb(a,b){var c=a.tt;var d=na[0][0];if(c<d||c>na[50][0])c=null;else{c=jc((c-d)/29200,50);if(!Ib[c]){d=Ib[c]=[];d[0]=Gb(na[c]).grav;d[200]=Gb(na[c+1]).grav;var f,g=d[0].tt;for(f=1;200>f;++f)d[f]=Fb(g+=146,d[f-
1]).grav;g=d[200].tt;var h=[];h[200]=d[200];for(f=199;0<f;--f)h[f]=Fb(g-=146,h[f+1]).grav;for(f=199;0<f;--f)g=f/200,d[f].r=d[f].r.mul(1-g).add(h[f].r.mul(g)),d[f].v=d[f].v.mul(1-g).add(h[f].v.mul(g)),d[f].a=d[f].a.mul(1-g).add(h[f].a.mul(g))}c=Ib[c]}if(d=c){f=jc((a.tt-d[0].tt)/146,200);c=d[f];g=d[f+1];var l=c.a.mean(g.a);f=Ca(a.tt-c.tt,c.r,c.v,l);d=Eb(a.tt-c.tt,c.v,l);h=Ca(a.tt-g.tt,g.r,g.v,l);g=Eb(a.tt-g.tt,g.v,l);l=(a.tt-c.tt)/146;c=f.mul(1-l).add(h.mul(l));d=d.mul(1-l).add(g.mul(l))}else{var k=
a.tt<na[0][0]?kc(na[0],a.tt,-146):kc(na[50],a.tt,146);c=k.grav.r;d=k.grav.v;k=k.bary}b&&(k||(k=new Da(a.tt)),c=c.sub(k.Sun.r),d=d.sub(k.Sun.v));return new I(c.x,c.y,c.z,d.x,d.y,d.z,a)}function kb(a,b){for(var c=a.tt+18262.5,d=[0,b.al[0]+c*b.al[1],0,0,0,0],f=$jscomp.makeIterator(b.a),g=f.next();!g.done;g=f.next()){var h=$jscomp.makeIterator(g.value);g=h.next().value;var l=h.next().value;h=h.next().value;d[0]+=g*Math.cos(l+c*h)}f=$jscomp.makeIterator(b.l);for(g=f.next();!g.done;g=f.next())h=$jscomp.makeIterator(g.value),
g=h.next().value,l=h.next().value,h=h.next().value,d[1]+=g*Math.sin(l+c*h);d[1]%=U;0>d[1]&&(d[1]+=U);f=$jscomp.makeIterator(b.z);for(g=f.next();!g.done;g=f.next())h=$jscomp.makeIterator(g.value),g=h.next().value,l=h.next().value,h=h.next().value,l+=c*h,d[2]+=g*Math.cos(l),d[3]+=g*Math.sin(l);f=$jscomp.makeIterator(b.zeta);for(g=f.next();!g.done;g=f.next())h=$jscomp.makeIterator(g.value),g=h.next().value,l=h.next().value,h=h.next().value,l+=c*h,d[4]+=g*Math.cos(l),d[5]+=g*Math.sin(l);f=d[0];h=d[1];
g=d[2];l=d[3];c=d[4];d=d[5];var k=Math.sqrt(b.mu/(f*f*f));b=h+g*Math.sin(h)-l*Math.cos(h);do{var n=Math.cos(b);var p=Math.sin(b);n=(h-b+g*p-l*n)/(1-g*n-l*p);b+=n}while(1E-12<=Math.abs(n));n=Math.cos(b);p=Math.sin(b);h=l*n-g*p;var q=-g*n-l*p,t=1/(1+q),y=1/(1+Math.sqrt(1-g*g-l*l));b=f*(n-g-y*l*h);h=f*(p-l+y*g*h);l=k*t*f*(-p-y*l*q);f=k*t*f*(+n+y*g*q);g=2*Math.sqrt(1-c*c-d*d);k=1-2*d*d;n=1-2*c*c;p=2*d*c;a=new I(b*k+h*p,b*p+h*n,(c*h-b*d)*g,l*k+f*p,l*p+f*n,(c*f-l*d)*g,a);return Ea(rd,a)}function Z(a,b){b=
v(b);if(a in M)return Aa(M[a],b);if(a===m.Pluto)return a=Hb(b,!0),new E(a.x,a.y,a.z,b);if(a===m.Sun)return new E(0,0,0,b);if(a===m.Moon){a=Aa(M.Earth,b);var c=Y(b);return new E(a.x+c.x,a.y+c.y,a.z+c.z,b)}if(a===m.EMB)return a=Aa(M.Earth,b),c=Y(b),new E(a.x+c.x/82.30056,a.y+c.y/82.30056,a.z+c.z/82.30056,b);if(a===m.SSB)return a=new E(0,0,0,b),jb(a,b,m.Jupiter,2.825345909524226E-7),jb(a,b,m.Saturn,8.459715185680659E-8),jb(a,b,m.Uranus,1.292024916781969E-8),jb(a,b,m.Neptune,1.524358900784276E-8),a;if(c=
ka(a))return a=new Ba(c.dec,15*c.ra,c.dist),lb(a,b);throw'HelioVector: Unknown body "'+a+'"';}function oa(a,b){var c=ka(a);if(c)return c.dist;b=v(b);return a in M?ma(M[a][2],b.tt/365250,!1):Z(a,b).Length()}function lc(a,b){for(var c=b,d=0,f=0;10>f;++f){var g=a(c);d=g.Length()/e.C_AUDAY;if(1<d)throw"Object is too distant for light-travel solver.";var h=b.AddDays(-d);d=Math.abs(h.tt-c.tt);if(1E-9>d)return g;c=h}throw"Light-travel time solver did not converge: dt = "+d;}function mc(a,b,c,d){A(d);a=v(a);
if(ka(c)){c=Z(c,a);if(d)return b=mb(b,a),d=new E(c.x-b.x,c.y-b.y,c.z-b.z,a),c=e.C_AUDAY/d.Length(),new E(d.x+b.vx/c,d.y+b.vy/c,d.z+b.vz/c,a);b=Z(b,a);return new E(c.x-b.x,c.y-b.y,c.z-b.z,a)}var f=d?new E(0,0,0,a):Z(b,a);var g=new nc(b,c,d,f);return lc(function(h){return g.Position(h)},a)}function W(a,b,c){A(c);b=v(b);switch(a){case m.Earth:return new E(0,0,0,b);case m.Moon:return Y(b);default:return a=mc(b,m.Earth,a,c),a.t=b,a}}function pa(a,b){return new I(a.r.x,a.r.y,a.r.z,a.v.x,a.v.y,a.v.z,b)}
function mb(a,b){b=v(b);switch(a){case m.Sun:return new I(0,0,0,0,0,0,b);case m.SSB:return a=new Da(b.tt),new I(-a.Sun.r.x,-a.Sun.r.y,-a.Sun.r.z,-a.Sun.v.x,-a.Sun.v.y,-a.Sun.v.z,b);case m.Mercury:case m.Venus:case m.Earth:case m.Mars:case m.Jupiter:case m.Saturn:case m.Uranus:case m.Neptune:return a=Sa(M[a],b.tt),pa(a,b);case m.Pluto:return Hb(b,!0);case m.Moon:case m.EMB:var c=Sa(M.Earth,b.tt);a=a==m.Moon?Ra(b):Bb(b);return new I(a.x+c.r.x,a.y+c.r.y,a.z+c.r.z,a.vx+c.v.x,a.vy+c.v.y,a.vz+c.v.z,b);
default:if(ka(a))return a=Z(a,b),new I(a.x,a.y,a.z,0,0,0,b);throw'HelioState: Unsupported body "'+a+'"';}}function sd(a,b,c,d,f){var g=(f+c)/2-d;c=(f-c)/2;if(0==g){if(0==c)return null;d=-d/c;if(-1>d||1<d)return null}else{d=c*c-4*g*d;if(0>=d)return null;f=Math.sqrt(d);d=(-c+f)/(2*g);f=(-c-f)/(2*g);if(-1<=d&&1>=d){if(-1<=f&&1>=f)return null}else if(-1<=f&&1>=f)d=f;else return null}return{t:a+d*b,df_dt:(2*g*d+c)/b}}function K(a,b,c,d){var f=w(d&&d.dt_tolerance_seconds||1);f=Math.abs(f/86400);var g=d&&
d.init_f1||a(b),h=d&&d.init_f2||a(c),l=NaN,k=0;d=d&&d.iter_limit||20;for(var n=!0;;){if(++k>d)throw"Excessive iteration in Search()";var p=new O(b.ut+.5*(c.ut-b.ut)),q=p.ut-b.ut;if(Math.abs(q)<f)return p;n?l=a(p):n=!0;var t=sd(p.ut,c.ut-p.ut,g,l,h);if(t){var y=v(t.t),x=a(y);if(0!==t.df_dt){if(Math.abs(x/t.df_dt)<f)return y;t=1.2*Math.abs(x/t.df_dt);if(t<q/10&&(q=y.AddDays(-t),y=y.AddDays(+t),0>(q.ut-b.ut)*(q.ut-c.ut)&&0>(y.ut-b.ut)*(y.ut-c.ut))){t=a(q);var z=a(y);if(0>t&&0<=z){g=t;h=z;b=q;c=y;l=x;
n=!1;continue}}}}if(0>g&&0<=l)c=p,h=l;else if(0>l&&0<=h)b=p,g=l;else return null}}function Fa(a){for(;-180>=a;)a+=360;for(;180<a;)a-=360;return a}function Ga(a){for(;0>a;)a+=360;for(;360<=a;)a-=360;return a}function oc(a,b,c){w(a);w(c);b=v(b);c=b.AddDays(c);return K(function(d){d=fc(d);return Fa(d.elon-a)},b,c,{dt_tolerance_seconds:.01})}function Jb(a,b,c){if(a===m.Earth||b===m.Earth)throw"The Earth does not have a longitude as seen from itself.";c=v(c);a=W(a,c,!1);a=Qa(a);b=W(b,c,!1);b=Qa(b);return Ga(a.elon-
b.elon)}function Ha(a,b){if(a==m.Earth)throw"The Earth does not have an angle as seen from itself.";var c=v(b);b=W(m.Sun,c,!0);a=W(a,c,!0);return N(b,a)}function qa(a,b){if(a===m.Sun)throw"Cannot calculate heliocentric longitude of the Sun.";a=Z(a,b);return Qa(a).elon}function nb(a,b){if(a===m.Earth)throw"The illumination of the Earth is not defined.";var c=v(b),d=Aa(M.Earth,c);if(a===m.Sun){var f=new E(-d.x,-d.y,-d.z,c);b=new E(0,0,0,c);d=0}else a===m.Moon?(f=Y(c),b=new E(d.x+f.x,d.y+f.y,d.z+f.z,
c)):(b=Z(a,b),f=new E(b.x-d.x,b.y-d.y,b.z-d.z,c)),d=N(f,b);var g=f.Length(),h=b.Length();if(a===m.Sun)var l=td+5*Math.log10(g);else if(a===m.Moon)a=d*e.DEG2RAD,l=a*a,a=-12.717+1.49*Math.abs(a)+.0431*l*l,l=a+=5*Math.log10(g/(385000.6/e.KM_PER_AU)*h);else if(a===m.Saturn){var k=d;a=Qa(f);l=28.06*e.DEG2RAD;var n=e.DEG2RAD*a.elat;a=Math.asin(Math.sin(n)*Math.cos(l)-Math.cos(n)*Math.sin(l)*Math.sin(e.DEG2RAD*a.elon-e.DEG2RAD*(169.51+3.82E-5*c.tt)));l=Math.sin(Math.abs(a));k=-9+.044*k+l*(-2.6+1.2*l)+5*
Math.log10(h*g);a*=e.RAD2DEG;l=k;k=a}else{var p=n=l=0;switch(a){case m.Mercury:a=-.6;l=4.98;n=-4.88;p=3.02;break;case m.Venus:163.6>d?(a=-4.47,l=1.03,n=.57,p=.13):(a=.98,l=-1.02);break;case m.Mars:a=-1.52;l=1.6;break;case m.Jupiter:a=-9.4;l=.5;break;case m.Uranus:a=-7.19;l=.25;break;case m.Neptune:a=-6.87;break;case m.Pluto:a=-1;l=4;break;default:throw"VisualMagnitude: unsupported body "+a;}var q=d/100;l=a+q*(l+q*(n+q*p))+5*Math.log10(h*g)}return new pc(c,l,d,h,g,f,b,k)}function Va(a){if(a===m.Earth)throw"The Earth does not have a synodic period as seen from itself.";
if(a===m.Moon)return 29.530588;var b=aa[a];if(!b)throw"Not a valid planet name: "+a;a=aa.Earth.OrbitalPeriod;return Math.abs(a/(a/b.OrbitalPeriod-1))}function Ia(a,b,c){function d(n){var p=qa(a,n);n=qa(m.Earth,n);return Fa(g*(n-p)-b)}w(b);var f=aa[a];if(!f)throw"Cannot search relative longitude because body is not a planet: "+a;if(a===m.Earth)throw"Cannot search relative longitude for the Earth (it is always 0)";var g=f.OrbitalPeriod>aa.Earth.OrbitalPeriod?1:-1;f=Va(a);c=v(c);var h=d(c);0<h&&(h-=
360);for(var l=0;100>l;++l){var k=-h/360*f;c=c.AddDays(k);if(1>86400*Math.abs(k))return c;k=h;h=d(c);30>Math.abs(k)&&k!==h&&(k/=k-h,.5<k&&2>k&&(f*=k))}throw"Relative longitude search failed to converge for "+a+" near "+c.toString()+" (error_angle = "+h+").";}function Kb(a){return Jb(m.Moon,m.Sun,a)}function Wa(a,b,c){function d(l){l=Kb(l);return Fa(l-a)}w(a);w(c);b=v(b);var f=d(b);if(0>c){0>f&&(f+=360);var g=-(29.530588*f)/360;f=g+1.5;if(f<c)return null;var h=Math.max(c,g-1.5)}else{0<f&&(f-=360);
g=-(29.530588*f)/360;h=g-1.5;if(h>c)return null;f=Math.min(c,g+1.5)}c=b.AddDays(h);b=b.AddDays(f);return K(d,c,b,{dt_tolerance_seconds:.1})}function qc(a){var b=Kb(a);b=(Math.floor(b/90)+1)%4;a=Wa(90*b,a,10);if(!a)throw"Cannot find moon quarter";return new rc(b,a)}function sc(a){if(!Number.isFinite(a)||-500>a||1E5<a)throw"Invalid elevation: "+a;if(11E3>=a){var b=288.15-.0065*a;a=101325*Math.pow(288.15/b,-5.25577)}else 2E4>=a?(b=216.65,a=22632*Math.exp(-1.5768832E-4*(a-11E3))):(b=216.65+.001*(a-2E4),
a=5474.87*Math.pow(216.65/b,34.16319));return new tc(a,b,a/b/(101325/288.15))}function Lb(a,b,c,d,f,g,h){if(0>g&&0<=h)return new ud(d,f,g,h);if(0<=g&&0>h)return null;if(17<a)throw"Excessive recursion in rise/set ascent search.";var l=f.ut-d.ut;if(1>86400*l||Math.min(Math.abs(g),Math.abs(h))>l/2*c)return null;l=new O((d.ut+f.ut)/2);var k=b(l);return Lb(1+a,b,c,d,l,g,k)||Lb(1+a,b,c,l,f,k,h)}function vd(a,b){if(-90>b||90<b)throw"Invalid geographic latitude: "+b;switch(a){case m.Moon:a=4.5;var c=8.2;
break;case m.Sun:a=.8;c=.5;break;case m.Mercury:a=-1.6;c=1;break;case m.Venus:a=-.8;c=.6;break;case m.Mars:a=-.5;c=.4;break;case m.Jupiter:case m.Saturn:case m.Uranus:case m.Neptune:case m.Pluto:a=-.2;c=.2;break;case m.Star1:case m.Star2:case m.Star3:case m.Star4:case m.Star5:case m.Star6:case m.Star7:case m.Star8:a=-.008;c=.008;break;default:throw"Body not allowed for altitude search: "+a;}b*=e.DEG2RAD;return Math.abs((360.98564540070413-a)*Math.cos(b))+Math.abs(c*Math.sin(b))}function uc(a,b,c,
d,f,g,h){function l(x){var z=Pa(a,x,b,!0,!0);x=hb(x,b,z.ra,z.dec).altitude+e.RAD2DEG*Math.asin(g/z.dist);return c*(x-h)}za(b);w(f);w(g);w(h);if(-90>h||90<h)throw"Invalid target altitude angle: "+h;for(var k=vd(a,b.latitude),n=d=v(d),p=d,q=l(n),t=q;;){0>f?(n=p.AddDays(-.42),q=l(n)):(p=n.AddDays(.42),t=l(p));var y=Lb(0,l,k,n,p,q,t);if(y){if(k=K(l,y.tx,y.ty,{dt_tolerance_seconds:.1,init_f1:y.ax,init_f2:y.ay})){if(0>f){if(k.ut<d.ut+f)return null}else if(k.ut>d.ut+f)return null;return k}throw"Rise/set search failed after finding ascent: t1="+
n+", t2="+p+", a1="+q+", a2="+t;}if(0>f){if(n.ut<d.ut+f)return null;p=n;t=q}else{if(p.ut>d.ut+f)return null;n=p;q=t}}}function vc(a,b){b=v(b);var c=Jb(a,m.Sun,b);if(180<c){var d="morning";c=360-c}else d="evening";a=Ha(a,b);return new wc(b,d,a,c)}function xc(a){function b(l){var k=l.AddDays(-5E-4);l=l.AddDays(5E-4);k=ea(k).distance_au;return(ea(l).distance_au-k)/.001}function c(l){return-b(l)}a=v(a);for(var d=b(a),f=0;59.061176>5*f;++f){var g=a.AddDays(5),h=b(g);if(0>=d*h){if(0>d||0<h){a=K(b,a,g,{init_f1:d,
init_f2:h});if(!a)throw"SearchLunarApsis INTERNAL ERROR: perigee search failed!";d=ea(a).distance_au;return new Xa(a,0,d)}if(0<d||0>h){a=K(c,a,g,{init_f1:-d,init_f2:-h});if(!a)throw"SearchLunarApsis INTERNAL ERROR: apogee search failed!";d=ea(a).distance_au;return new Xa(a,1,d)}throw"SearchLunarApsis INTERNAL ERROR: cannot classify apsis event!";}a=g;d=h}throw"SearchLunarApsis INTERNAL ERROR: could not find apsis within 2 synodic months of start date.";}function yc(a,b,c,d){for(var f=b===Ja.Apocenter?
1:-1;;){d/=9;if(d<1/1440)return c=c.AddDays(d/2),a=oa(a,c),new Xa(c,b,a);for(var g=-1,h=0,l=0;10>l;++l){var k=c.AddDays(l*d);k=f*oa(a,k);if(0==l||k>h)g=l,h=k}c=c.AddDays((g-1)*d);d*=2}}function wd(a,b){var c=b.AddDays(-30/360*aa[a].OrbitalPeriod),d=b.AddDays(.75*aa[a].OrbitalPeriod),f=c,g=c,h=-1,l=-1;d=(d.ut-c.ut)/99;for(var k=0;100>k;++k){var n=c.AddDays(k*d),p=oa(a,n);0===k?l=h=p:(p>l&&(l=p,g=n),p<h&&(h=p,f=n))}c=yc(a,0,f.AddDays(-2*d),4*d);a=yc(a,1,g.AddDays(-2*d),4*d);if(c.time.tt>=b.tt)return a.time.tt>=
b.tt&&a.time.tt<c.time.tt?a:c;if(a.time.tt>=b.tt)return a;throw"Internal error: failed to find Neptune apsis.";}function zc(a,b){function c(p){var q=p.AddDays(-5E-4);p=p.AddDays(5E-4);q=oa(a,q);return(oa(a,p)-q)/.001}function d(p){return-c(p)}b=v(b);if(a===m.Neptune||a===m.Pluto)return wd(a,b);for(var f=aa[a].OrbitalPeriod,g=f/6,h=c(b),l=0;l*g<2*f;++l){var k=b.AddDays(g),n=c(k);if(0>=h*n){f=g=void 0;if(0>h||0<n)g=c,f=Ja.Pericenter;else if(0<h||0>n)g=d,f=Ja.Apocenter;else throw"Internal error with slopes in SearchPlanetApsis";
b=K(g,b,k);if(!b)throw"Failed to find slope transition in planetary apsis search.";h=oa(a,b);return new Xa(b,f,h)}b=k;h=n}throw"Internal error: should have found planetary apsis within 2 orbital periods.";}function Ka(a){return new J([[a.rot[0][0],a.rot[1][0],a.rot[2][0]],[a.rot[0][1],a.rot[1][1],a.rot[2][1]],[a.rot[0][2],a.rot[1][2],a.rot[2][2]]])}function ja(a,b){return new J([[b.rot[0][0]*a.rot[0][0]+b.rot[1][0]*a.rot[0][1]+b.rot[2][0]*a.rot[0][2],b.rot[0][1]*a.rot[0][0]+b.rot[1][1]*a.rot[0][1]+
b.rot[2][1]*a.rot[0][2],b.rot[0][2]*a.rot[0][0]+b.rot[1][2]*a.rot[0][1]+b.rot[2][2]*a.rot[0][2]],[b.rot[0][0]*a.rot[1][0]+b.rot[1][0]*a.rot[1][1]+b.rot[2][0]*a.rot[1][2],b.rot[0][1]*a.rot[1][0]+b.rot[1][1]*a.rot[1][1]+b.rot[2][1]*a.rot[1][2],b.rot[0][2]*a.rot[1][0]+b.rot[1][2]*a.rot[1][1]+b.rot[2][2]*a.rot[1][2]],[b.rot[0][0]*a.rot[2][0]+b.rot[1][0]*a.rot[2][1]+b.rot[2][0]*a.rot[2][2],b.rot[0][1]*a.rot[2][0]+b.rot[1][1]*a.rot[2][1]+b.rot[2][1]*a.rot[2][2],b.rot[0][2]*a.rot[2][0]+b.rot[1][2]*a.rot[2][1]+
b.rot[2][2]*a.rot[2][2]]])}function lb(a,b){b=v(b);var c=a.lat*e.DEG2RAD,d=a.lon*e.DEG2RAD,f=a.dist*Math.cos(c);return new E(f*Math.cos(d),f*Math.sin(d),a.dist*Math.sin(c),b)}function Mb(a){var b=Nb(a);return new gb(b.lon/15,b.lat,b.dist,a)}function Nb(a){var b=a.x*a.x+a.y*a.y,c=Math.sqrt(b+a.z*a.z);if(0===b){if(0===a.z)throw"Zero-length vector not allowed.";var d=0;a=0>a.z?-90:90}else d=e.RAD2DEG*Math.atan2(a.y,a.x),0>d&&(d+=360),a=e.RAD2DEG*Math.atan2(a.z,Math.sqrt(b));return new Ba(a,d,c)}function Ac(a){a=
360-a;360<=a?a-=360:0>a&&(a+=360);return a}function Oa(a,b){w(b);if(-90>b||90<b)return 0;if("normal"===a||"jplhor"===a){var c=b;-1>c&&(c=-1);c=1.02/Math.tan((c+10.3/(c+5.11))*e.DEG2RAD)/60;"normal"===a&&-1>b&&(c*=(b+90)/89)}else{if(a)throw"Invalid refraction option: "+a;c=0}return c}function Bc(a,b){if(-90>b||90<b)return 0;for(var c=b-Oa(a,b);;){var d=c+Oa(a,c)-b;if(1E-14>Math.abs(d))return c-b;c-=d}}function Ya(a,b){return new E(a.rot[0][0]*b.x+a.rot[1][0]*b.y+a.rot[2][0]*b.z,a.rot[0][1]*b.x+a.rot[1][1]*
b.y+a.rot[2][1]*b.z,a.rot[0][2]*b.x+a.rot[1][2]*b.y+a.rot[2][2]*b.z,b.t)}function Ea(a,b){return new I(a.rot[0][0]*b.x+a.rot[1][0]*b.y+a.rot[2][0]*b.z,a.rot[0][1]*b.x+a.rot[1][1]*b.y+a.rot[2][1]*b.z,a.rot[0][2]*b.x+a.rot[1][2]*b.y+a.rot[2][2]*b.z,a.rot[0][0]*b.vx+a.rot[1][0]*b.vy+a.rot[2][0]*b.vz,a.rot[0][1]*b.vx+a.rot[1][1]*b.vy+a.rot[2][1]*b.vz,a.rot[0][2]*b.vx+a.rot[1][2]*b.vy+a.rot[2][2]*b.vz,b.t)}function Cc(){return new J([[1,0,0],[0,.9174821430670688,-.3977769691083922],[0,.3977769691083922,
.9174821430670688]])}function ob(a){a=v(a);var b=Ma(a,F.From2000);a=Na(a,F.From2000);return ja(b,a)}function pb(a){a=v(a);var b=Na(a,F.Into2000);a=Ma(a,F.Into2000);return ja(b,a)}function Ob(a,b){a=v(a);var c=Math.sin(b.latitude*e.DEG2RAD),d=Math.cos(b.latitude*e.DEG2RAD),f=Math.sin(b.longitude*e.DEG2RAD),g=Math.cos(b.longitude*e.DEG2RAD);b=[d*g,d*f,c];c=[-c*g,-c*f,d];f=[f,-g,0];a=-15*ca(a);b=ya(a,b);c=ya(a,c);a=ya(a,f);return new J([[c[0],a[0],b[0]],[c[1],a[1],b[1]],[c[2],a[2],b[2]]])}function Dc(a,
b){a=Ob(a,b);return Ka(a)}function Ec(a,b){a=v(a);b=Dc(a,b);a=pb(a);return ja(b,a)}function Fc(a){a=pb(a);var b=Cc();return ja(a,b)}function Gc(a){a=Fc(a);return Ka(a)}function Hc(a,b){a=v(a);var c=Gc(a);a=Ob(a,b);return ja(c,a)}function Ic(a){var b=da(v(a)).tobl*e.DEG2RAD;a=Math.cos(b);b=Math.sin(b);return new J([[1,0,0],[0,+a,+b],[0,-b,+a]])}function Jc(a){var b=da(v(a)).tobl*e.DEG2RAD;a=Math.cos(b);b=Math.sin(b);return new J([[1,0,0],[0,+a,-b],[0,+b,+a]])}function Za(a,b,c,d){var f=(d.x*c.x+d.y*
c.y+d.z*c.z)/(d.x*d.x+d.y*d.y+d.z*d.z);return new xd(b,f,e.KM_PER_AU*Math.hypot(f*d.x-c.x,f*d.y-c.y,f*d.z-c.z),695700-(1+f)*(695700-a),-695700+(1+f)*(695700+a),c,d)}function qb(a){var b=W(m.Sun,a,!0);b=new E(-b.x,-b.y,-b.z,b.t);var c=Y(a);return Za(6459,a,c,b)}function Kc(a){var b=W(m.Sun,a,!0),c=Y(a),d=new E(-c.x,-c.y,-c.z,c.t);c.x-=b.x;c.y-=b.y;c.z-=b.z;return Za(1737.4,a,d,c)}function Pb(a,b){var c=cc(a,b);b=W(m.Sun,a,!0);var d=Y(a);c=new E(c[0]-d.x,c[1]-d.y,c[2]-d.z,a);d.x-=b.x;d.y-=b.y;d.z-=
b.z;return Za(1737.4,a,c,d)}function rb(a,b,c){a=W(a,c,!0);var d=W(m.Sun,c,!0),f=new E(a.x-d.x,a.y-d.y,a.z-d.z,c);d.x=-a.x;d.y=-a.y;d.z=-a.z;return Za(b,c,d,f)}function Qb(a,b){var c=1/86400,d=b.AddDays(-c);b=b.AddDays(+c);d=a(d);return(a(b).r-d.r)/c}function yd(a){var b=a.AddDays(-.03);a=a.AddDays(.03);b=K(function(c){return Qb(qb,c)},b,a);if(!b)throw"Failed to find peak Earth shadow time.";return qb(b)}function zd(a){var b=a.AddDays(-.03);a=a.AddDays(.03);b=K(function(c){return Qb(Kc,c)},b,a);if(!b)throw"Failed to find peak Moon shadow time.";
return Kc(b)}function Ad(a,b,c){var d=c.AddDays(-1);c=c.AddDays(1);d=K(function(f){var g=1/86400,h=rb(a,b,f.AddDays(-g));return(rb(a,b,f.AddDays(+g)).r-h.r)/g},d,c);if(!d)throw"Failed to find peak planet shadow time.";return rb(a,b,d)}function Bd(a,b){function c(g){return Pb(g,b)}var d=a.AddDays(-.2),f=a.AddDays(.2);d=K(function(g){return Qb(c,g)},d,f);if(!d)throw"PeakLocalMoonShadow: search failure for search_center_time = "+a;return Pb(d,b)}function Rb(a,b,c){var d=c/1440;c=a.AddDays(-d);d=a.AddDays(+d);
c=K(function(f){return-(qb(f).r-b)},c,a);a=K(function(f){return+(qb(f).r-b)},a,d);if(!c||!a)throw"Failed to find shadow semiduration";return 720*(a.ut-c.ut)}function Sb(a){a=ea(a);return e.RAD2DEG*a.geo_eclip_lat}function Lc(a,b,c){if(0>=a)throw"Radius of first disc must be positive.";if(0>=b)throw"Radius of second disc must be positive.";if(0>c)throw"Distance between discs is not allowed to be negative.";if(c>=a+b)return 0;if(0==c)return a<=b?1:b*b/(a*a);var d=(a*a-b*b+c*c)/(2*c),f=a*a-d*d;if(0>=
f)return a<=b?1:b*b/(a*a);f=Math.sqrt(f);return(a*a*Math.acos(d/a)-d*f+(b*b*Math.acos((c-d)/b)-(c-d)*f))/(Math.PI*a*a)}function Mc(a,b){var c=new E(a.x+b.x,a.y+b.y,a.z+b.z,a.t);a=Math.asin(Nc/c.Length());var d=Math.asin(Cd/b.Length());b=N(b,c);b=Lc(a,d,b*e.DEG2RAD);return Math.min(.9999,b)}function Oc(a){a=v(a);for(var b=0;12>b;++b){var c=Wa(180,a,40);if(!c)throw"Cannot find full moon.";a=Sb(c);if(1.8>Math.abs(a)&&(a=yd(c),a.r<a.p+1737.4)){b=S.Penumbral;var d=c=0,f=0,g=Rb(a.time,a.p+1737.4,200);a.r<
a.k+1737.4&&(b=S.Partial,f=Rb(a.time,a.k+1737.4,g),a.r+1737.4<a.k?(b=S.Total,c=1,d=Rb(a.time,a.k-1737.4,f)):c=Lc(1737.4,a.k,a.r));return new Pc(b,c,a.time,g,f,d)}a=c.AddDays(10)}throw"Failed to find lunar eclipse within 12 full moons.";}function Qc(a){a=v(a);var b;for(b=0;12>b;++b){var c=Wa(0,a,40);if(!c)throw"Cannot find new moon";a=Sb(c);if(1.8>Math.abs(a)&&(a=zd(c),a.r<a.p+6371)){var d=void 0,f=void 0,g=S.Partial;b=a.time;c=a.r;var h=ob(a.time),l=Ya(h,a.dir),k=Ya(h,a.target);l.x*=e.KM_PER_AU;l.y*=
e.KM_PER_AU;l.z*=e.KM_PER_AU/.996647180302104;k.x*=e.KM_PER_AU;k.y*=e.KM_PER_AU;k.z*=e.KM_PER_AU/.996647180302104;var n=l.x*l.x+l.y*l.y+l.z*l.z,p=-2*(l.x*k.x+l.y*k.y+l.z*k.z),q=p*p-4*n*(k.x*k.x+k.y*k.y+k.z*k.z-4.068062648825956E7);if(0<q){f=(-p-Math.sqrt(q))/(2*n);g=f*l.x-k.x;n=f*l.y-k.y;l=.996647180302104*(f*l.z-k.z);f=.9933056020041345*Math.hypot(g,n);f=0==f?0<l?90:-90:e.RAD2DEG*Math.atan(l/f);d=ca(b);d=(e.RAD2DEG*Math.atan2(n,g)-15*d)%360;-180>=d?d+=360:180<d&&(d-=360);h=Ka(h);l=new E(g/e.KM_PER_AU,
n/e.KM_PER_AU,l/e.KM_PER_AU,a.time);l=Ya(h,l);l.x+=a.target.x;l.y+=a.target.y;l.z+=a.target.z;h=Za(1736,a.time,l,a.dir);if(1E-9<h.r||0>h.r)throw"Unexpected shadow distance from geoid intersection = "+h.r;g=.014<h.k?S.Total:S.Annular;a=g===S.Total?1:Mc(a.dir,l)}else a=void 0;return new Rc(g,a,b,c,f,d)}a=c.AddDays(10)}throw"Failed to find solar eclipse within 12 full moons.";}function Sc(a){return a.p-a.r}function Tc(a){return Math.abs(a.k)-a.r}function sb(a,b,c,d,f){d=K(function(g){g=Pb(g,a);return b*
c(g)},d,f);if(!d)throw"Local eclipse transition search failed.";return Uc(a,d)}function Uc(a,b){var c=Pa(m.Sun,b,a,!0,!0);a=hb(b,a,c.ra,c.dec,"normal").altitude;return new Vc(b,a)}function Wc(a,b){a=v(a);for(za(b);;){a=Wa(0,a,40);if(!a)throw"Cannot find next new moon";var c=Sb(a);if(1.8>Math.abs(c)){var d=Bd(a,b);if(d.r<d.p){var f=c=void 0;var g=b;var h=Uc(g,d.time),l=d.time.AddDays(-.2),k=d.time.AddDays(.2),n=sb(g,1,Sc,l,d.time),p=sb(g,-1,Sc,d.time,k);d.r<Math.abs(d.k)?(l=d.time.AddDays(-.01),k=
d.time.AddDays(.01),f=sb(g,1,Tc,l,d.time),c=sb(g,-1,Tc,d.time,k),g=.014<d.k?S.Total:S.Annular):g=S.Partial;d=g===S.Total?1:Mc(d.dir,d.target);c=new Xc(g,d,n,f,h,c,p);if(0<c.partial_begin.altitude||0<c.partial_end.altitude)return c}}a=a.AddDays(10)}}function Yc(a,b,c,d,f){c=K(function(g){g=rb(a,b,g);return f*(g.r-g.p)},c,d);if(!c)throw"Planet transit boundary search failed";return c}function Zc(a,b){b=v(b);switch(a){case m.Mercury:var c=2439.7;break;case m.Venus:c=6051.8;break;default:throw"Invalid body: "+
a;}for(;;){var d=Ia(a,0,b);if(.4>Ha(a,d)&&(b=Ad(a,c,d),b.r<b.p)){d=b.time.AddDays(-1);d=Yc(a,c,d,b.time,-1);var f=b.time.AddDays(1);c=Yc(a,c,b.time,f,1);a=60*Ha(a,b.time);return new $c(d,b.time,c,a)}b=d.AddDays(10)}}function ad(a){var b=v(a),c=ib(b);for(a={};;a={$jscomp$loop$prop$kind$33:a.$jscomp$loop$prop$kind$33}){var d=b.AddDays(10),f=ib(d);if(0>=c.lat*f.lat){a.$jscomp$loop$prop$kind$33=f.lat>c.lat?ra.Ascending:ra.Descending;b=K(function(g){return function(h){return g.$jscomp$loop$prop$kind$33*
ib(h).lat}}(a),b,d);if(!b)throw"Could not find moon node.";return new bd(a.$jscomp$loop$prop$kind$33,b)}b=d;c=f}}function cd(a,b,c,d,f){if(1>a||5<a)throw"Invalid lagrange point "+a;if(!Number.isFinite(c)||0>=c)throw"Major mass must be a positive number.";if(!Number.isFinite(f)||0>=f)throw"Minor mass must be a negative number.";var g=d.x-b.x,h=d.y-b.y,l=d.z-b.z,k=g*g+h*h+l*l,n=Math.sqrt(k),p=d.vx-b.vx,q=d.vy-b.vy;d=d.vz-b.vz;if(4===a||5===a){k=h*d-l*q;c=l*p-g*d;var t=g*q-h*p,y=c*l-t*h;t=t*g-k*l;k=
k*h-c*g;c=Math.sqrt(y*y+t*t+k*k);y/=c;t/=c;k/=c;g/=n;h/=n;l/=n;a=4==a?.8660254037844386:-.8660254037844386;c=.5*g+a*y;f=.5*h+a*t;var x=.5*l+a*k,z=p*g+q*h+d*l;p=p*y+q*t+d*k;b=new I(n*c,n*f,n*x,z*c+p*(.5*y-a*g),z*f+p*(.5*t-a*h),z*x+p*(.5*k-a*l),b.t)}else{y=f/(c+f)*-n;t=c/(c+f)*+n;k=(c+f)/(k*n);if(1===a||2===a)x=c/(c+f)*Math.cbrt(f/(3*c)),c=-c,1==a?(x=1-x,a=+f):(x=1+x,a=-f);else if(3===a)x=(7/12*f-c)/(f+c),c=+c,a=+f;else throw"Invalid Langrage point "+a+". Must be an integer 1..5.";f=n*x-y;do x=f-y,
z=f-t,x=(k*f+c/(x*x)+a/(z*z))/(k-2*c/(x*x*x)-2*a/(z*z*z)),f-=x;while(1E-14<Math.abs(x/n));x=(f-y)/n;b=new I(x*g,x*h,x*l,x*p,x*q,x*d,b.t)}return b}Object.defineProperty(e,"__esModule",{value:!0});e.GeoEmbState=e.GeoMoonState=e.EclipticGeoMoon=e.GeoMoon=e.Ecliptic=e.ObserverGravity=e.VectorObserver=e.ObserverState=e.ObserverVector=e.Equator=e.SunPosition=e.Observer=e.Horizon=e.EclipticCoordinates=e.HorizontalCoordinates=e.MakeRotation=e.RotationMatrix=e.EquatorialCoordinates=e.Spherical=e.StateVector=
e.Vector=e.SiderealTime=e.Libration=e.LibrationInfo=e.CalcMoonCount=e.e_tilt=e.MakeTime=e.AstroTime=e.SetDeltaTFunction=e.DeltaT_JplHorizons=e.DeltaT_EspenakMeeus=e.PlanetOrbitalPeriod=e.DefineStar=e.Body=e.AngleBetween=e.MassProduct=e.CALLISTO_RADIUS_KM=e.GANYMEDE_RADIUS_KM=e.EUROPA_RADIUS_KM=e.IO_RADIUS_KM=e.JUPITER_MEAN_RADIUS_KM=e.JUPITER_POLAR_RADIUS_KM=e.JUPITER_EQUATORIAL_RADIUS_KM=e.RAD2HOUR=e.RAD2DEG=e.HOUR2RAD=e.DEG2RAD=e.AU_PER_LY=e.KM_PER_AU=e.C_AUDAY=void 0;e.VectorFromHorizon=e.HorizonFromVector=
e.SphereFromVector=e.EquatorFromVector=e.VectorFromSphere=e.Pivot=e.IdentityMatrix=e.CombineRotation=e.InverseRotation=e.NextPlanetApsis=e.SearchPlanetApsis=e.NextLunarApsis=e.SearchLunarApsis=e.Apsis=e.ApsisKind=e.SearchPeakMagnitude=e.SearchMaxElongation=e.Elongation=e.ElongationEvent=e.Seasons=e.SeasonInfo=e.HourAngle=e.SearchHourAngle=e.HourAngleEvent=e.SearchAltitude=e.SearchRiseSet=e.Atmosphere=e.AtmosphereInfo=e.NextMoonQuarter=e.SearchMoonQuarter=e.MoonQuarter=e.SearchMoonPhase=e.MoonPhase=
e.SearchRelativeLongitude=e.Illumination=e.IlluminationInfo=e.EclipticLongitude=e.AngleFromSun=e.PairLongitude=e.SearchSunLongitude=e.Search=e.HelioState=e.BaryState=e.GeoVector=e.BackdatePosition=e.CorrectLightTravel=e.HelioDistance=e.HelioVector=e.JupiterMoons=e.JupiterMoonsInfo=void 0;e.GravitySimulator=e.LagrangePointFast=e.LagrangePoint=e.RotationAxis=e.AxisInfo=e.NextMoonNode=e.SearchMoonNode=e.NodeEventInfo=e.NodeEventKind=e.NextTransit=e.SearchTransit=e.TransitInfo=e.NextLocalSolarEclipse=
e.SearchLocalSolarEclipse=e.LocalSolarEclipseInfo=e.EclipseEvent=e.NextGlobalSolarEclipse=e.SearchGlobalSolarEclipse=e.NextLunarEclipse=e.GlobalSolarEclipseInfo=e.SearchLunarEclipse=e.LunarEclipseInfo=e.EclipseKind=e.Constellation=e.ConstellationInfo=e.Rotation_EQD_ECT=e.Rotation_ECT_EQD=e.Rotation_GAL_EQJ=e.Rotation_EQJ_GAL=e.Rotation_HOR_ECL=e.Rotation_ECL_HOR=e.Rotation_ECL_EQD=e.Rotation_EQD_ECL=e.Rotation_EQJ_HOR=e.Rotation_HOR_EQJ=e.Rotation_HOR_EQD=e.Rotation_EQD_HOR=e.Rotation_EQD_EQJ=e.Rotation_ECT_EQJ=
e.Rotation_EQJ_ECT=e.Rotation_EQJ_EQD=e.Rotation_ECL_EQJ=e.Rotation_EQJ_ECL=e.RotateState=e.RotateVector=e.InverseRefraction=e.Refraction=void 0;e.C_AUDAY=173.1446326846693;e.KM_PER_AU=1.4959787069098932E8;e.AU_PER_LY=63241.07708807546;e.DEG2RAD=.017453292519943295;e.HOUR2RAD=.26179938779914946;e.RAD2DEG=57.29577951308232;e.RAD2HOUR=3.819718634205488;e.JUPITER_EQUATORIAL_RADIUS_KM=71492;e.JUPITER_POLAR_RADIUS_KM=66854;e.JUPITER_MEAN_RADIUS_KM=69911;e.IO_RADIUS_KM=1821.6;e.EUROPA_RADIUS_KM=1560.8;
e.GANYMEDE_RADIUS_KM=2631.2;e.CALLISTO_RADIUS_KM=2410.3;var dd=new Date("2000-01-01T12:00:00Z"),U=2*Math.PI,ia=180/Math.PI*3600,td=-.17-5*Math.log10(648E3/Math.PI),Nc=695700/e.KM_PER_AU,pd=6378.1366/e.KM_PER_AU,Dd=1738.1/e.KM_PER_AU,Cd=1736/e.KM_PER_AU,Ed=34/60;e.MassProduct=C;e.AngleBetween=N;var m;(function(a){a.Sun="Sun";a.Moon="Moon";a.Mercury="Mercury";a.Venus="Venus";a.Earth="Earth";a.Mars="Mars";a.Jupiter="Jupiter";a.Saturn="Saturn";a.Uranus="Uranus";a.Neptune="Neptune";a.Pluto="Pluto";a.SSB=
"SSB";a.EMB="EMB";a.Star1="Star1";a.Star2="Star2";a.Star3="Star3";a.Star4="Star4";a.Star5="Star5";a.Star6="Star6";a.Star7="Star7";a.Star8="Star8"})(m=e.Body||(e.Body={}));var ld=[m.Star1,m.Star2,m.Star3,m.Star4,m.Star5,m.Star6,m.Star7,m.Star8],md=[{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0}];e.DefineStar=function(a,b,c,d){var f=T(a);if(!f)throw"Invalid star body: "+a;w(b);w(c);w(d);
if(0>b||24<=b)throw"Invalid right ascension for star: "+b;if(-90>c||90<c)throw"Invalid declination for star: "+c;if(1>d)throw"Invalid star distance: "+d;f.ra=b;f.dec=c;f.dist=d*e.AU_PER_LY};var F;(function(a){a[a.From2000=0]="From2000";a[a.Into2000=1]="Into2000"})(F||(F={}));var aa={Mercury:{OrbitalPeriod:87.969},Venus:{OrbitalPeriod:224.701},Earth:{OrbitalPeriod:365.256},Mars:{OrbitalPeriod:686.98},Jupiter:{OrbitalPeriod:4332.589},Saturn:{OrbitalPeriod:10759.22},Uranus:{OrbitalPeriod:30685.4},Neptune:{OrbitalPeriod:60189},
Pluto:{OrbitalPeriod:90560}};e.PlanetOrbitalPeriod=function(a){if(a in aa)return aa[a].OrbitalPeriod;throw"Unknown orbital period for: "+a;};var M={Mercury:[[[[4.40250710144,0,0],[.40989414977,1.48302034195,26087.9031415742],[.050462942,4.47785489551,52175.8062831484],[.00855346844,1.16520322459,78263.70942472259],[.00165590362,4.11969163423,104351.61256629678],[3.4561897E-4,.77930768443,130439.51570787099],[7.583476E-5,3.71348404924,156527.41884944518]],[[26087.90313685529,0,0],[.01131199811,6.21874197797,
26087.9031415742],[.00292242298,3.04449355541,52175.8062831484],[7.5775081E-4,6.08568821653,78263.70942472259],[1.9676525E-4,2.80965111777,104351.61256629678]]],[[[.11737528961,1.98357498767,26087.9031415742],[.02388076996,5.03738959686,52175.8062831484],[.01222839532,3.14159265359,0],[.0054325181,1.79644363964,78263.70942472259],[.0012977877,4.83232503958,104351.61256629678],[3.1866927E-4,1.58088495658,130439.51570787099],[7.963301E-5,4.60972126127,156527.41884944518]],[[.00274646065,3.95008450011,
26087.9031415742],[9.9737713E-4,3.14159265359,0]]],[[[.39528271651,0,0],[.07834131818,6.19233722598,26087.9031415742],[.00795525558,2.95989690104,52175.8062831484],[.00121281764,6.01064153797,78263.70942472259],[2.1921969E-4,2.77820093972,104351.61256629678],[4.354065E-5,5.82894543774,130439.51570787099]],[[.0021734774,4.65617158665,26087.9031415742],[4.4141826E-4,1.42385544001,52175.8062831484]]]],Venus:[[[[3.17614666774,0,0],[.01353968419,5.59313319619,10213.285546211],[8.9891645E-4,5.30650047764,
20426.571092422],[5.477194E-5,4.41630661466,7860.4193924392],[3.455741E-5,2.6996444782,11790.6290886588],[2.372061E-5,2.99377542079,3930.2096962196],[1.317168E-5,5.18668228402,26.2983197998],[1.664146E-5,4.25018630147,1577.3435424478],[1.438387E-5,4.15745084182,9683.5945811164],[1.200521E-5,6.15357116043,30639.856638633]],[[10213.28554621638,0,0],[9.5617813E-4,2.4640651111,10213.285546211],[7.787201E-5,.6247848222,20426.571092422]]],[[[.05923638472,.26702775812,10213.285546211],[4.0107978E-4,1.14737178112,
20426.571092422],[3.2814918E-4,3.14159265359,0]],[[.00287821243,1.88964962838,10213.285546211]]],[[[.72334820891,0,0],[.00489824182,4.02151831717,10213.285546211],[1.658058E-5,4.90206728031,20426.571092422],[1.378043E-5,1.12846591367,11790.6290886588],[1.632096E-5,2.84548795207,7860.4193924392],[4.98395E-6,2.58682193892,9683.5945811164],[2.21985E-6,2.01346696541,19367.1891622328],[2.37454E-6,2.55136053886,15720.8387848784]],[[3.4551041E-4,.89198706276,10213.285546211]]]],Earth:[[[[1.75347045673,0,
0],[.03341656453,4.66925680415,6283.0758499914],[3.4894275E-4,4.62610242189,12566.1516999828],[3.417572E-5,2.82886579754,3.523118349],[3.497056E-5,2.74411783405,5753.3848848968],[3.135899E-5,3.62767041756,77713.7714681205],[2.676218E-5,4.41808345438,7860.4193924392],[2.342691E-5,6.13516214446,3930.2096962196],[1.273165E-5,2.03709657878,529.6909650946],[1.324294E-5,.74246341673,11506.7697697936],[9.01854E-6,2.04505446477,26.2983197998],[1.199167E-5,1.10962946234,1577.3435424478],[8.57223E-6,3.50849152283,
398.1490034082],[7.79786E-6,1.17882681962,5223.6939198022],[9.9025E-6,5.23268072088,5884.9268465832],[7.53141E-6,2.53339052847,5507.5532386674],[5.05267E-6,4.58292599973,18849.2275499742],[4.92392E-6,4.20505711826,775.522611324],[3.56672E-6,2.91954114478,.0673103028],[2.84125E-6,1.89869240932,796.2980068164],[2.42879E-6,.34481445893,5486.777843175],[3.17087E-6,5.84901948512,11790.6290886588],[2.71112E-6,.31486255375,10977.078804699],[2.06217E-6,4.80646631478,2544.3144198834],[2.05478E-6,1.86953770281,
5573.1428014331],[2.02318E-6,2.45767790232,6069.7767545534],[1.26225E-6,1.08295459501,20.7753954924],[1.55516E-6,.83306084617,213.299095438]],[[6283.0758499914,0,0],[.00206058863,2.67823455808,6283.0758499914],[4.303419E-5,2.63512233481,12566.1516999828]],[[8.721859E-5,1.07253635559,6283.0758499914]]],[[],[[.00227777722,3.4137662053,6283.0758499914],[3.805678E-5,3.37063423795,12566.1516999828]]],[[[1.00013988784,0,0],[.01670699632,3.09846350258,6283.0758499914],[1.3956024E-4,3.05524609456,12566.1516999828],
[3.08372E-5,5.19846674381,77713.7714681205],[1.628463E-5,1.17387558054,5753.3848848968],[1.575572E-5,2.84685214877,7860.4193924392],[9.24799E-6,5.45292236722,11506.7697697936],[5.42439E-6,4.56409151453,3930.2096962196],[4.7211E-6,3.66100022149,5884.9268465832],[8.5831E-7,1.27079125277,161000.6857376741],[5.7056E-7,2.01374292245,83996.84731811189],[5.5736E-7,5.2415979917,71430.69561812909],[1.74844E-6,3.01193636733,18849.2275499742],[2.43181E-6,4.2734953079,11790.6290886588]],[[.00103018607,1.10748968172,
6283.0758499914],[1.721238E-5,1.06442300386,12566.1516999828]],[[4.359385E-5,5.78455133808,6283.0758499914]]]],Mars:[[[[6.20347711581,0,0],[.18656368093,5.0503710027,3340.6124266998],[.01108216816,5.40099836344,6681.2248533996],[9.1798406E-4,5.75478744667,10021.8372800994],[2.7744987E-4,5.97049513147,3.523118349],[1.0610235E-4,2.93958560338,2281.2304965106],[1.2315897E-4,.84956094002,2810.9214616052],[8.926784E-5,4.15697846427,.0172536522],[8.715691E-5,6.11005153139,13362.4497067992],[6.797556E-5,
.36462229657,398.1490034082],[7.774872E-5,3.33968761376,5621.8429232104],[3.575078E-5,1.6618650571,2544.3144198834],[4.161108E-5,.22814971327,2942.4634232916],[3.075252E-5,.85696614132,191.4482661116],[2.628117E-5,.64806124465,3337.0893083508],[2.937546E-5,6.07893711402,.0673103028],[2.389414E-5,5.03896442664,796.2980068164],[2.579844E-5,.02996736156,3344.1355450488],[1.528141E-5,1.14979301996,6151.533888305],[1.798806E-5,.65634057445,529.6909650946],[1.264357E-5,3.62275122593,5092.1519581158],[1.286228E-5,
3.06796065034,2146.1654164752],[1.546404E-5,2.91579701718,1751.539531416],[1.024902E-5,3.69334099279,8962.4553499102],[8.91566E-6,.18293837498,16703.062133499],[8.58759E-6,2.4009381194,2914.0142358238],[8.32715E-6,2.46418619474,3340.5951730476],[8.3272E-6,4.49495782139,3340.629680352],[7.12902E-6,3.66335473479,1059.3819301892],[7.48723E-6,3.82248614017,155.4203994342],[7.23861E-6,.67497311481,3738.761430108],[6.35548E-6,2.92182225127,8432.7643848156],[6.55162E-6,.48864064125,3127.3133312618],[5.50474E-6,
3.81001042328,.9803210682],[5.5275E-6,4.47479317037,1748.016413067],[4.25966E-6,.55364317304,6283.0758499914],[4.15131E-6,.49662285038,213.299095438],[4.72167E-6,3.62547124025,1194.4470102246],[3.06551E-6,.38052848348,6684.7479717486],[3.12141E-6,.99853944405,6677.7017350506],[2.93198E-6,4.22131299634,20.7753954924],[3.02375E-6,4.48618007156,3532.0606928114],[2.74027E-6,.54222167059,3340.545116397],[2.81079E-6,5.88163521788,1349.8674096588],[2.31183E-6,1.28242156993,3870.3033917944],[2.83602E-6,5.7688543494,
3149.1641605882],[2.36117E-6,5.75503217933,3333.498879699],[2.74033E-6,.13372524985,3340.6797370026],[2.99395E-6,2.78323740866,6254.6266625236]],[[3340.61242700512,0,0],[.01457554523,3.60433733236,3340.6124266998],[.00168414711,3.92318567804,6681.2248533996],[2.0622975E-4,4.26108844583,10021.8372800994],[3.452392E-5,4.7321039319,3.523118349],[2.586332E-5,4.60670058555,13362.4497067992],[8.41535E-6,4.45864030426,2281.2304965106]],[[5.8152577E-4,2.04961712429,3340.6124266998],[1.3459579E-4,2.45738706163,
6681.2248533996]]],[[[.03197134986,3.76832042431,3340.6124266998],[.00298033234,4.10616996305,6681.2248533996],[.00289104742,0,0],[3.1365539E-4,4.4465105309,10021.8372800994],[3.4841E-5,4.7881254926,13362.4497067992]],[[.00217310991,6.04472194776,3340.6124266998],[2.0976948E-4,3.14159265359,0],[1.2834709E-4,1.60810667915,6681.2248533996]]],[[[1.53033488271,0,0],[.1418495316,3.47971283528,3340.6124266998],[.00660776362,3.81783443019,6681.2248533996],[4.6179117E-4,4.15595316782,10021.8372800994],[8.109733E-5,
5.55958416318,2810.9214616052],[7.485318E-5,1.77239078402,5621.8429232104],[5.523191E-5,1.3643630377,2281.2304965106],[3.82516E-5,4.49407183687,13362.4497067992],[2.306537E-5,.09081579001,2544.3144198834],[1.999396E-5,5.36059617709,3337.0893083508],[2.484394E-5,4.9254563992,2942.4634232916],[1.960195E-5,4.74249437639,3344.1355450488],[1.167119E-5,2.11260868341,5092.1519581158],[1.102816E-5,5.00908403998,398.1490034082],[8.99066E-6,4.40791133207,529.6909650946],[9.92252E-6,5.83861961952,6151.533888305],
[8.07354E-6,2.10217065501,1059.3819301892],[7.97915E-6,3.44839203899,796.2980068164],[7.40975E-6,1.49906336885,2146.1654164752]],[[.01107433345,2.03250524857,3340.6124266998],[.00103175887,2.37071847807,6681.2248533996],[1.28772E-4,0,0],[1.081588E-4,2.70888095665,10021.8372800994]],[[4.4242249E-4,.47930604954,3340.6124266998],[8.138042E-5,.86998389204,6681.2248533996]]]],Jupiter:[[[[.59954691494,0,0],[.09695898719,5.06191793158,529.6909650946],[.00573610142,1.44406205629,7.1135470008],[.00306389205,
5.41734730184,1059.3819301892],[9.7178296E-4,4.14264726552,632.7837393132],[7.2903078E-4,3.64042916389,522.5774180938],[6.4263975E-4,3.41145165351,103.0927742186],[3.9806064E-4,2.29376740788,419.4846438752],[3.8857767E-4,1.27231755835,316.3918696566],[2.7964629E-4,1.7845459182,536.8045120954],[1.358973E-4,5.7748104079,1589.0728952838],[8.246349E-5,3.5822792584,206.1855484372],[8.768704E-5,3.63000308199,949.1756089698],[7.368042E-5,5.0810119427,735.8765135318],[6.26315E-5,.02497628807,213.299095438],
[6.114062E-5,4.51319998626,1162.4747044078],[4.905396E-5,1.32084470588,110.2063212194],[5.305285E-5,1.30671216791,14.2270940016],[5.305441E-5,4.18625634012,1052.2683831884],[4.647248E-5,4.69958103684,3.9321532631],[3.045023E-5,4.31676431084,426.598190876],[2.609999E-5,1.56667394063,846.0828347512],[2.028191E-5,1.06376530715,3.1813937377],[1.764763E-5,2.14148655117,1066.49547719],[1.722972E-5,3.88036268267,1265.5674786264],[1.920945E-5,.97168196472,639.897286314],[1.633223E-5,3.58201833555,515.463871093],
[1.431999E-5,4.29685556046,625.6701923124],[9.73272E-6,4.09764549134,95.9792272178]],[[529.69096508814,0,0],[.00489503243,4.2208293947,529.6909650946],[.00228917222,6.02646855621,7.1135470008],[3.0099479E-4,4.54540782858,1059.3819301892],[2.072092E-4,5.45943156902,522.5774180938],[1.2103653E-4,.16994816098,536.8045120954],[6.067987E-5,4.42422292017,103.0927742186],[5.433968E-5,3.98480737746,419.4846438752],[4.237744E-5,5.89008707199,14.2270940016]],[[4.7233601E-4,4.32148536482,7.1135470008],[3.0649436E-4,
2.929777887,529.6909650946],[1.4837605E-4,3.14159265359,0]]],[[[.02268615702,3.55852606721,529.6909650946],[.00109971634,3.90809347197,1059.3819301892],[.00110090358,0,0],[8.101428E-5,3.60509572885,522.5774180938],[6.043996E-5,4.25883108339,1589.0728952838],[6.437782E-5,.30627119215,536.8045120954]],[[7.8203446E-4,1.52377859742,529.6909650946]]],[[[5.20887429326,0,0],[.25209327119,3.49108639871,529.6909650946],[.00610599976,3.84115365948,1059.3819301892],[.00282029458,2.57419881293,632.7837393132],
[.00187647346,2.07590383214,522.5774180938],[8.6792905E-4,.71001145545,419.4846438752],[7.2062974E-4,.21465724607,536.8045120954],[6.5517248E-4,5.9799588479,316.3918696566],[2.9134542E-4,1.67759379655,103.0927742186],[3.0135335E-4,2.16132003734,949.1756089698],[2.3453271E-4,3.54023522184,735.8765135318],[2.2283743E-4,4.19362594399,1589.0728952838],[2.3947298E-4,.2745803748,7.1135470008],[1.3032614E-4,2.96042965363,1162.4747044078],[9.70336E-5,1.90669633585,206.1855484372],[1.2749023E-4,2.71550286592,
1052.2683831884],[7.057931E-5,2.18184839926,1265.5674786264],[6.137703E-5,6.26418240033,846.0828347512],[2.616976E-5,2.00994012876,1581.959348283]],[[.0127180152,2.64937512894,529.6909650946],[6.1661816E-4,3.00076460387,1059.3819301892],[5.3443713E-4,3.89717383175,522.5774180938],[3.1185171E-4,4.88276958012,536.8045120954],[4.1390269E-4,0,0]]]],Saturn:[[[[.87401354025,0,0],[.11107659762,3.96205090159,213.299095438],[.01414150957,4.58581516874,7.1135470008],[.00398379389,.52112032699,206.1855484372],
[.00350769243,3.30329907896,426.598190876],[.00206816305,.24658372002,103.0927742186],[7.92713E-4,3.84007056878,220.4126424388],[2.3990355E-4,4.66976924553,110.2063212194],[1.6573588E-4,.43719228296,419.4846438752],[1.4906995E-4,5.76903183869,316.3918696566],[1.582029E-4,.93809155235,632.7837393132],[1.4609559E-4,1.56518472,3.9321532631],[1.3160301E-4,4.44891291899,14.2270940016],[1.5053543E-4,2.71669915667,639.897286314],[1.3005299E-4,5.98119023644,11.0457002639],[1.0725067E-4,3.12939523827,202.2533951741],
[5.863206E-5,.23656938524,529.6909650946],[5.227757E-5,4.20783365759,3.1813937377],[6.126317E-5,1.76328667907,277.0349937414],[5.019687E-5,3.17787728405,433.7117378768],[4.59255E-5,.61977744975,199.0720014364],[4.005867E-5,2.24479718502,63.7358983034],[2.953796E-5,.98280366998,95.9792272178],[3.87367E-5,3.22283226966,138.5174968707],[2.461186E-5,2.03163875071,735.8765135318],[3.269484E-5,.77492638211,949.1756089698],[1.758145E-5,3.2658010994,522.5774180938],[1.640172E-5,5.5050445305,846.0828347512],
[1.391327E-5,4.02333150505,323.5054166574],[1.580648E-5,4.37265307169,309.2783226558],[1.123498E-5,2.83726798446,415.5524906121],[1.017275E-5,3.71700135395,227.5261894396],[8.48642E-6,3.1915017083,209.3669421749]],[[213.2990952169,0,0],[.01297370862,1.82834923978,213.299095438],[.00564345393,2.88499717272,7.1135470008],[9.3734369E-4,1.06311793502,426.598190876],[.00107674962,2.27769131009,206.1855484372],[4.0244455E-4,2.04108104671,220.4126424388],[1.9941774E-4,1.2795439047,103.0927742186],[1.0511678E-4,
2.7488034213,14.2270940016],[6.416106E-5,.38238295041,639.897286314],[4.848994E-5,2.43037610229,419.4846438752],[4.056892E-5,2.92133209468,110.2063212194],[3.768635E-5,3.6496533078,3.9321532631]],[[.0011644133,1.17988132879,7.1135470008],[9.1841837E-4,.0732519584,213.299095438],[3.6661728E-4,0,0],[1.5274496E-4,4.06493179167,206.1855484372]]],[[[.04330678039,3.60284428399,213.299095438],[.00240348302,2.85238489373,426.598190876],[8.4745939E-4,0,0],[3.0863357E-4,3.48441504555,220.4126424388],[3.4116062E-4,
.57297307557,206.1855484372],[1.473407E-4,2.11846596715,639.897286314],[9.916667E-5,5.79003188904,419.4846438752],[6.993564E-5,4.7360468972,7.1135470008],[4.807588E-5,5.43305312061,316.3918696566]],[[.00198927992,4.93901017903,213.299095438],[3.6947916E-4,3.14159265359,0],[1.7966989E-4,.5197943111,426.598190876]]],[[[9.55758135486,0,0],[.52921382865,2.39226219573,213.299095438],[.01873679867,5.2354960466,206.1855484372],[.01464663929,1.64763042902,426.598190876],[.00821891141,5.93520042303,316.3918696566],
[.00547506923,5.0153261898,103.0927742186],[.0037168465,2.27114821115,220.4126424388],[.00361778765,3.13904301847,7.1135470008],[.00140617506,5.70406606781,632.7837393132],[.00108974848,3.29313390175,110.2063212194],[6.9006962E-4,5.94099540992,419.4846438752],[6.1053367E-4,.94037691801,639.897286314],[4.8913294E-4,1.55733638681,202.2533951741],[3.4143772E-4,.19519102597,277.0349937414],[3.2401773E-4,5.47084567016,949.1756089698],[2.0936596E-4,.46349251129,735.8765135318],[9.796004E-5,5.20477537945,
1265.5674786264],[1.1993338E-4,5.98050967385,846.0828347512],[2.08393E-4,1.52102476129,433.7117378768],[1.5298404E-4,3.0594381494,529.6909650946],[6.465823E-5,.17732249942,1052.2683831884],[1.1380257E-4,1.7310542704,522.5774180938],[3.419618E-5,4.94550542171,1581.959348283]],[[.0618298134,.2584351148,213.299095438],[.00506577242,.71114625261,206.1855484372],[.00341394029,5.79635741658,426.598190876],[.00188491195,.47215589652,220.4126424388],[.00186261486,3.14159265359,0],[.00143891146,1.40744822888,
7.1135470008]],[[.00436902572,4.78671677509,213.299095438]]]],Uranus:[[[[5.48129294297,0,0],[.09260408234,.89106421507,74.7815985673],[.01504247898,3.6271926092,1.4844727083],[.00365981674,1.89962179044,73.297125859],[.00272328168,3.35823706307,149.5631971346],[7.0328461E-4,5.39254450063,63.7358983034],[6.8892678E-4,6.09292483287,76.2660712756],[6.1998615E-4,2.26952066061,2.9689454166],[6.1950719E-4,2.85098872691,11.0457002639],[2.646877E-4,3.14152083966,71.8126531507],[2.5710476E-4,6.11379840493,
454.9093665273],[2.107885E-4,4.36059339067,148.0787244263],[1.7818647E-4,1.74436930289,36.6485629295],[1.4613507E-4,4.73732166022,3.9321532631],[1.1162509E-4,5.8268179635,224.3447957019],[1.099791E-4,.48865004018,138.5174968707],[9.527478E-5,2.95516862826,35.1640902212],[7.545601E-5,5.236265824,109.9456887885],[4.220241E-5,3.23328220918,70.8494453042],[4.0519E-5,2.277550173,151.0476698429],[3.354596E-5,1.0654900738,4.4534181249],[2.926718E-5,4.62903718891,9.5612275556],[3.49034E-5,5.48306144511,146.594251718],
[3.144069E-5,4.75199570434,77.7505439839],[2.922333E-5,5.35235361027,85.8272988312],[2.272788E-5,4.36600400036,70.3281804424],[2.051219E-5,1.51773566586,.1118745846],[2.148602E-5,.60745949945,38.1330356378],[1.991643E-5,4.92437588682,277.0349937414],[1.376226E-5,2.04283539351,65.2203710117],[1.666902E-5,3.62744066769,380.12776796],[1.284107E-5,3.11347961505,202.2533951741],[1.150429E-5,.93343589092,3.1813937377],[1.533221E-5,2.58594681212,52.6901980395],[1.281604E-5,.54271272721,222.8603229936],[1.372139E-5,
4.19641530878,111.4301614968],[1.221029E-5,.1990065003,108.4612160802],[9.46181E-6,1.19253165736,127.4717966068],[1.150989E-5,4.17898916639,33.6796175129]],[[74.7815986091,0,0],[.00154332863,5.24158770553,74.7815985673],[2.4456474E-4,1.71260334156,1.4844727083],[9.258442E-5,.4282973235,11.0457002639],[8.265977E-5,1.50218091379,63.7358983034],[9.15016E-5,1.41213765216,149.5631971346]]],[[[.01346277648,2.61877810547,74.7815985673],[6.23414E-4,5.08111189648,149.5631971346],[6.1601196E-4,3.14159265359,
0],[9.963722E-5,1.61603805646,76.2660712756],[9.92616E-5,.57630380333,73.297125859]],[[3.4101978E-4,.01321929936,74.7815985673]]],[[[19.21264847206,0,0],[.88784984413,5.60377527014,74.7815985673],[.03440836062,.32836099706,73.297125859],[.0205565386,1.7829515933,149.5631971346],[.0064932241,4.52247285911,76.2660712756],[.00602247865,3.86003823674,63.7358983034],[.00496404167,1.40139935333,454.9093665273],[.00338525369,1.58002770318,138.5174968707],[.00243509114,1.57086606044,71.8126531507],[.00190522303,
1.99809394714,1.4844727083],[.00161858838,2.79137786799,148.0787244263],[.00143706183,1.38368544947,11.0457002639],[9.3192405E-4,.17437220467,36.6485629295],[7.1424548E-4,4.24509236074,224.3447957019],[8.9806014E-4,3.66105364565,109.9456887885],[3.9009723E-4,1.66971401684,70.8494453042],[4.6677296E-4,1.39976401694,35.1640902212],[3.9025624E-4,3.36234773834,277.0349937414],[3.6755274E-4,3.88649278513,146.594251718],[3.0348723E-4,.70100838798,151.0476698429],[2.9156413E-4,3.180563367,77.7505439839],
[2.2637073E-4,.72518687029,529.6909650946],[1.1959076E-4,1.7504339214,984.6003316219],[2.5620756E-4,5.25656086672,380.12776796]],[[.01479896629,3.67205697578,74.7815985673]]]],Neptune:[[[[5.31188633046,0,0],[.0179847553,2.9010127389,38.1330356378],[.01019727652,.48580922867,1.4844727083],[.00124531845,4.83008090676,36.6485629295],[4.2064466E-4,5.41054993053,2.9689454166],[3.7714584E-4,6.09221808686,35.1640902212],[3.3784738E-4,1.24488874087,76.2660712756],[1.6482741E-4,7.727998E-5,491.5579294568],
[9.198584E-5,4.93747051954,39.6175083461],[8.99425E-5,.27462171806,175.1660598002]],[[38.13303563957,0,0],[1.6604172E-4,4.86323329249,1.4844727083],[1.5744045E-4,2.27887427527,38.1330356378]]],[[[.03088622933,1.44104372644,38.1330356378],[2.7780087E-4,5.91271884599,76.2660712756],[2.7623609E-4,0,0],[1.5355489E-4,2.52123799551,36.6485629295],[1.5448133E-4,3.50877079215,39.6175083461]]],[[[30.07013205828,0,0],[.27062259632,1.32999459377,38.1330356378],[.01691764014,3.25186135653,36.6485629295],[.00807830553,
5.18592878704,1.4844727083],[.0053776051,4.52113935896,35.1640902212],[.00495725141,1.5710564165,491.5579294568],[.00274571975,1.84552258866,175.1660598002],[1.201232E-4,1.92059384991,1021.2488945514],[.00121801746,5.79754470298,76.2660712756],[.00100896068,.3770272493,73.297125859],[.00135134092,3.37220609835,39.6175083461],[7.571796E-5,1.07149207335,388.4651552382]]]]};e.DeltaT_EspenakMeeus=sa;e.DeltaT_JplHorizons=function(a){return sa(Math.min(a,17*365.24217))};var Wb=sa;e.SetDeltaTFunction=function(a){Wb=
a};var O=function(a){if(a instanceof O)this.date=a.date,this.ut=a.ut,this.tt=a.tt;else if(a instanceof Date&&Number.isFinite(a.getTime()))this.date=a,this.ut=(a.getTime()-dd.getTime())/864E5,this.tt=Vb(this.ut);else if(Number.isFinite(a))this.date=new Date(dd.getTime()+864E5*a),this.ut=a,this.tt=Vb(this.ut);else throw"Argument must be a Date object, an AstroTime object, or a numeric UTC Julian date.";};O.FromTerrestrialTime=function(a){for(var b=new O(a);;){var c=a-b.tt;if(1E-12>Math.abs(c))return b;
b=b.AddDays(c)}};O.prototype.toString=function(){return this.date.toISOString()};O.prototype.AddDays=function(a){return new O(this.ut+a)};e.AstroTime=O;e.MakeTime=v;var $a;e.e_tilt=da;e.CalcMoonCount=0;var ed=function(a,b,c,d,f,g){this.elat=a;this.elon=b;this.mlat=c;this.mlon=d;this.dist_km=f;this.diam_deg=g};e.LibrationInfo=ed;e.Libration=function(a){var b=v(a);a=b.tt/36525;var c=a*a,d=c*a,f=c*c,g=ea(b);b=g.geo_eclip_lon;var h=g.geo_eclip_lat;g=g.distance_au*e.KM_PER_AU;var l=1.543*e.DEG2RAD,k=e.DEG2RAD*
Ga(93.272095+483202.0175233*a-.0036539*c-d/3526E3+f/86331E4),n=e.DEG2RAD*Ga(125.0445479-1934.1362891*a+.0020754*c+d/467441-f/60616E3),p=e.DEG2RAD*Ga(357.5291092+35999.0502909*a-1.536E-4*c+d/2449E4),q=e.DEG2RAD*Ga(134.9633964+477198.8675055*a+.0087414*c+d/69699-f/14712E3);d=e.DEG2RAD*Ga(297.8501921+445267.1114034*a-.0018819*c+d/545868-f/113065E3);c=1-.002516*a-7.4E-6*c;var t=b-n;f=Math.atan2(Math.sin(t)*Math.cos(h)*Math.cos(l)-Math.sin(h)*Math.sin(l),Math.cos(t)*Math.cos(h));var y=Fa(e.RAD2DEG*(f-
k));l=Math.asin(-Math.sin(t)*Math.cos(h)*Math.sin(l)-Math.sin(h)*Math.cos(l));t=-.02752*Math.cos(q)+-.02245*Math.sin(k)+.00684*Math.cos(q-2*k)+-.00293*Math.cos(2*k)+-8.5E-4*Math.cos(2*k-2*d)+-5.4E-4*Math.cos(q-2*d)+-2E-4*Math.sin(q+k)+-2E-4*Math.cos(q+2*k)+-2E-4*Math.cos(q-k)+1.4E-4*Math.cos(q+2*k-2*d);var x=-.02816*Math.sin(q)+.02244*Math.cos(k)+-.00682*Math.sin(q-2*k)+-.00279*Math.sin(2*k)+-8.3E-4*Math.sin(2*k-2*d)+6.9E-4*Math.sin(q-2*d)+4E-4*Math.cos(q+k)+-2.5E-4*Math.sin(2*q)+-2.3E-4*Math.sin(q+
2*k)+2E-4*Math.cos(q-k)+1.9E-4*Math.sin(q-k)+1.3E-4*Math.sin(q+2*k-2*d)+-1E-4*Math.cos(q-3*k);return new ed(e.RAD2DEG*l+(x*Math.cos(f)-t*Math.sin(f)),y+(-(.0252*c*Math.sin(p)+.00473*Math.sin(2*q-2*k)+-.00467*Math.sin(q)+.00396*Math.sin(e.DEG2RAD*(119.75+131.849*a))+.00276*Math.sin(2*q-2*d)+.00196*Math.sin(n)+-.00183*Math.cos(q-k)+.00115*Math.sin(q-2*d)+-9.6E-4*Math.sin(q-d)+4.6E-4*Math.sin(2*k-2*d)+-3.9E-4*Math.sin(q-k)+-3.2E-4*Math.sin(q-p-d)+2.7E-4*Math.sin(2*q-p-2*d)+2.3E-4*Math.sin(e.DEG2RAD*
(72.56+20.186*a))+-1.4E-4*Math.sin(2*d)+1.4E-4*Math.cos(2*q-2*k)+-1.2E-4*Math.sin(q-2*k)+-1.2E-4*Math.sin(2*q)+1.1E-4*Math.sin(2*q-2*p-2*d))+(t*Math.cos(f)+x*Math.sin(f))*Math.tan(l)),e.RAD2DEG*h,e.RAD2DEG*b,g,2*e.RAD2DEG*Math.atan(1737.4/Math.sqrt(g*g-1737.4*1737.4)))};var eb;e.SiderealTime=bc;var E=function(a,b,c,d){this.x=a;this.y=b;this.z=c;this.t=d};E.prototype.Length=function(){return Math.hypot(this.x,this.y,this.z)};e.Vector=E;var I=function(a,b,c,d,f,g,h){this.x=a;this.y=b;this.z=c;this.vx=
d;this.vy=f;this.vz=g;this.t=h};e.StateVector=I;var Ba=function(a,b,c){this.lat=w(a);this.lon=w(b);this.dist=w(c)};e.Spherical=Ba;var gb=function(a,b,c,d){this.ra=w(a);this.dec=w(b);this.dist=w(c);this.vec=d};e.EquatorialCoordinates=gb;var J=function(a){this.rot=a};e.RotationMatrix=J;e.MakeRotation=function(a){if(!qd(a))throw"Argument must be a [3][3] array of numbers";return new J(a)};var ec=function(a,b,c,d){this.azimuth=w(a);this.altitude=w(b);this.ra=w(c);this.dec=w(d)};e.HorizontalCoordinates=
ec;var gc=function(a,b,c){this.vec=a;this.elat=w(b);this.elon=w(c)};e.EclipticCoordinates=gc;e.Horizon=hb;var zb=function(a,b,c){this.latitude=a;this.longitude=b;this.height=c;za(this)};e.Observer=zb;e.SunPosition=fc;e.Equator=Pa;e.ObserverVector=function(a,b,c){a=v(a);var d=ca(a);b=xb(b,d).pos;c||(b=fb(b,a,F.Into2000));return yb(b,a)};e.ObserverState=function(a,b,c){a=v(a);var d=ca(a);b=xb(b,d);b=new I(b.pos[0],b.pos[1],b.pos[2],b.vel[0],b.vel[1],b.vel[2],a);return c?b:(c=F.Into2000,c===F.Into2000?
(d=Na(a,c),b=Ea(d,b),a=Ma(a,c),a=Ea(a,b)):(d=Ma(a,c),b=Ea(d,b),a=Na(a,c),a=Ea(a,b)),a)};e.VectorObserver=function(a,b){var c=ca(a.t),d=[a.x,a.y,a.z];b||(d=wa(d,a.t,F.From2000),d=xa(d,a.t,F.From2000));var f=d[0]*e.KM_PER_AU,g=d[1]*e.KM_PER_AU;a=d[2]*e.KM_PER_AU;b=Math.hypot(f,g);if(1E-6>b)c=0,g=0<a?90:-90,a=Math.abs(a)-6356.751857971648;else{for(c=e.RAD2DEG*Math.atan2(g,f)-15*c;-180>=c;)c+=360;for(;180<c;)c-=360;g=Math.atan2(a,b);for(var h,l=0,k=0,n=Math.max(1,Math.hypot(d[0],d[1],d[2]));;){if(10<
++l)throw"inverse_terra failed to converge: W="+k+", distanceAu="+n;d=Math.cos(g);f=Math.sin(g);var p=d*d,q=f*f,t=p+.9933056020041345*q;h=Math.sqrt(t);k=-42.69778487239616*f*d/h-a*d+b*f;if(Math.abs(k)<2E-8*n)break;g-=k/(-42.69778487239616*((p-q)/h-q*p*-.006694397995865464/(-42.69778487239616*t))+a*f+b*d)}g*=e.RAD2DEG;h=6378.1366/h;a=Math.abs(f)>Math.abs(d)?a/f-.9933056020041345*h:b/d-h}return new zb(g,c,1E3*a)};e.ObserverGravity=function(a,b){a=Math.sin(a*e.DEG2RAD);a*=a;return 9.7803253359*(1+.00193185265241*
a)/Math.sqrt(1-.00669437999013*a)*(1-(3.15704E-7-2.10269E-9*a)*b+7.37452E-14*b*b)};e.Ecliptic=Qa;e.GeoMoon=Y;e.EclipticGeoMoon=ib;e.GeoMoonState=Ra;e.GeoEmbState=Bb;var na=[[-73E4,[-26.118207232108,-14.376168177825,3.384402515299],[.0016339372163656,-.0027861699588508,-.0013585880229445]],[-700800,[41.974905202127,-.448502952929,-12.770351505989],[7.3458569351457E-4,.0022785014891658,4.8619778602049E-4]],[-671600,[14.706930780744,44.269110540027,9.353698474772],[-.00210001479998,2.2295915939915E-4,
7.0143443551414E-4]],[-642400,[-29.441003929957,-6.43016153057,6.858481011305],[8.4495803960544E-4,-.0030783914758711,-.0012106305981192]],[-613200,[39.444396946234,-6.557989760571,-13.913760296463],[.0011480029005873,.0022400006880665,3.5168075922288E-4]],[-584E3,[20.2303809507,43.266966657189,7.382966091923],[-.0019754081700585,5.3457141292226E-4,7.5929169129793E-4]],[-554800,[-30.65832536462,2.093818874552,9.880531138071],[6.1010603013347E-5,-.0031326500935382,-9.9346125151067E-4]],[-525600,[35.737703251673,
-12.587706024764,-14.677847247563],[.0015802939375649,.0021347678412429,1.9074436384343E-4]],[-496400,[25.466295188546,41.367478338417,5.216476873382],[-.0018054401046468,8.328308359951E-4,8.0260156912107E-4]],[-467200,[-29.847174904071,10.636426313081,12.297904180106],[-6.3257063052907E-4,-.0029969577578221,-7.4476074151596E-4]],[-438E3,[30.774692107687,-18.236637015304,-14.945535879896],[.0020113162005465,.0019353827024189,-2.0937793168297E-6]],[-408800,[30.243153324028,38.656267888503,2.938501750218],
[-.0016052508674468,.0011183495337525,8.3333973416824E-4]],[-379600,[-27.288984772533,18.643162147874,14.023633623329],[-.0011856388898191,-.0027170609282181,-4.9015526126399E-4]],[-350400,[24.519605196774,-23.245756064727,-14.626862367368],[.0024322321483154,.0016062008146048,-2.3369181613312E-4]],[-321200,[34.505274805875,35.125338586954,.557361475637],[-.0013824391637782,.0013833397561817,8.4823598806262E-4]],[-292E3,[-23.275363915119,25.818514298769,15.055381588598],[-.0016062295460975,-.0023395961498533,
-2.4377362639479E-4]],[-262800,[17.050384798092,-27.180376290126,-13.608963321694],[.0028175521080578,.0011358749093955,-4.9548725258825E-4]],[-233600,[38.093671910285,30.880588383337,-1.843688067413],[-.0011317697153459,.0016128814698472,8.4177586176055E-4]],[-204400,[-18.197852930878,31.932869934309,15.438294826279],[-.0019117272501813,-.0019146495909842,-1.9657304369835E-5]],[-175200,[8.528924039997,-29.618422200048,-11.805400994258],[.0031034370787005,5.139363329243E-4,-7.7293066202546E-4]],[-146E3,
[40.94685725864,25.904973592021,-4.256336240499],[-8.3652705194051E-4,.0018129497136404,8.156422827306E-4]],[-116800,[-12.326958895325,36.881883446292,15.217158258711],[-.0021166103705038,-.001481442003599,1.7401209844705E-4]],[-87600,[-.633258375909,-30.018759794709,-9.17193287495],[.0032016994581737,-2.5279858672148E-4,-.0010411088271861]],[-58400,[42.936048423883,20.344685584452,-6.588027007912],[-5.0525450073192E-4,.0019910074335507,7.7440196540269E-4]],[-29200,[-5.975910552974,40.61180995846,
14.470131723673],[-.0022184202156107,-.0010562361130164,3.3652250216211E-4]],[0,[-9.875369580774,-27.978926224737,-5.753711824704],[.0030287533248818,-.0011276087003636,-.0012651326732361]],[29200,[43.958831986165,14.214147973292,-8.808306227163],[-1.4717608981871E-4,.0021404187242141,7.1486567806614E-4]],[58400,[.67813676352,43.094461639362,13.243238780721],[-.0022358226110718,-6.3233636090933E-4,4.7664798895648E-4]],[87600,[-18.282602096834,-23.30503958666,-1.766620508028],[.0025567245263557,-.0019902940754171,
-.0013943491701082]],[116800,[43.873338744526,7.700705617215,-10.814273666425],[2.3174803055677E-4,.0022402163127924,6.2988756452032E-4]],[146E3,[7.392949027906,44.382678951534,11.629500214854],[-.002193281545383,-2.1751799585364E-4,5.9556516201114E-4]],[175200,[-24.981690229261,-16.204012851426,2.466457544298],[.001819398914958,-.0026765419531201,-.0013848283502247]],[204400,[42.530187039511,.845935508021,-12.554907527683],[6.5059779150669E-4,.0022725657282262,5.1133743202822E-4]],[233600,[13.999526486822,
44.462363044894,9.669418486465],[-.0021079296569252,1.7533423831993E-4,6.9128485798076E-4]],[262800,[-29.184024803031,-7.371243995762,6.493275957928],[9.3581363109681E-4,-.0030610357109184,-.0012364201089345]],[292E3,[39.831980671753,-6.078405766765,-13.909815358656],[.0011117769689167,.0022362097830152,3.6230548231153E-4]],[321200,[20.294955108476,43.417190420251,7.450091985932],[-.0019742157451535,5.3102050468554E-4,7.5938408813008E-4]],[350400,[-30.66999230216,2.318743558955,9.973480913858],[4.5605107450676E-5,
-.0031308219926928,-9.9066533301924E-4]],[379600,[35.626122155983,-12.897647509224,-14.777586508444],[.0016015684949743,.0021171931182284,1.8002516202204E-4]],[408800,[26.133186148561,41.232139187599,5.00640132622],[-.0017857704419579,8.6046232702817E-4,8.0614690298954E-4]],[438E3,[-29.57674022923,11.863535943587,12.631323039872],[-7.2292830060955E-4,-.0029587820140709,-7.08242964503E-4]],[467200,[29.910805787391,-19.159019294,-15.013363865194],[.0020871080437997,.0018848372554514,-3.8528655083926E-5]],
[496400,[31.375957451819,38.050372720763,2.433138343754],[-.0015546055556611,.0011699815465629,8.3565439266001E-4]],[525600,[-26.360071336928,20.662505904952,14.414696258958],[-.0013142373118349,-.0026236647854842,-4.2542017598193E-4]],[554800,[22.599441488648,-24.508879898306,-14.484045731468],[.0025454108304806,.0014917058755191,-3.0243665086079E-4]],[584E3,[35.877864013014,33.894226366071,-.224524636277],[-.0012941245730845,.0014560427668319,8.4762160640137E-4]],[613200,[-21.538149762417,28.204068269761,
15.321973799534],[-.001731211740901,-.0021939631314577,-1.631691327518E-4]],[642400,[13.971521374415,-28.339941764789,-13.083792871886],[.0029334630526035,9.1860931752944E-4,-5.9939422488627E-4]],[671600,[39.526942044143,28.93989736011,-2.872799527539],[-.0010068481658095,.001702113288809,8.3578230511981E-4]],[700800,[-15.576200701394,34.399412961275,15.466033737854],[-.0020098814612884,-.0017191109825989,7.0414782780416E-5]],[73E4,[4.24325283709,-30.118201690825,-10.707441231349],[.0031725847067411,
1.609846120227E-4,-9.0672150593868E-4]]],B=function(a,b,c){this.x=a;this.y=b;this.z=c};B.prototype.clone=function(){return new B(this.x,this.y,this.z)};B.prototype.ToAstroVector=function(a){return new E(this.x,this.y,this.z,a)};B.zero=function(){return new B(0,0,0)};B.prototype.quadrature=function(){return this.x*this.x+this.y*this.y+this.z*this.z};B.prototype.add=function(a){return new B(this.x+a.x,this.y+a.y,this.z+a.z)};B.prototype.sub=function(a){return new B(this.x-a.x,this.y-a.y,this.z-a.z)};
B.prototype.incr=function(a){this.x+=a.x;this.y+=a.y;this.z+=a.z};B.prototype.decr=function(a){this.x-=a.x;this.y-=a.y;this.z-=a.z};B.prototype.mul=function(a){return new B(a*this.x,a*this.y,a*this.z)};B.prototype.div=function(a){return new B(this.x/a,this.y/a,this.z/a)};B.prototype.mean=function(a){return new B((this.x+a.x)/2,(this.y+a.y)/2,(this.z+a.z)/2)};B.prototype.neg=function(){return new B(-this.x,-this.y,-this.z)};var X=function(a,b,c){this.tt=a;this.r=b;this.v=c};X.prototype.clone=function(){return new X(this.tt,
this.r,this.v)};X.prototype.sub=function(a){return new X(this.tt,this.r.sub(a.r),this.v.sub(a.v))};var Da=function(a){var b=new X(a,new B(0,0,0),new B(0,0,0));this.Jupiter=R(b,a,m.Jupiter,2.825345909524226E-7);this.Saturn=R(b,a,m.Saturn,8.459715185680659E-8);this.Uranus=R(b,a,m.Uranus,1.292024916781969E-8);this.Neptune=R(b,a,m.Neptune,1.524358900784276E-8);this.Jupiter.r.decr(b.r);this.Jupiter.v.decr(b.v);this.Saturn.r.decr(b.r);this.Saturn.v.decr(b.v);this.Uranus.r.decr(b.r);this.Uranus.v.decr(b.v);
this.Neptune.r.decr(b.r);this.Neptune.v.decr(b.v);this.Sun=new X(a,b.r.mul(-1),b.v.mul(-1))};Da.prototype.Acceleration=function(a){var b=Ta(a,2.959122082855911E-4,this.Sun.r);b.incr(Ta(a,2.825345909524226E-7,this.Jupiter.r));b.incr(Ta(a,8.459715185680659E-8,this.Saturn.r));b.incr(Ta(a,1.292024916781969E-8,this.Uranus.r));b.incr(Ta(a,1.524358900784276E-8,this.Neptune.r));return b};var Ua=function(a,b,c,d){this.tt=a;this.r=b;this.v=c;this.a=d};Ua.prototype.clone=function(){return new Ua(this.tt,this.r.clone(),
this.v.clone(),this.a.clone())};var ic=function(a,b){this.bary=a;this.grav=b},Ib=[],rd=new J([[.999432765338654,-.0336771074697641,0],[.0303959428906285,.902057912352809,.430543388542295],[-.0144994559663353,-.430299169409101,.902569881273754]]),tb=[{mu:2.82489428433814E-7,al:[1.446213296021224,3.5515522861824],a:[[.0028210960212903,0,0]],l:[[-1.925258348666E-4,4.9369589722645,.01358483658305],[-9.70803596076E-5,4.3188796477322,.01303413843243],[-8.988174165E-5,1.9080016428617,.00305064867158],[-5.53101050262E-5,
1.4936156681569,.01293892891155]],z:[[.0041510849668155,4.089939635545,-.01290686414666],[6.260521444113E-4,1.446188898627,3.5515522949802],[3.52747346169E-5,2.1256287034578,1.2727416567E-4]],zeta:[[3.142172466014E-4,2.7964219722923,-.002315096098],[9.04169207946E-5,1.0477061879627,-5.6920638196E-4]]},{mu:2.82483274392893E-7,al:[-.3735263437471362,1.76932271112347],a:[[.0044871037804314,0,0],[4.324367498E-7,1.819645606291,1.7822295777568]],l:[[8.576433172936E-4,4.3188693178264,.01303413830805],[4.549582875086E-4,
1.4936531751079,.01293892881962],[3.248939825174E-4,1.8196494533458,1.7822295777568],[-3.074250079334E-4,4.9377037005911,.01358483286724],[1.982386144784E-4,1.907986905476,.00305101212869],[1.834063551804E-4,2.1402853388529,.00145009789338],[-1.434383188452E-4,5.622214036663,.89111478887838],[-7.71939140944E-5,4.300272437235,2.6733443704266]],z:[[-.0093589104136341,4.0899396509039,-.01290686414666],[2.988994545555E-4,5.9097265185595,1.7693227079462],[2.13903639035E-4,2.1256289300016,1.2727418407E-4],
[1.980963564781E-4,2.743516829265,6.7797343009E-4],[1.210388158965E-4,5.5839943711203,3.20566149E-5],[8.37042048393E-5,1.6094538368039,-.90402165808846],[8.23525166369E-5,1.4461887708689,3.5515522949802]],zeta:[[.0040404917832303,1.0477063169425,-5.692064054E-4],[2.200421034564E-4,3.3368857864364,-1.2491307307E-4],[1.662544744719E-4,2.4134862374711,0],[5.90282470983E-5,5.9719930968366,-3.056160225E-5]]},{mu:2.82498184184723E-7,al:[.2874089391143348,.878207923589328],a:[[.0071566594572575,0,0],[1.393029911E-6,
1.1586745884981,2.6733443704266]],l:[[2.310797886226E-4,2.1402987195942,.00145009784384],[-1.828635964118E-4,4.3188672736968,.01303413828263],[1.512378778204E-4,4.9373102372298,.01358483481252],[-1.163720969778E-4,4.300265986149,2.6733443704266],[-9.55478069846E-5,1.4936612842567,.01293892879857],[8.15246854464E-5,5.6222137132535,.89111478887838],[-8.01219679602E-5,1.2995922951532,1.0034433456729],[-6.07017260182E-5,.64978769669238,.50172167043264]],z:[[.0014289811307319,2.1256295942739,1.2727413029E-4],
[7.71093122676E-4,5.5836330003496,3.20643411E-5],[5.925911780766E-4,4.0899396636448,-.01290686414666],[2.045597496146E-4,5.2713683670372,-.12523544076106],[1.785118648258E-4,.28743156721063,.8782079244252],[1.131999784893E-4,1.4462127277818,3.5515522949802],[-6.5877816921E-5,2.2702423990985,-1.7951364394537],[4.97058888328E-5,5.9096792204858,1.7693227129285]],zeta:[[.0015932721570848,3.3368862796665,-1.2491307058E-4],[8.533093128905E-4,2.4133881688166,0],[3.513347911037E-4,5.9720789850127,-3.056101771E-5],
[-1.441929255483E-4,1.0477061764435,-5.6920632124E-4]]},{mu:2.82492144889909E-7,al:[-.3620341291375704,.376486233433828],a:[[.0125879701715314,0,0],[3.595204947E-6,.64965776007116,.50172168165034],[2.7580210652E-6,1.808423578151,3.1750660413359]],l:[[5.586040123824E-4,2.1404207189815,.00145009793231],[-3.805813868176E-4,2.7358844897853,2.972965062E-5],[2.205152863262E-4,.649796525964,.5017216724358],[1.877895151158E-4,1.8084787604005,3.1750660413359],[7.66916975242E-5,6.2720114319755,1.3928364636651],
[7.47056855106E-5,1.2995916202344,1.0034433456729]],z:[[.0073755808467977,5.5836071576084,3.206509914E-5],[2.065924169942E-4,5.9209831565786,.37648624194703],[1.589869764021E-4,.28744006242623,.8782079244252],[-1.561131605348E-4,2.1257397865089,1.2727441285E-4],[1.486043380971E-4,1.4462134301023,3.5515522949802],[6.35073108731E-5,5.9096803285954,1.7693227129285],[5.99351698525E-5,4.1125517584798,-2.7985797954589],[5.40660842731E-5,5.5390350845569,.00286834082283],[-4.89596900866E-5,4.6218149483338,
-.62695712529519]],zeta:[[.0038422977898495,2.4133922085557,0],[.0022453891791894,5.9721736773277,-3.056125525E-5],[-2.604479450559E-4,3.3368746306409,-1.2491309972E-4],[3.3211214323E-5,5.5604137742337,.00290037688507]]}],fd=function(a,b,c,d){this.io=a;this.europa=b;this.ganymede=c;this.callisto=d};e.JupiterMoonsInfo=fd;e.JupiterMoons=function(a){a=new O(a);return new fd(kb(a,tb[0]),kb(a,tb[1]),kb(a,tb[2]),kb(a,tb[3]))};e.HelioVector=Z;e.HelioDistance=oa;e.CorrectLightTravel=lc;var nc=function(a,
b,c,d){this.observerBody=a;this.targetBody=b;this.aberration=c;this.observerPos=d};nc.prototype.Position=function(a){this.aberration&&(this.observerPos=Z(this.observerBody,a));var b=Z(this.targetBody,a);return new E(b.x-this.observerPos.x,b.y-this.observerPos.y,b.z-this.observerPos.z,a)};e.BackdatePosition=mc;e.GeoVector=W;e.BaryState=function(a,b){b=v(b);if(a===m.SSB)return new I(0,0,0,0,0,0,b);if(a===m.Pluto)return Hb(b,!1);var c=new Da(b.tt);switch(a){case m.Sun:return pa(c.Sun,b);case m.Jupiter:return pa(c.Jupiter,
b);case m.Saturn:return pa(c.Saturn,b);case m.Uranus:return pa(c.Uranus,b);case m.Neptune:return pa(c.Neptune,b);case m.Moon:case m.EMB:var d=Sa(M[m.Earth],b.tt);a=a===m.Moon?Ra(b):Bb(b);return new I(a.x+c.Sun.r.x+d.r.x,a.y+c.Sun.r.y+d.r.y,a.z+c.Sun.r.z+d.r.z,a.vx+c.Sun.v.x+d.v.x,a.vy+c.Sun.v.y+d.v.y,a.vz+c.Sun.v.z+d.v.z,b)}if(a in M)return a=Sa(M[a],b.tt),new I(c.Sun.r.x+a.r.x,c.Sun.r.y+a.r.y,c.Sun.r.z+a.r.z,c.Sun.v.x+a.v.x,c.Sun.v.y+a.v.y,c.Sun.v.z+a.v.z,b);throw'BaryState: Unsupported body "'+
a+'"';};e.HelioState=mb;e.Search=K;e.SearchSunLongitude=oc;e.PairLongitude=Jb;e.AngleFromSun=Ha;e.EclipticLongitude=qa;var pc=function(a,b,c,d,f,g,h,l){this.time=a;this.mag=b;this.phase_angle=c;this.helio_dist=d;this.geo_dist=f;this.gc=g;this.hc=h;this.ring_tilt=l;this.phase_fraction=(1+Math.cos(e.DEG2RAD*c))/2};e.IlluminationInfo=pc;e.Illumination=nb;e.SearchRelativeLongitude=Ia;e.MoonPhase=Kb;e.SearchMoonPhase=Wa;var rc=function(a,b){this.quarter=a;this.time=b};e.MoonQuarter=rc;e.SearchMoonQuarter=
qc;e.NextMoonQuarter=function(a){a=new Date(a.time.date.getTime()+5184E5);return qc(a)};var tc=function(a,b,c){this.pressure=a;this.temperature=b;this.density=c};e.AtmosphereInfo=tc;e.Atmosphere=sc;e.SearchRiseSet=function(a,b,c,d,f,g){g=void 0===g?0:g;if(!Number.isFinite(g)||0>g)throw"Invalid value for metersAboveGround: "+g;a:switch(a){case m.Sun:var h=Nc;break a;case m.Moon:h=Dd;break a;default:h=0}var l=sc(b.height-g),k=b.latitude*e.DEG2RAD,n=Math.sin(k);k=Math.cos(k);var p=1/Math.hypot(k,.996647180302104*
n),q=(b.height-g)/1E3,t=.175*Math.pow(1-.0065/283.15*(b.height-2/3*g),3.256);return uc(a,b,c,d,f,h,e.RAD2DEG*-(Math.sqrt(2*(1-t)*g/(1E3*Math.hypot((6378.1366*p+q)*k,(6335.438815127603*p+q)*n)))/(1-t))-Ed*l.density)};e.SearchAltitude=function(a,b,c,d,f,g){if(!Number.isFinite(g)||-90>g||90<g)throw"Invalid altitude angle: "+g;return uc(a,b,c,d,f,0,g)};var ud=function(a,b,c,d){this.tx=a;this.ty=b;this.ax=c;this.ay=d},gd=function(a,b){this.time=a;this.hor=b};e.HourAngleEvent=gd;e.SearchHourAngle=function(a,
b,c,d,f){f=void 0===f?1:f;za(b);d=v(d);var g=0;if(a===m.Earth)throw"Cannot search for hour angle of the Earth.";w(c);if(0>c||24<=c)throw"Invalid hour angle "+c;w(f);if(0===f)throw"Direction must be positive or negative.";for(;;){++g;var h=ca(d),l=Pa(a,d,b,!0,!0);h=(c+l.ra-b.longitude/15-h)%24;1===g?0<f?0>h&&(h+=24):0<h&&(h-=24):-12>h?h+=24:12<h&&(h-=24);if(.1>3600*Math.abs(h))return a=hb(d,b,l.ra,l.dec,"normal"),new gd(d,a);d=d.AddDays(h/24*.9972695717592592)}};e.HourAngle=function(a,b,c){var d=v(b);
b=bc(d);a=Pa(a,d,c,!0,!0);c=(c.longitude/15+b-a.ra)%24;0>c&&(c+=24);return c};var hd=function(a,b,c,d){this.mar_equinox=a;this.jun_solstice=b;this.sep_equinox=c;this.dec_solstice=d};e.SeasonInfo=hd;e.Seasons=function(a){function b(h,l,k){l=new Date(Date.UTC(a,l-1,k));h=oc(h,l,20);if(!h)throw"Cannot find season change near "+l.toISOString();return h}a instanceof Date&&Number.isFinite(a.getTime())&&(a=a.getUTCFullYear());if(!Number.isSafeInteger(a))throw"Cannot calculate seasons because year argument "+
a+" is neither a Date nor a safe integer.";var c=b(0,3,10),d=b(90,6,10),f=b(180,9,10),g=b(270,12,10);return new hd(c,d,f,g)};var wc=function(a,b,c,d){this.time=a;this.visibility=b;this.elongation=c;this.ecliptic_separation=d};e.ElongationEvent=wc;e.Elongation=vc;e.SearchMaxElongation=function(a,b){function c(n){var p=n.AddDays(-.005);n=n.AddDays(.005);p=Ha(a,p);n=Ha(a,n);return(p-n)/.01}b=v(b);var d={Mercury:{s1:50,s2:85},Venus:{s1:40,s2:50}}[a];if(!d)throw"SearchMaxElongation works for Mercury and Venus only.";
for(var f=0;2>=++f;){var g=qa(a,b),h=qa(m.Earth,b),l=Fa(g-h),k=g=h=void 0;l>=-d.s1&&l<+d.s1?(k=0,h=+d.s1,g=+d.s2):l>=+d.s2||l<-d.s2?(k=0,h=-d.s2,g=-d.s1):0<=l?(k=-Va(a)/4,h=+d.s1,g=+d.s2):(k=-Va(a)/4,h=-d.s2,g=-d.s1);l=b.AddDays(k);h=Ia(a,h,l);g=Ia(a,g,h);l=c(h);if(0<=l)throw"SearchMaxElongation: internal error: m1 = "+l;k=c(g);if(0>=k)throw"SearchMaxElongation: internal error: m2 = "+k;l=K(c,h,g,{init_f1:l,init_f2:k,dt_tolerance_seconds:10});if(!l)throw"SearchMaxElongation: failed search iter "+
f+" (t1="+h.toString()+", t2="+g.toString()+")";if(l.tt>=b.tt)return vc(a,l);b=g.AddDays(1)}throw"SearchMaxElongation: failed to find event after 2 tries.";};e.SearchPeakMagnitude=function(a,b){function c(k){var n=k.AddDays(-.005);k=k.AddDays(.005);n=nb(a,n).mag;return(nb(a,k).mag-n)/.01}if(a!==m.Venus)throw"SearchPeakMagnitude currently works for Venus only.";b=v(b);for(var d=0;2>=++d;){var f=qa(a,b),g=qa(m.Earth,b),h=Fa(f-g),l=f=g=void 0;-10<=h&&10>h?(l=0,g=10,f=30):30<=h||-30>h?(l=0,g=-30,f=-10):
0<=h?(l=-Va(a)/4,g=10,f=30):(l=-Va(a)/4,g=-30,f=-10);h=b.AddDays(l);g=Ia(a,g,h);f=Ia(a,f,g);h=c(g);if(0<=h)throw"SearchPeakMagnitude: internal error: m1 = "+h;l=c(f);if(0>=l)throw"SearchPeakMagnitude: internal error: m2 = "+l;h=K(c,g,f,{init_f1:h,init_f2:l,dt_tolerance_seconds:10});if(!h)throw"SearchPeakMagnitude: failed search iter "+d+" (t1="+g.toString()+", t2="+f.toString()+")";if(h.tt>=b.tt)return nb(a,h);b=f.AddDays(1)}throw"SearchPeakMagnitude: failed to find event after 2 tries.";};var Ja;
(function(a){a[a.Pericenter=0]="Pericenter";a[a.Apocenter=1]="Apocenter"})(Ja=e.ApsisKind||(e.ApsisKind={}));var Xa=function(a,b,c){this.time=a;this.kind=b;this.dist_au=c;this.dist_km=c*e.KM_PER_AU};e.Apsis=Xa;e.SearchLunarApsis=xc;e.NextLunarApsis=function(a){var b=xc(a.time.AddDays(11));if(1!==b.kind+a.kind)throw"NextLunarApsis INTERNAL ERROR: did not find alternating apogee/perigee: prev="+a.kind+" @ "+a.time.toString()+", next="+b.kind+" @ "+b.time.toString();return b};e.SearchPlanetApsis=zc;
e.NextPlanetApsis=function(a,b){if(b.kind!==Ja.Pericenter&&b.kind!==Ja.Apocenter)throw"Invalid apsis kind: "+b.kind;var c=b.time.AddDays(.25*aa[a].OrbitalPeriod);a=zc(a,c);if(1!==a.kind+b.kind)throw"Internal error: previous apsis was "+b.kind+", but found "+a.kind+" for next apsis.";return a};e.InverseRotation=Ka;e.CombineRotation=ja;e.IdentityMatrix=function(){return new J([[1,0,0],[0,1,0],[0,0,1]])};e.Pivot=function(a,b,c){if(0!==b&&1!==b&&2!==b)throw"Invalid axis "+b+". Must be [0, 1, 2].";var d=
w(c)*e.DEG2RAD;c=Math.cos(d);d=Math.sin(d);var f=(b+1)%3,g=(b+2)%3,h=[[0,0,0],[0,0,0],[0,0,0]];h[f][f]=c*a.rot[f][f]-d*a.rot[f][g];h[f][g]=d*a.rot[f][f]+c*a.rot[f][g];h[f][b]=a.rot[f][b];h[g][f]=c*a.rot[g][f]-d*a.rot[g][g];h[g][g]=d*a.rot[g][f]+c*a.rot[g][g];h[g][b]=a.rot[g][b];h[b][f]=c*a.rot[b][f]-d*a.rot[b][g];h[b][g]=d*a.rot[b][f]+c*a.rot[b][g];h[b][b]=a.rot[b][b];return new J(h)};e.VectorFromSphere=lb;e.EquatorFromVector=Mb;e.SphereFromVector=Nb;e.HorizonFromVector=function(a,b){a=Nb(a);a.lon=
Ac(a.lon);a.lat+=Oa(b,a.lat);return a};e.VectorFromHorizon=function(a,b,c){b=v(b);var d=Ac(a.lon);c=a.lat+Bc(c,a.lat);a=new Ba(c,d,a.dist);return lb(a,b)};e.Refraction=Oa;e.InverseRefraction=Bc;e.RotateVector=Ya;e.RotateState=Ea;e.Rotation_EQJ_ECL=Cc;e.Rotation_ECL_EQJ=function(){return new J([[1,0,0],[0,.9174821430670688,.3977769691083922],[0,-.3977769691083922,.9174821430670688]])};e.Rotation_EQJ_EQD=ob;e.Rotation_EQJ_ECT=function(a){var b=v(a);a=ob(b);b=Jc(b);return ja(a,b)};e.Rotation_ECT_EQJ=
function(a){var b=v(a);a=Ic(b);b=pb(b);return ja(a,b)};e.Rotation_EQD_EQJ=pb;e.Rotation_EQD_HOR=Ob;e.Rotation_HOR_EQD=Dc;e.Rotation_HOR_EQJ=Ec;e.Rotation_EQJ_HOR=function(a,b){a=Ec(a,b);return Ka(a)};e.Rotation_EQD_ECL=Fc;e.Rotation_ECL_EQD=Gc;e.Rotation_ECL_HOR=Hc;e.Rotation_HOR_ECL=function(a,b){a=Hc(a,b);return Ka(a)};e.Rotation_EQJ_GAL=function(){return new J([[-.0548624779711344,.4941095946388765,-.8676668813529025],[-.8734572784246782,-.4447938112296831,-.1980677870294097],[-.483800052994852,
.7470034631630423,.4559861124470794]])};e.Rotation_GAL_EQJ=function(){return new J([[-.0548624779711344,-.8734572784246782,-.483800052994852],[.4941095946388765,-.4447938112296831,.7470034631630423],[-.8676668813529025,-.1980677870294097,.4559861124470794]])};e.Rotation_ECT_EQD=Ic;e.Rotation_EQD_ECT=Jc;var Fd=[["And","Andromeda"],["Ant","Antila"],["Aps","Apus"],["Aql","Aquila"],["Aqr","Aquarius"],["Ara","Ara"],["Ari","Aries"],["Aur","Auriga"],["Boo","Bootes"],["Cae","Caelum"],["Cam","Camelopardis"],
["Cap","Capricornus"],["Car","Carina"],["Cas","Cassiopeia"],["Cen","Centaurus"],["Cep","Cepheus"],["Cet","Cetus"],["Cha","Chamaeleon"],["Cir","Circinus"],["CMa","Canis Major"],["CMi","Canis Minor"],["Cnc","Cancer"],["Col","Columba"],["Com","Coma Berenices"],["CrA","Corona Australis"],["CrB","Corona Borealis"],["Crt","Crater"],["Cru","Crux"],["Crv","Corvus"],["CVn","Canes Venatici"],["Cyg","Cygnus"],["Del","Delphinus"],["Dor","Dorado"],["Dra","Draco"],["Equ","Equuleus"],["Eri","Eridanus"],["For","Fornax"],
["Gem","Gemini"],["Gru","Grus"],["Her","Hercules"],["Hor","Horologium"],["Hya","Hydra"],["Hyi","Hydrus"],["Ind","Indus"],["Lac","Lacerta"],["Leo","Leo"],["Lep","Lepus"],["Lib","Libra"],["LMi","Leo Minor"],["Lup","Lupus"],["Lyn","Lynx"],["Lyr","Lyra"],["Men","Mensa"],["Mic","Microscopium"],["Mon","Monoceros"],["Mus","Musca"],["Nor","Norma"],["Oct","Octans"],["Oph","Ophiuchus"],["Ori","Orion"],["Pav","Pavo"],["Peg","Pegasus"],["Per","Perseus"],["Phe","Phoenix"],["Pic","Pictor"],["PsA","Pisces Austrinus"],
["Psc","Pisces"],["Pup","Puppis"],["Pyx","Pyxis"],["Ret","Reticulum"],["Scl","Sculptor"],["Sco","Scorpius"],["Sct","Scutum"],["Ser","Serpens"],["Sex","Sextans"],["Sge","Sagitta"],["Sgr","Sagittarius"],["Tau","Taurus"],["Tel","Telescopium"],["TrA","Triangulum Australe"],["Tri","Triangulum"],["Tuc","Tucana"],["UMa","Ursa Major"],["UMi","Ursa Minor"],["Vel","Vela"],["Vir","Virgo"],["Vol","Volans"],["Vul","Vulpecula"]],Gd=[[83,0,8640,2112],[83,2880,5220,2076],[83,7560,8280,2068],[83,6480,7560,2064],[15,
0,2880,2040],[10,3300,3840,1968],[15,0,1800,1920],[10,3840,5220,1920],[83,6300,6480,1920],[33,7260,7560,1920],[15,0,1263,1848],[10,4140,4890,1848],[83,5952,6300,1800],[15,7260,7440,1800],[10,2868,3300,1764],[33,3300,4080,1764],[83,4680,5952,1680],[13,1116,1230,1632],[33,7350,7440,1608],[33,4080,4320,1596],[15,0,120,1584],[83,5040,5640,1584],[15,8490,8640,1584],[33,4320,4860,1536],[33,4860,5190,1512],[15,8340,8490,1512],[10,2196,2520,1488],[33,7200,7350,1476],[15,7393.2,7416,1462],[10,2520,2868,1440],
[82,2868,3030,1440],[33,7116,7200,1428],[15,7200,7393.2,1428],[15,8232,8340,1418],[13,0,876,1404],[33,6990,7116,1392],[13,612,687,1380],[13,876,1116,1368],[10,1116,1140,1368],[15,8034,8232,1350],[10,1800,2196,1344],[82,5052,5190,1332],[33,5190,6990,1332],[10,1140,1200,1320],[15,7968,8034,1320],[15,7416,7908,1316],[13,0,612,1296],[50,2196,2340,1296],[82,4350,4860,1272],[33,5490,5670,1272],[15,7908,7968,1266],[10,1200,1800,1260],[13,8232,8400,1260],[33,5670,6120,1236],[62,735,906,1212],[33,6120,6564,
1212],[13,0,492,1200],[62,492,600,1200],[50,2340,2448,1200],[13,8400,8640,1200],[82,4860,5052,1164],[13,0,402,1152],[13,8490,8640,1152],[39,6543,6564,1140],[33,6564,6870,1140],[30,6870,6900,1140],[62,600,735,1128],[82,3030,3300,1128],[13,60,312,1104],[82,4320,4350,1080],[50,2448,2652,1068],[30,7887,7908,1056],[30,7875,7887,1050],[30,6900,6984,1044],[82,3300,3660,1008],[82,3660,3882,960],[8,5556,5670,960],[39,5670,5880,960],[50,3330,3450,954],[0,0,906,882],[62,906,924,882],[51,6969,6984,876],[62,1620,
1689,864],[30,7824,7875,864],[44,7875,7920,864],[7,2352,2652,852],[50,2652,2790,852],[0,0,720,840],[44,7920,8214,840],[44,8214,8232,828],[0,8232,8460,828],[62,924,978,816],[82,3882,3960,816],[29,4320,4440,816],[50,2790,3330,804],[48,3330,3558,804],[0,258,507,792],[8,5466,5556,792],[0,8460,8550,770],[29,4440,4770,768],[0,8550,8640,752],[29,5025,5052,738],[80,870,978,736],[62,978,1620,736],[7,1620,1710,720],[51,6543,6969,720],[82,3960,4320,696],[30,7080,7530,696],[7,1710,2118,684],[48,3558,3780,684],
[29,4770,5025,684],[0,0,24,672],[80,507,600,672],[7,2118,2352,672],[37,2838,2880,672],[30,7530,7824,672],[30,6933,7080,660],[80,690,870,654],[25,5820,5880,648],[8,5430,5466,624],[25,5466,5820,624],[51,6612,6792,624],[48,3870,3960,612],[51,6792,6933,612],[80,600,690,600],[66,258,306,570],[48,3780,3870,564],[87,7650,7710,564],[77,2052,2118,548],[0,24,51,528],[73,5730,5772,528],[37,2118,2238,516],[87,7140,7290,510],[87,6792,6930,506],[0,51,306,504],[87,7290,7404,492],[37,2811,2838,480],[87,7404,7650,
468],[87,6930,7140,460],[6,1182,1212,456],[75,6792,6840,444],[59,2052,2076,432],[37,2238,2271,420],[75,6840,7140,388],[77,1788,1920,384],[39,5730,5790,384],[75,7140,7290,378],[77,1662,1788,372],[77,1920,2016,372],[23,4620,4860,360],[39,6210,6570,344],[23,4272,4620,336],[37,2700,2811,324],[39,6030,6210,308],[61,0,51,300],[77,2016,2076,300],[37,2520,2700,300],[61,7602,7680,300],[37,2271,2496,288],[39,6570,6792,288],[31,7515,7578,284],[61,7578,7602,284],[45,4146,4272,264],[59,2247,2271,240],[37,2496,
2520,240],[21,2811,2853,240],[61,8580,8640,240],[6,600,1182,238],[31,7251,7308,204],[8,4860,5430,192],[61,8190,8580,180],[21,2853,3330,168],[45,3330,3870,168],[58,6570,6718.4,150],[3,6718.4,6792,150],[31,7500,7515,144],[20,2520,2526,132],[73,6570,6633,108],[39,5790,6030,96],[58,6570,6633,72],[61,7728,7800,66],[66,0,720,48],[73,6690,6792,48],[31,7308,7500,48],[34,7500,7680,48],[61,7680,7728,48],[61,7920,8190,48],[61,7800,7920,42],[20,2526,2592,36],[77,1290,1662,0],[59,1662,1680,0],[20,2592,2910,0],
[85,5280,5430,0],[58,6420,6570,0],[16,954,1182,-42],[77,1182,1290,-42],[73,5430,5856,-78],[59,1680,1830,-96],[59,2100,2247,-96],[73,6420,6468,-96],[73,6570,6690,-96],[3,6690,6792,-96],[66,8190,8580,-96],[45,3870,4146,-144],[85,4146,4260,-144],[66,0,120,-168],[66,8580,8640,-168],[85,5130,5280,-192],[58,5730,5856,-192],[3,7200,7392,-216],[4,7680,7872,-216],[58,6180,6468,-240],[54,2100,2910,-264],[35,1770,1830,-264],[59,1830,2100,-264],[41,2910,3012,-264],[74,3450,3870,-264],[85,4260,4620,-264],[58,
6330,6360,-280],[3,6792,7200,-288.8],[35,1740,1770,-348],[4,7392,7680,-360],[73,6180,6570,-384],[72,6570,6792,-384],[41,3012,3090,-408],[58,5856,5895,-438],[41,3090,3270,-456],[26,3870,3900,-456],[71,5856,5895,-462],[47,5640,5730,-480],[28,4530,4620,-528],[85,4620,5130,-528],[41,3270,3510,-576],[16,600,954,-585.2],[35,954,1350,-585.2],[26,3900,4260,-588],[28,4260,4530,-588],[47,5130,5370,-588],[58,5856,6030,-590],[16,0,600,-612],[11,7680,7872,-612],[4,7872,8580,-612],[16,8580,8640,-612],[41,3510,
3690,-636],[35,1692,1740,-654],[46,1740,2202,-654],[11,7200,7680,-672],[41,3690,3810,-700],[41,4530,5370,-708],[47,5370,5640,-708],[71,5640,5760,-708],[35,1650,1692,-720],[58,6030,6336,-720],[76,6336,6420,-720],[41,3810,3900,-748],[19,2202,2652,-792],[41,4410,4530,-792],[41,3900,4410,-840],[36,1260,1350,-864],[68,3012,3372,-882],[35,1536,1650,-888],[76,6420,6900,-888],[65,7680,8280,-888],[70,8280,8400,-888],[36,1080,1260,-950],[1,3372,3960,-954],[70,0,600,-960],[36,600,1080,-960],[35,1392,1536,-960],
[70,8400,8640,-960],[14,5100,5370,-1008],[49,5640,5760,-1008],[71,5760,5911.5,-1008],[9,1740,1800,-1032],[22,1800,2370,-1032],[67,2880,3012,-1032],[35,1230,1392,-1056],[71,5911.5,6420,-1092],[24,6420,6900,-1092],[76,6900,7320,-1092],[53,7320,7680,-1092],[35,1080,1230,-1104],[9,1620,1740,-1116],[49,5520,5640,-1152],[63,0,840,-1156],[35,960,1080,-1176],[40,1470,1536,-1176],[9,1536,1620,-1176],[38,7680,7920,-1200],[67,2160,2880,-1218],[84,2880,2940,-1218],[35,870,960,-1224],[40,1380,1470,-1224],[63,
0,660,-1236],[12,2160,2220,-1260],[84,2940,3042,-1272],[40,1260,1380,-1276],[32,1380,1440,-1276],[63,0,570,-1284],[35,780,870,-1296],[64,1620,1800,-1296],[49,5418,5520,-1296],[84,3042,3180,-1308],[12,2220,2340,-1320],[14,4260,4620,-1320],[49,5100,5418,-1320],[56,5418,5520,-1320],[32,1440,1560,-1356],[84,3180,3960,-1356],[14,3960,4050,-1356],[5,6300,6480,-1368],[78,6480,7320,-1368],[38,7920,8400,-1368],[40,1152,1260,-1380],[64,1800,1980,-1380],[12,2340,2460,-1392],[63,0,480,-1404],[35,480,780,-1404],
[63,8400,8640,-1404],[32,1560,1650,-1416],[56,5520,5911.5,-1440],[43,7320,7680,-1440],[64,1980,2160,-1464],[18,5460,5520,-1464],[5,5911.5,5970,-1464],[18,5370,5460,-1526],[5,5970,6030,-1526],[64,2160,2460,-1536],[12,2460,3252,-1536],[14,4050,4260,-1536],[27,4260,4620,-1536],[14,4620,5232,-1536],[18,4860,4920,-1560],[5,6030,6060,-1560],[40,780,1152,-1620],[69,1152,1650,-1620],[18,5310,5370,-1620],[5,6060,6300,-1620],[60,6300,6480,-1620],[81,7920,8400,-1620],[32,1650,2370,-1680],[18,4920,5310,-1680],
[79,5310,6120,-1680],[81,0,480,-1800],[42,1260,1650,-1800],[86,2370,3252,-1800],[12,3252,4050,-1800],[55,4050,4920,-1800],[60,6480,7680,-1800],[43,7680,8400,-1800],[81,8400,8640,-1800],[81,270,480,-1824],[42,0,1260,-1980],[17,2760,4920,-1980],[2,4920,6480,-1980],[52,1260,2760,-2040],[57,0,8640,-2160]],Tb,id,jd=function(a,b,c,d){this.symbol=a;this.name=b;this.ra1875=c;this.dec1875=d};e.ConstellationInfo=jd;e.Constellation=function(a,b){w(a);w(b);if(-90>b||90<b)throw"Invalid declination angle. Must be -90..+90.";
a%=24;0>a&&(a+=24);Tb||(Tb=ob(new O(-45655.74141261017)),id=new O(0));a=new Ba(b,15*a,1);a=lb(a,id);a=Ya(Tb,a);a=Mb(a);b=10/240;for(var c=b/15,d=$jscomp.makeIterator(Gd),f=d.next();!f.done;f=d.next()){f=f.value;var g=f[1]*c,h=f[2]*c;if(f[3]*b<=a.dec&&g<=a.ra&&a.ra<h)return b=Fd[f[0]],new jd(b[0],b[1],a.ra,a.dec)}throw"Unable to find constellation for given coordinates.";};var S;(function(a){a.Penumbral="penumbral";a.Partial="partial";a.Annular="annular";a.Total="total"})(S=e.EclipseKind||(e.EclipseKind=
{}));var Pc=function(a,b,c,d,f,g){this.kind=a;this.obscuration=b;this.peak=c;this.sd_penum=d;this.sd_partial=f;this.sd_total=g};e.LunarEclipseInfo=Pc;var xd=function(a,b,c,d,f,g,h){this.time=a;this.u=b;this.r=c;this.k=d;this.p=f;this.target=g;this.dir=h};e.SearchLunarEclipse=Oc;var Rc=function(a,b,c,d,f,g){this.kind=a;this.obscuration=b;this.peak=c;this.distance=d;this.latitude=f;this.longitude=g};e.GlobalSolarEclipseInfo=Rc;e.NextLunarEclipse=function(a){a=v(a);a=a.AddDays(10);return Oc(a)};e.SearchGlobalSolarEclipse=
Qc;e.NextGlobalSolarEclipse=function(a){a=v(a);a=a.AddDays(10);return Qc(a)};var Vc=function(a,b){this.time=a;this.altitude=b};e.EclipseEvent=Vc;var Xc=function(a,b,c,d,f,g,h){this.kind=a;this.obscuration=b;this.partial_begin=c;this.total_begin=d;this.peak=f;this.total_end=g;this.partial_end=h};e.LocalSolarEclipseInfo=Xc;e.SearchLocalSolarEclipse=Wc;e.NextLocalSolarEclipse=function(a,b){a=v(a);a=a.AddDays(10);return Wc(a,b)};var $c=function(a,b,c,d){this.start=a;this.peak=b;this.finish=c;this.separation=
d};e.TransitInfo=$c;e.SearchTransit=Zc;e.NextTransit=function(a,b){b=v(b);b=b.AddDays(100);return Zc(a,b)};var ra;(function(a){a[a.Invalid=0]="Invalid";a[a.Ascending=1]="Ascending";a[a.Descending=-1]="Descending"})(ra=e.NodeEventKind||(e.NodeEventKind={}));var bd=function(a,b){this.kind=a;this.time=b};e.NodeEventInfo=bd;e.SearchMoonNode=ad;e.NextMoonNode=function(a){var b=a.time.AddDays(10);b=ad(b);switch(a.kind){case ra.Ascending:if(b.kind!==ra.Descending)throw"Internal error: previous node was ascending, but this node was: "+
b.kind;break;case ra.Descending:if(b.kind!==ra.Ascending)throw"Internal error: previous node was descending, but this node was: "+b.kind;break;default:throw"Previous node has an invalid node kind: "+a.kind;}return b};var Ub=function(a,b,c,d){this.ra=a;this.dec=b;this.spin=c;this.north=d};e.AxisInfo=Ub;e.RotationAxis=function(a,b){b=v(b);var c=b.tt,d=c/36525;switch(a){case m.Sun:a=286.13;var f=63.87;c=84.176+14.1844*c;break;case m.Mercury:a=281.0103-.0328*d;f=61.4155-.0049*d;c=329.5988+6.1385108*c+
.01067257*Math.sin(e.DEG2RAD*(174.7910857+4.092335*c))-.00112309*Math.sin(e.DEG2RAD*(349.5821714+8.18467*c))-1.104E-4*Math.sin(e.DEG2RAD*(164.3732571+12.277005*c))-2.539E-5*Math.sin(e.DEG2RAD*(339.1643429+16.36934*c))-5.71E-6*Math.sin(e.DEG2RAD*(153.9554286+20.461675*c));break;case m.Venus:a=272.76;f=67.16;c=160.2-1.4813688*c;break;case m.Earth:return a=xa([0,0,1],b,F.Into2000),a=wa(a,b,F.Into2000),a=new E(a[0],a[1],a[2],b),c=Mb(a),new Ub(c.ra,c.dec,190.41375788700253+360.9856122880876*b.ut,a);case m.Moon:var g=
e.DEG2RAD*(125.045-.0529921*c),h=e.DEG2RAD*(250.089-.1059842*c),l=e.DEG2RAD*(260.008+13.0120009*c),k=e.DEG2RAD*(176.625+13.3407154*c),n=e.DEG2RAD*(357.529+.9856003*c),p=e.DEG2RAD*(311.589+26.4057084*c),q=e.DEG2RAD*(134.963+13.064993*c),t=e.DEG2RAD*(276.617+.3287146*c),y=e.DEG2RAD*(34.226+1.7484877*c),x=e.DEG2RAD*(15.134-.1589763*c),z=e.DEG2RAD*(119.743+.0036096*c),ab=e.DEG2RAD*(239.961+.1643573*c),va=e.DEG2RAD*(25.053+12.9590088*c);a=269.9949+.0031*d-3.8787*Math.sin(g)-.1204*Math.sin(h)+.07*Math.sin(l)-
.0172*Math.sin(k)+.0072*Math.sin(p)-.0052*Math.sin(x)+.0043*Math.sin(va);f=66.5392+.013*d+1.5419*Math.cos(g)+.0239*Math.cos(h)-.0278*Math.cos(l)+.0068*Math.cos(k)-.0029*Math.cos(p)+9E-4*Math.cos(q)+8E-4*Math.cos(x)-9E-4*Math.cos(va);c=38.3213+(13.17635815-1.4E-12*c)*c+3.561*Math.sin(g)+.1208*Math.sin(h)-.0642*Math.sin(l)+.0158*Math.sin(k)+.0252*Math.sin(n)-.0066*Math.sin(p)-.0047*Math.sin(q)-.0046*Math.sin(t)+.0028*Math.sin(y)+.0052*Math.sin(x)+.004*Math.sin(z)+.0019*Math.sin(ab)-.0044*Math.sin(va);
break;case m.Mars:a=317.269202-.10927547*d+6.8E-5*Math.sin(e.DEG2RAD*(198.991226+19139.4819985*d))+2.38E-4*Math.sin(e.DEG2RAD*(226.292679+38280.8511281*d))+5.2E-5*Math.sin(e.DEG2RAD*(249.663391+57420.7251593*d))+9E-6*Math.sin(e.DEG2RAD*(266.18351+76560.636795*d))+.419057*Math.sin(e.DEG2RAD*(79.398797+.5042615*d));f=54.432516-.05827105*d+5.1E-5*Math.cos(e.DEG2RAD*(122.433576+19139.9407476*d))+1.41E-4*Math.cos(e.DEG2RAD*(43.058401+38280.8753272*d))+3.1E-5*Math.cos(e.DEG2RAD*(57.663379+57420.7517205*
d))+5E-6*Math.cos(e.DEG2RAD*(79.476401+76560.6495004*d))+1.591274*Math.cos(e.DEG2RAD*(166.325722+.5042615*d));c=176.049863+350.891982443297*c+1.45E-4*Math.sin(e.DEG2RAD*(129.071773+19140.0328244*d))+1.57E-4*Math.sin(e.DEG2RAD*(36.352167+38281.0473591*d))+4E-5*Math.sin(e.DEG2RAD*(56.668646+57420.929536*d))+1E-6*Math.sin(e.DEG2RAD*(67.364003+76560.2552215*d))+1E-6*Math.sin(e.DEG2RAD*(104.79268+95700.4387578*d))+.584542*Math.sin(e.DEG2RAD*(95.391654+.5042615*d));break;case m.Jupiter:f=e.DEG2RAD*(99.360714+
4850.4046*d);g=e.DEG2RAD*(175.895369+1191.9605*d);h=e.DEG2RAD*(300.323162+262.5475*d);l=e.DEG2RAD*(114.012305+6070.2476*d);k=e.DEG2RAD*(49.511251+64.3*d);a=268.056595-.006499*d+1.17E-4*Math.sin(f)+9.38E-4*Math.sin(g)+.001432*Math.sin(h)+3E-5*Math.sin(l)+.00215*Math.sin(k);f=64.495303+.002413*d+5E-5*Math.cos(f)+4.04E-4*Math.cos(g)+6.17E-4*Math.cos(h)-1.3E-5*Math.cos(l)+9.26E-4*Math.cos(k);c=284.95+870.536*c;break;case m.Saturn:a=40.589-.036*d;f=83.537-.004*d;c=38.9+810.7939024*c;break;case m.Uranus:a=
257.311;f=-15.175;c=203.81-501.1600928*c;break;case m.Neptune:d=e.DEG2RAD*(357.85+52.316*d);a=299.36+.7*Math.sin(d);f=43.46-.51*Math.cos(d);c=249.978+541.1397757*c-.48*Math.sin(d);break;case m.Pluto:a=132.993;f=-6.163;c=302.695+56.3625225*c;break;default:throw"Invalid body: "+a;}d=f*e.DEG2RAD;g=a*e.DEG2RAD;h=Math.cos(d);b=new E(h*Math.cos(g),h*Math.sin(g),Math.sin(d),b);return new Ub(a/15,f,c,b)};e.LagrangePoint=function(a,b,c,d){var f=v(b);b=C(c);var g=C(d);c===m.Earth&&d===m.Moon?(c=new I(0,0,0,
0,0,0,f),d=Ra(f)):(c=mb(c,f),d=mb(d,f));return cd(a,c,b,d,g)};e.LagrangePointFast=cd;var H=function(a,b,c){b=v(b);this.originBody=a;for(var d=$jscomp.makeIterator(c),f=d.next();!f.done;f=d.next())if(f.value.t.tt!==b.tt)throw"Inconsistent times in bodyStates";d=[];f=H.CalcSolarSystem(b);this.curr=new kd(b,f,d);a=this.InternalBodyState(a);c=$jscomp.makeIterator(c);for(f=c.next();!f.done;f=c.next()){var g=f.value;f=new B(g.x+a.r.x,g.y+a.r.y,g.z+a.r.z);g=new B(g.vx+a.v.x,g.vy+a.v.y,g.vz+a.v.z);var h=
B.zero();d.push(new Ua(b.tt,f,g,h))}this.CalcBodyAccelerations();this.prev=this.Duplicate()};H.prototype.Update=function(a){a=v(a);var b=a.tt-this.curr.time.tt;if(0===b)this.prev=this.Duplicate();else{this.Swap();this.curr.time=a;this.curr.gravitators=H.CalcSolarSystem(a);for(var c=0;c<this.curr.bodies.length;++c){var d=this.prev.bodies[c];this.curr.bodies[c].r=Ca(b,d.r,d.v,d.a)}this.CalcBodyAccelerations();for(c=0;c<this.curr.bodies.length;++c){d=this.prev.bodies[c];var f=this.curr.bodies[c],g=d.a.mean(f.a);
f.tt=a.tt;f.r=Ca(b,d.r,d.v,g);f.v=Eb(b,d.v,g)}this.CalcBodyAccelerations()}b=[];c=this.InternalBodyState(this.originBody);d=$jscomp.makeIterator(this.curr.bodies);for(f=d.next();!f.done;f=d.next())f=f.value,b.push(new I(f.r.x-c.r.x,f.r.y-c.r.y,f.r.z-c.r.z,f.v.x-c.v.x,f.v.y-c.v.y,f.v.z-c.v.z,a));return b};H.prototype.Swap=function(){var a=this.curr;this.curr=this.prev;this.prev=a};H.prototype.SolarSystemBodyState=function(a){a=this.InternalBodyState(a);var b=this.InternalBodyState(this.originBody);
return pa(a.sub(b),this.curr.time)};H.prototype.InternalBodyState=function(a){if(a===m.SSB)return new X(this.curr.time.tt,B.zero(),B.zero());var b=this.curr.gravitators[a];if(b)return b;throw"Invalid body: "+a;};H.CalcSolarSystem=function(a){var b={},c=new X(a.tt,B.zero(),B.zero());b[m.Mercury]=R(c,a.tt,m.Mercury,4.912547451450812E-11);b[m.Venus]=R(c,a.tt,m.Venus,7.243452486162703E-10);b[m.Earth]=R(c,a.tt,m.Earth,8.997011346712498E-10);b[m.Mars]=R(c,a.tt,m.Mars,9.549535105779258E-11);b[m.Jupiter]=
R(c,a.tt,m.Jupiter,2.825345909524226E-7);b[m.Saturn]=R(c,a.tt,m.Saturn,8.459715185680659E-8);b[m.Uranus]=R(c,a.tt,m.Uranus,1.292024916781969E-8);b[m.Neptune]=R(c,a.tt,m.Neptune,1.524358900784276E-8);for(var d in b)b[d].r.decr(c.r),b[d].v.decr(c.v);b[m.Sun]=new X(a.tt,c.r.neg(),c.v.neg());return b};H.prototype.CalcBodyAccelerations=function(){for(var a=$jscomp.makeIterator(this.curr.bodies),b=a.next();!b.done;b=a.next())b=b.value,b.a=B.zero(),H.AddAcceleration(b.a,b.r,this.curr.gravitators[m.Sun].r,
2.959122082855911E-4),H.AddAcceleration(b.a,b.r,this.curr.gravitators[m.Mercury].r,4.912547451450812E-11),H.AddAcceleration(b.a,b.r,this.curr.gravitators[m.Venus].r,7.243452486162703E-10),H.AddAcceleration(b.a,b.r,this.curr.gravitators[m.Earth].r,8.997011346712498E-10),H.AddAcceleration(b.a,b.r,this.curr.gravitators[m.Mars].r,9.549535105779258E-11),H.AddAcceleration(b.a,b.r,this.curr.gravitators[m.Jupiter].r,2.825345909524226E-7),H.AddAcceleration(b.a,b.r,this.curr.gravitators[m.Saturn].r,8.459715185680659E-8),
H.AddAcceleration(b.a,b.r,this.curr.gravitators[m.Uranus].r,1.292024916781969E-8),H.AddAcceleration(b.a,b.r,this.curr.gravitators[m.Neptune].r,1.524358900784276E-8)};H.AddAcceleration=function(a,b,c,d){var f=c.x-b.x,g=c.y-b.y;b=c.z-b.z;c=f*f+g*g+b*b;d/=c*Math.sqrt(c);a.x+=f*d;a.y+=g*d;a.z+=b*d};H.prototype.Duplicate=function(){var a={};for(b in this.curr.gravitators)a[b]=this.curr.gravitators[b].clone();var b=[];for(var c=$jscomp.makeIterator(this.curr.bodies),d=c.next();!d.done;d=c.next())b.push(d.value.clone());
return new kd(this.curr.time,a,b)};$jscomp.global.Object.defineProperties(H.prototype,{OriginBody:{configurable:!0,enumerable:!0,get:function(){return this.originBody}},Time:{configurable:!0,enumerable:!0,get:function(){return this.curr.time}}});e.GravitySimulator=H;var kd=function(a,b,c){this.time=a;this.gravitators=b;this.bodies=c}},{}]},{},[1])(1)});

;
/* name_engine.js */
/* AQEQ ASTRO · Core Name Numbers Engine v1.0.0
 * CommonJS + browser global. Calculation only; no interpretation texts.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.AqeqNameEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const MASTER_NUMBERS = new Set([11, 22, 33]);
  const MASTER_ROOTS = Object.freeze({ 11: 2, 22: 4, 33: 6 });
  const ARABIC_VALUES = Object.freeze({
    'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,
    'ي':1,'ك':2,'ل':3,'م':4,'ن':5,'س':6,'ع':7,'ف':8,'ص':9,
    'ق':1,'ر':2,'ش':3,'ت':4,'ث':5,'خ':6,'ذ':7,'ض':8,'ظ':9,'غ':1
  });
  const LATIN_VALUES = Object.freeze({
    A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
    J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
    S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
  });
  const ARABIC_VOWELS = new Set(['ا','و','ي']);
  const LATIN_VOWELS = new Set(['A','E','I','O','U']);
  // Declared normalization choices: ة→ه; standalone ء is ignored.
  const ARABIC_NORMALIZATION = Object.freeze({
    'أ':'ا','إ':'ا','آ':'ا','ٱ':'ا','ى':'ي','ئ':'ي','ؤ':'و','ة':'ه'
  });

  function stripArabicDiacritics(value) {
    return value.normalize('NFC').replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
  }
  function normalizeName(name, language) {
    if (typeof name !== 'string') throw new TypeError('name must be a string');
    const requested = language || 'auto';
    if (!['auto','arabic','latin'].includes(requested)) throw new RangeError('language must be "auto", "arabic", or "latin"');
    const cleaned = stripArabicDiacritics(name).trim();
    const hasArabic = /[\u0600-\u06FF]/.test(cleaned);
    const hasLatin = /[A-Za-z]/.test(cleaned);
    let resolved = requested;
    if (requested === 'auto') {
      if (hasArabic && hasLatin) throw new Error('يرجى كتابة الاسم إما باللغة العربية بالكامل أو بالإنجليزية بالكامل للحساب الدقيق.');
      if (hasArabic) resolved = 'arabic';
      else if (hasLatin) resolved = 'latin';
      else throw new Error(cleaned ? 'الاسم يجب أن يحتوي على حروف أبجدية صحيحة بدون أرقام أو رموز.' : 'من فضلك اكتب اسمك أولاً لاكتشاف بصمة طاقتك.');
    }
    const normalizedName = [...cleaned].map(ch => resolved === 'arabic' ? (ARABIC_NORMALIZATION[ch] || ch) : ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()).join('');
    return { originalName: name, normalizedName, language: resolved };
  }
  function digitSum(value) {
    return String(Math.abs(value)).split('').reduce((sum, digit) => sum + Number(digit), 0);
  }
  function reduceNumber(value) {
    if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) throw new TypeError('value must be a non-negative integer');
    let current = value;
    while (current > 9 && !MASTER_NUMBERS.has(current)) current = digitSum(current);
    const isMaster = MASTER_NUMBERS.has(current);
    return { value: current, root: isMaster ? MASTER_ROOTS[current] : current, isMaster };
  }
  function getLetterProfile(normalizedName, language) {
    const values = language === 'arabic' ? ARABIC_VALUES : LATIN_VALUES;
    const vowels = language === 'arabic' ? ARABIC_VOWELS : LATIN_VOWELS;
    const letters = [];
    for (const ch of [...normalizedName]) {
      if (Object.prototype.hasOwnProperty.call(values, ch)) letters.push({ letter: ch, value: values[ch], isVowel: vowels.has(ch) });
    }
    return letters;
  }
  function reduceToSingleDigit(value) {
    let current = Math.abs(Number(value) || 0);
    while (current > 9) current = digitSum(current);
    return current;
  }
  function summarizeGroup(letters, singleDigitOnly) {
    if (!letters.length) return { rawTotal: null, value: null, root: null, isMaster: false, letterCount: 0, status: 'no_matching_letters' };
    const rawTotal = letters.reduce((sum, item) => sum + item.value, 0);
    if (singleDigitOnly) {
      const value = reduceToSingleDigit(rawTotal);
      return { rawTotal, value, root: value, isMaster: false, letterCount: letters.length, status: 'ok' };
    }
    return { rawTotal, ...reduceNumber(rawTotal), letterCount: letters.length, status: 'ok' };
  }
  function calculateNameNumbers(name, options) {
    const opts = options || {};
    const normalized = normalizeName(name, opts.language || 'auto');
    const profile = getLetterProfile(normalized.normalizedName, normalized.language);
    const vowels = profile.filter(item => item.isVowel);
    const consonants = profile.filter(item => !item.isVowel);
    // Arabic spellings often omit short vowels. If no vowel letters are written,
    // use the whole name as a documented fallback for Soul Urge so the result
    // remains a valid single digit instead of becoming unavailable.
    const soulLetters = vowels.length ? vowels : profile;
    const soulUrge = summarizeGroup(soulLetters, false);
    if (!vowels.length && profile.length) soulUrge.status = 'fallback_to_full_name_no_written_vowels';
    return {
      engine: 'AQEQ ASTRO · Core Name Numbers', version: '1.1.0',
      language: normalized.language, originalName: normalized.originalName, normalizedName: normalized.normalizedName,
      soulUrge, expression: summarizeGroup(profile), personality: summarizeGroup(consonants),
      diagnostics: {
        supportedLetterCount: profile.length,
        ignoredCharacterCount: [...normalized.normalizedName].length - profile.length,
        masterNumbers: [11,22,33], latinYPolicy: 'consonant',
        arabicNormalizationPolicy: 'أ/إ/آ/ٱ→ا; ى/ئ→ي; ؤ→و; ة→ه; ء ignored'
      }
    };
  }
  return Object.freeze({ version:'1.1.0', MASTER_NUMBERS:Object.freeze([11,22,33]), ARABIC_VALUES, LATIN_VALUES, normalizeName, reduceNumber, calculateNameNumbers });
});

;
/* pinnacles_challenges.js */
/* AQEQ ASTRO · Pinnacles, Challenges & Karmic Debts v3.0.0
 * Symbolic numerology calculations. CommonJS + browser global.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AqeqPinnaclesChallenges = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MASTER_NUMBERS = new Set([11, 22, 33]);
  const MASTER_ROOTS = Object.freeze({ 11: 2, 22: 4, 33: 6 });
  const PINNACLE_READINGS = Object.freeze(  {
    "1": {
      "title": "طاقة الانفجار الذاتي، الاستقلال التام، وبناء الهوية",
      "essence": "\"الوقوف على الأقدام، كسر التبعية، اكتشاف الصوت الخاص، وصناعة البدايات من الصفر.\"",
      "energy": "دي مرحلة بيتحط فيها الشخص في وش المدفع مباشرة. الكون بيسحب منك بالتدريج كل \"العكازات\" اللي كنت بتتسند عليها—سواء كانت وظيفة آمنة، أو علاقة كنت معتمد عليها كلياً، أو دعم مادي من العيلة—عشان يجبرك تكتشف عضلاتك وإرادتك الحقيقية. الفرص هنا مش بتيجي جاهزة على طبق من فضة؛ الفرص بتيجي في صورة تحديات وأبواب مقفولة إنت اللي مطالب تكسرها وتفتحها بنفسك. ده وقت ممتاز لإطلاق مشروعك الخاص، أو الاستقلال المالي والمكاني، أو تغيير مسارك المهني بالكامل لتأسيس اسمك بصفتك \"رائد\" ومبادر، مش مجرد تابع أو ترس في آلة حد تاني.",
      "psyche": "شعور طاغي بالرغبة في التمرد والحرية، وكأن روحك بتنفض تراب السنين. هتحس أحياناً بوحدة شديدة، كأنك ماشي في طريق صحراوي لوحدك ومحدش من اللي حواليك حاسس بتعبك أو فاهم رؤيتك. الخوف الأكبر اللي هيطاردك في المرحلة دي هو: \"هل هقدر أشيل الشيلة دي لوحدي؟ هل قراراتي دي صح؟\". الإجابة هي إنك مش بس هتقدر، ده إنت مع الوقت هتكتشف إن زحمة الناس وتدخلاتهم زمان كانت هي اللي معطلة سرعتك الحقيقية. العزلة هنا مش عقاب، دي \"حضّانة\" بتتشكل فيها هويتك الجديدة.",
      "invest": "خد المبادرة وماتستناش إذن، ولا مصادقة، ولا تشجيع من حد. اتعلم تقول \"أنا هعمل ده\" ونفذ في صمت تام. ركز مجهودك على بناء هويتك وعلامتك الشخصية، واستثمر في مهاراتك القيادية وحل المشكلات. لو القمة دي جاتلك في أول حياتك، فهي بتصنع منك شخص عصامي صلب بيبني مجده بإيده. ولو جاتلك في منتصف العمر، فهي إعلان لولادة ثانية ونسف لكل التنازلات القديمة.",
      "shadow": "احذر من فخين بيدمروا طاقة الرقم 1: الأول هو \"العند الأعمى\" وصدام الأنا اللي بيكسرك مع الناس من غير داعي. التاني هو \"متلازمة الذئب الوحيد\"؛ العزلة اللي بتخليك تشوف طلب المساعدة أو التفويض كأنه ضعف أو إهانة لكبريائك. القيادة مش معناها إنك تمشي تدوس على الناس أو تشيل كل الحمل لوحدك، القيادة الحقيقية إنك تقود حياتك إنت أولاً وتعرف إمتى تستعين باللي يكملك.",
      "reflection": "إيه القرار اللي مأجله مستني حد يوافقك عليه، وجه الوقت إنك تاخده لوحدك؟"
    },
    "2": {
      "title": "طاقة الجسور، الشراكات، والعمق العاطفي",
      "essence": "\"التشبيك، الدبلوماسية، ضبط الإيقاع، اختبار الصبر، وقوة القوة الناعمة.\"",
      "energy": "عكس القمة (1) تماماً؛ هنا الكون بيفرمل اندفاعك وبيقولك: \"مش هتعرف تنجح لوحدك مهما حاولت، لازم تتعلم فن المشاركة والتناغم\". دي فترة بتفتح أبواب الشراكات المصيرية، سواء عقود عمل مشتركة، أو تعاون مهني، أو زواج وارتباط طويل الأمد. النجاح فيها مش بييجي بالصوت العالي ولا بالدراع والمنافسة الشرسة، النجاح بيتحقق بالهدوء، السعي وراء الكواليس، وبناء شبكة علاقات إنسانية متينة تسندك لسنين قدام. دي مرحلة \"جمع المحصول\" من خلال الناس اللي بتثق فيك.",
      "psyche": "حساسيتك الطاقية والعاطفية بتوصل لأعلى مستوياتها التاريخية. هتبقى عامل زي \"الرادار\" اللي بيلقط مشاعر ونوايا اللي حواليك من نبرة صوتهم أو حتى من صمتهم قبل ما ينطقوا كلمة. الجانب المرهق جداً هنا هو إنك ممكن تلاقي نفسك \"إسفنجة\" بتمتص طاقات الناس وزعلهم ومشاكلهم، وتحس بضغط نفسي وتقل مش بتاعك أصلاً. بيظهر بقوة خوف دفين من الرفض أو الخصام، وبيخليك تفكر ألف مرة قبل ما تقول كلمة تزعل حد.",
      "invest": "استخدم موهبتك المكتسبة في التفاوض، الإرشاد النفسي، وحل النزاعات. اشتغل بروح الفريق وكون إنت \"رمانة الميزان\" اللي بتهدي اللعب وتصلح اللي باظ. في العلاقات، ده الوقت الذهبي لترسيم الحدود وبناء تفاهم حقيقي قائم على الأخذ والعطاء المتوازن، مش التضحية العمياء. نجاحك المادي والمهني هنا هييجي من قدرتك على إنك تكون الشخص اللي كل الناس بترتاح تشتغل معاه وتأتمنه على أسرارها.",
      "shadow": "إياك والذوبان في الآخرين! أكبر خطر وابتلاء في طاقة الـ 2 إنك تلغي شخصيتك ورغباتك عشان ترضي شريك أو صديق أو مدير. خطر الكتمان هنا مميت؛ إنك تبلع زعلك وتسكت عشان \"تمشي المراكب\" لحد ما الغضب يتراكم وينفجر إما في صورة مرض جسدي، أو قطيعة مفاجئة وصدمة للي حواليك. اتعلم تقول \"لأ أنا مش مرتاح لده\" بأدب، ومن غير ما تحس بأي ذنب.",
      "reflection": "مين في حياتك بتديله أكتر ما بتاخد منه، ومحتاج تعيد ضبط ميزان العلاقة معاه؟"
    },
    "3": {
      "title": "طاقة الظهور، الكلمة، وتفجير الإبداع",
      "essence": "\"الخروج للنور، التعبير الصادق، الجاذبية الاجتماعية، والاحتفال بالطفل الداخلي.\"",
      "energy": "دي مرحلة الفرح، الحركة، والضوء. كأن الستارة بتترفع فجأة والكون بيدفعك تطلع على المسرح. الأبواب بتتفتح على مصراعيها في كل مجالات التعبير: صناعة المحتوى، الإعلام، الكتابة، التدريس، الفن، والتجارة اللي بتعتمد على الإقناع والكاريزما. الناس بتبدأ تسمعلك وتنجذب لكلامك وطاقتك بشكل غريب،ودي من أسهل وأسرع القمم اللي ممكن تجيبلك شهرة، انتشار، ومكاسب مادية لو وظفت سحرك الشخصي ومهاراتك في التواصل صح.",
      "psyche": "انتعاشة روحية ورغبة عارمة في الاستمتاع بالحياة وتجربة كل جديد بعد فترات ضغط وكتمان. دماغك هتبقى شغالة زي الفشار: أفكار ملهمة طول الوقت وشغف عالي جداً. لكن الجانب الخفي هنا هو تقلب المزاج السريع، القلق المستمر من \"كلام الناس\" وتقييمهم ليك، وأحياناً اللجوء للهروب من المشاعر الصعبة العميقة ورا قناع من الضحك، الهزار المستمر، والسطحية عشان متبانش ضعيف أو موجوع.",
      "invest": "اطلع للناس، اتكلم، شارك أفكارك، واكتب؛ صوتك دلوقتي له صدى مسموع ومؤثر. متحبسش موهبتك في الدرج مستني اللحظة المثالية. استغل طلتك وحضورك في توسيع دائرة معارفك، وحوّل كلامك وإبداعك لمنتج حقيقي بيخدم الناس وبيجيب عائد. دي فترة ممتازة لتعلم مهارات جديدة، لغات، أو أي أداة بتخليك تعبر عن نفسك أحسن.",
      "shadow": "التشتت، التشتت، التشتت! وضياع المجهود على الفاضي. الخطر الأكبر لطاقة الـ 3 هو إنك تبدأ عشر مشاريع بحماس جبار وماتكملش منهم ولا واحد للآخر. أو إنك تضيع طاقتك الذهنية في ثرثرة، دراما، نميمة، وعلاقات اجتماعية عابرة تستنزف وقتك من غير أي إنتاج حقيقي. احذر كمان من المبالغة في تقدير قدراتك وإعطاء وعود كبيرة مش هتقدر توفي بيها وقت ما الحماس يهدى.",
      "reflection": "إيه الموهبة اللي بتعملها ببلاش ومستمتع بيها، وجه الوقت تحولها لشيء ملموس يضيف لقيمتك؟"
    },
    "4": {
      "title": "طاقة البناء، التأسيس، والعمل الشاق",
      "essence": "\"إرساء القواعد، البناء الطويل الأمد، الجهد المنظم، وتأسيس الأمان المادي والنفسي.\"",
      "energy": "الكون هنا بيسحب منك بساط الطيران وبيقولك: \"انزل على الأرض وابني أساس يعيش\". دي قمة الالتزام والمسؤولية والمجهود المتواصل. مفيش هنا طرق مختصرة، مفيش ضربات حظ سريعة؛ كل مسمار هتدقه هياخد منك مجهود، بس البيت اللي هتبنيه مش هيهده أي ريح. الفرص في المرحلة دي بتيجي في صورة \"مسؤوليات وتقيل\"؛ سواء كان شراء عقار، تأسيس أسرة، بناء بيزنس من الصفر، أو التزام أكاديمي طويل الأمد. دي فترة لتأمين مستقبلك المادي والمهني بقواعد صارمة.",
      "psyche": "هتحس بتقل وإحساس عالي بالمسؤولية، وكأنك شايل هموم بكرة كلها على كتافك. ممكن يسيطر عليك إحساس إن الحياة بقت \"جد بزيادة\" ومفيش مساحة للعب أو الترفيه. بيظهر بقوة خوف دفين من الفقر أو فقدان الأمان المادي، وده بيخليك تحسب كل قرش وكل خطوة. الصراع الداخلي هنا بيكون بين رغبتك في الاستراحة وبين الإلحاح الداخلي اللي بيقولك \"لسه مخلصناش، لازم نأمن نفسنا أكتر\".",
      "invest": "حط خطة، التزم بالروتين، ونظم حياتك المادية بالورقة والقلم. النجاح هنا صديق الصبور والمنضبط. استثمر في الأصول الثابتة، العقارات، أو في بناء مهارات تقنية وإدارية صلبة. اتعلم تدير وقتك كأنه أغلى مورد تملكه. الشغل اللي هتعمله في القمة 4، حتى لو كان متعب وروتيني، هو اللي هيخليك ترتاح وتعيش ملك في القمم اللي بعدها.",
      "shadow": "التصلب، العند، وتحولك لآلة شغل بلا مشاعر! أكبر فخ في طاقة الـ 4 إنك تقفل على نفسك جوه الروتين، وترفض أي تغيير عشان خايف من المجهول. احذر من إنك تدمر صحتك الجسدية أو تهمل علاقاتك الأسرية بحجة \"أنا بطحن نفسي عشانكم\". كمان احذر من البخل—سواء المادي أو العاطفي—الناتج عن الخوف المبالغ فيه من المستقبل.",
      "reflection": "إيه العادة أو النظام البسيط اللي لو التزمت بيه كل يوم، هيشيل عنك رعب التفكير في بكرة؟"
    },
    "5": {
      "title": "طاقة الحرية، التغيير المفاجئ، والمغامرة",
      "essence": "\"كسر القيود، السفر، التكيف السريع، والقفز في المجهول.\"",
      "energy": "لو القمة 4 كانت بتبني الأساس، فالقمة 5 بتفتح الشبابيك وتهد الحيطان اللي بقت تخنقك! الكون هنا بيقلب الترابيزة عشان يعلمك المرونة. دي مرحلة التحولات الجذرية والمفاجآت؛ أبواب للسفر، تغيير الكارير بالكامل، التعرف على ناس من ثقافات وخلفيات مختلفة، والانتقال من مكان لمكان. الفرص بتظهر فجأة وتختفي فجأة، ولازم تكون جاهز تلقطها وهي طايرة. دي طاقة حياة سريعة ومثيرة، بتختبر قدرتك على التخلي عن السيطرة المطلقة.",
      "psyche": "رغبة مجنونة في التمرد والفكاك من أي التزام خانق أو علاقة روتينية. هتحس بملل سريع جداً من أي حاجة مكررة، وإحساس ملح بإن \"الحياة قصيرة ولازم تتجرب بكل ألوانها\". من جوه، ممكن تعاني من تشتت ذهني أو قلق من عدم الاستقرار، وكأن الأرض بتتحرك تحت رجليك. الصراع هنا بيكون بين رغبتك في الحرية وبين خوفك من خسارة الأمان اللي بنيته.",
      "invest": "خليك زي الماية؛ اتشكل مع التغيير وماتقاوموش. دي فترة ممتازة لتعلم لغات جديدة، السفر، التسويق، المبيعات، السياحة، أو أي مجال فيه حركة وتواصل مستمر وتغيير. استثمر في \"مرونتك\" وقدرتك على التأقلم. استغل طاقتك في اكتشاف أسواق جديدة أو توسيع شبكة علاقاتك بشكل غير تقليدي.",
      "shadow": "الهروب من المسؤولية باسم \"الحرية\"! فخ الـ 5 الأكبر هو التدمير الذاتي والقرارات المتهورة العشوائية. ممكن تلاقي نفسك بتنط من مركب لمركب قبل ما توصل لأي شط، أو بتدخل في علاقات عابرة وراء بعضها بتسيبك أفرغ من الأول. احذر من الإدمانات بكل أنواعها (شراء، أكل، علاقات، أو غيره) كمسكن لعدم الراحة الداخلي. الحرية الحقيقية محتاجة انضباط يحميها، مش فوضى تدمرها.",
      "reflection": "إيه القيد اللي إنت حاطه لنفسك ومسميه \"استقرار\"، وجه الوقت إنك تتحرر منه بوعي؟"
    },
    "6": {
      "title": "طاقة الحب، الأسرة، الشفاء، والمسؤولية الكبرى",
      "essence": "\"الرعاية، بناء العائلة، الالتزام العاطفي، الجمال، واختبار التضحية.\"",
      "energy": "الكون بيرجعك للبيت وللقلب. دي قمة بتسلط الضوء على دائرتك القريبة جداً. مرحلة مثالية للزواج، الإنجاب، أو إنك تكون \"كبير العيلة\" اللي الكل بيتسند عليه وبيحل مشاكلهم. الفرص المادية والمهنية هنا بتيجي من خلال مجالات الرعاية، الطب، الدعم النفسي، التدريس، الفن، والتجميل. بيتك هو مركز الكون في المرحلة دي، والنجاح بيتقاس بمدى الدفء والانسجام اللي قادر تخلقه في محيطك.",
      "psyche": "احتياج عميق جداً لإنك تحب وتتحب، وإنك تحس إن ليك جذور. عاطفتك هتبقى في قمتها، ومعاها إحساس ضخم بالمسؤولية تجاه كل حد ضعيف أو محتاج. لكن الجانب المرهق هو ضغط المثالية؛ هتحس بوجع حقيقي لو بيتك أو علاقاتك مش ماشية بالصورة \"الجميلة\" اللي في خيالك. ممكن يظهر إحساس بالذنب لو قصرت في حق حد، أو ضغط نفسي خانق لأنك \"العمود\" اللي شايل الكل وخايف تقع بيهم.",
      "invest": "اخلق بيئة دافية وحاضنة حواليك، سواء في بيتك أو في شركتك. استثمر في علاقاتك الأسرية وفي تحسين جودة حياتك وجماليات المكان اللي عايش فيه. مهنياً، أي شغل بتقدم فيه خدمة إنسانية، رعاية، أو لمسة فنية وجمالية، هيكبر ويزدهر جداً في القمة دي. الناس هتيجيلك عشان تدور على النصيحة والراحة، فخليك الملاذ الآمن.",
      "shadow": "لعب دور \"الشهيد\" أو المنقذ الأبدي! أكبر أزمة لطاقة الـ 6 إنك تلغي نفسك تماماً عشان تخدم غيرك، وبعدين تتحول لشخص مليان مرارة وتلوم الناس إنهم مابيقدروش تضحيتك. الخطر التاني هو \"التحكم الخانق\"؛ إنك تتدخل في تفاصيل حياة اللي بتحبهم وتفرض عليهم قراراتك باسم \"أنا خايف عليكم وعارف مصلحتكم أكتر منكم\". اتعلم إن الحب الحقيقي بيدي مساحة، مش بيلغي استقلال اللي قدامك.",
      "reflection": "إمتى آخر مرة عملت حاجة عشان تدلع وتطبطب على نفسك، مش عشان تخدم حد تاني من اللي بتحبهم؟"
    },
    "7": {
      "title": "طاقة العزلة، العمق، البحث، والنمو الروحي",
      "essence": "\"الخلوة، تحليل ما وراء الظواهر، الشفاء الروحي، واختبار اليقين.\"",
      "energy": "الكون بيقفل عليك الباب وبيقولك: \"انسى زحمة الناس ودوشة الدنيا، الإجابة دلوقتي جوه مش بره\". دي مش قمة للركض وراء الماديات أو الشهرة، دي قمة لجمع المعرفة والبحث المتعمق. الفرص هنا بتظهر في الدراسة الأكاديمية العميقة، البحث العلمي، الفلسفة، أو استكشاف التقاليد الروحية والعلوم الباطنية. النجاح في المرحلة دي بييجي من تخصصك النادر ودقتك الشديدة؛ إنك تكون الشخص اللي بيفهم الحاجة اللي محدش غيره بيفهمها. هي فرصة لفلترة حياتك من العلاقات السطحية.",
      "psyche": "رغبة عارمة في الانسحاب من التجمعات التافهة والمحادثات السطحية. هتحس أحياناً إنك غريب أو \"مش من هنا\"، وكأن بينك وبين العالم إزاز فاصل. بيسيطر عليك سؤال مستمر: \"ليه؟ وإيه المعنى من كل ده؟\". الجانب المرهق هو الشك المفرط؛ دماغك مش بتبطل تفكير وتحليل لكل كلمة ولكل موقف، وده ممكن يدخلك في موجات من الاكتئاب الخفيف أو الإحساس بالجفاف العاطفي، لأنك بتحاول تفهم مشاعرك بالعقل بدل ما تعيشها.",
      "invest": "ادي لنفسك مساحة من الهدوء كل يوم. استثمر وقتك في التعلم، القراءة، والتأمل. مهنياً، ركز على الجودة مش الكمية؛ اشتغل في مجالات بتطلب تفكير، تحليل بيانات، كتابة، أو برمجة. ماتحاولش تدفع الأمور بالقوة أو تستعجل النتايج، طاقة الـ 7 بتحتاج صبر ويقين إن الحاجة هتيجي وقت ما تكون جاهزة. ثق في حدسك لأنه في القمة دي هيكون أداة توجيهك الأولى.",
      "shadow": "الغرور الفكري والعزلة المرضية! فخ الـ 7 الأكبر إنك تحس بالتعالي على الناس وتشوفهم سطحيين أو أقل منك وعياً، وده بيبني بينك وبينهم جدار جليد. الخطر التاني هو \"شلل التحليل\"؛ إنك تفضل تفكر وتحسب وتشك لدرجة إنك ماتاخدش أي خطوة عملية، وتضيع عمرك في نظريات من غير تطبيق. المعرفة اللي مابتخدمش الناس وتخفف عنهم هي عبء على صاحبها.",
      "reflection": "إيه الفكرة أو المعتقد اللي متمسك بيه ومصدق إنه \"الحقيقة المطلقة\"، وجه الوقت تسأل نفسك هل لسه بيخدمك؟"
    },
    "8": {
      "title": "طاقة النفوذ، المال، الحصاد، والمسؤولية الكبرى",
      "essence": "\"إدارة السلطة، الاستثمار، موازنة المادة والروح، والعدالة الكارمية.\"",
      "energy": "دي قمة \"الساحة المفتوحة والمواجهة الكبرى\". الكون بيقولك: \"دلوقتي وقت الحساب والحصاد، يا تاخد مكانك في الصدارة يا تنزل من على المسرح\". دي مرحلة الوفرة المالية، الترقيات، وتأسيس إمبراطورية أعمالك. الأبواب مفتوحة للنفوذ، إدارة الأموال، الصفقات الكبيرة، والقيادة التنفيذية. لكن احذر، دي قمة كارمية جداً؛ اللي زرعته في السنين اللي فاتت هتحصده دلوقتي بنفس المقدار. الفرص هنا بتحتاج عقلية مستثمر، مش عقلية موظف، وتحمل مسؤولية قرارات مصيرية.",
      "psyche": "هتحس بقوة داخلية وجرأة غير مسبوقة، رغبة في التوسع واكتساب احترام الآخرين. الطموح هيكون في أعلى مستوياته، بس معاه بييجي إحساس دائم بإنك تحت الميكروسكوب والتقييم. الخوف الأكبر في القمة دي هو الفشل المالي أو فقدان المكانة؛ سقوط الأقنعة وتدمير السمعة بيرعبك. أحياناً هتحس إن قلبك نشف شوية وإنك بقيت بتقيس كل حاجة—حتى العلاقات—بمنطق المكسب والخسارة.",
      "invest": "فكر بحجم كبير وماتخافش من الأرقام. استثمر في الأصول، العقارات، والأعمال التجارية. نمي مهاراتك في الإدارة والتفاوض. أهم مفتاح للنجاح هنا هو \"النزاهة التامة\"؛ طاقة الـ 8 عاملة زي الميزان الدقيق، لو استخدمت نفوذك بظلم أو تلاعبت في فلوس، الضربة اللي هترجعلك هتكون مدمرة. اشتغل بجدية، طالب بحقك بشجاعة، ودايماً خلي جزء من مكسبك موجه للعطاء عشان تحافظ على سريان الطاقة.",
      "shadow": "العمى المادي والاستبداد! أكبر خطر لطاقة الـ 8 هو الجشع؛ إنك تتحول لمكنة بتفرم اللي حواليها عشان تزود رصيدك أو تحافظ على كرسيك. الخوف من الخسارة ممكن يخليك تتحكم في شركائك أو أهلك بعنف. والجانب العكسي هو إنك تلعب دور الضحية وتخاف تمسك فلوس أو تاخد منصب هرباً من المسؤولية. افتكر دايماً إن الفلوس والنفوذ أدوات، مش هويتك كإنسان.",
      "reflection": "هل احترامك لنفسك مربوط بالرقم اللي في حسابك البنكي أو الـ Title بتاعك؟ لو سحبناهم منك، مين هتكون؟"
    },
    "9": {
      "title": "طاقة النهايات، التسليم، الإنسانية، والتشافي",
      "essence": "\"تصفية الحسابات، العطاء بلا مقابل، الوداع، والاستعداد لدورة جديدة.\"",
      "energy": "الكون بيقولك: \"فضّي إيدك عشان تقدر تستقبل الجديد\". دي قمة الفلترة والنهايات؛ أي حاجة—شغل، علاقة، أو معتقد—استنفدت غرضها وماعادتش بتخدم تطورك، هتخرج من حياتك، ساعات برضاك وساعات غصب عنك. الفرص هنا بتيجي في صورة أعمال خيرية، إرشاد للآخرين، فنون مؤثرة، أو شغل له طابع عالمي ومجتمعي أوسع من محيطك الشخصي. النجاح بييجي لما تتخلى عن الأنانية وتفكر إزاي شغلك ممكن يخفف ألم الناس. دي مرحلة تتويج وتسليم الراية.",
      "psyche": "موجات من النوستالجيا، الحنين، وأحياناً إحساس عميق بالخسارة أو الفقد. هتحس بتعاطف شديد مع أوجاع الناس، وكأن قلبك استوعب كل أحزان العالم. في نفس الوقت، ممكن تحس بإرهاق روحي ورغبة في إنك ترمي كل الحمول وتعيش خفيف. الصراع الأكبر هو \"التعلق\"؛ التمسك بأشخاص أو أماكن أو ألقاب من الماضي بتخليك تتألم بشدة لما تضطر تسيبهم يروحوا.",
      "invest": "سامح، اعفي، واقفل الملفات القديمة. دي مش مرحلة للتمسك بحقوق صغيرة أو الدخول في معارك انتقام. استثمر طاقتك في التوجيه، الاستشارات، أو الفنون اللي بتلمس روح الناس. افتح دايرتك واستقبل ناس من ثقافات وأماكن بعيدة. اتعلم تقول \"وداعاً\" بسلام وحب. النجاح المادي هنا بييجي كنتيجة للعطاء الواسع، مش كهدف بحد ذاته؛ كل ما كنت كريم ومنفتح، كل ما الكون عوّضك من حيث لا تحتسب.",
      "shadow": "لعب دور الضحية والغرق في الماضي! فخ الـ 9 هو المرارة؛ إنك تعيش تبكي على الأطلال وتلوم الناس اللي خذلوك زمان، وده بيخليك بلوك مقفول بيرفض يستقبل أي خير جديد. كمان احذر من \"متلازمة المنقذ المفرط\"؛ إنك تحرق نفسك وتستنزف فلوسك وصحتك لإنقاذ ناس مش عايزين ينقذوا نفسهم أصلاً. العطاء الصح له حدود بتحمي كرامتك.",
      "reflection": "إيه الجرح القديم أو الشخص اللي لسه شايل منه جوه قلبك، وجه الوقت إنك تسامح وتسيب الحمل ده يقع عشان ترتاح؟"
    },
    "11": {
      "title": "طاقة الإلهام، الحدس الخارق، والرسالة الروحية (الرقم الرئيسي 11/2)",
      "essence": "\"قناة النور، الرؤية العميقة، شفاء الآخرين، والوقوف على الحافة بين المادة والروح.\"",
      "energy": "الكون هنا بيختارك عشان تكون \"لمبة\" بتنور طريق الناس. دي قمة روحانية ونفسية من الدرجة الأولى؛ الأبواب بتتفتح لك في مجالات الإرشاد النفسي، الفن الملهم، الإعلام، والشفاء الروحي. الفرص هنا مش بتيجي بالمنطق والحسابات، بتيجي عن طريق \"ومضات إلهام\" وتزامنات عجيبة. مطلوب منك تكون القناة اللي بتوصل رسايل الكون للناس. لو عشت القمة دي بوعي، ممكن توصل لشهرة وتأثير واسع جداً لأن الناس هتشوف فيك إجابات لأسئلتهم.",
      "psyche": "هتبقى عامل زي \"أنتينا\" أو رادار لا سلكي شغال 24 ساعة؛ بيلقط مشاعر الناس، أفكارهم، وطاقة الأماكن. الحساسية دي نعمة بس ضريبتها تقيلة؛ جهازك العصبي هيكون مشدود ومحمل بطاقة كهربائية عالية جداً، وده بيجيب نوبات قلق، توتر، وتفكير مفرط مابيفصلش. أحياناً هتحس إنك كاشف كل حاجة لدرجة مرعبة، وأحياناً تانية هتحس بضياع تام وكأنك مش متثبت على الأرض.",
      "invest": "صدق حدسك فوراً وماتكذبوش عشان ترضي المنطق. استثمر في أي شغل بيعتمد على رؤيتك الفنية أو قدرتك على فهم النفس البشرية. مهم جداً تتعلم تقنيات التفريغ الطاقي (التأمل، المشي في الطبيعة، الكتابة) عشان تفضي جهازك العصبي أول بأول. إنت هنا مش مجرد موظف، إنت \"معلم\" بطريقتك الخاصة، فخلي رسالتك واضحة في أي حاجة بتعملها.",
      "shadow": "الهروب من التكليف والتراجع لرقم (2)! لما طاقة الـ 11 بتبقى مرعبة وتقيلة، الشخص بيهرب منها وينزل لظل الرقم 2: يعيش في دور التابع، الحساس بزيادة اللي بيشتكي من قسوة العالم، وتتبدل رؤيته الروحية لأوهام وبارانويا. احذر من \"متلازمة المخلص\"؛ إنك تحس إنك نبي العصر ومطلوب منك تنقذ كل من هب ودب على حساب صحتك العقلية.",
      "reflection": "إيه الصوت الداخلي أو الإحساس اللي دايماً بتكذبه عشان خايف تصدقه ويطلع صح؟"
    },
    "22": {
      "title": "طاقة البناء العظيم، التأثير المجتمعي، وتحويل الخيال لواقع (الرقم الرئيسي 22/4)",
      "essence": "\"صناعة الإرث، الهندسة الكونية، تحمل المسؤولية الضخمة، والقيادة بحكمة.\"",
      "energy": "دي قمة \"البنّاء الأعظم\". الكون مش بيطلب منك تبني بيت، بيطلب منك تبني مدينة! دي مرحلة تحويل الأحلام الكبيرة جداً لمشاريع حقيقية على الأرض. الفرص بتيجي في صورة مسؤوليات قيادية على مستوى واسع؛ مشاريع قومية، تأسيس مؤسسات دولية، أو بيزنس بيخدم آلاف الناس. الطموح هنا مالوش سقف، بس مش طموح مبني على الهوا، ده طموح متأمن بخطة ورؤية. اللي هتبنيه في القمة دي هيعيش أجيال بعدك.",
      "psyche": "إحساس ساحق بإنك \"مخلوق لحاجة كبيرة\" ومعاه رعب موازي من إنك تفشل في تحقيقها. الضغط النفسي هنا هائل لأنك شايف الصورة الكاملة وعارف حجم المجهود المطلوب. أحياناً هتحس إنك ماكينة شغل مابتنامش، وهتتصارع مع إحساس بإن الناس اللي حواليك بطيئين ومش قادرين يواكبوا سرعة أو حجم دماغك. بيظهر خوف دفين من إن عمرك يسرقك قبل ما تسيب بصمتك.",
      "invest": "زاوج بين خيال الرقم (11) وانضباط الرقم (4). احلم بحجم السماء، بس انزل نفذ بخطوات نملة. استثمر في بناء أنظمة مش مجرد مجهود فردي؛ إنت محتاج فريق عمل قوي، إدارة موارد صارمة، وشراكات مع ناس تقال. خليك براجماتي وعملي جداً؛ القمة دي مابتعترفش بالنوايا الطيبة من غير تنفيذ دقيق على أرض الواقع.",
      "shadow": "الشلل من الخوف والتراجع لرقم (4)! لما الشخص بيترعب من حجم مسؤولية الـ 22، بينكمش ويستخبى في ظل الـ 4: يتحول لموظف روتيني بيعمل المألوف وبيخاف من أي مخاطرة، ويدفن أحلامه الكبيرة تحت حجة \"خليني في المضمون\". الفخ التاني هو الغرور وتحولك لديكتاتور بيسحق اللي حواليه عشان يوصل لهدفه، وتنسى إن البناء اللي مبيخدمش الإنسانية بيفنى.",
      "reflection": "إيه الحلم الضخم اللي بتهرب منه وتصغره بقصد، عشان خايف من حجم المجهود اللي هتدفعه عشانه؟"
    },
    "33": {
      "title": "طاقة المعلم الروحي، الحب الكوني، والشفاء الممتد (الرقم الرئيسي 33/6)",
      "essence": "\"كارما السلطة، الأنانية المطلقة، وسحق الآخرين للوصول للقمة\".",
      "energy": "القمة دي نادرة، وهي أعلى درجات التكليف الروحي. الكون بيطلب منك تكون \"بلسم\" بيشفي جروح اللي حواليك، مش بس عيلتك، لكن المجتمع أو الإنسانية بشكل عام. الفرص هنا مش تجارية ولا مادية في المقام الأول، هي فرص للخدمة العامة، العلاج النفسي المتقدم، الفنون اللي بتغير وعي الناس، أو قيادة حركات مجتمعية وروحية. نجاحك هنا بيتقاس بمدى قدرتك على حب الناس من غير ما تحكم عليهم أو تنتظر منهم مقابل.",
      "psyche": "طوفان من التعاطف. قلبك هيكون مفتوح على مصراعيه لدرجة إنك بتحس بوجع الغريب كأنه وجعك. ده بيولد إحساس طاغي بالمسؤولية تجاه كل كائن حي، ورغبة مجنونة في إنك \"تصلح الكون\". بس في المقابل، هتعاني من إرهاق عاطفي جبار، وأحياناً هتحس بقهر إنك بتدي كل حاجة ومحدش قادر يحتويك إنت لما تتعب.",
      "invest": "علم الناس بالقدوة مش بالكلام. استثمر طاقتك في خلق مساحات آمنة للي حواليك. مهنياً، أي شغل فيه رفع لوعي الناس، دعم نفسي، أو ابتكار بيحمي الضعفاء، هيكبر ويكون له أثر سحري. الأهم هنا إنك تتعلم إزاي تدي من \"الفائض\" بتاعك مش من \"الأساس\"؛ يعني تشفي نفسك وتملا كبايتك الأول عشان تقدر تسقي اللي حواليك من غير ما تنشف.",
      "shadow": "الاحتراق ولعب دور \"الشهيد\" والتراجع لرقم (6)! التحدي الأكبر للـ 33 هو الاستنزاف التام. لما الشخص بيفقد التوازن، بيتحول لظل الـ 6: يتدخل في حياة الناس بالعافية عشان \"ينقذهم\"، يتحكم فيهم باسم الحب، ويلعب دور الضحية اللي بتضحي وعمرها ما بتلاقي تقدير. احذر من جلد الذات لو مقدرتش تنقذ حد؛ إنت دورك تنور الطريق، مش تشيل الناس على ضهرك.",
      "reflection": "إزاي بتقدر تدي لغيرك كل الدعم ده، وإنت حارم نفسك من أبسط حقوقك في الراحة والاحتواء؟"
    }
  });

  const CHALLENGE_READINGS = Object.freeze(  {
    "0": {
      "title": "تحدي الاختيار المطلق، وحرية الروح",
      "essence": "\"مفيش عدو خارجي، العدو جوه دماغك.. الكون بيديك ورقة بيضا وبيختبرك هترسم إيه\".",
      "root": "ده تحدي استثنائي؛ مفيش هنا عقبة محددة زي الفقر أو المشاكل العاطفية. العقبة الحقيقية هي \"اللا شيء\". إنت قدامك كل الطرق مفتوحة، وده بيخلق حالة من الرعب والتوهان. التحدي ده بيخليك تسأل نفسك طول الوقت: \"أنا مين؟ وعايز إيه؟\".",
      "lesson": "الشفاء من \"شلل الاختيار\". لما ميبقاش فيه ضغط خارجي يجبرك على طريق معين، بتضطر تواجه فراغك الداخلي. الدرس هنا هو إنك تبطل تستنى \"علامة من السماء\" أو حد يقرر لك، وتتحمل مسؤولية صناعة قدرك بنفسك.",
      "skills": "الاستماع للحدس (البوصلة الداخلية)، اتخاذ قرارات حاسمة بدون ندم، وتحمل مسؤولية الحرية الكاملة.",
      "practice": "بطل تسأل الناس \"إيه الصح اللي المفروض أعمله؟\" واسأل نفسك \"أنا قلبي مرتاح لإيه؟\". ابدأ بأي طريق والتزم بيه، لأن الوقوف في النص خوفاً من الاختيار الغلط هو أكبر غلطة في التحدي ده."
    },
    "1": {
      "title": "تحدي الهوية، الأنا، ورهبة الاستقلال",
      "essence": "\"صراع إثبات الذات.. إزاي تقف على رجلك من غير ما تدوس على غيرك، ومن غير ما تلغي نفسك\".",
      "root": "هتلاقي نفسك دايماً في مواقف بتجبرك تدافع عن هويتك. إما إنك بتلغي شخصيتك تماماً عشان ترضي حد أقوى منك وتعيش في ضله (انعدام الثقة)، أو العكس تماماً: بتتحول لشخص عنيد، ديكتاتور، ومستبد بيحاول يفرض رأيه بالعافية عشان يثبت إنه موجود (تضخم الأنا).",
      "lesson": "الخوف الحقيقي هنا هو الخوف من التهميش أو إنك تكون \"نكرة\". الدرس هو إنك تفهم إن قيمتك مش محتاجة إثبات بالصوت العالي ولا بالخناق. إنت موجود ولك حق الاختيار من غير ما تبرر أو تحارب طواحين الهوا.",
      "skills": "توكيد الذات بهدوء، الاستقلال العاطفي، والقيادة الحقيقية اللي بتستوعب الاختلاف مش بتسحقه.",
      "practice": "اتعلم تاخد قرار لوحدك وتتحمل نتيجته، حتى لو هتغلط. بطل تبرر اختياراتك للناس، وفي نفس الوقت، لو حد خالفك الرأي، ماتاخدش الموضوع كإهانة شخصية. افصل بين \"كرامتك\" وبين \"رأيك\"."
    },
    "2": {
      "title": "تحدي الحساسية المفرطة، الحدود، وفخ التبعية",
      "essence": "\"الخوف من الرفض.. إزاي تكون حساس ورحيم من غير ما تتحول لممسحة زفر للناس\".",
      "root": "رعب من الوحدة والخصام. عشان تتجنب أي صدام، بتمسح حدودك الشخصية تماماً، وتوافق على حاجات مش عايزها، وتتنازل عن حقك عشان تشتري \"رضا\" وحب اللي حواليك. النتيجة؟ الناس بتستغلك، وإنت بتعيش مقهور ومليان غضب مكتوم.",
      "lesson": "التفرقة الصارمة بين \"اللين\" و\"الضعف\". الدرس هنا بيعلمك إن قيمتك كإنسان مش مربوطة بمدى تضحيتك عشان غيرك، وإن الشخص اللي هيزعل لما تقوله \"لأ\" هو شخص كان مستفيد من استغلالك وميحقلوش يزعل أصلاً.",
      "skills": "قول \"لأ\" بوضوح وبدون تأنيب ضمير، حماية مساحتك الطاقية من مصاصين الطاقة، وفصل مشاعرك عن مشاعر الآخرين.",
      "practice": "حط حدود صارمة. اتدرب كل يوم إنك ترفض طلب واحد على الأقل مش مناسب ليك. بطل تعتذر عمال على بطال، وبطل تلعب دور \"الوسيط\" في كل خناقة عشان ترضي كل الأطراف على حساب أعصابك."
    },
    "3": {
      "title": "تحدي التعبير، الخوف من التقييم، وفوضى التشتت",
      "essence": "\"عقدة المسرح.. إما إنك تكتم صوتك خوفاً من النقد، أو تضيع طاقتك في تهريج ملوش معنى\".",
      "root": "الخوف المرعب من رأي الناس \"هيفكروا فيا إيه؟\". التحدي ده بيظهر في شكلين: يا إما بتكبت مواهبك ومشاعرك وتخاف تتكلم عشان ماتتعرضش للنقد (انغلاق)، يا إما بتهرب من مشاعرك العميقة ورا قناع من الهزار، الثرثرة، والسطحية، وتبدأ ألف مشروع وماتكملش ولا واحد (تشتت).",
      "lesson": "الشفاء من الجرح النرجسي المرتبط بالقبول الاجتماعي. الدرس هو إنك تتكلم وتعبر عن حقيقتك مش عشان \"تعجب\" الجمهور، لكن عشان دي حقيقتك اللي لازم تخرج للنور. إبداعك هو وسيلة لتشافيك إنت قبل ما يكون للناس.",
      "skills": "التركيز والانضباط، التعبير الإبداعي الصادق، ومواجهة المشاعر السلبية بدل الهروب منها بالضحك المزيف.",
      "practice": "التزم بهدف واحد أو هواية واحدة لحد ما تخلصها قبل ما تنط لحاجة تانية. لما تحزن، اسمح لنفسك تحزن بجد وماتغطيش الوجع بنكتة. استخدم صوتك، قلمك، أو فنك في التعبير عن حاجة حقيقية جواك من غير ما تستنى تصفيق."
    },
    "4": {
      "title": "تحدي الانضباط، رعب المستقبل، وفخ التصلب",
      "essence": "\"الصراع مع المجهود.. إما الهروب من المسؤولية، أو التحول لآلة شغل مرعوبة من بكرة\".",
      "root": "مشكلتك هنا مع \"النظام\". إما إنك كاره للروتين، كسول، وعايز توصل للقمة بأي طريق مختصر فتقع في فخاخ الفشل (تهرب)، أو العكس تماماً: مرعوب من الفقر والمستقبل، فبتقفل على نفسك في شغل وروتين قاتل، وتنسى تعيش، وتتحول لشخص عنيد، قاسي، وبخيل على نفسه وعلى اللي حواليه.",
      "lesson": "إدراك إن \"القيود\" الصحية هي اللي بتصنع الحرية الحقيقية. المجهود المنظم مش عقاب، ده أساس الأمان. الدرس بيعلمك تبني حياتك طوبة طوبة بشرف، وتثق في إن المجهود الصادق عمره ما بيضيع.",
      "skills": "الصبر الجميل، إدارة الوقت والمال بوعي (مش برعب)، والمرونة العقلية لتقبل التغيير وقت الأزمات.",
      "practice": "حط نظام يومي \"رحيم\" وامشي عليه. بطل تدور على الطرق المختصرة و\"السبوبة\" السريعة لأنها هترجعك لنقطة الصفر بقسوة. في نفس الوقت، لو إنت من النوع اللي بيطحن نفسه، خصص وقت إجباري للراحة واللعب من غير أي إحساس بالذنب؛ الأمان مش بس في البنك، الأمان في صحتك النفسية."
    },
    "5": {
      "title": "تحدي الحرية، التغيير المفاجئ، وفخ التدمير الذاتي",
      "essence": "\"الصراع مع الاستقرار.. إما الهروب الدائم من أي التزام، أو الرعب من التغيير لدرجة الشلل\".",
      "root": "هنا إنت بتواجه \"الخوف من المجهول\" بأعنف أشكاله. التحدي ده بيخليك تتأرجح بين نقيضين: يا إما بتخاف من التغيير فبتفضل محبوس في شغلانة بتكرهها أو علاقة ميتة عشان خايف من بكرة (جمود)، يا إما بتعاني من ملل مرضي بيخليك تنط من علاقة لعلاقة ومن شغل لشغل وتهد اللي بنيته لمجرد إنك حسيت بـ \"خنقة\" (تدمير ذاتي وهروب).",
      "lesson": "إدراك إن \"الحرية الحقيقية بتيجي من الانضباط\". التغيير هو السنة الوحيدة الثابتة في الكون، ومحاربة التغيير بتجيب معاناة. الدرس بيعلمك إزاي تكون مرن زي الماية، تقبل التغيير لما يحصل، بس متخلقش فوضى في حياتك لمجرد إنك هربان من مواجهة نفسك.",
      "skills": "الالتزام، التأقلم السريع مع الأزمات، والسيطرة على الاندفاعات والغرائز (أكل، شراء، علاقات عابرة).",
      "practice": "لما تحس بالملل وعايز تقلب الترابيزة على حياتك، اقف واسأل نفسك: \"هل أنا بغير عشان أطور، ولا بهرب عشان خايف أواجه المسؤولية؟\". اتعلم تاخد \"مخاطرات محسوبة\" مش قفزات انتحارية. التزم بقرارك حتى لما نشوة البدايات تخلص."
    },
    "6": {
      "title": "تحدي المثالية، إنقاذ الآخرين، وفخ الضحية",
      "essence": "\"عقدة المنقذ.. إما السيطرة الخانقة باسم الحب، أو الاحتراق لإرضاء ناس مش بيقدروك\".",
      "root": "التحدي ده بيلعب على جرح \"القبول\". إنت بتربط قيمتك بمدى احتياج الناس ليك. النتيجة؟ بتتدخل في حياة اللي حواليك وتحاول تصلحهم وتحل مشاكلهم (أحياناً غصب عنهم)، ولما مبيسمعوش كلامك بتتحول لشخص انتقادي، لحوح، وصعب الإرضاء. الوجه التاني للتحدي إنك بتدي كل حاجة لحد ما تستنزف تماماً، وتعيش في دور \"الضحية\" اللي ضحت بعمرها ومحدش طمر فيه.",
      "lesson": "\"إنت مش منقذ الكون، ومش مسؤول عن قرارات غيرك\". الدرس بيعلمك الحب غير المشروط؛ الحب اللي بيدي مساحة للناس تغلط وتتعلم. وبيعملك إن تقبّلك لعيوبك وعيوب الناس هو أعلى درجات النضج.",
      "skills": "وضع حدود عاطفية صارمة، التخلي عن السيطرة، وحب الذات قبل حب الآخرين.",
      "practice": "بطل تدي نصايح محدش طلبها. سيب الناس تتحمل نتيجة أفعالها. والأهم: بطل تتوقع إن الناس هتردلك نفس العطاء بنفس الطريقة. لو هتدي، إدي من فائض طاقتك مش من أساسك، واعمل حاجة واحدة في اليوم عشان تدلع بيها نفسك إنت وبس."
    },
    "7": {
      "title": "تحدي العزلة المرضية، الشك المفرط، وأزمة اليقين",
      "essence": "\"سجن العقل.. إما الغرور الفكري والتعالي، أو الغرق في شكوك بتدمر سلامك الداخلي\".",
      "root": "مشكلتك هنا في \"دماغك اللي مابتفصلش\". إنت بتحلل كل كلمة وكل نظرة لدرجة إنك بتخنق عفويتك. الخوف من التعرض للجرح بيخليك تبني حيطة بينك وبين الناس، وتدعي إنهم سطحيين ومش فاهمينك (كبرياء فكري). ولأنك بتعتمد على المنطق في كل حاجة، لما بتحصل أزمة ملهاش تفسير منطقي، بتنهار وتفقد إيمانك ويقينك في كل حاجة.",
      "lesson": "\"المنطق له حدود، والقلب بيشوف اللي العقل مابيشوفوش\". الدرس بيعلمك تكسر كبرياءك العقلي، وتسمح لنفسك تعيش المشاعر من غير ما تحللها. العزلة الصحية بتشحنك، بس العزلة المرضية بتموتك بالبطيء.",
      "skills": "تسكيت الناقد الداخلي، الثقة في الحدس، والسماح لنفسك بالضعف العاطفي قدام اللي بتحبهم.",
      "practice": "بطل تطلب إثباتات وضمانات لكل خطوة في حياتك. اتعلم تشارك أفكارك ومشاعرك مع شخص بتثق فيه من غير ما تخاف إنه يحكم عليك. وقت ما تلاقي دماغك دخلت في دوامة تفكير أسود، قوم اعمل أي نشاط جسدي (رياضة، تنضيف، مشي) عشان تسحب الطاقة من عقلك لجسمك."
    },
    "8": {
      "title": "تحدي السلطة، المال، وفخ العمى المادي",
      "essence": "\"كارما السلطة، الأنانية المطلقة، وسحق الآخرين للوصول للقمة\".",
      "root": "صراع مباشر مع \"القوة\". يا إما بتخاف جداً من الفقر والضعف، فبتتحول لشخص مادي، قاسي، ديكتاتور في شغلك وبيتك، وبتدوس على أي حد عشان توصل وتجمع فلوس (هوس السيطرة). يا إما العكس تماماً: بتخاف من المسؤولية، بتشوف الفلوس شر، وبترفض تمسك أي منصب قيادي، وتفضل تلعب دور الضحية اللي الظروف جاية عليها.",
      "lesson": "القيادة مش سيطرة وقهر، القيادة الحقيقية هي \"خدمة\". الدرس بيعلمك إنك مهما كنت قوي ومستقل، إنت محتاج الناس، والناس محتاجاك. الإنسانية شبكة واحدة متصلة، والأنانية بتقطع اتصالك بمصدر الوفرة.",
      "skills": "القيادة النزيهة، الثقافة المالية، واستخدام النفوذ لخدمة غيرك مش لسحقهم.",
      "practice": "صالح نفسك على فكرة الفلوس والنجاح، وطالب بحقك ومجهودك بشجاعة. بس في نفس الوقت، راقب \"الأنا\" بتاعتك باستمرار؛ لو لقيت نفسك بتستخدم سلطتك عشان تقهر حد أضعف منك، اعرف إن الضربة الكارمية هترجعلك مضاعفة. النجاح المادي هنا مربوط ارتباط وثيق بالنزاهة والعطاء المستمر."
    }
  });

  const KARMIC_DEBT_READINGS = Object.freeze(  {
    "13": {
      "root": 4,
      "title": "تحدي البناء من الصفر، العقبات، وتدمير الذات",
      "essence": "\"كارما الكسل، البحث عن الطرق المختصرة، والتهرب من دفع ثمن النجاح\".",
      "origin": "الرقم 1 (الأنا) + 3 (اللعب والتعبير) بيساووا 4 (الانضباط والبناء). في الوعي القديم أو الأنماط المتوارثة، طاقة الـ 13 بتمثل شخص كان بيعتمد على ذكائه وسحره الشخصي عشان يتهرب من الشغل الجاد. كان بيدور دايماً على \"السبوبة السريعة\"، وبيسيب الحِمل التقيل على كتاف غيره.",
      "pattern": "هتلاقي نفسك بتبذل مجهود مضاعف عشان توصل لنفس النتيجة اللي غيرك بيوصلها بسهولة. كل ما تحاول تبني حاجة (شغل، علاقة، مشروع)، تظهر عقبات مفاجئة، تعطيل، أو تلاقي الأساس بينهار وتضطر تبدأ من الصفر تاني. الإحساس المسيطر هنا هو الإحباط والشعور بإن \"الدنيا مستقصداني وحظي قليل\".",
      "lesson": "الكون بيقفل في وشك كل \"الطرق المختصرة\" والأبواب الخلفية عشان تتعلم إن مفيش نجاح حقيقي من غير أساس صلب. الدرس هو إدراك قيمة \"العمل الجاد\" والصبر.",
      "release": "الروتين والانضباط الصارم هما طوق النجاة. التزم بكلمتك، خلص الشغل اللي بدأته حتى لو فقدت الشغف، وبطل تماماً تدور على \"الضربة السريعة\" أو تعتمد على الحظ. لما تثبت للكون إنك مستعد تدفع ثمن النجاح عرق ومجهود، العقدة بتتفك وبتتحول الـ 13 لأقوى أرقام البناء والثروة."
    },
    "14": {
      "root": 5,
      "title": "تحدي الحرية المدمرة، الإدمان، وفقدان السيطرة",
      "essence": "\"كارما التهور، إساءة استخدام الحرية، والهروب من الالتزام بتدمير الجسد والروح\".",
      "origin": "الرقم 1 (الأنا) + 4 (القواعد) بيساووا 5 (الحرية المطلقة). النمط هنا بيعود لشخص تمرد على كل القواعد، واستخدم حريته عشان يدمر نفسه ويدوس على حقوق اللي حواليه. شخص عاش لملذاته الجسدية والحسية بس، وهرب من أي التزام أخلاقي أو عاطفي.",
      "pattern": "حياة مليانة فوضى وتقلبات درامية. ممكن تلاقي نفسك بتطرد من شغل فجأة، أو علاقاتك بتنتهي بكوارث، أو بتعاني من صراعات مع أي شكل من أشكال الإدمان (أكل، سكر، علاقات عابرة، شراء قهري). الظروف دايماً بتجبرك إنك تفقد حريتك (عن طريق مرض، ديون، أو قيود مجتمعية) عشان تعرف قيمتها.",
      "lesson": "\"الحرية الحقيقية مش فوضى، الحرية الحقيقية بتحميها الحدود\". الدرس بيعلمك إن جسدك ووقتك ومواردك أمانة مش لعبة، وإن الهروب من الألم بالملذات بيضاعف الألم.",
      "release": "الاعتدال في كل شيء. التزم بشخص واحد، التزم بشغلانة واحدة، وابني نظام حياة متزن. بطل تهرب من الملل باختلاق دراما أو تدمير اللي بنيته. لما تحس بالرغبة المجنونة في \"قلب الترابيزة\"، اتنفس، واثبت في مكانك. التزامك هو اللي هيفك قيدك."
    },
    "16": {
      "root": 7,
      "title": "تحدي الكبرياء، انهيار البرج، وبناء اليقين",
      "essence": "\"كارما الغرور، التعالي الفكري، والتعلق الكاذب بالمظاهر\".",
      "origin": "الرقم 1 (الأنا) + 6 (الحب والمسؤولية) بيساووا 7 (الروحانيات والعزلة). النمط القديم هنا لشخص أساء استخدام الحب أو المعرفة لتحقيق سيطرة ونفوذ. شخص اتعالى على الناس بذكائه أو بماله، ونسى إن كل اللي بيمتلكه مجرد أدوات مش هويته.",
      "pattern": "زي كارت \"البرج\" في التاروت؛ فجأة وبدون مقدمات، كل حاجة بتبني عليها غرورك واستعلائك (شغل مرموق، علاقة كنت متباهي بيها، فلوس، أو حتى شكل خارجي) بتنهار وتتكسر قدام عينيك. صدمات غير متوقعة بتسقط الأقنعة وبتجبرك تبدأ من الصفر وتعيش عزلة إجبارية.",
      "lesson": "التواضع الروحي العميق. الكون بيكسر \"الأصنام\" اللي إنت بتعبدها (الأنا والمنظرة) عشان تتصل بروحك الحقيقية وتعرف إنك مش المتحكم الأوحد في الكون. الانهيار هنا مش عقاب، ده \"تطهير\" عشان تنضف من الزيف.",
      "release": "التسليم. لما حاجة تنهار، ماتقاوحش وماتحاولش تلزقها أو ترجعها بالعافية. اقبل الخسارة، وابني المرة دي على أساس روحي وحقيقي، مش على المظاهر وتلميع الأنا. بطل تشوف نفسك أذكى أو أحسن من غيرك، وافتح قلبك للرحمة."
    },
    "19": {
      "root": 1,
      "title": "تحدي الاستبداد، العزلة القهرية، والقيادة الرحيمة",
      "essence": "\"كارما السلطة، الأنانية المطلقة، وسحق الآخرين للوصول للقمة\".",
      "origin": "الرقم 1 (الأنا) + 9 (الإنسانية والنهايات) بيساووا 1 (القيادة والبدايات). النمط هنا بيخص شخص امتلك سلطة، موهبة، أو نفوذ، واستخدمهم عشان يخدم نفسه وبس. شخص داس على أي حد يقف في طريقه، واعتبر الناس مجرد أدوات لتحقيق أهدافه الشخصية.",
      "pattern": "هتلاقي نفسك دايماً شايل شيلة كبيرة جداً لوحدك، ولما تقع في أزمة أو تحتاج مساعدة، مابتلاقيش مخلوق يمدلك إيده (العزلة القهرية). الناس إما بتخاف منك أو بتبعد عنك. بتحس إن الكون كله رافض يدعمك أو يسندك، وإنك معزول في جزيرة مهما كان حواليك ناس.",
      "lesson": "القيادة مش سيطرة وقهر، القيادة الحقيقية هي \"خدمة\". الدرس بيعلمك إنك مهما كنت قوي ومستقل، إنت محتاج الناس، والناس محتاجاك. الإنسانية شبكة واحدة متصلة، والأنانية بتقطع اتصالك بمصدر الوفرة.",
      "release": "\"اطلب المساعدة\".. دي هتكون أصعب جملة على كبريائك، بس هي دي العلاج. شارك غيرك في قراراتك، واسمع رأيهم بصدق. اتعلم تكون قائد بيدعم فريقه ويرفعهم معاه، مش بيسحقهم عشان يقف هو على القمة. العطاء بدون مقابل وتوجيه قوتك لخدمة غيرك هو اللي هيفك العقدة دي للأبد."
    }
  });

  const KARMIC_DEBTS = Object.freeze({
    13: { root: 4, title: KARMIC_DEBT_READINGS[13].title, theme: KARMIC_DEBT_READINGS[13].essence },
    14: { root: 5, title: KARMIC_DEBT_READINGS[14].title, theme: KARMIC_DEBT_READINGS[14].essence },
    16: { root: 7, title: KARMIC_DEBT_READINGS[16].title, theme: KARMIC_DEBT_READINGS[16].essence },
    19: { root: 1, title: KARMIC_DEBT_READINGS[19].title, theme: KARMIC_DEBT_READINGS[19].essence }
  });

  function assertDate(day, month, year) {
    const d = Number(day), m = Number(month), y = Number(year);
    if (!Number.isInteger(d) || !Number.isInteger(m) || !Number.isInteger(y) ||
        y < 1 || m < 1 || m > 12 || d < 1 || d > new Date(y, m, 0).getDate()) {
      throw new RangeError("تاريخ الميلاد غير صالح.");
    }
    return { day: d, month: m, year: y };
  }

  function digitSum(value) {
    return String(Math.abs(Math.trunc(Number(value)))).split("").reduce((sum, digit) => sum + Number(digit), 0);
  }

  function reduceNumber(value, preserveMaster) {
    let n = Math.abs(Math.trunc(Number(value)));
    if (!Number.isFinite(n)) throw new TypeError("القيمة لازم تكون رقمًا صحيحًا.");
    if (n === 0) return { value: 0, root: 0, isMaster: false, rawTotal: Number(value) };
    const rawTotal = n;
    while (n > 9) {
      if (preserveMaster && MASTER_NUMBERS.has(n)) {
        return { value: n, root: MASTER_ROOTS[n], isMaster: true, rawTotal };
      }
      n = digitSum(n);
    }
    return { value: n, root: n, isMaster: false, rawTotal };
  }

  function calculatePinnaclesChallenges(day, month, year, lifePathNumber) {
    const dob = assertDate(day, month, year);
    const monthNumber = reduceNumber(dob.month, false).value;
    const dayNumber = reduceNumber(dob.day, false).value;
    const yearDigitTotal = digitSum(dob.year);
    const yearNumber = reduceNumber(yearDigitTotal, false).value;

    const p1Raw = monthNumber + dayNumber;
    const p2Raw = dayNumber + yearNumber;
    const p1 = reduceNumber(p1Raw, true);
    const p2 = reduceNumber(p2Raw, true);
    // P3 تُجمع من جذري P1 وP2 (11→2، 22→4)، ويُحفظ 11 أو 22 فقط إذا كان المجموع نفسه 11 أو 22.
    const p3Raw = p1.root + p2.root;
    const p3 = reduceNumber(p3Raw, true);
    const p4Raw = monthNumber + yearNumber;
    const p4 = reduceNumber(p4Raw, true);

    // Keep master numbers for display, but use their single-digit root in the
    // conventional 36 - Life Path age formula so the age range remains standard.
    const suppliedLifePath = Number(lifePathNumber);
    const lifePathRoot = MASTER_NUMBERS.has(suppliedLifePath)
      ? MASTER_ROOTS[suppliedLifePath]
      : reduceNumber(suppliedLifePath, false).value;
    const firstPeakEnd = 36 - lifePathRoot;
    const periods = [
      { startAge: 0, endAge: firstPeakEnd, label: "من الميلاد حتى سن " + firstPeakEnd },
      { startAge: firstPeakEnd + 1, endAge: firstPeakEnd + 9, label: "من سن " + (firstPeakEnd + 1) + " إلى " + (firstPeakEnd + 9) },
      { startAge: firstPeakEnd + 10, endAge: firstPeakEnd + 18, label: "من سن " + (firstPeakEnd + 10) + " إلى " + (firstPeakEnd + 18) },
      { startAge: firstPeakEnd + 19, endAge: null, label: "من سن " + (firstPeakEnd + 19) + " فصاعدًا" }
    ];

    const pinnacleValues = [p1, p2, p3, p4];
    const pinnacles = pinnacleValues.map((result, index) => ({
      index: index + 1,
      value: result.value,
      root: result.root,
      isMaster: result.isMaster,
      rawTotal: [p1Raw, p2Raw, p3Raw, p4Raw][index],
      period: periods[index]
    }));

    const challengeRaw = [
      Math.abs(monthNumber - dayNumber),
      Math.abs(dayNumber - yearNumber),
      null,
      Math.abs(monthNumber - yearNumber)
    ];
    const challengeValues = [
      reduceNumber(challengeRaw[0], false).value,
      reduceNumber(challengeRaw[1], false).value,
      null,
      reduceNumber(challengeRaw[3], false).value
    ];
    challengeRaw[2] = Math.abs(challengeValues[0] - challengeValues[1]);
    challengeValues[2] = reduceNumber(challengeRaw[2], false).value;
    const challenges = challengeValues.map((value, index) => ({
      index: index + 1,
      value,
      rawTotal: challengeRaw[index],
      period: periods[index]
    }));

    return {
      birthDate: dob,
      inputs: { month: monthNumber, day: dayNumber, year: yearNumber, yearDigitTotal },
      lifePath: { value: suppliedLifePath, root: lifePathRoot, firstPinnacleEndAge: firstPeakEnd },
      pinnacles,
      challenges,
      methodNotes: [
        "القيم الشهرية واليومية والسنوية تُختزل أولًا إلى رقم واحد.",
        "تُحفظ الأرقام الرئيسية 11 و22 و33 في عرض القمم، بينما تُستخدم جذورها في حساب العمر 36 − مسار الحياة، وفي القمة الثالثة (تُجمع جذور القمتين الأولى والثانية).",
        "الفترات معروضة بأعمار صحيحة شاملة دون تداخل: القمة الأولى حتى نهاية العمر المحدد، ثم تبدأ القمة التالية في العمر الذي يليه."
      ]
    };
  }

  function collectKarmicDebts(day, month, year, lifePathNumber, nameCalculation) {
    const dob = assertDate(day, month, year);
    const sources = [];
    const yearDigitTotal = digitSum(dob.year);
    const lifePathRaw = digitSum(dob.day) + digitSum(dob.month) + yearDigitTotal;

    function addIfDebt(rawValue, source, detail) {
      const raw = Number(rawValue);
      if (Number.isInteger(raw) && KARMIC_DEBTS[raw]) {
        const definition = KARMIC_DEBTS[raw];
        sources.push({
          debt: raw,
          root: definition.root,
          title: definition.title,
          theme: definition.theme,
          source,
          detail: detail || "",
          rawTotal: raw
        });
      }
    }

    addIfDebt(dob.day, "birthday_day", "يوم الميلاد قبل الاختزال");
    addIfDebt(lifePathRaw, "life_path", "مجموع أرقام تاريخ الميلاد قبل الاختزال");
    // Name engine exposes rawTotal for each name-number group. Only the exact
    // compound total is counted; a reduced 4/5/7/1 alone is not a debt marker.
    ["soulUrge", "personality", "expression"].forEach(function (key) {
      const item = nameCalculation && nameCalculation[key];
      // If Soul Urge is using the Arabic no-written-vowels fallback, its raw
      // total duplicates the whole-name Expression total, so do not count it twice.
      if (key === "soulUrge" && item && item.status === "fallback_to_full_name_no_written_vowels") return;
      if (item && item.rawTotal != null) {
        addIfDebt(item.rawTotal, "name_" + key, "مجموع الاسم قبل الاختزال: " + item.rawTotal);
      }
    });

    const unique = [];
    const seen = new Set();
    sources.forEach(function (entry) {
      const key = entry.debt + "|" + entry.source;
      if (!seen.has(key)) { seen.add(key); unique.push(entry); }
    });

    return {
      found: unique.length > 0,
      items: unique,
      inspected: {
        birthdayDay: dob.day,
        lifePathRaw,
        lifePathDisplayed: Number(lifePathNumber),
        nameRawTotals: {
          soulUrge: nameCalculation && nameCalculation.soulUrge ? nameCalculation.soulUrge.rawTotal : null,
          personality: nameCalculation && nameCalculation.personality ? nameCalculation.personality.rawTotal : null,
          expression: nameCalculation && nameCalculation.expression ? nameCalculation.expression.rawTotal : null
        }
      },
      note: "هذا فحص وفق قاعدة عقيق المعلنة: تُسجَّل 13 و14 و16 و19 عندما تظهر كقيمة مركبة مباشرة قبل الاختزال في المصادر المفحوصة. مجرد ظهور الجذر 4 أو 5 أو 7 أو 1 لا يكفي."
    };
  }

  function getPinnacleReading(value) {
    return PINNACLE_READINGS[Number(value)] || null;
  }

  function getChallengeReading(value) {
    return CHALLENGE_READINGS[Number(value)] || null;
  }

  function getKarmicDebtReading(value) {
    return KARMIC_DEBT_READINGS[Number(value)] || null;
  }

  return Object.freeze({
    version: "3.0.0",
    KARMIC_DEBTS,
    PINNACLE_READINGS,
    CHALLENGE_READINGS,
    KARMIC_DEBT_READINGS,
    getPinnacleReading,
    getChallengeReading,
    getKarmicDebtReading,
    reduceNumber,
    calculatePinnaclesChallenges,
    collectKarmicDebts
  });
});

;
/* name_readings.js */
/* Aqeq Astro · Name Reading Cards
   Loads name_data.json, calculates three name numbers, and renders all 9 reading cards.
   GitHub Pages friendly: no server-side code required.
*/
(function (root) {
  "use strict";

  let dataPromise;
  function loadData() {
    if (!dataPromise) {
      dataPromise = fetch(new URL("name_data.json", window.location.href).href, {
        cache: "no-cache"
      }).then(function (response) {
        if (!response.ok) throw new Error("تعذر تحميل name_data.json (" + response.status + ")");
        return response.json();
      }).then(function (json) {
        if (!json || !json.groups) throw new Error("تنسيق ملف قراءات الاسم غير صحيح.");
        return json;
      });
    }
    return dataPromise;
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function contentToHTML(value) {
    const text = String(value || "").replace(/\r\n?/g, "\n").trim();
    if (!text) return "";
    return text.split(/\n{2,}/).map(function (block) {
      const lines = block.split("\n");
      if (lines.every(function (line) { return /^\s*[•●▪◦*-]\s+/.test(line); })) {
        return "<ul>" + lines.map(function (line) {
          return "<li>" + escapeHTML(line.replace(/^\s*[•●▪◦*-]\s+/, "")) + "</li>";
        }).join("") + "</ul>";
      }
      return "<p>" + lines.map(escapeHTML).join("<br>") + "</p>";
    }).join("");
  }

  const GROUPS = [
    { key: "soul_urge", calcKey: "soulUrge", label: "رغبة الروح", sub: "إيه اللي بيحرّكك من جوا" },
    { key: "personality", calcKey: "personality", label: "الشخصية الظاهرة", sub: "الانطباع اللي بتسيبه عند الناس" },
    { key: "expression", calcKey: "expression", label: "التعبير والقدر", sub: "مواهبك وطريقتك في تحويلها لفعل" }
  ];


  // Compact, reflective interpretations for the three complementary numerology outputs.
  const EXTRA_READINGS = Object.freeze({
    personalYear: {
      1: { title: "بداية جديدة", energy: "سنة انطلاقة واستقلال؛ طاقة مناسبة لتحديد اتجاه جديد وبناء هوية أو مشروع.", opportunities: "ابدأ خطوة مؤجلة، بادر، وجرّب طريقًا يناسبك بدل انتظار الإذن.", avoid: "تجنب التسرع والأنانية وفتح جبهات كثيرة في وقت واحد." },
      2: { title: "الصبر والشراكة", energy: "سنة تعاون وحساسية أعلى؛ التقدم فيها غالبًا هادئ ويتكوّن بالتدريج.", opportunities: "قوِّ علاقة مهمة، تفاوض، اسمع جيدًا، واشتغل على التفاصيل التي تحتاج وقتًا.", avoid: "تجنب الاستعجال وقراءة كل تأخير باعتباره رفضًا أو فشلًا." },
      3: { title: "التعبير والانتشار", energy: "سنة إبداع وتواصل وظهور؛ الأفكار تحتاج صوتًا ومساحة للتجربة.", opportunities: "اكتب، اتكلم، تعلّم، انشر، ووسّع دائرة علاقاتك بطريقة أصيلة.", avoid: "تجنب التشتت والوعود الكثيرة وإنفاق الطاقة على الانطباع بدل الإنجاز." },
      4: { title: "البناء والتنظيم", energy: "سنة تأسيس وانضباط؛ المكاسب تأتي من نظام ثابت وخطوات قابلة للقياس.", opportunities: "رتّب المال والوقت، ابنِ مهارة، وثبّت أساس مشروع أو عادة طويلة المدى.", avoid: "تجنب الجمود والإرهاق ومحاولة التحكم في كل تفصيلة." },
      5: { title: "التغيير والمرونة", energy: "سنة حركة وتجارب وتبدّل؛ تحتاج مرونة مع الحفاظ على بوصلة واضحة.", opportunities: "استكشف فرصة جديدة، طوّر مهارة، وسّع خبرتك وجرّب أسلوبًا مختلفًا.", avoid: "تجنب القرارات الاندفاعية والهروب من الالتزامات لمجرد الملل." },
      6: { title: "المسؤولية والانسجام", energy: "سنة اهتمام بالبيت والعلاقات والالتزامات؛ التوازن بين الرعاية والذات أساسي.", opportunities: "أصلح علاقة، حسّن بيئتك، واهتم بما يحتاج رعاية مستمرة.", avoid: "تجنب لعب دور المنقذ وتحمل مسؤوليات الآخرين على حساب نفسك." },
      7: { title: "المراجعة والعمق", energy: "سنة تأمل وتعلّم ومراجعة داخلية؛ ليست كل خطوة مفيدة لازم تكون سريعة أو ظاهرة.", opportunities: "ادرس، ابحث، راجع قراراتك، وامنح نفسك وقتًا لفهم ما تريده فعلًا.", avoid: "تجنب العزلة الكاملة والشك المفرط وتأجيل الحياة انتظارًا لليقين." },
      8: { title: "الإنجاز والإدارة", energy: "سنة طموح ونتائج ومسؤولية مادية؛ تحتاج إدارة عادلة وواقعية للموارد.", opportunities: "فاوض، نظّم ميزانيتك، طوّر مشروعًا، واطلب مقابلًا مناسبًا لعملك.", avoid: "تجنب صراع السيطرة والمخاطرة المالية غير المحسوبة وربط قيمتك بالإنجاز وحده." },
      9: { title: "الإكمال والتحرير", energy: "سنة حصاد وإغلاق دورات قديمة وإفساح مساحة لما هو قادم.", opportunities: "أنهِ مشروعًا، سامح دون إنكار الأذى، وتخلّص من التزامات لم تعد مناسبة.", avoid: "تجنب التعلق بما انتهى أو اتخاذ قرارات مصيرية بدافع لحظة عاطفية." }
    },
    birthday: {
      1: { title: "المبادرة", skill: "موهبتك الفطرية هي بدء الحركة واتخاذ القرار وصناعة طريقك الخاص.", practice: "نمِّ مهارة القيادة مع تعلّم الاستماع وتقبّل المساعدة." },
      2: { title: "الالتقاط والتعاون", skill: "موهبتك هي قراءة الأجواء، ملاحظة الفروق الدقيقة، وبناء الجسور بين الناس.", practice: "حوّل حساسيتك إلى تواصل واضح بدل كتمان احتياجاتك." },
      3: { title: "التعبير والإبداع", skill: "موهبتك هي تحويل الأفكار والمشاعر إلى كلام أو فن أو حضور اجتماعي.", practice: "درّب موهبتك على الاستمرارية، لا على الإلهام وحده." },
      4: { title: "التنظيم والإتقان", skill: "موهبتك هي ترتيب الفوضى، بناء الأنظمة، وملاحظة ما يحتاج إلى إصلاح.", practice: "وازن بين الدقة والمرونة ولا تجعل الكمال يمنع البداية." },
      5: { title: "التكيّف والاستكشاف", skill: "موهبتك هي سرعة التعلّم والتأقلم وربط خبرات وأفكار متنوعة.", practice: "وجّه فضولك إلى مشروع تكمله بدل القفز بين البدايات." },
      6: { title: "الرعاية والذوق", skill: "موهبتك هي دعم الآخرين، خلق الانسجام، والإحساس بما يجعل المكان أو العلاقة أدفأ.", practice: "قدّم الرعاية بحدود واضحة ولا تخلط الحب بالتضحية المستمرة." },
      7: { title: "البحث والتحليل", skill: "موهبتك هي السؤال العميق، اكتشاف الأنماط، والتفكير المستقل.", practice: "شارك ما تتعلمه ولا تنتظر معرفة كاملة قبل التحرك." },
      8: { title: "الإدارة والتنفيذ", skill: "موهبتك هي تنظيم الموارد، تحمّل المسؤولية، وتحويل الهدف إلى نتيجة ملموسة.", practice: "استخدم نفوذك بعدل واعتبر التعاون قوة لا تهديدًا." },
      9: { title: "الرؤية والإنسانية", skill: "موهبتك هي رؤية الصورة الكبيرة والتعاطف وربط التجربة بمعنى أوسع.", practice: "ساعد بوعي، مع التمييز بين التعاطف وتحمل ما ليس مسؤوليتك." },
      11: { title: "الإلهام والحدس", skill: "في القراءة الرمزية للأرقام الرئيسية، يشير 11 إلى التقاط الأفكار والإلهام والحساسية للمعنى.", practice: "حوّل الإلهام إلى خطوات واقعية، وراجع انطباعاتك بدل اعتبارها حقائق مؤكدة." },
      22: { title: "البناء واسع النطاق", skill: "يشير 22 إلى الجمع بين الرؤية العملية والتنظيم والقدرة على تحويل فكرة كبيرة إلى خطة.", practice: "قسّم الهدف الكبير إلى مراحل، واطلب دعمًا مناسبًا بدل حمل كل شيء وحدك." }
    },
    maturity: {
      1: { title: "استقلال وقيادة", mature: "مع النضج، يزيد تركيزك على الاستقلال والمبادرة وصنع قرارك بنفسك.", balance: "القيادة الأثبت تجمع الحسم مع الإصغاء والتعاون." },
      2: { title: "شراكة واتزان", mature: "مع النضج، تتقدم مهارة التعاون والدبلوماسية وبناء علاقات متوازنة.", balance: "لا تجعل السلام الظاهري أهم من التعبير الصريح عن احتياجاتك." },
      3: { title: "صوت وإبداع", mature: "مع النضج، قد يصبح التعبير والإبداع والتعليم أو التواصل مساحة أكبر في حياتك.", balance: "امنح موهبتك نظامًا يساعدها على الاكتمال." },
      4: { title: "أساس واستمرارية", mature: "مع النضج، تبرز قيمة البناء طويل المدى والمسؤولية والمهارة المتقنة.", balance: "اترك مكانًا للتجديد حتى لا يتحول الاستقرار إلى جمود." },
      5: { title: "حرية وتجربة", mature: "مع النضج، تتعلم أن تصنع حرية واعية عبر التجربة والتغيير وتوسيع الخبرة.", balance: "اختر التغيير الذي يخدم اتجاهك، لا التغيير لمجرد الهروب." },
      6: { title: "رعاية ومسؤولية", mature: "مع النضج، قد تتقدم موضوعات الأسرة والخدمة والجمال وبناء بيئة آمنة.", balance: "المسؤولية الصحية لا تعني أن تحمل كل شيء عن الجميع." },
      7: { title: "حكمة وفهم", mature: "مع النضج، يتعمق البحث والتأمل والاستقلال الفكري وفهم دوافعك.", balance: "اجمع بين التفكير والخبرة الحية، وابقَ متصلًا بالناس." },
      8: { title: "إدارة وأثر", mature: "مع النضج، تتقدم الإدارة والإنجاز وتنظيم الموارد وصناعة أثر ملموس.", balance: "قِس النجاح بما تبنيه وبطريقة بنائه، لا بالمكانة وحدها." },
      9: { title: "معنى وخدمة", mature: "مع النضج، تتوسع الرؤية الإنسانية والرغبة في إكمال الدورات ومشاركة الخبرة.", balance: "ساعد من موقع الاختيار والحدود، لا من الشعور بالذنب." },
      11: { title: "إلهام واعٍ", mature: "يشير 11 رمزيًا إلى نضج الحس الإلهامي والقدرة على نقل فكرة ملهمة للآخرين.", balance: "ثبّت رؤيتك بالتعلم والحقائق والعمل اليومي." },
      22: { title: "رؤية تتحول إلى واقع", mature: "يشير 22 رمزيًا إلى نضج القدرة على تحويل رؤية كبيرة إلى بناء عملي يستمر.", balance: "ابدأ بما تقدر عليه، ووزّع المسؤولية على فريق." },
      33: { title: "تعاطف ومسؤولية", mature: "يشير 33 رمزيًا إلى نضج الرعاية والتعليم وخدمة الآخرين بوعي.", balance: "لا تجعل خدمة الناس تلغي احتياجاتك وحدودك الشخصية." }
    }
  });

  function reduceNumber(value, preserveMaster) {
    let n = Math.abs(Math.trunc(Number(value)));
    if (!Number.isFinite(n) || n === 0) return 0;
    while (n > 9) {
      if (preserveMaster && (n === 11 || n === 22 || n === 33)) return n;
      n = String(n).split("").reduce(function (sum, digit) { return sum + Number(digit); }, 0);
    }
    return n;
  }

  function calculatePersonalYear(day, month, year) {
    const targetYear = Number(year == null ? new Date().getFullYear() : year);
    const sum = Number(day) + Number(month) + String(targetYear).split("").reduce(function (a, digit) { return a + Number(digit); }, 0);
    return { value: reduceNumber(sum, false), rawTotal: sum, year: targetYear };
  }

  /* الشهر والأيام الشخصية: السنة الشخصية (1–9) + رقم الشهر الميلادي، ثم اليوم الشخصي = الشهر الشخصي + رقم اليوم؛
     يُحفظ 11 و22 فقط (الخانات 1–9 و11 و22). */
  const AR_MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  function reduceKeep1122(value) {
    let n = Math.abs(Math.trunc(Number(value)));
    if (!Number.isFinite(n)) return 0;
    while (n > 9 && n !== 11 && n !== 22) n = String(n).split("").reduce(function (sum, digit) { return sum + Number(digit); }, 0);
    return n;
  }
  function calculatePersonalMonth(day, month, targetYear, refDate) {
    const ref = refDate && typeof refDate.getMonth === "function" ? refDate : new Date();
    const year = Number(targetYear == null ? ref.getFullYear() : targetYear);
    const py = calculatePersonalYear(day, month, year);
    const calMonth = ref.getMonth() + 1, raw = py.value + calMonth;
    return { value: reduceKeep1122(raw), rawTotal: raw, calendarMonth: calMonth, year: year, personalYear: py.value };
  }
  function calculatePersonalDay(day, month, targetYear, refDate) {
    const ref = refDate && typeof refDate.getMonth === "function" ? refDate : new Date();
    const pm = calculatePersonalMonth(day, month, targetYear, ref);
    const calDay = ref.getDate(), raw = pm.value + calDay;
    return { value: reduceKeep1122(raw), rawTotal: raw, calendarDay: calDay, personalMonth: pm.value, year: pm.year };
  }
  /* خانة نص من name_data.json: تُستخدم فقط إن كانت مكتملة؛ الخانة الفارغة لا تعرض أي نص عام. */
  function slotEntry(nameData, key, number) {
    const group = nameData && nameData[key] && nameData[key].numbers;
    const e = group && group[String(number)];
    return e && Array.isArray(e.sections) && e.sections.some(function (x) { return x && String(x.content || "").trim(); }) ? e : null;
  }

  function calculateBirthdayNumber(day) {
    const raw = Number(day);
    if (!Number.isInteger(raw) || raw < 1 || raw > 31) throw new RangeError("يوم الميلاد لازم يكون من 1 إلى 31.");
    return { value: reduceNumber(raw, true), rawTotal: raw };
  }

  function calculateMaturityNumber(lifePathNumber, expressionNumber) {
    const raw = Number(lifePathNumber) + Number(expressionNumber);
    return { value: reduceNumber(raw, true), rawTotal: raw };
  }

  // Expanded editorial layer: deeper skill and maturity readings, kept separate
  // from the concise labels above so each number can grow without changing calculations.
  const EXTRA_DEEP_READINGS = Object.freeze({
    birthday: {
      1: { essence: "موهبتك الأساسية هي المبادرة: تقدر تلاحظ إن في حاجة لازم تبدأ، وتتحرك قبل ما الطريق يبقى مضمون بالكامل. قوتك مش مجرد حب القيادة، لكن تحويل الفكرة إلى أول خطوة واضحة وتحمل مسؤولية اختيارك.", shadow: "الظل يظهر لما تتحول المبادرة إلى استعجال أو لما تعتبر طلب المساعدة انتقاصًا من استقلالك. ممكن تبدأ بقوة ثم ترفض الملاحظات، أو تدخل في منافسة غير ضرورية عشان تثبت إنك قادر.", growth: "درّب نفسك على قيادة مشروع صغير من البداية للنهاية، مع سؤال شخص تثق فيه عن نقطة واحدة تحتاج تحسينًا. قبل أي قرار مهم، اكتب الهدف والمخاطرة وخطة الرجوع، وميّز بين الجرأة والرغبة في إثبات الذات.", reflection: "إيه الحاجة اللي تقدر تبدأها بإيدك، وإيه الجزء اللي محتاج تتعلم فيه التعاون بدل ما تشيله وحدك؟" },
      2: { essence: "موهبتك هي التقاط الفروق الدقيقة وبناء الجسور بين الناس. تلاحظ النبرة والتوقيت وما لم يُقل، وتقدر تساعد طرفين مختلفين يلاقوا لغة مشتركة من غير ما يتحول الخلاف لمعركة.", shadow: "حساسيتك ممكن تتحول إلى مراقبة زائدة لردود فعل الآخرين، أو إلى تنازل مستمر خوفًا من الرفض. أحيانًا تفهم احتياجات الناس بسرعة لكن تتأخر في قول احتياجاتك أنت.", growth: "مارس الإصغاء ثم لخّص ما فهمته قبل تقديم الحل. وفي المقابل، عبّر عن رأيك بوضوح بجملة تبدأ بـ«أنا محتاج» أو «أنا مش مناسب ليّ». التعاون لا يعني أنك مسؤول عن مشاعر الجميع.", reflection: "فين قدرتك على تهدئة الأمور بتساعدك، وفين بتخليك تخفي رأيك الحقيقي؟" },
      3: { essence: "موهبتك هي تحويل الأفكار والمشاعر إلى كلام وصورة وحضور. عندك قابلية لشرح المعقد بطريقة قريبة، وصناعة معنى يعلق في ذهن الناس، سواء عبر الكتابة أو الحديث أو الفن أو المحتوى.", shadow: "الظل هو الاعتماد على الحماس بدل الاستمرارية، أو استخدام الدعابة والكلام الكثير لتجنب شعور أصعب. ممكن تبدأ مشاريع إبداعية عديدة وتتركها عندما يختفي بريق البداية.", growth: "اختار وسيلة تعبير واحدة لمدة شهر، وحدد مخرجًا أسبوعيًا صغيرًا: نص أو تسجيل أو تصميم. راجع ما يصل للناس فعلًا بدل قياس موهبتك برد فعل لحظي، واسمح لنفسك بالتعبير الصادق لا الأداء المستمر.", reflection: "إيه الفكرة اللي جواك وتستحق تخرج للنور حتى لو مش كل الناس هتفهمها من أول مرة؟" },
      4: { essence: "موهبتك هي تنظيم الفوضى وتحويل النوايا إلى خطوات قابلة للتكرار. تلاحظ الثغرات، وتحب أن يكون للعمل أساس واضح ومعيار جودة، وده يخليك مناسبًا للبناء والتخطيط والمتابعة.", shadow: "لما يزيد القلق، ممكن تتمسك بالطريقة المألوفة حتى لو لم تعد مناسبة، أو تؤجل البداية لأنك تريد نظامًا كاملًا من أول يوم. الدقة تتحول وقتها إلى صرامة مع نفسك والآخرين.", growth: "ابنِ نظامًا بسيطًا يمكن الاستمرار عليه، ثم حسّنه تدريجيًا بدل انتظار الكمال. حدد ما يجب أن يكون دقيقًا فعلًا وما يمكن تجربته، وضع وقتًا للمراجعة ووقتًا للراحة.", reflection: "إيه النظام اللي بيسند حياتك، وإيه النظام اللي بقيت خادمًا له بدل ما يخدمك؟" },
      5: { essence: "موهبتك هي التكيّف والتعلّم من التجربة وربط أفكار من مجالات مختلفة. غالبًا تلتقط الفرص عندما يتغير المشهد، وتعرف تتحرك بين الناس أو المهام من غير ما تفقد فضولك.", shadow: "الظل يظهر في التشتت أو مطاردة التجديد لمجرد الهروب من الملل. قد تخلط بين الحرية وغياب الالتزام، فتترك شيئًا مفيدًا قبل أن تظهر ثماره.", growth: "اختر مجالًا رئيسيًا تتعمق فيه، واترك مساحة محددة للتجارب الجديدة. قبل الانسحاب من التزام، اسأل نفسك: هل انتهى دوره فعلًا أم أنني وصلت فقط إلى الجزء الذي يحتاج صبرًا؟", reflection: "إيه التغيير اللي هيوسع حياتك فعلًا، وإيه التغيير اللي بتستخدمه للهروب من خطوة صعبة؟" },
      6: { essence: "موهبتك هي الرعاية وصناعة الانسجام والانتباه لما يجعل الناس أو المكان يشعرون بالأمان. قد تظهر في التعليم أو التصميم أو الدعم أو تنظيم الحياة اليومية، حيث تجمع بين الذوق والمسؤولية.", shadow: "الرعاية قد تنقلب إلى إنقاذ وسيطرة ناعمة، أو إلى عطاء زائد يجعلك تنتظر التقدير ثم تشعر بالخذلان. ليس كل احتياج حولك مسؤوليتك، وليس كل اختلاف علامة على فشل العلاقة.", growth: "اسأل قبل المساعدة: هل الشخص يريد نصيحة أم حضورًا فقط؟ خصص وقتًا لاحتياجاتك مثلما تخصصه للآخرين، وتعلم تقديم الدعم مع حدود واضحة واتفاقات متبادلة.", reflection: "إزاي تقدر تهتم بحد من غير ما تتحمل عنه مسؤولية اختياراته؟" },
      7: { essence: "موهبتك هي البحث والتحليل وملاحظة الأنماط خلف التفاصيل. تميل إلى السؤال عن السبب، واختبار التفسيرات، والتعلم المستقل، وقد تتألق في البحث أو الاستراتيجية أو الكتابة المتخصصة أو حل المشكلات.", shadow: "قد يتحول التفكير إلى اجترار، والخصوصية إلى عزلة، والمعايير العالية إلى تأجيل دائم للمشاركة. أحيانًا تنتظر يقينًا كاملًا لا يتوفر قبل التجربة.", growth: "حوّل كل سؤال كبير إلى فرضية صغيرة واختبار عملي. شارك ما تعلمته قبل أن تشعر أنك خبير في كل شيء، ووازن وقت التفكير بتجربة واقعية وحديث مع شخص تثق به.", reflection: "إيه السؤال اللي يستحق بحثًا أعمق، وإيه الإجابة اللي لن تظهر إلا لما تجرب؟" },
      8: { essence: "موهبتك هي تنظيم الموارد وتحويل الأهداف إلى نتائج ملموسة. عندك قابلية للتفكير في الأولويات والمسؤولية والميزانية والتأثير، ويمكن أن تظهر الموهبة في الإدارة أو ريادة الأعمال أو قيادة مشروع.", shadow: "قد تربط قيمتك بالإنجاز، أو تحاول التحكم في كل التفاصيل لأنك تخشى أن يفسدها الآخرون. عندها تتحول الكفاءة إلى ضغط، وتصبح الراحة أو طلب الدعم أمرًا تشعر بالذنب تجاهه.", growth: "حدد نتيجة قابلة للقياس، ثم وزّع المسؤوليات بوضوح بدل احتكارها. راجع نجاحك بمعيارين: ما الذي أنجزته، وكيف عاملت نفسك والناس أثناء إنجازه؟", reflection: "إيه النتيجة اللي تريد تحقيقها، وإيه الثمن اللي لم تعد مستعدًا تدفعه من صحتك أو علاقاتك؟" },
      9: { essence: "موهبتك هي رؤية الصورة الكبيرة وربط التجربة بمعنى إنساني أوسع. قد تلتقط ما يجمع الناس رغم اختلافهم، وتترجم الخبرة إلى فن أو تعليم أو خدمة أو رسالة ذات أثر.", shadow: "التعاطف قد يجعلك تحمل آلامًا ليست مسؤوليتك، أو تتمسك بدور المنقذ. وقد ترفع توقعاتك من الناس ثم تصاب بخيبة عندما لا يتصرفون وفق الصورة المثالية التي رسمتها.", growth: "اختر قضية أو مشروعًا تستطيع خدمته بحدود واضحة. تعاطف من غير أن تلغي احتياجاتك، واسمح للآخرين بتحمل مسؤولية قراراتهم حتى لو كنت قادرًا على التدخل.", reflection: "إيه الأثر اللي تريد تركه، وإزاي تحققه من غير ما تفقد نفسك في الطريق؟" },
      11: { essence: "في القراءة الرمزية للرقم الرئيسي 11، ترتبط الموهبة بالإلهام والتقاط الروابط والمعاني التي قد لا يلاحظها الآخرون سريعًا. يمكن أن تظهر في الإبداع أو الإرشاد أو نقل فكرة تفتح زاوية جديدة للتفكير.", shadow: "كثرة الانطباعات قد تتحول إلى توتر أو مبالغة في تفسير المصادفات، أو إلى انتظار لحظة إلهام مثالية. الحدس إحساس يستحق الإصغاء، لكنه ليس دليلًا كافيًا وحده على صحة الاستنتاج.", growth: "دوّن الفكرة ثم اختبرها بالمعلومات والخبرة والحوار. ثبّت الإلهام بروتين عملي، واعتنِ بالنوم والهدوء والحدود الرقمية عندما تشعر بكثرة التحفيز.", reflection: "إيه الإلهام اللي يستحق أن تحوله إلى عمل ملموس، وما الدليل الذي تحتاجه قبل أن تبني عليه قرارًا؟" },
      22: { essence: "يرمز 22 إلى جمع الرؤية الواسعة مع القدرة على البناء العملي. موهبتك المحتملة هي تقسيم فكرة كبيرة إلى مراحل وموارد وأدوار، ثم إنشاء شيء يمكن للآخرين استخدامه والاستمرار فيه.", shadow: "قد يصبح حجم الرؤية عبئًا يجعلك تؤجل البداية، أو تحمل كل المسؤوليات لأنك ترى الصورة كاملة ولا تثق بأن غيرك سيفهمها. الطموح الكبير من غير مراحل واضحة يتحول إلى ضغط دائم.", growth: "قسّم المشروع إلى نسخة أولى صغيرة، واكتب ما يلزم لكل مرحلة ومن المسؤول عنها. قِس التقدم بما اكتمل، لا بحجم الصورة المثالية التي لم تصل إليها بعد، واطلب مساعدة متخصصة عند الحاجة.", reflection: "إيه النسخة الصغيرة الواقعية من رؤيتك الكبيرة التي تستطيع إنجازها خلال الشهر القادم؟" },
      33: { essence: "في القراءة الرمزية للرقم الرئيسي 33، تبرز موهبة الرعاية والتعليم وتحويل الخبرة إلى دعم نافع للآخرين. قد تجمع بين التعاطف والقدرة على شرح ما تعلمته بطريقة تمنح الناس مساحة للنمو.", shadow: "قد تشعر أنك مطالب بإنقاذ الجميع أو أن قيمتك تأتي من التضحية. ومع الوقت، يمكن أن يتحول العطاء إلى إنهاك أو استياء صامت إذا لم تكن هناك حدود وتبادلية.", growth: "ساعد من موقع الاختيار لا الشعور بالواجب الدائم. حدد وقتًا وموارد واضحة للعطاء، واسمح لنفسك بتلقي الدعم، وتذكر أن تمكين الشخص أفضل من اتخاذ حياته نيابة عنه.", reflection: "إزاي تقدر تخدم غيرك بطريقة مستدامة، من غير ما تجعل التضحية شرطًا لقيمتك؟" }
    },
    maturity: {
      1: { essence: "مرحلة النضج هنا ترمز إلى تقوية الاستقلال وصنع القرار وإطلاق مبادرات تحمل بصمتك. يصبح السؤال أقل ارتباطًا بإرضاء التوقعات وأكثر ارتباطًا بما تريد أن تبنيه باسمك.", shadow: "الخطر هو تحويل الاستقلال إلى عزلة، أو اعتبار التراجع عن رأي علامة ضعف. القيادة الناضجة لا تعني أن تفعل كل شيء وحدك.", practice: "اختر قرارًا مؤجلًا، وحدد له معيار نجاح وخطوة أولى وموعد مراجعة. استمع إلى الرأي المخالف قبل الحسم، ثم تحمل مسؤولية اختيارك.", reflection: "ما القرار الذي يحتاج منك شجاعة هادئة لا معركة لإثبات الذات؟" },
      2: { essence: "يميل النضج إلى تعميق مهارة الشراكة والإنصات وبناء علاقات فيها أخذ وعطاء. تتعلم أن التأثير لا يحتاج دائمًا إلى قيادة ظاهرة، وأن التعاون قد يفتح أبوابًا لا يفتحها الجهد الفردي.", shadow: "قد تخلط السلام بالتنازل، أو تجعل قبول الآخرين مقياسًا لقيمتك. العلاقات المتوازنة تحتاج اختلافًا صريحًا، لا موافقة دائمة.", practice: "تدرّب على محادثة صادقة في موضوع تؤجله، وعبّر عن احتياجك وحدودك بوضوح. قيّم العلاقات من خلال التبادل والاحترام، لا من خلال مقدار ما تتحمله وحدك.", reflection: "أي علاقة تحتاج إلى توازن أو وضوح أكثر في هذه المرحلة؟" },
      3: { essence: "قد يتسع دور التعبير والإبداع والتعليم والتواصل. تصبح الخبرة التي جمعتها مادة يمكن مشاركتها، ويكون صوتك أكثر نضجًا عندما يجمع بين الحيوية والصدق والقدرة على الإصغاء.", shadow: "التشتت أو الاعتماد على إعجاب الجمهور قد يحرف التعبير عن معناه. ليس كل ظهور تقدمًا، وليس كل صمت اختفاءً.", practice: "اختر مشروعًا إبداعيًا واحدًا يعبّر عنك، وحدد إيقاعًا واقعيًا لنشره أو تطويره. اطلب ملاحظات محددة، واحتفظ بمساحة خاصة لا تتحول فيها كل تجربة إلى محتوى.", reflection: "ما الرسالة التي تريد أن يصل صوتك من خلالها، حتى لو لم تجذب الجميع؟" },
      4: { essence: "يرمز النضج إلى بناء أساس مستقر ومهارة متقنة ونظام يدوم. تصبح قيمة الصبر والتخطيط أوضح، خصوصًا عندما تحوّل الخبرة إلى عمل منظم أو بيت أو مشروع أو معرفة قابلة للنقل.", shadow: "قد تتحول المسؤولية إلى جمود، وتصبح السلامة ذريعة لرفض كل تجديد. الاستقرار المفيد يوفّر أرضًا للحياة، ولا يحبسها.", practice: "راجع التزاماتك: ما الذي يحتاج استمرارًا، وما الذي يحتاج تبسيطًا أو تفويضًا؟ ضع خطة طويلة المدى مع مساحة للتجربة والراحة.", reflection: "ما الأساس الذي تريد أن يبقى، وما العادة التي حان وقت تحديثها؟" },
      5: { essence: "قد تصبح المرونة وتوسيع الخبرة والتغيير الواعي محاور أكبر. النضج هنا لا يعني الحركة المستمرة، بل اختيار التجارب التي توسع حياتك دون أن تشتت اتجاهك.", shadow: "الخطر هو التغيير لمجرد الهروب من الملل أو الالتزام، أو العكس: التعلق بالحرية لدرجة فقدان أي أساس ثابت.", practice: "قبل تغيير كبير، اكتب ما تريد الاقتراب منه وما تريد الابتعاد عنه، ثم جرّب خطوة محدودة قبل اتخاذ قرار نهائي. احتفظ بعادة واحدة تمنحك الاستقرار.", reflection: "هل التغيير الذي تفكر فيه يقربك من قيمة مهمة أم يبعدك عن شعور لا تريد مواجهته؟" },
      6: { essence: "قد تتقدم موضوعات الرعاية والأسرة والجمال والمسؤولية الاجتماعية. يصبح النضج في القدرة على خلق بيئة آمنة، مع فهم أن الحب ليس إدارة حياة الآخرين ولا حمل كل الأعباء عنهم.", shadow: "المثالية والتدخل الزائد قد يرهقانك ويربكان من تحب. وقد تؤجل احتياجاتك الخاصة لأنك تعتقد أن الجميع يعتمد عليك.", practice: "اتفق مع المقربين على مسؤوليات واضحة، واطلب الدعم كما تقدمه. خصص وقتًا لنفسك لا يحتاج إلى تبرير، وتقبل أن العلاقات الجيدة لا تخلو من النقص والاختلاف.", reflection: "ما المسؤولية التي تخصك فعلًا، وما الذي تستطيع مشاركته أو تركه للآخر؟" },
      7: { essence: "يرمز النضج إلى تعميق الفهم والاستقلال الفكري والقدرة على التمييز بين المعلومة والانطباع. قد تنجذب إلى البحث والتعليم والكتابة أو مجالات تتطلب صبرًا على الأسئلة المركبة.", shadow: "قد تنسحب من الحياة طلبًا لليقين، أو تتحول المراجعة إلى شك لا ينتهي. المعرفة التي لا تُختبر قد تبقى فكرة جميلة بلا أثر.", practice: "خصص وقتًا للدراسة وآخر لتطبيق ما تعلمته. شارك نتائجك مع أشخاص يختلفون معك، وحدد ما تعرفه وما لا تعرفه بوضوح.", reflection: "ما الفكرة التي تحتاج إلى اختبار في الواقع بدل التفكير فيها مرة أخرى؟" },
      8: { essence: "قد يتقدم دور الإدارة والإنجاز وتنظيم الموارد وصناعة أثر ملموس. النضج هنا هو استخدام الخبرة والسلطة بمسؤولية، وبناء أنظمة وفرق قادرة على النجاح من دون اعتماد كامل على شخص واحد.", shadow: "قد يصبح العمل هو الهوية الوحيدة، أو تتحول الرغبة في الأمان إلى سيطرة مفرطة ومخاطرات غير محسوبة. المكانة لا تعوّض الصحة أو العلاقات.", practice: "راجع أهدافك المالية والمهنية بالأرقام الواقعية، وفوّض مهمة واحدة بوضوح. اجعل للراحة والعلاقات مكانًا ثابتًا في جدولك، وقِس نجاحك أيضًا بجودة الطريق لا بحجم النتيجة وحدها.", reflection: "كيف تستخدم خبرتك وقوتك لبناء شيء نافع من غير أن تدفع صحتك أو علاقاتك الثمن؟" },
      9: { essence: "قد تتسع الرؤية الإنسانية والرغبة في إكمال الدورات ومشاركة الخبرة. يصبح المعنى والأثر أكثر أهمية، سواء عبر الإبداع أو التعليم أو خدمة قضية أو إغلاق فصل قديم بوعي.", shadow: "قد تتمسك بالماضي بدافع الذنب، أو تتوقع من نفسك أن تكون متسامحًا دائمًا. إكمال دورة لا يعني إنكار الأذى أو إعادة فتح باب لا يناسبك.", practice: "حدد ما يحتاج إلى إكمال وما يحتاج إلى وداع، واكتب ما تعلمته من كل تجربة. ساعد ضمن حدودك، واترك مساحة لاحتياجاتك وخططك الشخصية.", reflection: "ما الذي يستحق أن تأخذه معك، وما الذي حان وقت تركه خلفك؟" },
      11: { essence: "يرمز 11 إلى نضج الإلهام والقدرة على نقل رؤية أو معنى للآخرين. تصبح الحساسية أكثر فائدة عندما تقترن بالخبرة والوضوح والقدرة على تحويل الفكرة إلى لغة مفهومة.", shadow: "قد تتضخم التوقعات أو تشعر بأن عليك تقديم إجابات استثنائية طوال الوقت. الإلهام لا يلغي الحاجة إلى التحقق والحدود والراحة.", practice: "حوّل فكرة ملهمة إلى مشروع صغير يمكن مراجعته، واطلب ملاحظات من أشخاص صريحين. لا تجعل كل إحساس إشارة مؤكدة، بل امنحه مساحة ثم اختبره.", reflection: "ما الفكرة التي تريد إيصالها، وكيف تجعلها مفيدة وقابلة للفهم؟" },
      22: { essence: "يرمز 22 إلى تحويل الرؤية الكبيرة إلى بنية عملية تستمر. قد يتجه النضج نحو إنشاء مشروع أو نظام أو معرفة تخدم عددًا أكبر من الناس، عبر التخطيط وتوزيع الأدوار وإدارة الموارد.", shadow: "قد يبدو الهدف ضخمًا لدرجة الشلل، أو تحمل كل المسؤولية خوفًا من فقدان الجودة. لا يُبنى الأثر الطويل باندفاع فردي مستمر وحده.", practice: "قسّم الرؤية إلى مراحل ومؤشرات واضحة، وابدأ بأصغر نسخة مفيدة. كوّن فريقًا أو اطلب خبرة عند الحاجة، وراجع الخطة بناءً على النتائج بدل التمسك بالتصور الأول.", reflection: "ما الجزء القابل للتنفيذ الآن من المشروع الأكبر الذي تتخيله؟" },
      33: { essence: "يرمز 33 إلى نضج الرعاية والتعليم وخدمة الآخرين بوعي. قد تكون الخبرة التي جمعتها قادرة على مساعدة غيرك عندما تُقدَّم بتواضع وحدود، لا بوصفك مسؤولًا عن إنقاذ الجميع.", shadow: "قد يتحول العطاء إلى واجب لا ينتهي، أو تتجاهل احتياجاتك حتى تشعر بالاستنزاف. لا تحتاج إلى التضحية المستمرة كي تكون شخصًا ذا قيمة.", practice: "اختر شكلًا مستدامًا للعطاء، وحدد له وقتًا وموارد. اسمح للآخرين بالمبادرة وتحمل مسؤولياتهم، وتعلّم استقبال المساندة دون شعور بالذنب.", reflection: "كيف تترك أثرًا رحيمًا من غير أن تجعل نفسك آخر شخص تهتم به؟" }
    }
  });

  // Source-derived full encyclopedia from Aqeq_Astro_Birthday_Maturity_Content.docx.
  // Text is preserved from the provided document; master maturity 11/22 has two sections in that source.
  const BIRTHDAY_MATURITY_READINGS = {"birthday":{"1":{"number":1,"title":"المبادر الأصيل، ورائد البدايات من العدم","subtitle":"لكل من ولد في أيام 1، 10، 19، 28 من أي شهر","sections":[{"title":"الجوهر والموهبة الخام","content":"أنت نازل الدنيا ومعاك \"شرارة البدء الأولى\". في علم الأرقام، رقم 1 محكوم بطاقة الشمس؛ يعني أنت مش معمول عشان تكون نسخة مكررة من حد، ولا عشان تنفذ خطط روتينية حطها غيرك. موهبتك الفطرية هي \"الريادة من الصفر\": قدرة استثنائية على شق طريق في أرض صحرا، واتخاذ أول خطوة والكل واقف متردد وخايف. بتمتلك حضوراً انفرادياً حاسماً، وشجاعة كسر المسارات التقليدية. أول ما بتدخل في أي مشكلة، عقلك بيشتغل فوراً على حلول خارج الصندوق مبيشوفهاش حد غيرك."},{"title":"النبض النفسي والعاطفي الداخلي","content":"بتحس باختناق حقيقي وموت بطيء لو اتحطيت في وظيفة روتينية أو كان فوق راسك مدير بيعد عليك خطواتك. التبعية بالنسبة لك إهانة لكرامتك. في نفس الوقت، من جوه، بتعاني من وحدة نفسية شديدة وصامتة؛ لأنك دايماً اللي في وش المدفع، ودايماً الناس متوقعة منك الحل والقوة، فبتحس إن مفيش حد في الدنيا دي تقدر تسند ضهرك عليه. جواك صراع سري بين رغبتك في الاستقلال الكامل وبين أمنيتك إنك تلاقي شريك أو صاحب يفهمك من غير ما يحاول يسيطر عليك."},{"title":"التفعيل المالي والتنفيذي","content":"رزقك مربوط بـ \"الاستقلال وريادة الأعمال\". إنت مش معمول عشان تكون ترس في مكنة غيرك؛ مجالك الأنجح هو البيزنس الخاص، العلامات التجارية الشخصية، أو تسلم إدارة أزمات معقدة في شركات محتاجة إعادة هيكلة وقرارات صلبة وجريئة. الفلوس بتجيلك لما تكون أنت صاحب الرؤية والقرار الأول، ولما تثق في حدسك التنفيذي وماتستناش إجماع من الناس عشان تبدأ."},{"title":"فخ الظل ونقاط التعطيل","content":"فخ \"العند التدميري والأنا المتضخمة\". لما طاقتك بتنحرف، بتتحول لشخص متسلط، يرفض يستمع لأي رأي مخالف، وبيعتبر أي نصيحة كأنها هجوم على كرامته. الفخ التاني هو \"متلازمة الذئب الوحيد\"؛ إنك ترفض تطلب مساعدة أو تفوض مهام لحد بدافع الكبرياء، لحد ما تشيل كل الحمول لوحدك وتنهار صحياً وعصبياً."},{"title":"الروشتة وسؤال التأمل","remedy":"اتعلم تفرق بين \"الاستقلال\" و\"الانعزال\". القيادة الحقيقية مش إنك تعمل كل حاجة لوحدك، القيادة إنك تصنع الرؤية وتجمع فريق تثق فيه ينفذ معاك ويديك مساحة تركز على الخطوة الجاية.","reflection":"هل رفضك لمساعدة اللي حواليك نابع من ثقة حقيقية في نفسك، ولا من خوف خفي إن حد يشاركك مجد النجاح؟"}]},"2":{"number":2,"title":"الرادار النفسي، هندسة التناغم، والقوة الناعمة","subtitle":"لكل من ولد في أيام 2، 11، 20 من أي شهر","sections":[{"title":"الجوهر والموهبة الخام","content":"أنت نازل الدنيا ومعاك \"رادار عاطفي لا سلكي فائق الحساسية\". رقم 2 محكوم بطاقة القمر وعنصر الماء؛ موهبتك مش الصوت العالي ولا الخناق، موهبتك هي \"القوة الناعمة واستبصار النفوس\". بتعرف تقرأ لغة الجسد، النبرة المكتومة، والمشاعر اللي الناس بتخبيها ورا الابتسامات. عندك هبة فطرية في امتصاص الصدمات، تقريب وجهات النظر بين طرفين مستحيل يتفقوا، وتفكيك ألغام النزاعات بهدوء ودبلوماسية ساحرة."},{"title":"النبض النفسي والعاطفي الداخلي","content":"روحك عاملة زي الإسفنجة؛ بتدخل أي مكان بتمتص طاقته في ثوانٍ. لو المكان مشحون بغضب أو نفاق، أعصابك وجسمك بيتعبوا فوراً وتجيلك صداع أو وجع في المعدة. خوفك الأكبر هو النبذ، الصدام، أو إنك تكون سبب في زعل حد، وده بيخليك تضغط على نفسك وتكبت رغباتك عشان متخسرش اللي حواليك، وده بيولد جواك بركان زعل صامت ومستتر بيخرج في صورة عتاب مرير أو انسحاب مفاجئ."},{"title":"التفعيل المالي والتنفيذي","content":"الفلوس والنفوذ بيجولك من \"وراء الكواليس\". إنت \"صانع الملوك\". مكانتك بتعلى في: الإرشاد النفسي والعاطفي، التفاوض الدبلوماسي، صياغة العقود والشراكات الكبرى، الموارد البشرية، الوساطة التجارية، وأي عمل بيعتمد على بناء شبكة علاقات قوية وسرية مبنية على الثقة التامة."},{"title":"فخ الظل ونقاط التعطيل","content":"الذوبان في الآخرين ولعب دور \"الضحية الصامتة\". لما طاقتك بتنحرف، بتمسح حدودك الشخصية تماماً، وتوافق على حاجات مش عايزها، وتتحول لمجرد مرآة ترضي اللي حواليك على حساب صحتك وكرامتك. الفخ التاني هو الكتمان؛ تبلع الزعل وتسكت لحد ما تنفجر في وقت غلط وتخسر علاقات مهمة."},{"title":"الروشتة وسؤال التأمل","remedy":"افهم إن كلمة \"لأ\" مش قلة ذوق ولا خيانة لحد؛ \"لأ\" هي السور اللي بيحمي بستانك النفسي. افصل طاقتك يومياً بالماء المالح والتأمل عشان تفرغ شحنات الناس من جسمك.","reflection":"مين في حياتك بيستهلك رصيدك النفسي وإنت مكسوف تواجهه أو تحطله حدود عشان خايف تخسره؟"}]},"3":{"number":3,"title":"سحر الكلمة، الجاذبية، وتفجير طاقة الإبداع","subtitle":"لكل من ولد في أيام 3، 12، 21، 30 من أي شهر","sections":[{"title":"الجوهر والموهبة الخام","content":"أنت وريث \"طاقة البيان والتعبير والضوء\". رقم 3 محكوم بكوكب المشتري (كوكب التوسع والحظ والوفرة)؛ موهبتك هي إحياء المعاني بالكلمة أو الصوت أو الصورة. عندك كاريزما فطرية بتخلي الناس تلتف حواليك وتصدق كلامك؛ بتعرف تاخد فكرة معقدة وجافة جداً وتحولها لحكاية شيقة تلمس القلب وتتحفر في الذاكرة. حضورك لوحده بيضفي بهجة وطاقة حركة في أي مكان تدخله."},{"title":"النبض النفسي والعاطفي الداخلي","content":"دماغك مكنة أفكار شغالة ليل نهار مابتفصلش؛ كل دقيقة بتولد فكرة وسيناريو إبداعي جديد. مشكلتك النفسية هي تقلب المزاج السريع ورعبك الداخلي من التجاهل أو النقد. لما بتزعل أو تتجرح، بتهرب لقدام ورا قناع من الضحك والهزار والتهريج المستمر عشان محدش يشوف ضعفك أو يطردك من دايرة الاهتمام."},{"title":"التفعيل المالي والتنفيذي","content":"رزقك وفلوسك مربوطين بـ \"ظهورك وصوتك\". كل ما اتكلمت وشاركت إبداعك، كل ما الحظ فتحلك أبوابه. تتألق في: صناعة المحتوى المرئي، الإعلام والتقديم، الكتابة والتأليف، الإعلانات والتسويق القائم على السرد القصصي، التدريس الملهم، والتمثيل أو الفنون. الابتكار عندك مش رفاهية؛ هو وسيلتك الأولى للثروة."},{"title":"فخ الظل ونقاط التعطيل","content":"التشتت وضياع الموهبة على الفاضي! فخ الـ 3 القاتل هو إنه يبدأ عشرين مشروع بنفس الحماس، وأول ما النشوة الأولى تخلص يرميهم وميكملش ولا واحد. الفخ التاني هو الغرق في الثرثرة، السطحية، والدراما الاجتماعية، وتضييع الطاقة الذهنية عشان يدور على تصفيق وإعجاب مؤقت."},{"title":"الروشتة وسؤال التأمل","remedy":"الموهبة من غير انضباط هي حبر على ورق. الزم نفسك بإنهاء فكرة واحدة ومهمة واحدة قبل ما تنط للفكرة الجديدة. واستخدم صوتك وفنك للتعبير عن مشاعرك الحقيقية مش للهرب منها.","reflection":"إيه الفكرة الإبداعية اللي دايماً بتأجلها وبتلهي نفسك عنها بمشاريع تافهة، وجه الوقت تركز عليها وتخرجها للنور؟"}]},"4":{"number":4,"title":"مهندس الواقع، حارس الأمان، وصانع المؤسسات الراسخة","subtitle":"لكل من ولد في أيام 4، 13، 31 من أي شهر","sections":[{"title":"الجوهر والموهبة الخام","content":"وهبك الكون \"عين الميزان والهندسة الواقعية\". رقم 4 محكوم بطاقة كوكب أورانوس وعنصر الأرض الصارم؛ موهبتك الفطرية مش إطلاق كلام في الهواء، موهبتك هي أخذ الأفكار وتنزيلها على أرض صلبة في صورة نظام، جدول، أصول مادية، ومؤسسة تعيش لعشرات السنين. عندك قدرة نادرة على رؤية الثغرات التنفيذية والإدارية اللي يعمى عنها الجميع، وتعرف إزاي تحول الفوضى العارمة لمنظومة عمل دقيقة ومحكمة."},{"title":"النبض النفسي والعاطفي الداخلي","content":"الأمان والوضوح هما شرطك الأول للتنفس؛ بتكره التردد، الوعود الفضفاضة، والارتجال غير المدروس. جواك هاجس عميق لحماية مستقبلك ومستقبل عيلتك بجدران أمان سميكة. من جوه، بتعاني أحياناً من إرهاق شديد لأنك حابس نفسك في دور \"العمود الفقري\" اللي مينفعش يضعف، وبيصعب عليك الاسترخاء التام لإحساسك الدائم بإن \"في التزامات ومسؤوليات مستنية الإنجاز\"."},{"title":"التفعيل المالي والتنفيذي","content":"رزقك وثروتك بيجوا من \"الأصول الثابتة والمشروعات طويلة المدى\". مجالك مش المكاسب السريعة العشوائية، بل المشاريع التراكمية. تتألق في: إدارة العمليات، الاستثمار العقاري، التخطيط المالي والرقابي، البرمجة وهندسة النظم، تأسيس الشركات، وضبط الجودة. الفلوس بتجيلك لما تثبت للناس إنك الشخص الوحيد القادر على حفظ أموالهم وإدارتها بلا خطأ واحد."},{"title":"فخ الظل ونقاط التعطيل","content":"فخ التصلب والتحجر الفكري. في طاقة الظل، بيخليك الخوف من المجهول أو الفقر شخصاً رافضاً لأي تجديد، متمسكاً بروتين قاتل حتى لو ثبت فشله. قد تتحول لناقد قاسي لمن حولك، أو تسقط في البخل العاطفي والمادي لأنك بتحسب كل حاجة بمنطق الأرقام الجافة، وده بيعمل جفاف وبرود في علاقاتك."},{"title":"الروشتة وسؤال التأمل","remedy":"افهم إن \"المرونة مش تنازل عن النظام\". اسمح بمساحة عفوية في يومك. خصص وقتاً إجبارياً للراحة واللعب من غير ما تقيسه بالإنتاجية وحسابات الفلوس.","reflection":"إيه الحاجة اللي إنت متمسك بالسيطرة عليها خوفاً من المجهول، في حين إنك لو سبتها ومرّنت عقلك هترتاح أضعاف؟"}]},"5":{"number":5,"title":"المحول الزئبقي، صياد الفرص، وفاتح الآفاق","subtitle":"لكل من ولد في أيام 5، 14، 23 من أي شهر","sections":[{"title":"الجوهر والموهبة الخام","content":"أنت صاحب \"الذكاء الحركي والتكيف المطلق\". رقم 5 محكوم بكوكب عطارد (كوكب الفكر، السرعة، والتواصل)؛ موهبتك هي التقاط الفرص وهي طايرة في الهواء، وقراءة اتجاهات الناس والسوق قبل أي حد. تمتلك مرونة تشبه الماء؛ تضع نفسك في أي بيئة أو أزمة وتخرج منها كسبان. لسانك ذكي، حضورك مفعم بالحياة، وعندك براعة نادرة في الربط بين عوالم وأفكار تبدو للناس متناقضة تماماً."},{"title":"النبض النفسي والعاطفي الداخلي","content":"الروتين والسكون بمثابة موت نفسي ليك. عقلك بيتغذى على التجديد، السفر، والمحفزات الفكرية والبصرية. بتحس بملل خاطف من أي علاقة أو وظيفة تصبح مكررة، وبتخاف جداً من \"الحبس\" في قالب ثابت. جواك صراع أزلي بين حاجتك للحرية المطلقة وبين خوفك الخفي من إنك متلاقيش أرضية ثابتة ترجع تسند عليها لما تتعب."},{"title":"التفعيل المالي والتنفيذي","content":"الفلوس بتتدفق ليك من الحركة والتواصل المتجدد. مجالك مش المكاتب المغلقة، بل المهام القائمة على النتائج والتأثير السريع. تتألق في: المبيعات الكبرى، التجارة والاستيراد والتصدير، الحملات التسويقية الفيروسية، السفر والسياحة، صناعة المحتوى الاستكشافي، والوساطة في الصفقات اللي بتحتاج إقناع ذكي وسرعة بديهة."},{"title":"فخ الظل ونقاط التعطيل","content":"التشتت والهروب وفقدان البوصلة! فخ الـ 5 الأكبر هو إنه يبدأ مشروع بحماس طاغي، وأول ما تبان تفاصيل الروتين اليومية يهرب لمشروع تاني بحثاً عن الإثارة ويسيب اللي بناه ينهار. كمان معرض للهروب من الضغوط العاطفية ورا الإدمانات الحسية (شراء قهري، إفراط في ملذات، أو علاقات سطحية عابرة) تسحب طاقته وتسيبه خاوي الوفاض."},{"title":"الروشتة وسؤال التأمل","remedy":"اعلم إن \"الحرية الحقيقية بيحميها الانضباط\". التزم بإنهاء ما بدأته حتى لو الحماس الأول خف. واعتمد على شريك منظم (يحمل طاقة 4 أو 8) يمسك التفاصيل وراك بينما تنطلق أنت لجلب الصفقات.","reflection":"هل تبديلك المستمر لقراراتك نابع من تطوير حقيقي، ولا هروب من التزامات ومسؤوليات محتاجة منك صبر؟"}]},"6":{"number":6,"title":"القلب الحاضن، مهندس التناغم الأسري، وملاذ الشفاء","subtitle":"لكل من ولد في أيام 6، 15، 24 من أي شهر","sections":[{"title":"الجوهر والموهبة الخام","content":"موهبتك هي \"غريزة الرعاية وبناء الملاذ الآمن\". رقم 6 محكوم بكوكب الزهرة (كوكب الحب والجمال والانسجام)؛ موهبتك الفطرية هي إشاعة الدفء، التوازن النفسي، والجمال في أي مكان تدخله. بتمتلك عيناً فنية تلتقط النشاز فوراً، وقدرة استيعابية هائلة بتخلي الناس تفتحلك قلوبها وترمي همومها عندك وهي مطمنة لنزاهتك. أنت \"كبير العيلة\" ومصدر الإنصاف في فريق العمل، بتعرف تدير شؤون الناس بحب ومسؤولية من غير ما تحسسهم بالدونية."},{"title":"النبض النفسي والعاطفي الداخلي","content":"قيمتك الذاتية مربوطة برباط وثيق بمدى شعورك بإنك \"مفيد، حامٍ، وسند\" لمن حولك. بتتألم نفسياً لو حسيت بظلم أو قسوة في دايرتك القريبة. الجانب المرهق فيك هو نزعتك للمثالية الأخلاقية؛ متوقع من الناس تتعامل بنفس مستوى نبل وتضحياتك، ولما متلاقيش ده، بتشيل جواك مرارة وخيبة أمل صامتة تكتمها شهور وسنين."},{"title":"التفعيل المالي والتنفيذي","content":"الفلوس والنجاح بيجولك من تقديم الخدمات الإنسانية، الرعاية، وصناعة الجمال والرفاهية. تتألق في: الاستشارات الأسرية والدعم النفسي، الطب والتمريض، التصميم الداخلي والديكور، الفنون الراقية، قطاع الضيافة والمطاعم الدافئة، وإدارة بيئات العمل اللي بتتطلب بناء فرق مترابطة زي الأسرة الواحدة."},{"title":"فخ الظل ونقاط التعطيل","content":"عقدة \"الشهيد والمتحكم الخفي\". لما طاقتك بتضلم، بتتحول رغبتك في الرعاية لـ \"وصاية خانقة\"؛ تتدخل في تفاصيل حياة المقربين وتفرض رأيك باسم \"أنا خايف عليكم وعارف مصلحتكم أكتر منكم\". الفخ التاني هو استنزاف فلوسك وصحتك في إنقاذ الناس، فتلاقي نفسك مفلس ومستهلك وتبدأ تعاتب وتلوم وتلعب دور الضحية."},{"title":"الروشتة وسؤال التأمل","remedy":"احفظ القاعدة الذهبية: \"مينفعش تسقي حد من كباية فاضية\". ادّي لنفسك الأول نفس الدلع والرعاية والاهتمام اللي بتديه لغيرك. وسيب الناس تشيل نتيجة قراراتها وتتعلم.","reflection":"إمتى آخر مرة عملت حاجة تخصك إنت لوحدك بدافع تدليل نفسك، مش عشان تخدم أو تسعد حد تاني؟"}]},"7":{"number":7,"title":"الباحث الباطني، مفكك الشفرات، واستبصار الحقيقة وراء الحجب","subtitle":"لكل من ولد في أيام 7، 16، 25 من أي شهر","sections":[{"title":"الجوهر والموهبة الخام","content":"أنت نازل الدنيا ومعاك \"ميكروسكوب روحي وعقلي\". رقم 7 محكوم بطاقة كوكب نبتون والعمق المائي الروحي؛ موهبتك الفطرية مش إنك تاخد الكلام زي ما بيتقال، ولا إنك تقتنع بالقشور اللي الناس مصدقاها؛ موهبتك هي الغوص وراء الستار عشان تشوف \"المحرك الخفي\" للأشياء. عندك قدرة نادرة على تفكيك الألغاز، قراءة ما بين السطور، واستبصار النوايا. عقلك بيشتغل بمنطق المحلل والباحث، لكنه متصل بـ \"حدس باطني صادم\"؛ إحساس صامت بيكشفلك الكدب أو الثغرات في أي مشروع قبل ما تبان في الأوراق."},{"title":"النبض النفسي والعاطفي الداخلي","content":"السطحية والثرثرة الفارغة بتعملك \"صداع طاقي\" حقيقي. مبتعرفش تجامل، وبتحس بغربة شديدة وسط الزحمة وكأن بينك وبين العالم حيطة إزاز عازلة: شايفهم بس مش قادر تدوب فيهم. العزلة بالنسبة لك مش اكتئاب؛ دي \"محطة الشحن\" اللي بتصفي فيها جهازك العصبي. لما بتتحرم من هدوءك، بتتحول لشخص جاف ومتحفز. رعبك الأكبر هو إنك تثق في شخص أو فكرة وتكتشف إنها كانت وهم وخداع، عشان كده عقلك شغال تشريح ليل نهار."},{"title":"التفعيل المالي والتنفيذي","content":"الفلوس عندك بتيجي من \"المعرفة النادرة والتخصص الدقيق\". مينفعش تشتغل شغلانة عادية أي حد يعملها؛ رزقك بيفتح لما تكون \"المرجع والخبير\" في مجالك. تتألق وتبني ثروة في: التحليل النفسي والروحاني والفلكي العميق، الاستشارات الاستراتيجية للشركات، البرمجة وحماية البيانات والذكاء الاصطناعي، الأبحاث الجنائية، والطب الباطني والكتابة التخصصية النادرة. الفلوس بتجيلك لما الناس تحس إن عندك \"سر الصنعة\" وإجابة السؤال اللي عجز عنه الجميع."},{"title":"فخ الظل ونقاط التعطيل","content":"فخ الشك المفرط وسجن \"شلل التحليل\". لما طاقتك بتضلم، عقلك بيبدأ ينهش فيك؛ بتشك في أقرب الناس ليك، وبتفتش ورا كل كلمة ونظرة، وبتبني سيناريوهات تدمر سلامك. الفخ التاني هو التعالي الفكري؛ إنك تشوف الناس سطحيين ومغيبين، فتقفل بابك وتعيش في برج عاجي، فتحرم نفسك من الدفا الإنساني وموهبتك من إنها تتحول لأثر مادي."},{"title":"الروشتة وسؤال التأمل","remedy":"افصل بين العقل والقلب؛ في مشاعر بتتعاش مش بتتحلل. اتعلم تسكت عقلك بنشاط جسدي (رياضة، مشي في الطبيعة) عشان تسحب شحنات التفكير الزايدة من دماغك لجسمك.","reflection":"إيه الفكرة اللي إنت متمسك بيها وبتحارب عشان تثبتها، بينما هي في الواقع بتبعدك عن الناس وبتحرمك من السلام؟"}]},"8":{"number":8,"title":"المايسترو التنفيذي، السيطرة على المادة، وبناء الإمبراطوريات","subtitle":"لكل من ولد في أيام 8، 17، 26 من أي شهر","sections":[{"title":"الجوهر والموهبة الخام","content":"أنت نازل الدنيا ومعاك \"ختم الإدارة والسلطة الكبرى\". رقم 8 محكوم بكوكب زحل (كوكب الانضباط والكارما) وكوكب بلوتو (كوكب التحول والثروة)؛ موهبتك هي السيطرة على عالم المادة، رؤية الأرقام الكبيرة، وتحمل الأوزان الثقيلة. عندك كاريزما هيبة وحضور قيادي صارم؛ في أي أزمة مالية، عقلك بيشتغل زي البورصة، بيعرف في ثواني فين مكمن القوة وإزاي نكسب بأقل خساير. موهبتك مش التفاصيل اليدوية الصغيرة؛ موهبتك هي توجيه الموارد، تحريك رؤوس الأموال، وقيادة البشر باحترافية."},{"title":"النبض النفسي والعاطفي الداخلي","content":"المكانة والحرية المالية والأمان المطلق هما الهواء اللي بتتنفسه. مشكلتك النفسية إنك بتربط \"قيمتك كإنسان بحجم نفوذك وإنجازك المادي\"؛ لو في يوم حسيت بقلة حيلة بتترعب كأنك اتعريت قدام نفسك. شايل همّ الكل على كتافك؛ حاسس إنك لو ريحت دقيقة الإمبراطورية هتقع. ورا بدلة القوة دي، في طفل بيخاف من الفقر أو الحاجة لحد، عشان كده بتفضل دايماً تكون صاحب اليد العليا اللي بيدي ومبيطلبش من مخلوق."},{"title":"التفعيل المالي والتنفيذي","content":"الفلوس هي ملعبك الأصلي. رزقك بيتدفق مع المشروعات الكبيرة والقرارات الاستراتيجية. تتألق في: ريادة الأعمال الشاملة، الاستثمار العقاري الضخم، البنوك وأسواق المال، المقاولات، الإدارة السياسية، والقانون والتحكيم التجاري. الفلوس بتجيلك لما تدير منظومة وتتحمل مخاطرة محسوبة يهرب منها غيرك، وتبني بيزنس يوظف ناس ويفتح بيوت."},{"title":"فخ الظل ونقاط التعطيل","content":"الديكتاتورية، الجشع، والكارما السريعة لكوكب زحل. لو استخدمت سلطتك بظلم، أو أكلت حق موظف، أو عاملت الناس كآلات، الكون بيعملك \"إفلاس كارمي مفاجئ\" يهد اللي بنيته عشان يعلمك التواضع. الفخ التاني هو الجفاف العاطفي؛ تستبدل حضنك ووقتك بهدايا وفلوس، فتلاقي نفسك عايش في قصر فخم بس بارد ومفيهوش دفا حقيقي."},{"title":"الروشتة وسؤال التأمل","remedy":"اتعلم فن \"التفويض الواعي\". القائد الحقيقي بيصنع قادة يثق فيهم ويديهم صلاحيات. وطلع جزء ثابت للخير في السر؛ العدل والصدقة هما الدرع الكارمي اللي بيحمي فلوسك من الزوال.","reflection":"لو سحبنا منك رصيدك في البنك ومنصبك وكل إنجازاتك المادية الليلة دي.. مين هيفضل جنبك بيحبك عشان روحك بس؟"}]},"9":{"number":9,"title":"المعلم الإنساني، البصمة الكونية، وفك قيود المادة","subtitle":"لكل من ولد في أيام 9، 18، 27 من أي شهر","sections":[{"title":"الجوهر والموهبة الخام","content":"أنت نازل الدنيا بروح قديمة جداً تحمل خلاصة كل الأرقام. رقم 9 محكوم بكوكب المريخ بطاقته الروحية ونهايات الدورات؛ موهبتك هي \"التأثير الإنساني الشامل والوعي العابر للحدود\". عندك قدرة عجيبة على لمس أرواح الناس، التعبير عن قضايا ومشاعر الملايين، والترفع عن الصغائر. عينك شايفة الصورة الكبرى دايماً؛ بتعرف توحد ناس من مختلف الطبقات على هدف نبيل. موهبتك هي الشفاء الروحي، الإلهام، والتنازل الواعي عن الأنانية لخدمة المجموع."},{"title":"النبض النفسي والعاطفي الداخلي","content":"قلبك بيشيل هموم الدنيا كلها؛ وجع الغريب بيوجعك، ونفسك تداوي كل مظلوم. الجانب النفسي المرهق هو \"صعوبة التخلي والغرق في النوستالجيا\"؛ بتتعلق بذكريات قديمة وعلاقات منتهية، وبتلاقي صعوبة رهيبة في إنك تقول وداعاً. بتعاني من خيبة أمل لما تلاقي الناس بتفكر بأنانية ضيقة، فبتحس إنك في زمن مش بتاعك، وتدخل في موجات زهد واكتئاب وانعزال."},{"title":"التفعيل المالي والتنفيذي","content":"المفارقة في موهبتك إن \"الفلوس بتجيلك لما ماتركزش عليها كهدف أساسي\"! رزقك مربوط بحجم النفع الإنساني اللي بتقدمه. تتألق في: التدريب والتوجيه الحياتي، الفنون الراقية والمؤثرة، المؤسسات الدولية والخيرية، المحاماة وحقوق الإنسان، والتعليم والطب البديل. كل ما كان مشروعك بيخفف وجع الناس أو بيرفع وعيهم، كل ما فتحتلك خزائن الوفرة من أبواب غير متوقعة."},{"title":"فخ الظل ونقاط التعطيل","content":"فخ \"المنقذ المحترق\" ولعب دور الضحية الكونية. في طاقة الظل، بتستنزف صحتك وفلوسك عشان تنقذ ناس مش عايزين يساعدوا نفسهم، ولما يخونوك بتتحول لشخص مليان سخط ومرارة على الدنيا. الفخ التاني هو التعالي الأخلاقي؛ إنك تشوف نفسك أنقى من كل الناس وتنسى إن المثالية الزايدة بتتحول لقسوة وانفصال عن الواقع."},{"title":"الروشتة وسؤال التأمل","remedy":"اتعلم قاعدة \"العطاء المتزن\". التسامح مش معناه إنك تسيب الناس تدوس على كرامتك؛ التسامح معناه إنك تسيب الغل يقع من قلبك بس تحط حدود صارمة. اقفل دفاتر الماضي بحب عشان تستقبل اللي جاي.","reflection":"مين الشخص أو إيه الذكرى اللي إنت لسه متمسك بيها ومستني منها اعتذار، ومحتاج تسامح وتطلق سراحها عشان ترتاح؟"}]},"11":{"number":11,"title":"قناة النور، الصاعقة الحدسية، والاستنارة الروحية","subtitle":"لكل من ولد في يوم 11 من أي شهر","sections":[{"title":"الجوهر والموهبة الخام","content":"أنت جهاز إرسال واستقبال كوني فائق التردد. موهبتك الفطرية هي \"الحدس الإلهامي المباشر\"؛ الأفكار والحلول مبتجيلكش بتسلسل منطقي خطوة بخطوة، بتنزلك كـ \"فلاش ضوء صاعق\" في عقلك الباطن. بتعرف تكشف مسار الأحداث وتقرأ كوامن النفوس برؤية تخترق كل الأقنعة. موهبتك هي أن تكون \"منارة ومحفز للوعي\"؛ بكلمة واحدة بسيطة منك أو فكرة تطرحها بعفوية، ممكن تغير مسار حياة إنسان بالكامل."},{"title":"النبض النفسي والعاطفي الداخلي","content":"جهازك العصبي مشدود دايماً كأنه كابل كهرباء ضغط عالي. الحساسية دي نعمة كبرى بس بتجيب معاها نوبات قلق وتوتر مستمر وتفكير مفرط مابيفصلش. بتعيش صراع دائم بين العالم الروحي المثالي اللي بتشوفه في بصيرتك وبين قسوة ونفاق الواقع المادي، وده بيخليك تتأرجح بين قمة الحماس ونوبات الإحباط الشديد."},{"title":"التفعيل المالي والتنفيذي","content":"الفلوس بتجيلك من شغلك كـ \"مرشد وموقظ للنفوس\". تتألق في: علم الأرقام والفلك والعلوم الباطنية، العلاج النفسي المتقدم والتشافي، الفنون البصرية والموسيقية الملهمة، الإعلام والتأثير الجماهيري، وريادة الأعمال اللي بتعتمد على ابتكار مفاهيم جديدة سابقة عصرها بعشر سنين."},{"title":"فخ الظل ونقاط التعطيل","content":"الهروب من التكليف والتراجع لظل الرقم (2). لما الحمل الروحي بيتقل، بتترعب من مسؤولية بصيرتك وتعيش دور الشخص الضعيف الخايف من المواجهة، أو تغرق في وهم إنك \"المخلص\" اللي لازم يتحمل عذاب الكون، فيتحول حدسك لوساوس وشكوك وبارانويا تدمرك."},{"title":"الروشتة وسؤال التأمل","remedy":"التأريض! لازم تفضي الشحنات دي يومياً: امشي حافي على الأرض أو الرمل، كل أكل طبيعي له جذور، ومارس رياضة بدنية بانتظام عشان تسحب طاقتك من السما للأرض.","reflection":"إيه الرسالة أو الفكرة اللي عقلك الباطن بيصرخ بيها جواك، وإنت بتكذبها عشان خايف من نظرة الناس لوعيك المختلف؟"}]},"22":{"number":22,"title":"المهندس الكوني، البنّاء الأعظم، وصناعة التاريخ","subtitle":"لكل من ولد في يوم 22 من أي شهر","sections":[{"title":"الجوهر والموهبة الخام","content":"أندر وأقوى المواهب على الإطلاق في علم الأعداد. موهبتك هي \"دمج الرؤية الروحية الخيالية بأقصى درجات الانضباط والتنفيذ المادي\". لو غيرك بيحلم، إنت بتصمم المخطط؛ ولو غيرك بينفذ مشروع، إنت بتبني إمبراطورية ومؤسسة تغير مجرى حياة مجتمع بأكمله. عندك عقلية استراتيجية شمولية جبارة ترى التفاصيل والنهايات بوضوح أسطوري، وقدرة على حشد الموارد والبشر لتحقيق أهداف تبدو مستحيلة للجميع."},{"title":"النبض النفسي والعاطفي الداخلي","content":"جواك إحساس طاغي بإنك \"مخلوق لحاجة كبيرة\" ومعاه رعب موازي من إنك تفشل في تحقيقها. ضغط نفسي مرعب وخوف دائم من ضياع العمر قبل ما تسيب بصمتك. بتصاب بالإحباط لما تلاقي الناس اللي حواليك بطيئين ومش قادرين يستوعبوا اتساع رؤيتك، فبتتحول أحياناً لآلة شغل صارمة مابتنامش ومبتعرفش طعم الراحة."},{"title":"التفعيل المالي والتنفيذي","content":"الفلوس بتجيلك في صورة \"ميزانيات عملاقة وتأسيس أصول تاريخية\". تتألق في: المشروعات التنموية الكبرى، الشركات العالمية، الاستثمارات العقارية وتأسيس المدن، والحلول التكنولوجية والبيئية الضخمة. إنت مش معمول لبيزنس صغير؛ إنت معمول للمشاريع اللي بتخدم ملايين وتترك أثراً لأجيال قادمة."},{"title":"فخ الظل ونقاط التعطيل","content":"الشلل من الرعب والانكماش في ظل الرقم (4). لما بتخاف من حجم مسؤوليتك، بتستخبى في الروتين وتتحول لموظف محبط بيدفن طموحه بالحيا. الفخ المقابل هو الديكتاتورية الميكافيلية؛ إنك تعتبر الناس مجرد أدوات شطرنج تدوس عليها عشان توصل لهدفك الكبير، فتخسر إنسانيتك ويهد الكون اللي بنيته."},{"title":"الروشتة وسؤال التأمل","remedy":"زاوج بين الحلم الكبير والخطوة اليومية الصغيرة. قسّم مشروعك العملاق لخطوات واقعية، واستعن بفريق عمل أمين تشاركه الرؤية وتثق فيه.","reflection":"إيه المشروع الضخم اللي دايماً بتصغره وبتخاف تعترف بيه لنفسك، عشان مرعوب من حجم المجهود والتغيير اللي هيطلبه منك؟"}]}},"maturity":{"1":{"number":1,"title":"سيادة القرار، الاستقلال التام، وولادة القائد الأصيل","subtitle":"","sections":[{"title":"طاقة المرحلة بعد سن الـ 35","content":"في النصف الثاني من حياتك، يسحب الكون من تحتك كل \"العكازات\" والتبعيات القديمة. مرحلة تسقط فيها كل المجاملات والتنازلات اللي قدمتها في شبابك عشان ترضي عيلة أو شريك أو مدير. تشتعل جواك طاقة جرأة استثنائية لصناعة قرارات مصيرية؛ بتلاقي نفسك بتتحرر من الخوف من كلام الناس، وبتبدأ تؤسس اسمك، علامتك، ومسارك المستقل برأس مرفوعة ودون انتظار موافقة أو دعم من أحد."},{"title":"التحول النفسي والروحي العميق","content":"التصالح الكامل مع فكرة \"أنا أستحق أن أقود حياتي\". في شبابك ممكن تكون عشت في ظل شخص تاني أو خفت من مواجهة العالم، لكن بعد الـ 35 بتكتشف إن قوتك كانت مستخبية ومستنية اللحظة دي. بتتحول لشخص صاحب رأي حاسم وموقف لا يتزعزع، وتصبح ملجأً للقوة والإلهام لمن حولك."},{"title":"الدرس الكارمي وفخ التعطيل","content":"فخ العند والتصلب والتعالي. إياك أن تجعل التحرر يقودك للأنانية أو سحق مشاعر المقربين. القيادة الحقيقية بعد الـ 35 هي أن تقود نفسك أولاً، وأن تجمع حولك القلوب بالحب لا بالفرض والجبروت."},{"title":"تعمل إيه عشان تظبط طاقتك؟","content":"استثمر في مشروعك الشخصي المستقل، وطالب بحقك ومكانتك بلا تردد، ولكن حافظ دائماً على مساحة للاستماع لمن يحبونك بصدق."}]},"2":{"number":2,"title":"ميزان الحكمة، الشراكات المصيرية، والسكينة الدبلوماسية","subtitle":"","sections":[{"title":"طاقة المرحلة بعد سن الـ 35","content":"تهدأ عواصف الصراعات الفردية والركض المنفرد في مرحلة الشباب، ويفتح الكون أمامك أبواب \"قوة التناغم والتآلف\". تكتشف أن أعظم أرباحك وتطورك لم يعد يأتي من المعارك المنفصلة، بل من بناء الشراكات الاستراتيجية الراسخة، الزواج المستقر، وتوحيد الجهود مع الآخرين. تصبح رمانة الميزان في عائلتك وعملك، وتتحول قدرتك على فهم النفس البشرية لأقوى أسلحتك في كسب احترام ونفوذ مستدام."},{"title":"التحول النفسي والروحي العميق","content":"الانتقال من الصدام مع الواقع إلى \"احتوائه بالقوة الناعمة\". تدرك بعد الـ 35 أن الكلمة الهادئة والصبر الاستراتيجي يحققان في الواقع ما لا يحققه الصراخ والمطاحنة. تنمو بصيرتك العاطفية، وتصبح وسيطاً يهرع إليه الجميع لفض النزاعات وتضميد الجراح."},{"title":"الدرس الكارمي وفخ التعطيل","content":"فخ الذوبان والتنازل القاتل. لا تجعل رغبتك في السلام تدفعك لبلع الإهانة أو السكوت عن حقك. الشراكة الناضجة تقوم على التكافؤ التام؛ اللي ميعرفش قيمتك مينفعش تقعد معاه على نفس الطاولة."},{"title":"تعمل إيه عشان تظبط طاقتك؟","content":"رسّم حدودك بوضوح وحنان. ابنِ شبكة علاقات تقوم على الأخذ والعطاء المتوازن، واجعل حدسك دليلك الأول في اختيار الشركاء والأصدقاء."}]},"3":{"number":3,"title":"انفجار البهجة، فك قيود التعبير، والإشعاع الإبداعي","subtitle":"","sections":[{"title":"طاقة المرحلة بعد سن الـ 35","content":"تتحطم جدران الخجل، التردد، والجدية المفرطة التي ربما خنقت شبابك. ينفجر بداخلك نبع الإبداع والتعبير الحر؛ تصبح رغبتك الأولى هي الاستمتاع بالحياة، مشاركة أفكارك مع العالم، والتحدث بصوتك الحقيقي دون أي اكتراث لأحكام المجتمع الجافة. تتألق في مجالات الإعلام، الكتابة، الفنون، والتجارة القائمة على التواصل؛ حضورك يصبح مشعاً ومبهجاً، وتلتف حولك الناس لتستمد منك طاقة الأمل والحياة."},{"title":"التحول النفسي والروحي العميق","content":"التصالح الكامل مع \"الطفل الداخلي\". تدرك أن الحياة ليست ساحة كدح مستمر وتضحيات كئيبة، بل هي مسرح واسع للتجربة والجمال وصناعة الفرح. تنطلق مواهبك المدفونة وتكتشف أن كلامك وإلهامك له وزن وتأثير ساحر يغير نفوس من يسمعك."},{"title":"الدرس الكارمي وفخ التعطيل","content":"فخ التشتت والسطحية وضياع الهيبة. احذر من أن تقودك البهجة إلى إهمال الالتزامات الأساسية أو تضييع وقتك في ثرثرة وعلاقات عابرة تستنزف نضجك دون إنتاج حقيقي."},{"title":"تعمل إيه عشان تظبط طاقتك؟","content":"وجّه موهبتك التعبيرية نحو منتج ملموس (كتاب، قناة محتوى، مشروع فني، رسالة تعليمية). اجعل البهجة وسيلة لرفع وعي الناس لا مجرد قناع للهروب."}]},"4":{"number":4,"title":"رسوخ الأساسات، بناء الإرث، والأمان المالي الممتد","subtitle":"","sections":[{"title":"طاقة المرحلة بعد سن الـ 35","content":"تسكن فوضى التجارب العشوائية ويبدأ وقت \"البناء الذي يدوم\". في هذا النصف من حياتك، يمنحك الكون تركيزاً تنفيذياً منقطع النظير لإرساء قواعد استقرارك المادي والأسري؛ تتجه نحو امتلاك الأصول الثابتة، تأسيس الشركات ذات الأنظمة الدقيقة، وبناء سمعة صلبة تجعل اسمك مرادفاً للثقة والأمان في مجالك. تصبح السند الحقيقي والصخرة الثابتة لعائلتك وفريقك."},{"title":"التحول النفسي والروحي العميق","content":"إدراك قيمة الانضباط كبوابة للحرية الحقيقية. تفهم أن السعادة ليست في القفزات غير المحسوبة، بل في الاطمئنان إلى أرضية صلبة تقف عليها بثبات. تنضج علاقتك بالوقت والموارد، وتصبح قادراً على تحويل أقل الإمكانيات إلى ثروة منظمة ومستمرة."},{"title":"الدرس الكارمي وفخ التعطيل","content":"فخ التصلب، البخل، وجفاف المشاعر. إياك أن يتحول سعيك للأمان المادي إلى رعب مستمر من بكرة؛ فتتحول لآلة عمل بلا روح تخنق من حولها بالروتين والحرص المبالغ فيه."},{"title":"تعمل إيه عشان تظبط طاقتك؟","content":"حافظ على مساحة للعفوية والرحمة في نظامك الصارم. تذكر أن ما تبنيه من أصول لن تكون له قيمة إذا خسرت صحتك أو دفء قلوب أحبائك."}]},"5":{"number":5,"title":"الحرية الواعية، استكشاف الآفاق، والمغامرة المتجددة","subtitle":"","sections":[{"title":"طاقة المرحلة بعد سن الـ 35","content":"يبدأ فصل التمرد الإيجابي وكسر القيود الراكدة. في الوقت الذي يبحث فيه الآخرون عن السكون، يفتح الكون أمامك أبواب التجديد والسفر والتحرر من الروتين المكتبي الضيق. تتسع دائرة معارفك لتشمل ثقافات جديدة، وتجد شجاعة غير مسبوقة لتغيير مجالك المهني، تجربة أفكار جريئة، وعيش الحياة بمرونة مائية تشبه شباباً ثانياً متجدداً وممتلئاً بالحيوية."},{"title":"التحول النفسي والروحي العميق","content":"التخلص النهائي من الخوف من المجهول. تدرك بعد الـ 35 أن الأمان الحقيقي لا يكمن في البقاء في مكان ميت، بل في ثقتك بقدرتك على الطفو فوق أي موجة والتأقلم مع أي ظرف. تصبح ملهماً لمن حولك في كيفية عيش الحياة بلا خوف أو قيود مصطنعة."},{"title":"الدرس الكارمي وفخ التعطيل","content":"فخ الفوضى والهروب من استحقاقات النضج. الحرية بعد الـ 35 تختلف عن اندفاع العشرينيات؛ احذر من تدمير ما بنيته في لحظة ملل عابرة، أو الانجراف وراء ملذات تترك روحك فارغة."},{"title":"تعمل إيه عشان تظبط طاقتك؟","content":"اجعل حريتك محكومة ببوصلة داخلية واعية. سافر، جرّب، وغيّر، ولكن احتفظ دائماً بمرساة انضباط تحمي طاقتك ومواردك من التبعثر."}]},"6":{"number":6,"title":"عرش الاحتواء، السيادة الأسرية، وعطاء النور","subtitle":"","sections":[{"title":"طاقة المرحلة بعد سن الـ 35","content":"يصبح \"البيت، المحيط القريب، ونفع الناس\" هو مركز الكون الحقيقي بالنسبة لك. مرحلة يتوجك فيها الكون كـ \"كبير العائلة والملاذ الآمن\" لمجتمعك. تثمر سنوات نضجك في صورة استقرار عاطفي عميق، رعاية واعية للأبناء والأهل، وازدهار مهني في مجالات الاستشارات، الرعاية الصحية والنفسية، والتصميم والجمال. تصبح كلمتك مسموعة ومحترمة ومصدر عدل يلجأ إليه الجميع."},{"title":"التحول النفسي والروحي العميق","content":"الوصول لأرقى درجات الحب غير المشروط. تتعلم كيف تمنح من فائض طاقتك بحكمة دون أن تحرق نفسك في دور الضحية، وتكتشف أن أعظم إنجاز هو أن تترك مكاناً دافئاً وبيئة آمنة يزدهر فيها كل من يعيش معك."},{"title":"الدرس الكارمي وفخ التعطيل","content":"فخ الوصاية الخانقة وعقدة السيطرة باسم الحب. احذر من أن تفرض قراراتك على المقربين بحجة خوفك عليهم؛ النضج الحقيقي هو أن تمنحهم أجنحة للطيران لا أقفاصاً من ذهب."},{"title":"تعمل إيه عشان تظبط طاقتك؟","content":"املا كوبك أولاً بالراحة والتقدير الذاتي لتستطيع أن تسقي غيرك دون منّ أو استنزاف. دع المقربين يتعلمون من تجاربهم، وكن أنت الملاذ الداعم وقت الحاجة."}]},"7":{"number":7,"title":"صومعة الحكيم، اليقين الباطني، والتخصص النادر","subtitle":"","sections":[{"title":"طاقة المرحلة بعد سن الـ 35","content":"تنسحب بوعي ورقي من صخب المظاهر الدنيوية، المنافسات الزائفة، والمجاملات الاجتماعية المستنزفة. يوجهك الكون نحو العمق المطلق؛ تبدأ مرحلة التفرغ للبحث، التأمل، فهم أسرار النفس والعلوم الباطنية والروحية. تصبح سلطة معرفية وخبيراً نادراً في مجالك، ويقصدك الناس للاستنارة بعمق بصيرتك ورأيك الصائب الذي يخترق حجب الظواهر."},{"title":"التحول النفسي والروحي العميق","content":"بلوغ السكينة والسلام الداخلي الشامل. تكتشف أن أعظم كنز في الحياة هو معرفة الذات والاتصال بالحقائق الكونية الخالدة. تتحول عزلتك من شعور بالغربة في الصغر إلى منبع نور، حكمة، وتجدد روحي يفيض على كل من يقترب منك."},{"title":"الدرس الكارمي وفخ التعطيل","content":"فخ البرود والتعالي المعرفي والانعزال عن الواقع. إياك أن تصبح حكمتك سبباً في بناء جدار جليدي يعزلك عن دفء المشاعر الإنسانية، أو تسقط في فخ الشك الذي يدمر علاقاتك بالبشر."},{"title":"تعمل إيه عشان تظبط طاقتك؟","content":"انزل بنور علمك إلى الناس وخفف عنهم؛ المعرفة التي لا تنفع ولا تدفئ النفوس تتحول إلى حمل ثقيل. وازن بين خلوتك الروحية وحضورك الواقعي الرحيم."}]},"8":{"number":8,"title":"الحصاد الإمبراطوري، السيادة التنفيذية، وتدفق الوفرة","subtitle":"","sections":[{"title":"طاقة المرحلة بعد سن الـ 35","content":"تتويج سنوات الصبر والمكابدة باستلام مفاتيح القوة والجاه والمكانة المستحقة. بعد الـ 35، يضعك الكون في الصدارة؛ تتضاعف قدرتك على إدارة المنظومات الكبرى، جذب رؤوس الأموال، وتحويل المشروعات لثروات حقيقية تعيش لأجيال. تصبح قراراتك نافذة، ونفوذك ملموساً في مجتمعك وبيئتك المهنية، وتدخل الساحة كرئيس تنفيذي حقيقي يشار إليه بالبنان."},{"title":"التحول النفسي والروحي العميق","content":"فهم الكارما والعدالة الكونية للوفرة. تدرك أن القوة الحقيقية ليست في مراكمة الأرقام في البنوك، بل في استخدام النفوذ لحماية الضعفاء وفتح البيوت وصناعة العدل. تنضج سيطرتك على عالم المادة، وتتحول من الركض وراء المال إلى إدارته بثبات وسكينة كأداة لتحقيق أهداف عليا."},{"title":"الدرس الكارمي وفخ التعطيل","content":"فخ الغرور، الطمع، والاستبداد. تذكر دائماً أن الرقم 8 محكوم بميزان زحل الصارم؛ ما تبنيه بظلم أو تعالي سينهار في طرفة عين. حافظ على نقاء يدك وعدلك المطلق مهما بلغت سطوتك."},{"title":"تعمل إيه عشان تظبط طاقتك؟","content":"اجعل الإنفاق في وجوه الخير والعدالة مع العاملين معك هو درعك الحصين. فوض المهام، ركز على الإدارة العليا، ولا تجعل قيمتك الإنسانية أسيرة لمظهر مادي زائل."}]},"9":{"number":9,"title":"التتويج الإنساني، الحكمة الكونية، والتأثير الخالد","subtitle":"","sections":[{"title":"طاقة المرحلة بعد سن الـ 35","content":"تتسع رؤيتك لتتجاوز الحدود الشخصية والعائلية الضيقة وتشمل خدمة الإنسانية جمعاء. مرحلة يتلاشى فيها التعلق بالصغائر والمكاسب الأنانية؛ تكرس خبرتك وعلمك وثروتك لمشاريع تترك بصمة لا تمحى في المجتمع (تعليم، إرشاد، فنون ملهمة، أو قضايا حقوقية). تصبح كالمعلم والمرشد الروحي للجميع، وتفتح لك الأبواب الدولية والسمعة الواسعة في كل مكان."},{"title":"التحول النفسي والروحي العميق","content":"بلوغ قمة التسامح والتسليم المطلق. تسقط من قلبك كل الأحقاد القديمة وتدرك أن المحبة والعطاء الخالص هما المعنى الأسمى للوجود. تشعر بخفة روحية مذهلة وسكينة عميقة تجعل حضورك في أي مكان بمثابة بلسم يشفي جراح التائهين."},{"title":"الدرس الكارمي وفخ التعطيل","content":"فخ المرارة والغرق في ماضي الخيبات. إياك أن تسمح لتجارب الخذلان السابقة بأن تقفل قلبك أو تجعلك تعيش دور الضحية الكونية المستنزفة؛ اعطِ بوعي وبحدود تحمي طاقتك."},{"title":"تعمل إيه عشان تظبط طاقتك؟","content":"أغلق كل الأبواب المفتوحة مع الماضي بسلام ووداع راقٍ. وجّه طاقتك نحو المشاريع الكبرى ذات النفع العام، وتأكد أن الكون سيتكفل برزقك وأمانك أضعاف ما تتخيل."}]},"11":{"number":11,"title":"منارة الإلهام، التنوير الجماهيري، والرسالة الكبرى","subtitle":"","sections":[{"title":"طاقة المرحلة بعد سن الـ 35","content":"ترتفع طاقتك لدرجة التكليف الروحي المفتوح. تتحول إلى \"قناة نور\" تهدي التائهين؛ تصبح كلماتك وكتاباتك وتوجيهاتك دواءً يغير حياة الآلاف. تفتح أمامك أبواب القيادة الفكرية والروحية والإعلامية للتأثير على وعي الجماهير، وتعيش دور المعلم الملهم الذي يربط الأرض بالسماء."},{"title":"التحول والمفتاح والروشتة","content":"التصالح التام مع رسالتك الفريدة وتجاوز الخوف من حكم الناس. الالتزام بالتأريض اليومي وتفريغ الطاقة العصبية الزائدة بالرياضة والماء المالح لحماية جهازك العصبي من الاحتراق الطاقي."}]},"22":{"number":22,"title":"البناء التاريخي، القيادة الكونية، وتشييد الإرث","subtitle":"","sections":[{"title":"طاقة المرحلة بعد سن الـ 35","content":"تكتمل فيك أدوات الحلم وأدوات البناء؛ تُمنح الموارد والفرص لتشييد مؤسسات أو مشروعات عملاقة تغير واقع آلاف الأسر وتخلد اسمك في التاريخ العملي. تصبح مهندساً حقيقياً للواقع، يجمع بين الرؤية الكونية والقدرة التنفيذية التي لا تقهر."},{"title":"التحول والمفتاح والروشتة","content":"تحمل المسؤولية بشجاعة وعدم الهروب في روتين ضيق. بناء منظومات عمل وفرق تثق فيها لتحويل الأحلام العظيمة إلى أصول ومشاريع حقيقية على الأرض تخدم الإنسانية وتعيش لأجيال.\n\nكده يا هندسة كل نصوص المواهب الفطرية (رقم يوم الميلاد) من 1 لـ 9 والماستر 11 و 22 مكتوبة بكامل \"بعاريزها\" وتفاصيلها، وكل نصوص أرقام النضج بعد سن 35 مفردة بنفس العمق والدسامة من غير ما يسقط منها حرف.\n\nالملف ده كده جاهز تماماً يتحط في مستند Word منفصل ليكون \"المرجع الموسوعي الثاني\" لعقيق أسترو جنب ملف القمم والتحديات."}]}}};

  function extraCard(kind, number) {
    const source = BIRTHDAY_MATURITY_READINGS[kind] && BIRTHDAY_MATURITY_READINGS[kind][String(number)];
    if (source) return source;
    const basic = EXTRA_READINGS[kind] && EXTRA_READINGS[kind][number] || null;
    const deep = EXTRA_DEEP_READINGS[kind] && EXTRA_DEEP_READINGS[kind][number] || null;
    return basic && deep ? Object.assign({}, basic, { deep: deep }) : basic;
  }

  function renderExtraReadings(day, month, year, lifePathNumber, expressionNumber, nameData) {
    const personal = calculatePersonalYear(day, month, year);
    const birthday = calculateBirthdayNumber(day);
    const maturity = calculateMaturityNumber(lifePathNumber, expressionNumber);
    const items = [
      { key: "birthday", label: "رقم يوم الميلاد", number: birthday.value, badge: "موهبتك الفطرية", data: extraCard("birthday", birthday.value) },
      { key: "maturity", label: "رقم النضج", number: maturity.value, badge: "بعد سن 35", data: extraCard("maturity", maturity.value) }
    ];
    const personalEntry = nameData && nameData.personal_years &&
      nameData.personal_years.numbers && nameData.personal_years.numbers[String(personal.value)];
    const personalSections = personalEntry && Array.isArray(personalEntry.sections) ? personalEntry.sections : [];
    const personalHTML = '<article class="aqeq-personal-year"><div class="aqeq-extra-card-head"><div><span class="aqeq-extra-eyebrow">' +
      escapeHTML(personal.year) + '</span><h4>السنة الشخصية</h4></div><span class="aqeq-extra-number">' +
      escapeHTML(personal.value) + '</span></div><h5>' + escapeHTML(personalEntry ? personalEntry.title : "قراءة السنة الشخصية") +
      '</h5><div class="aqeq-personal-year-grid">' + personalSections.map(function (part, index) {
        return '<section class="aqeq-personal-year-section"><span class="aqeq-card-index">0' +
          (index + 1) + '</span><h5>' + escapeHTML(part.title) + '</h5><div class="aqeq-extra-copy">' +
          contentToHTML(part.content) + '</div></section>';
      }).join("") + '</div></article>';
    function periodHTML(cls, label, eyebrow, calc, key) {
      const entry = slotEntry(nameData, key, calc.value);
      const secs = entry ? entry.sections.map(function (part, index) {
        return '<section class="aqeq-personal-year-section"><span class="aqeq-card-index">0' + (index + 1) + '</span><h5>' + escapeHTML(part.title) +
          '</h5><div class="aqeq-extra-copy">' + contentToHTML(part.content) + '</div></section>';
      }).join("") : "";
      return '<article class="aqeq-personal-year ' + cls + '"><div class="aqeq-extra-card-head"><div><span class="aqeq-extra-eyebrow">' + escapeHTML(eyebrow) +
        '</span><h4>' + label + '</h4></div><span class="aqeq-extra-number">' + escapeHTML(calc.value) + '</span></div>' +
        (entry && entry.title ? '<h5>' + escapeHTML(entry.title) + '</h5>' : '') + (secs ? '<div class="aqeq-personal-year-grid">' + secs + '</div>' : '') + '</article>';
    }
    const now = new Date();
    const personalMonth = calculatePersonalMonth(day, month, personal.year, now);
    const personalDay = calculatePersonalDay(day, month, personal.year, now);
    const periodsHTML = periodHTML("aqeq-personal-month", "الشهر الشخصي", AR_MONTHS[personalMonth.calendarMonth - 1] + " " + personalMonth.year, personalMonth, "personal_months") +
      periodHTML("aqeq-personal-day", "اليوم الشخصي", personalDay.calendarDay + " " + AR_MONTHS[personalMonth.calendarMonth - 1], personalDay, "personal_days");
    return '<section class="aqeq-extra-numbers"><div class="aqeq-extra-heading"><span class="aqeq-name-kicker">AQEQ ASTRO · THE NEXT LAYER</span><h3>الأرقام المكملة لمسارك</h3><p>ثلاث زوايا رمزية تضيف طبقة جديدة لفهم رحلتك.</p></div>' +
      personalHTML + periodsHTML + '<div class="aqeq-extra-grid">' +
      items.map(function (item) {
        if (!item.data && !(item.key === "maturity" && slotEntry(nameData, "maturity_extra", item.number))) return "";
        const slot = item.key === "maturity" ? slotEntry(nameData, "maturity_extra", item.number) : null;
        const d = slot ? Object.assign({}, item.data || {}, slot) : item.data;
        const sectionsHTML = (Array.isArray(d.sections) ? d.sections : []).map(function (section, index) {
          let sectionBody = "";
          if (section.remedy || section.reflection) {
            sectionBody = (section.remedy ? '<p><strong>الروشتة:</strong> ' + escapeHTML(section.remedy) + '</p>' : '') +
              (section.reflection ? '<p class="aqeq-extra-reflection"><strong>سؤال للتأمل:</strong> ' + escapeHTML(section.reflection) + '</p>' : '');
          } else {
            sectionBody = '<p>' + escapeHTML(section.content || "") + '</p>';
          }
          return '<section class="aqeq-extra-deep-section"><h5>' + escapeHTML(section.title) + '</h5>' + sectionBody + '</section>';
        }).join("");
        const subtitle = d.subtitle ? '<p class="aqeq-extra-source-subtitle">' + escapeHTML(d.subtitle) + '</p>' : '';
        return '<article class="aqeq-extra-card aqeq-extra-' + item.key + '"><div class="aqeq-extra-card-head"><div><span class="aqeq-extra-eyebrow">' +
          escapeHTML(item.badge) + '</span><h4>' + escapeHTML(item.label) + '</h4></div><span class="aqeq-extra-number">' +
          escapeHTML(item.number) + '</span></div><h5>' + escapeHTML(d.title) + '</h5>' + subtitle +
          '<div class="aqeq-extra-copy">' + sectionsHTML + '</div></article>';
      }).join("") + '</div></section>';
  }

  function ensurePinnacleStyles() {
    if (document.getElementById("aqeq-pc-styles")) return;
    const style = document.createElement("style");
    style.id = "aqeq-pc-styles";
    style.textContent = `
      .aqeq-extra-deep-section{margin:12px 0;padding-top:10px;border-top:1px solid rgba(210,190,137,.16)}
      .aqeq-extra-source-subtitle{color:var(--muted,#aeb7c9);font-size:.84rem;line-height:1.8;margin:4px 0 10px}
      .aqeq-extra-deep-section h5{margin:0 0 6px;color:#e6ce92;font-size:.92rem;line-height:1.6}
      .aqeq-extra-deep-section p,.aqeq-extra-reflection{line-height:1.9}
      .aqeq-extra-reflection{padding:10px 12px;border-inline-start:3px solid #c7a96a;background:rgba(205,174,105,.07);border-radius:8px}
      .aqeq-pc-wrap{margin-top:22px;color:var(--text,#f3f0e8)}
      .aqeq-pc-heading{margin:0 0 14px}
      .aqeq-pc-heading h3{margin:5px 0 7px;font-size:1.25rem}
      .aqeq-pc-heading p,.aqeq-pc-note{color:var(--muted,#aeb7c9);font-size:.88rem;line-height:1.8}
      .aqeq-pc-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      .aqeq-pc-card{min-width:0;padding:16px;border:1px solid rgba(210,190,137,.24);border-radius:16px;background:linear-gradient(145deg,rgba(27,35,57,.92),rgba(17,22,39,.94));box-shadow:0 8px 24px rgba(0,0,0,.12)}
      .aqeq-pc-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
      .aqeq-pc-eyebrow{display:block;color:#d6bf86;font-size:.72rem;letter-spacing:.04em;margin-bottom:5px}
      .aqeq-pc-card h4{font-size:1rem;line-height:1.5;margin:0}
      .aqeq-pc-number{flex:0 0 auto;display:grid;place-items:center;min-width:42px;height:42px;padding:0 8px;border-radius:13px;border:1px solid rgba(219,194,133,.42);color:#f4dfaa;font-size:1.25rem;font-weight:800;background:rgba(205,174,105,.09)}
      .aqeq-pc-period{display:inline-block;margin:12px 0 8px;padding:5px 9px;border-radius:999px;background:rgba(255,255,255,.055);color:#d8deeb;font-size:.78rem}
      .aqeq-pc-copy{font-size:.9rem;line-height:1.9;color:#d6dceb;min-width:0;overflow-wrap:anywhere;white-space:normal}
      .aqeq-pc-copy p{margin:9px 0;white-space:normal;overflow-wrap:anywhere}.aqeq-pc-copy h5{font-size:.98rem;line-height:1.6;color:#f0dba8;margin:2px 0 10px}.aqeq-pc-copy strong{color:#f0dba8;font-weight:750}
      .aqeq-pc-debts{margin-top:14px}
      .aqeq-pc-debt{padding:13px 0;border-top:1px solid rgba(255,255,255,.09)}
      .aqeq-pc-debt:first-child{border-top:0}
      .aqeq-pc-empty{padding:15px;border:1px dashed rgba(210,190,137,.3);border-radius:14px;color:#c5ccda;line-height:1.8}
      @media(max-width:600px){.aqeq-pc-grid{grid-template-columns:1fr}.aqeq-pc-card{padding:14px}}
    `;
    document.head.appendChild(style);
  }

  function renderPinnaclesChallenges(day, month, birthYear, lifePathNumber, nameCalculation) {
    if (!root.AqeqPinnaclesChallenges || !Number.isInteger(Number(birthYear))) return "";
    ensurePinnacleStyles();
    const result = root.AqeqPinnaclesChallenges.calculatePinnaclesChallenges(
      Number(day), Number(month), Number(birthYear), Number(lifePathNumber)
    );
    const debts = root.AqeqPinnaclesChallenges.collectKarmicDebts(
      Number(day), Number(month), Number(birthYear), Number(lifePathNumber), nameCalculation
    );
    function card(item, kind) {
      const title = kind === "pinnacle" ? "القمة " + item.index : "التحدي " + item.index;
      const eyebrow = kind === "pinnacle" ? "PINNACLE" : "CHALLENGE";
      const period = item.period ? item.period.label : "";
      const content = kind === "pinnacle"
        ? root.AqeqPinnaclesChallenges.getPinnacleReading(item.value)
        : root.AqeqPinnaclesChallenges.getChallengeReading(item.value);
      const sections = kind === "pinnacle"
        ? [
            ["طاقة القمة والفرص (ماذا يطلب منك الكون؟)", content && content.energy],
            ["النبض النفسي والعاطفي (ماذا يدور بداخلك؟)", content && content.psyche],
            ["طريقة الاستثمار والعمل (كيف تنجح في هذه القمة؟)", content && content.invest],
            ["التحذير والظل الطاقي (فخ المرحلة)", content && content.shadow],
            ["قطب النور", content && content.light],
            ["في حياتك اليومية", content && content.reallife]
          ]
        : [
            ["جذر التحدي", content && content.root],
            ["الدرس النفسي والروحي", content && content.lesson],
            ["المهارات اللي محتاجة بناء", content && content.skills],
            ["روشتة تجاوز التحدي", content && content.practice],
            ["قطب النور", content && content.light],
            ["في حياتك اليومية", content && content.reallife]
          ];
      const copy = content
        ? (content.essence ? '<p class="aqeq-pc-essence"><strong>المعنى الجوهري:</strong> ' + escapeHTML(content.essence) + '</p>' : '') +
          sections.filter(function (part) { return part[1]; }).map(function (part) {
            return '<section class="aqeq-pc-reading-section"><h5>' + escapeHTML(part[0]) +
              '</h5><p>' + escapeHTML(part[1] || "") + '</p></section>';
          }).join("") +
          (content.reflection
            ? '<p class="aqeq-pc-reflection"><strong>سؤال للتأمل:</strong> ' + escapeHTML(content.reflection) + '</p>'
            : '')
        : '<p>القراءة التفصيلية لهذا الرقم قيد الإعداد.</p>';
      return '<article class="aqeq-pc-card"><div class="aqeq-pc-card-head"><div><span class="aqeq-pc-eyebrow">' +
        eyebrow + ' · ' + String(item.index).padStart(2, "0") + '</span><h4>' + escapeHTML(title) +
        '</h4></div><span class="aqeq-pc-number">' + escapeHTML(item.value) +
        '</span></div><span class="aqeq-pc-period">' + escapeHTML(period) +
        '</span><div class="aqeq-pc-copy"><h5>' + escapeHTML(content ? content.title : "") + '</h5>' + copy + '</div></article>';
    }
    const pinnacleCards = result.pinnacles.map(function (item) { return card(item, "pinnacle"); }).join("");
    const challengeCards = result.challenges.map(function (item) { return card(item, "challenge"); }).join("");
    const debtHTML = debts.found
      ? debts.items.map(function (item) {
          const reading = root.AqeqPinnaclesChallenges.getKarmicDebtReading(item.debt);
          const body = reading
            ? (reading.essence ? '<p class="aqeq-pc-essence"><strong>المعنى الجوهري:</strong> ' + escapeHTML(reading.essence) + '</p>' : '') +
              '<section class="aqeq-pc-reading-section"><h5>أصل الدين الكارمي والنمط الخفي</h5><p>' + escapeHTML(reading.origin) + '</p></section>' +
              '<section class="aqeq-pc-reading-section"><h5>نمط التكرار في الواقع (إزاي بيظهر في حياتك؟)</h5><p>' + escapeHTML(reading.pattern) + '</p></section>' +
              '<section class="aqeq-pc-reading-section"><h5>الدرس النفسي والروحي</h5><p>' + escapeHTML(reading.lesson) + '</p></section>' +
              '<section class="aqeq-pc-reading-section"><h5>روشتة فك الارتباط والتحرر</h5><p>' + escapeHTML(reading.release) + '</p></section>'
            : '<p>' + escapeHTML(item.detail) + '</p><p>' + escapeHTML(item.theme) + '</p>';
          return '<div class="aqeq-pc-debt"><div class="aqeq-pc-card-head"><div><span class="aqeq-pc-eyebrow">KARMIC DEBT · ' +
            escapeHTML(item.source.replace(/_/g, " ")) + '</span><h4>' + escapeHTML(item.title) +
            '</h4></div><span class="aqeq-pc-number">' + escapeHTML(item.debt + "/" + item.root) +
            '</span></div><div class="aqeq-pc-copy">' + body + '</div></div>';
        }).join("")
      : '<div class="aqeq-pc-empty">لم يظهر رقم 13 أو 14 أو 16 أو 19 كقيمة مركبة مباشرة قبل الاختزال في المصادر المفحوصة. ده لا يعني وجود أو غياب صفة شخصية؛ هو فقط نتيجة قاعدة الفحص الحسابية.</div>';
    return '<section class="aqeq-pc-wrap"><div class="aqeq-pc-heading"><span class="aqeq-name-kicker">AQEQ ASTRO · LIFE CYCLES</span><h3>القمم والتحديات</h3><p>أربع قمم وأربع تحديات موزعة على مراحل العمر وفق قاعدة 36 − جذر مسار الحياة.</p></div>' +
      '<div class="aqeq-pc-grid">' + pinnacleCards + '</div>' +
      '<div class="aqeq-pc-heading" style="margin-top:22px"><h3>التحديات الأربعة</h3><p>فروق مطلقة بين أرقام الشهر واليوم والسنة المختزلة.</p></div>' +
      '<div class="aqeq-pc-grid">' + challengeCards + '</div>' +
      '<div class="aqeq-pc-heading" style="margin-top:22px"><h3>فحص الديون الكارمية</h3><p>الفحص هنا حسابي ورمزي، ويعتمد على الأرقام المركبة الظاهرة قبل الاختزال فقط.</p></div>' +
      '<article class="aqeq-pc-card aqeq-pc-debts">' + debtHTML + '</article></section>';
  }

  function numberLabel(result) {
    if (!result || result.value == null) return "غير متاح";
    return String(result.value) + (result.isMaster ? " · رقم رئيسي" : "");
  }

  async function render(name, resultRoot, birthContext) {
    if (!resultRoot) return;
    const old = resultRoot.querySelector(".aqeq-name-readings");
    if (old) old.remove();

    const section = document.createElement("section");
    section.className = "aqeq-name-readings";
    section.setAttribute("aria-live", "polite");
    section.innerHTML = '<div class="aqeq-name-heading"><span class="aqeq-name-kicker">AQEQ ASTRO · NAME NUMBERS</span><h3>بصمة اسمك</h3><p>تلات زوايا بتكمل قراءة مسار حياتك: الدافع الداخلي، صورتك قدام الناس، وطريقة التعبير عن مواهبك.</p></div><p class="aqeq-name-status">جاري تجهيز كروت الاسم…</p>';
    resultRoot.appendChild(section);

    const cleanName = String(name || "").trim();
    if (!cleanName) {
      section.querySelector(".aqeq-name-status").textContent =
        "من فضلك اكتب اسمك أولاً لاكتشاف بصمة طاقتك.";
      section.classList.add("is-empty");
      return;
    }

    try {
      if (!root.AqeqNameEngine || typeof root.AqeqNameEngine.calculateNameNumbers !== "function") {
        throw new Error("محرك حساب الاسم غير محمّل. تأكد من إضافة name_engine.js.");
      }
      const [nameData, calculation] = await Promise.all([
        loadData(),
        Promise.resolve(root.AqeqNameEngine.calculateNameNumbers(cleanName))
      ]);

      // Avoid a stale async response overwriting a newer result.
      if (!section.isConnected) return;

      const groupsHTML = GROUPS.map(function (group) {
        const calculated = calculation[group.calcKey];
        const number = calculated && calculated.value != null ? String(calculated.value) : "";
        const entry = nameData.groups[group.key] &&
          nameData.groups[group.key].numbers &&
          nameData.groups[group.key].numbers[number];

        // Keep the interface usable even if a future data edit accidentally
        // omits a reading. The numeric result remains visible with a neutral
        // fallback instead of exposing a broken-data error to visitors.
        if (!entry || !Array.isArray(entry.cards) || !entry.cards.length) {
          const fallbackNumber = number || "1";
          const fallbackContent = group.key === "soul_urge"
            ? "عشان كتابة الاسم بالعربي غالبًا ما بتظهرش كل حروف العلة القصيرة، بنستخدم الاسم كاملًا كبديل حسابي عند غياب حروف العلة المكتوبة. خُد النتيجة كمدخل رمزي للتأمل، مش كحكم ثابت على شخصيتك."
            : "القراءة التفصيلية للرقم ده قيد المراجعة. الرقم محسوب، ويمكنك استخدامه كمدخل رمزي للتأمل في الدوافع والاختيارات.";
          return '<article class="aqeq-name-group aqeq-name-fallback"><header><div><h4>' +
            escapeHTML(group.label) + '</h4><p>' + escapeHTML(group.sub) +
            '</p></div><span class="aqeq-name-number">' + escapeHTML(fallbackNumber) +
            '</span></header><article class="aqeq-reading-card"><div class="aqeq-reading-card-top"><span class="aqeq-card-index">01</span><h5>قراءة تمهيدية</h5></div><div class="aqeq-reading-content">' +
            contentToHTML(fallbackContent) + '</div></article></article>';
        }

        const cardsHTML = entry.cards.map(function (card, index) {
          return '<article class="aqeq-reading-card"><div class="aqeq-reading-card-top"><span class="aqeq-card-index">0' +
            (index + 1) + '</span><h5>' + escapeHTML(card.title || ("الكارت " + (index + 1))) +
            '</h5></div><div class="aqeq-reading-content">' + contentToHTML(card.content) +
            '</div></article>';
        }).join("");

        return '<article class="aqeq-name-group"><header><div><h4>' +
          escapeHTML(nameData.groups[group.key].label || group.label) +
          '</h4><p>' + escapeHTML(group.sub) + '</p></div><span class="aqeq-name-number">' +
          escapeHTML(numberLabel(calculated)) + '</span></header><div class="aqeq-reading-grid">' +
          cardsHTML + '</div></article>';
      }).join("");

      section.innerHTML = '<div class="aqeq-name-heading"><span class="aqeq-name-kicker">AQEQ ASTRO · NAME NUMBERS</span><h3>بصمة اسم ' +
        escapeHTML(cleanName) + '</h3></div>' +
        '<div class="aqeq-name-groups">' + groupsHTML + '</div>';
      if (birthContext && Number.isInteger(Number(birthContext.day)) &&
          Number.isInteger(Number(birthContext.month)) && Number.isInteger(Number(birthContext.year)) &&
          birthContext.day >= 1 && birthContext.day <= 31 && birthContext.month >= 1 && birthContext.month <= 12) {
        const expressionNumber = calculation.expression && calculation.expression.value;
        if (expressionNumber != null && birthContext.lifePath != null) {
          section.insertAdjacentHTML("beforeend", renderExtraReadings(
            Number(birthContext.day), Number(birthContext.month), Number(birthContext.year),
            Number(birthContext.lifePath), Number(expressionNumber), nameData
          ));
          if (birthContext.birthYear != null && root.AqeqPinnaclesChallenges) {
            section.insertAdjacentHTML("beforeend", renderPinnaclesChallenges(
              Number(birthContext.day), Number(birthContext.month), Number(birthContext.birthYear),
              Number(birthContext.lifePath), calculation
            ));
          }
        }
      }
    } catch (error) {
      if (!section.isConnected) return;
      const status = section.querySelector(".aqeq-name-status") || document.createElement("p");
      status.className = "aqeq-name-status aqeq-name-error";
      status.textContent = (error && error.message) ? error.message :
        "حصلت مشكلة أثناء تحميل قراءات الاسم. راجع ملفات الموقع وحاول تاني.";
      if (!status.parentNode) section.appendChild(status);
    }
  }

  root.AqeqNameReadings = Object.freeze({ render: render, loadData: loadData, calculatePersonalYear: calculatePersonalYear, calculatePersonalMonth: calculatePersonalMonth, calculatePersonalDay: calculatePersonalDay, calculateBirthdayNumber: calculateBirthdayNumber, calculateMaturityNumber: calculateMaturityNumber, renderPinnaclesChallenges: renderPinnaclesChallenges, extraReadings: EXTRA_READINGS });
})(window);

;
/* assets/js/inline/page-06.js */

/* ============================== عدّل هنا ==============================
   كل حاجة بتتغير في الموقع من الأسماء والأرقام والكورسات والفيديوهات هنا.
======================================================================= */
const SITE_NAME = "عقيق أسترو";                       // اسم الموقع
const SITE_TAGLINE = "فلك وطاقة ومصفوفة القدر"; // الشعار
const WA_URL = "https://wa.me/message/BWFSU4ZT25WKA1";               // رقم واتساب بالصيغة الدولية، بدون + وبدون صفر البداية (مصر: 20 ثم الرقم)
const IG_USER = "mohamed.ibrahim.astro";                // يوزر انستجرام
const FORECAST_LABEL = "توقعات أكتوبر ٢٠٢٦";    // عنوان الفترة في توقعات الأبراج، غيّره مع كل تحديث

/* الكورسات
   - soon:true  يظهر "قريبًا" وزر "بلغني لما ينزل" على واتساب
   - لو الكورس نزل: شيل soon وحط link (رابط الشراء أو التسجيل) و price لو عايز تكتب السعر */
const COURSES = [
  // مثال: { title: "أساسيات الفلك للمبتدئين", desc: "من الصفر لحد قراءة الخريطة.", level: "مبتدئ", price: "", link: "رابط الشراء" },
];

/* الفيديوهات: حط رابط يوتيوب (عادي أو shorts) وعنوان، والصورة بتتجاب لوحدها.
   أي رابط تاني (تيك توك، انستجرام) هيشتغل كمان لكن من غير صورة.
   مثال:
   { title: "الميزان في أكتوبر", url: "https://www.youtube.com/watch?v=XXXXXXXXXXX" },
*/
const VIDEOS = [
];

/* ======================= بيانات ونصوص الموقع ======================= */
const ELEMENTS = [{ n: "نار", adj: "ناري" }, { n: "تراب", adj: "ترابي" }, { n: "هواء", adj: "هوائي" }, { n: "ماء", adj: "مائي" }];
const MODALITIES = [{ n: "كاردينال" }, { n: "ثابت" }, { n: "متحول" }];

const SIGNS = [
  { n: "الحمل", g: "♈", el: 0, mod: 0, ruler: "mars", d: "٢١ مارس – ١٩ أبريل", way: "مباشر وسريع وحماسي", strength: "الشجاعة والمبادرة", shadow: "الاندفاع وقلة الصبر", growth: "تتعلم تبدأ من غير ما تستنى إذن حد، وتكمل الي بدأته" },
  { n: "الثور", g: "♉", el: 1, mod: 1, ruler: "venus", d: "٢٠ أبريل – ٢٠ مايو", way: "هادي وثابت وحسي", strength: "الصبر والثبات والذوق", shadow: "العند ومقاومة التغيير", growth: "تتعلم تسيب الراحة المضمونة وتجرب الجديد" },
  { n: "الجوزاء", g: "♊", el: 2, mod: 2, ruler: "mercury", d: "٢١ مايو – ٢٠ يونيو", way: "سريع ومتنقل وفضولي", strength: "الفضول وسرعة البديهة وخفة الدم", shadow: "التشتت وتغيير الرأي", growth: "تتعلم تركز في حاجة واحدة لحد ما تكتمل" },
  { n: "السرطان", g: "♋", el: 3, mod: 0, ruler: "moon", d: "٢١ يونيو – ٢٢ يوليو", way: "حساس وحنون وحمائي", strength: "الاحتواء والحدس والولاء", shadow: "التعلق والمزاج المتقلب", growth: "تتعلم تحمي نفسك زي ما بتحمي غيرك" },
  { n: "الأسد", g: "♌", el: 0, mod: 1, ruler: "sun", d: "٢٣ يوليو – ٢٢ أغسطس", way: "واثق ودافي وصاحب حضور", strength: "الكرم والثقة والقيادة", shadow: "الكبرياء والحاجة للتقدير", growth: "تتعلم تعطي من غير ما تستنى التصفيق" },
  { n: "العذراء", g: "♍", el: 1, mod: 2, ruler: "mercury", d: "٢٣ أغسطس – ٢٢ سبتمبر", way: "دقيق وعملي ومنظم", strength: "الدقة وحل المشاكل وخدمة الناس", shadow: "النقد الزايد وقلق التفاصيل", growth: "تتعلم تسامح نفسك وماتستناش الكمال" },
  { n: "الميزان", g: "♎", el: 2, mod: 0, ruler: "venus", d: "٢٣ سبتمبر – ٢٢ أكتوبر", way: "لطيف ومتوازن وبيدور على الانسجام", strength: "الذوق والعدل والدبلوماسية", shadow: "التردد وتجنب المواجهة", growth: "تتعلم تاخد قرارك وتقول رأيك حتى لو هتزعل حد" },
  { n: "العقرب", g: "♏", el: 3, mod: 1, ruler: "pluto", d: "٢٣ أكتوبر – ٢١ نوفمبر", way: "عميق وغامض وشديد", strength: "العمق والإصرار والحدس", shadow: "الشك والسيطرة والغيرة", growth: "تتعلم تثق وتسيب السيطرة" },
  { n: "القوس", g: "♐", el: 0, mod: 2, ruler: "jupiter", d: "٢٢ نوفمبر – ٢١ ديسمبر", way: "متفائل وحر وبيحب المغامرة", strength: "التفاؤل والصراحة وحب التعلم", shadow: "المبالغة والصراحة الجارحة", growth: "تتعلم تلتزم بالتفاصيل وماتبالغش في الوعود" },
  { n: "الجدي", g: "♑", el: 1, mod: 0, ruler: "saturn", d: "٢٢ ديسمبر – ١٩ يناير", way: "جاد ومنضبط وطموح", strength: "المسؤولية والصبر والطموح", shadow: "القسوة على النفس والتشاؤم", growth: "تتعلم تفرح في الطريق وماتستناش الوصول بس" },
  { n: "الدلو", g: "♒", el: 2, mod: 1, ruler: "uranus", d: "٢٠ يناير – ١٨ فبراير", way: "مستقل ومبتكر وغير تقليدي", strength: "الابتكار والاستقلال والنظرة الإنسانية", shadow: "البرود والعند في الرأي", growth: "تتعلم تقرب من مشاعرك ومن الي حواليك" },
  { n: "الحوت", g: "♓", el: 3, mod: 2, ruler: "neptune", d: "١٩ فبراير – ٢٠ مارس", way: "حالم وحساس وبيتأثر بالأجواء", strength: "الخيال والتعاطف والروحانية", shadow: "الهروب والتوهان وتحمل مسؤولية غيرك", growth: "تتعلم تحط حدود وتفرق بين الحلم والواقع" }
];

/* ---------- الكواكب ---------- */
const PLANETS = {
  sun:     { n: "الشمس",   g: "☉", theme: "هويتك وثقتك",                    give: "حيوية وثقة وظهور",                     watch: "الغرور أو فرض الرأي",                  lens: "جوهرك وطريقة تعبيرك عن نفسك" },
  moon:    { n: "القمر",   g: "☽", theme: "مشاعرك واحتياجك للأمان",         give: "راحة وانتماء ودفا",                    watch: "التقلب والحساسية الزايدة",             lens: "طريقة إحساسك بالأمان" },
  mercury: { n: "عطارد",   g: "☿", theme: "تفكيرك وتواصلك",                 give: "وضوح في الأفكار وسهولة في التواصل",     watch: "الشرود وكتر الكلام",                    lens: "طريقة تفكيرك وكلامك" },
  venus:   { n: "الزهرة",  g: "♀", theme: "حبك وذوقك",                      give: "جاذبية ومتعة وانسجام",                 watch: "الدلع والمبالغة في إرضاء الناس",       lens: "طريقة حبك وإعجابك بالناس" },
  mars:    { n: "المريخ",  g: "♂", theme: "طاقتك ودافعك",                   give: "حماس وجرأة وسرعة في الإنجاز",          watch: "العصبية والاندفاع",                    lens: "طريقة تحركك ودفاعك عن نفسك" },
  jupiter: { n: "المشتري", g: "♃", theme: "حظك وتفاؤلك",                    give: "فرص وتوسع ونمو",                       watch: "المبالغة والوعود الكبيرة",             lens: "طريقة نموك وتفاؤلك" },
  saturn:  { n: "زحل",     g: "♄", theme: "مسؤولياتك وانضباطك",             give: "نتايج ثابتة بالصبر والتنظيم",          watch: "الضغط على نفسك والخوف من الفشل",       lens: "طريقة التزامك وضبط نفسك" },
  uranus:  { n: "أورانوس", g: "♅", theme: "رغبتك في التغيير والحرية",       give: "تجديد ومفاجآت وأفكار مختلفة",          watch: "التمرد والقرارات المفاجئة" },
  neptune: { n: "نبتون",   g: "♆", theme: "خيالك وحدسك",                    give: "إلهام وحس فني وروحاني",                watch: "التوهان والأوهام" },
  pluto:   { n: "بلوتو",   g: "♇", theme: "قوتك الداخلية وقدرتك على التحول", give: "تجديد عميق وقوة",                      watch: "السيطرة والهوس" },
  node:    { n: "العقدة الشمالية (متوسطة)", g: "☊" },
  truenode:{ n: "العقدة الشمالية (حقيقية)", g: "☊" },
  fortune: { n: "سهم السعادة", g: "⊗" },
  lilith:  { n: "ليليث (تقريبي، غير محسوم)",   g: "⚸" }
};
const PLANET_KEYS = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];

/* ---------- البيوت ---------- */
const HOUSES = [
  { n: "الأول",          area: "شخصيتك وصورتك أمام الناس" },
  { n: "الثاني",         area: "المال وإحساسك بقيمتك" },
  { n: "الثالث",         area: "الكلام والتواصل والتنقلات القريبة" },
  { n: "الرابع",         area: "البيت والعائلة والجذور" },
  { n: "الخامس",         area: "الحب والمتعة والإبداع" },
  { n: "السادس",         area: "العمل اليومي والصحة والروتين" },
  { n: "السابع",         area: "العلاقات والشراكات" },
  { n: "الثامن",         area: "المشاعر العميقة والأسرار والمال المشترك" },
  { n: "التاسع",         area: "السفر والتعلم والمعتقدات" },
  { n: "العاشر",         area: "المهنة والمكانة والإنجاز" },
  { n: "الحادي عشر",     area: "الأصدقاء والأحلام والمجموعات" },
  { n: "الثاني عشر",     area: "الباطن والعزلة والراحة النفسية" }
];

/* ---------- قراءات الشمس والقمر والطالع ---------- */
const SUN_TXT = [
  "إنت مبادر وشجاع، بتحب تبدأ وتقود ومابتحبش الانتظار. حماسك معدي، لكن محتاج تتعلم تهدّي وتكمل الي بدأته.",
  "هويتك مبنية على الثبات والاستقرار. بتحب الراحة والجمال والأمان المادي، وبتبني حياتك بخطوات مضمونة.",
  "فضولك هو وقودك. بتحب تعرف وتتكلم وتجرب، وبتتأقلم بسرعة. تحدّيك إنك تركز في حاجة واحدة لحد ما تكتمل.",
  "قلبك هو بوصلتك. بتحمي الي بتحبهم وبتعيش بإحساسك، والبيت والعيلة محور مهم عندك. تعلم تحمي نفسك كمان.",
  "عندك حضور ودفا وكاريزما، وبتحب تتميز وتعطي من قلبك. قوتك في الثقة والكرم، وتحدّيك إنك ماتعتمدش على التصفيق بس.",
  "عقلك دقيق وبتحب تفيد وتصلّح وتحسّن. بتلاحظ الي غيرك مابيلاحظهوش. تعلم تسامح نفسك وماتستناش الكمال.",
  "بتدور على التوازن والعدل والجمال في كل حاجة. بتفهم الناس بسهولة، وتحدّيك إنك تاخد قرارك من غير ما تخاف تزعل حد.",
  "إنت عميق وشديد وبتحس بالحاجة الي ورا الكلام. بتحب بصدق وبتحارب بشراسة. قوتك في التحول، وتحدّيك إنك تثق وتسيب السيطرة.",
  "بتدور على المعنى والحرية والمغامرة. متفائل وصريح وبتحب تتعلم وتسافر. تحدّيك إنك تلتزم بالتفاصيل وماتبالغش في الوعود.",
  "طموح ومسؤول، وبتبني بالصبر قدام الناس. بتاخد الحياة بجدية وبتوصل لأهدافك. تعلم تفرح في الطريق وماتستناش الوصول بس.",
  "إنت مستقل ومختلف، ودماغك بتسبق زمانها. بتحب الحرية والأفكار الجديدة والناس. تحدّيك إنك تقرب من مشاعرك ومن الي حواليك.",
  "حساس وحالم وروحك واسعة. بتحس بالناس وبتتأثر بأجواءهم، وعندك خيال وإبداع. تحدّيك إنك تحط حدود وتفرق بين الحلم والواقع."
];
const MOON_TXT = [
  "مشاعرك سريعة وصريحة، بتزعل وتفرح بقوة وبتعبّر على طول. بتحس بالأمان لما تتحرك وتعمل حاجة، ومابتحبش تكتم.",
  "بتحس بالأمان في الروتين والراحة والجمال. مشاعرك ثابتة وبطيئة، وبتتعلق بالي بتحبه. الأكل الحلو والبيت الدافي بيريحوك.",
  "مزاجك بيتغير مع أفكارك. بتحس بالأمان لما تتكلم وتعرف وتتواصل. الحكي مع حد بتثق فيه بيفرّغك أكتر من الصمت.",
  "القمر في بيته، فإنت حساس جدًا وحدسك قوي. بتحتاج بيت وعيلة وأمان عاطفي، وبتمتص مزاج الي حواليك. محتاج وقت لوحدك تشحن فيه.",
  "بتحتاج تحس إنك مهم ومحبوب. مشاعرك دافية وكريمة وبتحب الفرح واللعب والإبداع. بتتأذى لو اتجاهلوك.",
  "بتهدّى لما تنظّم وتفيد وتكون مشغول بحاجة مفيدة. مشاعرك بتتحول لقلق أحيانًا، والروتين الصحي بيريحك.",
  "بتحس بالأمان جوه علاقة وصحبة. مشاعرك بتتأثر بالناس القريبين منك، ومابتحبش الخناق. محتاج انسجام حواليك.",
  "مشاعرك عميقة وقوية ومابتظهرش بسهولة. بتتعلق بقوة وبتحتاج ثقة كاملة. لما تتأذى بتفتكر طويل، والتسامح بيحررك.",
  "بتحس بالأمان لما تكون حر ومتفائل ومعاك مساحة. بتحتاج سفر وتعلم ومعنى، وبتتضايق من القيود والتفاصيل الخانقة.",
  "بتكتم مشاعرك وبتحس بالأمان لما تكون مسيطر ومنجز. ممكن تبان باردة من بره، لكن جواك مسؤولية كبيرة. اسمح لنفسك تحتاج حد.",
  "بتحتاج مساحة وحرية في مشاعرك. بتحس بالأمان وسط ناس بتفهمك وبتقبل اختلافك، وبتتعامل مع المشاعر بعقل أحيانًا.",
  "إحساسك واسع وبتحس بكل حاجة حواليك، فبتحتاج وقت هادي وعزلة تنضف فيها. الفن والموسيقى والمياه بيريحوك."
];
const RISING_TXT = [
  "بتظهر قدام الناس مباشر وجريء وحماسي. أول انطباع عنك إنك قوي ومبادر.",
  "بتظهر هادي وثابت ودافي. الناس بتحس معاك بالأمان والاستقرار، وبتلاحظ ذوقك وهدوءك.",
  "بتظهر فضولي وخفيف الدم وبتحب الكلام. أول انطباع عنك إنك ذكي وسريع وودود.",
  "بتظهر حساس وحنون وحمائي. الناس بتحس إنك قريب منهم، لكن بتاخد وقت لحد ما تفتح قلبك.",
  "بتظهر واثق وجذاب وليك حضور. الناس بتنتبه ليك أول ما تدخل، وبتحب تشاركهم الفرح.",
  "بتظهر هادي ودقيق ومرتب. أول انطباع إنك عملي وناضج ومعتمد عليه.",
  "بتظهر لطيف ومتوازن وأنيق. الناس بتحس إنك سهل التعامل ودبلوماسي.",
  "بتظهر غامض وقوي وليك هيبة. نظراتك بتقول أكتر من كلامك، والناس بتاخد وقت لحد ما تفهمك.",
  "بتظهر متفائل ومنفتح وصريح. أول انطباع إنك صاحب مغامرة وروح حلوة.",
  "بتظهر جاد ومحترم وناضج. الناس بتشوفك مسؤول وطموح، وبتاخد وقت لحد ما تشوف جانبك الحنين.",
  "بتظهر مختلف وودود ومستقل. الناس بتشوفك غير تقليدي وبتحترم أفكارك.",
  "بتظهر حالم وحنون وفيك غموض. الناس بتحس بإحساسك، وأحيانًا بتبان شارد."
];
const MOON_ADVICE = [
  "لما تتضايق، اتحرك أو اتمرن قبل ما ترد أو تتكلم.",
  "اهتم بجسمك: أكل كويس وراحة ومكان مريح بيهدّوك.",
  "اكتب أفكارك أو اتكلم مع صاحبك، الحكي بيفرّغ توترك.",
  "خصص وقت لنفسك في مكان آمن بعيد عن مزاج الناس.",
  "اعمل حاجة بتفرحك أو بتعبّر عن إبداعك، وماتستناش حد يقدّرك.",
  "ريّح دماغك بروتين بسيط ونوم منتظم، وماتحاسبش نفسك على كل غلطة.",
  "ابعد عن الخناق وخلّي حواليك ناس مريحة، لكن قول رأيك.",
  "افصح عن الي جواك لحد بتثق فيه بدل ما تكتمه.",
  "سيب لنفسك مساحة، وخروجة أو تعلم حاجة جديدة بيشحنوك.",
  "اسمح لنفسك تطلب مساعدة وتريّح من غير ما تحس بذنب.",
  "خد وقت لوحدك، وبعدها اتكلم مع حد قريب عن إحساسك.",
  "الموسيقى والمياه والخلوة بيشحنوك، وحط حدود مع مزاج الناس."
];
const VENUS_EL = [
  "في الحب بتحب الشغف والمفاجآت والاهتمام الواضح.",
  "في الحب بتحب الثبات والتصرفات العملية والإحساس بالأمان.",
  "في الحب بتحب الحوار والخفة والعقل المتقارب.",
  "في الحب بتحب العمق والاحتواء والمشاعر الصادقة."
];
const MARS_EL = [
  "طاقتك بتشتغل بالمبادرة والمنافسة، فادخل في تحدي واضح.",
  "طاقتك بتشتغل بالخطة والمثابرة، فاشتغل على المدى الطويل.",
  "طاقتك بتشتغل بالأفكار والتواصل، فخطط واتكلم قبل ما تتحرك.",
  "طاقتك بتتحرك بالمشاعر، فاختار معاركك وماتسكتش على الي بيضايقك."
];
const EL_DOM = [
  "النار هي الغالبة عندك: عندك حماس وجرأة وطاقة بتحرك الي حواليك. محتاج تدّي نفسك فسحة للراحة وماتحرقش طاقتك بسرعة.",
  "التراب هو الغالب عندك: عملي وثابت وبتحب النتايج الملموسة. محتاج تسمح لنفسك بالخيال والمرونة وماتتمسكش بالمضمون بس.",
  "الهواء هو الغالب عندك: عقلك نشيط وبتحب الكلام والأفكار والناس. محتاج تنزّل أفكارك على الأرض وتتصل بإحساسك.",
  "الماء هو الغالب عندك: إحساسك عميق وحدسك قوي وبتتأثر بالجو. محتاج حدود واضحة وتفرق بين مشاعرك ومشاعر غيرك."
];
const EL_LACK = [
  "النار قليلة عندك: ممكن تتردد قبل ما تبدأ أو حماسك يقل. جرّب خطوات صغيرة وقرارات سريعة تشعل الدافع.",
  "التراب قليل عندك: ممكن الروتين والتنظيم المادي يتعبك. ابني عادات بسيطة وحط ميزانية وجدول.",
  "الهواء قليل عندك: ممكن تلاقي صعوبة في التعبير عن أفكارك أو الانفتاح. ادخل في حوارات وتعلم مع ناس.",
  "الماء قليل عندك: ممكن تعبّر عن مشاعرك بصعوبة. اسمح لنفسك تعبّر وتتواصل عاطفيًا من غير تحليل زايد."
];
const MOD_DOM = [
  "الطابع الكاردينال غالب: بتبدأ الأمور وبتحب المبادرة، لكن ممكن تفقد الحماس بعد البداية. اعمل خطة متابعة.",
  "الطابع الثابت غالب: بتكمل وبتصبر ومابتتهزش، لكن ممكن تتصلب في رأيك. جرّب تشوف التغيير كفرصة.",
  "الطابع المتحول غالب: مرن وبتتأقلم بسهولة، لكن ممكن تتشتت. حدد أولوية واحدة وماتفتحش كذا جبهة."
];

/* ---------- الزوايا ---------- */
const ASPECTS = [
  { k: "conj", ang: 0,   orb: 8, n: "اقتران", nat: "ممتزجين مع بعض كأنهم قوة واحدة",         tr: "لحظة تركيز وبداية جديدة" },
  { k: "sext", ang: 60,  orb: 4, n: "تسديس",  nat: "بيتعاونوا ويدّوك فرص لو تحركت",           tr: "فرصة سهلة لو استغلتها" },
  { k: "sq",   ang: 90,  orb: 6, n: "تربيع",  nat: "بينهم توتر بيدفعك تتطور وتتحرك",          tr: "ضغط بيطلب منك تصرف" },
  { k: "tri",  ang: 120, orb: 7, n: "تثليث",  nat: "منسجمين وبيتدفقوا بسهولة",                tr: "تدفق وراحة وحظ حلو" },
  { k: "opp",  ang: 180, orb: 8, n: "مقابلة", nat: "بينهم شد وجذب والمطلوب توازن",             tr: "موقف بيحطك قدام اختيار أو شد مع حد" }
];
const MOON_TODAY = [
  "النهاردة الطاقة عالية: اتحرك وابدأ الحاجة الي مؤجلها.",
  "النهاردة يوم عملي: رتب مهامك وخلّص الأساسيات.",
  "النهاردة يوم تواصل: كلم الناس وتبادل الأفكار.",
  "النهاردة المشاعر أوضح: اسمع إحساسك وخد وقت لنفسك."
];
const PHASES = ["محاق (قمر جديد)", "هلال متزايد", "تربيع أول", "أحدب متزايد", "بدر (قمر كامل)", "أحدب متناقص", "تربيع أخير", "هلال متناقص"];


/* ---------- المدن: [الاسم، خط العرض، خط الطول، المنطقة الزمنية] ---------- */
const CITY_GROUPS = [
  { g: "مصر", tz: "Africa/Cairo", c: [["القاهرة", 30.0444, 31.2357], ["الجيزة", 30.0131, 31.2089], ["الإسكندرية", 31.2001, 29.9187], ["المنصورة", 31.0409, 31.3785], ["طنطا", 30.7865, 31.0004], ["الزقازيق", 30.5877, 31.5020], ["بنها", 30.4660, 31.1848], ["شبين الكوم", 30.5972, 30.9876], ["دمنهور", 31.0341, 30.4682], ["كفر الشيخ", 31.1107, 30.9388], ["دمياط", 31.4165, 31.8133], ["بورسعيد", 31.2653, 32.3019], ["الإسماعيلية", 30.5965, 32.2715], ["السويس", 29.9668, 32.5498], ["العريش", 31.1316, 33.7984], ["الفيوم", 29.3084, 30.8428], ["بني سويف", 29.0661, 31.0994], ["المنيا", 28.1099, 30.7503], ["أسيوط", 27.1783, 31.1859], ["سوهاج", 26.5591, 31.6957], ["قنا", 26.1551, 32.7160], ["الأقصر", 25.6872, 32.6396], ["أسوان", 24.0889, 32.8998], ["الغردقة", 27.2579, 33.8116], ["شرم الشيخ", 27.9158, 34.3300], ["مرسى مطروح", 31.3543, 27.2373], ["العلمين", 30.8300, 28.9550], ["مرسى علم", 25.0676, 34.8780], ["الوادي الجديد", 25.4500, 30.5500], ["رفح", 31.2800, 34.2400]] },
  { g: "السعودية", c: [["الرياض", 24.7136, 46.6753, "Asia/Riyadh"], ["جدة", 21.4858, 39.1925, "Asia/Riyadh"], ["مكة المكرمة", 21.3891, 39.8579, "Asia/Riyadh"], ["المدينة المنورة", 24.5247, 39.5692, "Asia/Riyadh"], ["الدمام", 26.4207, 50.0888, "Asia/Riyadh"], ["أبها", 18.2164, 42.5053, "Asia/Riyadh"], ["تبوك", 28.3838, 36.5550, "Asia/Riyadh"], ["الطائف", 21.2703, 40.4158, "Asia/Riyadh"], ["جازان", 16.8892, 42.5511, "Asia/Riyadh"], ["حائل", 27.5114, 41.7208, "Asia/Riyadh"], ["بريدة", 26.3592, 43.9818, "Asia/Riyadh"], ["ينبع", 24.0895, 38.0618, "Asia/Riyadh"], ["الأحساء", 25.3830, 49.5860, "Asia/Riyadh"]] },
  { g: "الخليج", c: [["دبي", 25.2048, 55.2708, "Asia/Dubai"], ["أبوظبي", 24.4539, 54.3773, "Asia/Dubai"], ["الشارقة", 25.3463, 55.4209, "Asia/Dubai"], ["الكويت", 29.3759, 47.9774, "Asia/Kuwait"], ["الدوحة", 25.2854, 51.5310, "Asia/Qatar"], ["المنامة", 26.2285, 50.5860, "Asia/Bahrain"], ["مسقط", 23.5880, 58.3829, "Asia/Muscat"]] },
  { g: "الشام والعراق", c: [["عمّان", 31.9454, 35.9284, "Asia/Amman"], ["بيروت", 33.8938, 35.5018, "Asia/Beirut"], ["دمشق", 33.5138, 36.2765, "Asia/Damascus"], ["حلب", 36.2021, 37.1343, "Asia/Damascus"], ["بغداد", 33.3152, 44.3661, "Asia/Baghdad"], ["البصرة", 30.5085, 47.7835, "Asia/Baghdad"], ["أربيل", 36.1911, 44.0092, "Asia/Baghdad"], ["الموصل", 36.3350, 43.1189, "Asia/Baghdad"], ["كركوك", 35.4681, 44.3922, "Asia/Baghdad"], ["النجف", 32.0003, 44.3354, "Asia/Baghdad"], ["كربلاء", 32.6160, 44.0249, "Asia/Baghdad"], ["السليمانية", 35.5613, 45.4309, "Asia/Baghdad"], ["القدس", 31.7683, 35.2137, "Asia/Jerusalem"], ["رام الله", 31.9038, 35.2034, "Asia/Hebron"], ["غزة", 31.5017, 34.4668, "Asia/Gaza"]] },
  { g: "اليمن والسودان وشمال أفريقيا", c: [["صنعاء", 15.3694, 44.1910, "Asia/Aden"], ["عدن", 12.7855, 45.0187, "Asia/Aden"], ["الخرطوم", 15.5007, 32.5599, "Africa/Khartoum"], ["طرابلس", 32.8872, 13.1913, "Africa/Tripoli"], ["بنغازي", 32.1167, 20.0667, "Africa/Tripoli"], ["تونس", 36.8065, 10.1815, "Africa/Tunis"], ["الجزائر", 36.7538, 3.0588, "Africa/Algiers"], ["الدار البيضاء", 33.5731, -7.5898, "Africa/Casablanca"], ["الرباط", 34.0209, -6.8416, "Africa/Casablanca"]] },
  { g: "العالم", c: [["إسطنبول", 41.0082, 28.9784, "Europe/Istanbul"], ["لندن", 51.5074, -0.1278, "Europe/London"], ["باريس", 48.8566, 2.3522, "Europe/Paris"], ["برلين", 52.5200, 13.4050, "Europe/Berlin"], ["روما", 41.9028, 12.4964, "Europe/Rome"], ["مدريد", 40.4168, -3.7038, "Europe/Madrid"], ["موسكو", 55.7558, 37.6173, "Europe/Moscow"], ["نيويورك", 40.7128, -74.0060, "America/New_York"], ["شيكاغو", 41.8781, -87.6298, "America/Chicago"], ["لوس أنجلوس", 34.0522, -118.2437, "America/Los_Angeles"], ["تورنتو", 43.6532, -79.3832, "America/Toronto"], ["سيدني", -33.8688, 151.2093, "Australia/Sydney"], ["مومباي", 19.0760, 72.8777, "Asia/Kolkata"], ["كراتشي", 24.8607, 67.0011, "Asia/Karachi"]] }
];
const CITIES = [];
window.__aqCITIES=function(){return CITIES;};
CITY_GROUPS.forEach(gr => gr.c.forEach(c => CITIES.push({ n: c[0], lat: c[1], lon: c[2], tz: c[3] || gr.tz, g: gr.g })));

/* ======================= الأركانا الـ٢٢ (ماتريكس + حيوات سابقة) ======================= */
const ARCANA = [
 {
  "n": "الساحر",
  "en": "The Magician",
  "core": "الإرادة والمهارة، وإن البداية بإيدك",
  "shadow": "الكلام الأكتر من الفعل أو التلاعب بالناس",
  "real": "عندك أدوات تبدأ بيها: مهارة أو فرصة أو فكرة. وقت تتحرك وتعرض نفسك بدل ما تستنى حد يديك إذن.",
  "release": "اكتب حاجة بتأجلها بحجة إنك مش جاهز، وابدأ فيها ١٠ دقايق النهاردة من غير ما تحكم على النتيجة."
 },
 {
  "n": "الكاهنة العليا",
  "en": "The High Priestess",
  "core": "الحدس والأسرار والمعرفة الصامتة",
  "shadow": "الانغلاق وكتمان المشاعر",
  "real": "في حاجة لسه مش ظاهرة. استنى قبل ما تاخد قرار، وراقب الي بيتقال بين السطور.",
  "release": "قبل النوم اسأل نفسك سؤال واحد، واكتب أول إجابة تيجي من غير ما تراجعها."
 },
 {
  "n": "الإمبراطورة",
  "en": "The Empress",
  "core": "الحنان والخصوبة والوفرة",
  "shadow": "التدليل الزايد أو التعلق",
  "real": "فترة نمو وراحة، ممكن تظهر في مشروع بيكبر أو علاقة بتدفا. اهتم بجسمك وبيتك.",
  "release": "اعمل حاجة لجسمك النهاردة من غير ذنب: حمام دافي، أكلة بتحبها، أو مشوار في مكان أخضر."
 },
 {
  "n": "الإمبراطور",
  "en": "The Emperor",
  "core": "الاستقرار والتنظيم والحدود",
  "shadow": "التحكم والعند",
  "real": "وقت تحط نظام وحدود: ميزانية أو جدول أو قرار حاسم قدام شخص. الي بيتبني بقواعد بيعيش.",
  "release": "اكتب ٣ حدود لازم تحطها الأسبوع ده، وقول واحد منهم لشخص بهدوء."
 },
 {
  "n": "الكاهن الأعظم",
  "en": "The Hierophant",
  "core": "التعلم والإرشاد والأصول",
  "shadow": "الجمود والتقليد الأعمى",
  "real": "وقت تسأل حد خبير أو تاخد كورس أو تلتزم بمنهج. الحاجة هتمشي بالأصول مش بالاختصارات.",
  "release": "اسأل نفسك: أنهي قاعدة من الي اتربيت عليها لسه بتخدمني، وأنهي واحدة لازم أفكها؟"
 },
 {
  "n": "العاشقان",
  "en": "The Lovers",
  "core": "الاختيار والعلاقة والانسجام",
  "shadow": "التردد أو علاقة على حساب نفسك",
  "real": "قرار حب أو شراكة قدامك. اختار بقلبك وعقلك مع بعض، وماتختارش من الخوف من الوحدة.",
  "release": "اكتب ٣ قيم مش ممكن تتنازل عنها في أي علاقة."
 },
 {
  "n": "العربة",
  "en": "The Chariot",
  "core": "الانتصار بالإرادة والتحرك",
  "shadow": "العناد والاندفاع",
  "real": "وقت تتحرك: سفر أو نقلة أو تحدي. ركز على اتجاه واحد وسيطر على الي بيشدك يمين وشمال.",
  "release": "حدد هدف واحد للشهر ده، وقسّمه لخطوة صغيرة تعملها كل يوم."
 },
 {
  "n": "العدالة",
  "en": "Justice",
  "core": "الحق والميزان والمسؤولية عن الاختيار",
  "shadow": "الحكم القاسي أو لوم الغير",
  "real": "موقف أو أوراق أو قرار بيرجع لك بنتيجة اختياراتك. اقرا قبل ما توقّع واتصرف بعدل.",
  "release": "اكتب موقف بتلوم فيه حد، وبعده اكتب الجزء الي إنت مسؤول عنه فيه."
 },
 {
  "n": "الناسك",
  "en": "The Hermit",
  "core": "العزلة والبحث الداخلي والحكمة",
  "shadow": "الانعزال والوحدة",
  "real": "وقت تقلل الضجة وتفكر لوحدك. ابعد عن الناس الي بتستنزفك وركز في هدفك.",
  "release": "اقعد ٢٠ دقيقة من غير موبايل النهاردة، وسجل أي فكرة بتيجي."
 },
 {
  "n": "عجلة الحظ",
  "en": "Wheel of Fortune",
  "core": "التغيير والدورات والفرصة",
  "shadow": "مقاومة الدورة أو الاستسلام للحظ",
  "real": "حاجة بتتغير، غالبًا مش بإيدك. الفرصة بتيجي لمن يكون جاهز، فجهز نفسك.",
  "release": "اكتب ٣ حاجات اتغيرت في حياتك السنة دي، وإيه الي اتعلمته من كل واحدة."
 },
 {
  "n": "القوة",
  "en": "Strength",
  "core": "الشجاعة الهادية والسيطرة بحنان",
  "shadow": "كبت الغضب أو الضعف",
  "real": "موقف بيطلب صبر وثبات مش صوت عالي. قوتك في الهدوء.",
  "release": "لما تغضب النهاردة خد ٣ أنفاس عميقة قبل الرد، وبعدها قول الي محتاجه بصراحة."
 },
 {
  "n": "المشنوق",
  "en": "The Hanged Man",
  "core": "التسليم والنظرة المختلفة",
  "shadow": "التضحية بلا داعي أو الجمود",
  "real": "الموضوع واقف ومش هيتحرك بالضغط. مرحلة انتظار لازم تتقبلها وتشوف الحاجة من زاوية تانية.",
  "release": "قول لنفسك: أنا بسيب النتيجة، وابدأ بحاجة صغيرة مختلفة النهاردة."
 },
 {
  "n": "الموت",
  "en": "Death",
  "core": "النهاية والبداية والتحول الجذري",
  "shadow": "التعلق بالماضي",
  "real": "حاجة بتنتهي: وظيفة أو علاقة أو مرحلة. مش لازم تكون نهاية سيئة، هي فتح لمكان جديد.",
  "release": "اكتب خطاب وداع لشيء انتهى، وبعدها اقطعه أو احرقه بأمان."
 },
 {
  "n": "الاعتدال",
  "en": "Temperance",
  "core": "التوازن والصبر والشفاء",
  "shadow": "التطرف أو التسرع",
  "real": "الحل في الوسط: مواعيد منتظمة، وخلط بين الشغل والراحة، وخطوة بخطوة.",
  "release": "رتب يومك بحيث يبقى فيه وقت للشغل ووقت للجسم ووقت للروح، ٣ أوقات ثابتة."
 },
 {
  "n": "الشيطان",
  "en": "The Devil",
  "core": "التعلق والرغبة والقيود الي بنختارها",
  "shadow": "الإدمان والتحكم",
  "real": "علاقة أو عادة بتشدك وإنت عارف إنها مش في صالحك. المفتاح في إيدك مش في إيد حد.",
  "release": "اكتب عادة أو علاقة مرهقة، واختار خطوة صغيرة تبعدك عنها النهاردة."
 },
 {
  "n": "البرج",
  "en": "The Tower",
  "core": "الانهيار المفاجئ وكشف الحقيقة",
  "shadow": "الصدمة والإنكار",
  "real": "حاجة مبنية على أساس ضعيف بتتهز. مؤلم لكنه بيكشف الحقيقة قبل ما تتأخر.",
  "release": "اسأل نفسك: إيه الحقيقة الي كنت بتتجنب أشوفها؟ واكتبها بصراحة."
 },
 {
  "n": "النجمة",
  "en": "The Star",
  "core": "الأمل والشفاء والإلهام",
  "shadow": "فقدان الإيمان",
  "real": "بعد فترة صعبة بتبدأ ترتاح. أحلامك ممكنة، ابدأ بخطوات صغيرة.",
  "release": "اطلع بالليل أو بص للسما ٥ دقايق وقول: أنا أستحق الراحة."
 },
 {
  "n": "القمر",
  "en": "The Moon",
  "core": "الخيال والحدس والخوف الغامض",
  "shadow": "الأوهام والقلق",
  "real": "الصورة مش واضحة. ماتاخدش قرارات كبيرة وإنت قلقان، وتأكد من المعلومات.",
  "release": "اكتب حلم أو إحساس غريب، وبعدين اسأل: إيه الحاجة الحقيقية الي بتخوفني؟"
 },
 {
  "n": "الشمس",
  "en": "The Sun",
  "core": "الفرح والنجاح والوضوح",
  "shadow": "الغرور أو الإرهاق من العطاء",
  "real": "نتيجة إيجابية ووضوح، علاقة أو مشروع بيدفا. استمتع من غير ذنب.",
  "release": "اقعد ١٠ دقايق في الشمس وفكر في حاجة واحدة بتشكر عليها."
 },
 {
  "n": "الحكم",
  "en": "Judgement",
  "core": "النداء والتجديد والمحاسبة",
  "shadow": "الندم أو جلد الذات",
  "real": "وقت قرار مصيري: تبدأ فصل جديد بعد ما تراجع الماضي. حاجة مؤجلة بتطلب ردّك.",
  "release": "اكتب رسالة سماح لنفسك عن غلطة قديمة، واقراها بصوت عالي."
 },
 {
  "n": "العالم",
  "en": "The World",
  "core": "الاكتمال والإنجاز والتكامل",
  "shadow": "الخوف من الخاتمة",
  "real": "مرحلة بتكتمل: شهادة أو مشروع أو رحلة. افرح بإنجازك وبعدين اختار الخطوة الجاية.",
  "release": "اكتب ٣ إنجازات عملتها السنة دي، وكافئ نفسك."
 },
 {
  "n": "المجنون",
  "en": "The Fool",
  "core": "البداية الجديدة والثقة والقفزة",
  "shadow": "الاندفاع من غير حساب",
  "real": "مرحلة جديدة: سفر أو مشروع أو قرار جريء. خد خطوة، بس احسبها.",
  "release": "اعمل حاجة صغيرة مختلفة النهاردة: طريق جديد أو أكلة جديدة أو قرار بسيط بتأجله."
 }
];

/* ---------- أدوار نقاط المصفوفة ---------- */
const ROLES = {
  A: { n: "شخصيتك وموهبتك الأساسية", intro: "ده الطبع الي اتولدت بيه، وبيظهر في الي بتعمله بسهولة:" },
  B: { n: "هدفك ورسالتك", intro: "ده الاتجاه الي حياتك بتشدك ناحيته:" },
  C: { n: "الي ورثته من العيلة والماضي", intro: "ده الي وصلك من الأهل والبيئة، وبيأثر في ردود أفعالك:" },
  D: { n: "الذيل الكارمي (دروس الحيوات السابقة)", intro: "ده الدرس الي بيتكرر معاك لحد ما تتعلمه:" },
  E: { n: "جوهرك ومنطقة راحتك", intro: "ده قلبك الحقيقي، والمكان الي بترجع له لما تتعب:" },
  F: { n: "شغلك وتعبيرك عن نفسك", intro: "ده اللون الي بيظهر في شغلك وإبداعك:" },
  G: { n: "الفلوس والفرص", intro: "ده الي بيشكل علاقتك بالفلوس والفرص:" },
  H: { n: "الحب والعلاقات", intro: "ده الي بيتحكم في طريقة حبك وعلاقاتك:" },
  I: { n: "نقطة الاختبار الي بتكبرك", intro: "ده الموضوع الي حياتك بتختبرك فيه عشان تنضج:" }
};

/* ---------- طاقة الأرقام (مسار الحياة) ---------- */
const LP_TXT = {
  1: "رقم ١: الاستقلال والبدايات والقيادة، ودرسك إنك تعتمد على نفسك من غير عند.",
  2: "رقم ٢: التعاون والحساسية والسلام، ودرسك إنك تثق في نفسك وماتعيشش لإرضاء الناس.",
  3: "رقم ٣: التعبير والإبداع والبهجة، ودرسك إنك تتكلم بصدق وماتشتتش موهبتك.",
  4: "رقم ٤: البناء والانضباط والاستقرار، ودرسك إنك تبقى مرن وماتتجمدش.",
  5: "رقم ٥: الحرية والتغيير والمغامرة، ودرسك الالتزام من غير ما تحس بقيد.",
  6: "رقم ٦: الحب والمسؤولية والعيلة، ودرسك إنك تهتم بنفسك زي ما بتهتم بالناس.",
  7: "رقم ٧: التحليل والبحث والروحانية، ودرسك إنك تثق وتفتح قلبك.",
  8: "رقم ٨: القوة والمال والإنجاز، ودرسك التوازن بين المادة والقيم.",
  9: "رقم ٩: الإنسانية والتسامح والنهايات، ودرسك إنك تسيب الماضي وتدي من غير ما تنتظر.",
  11: "رقم ١١ (رقم رئيسي): حدس عالي وحساسية وإلهام، ودرسك إنك تثبت أعصابك وتحول الإلهام لفعل.",
  22: "رقم ٢٢ (رقم رئيسي): بنّاء الأحلام الكبيرة على الأرض، ودرسك إنك تتحمل الضغط من غير ما تنهار.",
  33: "رقم ٣٣ (رقم رئيسي): معلّم العطاء والشفاء، ودرسك إنك تحمي نفسك وإنت بتدي."
};

/* مسار الحياة: ملخصات الأرقام، مع إتاحة كل الأقسام مباشرة */
const LP_FREE = {
  1: { t: "الرائد وصانع البدايات", tag: "المبادرة والقيادة والاستقلال",
    essence: "مسار الحياة رقم (1) يرمز للبداية والإرادة والاستقلال. أنت هنا لتفتح طريقًا جديدًا، وتحوّل الفكرة إلى فعل، مع تذكير نفسك بأن القوة لا تعني أن تحمل كل شيء وحدك.",
    light: "نورك في المبادرة والشجاعة والقيادة الفطرية: تبدأ من الصفر، وتتحرك عندما يتردد الآخرون، وتقدر تلهم غيرك لما تجمع الثقة مع الوعي والمرونة.",
    shadow: "وفي الظل قد يتحول الاستقلال إلى عزلة، والثقة إلى عناد أو سيطرة، أو يظهر الخوف من الفشل في صورة تردد وتأجيل. طلب المساعدة وإكمال التفاصيل جزء من القيادة المتزنة." },
  2: { t: "الرادار البشري وصانع السلام", tag: "الحدس والاحتواء والشراكة والسلام",
    essence: "لو مسار حياتك هو الرقم (2)، فاعرف إنك مجيتش الدنيا دي عشان تحارب أو تعيش في دوشة وصراعات. روحك شايلة شفرة الاتصال والحدس والاحتواء. إنت الصمغ اللي بيربط الناس ببعضها. الناس بترتاح تحكيلك همومها لأنك بتسمع من غير ما تستعجل الحكم، وبتحب الهدوء والعلاقات الصادقة. في طاقة النور بتكون دبلوماسي ومتعاطف وبتساعد الناس توصل لحلول من غير ما تكسر خاطر حد. وفي طاقة الظل ممكن تمتص هموم غيرك، تكتم مشاعرك عشان ما تزعلش حد، وبعدها تنفجر أو تنسحب وتبقى شديد الحساسية للكلام والتلميحات.",
    light: "نورك في الإنصات والتعاطف والدبلوماسية: بتعرف تبني جسور بين الناس، وتوفر مساحة آمنة للكلام، وتلاحظ تفاصيل ممكن غيرك يفوّتها.",
    shadow: "وفي ضلك خوف من الرفض وإرضاء الآخرين على حساب نفسك، وكتمان للزعل لحد ما يتراكم. حدسك إحساس شخصي يستحق الانتباه، لكنه مش دليل مضمون على نوايا الآخرين؛ راجع الإحساس مع الوقائع والحدود الواضحة." },
  3: { t: "المعبّر", tag: "الكلمة والإبداع والبهجة",
    essence: "جوهرك إنك قناة للتعبير. اللي جواك عايز يطلع كلام أو فن أو ضحك أو حكاية. لما بتكتم نفسك طاقتك بتنطفي، ولما بتعبّر بصدق بتلمع وتنوّر اللي حواليك.",
    light: "نورك في خفة الروح والكاريزما: بتعرف تحوّل أصعب موقف لحكاية تضحك وتشفي، والناس بتحب تقعد قريب منك لأنك بتفكّرهم إن الدنيا لسه فيها حلاوة.",
    shadow: "وفي ضلك حزن بتداريه بالضحك والكلام، وبتشتت موهبتك في حاجات كتير من غير ما تكمل واحدة. والسبب في" },
  4: { t: "الباني", tag: "الثبات والبناء والأمان",
    essence: "جوهرك إنك الأساس اللي غيرك بيقف عليه. طاقتك بتحب النظام والخطة والخطوة الثابتة، وبترتاح لما تشوف حاجة اتبنت بإيدك طوبة طوبة. الناس بتعتمد عليك أكتر مما بتحس.",
    light: "نورك في الصبر والإخلاص: لما بتوعد بتنفذ، ولما بتبدأ حاجة بتكملها. وإنت اللي بيشتغل في هدوء لحد ما النتيجة تتكلم عنك.",
    shadow: "وفي ضلك خوف من المجهول بيخليك تتمسك بالمألوف حتى لو بقى بيخنقك، وبتحس إن راحتك لازم تتكسب بالتعب والشغل. والسبب في" },
  5: { t: "الحر", tag: "الحرية والتغيير والتجربة",
    essence: "جوهرك إنك روح بتتعلم بالتجربة مش بالقعدة. طاقتك بتحتاج هوا وحركة وتنوّع، وأي مكان أو علاقة بتحسسك إنك محبوس بتخليك تسحب نفسك من جواك الأول قبل ما تمشي بجسمك.",
    light: "نورك في المرونة والفضول: بتتأقلم مع أي حاجة، وبتشوف الفرص في وسط الفوضى، والناس بتحس معاك إن الحياة أوسع من اللي كانت فاكراه.",
    shadow: "وفي ضلك هروب بيتلبس شكل «حرية»، وبتبدّل الحاجات قبل ما تعمّق في أي حاجة. والسبب في" },
  6: { t: "الراعي", tag: "الحب والمسؤولية والجمال",
    essence: "جوهرك إنك قلب بيحب يرعى. طاقتك بتتغذى على إنك تكون مفيد لحد وتعمل بيتك ودايرتك أحلى. بتحس بالمسؤولية ناحية اللي بتحبهم كأنها مكتوبة عليك.",
    light: "نورك في الحنان والذوق: بتحوّل أي مكان لبيت، وبتعرف تشوف الجمال والاحتياج في الناس. اللي حواليك بيحسوا إنهم مش لوحدهم.",
    shadow: "وفي ضلك إحساس إن حبك لازم يتقابل بتقدير، وبتدي كتير لحد ما تتعب وتتضايق من غير ما تقول. والسبب في" },
  7: { t: "الباحث", tag: "العمق والحكمة والصمت",
    essence: "جوهرك إنك بتدوّر على المعنى اللي ورا الأشياء. طاقتك بتحتاج هدوء وخلوة وسؤال كبير تفكر فيه. بتحس إنك مختلف شوية، وإن الكلام السطحي بيتعبك.",
    light: "نورك في البصيرة والتحليل: بتشوف اللي مش باين، وبتوصل لإجابات الناس بتدوّر عليها عند غيرك. هدوءك بيدي اللي حواليك إحساس بالعمق.",
    shadow: "وفي ضلك عزلة بتتحول من راحة لانسحاب، وصعوبة في إنك تسلّم قلبك لحد قبل ما تتأكد مليون مرة. والسبب في" },
  8: { t: "القادر", tag: "القوة والإنجاز والمكانة",
    essence: "جوهرك إنك خُلقت تتعامل مع حجم كبير: فلوس وناس ومسؤولية وتأثير. طاقتك بتتحرك بالنتائج، وبتحس بقيمتك لما تشوف إنك غيّرت حاجة في الواقع.",
    light: "نورك في القدرة على التنظيم والتنفيذ: لما بتحط هدف قدامك بتمشي له بإصرار، والناس بتحس بالأمان وسط قوتك وخبرتك.",
    shadow: "وفي ضلك علاقة معقدة مع القيمة: ساعات بتقيس نفسك بإنجازك وبس، وبتخاف تظهر ضعفك. والسبب في" },
  9: { t: "المكتمِل", tag: "العطاء والتسامح والنهايات",
    essence: "جوهرك إنك روح قديمة في الإحساس. طاقتك بتشوف الصورة الكبيرة وبتتألم لألم الناس، وبتحس إن ليك دور تساعد بيه وتقفل دوايرك بسلام.",
    light: "نورك في الاتساع والتعاطف: بتسامح أكتر من غيرك، وبتشوف الإنسان ورا الغلطة، والناس بتلاقي عندك حضن مفتوح من غير أحكام.",
    shadow: "وفي ضلك تمسّك بالماضي وبالناس اللي كان لازم تسيبهم، وبتدي لحد ما تنسى نفسك. والسبب في" }
};
const LP_FREE_MASTER = {
  11: "رقم ١١ رقم رئيسي: بيحمل طاقة الرقم ٢ بحساسيته وحدسه، لكن بشدة أعلى. بتحس بحاجات قبل ما تحصل وبتتأثر بالأجواء أسرع من غيرك، ودرسك إنك تثبّت أعصابك وتحوّل حدسك لخطوات.",
  22: "رقم ٢٢ رقم رئيسي: بيحمل طاقة الرقم ٤ بقوة بناءه، لكن بحجم أحلام أكبر. جواك رؤية لحاجة كبيرة تفيد ناس كتير، ودرسك إنك تتحمل ضغطها خطوة خطوة من غير ما تحمل نفسك فوق طاقتك.",
  33: "رقم ٣٣ رقم رئيسي: بيحمل طاقة الرقم ٦ بحنانه ومسؤوليته، لكن بعطاء أوسع. جواك رغبة تشفي وتعلّم وتحتوي، ودرسك إنك تحمي نفسك وإنت بتدي."
};

const LP_BASE = { 11: 2, 22: 4, 33: 6 };

/* رسالة اليوم: طاقة اليوم (١ لـ ٩) من تاريخ النهاردة، وبتتقابل مع رقم مسار الشخص */
const DAY_EN = {
  1: { th: "البداية", msg: "اليوم بيشجع على خطوة أولى. اللي مأجله بقاله فترة، ابدأ منه حاجة صغيرة.", do: "ابدأ بحاجة واحدة بسيطة من غير ما تستنى الوقت المثالي.", dont: "ماتحكمش على نفسك من أول محاولة." },
  2: { th: "الإنصات والتعاون", msg: "اليوم أنسب للتفاهم والإصغاء أكتر من الإثبات. الجملة اللطيفة بتفتح باب مقفول.", do: "اسمع للآخر لحد ما يخلص قبل ما ترد.", dont: "ماتكتمش زعل صغير لحد ما يكبر." },
  3: { th: "التعبير", msg: "اليوم بيدي مساحة للكلام والكتابة والإبداع. اللي جواك عايز يطلع بصيغة مفهومة.", do: "عبّر عن فكرة أو إحساس بصراحة ولطف.", dont: "ماتغطيش موضوع مهم بالهزار." },
  4: { th: "الترتيب والبناء", msg: "اليوم مناسب للتنظيم والتركيز على التفاصيل. خطوة ثابتة النهاردة أحسن من وعد كبير.", do: "رتب مهمة معلقة وخلصها.", dont: "ماتحملش نفسك كل حاجة في يوم واحد." },
  5: { th: "التغيير والمرونة", msg: "اليوم بيجيب تغيير في الخطة أو فكرة جديدة. اللي بيتأقلم بسرعة بيستفيد.", do: "جرب طريق أو أسلوب مختلف في حاجة صغيرة.", dont: "ماتاخدش قرار كبير بس عشان تهرب من إحساس." },
  6: { th: "الاهتمام بالقريبين", msg: "اليوم بيلفت النظر للبيت والعلاقات. لفتة بسيطة لحد بتحبه ليها أثر كبير.", do: "اسأل عن حد قريب واهتم بيه فعلًا.", dont: "ماتدّيش لحد تعبان نفسك عشان تثبت حاجة." },
  7: { th: "الهدوء والمراجعة", msg: "اليوم أنسب للتفكير والمراجعة والخلوة. القرارات الكبيرة تتأجل للوقت اللي رأسك فيه صافي.", do: "خد وقت هادي لنفسك من غير شاشات.", dont: "ماتنسحبش من الكل بحجة إنك محتاج وقت." },
  8: { th: "الإنجاز والموارد", msg: "اليوم بيركز على الشغل والفلوس والمسؤوليات. خطوة منظمة في ملف مادي هتفرق.", do: "راجع مصروف أو هدف مالي أو مهمة مهمة.", dont: "ماتقيّمش قيمتك بنتيجة اليوم بس." },
  9: { th: "الختام والتخفيف", msg: "اليوم بيساعد على قفل ملف وتخفيف حمل. السماح والتنضيف بيرتاح بيهم القلب.", do: "اقفل حاجة معلقة: رسالة، اعتذار، أو ترتيب.", dont: "ماترجعش لجرح قديم عشان تفتحه من تاني." }
};
const LP_GIFT = { 1: "جرأتك وبداياتك", 2: "حساسيتك وإنصاتك", 3: "تعبيرك وخفة ظلك", 4: "ثباتك وتنظيمك", 5: "مرونتك وفضولك", 6: "حنانك وذوقك", 7: "عمقك وهدوءك", 8: "قدرتك على التنفيذ", 9: "تعاطفك وتسامحك" };
const LP_CARE = { 1: "الاندفاع والعند", 2: "المجاملة على حساب نفسك", 3: "التشتت والهروب بالهزار", 4: "التصلب والكمالية", 5: "الهروب من الالتزام", 6: "العطاء الزايد", 7: "الانسحاب", 8: "التحكم والضغط", 9: "التعلق بالماضي" };

/* ---------- مواقف واقعية لكل بيت (للتوقعات اليومية والتحليل) ---------- */
const HOUSE_SIT = [
  ["ناس بتلاحظ شكلك وتصرفاتك أكتر من العادة", "إحساس إنك عايز تبدأ حاجة جديدة بنفسك", "حد بيقول لك رأيه في طريقتك"],
  ["مصروف أو دخل مفاجئ", "عرض أو خصم بتفكر تشتري بسببه", "مراجعة لقيمتك قدام نفسك"],
  ["رسايل ومكالمات كتير", "سفرية قصيرة أو مشوار", "كلام مع إخوات أو جيران"],
  ["حاجة في البيت أو مع العيلة", "نقاش مع حد من الأهل", "رغبة في الراحة والبقاء في البيت"],
  ["اهتمام أو رسالة من حد", "خروجة أو وقت متعة", "فكرة إبداعية أو مشروع شخصي"],
  ["ضغط شغل أو مهام متراكمة", "تعب في الجسم محتاج روتين", "موقف مع زميل"],
  ["لقاء مع شريك أو عميل", "عرض ارتباط أو اتفاق", "مواجهة محتاجة صراحة"],
  ["موضوع فلوس مشتركة أو دين", "مشاعر عميقة أو سر بيتكشف", "مرحلة تغيير داخلي"],
  ["فكرة سفر أو دراسة", "نقاش في معتقدات", "فرصة بتوسع أفقك"],
  ["فرصة شغل أو ترقية", "نظرة من مديرك أو الناس لإنجازك", "مسؤولية جديدة"],
  ["عزومة أو تجمع أصحاب", "فكرة مشروع جماعي", "حلم بيقرب"],
  ["رغبة في العزلة", "أحلام وأفكار غريبة", "تعب نفسي مخفي"]
];
const HOUSE_TRIG = [
  "اتخذت قرارًا لتثبت نفسك", "أنفقت دون حساب", "رددت بسرعة دون تفكير", "فتحت خلافًا قديمًا",
  "بالغت في المخاطرة أو الترف", "أهملت راحتك", "تجنبت المصارحة", "كتمت مشاعرك أو حاولت السيطرة على أحد",
  "وعدت بأكبر من طاقتك", "تسرعت أو حملت فوق طاقتك", "اعتمدت على من لا يناسبك", "هربت من الواقع"
];
const HOUSE_ADV = [
  "ابدأ يومك بشيء صغير لنفسك قبل الناس", "راجع مصاريفك قبل أن تشتري", "ردّ على الرسائل المهمة وأنهِ كلمة مؤجلة",
  "اجلس مع أحد من أهلك أو رتّب ركنًا في البيت", "افعل شيئًا يفرحك ولو لساعة", "رتّب مهامك وابدأ بالأصعب",
  "كلّم من تريد مصارحته بهدوء", "لا تفتح موضوعًا ماليًا كبيرًا، وراقب مشاعرك", "تعلّم شيئًا جديدًا أو اقرأ ما يوسّع ذهنك",
  "ركّز على هدف مهني واحد اليوم", "تواصل مع صديق قريب", "خذ وقتًا هادئًا لنفسك ولا تتخذ قرارات كبيرة"
];

/* ======================= محرك الحسابات الفلكية =======================
   الشمس: Meeus ch.25 | القمر: Meeus ch.47 (٦٠ حد)
   عطارد → أورانوس: عناصر مدارية + تصحيحات المشتري/زحل/أورانوس
   نبتون وبلوتو: عناصر JPL التقريبية مع الـ precession
   البيوت: Placidus أو Whole Sign
   كل الحسابات بتتم على جهاز المستخدم.
======================================================================= */
const Astro = (() => {
  const RAD = Math.PI / 180, DEG = 180 / Math.PI;
  const norm = x => ((x % 360) + 360) % 360;
  const sin = x => Math.sin(x * RAD), cos = x => Math.cos(x * RAD), tan = x => Math.tan(x * RAD);
  const d180 = x => { x = norm(x); return x > 180 ? x - 360 : x; };

  const jdFromMs = ms => ms / 86400000 + 2440587.5;
  const msFromJd = jd => (jd - 2440587.5) * 86400000;
  const yearOf = jd => 2000 + (jd - 2451545) / 365.25;
  const deltaT = y => (y >= 2000 ? 63.8 + 0.32 * (y - 2000) : 63.8 + 0.45 * (y - 2000)); // ثواني، تقريبي ويكفي

  function nutation(T) {
    const Om = 125.04452 - 1934.136261 * T;
    const L = 280.4665 + 36000.7698 * T, Lp = 218.3165 + 481267.8813 * T;
    return {
      dpsi: (-17.20 * sin(Om) - 1.32 * sin(2 * L) - 0.23 * sin(2 * Lp) + 0.21 * sin(2 * Om)) / 3600,
      deps: (9.20 * cos(Om) + 0.57 * cos(2 * L) + 0.10 * cos(2 * Lp) - 0.09 * cos(2 * Om)) / 3600
    };
  }
  const meanObliq = T => 23.439291 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;

  function keplerE(Mdeg, e) {
    const M = norm(Mdeg);
    let E = M + e * DEG * sin(M) * (1 + e * cos(M));
    for (let k = 0; k < 30; k++) {
      const dE = (E - e * DEG * sin(E) - M) / (1 - e * cos(E));
      E -= dE;
      if (Math.abs(dE) < 1e-10) break;
    }
    return E;
  }

  /* ---------- الشمس ---------- */
  function sunTrue(T) {
    const L0 = norm(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    const M = norm(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M) + (0.019993 - 0.000101 * T) * sin(2 * M) + 0.000289 * sin(3 * M);
    const v = M + C;
    return { lon: norm(L0 + C), R: 1.000001018 * (1 - e * e) / (1 + e * cos(v)) };
  }

  /* ---------- القمر ---------- */
  const MOON_TERMS = [
    [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314], [0, 0, 2, 0, 213618], [0, 1, 0, 0, -185116],
    [0, 0, 0, 2, -114332], [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066], [2, 0, 1, 0, 53322], [2, -1, 0, 0, 45758],
    [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720], [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528],
    [0, 0, 1, -2, 10980], [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034], [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888],
    [2, 1, 0, 0, -6766], [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036], [2, 0, 2, 0, 3994],
    [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665], [0, 1, -2, 0, -2689], [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390],
    [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236], [0, 1, 2, 0, -2120], [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048],
    [2, 0, 1, -2, -1773], [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110], [3, 0, -1, 0, -892],
    [2, 1, 1, 0, -810], [4, -1, -2, 0, 759], [0, 2, -1, 0, -713], [2, 2, -1, 0, -700], [2, 1, -2, 0, 691],
    [2, -1, 0, -2, 596], [4, 0, 1, 0, 549], [0, 0, 4, 0, 537], [4, -1, 0, 0, 520], [1, 0, -2, 0, -487],
    [2, 1, 0, -2, -399], [0, 0, 2, -2, -381], [1, 1, 1, 0, 351], [3, 0, -2, 0, -340], [4, 0, -3, 0, 330],
    [2, -1, 2, 0, 327], [0, 2, 1, 0, -323], [1, 1, -1, 0, 299], [2, 0, 3, 0, 294]
  ];
  function moonLonMean(T) { // خط الطول الهندسي (من غير nutation)
    const T2 = T * T, T3 = T2 * T, T4 = T3 * T;
    const Lp = norm(218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - T4 / 65194000);
    const D = norm(297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000);
    const M = norm(357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000);
    const Mp = norm(134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000);
    const F = norm(93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000);
    const A1 = norm(119.75 + 131.849 * T), A2 = norm(53.09 + 479264.290 * T);
    const E = 1 - 0.002516 * T - 0.0000074 * T2;
    let sl = 0;
    for (const [d, m, mp, f, c] of MOON_TERMS) {
      let v = c * sin(d * D + m * M + mp * Mp + f * F);
      const am = Math.abs(m);
      if (am === 1) v *= E; else if (am === 2) v *= E * E;
      sl += v;
    }
    sl += 3958 * sin(A1) + 1962 * sin(Lp - F) + 318 * sin(A2);
    return norm(Lp + sl / 1e6);
  }

  /* ---------- العقدة وليليث (متوسطة) ---------- */
  const meanNode = T => norm(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + T * T * T / 467441 - T * T * T * T / 60616000);
  const meanApogee = T => norm(83.3532465 + 4069.0137287 * T - 0.0103200 * T * T - T * T * T / 80053 + T * T * T * T / 18999000 + 180);

  /* ---------- الكواكب: عناصر مدارية (d = أيام من 1999-12-31 0h) ---------- */
  const ELS = {
    mercury: { N: [48.3313, 3.24587e-5], i: [7.0047, 5.00e-8], w: [29.1241, 1.01444e-5], a: [0.387098, 0], e: [0.205635, 5.59e-10], M: [168.6562, 4.0923344368] },
    venus:   { N: [76.6799, 2.46590e-5], i: [3.3946, 2.75e-8], w: [54.8910, 1.38374e-5], a: [0.723330, 0], e: [0.006773, -1.302e-9], M: [48.0052, 1.6021302244] },
    mars:    { N: [49.5574, 2.11081e-5], i: [1.8497, -1.78e-8], w: [286.5016, 2.92961e-5], a: [1.523688, 0], e: [0.093405, 2.516e-9], M: [18.6021, 0.5240207766] },
    jupiter: { N: [100.4542, 2.76854e-5], i: [1.3030, -1.557e-7], w: [273.8777, 1.64505e-5], a: [5.20256, 0], e: [0.048498, 4.469e-9], M: [19.8950, 0.0830853001] },
    saturn:  { N: [113.6634, 2.38980e-5], i: [2.4886, -1.081e-7], w: [339.3939, 2.97661e-5], a: [9.55475, 0], e: [0.055546, -9.499e-9], M: [316.9670, 0.0334442282] },
    uranus:  { N: [74.0005, 1.3978e-5], i: [0.7733, 1.9e-8], w: [96.6612, 3.0565e-5], a: [19.18171, -1.55e-8], e: [0.047318, 7.45e-9], M: [142.5905, 0.011725806] }
  };
  const el = (k, d) => { const o = ELS[k], f = v => v[0] + v[1] * d; return { N: f(o.N), i: f(o.i), w: f(o.w), a: f(o.a), e: f(o.e), M: f(o.M) }; };

  function helioSchlyter(key, d) {
    const p = el(key, d);
    const E = keplerE(p.M, p.e);
    const xv = p.a * (cos(E) - p.e), yv = p.a * Math.sqrt(1 - p.e * p.e) * sin(E);
    const v = Math.atan2(yv, xv) * DEG, r = Math.hypot(xv, yv), vw = v + p.w;
    const xh = r * (cos(p.N) * cos(vw) - sin(p.N) * sin(vw) * cos(p.i));
    const yh = r * (sin(p.N) * cos(vw) + cos(p.N) * sin(vw) * cos(p.i));
    const zh = r * sin(vw) * sin(p.i);
    let lon = norm(Math.atan2(yh, xh) * DEG), lat = Math.atan2(zh, Math.hypot(xh, yh)) * DEG;
    if (key === 'jupiter' || key === 'saturn' || key === 'uranus') {
      const Mj = el('jupiter', d).M, Ms = el('saturn', d).M, Mu = el('uranus', d).M;
      if (key === 'jupiter') {
        lon += -0.332 * sin(2 * Mj - 5 * Ms - 67.6) - 0.056 * sin(2 * Mj - 2 * Ms + 21) + 0.042 * sin(3 * Mj - 5 * Ms + 21)
          - 0.036 * sin(Mj - 2 * Ms) + 0.022 * cos(Mj - Ms) + 0.023 * sin(2 * Mj - 3 * Ms + 52) - 0.016 * sin(Mj - 5 * Ms - 69);
      } else if (key === 'saturn') {
        lon += 0.812 * sin(2 * Mj - 5 * Ms - 67.6) - 0.229 * cos(2 * Mj - 4 * Ms - 2) + 0.119 * sin(Mj - 2 * Ms - 3)
          + 0.046 * sin(2 * Mj - 6 * Ms - 69) + 0.014 * sin(Mj - 3 * Ms + 32);
        lat += -0.020 * cos(2 * Mj - 4 * Ms - 2) + 0.018 * sin(2 * Mj - 6 * Ms - 49);
      } else {
        lon += 0.040 * sin(Ms - 2 * Mu + 6) + 0.035 * sin(Ms - 3 * Mu + 33) - 0.015 * sin(Mj - Mu + 20);
      }
    }
    const rr = Math.hypot(xh, yh, zh);
    return { x: rr * cos(lon) * cos(lat), y: rr * sin(lon) * cos(lat), z: rr * sin(lat) };
  }

  /* ---------- JPL (Standish) للمقارنة ولبلوتو ونبتون ---------- */
  const STD = {
    mercury: [0.38709927, 0.00000037, 0.20563593, 0.00001906, 7.00497902, -0.00594749, 252.25032350, 149472.67411175, 77.45779628, 0.16047689, 48.33076593, -0.12534081],
    venus: [0.72333566, 0.00000390, 0.00677672, -0.00004107, 3.39467605, -0.00078890, 181.97909950, 58517.81538729, 131.60246718, 0.00268329, 76.67984255, -0.27769418],
    earth: [1.00000261, 0.00000562, 0.01671123, -0.00004392, -0.00001531, -0.01294668, 100.46457166, 35999.37244981, 102.93768193, 0.32327364, 0.0, 0.0],
    mars: [1.52371034, 0.00001847, 0.09339410, 0.00007882, 1.84969142, -0.00813131, -4.55343205, 19140.30268499, -23.94362959, 0.44441088, 49.55953891, -0.29257343],
    jupiter: [5.20288700, -0.00011607, 0.04838624, -0.00013253, 1.30439695, -0.00183714, 34.39644051, 3034.74612775, 14.72847983, 0.21252668, 100.47390909, 0.20469106],
    saturn: [9.53667594, -0.00125060, 0.05386179, -0.00050991, 2.48599187, 0.00193609, 49.95424423, 1222.49362201, 92.59887831, -0.41897216, 113.66242448, -0.28867794],
    uranus: [19.18916464, -0.00196176, 0.04725744, -0.00004397, 0.77263783, -0.00242939, 313.23810451, 428.48202785, 170.95427630, 0.40805281, 74.01692503, 0.04240589],
    neptune: [30.06992276, 0.00026291, 0.00859048, 0.00005105, 1.77004347, 0.00035372, -55.12002969, 218.45945325, 44.96476227, -0.32241464, 131.78422574, -0.00508664],
    pluto: [39.48211675, -0.00031596, 0.24882730, 0.00005170, 17.14001206, 0.00004818, 238.92903833, 145.20780515, 224.06891629, -0.04062942, 110.30393684, -0.01183482]
  };
  function stdHelio(key, T) {
    const p = STD[key];
    const a = p[0] + p[1] * T, e = p[2] + p[3] * T, I = p[4] + p[5] * T, L = p[6] + p[7] * T, w = p[8] + p[9] * T, Om = p[10] + p[11] * T;
    const arg = w - Om, E = keplerE(L - w, e);
    const xp = a * (cos(E) - e), yp = a * Math.sqrt(1 - e * e) * sin(E);
    const cw = cos(arg), sw = sin(arg), cO = cos(Om), sO = sin(Om), cI = cos(I), sI = sin(I);
    return {
      x: (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp,
      y: (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp,
      z: (sw * sI) * xp + (cw * sI) * yp
    };
  }
  const precession = T => (5028.796195 * T + 1.1054348 * T * T) / 3600; // درجات من J2000
  function stdGeoLon(key, T) {
    const p = stdHelio(key, T), e = stdHelio('earth', T);
    return norm(Math.atan2(p.y - e.y, p.x - e.x) * DEG + precession(T));
  }

  /* ---------- خط الطول الظاهري لأي جرم ---------- */
  const PLANET_KEYS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  /* محرك الحساب: مكتبة astronomy-engine (MIT) للشمس والقمر والكواكب السبعة — دقة دون الثانية القوسية.
     العقدة وليليث لسه بمعادلات متوسطة داخلية (مش من المكتبة). لو المكتبة ما اتحمّلتش، بيرجع تلقائيًا
     للصيغ الداخلية القديمة (أقل دقة بعشرات الثواني القوسية، لكنها سليمة) عشان الموقع يفضل شغال. */
  const AE_BODY = { sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto' };
  function aeLonOf(key, jde) {
    if (typeof Astronomy === 'undefined' || !AE_BODY[key]) return null;
    try {
      const y = yearOf(jde), jdUt = jde - deltaT(y) / 86400, ms = msFromJd(jdUt);
      const v = Astronomy.GeoVector(Astronomy.Body[AE_BODY[key]], new Date(ms), true);
      return norm(Astronomy.Ecliptic(v).elon);
    } catch (e) { return null; }
  }
  /* العقدة الحقيقية: تقاطع مدار القمر اللحظي مع الكسوف. بتتحسب من متجه موضع وسرعة القمر
     (astronomy-engine) بعد تدويره لإطار الكسوف الحقيقي للتاريخ؛ العقدة الصاعدة = z × (r × v). */
  function aeTrueNode(jde) {
    if (typeof Astronomy === 'undefined') return null;
    try {
      const y = yearOf(jde), jdUt = jde - deltaT(y) / 86400, t = new Astronomy.AstroTime(new Date(msFromJd(jdUt)));
      const st = Astronomy.RotateState(Astronomy.Rotation_EQJ_ECT(t), Astronomy.GeoMoonState(t));
      const hx = st.y * st.vz - st.z * st.vy, hy = st.z * st.vx - st.x * st.vz;
      const lon = norm(Math.atan2(hx, -hy) * DEG);
      return Number.isFinite(lon) ? lon : null;
    } catch (e) { return null; }
  }
  function legacyLonOf(key, jde) {
    const T = (jde - 2451545) / 36525;
    const dpsi = nutation(T).dpsi;
    if (key === 'sun') return norm(sunTrue(T).lon + dpsi - 0.00569);
    if (key === 'moon') return norm(moonLonMean(T) + dpsi);
    if (key === 'node') return norm(meanNode(T) + dpsi);
    if (key === 'truenode') {   // احتياطي (لو المكتبة ما اتحمّلتش): العقدة المتوسطة + تصحيحات Meeus الدورية
      const rad = Math.PI / 180, D = norm(297.85036 + 445267.11148 * T), M = norm(357.52772 + 35999.05034 * T),
        Mp = norm(134.96298 + 477198.867398 * T), F = norm(93.27191 + 483202.017538 * T);
      const corr = -1.4979 * Math.sin((2 * D - 2 * F) * rad) - 0.15 * Math.sin(M * rad) - 0.1226 * Math.sin(2 * D * rad) + 0.1176 * Math.sin(2 * F * rad) - 0.0801 * Math.sin((2 * Mp - 2 * F) * rad);
      return norm(meanNode(T) + corr + dpsi);
    }
    if (key === 'lilith') {   // ليليث المتوسطة: الأوج بيتسقط من مدار القمر المائل (5.145°) على مسار الشمس، زي Swiss Ephemeris
      const om = meanNode(T), u = (meanApogee(T) - om) * Math.PI / 180;
      return norm(om + Math.atan2(Math.cos(5.1453 * Math.PI / 180) * Math.sin(u), Math.cos(u)) * 180 / Math.PI + dpsi);
    }
    if (key === 'pluto' || key === 'neptune') return norm(stdGeoLon(key, T) + dpsi);
    const d = jde - 2451543.5, s = sunTrue(T);
    const h = helioSchlyter(key, d);
    const xg = h.x + s.R * cos(s.lon), yg = h.y + s.R * sin(s.lon);
    return norm(Math.atan2(yg, xg) * DEG + dpsi);
  }
  function lonOf(key, jde) {
    if (key === 'node' || key === 'lilith') return legacyLonOf(key, jde);
    if (key === 'truenode') { const tn = aeTrueNode(jde); return tn !== null ? tn : legacyLonOf(key, jde); }
    const ae = aeLonOf(key, jde);
    return ae !== null ? ae : legacyLonOf(key, jde);
  }

  /* ---------- الطالع والبيوت ---------- */
  function ascMc(ramc, eps, lat) {
    const mc = norm(Math.atan2(sin(ramc), cos(ramc) * cos(eps)) * DEG);
    let asc = norm(Math.atan2(cos(ramc), -(sin(ramc) * cos(eps) + tan(lat) * sin(eps))) * DEG);
    if (norm(asc - mc) > 180) asc = norm(asc + 180);
    return { asc, mc };
  }
  function placidusCusps(ramc, eps, lat, asc, mc) {
    const cuspBy = raFn => {
      let ra = raFn(90);
      for (let i = 0; i < 50; i++) {
        const lam = norm(Math.atan2(sin(ra), cos(ra) * cos(eps)) * DEG);
        const dec = Math.asin(sin(eps) * sin(lam)) * DEG;
        const x = -tan(lat) * tan(dec);
        if (Math.abs(x) >= 1) return null;
        const nra = raFn(Math.acos(x) * DEG);
        if (Math.abs(d180(nra - ra)) < 1e-8) { ra = nra; break; }
        ra = nra;
      }
      return norm(Math.atan2(sin(ra), cos(ra) * cos(eps)) * DEG);
    };
    const c11 = cuspBy(D => ramc + D / 3), c12 = cuspBy(D => ramc + 2 * D / 3);
    const c2 = cuspBy(D => ramc + 180 - 2 * (180 - D) / 3), c3 = cuspBy(D => ramc + 180 - (180 - D) / 3);
    if ([c11, c12, c2, c3].some(v => v === null)) return null;
    const c = new Array(12);
    c[0] = asc; c[1] = c2; c[2] = c3; c[3] = norm(mc + 180);
    c[4] = norm(c11 + 180); c[5] = norm(c12 + 180); c[6] = norm(asc + 180);
    c[7] = norm(c2 + 180); c[8] = norm(c3 + 180); c[9] = mc; c[10] = c11; c[11] = c12;
    return c;
  }
  const wholeSignCusps = asc => { const s = Math.floor(asc / 30) * 30; return Array.from({ length: 12 }, (_, i) => norm(s + 30 * i)); };
  // Equal House: each cusp is exactly 30° from the Ascendant.
  const equalCusps = asc => Array.from({ length: 12 }, (_, i) => norm(asc + 30 * i));
  // Porphyry: trisect each of the four ecliptic arcs between ASC, IC, DSC and MC.
  function porphyryCusps(asc, mc) {
    const anchors = [norm(asc), norm(mc + 180), norm(asc + 180), norm(mc)];
    const c = new Array(12);
    for (let q = 0; q < 4; q++) {
      const start = anchors[q], end = anchors[(q + 1) % 4];
      const arc = norm(end - start);
      c[q * 3] = start;
      c[q * 3 + 1] = norm(start + arc / 3);
      c[q * 3 + 2] = norm(start + 2 * arc / 3);
    }
    return c;
  }
  function houseOf(lon, cusps) {
    for (let i = 0; i < 12; i++) {
      const a = cusps[i], b = cusps[(i + 1) % 12];
      if (norm(lon - a) < norm(b - a)) return i + 1;
    }
    return 1;
  }

  /* ---------- الخريطة كاملة ---------- */
  const BODY_KEYS = [...PLANET_KEYS, 'node', 'lilith', 'truenode'];
  const RETRO_KEYS = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'truenode'];

  /* Vertex: تقاطع الدائرة العمودية الغربية مع الكسوف، بغض النظر عن الارتفاع */
  function vertexWest(ramc, eps, lat) {
    const phi = lat * RAD, th = ramc * RAD, e = eps * RAD;
    const unit = lam => { const l = lam * RAD; const a = Math.atan2(Math.cos(e) * Math.sin(l), Math.cos(l)); const d = Math.asin(Math.sin(e) * Math.sin(l)); return [Math.cos(d) * Math.cos(a), Math.cos(d) * Math.sin(a), Math.sin(d)]; };
    const dot = (x, y) => x[0] * y[0] + x[1] * y[1] + x[2] * y[2];
    const N = [-Math.sin(phi) * Math.cos(th), -Math.sin(phi) * Math.sin(th), Math.cos(phi)];
    const E = [-Math.sin(th), Math.cos(th), 0];
    const f = l => dot(unit(l), N);
    const roots = []; let prev = f(0);
    for (let l = 0.02; l <= 360.0001; l += 0.02) {
      const c = f(l);
      if (Math.sign(c) !== Math.sign(prev)) {
        let lo = l - 0.02, hi = l;
        for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (Math.sign(f(m)) === Math.sign(f(lo))) lo = m; else hi = m; }
        roots.push((lo + hi) / 2);
      }
      prev = c;
    }
    const west = roots.filter(r => dot(unit(r), E) < 0);
    return west.length === 1 ? norm(west[0]) : null;
  }
  function chart({ utcMs, lat, lon, hs = 'placidus', known = true }) {
    const jd = jdFromMs(utcMs);
    const jde = jd + deltaT(yearOf(jd)) / 86400;
    const T0 = (jd - 2451545) / 36525, T = (jde - 2451545) / 36525;
    const bodies = BODY_KEYS.map(key => {
      const l = lonOf(key, jde);
      const sp = d180(lonOf(key, jde + 0.5) - lonOf(key, jde - 0.5));
      return { key, lon: l, speed: sp, retro: RETRO_KEYS.includes(key) && sp < 0, sign: Math.floor(l / 30) };
    });
    const out = { jde, bodies, known, hs, lat, lon };
    if (known) {
      const gmst = norm(280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T0 * T0 - T0 * T0 * T0 / 38710000);
      const nu = nutation(T), eps = meanObliq(T) + nu.deps;
      const ramc = norm(gmst + nu.dpsi * cos(eps) + lon);
      const { asc, mc } = ascMc(ramc, eps, lat);
      let cusps = null, used = hs;
      if (hs === 'placidus') cusps = placidusCusps(ramc, eps, lat, asc, mc);
      else if (hs === 'whole') cusps = wholeSignCusps(asc);
      else if (hs === 'equal') cusps = equalCusps(asc);
      else if (hs === 'porphyry') cusps = porphyryCusps(asc, mc);
      if (!cusps) { cusps = wholeSignCusps(asc); used = 'whole-fallback'; }
      Object.assign(out, { ramc, eps, asc, mc, cusps, hs: used, vertex: vertexWest(ramc, eps, lat) });
      /* سهم السعادة: بالنهار طالع + قمر − شمس، وبالليل طالع + شمس − قمر (الشمس فوق الأفق = نهار) */
      const sunB = bodies.find(b => b.key === 'sun'), moonB = bodies.find(b => b.key === 'moon');
      const isDay = norm(sunB.lon - asc) > 180;
      const fortuneLon = isDay ? norm(asc + moonB.lon - sunB.lon) : norm(asc + sunB.lon - moonB.lon);
      bodies.push({ key: 'fortune', lon: fortuneLon, speed: 0, retro: false, sign: Math.floor(fortuneLon / 30), day: isDay });
      bodies.forEach(b => { b.house = houseOf(b.lon, cusps); });
    }
    return out;
  }

  /* ---------- أوقات محلية ← UTC باستخدام قاعدة بيانات المتصفح للتوقيت ---------- */
  function tzOffsetMin(tz, utcMs) {
    const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const p = {};
    f.formatToParts(new Date(utcMs)).forEach(x => { p[x.type] = x.value; });
    const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
    return (asUtc - Math.floor(utcMs / 1000) * 1000) / 60000;
  }
  function localToUtcMs(y, m, d, hh, mm, tz) {
    const guess = Date.UTC(y, m - 1, d, hh, mm);
    const o1 = tzOffsetMin(tz, guess);
    let utc = guess - o1 * 60000;
    const o2 = tzOffsetMin(tz, utc);
    if (o2 !== o1) utc = guess - o2 * 60000;
    return utc;
  }

  return { chart, vertexWest, lonOf, houseOf, norm, d180, jdFromMs, msFromJd, deltaT, yearOf, localToUtcMs, tzOffsetMin,
    PLANET_KEYS, BODY_KEYS, _moonLonMean: moonLonMean, _stdGeoLon: stdGeoLon, _helio: helioSchlyter, _sunTrue: sunTrue, _ascMc: ascMc, _plac: placidusCusps, _whole: wholeSignCusps, _equal: equalCusps, _porphyry: porphyryCusps, _nut: nutation, _obl: meanObliq };
})();
if (typeof module !== 'undefined') module.exports = Astro;
if (typeof window !== 'undefined') window.Astro = Astro;

/* ============================== منطق الموقع ============================== */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const VS = "\uFE0E";
  const norm = Astro.norm, d180 = Astro.d180;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = n => String(n).padStart(2, "0");
  const waLink = t => WA_URL;
  const openWA = a => { a.target = "_blank"; a.rel = "noopener"; };
  const gl = g => g + VS;
  const num = s => `<span class="num" dir="ltr">${s}</span>`;

  const nmOf = k => PLANETS[k] ? PLANETS[k].n : ({ asc: "الطالع", mc: "وسط السما" })[k];
  const themeOf = k => (PLANETS[k] && PLANETS[k].theme) || ({ asc: "شخصيتك الظاهرة", mc: "مسارك ومكانتك" })[k];
  const glyphOf = k => PLANETS[k] ? PLANETS[k].g : ({ asc: "AC", mc: "MC" })[k];

  function fmt(lon) {
    const s = Math.floor(lon / 30), r = lon - s * 30, d = Math.floor(r), m = Math.floor((r - d) * 60);
    return { s, d, m, txt: `${d}°${String(m).padStart(2, "0")}′` };
  }
  const signLine = lon => { const f = fmt(lon); return `${gl(SIGNS[f.s].g)} ${SIGNS[f.s].n} ${num(f.txt)}`; };

  /* ---------- روابط واتساب ---------- */
  const MSG = {
    general: "السلام عليكم، حابب أستفسر عن خدمات عقيق أسترو وأسعارها، ومحتاج أعرف تفاصيل الاشتراك وطريقة الحجز أو تفعيل التقارير المدفوعة.",
    horoscope: "أهلاً، عايز أحجز قراءة البرج الشخصية.\n\nالاسم:\nالبرج أو تاريخ الميلاد:",
    matrix: "أهلاً، عايز أحجز قراءة مصفوفة القدر.\n\nالاسم:\nتاريخ الميلاد:",
    chart: "أهلاً، عايز أحجز قراءة الخريطة الفلكية.\n\nالاسم:\nتاريخ الميلاد:\nوقت الميلاد:\nمكان الميلاد:",
    synastry: "أهلاً، عايز أحجز قراءة توافق فلكي.\n\nبياناتي:\nالاسم:\nتاريخ الميلاد:\nوقت الميلاد:\nمكان الميلاد:\n\nبيانات الشخص التاني:\nالاسم:\nتاريخ الميلاد:\nوقت الميلاد:\nمكان الميلاد:"
  };
  $$("[data-wa]").forEach(a => { a.href = waLink(MSG[a.dataset.wa]); openWA(a); });
  $$("[data-brand]").forEach(e => { e.textContent = SITE_NAME; });
  $$("[data-tagline]").forEach(e => { e.textContent = SITE_TAGLINE; });
  document.title = `${SITE_NAME} | مصفوفة القدر وخريطتك الفلكية وقراءات الأبراج`;
  const ig = $("#ig");
  if (ig) { ig.href = `https://instagram.com/${IG_USER}`; ig.textContent = "@" + IG_USER; openWA(ig); }
  $("#period").textContent = FORECAST_LABEL;
  const igTop = $("#ig-top"); igTop.href = `https://instagram.com/${IG_USER}`; openWA(igTop);

  /* ---------- نصوص مركّبة ---------- */
  function planetInSign(k, s) {
    if (k === "sun") return SUN_TXT[s];
    if (k === "moon") return MOON_TXT[s];
    const S = SIGNS[s], p = PLANETS[k];
    if (p.lens) return `${p.lens} بتميل لأسلوب ${S.way}. نقطة قوتك فيها ${S.strength}، وخد بالك من ${S.shadow}.`;
    return `${p.theme} على مستوى جيلك بتاخد طابع ${S.way}، وده بيظهر في ${S.strength}.`;
  }
  function planetInHouse(k, h, mode) {
    const p = PLANETS[k], H = HOUSES[h - 1];
    if (mode === "transit") return `الفترة دي ${p.theme} بتتحرك في مجال ${H.area}. تتوقع فيه ${p.give}، وانتبه من ${p.watch}.`;
    return `${p.theme} بتتركز في مجال ${H.area}. ده المكان الي بتلاقي فيه ${p.give}، وخد بالك من ${p.watch}.`;
  }
  const retroText = k => k === "mercury"
    ? "عطارد راجع: انتبه للتواصل والأوراق والسفر، وراجع كل شيء قبل أن توقّع أو ترسل."
    : `${PLANETS[k].n} راجع: وقت مراجعة وإعادة تقييم في ${PLANETS[k].theme}، فراجع قبل أن تبدأ أمرًا جديدًا.`;

  /* ---------- الزوايا والأنماط ---------- */
  function natalAspects(ch) {
    const L = ch.bodies.filter(b => PLANET_KEYS.includes(b.key)).map(b => ({ key: b.key, lon: b.lon }));
    if (ch.known) L.push({ key: "asc", lon: ch.asc }, { key: "mc", lon: ch.mc });
    const out = [];
    for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) {
      const a = L[i], b = L[j];
      if ((a.key === "asc" && b.key === "mc") || (a.key === "mc" && b.key === "asc")) continue;
      const diff = Math.abs(d180(a.lon - b.lon));
      for (const A of ASPECTS) {
        let lim = A.orb;
        if (["sun", "moon"].includes(a.key) || ["sun", "moon"].includes(b.key)) lim += 1;
        if (["asc", "mc"].includes(a.key) || ["asc", "mc"].includes(b.key)) lim = Math.min(lim, 4);
        const o = Math.abs(diff - A.ang);
        if (o <= lim) { out.push({ a: a.key, b: b.key, asp: A, orb: o }); break; }
      }
    }
    return out.sort((x, y) => x.orb - y.orb);
  }
  function findPatterns(ch) {
    const pl = ch.bodies.filter(b => PLANET_KEYS.includes(b.key));
    const out = [], names = arr => arr.map(b => PLANETS[b.key].n).join(" و");
    for (let s = 0; s < 12; s++) {
      const a = pl.filter(b => b.sign === s);
      if (a.length >= 3) out.push({ t: "تجمّع كواكب", txt: `${a.length} كواكب (${names(a)}) في برج ${SIGNS[s].n}. ده تركيز قوي جدًا في طابع البرج ده، ومعاه طاقة كبيرة وحاجة محتاجة توازن.` });
    }
    if (ch.known) for (let h = 1; h <= 12; h++) {
      const a = pl.filter(b => b.house === h);
      if (a.length >= 3) out.push({ t: "تجمّع كواكب", txt: `${a.length} كواكب (${names(a)}) في البيت ${HOUSES[h - 1].n}. حياتك بتدور كتير حوالين ${HOUSES[h - 1].area}.` });
    }
    const near = (a, b, ang, orb) => Math.abs(Math.abs(d180(a.lon - b.lon)) - ang) <= orb;
    for (let i = 0; i < pl.length; i++) for (let j = i + 1; j < pl.length; j++) for (let k = j + 1; k < pl.length; k++) {
      const t = [pl[i], pl[j], pl[k]];
      if (near(t[0], t[1], 120, 7) && near(t[1], t[2], 120, 7) && near(t[0], t[2], 120, 7)) {
        out.push({ t: "مثلث كبير", txt: `${names(t)} في تثليث مع بعض. موهبة طبيعية وتدفق سهل في طاقة ${ELEMENTS[SIGNS[t[0].sign].el].n}، لكن السهولة ممكن تخليك تكسل، فاستخدمها بقصد.` });
      }
    }
    for (let i = 0; i < pl.length; i++) for (let j = i + 1; j < pl.length; j++) {
      if (!near(pl[i], pl[j], 180, 8)) continue;
      for (let k = 0; k < pl.length; k++) {
        if (k === i || k === j) continue;
        if (near(pl[k], pl[i], 90, 7) && near(pl[k], pl[j], 90, 7)) {
          out.push({ t: "مربع T", txt: `${PLANETS[pl[i].key].n} و${PLANETS[pl[j].key].n} في مقابلة، و${PLANETS[pl[k].key].n} في تربيع معاهم. ده ضغط داخلي بيدفعك للإنجاز، و${PLANETS[pl[k].key].n} هو مفتاح التوازن.` });
        }
      }
    }
    return out;
  }

  /* ---------- رسم العجلة ---------- */
  function spread(items, minSep) {
    const n = items.length;
    for (let it = 0; it < 80; it++) {
      let moved = false;
      for (let k = 0; k < n; k++) {
        const a = items[k], b = items[(k + 1) % n];
        const gap = (((b.disp - a.disp) % 360) + 360) % 360;
        if (n > 1 && gap < minSep) {
          const push = (minSep - gap) / 2 + 0.01;
          a.disp = (a.disp - push + 360) % 360; b.disp = (b.disp + push) % 360; moved = true;
        }
      }
      if (!moved) break;
    }
  }
  function wheelSVG(ch, aspects) {
    const cx = 260, cy = 260, R1 = 250, R2 = 208, R3 = 92, RP = 174, RN = 110;
    const base = ch.known ? ch.asc : 0;
    const th = lon => (180 + (lon - base)) * Math.PI / 180;
    const pt = (lon, r) => { const a = th(lon); return [(cx + r * Math.cos(a)).toFixed(1), (cy - r * Math.sin(a)).toFixed(1)]; };
    let o = `<svg class="cw" viewBox="0 0 520 520" role="img" aria-label="العجلة الفلكية: الأبراج والبيوت ومواضع الكواكب">
      <defs>
        <radialGradient id="cw-center-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#0a0f1d"/>
          <stop offset="100%" stop-color="#050811"/>
        </radialGradient>
      </defs>
      <title>خريطة الميلاد: الأبراج والبيوت ومواضع الكواكب</title>`;
    for (let i = 0; i < 12; i++) {
      const [x0, y0] = pt(i * 30, R1), [x1, y1] = pt(i * 30 + 30, R1), [x2, y2] = pt(i * 30 + 30, R2), [x3, y3] = pt(i * 30, R2);
      o += `<path class="sec e${SIGNS[i].el}" d="M${x0} ${y0}A${R1} ${R1} 0 0 0 ${x1} ${y1}L${x2} ${y2}A${R2} ${R2} 0 0 1 ${x3} ${y3}Z"/>`;
      const [gx, gy] = pt(i * 30 + 15, (R1 + R2) / 2);
      o += `<text class="cg" data-kind="sign" data-i="${i}" x="${gx}" y="${gy}">${gl(SIGNS[i].g)}</text>`;
    }
    o += `<circle class="rg" cx="${cx}" cy="${cy}" r="${R2}"/>`;
    o += `<circle class="cw-center" cx="${cx}" cy="${cy}" r="${R3}" fill="url(#cw-center-grad)"/>`;
    o += `<circle class="rg" cx="${cx}" cy="${cy}" r="${R3}"/>`;
    if (ch.known) {
      ch.cusps.forEach((c, i) => {
        const [xa, ya] = pt(c, R2), [xb, yb] = pt(c, R3);
        o += `<line class="hl${i % 3 === 0 ? " ax" : ""}" x1="${xa}" y1="${ya}" x2="${xb}" y2="${yb}"/>`;
        const mid = c + norm(ch.cusps[(i + 1) % 12] - c) / 2, [nx, ny] = pt(mid, RN);
        o += `<text class="hn" data-kind="house" data-i="${i}" x="${nx}" y="${ny}">${i + 1}</text>`;
      });
    } else {
      for (let i = 0; i < 12; i++) {
        const [xa, ya] = pt(i * 30, R2), [xb, yb] = pt(i * 30, R3);
        o += `<line class="hl" x1="${xa}" y1="${ya}" x2="${xb}" y2="${yb}"/>`;
      }
    }
    aspects.filter(a => !["asc", "mc"].includes(a.a) && !["asc", "mc"].includes(a.b) && a.asp.k !== "conj").forEach(a => {
      const la = ch.bodies.find(b => b.key === a.a).lon, lb = ch.bodies.find(b => b.key === a.b).lon;
      const [xa, ya] = pt(la, R3), [xb, yb] = pt(lb, R3);
      o += `<line class="as ${["sq", "opp"].includes(a.asp.k) ? "hard" : "soft"}" x1="${xa}" y1="${ya}" x2="${xb}" y2="${yb}"/>`;
    });
    const items = ch.bodies.filter(b => PLANET_KEYS.includes(b.key) || ["node", "truenode", "fortune"].includes(b.key)).map(b => ({ b, disp: b.lon }));
    items.sort((a, b) => a.b.lon - b.b.lon);
    spread(items, 10);
    items.forEach(({ b, disp }) => {
      const [t1x, t1y] = pt(b.lon, R2), [t2x, t2y] = pt(b.lon, R2 - 9), [px, py] = pt(disp, RP);
      o += `<line class="tk" x1="${t1x}" y1="${t1y}" x2="${t2x}" y2="${t2y}"/>`;
      o += `<g class="pg"${PLANET_KEYS.includes(b.key) ? ` data-kind="planet" data-k="${b.key}"` : ""}><title>${PLANETS[b.key].n} · ${SIGNS[b.sign].n} ${fmt(b.lon).txt}${ch.known ? ` · البيت ${b.house}` : ""}</title><text x="${px}" y="${py}">${gl(PLANETS[b.key].g)}</text>${b.retro ? `<text class="rx" x="${(+px + 13).toFixed(1)}" y="${(+py + 12).toFixed(1)}">℞</text>` : ""}</g>`;
    });
    return o + "</svg>";
  }

  /* ---------- نموذج الخريطة ---------- */
  const citySel = $("#f-city");
  const citySearch = $("#f-city-search");
  const cityCoords = $("#f-city-coords");
  CITY_GROUPS.forEach(gr => {
    const og = document.createElement("optgroup"); og.label = gr.g;
    CITIES.forEach((c, i) => { if (c.g === gr.g) { const op = document.createElement("option"); op.value = i; op.textContent = c.n; op.dataset.search = (c.n + " " + c.g).toLocaleLowerCase("ar"); og.appendChild(op); } });
    citySel.appendChild(og);
  });
  const manualOpt = document.createElement("option"); manualOpt.value = "manual"; manualOpt.textContent = "مكان تاني (إدخال يدوي)"; citySel.appendChild(manualOpt);
  citySel.value = "0";
  function updateCityCoords() {
    if (citySel.value === "manual") { cityCoords.textContent = "الإدخال اليدوي: اكتب الإحداثيات وفرق التوقيت بنفسك."; return; }
    const place = CITIES[Number(citySel.value)];
    if (!place) return;
    cityCoords.textContent = "خط العرض: " + place.lat.toFixed(4) + "° · خط الطول: " + place.lon.toFixed(4) + "° · المنطقة الزمنية: " + (place.tz || "غير محددة");
  }
  citySearch.addEventListener("input", () => {
    const q = citySearch.value.trim().toLocaleLowerCase("ar");
    Array.from(citySel.options).forEach(op => {
      if (op.value === "manual" || !op.dataset.search) { op.hidden = false; return; }
      op.hidden = !!q && !op.dataset.search.includes(q);
    });
    Array.from(citySel.querySelectorAll("optgroup")).forEach(group => {
      group.hidden = Array.from(group.querySelectorAll("option")).every(op => op.hidden);
    });
    const visible = Array.from(citySel.options).find(op => op.value !== "manual" && !op.hidden);
    if (q && visible) citySel.value = visible.value;
    updateCityCoords();
  });
  citySel.addEventListener("change", () => { $("#manual").hidden = citySel.value !== "manual"; updateCityCoords(); });
  updateCityCoords();

  // Prefer the full GeoNames build when present; the checked-in review sample is a safe fallback.
  // Existing embedded cities remain available if the atlas JSON cannot be fetched.
  (async function loadArabAtlas() {
    let atlas = null;
    // الأطلس الكامل لا يُرفع للمستودع؛ نفعّله بعد توليده بـ scripts/build-geonames-atlas.js وتغيير العلامة إلى true.
    // وهو معطّل افتراضياً حتى لا يُطلب ملف غير موجود (404 في الكونسول).
    const FULL_ATLAS_BUILT = false;
    const atlasUrls = (FULL_ATLAS_BUILT ? ["data/atlas/cities-arab.json"] : []).concat(["data/atlas/cities-arab-review-sample.json"]);
    for (const url of atlasUrls) {
      try {
        const response = await fetch(url, { cache: "no-cache" });
        if (response.ok) { atlas = await response.json(); if (Array.isArray(atlas.cities)) break; }
      } catch (_) { /* continue to the fallback */ }
    }
    if (!atlas || !Array.isArray(atlas.cities)) return;
    const groups = new Map(Array.from(citySel.querySelectorAll("optgroup")).map(g => [g.label, g]));
    const known = new Set(CITIES.map(p => p.n.trim().toLocaleLowerCase("ar")));
    atlas.cities.forEach(item => {
      if (!item || typeof item.name !== "string" || !Number.isFinite(item.lat) || !Number.isFinite(item.lon)) return;
      const key = item.name.trim().toLocaleLowerCase("ar");
      if (known.has(key)) return;
      const place = { n: item.name, lat: item.lat, lon: item.lon, tz: item.timezone || "", g: item.country || "مدن عربية" };
      const idx = CITIES.push(place) - 1;
      let group = groups.get(place.g);
      if (!group) { group = document.createElement("optgroup"); group.label = place.g; groups.set(place.g, group); citySel.insertBefore(group, manualOpt); }
      const option = document.createElement("option");
      option.value = String(idx);
      option.textContent = place.n;
      option.dataset.search = (place.n + " " + place.g + " " + (item.nameLatin || "")).toLocaleLowerCase("ar");
      group.appendChild(option);
    });
  })();
  $("#f-unknown").addEventListener("change", e => { $("#f-time").disabled = e.target.checked; });

  let LAST = null;
  /* ملء صامت من بيانات الميلاد المحفوظة: يحسب نفس خريطة الميلاد بدون ما يغيّر شاشة الحاسبة. */
  function natalFromProfile(ownOnly) {
    try {
      if (window.AqSession && AqSession.known && !AqSession.user) return null;
      let p = JSON.parse(localStorage.getItem("aqeeq_profile_cache_v1") || "null");
      if ((!p || !p.date || !p.city) && !ownOnly) p = JSON.parse(localStorage.getItem("aq-last-birth-v1") || "null");
      if (!p || !p.date || !p.city) return null;
      const [y, m, d] = String(p.date).split("-").map(Number);
      if (!y || y < 1900 || y > 2100) return null;
      const known = !p.noTime && !!p.time; let hh = 12, mm = 0;
      if (known) [hh, mm] = String(p.time).split(":").map(Number);
      const q = String(p.city).trim().toLocaleLowerCase("ar");
      const c = CITIES.find(x => x.n.trim().toLocaleLowerCase("ar") === q) || CITIES.find(x => x.n.toLocaleLowerCase("ar").includes(q) || q.includes(x.n.toLocaleLowerCase("ar")));
      if (!c || !c.tz) return null;
      const utcMs = Astro.localToUtcMs(y, m, d, hh, mm, c.tz);
      const ch = Astro.chart({ utcMs, lat: c.lat, lon: c.lon, hs: "placidus", known });
      return { ch, name: p.name || "", y, m, d, hh, mm, known, placeName: c.n, lat: c.lat, lon: c.lon, utcMs, gender: p.gender || "" };
    } catch (e) { return null; }
  }
  /* إدخال بيانات الميلاد من نموذج صفحة الخرائط المتقدمة: يبني نفس سياق الخريطة ويُعلن aqeeq:natal-ready. */
  function setFromInput(o) {
    const c = CITIES[+o.cityIdx];
    if (!c || !c.tz || !o.y || !o.m || !o.d) throw new Error("اختر التاريخ والمدينة.");
    if (o.y < 1900 || o.y > 2100) throw new Error("السنة لازم تكون بين 1900 و 2100.");
    const known = !!o.known, hh = known ? o.hh : 12, mm = known ? o.mm : 0;
    const utcMs = Astro.localToUtcMs(o.y, o.m, o.d, hh, mm, c.tz);
    const ch = Astro.chart({ utcMs, lat: c.lat, lon: c.lon, hs: "placidus", known });
    LAST = { ch, name: o.name || "", y: o.y, m: o.m, d: o.d, hh, mm, known, placeName: c.n, lat: c.lat, lon: c.lon, utcMs, gender: o.gender || "" };
    /* حفظ آخر بيانات على هذا الجهاز كي لا يعيد كتابتها في الخرائط الأخرى */
    try {
      if (window.AqSession && AqSession.known && !AqSession.user) throw 0;
      const pad = x => String(x).padStart(2, "0");
      localStorage.setItem("aq-last-birth-v1", JSON.stringify({ date: o.y + "-" + pad(o.m) + "-" + pad(o.d), time: known ? pad(hh) + ":" + pad(mm) : "", noTime: !known, city: c.n, name: o.name || "", gender: o.gender || "" }));
    } catch (e) { }
    document.dispatchEvent(new Event("aqeeq:natal-ready"));
    return LAST;
  }
  function cityIndexByName(name) {
    const q = String(name || "").trim().toLocaleLowerCase("ar"); if (!q) return -1;
    return CITIES.findIndex(x => x.tz && x.n.trim().toLocaleLowerCase("ar") === q);
  }
  let MINE = null, MINEK = "";
  /* خريطة صاحب الحساب فقط من ملفه الشخصي، لا من آخر شخص حُسب في أي نموذج */
  function getMine() { const k = localStorage.getItem("aqeeq_profile_cache_v1") || ""; if (k !== MINEK) { MINEK = k; MINE = natalFromProfile(true); } return MINE; }
  window.AqeeqChartContext = { getMine, getNatal: () => LAST, getOrPrefill: () => LAST || (LAST = natalFromProfile()), setFromInput, cityIndexByName, cityOptionsHTML: () => citySel.innerHTML };
  $("#cform").addEventListener("submit", e => { e.preventDefault(); calc(); });

  function isolateResultView(activeView) {
    const allResultIds = ['result', 'mresult', 'matrix-result', 'lpresult', 'lifepath-result', 'syn-result', 'cp-out', 'eam-result'];
    const activeMap = {
      chart: ['result'],
      matrix: ['mresult', 'matrix-result'],
      lifepath: ['lpresult', 'lifepath-result'],
      synastry: ['syn-result'],
      compat: ['cp-out'],
      astromaps: ['eam-result']
    };
    const activeIds = activeMap[activeView] || [];

    allResultIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (activeIds.includes(id)) {
        el.hidden = false;
        el.style.display = 'block';
      } else {
        el.hidden = true;
        el.style.display = 'none';
      }
    });
  }
  window.isolateResultView = isolateResultView;

  function restoreAllForms() {
    const cf = document.getElementById('cform');
    const chartIntro = document.querySelector('#chart .center');
    if (cf) { cf.hidden = false; cf.style.display = ''; }
    if (chartIntro) { chartIntro.hidden = false; chartIntro.style.display = ''; }

    const mf = document.getElementById('mform');
    const matrixIntro = document.querySelector('#matrix .center');
    if (mf) { mf.hidden = false; mf.style.display = ''; }
    if (matrixIntro) { matrixIntro.hidden = false; matrixIntro.style.display = ''; }

    const lpf = document.getElementById('lpform');
    const lpStart = document.getElementById('lp-start');
    const lpIntro = document.querySelector('#lifepath .center');
    if (lpf) { lpf.hidden = false; lpf.style.display = ''; }
    if (lpStart) { lpStart.hidden = false; lpStart.style.display = ''; }
    if (lpIntro) { lpIntro.hidden = false; lpIntro.style.display = ''; }

    const cpf = document.getElementById('cp-form');
    const cpIntro = document.querySelector('#compat .center');
    if (cpf) { cpf.hidden = false; cpf.style.display = ''; }
    if (cpIntro) { cpIntro.hidden = false; cpIntro.style.display = ''; }
  }

  function onHashChangeRoute() {
    const hash = (window.location.hash || '').replace('#', '');
    if (hash === 'chart') {
      const result = document.getElementById('result');
      const cf = document.getElementById('cform');
      const chartIntro = document.querySelector('#chart .center');
      if (LAST && result && result.innerHTML && result.innerHTML.trim()) {
        isolateResultView('chart');
        if (cf) { cf.hidden = true; cf.style.display = 'none'; }
        if (chartIntro) { chartIntro.hidden = true; chartIntro.style.display = 'none'; }
      } else {
        if (cf) { cf.hidden = false; cf.style.display = ''; }
        if (chartIntro) { chartIntro.hidden = false; chartIntro.style.display = ''; }
        if (result) { result.hidden = true; result.style.display = 'none'; }
      }
    } else if (hash === 'matrix') {
      const mresult = document.getElementById('mresult');
      const mf = document.getElementById('mform');
      const matrixIntro = document.querySelector('#matrix .center');
      if (lastMX && mresult && mresult.innerHTML && mresult.innerHTML.trim()) {
        isolateResultView('matrix');
        if (mf) { mf.hidden = true; mf.style.display = 'none'; }
        if (matrixIntro) { matrixIntro.hidden = true; matrixIntro.style.display = 'none'; }
      } else {
        if (mf) { mf.hidden = false; mf.style.display = ''; }
        if (matrixIntro) { matrixIntro.hidden = false; matrixIntro.style.display = ''; }
        if (mresult) { mresult.hidden = true; mresult.style.display = 'none'; }
      }
    } else if (hash === 'lifepath') {
      const lpresult = document.getElementById('lpresult');
      const lpf = document.getElementById('lpform');
      const lpStart = document.getElementById('lp-start');
      const lpIntro = document.querySelector('#lifepath .center');
      if (lastLP && lpresult && lpresult.innerHTML && lpresult.innerHTML.trim()) {
        isolateResultView('lifepath');
        if (lpf) { lpf.hidden = true; lpf.style.display = 'none'; }
        if (lpStart) { lpStart.hidden = true; lpStart.style.display = 'none'; }
        if (lpIntro) { lpIntro.hidden = true; lpIntro.style.display = 'none'; }
      } else {
        if (lpf) { lpf.hidden = false; lpf.style.display = ''; }
        if (lpStart) { lpStart.hidden = false; lpStart.style.display = ''; }
        if (lpIntro) { lpIntro.hidden = false; lpIntro.style.display = ''; }
        if (lpresult) { lpresult.hidden = true; lpresult.style.display = 'none'; }
      }
    } else if (hash === 'compat') {
      const cpOut = document.getElementById('cp-out');
      const cpf = document.getElementById('cp-form');
      const cpIntro = document.querySelector('#compat .center');
      if (cpOut && cpOut.innerHTML && cpOut.innerHTML.trim() && !cpOut.hidden) {
        isolateResultView('compat');
        if (cpf) { cpf.hidden = true; cpf.style.display = 'none'; }
        if (cpIntro) { cpIntro.hidden = true; cpIntro.style.display = 'none'; }
      } else {
        if (cpf) { cpf.hidden = false; cpf.style.display = ''; }
        if (cpIntro) { cpIntro.hidden = false; cpIntro.style.display = ''; }
        if (cpOut) { cpOut.hidden = true; cpOut.style.display = 'none'; }
      }
    } else if (hash === 'astro-maps') {
      isolateResultView('astromaps');
    } else if (hash === 'home' || !hash) {
      isolateResultView('home');
      restoreAllForms();
    }
  }
  window.addEventListener('hashchange', onHashChangeRoute);
  window.addEventListener('DOMContentLoaded', onHashChangeRoute);

  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-return-home');
    if (btn) {
      e.preventDefault();
      isolateResultView('home');
      restoreAllForms();
      window.location.hash = '#home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const editChart = e.target.closest('.btn-edit-chart');
    if (editChart) {
      e.preventDefault();
      const cf = document.getElementById('cform');
      const chartIntro = document.querySelector('#chart .center');
      const result = document.getElementById('result');
      if (cf) { cf.hidden = false; cf.style.display = 'block'; }
      if (chartIntro) { chartIntro.hidden = false; chartIntro.style.display = ''; }
      if (result) { result.hidden = true; result.style.display = 'none'; }
      const chartSec = document.getElementById('chart');
      if (chartSec) chartSec.scrollIntoView({ behavior: 'smooth' });
      const nameInput = document.getElementById('f-name');
      if (nameInput) nameInput.focus();
      return;
    }

    const editMatrix = e.target.closest('.btn-edit-matrix');
    if (editMatrix) {
      e.preventDefault();
      const mf = document.getElementById('mform');
      const matrixIntro = document.querySelector('#matrix .center');
      const result = document.getElementById('mresult');
      if (mf) { mf.hidden = false; mf.style.display = 'block'; }
      if (matrixIntro) { matrixIntro.hidden = false; matrixIntro.style.display = ''; }
      if (result) { result.hidden = true; result.style.display = 'none'; }
      const matrixSec = document.getElementById('matrix');
      if (matrixSec) matrixSec.scrollIntoView({ behavior: 'smooth' });
      const dateInput = document.getElementById('m-date');
      if (dateInput) dateInput.focus();
      return;
    }

    const editLP = e.target.closest('.btn-edit-lp, #lp-back-start');
    if (editLP) {
      e.preventDefault();
      const lpf = document.getElementById('lpform');
      const lpStart = document.getElementById('lp-start');
      const lpIntro = document.querySelector('#lifepath .center');
      const result = document.getElementById('lpresult');
      if (lpf) { lpf.hidden = false; lpf.style.display = 'block'; }
      if (lpStart) { lpStart.hidden = false; lpStart.style.display = ''; }
      if (lpIntro) { lpIntro.hidden = false; lpIntro.style.display = ''; }
      if (result) { result.hidden = true; result.style.display = 'none'; }
      const lpSec = document.getElementById('lifepath');
      if (lpSec) lpSec.scrollIntoView({ behavior: 'smooth' });
      const dateInput = document.getElementById('lp-date');
      if (dateInput) dateInput.focus();
      return;
    }

    const editCP = e.target.closest('.btn-edit-cp');
    if (editCP) {
      e.preventDefault();
      const cpf = document.getElementById('cp-form');
      const cpIntro = document.querySelector('#compat .center');
      const out = document.getElementById('cp-out');
      if (cpf) { cpf.hidden = false; cpf.style.display = 'block'; }
      if (cpIntro) { cpIntro.hidden = false; cpIntro.style.display = ''; }
      if (out) { out.hidden = true; out.style.display = 'none'; }
      const cpSec = document.getElementById('compat');
      if (cpSec) cpSec.scrollIntoView({ behavior: 'smooth' });
      const input1 = document.getElementById('cp1-date');
      if (input1) input1.focus();
      return;
    }
  });

  function fail(msg) { const el = $("#ferr"); el.textContent = msg; el.hidden = false; }

  function calc() {
    $("#ferr").hidden = true;
    const gender = $("#f-gender").value;
    const date = $("#f-date").value;
    if (!date) return fail("اكتب تاريخ الميلاد.");
    const [y, m, d] = date.split("-").map(Number);
    if (y < 1900 || y > 2100) return fail("التاريخ لازم يكون بين 1900 و 2100.");
    const known = !$("#f-unknown").checked;
    let hh = 12, mm = 0;
    if (known) {
      const t = $("#f-time").value;
      if (!t) return fail("اكتب وقت الميلاد، أو علّم على (مش عارف وقت ميلادي).");
      [hh, mm] = t.split(":").map(Number);
    }
    let lat, lon, utcMs, placeName;
    if (citySel.value === "manual") {
      lat = parseFloat($("#f-lat").value); lon = parseFloat($("#f-lon").value);
      const off = parseFloat($("#f-off").value);
      if (![lat, lon, off].every(Number.isFinite) || Math.abs(lat) > 89 || Math.abs(lon) > 180) return fail("اكتب خط العرض والطول وفرق التوقيت بشكل صحيح.");
      utcMs = Date.UTC(y, m - 1, d, hh, mm) - off * 3600000;
      placeName = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
    } else {
      const c = CITIES[+citySel.value];
      lat = c.lat; lon = c.lon; placeName = c.n;
      try { utcMs = Astro.localToUtcMs(y, m, d, hh, mm, c.tz); }
      catch (err) { return fail("المتصفح مش قادر يحسب التوقيت المحلي للمكان ده. جرّب الإدخال اليدوي."); }
    }
    const ch = Astro.chart({ utcMs, lat, lon, hs: $("#f-hs").value, known });
    LAST = { ch, name: $("#f-name").value.trim(), y, m, d, hh, mm, known, placeName, lat, lon, utcMs, gender };
    document.dispatchEvent(new Event("aqeeq:natal-ready"));
    // Keep the report draft on this device across the Paymob redirect; it is sent only
    // after the user returns with a verified paid order and presses the report button.
    try {
      sessionStorage.setItem("aq-report-draft", JSON.stringify({
        userName: LAST.name,
        birthData: { year: y, month: m, day: d, hour: hh, minute: mm, known, placeName, lat, lon, utc: new Date(utcMs).toISOString(), houseSystem: ch.hs },
        chartData: { bodies: ch.bodies.map(b => ({ key: b.key, lon: b.lon, speed: b.speed, retro: b.retro, sign: b.sign, house: b.house })), asc: ch.asc, mc: ch.mc, cusps: ch.cusps, hs: ch.hs, lat: ch.lat, lon: ch.lon, known: ch.known }
      }));
    } catch (_) { /* Private browsing/storage limits must not break chart calculation. */ }
    renderResult(LAST); if (typeof isolateResultView === "function") isolateResultView("chart");
    const r = $("#result"); r.hidden = false; r.style.display = "block";
    const cf = $("#cform"); if (cf) { cf.hidden = true; cf.style.display = "none"; }
    const chartIntro = document.querySelector("#chart .center"); if (chartIntro) { chartIntro.hidden = true; chartIntro.style.display = "none"; }
    window.AqeeqGender?.apply(r, LAST.gender);
    r.scrollIntoView({ behavior: "smooth" });
  }

  /* ---------- خريطة التوافق الفلكي بين شخصين ---------- */
  (function initCompat() {
    const host1 = $("#cp1"), host2 = $("#cp2"), form = $("#cp-form"), out = $("#cp-out"), err = $("#cp-err"), status = $("#cp-status");
    if (!host1 || !host2 || !form) return;
    const CP_KEYS = ["sun", "moon", "mercury", "venus", "mars"];
    const SYNASTRY_ASPECTS = ASPECTS.filter(x => ["conj", "opp", "tri", "sq"].includes(x.k));
    const HARM = ["tri"], CHAL = ["sq", "opp"];
    const CATS = {
      emo: { t: "التوافق العاطفي", pairs: [["moon", "moon"], ["moon", "venus"], ["venus", "moon"], ["sun", "moon"], ["moon", "sun"]] },
      com: { t: "التواصل والتفكير", pairs: [["mercury", "mercury"], ["mercury", "moon"], ["moon", "mercury"], ["mercury", "sun"], ["sun", "mercury"]] },
      att: { t: "الانجذاب والتفاعل", pairs: [["venus", "mars"], ["mars", "venus"], ["sun", "venus"], ["venus", "sun"], ["mars", "sun"], ["sun", "mars"]] }
    };

    const personFields = (p, label) => `<fieldset class="cp-person"><legend>${label}</legend>
      <div class="field"><label for="${p}-name">الاسم (اختياري)</label><input id="${p}-name" type="text" autocomplete="off" maxlength="40"></div>
      <div class="field"><label for="${p}-gender">الجنس وصيغة المخاطبة (اختياري)</label><select id="${p}-gender" data-gender-select data-gender-group="${p}"><option value="">بدون تحديد</option><option value="male">ذكر</option><option value="female">أنثى</option></select></div>
      <div class="cp-two">
        <div class="field"><label for="${p}-date">تاريخ الميلاد</label><input id="${p}-date" type="date" min="1900-01-01" max="2100-12-31" required></div>
        <div class="field"><label for="${p}-time">وقت الميلاد</label><input id="${p}-time" type="time"></div>
      </div>
      <label class="chk"><input id="${p}-unknown" type="checkbox"> مش عارف وقت الميلاد</label>
      <p class="cp-note">لو الوقت تقريبي أو مش معروف، موقع القمر والطالع ممكن يتغيروا، وده بيأثر على دقة الاتصالات اللي فيها القمر.</p>
      <div class="field"><label for="${p}-city">مدينة ودولة الميلاد</label><select id="${p}-city"></select></div>
      <div id="${p}-manual" class="cp-two" hidden>
        <div class="field"><label for="${p}-lat">خط العرض (شمال +)</label><input id="${p}-lat" type="number" step="any" inputmode="decimal" placeholder="30.04"></div>
        <div class="field"><label for="${p}-lon">خط الطول (شرق +)</label><input id="${p}-lon" type="number" step="any" inputmode="decimal" placeholder="31.23"></div>
        <div class="field"><label for="${p}-off">فرق التوقيت عن جرينتش</label><input id="${p}-off" type="number" step="any" inputmode="decimal" placeholder="2"></div>
      </div>
    </fieldset>`;

    host1.innerHTML = personFields("cp1", "الشخص الأول");
    host2.innerHTML = personFields("cp2", "الشخص الثاني");
    ["cp1", "cp2"].forEach(p => {
      const sel = $("#" + p + "-city");
      CITY_GROUPS.forEach(gr => {
        const og = document.createElement("optgroup"); og.label = gr.g;
        CITIES.forEach((c, i) => { if (c.g === gr.g) { const op = document.createElement("option"); op.value = i; op.textContent = c.n; og.appendChild(op); } });
        sel.appendChild(og);
      });
      const manual = document.createElement("option"); manual.value = "manual"; manual.textContent = "مكان تاني (إدخال يدوي)";
      sel.appendChild(manual);
      sel.value = "0";
      sel.addEventListener("change", () => { $("#" + p + "-manual").hidden = sel.value !== "manual"; });
      const unknownInput = $("#" + p + "-unknown");
      const timeInput = $("#" + p + "-time");
      const syncTimeState = () => {
        const unknown = unknownInput.checked;
        timeInput.disabled = unknown;
        timeInput.required = !unknown;
        if (unknown) timeInput.value = "";
      };
      unknownInput.addEventListener("change", syncTimeState);
      syncTimeState();
    });

    const readP = p => {
      const label = p === "cp1" ? "الشخص الأول" : "الشخص الثاني";
      const ds = $("#" + p + "-date").value;
      const gender = $("#" + p + "-gender").value;
      if (!ds) throw "اكتب تاريخ ميلاد " + label + ".";
      const [y, m, d] = ds.split("-").map(Number);
      const known = !$("#" + p + "-unknown").checked;
      let hh = 12, mm = 0;
      if (known) {
        const t = $("#" + p + "-time").value;
        if (!t) throw "اكتب وقت ميلاد " + label + "، أو علّم على (مش عارف وقت الميلاد) لو مش معروف.";
        [hh, mm] = t.split(":").map(Number);
      }
      const sel = $("#" + p + "-city");
      let lat, lon, utcMs, placeName;
      if (sel.value === "manual") {
        lat = parseFloat($("#" + p + "-lat").value); lon = parseFloat($("#" + p + "-lon").value);
        const off = parseFloat($("#" + p + "-off").value);
        if (![lat, lon, off].every(Number.isFinite) || Math.abs(lat) > 89 || Math.abs(lon) > 180) throw "اكتب خط العرض والطول وفرق التوقيت لـ" + label + " بشكل صحيح.";
        utcMs = Date.UTC(y, m - 1, d, hh, mm) - off * 3600000;
        placeName = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
      } else {
        const c = CITIES[+sel.value];
        lat = c.lat; lon = c.lon; placeName = c.n;
        try { utcMs = Astro.localToUtcMs(y, m, d, hh, mm, c.tz); }
        catch (e) { throw "المتصفح مش قادر يحسب التوقيت المحلي للمكان ده. جرّب الإدخال اليدوي."; }
      }
      const ch = Astro.chart({ utcMs, lat, lon, hs: "placidus", known });
      return { name: $("#" + p + "-name").value.trim() || label, placeName, known, ch, date: `${d}/${m}/${y}`, gender };
    };

    const midpointLongitude = (a, b) => Astro.norm(a + Astro.d180(b - a) / 2);
    const formatPosition = lon => {
      const value = Astro.norm(lon);
      let signIndex = Math.floor(value / 30);
      let withinSign = value - signIndex * 30;
      let degree = Math.floor(withinSign);
      let minute = Math.round((withinSign - degree) * 60);
      if (minute === 60) {
        minute = 0;
        degree += 1;
        if (degree === 30) { degree = 0; signIndex = (signIndex + 1) % 12; }
      }
      return `${SIGNS[signIndex].g} ${SIGNS[signIndex].n} ${degree}°${String(minute).padStart(2, "0")}′`;
    };
    const findAspect = diff => SYNASTRY_ASPECTS.find(asp => Math.abs(diff - asp.ang) <= asp.orb) || null;

    const calculateComposite = (P1, P2) => {
      const positions = CP_KEYS.map(key => {
        const A = P1.ch.bodies.find(body => body.key === key);
        const B = P2.ch.bodies.find(body => body.key === key);
        return { key, lon: midpointLongitude(A.lon, B.lon) };
      });
      const aspects = [];
      for (let i = 0; i < positions.length; i += 1) {
        for (let j = i + 1; j < positions.length; j += 1) {
          const A = positions[i], B = positions[j];
          let angle = Math.abs(A.lon - B.lon);
          if (angle > 180) angle = 360 - angle;
          const asp = findAspect(angle);
          if (asp) aspects.push({ a: A.key, b: B.key, asp, angle, orb: Math.abs(angle - asp.ang) });
        }
      }
      const anglesKnown = P1.known && P2.known &&
        Number.isFinite(P1.ch.asc) && Number.isFinite(P2.ch.asc) &&
        Number.isFinite(P1.ch.mc) && Number.isFinite(P2.ch.mc);
      const ascMid = anglesKnown ? midpointLongitude(P1.ch.asc, P2.ch.asc) : null;
      // منتصف القوس الأقصر لرأس بيت قد يقع في النصف المقابل للدائرة فيختل ترتيب البيوت؛
      // نختار من النقطتين المتقابلتين الأقرب لموضع البيت المتوقع بعد الطالع المركّب.
      const cusps = anglesKnown && Array.isArray(P1.ch.cusps) && Array.isArray(P2.ch.cusps)
        ? P1.ch.cusps.map((cusp, i) => {
            const m = midpointLongitude(cusp, P2.ch.cusps[i]);
            return Math.abs(Astro.d180(m - (ascMid + 30 * i))) > 90 ? Astro.norm(m + 180) : m;
          })
        : null;
      return {
        positions,
        aspects: aspects.sort((a, b) => a.orb - b.orb),
        anglesKnown,
        asc: ascMid,
        mc: anglesKnown ? (cusps ? cusps[9] : midpointLongitude(P1.ch.mc, P2.ch.mc)) : null,
        cusps
      };
    };

    const calculateSynastry = (P1, P2) => {
      const asps = [];
      CP_KEYS.forEach(a => CP_KEYS.forEach(b => {
        const A = P1.ch.bodies.find(x => x.key === a), B = P2.ch.bodies.find(x => x.key === b);
        if (!A || !B) return;
        let diff = Math.abs(A.lon - B.lon) % 360; if (diff > 180) diff = 360 - diff;
        for (const asp of SYNASTRY_ASPECTS) {
          const orb = Math.abs(diff - asp.ang);
          if (orb <= asp.orb) { asps.push({ a, b, asp, angle: diff, orb }); break; }
        }
      }));
      const cat = {};
      Object.keys(CATS).forEach(k => {
        const list = asps.filter(x => CATS[k].pairs.some(([p, q]) => x.a === p && x.b === q));
        let score = 0; const pos = [], neg = [];
        list.forEach(x => {
          const close = 1 - x.orb / x.asp.orb;
          const w = 0.5 + close / 2;
          if (HARM.includes(x.asp.k)) { score += w; pos.push(x); }
          else if (CHAL.includes(x.asp.k)) { score -= 0.7 * w; neg.push(x); }
          else { score += 0.5 * w; pos.push(x); }
        });
        const level = score >= 1.5 ? "قوي" : score >= 0.5 ? "متوسط" : score > -0.5 ? "محتاج شغل" : "محتاج تفاهم كبير";
        cat[k] = { t: CATS[k].t, level, pos, neg };
      });
      return { asps, cat, composite: calculateComposite(P1, P2) };
    };

    window.AqeqSynastry = Object.freeze({ calculateSynastry, calculateComposite });

    const line = x => `<li><strong>${PLANETS[x.a].n} ↔ ${PLANETS[x.b].n}</strong>: ${x.asp.n} · الزاوية ${x.angle.toFixed(1)}° · الأورب ${x.orb.toFixed(1)}°. ${x.asp.nat}.</li>`;
    const render = (P1, P2, R) => {
      const pos = R.asps.filter(x => HARM.includes(x.asp.k)).length;
      const neg = R.asps.filter(x => CHAL.includes(x.asp.k)).length;
      const overall = pos > neg + 2
        ? "التوافق بينكم فيه تدفق طبيعي وانسجام واضح. ده بيفتح باب للتعاون، بس مش ضمان لنجاح العلاقة."
        : pos + 2 < neg
          ? "فيه احتكاكات واضحة بين الطاقتين، وده محتاج صبر وتفاهم أكتر، ومش معناه إن العلاقة مش ممكنة."
          : "فيه انسجام واختلاف متوازنين، والنتيجة هتعتمد أكتر على طريقة التعامل بينكم.";
      const weak = k => /شغل|تفاهم/.test(R.cat[k].level);
      const tips = [];
      if (weak("com")) tips.push("اتفقوا على وقت هادي للكلام في المواضيع الحساسة، ومتسيبوش الكلام يتراكم.");
      if (weak("emo")) tips.push("اسألوا بعض عن الاحتياج العاطفي بشكل مباشر بدل ما تفترضوه.");
      if (weak("att")) tips.push("خلّوا مساحة للاهتمامات المختلفة، ومتحسّوهاش تهديد.");
      if (!tips.length) tips.push("حافظوا على الحوار المفتوح، واهتموا بالاختلافات الصغيرة قبل ما تكبر.");
      const allPos = Object.values(R.cat).flatMap(c => c.pos), allNeg = Object.values(R.cat).flatMap(c => c.neg);
      const top = R.asps.slice().sort((x, y) => x.orb - y.orb).slice(0, 6);
      const compositePositions = R.composite.positions.map(({ key, lon }) => {
        const sign = SIGNS[Math.floor(Astro.norm(lon) / 30)];
        return `<div class="cp-composite-chip"><strong>${PLANETS[key].g} ${PLANETS[key].n}</strong><span>${formatPosition(lon)} · ${sign.n}</span></div>`;
      }).join("");
      const compositeAspects = R.composite.aspects.slice(0, 8).map(x =>
        `<li><strong>${PLANETS[x.a].n} — ${PLANETS[x.b].n}</strong>: ${x.asp.n} · الزاوية ${x.angle.toFixed(1)}° · الأورب ${x.orb.toFixed(1)}°.</li>`
      ).join("");
      const compositeAngles = R.composite.anglesKnown
        ? `<p class="cp-note"><strong>الطالع المركّب:</strong> ${formatPosition(R.composite.asc)} · <strong>وسط السماء:</strong> ${formatPosition(R.composite.mc)}</p>`
        : `<p class="cp-note">الطالع والبيوت المركّبة غير معروضة لأن وقت الميلاد غير معروف لطرف واحد على الأقل.</p>`;
      const compositeCusps = R.composite.cusps
        ? `<details class="cp-composite-houses"><summary>رؤوس البيوت الاثني عشر في الخريطة المركّبة</summary><ol>${R.composite.cusps.map((cusp, i) => `<li>البيت ${i + 1}: ${formatPosition(cusp)}</li>`).join("")}</ol></details>`
        : "";
      const fallbackNote = [P1, P2].some(p => p.ch.hs === "whole-fallback")
        ? `<p class="cp-note">فيه مكان بعيد عن خط الاستواء بدرجة بتصعّب نظام Placidus، فالبيوت (لو ظهرت) محسوبة بنظام Whole Sign.</p>` : "";
      const unknownNote = [P1, P2].some(p => !p.known)
        ? `<p class="cp-note">فيه وقت ميلاد غير معروف، والقمر بيتحرك حوالي 13 درجة في اليوم، فالاتصالات اللي فيها القمر تقريبية.</p>` : "";
      const returnHomeBtn = `<div class="result-top-bar"><a href="#home" class="btn-return-home" role="button"><span>←</span> العودة للرئيسية</a></div>`;
      const summaryCard = `<div class="chart-summary-card">
        <div class="chart-summary-info">
          <div class="chart-summary-badge">توافق الخريطتين الفلكي</div>
          <h3 class="chart-summary-title">${esc(P1.name)} × ${esc(P2.name)}</h3>
          <p class="chart-summary-meta">
            <span><span class="meta-glyph">●</span> ${esc(P1.name)}: ${P1.date} · ${esc(P1.placeName)}</span>
            <span class="meta-sep">•</span>
            <span><span class="meta-glyph">●</span> ${esc(P2.name)}: ${P2.date} · ${esc(P2.placeName)}</span>
          </p>
        </div>
        <div class="chart-summary-actions">
          <button type="button" class="btn-edit-cp" id="btn-edit-cp"><svg class="edit-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> تعديل البيانات / توافق جديد</button>
        </div>
      </div>`;
      return returnHomeBtn + summaryCard + `<div class="cp-res">
        <header class="cp-result-head"><div><span class="cp-result-kicker">قراءة توافق رمزية</span><h3>${esc(P1.name)} <span aria-hidden="true">×</span> ${esc(P2.name)}</h3><p class="cp-meta">${P1.date} · ${P1.placeName} <span aria-hidden="true">|</span> ${P2.date} · ${P2.placeName}</p><p class="cp-gender-meta">صيغة المخاطبة: الطرف الأول ${P1.gender === "female" ? "أنثى" : "ذكر"} · الطرف الثاني ${P2.gender === "female" ? "أنثى" : "ذكر"}</p></div><span class="cp-result-mark" aria-hidden="true">☉</span></header>
        ${unknownNote}${fallbackNote}
        <section class="cp-overview">
          <div class="cp-overview-copy"><span class="cp-result-kicker">الصورة العامة</span><p>${overall}</p></div>
          <div class="cp-indicators">${Object.keys(R.cat).map(k => '<article><strong>'+R.cat[k].t+'</strong><span>'+R.cat[k].level+'</span></article>').join("")}</div>
        </section>
        <section class="sx cp-wheel-section"><div class="cp-section-heading"><div><span class="cp-result-kicker">01 · التراكب</span><h4>تراكب الخريطتين</h4></div><span class="cp-section-caption">مواضع واتصالات</span></div><div id="cp-bi-wheel" class="aq-wheel-host" aria-label="عجلة التوافق الثنائية"></div></section>
        <div class="cp-details-stack">
          <details class="lpa-card is-light cp-acc"><summary class="lpa-sum"><span class="lpa-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg></span><span class="lpa-t">اتصالات الانسجام</span><small class="lpa-sub">${allPos.length} اتصال</small><span class="lpa-chev"></span></summary><div class="lpa-body cp-accordion-body"><ul>${allPos.map(line).join("") || "<li>لا توجد اتصالات منسجمة ضمن المحاور المحددة.</li>"}</ul></div></details>
          <details class="lpa-card is-shadow cp-acc"><summary class="lpa-sum"><span class="lpa-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 7h14M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z"/></svg></span><span class="lpa-t">نقاط تحتاج إلى تفاهم</span><small class="lpa-sub">${allNeg.length} اتصال</small><span class="lpa-chev"></span></summary><div class="lpa-body cp-accordion-body"><ul>${allNeg.map(line).join("") || "<li>لا توجد اتصالات ضاغطة بارزة ضمن المحاور المحددة.</li>"}</ul></div></details>
          <details class="lpa-card  cp-acc"><summary class="lpa-sum"><span class="lpa-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)"/></svg></span><span class="lpa-t">أقرب اتصالات الكواكب</span><small class="lpa-sub">حتى 6 اتصالات</small><span class="lpa-chev"></span></summary><div class="lpa-body cp-accordion-body"><ul>${top.map(line).join("") || "<li>لا توجد اتصالات رئيسية ضمن الأورب المحدد.</li>"}</ul></div></details>
          <details class="lpa-card cp-acc cp-composite">
            <summary class="lpa-sum"><span class="lpa-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/></svg></span><span class="lpa-t">الخريطة المركّبة</span><small class="lpa-sub">مواضع مشتركة واتصالات</small><span class="lpa-chev"></span></summary>
            <div class="lpa-body cp-accordion-body"><p class="cp-note">مواضع الكواكب هي منتصفات القوس الأقصر بين خريطتي الميلاد. هذه قراءة رمزية وليست قياسًا لنجاح العلاقة.</p>
              <div id="cp-composite-wheel" class="aq-wheel-host" aria-label="عجلة الخريطة المركبة"></div>
              <div class="cp-composite-grid">${compositePositions}</div><h5>اتصالات داخل الخريطة المركّبة</h5>
              <ul>${compositeAspects || "<li>لا توجد اتصالات رئيسية ضمن الأورب المحدد.</li>"}</ul>${compositeAngles}${compositeCusps}
            </div>
          </details>
          <details class="lpa-card  cp-acc"><summary class="lpa-sum"><span class="lpa-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/></svg></span><span class="lpa-t">اقتراحات للحوار والتعامل</span><small class="lpa-sub">نصائح عملية</small><span class="lpa-chev"></span></summary><div class="lpa-body cp-accordion-body"><ul>${tips.map(t => '<li>'+esc(t)+'</li>').join("")}</ul></div></details>
        </div>
        <p class="cp-result-disclaimer">القراءة الفلكية هنا للتأمل والحوار، ولا تحكم على نجاح العلاقة أو مستقبلها.</p>
      </div>`;
    };

    form.addEventListener("submit", async e => {
      e.preventDefault();
      err.hidden = true;
      out.hidden = true;
      status.hidden = false;
      status.dataset.state = "loading";
      status.textContent = "بنحسب خريطتي الميلاد ونبني الخريطة المركّبة…";
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
      }
      try {
        // Let the live status paint before the synchronous ephemeris calculations begin.
        await new Promise(resolve => setTimeout(resolve, 16));
        const P1 = readP("cp1"), P2 = readP("cp2");
        const synastry = calculateSynastry(P1, P2);
        out.innerHTML = render(P1, P2, synastry);
        if (P1.gender === P2.gender) window.AqeeqGender?.apply(out, P1.gender);
        window.AqeeqAstroWheel?.renderSynastryWheel(document.querySelector("#cp-bi-wheel"), P1.ch, P2.ch, synastry.asps, { a: P1.name, b: P2.name });
        window.AqeeqAstroWheel?.renderCompositeWheel(document.querySelector("#cp-composite-wheel"), synastry.composite);
        out.hidden = false;
        out.style.display = "block";
        form.hidden = true;
        form.style.display = "none";
        const cpIntro = document.querySelector("#compat .center");
        if (cpIntro) { cpIntro.hidden = true; cpIntro.style.display = "none"; }
        status.dataset.state = "done";
        status.textContent = "اكتمل حساب الخريطتين والخريطة المركّبة.";
        out.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (ex) {
        status.hidden = true;
        err.textContent = typeof ex === "string" ? ex : "حصل خطأ في الحساب. راجع بيانات الميلاد وحاول تاني.";
        err.hidden = false;
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute("aria-busy");
        }
      }
    });
  })();

  /* ---------- عرض النتيجة ---------- */
  const body = (ch, k) => ch.bodies.find(b => b.key === k);


  /* ---------- تفاصيل عناصر الخريطة عند الضغط ---------- */
  const lab = k => k === "asc" ? "الطالع" : k === "mc" ? "وسط السما" : PLANETS[k].n;
  const aspLine = a => `<li>${lab(a.a)} ${a.asp.n} ${lab(a.b)} <span class="tone">أوربة ${a.orb.toFixed(1)}°</span></li>`;
  const pLink = k => `<button type="button" class="wd-link" data-kind="planet" data-k="${k}">${PLANETS[k].n}</button>`;
  const sLink = i => `<button type="button" class="wd-link" data-kind="sign" data-i="${i}">${SIGNS[i].n}</button>`;
  const hLink = i => `<button type="button" class="wd-link" data-kind="house" data-i="${i}">بيت ${HOUSES[i].n}</button>`;
  function wheelDetail(ch, kind, v) {
    const asps = natalAspects(ch);
    if (kind === "sign") {
      const i = +v, s = SIGNS[i];
      const inS = ch.bodies.filter(b => PLANET_KEYS.includes(b.key) && b.sign === i);
      const names = inS.map(b => b.key);
      const relA = asps.filter(a => names.includes(a.a) || names.includes(a.b));
      const hs = ch.known ? ch.cusps.map((c, j) => ({ c, j })).filter(x => Math.floor(x.c / 30) === i).map(x => x.j + 1) : [];
      const risesHere = ch.known && Math.floor(ch.asc / 30) === i;
      return `<h3>برج ${s.n} <span class="sg" aria-hidden="true">${gl(s.g)}</span></h3>
        <p class="sub">${s.d} · حاكمه ${PLANETS[s.ruler].n}</p>
        ${risesHere ? `<p>الطالع في برجك النهاردة، يعني ده البرج اللي بيظهر بيه شكلك للناس.</p>` : ""}
        ${ch.known ? `<p>${hs.length ? "رأس " + (hs.length > 1 ? "بيتين" : "بيت") + " في البرج ده: " + hs.map(n => "بيت " + HOUSES[n - 1].n).join("، ") : "مفيش رأس بيت في البرج ده في خريطتك."}</p>` : `<p class="note">من غير وقت الميلاد مش هنعرض البيوت.</p>`}
        <h4 class="ph">الكواكب الموجودة فيه</h4>
        ${inS.length ? `<p>${inS.map(b => pLink(b.key)).join(" ")}</p>` : `<p class="sub">مفيش كواكب في البرج ده في خريطتك. ده مش معناه إنه بلا دلالة، لأنه ممكن يتأثر بحاكمه ${PLANETS[s.ruler].n}.</p>`}
        <h4 class="ph">الاتصالات المرتبطة</h4>
        ${relA.length ? `<ul class="asp-list">${relA.map(aspLine).join("")}</ul>` : `<p class="sub">مفيش اتصالات مؤثرة للكواكب دي.</p>`}
        <h4 class="ph">معنى وجوده في الخريطة</h4>
        <p>برج ${s.n} ${s.way}. لما يتجمع فيه كواكب أو يبقى فيه رأس بيت، التركيز بيكون على ${s.strength}، ومحتاج تنتبه لـ${s.shadow}.</p>
        <p class="sub">القراءة دي بتتحسب من مواقع خريطتك، والتفسير الكامل للبرج هيتضاف لما يتعتمد المحتوى.</p>`;
    }
    if (kind === "planet") {
      const k = v, p = PLANETS[k], b = ch.bodies.find(x => x.key === k), sg = SIGNS[b.sign], f = fmt(b.lon);
      const mine = asps.filter(a => a.a === k || a.b === k);
      return `<h3>${p.n} في ${sg.n} ${num(f.txt)} <span class="sg" aria-hidden="true">${gl(p.g)}</span></h3>
        <p class="sub">${ch.known && b.house ? "بيت " + HOUSES[b.house - 1].n : "البيت يحتاج وقت الميلاد"}${b.retro ? " · راجع" : ""}</p>
        <p>${p.theme}. بتتعبّر بطريقة ${sg.way}.</p>
        ${ch.known && b.house ? `<p><b>معنى وجوده في البيت:</b> ${planetInHouse(k, b.house, "natal")}</p>` : ""}
        <p><b>نقاط القوة:</b> ${p.give}.</p>
        <p><b>التحدي:</b> ${p.watch}.</p>
        <h4 class="ph">اتصالاته بالكواكب الأخرى</h4>
        ${mine.length ? `<ul class="asp-list">${mine.map(aspLine).join("")}</ul>` : `<p class="sub">مفيش اتصالات مؤثرة لكوكب ${p.n} في خريطتك.</p>`}
        <p class="wd-jump">${sLink(b.sign)}${ch.known && b.house ? hLink(b.house - 1) : ""}</p>`;
    }
    // house
    const i = +v, H = HOUSES[i];
    if (!ch.known) return `<h3>البيت ${H.n}</h3><p class="note">البيوت محتاجة وقت الميلاد عشان نحددها.</p>`;
    const c = ch.cusps[i], rs = SIGNS[Math.floor(c / 30)], rk = rs.ruler, rb = ch.bodies.find(x => x.key === rk);
    const inH = ch.bodies.filter(b => PLANET_KEYS.includes(b.key) && b.house === i + 1).map(b => b.key);
    const rel = asps.filter(a => inH.includes(a.a) || inH.includes(a.b) || a.a === rk || a.b === rk);
    return `<h3>البيت ${H.n}</h3>
      <p class="sub">رأس البيت في ${rs.n} ${num(fmt(c).txt)}</p>
      <p>${H.area}.</p>
      <p><b>حاكم البيت:</b> ${PLANETS[rk].n} في ${SIGNS[rb.sign].n} ${num(fmt(rb.lon).txt)}${rb.house ? "، في بيت " + HOUSES[rb.house - 1].n : ""}</p>
      <h4 class="ph">الكواكب داخل البيت</h4>
      ${inH.length ? `<p>${inH.map(pLink).join(" ")}</p>` : `<p class="sub">مفيش كواكب داخل البيت ده. ده مش معناه إنه بلا دلالة، لأنه بيتأثر بحاكمه عن طريق ${PLANETS[rk].n}.</p>`}
      <h4 class="ph">الاتصالات ذات الصلة</h4>
      ${rel.length ? `<ul class="asp-list">${rel.map(aspLine).join("")}</ul>` : `<p class="sub">مفيش اتصالات مؤثرة مرتبطة بالبيت ده.</p>`}
      <p class="wd-jump">${sLink(Math.floor(c / 30))}${pLink(rk)}</p>`;
  }
  function wireWheel(root, S) {
    const panel = $("#wd-panel", root);
    if (!panel) return;
    const show = (kind, v) => {
      panel.innerHTML = wheelDetail(S.ch, kind, v);
      panel.hidden = false;
      panel.classList.remove("animate-lux-panel");
      void panel.offsetWidth;
      panel.classList.add("animate-lux-panel");
      panel.scrollIntoView({ block: "nearest", behavior: "smooth" });
    };
    const act = el => show(el.dataset.kind, el.dataset.i !== undefined ? el.dataset.i : el.dataset.k);
    root.querySelectorAll("[data-kind]").forEach(el => {
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.addEventListener("click", () => act(el));
      el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(el); } });
    });
    panel.addEventListener("click", e => { const t = e.target.closest("[data-kind]"); if (t) act(t); });
  }

  function renderResult(S) {
    const ch = S.ch, asp = natalAspects(ch), pats = findPatterns(ch);
    const sun = body(ch, "sun"), moon = body(ch, "moon");
    const risingS = ch.known ? Math.floor(ch.asc / 30) : null;
    const titleName = S.name ? `خريطة ${esc(S.name)}` : "خريطتك الفلكية";

    let timeStr = "وقت غير محدد";
    if (S.known) {
      const period = S.hh >= 12 ? "م" : "ص";
      let h12 = S.hh % 12;
      if (h12 === 0) h12 = 12;
      timeStr = `${pad(h12)}:${pad(S.mm)} ${period}`;
    }

    const big = (label, lon, g, delayCls = "delay-100") => `<div class="b3 animate-lux-card ${delayCls} transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#BDA16A]/45 hover:shadow-[0_12px_28px_rgba(189,161,106,0.14)]"><span class="b3g" aria-hidden="true">${gl(g)}</span><span class="b3l">${label}</span><strong>${SIGNS[fmt(lon).s].n}</strong>${num(fmt(lon).txt)}</div>`;
    const returnHomeBtn = `<div class="result-top-bar animate-lux-reveal"><a href="#home" class="btn-return-home transition-all duration-300 hover:-translate-y-0.5" role="button"><span>←</span> العودة للرئيسية</a></div>`;
    const summaryCard = `<div class="chart-summary-card animate-lux-card delay-75 transition-all duration-500 ease-out hover:border-[#BDA16A]/40 hover:shadow-[0_14px_38px_rgba(6,8,14,0.5)]">
      <div class="chart-summary-info">
        <div class="chart-summary-badge">نتائج الخريطة · خريطة ميلاد فلكية</div>
        <h3 class="chart-summary-title">${titleName}</h3>
        <p class="chart-summary-meta">
          <span><span class="meta-glyph">☉</span> ${pad(S.d)}/${pad(S.m)}/${S.y}</span>
          <span class="meta-sep">•</span>
          <span><span class="meta-glyph">☽</span> ${timeStr}</span>
          <span class="meta-sep">•</span>
          <span><span class="meta-glyph">⌖</span> ${esc(S.placeName)}</span>
        </p>
      </div>
      <div class="chart-summary-actions">
        <button type="button" class="btn-edit-chart transition-all duration-300 hover:-translate-y-0.5" id="btn-edit-chart"><svg class="edit-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> تعديل البيانات / خريطة جديدة</button>
      </div>
    </div>`;

    let h = returnHomeBtn + summaryCard +
      `<div class="big3">${big("الشمس", sun.lon, "☉", "delay-100")}${big("القمر", moon.lon, "☽", "delay-150")}${ch.known ? big("الطالع", ch.asc, "↑", "delay-200") : `<div class="b3 dim animate-lux-card delay-200 transition-all duration-300"><span class="b3g" aria-hidden="true">↑</span><span class="b3l">الطالع</span><strong>مش متاح</strong><span class="b3n">محتاج وقت الميلاد</span></div>`}</div>
      <div class="wheel-wrap animate-lux-wheel delay-200 transition-transform duration-700 ease-out">${wheelSVG(ch, asp)}</div>
      <div class="wd-panel animate-lux-panel transition-all duration-500 ease-out" id="wd-panel" aria-live="polite" hidden></div>
      <div class="chart-recharts-cta animate-lux-card delay-300"><button type="button" class="btn-open-distribution-charts transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(189,161,106,0.2)]" id="btn-open-distribution"><span class="chart-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" style="display:inline-block;vertical-align:-3px;"><path d="M4 20h16"/><rect x="6" y="10" width="3" height="7" rx="0.5"/><rect x="11" y="6" width="3" height="11" rx="0.5"/><rect x="16" y="13" width="3" height="4" rx="0.5"/></svg></span> <span>عرض مخططات توزيع الكواكب في الأبراج والبيوت</span> <span class="chart-arrow">←</span></button></div>
      ${ch.known ? "" : `<p class="note animate-lux-card delay-300">من غير وقت الميلاد مش هنقدر نحسب الطالع والبيوت، والقمر ممكن يفرق لحد ٦ درجات.</p>`}
      ${typeof Astronomy === "undefined" ? `<p class="note animate-lux-card delay-300" data-approx="1">تنبيه: مكتبة الحساب الفلكي ما اتحملتش، فموضع العقدة الشمالية تقريبي (ممكن يبقى فيه فرق حوالي ٤–٥ دقايق قوسية). حدّث الصفحة لو الاتصال رجع.</p>` : ""}
      ${ch.hs === "whole-fallback" ? `<p class="note animate-lux-card delay-300">المكان ده بعيد عن خط الاستواء بدرجة بتصعّب نظام Placidus، فاستخدمنا نظام البيوت الكاملة.</p>` : ""}`;

    h += `<div class="tabs animate-lux-card delay-300" role="tablist" aria-label="أقسام الخريطة">
      <button class="tab transition-all duration-300" role="tab" aria-selected="true" aria-controls="tp1" id="tb1">تفاصيل الكواكب</button>
      <button class="tab transition-all duration-300" role="tab" aria-selected="false" aria-controls="tp-charts" id="tb-charts" tabindex="-1">مخططات التوزيع</button>
      <button class="tab transition-all duration-300" role="tab" aria-selected="false" aria-controls="tp5" id="tb5" tabindex="-1">مجالات حياتك</button>
      <button class="tab transition-all duration-300" role="tab" aria-selected="false" aria-controls="tp4" id="tb4" tabindex="-1">الجداول</button>
      <button class="tab transition-all duration-300" role="tab" aria-selected="false" aria-controls="tp3" id="tb3" tabindex="-1">النهاردة ليك</button></div>`;

    /* 1) تفاصيل الكواكب */
    let rd = "";
    if (ch.known) rd += `<article class="rd animate-lux-card transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#BDA16A]/35"><h4><span class="sg" aria-hidden="true">↑</span> الطالع في ${SIGNS[risingS].n} ${num(fmt(ch.asc).txt)}</h4><p>${RISING_TXT[risingS]}</p>
      ${(() => { const rk = SIGNS[risingS].ruler, rb = body(ch, rk); return `<p class="sub">حاكم طالعك هو ${PLANETS[rk].n}، وموجود في برج ${SIGNS[rb.sign].n} وفي البيت ${HOUSES[rb.house - 1].n}. ده بيوجّه طاقتك ناحية ${HOUSES[rb.house - 1].area}.</p>`; })()}</article>`;
    PLANET_KEYS.forEach(k => {
      const b = body(ch, k), f = fmt(b.lon);
      rd += `<article class="rd animate-lux-card transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#BDA16A]/35"><h4><span class="sg" aria-hidden="true">${gl(PLANETS[k].g)}</span> ${PLANETS[k].n} في ${SIGNS[f.s].n} ${num(f.txt)}${b.retro ? ` <span class="rxb">راجع</span>` : ""}</h4>
        <p>${planetInSign(k, f.s)}</p>
        ${ch.known ? `<p class="sub">في البيت ${HOUSES[b.house - 1].n}: ${deepHouse(k, b.house)}</p>` : ""}
        ${b.retro ? `<p class="sub">${retroText(k)}</p>` : ""}</article>`;
    });
    const nd = body(ch, "truenode"), nf = fmt(nd.lon), south = (nf.s + 6) % 12;
    rd += `<article class="rd animate-lux-card transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#BDA16A]/35"><h4><span class="sg" aria-hidden="true">${gl("☊")}</span> العقدة الشمالية في ${SIGNS[nf.s].n} ${num(nf.txt)}</h4>
      <p>اتجاه نموك هو ${SIGNS[nf.s].strength}، ${SIGNS[nf.s].growth}. العقدة الجنوبية في ${SIGNS[south].n}: بتميل ترجع لمنطقة راحة قديمة هي ${SIGNS[south].strength}، فاستخدمها كدعم مش كمكان تقعد فيه.</p>
      ${ch.known ? `<p class="sub">في البيت ${HOUSES[nd.house - 1].n}: اتجاه نموك بيمر عن طريق ${HOUSES[nd.house - 1].area}.</p>` : ""}</article>`;
    h += `<div class="panel animate-lux-panel" role="tabpanel" id="tp1" aria-labelledby="tb1">${rd}</div>`;
    h += `<div class="panel animate-lux-panel" role="tabpanel" id="tp-charts" aria-labelledby="tb-charts" hidden><div id="planet-distribution-container"></div></div>`;
    h += `<div class="panel animate-lux-panel" role="tabpanel" id="tp5" aria-labelledby="tb5" hidden>${areasHTML(ch)}</div>`;

    /* 2) النمط والنصايح */
    const elc = [0, 0, 0, 0], mdc = [0, 0, 0];
    ch.bodies.filter(b => PLANET_KEYS.includes(b.key)).forEach(b => { elc[SIGNS[b.sign].el]++; mdc[SIGNS[b.sign].mod]++; });
    const elMax = Math.max(...elc), mdMax = Math.max(...mdc);
    const bars = (arr, labels, max) => arr.map((v, i) => `<div class="bar"><span>${labels[i]}</span><div class="trk"><i style="width:${(v / max * 100).toFixed(0)}%"></i></div><b>${v}</b></div>`).join("");
    const domEl = elc.map((v, i) => v === elMax ? i : -1).filter(i => i >= 0), domMod = mdc.indexOf(mdMax);
    const lackEl = elc.map((v, i) => v <= 1 ? i : -1).filter(i => i >= 0);
    const sunS = sun.sign, moonS = moon.sign, venS = body(ch, "venus").sign, marS = body(ch, "mars").sign;
    const strengths = [`في جوهرك (الشمس في ${SIGNS[sunS].n}): ${SIGNS[sunS].strength}.`, `في مشاعرك (القمر في ${SIGNS[moonS].n}): ${SIGNS[moonS].strength}.`];
    const watch = [`${SIGNS[sunS].shadow} (من الشمس في ${SIGNS[sunS].n}).`, `${SIGNS[moonS].shadow} (من القمر في ${SIGNS[moonS].n}).`];
    if (ch.known) { strengths.push(`في أول انطباع عنك (الطالع ${SIGNS[risingS].n}): ${SIGNS[risingS].strength}.`); watch.push(`${SIGNS[risingS].shadow} (من الطالع ${SIGNS[risingS].n}).`); }
    const adv = [MOON_ADVICE[moonS], VENUS_EL[SIGNS[venS].el], MARS_EL[SIGNS[marS].el], `اتجاه نموك: ${SIGNS[sunS].growth}.`];
    let pt = `<h4 class="ph">توزيع العناصر</h4><div class="bars">${bars(elc, ELEMENTS.map(e => e.n), Math.max(elMax, 1))}</div>
      <p>${domEl.length === 1 ? EL_DOM[domEl[0]] : domEl.map(i => EL_DOM[i]).slice(0, 2).join(" ")}</p>
      ${lackEl.map(i => `<p class="sub">${EL_LACK[i]}</p>`).join("")}
      <h4 class="ph">توزيع الطابع</h4><div class="bars">${bars(mdc, MODALITIES.map(m => m.n), Math.max(mdMax, 1))}</div><p>${MOD_DOM[domMod]}</p>
      <h4 class="ph">أنماط في خريطتك</h4>
      ${pats.length ? pats.map(p => `<article class="rd animate-lux-card transition-all duration-300 hover:-translate-y-0.5"><h4>${p.t}</h4><p>${p.txt}</p></article>`).join("") : `<p>مفيش أنماط كبيرة (تجمّع أو مثلث أو مربع T) في خريطتك، وده معناه إن طاقتك موزعة بشكل مرن من غير تركيز واحد غالب.</p>`}
      <h4 class="ph">نقاط قوتك</h4><ul class="lst">${strengths.map(t => `<li>${t}</li>`).join("")}</ul>
      <h4 class="ph">محتاجة انتباه</h4><ul class="lst">${watch.map(t => `<li>${t}</li>`).join("")}</ul>
      <h4 class="ph">نصايح ليك</h4><ul class="lst">${adv.map(t => `<li>${t}</li>`).join("")}</ul>`;

    /* 3) الجداول */
    const hsName = ch.hs === "placidus" ? "Placidus" : "Whole Sign";
    let tb = `<h4 class="ph">الكواكب</h4><div class="tbl animate-lux-card">${ch.bodies.map(b => { const f = fmt(b.lon); return `<div class="tr transition-colors duration-200 hover:bg-white/5"><span class="c1"><span class="sg" aria-hidden="true">${gl(PLANETS[b.key].g)}</span> ${PLANETS[b.key].n}</span><span class="c2">${gl(SIGNS[f.s].g)} ${SIGNS[f.s].n} ${num(f.txt)}</span><span class="c3">${ch.known ? "بيت " + b.house : ""}${b.retro ? ' <i class="rxb">راجع</i>' : ""}</span></div>`; }).join("")}</div>`;
    if (ch.known) {
      tb += `<h4 class="ph">البيوت (${hsName})</h4><div class="tbl animate-lux-card delay-100">${ch.cusps.map((c, i) => { const f = fmt(c); return `<div class="tr transition-colors duration-200 hover:bg-white/5"><span class="c1">البيت ${HOUSES[i].n}</span><span class="c2">${gl(SIGNS[f.s].g)} ${SIGNS[f.s].n} ${num(f.txt)}</span><span class="c3"></span></div>`; }).join("")}</div>
        <div class="tbl animate-lux-card delay-150"><div class="tr"><span class="c1">وسط السما (MC)</span><span class="c2">${signLine(ch.mc)}</span><span class="c3"></span></div></div>`;
    }
    tb += `<h4 class="ph">الزوايا بين الكواكب</h4>${asp.length ? asp.slice(0, 16).map(a => { const f = fmt(a.orb); return `<article class="rd asp animate-lux-card transition-all duration-300 hover:-translate-y-0.5 hover:border-[#BDA16A]/35"><h4>${PLANETS[a.a] ? gl(PLANETS[a.a].g) : glyphOf(a.a)} ${nmOf(a.a)} ${a.asp.n} ${PLANETS[a.b] ? gl(PLANETS[a.b].g) : glyphOf(a.b)} ${nmOf(a.b)} <span class="orb">فرق ${num(f.txt)}</span></h4><p>${themeOf(a.a)}، مع ${themeOf(a.b)}: ${a.asp.nat}.</p></article>`; }).join("") : "<p>مفيش زوايا قريبة بشكل واضح.</p>"}`;
    h += `<div class="panel animate-lux-panel" role="tabpanel" id="tp4" aria-labelledby="tb4" hidden>${tb}</div>`;

    /* 4) النهاردة ليك */
    h += `<div class="panel animate-lux-panel" role="tabpanel" id="tp3" aria-labelledby="tb3" hidden>${todayHTML(ch)}<div id="aqeek-personal-transits"></div></div>`;

    /* الأقسام الإضافية المحفوظة في الـ DOM */
    h += `<div class="panel" role="tabpanel" id="tp0" aria-labelledby="tb0" hidden style="display:none!important">${patternHTML(S)}</div>`;
    h += `<div class="panel" role="tabpanel" id="tp6" aria-labelledby="tb6" hidden style="display:none!important"><p class="lead2">اعرف التناغم بينك وبين شخص تاني: حبيب أو صاحب أو شريك شغل. اكتب تاريخ ميلاده وشوف.</p><div class="field"><label for="b-date">تاريخ ميلاد الشخص التاني</label><input id="b-date" type="date" min="1900-01-01" max="2100-12-31"></div><p class="ferr" id="b-err" role="alert" hidden></p><div class="cta-row"><button class="btn" id="b-go" type="button">اعرف التناغم</button></div><div id="b-out" hidden></div></div>`;
    h += `<div class="panel" role="tabpanel" id="tp2" aria-labelledby="tb2" hidden style="display:none!important">${pt}</div>`;

    const root = $("#result");
    root.classList.remove("animate-lux-reveal");
    void root.offsetWidth;
    root.classList.add("animate-lux-reveal");
    root.innerHTML = h;
    bindContact(root); wirePattern(root, S); wireWheel(root, S);
    const ctaBtn = root.querySelector("#btn-open-distribution");
    if (ctaBtn) {
      ctaBtn.addEventListener("click", () => {
        const tbCharts = root.querySelector("#tb-charts");
        if (tbCharts) tbCharts.click();
        const tpCharts = root.querySelector("#tp-charts");
        if (tpCharts) tpCharts.scrollIntoView({ behavior: "smooth" });
      });
    }
    const tabs = $$("[role=tab]", root), panels = $$("[role=tabpanel]", root);
    tabs.forEach(t => t.addEventListener("click", () => {
      const targetId = t.getAttribute("aria-controls");
      tabs.forEach(x => {
        const isTarget = x === t;
        x.setAttribute("aria-selected", isTarget ? "true" : "false");
        x.tabIndex = isTarget ? 0 : -1;
      });
      panels.forEach(p => {
        const isActive = p.id === targetId;
        p.hidden = !isActive;
        if (isActive) {
          p.classList.remove("animate-lux-panel");
          void p.offsetWidth;
          p.classList.add("animate-lux-panel");
        }
      });
      if (targetId === "tp-charts" && typeof window.renderPlanetDistribution === "function") {
        window.renderPlanetDistribution("planet-distribution-container", S);
      }
    }));
    if (typeof window.renderPlanetDistribution === "function") {
      window.renderPlanetDistribution("planet-distribution-container", S);
    }
    window.dispatchEvent(new CustomEvent("aqeeq:chart-rendered", { detail: S }));
  }

  /* ---------- النهاردة ليك (عبور شخصي) ---------- */
  function todayHTML(ch) {
    const now = Astro.chart({ utcMs: Date.now(), lat: 30, lon: 31, known: false });
    const nb = k => now.bodies.find(b => b.key === k);
    const dateTxt = new Date().toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const mn = nb("moon"), mf = fmt(mn.lon);
    let o = `<div class="today-cosmic-overview"><span class="today-date-badge">${dateTxt}</span>`;
    o += `<article class="rd today-moon-focus"><h4><span class="sg" aria-hidden="true">${gl("☽")}</span> طقس القمر اليوم: ${SIGNS[mf.s].n}</h4><p>${MOON_TODAY[SIGNS[mf.s].el]}</p>`;
    if (ch.known) { const h = Astro.houseOf(mn.lon, ch.cusps); o += `<p class="sub">عبور القمر ينشط البيت ${HOUSES[h - 1].n} عندك، فمشاعرك واهتمامك اليوم تتجه نحو ${HOUSES[h - 1].area}.</p>`; }
    o += `</article></div>`;
    const retros = now.bodies.filter(b => b.retro);
    if (retros.length) {
      o += `<div class="today-retro-wrap"><h4 class="ph">حركة التراجع في السماء الآن</h4>` + retros.map(b => `<p class="sub">${retroText(b.key)}</p>`).join("") + `</div>`;
    }
    return o;
  }

  /* ---------- السما دلوقتي ---------- */
  const signAt = (key, ms) => Math.floor(Astro.lonOf(key, Astro.jdFromMs(ms) + Astro.deltaT(Astro.yearOf(Astro.jdFromMs(ms))) / 86400) / 30);
  const HORIZON = { moon: 4, sun: 35, mercury: 130, venus: 150, mars: 330, jupiter: 480, saturn: 1100, uranus: 3000, neptune: 6000, pluto: 9500 };
  const _ingMemo = {};
  function nextIngress(key, ms) {
    const dk = key + ':' + Math.floor(ms / 864e5);
    if (dk in _ingMemo) return _ingMemo[dk];
    return (_ingMemo[dk] = _nextIngressRaw(key, ms));
  }
  function _nextIngressRaw(key, ms) {
    const step = key === "moon" ? 0.125 : 1, s0 = signAt(key, ms);
    let t = ms;
    for (let i = 0; i * step <= HORIZON[key]; i++) {
      const t2 = t + step * 864e5;
      if (signAt(key, t2) !== s0) {
        let a = t, b = t2;
        for (let k = 0; k < 24; k++) { const m = (a + b) / 2; if (signAt(key, m) === s0) a = m; else b = m; }
        return { ms: b, sign: signAt(key, b) };
      }
      t = t2;
    }
    return null;
  }
  const _prvMemo = {};
  function prevIngress(key, ms) {
    const dk = key + ":" + Math.floor(ms / 864e5);
    if (dk in _prvMemo) return _prvMemo[dk];
    const step = key === "moon" ? 0.125 : ({ uranus: 5, neptune: 5, pluto: 5, saturn: 2, jupiter: 2 }[key] || 1), s0 = signAt(key, ms);
    let t = ms, res = null;
    for (let i = 0; i * step <= HORIZON[key]; i++) {
      const t2 = t - step * 864e5;
      if (signAt(key, t2) !== s0) {
        let a = t2, b = t;
        for (let k = 0; k < 24; k++) { const m = (a + b) / 2; if (signAt(key, m) === s0) b = m; else a = m; }
        res = b; break;
      }
      t = t2;
    }
    return (_prvMemo[dk] = res);
  }
  const skyDateInput = $("#sky-date");
  let skyKey = "mars", skySign = null;
  try { const v = localStorage.getItem("aq-sky-sign"); if (v !== null && +v >= 0 && +v < 12) skySign = +v; } catch (e) { }
  const HQ = [
    ["هل أساء أحدهم فهمك مؤخرًا، فصرت تشرح نفسك أكثر مما ينبغي؟", "هل تشعر أن الصورة التي يراها الناس عنك ليست التي تعيشها؟"],
    ["هل تقيس قيمتك بما تنجزه أو تملكه، ثم تتعجب من شعورك بالفراغ؟", "هل أنفقت مؤخرًا لتُسكت شعورًا ما، لا لحاجتك إلى الشيء؟"],
    ["هل كتبت رسالة طويلة ثم حذفتها لأن الصمت بدا أسلم؟", "هل تدور في رأسك محادثة لم تحدث أبدًا، وتعدّل ردّك فيها كل ليلة؟"],
    ["هل تشتاق إلى مكان أو زمن بعينه، ولا تعرف هل تشتاق إليه أم إلى نفسك فيه؟", "هل تلاحظ أنك تتصرف في بيتك كما كنت تتصرف وأنت صغير؟"],
    ["هل تؤجل شيئًا تحبه لأنه «غير مفيد»، ثم تلاحظ أن حماسك خفت؟", "هل تقدّم الحب بطريقة تنتظر الاعتراف أكثر مما تنتظر العودة؟"],
    ["هل يرهقك جسدك الآن بما يتجاهله عقلك؟", "هل تنشغل بالمهام لأنها تمنحك عذرًا لتتجنب سؤالًا أكبر؟"],
    ["هل اشتقت إلى شخص ولا تعرف السبب؟", "هل عاد إلى حياتك في هذه الفترة أشخاص كنت قد أخرجتهم منها منذ زمن؟"],
    ["هل تشعر أن شيئًا ينتهي بداخلك دون أن يلاحظ أحد؟", "هل تحتفظ بسرٍّ ثقيل أو بشعور لم تقله لأحد؟"],
    ["هل تشعر أن حياتك الحالية ضيقة عليك، وأن هناك طريقًا آخر تؤجله؟", "هل تفقد إيمانك بفكرة تمسكت بها قبل سنوات؟"],
    ["هل تنجح في نظر الناس، وتشعر في الوقت نفسه أنك لست حيث تريد؟", "هل تحمل عبء أن تكون «القوي» في محيطك، ولا يسألك أحد كيف حالك؟"],
    ["هل ابتعد عنك صديق، وتظاهرت بأن الأمر لا يعنيك؟", "هل تشعر بالغربة بين أشخاص يعرفونك جيدًا؟"],
    ["هل تحتاج إلى عزلة لا تستطيع شرحها، وربما لُمت عليها؟", "هل تستيقظ بقلق لا سبب ظاهرًا له، وكأن شيئًا قديمًا يطرق الباب؟"]
  ];
  const HEX = [
    ["تغيّر شكلك أو طريقة ظهورك فجأة دون سبب واضح.", "تُفاجأ بأن الناس يعاملونك بشكل مختلف عمّا تشعر به.", "تبدأ جملك كثيرًا بـ«لا أقصد كذا، لكن…»."],
    ["تشتري شيئًا لا تحتاجه بعد يوم مرهق.", "تقارن دخلك بدخل أصدقائك دون أن تقصد.", "يعود إليك ملف مالي مؤجل فتضطر إلى مواجهته."],
    ["رسالة قديمة تعود إلى هاتفك فتوقظ مشاعر نائمة.", "تفكر في شيء تقوله لأحدهم ثم تؤجله أيامًا.", "تنتقل بين مهام كثيرة ولا تنهي شيئًا."],
    ["ترتّب غرفتك أو تغيّر مكان الأثاث دون سبب.", "مكالمة مع أحد أفراد العائلة تعيدك إلى دورك القديم.", "تشتاق إلى طعام أو رائحة من طفولتك."],
    ["تنجذب فجأة إلى شخص أو هواية.", "تشعر برغبة في اللعب وسط يوم جاد.", "ترسل رسالة ثم تندم، أو لا ترسلها وتندم أكثر."],
    ["أرق خفيف أو صداع يظهر مع كثرة المهام.", "تعيد ترتيب جدولك ثلاث مرات في أسبوع.", "يلاحظ زميل تعبك قبل أن تعترف به."],
    ["شخص يعود إلى حياتك بعد غياب طويل.", "خلاف صغير يكشف احتياجًا أكبر.", "تجد نفسك تعطي أكثر مما تأخذ في علاقة قريبة."],
    ["حلم يتكرر أو ذكرى تعود بتفاصيل غريبة.", "التزام مالي مشترك أو قديم يعود إلى الواجهة.", "نهاية هادئة لشيء لم يُعلن عنه أحد."],
    ["تبحث فجأة عن دورة أو سفرة أو فكرة جديدة.", "محادثة عميقة مع غريب تغيّر رأيك.", "تشعر بأنك أكبر من مكانك الحالي."],
    ["عرض أو مسؤولية جديدة في العمل.", "شعور بأنك تُقاس بما تنجزه فقط.", "لحظة تسأل فيها: هل هذا الطريق لي فعلًا؟"],
    ["صديق قديم يتصل بعد انقطاع.", "مجموعة جديدة تجذبك وأخرى تفقد معناها.", "حلم كبير تعود إلى تذكّره بعد أن نسيته."],
    ["رغبة في الانسحاب من الضوضاء.", "أحلام غريبة أو حدس قوي لا تجد له تفسيرًا.", "ذكرى أو شخص كنت قد تجاوزته يعود إلى خاطرك."]
  ];
  const PF = {
    sun: ["يضيء الموضع الذي تريد أن تُرى فيه، ويسألك: من أنت خارج الأدوار؟", "طاقة مشرقة تحتاج إلى مكان تظهر فيه دون أن تُرهقك."],
    moon: ["يحرّك حاجتك إلى الأمان، ويكشف ما تشعر به قبل أن تفسّره.", "طاقة متقلبة ناعمة، تتأثر بما حولك أكثر مما تظن."],
    mercury: ["يوقظ حوارك الداخلي، فتعيد ترتيب الأفكار والكلمات مرارًا.", "طاقة سريعة متنقلة، تحتاج إلى تفريغ بالكتابة أو الحديث."],
    venus: ["يلمس ما تحبه وما تظن أنك تستحقه، ويكشف كم تعطي وكم تطلب.", "طاقة جذب ودفء، تتأثر بالتقدير أكثر من أي شيء."],
    mars: ["يشعل دافع الفعل، وحين يُكبت يتحول إلى توتر أو غضب مؤجل.", "طاقة حارّة تحتاج إلى حركة جسدية أو قرار واضح."],
    jupiter: ["يوسّع الأفق ويعيد إليك الأمل، لكنه يغريك بالمبالغة.", "طاقة سخية متفائلة، تنمو حين تجد معنى لما تفعله."],
    saturn: ["يطرح سؤال الجدية والحدود: ما الذي عليك تحمله وما الذي تحمله بلا داعٍ؟", "طاقة ثقيلة هادئة، تبني ببطء وتُرهق حين تُحمّل فوق طاقتها."],
    uranus: ["يهزّ العادة القديمة ليولد منها شيء أصدق، فتشعر بقلق التغيير.", "طاقة كهربائية مفاجئة، تحتاج إلى مساحة حرية."],
    neptune: ["يذيب الحدود، فيمنحك حدسًا وإلهامًا، وقد يُضبّب الرؤية.", "طاقة شفافة حالمة، تلتقط ما حولها دون أن تقصد."],
    pluto: ["ينزل إلى العمق ليخرج ما دُفن، فيبدأ تحوّل بطيء لا يُرى من الخارج.", "طاقة عميقة مكثفة، تعمل في الخفاء قبل أن تظهر نتائجها."]
  };
  const PQ = { sun: "هل تعيش حياتك أم تؤدي دورًا كُتب لك؟", moon: "هل تقول «لا بأس» وأنت لست بخير؟", mercury: "هل تعرف ما تريد قوله، وتخاف من وقعه؟", venus: "هل تعطي بسخاء، وتشعر أنك لا تُرى؟", mars: "هل تؤجل غضبًا ما إلى أن يخرج في غير موضعه؟", jupiter: "هل تتفاءل لتتجنب أن تحزن؟", saturn: "هل تُحاسب نفسك أشد مما يحاسبك أحد؟", uranus: "هل تتظاهر بالرضا عن شيء بدأ يخنقك؟", neptune: "هل تفضّل الصورة الجميلة على الحقيقة الواضحة؟", pluto: "هل تعرف شيئًا عن نفسك لم تجرؤ على قوله بصوت عالٍ؟" };
  const PQH = {"sun": ["هل تشعر أن الصورة التي يراها الناس عنك تختلف عن حقيقتك، فتؤدي دورًا مألوفًا حتى حين لا يشبهك، ثم تعود إلى البيت وقد أنهكك هذا التمثيل؟", "هل تربط قيمتك بما تكسبه أو تملكه، فإذا نقص رصيدك شعرت أن شيئًا فيك نقص معه، حتى لو لم تقل ذلك لأحد؟", "هل لديك ما تريد قوله بصوت واضح منذ مدة، لكنك تعيد صياغته في رأسك مرات كثيرة خوفًا من أن يُفهم على غير ما قصدت؟", "هل تحمل في بيتك أو عائلتك دورًا لم تخترْه، كأن تكون من يتفهم ويصلح ويتحمل، وتتمنى لو سُمح لك مرة أن تضعف؟", "هل تؤجل ما يمنحك متعة حقيقية أو ما تحب أن تصنعه، لأنك تراه ترفًا لا يليق بجدية حياتك، ثم تتساءل لماذا خفّ حماسك؟", "هل تنجز مهامك اليومية بإتقان، بينما تهمل إشارات صغيرة تدل على أنك تعيش بإيقاع لا يشبهك، حتى تفرض عليك الأيام أن تتوقف؟", "هل تتكيف مع من حولك حتى تكاد تنسى ما تريده أنت، ثم تشعر بضيق لا تعرف من أين جاء، ولا تجرؤ على تسميته؟", "هل تخفي عن أقرب الناس جزءًا من مشاعرك أو ظروفك، ظنًا أن إظهار ضعفك سيغيّر نظرتهم إليك أو يمنحهم سلطة عليك؟", "هل تشعر أن قناعة قديمة تمسكت بها صارت ضيقة عليك، وأنك تعرف ما تريد أن تؤمن به الآن لكنك لم تعلنه بعد؟", "هل تنجح في نظر الناس وتجد في داخلك سؤالًا صامتًا: هل هذا الطريق لي أم لما توقعه الآخرون مني؟", "هل تشعر بالغربة بين جماعة تعرفك جيدًا، أو بالحنين إلى حلم كبير تخليت عنه بصمت حتى لا يراك أحد تطمع به؟", "هل تحتاج إلى عزلة لا تستطيع شرحها، تجلس فيها وحدك دون سبب ظاهر، وتشعر بعدها أنك استعدت نفسك؟"], "moon": ["هل يلاحظ الناس مزاجك قبل أن تلاحظه أنت، فتفاجأ بسؤالهم عن حالك وأنت تظن أنك تخفي كل شيء؟", "هل تشتري شيئًا أو تتفقد رصيدك أكثر من مرة حين يضيق صدرك، كأن الأمان الذي تبحث عنه يُحسب بالأرقام؟", "هل تدور في رأسك محادثة لم تحدث، تعدّل ردودك فيها كل ليلة، وتتمنى لو قلت ما في قلبك ببساطة لا بمنطق؟", "هل تشتاق إلى مكان أو رائحة أو صوت من طفولتك، ولا تعرف إن كنت تشتاق إليه أم إلى نفسك حين كنت أصغر؟", "هل تحتاج أن يُقال لك بصوت مسموع إن أحدًا يحبك، لا بالأفعال وحدها، ثم تخجل من هذه الحاجة فلا تطلبها؟", "هل تتحول مشاعرك المكبوتة إلى توتر في تفاصيل يومك، فتنفعل من أمر صغير قبل أن تعترف بها بالكلمات؟", "هل تقرأ مزاج الشخص المقابل قبل أن يتكلم، فتعدّل نفسك حسبه، ثم تكتشف أنك لم تسأل نفسك ما الذي تحتاجه أنت؟", "هل تشعر أحيانًا بموجة حزن أو خوف لا تفسرها، وكأنها تخص ماضيًا لم تحكِه لأحد، أو شخصًا لم تودّعه كما ينبغي؟", "هل تشعر أن راحتك الحقيقية تأتي حين تبتعد عن المألوف، لكن شيئًا فيك يخاف أن يترك ما اعتاد عليه؟", "هل تحمل في عملك عبء أن تكون من يتحمل عن الجميع، وتنتظر أن يسألك أحد بصدق كيف حالك فلا يسأل؟", "هل ابتعد عنك صديق أو دائرة كنت تحتمي بها، وتظاهرت بأنك لا تهتم، بينما شعرت في داخلك بفراغ لم تعترف به؟", "هل تستيقظ بقلق لا سبب ظاهرًا له، وكأن شيئًا قديمًا يطرق بابك، وتفضّل أن تهدأ حتى يمر؟"], "mercury": ["هل تتحدث عن نفسك أمام الناس بطريقة مدروسة، ثم تعود فتلوم نفسك على كلمة قلتها أو لم تقلها؟", "هل تحسب في رأسك كل ما تنفقه وتكسبه باستمرار، حتى حين تكون الأمور مستقرة، كأن عقلك لا يعرف الاطمئنان إلا بالمراجعة؟", "هل تكتب رسالة طويلة ثم تحذفها، أو ترسلها ثم تتمنى لو استرجعتها، لأن كل كلمة تبدو لك أثقل مما ينبغي؟", "هل يعود إلى ذهنك حديث قديم دار في بيتك أو بين أهلك، وتفكر فيما كنت ستقوله لو أُتيحت لك فرصة أخرى؟", "هل تخفي مشاعرك خلف المزاح أو الكلام الخفيف، حتى يفهم الناس عكس ما تحس به، ثم تتركهم يفهمون؟", "هل يمتلئ ذهنك بقوائم مهام لا تنتهي، وتنتقل بين أشياء كثيرة دون أن تنهي شيئًا، ثم تشعر بتشتت يرهقك؟", "هل تعيد تحليل ما قاله لك شخص مقرّب، كلمة كلمة، بحثًا عن معنى خفي، وتخشى أن تسأله مباشرة؟", "هل تفكر في أمر لا تقوله لأحد، وتتخيل ردود الفعل المحتملة لو قلته، حتى صار الصمت أكثر أمانًا من الصراحة؟", "هل تقرأ أو تتعلم شيئًا جديدًا يغيّر نظرتك، ثم تتردد في مشاركته مع من حولك لأنهم قد لا يفهمونك؟", "هل تعيد مراجعة ما قلته في اجتماع أو أمام مسؤول، وتتساءل إن كنت قد أظهرت نفسك كما ينبغي، أو أخفيت ما يلزم؟", "هل تتكلم بحماس مع أصدقاء عن أفكار كبيرة، ثم تعود وحدك فتشك إن كانت واقعية أم مجرد حلم؟", "هل تتحدث مع نفسك في رأسك أكثر مما تتحدث مع أحد، وتتمنى أحيانًا أن يسمعك أحد دون أن تضطر إلى الشرح؟"], "venus": ["هل تعتني بمظهرك أو أسلوبك لترضي نظرة الآخرين، ثم تتساءل إن كان أحد سيحبك لو ظهرت دون هذه الطبقة؟", "هل تنفق على ما يشعرك بأنك تستحق الاهتمام، ثم تحس بعدها بنوع من الذنب أو الفراغ لا تفهمه؟", "هل تبدو لطيفًا في كلامك، بينما تحتفظ بجملة صادقة تؤجلها كي لا تجرح أحدًا ولا تفقد مودته؟", "هل تبحث عن الدفء الذي كنت تتمناه في بيتك قديمًا، فتمنحه للآخرين بسخاء وتنتظر أن يعود إليك بالقدر نفسه؟", "هل تنجذب إلى شخص أو هواية فجأة، ثم تخشى أن يخيب هذا الانجذاب كما خاب غيره قبله، فتتراجع قبل أن تبدأ؟", "هل تحاول أن تجعل محيط عملك لطيفًا ومريحًا للجميع، وتتحمل أكثر مما ينبغي كي يبقى الجو هادئًا؟", "هل تعطي في علاقتك أكثر مما تعترف به، وتنتظر أن يلاحظ الآخر ذلك دون أن تضطر إلى أن تطلب؟", "هل تتعلق بمن يمنحك إحساسًا عميقًا بالقرب، حتى لو كان القرب نفسه يخيفك ويشعرك بأنك قد تفقد جزءًا من نفسك؟", "هل تحلم بحب أو حياة في مكان آخر، وتشعر أن ما تملكه الآن جيد لكنه لا يكفي لإسكات هذا الحنين؟", "هل تسعى إلى أن يحبك الجميع في عملك، فتتجنب الخلاف حتى لو كان الصدق أنفع لك ولمن حولك؟", "هل تشعر أنك تحب أصدقاءك أكثر مما يحبونك، أو أنك تحتاج إلى تأكيد مودتهم دون أن تجرؤ على السؤال؟", "هل تحتفظ بمشاعر لشخص لم تعترف بها، حتى لنفسك، وتكتفي بأن تحبه في صمت وتخفي ذلك كأنه سر؟"], "mars": ["هل تشعر برغبة في أن تبدأ شيئًا جديدًا أو تغيّر حياتك، ثم تكتمها لأنك تخشى أن يُنظر إلى اندفاعك على أنه تهور؟", "هل تدفع نفسك للكسب أكثر مما تحتاج، وكأنك تثبت لأحد ما قدرتك، دون أن تتوقف لتسأل لمن هذا الإثبات؟", "هل تحتفظ بجملة حادة لم تقلها، ثم تخرج في غير وقتها على شخص لا يستحقها، فتندم على نبرتك أكثر من الكلمة؟", "هل تنفجر داخل بيتك لأسباب صغيرة، وتدرك أن الغضب ليس من الموقف بل من شيء أقدم لم يُحسم؟", "هل تتحمس لشيء ثم يخبو حماسك سريعًا حين يصعب، وتخشى أن تكون ممن يبدؤون ولا يكملون؟", "هل تحمّل نفسك مهام تفوق طاقتك لتثبت جديتك، ثم يظهر الضغط في صورة عصبية وضيق من كل شيء؟", "هل تتجنب مواجهة شخص قريب حتى يتراكم الأمر، فإذا انفجرت بدا ردّك أكبر من الموقف الذي أشعله؟", "هل تكبت غضبًا قديمًا تجاه شخص أو موقف لم تحاسبه عليه، وتشعر أنه يتحول بمرور الوقت إلى برود أو انسحاب؟", "هل تتحمس لفكرة أو رحلة أو معتقد جديد بقوة، ثم تتساءل إن كنت تهرب من شيء أم تتجه إلى شيء؟", "هل تضغط على نفسك لتنجز وتتقدم، ثم تلاحظ أن المنافسة صارت تستهلك فرحك بما حققته أصلًا؟", "هل تدافع عن حلم أو صديق بحماس شديد، وتغضب حين لا يُقدَّر، حتى لو لم يطلب منك أحد هذا الدفاع؟", "هل تحمل غضبًا لا تعرف موضعه، يظهر في صمتك أو في أفكارك قبل النوم، وكأن شيئًا لم يُقل يطالب بأن يُسمع؟"], "jupiter": ["هل تشعر أن فرصة لتغيير صورتك أو دورك تلوح أمامك، لكنك تتردد لأنك لا تريد أن تفقد ما اعتاد الناس رؤيته فيك؟", "هل تتوقع أن الأمور المالية ستتحسن، ثم تتردد في اتخاذ خطوة عملية، كأن التفاؤل وحده سيكفي؟", "هل تفكر في دراسة أو مشروع كتابة أو حوار مهم يوسّع آفاقك، وتؤجله لأن اللحظة لم تكتمل في رأيك بعد؟", "هل تحلم ببيت أو استقرار أكبر مما لديك، وتشعر بأن الدفء الحقيقي قد يبدأ حين تسامح شيئًا قديمًا في عائلتك؟", "هل تتمنى أن يعود إليك شغف قديم أو حب كنت تؤمن به، وتخشى في الوقت نفسه أن تصدق مرة أخرى فتُخذل؟", "هل تحس أن حياتك اليومية تحتاج إلى توسعة، عادة جديدة أو عملًا أكثر معنى، لكنك تتمسك بروتين آمن وإن كان خانقًا؟", "هل يظهر في حياتك شخص أو شراكة تعدك بالتوسع، وتتساءل إن كان الأمر نموًا حقيقيًا أم حماسًا عابرًا؟", "هل تشعر أن شيئًا ما يوشك أن يتحرر داخلك، مشاعر أو دَين أو ذكرى، وأنك تقترب من أن تسامح بصدق؟", "هل تشعر أن أفقك يتسع، بفكرة أو سفرة أو معلّم جديد، وأن عليك أن تقول نعم لما كنت تقول له دائمًا لاحقًا؟", "هل تلوح لك فرصة مهنية أكبر من مستواك الحالي، فتتردد لأنك لا تصدق أنك تستحقها حقًا؟", "هل تشعر أن أصدقاءك أو مجموعة ما يفتحون لك أبوابًا، وتتساءل إن كنت تستعد لتحمّل ما يترتب على اتساع دائرتك؟", "هل تحس أن رعاية خفية أو راحة غير متوقعة تأتيك في لحظة تعب، وتتساءل إن كنت تسمح لنفسك بأن تتلقاها؟"], "saturn": ["هل تحمل صورة من يتحمل كل شيء بقوة أمام الناس، وتشعر أن أي ضعف يظهر منك سيُعدّ فشلًا لا يُغتفر؟", "هل تخاف من فقدان الأمان المادي حتى حين تكون أحوالك مستقرة، فتحرم نفسك مما تحبه خوفًا من يوم قد لا يأتي؟", "هل تتكلم بحذر شديد وتزن كل كلمة، لأنك تعلمت قديمًا أن ما تقوله قد يُستخدم ضدك أو يُقابَل بالسخرية؟", "هل حملت في بيتك مسؤولية أكبر من سنك، وما زلت تشعر أن عليك أن تكون سندًا للجميع دون أن يسندك أحد؟", "هل تمنع نفسك من الاستمتاع حتى تنجز كل شيء أولًا، ثم تكتشف أن القائمة لا تنتهي وأن المتعة تأجلت إلى الأبد؟", "هل تحاسب نفسك على كل تقصير صغير في عملك أو روتينك، وتعتقد أنك لن تكون مقبولًا إلا إذا كنت بلا خطأ؟", "هل تدخل العلاقات وأنت تتوقع أن تُخذل، فتُبقي جزءًا منك محميًا، ثم تتساءل لماذا لا تصل إلى القرب الذي تريده؟", "هل تخاف أن تثق بأحد في أمر يخصك بعمق، لأنك تعلمت أن الثقة قد تتحول إلى دَين تدفع ثمنه؟", "هل تشكك فيما آمنت به يومًا، وتشعر أن عليك بناء قناعاتك من جديد على أرض أصدق ولو كانت أصعب؟", "هل تعمل بجد لتثبت جدارتك، وتخشى أن يُرى أي توقف منك على أنه علامة ضعف أو تراجع في مكانتك؟", "هل تقترب من دائرة أصدقاء أو مجموعة بحذر، وتخشى أن تُرفض، فتبقى على الهامش وأنت تتمنى الانتماء؟", "هل تحمّل نفسك أعباء لا يعرفها أحد، وتخفي تعبك حتى لا تبدو ضعيفًا، فتتراكم في الداخل دون من يشاركك؟"], "uranus": ["هل تشعر برغبة مفاجئة في أن تبدو بشكل مختلف أو تتصرف بما لا يشبه ما عرفه الناس عنك، ثم تتراجع خوفًا من ردود الفعل؟", "هل يخطر لك أن تغيّر مصدر دخلك أو طريقتك في الكسب، فتبدو الفكرة مرعبة ومحررة في آن؟", "هل تخطر لك أفكار أو آراء جديدة لا تشبه ما اعتدت قوله، وتتردد في طرحها حتى لا يُستغرب كلامك؟", "هل تشعر أن بيتك أو عائلتك يقيّدك بشكل لا تستطيع شرحه، وأنك تريد مساحة تكون فيها على طبيعتك؟", "هل تنجذب إلى شخص أو تجربة غير مألوفة تمامًا، وتخشى أن تخرج بها عن المسار الذي رسمته لنفسك؟", "هل تشعر أن روتينك يخنقك، وأن عليك أن تكسر نمطًا في عملك أو عاداتك، لكنك لا تعرف من أين تبدأ؟", "هل تشعر في علاقة ما أنك تحتاج إلى مساحة أكبر، وتخشى أن يُفهم ذلك على أنه ابتعاد أو قلة حب؟", "هل تمر بتحول داخلي مفاجئ تفقد فيه اهتمامك بأمور كانت تشغلك، دون أن تعرف إن كان ذلك نضجًا أم هروبًا؟", "هل تتبدل قناعاتك بسرعة في هذه الفترة، وتتساءل إن كنت تكتشف نفسك أم تفقد أرضًا كنت تقف عليها؟", "هل تفكر في تغيير مسارك المهني تغييرًا جذريًا، ويجتمع في داخلك الحماس والخوف من أن تخسر ما بنيته؟", "هل تبتعد عن جماعة اعتدت عليها لأنك لم تعد تشبههم، وتشعر بالذنب لأنك تفعل ما يريحك؟", "هل تلتقط أفكارًا أو أحلامًا غريبة لا تعرف مصدرها، وتشعر أن شيئًا بداخلك يتغير في الظل قبل أن يظهر؟"], "neptune": ["هل يراك الناس بصورة مثالية أو غامضة، فتتركهم على ظنهم لأن تصحيحه يتطلب مجهودًا أو يكشف ما لا تريد كشفه؟", "هل تنفق أو تعطي دون حساب لأن قلبك رقّ، ثم تتساءل أين ذهب المال، وهل كنت تساعد أم تهرب من شعور؟", "هل تسمع ما لم يُقل في كلام الآخرين، وتصدّق حدسك ثم تشك فيه لأن الدليل غير واضح؟", "هل ترى بيتك أو أهلك أجمل أو أصعب مما هم عليه فعلًا، وتجد صعوبة في أن ترى الصورة كما هي؟", "هل تقع في حب فكرة الشخص أكثر من الشخص نفسه، ثم تتألم حين يظهر الفرق بين ما تخيلته وما هو كائن؟", "هل تشعر بثقل لا تعرف سببه، أو بتشتت في عملك، وكأن طاقتك تتسرب إلى مكان لا تعرفه؟", "هل ترى في شريكك أو صديقك ما تتمنى أن يكون عليه، وتغفر ما لا ينبغي أن يُغفر لأنك تحب الصورة التي في رأسك؟", "هل تحس بما يخفيه الآخرون عنك، وتتساءل إن كان ذلك حدسًا حقيقيًا أم قلقًا يرسم لك سيناريوهات؟", "هل تبحث عن معنى أكبر في الحياة، وتنجذب إلى كل ما يمنحك إحساسًا بالسمو، ثم تخشى أن يكون مجرد هروب جميل؟", "هل لا تعرف تمامًا ماذا تريد من مسارك المهني، وتشعر أن الصورة التي رسمتها لنفسك لم تعد واضحة؟", "هل تحلم بمجتمع أو صداقة مثالية، ثم تُصدم حين يخذلك الواقع، فتنسحب بدل أن تعدّل توقعك؟", "هل تحتاج إلى أن تذوب في موسيقى أو نوم أو خيال لتهرب من ثقل يوم طويل، وتتساءل أين الحد بين الراحة والهروب؟"], "pluto": ["هل تشعر أنك لم تعد الشخص نفسه الذي كنته قبل سنوات، وأن هويتك القديمة لم تعد تتسع لك، لكنك لم تعرف الجديدة بعد؟", "هل تعيد التفكير في علاقتك بالمال والقيمة، وتكتشف أن خوفًا قديمًا من الفقد كان يحكم قراراتك دون أن تدري؟", "هل تدرك أن كلماتك تحمل قوة أكبر مما تتصور، وأن صمتك الطويل كان وسيلة لحماية نفسك من شيء قديم؟", "هل تواجه شيئًا قديمًا في عائلتك أو جذورك لم يُحسم، وتشعر أن شفاءه يبدأ حين تتوقف عن تحمّله بمفردك؟", "هل يوقظ فيك الحب أو الإبداع شيئًا عميقًا، يخيفك بقدر ما يجذبك، فتقترب منه ثم تتراجع؟", "هل تدرك أن عادة أو نمط عمل قديمًا يستنزفك، وأن التحرر منه يتطلب أن تتخلى عن صورة قديمة لنفسك؟", "هل تتكرر معك أنماط في العلاقات، وتشعر أن الوقت قد حان لتفهم دورك فيها بدل أن تلوم الطرف الآخر؟", "هل تمر بمرحلة تفقد فيها شيئًا أو تتخلى عنه، وتشعر أن ما يجري عميق يتجاوز الحدث الظاهر؟", "هل تعيد بناء قناعاتك من الأساس، وتدرك أن ما تعلمته يومًا لم يعد يجيب عن أسئلتك الحالية؟", "هل تشعر برغبة في السيطرة على مسارك المهني، وتخشى في الوقت نفسه أن تفقد ما بنيته إن غيرت اتجاهك؟", "هل تدرك أن بعض علاقاتك الجماعية استنفدت دورها، وأن ترك من لا يشبهك يفتح لك مكانًا لمن يشبهك؟", "هل تواجه في عزلتك جانبًا من نفسك أخفيته طويلًا، وتشعر أن مواجهته تقودك إلى قوة لم تعرفها؟"]};
  function skyCard(k, bd, i) {
    const P = PLANETS[k], sg = SIGNS[i], hh = ((bd.sign - i + 12) % 12) + 1, H = HOUSES[hh - 1], pf = PF[k], q = HQ[hh - 1], ex = HEX[hh - 1];
    return `<article class="sky-card"><header class="sky-card-h"><span class="sky-card-ic" aria-hidden="true"><span class="sg">${gl(P.g)}</span></span><div><h4>${P.n} في بيتك ${H.n}</h4><small>${sg.n} · مجال ${H.area}</small></div></header>
      <div class="swp-hook"><p>${(window.AqReadings && window.AqReadings.TR[k][hh - 1]) ? PQH[k][hh - 1] : PQ[k]}</p></div>
      <div class="swp-anat"><div class="swp-row swp-main"><b>قراءة اليوم</b>${window.AqReadings ? (window.AqReadingBlock ? window.AqReadingBlock.block(k, hh, (window.AqReadings.TR[k][hh - 1] || window.AqReadings.PH[k][hh - 1]), skyMs()) : `<p>${window.AqReadings.TR[k][hh - 1] || window.AqReadings.PH[k][hh - 1]}</p>`) : ""}${bd.retro && window.AqReadings && window.AqReadings.RT[k] ? `<p class="swp-rt">${window.AqReadings.RT[k]}</p>` : ""}</div></div>
      <p class="swp-tease">هذا ما يظهر على السطح فقط. أما السبب، وما يمكنك فعله به، فيخص برجك وحده.</p></article>`;
  }
  window.AqSky = { skyCard, PLANETS, SIGNS, HOUSES, gl, HQ, HEX, PF, PQ, PQH, getSign: () => skySign, setSign: v => { skySign = (v === null || v === undefined) ? null : +v; try { if (skySign === null) localStorage.removeItem("aq-sky-sign"); else localStorage.setItem("aq-sky-sign", skySign); } catch (e) { } } };
  const skyMs = () => { const v = skyDateInput.value; if (!v) return Date.now(); const [y, m, d] = v.split("-").map(Number); return Date.UTC(y, m - 1, d, 12, 0); };

  /* ---------- كارت منازل القمر: اسم الطور + شكل القمر الحقيقي ---------- */
  const MOON_NAMES = ["محاق", "هلال متزايد", "تربيع أول", "أحدب متزايد", "بدر", "أحدب متناقص", "تربيع أخير", "هلال متناقص"];
  const SYNODIC = 29.530588;
  function moonSVG(el) {
    const R = 52, wax = el <= 180, e = wax ? el : 360 - el, c = Math.cos(e * Math.PI / 180), rx = Math.abs(c) * R;
    const lit = e < 1 ? "" : (e > 179 ? `<circle r="${R}" fill="url(#mnLit)"/>` : `<path d="M0 ${-R}A${R} ${R} 0 0 1 0 ${R}A${rx.toFixed(2)} ${R} 0 0 ${c > 0 ? 0 : 1} 0 ${-R}Z" fill="url(#mnLit)"/>`);
    return `<svg class="mn-svg" viewBox="-64 -64 128 128" role="img" aria-label="شكل القمر الحالي"><defs>
      <radialGradient id="mnLit" cx="40%" cy="38%" r="72%"><stop offset="0" stop-color="#f4f2ec"/><stop offset=".55" stop-color="#d9d6cc"/><stop offset="1" stop-color="#a9a69d"/></radialGradient>
      <radialGradient id="mnDark" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#23232c"/><stop offset="1" stop-color="#101016"/></radialGradient>
      <radialGradient id="mnHalo"><stop offset="0" stop-color="#e9ecf5" stop-opacity=".16"/><stop offset="1" stop-color="#e9ecf5" stop-opacity="0"/></radialGradient>
      <filter id="mnBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>
      <filter id="mnGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .5 -.12"/></filter>
      <clipPath id="mnClip"><circle r="${R}"/></clipPath></defs>
      <circle r="63" fill="url(#mnHalo)"/><circle r="${R}" fill="url(#mnDark)"/>
      <g clip-path="url(#mnClip)"><g transform="${wax ? "" : "scale(-1 1)"}">${lit}</g>
      <g filter="url(#mnBlur)" fill="#6f6e72" opacity=".5"><ellipse cx="-17" cy="-16" rx="14" ry="10"/><ellipse cx="-2" cy="-22" rx="9" ry="7"/><ellipse cx="14" cy="-9" rx="11" ry="9"/><ellipse cx="-24" cy="2" rx="9" ry="12"/><ellipse cx="-8" cy="8" rx="8" ry="6"/><ellipse cx="4" cy="22" rx="12" ry="7"/><ellipse cx="26" cy="12" rx="6" ry="5"/></g>
      <g fill="none" stroke="#8a888c" stroke-opacity=".35" stroke-width=".7"><circle cx="22" cy="-26" r="6"/><circle cx="-30" cy="22" r="5"/><circle cx="12" cy="30" r="4"/><circle cx="-12" cy="34" r="3"/><circle cx="30" cy="-6" r="3.5"/></g>
      <rect x="-60" y="-60" width="120" height="120" filter="url(#mnGrain)" opacity=".55" style="mix-blend-mode:multiply"/>
      <circle r="${R}" fill="none" stroke="url(#mnHalo)" stroke-width="3"/></g></svg>`;
  }
  function moonCard(ms, moon, sun) {
    const el = norm(moon.lon - sun.lon), ph = Math.floor(((el + 22.5) % 360) / 45), ill = Math.round((1 - Math.cos(el * Math.PI / 180)) / 2 * 100);
    const age = el / 360 * SYNODIC, toFull = ((180 - el + 360) % 360) / 360 * SYNODIC, toNew = ((360 - el) % 360) / 360 * SYNODIC;
    const nd = n => n.toLocaleString("ar-EG", { maximumFractionDigits: 1 });
    const dtxt = new Date(ms).toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const live = !skyDateInput.value, ttxt = live ? ` · ${new Date(ms).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}` : "";
    $("#sky-moon").innerHTML = `<div class="mn-fig">${moonSVG(el)}</div><div class="mn-txt">
      <span class="mn-kick">${live ? "القمر الآن" : "القمر في اليوم ده"}</span>
      <h3 class="mn-title">القمر <b>${MOON_NAMES[ph]}</b> في برج <b>${SIGNS[moon.sign].n}</b></h3>
      <p class="mn-meta"><span>مضاء ${nd(ill)}٪</span><span>${el < 180 ? "متزايد" : "متناقص"}</span><span>عمره ${nd(age)} يوم</span></p>
      <p class="mn-next">${ph === 4 ? "بدر كامل دلوقتي" : "البدر القادم بعد ~" + nd(toFull) + " يوم"} · ${ph === 0 ? "محاق دلوقتي" : "المحاق القادم بعد ~" + nd(toNew) + " يوم"}</p>
      ${(() => { const E = window.AqMoonSigns && window.AqMoonSigns[moon.sign]; return E ? `<div class="mn-sign"><p>${E.t}</p><p class="mn-sign-q">${E.q}</p></div>` : ""; })()}
      <small class="mn-date">${dtxt}${ttxt}</small></div>`;
  }
  setInterval(() => { if (!skyDateInput.value && !document.hidden) { const ms = Date.now(), ch = Astro.chart({ utcMs: ms, lat: 30, lon: 31, known: false }); moonCard(ms, ch.bodies.find(x => x.key === "moon"), ch.bodies.find(x => x.key === "sun")); } }, 60000);

  function renderSky() {
    const ms = skyMs(), ch = Astro.chart({ utcMs: ms, lat: 30, lon: 31, known: false });
    const b = k => ch.bodies.find(x => x.key === k);
    moonCard(ms, b("moon"), b("sun"));
    $("#sky-chips").innerHTML = PLANET_KEYS.map(k => { const p = b(k), f = fmt(p.lon); return `<button type="button" class="chip" data-k="${k}" aria-pressed="${k === skyKey}"><span class="sg" aria-hidden="true">${gl(PLANETS[k].g)}</span><span class="cn">${PLANETS[k].n}${p.retro ? ' <i class="rxb">راجع</i>' : ""}</span><span class="cs">${SIGNS[f.s].n}</span>${num(f.txt)}</button>`; }).join("");
    $$("#sky-chips .chip").forEach(c => c.addEventListener("click", () => { skyKey = c.dataset.k; renderSky(); }));
    renderSkyPanel(ch, ms);
    renderSkyAspects(ch);
  }
  function renderSkyAspects(ch) {
    const ASP = [["conj", 0, "اقتران"], ["sext", 60, "تسديس"], ["square", 90, "تربيع"], ["trine", 120, "تثليث"], ["opp", 180, "مقابلة"]];
    const bodies = ch.bodies.filter(x => PLANET_KEYS.includes(x.key));
    const found = [];
    for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) {
      const A = bodies[i], B = bodies[j], d = Math.abs(norm(A.lon - B.lon)), sep = d > 180 ? 360 - d : d;
      const lim = (A.key === "sun" || A.key === "moon" || B.key === "sun" || B.key === "moon") ? 8 : 6;
      for (const [k, deg, name] of ASP) {
        const orb = Math.abs(sep - deg);
        if (orb <= lim) { found.push({ A, B, k, name, orb, lim }); break; }
      }
    }
    found.sort((x, y) => x.orb - y.orb);
    const top = found.slice(0, 12);
    const head = `<div class="asp-ban"><div class="asp-ban-r"><span class="asp-ban-g"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4 4 19h16z"/><circle cx="12" cy="4" r="1.6"/><circle cx="4" cy="19" r="1.6"/><circle cx="20" cy="19" r="1.6"/></svg></span><div><small>AQEQ ASTRO</small><b>الأسبكتات بين الكواكب الآن</b></div></div><span class="asp-leg"><i class="k-soft">داعم</i><i class="k-hard">متوتر</i><i class="k-neu">اندماج</i></span></div><p class="ax-sub">الأسبكتات هي الزوايا التي تصنعها الكواكب مع بعضها، وكل زاوية تصنع حوارًا بين مجالين في حياتك.</p>`;
    if (!top.length) { $("#sky-asp").innerHTML = head + `<p class="sub">لا توجد أسبكتات مؤثرة في هذه اللحظة، فالسماء هادئة نسبيًا.</p>`; return; }
    const AM = { conj: "يلتقي المجالان في نقطة واحدة فيمتزجان، ويصعب الفصل بينهما، فيشتدّ أثرهما معًا.", sext: "فرصة هادئة للتعاون بين المجالين، وتحتاج منك مبادرة بسيطة لتستثمرها.", square: "احتكاك يحرّك الأمور ويكشف خلافًا داخليًا، ويطلب منك قرارًا واضحًا.", trine: "انسجام وتدفق طبيعي بين المجالين، وعليك فقط ألا تعتاد السهولة فتؤجل.", opp: "شدّ بين طرفين، وكل طرف يطلب منك الانحياز إليه، والحل في التوازن الواعي." };
    const AQ = { conj: "هل تشعر أن أمرين في حياتك لم يعودا منفصلين؟", sext: "هل ظهرت فرصة صغيرة تتردد في الإمساك بها؟", square: "هل تشعر بشدٍّ داخلي بين ما تريده وما تفعله فعلًا؟", trine: "هل تسير أمور كثيرة بسهولة غريبة حتى صرت تشك فيها؟", opp: "هل تشعر أنك بين طرفين، كل منهما يسحبك إلى جهة؟" };
    const AR = { conj: "تفكّر في أمر فتجده يمسّ شعورك مباشرة، ولا تستطيع الفصل بينهما.", sext: "يعرض عليك أحدهم تعاونًا بسيطًا، أو تخطر لك فكرة تحتاج إلى رسالة واحدة فقط.", square: "خلاف صغير يتضخم، أو رغبة في الحسم تصطدم بخوف من العواقب.", trine: "تنجز شيئًا دون جهد يُذكر، ثم تؤجل ما بعده لأن الأمر بدا مضمونًا.", opp: "تحتار بين الالتزام والحرية، أو بين ما يريده الآخرون وما تريده أنت." };
    const AG = { conj: '<circle cx="8.500" cy="15.500" r="3.600"/><path d="M11 13 18.500 5.500"/>', sext: '<path d="M12 4v16M5.100 8l13.800 8M5.100 16l13.800-8"/>', square: '<rect x="5.500" y="5.500" width="13" height="13" rx="1.200"/>', trine: '<path d="M12 5 19.500 18h-15z"/>', opp: '<circle cx="7" cy="17" r="3"/><circle cx="17" cy="7" r="3"/><path d="M9.200 14.800 14.800 9.200"/>' };
    /* مفتاح التركيبة لمكتبة النصوص، وحالة الزاوية: a تقترب، p ذروة، s تنفرج */
    const ASP_DEG = { conj: 0, sext: 60, square: 90, trine: 120, opp: 180 };
    const aspPair = x => [x.A.key, x.B.key].sort((a, b) => PLANET_KEYS.indexOf(a) - PLANET_KEYS.indexOf(b)).join("|") + "|" + x.k;
    const aspPhase = x => {
      if (x.orb < 0.7) return "p";
      const d2 = Math.abs(norm((x.A.lon + (x.A.speed || 0) / 24) - (x.B.lon + (x.B.speed || 0) / 24))), s2 = d2 > 180 ? 360 - d2 : d2;
      return Math.abs(s2 - ASP_DEG[x.k]) < x.orb ? "a" : "s";
    };
    $("#sky-asp").innerHTML = head + `<div class="sky-asp-list">` + top.map((x, ix) => {
      const hard = ["square", "opp"].includes(x.k), neu = x.k === "conj", tc = neu ? "n" : hard ? "h" : "s", tone = neu ? "اندماج" : hard ? "متوتر" : "داعم";
      const rb = r => r ? ` <em class="ax-r">راجع</em>` : "";
      const retroNote = (x.A.retro || x.B.retro) ? `<p class="ax-note">ومع تراجع ${[x.A, x.B].filter(z => z.retro).map(z => PLANETS[z.key].n).join(" و")}، يتجه هذا الحوار إلى الداخل، فراجع قبل أن تقرر.</p>` : "";
      return `<div class="ax axt-${tc}" data-ax="${ix}" data-pair="${aspPair(x)}" data-ph="${aspPhase(x)}" data-orb="${x.orb.toFixed(2)}" data-lim="${x.lim}"><button type="button" class="ax-s" aria-haspopup="dialog"><span class="ax-pair"><span class="ax-pl"><span class="sg" aria-hidden="true">${gl(PLANETS[x.A.key].g)}</span></span><span class="ax-ln"><svg viewBox="0 0 24 24" aria-hidden="true">${AG[x.k]}</svg></span><span class="ax-pl"><span class="sg" aria-hidden="true">${gl(PLANETS[x.B.key].g)}</span></span></span><span class="ax-t"><b>${PLANETS[x.A.key].n} <u>${x.name}</u> ${PLANETS[x.B.key].n}</b><small><i class="ax-tone">${tone}</i><span>أوربة ${x.orb.toFixed(1)}°</span>${(x.A.retro || x.B.retro) ? `<em class="ax-r">${[x.A, x.B].filter(z => z.retro).map(z => PLANETS[z.key].n).join(" و")} راجع</em>` : ""}</small></span><span class="ax-chev" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></span></button><div class="ax-b" hidden><p>${PLANETS[x.A.key].theme} مع ${PLANETS[x.B.key].theme}: ${AM[x.k]}</p><p class="ax-q">${AQ[x.k]}</p><p><b>في الواقع:</b> ${AR[x.k]}</p>${retroNote}</div></div>`;
    }).join("") + `</div>`;
  }
  function renderSkyPanel(ch, ms) {
    const k = skyKey, p = PLANETS[k], bd = ch.bodies.find(x => x.key === k), S = SIGNS[bd.sign];
    const ing = nextIngress(k, ms), dfmt = t => new Date(t).toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" });
    const deg = bd.lon % 30, dInt = Math.floor(deg), dMin = Math.floor((deg - dInt) * 60), nd = n => n.toLocaleString("ar-EG");
    const stage = deg < 10 ? ["بداية الدخول", "الطاقة جديدة وما زالت تتشكل، وأثرها يبدأ بالظهور تدريجيًا."]
      : deg < 20 ? ["منتصف الرحلة", "الطاقة مستقرة وواضحة، وهذا أصفى وقت لتقرأ أثرها في يومك."]
      : deg < 29 ? ["أواخر البرج", "الطاقة ناضجة وتقترب من التبدّل، فخذ ما بدأته إلى خواتيمه."]
      : ["على أعتاب برج جديد", "آخر درجات البرج، وتغيّر الأجواء قريب جدًا."];
    let ingTxt = "";
    if (ing) {
      const back = ing.sign === (bd.sign + 11) % 12;
      ingTxt = `<p class="swp-ing"><span class="swp-ing-ic" aria-hidden="true"><span class="sg">${gl(SIGNS[ing.sign].g)}</span></span><span>${p.n} ${back ? "يعود إلى برج" : "ينتقل إلى برج"} <b>${SIGNS[ing.sign].n}</b> تقريبًا يوم ${dfmt(ing.ms)}.</span></p>`;
    }
    const PSY = {
      sun: ["الشمس عند يونغ هي صورة الذات: ما تصير إليه حين تتوقف عن إثبات نفسك للآخرين.", "أين تتصرف هذه الأيام كما يُنتظر منك، لا كما تشعر في داخلك؟", "لديك طاقة أكبر مما تُظهره، وحاجة هادئة إلى أن يُرى جهدك دون أن تطلب ذلك."],
      moon: ["القمر هو الطفل الداخلي في نفسك: ما يطمئنه وما يُخيفه، قبل أن يتدخل العقل.", "ما الشعور الذي تؤجله هذه الأيام لأنك لا تجد له وقتًا؟", "تبدو متماسكًا للآخرين، لكنك تحتاج أحيانًا إلى من يسألك عن حالك ويصدّق إجابتك."],
      mercury: ["عطارد هو الحوار الداخلي: الصوت الذي يصف لك ما يحدث قبل أن تعيشه.", "ما الجملة التي تكررها في رأسك كثيرًا، وهل هي حقيقة أم عادة؟", "تفكر في أمور أكثر مما تقول، وتعيد صياغة كلام قيل لك قبل أيام."],
      venus: ["الزهرة عند يونغ قريبة من الأنيما والأنيموس: صورة ما ننجذب إليه لأنه يشبه جزءًا غائبًا فينا.", "ما الذي تطلبه من الآخرين، وهو في الحقيقة شيء لم تمنحه لنفسك بعد؟", "تعطي في العلاقات أكثر مما تعترف به، وتنتظر أن يلاحظ أحدهم ذلك دون أن تشير إليه."],
      mars: ["المريخ هو الطاقة التي تدفعك للفعل، وهو أيضًا الظل حين تُكبت: الغضب الذي لم يجد صيغة مقبولة.", "ما الذي تريده فعلًا، ولا تطلبه خوفًا من أن تبدو متطلبًا؟", "حين تصمت طويلًا ثم تنفجر، فالأمر لا يتعلق بالموقف الأخير بل بما سبقه."],
      jupiter: ["المشتري هو المعنى: السؤال الذي يجعل تعبك مفهومًا ورحلتك مستحقة.", "أي جزء من حياتك يحتاج إلى معنى أكبر، لا إلى مجهود أكبر؟", "تؤمن بأن الأمور ستتحسن، وفي الوقت نفسه تخاف أن يكون تفاؤلك ساذجًا."],
      saturn: ["زحل هو الأنا العليا والحد: الصوت الذي يقول لك ما الذي عليك أن تكونه لتستحق.", "من الذي ما زلت تحاول إرضاءه، وهو لم يعد يحاسبك منذ زمن؟", "تحمل مسؤوليات كثيرة، وتتمنى سرًّا أن يخفف أحدهم عنك دون أن تضطر إلى الطلب."],
      uranus: ["أورانوس هو الدافع إلى الاستقلال: الجزء الذي لا يقبل أن يكون نسخة من أحد.", "ما الذي صار ضيقًا عليك، وتتظاهر بأنه ما زال مناسبًا؟", "تحتاج إلى مساحة تخصك، حتى في أقرب العلاقات إليك."],
      neptune: ["نبتون هو اللاوعي الجمعي: الحلم والإلهام والرغبة في الذوبان في ما هو أكبر منك.", "ما الصورة المثالية التي تتمسك بها، وما الذي تتجنب رؤيته بسببها؟", "تشعر بما لا يقوله الناس، وهذا يُرهقك أحيانًا أكثر مما تعترف."],
      pluto: ["بلوتو هو الظل العميق: ما دُفن في النفس لأنه مخيف، وهو نفسه مصدر القوة حين يُعترف به.", "ما الذي تتشبث به، وأنت تعرف في أعماقك أنه انتهى؟", "مررت بتحولات لم يعرف الناس عنها شيئًا، وما زلت تحمل أثرها في طريقة ثقتك."]
    };
    const ELF = ["يظهر الأثر في الجسد والحماس قبل أن يصل إلى الكلام: ستشعر به كاندفاع أو ضيق في الحركة.", "يظهر الأثر في الملموس: العمل والمال والروتين وطريقة اعتنائك بنفسك.", "يظهر الأثر في الأفكار والمحادثات التي لا تتوقف في رأسك، وفي حاجتك إلى أن تفهم قبل أن تشعر.", "يظهر الأثر في المشاعر والأحلام وما لا تقوله، وستلتقط أجواء الآخرين أسرع من المعتاد."];
    const ps = PSY[k], fl = ELF[S.el];
    const mv = (k === "sun" || k === "moon" ? "" : (bd.retro
      ? `<div class="swp-mv is-retro"><b><i class="rx-b" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4 4 9l5 5"/><path d="M4 9h9.500a5.500 5.500 0 0 1 0 11H10"/></svg></i>حالة التراجع: ${p.n} متراجع الآن</b><p>${retroText(k).replace(/^[^:]*:\s*/, "")}</p><p>في علم النفس العميق، التراجع دعوة إلى الداخل: يلتفت ${p.theme} إلى الوراء بدل الأمام، فتعود إليك مواقف قديمة لا لتؤلمك بل لتكتمل.</p></div>`
      : `<div class="swp-mv is-direct"><b><i aria-hidden="true">›</i>حالة الحركة: مباشرة</b><p>${p.n} يسير للأمام في مساره المعتاد، فيظهر أثره بوضوح ودون حاجة إلى مراجعة.</p></div>`))
      + `<div class="swp-psy swp-story">${(window.AqReadings && window.AqReadings.PL[k]) ? `<h4 class="swp-h2">${window.AqReadings.PL[k][0]}</h4><p>${window.AqReadings.PL[k][1]}</p><p>${window.AqReadings.PL[k][2]}</p><p><b>ما يطلبه منك:</b> ${window.AqReadings.PL[k][3]}</p>` : ""}</div>`
      + `<div class="swp-q"><h4 class="swp-h2">سؤال للتأمل</h4><p>${bd.retro ? "ما الذي يعود إليك الآن ليُراجَع، ولماذا الآن بالذات؟" : ps[1]}</p></div>`;
    let o = `<div class="swp-hero"><span class="swp-med${bd.retro ? " is-retro" : ""}" aria-hidden="true"><span class="sg">${gl(p.g)}</span></span><div class="swp-ht"><small>${skyDateInput.value ? "السماء في التاريخ المختار" : "السماء الآن"}</small><h3>${p.n} في ${S.n}</h3>
      <div class="swp-pills"><i class="swp-pill ${bd.retro ? "is-retro" : "is-direct"}">${bd.retro ? "متراجع" : (k === "sun" || k === "moon" ? "في حركته" : "مباشر")}</i><i class="swp-pill is-sign"><span class="swp-pill-g" aria-hidden="true"><span class="sg">${gl(S.g)}</span></span>${nd(dInt)}° ${nd(dMin)}′ ${S.n}</i></div></div></div>
      <div class="swp-deg" role="img" aria-label="الدرجة ${dInt} من 30"><div class="swp-track"><span class="swp-dot" style="--p:${(deg / 30 * 100).toFixed(1)}%"></span></div><div class="swp-scale"><span>٠°</span><span>١٠°</span><span>٢٠°</span><span>٣٠°</span></div><p><b>${stage[0]}</b> · ${stage[1]}</p></div>
      <div class="swp-fold">${(window.AqSignLeads&&window.AqSignLeads[k]&&window.AqSignLeads[k][bd.sign])?`<p class="trm-lead">${window.AqSignLeads[k][bd.sign]}</p>`:""}<p class="swp-read">${(window.AqSignReads&&window.AqSignReads[k]&&window.AqSignReads[k][bd.sign])||`يمرّ ${p.n} الآن في ${S.n}، فيمنح ${p.theme} طابعًا ${S.way}. الأجواء تساعدك على ${S.strength}، وتذكّرك بلطف أن تنتبه من ${S.shadow}، فهو الوجه الذي يظهر حين تتعب.`}</p>
      <button type="button" class="trm-bn" data-trm aria-expanded="false"><span class="trm-bn-t">تعمّق في القراءة كاملة</span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
      <div class="swp-full" hidden>${mv}${ingTxt}</div></div>`;
    $("#sky-panel").innerHTML = o;
  }
  skyDateInput.addEventListener("change", renderSky);
  renderSky();


  /* ---------- صفحة «لك»: نافذة يومية مخصصة من خريطة الميلاد المحفوظة ---------- */
  (function forYou() {
    const host = $("#fy-body"); if (!host) return;
    const lockIc = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
    const natalHouse = (nat, lon) => {
      const ch = nat.ch;
      if (ch.known && Array.isArray(ch.cusps)) {
        const x = Astro.norm(lon);
        for (let i = 0; i < 12; i++) { const st = Astro.norm(ch.cusps[i]), sp = Astro.norm(ch.cusps[(i + 1) % 12] - st); if (Astro.norm(x - st) < sp) return i + 1; }
      }
      const sun = ch.bodies.find(b => b.key === "sun");
      return ((Math.floor(Astro.norm(lon) / 30) - sun.sign + 12) % 12) + 1;
    };
    const mY = ms => new Date(ms).toLocaleDateString("ar-EG", { month: "long", year: "numeric" });
    function welcome(note) {
      host.innerHTML = `<div class="fy-welcome"><span class="fy-ic" aria-hidden="true">${gl("☽")}</span><h3>افتح نافذتك اليومية</h3>
        <p>${note || "احفظ بيانات ميلادك مرة واحدة، وهتلاقي هنا رسالة يومك وتذكير بنمطك والعبورات الكبرى في خريطتك، من غير ما تدخل بياناتك كل مرة."}</p>
        <div class="fy-actions"><a class="btn" href="#chart">احسب خريطة ميلادك</a><a class="btn ghost" href="#account">حسابي وبياناتي</a></div></div>`;
    }
    function render() {
      let nat = null;
      try { nat = window.AqeeqChartContext && window.AqeeqChartContext.getOrPrefill(); } catch (e) { }
      if (!nat) { welcome(); return; }
      const ms = Date.now(), now = Astro.chart({ utcMs: ms, lat: nat.lat, lon: nat.lon, known: false });
      const nb = k => now.bodies.find(b => b.key === k);
      const dt = new Date(ms).toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" });
      const moon = nb("moon"), h = natalHouse(nat, moon.lon), H = HOUSES[h - 1];
      const who = nat.name ? `يا ${esc(nat.name)}، ` : "";
      let o = `<article class="fy-card fy-daily"><span class="fy-kick">${dt}</span><h3>رسالة يومك النفسية</h3>
        <p>${who}${moonDay(h)}</p>
        <p>الحدود: يزداد الضغط إذا ${HOUSE_TRIG[h - 1]}، فخذ مسافة صغيرة قبل أن ترد أو توافق.</p>
        <p>في العمل والقرارات: ${HOUSE_ADV[h - 1]}.</p>
        <small class="fy-basis">القمر الآن في ${SIGNS[moon.sign].n}، ويعبر بيتك ${H.n}${nat.ch.known ? "" : " (بنظام البيوت الكاملة من برج شمسك، لأن وقت الميلاد غير معروف)"}.</small></article>`;
      const mo = nat.ch.bodies.find(b => b.key === "moon"), S = SIGNS[mo.sign], mh = nat.ch.known ? mo.house : null;
      o += `<article class="fy-card fy-pattern"><span class="fy-badge"><span class="sg" aria-hidden="true">${gl("☽")}</span> القمر في ${S.n}${mh ? ` / البيت ${HOUSES[mh - 1].n}` : ""}</span><h3>تذكير بنمطك النفسي</h3>
        <p>قمرك في ${S.n}، فتتعامل مع مشاعرك بأسلوب ${S.way}. وحين يزيد الضغط قد تجد نفسك في ${S.shadow}${mh ? `، وغالبًا يظهر ذلك في مجال ${HOUSES[mh - 1].area}` : ""}.</p>
        <p>ملاحظة بلا لوم: ${S.growth}.</p></article>`;
      const TR = ["jupiter", "saturn", "uranus", "neptune", "pluto", "truenode"];
      o += `<div class="fy-sec-h"><h3>عبوراتك الكبرى الآن</h3><small>اسحب لتشوف باقي العبورات</small></div><div class="fy-track" tabindex="0" role="group" aria-label="العبورات الكبرى الحالية">`;
      TR.forEach(k => {
        const b = nb(k), th = natalHouse(nat, b.lon), TH = HOUSES[th - 1], sg = SIGNS[Math.floor(Astro.norm(b.lon) / 30)];
        const node = k === "truenode", P = PLANETS[k];
        let period = "";
        if (node) period = "حوالي ١٨ شهر في كل برج";
        else { try { const ing = nextIngress(k, ms); period = ing ? "في " + sg.n + " حتى " + mY(ing.ms) : "في " + sg.n; } catch (e) { period = "في " + sg.n; } }
        const name = node ? "العقدة الشمالية" : P.n;
        const hook1 = node ? `مسارك يتجه نحو ${TH.area}.` : `${P.n} يختبر ${TH.area} عندك.`;
        const hook2 = node ? "وهذا ما يشدّك إلى الأمام حتى لو كان غير مألوف." : `وقت تعيد فيه فهم ${P.theme}.`;
        const intro = node ? `العقدة الشمالية تشير إلى اتجاه نموك، وهي الآن في بيتك ${TH.n}، فالمواقف المرتبطة بـ${TH.area} هي ساحة التعلم عندك.`
          : `${liveText(k, th)}${b.retro ? " " + liveRetro(k, th) : ""}`;
        o += `<article class="fy-tr"><span class="fy-badge"><span class="sg" aria-hidden="true">${gl(node ? "☊" : P.g)}</span> ${name} <i>${period}</i></span>
          <h4>${hook1}<br>${hook2}</h4><p>${intro}</p>
          <div class="fy-lock"><span class="fy-lock-ic">${lockIc}</span><p>باقي القراءة، وتوقيت الذروة وخريطة التحرر، للمشتركين.</p><a class="btn fy-lock-btn" href="#pay" data-paywall="${node ? "العقدة الشمالية في بيتك " + TH.n : "عبور " + P.n + " في بيتك " + TH.n}">افتح قراءة العبور الكاملة وخريطة التحرر</a></div></article>`;
      });
      host.innerHTML = o + `</div>${NOTE_SYM}`;
    }
    setTimeout(render, 0);
    window.addEventListener("hashchange", () => { if (location.hash === "#for-you") render(); });
    document.addEventListener("aqeeq:natal-ready", render);
  })();

  /* ---------- عجلة الهيرو وتوقعات الأبراج ---------- */
  const NS = "http://www.w3.org/2000/svg";
  const ticks = $("#ticks");
  for (let k = 0; k < 72; k++) {
    const a = k * 5 * Math.PI / 180, r1 = k % 6 === 0 ? 172 : 177, r2 = 186;
    const l = document.createElementNS(NS, "line");
    l.setAttribute("x1", (200 + Math.cos(a) * r1).toFixed(2)); l.setAttribute("y1", (200 + Math.sin(a) * r1).toFixed(2));
    l.setAttribute("x2", (200 + Math.cos(a) * r2).toFixed(2)); l.setAttribute("y2", (200 + Math.sin(a) * r2).toFixed(2));
    ticks.appendChild(l);
  }
  const picker = $("#picker"), panel = $("#panel"), pbtns = [];
  const AIC = {person:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.2 5.3L20 9l-4.3 3.8L17 18.5 12 15.6 7 18.5l1.3-5.7L4 9l5.8-.7z"/></svg>',child:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2"/><path d="M5.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/></svg>',steps:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h4v-4h4v-4h4V7h4"/><path d="M4 19V5"/></svg>',wound:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l7 2.8v5.4c0 4.2-2.8 7.2-7 8.8-4.2-1.6-7-4.6-7-8.8V6.3z"/><path d="M12 9v4M12 15.5v.1"/></svg>',pair:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg>',heart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0112 7.6 4.3 4.3 0 0119.5 10c0 5.4-7.5 10-7.5 10z"/></svg>',work:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="7.5" width="17" height="12" rx="2.5"/><path d="M9 7.5V6a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0115 6v1.5M3.5 13h17"/></svg>',fear:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/></svg>',growth:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17l5-5 4 4 7-8"/><path d="M15 8h5v5"/></svg>',history:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h10M7 20.5h10M8 3.5c0 4 4 5 4 8.5s-4 4.5-4 8.5M16 3.5c0 4-4 5-4 8.5s4 4.5 4 8.5"/></svg>',spirit:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8"/></svg>',do:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',avoid:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M8.5 12h7"/></svg>',tip:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 18h5M10 21h4M12 3.5a6 6 0 00-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0012 3.5z"/></svg>',sun:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.8"/><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6L18 18M18 6l-1.4 1.4M7.4 16.6L6 18"/></svg>',ask:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.3 9.2a2.8 2.8 0 115 1.7c-.8.9-2.3 1.4-2.3 3"/><path d="M12 17.6v.1"/></svg>',more:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13.5 6.5L19 12l-5.5 5.5"/></svg>'};
  const SIGN_SECS = [
    { t: "شخصية البرج", g: AIC.person }, { t: "الطفولة", g: AIC.child }, { t: "المراهقة ومراحل العمر", g: AIC.steps },
    { t: "الجروح والاحتياجات النفسية", g: AIC.wound }, { t: "الرجل والمرأة", g: AIC.pair }, { t: "الحب والعلاقات", g: AIC.heart },
    { t: "العمل والطموح والإبداع", g: AIC.work }, { t: "المخاوف والتناقضات والجانب الخفي", g: AIC.fear },
    { t: "النمو والتطور الشخصي", g: AIC.growth }, { t: "التاريخ والأساطير والرموز", g: AIC.history }, { t: "التقاليد الروحية والباطنية", g: AIC.spirit }
  ];
  function signSections(i) {
    return `<div class="sx"><h4 class="zp-h">${ZI.book}<span>موسوعة البرج</span></h4>
      <div class="sec-icons" role="group" aria-label="أقسام البرج">${SIGN_SECS.map((x, j) => `<button type="button" class="sec-ico" data-sec="${j}"><span aria-hidden="true">${x.g}</span><small>${x.t}</small></button>`).join("")}</div>
      <div class="sec-body" id="sec-body" aria-live="polite"><p class="sub">اختار أي فصل من الموسوعة عشان تفتح القراءة التفصيلية.</p></div></div>`;
  }
  /* موسوعة الأبراج: محتوى افتتاحي أصلي قابل للتوسيع والمراجعة. ده تفسير رمزي عام للشمس، مش تشخيص ولا حكم ثابت على كل شخص. */
  const SIGN_ARCHETYPES = [
    {child:"غالبًا بيبان حماسك بدري: تحب تجرب بإيدك وتكون أول واحد يدخل اللعبة. لما الكبار يوقفوك كتير من غير شرح، ممكن يتحول الحماس لعصبية أو إحساس إن محدش فاهمك.",teen:"في المراهقة بتتعلم توازن بين إثبات الذات وسماع رأي غيرك. التحدي مش إنك تبطل الجرأة، لكن إنك تدي لنفسك ثواني تفكر قبل رد الفعل.",adult:"نضجك يظهر لما تتحول المبادرة إلى التزام: تبدأ، وتكمل، وتعرف إمتى تقود وإمتى تشارك القرار.",elder:"مع الخبرة، تقدر تبقى مصدر شجاعة للجيل الأصغر، خصوصًا لما تحكي عن محاولاتك اللي ما نجحتش زي ما تحكي عن انتصاراتك.",love:"تحتاج علاقة فيها حيوية وصراحة ومساحة للمبادرة. الخلاف لا يعني نهاية العلاقة، لكنه يحتاج إنك تسمع قبل ما تحسم.",work:"تلمع في البيئات اللي تسمح بالمبادرة وحل المشكلات بسرعة، بشرط وجود نظام يساعدك تتابع التفاصيل حتى النهاية.",shadow:"لما تخاف من العجز، ممكن تستعجل أو تعتبر التراجع هزيمة. أحيانًا اختيار التوقيت الصح شجاعة أكبر من الاندفاع.",growth:"اختار هدفًا واحدًا، وحدد له خطوة صغيرة قابلة للقياس، ثم التزم بالمتابعة بعد حماس البداية.",myth:"يرتبط الحمل في التراث اليوناني بالكبش الذهبي وقصص الانطلاق والعبور. الرمز هنا دعوة للتفكير في بداية الطريق، مش دليلًا علميًا على الشخصية."},
    {child:"قد تميل للروتين المألوف، والأشياء اللي تقدر تلمسها وتفهمها، وتحب الإحساس بالأمان. التغيير المفاجئ قد يحتاج منك وقتًا وشرحًا بدل الضغط.",teen:"في المراهقة تتكون ذائقتك واستقلاليتك بالتدريج. ممكن تتمسك برأيك لأنك محتاج تحس إن اختيارك ثابت ومش سهل يتسحب منك.",adult:"نضجك يظهر لما تجمع بين بناء الاستقرار والمرونة. مش كل تغيير تهديد، ومش كل تمسك دليل قوة.",elder:"خبرتك ممكن تتحول لحكمة عملية: تعرف قيمة الوقت والجودة والراحة، وتقدر تنقل ده من غير ما تفرض طريقة واحدة على الآخرين.",love:"تحتاج ثقة تُبنى بالأفعال المتكررة والاهتمام الملموس. عبّر عن احتياجك للتغيير أو التجديد بدل ما يتحول الصمت إلى عناد.",work:"قد يناسبك العمل اللي يكافئ الصبر والجودة وبناء شيء طويل الأمد، مع مساحة لتطوير مهاراتك بدل تكرار المألوف فقط.",shadow:"الخوف من فقدان الأمان ممكن يخليك تتمسك بما لم يعد مناسبًا. اسأل نفسك: هل ده اختيار واعٍ، ولا مجرد شيء اعتدت عليه؟",growth:"جرّب تغييرًا صغيرًا وآمنًا كل فترة، وراقب كيف تقدر تحافظ على قيمك من غير ما ترفض كل جديد.",myth:"يرتبط الثور في صور فلكية وأساطير متعددة بالقوة والخصب والأرض. خليه رمزًا لسؤال: إزاي تبني أمانًا من غير ما تتحول حياتك إلى مكان ثابت؟"},
    {child:"قد تظهر فضولك في كثرة الأسئلة والقصص وتبديل الألعاب بسرعة. احتياجك مش منع الأسئلة، بل مساعدتك على التركيز وإكمال تجربة واحدة قبل الانتقال لغيرها.",teen:"في المراهقة، اللغة والأصدقاء والأفكار الجديدة ممكن يبقوا مساحة أساسية لاكتشاف نفسك. راقب الفرق بين تغيير رأيك لأنك تعلمت شيئًا، وتغييره فقط للهروب من الملل.",adult:"نضجك يظهر لما تحول سرعة التعلم إلى معرفة متراكمة، وتسمح لنفسك بالتعمق بدل جمع بدايات كثيرة.",elder:"تقدر تكون ناقلًا للحكايات والمعرفة، وتربط بين أجيال وأفكار مختلفة، خصوصًا لما تترك مساحة للصمت والاستماع أيضًا.",love:"الحوار والفضول وخفة التواصل قد تكون مهمة لك. في المقابل، القرب يحتاج حضورًا مستمرًا، مش كلامًا ممتعًا وقت ما يكون المزاج حاضرًا فقط.",work:"قد تناسبك مجالات التواصل والتعليم والكتابة والبحث وتعدد المهام، بشرط ترتيب الأولويات وتقليل التشتت.",shadow:"لما تقلق من الاختيار، ممكن تفضل كل الأبواب مفتوحة. لكن بعض الفرص لا تنضج إلا لما تمنحها وقتك.",growth:"اكتب فكرة واحدة تريد فهمها، وخصص لها وقتًا ثابتًا، ثم لخّص ما تعلمته قبل الانتقال لفكرة أخرى.",myth:"يرتبط الجوزاء في التراث اليوناني بتوأمي كاستور وبولوكس، ورمز الازدواج هنا يفتح سؤالًا عن جمع وجهين مختلفين داخلك بدل إجبار أحدهما على الاختفاء."},
    {child:"قد تكون حساسًا لتغير نبرة الصوت والجو في البيت، وتبحث عن شخص مألوف تلجأ إليه. من المهم أن تتعلم أن مشاعر الكبار ليست مسؤوليتك وأن طلب الطمأنينة حق طبيعي.",teen:"في المراهقة قد تتأرجح بين الرغبة في الانتماء والحاجة للاختباء في عالمك الخاص. التعبير عن الاحتياج بوضوح يساعدك أكثر من انتظار أن يلاحظه الآخرون وحدهم.",adult:"نضجك يظهر لما تعرف تحتوي نفسك، وتفرق بين التعاطف وتحمل أعباء الجميع، وتبني بيتًا نفسيًا داخليًا حتى وسط التغيير.",elder:"قد تصبح حافظًا للذكريات وروابط العائلة، مع ضرورة ترك الآخرين يصنعون اختياراتهم من غير أن تعتبر كل استقلال ابتعادًا عنك.",love:"الأمان العاطفي والاهتمام المتبادل مهمان، لكنهما لا يعنيان قراءة الأفكار. اطلب ما تحتاجه مباشرة واحترم اختلاف طرق التعبير.",work:"قد تناسبك أدوار الرعاية والدعم وصناعة المساحات الآمنة، وكذلك الأعمال الإبداعية التي تستفيد من الذاكرة والخيال.",shadow:"الخوف من الفقد قد يدفعك للتعلق بالماضي أو الانسحاب قبل أن تُجرح. التدرج في الثقة والحدود الواضحة يفتحان طريقًا أهدأ.",growth:"سمِّ شعورك، وحدد هل تحتاج مواساة أم حلًا عمليًا، ثم اسأل نفسك ما الجزء الذي يخصك فعلًا من المشكلة.",myth:"يرتبط السرطان في صور الأساطير بحكاية الكائن الذي ظهر في قصة هرقل. الرمز يذكّر بأن الحماية قد تكون قوة، لكنها تحتاج أيضًا إلى معرفة حدودها."},
    {child:"قد تحب التعبير واللعب التمثيلي وأن يلاحظ الآخرون ما صنعت. التشجيع الصحي هو اللي يقدّر محاولتك وصدقك، مش اللي يربط الحب بكونك الأفضل دائمًا.",teen:"في المراهقة قد يصبح الانتماء والتقدير مهمين جدًا. تعلّم تفرق بين رغبتك في مشاركة موهبتك وبين اضطرارك لإثبات قيمتك في كل موقف.",adult:"نضجك يظهر لما تقود بالدفء وتسمح للآخرين يلمعوا معاك. الثقة الحقيقية لا تحتاج جمهورًا دائمًا كي تظل موجودة.",elder:"قد تلهم من حولك بسخاء وخبرة، خصوصًا لما تشارك ما تعلمته من الفشل وتسمح للجيل الجديد أن يختار طريقه.",love:"تحتاج تقديرًا صريحًا ودفئًا وولاءً متبادلًا. حاول تسمع التقدير حتى لو جاء بطريقة مختلفة عن طريقتك المفضلة.",work:"قد تناسبك القيادة والفنون والعرض وصناعة المبادرات، مع تذكر أن الفريق القوي يشارك الفضل والمسؤولية.",shadow:"عندما تشعر بالتجاهل، قد يظهر الكبرياء أو الانسحاب الدرامي. التعبير المباشر عن الاحتياج أوضح من اختبار حب الآخرين.",growth:"مارس فعلًا جيدًا لا ينتظر تصفيقًا، واحتفل في الوقت نفسه بموهبتك من غير اعتذار عنها.",myth:"يرتبط الأسد في التراث اليوناني بأسد نيميا، وفي رموز أخرى بالشمس والملوكية. اسأل نفسك كيف تستخدم حضورك للحماية والإبداع، لا للسيطرة."},
    {child:"قد تلاحظ التفاصيل وتحب معرفة القواعد وطريقة عمل الأشياء. ساعدك على التجربة أهم من تصحيح كل خطأ صغير، لأن الخطأ جزء طبيعي من التعلم.",teen:"في المراهقة يمكن أن تقارن نفسك بالآخرين وتضغط على نفسك لتكون مفيدًا أو متقنًا. قيمتك أوسع من أدائك ومن قدرتك على إصلاح كل شيء.",adult:"نضجك يظهر لما تحول الدقة إلى مهارة ورحمة، وتقبل أن العمل الجيد قد يكون كافيًا حتى لو لم يكن كاملًا.",elder:"قد تصبح مرجعًا عمليًا يعرف كيف يحسن التفاصيل اليومية. الحكمة هنا أن تختار ما يستحق الإصلاح وما يحتاج فقط إلى القبول.",love:"قد تعبّر عن الحب بالمساعدة والانتباه للتفاصيل. قل مشاعرك أيضًا بالكلمات، ولا تجعل الملاحظات المتكررة تحجب التقدير.",work:"قد تناسبك المجالات التحليلية والتنظيمية والصحية والخدمية والتحريرية، مع أهمية فترات الراحة وتحديد نطاق المسؤولية.",shadow:"القلق قد يتخفى في صورة نقد أو محاولة سيطرة على التفاصيل. اسأل هل الملاحظة مفيدة الآن، وهل يمكن قولها بلطف؟",growth:"حدد معيارًا واقعيًا للإنجاز، وأنهِ المهمة عند بلوغه بدل إعادة العمل بلا نهاية.",myth:"يرتبط العذراء في بعض التقاليد بصور الحصاد والخدمة والحكمة. الرمز يدعوك لموازنة العناية بالتفاصيل مع تقدير ثمار ما أنجزته بالفعل."},
    {child:"قد تنتبه للعدل ولطريقة تعامل الناس مع بعضهم، وتحاول تهدئة الخلاف. يحتاج الطفل هنا أن يعرف أن الاختلاف لا يجعله مسؤولًا عن إصلاح كل شيء.",teen:"في المراهقة قد تتشكل هويتك من الصداقات والذوق والمقارنة. تعلم تقول رأيك حتى لو لم يوافق عليه الجميع، وتقبل أن بعض الخلافات لا تُحل فورًا.",adult:"نضجك يظهر لما تحول الدبلوماسية إلى حوار صريح، وتفهم أن الانسجام الحقيقي يحتمل كلمة لا وحدودًا واضحة.",elder:"قد تكون وسيطًا حكيمًا يجمع وجهات النظر، بشرط ألا تضحي براحتك كل مرة كي يبقى الجميع راضيًا.",love:"الشراكة والتبادل والاحترام أساس مهم. لا تجعل الحفاظ على العلاقة يعني تأجيل احتياجاتك إلى أجل غير مسمى.",work:"قد تناسبك مجالات التفاوض والتصميم والقانون والعلاقات العامة والعمل الجماعي، مع التدريب على الحسم واتخاذ القرار.",shadow:"الخوف من الصدام قد يظهر كتردد أو موافقة غير حقيقية. الوضوح اللطيف يقلل الاستياء أكثر من المجاملة المستمرة.",growth:"اتخذ قرارًا صغيرًا بنفسك من غير استطلاع كل الآراء، ثم راجع النتيجة وتعلم منها.",myth:"يرتبط الميزان في رموزه بالعدل والقياس، وبصور العدالة في تقاليد مختلفة. الرمز يسأل: هل توازن بين حقوق الآخرين وحقك أنت؟"},
    {child:"قد تلاحظ ما لا يقوله الآخرون وتحتاج وقتًا قبل أن تثق. احترام خصوصيتك مهم، وكذلك تعلم أن طلب المساعدة لا يسلبك قوتك.",teen:"في المراهقة قد تصبح الصداقة والولاء والخصوصية شديدة الأهمية. لا تحتاج أن تختبر الناس أو تخفي كل شيء كي تعرف من يستحق القرب.",adult:"نضجك يظهر لما تتحول الشدة إلى شجاعة في مواجهة الحقيقة، وتسمح للتغيير أن يحدث من غير أن تتحكم في كل تفاصيله.",elder:"قد تصبح شخصًا يعرف كيف يمر بالأزمات ويستخرج منها معنى، من غير أن يطلب من الجميع أن يعيشوا التجربة بالطريقة نفسها.",love:"تحتاج صدقًا وعمقًا ووفاءً. بناء الثقة يتطلب وضوحًا وحدودًا متبادلة، لا مراقبة أو اختبارات مستمرة.",work:"قد تناسبك الأبحاث والتحقيق والتحليل وإدارة الأزمات والمجالات التي تحتاج صبرًا وقراءة ما وراء التفاصيل.",shadow:"الخوف من الخيانة قد يتحول إلى شك أو رغبة في السيطرة. فرّق بين دليل حاضر وجرح قديم يستدعي نفس الخطر.",growth:"عبّر عن احتياجك للأمان بوضوح، وامنح الثقة على مراحل بناءً على السلوك الفعلي.",myth:"يرتبط العقرب في صور قديمة بالتجدد والتحول، كما يظهر في قصص وأساطير مختلفة. الرمز ليس نبوءة، بل دعوة لفهم ما تحتاج إلى تركه كي تنمو."},
    {child:"قد تحب الحركة والقصص والأسئلة الكبيرة، وتتعلم من التجربة المباشرة. ساعدك على تحويل الفضول إلى معرفة بدل إيقافه أو تركه بلا حدود.",teen:"في المراهقة قد تبحث عن استقلالك من خلال السفر أو الأفكار أو تحدي المألوف. الحرية تنضج لما تقترن بتحمل نتيجة الاختيار.",adult:"نضجك يظهر لما تجمع بين الرؤية الواسعة والاهتمام بالتفاصيل اليومية، وبين الصراحة ومراعاة أثر كلماتك.",elder:"قد تصبح معلمًا أو راويًا للتجارب، وتعرف أن الحكمة لا تعني امتلاك كل الإجابات بل الاستعداد لتعديل رأيك.",love:"تحتاج مساحة وصدقًا وروحًا مشتركة للتعلم. الالتزام لا يلغي الحرية، لكنه يحتاج اتفاقًا واضحًا على ما يعنيه للطرفين.",work:"قد تناسبك مجالات التعليم والسفر والنشر والتدريب والبحث والمشاريع المتجددة، مع متابعة المواعيد والوعود.",shadow:"التفاؤل قد يتحول إلى مبالغة أو وعود أكثر من الوقت المتاح. الواقعية لا تطفئ الحلم، بل تساعده على الوصول.",growth:"قبل أي وعد، راجع وقتك ومواردك؛ ثم اختر تجربة واحدة توسع أفقك بعمق.",myth:"يرتبط القوس في التقليد اليوناني بالقنطور الرامي، رمز الجمع بين الغريزة والمعرفة. السؤال هو كيف توجه طاقتك نحو هدف بدل إطلاقها في كل اتجاه."},
    {child:"قد تحب معرفة المطلوب منك وتفرح عندما تتقن مسؤولية. انتبه ألا يشعر الطفل أنه محبوب فقط عندما يكون ناضجًا أو ناجحًا أو لا يسبب مشكلة.",teen:"في المراهقة قد تحمل نفسك مسؤولية كبيرة أو تقارن تقدمك بغيرك. من حقك التجربة والراحة وتغيير الخطة من غير اعتبار ذلك فشلًا.",adult:"نضجك يظهر لما تبني إنجازًا طويل الأمد وتسمح لنفسك بالاستمتاع بالطريق، لا تأجيل الحياة إلى ما بعد الهدف التالي.",elder:"قد تقدم خبرة في الصبر والبناء، وتصبح أكثر حرية عندما تسمح لنفسك باللعب والراحة مثلما تسمح بالعمل.",love:"تُظهر الاهتمام بالثبات والالتزام وتحمل المسؤولية. شارك الجانب الحساس أيضًا، فالقرب لا يحتاج منك أن تكون قويًا طوال الوقت.",work:"قد تناسبك الإدارة والتخطيط والهندسة والمشاريع طويلة الأمد، مع ضرورة توزيع الحمل وعدم تحويل كل مهمة إلى اختبار لقيمتك.",shadow:"الخوف من الفشل قد يجعلك قاسيًا على نفسك أو متحفظًا في طلب الدعم. الراحة ليست مكافأة لا تأتي إلا بعد استنزافك.",growth:"حدد تعريفًا واقعيًا للنجاح، وضع موعدًا للراحة ضمن الخطة نفسها، لا بعدها فقط.",myth:"يرتبط الجدي في التراث بصور الماعز البحري وبالارتفاع والصعود في بعض الرموز. السؤال: ما الثمن الذي يستحقه طموحك، وما الثمن الذي لا يستحقه؟"},
    {child:"قد تطرح أسئلة مختلفة أو تفضّل طريقتك الخاصة في اللعب والتعلم. يحتاج الطفل إلى مساحة للاختلاف، مع مساعدته على فهم مشاعر الآخرين والتعاون معهم.",teen:"في المراهقة قد تكون الصداقة والأفكار والمجموعات مهمة، مع رغبة في عدم الذوبان فيها. الاستقلال لا يعني إخفاء الاحتياج للانتماء.",adult:"نضجك يظهر لما تحول الأفكار غير التقليدية إلى خطوات يمكن للناس تجربتها، وتسمح للمشاعر أن تكون جزءًا من قراراتك.",elder:"قد تترك أثرًا من خلال أفكارك ومساهمتك للمجتمع، وتزداد حكمتك عندما تجمع الرؤية المستقبلية مع الإصغاء للتجارب الشخصية.",love:"تحتاج صداقة ومساحة واحترامًا لاستقلال كل طرف. وضّح متى تحتاج وقتًا وحدك بدل أن يبدو الانسحاب برودًا أو رفضًا.",work:"قد تناسبك التقنية والابتكار والعمل الجماعي والمشاريع المجتمعية، مع الانتباه إلى أن التنفيذ يحتاج صبرًا وتنسيقًا.",shadow:"قد يتحول التمسك بالاستقلال إلى مسافة عاطفية أو رفض للرأي الآخر. ليس كل قرب تهديدًا لحريتك.",growth:"حوّل فكرة واحدة إلى تجربة صغيرة، واسأل شخصًا تثق به عن أثرها بدل الاكتفاء بصحتها في ذهنك.",myth:"يرتبط الدلو في رموزه بحامل الماء وصور المشاركة والتجديد. الرمز يطرح سؤالًا عن كيفية تحويل الفكرة الفردية إلى شيء ينفع الجماعة."},
    {child:"قد يتأثر خيالك بالموسيقى والقصص وأجواء المكان، وتلاحظ مشاعر من حولك بسرعة. ساعدك على وضع أسماء وحدود للمشاعر بدل أن تحمل كل ما يدور حولك.",teen:"في المراهقة قد تلجأ للخيال أو الفن عندما يصعب شرح ما بداخلك. من المفيد الجمع بين مساحة الأحلام وخطوات عملية تساعدك على الشعور بالثبات.",adult:"نضجك يظهر لما تحول التعاطف إلى دعم له حدود، والخيال إلى إبداع له شكل، والحدس إلى ملاحظة تُراجعها بالواقع.",elder:"قد تصبح مصدرًا للرحمة والخيال والقبول، مع تذكر أن مساعدة الآخرين لا تعني إنقاذهم من كل نتيجة أو قرار.",love:"تحتاج رقة وتواصلًا عاطفيًا، لكن الوضوح مهم بقدر الرومانسية. اسأل بدل افتراض أن الطرف الآخر يفهم الإشارات وحدها.",work:"قد تناسبك الفنون والمساعدة والإبداع والرعاية والأعمال التي تحتاج حسًا إنسانيًا، مع نظام بسيط يحمي وقتك وطاقتك.",shadow:"الهروب أو المثالية قد يظهران عندما يصبح الواقع مرهقًا. مواجهة خطوة واحدة صغيرة أفضل من انتظار أن تختفي كل الصعوبات.",growth:"ضع حدًا واضحًا واحدًا، وحوّل فكرة أو إحساسًا إلى فعل ملموس اليوم، مهما كان بسيطًا.",myth:"يرتبط الحوت في بعض الأساطير بصور التحول والنجاة والماء. الرمز يذكّر بأن الخيال قد يفتح أبوابًا، وأن الحدود تساعدك على العودة بأمان."}
  ];
  function signSectionContent(i, j) {
    const s = SIGNS[i], a = SIGN_ARCHETYPES[i], el = ELEMENTS[s.el].n, mod = MODALITIES[s.mod].n, ruler = PLANETS[s.ruler] ? PLANETS[s.ruler].n : s.ruler;
    const p = (t) => `<p>${t}</p>`;
    const card = (t, body) => `<div class="sx-card"><h5>${t}</h5><p>${body}</p></div>`;
    const intro = p(`في القراءة الرمزية لبرج ${s.n}، بنبدأ من صفاته العامة: ${s.way}. البرج من عنصر ${el} وطبيعته ${mod}، وحاكمه التقليدي/الحديث المستخدم هنا هو ${ruler}. دي عدسة للتأمل مش وصف إلزامي؛ خريطة الميلاد الكاملة قد تغيّر الصورة جدًا.`);
    const sections = [
      ["شخصية البرج", `${intro}${p(`نقطة القوة الظاهرة: ${s.strength}. غالبًا تظهر في طريقة التعامل مع المواقف قبل ما تظهر في الكلام عن النفس. اسأل: إمتى الصفة دي بتساعدني، وإمتى بتزيد عن حدها؟`)}${p(`الجانب اللي يحتاج وعي: ${s.shadow}. مش معنى كده إن كل مولود بالبرج عنده الصفة دي، لكنها احتمال رمزي مفيد للملاحظة. النضج هنا إنك تقدر تختار رد فعلك بدل ما تعتبره طبعًا لا يتغير.`)}${p(`درس النمو المقترح: ${s.growth}. جرّبه كسلوك صغير قابل للملاحظة، مش كحكم على شخصيتك كلها.`)}${card("القوة",s.strength)}${card("نقطة المراجعة",s.shadow)}`],
      ["الطفولة", `${p(a.child)}${p(`في البيت والمدرسة، قد يبان هذا الميل في طريقة الطفل في اللعب أو التعامل مع القواعد أو طلب الاهتمام. ده احتمال للتأمل وليس وصفًا مؤكدًا لطفولة أي شخص؛ البيئة والتربية والتجارب الفعلية أهم من البرج وحده.`)}${p(`ما الذي يساعد؟ مساحة آمنة للتجربة، وحدود مفهومة، وتشجيع لا يربط القبول بالأداء. بدل عبارة «إنت كده دايمًا»، الأفضل وصف السلوك المحدد ومساعدة الطفل على تجربة بديل.`)}${card("احتياج أساسي", ["الحركة والتجربة","الأمان والاستقرار","الحوار والتحفيز","الاحتواء والطمأنينة","التقدير والتعبير","القبول دون كمال","العدل والانتماء","الخصوصية والثقة","الاستكشاف والحرية","التشجيع مع الراحة","الاختلاف والانتماء","الخيال والاحتواء"][i])}${card("سؤال للتأمل","ما الذي كان يساعدك فعلًا وأنت صغير: أن يسمعك أحد، أم يترك لك مساحة، أم يشرح لك الحدود؟")}`],
      ["المراهقة ومراحل العمر", `${p(a.teen)}${card("الطفولة",a.child)}${card("الشباب وبداية الاستقلال",a.adult)}${card("منتصف العمر",`قد تنتقل الأولوية من إثبات الصفة إلى استخدامها بوعي: ${s.growth}. راجع ما اخترته بنفسك وما حملته فقط لإرضاء التوقعات.`)}${card("النضج والشيخوخة",a.elder)}${p("العمر لا يفرض مسارًا واحدًا، ولا يمكن استنتاج أحداث حياة شخص أو صحته أو عمره من البرج. المقصود هنا مراحل نفسية محتملة وأسئلة تساعد على فهم التغير مع الزمن.")}`],
      ["الجروح والاحتياجات النفسية", `${p(`منطقة الحساسية المحتملة عند ${s.n} قد ترتبط بتضخيم ${s.shadow} وقت الضغط. أحيانًا الصفة التي تبدو قوة من الخارج تكون وسيلة لحماية احتياج أعمق، مثل الأمان أو التقدير أو الحرية أو الانتماء.`)}${p("راقب الموقف الذي يسبق رد الفعل: ما الذي حدث فعلًا؟ ما المعنى الذي أعطيته له؟ وما الاحتياج الذي لم يُلبَّ؟ الفصل بين الحدث والتفسير يقلل الأحكام المتسرعة على نفسك وعلى الآخرين.")}${p(`بديل عملي: بدل أن تكرر النمط المرتبط بـ${s.shadow}، جرّب خطوة من ${s.growth}.`)}${card("علامة تحتاج انتباه", "تكرار نفس رد الفعل حتى عندما تتغير الظروف، أو صعوبة التعبير عن الاحتياج مباشرة.")}${card("احتياج صحي", "الأمان والحدود والقدرة على الاختيار، من غير خجل من المشاعر أو تحويلها إلى هوية ثابتة.")}`],
      ["الرجل والمرأة", `${p(`مش هنفترض إن كل رجل من ${s.n} بيتصرف بطريقة واحدة، أو إن كل امرأة من البرج نفسه لها شخصية مختلفة حتميًا. التنشئة والثقافة والخبرة والاختيارات الفردية عوامل مؤثرة جدًا.`)}${p(`على مستوى الرمز، قد يظهر ${s.way} عند بعض الناس في صورة مباشرة أو واضحة، وعند آخرين في أسلوب هادئ أو خاص. السؤال المفيد هو كيف يعبّر الشخص عن احتياجه وكيف يستقبل احتياج غيره، مش هل يطابق صورة نمطية عن جنسه.`)}${card("في التعبير عن القوة",s.strength)}${card("في التعامل مع الضغط",s.shadow)}${p("اقرأ هذا القسم كمساحة لفهم التنوع بين الأفراد، لا كقائمة صفات تُنسب تلقائيًا للرجال أو النساء.")}`],
      ["الحب والعلاقات", `${p(a.love)}${p(`قد تظهر نقاط القوة في العلاقة من خلال ${s.strength}، بينما قد يظهر التحدي عند الضغط في صورة ${s.shadow}. العلاقة الصحية لا تعتمد على توافق الأبراج وحده؛ تعتمد على الأمان والاحترام والاتفاقات والسلوك المتكرر.`)}${card("ما يساعد على التقارب", "التعبير المباشر عن الاحتياج، الإصغاء دون مقاطعة، والاتفاق على الحدود والتوقعات بدل الاعتماد على التخمين.")}${card("وقت الخلاف", "صف ما حدث وما شعرت به وما تحتاجه، وتجنب تحويل موقف واحد إلى حكم نهائي على شخصية الطرف الآخر.")}${p("للتوافق الفلكي الشخصي نحتاج مقارنة خريطتين كاملتين، وليس برج الشمس وحده، وحتى وقتها تظل القراءة تفسيرية وليست حكمًا على نجاح العلاقة.")}`],
      ["العمل والطموح والإبداع", `${p(a.work)}${p(`قد تكون ${s.strength} موردًا مهنيًا مهمًا عندما تستخدم في مكانها المناسب. أما ${s.shadow} فقد يظهر كعائق إذا تُرك من غير مراجعة، خصوصًا في الضغط أو التعاون مع الآخرين.`)}${card("بيئة قد تناسبك", ["المبادرة والحركة","الجودة والاستقرار","التنوع والتواصل","الرعاية والبيئة الداعمة","التعبير والقيادة","التحليل والخدمة","التعاون والتصميم","البحث والعمق","التعلم والاستكشاف","البناء طويل الأمد","الابتكار والعمل الجماعي","الإبداع والعمل الإنساني"][i])}${card("مهارة للنمو",s.growth)}${p("اختيار المهنة لا يُحسم من البرج. استخدم هذه النقاط لتوليد أفكار، ثم قارنها بمهاراتك الفعلية وظروفك واهتماماتك وتجربتك.")}`],
      ["المخاوف والتناقضات والجانب الخفي", `${p(`كل صفة قوية لها جانب يحتاج توازنًا. عند ${s.n}، قد يظهر التناقض بين ${s.strength} وبين ${s.shadow} عندما يشعر الشخص بالضغط أو فقدان السيطرة على موقف مهم.`)}${p("الجانب الخفي ليس سرًا غامضًا أو عيبًا ثابتًا؛ غالبًا هو سلوك تعلّمناه لحماية أنفسنا، وقد يصبح غير مفيد عندما نستخدمه في كل موقف. اسأل: ما الذي أحاول حمايته؟ وهل توجد طريقة أهدأ؟")}${card("النمط التلقائي",s.shadow)}${card("الاختيار البديل",s.growth)}${p("التأمل هنا هدفه زيادة الوعي، وليس إطلاق تشخيص نفسي أو افتراض أن البرج يفسر كل تجربة.")}`],
      ["النمو والتطور الشخصي", `${p(`مسار النمو المقترح لبرج ${s.n} هو: ${s.growth}. ابدأ بسلوك واحد، واكتب متى يظهر التحدي وما الذي يساعدك على الاستجابة بشكل مختلف.`)}${card("تمرين أسبوعي", "اختر موقفًا واحدًا تكرر فيه رد الفعل نفسه. سجّل الحدث، وشعورك، وردك، والبديل الذي تريد تجربته المرة القادمة.")}${card("علامة تقدم", "أن تلاحظ رد الفعل قبل أن يتحكم فيك، حتى لو لم تنجح في تغييره كل مرة.")}${p("التطور لا يعني محو شخصيتك أو إرضاء الآخرين. يعني امتلاك خيارات أكثر، وحدود أوضح، وقدرة أفضل على تصحيح المسار.")}`],
      ["التاريخ والأساطير والرموز", `${p(a.myth)}${p(`الرمز الفلكي لبرج ${s.n} هو ${s.g}، ويرتبط في القراءة الغربية بالعنصر ${el} والطبيعة ${mod}. تختلف القصص والأساليب بين الثقافات والمدارس، ولا توجد رواية واحدة تمثل كل التراث الفلكي.`)}${card("طريقة قراءة الرمز", "اعتبر الأسطورة قصة تفتح سؤالًا عن الاختيار والتحول، لا دليلًا تاريخيًا على أن صفات الإنسان تحددها الكواكب.")}${p("في النسخ القادمة نقدر نضيف مراجع منفصلة لكل رمز، ونوضح الفرق بين الأسطورة الموثقة والتفسير الحديث حتى لا نخلط بينهما.")}`],
      ["التقاليد الروحية والباطنية", `${p(`في بعض التقاليد الحديثة، يُستخدم برج ${s.n} كرمز للتأمل في ${s.growth}. تختلف هذه المعاني من مدرسة إلى أخرى، وليست حقائق مثبتة أو تعليمات ملزمة.`)}${p("تمرين آمن وبسيط: خذ دقيقة للهدوء، واكتب ما تريد فهمه في نفسك، ثم حدد خطوة واقعية صغيرة. لا تحتاج طقسًا مكلفًا أو وعدًا خارقًا كي تستفيد من التأمل.")}${card("نية للتأمل",s.growth)}${card("حدود مهمة", "لا تستبدل الرعاية الطبية أو النفسية أو القرارات المالية والقانونية بتفسير فلكي أو ممارسة روحية.")}${p("عقيق أسترو يقدّم هذه المادة كقراءة رمزية وثقافية للتأمل الذاتي، لا كإثبات لقوى خارقة أو ضمان لنتائج مستقبلية.")}`]
    ];
    return sections[j] ? sections[j][1] : p("المحتوى قيد الإضافة.");
  }
  function openSignSec(i, j) {
    const x = SIGN_SECS[j];
    const body = $("#sec-body");
    if (!body) return;
    body.innerHTML = `<h4>${x.t}</h4><div class="sign-detail sign-detail-in">${signSectionContent(i, j)}<p class="sign-disclaimer">قراءة رمزية عامة لبرج الشمس. لا تختصر شخصيتك في برج واحد؛ الطالع والقمر وبقية الخريطة والسياق الشخصي يضيفون تفاصيل مختلفة.</p></div>`;
    $$("#panel .sec-ico").forEach((b, k) => { b.setAttribute("aria-pressed", k === j ? "true" : "false"); });
  }
  /* ---------- خلفيات الأقسام الفلكية البطيئة ---------- */
  (function(){
    const KINDS = ["amb-galaxy", "amb-planet", "amb-nebula", "amb-orbit"];
    let n = 0;
    document.querySelectorAll("main section[id]").forEach(sec => {
      if (sec.id === "home") return;
      const a = document.createElement("span");
      a.className = "amb " + KINDS[n % KINDS.length]; a.setAttribute("aria-hidden", "true");
      sec.insertBefore(a, sec.firstChild); n++;
    });
  })();
  function signIntro(i) {
    const p = $("#panel");
    if (!p) return;
    p.querySelectorAll(".sign-intro").forEach(x => x.remove());
    const d = document.createElement("div");
    d.className = "sign-intro"; d.setAttribute("aria-hidden", "true");
    d.innerHTML = `<svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="66"/><circle cx="70" cy="70" r="52"/></svg><span>${SIGNS[i].g}</span>`;
    p.insertBefore(d, p.firstChild);
    setTimeout(() => d.remove(), 2000);
  }
  const signsSec = $("#signs");
  const ZI = {
    sparkorb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.200l1.900 5.300 5.300 1.900-5.300 1.900-1.900 5.300-1.900-5.300-5.300-1.900 5.300-1.900z"/><circle cx="19" cy="5" r="1.100"/><circle cx="5.500" cy="18.500" r="1.100"/><path d="M19.600 16.600l.5 1.200 1.200.5-1.200.5-.5 1.200-.5-1.200-1.200-.5 1.200-.5z"/></svg>',
    crescent: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.500 3.800a8 8 0 1 0 5.700 11.600A6.600 6.600 0 0 1 14.500 3.800z"/><path d="M18 6.200l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>',
    gem: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.500 4h11L21 9l-9 11L3 9z"/><path d="M3 9h18M9.500 4L8 9l4 11 4-11-1.500-5"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.4 5.6 6 .6-4.5 4 1.4 5.9L12 16l-5.300 3.100 1.400-5.900-4.500-4 6-.6z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.500-4.600-7.500-10A4.300 4.300 0 0 1 12 7.500 4.300 4.300 0 0 1 19.500 10c0 5.400-7.500 10-7.500 10z"/></svg>',
    work: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.500" y="7.500" width="17" height="12" rx="2"/><path d="M9 7.500V5.500A1.500 1.500 0 0 1 10.500 4h3A1.500 1.500 0 0 1 15 5.500v2M3.500 13h17"/></svg>',
    coin: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.500"/><path d="M14.800 9.200c-.5-.8-1.500-1.200-2.800-1.200-1.600 0-2.700.8-2.700 2 0 2.800 5.600 1.400 5.600 4.200 0 1.200-1.200 2-2.900 2-1.300 0-2.400-.5-3-1.400M12 6.500V8M12 16v1.500"/></svg>',
    tip: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.500 10.900c.6.5 1 1.200 1 2V16h5v-.1c0-.8.4-1.500 1-2A6 6 0 0 0 12 3z"/></svg>',
    orbit: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="9.500" ry="4.200" transform="rotate(-25 12 12)"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.500A1.500 1.500 0 0 1 5.500 4H11v15H5.500A1.500 1.500 0 0 0 4 20.500zM20 5.500A1.500 1.500 0 0 0 18.500 4H13v15h5.500a1.500 1.500 0 0 1 1.500 1.500z"/></svg>'
  };
  /* ===== #signs: ستارة الأبراج + تبويبان + ورقة سفلية موحدة (محرك حي من Astro و AqReadings) ===== */
  const nAr = n => Number(n).toLocaleString("ar-EG");
  const bdg = (g, cls) => `<span class="sg-bd${cls ? " " + cls : ""}" aria-hidden="true"><span class="sg">${gl(g)}</span></span>`;
  const bdi = svg => `<span class="sg-bd" aria-hidden="true"><span class="sg sg-svg">${svg}</span></span>`;
  const ASP_DEF = [["conj", 0, "اقتران"], ["sext", 60, "تسديس"], ["square", 90, "تربيع"], ["trine", 120, "تثليث"], ["opp", 180, "مقابلة"]];
  const ASP_MEAN = {
    conj: "يلتقي المجالان في نقطة واحدة فيمتزجان، ويشتد أثرهما معًا.",
    sext: "فرصة هادئة للتعاون بين المجالين، وتحتاج مبادرة بسيطة منك لتستثمرها.",
    square: "شدّ بين مجالين يطلب منك قرارًا واعيًا بدل أن تتركه يتراكم.",
    trine: "انسجام طبيعي بين المجالين، فما تبدأه فيه يسير بسلاسة.",
    opp: "مجالان في مواجهة، والمطلوب أن توازن بينهما لا أن تنحاز لأحدهما."
  };
  function rd() { return window.AqReadings || null; }
  function liveText(k, h) {
    const R = rd();
    const t = R && ((R.TR && R.TR[k] && R.TR[k][h - 1]) || (R.PH && R.PH[k] && R.PH[k][h - 1]));
    return t || "";
  }
  function liveRetro(k, h) { const A = window.AqLive, R = rd(), x = A && A.RTH && A.RTH[k] && A.RTH[k][h - 1]; return x || (R && R.RT && R.RT[k]) || ""; }
  function moonHint(i, nowMoonSign) {
    try {
      const ms = Date.now(), jdUt = Astro.jdFromMs(ms), jde = jdUt + Astro.deltaT(Astro.yearOf(jdUt)) / 86400;
      const lon = Astro.norm(Astro.lonOf("moon", jde)), lon2 = Astro.norm(Astro.lonOf("moon", jde + 1));
      const sp = Math.max(8, ((lon2 - lon + 540) % 360) - 180), hrs = Math.max(1, Math.round(((30 - (lon % 30)) / sp) * 24));
      const nx = (Math.floor(lon / 30) + 1) % 12, nh = ((nx - i + 12) % 12) + 1;
      return `القمر سريع الحركة، وسينتقل إلى برج ${SIGNS[nx].n} بعد نحو ${nAr(hrs)} ساعة، فتتحول طاقة يومك إلى بيتك ${HOUSES[nh - 1].n}.`;
    } catch (e) { return ""; }
  }
  const AICs = typeof AIC !== "undefined" ? AIC : {};
  const SG_CLOCK = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>';
  const qPl = (k, h) => `كيف يظهر ${PLANETS[k].theme} في ${HOUSES[h - 1].area} عندك الآن، وما الخطوة الصغيرة التي تعبّر عنه بصدق؟`;
  const qAs = (a, b) => `أين تلتقي ${PLANETS[a].theme} مع ${PLANETS[b].theme} في يومك، وما القرار الهادئ الذي يوازن بينهما؟`;
  const aspKey = x => [x.A.key, x.B.key].sort((a, b) => PLANET_KEYS.indexOf(a) - PLANET_KEYS.indexOf(b)).join("|") + "|" + x.k;
  const aspLib = x => { const L = window.AqAspLib; return L && L.ready() ? L.get(aspKey(x)) : null; };
  const aspBody = x => { const e = aspLib(x); return e && e.t.length ? e.t.map(p => `<p>${p}</p>`).join("") : `<p>${ASP_MEAN[x.k]}</p>`; };
  const aspQ = x => { const e = aspLib(x); return e && e.q ? e.q : qAs(x.A.key, x.B.key); };
  function signLive(i) {
    const ms = Date.now(), now = Astro.chart({ utcMs: ms, lat: 30, lon: 31, known: false });
    const nb = k => now.bodies.find(b => b.key === k), hOf = k => ((nb(k).sign - i + 12) % 12) + 1;
    const dfmt = t => new Date(t).toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" });
    const dshort = (t, yr) => new Date(t).toLocaleDateString("ar-EG", yr ? { day: "numeric", month: "long", year: "numeric" } : { day: "numeric", month: "long" });
    const dmoon = t => new Date(t).toLocaleString("ar-EG", { weekday: "long", hour: "numeric", minute: "2-digit" });
    const spanOf = (k, b, h) => {
      let from = null, ing = null; try { from = prevIngress(k, ms); ing = nextIngress(k, ms); } catch (e) {}
      const long = k !== "moon" && k !== "sun", cy = new Date(ms).getFullYear(), yr = long && ((ing && new Date(ing.ms).getFullYear() !== cy) || (from && new Date(from).getFullYear() !== cy));
      const d = t => k === "moon" ? dmoon(t) : dshort(t, yr);
      const stay = from && ing ? `${PLANETS[k].n} في ${SIGNS[b.sign].n} من ${d(from)} إلى ${d(ing.ms)}.` : ing ? `${PLANETS[k].n} في ${SIGNS[b.sign].n} حتى ${d(ing.ms)}.` : "";
      const nh = ing ? ((ing.sign - i + 12) % 12) + 1 : 0;
      const nxt = ing ? `${ing.sign === (b.sign + 11) % 12 ? "يعود إلى" : "ينتقل إلى"} برج ${SIGNS[ing.sign].n}، فيتحول أثره إلى بيتك ${HOUSES[nh - 1].n}.` : "";
      const brief = ing ? `حتى ${d(ing.ms)} ثم ${SIGNS[ing.sign].n}` : "";
      return { stay, nxt, brief };
    };
    const item = k => {
      const b = nb(k), h = hOf(k), S = SIGNS[b.sign], T = spanOf(k, b, h);
      let body = sgParas(liveText(k, h)).map(x => `<p>${x}</p>`).join("");
      if (b.retro) body += `<p class="sg-rx">${liveRetro(k, h)}</p>`;
      if (k !== "moon" && k !== "sun") { let ing = null; try { ing = nextIngress(k, ms); } catch (e) {} if (ing) body += `<p class="sg-ing">${PLANETS[k].n} ${ing.sign === (b.sign + 11) % 12 ? "يعود إلى برج" : "ينتقل إلى برج"} ${SIGNS[ing.sign].n} تقريبًا يوم ${dfmt(ing.ms)}.</p>`; }
      return { k, g: PLANETS[k].g, t: `${PLANETS[k].n} في ${S.n}${b.retro ? " (راجع)" : ""}`, sub: `يؤثر على بيتك ${HOUSES[h - 1].n} · ${HOUSES[h - 1].area}`, when: T.brief, span: T.stay, nxt: T.nxt, rx: b.retro, html: body, q: qPl(k, h) };
    };
    const slow = ["jupiter", "saturn", "uranus", "neptune", "pluto"], mid = ["sun", "mercury", "venus", "mars"];
    const all8 = ["mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];
    const order = all8.map((k, n) => ({ k, n })).sort((a, b) => (nb(b.k).retro ? 1 : 0) - (nb(a.k).retro ? 1 : 0) || a.n - b.n).map(x => x.k);
    const planets = order.map(item);
    const bodies = now.bodies.filter(x => PLANET_KEYS.includes(x.key)), ruler = SIGNS[i].ruler, found = [];
    for (let a = 0; a < bodies.length; a++) for (let c = a + 1; c < bodies.length; c++) {
      const A = bodies[a], B = bodies[c];
      if (!(A.sign === i || B.sign === i || A.key === ruler || B.key === ruler)) continue;
      const d = Math.abs(Astro.norm(A.lon - B.lon)), sep = d > 180 ? 360 - d : d, lim = (A.key === "sun" || A.key === "moon" || B.key === "sun" || B.key === "moon") ? 8 : 6;
      for (const [k, deg, name] of ASP_DEF) { const orb = Math.abs(sep - deg); if (orb <= lim) { found.push({ A, B, k, name, orb }); break; } }
    }
    found.sort((x, y) => x.orb - y.orb);
    const mk = x => {
      const hard = x.k === "square" || x.k === "opp", tone = x.k === "conj" ? "اندماج" : hard ? "متوتر" : "داعم", rx = [x.A, x.B].filter(z => z.retro).map(z => PLANETS[z.key].n);
      return { pair: true, A: x.A.key, B: x.B.key, g: PLANETS[x.A.key].g, tc: x.k === "conj" ? "n" : hard ? "h" : "s", t: `${PLANETS[x.A.key].n} ${x.name} ${PLANETS[x.B.key].n}`, sub: `${tone} · فارق ${nAr(x.orb.toFixed(1))}°`,
        html: `${aspBody(x)}${rx.length ? `<p class="sg-rx">ومع تراجع ${rx.join(" و")}، يتجه هذا الحوار إلى الداخل، فراجع قبل أن تقرر.</p>` : ""}`, q: aspQ(x) };
    };
    const asp = found.map(x => ({ x, it: mk(x) }));
    const bucketOf = x => (x.A.key === "moon" || x.B.key === "moon") ? "near" : ([x.A.key, x.B.key].some(k => mid.includes(k)) ? "mid" : "far");
    const aspects = asp.slice(0, 4).map(o => o.it);
    const pick = b => asp.filter(o => bucketOf(o.x) === b).slice(0, 3).map(o => o.it);
    const near = [item("moon")].concat(pick("near")), midL = mid.map(item).concat(pick("mid")), far = slow.map(item).concat(pick("far"));
    const sunH = hOf("sun"), moonH = hOf("moon"), rxN = order.filter(k => nb(k).retro).map(k => PLANETS[k].n);
    const lun = (() => {
      const AL = window.AqLive; if (!AL) return null;
      const el = Astro.norm(nb("moon").lon - nb("sun").lon), nd = Math.min(el, 360 - el), fd = Math.abs(el - 180);
      if (nd < 24 && AL.NM) return { t: "المحاق الآن", cap: "قمر جديد في بيتك " + HOUSES[sunH - 1].n, txt: AL.NM[sunH - 1] };
      if (fd < 24 && AL.FM) { const fh = ((sunH - 1 + 6) % 12) + 1; return { t: "البدر الآن", cap: "قمر مكتمل في بيتك " + HOUSES[fh - 1].n, txt: AL.FM[fh - 1] }; }
      return null;
    })();
    return { planets, aspects, near, mid: midL, far, sunH, moonH, rxN, lun, hint: moonHint(i) };
  }

  /* ---- الورقة السفلية الموحدة ---- */
  let sgSheet = null, sgBody = null, sgList = [], sgIdx = 0;
  const sgMark = document.createComment("sg-panel");
  function sgRewind() {
    if (!sgSheet) return;
    const go = () => { [sgSheet.querySelector(".aqm-sheet-panel"), sgBody, sgSheet.querySelector(".sg-sh-bd")].forEach(e => { if (e) e.scrollTop = 0; }); };
    go(); requestAnimationFrame(() => { go(); requestAnimationFrame(go); });
  }
  function sgClose() {
    if (!sgSheet || sgSheet.hidden) return;
    sgRewind();
    const sh = sgSheet; sh.classList.add("is-closing");
    setTimeout(() => { sh.hidden = true; sh.classList.remove("is-closing"); document.documentElement.classList.remove("aqm-sheet-open"); }, 230);
  }
  function sgScopeCss() {
    const st = document.createElement("style"); document.head.appendChild(st); const out = st.sheet, VARS = [];
    const conv = t => t.split(",").map(x => x.trim()).filter(x => /#signs[\w.\-:]*\s+\S/.test(x)).map(x => x.replace(/(?:section)?#signs[\w.\-:]*/g, "#sgs-sheet")).join(",");
    const walk = (rules, tgt) => { for (const r of rules) {
      try {
        if (r.type === 1 && r.selectorText && r.selectorText.indexOf("#signs") > -1) {
          const sel = /#panel\s*$/.test(r.selectorText) ? "" : conv(r.selectorText); if (sel) tgt.insertRule(sel + "{" + r.style.cssText + "}", tgt.cssRules.length);
          else { for (let k = 0; k < r.style.length; k++) { const n = r.style[k]; if (n.indexOf("--") === 0) VARS.push(n + ":" + r.style.getPropertyValue(n)); } }
        } else if (r.type === 4) {
          const before = tgt.cssRules.length; tgt.insertRule("@media " + r.conditionText + "{}", before);
          walk(r.cssRules, tgt.cssRules[before]);
        }
      } catch (e) {}
    } };
    const WANT = /sky-|signs|zodiac|page-art|aqeeq-design|lifepath|field-cards|internal-pages|cosmic/;
    [].forEach.call(document.styleSheets, ss => { try { if (ss.ownerNode && ss.ownerNode.tagName === "LINK" && /aq-bundle-css/.test(ss.href || "")) { let on = false; for (const r of ss.cssRules) { if (r.selectorText === ".aqsrc") on = WANT.test(r.style.getPropertyValue("--f")); else if (on) walk([r], out); } } else if (ss.ownerNode && ss.ownerNode.tagName === "LINK" && WANT.test(ss.href || "")) walk(ss.cssRules, out); else if (ss.ownerNode && ss.ownerNode.tagName === "STYLE" && ss.ownerNode !== st) walk(ss.cssRules, out); } catch (e) {} });
    if (VARS.length) out.insertRule("#sgs-sheet{" + VARS.join(";") + "}", out.cssRules.length);
  }
  function sgParas(t, max) { const out = []; let c = ""; String(t || "").split(/(?<=[.؟!])\s+/).forEach(x => { if (c && (c + " " + x).length > (max || 100)) { out.push(c); c = x; } else c = c ? c + " " + x : x; }); if (c) out.push(c); return out; }
  function sgReveal() {
    const els = sgBody.querySelectorAll(".sg-sh-bd p,.sg-meta,.sgs-qdock,.sg-sep");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { root: sgBody, threshold: 0.05 });
    els.forEach(el => { el.classList.add("sg-rv"); io.observe(el); });
  }
  function sgFill() {
    const it = sgList[sgIdx];
    sgBody.innerHTML = `<header class="sg-sh-hd">${it.svg ? bdi(it.svg) : bdg(it.g, "sg-bd-l")}<div><h3>${it.t}</h3></div></header><div class="sg-sh-bd sign-detail">${(it.span || it.sub) ? `<div class="sg-meta">${it.span ? `<p class="sg-span"><i aria-hidden="true">${SG_CLOCK}</i><span>${it.span}</span></p>` : ""}${it.sub ? `<p class="sg-hs"><i aria-hidden="true"></i><span>${it.sub}</span></p>` : ""}${it.nxt ? `<p class="sg-nx">${it.nxt}</p>` : ""}</div>` : ""}${it.html}${it.q ? `<div class="sgs-qdock"><i aria-hidden="true">${ZI.sparkorb}</i><p>${it.q}</p></div>` : ""}</div>`;
    sgRewind(); sgReveal();
    sgSheet.querySelector("[data-sgn]").hidden = sgList.length < 2;
  }
  function sgShow(list, idx) {
    if (!sgSheet) {
      sgSheet = document.createElement("div"); sgSheet.className = "aqm-sheet sgs-sheet"; sgSheet.id = "sgs-sheet"; sgSheet.hidden = true; sgScopeCss();
      sgSheet.innerHTML = '<div class="aqm-sheet-scrim" data-sgc></div><div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-label="تفاصيل القراءة"><span class="aqm-sheet-grip"></span><button type="button" class="aqm-sheet-x" data-sgc aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="aqm-sheet-body sgs-body"></div><div class="aqm-sheet-foot sgs-foot"><button type="button" class="aqm-foot-next" data-sgn>التالي</button><button type="button" class="aqm-foot-close" data-sgc>إغلاق</button></div></div>';
      document.body.appendChild(sgSheet); sgBody = sgSheet.querySelector(".sgs-body");
      sgSheet.addEventListener("click", e => { if (e.target.closest("[data-sgc]")) sgClose(); else if (e.target.closest("[data-sgn]")) { sgIdx = (sgIdx + 1) % sgList.length; sgFill(); sgRewind(); } });
      sgSheet.addEventListener("keydown", e => { if (e.key === "Escape") sgClose(); });
    }
    sgList = list; sgIdx = idx; sgFill();
    sgSheet.hidden = false; document.documentElement.classList.add("aqm-sheet-open"); sgRewind();
  }
  window.addEventListener("hashchange", () => { if (location.hash !== "#signs") sgClose(); });
  const sgFab = () => { document.body.classList.toggle("aq-signs-open", location.hash === "#signs"); try { document.querySelectorAll("section.sec").forEach(x => { x.scrollTop = 0; }); window.scrollTo(0, 0); } catch (e) {} };
  window.addEventListener("hashchange", sgFab); sgFab();

  /* ---- ستارة الأبراج والتنقل ---- */
  let signCur = -1, signsMode = "forecast", curList = {};
  const cur = document.createElement("div"); cur.className = "sg-cur"; cur.id = "sg-cur"; cur.setAttribute("data-open", "true");
  cur.innerHTML = '<div class="sg-tabs sg-tabs-main" role="tablist" aria-label="أقسام البرج"><button type="button" role="tab" data-sgtab="forecast" aria-selected="true"><span class="sg-ti" aria-hidden="true">' + ZI.crescent + '</span>توقعات وطاقة البرج</button><button type="button" role="tab" data-sgtab="traits" aria-selected="false"><span class="sg-ti" aria-hidden="true">' + ZI.gem + '</span>شخصية وصفات البرج</button></div><div class="sg-bar" hidden><span class="sg-bar-id"></span><button type="button" class="sg-chg" data-sgchg aria-expanded="false">تغيير البرج</button><button type="button" class="sg-nxt" data-sgnxt>البرج التالي</button></div><div class="sg-pk"><div class="sg-pk-in"></div></div>';
  picker.parentNode.insertBefore(cur, picker); cur.querySelector(".sg-pk-in").appendChild(picker);
  const sgBar = cur.querySelector(".sg-bar"); cur.insertBefore(sgBar, cur.firstChild);
  function setCurtain(open) {
    cur.setAttribute("data-open", open ? "true" : "false");
    const c = cur.querySelector("[data-sgchg]"); c.setAttribute("aria-expanded", open ? "true" : "false"); c.textContent = open ? "إخفاء الأبراج" : "تغيير البرج";
  }
  function alignTabs() { return; /* try { const t = panel.querySelector(".sg-tabs-main"), r = t.getBoundingClientRect(), bb = sgBar.getBoundingClientRect(); const d = r.top - (bb.bottom + 10); if (d < 0) { if (signsSec.scrollHeight > signsSec.clientHeight + 2) signsSec.scrollTop += d; else window.scrollBy(0, d); } } catch (e) {} */ }
  function toTop() { try { signsSec.scrollTo && signsSec.scrollTo(0, 0); window.scrollTo(0, 0); } catch (e) {} }
  cur.addEventListener("click", e => {
    if (e.target.closest("[data-sgchg]")) setCurtain(cur.getAttribute("data-open") !== "true");
    else if (e.target.closest("[data-sgnxt]")) { pickSign((signCur + 1) % 12); toTop(); }
  });
  const signsH2 = document.querySelector("#signs .center h2"), signsIntro = document.querySelector("#signs .center .intro");
  const HEAD_T = "توقعات وطاقة الأبراج الآن", HEAD_P = "اعرف نبض السماء المؤثر على برجك اليوم، واكتشف خريطة شخصيتك بعمق لم يُقَل لك من قبل.";
  let signsSub = "pulse", signsPer = "near";
  function updatePeriod() {
    const el = document.getElementById("period"); if (!el) return;
    el.textContent = new Date().toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }
  if (signsH2) signsH2.textContent = HEAD_T;
  if (signsIntro) signsIntro.textContent = HEAD_P;
  function setMode(m) { signsMode = m; cur.querySelectorAll("[data-sgtab]").forEach(b => b.setAttribute("aria-selected", String(b.dataset.sgtab === m))); signsSec.setAttribute("data-mode", m); updatePeriod(); if (signCur >= 0) renderSign(); }
  updatePeriod();
  function signHero(i) {
    const s = SIGNS[i];
    return `<header class="sg-hero"><div class="sg-hero-1"><b>${s.n}</b><span>${s.d}</span></div><div class="sg-hero-2"><i>${ELEMENTS[s.el].adj}</i><i>الحاكم: ${PLANETS[s.ruler].n}</i></div></header>`;
  }
  const secH = (icon, t) => `<h4 class="sg-h"><span class="sg-bd sg-bd-s" aria-hidden="true">${icon}</span><span>${t}</span></h4>`;
  const rowBd = it => it.svg ? bdi(it.svg) : it.pair ? `<span class="sg-pair">${bdg(PLANETS[it.A].g)}${bdg(PLANETS[it.B].g)}</span>` : bdg(it.g);
  const rowsHTML = (list, key) => list.map((it, n) => `<button type="button" class="sg-row${it.rx ? " is-rx" : ""}${it.tc ? " sg-t-" + it.tc : ""}" data-sgrow="${key}:${n}">${rowBd(it)}<span class="sg-row-t"><b>${it.t}${it.rx ? ' <i class="rxb">راجع</i>' : ""}</b><small>${it.sub}</small>${it.when ? `<small class="sg-wh">${it.when}</small>` : ""}</span><span class="sg-chev" aria-hidden="true"></span></button>`).join("");
  const cellsHTML = (list, key) => list.map((it, n) => `<button type="button" class="sg-cell${it.rx ? " is-rx" : ""}" data-sgrow="${key}:${n}">${rowBd(it)}<b>${it.t}</b><span class="sg-go" aria-hidden="true">التفاصيل</span></button>`).join("");
  const qBox = q => `<div class="sg-q"><p>${q}</p></div>`;
  function guideList(s) {
    return [
      { svg: AICs.do, t: "الأفضل أن تفعله اليوم", sub: "خطوة واحدة تناسب طاقتك", html: `<ul><li>استخدم ${s.strength} في أول موقف يحتاجك اليوم.</li><li>اختر شيئًا واحدًا وأنهِه بهدوء.</li></ul>` },
      { svg: AICs.avoid, t: "الأفضل أن تتجنبه", sub: "الجانب الذي يحتاج انتباهك", html: `<ul><li>انتبه إلى ${s.shadow}، وخذ نفسًا قبل أن ترد.</li></ul>` },
      { svg: AICs.tip, t: "نصيحة اليوم", sub: "اتجاه نموك الآن", html: `<p>${s.growth}.</p>` },
      { svg: AICs.sun, t: "السماء الآن", sub: "المواقع والحركات الحالية", html: `<p>المواقع والحركات الفلكية الحالية تُعرض في <a href="#sky">قسم السماء الآن</a>. هذه القراءة عامة لبرج الشمس، وخريطتك الشخصية تضيف التفاصيل: <a href="#chart">خريطتك الفلكية</a> · <a href="#services">استكشف العلاقة بينكما</a>.</p>` }
    ];
  }
  const subTabs = [["pulse", "نبض اليوم"], ["transits", "العبورات والزوايا"], ["periods", "خريطة الفترات"]];
  const moonDay = h => liveText("moon", h);
  function pulseTab(i, L) {
    const s = SIGNS[i], q = `ما الموقف الذي تستطيع أن تطبّق فيه اليوم: ${s.growth}؟`, G = guideList(s);
    const AL = window.AqLive, day = (AL && AL.DAY && AL.DAY[L.moonH - 1]) || "", head = (AL && AL.HEAD && AL.HEAD[L.moonH - 1]) || "";
    const guide = `استخدم ${s.strength} في أول موقف يحتاجك اليوم، واختر شيئًا واحدًا وأنهِه بهدوء. وانتبه إلى ${s.shadow}، وخذ نفسًا قبل أن ترد. ونصيحة يومك: ${s.growth}.`;
    const paras = t => sgParas(t, 100);
    const sub = (t, txt) => `<div class="sg-sub"><h6>${t}</h6>${paras(txt).map(x => `<p>${x}</p>`).join("")}</div>`;
    const sep = '<div class="sg-sep" aria-hidden="true"><i></i></div>';
    const mAsp = (L.near || []).slice(1).find(x => x.pair) || (L.aspects || [])[0], pRx = (L.planets || []).find(x => x.rx && ["mercury", "venus", "mars"].includes(x.k));
    const sunPart = `<section class="sg-part"><h5>خلفية أسبوعك: الشمس في بيتك ${HOUSES[L.sunH - 1].n}</h5>${paras(liveText("sun", L.sunH)).map(x => `<p>${x}</p>`).join("")}</section>`;
    const aspPart = mAsp ? `<section class="sg-part"><h5>الزاوية الأقرب اليوم: ${mAsp.t}</h5>${mAsp.html}</section>` : "";
    const rxPart = pRx ? `<section class="sg-part"><h5>${pRx.t}</h5>${pRx.html}</section>` : "";
    const lunPart = L.lun && L.lun.txt ? `<section class="sg-part"><h5>${L.lun.t}: ${L.lun.cap}</h5>${paras(L.lun.txt).map(x => `<p>${x}</p>`).join("")}</section>` : "";
    const moonPart = `<section class="sg-part"><h5>نبض القمر وحركته</h5>${head ? `<p class="sg-lead">${head}</p>` : ""}${paras(day).map(x => `<p>${x}</p>`).join("")}</section>`;
    const dayPart = `<section class="sg-part"><h5>طاقة يومك في ${s.n}</h5><p>استخدم ${s.strength} في أول موقف يحتاجك اليوم، واختر شيئًا واحدًا وأنهِه بهدوء.</p><p>وانتبه إلى ${s.shadow}، وخذ نفسًا قبل أن ترد.</p><p>ودرس يومك: ${s.growth}.</p></section>`;
    curList = { fc: [{ svg: ZI.sparkorb, t: "توقع يومك", span: (L.near[0] || {}).span, nxt: (L.near[0] || {}).nxt, sub: (L.near[0] || {}).sub, html: `<div class="sg-flow">${moonPart}${sep}${sunPart}${aspPart ? sep + aspPart : ""}${rxPart ? sep + rxPart : ""}${lunPart ? sep + lunPart : ""}${sep}${dayPart}</div>`, q }] };
    return `
      <section class="sg-sec">
      <article class="sg-card sg-fc" data-sgrow="fc:0" role="button" tabindex="0"><div class="sg-fc-h">${bdi(ZI.sparkorb)}<div><h5>توقع يومك</h5><span class="sg-live"><i class="sg-dot" aria-hidden="true"></i>مباشر · طاقة اليوم</span></div></div>
        <p class="sg-ex">${head ? `<b>${head}</b> ` : ""}${day}</p>
        <span class="sg-more">قراءة التوقع الكامل<i aria-hidden="true">${AICs.more}</i></span></article>
      ${L.lun && L.lun.txt ? `<article class="sg-card sg-lun"><div><h5>${L.lun.t}</h5><small>${L.lun.cap}</small><p>${L.lun.txt}</p></div></article>` : ""}
      </section>`;
  }
  function transitsTab(i, L) {
    curList = { tr: L.planets, as: L.aspects };
    const ci = (svg, h) => `<div class="sg-chip"><i class="sg-ci" aria-hidden="true">${svg}</i><span>${h}</span></div>`;
    const glance = `<div class="sg-chips">${ci(AICs.sun, `<b>الشمس</b> في بيتك ${HOUSES[L.sunH - 1].n}`)}${ci(ZI.crescent, `<b>القمر</b> في بيتك ${HOUSES[L.moonH - 1].n}`)}${ci(ZI.orbit, `<b>التراجع</b> ${L.rxN.length ? L.rxN.join("، ") : "لا كوكب راجع الآن"}`)}</div>`;
    const aspHTML = L.aspects.length ? `<div class="sg-cells">${cellsHTML(curList.as, "as")}</div>` : `<p class="sg-empty">لا زوايا قوية على برجك في هذه اللحظة، فالسماء هادئة نسبيًا.</p>`;
    return `${glance}<div class="sg-trbox"><p class="sg-tap"><span aria-hidden="true">${AICs.more}</span>اضغط على أي عبور أو زاوية لقراءة تأثيرها الكامل</p>
      <section class="sg-sec">${secH(ZI.orbit, "الكواكب العابرة في بيوت برجك")}<div class="sg-cells">${cellsHTML(curList.tr, "tr")}</div></section>
      <section class="sg-sec">${secH(ZI.orbit, "الزوايا المؤثرة على برجك")}${aspHTML}</section></div>`;
  }
  function periodsTab(i, L) {
    curList = { near: L.near, mid: L.mid, far: L.far };
    const P = [["near", "المدى السريع"], ["mid", "الكواكب الشخصية"], ["far", "الكواكب البطيئة"]];
    const per = `<div class="sg-tabs sg-tabs-per" role="tablist" aria-label="الفترات">${P.map(t => `<button type="button" role="tab" data-sgper="${t[0]}" aria-selected="${signsPer === t[0]}">${t[1]}</button>`).join("")}</div>`;
    if (signsPer === "near" && L.near[0] && L.near[0].k === "moon" && !L.near[0].__h) { const m = L.near[0]; m.__h = 1; m.when = "اضغط لقراءة حركة القمر وتفاصيلها"; }
    const caps = { mid: "دورات الشمس وعطارد والزهرة والمريخ الممتدة لأسابيع وشهور", far: "دورات المشتري وزحل وأورانوس ونبتون وبلوتو الممتدة لسنوات" };
    const rows = rowsHTML(curList[signsPer], signsPer).replace(/\s*\(راجع\)/g, "");
    return `<section class="sg-sec">${per}<p class="sg-tap"><span aria-hidden="true">${AICs.more}</span>اضغط على أي كوكب لقراءة تأثيره الكامل على فترتك</p>
      <article class="sg-per sg-per-one">${caps[signsPer] ? `<p class="sg-cap">${caps[signsPer]}</p>` : ""}<div class="sg-rows">${rows}</div></article></section>`;
  }
  function traitsTab(i) {
    const s = SIGNS[i];
    curList = { sec: SIGN_SECS.map((x, j) => ({ svg: x.g, g: "", t: x.t, sub: `قسم ${nAr(j + 1)} من ${nAr(SIGN_SECS.length)}`, html: signSectionContent(i, j) })) };
    const grid = curList.sec.map((it, n) => `<button type="button" class="sg-med" data-sgrow="sec:${n}"><span class="sg-medal" aria-hidden="true">${it.svg}</span><b>${it.t}</b><span class="sg-go" aria-hidden="true">التفاصيل</span></button>`).join("");
    return `<section class="sg-sec"><p class="sg-tap"><span aria-hidden="true">${AICs.more}</span>اضغط على أي صفة لاكتشاف عمقها النفسي</p><div class="sg-grid">${grid}</div></section>`;
  }
  function renderSign() {
    const i = signCur, main = signsMode === "traits" ? "traits" : "forecast";
    let body, sub = "";
    if (main === "traits") body = traitsTab(i);
    else {
      const L = signLive(i);
      sub = `<div class="sg-tabs sg-tabs-sub" role="tablist" aria-label="أقسام التوقعات">${subTabs.map(t => `<button type="button" role="tab" data-sgsub="${t[0]}" aria-selected="${signsSub === t[0]}"><i class="sg-sti" aria-hidden="true">${{ pulse: ZI.sparkorb, transits: ZI.orbit, periods: ZI.crescent }[t[0]]}</i><span>${t[1]}</span></button>`).join("")}</div>`;
      body = signsSub === "transits" ? transitsTab(i, L) : signsSub === "periods" ? periodsTab(i, L) : pulseTab(i, L);
    }
    cur.querySelectorAll("[data-sgtab]").forEach(b => b.setAttribute("aria-selected", String(b.dataset.sgtab === main)));
    panel.innerHTML = `${sub}${body}`;
  }
  window.__aqSignsRerender = () => { try { if (panel && panel.innerHTML) renderSign(); } catch (e) {} };
  cur.addEventListener("click", e => {
    const t = e.target.closest("[data-sgtab]"); if (t && t.dataset.sgtab !== signsMode) { setMode(t.dataset.sgtab); toTop(); }
  });
  panel.addEventListener("click", e => {
    const u = e.target.closest("[data-sgsub]"); if (u) { if (u.dataset.sgsub !== signsSub) { signsSub = u.dataset.sgsub; renderSign(); toTop(); } return; }
    const pt = e.target.closest("[data-sgper]"); if (pt) { if (pt.dataset.sgper !== signsPer) { signsPer = pt.dataset.sgper; renderSign(); } return; }
    const r = e.target.closest("[data-sgrow]"); if (r) { const [key, n] = r.dataset.sgrow.split(":"); sgShow(curList[key], +n); }
  });
  function pickSign(i) {
    signCur = i; try { localStorage.setItem("aq-sky-sign", i); } catch (e) {}
    pbtns.forEach((b, j) => b.setAttribute("aria-pressed", j === i ? "true" : "false"));
    sgBar.hidden = false; signsSec.classList.add("sg-picked");
    sgBar.querySelector(".sg-bar-id").innerHTML = `${bdg(SIGNS[i].g)}<span class="sg-bar-t"><span class="sg-bar-l1"><b>${SIGNS[i].n}</b><small>${SIGNS[i].d}</small></span><span class="sg-bar-l2"><i>${ELEMENTS[SIGNS[i].el].adj}</i><i>الحاكم: ${PLANETS[SIGNS[i].ruler].n}</i></span></span>`;
    setCurtain(false); renderSign();
  }
  SIGNS.forEach((s, i) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "sg-pick";
    b.innerHTML = `${bdg(s.g)}<span>${s.n}</span>`;
    b.addEventListener("click", () => { pickSign(i); toTop(); }); picker.appendChild(b); pbtns.push(b);
  });
  (function () {
    let d = -1; try { const v = parseInt(localStorage.getItem("aq-sky-sign"), 10); if (v >= 0 && v < 12) d = v; } catch (e) {}
    if (d < 0) { try { d = Astro.chart({ utcMs: Date.now(), lat: 30, lon: 31, known: false }).bodies.find(b => b.key === "sun").sign; } catch (e) { d = 0; } }
    pickSign(d);
  })();
  (function () { const ks = ["mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"]; let n = 0; const step = () => { if (n >= ks.length) return; try { nextIngress(ks[n++], Date.now()); } catch (e) {} setTimeout(step, 150); }; window.addEventListener("load", () => setTimeout(step, 2500)); })();
  window.addEventListener("hashchange", () => { if (location.hash !== "#signs") sgClose(); });
  const glyphs = $("#glyphs");
  SIGNS.forEach((s, i) => {
    const a = (-90 + i * 30) * Math.PI / 180, x = (200 + Math.cos(a) * 148).toFixed(2), y = (200 + Math.sin(a) * 148).toFixed(2);
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "wg"); g.setAttribute("role", "button"); g.setAttribute("tabindex", "0"); g.setAttribute("aria-label", "توقعات برج " + s.n);
    g.style.setProperty("--i", i);
    g.innerHTML = `<circle class="hit" cx="${x}" cy="${y}" r="21"/><text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">${gl(s.g)}</text>`;
    const go = () => { signsMode = "forecast"; setMode("forecast"); pickSign(i); location.hash = "#signs"; };
    g.addEventListener("click", go);
    g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    glyphs.appendChild(g);
  });

  /* ---------- الكورسات والفيديوهات ---------- */
  const cl = $("#courses-list") || document.createElement("ul");
  if (COURSES.length) {
    cl.innerHTML = COURSES.map(c => `<li class="course"><div class="cbody"><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p><p class="meta">${esc(c.level || "")}${c.price ? ` | ${esc(c.price)}` : ""}${c.soon ? ` <span class="soon">قريبًا</span>` : ""}</p></div>${c.link ? `<a class="btn ghost" href="${esc(c.link)}" target="_blank" rel="noopener">اشترك دلوقتي</a>` : ""}</li>`).join("");
  } else {
    cl.innerHTML = `<li class="course"><div class="cbody"><h3>الكورسات قريبًا</h3><p>بجهز كورسات تعلّم الفلك ومصفوفة القدر خطوة بخطوة. تابعني على انستجرام عشان تعرف أول بأول.</p></div><a class="btn ghost" data-ig-link href="#">تابعني على انستجرام</a></li>`;
  }
  const ytId = u => { const m = String(u).match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/); return m ? m[1] : null; };
  const vl = $("#videos-list") || document.createElement("ul");
  if (VIDEOS.length) {
    vl.innerHTML = VIDEOS.map(v => { const id = ytId(v.url); return `<li><a class="vid" href="${esc(v.url)}" target="_blank" rel="noopener"><span class="thumb">${id ? `<img loading="lazy" alt="" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg">` : ""}<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="rgba(18,8,42,.7)" stroke="#D6AE5E"/><path d="M10 8l6 4-6 4z" fill="#C5A46D"/></svg></span><span class="vt">${esc(v.title)}</span></a></li>`; }).join("");
  } else {
    vl.innerHTML = `<li class="vempty">الفيديوهات قريبًا.</li>`;
  }
  /* ============ ميزات إضافية: ماتريكس، حيوات سابقة، توقعات يومية ============ */
  function wireTabs(root) {
    const tabs = $$("[role=tab]", root), panels = $$("[role=tabpanel]", root);
    tabs.forEach((t, i) => t.addEventListener("click", () => tabs.forEach((x, j) => {
      x.setAttribute("aria-selected", i === j ? "true" : "false"); x.tabIndex = i === j ? 0 : -1; panels[j].hidden = i !== j;
    })));
  }
  function bindContact(root) {
    $$("[data-wa-link]", root).forEach(a => { a.href = waLink(MSG.general); openWA(a); });
    $$("[data-ig-link]", root).forEach(a => { a.href = `https://instagram.com/${IG_USER}`; openWA(a); });
  }
  const CONTACT_LINE = "";
  const NOTE_SYM = ``;

  /* ---------- نصوص أعمق للكوكب في البيت ---------- */
  function deepHouse(k, h, mode) {
    const s = HOUSE_SIT[h - 1];
    return `${planetInHouse(k, h, mode)} ممكن يظهر ده في مواقف زي: ${s[0]}، أو ${s[1]}، أو ${s[2]}. والجانب الصعب (${PLANETS[k].watch}) بيزيد لو ${HOUSE_TRIG[h - 1]}.`;
  }

  /* ---------- توقعات يومية لكل برج (من حركة الكواكب الحقيقية) ---------- */
  function dailySign(i) {
    const now = Astro.chart({ utcMs: Date.now(), lat: 30, lon: 31, known: false });
    const nb = k => now.bodies.find(b => b.key === k);
    const hOf = k => ((nb(k).sign - i + 12) % 12) + 1;
    const dt = new Date().toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" });
    const mh = hOf("moon");
    const acc = (ic, t, body, cls, open, sub) => `<details class="lpa-card ${cls || ""} zd-acc"${open ? " open" : ""}><summary class="lpa-sum"><span class="lpa-ic">${ic}</span><span class="lpa-t">${t}</span>${sub ? `<small class="lpa-sub">${sub}</small>` : ""}<span class="lpa-chev"></span></summary><div class="lpa-body">${body}</div></details>`;
    let o = `<div class="fcs zd-daily"><h4 class="ph">توقعات النهاردة، ${dt}</h4>`;
    o += acc(gl("☽"), `طاقة يومك (القمر في بيتك ${HOUSES[mh - 1].n})`, `<p>${moonDay(mh)}</p>`, "", true);
    return o + `${NOTE_SYM}</div>`;
  }

  /* ---------- مجالات حياتك (تحليل أعمق للخريطة) ---------- */
  function houseLine(ch, h) {
    const S = SIGNS[Math.floor(ch.cusps[h - 1] / 30)];
    const ten = ch.bodies.filter(b => PLANET_KEYS.includes(b.key) && b.house === h);
    let t = `بيتك ${HOUSES[h - 1].n} (${HOUSES[h - 1].area}) بيبدأ في برج ${S.n}، يعني بتتعامل معاه بأسلوب ${S.way}.`;
    if (ten.length) t += ` وفيه ${ten.map(b => PLANETS[b.key].n).join(" و")}، فالموضوع ده بياخد حيز كبير من حياتك.`;
    else { const rb = body(ch, S.ruler); t += ` وهو فاضي من الكواكب، فبيتحرك بحاكمه ${PLANETS[S.ruler].n} الموجود في برج ${SIGNS[rb.sign].n} وبيتك ${HOUSES[rb.house - 1].n}.`; }
    return t;
  }
  function areasHTML(ch) {
    if (!ch.known) return `<p>تحليل مجالات حياتك محتاج وقت الميلاد عشان نعرف البيوت. اكتب وقت ميلادك وجرّب تاني.</p>`;
    const v = body(ch, "venus"), mr = body(ch, "mars"), mo = body(ch, "moon"), sa = body(ch, "saturn"), nd = body(ch, "truenode");
    const mcS = SIGNS[Math.floor(ch.mc / 30)];
    const sec = (t, a) => `<h4 class="ph">${t}</h4>` + a.map(x => `<article class="rd"><p>${x}</p></article>`).join("");
    return sec("الحب والعلاقات", [
      houseLine(ch, 7),
      `الزهرة (طريقة حبك) في ${SIGNS[v.sign].n}. ${VENUS_EL[SIGNS[v.sign].el]} ${deepHouse("venus", v.house)}`,
      `المريخ (انجذابك ورغبتك) في ${SIGNS[mr.sign].n}. ${deepHouse("mars", mr.house)}`,
      houseLine(ch, 5)
    ]) + sec("الشغل والفلوس", [
      `${houseLine(ch, 10)} ووسط السما في ${mcS.n}، فالناس بتشوف شغلك بأسلوب ${mcS.way}.`,
      houseLine(ch, 2),
      houseLine(ch, 6),
      `زحل (الاختبار الي بيبني مسارك) في ${SIGNS[sa.sign].n}. ${deepHouse("saturn", sa.house)}`
    ]) + sec("نفسيتك والجرح والشفاء", [
      `القمر (احتياجك العاطفي) في ${SIGNS[mo.sign].n}. ${deepHouse("moon", mo.house)}`,
      `نصيحة تحرير: ${MOON_ADVICE[mo.sign]}`,
      houseLine(ch, 12),
      houseLine(ch, 4)
    ]) + sec("رسالتك في الحياة", [
      `العقدة الشمالية في ${SIGNS[nd.sign].n} وبيتك ${HOUSES[nd.house - 1].n}: اتجاه نموك بيمر عن طريق ${HOUSES[nd.house - 1].area}، وبتنمّي فيه ${SIGNS[nd.sign].strength}.`
    ]) + NOTE_SYM;
  }

  /* ============ مصفوفة القدر: النسخة المفصلة ============ */
  const digSum = n => String(n).split("").reduce((s, c) => s + +c, 0);
  const redArc = n => { while (n > 22) n = digSum(n); return n; };
  const ARC = n => ARCANA[n - 1];
  const OUTER = ["A", "F", "B", "G", "C", "H", "D", "I"];
  const MX_POS = { A: [60, 200], F: [60, 60], B: [200, 60], G: [340, 60], C: [340, 200], H: [340, 340], D: [200, 340], I: [60, 340], E: [200, 200] };
  const MX_MID = [[60, 130], [130, 60], [270, 60], [340, 130], [340, 270], [270, 340], [130, 340], [60, 270]];
  const MX_STAGE = ["الطفولة وتشكّل الطبع", "المراهقة وبداية الهوية", "الانطلاقة وبناء الطريق", "الاستقرار والاختبارات", "المراجعة وإعادة الترتيب", "النضج والثمار", "الحكمة والتبسيط", "الإرث والسلام"];
  const MX_ROLE = {
    A: { n: "شخصيتك وموهبتك الأساسية", intro: "ده الطبع الي اتولدت بيه وبتتحرك بيه من غير مجهود", real: "ومعناه عمليًا في شغلك وتصرفاتك اليومية:" },
    B: { n: "هدفك ورسالتك", intro: "ده الاتجاه الي حياتك بتشدك ناحيته", real: "هتلاقيه في اختياراتك ومواقف بتتكرر معاك:" },
    C: { n: "الي ورثته من العيلة والماضي", intro: "ده الي وصلك من الأهل والبيئة وبيأثر في ردود أفعالك", real: "وبيتجسد غالبًا في بيتك وعلاقتك بأهلك:" },
    D: { n: "الذيل الكارمي (الدرس المتكرر)", intro: "ده الدرس الي بيتكرر معاك لحد ما تتعلمه", real: "وبيتكرر في مواقف وناس بتحسها مألوفة:" },
    E: { n: "جوهرك ومنطقة راحتك", intro: "ده قلبك الحقيقي والمكان الي بترجعله لما تتعب", real: "وبتحس بيه لما تبقى على طبيعتك:" },
    F: { n: "شغلك وتعبيرك عن نفسك", intro: "ده اللون الي بيظهر في شغلك وإبداعك", real: "وفي الشغل بيتجسد في:" },
    G: { n: "الفلوس والفرص", intro: "ده الي بيشكل علاقتك بالفلوس والفرص", real: "وفي الفلوس بيظهر في:" },
    H: { n: "الحب والعلاقات", intro: "ده الي بيتحكم في طريقة حبك وعلاقاتك", real: "وفي الحب بيظهر في:" },
    I: { n: "نقطة الاختبار الي بتكبرك", intro: "ده الموضوع الي حياتك بتختبرك فيه عشان تنضج", real: "وبيظهر في مواقف بتختبرك:" }
  };
  const MX_REL = {
    A: { n: "شخصية العلاقة", intro: "ده الطابع الي بيظهر لما تبقوا مع بعض", real: "والناس حواليكم بتشوفه في:" },
    B: { n: "هدف العلاقة", intro: "ده الي العلاقة دي جاية تعلمكم أو تبنيه", real: "وهتلاقيه في المواقف الي بتتكرر بينكم:" },
    C: { n: "الي بتشيلوه من الماضي سوا", intro: "ده الي كل واحد فيكم جاي بيه من أهله وماضيه", real: "وبيظهر في خلافاتكم على:" },
    D: { n: "الدرس الكارمي بينكم", intro: "ده الدرس الي العلاقة دي بتعلمهولكم", real: "وبيتكرر بينكم في:" },
    E: { n: "قلب العلاقة", intro: "ده جوهر العلاقة والحاجة الي بتشدكم لبعض", real: "وبتحسوا بيه لما تكونوا على طبيعتكم:" },
    G: { n: "الفلوس والفرص بينكم", intro: "ده الي بيشكل الفلوس والفرص لما تتشاركوا", real: "وبيظهر في:" },
    H: { n: "الحب والانجذاب بينكم", intro: "ده الي بيتحكم في الحب والانجذاب بينكم", real: "وبيظهر في:" }
  };
  const MX_SHORT = { A: "الشخصية", B: "الهدف", C: "الأهل", D: "الكارما", E: "الجوهر", F: "الشغل", G: "الفلوس", H: "الحب", I: "الاختبار" };
  const MX_NOTE = `<p class="note">مصفوفة القدر نظام رمزي ليه أكتر من مدرسة، وأسماء النقاط ومعانيها بتختلف بين مدرسة وتانية. ده حساب النسخة الشائعة، وهو للتأمل والوعي بالنفس مش للتنبؤ القاطع. وأسماء زي الموت والشيطان والبرج رمزية، ومعناها التحول والتعلق والتغيير المفاجئ، مش حاجة سيئة بتحصل حرفيًا.</p>`;

  function matrixCalc(d, m, y) {
    const A = redArc(d), B = redArc(m), C = redArc(y), D = redArc(A + B + C), E = redArc(A + B + C + D);
    const P = { A, B, C, D, E, F: redArc(A + B), G: redArc(B + C), H: redArc(C + D), I: redArc(D + A) };
    ["A", "B", "C", "D", "F", "G", "H", "I"].forEach(k => { P[k + "2"] = redArc(P[k] + E); });
    P.mid = OUTER.map((k, i) => redArc(P[k] + P[OUTER[(i + 1) % 8]]));
    P.sky = redArc(B + D); P.earth = redArc(A + C); P.self = redArc(P.sky + P.earth);
    // طاقة السنة شخصية: تبدأ من عيد الميلاد وتستمر حتى عيد الميلاد التالي.
    const _t = new Date(), _cy = _t.getFullYear() - ((_t.getMonth() + 1 < m || (_t.getMonth() + 1 === m && _t.getDate() < d)) ? 1 : 0);
    P.year = redArc(A + B + redArc(digSum(_cy)));
    return P;
  }
  function lifePath(d, m, y) { return window.AqeqLifePathCore.lifePath(d, m, y); } /* الدالة المرجعية الوحيدة: assets/js/aqeeq-lifepath-core.js */
  function ageNow(d, m, y) {
    const t = new Date(); let a = t.getFullYear() - y;
    if (t.getMonth() + 1 < m || (t.getMonth() + 1 === m && t.getDate() < d)) a--;
    return a;
  }

  function matrixSVG(P, cur) {
    let o = `<svg class="mx" viewBox="-14 -14 428 428" role="img" aria-label="مصفوفة القدر"><rect class="mxl" x="60" y="60" width="280" height="280"/><polygon class="mxl" points="200,60 340,200 200,340 60,200"/><path class="mxl faint" d="M60 200H340M200 60V340M60 60L340 340M340 60L60 340"/>`;
    if (cur != null) {
      const [x1, y1] = MX_POS[OUTER[cur]], [x2, y2] = MX_POS[OUTER[(cur + 1) % 8]];
      o += `<line class="mxcur" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }
    OUTER.forEach(k => {
      const [x, y] = MX_POS[k], ix = (x + 200) / 2, iy = (y + 200) / 2;
      o += `<g class="mxi"><circle cx="${ix}" cy="${iy}" r="17"/><text class="mnum sm" x="${ix}" y="${iy}">${P[k + "2"]}</text></g>`;
    });
    MX_MID.forEach(([x, y], i) => { o += `<g class="mxm"><circle cx="${x}" cy="${y}" r="15"/><text class="mnum sm" x="${x}" y="${y}">${P.mid[i]}</text></g>`; });
    OUTER.concat("E").forEach((k, i) => {
      const [x, y] = MX_POS[k], c = k === "E", r = c ? 32 : 25;
      o += `<g class="mxn${c ? " ctr" : ""}"><circle cx="${x}" cy="${y}" r="${r}"/><text class="mnum" x="${x}" y="${y}">${P[k]}</text>`;
      if (!c) {
        const dx = x - 200, dy = y - 200, L = Math.hypot(dx, dy), lx = (x + dx / L * (r + 14)).toFixed(1), ly = (y + dy / L * (r + 14)).toFixed(1);
        o += `<text class="mlet" x="${lx}" y="${(+ly - 2).toFixed(1)}">${k}</text><text class="mage" x="${lx}" y="${(+ly + 10).toFixed(1)}">${i * 10}</text>`;
      } else o += `<text class="mlet" x="200" y="${y - 38}">E</text>`;
      o += `</g>`;
    });
    return o + "</svg>";
  }

  function roleCard(k, P, R) {
    const a = ARC(P[k]), r = R[k];
    return `<details class="acc mxd"><summary><span class="sg" aria-hidden="true">${k}</span> ${r.n}: ${a.n} <span class="hs">رقم ${P[k]}</span></summary><div class="mxb"><p>${r.intro}. ${a.core}.</p><p class="sub">${r.real} ${a.real}</p>${a.psy ? `<p class="sub">نفسيًا: ${a.psy}</p>` : ""}<p class="sub">انتبه من: ${a.shadow}.</p><p class="sub">خطوة عملية: ${a.release}</p></div></details>`;
  }
  const mxs = (t, p) => `<article class="rd"><h4>${t}</h4><p>${p}</p></article>`;

  function getDMD(n) {
    if (window.AqeeqDestinyMatrixData && typeof window.AqeeqDestinyMatrixData.getArcana === 'function') {
      return window.AqeeqDestinyMatrixData.getArcana(n);
    }
    const a = ARC(n) || {};
    return {
      number: n,
      title: a.n || ('أركانا ' + n),
      archetype: a.real || '',
      paradox: a.psy || '',
      light: a.core || '',
      shadow: a.shadow || '',
      somaticRelease: a.release || '',
      psychosomatics: '',
      positions: {},
      transformationProtocol: [],
      reflectiveQuestions: [],
      taboos: {}
    };
  }

  function getTailDMD(c1, c2, c3) {
    if (window.AqeeqDestinyMatrixData && typeof window.AqeeqDestinyMatrixData.getKarmicTail === 'function') {
      return window.AqeeqDestinyMatrixData.getKarmicTail(c1, c2, c3);
    }
    return {
      code: c1 + '-' + c2 + '-' + c3,
      title: 'الذيل الكارمي (' + c1 + '-' + c2 + '-' + c3 + ')',
      paradox: '',
      childhoodRoots: '',
      tracks: {},
      psychosomatics: '',
      transformationProtocol: [],
      closingConfrontation: ''
    };
  }

  function summaryHTML(P, lp) {
    const a = getDMD(P.A);
    const b = getDMD(P.B);
    const c = getDMD(P.C);
    const dd = getDMD(P.D);
    const e = getDMD(P.E);
    const sky = getDMD(P.sky);
    const earth = getDMD(P.earth);
    const self = getDMD(P.self);
    const yr = getDMD(P.year);
    const kMid = redArc(P.D + P.E);
    const kInner = redArc(P.D + kMid);
    const tail = getTailDMD(P.D, kMid, kInner);

    let o = '<div class="bond-cat"><strong>ملخص مصفوفتك الشامل والتحليلي</strong>' +
      '<p><b>طبعك وانطباعك الخارجي:</b> ' + esc(a.title) + '.<br>' +
      '<b>اتصالك الروحي ورسالتك:</b> ' + esc(b.title) + '.<br>' +
      '<b>جوهرك وراحة قلبك (المركز):</b> ' + esc(e.title) + '.<br>' +
      '<b>الدرس الكارمي المتكرر:</b> ' + esc(tail.title) + '.</p></div>';

    o += mxs('المفارقة النفسية والتوتر الوجودي لجوهرك', e.paradox || (e.title + ': ' + e.archetype));
    o += mxs('أقوى ما فيك في النور (+)', a.title + ': ' + (a.light || a.archetype));
    o += mxs('الفخ الذي يعطلك في الظل (-)', e.title + ': ' + (e.shadow || e.archetype));
    o += mxs('البصمة الجسدية والسوماتيكية لراحتك', e.psychosomatics || e.somaticRelease || 'التنفس العميق وتفريغ الشحن الذهني بالرياضة.');
    if (e.somaticRelease) o += mxs('مفتاح التفريغ السوماتيكي', e.somaticRelease);

    o += '<h4 class="ph">رسالتك في الحياة ومحاور الاتصال</h4>';
    o += mxs('محور السماء الروحي: ' + sky.title, 'ما تتعلمه روحياً في الباطن: ' + (sky.archetype || sky.light));
    o += mxs('محور الأرض المادي: ' + earth.title, 'ما تبنيه وتجسده في الواقع الملموس: ' + (earth.positions?.money || earth.light));
    o += mxs('الهدف الشخصي المتكامل: ' + self.title, self.archetype + '. مفتاح التحول: ' + (self.growthStep || self.somaticRelease || self.light));

    o += '<h4 class="ph">طاقة رقمك وسنتك الحالية</h4>';
    o += mxs('مسار الحياة', (LP_TXT[lp] || ('مسار رقم ' + lp)) + ' <a href="#lifepath" data-open-lp>شوف مسار حياتك بالتفصيل</a>');
    o += mxs('طاقة سنتك الحالية: ' + yr.title, (yr.headline || yr.archetype) + '. الخطوة الواعية: ' + (yr.growthStep || yr.somaticRelease || yr.light));

    return o + MX_NOTE;
  }

  function pointsHTML(P) {
    let o = '<p class="lead2">اضغط على أي نقطة تفتح تشريحها الكامل: معناها، ظهورها في الواقع، فخ الظل، البصمة الجسدية، والخطوة العملية المباشرة.</p>';
    const outerKeys = 'ABCDEFGHI'.split('');
    o += outerKeys.map(k => {
      const num = P[k];
      const d = getDMD(num);
      const role = MX_ROLE[k] || { t: k, sub: 'نقطة في المصفوفة' };
      return '<details class="acc mxd"><summary><span class="sg" aria-hidden="true">' + k + '</span> ' + esc(role.t) + ': ' + esc(d.title) + ' <span class="hs">طاقة ' + num + '</span></summary>' +
        '<div class="mxb">' +
        '<p class="sub"><b>الدور في الخريطة:</b> ' + esc(role.sub) + '</p>' +
        '<p><b>التشريح والظهور الواقعي:</b> ' + esc(d.archetype || d.light) + '</p>' +
        (d.paradox ? '<p><b>المفارقة النفسية:</b> ' + esc(d.paradox) + '</p>' : '') +
        '<p style="color:var(--burgundy);"><b>فخ الظل (-):</b> ' + esc(d.shadow) + '</p>' +
        '<p style="color:var(--aq-success);"><b>طاقة النور (+):</b> ' + esc(d.light) + '</p>' +
        (d.psychosomatics ? '<p><b>العلامة الجسدية والسوماتيكية:</b> ' + esc(d.psychosomatics) + '</p>' : '') +
        '<p class="sub"><b>الخطوة العملية المباشرة:</b> ' + esc(d.growthStep || d.somaticRelease || 'الملاحظة الواعية للنمط اليومي.') + '</p>' +
        '</div></details>';
    }).join('');

    o += '<h4 class="ph">النقاط الداخلية (تفعيل الجوهر في المجالات)</h4><p class="sub">توضح كل نقطة داخلية كيف يتصل مجالك الخارجي بمركز روحك (E)، وتُحسب بجمع النقطة مع المركز.</p>';
    o += ['A', 'B', 'C', 'D', 'F', 'G', 'H', 'I'].map(k => {
      const num = P[k + '2'];
      const d = getDMD(num);
      return '<details class="acc mxd"><summary><span class="sg" aria-hidden="true">' + k + '</span> ' + esc(MX_SHORT[k] || k) + ' من جوه: ' + esc(d.title) + ' <span class="hs">رقم ' + num + '</span></summary>' +
        '<div class="mxb">' +
        '<p><b>المعنى الباطني:</b> ' + esc(d.archetype || d.light) + '</p>' +
        '<p style="color:var(--burgundy);"><b>فخ الظل الداخلي:</b> ' + esc(d.shadow) + '</p>' +
        '<p class="sub"><b>خطوة التوازن:</b> ' + esc(d.growthStep || d.somaticRelease || d.light) + '</p>' +
        '</div></details>';
    }).join('');

    return o + MX_NOTE;
  }

  function stagesHTML(P, age) {
    const ac = age % 80;
    const i = Math.floor(ac / 10);
    const half = (ac % 10) < 5 ? 0 : 1;
    const st = k => ({
      s: getDMD(P[OUTER[k]]),
      m: getDMD(P.mid[k]),
      e: getDMD(P[OUTER[(k + 1) % 8]])
    });
    const c = st(i);
    const dom = half === 0 ? c.s : c.m;

    let o = '<p class="lead2">عمرك دلوقتي ' + age + ' سنة' + (age >= 80 ? ' (بعد الـ٨٠ تبدأ الدورة من جديد)' : '') + '. تقسم مصفوفة القدر العمر إلى 8 مراحل كل مرحلة 10 سنوات، لكل مرحلة طاقة بداية ومنتصف ونهاية:</p>';
    
    o += '<div class="bond-cat"><strong>مرحلتك الحالية: ' + esc(MX_STAGE[i] || ('سنوات ' + (i * 10) + ' إلى ' + (i * 10 + 10))) + '</strong>' +
      '<p>من عمر ' + (i * 10) + ' لعمر ' + (i * 10 + 10) + '.<br>' +
      'بدايتها: ' + esc(c.s.title) + ' · منتصفها: ' + esc(c.m.title) + ' · نهايتها: ' + esc(c.e.title) + '.<br>' +
      (half === 0 ? 'أنت في النصف الأول من المرحلة، وتسيطر عليك طاقة ' + esc(c.s.title) + ' وتتحول نحو ' + esc(c.m.title) + '.' : 'أنت في النصف الثاني، وتتحول طاقة ' + esc(c.m.title) + ' نحو ' + esc(c.e.title) + '.') + '</p></div>';

    o += mxs('ما يواجهك في واقعك اليوم', dom.archetype || dom.light);
    o += mxs('التشريح النفسي والتوتر الداخلي', dom.paradox || dom.archetype);
    o += mxs('فخ الظل الذي يجب تجنبه (-)', dom.shadow);
    o += mxs('البصمة الجسدية والسوماتيكية', dom.psychosomatics || 'مراقبة التنفس ومستوى التوتر في الجسم.');
    o += mxs('الخطوة العملية للعبور بنجاح (+)', dom.growthStep || dom.somaticRelease || dom.light);

    o += '<h4 class="ph">جميع مراحل العمر الثمانية (0 إلى 80 سنة)</h4>';
    o += [0, 1, 2, 3, 4, 5, 6, 7].map(idx => {
      const stage = st(idx);
      const isCur = idx === i;
      return '<details class="acc mxd"' + (isCur ? ' open' : '') + '><summary><span class="sg" aria-hidden="true">' + (idx * 10) + 'y</span> ' + esc(MX_STAGE[idx] || ('مرحلة ' + (idx * 10) + '-' + (idx * 10 + 10))) + (isCur ? ' <b style="color:var(--burgundy);">[مرحلتك الآن]</b>' : '') + '</summary>' +
        '<div class="mxb">' +
        '<p><b>البداية (' + (idx * 10) + ' سنة):</b> ' + esc(stage.s.title) + '</p>' +
        '<p><b>المنتصف (' + (idx * 10 + 5) + ' سنة):</b> ' + esc(stage.m.title) + '</p>' +
        '<p><b>النهاية (' + (idx * 10 + 10) + ' سنة):</b> ' + esc(stage.e.title) + '</p>' +
        '<p><b>توجيه المرحلة:</b> ' + esc(stage.s.light) + '</p>' +
        '</div></details>';
    }).join('');

    return o + MX_NOTE;
  }

  function karmaHTML(P, lp) {
    const kMid = redArc(P.D + P.E);
    const kInner = redArc(P.D + kMid);
    const tail = getTailDMD(P.D, kMid, kInner);
    const dBase = getDMD(P.D);
    const cMat = getDMD(P.C);

    let o = '<p class="lead2">الذيل الكارمي هو العقدة الروحية الأعمق في اللاوعي؛ يمثل الدروس غير المكتملة وأنماط الطفولة التي تتكرر تلقائياً حتى يتم تفكيكها بوعي.</p>';

    o += '<div class="bond-cat"><strong style="font-size:1.15rem;color:var(--burgundy);">' + esc(tail.title) + ' (شفرة ' + esc(tail.code) + ')</strong>' +
      '<p><b>الجرح المؤسس والتوتر الكارمي:</b> ' + esc(tail.paradox) + '</p>' +
      '<p><b>جذور الطفولة والصدمة التأسيسية:</b> ' + esc(tail.childhoodRoots) + '</p></div>';

    if (tail.tracks && (tail.tracks.trackOne || tail.tracks.trackTwo)) {
      o += '<div class="aqm-karmic-tracks" style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem;margin:.85rem 0;">' +
        '<div style="background:#FAF7F0;border:1px solid rgba(120,47,59,0.28);border-radius:10px;padding:.95rem;">' +
        '<h5 style="color:var(--burgundy);margin:0 0 .4rem 0;">المسار الأول (الظل النشط)</h5><p style="font-size:.9rem;line-height:1.6;">' + esc(tail.tracks.trackOne || '') + '</p></div>' +
        '<div style="background:#F4EFE5;border:1px solid rgba(184,153,96,0.45);border-radius:10px;padding:.95rem;">' +
        '<h5 style="color:var(--ink-brown);margin:0 0 .4rem 0;">المسار الثاني (الكبت والانسحاب)</h5><p style="font-size:.9rem;line-height:1.6;">' + esc(tail.tracks.trackTwo || '') + '</p></div>' +
        '</div>';
    }

    if (tail.psychosomatics) {
      o += mxs('الأعراض السوماتيكية واحتقانات الجسد للذيل', tail.psychosomatics);
    }

    if (Array.isArray(tail.transformationProtocol) && tail.transformationProtocol.length) {
      o += '<div style="background:#FAF7F0;border:1px solid rgba(78,110,88,0.35);border-radius:10px;padding:.95rem;margin:.85rem 0;">' +
        '<h4 style="color:var(--aq-success);margin:0 0 .5rem 0;">بروتوكول تفكيك العقدة الكارمية</h4><ol style="margin:0;padding-right:1.2rem;line-height:1.7;">' +
        tail.transformationProtocol.map(s => '<li>' + esc(s) + '</li>').join('') +
        '</ol></div>';
    }

    if (tail.closingConfrontation) {
      o += mxs('المواجهة الختامية', tail.closingConfrontation);
    }

    o += '<h4 class="ph">إرث العائلة والأسلاف الموروث</h4>';
    o += mxs('طاقة الأهل المادية: ' + cMat.title, 'ما ورثته من العائلة يظهر في: ' + cMat.archetype + '. احذر من تكرار الظل الأسري: ' + cMat.shadow + '. خطوة كسر النمط: ' + (cMat.growthStep || cMat.somaticRelease || cMat.light));

    return o + MX_NOTE;
  }

  function compatHTML(P1, P2) {
    const R = {};
    // منهج لاديني: تُجمع الأركان الأربعة الأساسية فقط، ثم يُعاد توليد باقي خريطة التوافق منها.
    ['A', 'B', 'C', 'D'].forEach(k => { R[k] = redArc(P1[k] + P2[k]); });
    R.E = redArc(R.A + R.B + R.C + R.D);
    R.F = redArc(R.A + R.B); R.G = redArc(R.B + R.C); R.H = redArc(R.C + R.D); R.I = redArc(R.D + R.A);
    const e = getDMD(R.E);
    const a = getDMD(R.A);
    const b = getDMD(R.B);
    const d = getDMD(R.D);
    const moneyChannel = redArc(R.C + R.E);
    const loveChannel = redArc(R.D + R.E);
    const arcLove = getDMD(loveChannel);
    const arcMoney = getDMD(moneyChannel);

    let o = '<p class="lead2">تُحسب مصفوفة العلاقة بجمع نقاط المصفوفتين هندسياً نقطة بنقطة؛ فتكشف عن كيمياء العلاقة نفسها ككيان طاقي ثالث مستقل عن رغبات الفردين:</p>';

    o += '<div class="bond-cat"><strong style="font-size:1.15rem;color:var(--burgundy);">قلب وغاية العلاقة: ' + esc(e.title) + ' (طاقة ' + R.E + ')</strong>' +
      '<p><b>الرسالة الروحية المشتركة:</b> ' + esc(e.archetype || e.light) + '</p>' +
      '<p><b>سر انسجام العلاقة واستمرارها:</b> ' + esc(e.light) + '</p>' +
      '<p style="color:var(--burgundy);"><b>الفخ الذي يهدد الشراكة بالانفصال:</b> ' + esc(e.shadow) + '</p></div>';

    o += '<div class="aqm-pos-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem;margin:.85rem 0;">' +
      '<article class="aqm-pos-item" style="padding:1rem;background:#FAF7F0;border:1px solid rgba(198,165,107,0.45);border-radius:10px;">' +
      '<h5><span>خط الحب والتواصل الحميم</span><small>طاقة ' + loveChannel + '</small></h5>' +
      '<p>' + esc(arcLove.positions?.relationship || arcLove.archetype) + '</p>' +
      (arcLove.taboos?.sexuality ? '<p style="color:var(--burgundy);font-size:.88rem;"><b>الكيمياء الحميمية:</b> ' + esc(arcLove.taboos.sexuality) + '</p>' : '') +
      '</article>' +
      '<article class="aqm-pos-item" style="padding:1rem;background:#FAF7F0;border:1px solid rgba(198,165,107,0.45);border-radius:10px;">' +
      '<h5><span>خط المال والمشاريع المشتركة</span><small>طاقة ' + moneyChannel + '</small></h5>' +
      '<p>' + esc(arcMoney.positions?.money || arcMoney.archetype) + '</p>' +
      '</article>' +
      '</div>';

    const same = 'ABCDEFGHI'.split('').filter(k => P1[k] === P2[k]);
    o += '<h4 class="ph">التشابه والتناغم الطاقي</h4>';
    o += mxs('نقاط التطابق بينكما', same.length ? 'أنتم متطابقون في: ' + same.map(k => (MX_SHORT[k] || k) + ' (' + getDMD(P1[k]).title + ')').join('، ') + '. التطابق يعزز التفاهم السريع، لكنه يتطلب وعياً لتفادي تضارب الأنا في نفس المجال.' : 'لا توجد نقاط متطابقة متطرفة؛ كل طرف يكمل نقص الآخر ويدعمه من زاوية مختلفة.');

    const cross = [];
    if (P1.D === P2.B) cross.push('الدرس الكارمي عندك هو بوابة الاتصال الروحي عند الشريك، مما يجعله معلماً طبيعياً لك في هذا الدرس');
    if (P2.D === P1.B) cross.push('الدرس الكارمي عنده هو بوابة الاتصال الروحي عندك، فأنت تساعده على تجاوز عقدته بحكمتك');
    if (P1.D === P2.D) cross.push('تتشاركان نفس الذيل الكارمي؛ دخلتما هذه العلاقة لفك نفس العقدة معاً وتطهير الكارما سوياً');
    if (P1.E === P2.E) cross.push('تتشاركان نفس طاقة المركز والجوهر؛ راحة قلبكما وتناغمكما الباطني نابع من نفس النواة الروحية');

    o += mxs('الروابط والاتصالات المصيرية', cross.length ? cross.join('. ') + '.' : 'العلاقة تقوم على الاختيار والوعي وبناء التفاهم المشترك خطوة بخطوة دون قيود كارمية ثقيلة.');

    return o + MX_NOTE;
  }
let lastMX = null, lastLP = null;
  const mform = $("#mform");
  mform.addEventListener("submit", e => {
    e.preventDefault();
    const err = $("#merr"); err.hidden = true;
    const v = $("#m-date").value;
    if (!v) { err.textContent = "اكتب تاريخ الميلاد."; err.hidden = false; return; }
    const [y, m, d] = v.split("-").map(Number);
    if (y < 1900 || y > 2100) { err.textContent = "التاريخ لازم يكون بين 1900 و 2100."; err.hidden = false; return; }
    if (new Date(y, m - 1, d) > new Date()) { err.textContent = "تاريخ الميلاد ده في المستقبل. راجع التاريخ."; err.hidden = false; return; }
    if (typeof isolateResultView === "function") isolateResultView("matrix");
    renderMatrix($("#m-name").value.trim(), d, m, y);
    const r = $("#mresult"); r.hidden = false; r.style.display = "block";
    const mf = $("#mform"); if (mf) { mf.hidden = true; mf.style.display = "none"; }
    const matrixIntro = document.querySelector("#matrix .center"); if (matrixIntro) { matrixIntro.hidden = true; matrixIntro.style.display = "none"; }
    r.scrollIntoView({ behavior: "smooth" });
  });
  function renderMatrix(name, d, m, y, tabIdx) {
    lastMX = [name, d, m, y];
    const P = matrixCalc(d, m, y), lp = lifePath(d, m, y), age = ageNow(d, m, y), cur = Math.floor((age % 80) / 10);
    const titleName = name ? "مصفوفة " + esc(name) : "مصفوفتك الكونية";
    const summaryCard = `<div class="chart-summary-card">
      <div class="chart-summary-info">
        <div class="chart-summary-badge">مصفوفة القدر والشاكرات</div>
        <h3 class="chart-summary-title">${titleName}</h3>
        <p class="chart-summary-meta">
          <span><span class="meta-glyph">☉</span> ${pad(d)}/${pad(m)}/${y}</span>
          <span class="meta-sep">•</span>
          <span><span class="meta-glyph">✦</span> طاقة المركز: ${P.E}</span>
        </p>
      </div>
      <div class="chart-summary-actions">
        <button type="button" class="btn-edit-matrix" id="btn-edit-matrix"><svg class="edit-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> تعديل البيانات / مصفوفة جديدة</button>
      </div>
    </div>`;
    const head = summaryCard;
    const hasDeep = !!(window.AqeeqNumerology && typeof window.AqeeqNumerology.render === "function");
    const names = ["التقرير المرجعي (7 أقسام)", "ملخصك", "النقاط", "مراحل عمرك", "الكارما والحيوات", "توافق مع شخص"];
    const tabs = `<div class="tabs" role="tablist" aria-label="أقسام المصفوفة">${names.map((t, i) => `<button class="tab" role="tab" aria-selected="${i === 0}" aria-controls="mp${i + 1}" id="mt${i + 1}"${i ? ' tabindex="-1"' : ""}>${t}</button>`).join("")}</div>`;
    const compat = `<p class="lead2">اكتب تاريخ ميلاد شخص تاني (حبيب أو صاحب أو شريك شغل) وشوف مصفوفة العلاقة بينكم.</p><div class="field"><label for="mc-date">تاريخ ميلاد الشخص التاني</label><input id="mc-date" type="date" min="1900-01-01" max="2100-12-31"></div><p class="ferr" id="mc-err" role="alert" hidden></p><div class="cta-row"><button class="btn" id="mc-go" type="button">احسب مصفوفة العلاقة</button></div><div id="mc-out" hidden></div>`;
    const bodies = [hasDeep ? "" : summaryHTML(P, lp), summaryHTML(P, lp), pointsHTML(P), stagesHTML(P, age), karmaHTML(P, lp), compat];
    const panels = bodies.map((b, i) => `<div class="panel" role="tabpanel" id="mp${i + 1}" aria-labelledby="mt${i + 1}"${i ? " hidden" : ""}>${b}</div>`).join("");
    const topWheel = hasDeep ? "" : `<div class="wheel-wrap">${matrixSVG(P, cur)}</div><p class="note">الدواير الكبيرة هي النقاط الأساسية (A لـ I) وتحتها عمرك عند كل نقطة. الصغيرة على الإطار هي منتصف كل مرحلة. والمنقطة جوه هي امتداد كل نقطة نحو مركزك.</p>`;
    const root = $("#mresult");
    const returnHomeBtn = `<div class="result-top-bar"><a href="#home" class="btn-return-home" role="button"><span>←</span> العودة للرئيسية</a></div>`;
    root.innerHTML = returnHomeBtn + head + topWheel + tabs + panels + CONTACT_LINE;
    wireTabs(root); bindContact(root);

    const mp1 = $("#mp1", root);
    if (mp1 && hasDeep) {
      window.AqeeqNumerology.render(mp1, `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    }
    const lpFill = $("#lp-date"); if (lpFill && !lpFill.value) lpFill.value = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (tabIdx) { const tt = $$("[role=tab]", root)[tabIdx]; if (tt) tt.click(); }
    
    const mcGo = $("#mc-go", root); if (mcGo) mcGo.addEventListener("click", () => {
      const er = $("#mc-err", root), out = $("#mc-out", root); er.hidden = true;
      const v = $("#mc-date", root).value;
      if (!v) { er.textContent = "اكتب تاريخ ميلاد الشخص التاني."; er.hidden = false; return; }
      const [y2, m2, d2] = v.split("-").map(Number);
      if (y2 < 1900 || y2 > 2100) { er.textContent = "التاريخ لازم يكون بين 1900 و 2100."; er.hidden = false; return; }
      if (new Date(y2, m2 - 1, d2) > new Date()) { er.textContent = "تاريخ الميلاد ده في المستقبل. راجع التاريخ."; er.hidden = false; return; }
      out.innerHTML = compatHTML(P, matrixCalc(d2, m2, y2)); out.hidden = false;
    });
  }

  /* ============ مسار الحياة والتوافق: المحتوى مفتوح بالكامل ============ */
  const SYN_ICONS = [
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3v8a6 6 0 0 0 12 0V3M6 7h4M14 7h4"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11l8-7 8 7M6 10v9h12v-9M10 19v-5h4v5"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4l10 10M4 4h4M4 4v4M20 4L10 14M20 4h-4M20 4v4M7 17l-3 3M17 17l3 3"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8a4 4 0 1 0 0 8c4 0 6-8 10-8a4 4 0 1 1 0 8c-4 0-6-8-10-8z"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 5-7M15 6h4v4"/></svg>'
  ];
  let synItems = null;
  function renderSyn() {
    const host = document.querySelector(".energy-compatibility-studio");
    if (!host) return;
    if (!synItems) {
      const arts = Array.from(host.querySelectorAll(":scope > article.rd"));
      if (arts.length !== 5) return;
      synItems = arts.map(a => {
        const h = a.querySelector("h3");
        if (!h) return { title: "قسم التوافق", html: a.innerHTML };
        const sm = h.querySelector("small"); if (sm) sm.remove();
        const title = h.textContent.replace(/^\s*[٠-٩0-9]+\s*[.\-]\s*/, "").trim();
        h.remove();
        return { title, html: a.innerHTML };
      });
      arts.forEach((a, i) => { if (i) a.remove(); });
      let box = document.getElementById("syn-sections");
      if (!box) { box = document.createElement("div"); box.id = "syn-sections"; box.className = "lp-sections"; arts[0].replaceWith(box); }
    }
    const out = synItems.map((it, i) => `<details class="acc mxd lp-section" data-syn-section="${i + 1}"><summary><span class="lp-sec-icon" aria-hidden="true">${SYN_ICONS[i]}</span><span class="lp-sec-title"><b>${esc(it.title)}</b><small>متاح بالكامل</small></span></summary><div class="mxb lp-sec-body">${it.html}</div></details>`).join("");
    const box = document.getElementById("syn-sections");
    if (!box) return;
    const openIdx = Array.from(box.querySelectorAll("details")).map(d => d.open);
    box.innerHTML = out;
    box.querySelectorAll("details").forEach((d, i) => { d.open = i < openIdx.length ? !!openIdx[i] : false; });
  }
  renderSyn();

  function dailyHTML(lp) {
    const t = new Date();
    let dn = digSum(t.getDate()) + digSum(t.getMonth() + 1) + digSum(t.getFullYear());
    while (dn > 9) dn = digSum(dn);
    const base = LP_BASE[lp] || lp, DY = DAY_EN[dn];
    const rel = dn === base ? "النهاردة طاقة اليوم هي نفس طاقة مسارك، فكل حاجة فيك بتتضخم: نورك وضلك." : `طبعك بيقابل طاقة اليوم، فاستخدم ${LP_GIFT[base]}، وراقب ${LP_CARE[base]}.`;
    return `<div class="daily"><h4>رسالة النهاردة ليك: طاقة ${DY.th}</h4><p>${DY.msg} ${rel}</p><div class="dd"><div><b>اعمل</b>${DY.do}</div><div><b>انتبه</b>${DY.dont}</div></div><p class="note">رسالة للتأمل، بتتجدد كل يوم من تاريخ النهاردة ورقم مسارك.</p></div>`;
  }

  function lpHTML(lp) {
    const base = LP_BASE[lp] || lp, F = LP_FREE[base], P = null;
    const master = LP_FREE_MASTER[lp];
    const li = a => "<ul>" + a.map(x => `<li>${x}</li>`).join("") + "</ul>";
    const para = x => x ? `<p>${x}</p>` : "";
    const sectionMeta = {
      1: {desc:"ملامحك الأساسية والدوافع اللي بتحركك.", icon:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3c-3 0-3 4 0 4s3 4 0 4-3 4 0 4 3 4 0 4M16 3c3 0 3 4 0 4s-3 4 0 4 3 4 0 4 3 4 0 4"/><path d="M9 5h6M9 9h6M9 13h6M9 17h6"/></svg>'},
      2: {desc:"الفرق بين صورتك قدام الناس وإحساسك من جوا.", icon:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5c3-2 6-1 8 1 2-2 5-3 8-1v10c-3 2-6 1-8-1-2 2-5 3-8 1z"/><path d="M12 6v8M7 9h2M15 9h2"/></svg>'},
      3: {desc:"أنماط بتتكرر ونقاط تستحق منك الانتباه.", icon:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h8v5H3zM13 7h8v5h-8zM8 14h8v5H8z"/><path d="M11 9h2M8 12v2M16 12v2"/></svg>'},
      4: {desc:"احتياجاتك العاطفية وطريقتك في بناء القرب والثقة.", icon:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/><path d="M8 12h2l1-2 2 4 1-2h2"/></svg>'},
      5: {desc:"المواهب والعمل وعادات التعامل مع الموارد.", icon:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 5-7M15 6h4v4"/></svg>'},
      6: {desc:"خطوات صغيرة تساعدك تحوّل التأمل لتجربة عملية.", icon:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 13h7v7h-7z"/><path d="M13 4h7v5h-7zM4 15h7v5H4z"/></svg>'},
      7: {desc:"أسئلة عن البدايات والاحتياجات القديمة والعلاقة بالأطفال.", icon:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6-7 10-7 10z"/><circle cx="12" cy="11" r="2"/></svg>'}
    };
    const section = (num, icon, title, badge, body, open=false) => {
      const meta = sectionMeta[num] || {desc:"افتح القسم لاستكشاف التفاصيل.",icon};
      return `<details class="acc mxd lp-section" data-lp-section="${num}" data-tier="free"><summary><span class="lp-sec-icon" aria-hidden="true">${meta.icon}</span><span class="lp-sec-title"><b>${title}</b><span class="lp-sec-desc">${meta.desc}</span><small>متاح بالكامل</small></span></summary><div class="mxb lp-sec-body">${body}</div></details>`;
    };
    const essence = (master ? `<div class="bond-cat"><strong>رقم رئيسي ${lp}</strong><p>${master}</p></div>` : "") + (base === 1 ? `
      <article class="rd"><h4>شفرة الروح والجوهر</h4><p>مسار الحياة رقم (1)، المعروف رمزيًا بالرائد أو البادئ، يرتبط في علم الأعداد بمن وُلدوا يوم 1 أو 10 أو 19 أو 28، أو كان مجموع تاريخ ميلادهم الكامل يختزل إلى الرقم 1.</p><p>جوهر الرقم 1 هو المبادرة وصناعة الطريق بدل انتظار أن يمهّده الآخرون. عندك ميل للاستقلال، والشجاعة في بدء شيء من الصفر، والرغبة في ترك بصمتك الخاصة. في أفضل حالاتك، بتعرف تحوّل الفكرة لخطوة عملية وتلهم غيرك بالمبادرة.</p></article>
      <article class="rd"><h4>طاقة النور: الرائد وصاحب المبادرة</h4><ul><li>الاستقلال والقدرة على اتخاذ الخطوة الأولى.</li><li>الشجاعة في مواجهة المجهول والبدء من الصفر.</li><li>روح قيادية وميل لتحمل المسؤولية.</li><li>وضوح في الهدف وقدرة على تحريك الأفكار.</li><li>أصالة ورغبة في صنع طريق يناسبك بدل تقليد الآخرين.</li></ul></article>
      <article class="rd"><h4>طاقة الظل: لما الاستقلال يتحول لعزلة</h4><ul><li>الإصرار على فعل كل شيء وحدك وصعوبة طلب المساعدة.</li><li>العناد أو صدام الأنا عند الاختلاف.</li><li>الاندفاع أو الصراحة الجارحة وقت الغضب.</li><li>الخوف من الفشل الذي قد يظهر في صورة كمالية وتأجيل.</li><li>الحماس الشديد للبدايات ثم الملل من التفاصيل والروتين.</li></ul></article>
      ` : `<article class="rd"><h4>جوهرك</h4>${para(F.essence)}</article>`);
    const mirror = base === 1 ? `
      <article class="rd"><h4>إزاي الناس بتشوفك من بره: القناع الخارجي والهالة</h4><p>الناس ممكن تشوفك «القائد» أو الشخص اللي بيعرف يبدأ ويتصرف وقت ما غيره يتردد. بتظهر بصورة القوي والواثق والمستقل، اللي عنده إجابة أو يقدر يلمّ الموقف وقت الأزمة. حضورك ممكن يوصل إحساس بالحسم والاعتماد على النفس، وده يخلي الناس تتوقع منك إنك دايماً عارف تعمل إيه، حتى لو إنت من جواك لسه بتفكر أو قلقان.</p><p>لأنك بتحب تبان متماسك، ممكن اللي حواليك ينسوا إنك بتتعب أو تحتاج دعم. أحياناً صورتك الخارجية بتقول «أنا قادر»، حتى في الأيام اللي بتكون فيها محتاج حد يسمعك من غير ما يطلب منك حل كل حاجة.</p></article>
      <article class="rd"><h4>إيه اللي بيدور جواك فعلًا: حقيقتك والصراع الداخلي</h4><p>ورا الصورة القوية ممكن يكون فيه نقد ذاتي شديد وتفكير زائد وخوف من إنك تظهر محتاج أو مش عارف. ساعات بتحس إنك لازم تثبت نفسك باستمرار، وإن أي تعثر ممكن يتفهم كأنه ضعف أو فشل. ممكن تتضايق لما مجهودك مايتشافش، لكن بدل ما تطلب التقدير أو تشرح تعبك، تكمل وحدك وتضغط على نفسك أكتر.</p><p>الصراع مش إن استقلالك مزيف، لكن إن الاستقلال ممكن يتحول لعبء لما يبقى ممنوع عليك تستند على حد. اسأل نفسك: هل أنا باختار أعمل ده بنفسي لأن ده الأنسب، ولا برفض المساعدة خوفاً من إني أبان ضعيف؟</p></article>
      <article class="rd"><h4>السر النفسي في التعامل مع الضغط والخذلان</h4><p>لما تتضغط، ممكن تميل للسيطرة أو الانسحاب أو تتصرف كأنك مش محتاج حد. وقد يتحول الإحباط إلى عصبية أو صراحة حادة، خصوصاً لما تحس إن حد بيقلل من كفاءتك أو يحاول يفرض عليك طريقاً مش مقتنع به. أحياناً تبدأ في حل المشكلة فوراً بدل ما تسمح لنفسك تحس بالزعل، أو تقفل على نفسك عشان ماحدش يشوف لحظة ضعفك.</p><p>جرّب تفرّق بين طلب المساندة وفقدان الاستقلال. قول بوضوح «أنا محتاج أتكلم» أو «محتاج مساعدة في الجزء ده»، واسمح لنفسك تاخد وقت قبل الرد وقت الغضب. القوة مش إنك ما تتأثرش أبداً، لكن إنك تعرف تتعامل مع تأثرك من غير ما تجرح نفسك أو اللي حواليك.</p></article>` :
      `<article class="rd"><h4>نورك: الصورة اللي بتظهر للناس</h4>${para(F.light)}</article><article class="rd"><h4>ضلّك: الجانب اللي محتاج وعي</h4>${para(P ? P.shadow : F.shadow)}</article>`;
    const blocks = base === 1 ? `
      <article class="rd lp-teaser"><span class="eyebrow">سؤال يخصّك</span><h4>ليه كل ما تقرب من هدفك الدنيا بتعاندك؟</h4>
      <p>أكبر نقطة تعطيل ممكن تواجه صاحب مسار الحياة رقم (1) هي فخ «أنا هعمل كل حاجة لوحدي» وعقدة «إثبات الذات المستمر». أوقات القوة تتحول لعناد من غير ما تاخد بالك، أو يظهر خوف خفي من الفشل يأجّل أهم خطوة في حياتك، أو تلاقي نفسك بتبدأ بقوة وبعدها تسيب التفاصيل تتراكم.</p>
      <p>الاستقلال ميزة لما يخليك تتحرك، لكنه ممكن يتحول لعزلة لما يمنعك من طلب المساعدة أو تفويض جزء من المسؤولية.</p>
      </article>
      <article class="rd"><h4>أولاً: أنماط التعطيل والعيوب الخفية في نقاط سريعة</h4><ul>
      <li>هوس السيطرة وعدم الثقة في كفاءة الآخرين.</li><li>العناد الحاد وصدام «الأنا» مع أي سلطة.</li><li>صراحة جارحة أحياناً أو اندفاع وعصبية وقت الغضب.</li><li>الملل السريع من الروتين والتفاصيل بعد حماس البداية.</li><li>جلد الذات القاسي والخوف السري من الفشل أو الظهور بمظهر الضعيف.</li><li>الانعزال العاطفي ورفض طلب المساعدة حتى في أشد الأوقات احتياجاً.</li></ul></article>
      <article class="rd"><h4>ثانياً: التحليل العميق للبلوكات الأربعة</h4><p>في القراءة الرمزية لمسار الحياة، طاقة الرقم (1) قوية زي تيار الكهرباء العالي؛ ولو اتوجهت بشكل غير متوازن، ممكن تتحول لأنماط بتعطّل التقدم والراحة النفسية. دي أربع نقاط تستحق المراجعة:</p>
      <h4>البلوك الأول: فخ «السوبرمان» ورفض التفويض</h4><p>ممكن تكون جواك قناعة إن «محدش هيعمل الشغلانة دي بنفس كفاءتي وضميري». النتيجة إنك تشيل فوق طاقتك، وترفض تطلب مساعدة أو توزّع المهام، لحد ما تقرب من الاحتراق النفسي والجسدي، وتلاقي مشروعك واقف لأنك شخص واحد ومش هتلحق كل حاجة لوحدك.</p><p><b>علامة إضافية تستحق الملاحظة:</b> أحياناً يتحول حب البداية إلى تأجيل مستمر عند اقتراب التنفيذ، بسبب انتظار الظروف المثالية أو الخوف من أن تكون النتيجة أقل من الصورة المتخيلة. جرّب تحديد أول خطوة صغيرة قابلة للإنجاز خلال 15 دقيقة، ثم قيّمها بعد تنفيذها بدل انتظار الثقة الكاملة.</p>
      <h4>البلوك الثاني: متلازمة «الكل أو لا شيء» وشلل الكمال</h4><p>من خوف الفشل أو إن صورتك قدام الناس تهتز، ممكن تأجل البداية وتفضل تخطط في دماغك. تقول لنفسك «لما الظروف كلها تبقى مثالية هبدأ»، بينما انتظار الكمال ممكن يكون وسيلة لتجنب احتمال الخسارة، فتفوّت فرص كان ممكن تتعلم منها أو تنقلك لمرحلة تانية.</p>
      <h4>البلوك الثالث: العناد وصدام الأنا</h4><p>أحياناً الكبرياء يخليك تكمل في طريق واضح إنه مش مناسب، بس عشان مايبانش إنك غلطت. وصدامك مع سلطة، زي مدير أو أب أو شريك أو قواعد روتينية، ممكن يضيّع طاقة في معارك كان ممكن تتعامل معاها بالمرونة والتفاوض بدل العند وكسر العظم.</p>
      <h4>البلوك الرابع: الإدمان على البدايات والملل من التفاصيل</h4><p>ممكن تحب نشوة البداية والتحدي الجديد، لكن لما المشروع يدخل في الروتين والتفاصيل، حماسك يقل بسرعة. ساعتها ممكن تسيب حاجة قربت تكتمل وتبدأ من الصفر في حاجة تانية، وتفضل داير في البدايات من غير ما تحصد النتيجة النهائية.</p></article>
      <article class="rd"><h4>ثالثاً:ثلاث خطوات للتعامل مع البلوك</h4>
      <h4>1. الوعي والإدراك: تعديل البرمجة العقلية</h4><p>افتكر إن طلب المساعدة مش ضعف، ده ذكاء قيادي. القائد مش لازم يحارب لوحده أو يبني كل حاجة بإيده؛ هو بيبني فريق يساعده في التفاصيل عشان يتفرغ للرؤية والإبداع. جرّب تبدأ لما تكون جاهز بنسبة 60% بدل انتظار الكمال، وافصل بين قيمتك كإنسان ونتيجة أي تجربة بتخوضها.</p>
      <h4>2. السر الباطني والطاقي: توازن الضفيرة الشمسية</h4><p>في بعض التقاليد الباطنية، بيرتبط الرقم (1) رمزياً بمركز القوة الشخصية المعروف باسم «شاكرا الضفيرة الشمسية»، الموجودة في التصورات الروحية بمنطقة أعلى البطن. ووفقاً لهذا الإطار الرمزي، محاولة السيطرة على كل شيء ممكن تتأملها كصورة للتوتر والتصلب، بينما «قانون السماح» معناه تعمل اللي عليك بإرادة واضحة، وبعدها تسيب مساحة للمرونة وتغيّر خطتك حسب الواقع.</p>
      <h4>3. الصورة الذهنية والتمرين التخيلي</h4><p>لما تحس إنك مضغوط أو شايل كل حاجة لوحدك، لو التمرين مناسب ليك، اقعد بهدوء لمدة 30 ثانية وتخيّل الصورة دي:</p>
      <blockquote><p>«تخيّل إنك مش جبل صخر جامد بيتكسر من كتر الضغط والريح، تخيّل إنك الشمس نفسها. الشمس مش بتجري ورا الكواكب عشان تجبرها تلف حواليها؛ هي بتشع نورها ودفئها، وكل كوكب له مداره. خليك مركز في نورك، وفي خطواتك وقيمك، وسيب مساحة للناس والفرص إنها تقابلك من غير ما تحاول تتحكم في كل تفصيلة».</p></blockquote>
      <p>خلي الصورة دي تذكير ليك: ركّز في اللي تقدر تعمله، واسمح لنفسك تطلب المساندة وتعدّل المسار.</p></article>` : P ? `<article class="rd"><h4>البلوكات الداخلية</h4>${para(P.blocks)}</article><article class="rd"><h4>الطاقات اللي بتعطلك</h4>${para(P.hinder)}</article>` :
      `<article class="rd"><h4>نقاط التعطيل</h4><p>راجع المواقف اللي بتتكرر في حياتك: هل بتبالغ في الاعتماد على نفسك، أو بتتجنب المواجهة، أو بتستعجل النتيجة؟ اختار النمط الأقرب لتجربتك، واعتبره سؤالًا للتأمل مش حكمًا ثابتًا على شخصيتك.</p></article>`;
    const love = base === 1 ? `
      <article class="rd lp-teaser"><span class="eyebrow">سؤال يخصّك</span><h4>ليه علاقاتك العاطفية بتتحول أحياناً لساحة معركة أو صراع قوة خفي؟</h4>
      <p>على قد ما قلبك كبير ومخلص لحبيبك، على قد ما ممكن تواجه صراعاً بين رغبتك في القرب وخوفك من إن الحب يلغي استقلاليتك. أحياناً طاقتك القيادية بتظهر في العلاقة على هيئة محاولة لتوجيه الشريك أو «إصلاحه»، حتى لو نيتك الحماية.</p>
      </article>
      <article class="rd"><h4>أولاً: ملامح طبيعتك العاطفية</h4><h4>سماتك كشريك في طاقة النور</h4><ul>
      <li>الإخلاص والوفاء لما تختار شريكك عن اقتناع.</li><li>الحماية والاحتواء المادي والمعنوي، والرغبة في أن تكون سنداً حقيقياً.</li><li>الصراحة والوضوح، وتفضيل التعبير المباشر على التلاعب بالمشاعر.</li><li>الشغف والحرارة العاطفية والكرم مع الشخص اللي بتحبه.</li><li>الطموح المشترك والرغبة في إنك وشريكك تنجحوا وتتقدموا سوا.</li></ul>
      <h4>عيوبك العاطفية في طاقة الظل</h4><ul><li>محاولة السيطرة أو فرض الرأي تحت عنوان «أنا خايف على مصلحتك».</li><li>ظهور جفاف عاطفي أحياناً بسبب الانشغال المفرط بالشغل والطموح.</li><li>صعوبة الاعتذار أو الاعتراف بالغلط لما الكبرياء يتدخل.</li><li>النفور من الإلحاح المستمر أو الاعتماد العاطفي الزائد.</li><li>الغيرة أو الحساسية لما تحس إنك مش أولوية مهمة عند شريكك.</li></ul></article>
      <article class="rd"><h4>ثانياً: التحليل العميق لشفرة الحب والجواز</h4>
      <h4>مواصفات الشريك اللي يناسبك</h4><p>غالباً هتقدّر شريك عنده شخصية مستقلة وطموح وكيان خاص، ويقدر يحاور عقلك قبل قلبك. الانجذاب لشخص قوي وواثق ممكن يكون مناسباً لك لما العلاقة تبقى شراكة «كتف في كتف»، مش علاقة مدير وموظف. الأهم من أي رقم هو الاحترام المتبادل والقدرة على التفاهم.</p>
      <h4>البلوك العاطفي وأنماط العلاقات المتكررة</h4><p>ممكن تدخل العلاقة بدور «المنقذ» وتحاول تصلّح الشريك أو تشكّل حياته على مزاجك، أو تدخل مع شخص قوي فتتحول الخلافات لمنافسة على مين كلمته تمشي. وأحياناً الخوف من إن الحب يضعفك يخليك تبني سوراً حوالين قلبك، فتظهر بارداً رغم احتياجك للقرب. دي احتمالات للتأمل، مش قواعد تنطبق على كل شخص يحمل الرقم.</p>
      <h4>طبيعتك في الجواز والاستقرار</h4><p>قد تعبّر عن الحب بالأفعال والمواقف وتحمل المسؤولية وتوفير الاستقرار، أكثر من الكلام الرومانسي. وفي المقابل، تحتاج لمساحة شخصية وحدود واضحة. عشان العلاقة تستمر بشكل صحي، اتفقوا على المسؤوليات والوقت الخاص وطريقة حل الخلاف، من غير ما تتحول الحرية لعزلة أو القرب لرقابة.</p></article>
      <article class="rd"><h4>ثالثاً: خريطة التوافق الرمزي بين الأرقام</h4>
      <h4>أرقام قد يظهر معها انسجام في القراءة الرمزية</h4><ul><li><b>مسار 3 و5:</b> تُقرأ العلاقة رمزياً باعتبارها مزيجاً من الشغف والمرح والحرية والتجدد، مع أهمية الاتفاق على الالتزام والمسؤوليات.</li><li><b>مسار 2 و6:</b> قد ترمز إلى تكامل بين المبادرة والاحتواء والدبلوماسية، بشرط احترام استقلال الطرفين وعدم إلغاء شخصية أي منهما.</li></ul>
      <h4>علاقات قد تحتاج وعياً وتفاوضاً أكبر</h4><ul><li><b>مسار 1 أو 8:</b> قد يظهر تنافس قوي وطموح مشترك، ويحتاج الطرفان إلى تقاسم القرار وتجنب صراع السيطرة.</li><li><b>مسار 4 أو 7:</b> قد تختلف وتيرة التعبير عن المشاعر أو تفضيلات الروتين والمساحة الشخصية، ويُفيد وجود هدف مشترك وحوار صريح.</li></ul></article>
      <article class="rd"><h4>رابعاً:ثلاث خطوات لفهم البلوك العاطفي</h4>
      <h4>1. الوعي والإدراك العاطفي</h4><p>افتكر إن العلاقة مش شركة إنت المدير بتاعها، ومش ساحة حرب الكسبان فيها هو اللي كلمته بتمشي. لما تكسب النقاش بالعند والكبرياء، ممكن تخسر مساحة من القرب والثقة. جرّب تسيب «بدلة القائد» بره باب البيت، وتدخل الحوار كشريك بيسمع وبيشارك، مش كحاكم بيأمر.</p>
      <h4>2. السر الباطني والطاقي: توازن الين واليانج</h4><p>في بعض التقاليد الباطنية، يُستخدم مفهوم «اليانج» رمزياً للحسم والفعل والمبادرة، و«الين» للاستقبال والليونة والاحتواء، بغض النظر عن كون الشخص رجلاً أو امرأة. ممكن تستخدم الفكرة كتذكير إن الحزم محتاج يتوازن مع الإصغاء والتعبير عن الاحتياج. اسمح لنفسك تكون صريحاً بشأن احتياجك للحنان، بدل انتظار إن الطرف التاني يفهمه من غير كلام.</p>
      <h4>3. الصورة الذهنية والتمرين التخيلي وقت الخلاف</h4><p>لو التمرين مريح ليك، خُد 30 ثانية تهدّي فيها نفسك وتخيّل الصورة دي:</p><blockquote><p>«تخيّل إن علاقتك بشريكك رقصة تانجو بين ملك وملكة، مش مباراة ملاكمة في حلبة. في الملاكمة، لازم واحد يقع عشان التاني يفوز؛ لكن في الرقصة، لو طرف زق التاني بقوة أو مشي لوحده، الرقصة كلها هتبوظ. القوة هنا إنك تخطو لقدام بحماس، وترجع خطوة بنعومة عشان تدي لشريكك مساحة يتحرك ويتألق معاك في نفس اللوحة».</p></blockquote><p>بعدها اسأل نفسك: إيه اللي عايز أوصّله؟ وإيه اللي محتاج أسمعه من الطرف التاني؟ واختار جملة تفتح الحوار بدل ما تصعّده.</p></article>` : P ? `<article class="rd"><h4>في الحب والمشاعر</h4>${para(P.love)}${para(P.feelings)}</article><article class="rd"><h4>الجواز والشراكة</h4>${para(P.marriage)}<h4>القرب والحميمية</h4>${para(P.closeness)}</article>` :
      `<article class="rd"><h4>في الحب والمشاعر</h4>${para("لاحظ إزاي بتعبّر عن احتياجك، وإزاي بتستقبل الاختلاف والرفض. مفيش رقم يحدد نجاح علاقة أو فشلها وحده؛ التواصل والحدود والاحترام عوامل أساسية.")}</article><article class="rd"><h4>الجواز والشراكة</h4><p>استخدم القراءة كبداية لحوار عن الأمان والثقة وتقسيم المسؤوليات، مش كحكم مسبق على الشريك.</p></article>`;
    const money = base === 1 ? `
      <article class="rd lp-teaser"><span class="eyebrow">سؤال يخصّك</span><h4>ليه الفلوس أحياناً بتجري من إيدك، أو دخلك مش بيعبر عن مجهودك؟</h4>
      <p>في القراءة الرمزية لمسار رقم (1)، الاستقلال والمبادرة ممكن يكونوا مصدر قوة مهنية، لكن العناد أو المجازفة من غير حساب أو إهمال التفاصيل المالية ممكن يعرقلوا خططك.</p></article>
      <article class="rd"><h4>أولاً: ملامح طبيعتك المادية والمهنية</h4><h4>سماتك في طاقة النور</h4><ul><li>المبادرة والقدرة على بدء مشروع أو فكرة من الصفر.</li><li>الكرم والرغبة في شراء أشياء ذات جودة ومشاركة من تحب في النجاح.</li><li>تفضيل الاستقلالية وامتلاك مساحة لاتخاذ القرار في العمل.</li><li>سرعة ملاحظة الفرص والجرأة على تجربة أفكار جديدة.</li></ul><h4>عيوبك في طاقة الظل</h4><ul><li>الإفراط في العمل على حساب الصحة والحياة الشخصية.</li><li>الصرف الاندفاعي أو الدخول في استثمار من غير دراسة كافية.</li><li>الصدام مع الرؤساء أو الشركاء بسبب رفض القيود أو اختلاف الرأي.</li><li>صعوبة الادخار لو مفيش هدف واضح وخطة منتظمة.</li></ul></article>
      <article class="rd"><h4>ثانياً: التحليل العميق لشفرة المال والمهنة</h4><h4>إزاي تبني دخلك؟</h4><p>القراءة الرمزية للرقم (1) تبرز فكرة المبادرة وبناء اسم مهني مستقل. ممكن تراجع فرص تأسيس مشروع، أو تطوير علامة شخصية، أو تقديم خدمة مختلفة، أو تولّي دور فيه ابتكار ومسؤولية. لكن النجاح المالي مش مضمون برقم مسار الحياة؛ بيتأثر بالمهارات والسوق والموارد والتخطيط والظروف.</p><h4>البلوك المالي والتعطيل</h4><p>من الأنماط اللي تستحق المراجعة: الخوف من المخاطرة لدرجة تفويت فرصة مدروسة، أو العكس، ترك الاستقرار والقفز لمجازفة غير محسوبة. كمان العناد الإداري، وضعف متابعة الحسابات والمصروفات، أو الاعتماد على الحماس وحده من غير نظام مالي واضح، ممكن يخلقوا ثغرات في المشروع. الفكرة مش إنك تخاطر أكتر، لكن إنك تفرّق بين خوف بيوقفك ومخاطرة اتدرست بعناية.</p><h4>نظام بسيط يمنع إهمال التفاصيل المالية</h4><ul><li>سجّل كل دخل ومصروف أولاً بأول، حتى لو المبلغ صغير.</li><li>افصل مصاريفك الشخصية عن مصاريف المشروع قدر الإمكان.</li><li>خصص موعداً أسبوعياً لمراجعة الرصيد والالتزامات والفواتير والمبالغ المستحقة، بدل الاعتماد على الذاكرة أو الإحساس العام.</li><li>قبل أي قرار كبير، اكتب التكلفة المتوقعة، وأسوأ خسارة محتملة، والخطة البديلة لو النتيجة ما كانتش مناسبة.</li></ul><p>الخطوات دي أدوات تنظيم عملية، مش ضمان للربح، وممكن تتكيف حسب طبيعة دخلك وشغلك.</p><h4>مجالات مهنية ممكن تستكشفها</h4><p>ريادة الأعمال، إدارة المشاريع، الاستشارات، الإعلام وصناعة المحتوى، التسويق الرقمي، التكنولوجيا والابتكار، أو أي مجال يتيح لك المبادرة وتحمل مسؤولية واضحة. اختار بناءً على مهاراتك الفعلية وتجارب صغيرة قابلة للقياس، مش على الرقم وحده.</p></article>
      <article class="rd"><h4>ثالثاً:ثلاث خطوات للتعامل مع البلوك المالي</h4><h4>1. الوعي والإدراك المالي</h4><p>قيّم مهاراتك وخبرتك بشكل واقعي، وتفاوض على مقابل مناسب من غير ما تخلط بين الثقة والعناد. خصص جزءاً من دخلك للادخار، وحدد أهدافاً مالية واضحة، وراجع المصروفات والأرباح بانتظام. أي استثمار يحتاج دراسة للمخاطر، ومش كل فرصة تستحق المجازفة.</p><h4>2. السر الباطني والطاقي: توازن العطاء والأخذ</h4><p>في بعض الممارسات الروحية، يُستخدم مفهوم «الاستحقاق» و«التوازن بين العطاء والأخذ» كتذكير بمراجعة العلاقة مع المال. تقدر تتأمل في قيمة شغلك، وتسمح لنفسك باستقبال الدعم، وتختار التبرع أو مساعدة الآخرين بما يناسب قدرتك وميزانيتك. الأفكار دي معانٍ شخصية وروحية، وليست قانوناً يضمن زيادة الدخل أو تدفق المال.</p><h4>3. الصورة الذهنية للتأمل في الوفرة</h4><p>لما تحس بضغط مالي، خُد 30 ثانية للتنفس بهدوء وتخيّل الصورة دي:</p><blockquote><p>«تخيّل إنك مغناطيس ثابت وهادئ، مش شخص بيجري في كل اتجاه وراء كل فرصة. المجال اللي بتبنيه هو مهاراتك وسمعتك وخطواتك المدروسة. ركّز على تقوية المجال ده، وميّز الفرص المناسبة من الوعود السريعة، وخلي قراراتك المالية مبنية على معلومات واضحة».</p></blockquote><p>خلي الصورة دي تذكيراً بالثبات والتركيز، مش وعداً بأن المال هينجذب تلقائياً.</p></article>` : P ? `<article class="rd"><h4>مفاتيح النور</h4>${li(P.lightKeys)}</article><article class="rd"><h4>مفاتيح الضل</h4>${li(P.shadowKeys)}</article>` :
      `<article class="rd"><h4>المواهب وطريقة الشغل</h4><p>فكّر في المهام اللي بتديك طاقة والمهارات اللي الناس بتطلب مساعدتك فيها، وبعدها اربطها بخطوة مهنية قابلة للتجربة.</p></article><article class="rd"><h4>المال والوفرة</h4><p>راجع عاداتك في الإنفاق والادخار والتخطيط. رقم مسار الحياة لا يتنبأ بالدخل أو الثراء، لكنه ممكن يكون مدخلًا للتأمل في اختياراتك.</p></article>`;
    const practice = base === 1 ? `
      <article class="rd lp-teaser"><span class="eyebrow">سؤال يخصّك</span><h4>معرفة مشكلتك هي نص الحل، بس إزاي تبدأ تتغير عملياً من بكره الصبح؟</h4>
      <p>لو فضلت ماشي بنفس الطريقة القديمة، من العناد ورفض المساعدة ومحاولة السيطرة على كل التفاصيل، ممكن تلاقي نفسك بتكرر نفس الدائرة. هنا هتلاقي ثلاث خطوات عملية تساعدك تراجع عاداتك وتبدأ بتغيير صغير قابل للتطبيق.</p>
      </article>
      <article class="rd"><h4>الروشتة العملية: 3 خطوات للتطبيق المباشر</h4>
      <h4>1. خطوة «تفريغ السيطرة» (تجربة الـ 24 ساعة)</h4><p><b>إزاي تعملها:</b> في أول يوم من كل أسبوع، هات ورقة واكتب الحاجات اللي شاغلاك وبتحاول تسيطر عليها أو تصلحها في حياة الناس حواليك أو في شغلك. راجع كل نقطة واسأل نفسك: هل دي مسؤوليتي فعلًا؟ بعدين اشطب اللي مش في نطاق سيطرتك، واكتب بخط واضح: «ليس لي سلطة إلا على نفسي».</p><p><b>تجربة الـ 24 ساعة:</b> خلال اليوم التالي، كل ما تلاقي نفسك بتتدخل في قرار يخص شخصًا آخر أو بتحاول تضمن نتيجة مش في إيدك، قف لحظة واسأل: «إيه الجزء اللي أقدر أتحكم فيه فعلًا؟». وجّه مجهودك للجزء ده، وسيب للطرف الآخر مسؤوليته، إلا لو فيه خطر حقيقي أو التزام واضح عليك بالتدخل.</p><p><b>الهدف:</b> تدريب نفسك تميّز بين مسؤوليتك ومسؤولية الآخرين، وتوجّه مجهودك للحاجات اللي تقدر تأثر فيها. مش لازم المشاكل تتحل لوحدها، لكن ممكن تتعامل معاها بهدوء وتركيز أكتر.</p>
      <h4>2. خطوة «تفعيل فريق العمل» (قانون التفويض)</h4><p><b>إزاي تعملها:</b> بدل ما تحاول تعمل كل حاجة بنفسك، اختار خلال يومك مهمتين صغيرتين ممكن شخص تاني يساعدك فيهم، واطلب المساعدة بوضوح. اتفقوا على النتيجة المطلوبة، وسيب مساحة للطرف التاني ينفذ بطريقته طالما النتيجة مناسبة.</p><p><b>الهدف:</b> تتدرّب على التفويض والثقة وتقسيم المسؤوليات، وتوفّر وقتك للحاجات اللي محتاجة خبرتك أو رؤيتك. ابدأ بمهمة بسيطة، وراجعوا سوا إيه اللي نجح وإيه اللي محتاج يتظبط.</p>
      <h4>3. خطوة «طقوس التجديد الصباحي» (شحن بطارية الشمس)</h4><p><b>إزاي تعملها:</b> أول ما تصحى، وقبل ما تفتح موبايلك لو ده مناسب لروتينك، خصص خمس دقائق في مكان هادي أو فيه ضوء نهار مريح. خد أنفاساً هادئة من غير إجبار، وكرر لنفسك: «أنا أبدأ يومي بخطوة واعية، وأقدر أختار رد فعلي، ومش محتاج أثبت قيمتي لأي حد».</p><p><b>الهدف:</b> تبدأ يومك بوقفة قصيرة تساعدك تراجع نيتك وتختار أولوياتك بدل الاستجابة الفورية لكل إشعار أو ضغط. ممكن تعتبر الشمس هنا رمزاً للتجدد والبدايات، وليس شحناً طبياً أو طاقياً مثبتاً.</p></article>
      <article class="rd"><h4>خطة تطبيق بسيطة للأسبوع الأول</h4><ul><li>اليوم الأول: اكتب ما يقع تحت سيطرتك وما لا يقع تحتها.</li><li>اليوم الثاني: فوّض مهمة واحدة صغيرة.</li><li>باقي الأسبوع: جرّب وقفة صباحية لخمس دقائق، وسجّل هل ساعدتك على التركيز.</li><li>في نهاية الأسبوع: راجع اللي اتغير فعلًا، وعدّل الخطوات حسب ظروفك بدل ما تحاسب نفسك على الكمال.</li></ul><p class="note">دي تمارين للتأمل وتنظيم العادات، مش علاجاً نفسياً أو ضماناً لتحول جذري. اختار منها ما يناسبك، واستعن بمتخصص لو عندك ضيق شديد أو مستمر.</p></article>` : P ? `<article class="rd"><h4>مفاتيح النور: إزاي تنوّر أكتر</h4>${li(P.lightKeys)}</article><article class="rd"><h4>مفاتيح الضل: إزاي تهدّيه</h4>${li(P.shadowKeys)}</article><article class="rd"><h4>إزاي تفك التعطيل</h4>${li(P.unlock)}</article>` :
      `<article class="rd"><h4>خطوات عملية للتجربة</h4><ul><li>اكتب نمطًا واحدًا عايز تفهمه بدل ما تحاول تغيّر كل حاجة مرة واحدة.</li><li>اختار فعلًا صغيرًا قابلًا للقياس وجرّبه لمدة أسبوع.</li><li>راجع النتيجة من واقع تجربتك، واحتفظ باللي نفعك واترك اللي مش مناسب لك.</li></ul></article>`;
    const childhood = base === 1 ? `
      <article class="rd lp-teaser"><span class="eyebrow">سؤال يخصّك</span><h4>ليه دايماً بتحس إنك لازم تحارب عشان تثبت وجودك، وإنك لو متسندتش على نفسك هتقع؟</h4>
      <p>في القراءة الرمزية لمسار رقم (1)، الإصرار على الاعتماد على النفس وحب السيطرة ممكن يكونوا مرتبطين بتجارب قديمة اتعلمت فيها تتحمل مسؤولية بدري، أو حسيت إن صوتك واستقلالك مش مسموعين. دي احتمالات للتأمل، مش حكم على طفولتك أو دليل إن تجربة معينة حصلت لك.</p>
      </article>
      <article class="rd"><h4>أولاً: جرح الطفولة والطفل الداخلي</h4>
      <p>ممكن بعض أصحاب مسار الحياة رقم (1) يلاقوا نفسهم بيتأملوا في طفولة اضطروا فيها يعتمدوا على نفسهم بدرجة كبيرة، أو حسّوا إن استقلاليتهم مش مقبولة. ده مش معناه إن كل شخص رقمه (1) عاش نفس التجربة؛ استخدم النقطتين دول كأسئلة للمراجعة، وخد منهم اللي يطابق تجربتك الفعلية بس.</p>
      <h4>1. كبرت قبل الأوان</h4><p>هل ظروف العيلة أو غياب الدعم العاطفي خلّتك تشيل مسؤولية نفسك أو إخواتك وإنت صغير؟ لو ده حصل، ممكن تكون اتعلمت تقول لنفسك «محدش هينفعني غير دراعي». اسأل نفسك: هل الاعتماد على النفس لسه بيساعدني، ولا بقيت برفض الدعم حتى لما أحتاجه؟</p>
      <h4>2. قمع الاستقلالية</h4><p>هل كنت طفل مختلف أو متمرد، وحسيت إن أهلك أو المجتمع بيحاولوا يفرضوا عليك طريق واحد أو يقارنوك بغيرك؟ لو ده قريب من تجربتك، راجع هل غضبك الحالي من السلطة مرتبط بالموقف اللي قدامك فعلًا، ولا بيتحرك أحيانًا من تجارب قديمة. فهم النمط مش معناه لوم نفسك أو لوم الآخرين تلقائيًا.</p></article>
      <article class="rd"><h4>ثانياً: الدين الكارمي لمسار (1) ومعنى الأنا والسلطة</h4>
      <p>في بعض مدارس علم الأرقام الكارمي، يُربط الرقم (1)، وخصوصًا المجموع 19 الذي يُختزل إلى 1، بموضوعات الاستقلال والسلطة والمسؤولية عن أثر القوة في الآخرين.</p>
      <h4>رسالة الكارما في القراءة الرمزية</h4><p>تخيّل الدرس كأنه سؤال: هل تستخدم قوتك وقيادتك لمصلحتك وحدك، أم تقدر تقود من غير ما تلغي وجود الآخرين؟ وفي الاتجاه المقابل، هل تتنازل عن إرادتك خوفًا من الخلاف؟ المعنى العملي هنا هو التوازن بين الاستقلال والتعاون، وبين الحزم واحترام حدود الآخرين. مش لازم تعتبر الصعوبات عقابًا كونيًا أو دليلًا على ذنب سابق.</p></article>
      <article class="rd"><h4>ثالثاً: علاقتك بالأطفال والتربية (أنت كأب أو أم)</h4>
      <h4>نقاط قوة ممكن تستثمرها</h4><ul><li>الرغبة في حماية أطفالك والوقوف بجانبهم وقت الشدة.</li><li>تشجيع الثقة بالنفس والطموح والاعتماد على الذات بما يناسب عمر الطفل.</li><li>الاجتهاد في توفير احتياجاتهم والسعي لخلق فرص أفضل لهم.</li></ul>
      <h4>نقاط تحتاج انتباه</h4><ul><li>رفع سقف التوقعات لدرجة إن الطفل يحس إنه لازم يكون الأول طول الوقت.</li><li>اعتبار الخطأ أو الضعف فشلًا بدل ما يكون فرصة للتعلم.</li><li>رسم مستقبل الطفل بدل ما تسمع ميوله وتساعده يكتشف اختياراته.</li></ul>
      <h4>نصيحة أساسية</h4><p>افتكر إن طفلك مش نسخة مصغرة منك، ومش مشروع مطلوب منه يحقق اللي إنت ما حققتوش. اديله مساحة يغلط ويتعلم ويعبّر عن مشاعره، واسمعه من غير ما تربط قيمته بإنجازه. راقب احتياجات الطفل الفعلية وشخصيته، مش رقم مسار الحياة وحده.</p></article>
      <article class="rd"><h4>رابعاً: احتمالات الحياة السابقة في القراءة الرمزية</h4>
      <h4>الاحتمال الأول: القائد الذي حمل المسؤولية وحده</h4><p>في الحكاية الرمزية، تخيّل شخصية كانت مسؤولة عن جماعة أو بيت أو مشروع، واضطرت تاخد قرارات صعبة من غير دعم كافٍ. ممكن يكون الدرس في الحكاية هو التمييز بين القيادة وتحمل كل شيء منفرداً.</p><p><b>انعكاس محتمل في حياتك الحالية:</b> تلاقي صعوبة في تفويض المهام، أو تشعر إنك لازم تتدخل فوراً لما الأمور تتلخبط، أو تحس بالذنب لما ترتاح بينما غيرك محتاج مساعدة. دي سلوكيات ممكن يكون لها أسباب واقعية كثيرة، ومش دليل على حياة سابقة.</p><p><b>سؤال للتأمل:</b> هل المسؤولية اللي شايلها اختيار واعٍ، ولا خوف من إن الأمور تنهار لو ما تدخلتش؟</p>
      <h4>الاحتمال الثاني: صاحب المبادرة الذي خاف من تكرار الفشل</h4><p>في سيناريو رمزي آخر، تخيّل شخصاً بدأ مشروعاً أو رحلة كبيرة ثم واجه خسارة أو رفضاً. تقدر تستخدم الحكاية كاستعارة للخوف من تكرار التجربة، من غير ما تعتبرها ذكرى أو حقيقة تاريخية.</p><p><b>انعكاس محتمل في حياتك الحالية:</b> تأجيل بداية مهمة رغم الاستعداد، أو ربط الخطأ بقيمتك الشخصية، أو الانسحاب من مشروع لما تظهر تفاصيله الصعبة. قد تكون لهذه الأنماط أسباب نفسية أو اجتماعية أو عملية في الحياة الحالية.</p><p><b>سؤال للتأمل:</b> ما الخطوة الصغيرة التي يمكنني تجربتها حتى لو لم أضمن النتيجة؟</p>
      <h4>الاحتمال الثالث: صاحب الإرادة الذي دخل في صراع مع السلطة</h4><p>تخيّل، على سبيل الرمز فقط، شخصية حاولت الحفاظ على استقلالها وسط سلطة صارمة أو قواعد لا تسمح بالاختيار. يمكن للحكاية أن تفتح سؤالاً عن الفرق بين الاستقلال الصحي ورفض كل توجيه لمجرد أنه صادر من شخص آخر.</p><p><b>انعكاس محتمل في حياتك الحالية:</b> انزعاج شديد من الأوامر، أو تحويل الاختلاف إلى معركة إثبات، أو صعوبة قبول نصيحة حتى بعد فحصها. راجع الموقف الحالي نفسه قبل ربطه بأي قصة رمزية.</p><p><b>سؤال للتأمل:</b> كيف أحافظ على حريتي وأظل قادراً على التعاون والتفاوض؟</p>
      <h4>الاحتمال الرابع: الرائد الذي نسي جانب الشراكة</h4><p>في قصة رمزية رابعة، قد تكون الشخصية منشغلة بالإنجاز لدرجة أنها أهملت العلاقات أو رفضت مشاركة الآخرين في القرار. الدرس هنا ليس عقاباً كارمياً، بل سؤال عن الثمن الذي قد يدفعه الإنسان حين يجعل الإنجاز المعيار الوحيد لقيمته.</p><p><b>انعكاس محتمل في حياتك الحالية:</b> تأجيل الراحة والعلاقات باستمرار، أو الشعور أن طلب الدعم يقلل من مكانتك، أو قياس نجاحك بما أنجزته فقط. لو لاحظت ده، جرّب تخصيص وقت لعلاقة مهمة أو طلب مساعدة محددة.</p><p><b>سؤال للتأمل:</b> ما الذي أريد أن أبنيه في حياتي إلى جانب الإنجاز؟</p>
      <p class="note">لا توجد طريقة موثوقة لاستنتاج أحداث حياة سابقة من رقم مسار الحياة. هذه السيناريوهات خيالية ورمزية للتأمل، ولا تثبت أن موقفاً حدث فعلاً أو أن مشكلة حالية سببها كارما.</p></article>
      <article class="rd"><h4>خامساً: أسئلة عملية للمراجعة والتأمل</h4><ul><li>إيه المسؤولية اللي شلتها بدري، وهل لسه شايل منها أكتر من اللازم؟</li><li>إمتى بحس إني لازم أثبت نفسي، وإيه اللي ممكن يساعدني أحس بالأمان من غير صراع؟</li><li>إزاي أطلب المساعدة من غير ما أحس إن استقلالي اتقلل؟</li><li>لو بتربي طفلًا، إزاي أفرّق بين تشجيعه وبين فرض طموحاتي عليه؟</li></ul></article>` :
      `<article class="rd"><h4>الطفل الداخلي وتجارب البدايات</h4><p>اسأل نفسك: إيه الاحتياج اللي كنت محتاجه وأنت صغير، ولسه بتحاول تلبّيه دلوقتي؟ وإيه السلوك اللي اتعلمته زمان وبقى محتاج مراجعة؟</p></article><article class="rd"><h4>الأسرة والعلاقة بالأطفال</h4><p>لو بتتعامل مع طفل، ركّز على شخصيته الفعلية واحتياجاته وحدوده، مش على رقم وحده. ولو بتراجع طفولتك، خليك رحيم بنفسك واطلب دعمًا متخصصًا لو الذكريات مؤلمة أو معطّلة لحياتك.</p></article><article class="rd"><h4>الدروس المتكررة والمعنى الشخصي</h4><p>يمكن استخدام مفهوم الكارما كلغة رمزية للتفكير في العادات والاختيارات المتكررة، وليس كإثبات إنك مُعاقَب أو إن أحداثًا بعينها مكتوبة عليك.</p></article>`;
    const paidLabel = "تفاصيل القراءة · متاحة للاختبار";
    return `<div class="lp-sections-intro"><p>رقم مسارك هو مدخل للتأمل في أنماطك وتجاربك، وليس تشخيصًا أو حكمًا نهائيًا عليك. افتح أي قسم من الأقسام السبعة. </p><p class="note"><b>ملاحظة تحريرية:</b> النسخة دي تتضمن مراجعة تغطية للعناصر الأساسية المعروفة للأقسام السبعة، مع إضافات موسوعية جديدة موضّحة داخل النص. لا تُعدّ مطابقة حرفية سطرًا بسطر لكل الرسائل الأصلية حتى الآن.</p><p class="note"><b>نطاق التدقيق الحالي:</b> تمت مراجعة وجود العناصر الأساسية: رموز الجوهر والظل، البلوكات الأربعة، الحب والتوافق الرمزي، المال والمهنة، التمارين العملية، الطفولة والتربية، والإضافات التأملية للحياة السابقة. الإضافات الرمزية لا تُعرض كحقائق علمية أو تنبؤات مؤكدة.</p></div>` +
      `<div class="lp-sections">` +
      section(1,"","شفرة الروح والجوهر","مجاني · مفتوح",essence + (base === 1 ? `` : "")) +
      section(2,"","المراية المزدوجة: القناع والحقيقة","مجاني · مفتوح",mirror + (base === 1 ? `<article class="rd"><h4>اللي ورا القناع: الشخصية الحديدية والناقد الداخلي</h4><p>ممكن تبان «الشخصية الحديدية» اللي بتعرف تتصرف، لكن في وحدتك تراجع نفسك بقسوة وتجلد ذاتك على قرار أو كلمة أو غلطة صغيرة. أحيانًا بتخاف تبان محتاج أو ضعيف، فتخبي تعبك بدل ما تطلب دعمًا واضحًا.</p><p>ولما تتجرح، ممكن تختار الصمت أو الانشغال بالشغل والإنجاز، وتبعد لحد ما تحس إنك رجعت متماسك، ثم تتعامل كأن شيئًا لم يحدث. جرّب تسمّي اللي ضايقك لشخص آمن بدل ما تحوّل الانسحاب إلى وسيلة التواصل الوحيدة.</p></article>` : "")) +
      section(3,"","البلوكات الخفية ونقاط التعطيل","تفاصيل القراءة · متاحة للاختبار",blocks + (base === 1 ? `<article class="rd"><h4>ثلاث خطوات: من الوعي إلى الفعل</h4><p><b>1. الوعي:</b> لاحظ اللحظة اللي بتتحول فيها الاستقلالية إلى «لازم أعمل كل حاجة بنفسي»، واسأل نفسك هل ده ضروري فعلًا.</p><p><b>2. قانون السماح ومركز الضفيرة الشمسية:</b> في بعض الممارسات الروحانية، يُستخدم مركز الضفيرة الشمسية كرمز للإرادة والحدود الشخصية.</p><p><b>3. تمرين الثلاثين ثانية:</b> اقفل عينيك نصف دقيقة وتخيّل نفسك الشمس: مصدر ضوء لا يحتاج أن يثبت نفسه بالصراع مع كل شيء. اختار بعدها خطوة صغيرة واقعية بدل انتظار إحساس مثالي بالجاهزية. والإضافة العملية الموجودة في النسخة الحالية، وهي العمل 15 دقيقة على خطوة واحدة، تظل موجودة.</p></article>` : "")) +
      section(4,"","الشفرة العاطفية والجواز وكارما العلاقات","تفاصيل القراءة · متاحة للاختبار",love + (base === 1 ? `<article class="rd"><h4>تفاصيل الشفرة العاطفية: الاحتياج والظل</h4><p>من نقاط القوة المحتملة: الولاء، والحماية، والصراحة، والشغف، والرغبة في بناء مستقبل مشترك. ومن الظل المحتمل: الميل للتحكم، والظهور ببرود وقت الضغط، وصعوبة الاعتذار، وعدم الارتياح للتعلق الزائد، والغيرة التملكية. دي أنماط للتأمل وليست صفات ثابتة لكل شخص يحمل الرقم نفسه.</p><p>الشريك الأنسب ليس شخصًا يلغي نفسه لإرضائك، بل شخص مستقل يقدر يتكلم بوضوح ويشاركك الطموح، وفي نفس الوقت يذكّرك إن القرب لا يعني فقدان الحرية. في رمزية الأرقام، قد يُوصف الانسجام مع 3 و5 بأنه أسهل، ومع 2 و6 بأنه تكاملي، بينما قد يحتاج التفاعل مع 1 و8 أو 4 و7 إلى وعي أكبر بالاختلافات. الأرقام لا تتنبأ بنجاح العلاقة ولا تغني عن معرفة الشخص وسلوكه.</p><h4>ثلاثة مفاتيح للعلاقة</h4><ul><li>فرّق بين الحماية والسيطرة، واسأل شريكك عمّا يحتاجه بدل افتراض أنك تعرف الأفضل.</li><li>تدرّب على الاعتذار المحدد من غير تبرير طويل أو تحويل النقاش لمنافسة.</li><li>وازن بين طاقة المبادرة ومساحة الاستقبال والإنصات.</li></ul><p>تخيّل العلاقة كرقصة تانجو: كل طرف يقود في لحظة ويتبع في لحظة أخرى، مع اتفاق واضح ومساحة آمنة للطرفين.</p></article>` : "")) +
      section(5,"","مغناطيس المال والوفرة والمهنة","تفاصيل القراءة · متاحة للاختبار",money + (base === 1 ? `<article class="rd"><h4>الصورة المهنية والمالية كاملة</h4><p>قد تناسبك رمزيًا مسارات ريادة الأعمال وتأسيس مشروع، والإدارة العليا، والاستشارات، والإعلام وصناعة المحتوى والتسويق، والتقنية والابتكار، خصوصًا عندما تمنحك مساحة للمبادرة واتخاذ القرار. لا يعني ذلك ضمان النجاح في مجال بعينه؛ الاختيار يعتمد على مهاراتك وظروفك والسوق.</p><p>انتبه لثلاثة معطلات محتملة: الخوف من المخاطرة حتى تفوت الفرص، والعناد الإداري ورفض التفويض، وإهمال الحسابات والتفاصيل. حافظ على تتبّع الدخل والمصروفات ومراجعة الأرقام دوريًا، وهي إضافة عملية موجودة بالفعل في هذه النسخة.</p><h4>الوفرة كرمز للتبادل</h4><p>في القراءة الرمزية، «الاستحقاق والتسليم» يعنيان أن تقدر قيمة مجهودك وتطلب مقابلًا مناسبًا، مع الاستعداد لتلقي المساعدة والتعلم، لا انتظار أن «الكون يرتب» الأمور وحده. وتخيّل المال كمغناطيس لا يعمل بالتمني فقط، بل يحتاج قيمة واضحة وخطة وتبادلًا عادلًا وقرارات محسوبة.</p></article>` : "")) +
      section(6,"","خطوات عملية تفرق معاك","تفاصيل القراءة · متاحة للاختبار",practice + (base === 1 ? `<article class="rd"><h4>الروشتة السريعة كما في الخطة الأصلية</h4><ol><li><b>تمرين الـ24 ساعة:</b> اختار يومًا تقلّل فيه التحكم في كل تفصيلة، واسمح لشخص آخر يتولى قرارًا أو مهمة مناسبة من غير تدخل مستمر.</li><li><b>التفويض:</b> فوّض مهمتين محددتين، واشرح النتيجة المطلوبة ثم اترك مساحة للطرف الآخر ينفذ بطريقته.</li><li><b>خمس دقائق صباحًا:</b> تعرّض لضوء الصباح بشكل آمن، وخد نفسًا هادئًا، وذكّر نفسك بجملة عملية مثل: «أقدر أبدأ من غير ما أسيطر على كل شيء».</li></ol><p>التمارين دي أدوات تنظيم ذاتي وليست علاجًا طبيًا أو ضمانًا لتغيير فوري. احتفظ أيضًا بخطوة الـ15 دقيقة الموجودة في النسخة الحالية.</p></article>` : "")) +
      section(7,"","جرح الطفولة والدروس المتكررة والعلاقة بالأطفال","تفاصيل القراءة · متاحة للاختبار",childhood + (base === 1 ? `<article class="rd"><h4>الرمز الكارمي ومسارات الحياة السابقة</h4><p>في بعض مدارس علم الأرقام، يُربط يوم 19 أو مسار 19/1 بموضوعات القوة والأنا والمسؤولية عن أثر القيادة. وفي القراءة الروحانية قد تُطرح صور رمزية عن حياة سابقة: خصمان يتعلمان المصالحة، أو حبيبان فرّقتهما الظروف، أو معلّم وتلميذ يتبادلان درسًا. لا يمكن إثبات هذه الصور تاريخيًا؛ استخدمها كاستعارات تسأل بها نفسك عن الدرس الذي تريد تعلمه الآن، لا كحقيقة مؤكدة أو عقاب كوني.</p><p>الدرس العملي هو أن تستخدم قوتك من غير إلغاء الآخرين، وتطلب الدعم من غير أن تتخلى عن استقلالك. وبالنسبة للأطفال، شجّع الثقة والطموح من غير اشتراط أن يكونوا دائمًا رقم واحد، ولا تجعلهم نسخة منك أو مشروعًا لتحقيق ما لم تحققه. استمع لميولهم وشخصياتهم واحتياجاتهم الفعلية.</p></article>` : "")) +
      `</div>`;
  }
  function applyLP2Sections(root) {
    const setBody = (n, html) => { const el = root.querySelector(`[data-lp-section="${n}"] .lp-sec-body`); if (el) el.innerHTML = html; };
    setBody(1, `
      <article class="rd"><h4>الرادار البشري وصانع السلام</h4><p>لمن مجموع تاريخ ميلاده الكامل يختزل إلى الرقم 2، أو وُلد يوم 2 أو 11 أو 20 أو 29.</p></article>
      <article class="rd"><h4>المعنى العاطفي والنفسي: جوهر روحك الحقيقي</h4><p>لو مسار حياتك هو الرقم (2)، فاعرف إنك مجيتش الدنيا دي عشان تحارب أو تعيش في دوشة وصراعات. روحك شايلة شفرة الاتصال والحدس والاحتواء. إنت «الصمغ» اللي بيربط الناس ببعضها.</p>
      <h4>رادار بشري يلتقط الإشارات</h4><p>ممكن تلاحظ نبرة الصوت أو تعبيرات الوجه أو التناقض بين الكلام والتصرفات بسرعة. أحيانًا إحساسك الأول يلفت نظرك لحاجة تستحق الفحص، لكن الإحساس وحده مش دليل مضمون على نوايا الناس، فوازنه مع الوقائع.</p>
      <h4>بير أسرار وملاذ آمن</h4><p>الناس ممكن ترتاح تحكيلك همومها لأنك بتسمع وبتدي مساحة للكلام من غير حكم متسرع. دورك كمستمع داعم مهم، لكن مش مطلوب منك تمتص كل حزن أو تحل كل مشكلة بدل أصحابها.</p>
      <h4>عاشق للهدوء والسلام</h4><p>ممكن تتعبك الزحمة والصوت العالي والعلاقات السطحية، وتستعيد توازنك في الهدوء أو العزلة المختارة أو قعدة صادقة مع نفسك. غموضك أحيانًا نابع من إنك مش بتفتح قلبك لأي حد بسرعة.</p>
      <h4>طاقة النور</h4><p>لما تكون متزن، ممكن تظهر كدبلوماسي بيعرف يسمع الأطراف المختلفة، ويحل الخلاف بحكمة، ويقدم تعاطفًا من غير ما يلغي نفسه.</p>
      <h4>طاقة الظل</h4><p>لما تستنزف، ممكن تحس إنك إسفنجة شايلة هموم غيرك، وتكتم احتياجاتك عشان ما تزعلش حد. التراكم ده ممكن يؤدي لانفجار أو انسحاب أو حساسية شديدة تجاه كلام عادي.</p></article>
      `);
    setBody(2, `
      <article class="rd"><h4>إزاي الناس بتشوفك من بره: القناع الخارجي والهالة</h4><p>الناس بتشوفك «ملاك الرحمة» أو الملاذ الآمن اللي بيرتاحوا في الكلام معاه. هدوءك ولطفك بيدّوا انطباع بالسلام والتسامح والدبلوماسية، وابتسامتك غالبًا جاهزة. بيحسوا إنك بتعرف تمتص غضب اللي قدامك، ومع الوقت ممكن يتعودوا إنك دايمًا بتسمع وتطبطب لدرجة إنهم ينسوا إن عندك هموم واحتياجات زيهم.</p></article>
      <article class="rd"><h4>إيه اللي بيدور جواك فعلاً: حقيقتك وصراعك الداخلي</h4><p>ورا الهدوء ممكن يكون فيه استنزاف وإحساس بقلة التقدير. ساعات بتحس إنك شيلت هموم اللي حواليك ومحدش سأل: «طب أنا مين هيسمعني؟». ولما تيجي على حساب راحتك عشان ترضي الناس، ممكن تحس بالغضب أو الظلم. حساسيتك للتفاصيل والتلميحات ممكن تخليك تراجع الكلام كتير، خصوصًا بالليل أو في لحظات الهدوء.</p></article>
      <article class="rd"><h4>السر النفسي في التعامل مع الضغوط والصدمات</h4><p>لما تتجرح، ممكن تنسحب أو تلجأ للصمت بدل المواجهة المباشرة، وتبني مسافة بينك وبين الشخص اللي وجعك. ولو المشاعر اتكتمت فترة طويلة، ممكن تخرج فجأة في موقف صغير وبكلام حاد. بدل ما تستنى الطرف التاني يفهم لوحده، جرّب تسمّي اللي ضايقك بوضوح وتحط حدود من غير تجريح.</p></article>`);
    setBody(3, `
      <article class="rd lp-teaser"><span class="eyebrow">سؤال يخصّك</span><h4>ليه دايماً بتحط احتياجات الناس قبل احتياجاتك لحد ما تفقد شغفك ونفسك؟</h4><p>أكبر نقطة تعطيل محتملة في القراءة الرمزية لمسار رقم (2) هي فخ إرضاء الآخرين والتعلق المفرط. ممكن تلاقي نفسك بتتجاهل إحساسك واحتياجاتك عشان تتجنب زعل الناس، لحد ما تتعب أو تبعد عن أهدافك.</p></article>
      <article class="rd"><h4>أولاً: أنماط التعطيل والعيوب الخفية</h4><ul><li>التردد وصعوبة اتخاذ القرار خوفًا من العواقب أو زعل الآخرين.</li><li>التعلق المفرط واستمداد القيمة الذاتية من قبول الناس.</li><li>حساسية عالية وأخذ الكلام بشكل شخصي.</li><li>الخوف من المواجهة واللجوء للصمت أو العدوانية السلبية.</li><li>تجاهل الإحساس الداخلي لإرضاء الآخرين.</li><li>كتمان المشاعر لحد ما تتراكم وتخرج في وقت غير مناسب.</li></ul></article>
      <article class="rd"><h4>ثانياً: التحليل العميق للبلوكات الأربعة</h4><p>في القراءة الرمزية لمسار رقم (2)، الحساسية والرغبة في السلام ممكن تتحول لأنماط محتاجة وعي وحدود واضحة.</p>
      <h4>البلوك الأول: فخ الإسفنجة وإرضاء الآخرين</h4><p>عشان بتحب السلام، ممكن تتنازل عن وقتك وحقوقك عشان تسعد اللي حواليك، وتلاقي صعوبة تقول «لأ» أو تحس بالذنب بعدها. ده ممكن يخلي حدودك غير واضحة ويعرّضك للاستنزاف العاطفي أو المادي.</p>
      <h4>البلوك الثاني: تجاهل الحدس</h4><p>ممكن يكون عندك انطباع أولي قوي تجاه موقف أو شخص، لكن الانطباع وحده مش دليل مضمون على النوايا. بدل ما تكذّب إحساسك أو تعتبره حقيقة مؤكدة، سجّله وراجعه مع السلوك الفعلي والوقائع وحدودك الشخصية.</p>
      <h4>البلوك الثالث: شلل التردد وعقدة الميزان</h4><p>لما تشوف وجهات نظر كل الأطراف، ممكن تطوّل في القرار خوفًا من ظلم حد أو اختيار غلط. جرّب تحدد وقتًا لاتخاذ القرار، وتكتب أهم معيارين عندك، وتقبل إن القرار الجيد مش لازم يكون مثاليًا.</p>
      <h4>البلوك الرابع: الخوف من المواجهة</h4><p>بدل ما تقول إن موقفًا معينًا ضايقك، ممكن تكتم وتنسحب وتستنى الطرف التاني يفهم لوحده. ده غالبًا بيزود سوء الفهم. التعبير الواضح عن اللي ضايقك، من غير تجريح، يساعد على حل المشكلة بصورة مباشرة.</p></article>
      <article class="rd"><h4>ثالثاً:ثلاث خطوات لفك البلوك</h4><h4>1. الوعي والإدراك</h4><p>افتكر إن كلمة «لا» ممكن تكون جملة كاملة من غير تبرير طويل. قيمتك مش مرتبطة بمدى تضحيّتك للآخرين. ابدأ بحد صغير وواضح، وراقب إن كان الطرف الآخر بيحترمه. اللي بيحبك يقدر يتعلم يحترم حدودك، حتى لو احتاج وقتًا لفهمها.</p>
      <h4>2. السر الباطني والطاقي: تنظيف الهالة المائية</h4><p>في بعض التقاليد الباطنية، تُستخدم صور الماء والقمر كرموز للتفريغ العاطفي. تقدر تجرب كتابة مشاعرك، أو الاستحمام، أو قضاء وقت هادئ قرب الماء كطقس شخصي للاسترخاء. دي ممارسات رمزية وليست طريقة مثبتة لإزالة الحسد أو تنظيف هالة حرفية، والملح البحري مش علاجًا لمشكلة نفسية أو جسدية.</p>
      <h4>3. الصورة الذهنية للتشافي</h4><p>كل ما تحس إنك مستنزف أو مش قادر تقول «لأ»، تخيل إنك مش إسفنجة بتشرب كل مية عكرة، لكن مراية بلورية بتعكس النور من غير ما تحتفظ بكل حاجة تمر قدامها. اسمع وادعم، لكن افتكر إن مشاعر الآخرين مسؤوليتهم، وإنك تقدر تتعاطف من غير ما تحمل كل شيء جواك.</p></article>`);
  }

  const LP1_SOURCE_SECTIONS = [{"title":"القسم الأول: شفرة الروح والجوهر","text":"(لمن مجموع تاريخ ميلاده الكامل يختزل إلى الرقم 1، أو وُلد يوم 1، 10، 19، 28)\n\nالمعنى العاطفي والنفسي / طاقة القراءة (جوهر روحك الحقيقي):\n\nلو مسار حياتك هو الرقم (1)، فاعرف إنك مجيتش الدنيا دي عشان تمشي ورا القطيع، أو عشان تعيش حياة عادية متكررة مرسومة ليك من غيرك. روحك شايلة شفرة \"البداية\" وشرارة الخلق الأولى:\n\n• طاقة \"الخلق من العدم\" والعصا السحرية: إنت شخص اتولدت ومعاك \"عصا سحرية\" اسمها الفكرة والكلمة. عقلك مبيبطلش تفكير وابتكار لثانية واحدة، وعندك قدرة مرعبة على تحويل الأفكار اللي في دماغك لواقع ملموس. لما بتحط هدف في راسك، تؤمن بيه، وتركز عليه وتنطقه، الظروف والكون كله بيترتبوا بشكل غريب عشان يحققوهولك، وبتلاقي نفسك بتفتح أبواب كانت مقفولة بالضبة والمفتاح. المستحيل بالنسبة لك هو مجرد رأي مش حقيقة، لأنك مش بتستنى الفرصة تجيلك، إنت اللي بتصنعها من الهوا. بس خد بالك: العصا السحرية دي محتاجة تركيز. لو اشتتت طاقتك على كذا اتجاه في نفس الوقت، السحر بيقل. ركز على حاجة واحدة، وهتشوف العجب.\n\n• روح القائد الفطري (مستحيل تكون رقم 2): إنت بطبعك شخص مستقل لأقصى درجة، بتتنفس حرية، ومبتعرفش تكون \"كمالة عدد\" أو رقم 2 في حياة حد. عندك حساسية مفرطة من إن حد يملي عليك أوامره، يمشيك على مزاجه، أو يحجم طموحك؛ لو حد حاول يعمل كده بتتمرد فوراً. جواك صوت داخلي دايماً بيقولك: \"أنا أقدر أعمل ده بطريقتي، وأعمله أحسن من أي حد\". إنت مش بتدور على القيادة عشان المنظرة، إنت بتقود لأنك بتشوف الطريق بوضوح وقت ما الكل بيكون تايه. بس خد بالك: القيادة الحقيقية مش إنك تعمل كل حاجة لوحدك، القيادة الحقيقية إنك تعرف تختار فريقك وتديه مساحة.\n\n• شجاعة البدء من الصفر ومتلازمة \"الجبل\": إنت المبتكر اللي بيمشي في طريق مفيش رجل داست فيه قبله، ويمهده عشان غيره يمشي وراه. وإنت \"الجبل\" اللي الكل بيتسند عليه وقت الأزمات، بس من كتر ما اتعودت تشيل مسؤوليتك بدري وتحل مشاكلك بإيدك، بقى صعب جداً عليك تطلب مساعدة أو تبين ضعفك لمخلوق. قوتك الخارقة مش في إنك مابتقعش، قوتك في إن الدنيا كلها لو اتهدت فوق دماغك النهاردة، تقدر تقوم تاني يوم الصبح وتبدأ من الصفر كأن شيئاً لم يكن. بس خد بالك: الجبل لوحده صعب يتحرك. أحياناً تحتاج تسيب حد تاني يسندك.\n\n• جوهر طاقتك في الوضع الإيجابي (طاقة النور والاتزان): لما بتكون في قمة اتزانك ووعيك، بتعرف تسخر \"عصاك السحرية\" صح؛ بتكون قائد ملهم وحنون في نفس الوقت، مبدع، واثق في خطواتك من غير غرور، صاحب قرار حاسم، وطاقتك الإيجابية بتكون زي الشمس اللي بتنور وتدفي حياة كل اللي حواليك وتدفعهم للنجاح.\n\n• جوهر طاقتك في الوضع السلبي (طاقة الظل والانحراف): لما طاقتك بتستنزف أو بتفقد توازنك، القوة دي بتتقلب ضدك لواحد من طريقين عكس بعض تماماً: يا إما بتتحول لشخص ديكتاتور، عنيد لأقصى درجة، أناني مببيشوفش غير رأيه، عصبي ومندفع وبيدوس على مشاعر اللي حواليه عشان يوصل لهدفه.. يا إما بتقع في القطب العكسي وتتحول لشخص متردد، خايف يبدأ، فاقد الثقة في نفسه، حاسس بالعجز، وبيرمي لوم فشله على الظروف والناس. الاتنين مش إنت، دول نسختين مشوهتين من طاقتك لما بتفقد توازنها. الحل مش إنك تكتم قوتك، الحل إنك توازنها.\n\nطاقتك نارية، دافئة، وحضورك طاغي؛ مستحيل تدخل مكان وتكون شخص عادي أو مهمش. حتى لو قعدت ساكت متكلمتش ولا كلمة، هالتك بتملى المكان وبتلفت الأنظار ليك تلقائياً، لأنك خُلقت لتكون \"المركز\" والمحرك الأساسي في حياة اللي حواليك.\n\nسؤال للتأمل: إيه الحاجة اللي إنت مستني \"الظروف المثالية\" عشان تبدأها؟ وإيه أصغر خطوة تقدر تعملها النهاردة؟"},{"title":"القسم الثاني: المراية المزدوجة","text":"في مسار الحياة رقم (1)، فيه فجوة كبيرة جداً بين الهالة اللي بتصدرها للعالم، وبين اللي بيحصل جوه عقلك وقلبك لما بتقفل باب أوضتك عليك:\n\n• إزاي الناس بتشوفك من بره (القناع الخارجي والهالة):\nالناس بتشوفك \"شخصية حديدية\" مبتتهزش! في عيون اللي حواليك، إنت الشخص القوي، الواثق في نفسه لأقصى درجة، اللي دايماً عنده حل لأي مصيبة، واللي مبيخافش من حاجة. هالتك من بره بتدي انطباع إنك مستغني بنفسك عن الكل، وإن كلام الناس أو انتقادهم مبيأثرش فيك، بل إن بعض الناس قبل ما تتعامل معاك عن قرب ممكن تخاف من هيبتك أو تفتكرك شخص مغرور، متكبر، أو قاسي المشاعر لأنك مبتحبش المرقعة ولا المجاملات الكدابة.\n\n• إيه اللي بيدور جواك فعلاً (حقيقتك وصراعك الداخلي السري):\nالحقيقة اللي محدش يعرفها غيرك هي إنك من جوه \"بتجلد ذاتك\" بقسوة ميتحملهاش بشر! ورا قناع القوة ده، فيه عقل مبيبطلش تفكير وقلق لثانية واحدة، وخوف مرعب من الفشل أو إنك تطلع قدام الناس في صورة الشخص الضعيف أو المحتاج. إنت أوقات كتير بتحس بوحدة رهيبة حتى وإنت وسط الزحمة، لأن الكل بيتسند عليك ومحدش بيسأل نفسه: \"طب هو مين اللي بيطبطب عليه أو بيشيل عنه؟\". إنت من جوه حساس جداً للكلمة التقديرية، وبتتمنى تلاقي الشخص أو المكان اللي تخلع فيه \"درع المحارب\" ده وتستريح من غير ما حد يحكم عليك أو يستغل نقطة ضعفك. وكل ما تحس إنك \"مش متقدر\" أو \"مش متشاف\"، ده مش لأنك مش كفاية، ده لأنك بتدي من غير ما تطلب، وبتدي لحد ما تفضى. الحل مش إنك تبطل تدي، الحل إنك تتعلم تستقبل، وتطلب، وتقول \"أنا كمان محتاج\".\n\n• السر النفسي في تعاملك مع الضغوط:\nلما بتتوجع أو بتمر بأزمة، إنت مبتشتكيش ومبتعيطش قدام حد؛ إنت بتختفي في صمت أو بتدفن نفسك في الشغل والتفكير لحد ما تعالج جرحك بإيدك، وترجع تاني قدام الناس كأن مفيش حاجة هزتك. الانسحاب ده مش قوة، ده طريقة حماية اتعلمتها. بس خد بالك: الجرح اللي بيتعالج لوحده بيندمل بس بيسيب أثر. الجرح اللي بيتحكي ويتفهم، بيتشفي فعلاً.\n\nسؤال للتأمل: إمتى آخر مرة قلت لحد \"أنا محتاج مساعدة\" أو \"أنا تعبان\" من غير ما تحس إنك ضعيف؟"},{"title":"القسم الثالث: البلوكات الخفية ونقاط التعطيل","text":"ليه كل ما تقرب من هدفك الدنيا بتعاندك؟\nأكبر بلوك طاقي بتطارد صاحب مسار الحياة رقم (1) وبتوقف حاله هي فخ \"أنا هعمل كل حاجة لوحدي\" وعقدة \"إثبات الذات المستمر\". إنت أوقات بتدمر نجاحك بإيدك من غير ما تحس في اللحظة اللي بتتحول فيها قوتك لعناد، أو لما يسيطر عليك خوف سري بيخليك تأجل أهم خطوة في حياتك.\n\nتفاصيل البلوكات الطاقية ونقاط التعطيل في مسار الحياة رقم (1):\nطاقة الرقم (1) قوية جداً زي تيار الكهرباء العالي؛ لو متوجهتش صح بتتحول لـ \"بلوكات\" بتعطل رزقك، نجاحك، وراحتك النفسية. دي أخطر 4 نقاط تعطيل بتقع فيها وإزاي تفكها:\n\n• البلوك الأول: فخ \"السوبرمان\" ورفض التفويض:\nإنت عندك قناعة داخلية إن \"محدش هيعمل الشغلانة دي بنفس كفاءتي وضميري\". النتيجة إنك بتشيل فوق طاقتك، وبترفض تطلب مساعدة أو توزع المهام على غيرك، لحد ما توصل لمرحلة الاحتراق النفسي والجسدي، وتلاقي مشاريعك واقفة لأنك إنسان واحد في النهاية ومش قادر تلاحق على كل حاجة لوحدك. والحقيقة إن اللي بيعمل كل حاجة لوحده، مش بيوصل أسرع، هو بس بيتعب أسرع. اللي بيعرف يفوض، بيوصل أسرع وأبعد.\n\n• البلوك الثاني: متلازمة \"الكل أو لا شيء\" وشلل الكمال:\nمن كتر خوفك السري من الفشل أو إن شكلك يطلع وحش قدام الناس، ساعات بتقع في بلوك غريب جداً: إنك تأجل البداية وتفضل تخطط في دماغك بس! بتقول لنفسك \"لما الظروف كلها تبقى مثالية هبدأ\"، والحقيقة إن ده فخ من عقلك عشان يحميك من احتمالية الخسارة، فبتضيع على نفسك فرص ذهبية كان زمانها نقلتك في حتة تانية خالص. والحقيقة التانية إن مفيش حاجة بتبدأ مثالية. اللي بتبدأ 60% وتكمل، بتوصل. اللي مستني 100%، بيفضل مستني.\n\n• البلوك الثالث: العناد الكارمي وصدام الإيجو:\nتعطيل كبير في حياتك بيحصل بسبب \"الكبرياء الزيادة\". ساعات بتبقى عارف إن الطريق اللي إنت ماشي فيه غلط أو بيجيبلك خسارة، بس بترفض ترجع فيه عشان محدش يقول إنك غلطت! وكمان صدامك مع أي \"سلطة\" (مدير، أب، شريك متسلط، أو قوانين روتينية) بيخليك تخسر معارك مجانية كان ممكن تكسبها بالسياسة والمرونة مش بالعند وكسر العظم. والعند ده مش قوة، ده خوف. خوف إنك تبان ضعيف لو رجعت في كلامك. الرجوع في الغلط مش ضعف، ده شجاعة.\n\n• البلوك الرابع: الإدمان على البدايات والملل من التفاصيل:\nطاقة الرقم (1) بتعشق \"نشوة البداية\" والتحدي الجديد، بس أول ما المشروع أو الموضوع يدخل في مرحلة الروتين والتفاصيل المملة، طاقتك بتطفي وبتزهق بسرعة، فممكن تسيب الحاجة وهي خلاص فاضلها خطوة وتنجح، وتروح تبدأ حاجة جديدة من الصفر، وتفضل داير في ساقية البدايات من غير ما تحصد الثمرة النهائية. والحقيقة إن البداية هي 20% من الشغل، والـ 80% التانية هي التفاصيل. اللي بيكمل في التفاصيل، هو اللي بيحصد.\n\nكيف تفك هذا البلوك في مسارك:\nعشان تفتح مساراتك المقفولة فوراً، لازم تستوعب إن \"طلب المساعدة مش ضعف، ده ذكاء قيادي\". القائد الحقيقي هو اللي بيبني فريق يشيل معاه مش اللي بيشتغل عسكري ووزير وملك في نفس الوقت. درب نفسك تبدأ خطواتك حتى لو جاهز بنسبة 60% بس، واتعلم تفرق بين \"الثقة في النفس\" وبين \"العناد اللي بيخسرك\".\n\nسؤال للتأمل: إيه الحاجة اللي إنت شايلها لوحدك وممكن تسيبها لحد تاني يشاركك فيها؟ وإيه اللي بيمنعك؟\"البلوكات الطاقية\" هنا تعبير رمزي عن أنماط متكررة، مش حقيقة كونية. الأنماط دي قابلة للتغيير بالوعي والتدريب."},{"title":"القسم الرابع: الشفرة العاطفية، الجواز، وكارما العلاقات","text":"ليه علاقاتك العاطفية بتتحول أحياناً لساحة معركة أو صراع قوة خفي؟\nعلى قد ما قلبك كبير ومخلص لحبيبك لآخر نفس، على قد ما عندك \"عقدة خفية\" في الحب: إنت بتتشد للشخص القوي، بس أول ما بتدخل العلاقة، طاقتك القيادية بتشتغل تلقائياً وبتحاول تمشي الدفة على مزاجك أو \"تصلّح\" شريكك! الكارما العاطفية لمسار رقم (1) بتدور دايماً حوالين خوفك السري من إن الحب يلغي استقلاليتك أو يكسرك.\n\nأولاً: ملامح طبيعتك العاطفية (مميزاتك وعيوبك في الحب والجواز):\n\nسماتك كشريك عاطفي (في طاقة النور):\n- الإخلاص المطلق والوفاء (لما بتحب بجد مابتشوفش غير شريكك).\n- الحماية والاحتواء المادي والمعنوي (ضهر وسند حقيقي مبيميلش).\n- الصراحة والوضوح (مبتعرفش تلف وتدور أو تمثل مشاعر مش حاسسها).\n- الشغف العالي، الحرارة العاطفية، والكرم المفرط مع اللي بتحبه.\n- طموح مشترك (بتحب ترفع شريكك معاك لفوق وتنجحوا سوا).\n\nعيوبك العاطفية (في طاقة الظل):\n- حب السيطرة وفرض الرأي تحت مسمى \"أنا خايف على مصلحتك\".\n- جفاف عاطفي ظاهري أحياناً بسبب انشغالك المفرط بالشغل والطموح.\n- صعوبة الاعتذار أو الاعتراف بالغلط بسبب الكبرياء العالي (الإيجو).\n- النفور السريع من الشريك \"الزنّان\"، الضعيف، أو المتعلق بزيادة.\n- الغيرة التملكية الحادة لو حسيت إنك مش \"رقم 1\" وأهم أولوية في حياة شريكك.\n\nثانياً: التحليل العميق لشفرة الحب والجواز لمسار رقم (1):\n\n• مواصفات الشريك اللي بيجيبك الأرض (فتى/فتاة أحلامك طاقياً):\nإنت مستحيل تحترم شريك ضعيف الشخصية، تابع، أو معندوش طموح وكيان خاص بيه. إنت بتتشد مغناطيسياً للشريك الذكي، المستقل، التقيل، اللي ليه حضور وكاريزما، واللي يعرف يحاور عقلك قبل قلبك. عايز شريك يقف جنبك \"كتف في كتف\" كملك وملكة، مش كمدير وموظف! بس خد بالك: الشريك القوي ده مش هيعيش معاك لو حاولت تمشي عليه. هو عايز شريك، مش تابع. فلازم تتعلم إنك تشارك القرار، مش تفرضه.\n\n• البلوك العاطفي وكارما العلاقات (ليه علاقاتك بتتعطل أو تتوتر؟):\nاللعنة العاطفية عندك بتبدأ لما تدخل العلاقة بطاقة \"المنقذ\" أو \"القائد\"؛ فتلاقي نفسك بتختار شريك عنده مشاكل عشان \"تصلحه\" وتشكل حياته على مزاجك، أو تدخل مع شريك قوي زيك فتقلبوا العلاقة \"تكسير عظم\" وعند: مين فينا اللي كلمته هتمشي؟! كمان خوفك الباطني من إن الحب يضعفك بيخليك ساعات تبني سور عالي حوالين قلبك، فتبان قدام شريكك بارد أو قاسي، مع إنك من جوه بتكون بتموت عليه بس كبرياءك مانعك تبين احتياجك ليه. والحقيقة إن الحب مش ضعف، الحب قوة. اللي بيحب بجد، بيقدر يبين احتياجه من غير ما يحس إنه قل.\n\n• طبيعتك في الجواز والاستقرار:\nإنت في بيتك \"عمود خرساني\" يُعتمد عليه؛ بتحب توفر لبيتك وشريكك أعلى مستوى معيشي ممكن، وبتعبر عن حبك بـ \"الأفعال والمواقف والفلوس\" أكتر بكتير من الكلام الرومانسي المعسول. بس عشان جوازك يعيش في سعادة، محتاج شريك يفهم إنك كائن بيقدس \"المساحة الشخصية\"؛ لو حسيت إن الجواز سجن بيخنق حريتك أو بيحاسبك على كل نفس، طاقتك بتطفي وبتبدأ تهرب للشغل أو الصمت. والحقيقة إن الجواز مش سجن، الجواز شراكة. لو حسيت إنه سجن، يبقى فيه حاجة محتاجة تتكلموا فيها.\n\nثالثاً: خريطة التوافق الطاقي (مين ينورك ومين يطفيك؟):\n\n• أعلى توافق روحي وعاطفي (توأم الشعلة والانسجام):\n  - مع مسار رقم (3) ورقم (5): قمة الشغف، الحرية، المرح، والتجدد؛ بيفهموا انطلاقك ومبيخنقوكش بالقيود.\n  - مع مسار رقم (2) ورقم (6): تكامل رهيب (طاقة الشمس والقمر)؛ هما بيدولك الحنان، الدبلوماسية، والاحتواء اللي إنت مفتقده، وإنت بتديهم الأمان، القوة، والقيادة، بشرط إنك متحاولش تلغي شخصيتهم.\n\n• علاقات التحدي وتكسير العظم (تحتاج وعي عالي جداً):\n  - مع مسار رقم (1) زيك أو رقم (8): صراع جبابرة! علاقة فيها انجذاب ناري وطموح مادي رهيب، بس لو مفيش تنازل، هتقلب بمعركة إيجو وسيطرة مين فيكم المدير.\n  - مع مسار رقم (4) ورقم (7): ممكن تحس معاهم بالبرود أو القيود الروتينية اللي بتطفّي شغفك الناري، إلا لو جمعكم هدف عقلي أو عملي مشترك.\n\nرابعاً: ثلاث خطوات لفك البلوك العاطفي (روشتة تشافي القلب):\n\n• 1. الوعي والإدراك العاطفي:\nاحفظ القاعدة دي: \"العلاقة العاطفية مش شركة إنت المدير بتاعها، ومش ساحة حرب الكسبان فيها هو اللي كلمته بتمشي\". في الحب، لما بتكسب النقاش بالعند والكبرياء، إنت في الحقيقة بتخسر قلب شريكك! اتعلم تسيب \"بدلة القائد\" بره باب البيت، وتدخل لشريكك كإنسان بيشارك مش كحاكم بيأمر.\n\n• 2. السر الباطني والطاقي (توازن الطاقة الذكورية والأنثوية):\nمسار الرقم (1) مشبع بـ \"طاقة اليانج\" (Yang - الطاقة الذكورية الفاعلة: العقل، الفعل، الحسم، والسيطرة) سواء كنت راجل أو ست! عشان كده شاكرا القلب عندك ساعات بتتحاصر بدرع حديد عشان تحمي نفسك من الوجع. السر الباطني لشفاء علاقاتك هو تفعيل \"طاقة الين\" (Yin - طاقة الاستقبال، الليونة، والاحتواء): اسمح لنفسك تكون \"ضعيف\" وحقيقي قدام شريكك، واطلب الحنان اللي إنت محتاجه بصراحة بدل ما تستناه يفهم لوحده وتتعصب لما مياخدش باله.\n\n• 3. الصورة الذهنية لتشافي العلاقات (حط الصورة دي في عقلك وقت الخلاف):\nكل ما تلاقي نفسك شادد مع شريكك، أو الكبرياء والعند راكبين دماغك ورافض تتنازل، غمض عينك لـ 30 ثانية واستحضر الصورة دي:\n\"تخيل إن علاقتك بشريكك هي (رقصة تانجو) بين ملك وملكة، مش مباراة ملاكمة في حلبة! في الملاكمة، لازم واحد يقع على الأرض عشان التاني يفوز.. لكن في الرقصة، لو طرف واحد زق التاني بقوة أو مشي لوحده، الرقصة كلها هتبوظ والاتنين هيقعوا. القوة الحقيقية هنا هي إنك تخطو خطوة لقدام بحماس، وترجع خطوة لورا بنعومة عشان تدي لشريكك مساحة يتحرك ويتألق معاك في نفس اللوحة.\"\n\nسؤال للتأمل: في آخر خلاف، إنت كنت عايز تكسب النقاش، ولا عايز تحافظ على العلاقة؟ وإيه اللي كان هيفرق؟"},{"title":"القسم الخامس: مغناطيس المال، الوفرة، والمهنة","text":"ليه الفلوس أحياناً بتجري من إيدك، أو ليه بتحس إن دخلك مش معبر عن مجهودك الجبار؟\nرزق صاحب مسار الحياة رقم (1) مش مرتبط بـ \"مرتب ثابت\" أو وظيفة تقليدية روتينية؛ رزقك معلق بسما وبأرض اسمك، تفردك، ومهارتك الخاصة. بس الغلطة اللي بتوقع فلوسك وتعملك بلوك مالي هي لما بتشتغل تحت إيد مدير أقل منك كفاءة، أو لما بتخاف تاخد \"المجازفة الكبيرة\" اللي على قد طموحك.\n\nأولاً: ملامح طبيعتك المادية والمهنية (مميزاتك وعيوبك في الفلوس والشغل):\n\nسماتك المالية والمهنية (في طاقة النور):\n- القدرة الفطرية على صنع ثروة من العدم وبدء مشاريع ناجحة من الصفر.\n- كرم عظيم وحب للصرف ببزخ على نفسك وعلى اللي بتحبهم (مبتسترخصش في الحاجة النضيفة).\n- استقلالية تامة في الشغل (أفضل مدير لنفسك، ومبتعرفش تشتغل مرؤوس للأبد).\n- سرعة البديهة والجرأة في اقتناص الفرص اللي غيرك بيخاف يقرب منها.\n\nعيوبك المالية والمهنية (في طاقة الظل):\n- إدمان الشغل لدرجة إهمال صحتك وحياتك الشخصية عشان الفلوس والنجاح.\n- التهور المالي أحياناً (الصرف بعشوائية وقت الحماس، أو الدخول في استثمار غير محسوب).\n- الصدام المستمر مع رؤساء العمل أو الشركاء بسبب رفضك التام لأي أوامر أو قيود.\n- صعوبة الادخار على المدى الطويل لو مفيش هدف استثماري كبير وواضح قدام عينك.\n\nثانياً: التحليل العميق لشفرة المال والمهنة لمسار رقم (1):\n\n• إزاي الفلوس بتجيلك؟ (شفرة الرزق والوفرة):\nفلوسك وبركتك مربوطة بـ \"اسمك الشخصي، براندك، وقراراتك المستقلة\". مستحيل تغنى وأنت موظف بتقبض قبض ثابت وبتنفذ أوامر غيرك طوال العمر. طاقة الرقم (1) هي طاقة \"المؤسس\"؛ الفلوس بتجيلك لما بتاخد الزمام، تفتح بيزنس خاص بيك، أو تبتكر خدمة ومحتوى مفيش زيه في السوق. كل ما كنت جريء في طرح فكرتك، كل ما الكون فتحلك أبواب الوفرة على مصراعيها.\n\n• البلوك المالي والتعطيل (إيه اللي بيبوظ عليك الفلوس؟):\nالبلوك المالي الأكبر عندك بيحصل في حالتين: الأولى هي \"الخوف من المجازفة\" والقعود في وظيفة آمنة بس ميتة (بتموت إبداعك وبتقفل رزقك)، والتانية هي \"العناد الإداري\" (إنك تدخل شراكة مع ناس مش على نفس وفاقك الفكري وتصر تمشي دماغك بالعافية لحد ما المشروع يخسر). كمان إهمالك لتفاصيل الحسابات البسيطة واعتمادك الكلي على \"الحماس الفجائي\" بيعمل ثغرات في فلوسك.\n\n• المجالات الأنسب لتحقيق الثروة:\nريادة الأعمال والبيزنس الخاص، الإدارة العليا، الاستشارات، الإعلام، صناعة المحتوى والتسويق الرقمي، التكنولوجيا، الابتكار، أو أي مجال تفتح فيه \"طريق جديد\" وتكون إنت الـ Boss بتاع نفسك فيه.\n\nثالثاً: ثلاث خطوات لفك البلوك المالي (روشتة جذب الثروة):\n\n• 1. الوعي والإدراك المالي:\nاعرف واقتنع تماماً بقاعدة: \"أنت لست موظفاً، أنت مؤسس وبصمتك لا تقدر بثمن\". متقبلش بأقل من قيمتك الحقيقية في أي شغل أو تعاقد. اتعلم تفصل بين \"قوة اتخاذ القرار\" وبين \"العناد في إدارة المال\"، وحط جزء من أرباحك في استثمارات واضحة بدل ما تصرفها كلها تحت تأثير نشوة الإنجاز اللحظي.\n\n• 2. السر الباطني والطاقي (تدوير طاقة العطاء والأخذ):\nفي علم الطاقة، رقم (1) طاقته قوية في \"الكتساب والدفع\" (طاقة نارية سريعة)، بس أحياناً بيحصل عنده شح في الاستقبال لأنه عايز يعمل كل حاجة بنفسه. السر الباطني لجذب المال هو \"تفعيل الاستحقاق والتسليم\": اعتبر الفلوس طاقة وليست ورقة، وكل ما قيمت نفسك صح وطلعت نسبة للصدقات أو الدعم بنية \"البركة\"، كل ما تيار الوفرة اتقلب عندك وبقى شلال مبيوقفش.\n\n• 3. الصورة الذهنية لجذب الثروة (حط الصورة دي في عقلك دايماً):\nلما تحس إن الدنيا ضيقة مادياً أو إن رزقك متعطل، غمض عينك لـ 30 ثانية واستحضر الصورة دي:\n\"تخيل إنك مش شخص بيجري حفيان ورا لقمة العيش.. تخيل إنك (مغناطيس ضخم للحديد والذهب). المغناطيس مبيجريش ورا المسامير، هو قاعد مكانه ثابت، واثق، وهادي.. وبمجرد ما بينشط مجاله المغناطيسي، كل قطع الذهب والفرص والفلوس اللي في المكان بتنجذب ليه مسرعة وبتلزق فيه تلقائياً.\"\nثبت الصورة دي: لا تجري ورا الفلوس.. اجعل نفسك مغناطيس لها!\n\nسؤال للتأمل: إيه الحاجة اللي إنت خايف تطلب فيها قيمتك الحقيقية؟ وإيه اللي بيمنعك؟\"شفرة الرزق\" و\"جذب الثروة\" هنا لغة رمزية للتأمل في عاداتك المالية، مش وعد بثراء مضمون. القرارات المالية الكبيرة محتاجة دراسة ومتخصصين."},{"title":"القسم السادس: خطوات عملية تفرق معاك","text":"معرفة مشكلتك هي نص الحل، بس النص التاني والمهم هو: \"إزاي تتغير عملياً من بكره الصبح؟\"\nلو فضلت ماشي بنفس الطريقة القديمة (العناد، حرق الدم، ورفض المساعدة)، هتفضل تلف في نفس الساقية.. روشتة التشافي لمسار رقم (1) مش كلام تنمية بشرية رخيص، دي تمارين طاقية ونفسية صارمة هتعيد ضبط شفرة روحك وتخليك تبدأ صح.\n\nالروشتة العملية الفورية لتغيير حياتك (3 خطوات للتطبيق المباشر):\n\n• 1. خطوة \"تفريغ السيطرة\" (تمرين الـ 24 ساعة):\n  - إزاي تعملها: في أول يوم من كل أسبوع، هات ورقة واكتب فيها كل الحاجات اللي \"حارق دمك\" وعايز تسيطر عليها وتصلحها في حياة الناس اللي حواليك أو في شغلك. وبعدين خد قلم واشطب عليهم كلهم واكتب جملة واحدة بخط عريض: \"ليس لي سلطة إلا على نفسي\".\n  - النتيجة: لما بتدرب عقلك يهدأ ويسيب التفاصيل اللي مش بتاعتك، طاقتك بتتركز في المكان الصح، وبتكتشف إن الأمور بتمشي وتتصلح لوحدها من غير ما تحرق أعصابك.\n\n• 2. خطوة \"تفعيل فريق العمل\" (قانون التفويض):\n  - إزاي تعملها: ابطل تلعب دور \"السوبرمان\" اللي بيعمل كل حاجة لوحده. من بكره، حدد مهلتين أو شغلتين في حياتك اليومية أو المهنية (حتى لو تافهة) واطلب من شخص تاني إنه يعملهالك، واقبل إنها تتنفذ بطريقته مش بطريقتك بالحرف.\n  - النتيجة: ده بيكسر \"عقدة السيطرة\" جواك، وبيدي مساحة لغيرك يشيل معاك، وفي نفس الوقت بيفضي جدول وقتك عشان تركز في الإبداع والتفكير الكبير اللي بيجيب فلوس ونجاح حقيقي.\n\n• 3. خطوة \"طقوس التجديد الصباحي\" (شحن بطارية الشمس):\n  - إزاي تعملها: أول ما تصحى الصبح، وقبل ما تفتح موبايلك أو تشوف مصايب الدنيا، اقعد 5 دقائق بس في مكان فيه شمس أو نور هادي، خد نفس عميق، وقول لنفسك بصوت مسموع: \"أنا أبدأ يومي بقوتي الذاتية، ومستقل بذاتي، ومش محتاج إثبات لأي حد\".\n  - النتيجة: التمرين ده بيعيد ضبط شاكرا الضفيرة الشمسية عندك، وبيشحن هالتك بطاقة البدايات النظيفة، ويخليك تدخل يومك وأنت \"المتزن\" مش \"المستفز\".\n\nسؤال للتأمل: إيه أصغر خطوة من التلاتة دي تقدر تبدأ بيها بكرة الصبح؟"},{"title":"القسم السابع: جرح الطفولة، الدين الكارمي، وعلاقتك بالأطفال","text":"ليه دايماً بتحس إنك لازم تحارب عشان تثبت وجودك، وإنك لو متسندتش على نفسك هتقع؟\nالعند، وحب السيطرة، ورفضك لطلب المساعدة مش مجرد \"صفات في شخصيتك\"، دي أدوات دفاعية بناها عقلك بسبب \"جرح طفولة\" قديم اتفرضت عليك فيه المسؤولية بدري، أو اتكتم فيه صوتك. زائد إن مسار رقم (1) بيحمل \"دين كارمي\" من حيوات سابقة يخص استخدام السلطة.\n\nأولاً: جرح الطفولة والطفل الداخلي:\nأغلب أصحاب مسار الحياة رقم (1) عاشوا طفولة مفيهاش رفاهية \"الاعتماد على الكبار\" بشكل كامل. جرح طفولتك بيتمثل في حاجة من الاتنين:\n\n• كبرت قبل الأوان: ظروف العيلة أو غياب الدعم العاطفي خلتك تشيل مسؤولية نفسك (أو إخواتك) من وأنت طفل، فاتبرمجت على إن \"محدش هينفعني غير دراعي\".\n\n• قمع الاستقلالية: أو إنك كنت طفل متمرد ومختلف، وأهلك أو المجتمع حاولوا يقمعوا شخصيتك ويمشوك على مزاجهم ويقارنوك بغيرك، فكبرت جواك طاقة \"غضب وتمرد\" بتخليك دلوقتي ترفض أي سلطة وتستميت عشان تثبت إنك الأفضل.\n\nثانياً: الدين الكارمي لمسار (1) - (عقدة الأنا والسلطة):\nفي علم الأرقام الكارمي، الرقم (1) (وخصوصاً لو مجموع تاريخ ميلادك كان 19 واختزل لـ 1) بيحمل كارما تخص \"الأنانية واستخدام السلطة\".\n\n• رسالة الكارما بتاعتك: في الماضي (أو في حيوات سابقة)، إنت استخدمت قوتك وقيادتك عشان مصلحتك الشخصية ودست على اللي حواليك، أو العكس: كنت شخص تابع وضعيف جداً ومسلوب الإرادة. الكون بعتك في المسار ده عشان تتعلم الدرس الأصعب: \"إزاي تكون قائد قوي ومستقل، من غير ما تكون ديكتاتور بيلغي وجود الآخرين\". الكارما بتضربك لما بتتكبر، وبتكافئك لما بتستخدم قوتك عشان ترفع غيرك معاك.\n\nثالثاً: علاقتك بالأطفال والتربية (أنت كأب / أم):\n\n• مميزاتك في التربية: إنت أب/أم \"أسد\"؛ بتحمي ولادك بشراسة، وبتزرع فيهم الثقة بالنفس، الطموح، والاعتماد على الذات من وهم صغيرين. بتحب توفرلهم أحسن مستوى ممكن ومبتستخسرش فيهم حاجة.\n\n• عيوبك في التربية (احذر منها): بسبب طموحك العالي، ممكن تكون \"قاسي أو متطلب جداً\"؛ عايز ولادك دايماً يطلعوا الأوائل ومبتقبلش منهم الضعف. وكمان ممكن تحاول ترسم لهم مستقبلهم على مزاجك وتنسى تديهم حرية الاختيار.\n\n• نصيحة ذهبية: افتكر إن طفلك مش \"نسخة مصغرة منك\" ومش مشروع مطلوب منه يحقق اللي إنت معرفتش تحققه. اديله مساحة يغلط ويكون ضعيف عادي، وحضنه أهم بكتير من إنك تطلب منه يكون \"رقم واحد\" طول الوقت.\n\nسؤال للتأمل: إيه الحاجة اللي كنت محتاج تسمعها وإنت صغير، ولسه محتاج تسمعها النهاردة؟"}];

/* تدقيق المحتوى: مسارات 1–9 من ملفات المصدر المعتمدة؛ الماستر 11/22/33 للأقسام 4–7 من ملفاتها الأصلية. النصوص محفوظة دون تلخيص أو إزالة للتكرار. */
const LP_COMPLETE_SOURCE = {"2":{"1":{"title":"القسم الأول: شفرة الروح والجوهر","text":"(لمن مجموع تاريخ ميلاده الكامل يختزل إلى الرقم 2، أو وُلد يوم 2، 11، 20، 29)\n\nالمعنى العاطفي والنفسي / طاقة القراءة (جوهر روحك الحقيقي):\n\nلو مسار حياتك هو الرقم (2)، فاعرف إنك مجيتش الدنيا دي عشان تحارب أو تعيش في دوشة وصراعات. روحك شايلة شفرة \"الاتصال، الحدس، والاحتواء\". إنت \"الصمغ\" اللي بيربط الناس ببعضها، وجوهرك بيتكون من التفاصيل دي:\n\n• رادار بشري بيكشف الكدب من أول نظرة: إنت عندك \"حاسة سادسة\" مرعبة؛ الشخص ممكن يكون واقف قدامك بيضحك في وشك وبيقول كلام حلو ومترتب، بس قلبك من جوه \"قافش\" نيته الحقيقية بالمللي. إنت مبتتخدعش بالكلام، إنت بتقرأ \"الطاقة\" والذبذبات اللي طالعة من اللي قدامك، ودايماً إحساسك الأول بيطلع صح 100%. حدسك ده مش خيال، ده حاسة حقيقية عندك، بس محتاج تتعلم تفرق بين الإحساس اللي بيجي من القلب، والوسوسة اللي بتيجي من الخوف. لما الإحساس يجي هادي وواضح من غير توتر، ده حدسك. لما يجي مليان قلق وتوتر، ده خوفك. اتعلم تفرق بينهم، وهتثق في نفسك أكتر.\n\n• بير أسرار وملاذ آمن: الناس بترتاح تحكيلك همومها وتفاصيل حياتها من غير ما تفهم ليه! طاقتك هادية، عميقة، وفيها حكمة أكبر من سنك. إنت المستمع الأعظم، اللي بيعرف يمتص غضب وحزن اللي قدامه ويطبطب على روحه، عشان كده إنت دايماً \"المستشار النفسي\" لأصحابك وعيلتك. بس خد بالك: إنك تكون سند لحد، ده مش معناه إنك تحمل همومه بدل منه. فيه فرق بين إنك تسمع وتدعم، وبين إنك تتعب نفسيًا وإنت مش مسؤول. اتعلم تحط الحد ده، وهتوفر على نفسك كتير.\n\n• عاشق للهدوء والسلام (عدو الدوشة): إنت شخص مبيحبش الزحمة، الصوت العالي، أو العلاقات السطحية والمزيفة. بتشحن طاقتك في الهدوء، العزلة، الليل، والقعاد مع نفسك. وراك دايماً هالة من الغموض بتخلي الناس عندها فضول رهيب تفهم إنت بتفكر في إيه، بس إنت مبتفتحش باب قلبك إلا للي يستاهل بجد. الغموض ده مش تكبر، ده حماية. إنت بتفتح قلبك بالتدريج، وده صح.\n\n• جوهر طاقتك في الوضع الإيجابي (طاقة النور): لما بتكون متزن، بتكون الدبلوماسي العبقري اللي بيعرف يحل أي مشكلة بحكمة من غير ما يكسر خاطر حد. بتكون متعاطف، داعم، شريك مثالي، وبتستخدم حدسك عشان توجه نفسك واللي حواليك لبر الأمان. في الحالة دي، إنت بتدي الناس إحساس إنهم مش لوحدهم، وإن حد فاهمهم من غير ما يحكوا.\n\n• جوهر طاقتك في الوضع السلبي (طاقة الظل والانحراف): لما طاقتك بتستنزف، بتتحول لـ \"إسفنجة\" بتمتص طاقات الناس السلبية فبتمرض وتكتئب. أكبر فخ بتقع فيه هو إنك \"تكتم جواك عشان متزعلش حد\" لحد ما تنفجر في اللي قدامك انفجار مرعب وتجيبله قديمه وجديده، أو إنك تتحول لشخص غامض بزيادة، بارد المشاعر، وحساس لدرجة إن الكلمة العادية ممكن تجرحك لأيام. الانفجار ده مش شر، ده إشارة إنك كتمت كتير أوي. الحل مش إنك تكتم أقل، الحل إنك تعبر أول بأول.\n\nطاقتك مائية وهوائية؛ ناعمة بس عميقة جداً، وتقدر تخترق قلوب الناس وتفهم اللي مخبينه عن نفسهم.\n\nسؤال للتأمل: إمتى آخر مرة سمعت حدسك وطلع صح، وإمتى كتمته وندمت؟ وإيه اللي بيمنعك تثق في نفسك أكتر؟"},"2":{"title":"القسم الثاني: المراية المزدوجة","text":"في مسار الحياة رقم (2)، التناقض بين هدوئك الخارجي والبركان اللي جواك بيخلق فجوة عميقة محدش بيحس بيها غيرك:\n\n• إزاي الناس بتشوفك من بره (القناع الخارجي والهالة):\nالناس بتشوفك \"ملاك الرحمة\" أو الملاذ الآمن اللي بيرتاحوا في الكلام معاه! هالتك الخارجية بتدي انطباع بالسلام، الهدوء، واللطف الشديد. بيشوفوك شخص متسامح، دبلوماسي، ملوش في المشاكل، وابتسامتك دايماً جاهزة. في عيونهم، إنت الشخص \"السهل الممتنع\" اللي بيعرف يمتص غضب أي حد، ولأنك دايماً بتسمعهم وتطبطب عليهم، الناس بتتعود على ده لدرجة إنهم بينسوا أصلاً إنك إنسان وعندك مشاكل، وبيفتكروك عايش مرتاح ومعندكش هموم!\n\n• إيه اللي بيدور جواك فعلاً (حقيقتك وصراعك الداخلي السري):\nالحقيقة اللي بتخبيها ورا هدوئك ده هي إنك \"مستنزف طاقياً\" وموجوع من قلة التقدير! إنت من جوه عامل زي الإسفنجة اللي شربت هموم وطاقات كل اللي حواليها لحد ما تقلت ومش قادرة تتنفس. جواك صوت بيصرخ ويسأل: \"طب أنا مين هيسمعني؟ مين هيحس بيا من غير ما أطلب؟\" أحياناً بتحس بالغضب المكتوم والظلم لأنك بتيجي على حساب راحتك عشان ترضيهم، وهم بياخدوا عطاءك كأنه \"حق مكتسب\". حساسيتك المفرطة بتخليك تلقط نظرات وتلميحات محدش غيرك بياخد باله منها، وبتقعد بالليل تفصص الكلمات وتأكل في روحك من التفكير. وكل ما تحس إنك \"مش متقدر\" أو \"مش متشاف\"، ده مش لأنك مش كفاية، ده لأنك بتدي من غير ما تطلب، وبتدي لحد ما تفضى. الحل مش إنك تبطل تدي، الحل إنك تتعلم تستقبل، وتطلب، وتقول \"أنا كمان محتاج\".\n\n• السر النفسي في تعاملك مع الضغوط والصدمات:\nلما بتتجرح أو حد بيخذلك، إنت مبتواجهش بصوت عالي ومبتعملش فضيحة؛ إنت بتعاقب بـ \"الصمت\"، بتنسحب بهدوء، وبتبني حيطة ثلج بينك وبين اللي وجعك. بس لو الضغط زاد عن حده وكتمت كتير، بتنفجر فجأة في أبسط موقف، وبتضرب بكلمات زي السم في مقتل، لأنك -كرادار بشري- حافظ نقط ضعف اللي قدامك كلها وعارف إزاي توجعه بالظبط! الانفجار ده مش شر، ده إشارة إنك كتمت كتير أوي. الحل مش إنك تكتم أقل، الحل إنك تعبر أول بأول.\n\nسؤال للتأمل: إمتى آخر مرة قلت لحد \"أنا زعلان\" أو \"أنا محتاج مساعدة\" من غير ما تستنى حد يلاحظ لوحده؟"},"3":{"title":"القسم الثالث: البلوكات الخفية ونقاط التعطيل","text":"ليه دايماً بتحط احتياجات الناس قبل احتياجاتك لحد ما تفقد شغفك ونفسك؟\nأكبر بلوك طاقي بيعطل حياة صاحب مسار رقم (2) هو فخ \"إرضاء الآخرين\" وعقدة التعلق المفرط. إنت بتدمر حظك وبتعطل نجاحك في اللحظة اللي بتكدب فيها إحساسك الداخلي وتمشي ورا كلام الناس عشان خايف على زعلهم.\n\nأولاً: أنماط التعطيل والعيوب الخفية لمسار رقم (2) في نقاط سريعة:\n\n• التردد اللانهائي وصعوبة اتخاذ القرارات خوفاً من العواقب أو زعل الآخرين.\n• التعلق المفرط واستمداد قيمتك من حب الناس ليك.\n• حساسية مفرطة وأخذ كل كلمة بتتقال على محمل شخصي.\n• الخوف المرضي من المواجهة، واللجوء للعدوانية السلبية أو \"القمصة الصامتة\".\n• تجاهل الحدس والصوت الداخلي عشان ترضي المنطق أو تجامل الناس.\n• كتمان المشاعر لحد الانفجار المدمر في أوقات غير مناسبة.\n\nثانياً: التحليل العميق للبلوكات الطاقية الأربعة:\nطاقة الرقم (2) مائية وحساسة جداً؛ لو ماتعلمتش تحميها، هتعمل بلوكات بتسحب رزقك وصحتك النفسية:\n\n• البلوك الأول: فخ \"الإسفنجة\" وإرضاء الآخرين:\nعشان إنت بتدور على السلام بأي تمن، بتلاقي نفسك بتتنازل عن حقوقك ووقتك عشان تسعد اللي حواليك. مابتعرفش تقول \"لأ\"، ولما بتقولها بتحس بالذنب وتأنيب الضمير! البلوك ده بيخليك تعيش حياة غيرك مش حياتك، وبيخلي الناس تستبيح حدودك وتستغلك عاطفياً ومادياً. والحقيقة إن كل مرة بتقول \"لأ\" وانت شايفها صعبة، إنت بتكبر، وبتعلم الناس إنك كيان له حدود، مش مجرد \"حديقة عامة\" يدخلها أي حد.\n\n• البلوك الثاني: خيانة الحدس:\nزي ما الكاهنة العليا بتعرف السر، قلبك دايماً بيديلك الإجابة الصح من أول ثانية (سواء في شغل أو علاقة). بس أكبر تعطيل بيحصلك هو لما بتكذب إحساسك ده، وتسمع كلام الناس أو تحاول تلاقي مبررات عقلانية لشخص نيتيته سيئة. كل مرة بتعصي فيها حدسك، بتلبس في حيطة وبترجع تقول: \"أنا كنت حاسس وعارف من الأول!\". الإحساس اللي بيجي هادي وواضح = حدس. الإحساس اللي بيجي مليان قلق وتوتر = خوف. اتعلم تفرق بينهم.\n\n• البلوك الثالث: شلل التردد وعقدة \"الميزان\":\nمن كتر ما إنت بتشوف كل الزوايا وبتقدر وجهات نظر كل الأطراف، بتاخد وقت طويل جداً عشان تاخد قرار حاسم، خوفاً من إنك تظلم حد أو تختار غلط. التردد ده بيضيع عليك فرص ذهبية، وبيخليك أحياناً تسيب غيرك ياخد القرار بالنيابة عنك، فتتحول لـ \"مفعول به\" في قصة حياتك بدل ما تكون البطل. الحل مش إنك تختار بسرعة، الحل إنك تحدد وقت للقرار، وبعدها تختار وخلاص.\n\n• البلوك الرابع: الخوف من المواجهة:\nلما بتزعل من حد، مابتعرفش تواجهه وتقوله في وشه \"أنت ضايقتني في كذا\". بتفضل تكتم جواك، وتنسحب، وترد باختصار، وتستناه هو يحس على دمه ويفهم لوحده! الطريقة دي بتعقد المشاكل أكتر مابتحلها، وبتعملك \"بلوك طاقي\" في شاكرا الحنجرة بيأثر على تعبيرك عن نفسك. المواجهة الهادية مش خناقة، دي حقك. تقول \"أنا حسيت بكذا لما حصل كذا\" ده مش هجوم، ده تعبير.\n\nثالثاً: ثلاث خطوات لفك البلوك الطاقي (الروشتة الروحية والذهنية):\n\n• 1. الوعي والإدراك (تعديل البرمجة العقلية):\nاكتب الجملة دي قدام عينك دايماً: \"كلمة (لا) هي جملة مفيدة وكاملة، ولا تحتاج إلى تبرير\". قيمتك كإنسان مش مربوطة بمدى تضحيتك عشان غيرك. ابدأ حط حدود صحية، وافهم إن زعل الناس أحياناً ضريبة ضرورية عشان تحافظ على صحتك النفسية. اللي بيحبك بجد هيحترم حدودك، واللي بيزعل منها هو أصلاً كان مستفيد من انعدامها.\n\n• 2. السر الباطني والطاقي (تنظيف الهالة المائية):\nبما إن طاقتك مائية واستقبالية (طاقة القمر)، فإنت بتلقط طاقات الحسد والتوتر من اللي حواليك بسرعة جداً. مركز التعطيل عندك بيكون في \"شاكرا العجز\" أسفل السرة. السر الباطني لفك بلوكاتك هو \"التفريغ المستمر\"؛ اقعد جنب بحر، خد شاور بمية وملح بحري، أو اكتب مشاعرك في ورقة واقطعها. متنمش أبداً وإنت شايل طاقة زعل أو هم حد تاني في هالتك.\n\n• 3. الصورة الذهنية للتشافي (حط الصورة دي في عقلك دايماً):\nكل ما تحس إنك مستنزف من مشاكل الناس، أو إنك مش قادر تقول \"لأ\"، أو إن حد بيحملك فوق طاقتك، غمض عينك واستحضر الصورة دي:\n\"تخيل إنك مش (إسفنجة) بتشرب مية عكرة من كل اللي بيعدي عليها لحد ما تتعصر وتدوب.. تخيل إنك (مراية بلورية نقية). المراية بتعكس النور وبتوري الناس حقيقتهم، لكنها مستحيل تسمح لأي حاجة تخترقها أو تعيش جواها. اسمع، ادعم، ووجه.. لكن اعكس المشاعر لأصحابها ومتشربهاش جواك.\"\n\nسؤال للتأمل: إيه الحاجة اللي إنت شايلها لوحدك وممكن تسيبها لحد تاني يشاركك فيها؟ وإيه اللي بيمنعك؟\"البلوكات الطاقية\" هنا تعبير رمزي عن أنماط متكررة، مش حقيقة كونية. الأنماط دي قابلة للتغيير بالوعي والتدريب."},"4":{"title":"القسم الرابع: الشفرة العاطفية، الجواز، وكارما العلاقات","text":"ليه دايماً بتدي في الحب أكتر ما بتاخد، وبتلاقي نفسك بتجذب شريك نرجسي أو أناني يستنزف طاقتك؟\nالحب بالنسبة لصاحب مسار رقم (2) مش مجرد جزء من الحياة، ده هو \"الأكسجين\" ومعنى الوجود نفسه. بس الكارما العاطفية الأخطر عندك هي إنك من كتر حنانك وخوفك من الهجر، بتدوب في الشريك لدرجة إنك بتلغي شخصيتك، وبتتحول في العلاقة لـ \"أم أو معالج نفسي\" مش حبيب.\n\nأولاً: ملامح طبيعتك العاطفية (مميزاتك وعيوبك في الحب والجواز):\n\nسماتك كشريك عاطفي (في طاقة النور):\n- احتواء وحنان ملهومش حدود (إنت الحضن الدافي اللي بيشفي جروح شريكه).\n- قراءة أفكار الشريك ومشاعره من غير ما يتكلم (بتفهمه من نظرة عينه ونبرة صوته).\n- الإخلاص، الرومانسية العميقة، والاهتمام بأدق التفاصيل الصغيرة اللي بتفرح الطرف التاني.\n- الصبر الطويل، التسامح، والقدرة على امتصاص غضب الشريك وقت الخلافات.\n- تقديس الجواز، البيت، والاستقرار العاطفي والأسري فوق أي اعتبار.\n\nعيوبك العاطفية (في طاقة الظل):\n- التعلق المرضي والخوف المرعب من الفراق أو الوحدة.\n- لعب دور \"الضحية أو المنقذ\"؛ بتختار شريك مكسور أو سام عشان تعالجه على حساب أعصابك.\n- الحساسية المفرطة والقمصة الصامتة؛ بتزعل من أقل كلمة أو تجاهل وتستنى الشريك يصالحك من غير ما تقوله إنت زعلان ليه!\n- الغيرة المكتومة والشك الصامت لما حدسك يلقط أي تغير بسيط في طاقة شريكك.\n- إلغاء الذات؛ بتنسى صحابك وهواياتك وطموحك وتخلي الشريك هو محور كونك الوحيد.\n\nثانياً: التحليل العميق لشفرة الحب والجواز لمسار رقم (2):\n\n• مواصفات الشريك اللي بيجيبك الأرض (فتى/فتاة أحلامك طاقياً):\nإنت مبتتشدش للمظاهر الكدابة ولا للشخص السطحي التافه. اللي بيجيبك الأرض هو الشريك \"الحنين، العميق، والواضح\" اللي يديك (الأمان العاطفي). إنت محتاج شريك قوي يحتوي خوفك، وفي نفس الوقت يكون حساس يقدر قيمتك، يسمعك زي ما بتسمعه، ويحسسك إنك مفهوم ومحبوب لذاتك مش عشان الخدمات والتضحيات اللي بتقدمها.\n\n• البلوك العاطفي وكارما العلاقات (ليه علاقاتك بتوجعك أحياناً؟):\nاللعنة العاطفية لمسار رقم (2) هي \"عقدة المنقذ وإرضاء الشريك\". لأنك شخص معطاء بطبعك، بتجذب ليك مغناطيسياً الأشخاص \"الاستغلاليين أو النرجسيين\" اللي بياخدوا طاقتك وحنانك ومبيدوش حاجة في المقابل! البلوك بيحصل لما ترضى بالفتات العاطفي، وتفضل تبرر لشريكك قسوته أو إهماله عشان بس خايف العلاقة تتهد وتبقى لوحدك. والحقيقة إن الوحدة وأنت مع حد مش بيديك = أسوأ من الوحدة وأنت لوحدك. علشان كده، اسمع حدسك من الأول. لو حسيت بانقباضة من حد، دي إشارة.\n\n• طبيعتك في الجواز والاستقرار:\nإنت اتخلقت عشان تتجوز وتبني بيت دافي! الونس والشراكة بالنسبة لك هما سر توازنك النفسي. في الجواز، إنت الشريك المريح، الداعم اللي بيقف ورا شريكه لحد ما ينجح. بس عشان جوازك يستمر بسعادة، لازم تبطل \"تكتم الزعل جواك\"؛ لأن تراكمات الصمت عندك بتخليك تصحى في يوم فجأة تلاقي قلبك قفل ومشاعرك ماتت ناحية شريكك للأبد من غير رجعة! الحل مش إنك تسكت، الحل إنك تقول اللي مضايقك أول بأول، بلطف ووضوح.\n\nثالثاً: خريطة التوافق الطاقي (مين ينورك ومين يطفيك؟):\n\n• أعلى توافق روحي وعاطفي (توأم الشعلة والانسجام):\n  - مع مسار رقم (6) ورقم (2) زيك: قمة الرومانسية، الدفء، والاحتواء المتبادل؛ بتفهموا بعض بالإشارة وبتقدسوا البيت والعيلة.\n  - مع مسار رقم (1) ورقم (8) ورقم (4): تكامل مذهل (القوة مع الحنان)؛ هما بيدولك الأمان المادي، الحسم، والحماية، وإنت بتديهم السلام النفسي والدعم العاطفي، بشرط إنهم ميكونوش قاسيين أو مسيطرين بزيادة عليك.\n\n• علاقات التحدي والاستنزاف (تحتاج وعي وحذر شديد):\n  - مع مسار رقم (5): طاقته الهوائية المتقلبة وعشقه للحرية المطلقة وعدم الاستقرار بيوتروا أعصابك وبيصحوا جواك جرح الخوف من الهجر.\n  - مع مسار رقم (7) ورقم (9): ممكن تحس معاهم بالبرود العاطفي أو الانعزال الذهني، لأنك محتاج قرب عاطفي مستمر وهما بيحتاجوا عزلة ومساحة بعيدة.\n\nرابعاً: ثلاث خطوات لفك البلوك العاطفي (روشتة تشافي القلب):\n\n• 1. الوعي والإدراك العاطفي:\nاحفظ القاعدة الذهبية دي: \"التضحية بنفسك مش دليل حب، دي خيانة لروحك!\". عمر ما الشريك هيحبك ويقدرك أكتر لما تلغي شخصيتك عشانه؛ بالعكس، الناس بتحترم وبتعشق الشخص اللي عنده كيان وحدود وبيحب نفسه الأول. بطل تلعب دور \"الدكتور النفسي\" في علاقاتك؛ اطلب حقوقك العاطفية بصراحة، ومتقبلش أبداً بعلاقة إنت الطرف الوحيد اللي بيجدف فيها.\n\n• 2. السر الباطني والطاقي (فك الأحبال الأثيرية واستعادة الطاقة):\nفي العلوم الباطنية، صاحب مسار رقم (2) لما بيحب حد، بيبعت له \"أحبال طاقية أثيرية\" تقيلة جداً من شاكرا القلب وشاكرا الضفيرة الشمسية، فبيفضل مربوط بيه طاقياً حتى لو العلاقة انتهت أو الطرف التاني بعيد! السر الباطني لراحتك هو \"الاستقلال الطاقي\": كل ما تحس إنك متعلق بشريكك لدرجة الخنقة، حط إيدك على قلبك وخد نفس عميق، وانوي سحب طاقتك المبعثرة عشان ترجع لمركزك إنت.\n\n• 3. الصورة الذهنية لتشافي العلاقات (حط الصورة دي في عقلك دايماً):\nكل ما تلاقي نفسك خايف من زعل شريكك، أو بتيجي على كرامتك وراحتك عشان تحافظ على العلاقة، غمض عينك لـ 30 ثانية واستحضر الصورة دي:\n\"تخيل إن قلبك وطاقتك هما (حديقة ملكية ساحرة)، بس الحديقة دي ليها سور وبوابة دهبية ومفتاحها في إيدك إنت لوحدك. الحب الحقيقي مش إنك تهد السور وتسيب أي حد يدخل يقطف الورد ويدوس عليه برجله.. الحب هو إنك تفتح البوابة بس للشخص اللي جاي ومعاه مية يسقي بيها وردك ويزرع معاك أرضك. اللي يقدر جنتك أهلاً بيه، واللي يستنزفها اقفل البوابة في وشه بكل هدوء وحب لنفسك.\"\n\nسؤال للتأمل: في آخر علاقة، إنت كنت بتحب، ولا كنت بتصلح وبتحمل؟ وإيه اللي كنت محتاج تسمعه من نفسك؟"},"5":{"title":"القسم الخامس: مغناطيس المال، الوفرة، والمهنة","text":"ليه أحياناً بتشتغل بضمير موت وبتشيل الشغل كله، وفي الآخر غيرك هو اللي ياخد الصيت والفلوس؟\nرزق صاحب مسار الحياة رقم (2) مش بيجي من \"الصراع والمنافسة الشرسة\"، رزقك مربوط بـ \"حدسك، دبلوماسيتك، والشراكات الذكية\". بس أكبر بلوك مالي بيطرد منك الوفرة هو إنك بتتكسف تطلب حقك المادي، أو بتشتغل شغلانات مجانية بدافع المجاملة والطيبة.\n\nأولاً: ملامح طبيعتك المادية والمهنية (مميزاتك وعيوبك في الفلوس والشغل):\n\nسماتك المالية والمهنية (في طاقة النور):\n- ذكاء اجتماعي ودبلوماسية رهيبة بتخليك تكسب ثقة العملاء، الرؤساء، والشركاء من أول مقابلة.\n- \"الحاسة السادسة المادية\": قلبك بيحس بالصفقة الكسبانة من الخسرانة، وبيكشف الشخص النصّاب قبل ما تتورط معاه.\n- صانع سلام ومفاوض عبقري (تعرف تقفل أي نقاش أو صفقة معقدة بهدوء وذكاء).\n- إخلاص وضمير صاحي في الشغل، واهتمام بأدق التفاصيل اللي بتطلع الشغل في أحسن صورة.\n- أفضل \"شريك استراتيجي\" و\"رجل ثاني / مستشار\" يدير الكواليس بحكمة وهدوء.\n\nعيوبك المالية والمهنية (في طاقة الظل):\n- الخجل المادي والكسوف من تسعير مجهودك أو المطالبة بحقوقك المتأخرة (بتقدم تنازلات مالية عشان متتحرجش!).\n- التأثر الشديد ببيئة العمل؛ لو المكان فيه توتر، صوت عالي، أو مدير قاسي، طاقتك وإنتاجيتك بينهاروا فوراً.\n- الخوف من المجازفة المالية، والتردد الطويل اللي بيضيع عليك فرص استثمارية ممتازة.\n- الصرف العاطفي؛ لما بتكون زعلان أو مكتئب ممكن تصرف فلوسك عشان تشتري حاجات تعدل مزاجك أو تشتري هدايا غالية ترضي بيها اللي حواليك.\n\nثانياً: التحليل العميق لشفرة المال والمهنة لمسار رقم (2):\n\n• إزاي الفلوس بتجيلك؟ (شفرة الرزق والوفرة):\nطاقة الرقم (2) في المال هي \"طاقة الجذب المغناطيسي الهادئ والتعاون\". إنت مش مطالب تحارب الدنيا لوحدك عشان تغنى؛ الفلوس بتجيلك عن طريق \"العلاقات، الشراكات، وكسب القلوب\". لما بتحط نفسك في بيئة عمل هادية ومحترمة، أو لما تدخل شريك مع شخص عنده طاقة تنفيذية عالية (زي رقم 1 أو 8)، إنت بتكون \"العقل الحكيم والروح\" وهو بيكون \"الواجهة\"، وبتعملوا ثروة جبارة سوا. كمان رزقك واسع جداً في أي مجال يعتمد على فهم النفس البشرية، الفن، أو العلاج.\n\n• البلوك المالي والتعطيل (إيه اللي بيبوظ عليك الفلوس؟):\nاللعنة المالية عندك اسمها \"ضعف الاستحقاق والمجاملة على حساب جيبك\". كم مرة عملت شغل لحد ببلاش أو بملاليم عشان \"اتكسفت تقوله السعر الحقيقي\"؟! كم مرة سكت عن حقك المالي عشان متعملش مشكلة؟ في قوانين الطاقة، لما إنت مبتقدرش قيمة وقتك ومجهودك، الكون كمان بيوقف عنك تدفق الفلوس! بلوك تاني خطير هو لما \"تتجاهل نغزة قلبك\" وتدخل شراكة أو سلفة مع حد قلبك مقبوض منه، بس وافقت مجاملة ليه، ودايماً الفلوس دي بتضيع ومبترجعش.\n\n• المجالات الأنسب لتحقيق الثروة:\nعلم النفس والاستشارات الأسرية والعاطفية، التاروت والعلوم الروحية والشفاء الطاقي، الدبلوماسية والعلاقات العامة، الموارد البشرية، الوساطة العقارية أو التجارية، الفنون والموسيقى والتصميم، الطب والتمريض والرعاية، وأي بيزنس قايم على \"خدمة العملاء باحتواء\" أو \"الشراكة الثنائية\".\n\nثالثاً: ثلاث خطوات لفك البلوك المالي (روشتة جذب الثروة):\n\n• 1. الوعي والإدراك المالي:\nعلق القاعدة دي قدامك: \"الطيبة في الحقوق المادية مش فضيلة، دي ظلم لنفسك!\". افصل تماماً بين محبتك للناس وبين شغلك وفلوسك. اللي بيحبك ويحترمك بجد هيديك حقك كامل وهو ممنون ليك، واللي عايز يستغلك باسم الصداقة أو الكسوف اقفله الباب فوراً. ولما تيجي تاخد قرار مالي، اسمع صوت \"بطنك وحدسك الأول\"؛ لو حسيت بانقباضة، ارفض الصفقة فوراً مهما كانت المغريات على الورق.\n\n• 2. السر الباطني والطاقي (تفعيل طاقة الاستقبال القمرية):\nبما إن مسارك محكوم بـ القمر وطاقة الين، فإنت مش محتاج \"تجري وتنهج\" ورا الفلوس زي الأرقام النارية؛ إنت محتاج تفتح \"قنوات الاستقبال\". لما بتكون متوتر، خايف من الفقر، أو شايل هم بكره، طاقتك المائية بتتجمد والرزق بيقف. السر الباطني لوفرتك هو \"الامتنان والهدوء النفسي\": كل ما روحك كانت هادية وحاسس بالأمان، كل ما الفرص والهدايا والرزق جالك لحد عندك عن طريق ناس مسخرين ليك من حيث لا تحتسب.\n\n• 3. الصورة الذهنية لجذب الثروة (حط الصورة دي في عقلك دايماً):\nلما تحس بضائقة مالية، أو لما تكون محرج تطلب سعر خدمتك أو حقك، غمض عينك لـ 30 ثانية واستحضر الصورة دي:\n\"تخيل إنك مش (صياد بيجري في الصحراء) بيتعب عشان يصطاد فريسة.. تخيل إنك (البحر نفسه، والقمر منور فوقك). القمر مبيبذلش مجهود عضلي عشان يحرك المية، هو بس بـ (جاذبيته الهادية) بيعمل المد والجزر، فيخلي البحر يرمي اللؤلؤ والمرجان والكنوز على الشط عند رجلك بكل نعومة وسلاسة. إنت طاقتك جاذبة بطبعها.. اثبت في مكانك، قدر قيمتك، وسيب المد يجيبلك رزقك لحد عندك.\"\n\nسؤال للتأمل: إيه الحاجة اللي إنت بتقدمها للناس مجانًا وأنت محتاج تقبض فيها؟ وإيه اللي بيمنعك؟\"شفرة الرزق\" و\"جذب الثروة\" هنا لغة رمزية للتأمل في عاداتك المالية، مش وعد بثراء مضمون. القرارات المالية الكبيرة محتاجة دراسة ومتخصصين."},"6":{"title":"القسم السادس: خطوات عملية تفرق معاك","text":"إزاي تحول حساسيتك المفرطة من \"نقطة ضعف بتوجعك\" لـ \"قوة خارقة بتميزك\"؟\nلو فضلت سايب باب طاقتك مفتوح لكل من هب ودب يرمي همومه جواك، هتفضل طول عمرك تعبان ومستنزف.. روشتة التشافي لمسار رقم (2) مصممة خصيصاً عشان تبني درع حماية لروحك، وتفعل \"رادار الحدس\" بتاعك بأقصى طاقته من غير ما تخسر سلامك النفسي.\n\nالروشتة العملية الفورية لتغيير حياتك (3 خطوات للتطبيق المباشر):\n\n• 1. خطوة \"عضلة الرفض بدون تبرير\" (تمرين كسر الكسوف):\n  - إزاي تعملها: لمدة أسبوع كامل، درب نفسك تقول \"لأ\" أو \"مش هقدر الفترة دي\" على الأقل لطلبين أو تلاتة كنت هتوافق عليهم زمان مجاملة على حساب راحتك. والشرط الأهم في التمرين ده: متقولش أي مبررات أو أعذار بعدها! (متقولش: أصل أنا تعبان وعندي ظروف.. قول بس: \"للأسف مش هيناسبني دلوقتي\" واسكت).\n  - النتيجة: التمرين ده بيفك البلوك اللي في \"شاكرا الحنجرة\" عندك، وبيرفع استحقاقك الذاتي فوراً، وبيعلم الناس تحترم وقتك وحدودك من غير ما تضطر تتخانق معاهم.\n\n• 2. خطوة \"قاعدة الـ 5 ثواني للحدس\" (قتل شلل التردد):\n  - إزاي تعملها: عشان تعالج مرض التردد اللانهائي، جرب القاعدة دي في الاختيارات اليومية البسيطة الأول (هلبس إيه، هاكل إيه، هرد بإيه): أول إجابة أو إحساس يجي في قلبك في أول 5 ثواني، نفذه فوراً قبل ما عقلك يشتغل ويبدأ يوسوسلك ويحسب حسابات الناس! ومع الوقت، اكتب في نوتة صغيرة على موبايلك \"إحساسي الأول تجاه الشخص/الموضوع ده كان كذا\"، وراجعها بعد شهر عشان تشوف بعينك إن قلبك عمره ما كدب عليك.\n  - النتيجة: هترجع الثقة بينك وبين \"صوتك الداخلي\"، وهتختصر شهور من الحيرة والقلق في قراراتك الكبيرة.\n\n• 3. خطوة \"الدش الطاقي وفصل الأحبال\" (طقوس العزلة الليلية):\n  - إزاي تعملها: بما إن طاقتك مائية بتلقط من اللي حواليك، خصص آخر نص ساعة قبل النوم تكون \"عزلة مقدسة\" في إضاءة هادية بعيد عن الموبايل ومشاكل الناس. ولما تاخد شاور بالليل (ويفضل بمية دافية وشوية ملح بحري مرة في الأسبوع)، تخيل إن المية وهي نازلة على جسمك بتغسل وبتسحب معاها في البلاعة كل كلمة سلبية سمعتها، وكل هم شيلته من حد النهاردة، وقول لنفسك: \"أنا أستعيد طاقتي، وأترك لكل شخص طاقته ومسؤوليته\".\n  - النتيجة: هتصحى تاني يوم الصبح روحك خفيفة، صافية، ومشحونة بطاقة القمر الهادية بدل ما تصحى جسمك مكسر ومكتئب من غير سبب.\n\nسؤال للتأمل: إيه أصغر خطوة من التلاتة دي تقدر تبدأ بيها بكرة الصبح؟"},"7":{"title":"القسم السابع: جرح الطفولة، الدين الكارمي، وعلاقتك بالأطفال","text":"ليه من وإنت صغير بتحس إنك مسؤول عن زعل وفرح اللي حواليك، وبتترعب لو حد رفع صوته أو قلب وشه عليك؟\nخوفك المرضي من المشاكل وحرصك المفرط على إرضاء الكل مجاش من فراغ؛ ده نظام دفاعي بناه \"طفلك الداخلي\" عشان يحمي نفسه في بيئة كان فيها توتر أو حب مشروط. زائد إن مسار رقم (2) بيحمل \"درس كارمي\" عميق يخص الحدود النفسية وقول الحقيقة.\n\nأولاً: جرح الطفولة والطفل الداخلي:\nأغلب أصحاب مسار الحياة رقم (2) اتولدوا بـ \"جهاز عصبي حساس جداً\"، وعاشوا طفولة شكلت جرحهم الأساسي في نقطتين:\n\n• دور \"المصلح النفسي\" للبيت: في طفولتك، كنت بتلقط أي خلاف أو طاقة زعل بين أبوك وأمك (أو في العيلة) حتى لو متكلموش قدامك! خوفك من الصوت العالي والتفكك خلاك تلعب دور \"الطفل الهادي المطيع اللي مبيعملش مشاكل\" أو اللي بيحاول يضحّك الكبار ويصلح بينهم عشان يحس بالأمان.\n\n• الحب المشروط بالطاعة: اتبرمجت وإنت صغير إنك عشان تتْحَب وتسمع كلمة حلوة، لازم تكون \"مؤدب، بتسمع الكلام، وبتتنازل عن ألعابك وحقك عشان غيرك ميزعلش\". الجرح ده كبر معاك وخلاك تربط بين (إرضاء الناس) وبين (الأمان والبقاء)، ولما حد بيزعل منك دلوقتي، طفلك الداخلي بيترعب كأنه هيتساب لوحده في الضلمة!\n\nثانياً: الدين الكارمي لمسار (2) - (كارما إخفاء الحقيقة والتبعية):\nفي علم الأرقام الكارمي، الرقم (2) (وخصوصاً لو جاي من مجموع 11 أو 20 أو 29) بيحمل كارما دقيقة تخص \"الاعتمادية وكتمان صوت الحق\".\n\n• رسالة الكارما بتاعتك: في الماضي (أو في حيوات سابقة)، إما إنك كنت شخص سلبي خنت نفسك وخنت الحقيقة وسكت عن الظلم عشان تشتري دماغك وتعيش في ظل غيرك، أو إنك استغليت أسرار الناس ومشاعرهم لمصلحتك. الكون بعتك في المسار ده عشان تتعلم الدرس الأصعب: \"إزاي تكون صانع سلام دبلوماسي، من غير ما تكون جبان بيلغي كرامته ويسكت عن حقه\". الكارما بتعاقبك بالاستغلال والخذلان كل مرة بتيجي فيها على نفسك، وبتكافئك بالهيبة والرزق لما بتحط حدود وتنطق بالحق بهدوء.\n\nثالثاً: علاقتك بالأطفال والتربية (أنت كأب / أم):\n\n• مميزاتك في التربية: إنت أعظم وأحن أب/أم في الوجود! عندك غريزة أمومة/أبوة فطرية جبارة (طاقة القمر والسرطان). بتفهم ولادك من نظرة عينهم وهما لسه مبينطقوش، بتحتوي مشاعرهم، وبتبني معاهم صداقة عميقة جداً تخليهم يحكولك أسرارهم من غير خوف. بيتك دايماً دافي ومليان حنان.\n\n• عيوبك في التربية (احذر منها): من كتر خوفك عليهم وحنانك الزيادة، ممكن تقع في فخ \"الحماية المفرطة والتدليل\"؛ تشيل عنهم كل المسؤوليات وتخاف يغلطوا أو يتعبوا، فيطلعوا شخصيات ضعيفة ومعتمدة عليك في كل حاجة. وعيب تاني خطير: لو إنت مضغوط، ممكن \"تشتكي لولادك\" وتدخلهم في مشاكلك العاطفية بدري، فتشيلهم هم أكبر من سنهم (زي ما حصل معاك وإنت صغير!).\n\n• نصيحة ذهبية: حب ولادك واحتويهم، بس سيبهم يخوضوا معاركهم الصغيرة ويتعلموا من غلطهم. ومتخليش خوفك على زعلهم يمنعك تكون حازم معاهم وقت اللزوم؛ الحزم الهادي هو اللي بيبني ظهرهم مش الطبطبة المستمرة.\n\nسؤال للتأمل: إيه الحاجة اللي كنت محتاج تسمعها وإنت صغير، ولسه محتاج تسمعها النهاردة؟"}},"3":{"1":{"title":"القسم الأول: شفرة الروح والجوهر","text":"(لمن مجموع تاريخ ميلاده الكامل يختزل إلى الرقم 3، أو وُلد يوم 3، 12، 21، 30)\n\nالمعنى العاطفي والنفسي / طاقة القراءة (جوهر روحك الحقيقي):\n\nلو مسار حياتك هو الرقم (3)، فاعرف إنك جيت الدنيا دي ومعاك هدية كونية اسمها \"سحر الحضور والكلمة والبهجة\". روحك شايلة شفرة \"التعبير، الإبداع، والخصوبة الفكرية\". إنت مش مخلوق عشان تعيش في الضلمة أو في القيود؛ إنت النور اللي بيدخل أي مكان يغير طاقته فوراً، وجوهرك بيتكون من التفاصيل دي:\n\n• مغناطيس بشري وكاريزما لا تُقاوم: إنت عندك \"قبول رباني\" غريب؛ أول ما بتدخل أي مكان أو تتكلم، العيون والقلوب بتتشد ليك تلقائياً. دمك خفيف، روحك حلوة، وابتسامتك ليها مفعول السحر في فك تكشيرة أي حد قدامك. إنت فنان بطبعك حتى لو مبترسمش أو مبتغنيش؛ طريقتك في اللبس، في الكلام، وفي الحكي هي لوحة فنية في حد ذاتها. بس خد بالك: الكاريزما دي سلاح ذو حدين. لو استخدمتها عشان تلفت الأنظار بس، هتبقى سطحية. لو استخدمتها عشان تلهم الناس وتنورهم، هتبقى قوة حقيقية.\n\n• سحر الكلمة والقدرة على الإقناع: صوتك وكلامك هما أعظم أسلحتك في الحياة! عندك قدرة رهيبة على صياغة الأفكار وتوصيل أصعب المعاني بطريقة بسيطة، شيقة، وتدخل القلب علطول. لو آمنت بفكرة أو منتج أو قضية، تقدر تقنع بيها أي مخلوق على وجه الأرض، لأنك بتتكلم من قلبك وبحماس بيعدي كل اللي بيسمعك. والكلمة عندك مش مجرد صوت، الكلمة عندك طاقة. لما بتتكلم بحب، بتشفي. لما بتتكلم بغضب، بتجرح. فاختار كلماتك بعناية، لأنها بتتحقق.\n\n• الطفل الأبدي وعقلية الابتكار: عقلك أرض خصبة بتولد أفكار إبداعية طول الوقت. إنت شخص بيعشق الحياة، الجمال، الرفاهية، والسفر، وجواك \"طفل\" بيفضل محتفظ بفضوله وشغفه مهما كبر في السن. مبتعرفش تعيش في الروتين الممل، ودايماً بتدور على الجديد اللي يغذي روحك. الطفل ده هو سر شبابك الداخلي، وهو كمان سر إبداعك. بس خد بالك: الطفل محتاج حدود عشان ما يتوهش. الحرية من غير انضباط بتبقى فوضى.\n\n• جوهر طاقتك في الوضع الإيجابي (طاقة النور): لما بتكون في قمة اتزانك، بتكون مصدر إلهام وسعادة لكل اللي حواليك. بتكون متفائل، كريم جداً، مبدع، اجتماعي من الطراز الأول، وعندك حظوظ عالية جداً بتفتحلك الأبواب المقفولة بفضل طاقتك الإيجابية ولباقتك. في الحالة دي، إنت زي الشمس اللي بتنور أي مكان تدخله، وبتخلي الناس تحس إن الحياة أجمل.\n\n• جوهر طاقتك في الوضع السلبي (طاقة الظل والانحراف): لما طاقتك بتستنزف أو بتفقد توازنك، سحرك ده بيتقلب لـ \"تشتت وسطحيّة\"! بتلاقي نفسك بتبدأ 100 حاجة ومبتكملش ولا واحدة فيهم للآخر، بتهرب من المسؤولية، وبتصرف فلوسك ببذخ عشوائي. وفي اللحظات المظلمة، لسانك الحلو ده ممكن يتحول لسلاح لاذع يرمي كلام جارح في نص الهزار، أو تدخل في نوبات اكتئاب صامتة وتنعزل تماماً عن العالم بعد ما كنت نجم القعدة. والحقيقة إن الضحك اللي بيغطي حزن، مش ضحك، ده قناع. والقناع بيتعب صاحبه. اسمح لنفسك تحزن من غير ما تمثل.\n\nطاقتك نارية هوائية مبهجة؛ حضورك بيشرح الصدر وبيجلب الحظ والرزق لأي مكان تحط رجلك فيه.\n\nسؤال للتأمل: إمتى آخر مرة عبرت عن نفسك بصدق من غير ما تخاف من رد فعل حد؟ وإيه اللي بيمنعك؟"},"2":{"title":"القسم الثاني: المراية المزدوجة","text":"في مسار الحياة رقم (3)، إنت بتمتلك واحد من أخطر الأقنعة النفسية في علم الأرقام، لدرجة إن أقرب الناس ليك ممكن يعيشوا معاك سنين وميعرفوش إيه اللي بيدور جواك بجد:\n\n• إزاي الناس بتشوفك من بره (القناع الخارجي والهالة):\nالناس بتشوفك \"فاكهة أي قعدة\" والشخص اللي حياته كلها ضحك، انطلاق، وحظوظ! هالتك الخارجية بتدي انطباع إنك إنسان رايق، مبيشيلش هم حاجة، واثق من نفسه لأقصى درجة، وإن المشاكل مبتعرفش طريقك. في عيونهم، إنت الشخص اللي دايماً عنده نكتة حلوة، لبسه شيك، بيعرف يتكلم ويسحر اللي قدامه، ولأنك دايماً بتصدر طاقة بهجة وتفاؤل، الناس بتستكتر عليك الحزن، وممكن يفتكروك أحياناً شخص \"سطحي\" أو \"واخد الدنيا هزار\" ومبيحسش بالوجع زيهم! بس الحقيقة إن الضحكة اللي على وشك مش دايمًا بتعكس اللي جواك.\n\n• إيه اللي بيدور جواك فعلاً (حقيقتك وصراعك الداخلي السري - متلازمة البهلوان الحزين):\nالحقيقة اللي محدش بيشوفها ورا ضحكتك العالية هي إنك من جوه حساس لدرجة الوجع، وبتعاني أحياناً من حاجة اسمها \"وحدة نجم الحفلة\"! إنت بتستخدم الهزار والضحك كـ \"درع دفاعي\" عشان محدش يشوف جروحك أو يشفق عليك. لما بترجع بيتك وتقفل بابك بالليل، القناع المبهج ده بيقع، وبتطلع نسختك العميقة اللي بتفكر في كل تفصيلة، وبتزعل من جواها لأن الكل بيحبك عشان \"أنت بتفرّحهم وبتضحكهم\"، بس قليل أوي اللي بيسأل عنك وقت ما بتكون إنت مطفي ومحتاج اللي يطبطب عليك. جواك خوف سري من إنك لو بطلت تكون الشخص المبهر المضحك، الناس هتزهق منك وتسيبك! والخوف ده هو اللي بيخليك تلبس القناع كل يوم. بس الحقيقة إن الناس اللي بتحبك بجد، بتحبك عشان إنت، مش عشان الضحك اللي بتقدمه.\n\n• السر النفسي في تعاملك مع الضغوط والصدمات:\nلما بتمر بأزمة نفسية كبيرة، إنت بتعمل حاجة من اتنين عكس بعض تماماً: يا إما \"بتهرب للأمام\" بأنك تخرج وتضحك بصوت أعلى وتصرف فلوس كتير وتلهي نفسك في مليون حاجة عشان متواجهش وجعك.. يا إما \"البطارية بتفصل فجأة\"، فتختفي تماماً عن الأنظار، تقفل تليفونك، وتدخل في حالة صمت واكتئاب حاد لحد ما تشحن روحك لوحدك وترجع تاني للناس بابتسامتك المعتادة كأن مفيش حاجة حصلت. والاتنين مش حل. الأول هروب، والتاني انسحاب. الحل في النص: اسمح لنفسك تحس، وتتكلم، وتطلب دعم، من غير ما تمثل.\n\nسؤال للتأمل: إمتى آخر مرة قلت لحد \"أنا مش كويس\" من غير ما تضحك أو تقلبها هزار؟"},"3":{"title":"القسم الثالث: البلوكات الخفية ونقاط التعطيل","text":"ليه عندك أفكار ومواهب تجيب ملايين، بس في الآخر بتلاقي نفسك محلك سر وغيرك اللي أقل منك ذكاء بيسبقك؟\nأكبر بلوك طاقي بتطارد صاحب مسار الحياة رقم (3) وبتوقف حاله هو \"التشتت، الملل السريع، والخوف السري من النقد\". إنت عبقري في البدايات بس بتهرب أول ما الموضوع يقلب جد والتزام، وأحياناً لسانك أو تقلب مزاجك بيهدوا اللي بنيته في ثانية.\n\nأولاً: أنماط التعطيل والعيوب الخفية لمسار رقم (3) في نقاط سريعة:\n\n• تشتت الانتباه وفتح 100 مشروع وفكرة في نفس الوقت من غير ما تكمل واحدة للآخر.\n• الملل السريع والهروب من أي التزام فيه روتين أو مسؤولية تقيلة.\n• التقلبات المزاجية الحادة (قمة الحماس والانطلاق فجأة، وقمة الكسل والاكتئاب فجأة).\n• لسان حاد وسخرية لاذعة وقت الزعل (بتعرف تجرح اللي قدامك بكلمة في نص الهزار).\n• الإسراف المالي والتبذير العشوائي على المظاهر والرفاهيات اللحظية.\n• المبالغة الدرامية أحياناً، والخوف العميق من رفض الناس أو انتقادهم ليك.\n\nثانياً: التحليل العميق للبلوكات الطاقية الأربعة:\nطاقة الرقم (3) عاملة زي \"النار المشتعلة في الهوا\"؛ لو متحطتش جوه فانوس يوجهها، بتطير في كل حتة وتطفي من غير ما تعمل نتيجة:\n\n• البلوك الأول: متلازمة \"الأرنب المتشتت\" ومقبرة المشاريع غير المكتملة:\nعقلك بيولد أفكار عبقرية كل دقيقة، فتتحمس وتبدأ مشروع أو خطوة جديدة بطاقة 200%. بس أول ما تروح سكرة الحماس وتبدأ مرحلة \"الشغل الروتيني والتفاصيل المملة\"، بتزهق وتطفي، وتسيب المشروع في نصه عشان تجري ورا فكرة جديدة تانية لمعت في دماغك! النتيجة إن حياتك بتبقى مليانة \"أنصاف نجاحات\" ومشاريع ميتة قبل ما تتولد. والحقيقة إن البداية هي 20% من الشغل، والـ 80% التانية هي التفاصيل. اللي بيكمل في التفاصيل، هو اللي بيحصد.\n\n• البلوك الثاني: الهروب من العمق والمواجهة (قناع السطحية):\nلأنك بتكره النكد وبتخاف من الألم النفسي، لما بتواجهك مشكلة حقيقية في شغلك أو حياتك، عقلك بيفضل \"يهرب\" بدل ما يواجه. بتقلب الموضوع نكتة، أو تخرج تسهر وتصرف فلوس، أو تأجل المواجهة لبكره، لحد ما المشكلة الصغيرة تكبر وتتحول لأزمة تحاصرك وتوقف حالك. والهروب ده مش راحة، ده تأجيل للوجع. الوجع اللي بتهرب منه، هيلحقك في وقت أضعف. فواجهه وإنت قوي.\n\n• البلوك الثالث: فخ \"شاكرا الحنجرة\" (بين الكتمان والانفجار الساخر):\nرغم إنك متحدث لبق، بس في مشاعرك الحقيقية العميقة ساعات بتخاف تتكلم بجد عشان محدش يشوفك ضعيف أو ينتقدك. الكتمان ده بيعمل بلوك طاقي، يخليك تطلع زعلَك في صورة \"تريقة، سخرية لاذعة، أو كلام دبش\" يوجع اللي حواليك ويخسرك ناس بتحبك من غير ما تقصد. والكلمة الجارحة بتفضل في القلب أكتر من الكلمة الحلوة. فاختار كلماتك كأنها هدايا، مش سكاكين.\n\n• البلوك الرابع: الإدمان على التصفيق الخارجي:\nأحياناً طاقتك وإنتاجيتك بترتبط بـ \"رد فعل الناس\". لو لقيت تشجيع وإعجاب بتطير في السما، ولو لقيت نقد أو تجاهل إحباطك بيجيبك الأرض وبتفقد الشغف تماماً وتقعد في البيت! ربط قيمتك بتصفيق الجمهور بيخلي نجاحك دايماً تحت رحمة مزاج الآخرين. والحقيقة إن قيمتك مش في تصفيق الناس، قيمتك فيك إنت. اللي بيعرف قيمته، مابيحتاجش حد يأكدها له.\n\nثالثاً: ثلاث خطوات لفك البلوك الطاقي (الروشتة الروحية والذهنية):\n\n• 1. الوعي والإدراك (تعديل البرمجة العقلية):\nاحفظ القاعدة الذهبية دي: \"الموهبة بدون التزام هي مجرد هواية لا تصنع نجاحاً\". إنت مش محتاج أفكار جديدة، إنت عندك فائض إبداع يكفي بلد؛ إنت محتاج \"نظام وانضباط\" يكمل فكرة واحدة بس للآخر! درب نفسك إنك متبدأش أي خطوة جديدة غير لما تقفل اللي في إيدك، وافهم إن الالتزام مش سجن لحريتك، الالتزام هو الجسر الوحيد اللي هيحول أحلامك لفلوس وواقع.\n\n• 2. السر الباطني والطاقي (تطهير شاكرا الحنجرة والضفيرة الشمسية):\nفي العلوم الباطنية، مسار الرقم (3) محكوم بـ \"شاكرا الحنجرة\" مركز التعبير والخلق بالكلمة. البلوك بيحصلك لما بتكذب على نفسك (تضحك وإنت موجوع) أو لما تستخدم كلامك في النميمة والسخرية أو الشكوى. السر الباطني لفك تعطيلك هو \"قدسية الكلمة والصدق النفسي\": عبر عن حزنك بصراحة من غير ما تتكسف، ووجه طاقة كلامك لـ \"التأكيدات الإيجابية، الغناء، الكتابة، أو صناعة المحتوى\". كل ما صوتك طلع صادق ونقي، كل ما الكون استجاب لكلمتك كأنها أمر مباشر.\n\n• 3. الصورة الذهنية للتشافي (حط الصورة دي في عقلك دايماً):\nكل ما تحس إنك متشتت بين مليون فكرة، أو زهقان وعايز تسيب اللي في إيدك وتهرب، غمض عينك لـ 30 ثانية واستحضر الصورة دي:\n\"تخيل إن طاقتك وأفكارك هي (أشعة الشمس). طول ما أشعة الشمس متفرقة في الجو، هي بس بتنور المكان لكن متقدرش تولع عود كبريت واحد.. لكن لو جبت (عدسة مكبرة) وجمعت كل الأشعة المتفرقة دي في (نقطة واحدة صغيرة) وثبتّ إيدك لدقيقة واحدة من غير ما تتحرك، الشعاع ده هيحرق الورق ويولع نار عظيمة! إنت الشمس.. والتركيز هو عدستك المكبرة. جمع شتاتك في نقطة واحدة، وشوف المعجزات اللي هتحصل.\"\n\nسؤال للتأمل: إيه الحاجة اللي إنت بدأتها وسبتها في النص؟ وإيه اللي بيمنعك ترجع تكملها؟\"البلوكات الطاقية\" هنا تعبير رمزي عن أنماط متكررة، مش حقيقة كونية. الأنماط دي قابلة للتغيير بالوعي والتدريب."},"4":{"title":"القسم الرابع: الشفرة العاطفية، الجواز، وكارما العلاقات","text":"ليه كل ما العلاقة العاطفية تدخل في مرحلة الهدوء والروتين، بتبدأ تزهق وتحس كأنك مسجون؟\nالحب في حياة صاحب مسار رقم (3) لازم يكون مليان حيوية، كلام حلو، ومفاجآت مستمرة. بس الكارما العاطفية الأخطر عندك هي الخوف من \"الالتزام الحقيقي\"، وتجنب مواجهة المشاكل العميقة بالهزار أو الهروب للخروج والسهر.\n\nأولاً: ملامح طبيعتك العاطفية (مميزاتك وعيوبك في الحب والجواز):\n\nسماتك كشريك عاطفي (في طاقة النور):\n- شريك مبهج، رومانسي، ودمه خفيف؛ بيعرف يخرج شريكه من أي مود ضغط وكآبة بسهولة.\n- التعبير الدائم عن المشاعر بالكلمات الحلوة، الهدايا، والمفاجآت الإبداعية.\n- الصراحة والانفتاح؛ مابتخبيش اللي جواك وبتحب تحكي وتتكلم في كل تفصيلة.\n- طاقة اجتماعية جبارة؛ بتهتم إن شريكك يندمج معاك في خروجتك ووسط صحابك.\n- التفاؤل الدائم والقدرة على رؤية الجانب المشرق في أي أزمة بتعدي بيها العلاقة.\n\nعيوبك العاطفية (في طاقة الظل):\n- الخوف من القيود والالتزام (بتحس إن الجواز ساعات \"سجن حرية\").\n- الهروب من النزاعات والمشاكل العميقة؛ بدل ما تواجه وتتكلم بجد، بتعمل هبل أو تخرج تسهر عشان تهرب من النكد.\n- التشتت العاطفي أحياناً (بتحب لفت الأنظار، وممكن إعجاب الناس الخارجي يلفت انتباهك لو حسيت ببرود مع شريكك).\n- الملل السريع؛ لو العلاقة بقت روتين، بتفقد الشغف وبتستسهم في إهمال التفاصيل.\n- إلقاء النكت في أوقات غلط (لما شريكك يكون متعصب وجاد وعايز يكلمك في مشكلة، بتقلبها هزار فبتستفزه زيادة!).\n\nثانياً: التحليل العميق لشفرة الحب والجواز لمسار رقم (3):\n\n• مواصفات الشريك اللي بيجيبك الأرض (فتى/فتاة أحلامك طاقياً):\nإنت مستحيل تعيش مع شخص نكدي، متسلط، أو بيكره الخروج والحياة. اللي بيجيبك الأرض هو الشريك \"المثقف، المرح، والمتفتح\" اللي يعرف يجاريك في الكلام، عنده كاريزما، وبيحب السفر والمفاجآت. عايز شريك يكون \"صاحب وحبيب\" في نفس الوقت، يشاركك شغفك ومغامراتك وميخنقش حريتك. بس خد بالك: الشريك ده محتاج منك جدية وقت الجد، مش هزار في كل وقت. لو حس إنك بتاخد كل حاجة هزار، ممكن يحس إنك مش شايل العلاقة بجدية.\n\n• البلوك العاطفي وكارما العلاقات (ليه علاقاتك بتتعثر؟):\nاللعنة العاطفية لمسار رقم (3) هي \"سطحية المواجهة والهروب وقت الجد\". أول ما العلاقة تبدأ تطلب نضج، تضحيات حقيقية، أو مواجهة مشاكل مسكوت عنها، عقلك بينادي عليك بالهروب! بتتعامل مع الوجع بالعزل أو الهزار، وده بيخلي شريكك يحس إنك مش مهتم بجد أو مش شايل المسؤولية، فبتتراكم الفجوات لحد ما تفركش العلاقة مفاجأة. والحقيقة إن الهزار مش بديل عن المواجهة، الهزار ممكن يهدي الجو شوية، بس مش بيحل المشكلة. المشكلة بتحتاج كلام جد وصراحة، وده مش معناه إن العلاقة بقت نكد، ده معناه إن العلاقة بقت ناضجة.\n\n• طبيعتك في الجواز والاستقرار:\nالجواز بالنسبة لك مش معناه قفلة باب البيت وانقطاع العالم؛ الجواز عندك هو \"مغامرة مستمرة مع الشريك الصح\". لو شريكك فهم طبيعتك وحافظ على تجديد الحياة بينكم ومنحك مساحتك، هتكون أوفى وأسعد إنسان. بس لو الجواز تحول لروتين مقبض وصحوة نوم وشغل وبس، هتبدأ تزهق وتتعب نفسياً. والحقيقة إن الروتين مش عدو الحب، الروتين هو اختبار الحب. اللي بيعرف يجدد في الروتين، هو اللي بيعيش حب حقيقي طويل.\n\nثالثاً: خريطة التوافق الطاقي (مين ينورك ومين يطفيك؟):\n\n• أعلى توافق روحي وعاطفي (توأم الشعلة والانسجام):\n  - مع مسار رقم (5) ورقم (7): قمة المغامرة، الانطلاق، والحوارات الفكرية العميقة والمسلية؛ مفيش ملل نهائياً.\n  - مع مسار رقم (1) ورقم (3) زيك: طاقة نارية ومبهجة؛ بتدعموا طموح بعض وبتقضوا أحلى حياة اجتماعية وسفر ونجاح سوا.\n\n• علاقات التحدي والتحفظ (تحتاج وعي وصبر):\n  - مع مسار رقم (4) ورقم (8): هما بيحبوا النظام، الجدية، والترتيب الصارم، وإنت بتحب العشوائية والانطلاق؛ ممكن تحس معاهم بالتقييد أو إنهم \"ناشفين\" عاطفياً لو متفاهمتوش من الأول.\n\nرابعاً: ثلاث خطوات لفك البلوك العاطفي (روشتة تشافي القلب):\n\n• 1. الوعي والإدراك العاطفي:\nحط القاعدة دي في دماغك: \"النضج العاطفي مش معناه إن الحياة بقت نكد، النضج معناه إنك تواجه المشاكل وهي صغيرة بدل ما تهرب منها لحد ما تكبر وتخنقك\". اتعلم تفرق بين لحظات الهزار اللي بتدوب الجليد، وبين لحظات الجد والمواجهة اللي بتبني أساس قوي للعلاقة. لما شريكك يتكلم بجد، اقعد واسمع بجد من غير تريقة.\n\n• 2. السر الباطني والطاقي (توازن شاكرا الضفيرة الشمسية والحنجرة):\nطاقتك العاطفية بتضيع لما بتشتت مشاعرك في كل حتة تدور على إعجاب الناس. السر الباطني لشفاء قلبك هو \"العمق العاطفي الثابت\": بطل تدور على السعادة بره بيتك، ووجه طاقة الإبداع والبهجة جوه علاقتك الثابتة مع شريكك. كل ما عمّقت مشاعرك بدل ما تكتفي بالقشور، كل ما حسيت بطعم حقيقي للحب مبيخلصش.\n\n• 3. الصورة الذهنية لتشافي العلاقات (حط الصورة دي في عقلك دايماً):\n\"تخيل إن علاقتك بشريكك هي (رحلة سفاري في منطاد طائر). المنطاد بيحتاج لهب مستمر (بهجتك وحماسك) عشان يفضل طاير في السما.. بس عشان المنطاد مايقعش في الأرض، بيحتاج كمان (حبال تثبيت قوية وأوزان توازنه) وقت الرياح الشديدة. شغفك وبهجتك هم اللهب، والالتزام والوضوح في المواجهة هم حبال التثبيت. اربط الاتنين، عشان رحلتكم تكمل للآخر من غير ما تقعوا في أول عاصفة.\"\n\nسؤال للتأمل: في آخر خلاف، إنت كنت بتواجه بجد ولا كنت بتهرب بالهزار؟ وإيه اللي كان هيفرق؟"},"5":{"title":"القسم الخامس: مغناطيس المال، الوفرة، والمهنة","text":"ليه الفلوس بتجيلك أحياناً بأرقام جبارة، بس بتطير من إيدك بسرعة من غير ما تحس؟\nرزق صاحب مسار الحياة رقم (3) مش بيجي من الشغل التقليدي المكتبي المقبوض؛ رزقك معلق بـ \"لسانك، ابتكارك، وكاريزما حضورك\". بس البلوك المالي الأكبر عندك هو العشوائية في الصرف، والاعتماد الكلي على حماس اللحظة من غير خطة مالية واضحة.\n\nأولاً: ملامح طبيعتك المادية والمهنية (مميزاتك وعيوبك في الفلوس والشغل):\n\nسماتك المالية والمهنية (في طاقة النور):\n- مهارة تسويقية وإقناعية جبارة؛ تقدر تبيع الهوا للطيارة بفضل لباقتك وسحر كلامك.\n- قدرة فطرية على جلب المال من مجالات الإبداع، الفن، والكتابة وصناعة المحتوى.\n- ذكاء اجتماعي عالي يخليك تبني شبكة علاقات واسعة جداً تفتحلك أبواب رزق في كل مكان.\n- مرونة وسرعة بديهة في الخروج من أي أزمة مالية أو مهنية بحل إبداعي مبتكر.\n\nعيوبك المالية والمهنية (في طاقة الظل):\n- التبذير والإصراف العشوائي؛ بتصرف فلوسك عشان تشتري متعة لحظية أو تتباهى قدام الناس.\n- الملل السريع من تفاصيل الإدارة والمحاسبة؛ بتكره الأرقام والورقيات والروتين الإداري.\n- التشتت المهني؛ ممكن تسيب شغلة بتدخل دخل كويس جداً لمجرد إنك \"زهقت\" وعايز تجارب جديدة.\n- تأجيل المهام الهامة (التسويف - Procrastination) لحد اللحظة الأخيرة قبل التسليم.\n\nثانياً: التحليل العميق لشفرة المال والمهنة لمسار رقم (3):\n\n• إزاي الفلوس بتجيلك؟ (شفرة الرزق والوفرة):\nفلوسك وبركتك مربوطة بـ \"صوتك، كتابتك، ظهورك، وقدرتك على التأثير في الجماهير\". طاقة الرقم (3) هي طاقة المبدع والمتحدث والمسوق بالفطرة. مستحيل تغنى وأنت قاعد في مكتب مغلق مابتشوفش بني آدم؛ الفلوس بتجيلك لما بتكون \"في الواجهة\"، بتعرض أفكارك، تقدم محتوى، تتفاوض، أو تقود مجموعات. كل ما كنت أجرأ في إظهار مواهبك، كل ما زادت وفرتك.\n\n• البلوك المالي والتعطيل (إيه اللي بيبوظ عليك الفلوس؟):\nاللعنة المالية عندك هي \"إدارة النثريات وغياب الخطط طويلة المدى\". إنت ممكن تعمل أرقام ممتازة، بس عشان مفيش عندك سيطرة على المصاريف العشوائية، بتلاقي جيبك فاضي دايماً! بلوك تاني خطير هو الهروب من المهام المملة؛ لما بتسيب الحسابات وتفاصيل الشغل لحد تاني من غير متابعة، ممكن تتعرض لخسائر أو نصب بسبب الإهمال. والحقيقة إن الفلوس اللي بتتبهدل، مش هترجع لوحدها. اللي بيحافظ على الفلوس، هو اللي بيعرف يديرها.\n\n• المجالات الأنسب لتحقيق الثروة:\nصناعة المحتوى، الظهور على السوشيال ميديا، الإعلام وتقديم البرامج، التسويق والمبيعات، الكتابة والتأليف، الفنون والتمثيل والغناء، العلاقات العامة، تنظيم الحفلات والمؤتمرات، والتدريب والتحدث أمام الجمهور.\n\nثالثاً: ثلاث خطوات لفك البلوك المالي (روشتة جذب الثروة):\n\n• 1. الوعي والإدراك المالي:\nاعمل لنفسك القاعدة دي: \"الإبداع يجلب المال، والانضباط هو من يحافظ عليه\". افرح بمواهبك واكسب منها قد ما تقدر، بس لازم توظف حد معاك (أو تعمل نظام آلي) يدير الحسابات والأرقام عشان تحمي فلوسك من تسريب التبذير العشوائي.\n\n• 2. السر الباطني والطاقي (تركيز الطاقة النارية المشتتة):\nفي علم الطاقة، طاقة رقم (3) متفجرة ومشتتة في كل الاتجاهات، وده بيخلي الفلوس تتسرب من بين إيدك. السر الباطني لجذب الثروة هو \"قاعدة توحيد المصدر\": بدل ما تفتح 5 مشاريع في وقت واحد وتكسب قرشين من كل حتة، ركز طاقة إبداعك الكبيرة في مشروع واحد رئيسي لحد ما يدرّ عليك دخل ضخم، وبعدين وسع زي ما انت عايز.\n\n• 3. الصورة الذهنية لجذب الثروة (حط الصورة دي في عقلك دايماً):\n\"تخيل إن أفكارك ومواهب كاريزمتك هي (مياه نهر عذب جارف)، بس المية دي لو فضت تجري في الصحراء هتتبخر ومنهاش فايدة.. عشان النهر يبني حضارة ويولد طاقة، لازم تبني له (سد منظم ومحطة توليد كهرباء). إنت النهر الجاري ببهجتك.. والانضباط المالي هو السد اللي بيحول طاقتك العشوائية لثروة حقيقية ومستدامة.\"\n\nسؤال للتأمل: إيه الحاجة اللي إنت بتصرف عليها فلوس وإنت مش محتاجها؟ وإيه اللي بيمنعك توقف؟\"شفرة الرزق\" و\"جذب الثروة\" هنا لغة رمزية للتأمل في عاداتك المالية، مش وعد بثراء مضمون. القرارات المالية الكبيرة محتاجة دراسة ومتخصصين."},"6":{"title":"القسم السادس: خطوات عملية تفرق معاك","text":"إزاي تتحول من شخص عنده \"ألف فكرة وفكرة ومشروع ميت\" لشخص بينجز وبيحصد ثمار تعبه؟\nالتشافي لصاحب مسار رقم (3) مش معناه إنك تبطل تضحك أو تكبت بهجتك، التشافي معناه إنك تلاقي \"العدسة المكبرة\" اللي تجمع أشعة شمسك المتفرقة في نقطة واحدة توجع السوق كله وتجيبلك فلوس وثبات.\n\nالروشتة العملية الفورية لتغيير حياتك (3 خطوات للتطبيق المباشر):\n\n• 1. خطوة \"قاعدة مشروع الـ 90 يوم\" (علاج التشتت):\n  - إزاي تعملها: هات ورقة واكتب فيها كل الأفكار المجنونة اللي في دماغك.. وبعدين اختار فكرة واحدة فقط لا غير، وادعهد عهد شرف إنك هتشتغل عليها وتديها كل تركيزك وحماسك لمدة 90 يوم كاملين من غير ما تلتفت لأي فكرة تانية تلمع في سكتك! لو جتلك فكرة جديدة، اكتبها في \"دفتر الأفكار المؤجلة\" وارجعلها بعد ما تخلص الـ 90 يوم.\n  - النتيجة: هتكسر \"لعنة الأرنب المتشتت\"، وهتشوف قدام عيونك أول مشروع بينجح ويقف على رجله بجد ويجيبلك دخل حقيقي بدل ما تقعد تلف في ساقية البدايات.\n\n• 2. خطوة \"دفتر المصاريف الذكي\" (السيطرة على التبذير):\n  - إزاي تعملها: بما إنك بتحب الصرف العاطفي والمظاهر، امنع نفسك من الشراء اللحظي بأي حاجة مش ضرورية عن طريق \"قاعدة الـ 48 ساعة\": لو شوفت حاجة وعجبتك وعايز تشتريها، استنى 48 ساعة كاملة قبل ما تدفع، واسأل نفسك بعدها: \"هل أنا بجد محتاجها ولا دي رغبة لحظية وهتعدي؟\"\n  - النتيجة: هتفاجئ نفسك بتوفر مبالغ رهيبة كنت بتصرفها على الهواء، وهتتعلم تدير فلوسك بذكاء من غير ما تحس إنك مسجون.\n\n• 3. خطوة \"مواجهة المرآة بلا أقنعة\" (التشافي من البهلوان الحزين):\n  - إزاي تعملها: في نهاية كل يوم، وقبل ما تنام، اقف قدام المراية دقيقة واحدة، اخلع قناع الضحكة والبهجة، ولو حسيت إنك تعبان أو مخنوق، قول لنفسك بصوت عادي: \"أنا تعبان النهاردة، ومسموح لي أضعف وأزعل من غير ما أمثل إني زي الفل\". اسمح لنفسك تعيط أو تفرغ طاقتك السلبية في ورقة وتقطعها، من غير ما تستنى تصفيق أو مواساة من حد.\n  - النتيجة: هتفرغ سموم الكتمان من جوه شاكرا الحنجرة والقلب، وهتصحى تاني يوم طاقتك الحقيقية منورة ونضيفة من غير تمثيل.\n\nسؤال للتأمل: إيه أصغر خطوة من التلاتة دي تقدر تبدأ بيها بكرة الصبح؟"},"7":{"title":"القسم السابع: جرح الطفولة، الدين الكارمي، وعلاقتك بالأطفال","text":"ليه دايماً بتحس إنك لازم تضحك وتكون \"منور\" عشان أهلك أو اللي حواليك يحبوك، وإن زعل أو عياط ممنوع؟\nاستخدامك للضحك والهزار كدرع، وخوفك السري من إن الناس تبطل تحبك لو بقيت عادي، جذوره راجعة لجرح قديم في الطفولة.. زائد إن مسار رقم (3) بيحمل \"دين كارمي\" يخص استهلاك الموهبة وتشتت الطاقة في الكلام الفاضي بدل الإنتاج الحقيقي.\n\nأولاً: جرح الطفولة والطفل الداخلي:\nأغلب أصحاب مسار الحياة رقم (3) كان عندهم \"طفل مبدع ومشع\" جوه العيلة، بس جرحهم الأساسي بيتمثل في نقطتين:\n\n• الحب المشروط بالبهجة والتفوق: في طفولتك، غالباً حسيت إن أهلك بيحبوا ويكافئوا الطفل \"الذكي، اللي دمه خفيف، وبيضحك، وبيجيب درجات حلوة\". أما لما كنت بتزعل، تتعب، أو تعيط، كان بيتقالك: \"بطلو نكد، ما إنت زي الفل أهو!\". ده زرع في طفلك الداخلي برمجة إن: (الحزن مرفوض، وأنا مستاهلش الحب إلا لو كنت بهيج ومبهر). والجرح ده هو اللي خلاك تلبس قناع البهجة لحد دلوقتي.\n\n• قمع التعبير والانطلاق: أو العكس، إنك اتعرضت لبيئة صارمة كتمت صوتك، ضحكتك، أو حركتك، فكبر جواك طفلك الداخلي وهو بيموت عشان يعبر عن نفسه بحرية، ومن هنا جه إصرارك الكبير وأنت كبرت على لفت الأنظار والظهور بأي طريقة. والحقيقة إن الطفل اللي اتكتم صوته، بيفضل طول عمره بيدور على فرصة يعبر. اديله الفرصة دي، وهتلاقي نفسك بترتاح.\n\nثانياً: الدين الكارمي لمسار (3) - (كارما تشتت الموهبة وإساءة الكلمة):\nفي علم الأرقام الكارمي، الرقم (3) (وخصوصاً لو جاي من مجموع 12 أو 21) بيحمل كارما تخص \"تبديد النعم وتشتت الطاقة\".\n\n• رسالة الكارما بتاعتك: في الماضي (أو في حيوات سابقة)، إما إنك امتلكت موهبة جبارة وذكاء ولسان ساحر بس ضيعتهم في الهزار، النميمة، وكلام الليل اللي ملوش أصل.. أو إنك استخدمت سحر كلامك عشان تخدع وتستغل غيرك. الكون بعتك في المسار ده عشان تتعلم الدرس الأصعب: \"إزاي تحترم هبة الكلمة، وتجمع طاقة إبداعك عشان تترك أثر حقيقي مش مجرد ضحكة بتطير في الهوا\". الكارما بتعاقب مسار (3) بالتشتت المالي وضياع الفرص كل ما استهزأ بمواهبه، وبتكافئه بالثروة والجاه لما بينضبط ويوجه فكره للصح.\n\nثالثاً: علاقتك بالأطفال والتربية (أنت كأب / أم):\n\n• مميزاتك في التربية: إنت أب أو أم \"صاحب لعياله\"! بيتك مليان ضحك، لعب، حكايات، ومرح مستمر. بتشجع ولادك على الابتكار، الرسم، ممارسة الرياضة، والتعبير عن أفكارهم من غير خوف. بتزرع فيهم التفاؤل وحب الحياة، ومستحيل تخليهم يحسوا بالملل في وجودك.\n\n• عيوبك في التربية (احذر منها): بسبب طبيعتك المملة من الروتين، ممكن تكون أب/أم \"مش منظم، مشبع بالتقلبات المزاجية، أو بتتساهل في القواعد المهمة\". أحياناً بتهزر في أوقات جد محتاجة حزم، أو بتعدي أخطاء ولادك بالضحك لأنك بتكره النكد والمشاكل. وعيب تاني: ممكن تضغط على ولادك عاطفياً عشان يكونوا \"فخورين بيك\" قدام الناس.\n\n• نصيحة ذهبية: خليك السند والمرح لولادك، بس متنساش تحط \"قواعد وحدود ثابتة\" للتربية. الطفل بيحتاج ضحكتك وحضنك، بس بيحتاج كمان أمان القوانين الواضحة اللي بتعلمه الانضباط.\n\nسؤال للتأمل: إيه الحاجة اللي كنت محتاج تسمعها وإنت صغير، ولسه محتاج تسمعها النهاردة؟"}},"4":{"1":{"title":"القسم الأول: شفرة الروح والجوهر","text":"(لمن مجموع تاريخ ميلاده الكامل يختزل إلى الرقم 4، أو وُلد يوم 4، 13، 22، 31)\n\nالمعنى العاطفي والنفسي / طاقة القراءة (جوهر روحك الحقيقي):\n\nلو مسار حياتك هو الرقم (4)، فاعرف إنك مجيتش الدنيا دي عشان تعيش في الهوا أو تعتمد على الحظ والصدفة. روحك شايلة شفرة \"التأسيس، النظام، والبناء طويل المدى\". إنت الصخرة اللي بتقف قدام أي عاصفة من غير ما تتهز، وجوهرك بيتكون من التفاصيل دي:\n\n• ضهر وسند لا يُكسر: إنت الشخص اللي الكل بيعتمد عليه في الشدة والمحن. عندك قدرة مرعبة على تحمّل المسؤولية، الشغل الصعب، والضغط المستمر من غير ما تشتكي. طبعك عملي، جاد، وبتحب تبني كل حاجة في حياتك (شغل، بيت، علاقات) على أساس صلب ومتين يقعد مدى الحياة مش مجرد قش بيطير مع أول ريح. بس خد بالك: الصخرة اللي مبتتهزش، ممكن تتحمل لحد ما تتكسر. حتى الصخر محتاج يتنفس. اسمح لنفسك ترتاح، مش ضعف، ده صيانة.\n\n• ملك التنظيم والتفاصيل: مابتؤمنش بالفوضى ولا بالحتت العشوائية. عقلك هرمسي مهندس؛ بتحب تحط خطط، جداول، وقوانين واضحة لكل حاجة حواليك. لو حد طلب منك تبني شركة أو تنظم كيان من صفر، إنت الشخص الوحيد اللي يقدر يمسك الفوضى دي ويرتبها ويخليها مكنة شغالة بانتظام. وده مش مجرد مهارة، ده حاجة في عصبك. الفوضى بتزعجك فيزيائياً، والترتيب بيريحك نفسياً. بس خد بالك: مش كل حاجة محتاجة خطة. أحياناً أحلى الحاجات بتحصل من غير ترتيب. سيب مساحة للمفاجآت الحلوة.\n\n• الوفاء والالتزام المطلق: كلمتك عقد، ووعدك دين في رقبتك. مستحيل تخلف بوعد قطعته أو تتخلى عن شخص في أزمته. إنت مش من نوعية الناس اللي بتجيب كلام معسول وبس، إنت بتقدم الحب والأمان بـ \"الأفعال، المواقف الثابتة، والتأمين المادي والعاطفي\". الوفاء ده مش عادة، ده طبيعتك. بس خد بالك: الوفاء مش معناه إنك تستحمل الإهانة أو الإهمال. الوفاء الحقيقي بيبدأ من نفسك. لو مش وفي لنفسك، مش هتقدر تكون وفي لحد تاني.\n\n• جوهر طاقتك في الوضع الإيجابي (طاقة النور): لما بتكون في قمة اتزانك، بتكون القائد العادل، الحكيم، والباني العظيم. بتنجح في بناء ثروة وإمبراطورية شخصية تكفي وتدفّي عيلتك وكل اللي حواليك، وبتكون مصدر أمان واستقرار حقيقي لكل الناس اللي في فلكك. في الحالة دي، إنت زي الجبل اللي بيحمي اللي حواليه من العواصف، مش بس بثباته، لكن بحنانه اللي بيبان في أفعاله.\n\n• جوهر طاقتك في الوضع السلبي (طاقة الظل والانحراف): لما طاقتك بتستنزف أو بتتعرض لضغط عالي، بتتحول لشخص \"عنيد جداً، متصلب الرأي، وديكتاتور قاسي\" مبيقبلش النقاش ولا التغيير. بتغرق في الروتين لحد ما تحبس نفسك في سجن أنت اللي بنيته، وبتتحول لشخص شكاك، حذر بزيادة، ورافض لأي مفاجآت أو إبداع بره الصندوق. والحقيقة إن العناد مش قوة، العناد خوف. خوف من إنك تبان ضعيف لو غيرت رأيك. القوي الحقيقي هو اللي بيعرف يقول \"أنا غلطت\" من غير ما يحس إنه قل.\n\nطاقتك أرضية ترابية جافة وثابتة؛ إنت مش بتجري ورا أحلام وهمية، إنت بتزرع الشجرة وتستنى صابر عليها لحد ما تثمر وتأكل منها ومن بعدك. والفرق بينك وبين غيرك إنك بتعرف تستنى. وفيه مقولة بتقول: \"اللي بيستنى، بيلاقي\". وإنت من الناس اللي بتستنى، وبتلاقي.\n\nسؤال للتأمل: إمتى آخر مرة ارتحت من غير ما تحس بذنب؟ وإيه اللي بيمنعك تكررها؟"},"2":{"title":"القسم الثاني: المراية المزدوجة","text":"في مسار الحياة رقم (4)، إنت لابس أثقل درع وأصلب قناع في علم الأرقام كله، والفرق بين اللي الناس بتشوفه فيك وبين اللي حاسس بيه من جوه قصة درامية لوحدها:\n\n• إزاي الناس بتشوفك من بره (القناع الخارجي والهالة):\nالناس بتشوفك \"الرجل الحديدي\" أو الصخرة اللي مفيش أي عاصفة تقدر تهزها! هالتك الخارجية بتدي انطباع بالجدية المطلقة، الصرامة، الانضباط، والاعتمادية. في عيونهم، إنت الشخص اللي مبيغلطش، اللي دايماً عنده حلول عملية لكل مشكلة، واللي مبيعرفش معنى \"التعب أو الضعف\". ولأنك دايماً شايل هم الكل وبتوفر الأمان للي حواليك، الناس بتتعود على كده، وبيفتكروك شخص \"ناشف، عملي، ومش رومانسي\"، ومبيعدوش في حساباتهم أبداً إنك ممكن تكون محتاج في يوم حد يطبطب عليك أو يشيل عنك همّك!\n\n• إيه اللي بيدور جواك فعلاً (حقيقتك وصراعك الداخلي السري - متلازمة الأطلس المهدور):\nالحقيقة اللي مخبيها ورا وشك الجاد والملامح الثابتة هي إنك تعبان، مهدود الحيل من كتر ما شلت هم الدنيا لوحدك، وجواك طفل صغير خايف يفقد السيطرة أو يقع في يوم فيتكشف قدام الناس! إنت بتعاني من إحساس خفي بـ \"الوحدة وسط الزحمة\"؛ الكل بيلجأ لك عشان تحل مشاكلهم وتدفع عنهم البلاء، بس لو جيت في يوم وضعفت أو حسيت بقلة حيلة، مابتلاقيش حد جنبك لأنك عودت الكل إنك \"السند اللي مبيتميلش\". جواك رغبة سرية وعميقة في إنك ترمي كل المسؤوليات دي لثانية واحدة وتعيش ببساطة من غير خوف من بكرة. بس مين هيعمل ده لو مش إنت؟ السؤال ده هو اللي بيخليك تكمل وتحمل. والحقيقة إن الكل مش محتاج منك تحمل عنه. في ناس محتاجة منك بس تسيبها تتحمل مسؤوليتها، وتدعمها من بعيد.\n\n• السر النفسي في تعاملك مع الضغوط والصدمات:\nلما بتجيلك صدمة قوية أو ضربة في حياتك، إنت مبتعيطش قدام حد ومبتعملش دراما؛ إنت بتدخل في \"حالة صمت أعمق، وبتشد في شغلك أو مسؤولياتك أكتر وأكتر\" عشان تهرب من الوجع بالعمل والشغل الشاق. بتبني سور إسمنتي حوالين قلبك عشان متمكنش حد يشوف دموعك، وبتعصر على نفسك ليمون لحد ما تعدي الأزمة لوحدك تماماً من غير ما تطلب مساعدة من مخلوق. بس الحقيقة إن السور اللي بتحمي بيه نفسك، هو نفسه اللي بيمنعك من القرب. الحب مش بيدخل من السور، الحب بيدخل من الباب. افتح الباب شوية.\n\nسؤال للتأمل: إمتى آخر مرة قلت لحد \"أنا محتاج مساعدة\" من غير ما تحس إنك ضعيف؟"},"3":{"title":"القسم الثالث: البلوكات الخفية ونقاط التعطيل","text":"ليه من كتر حرصك وخوفك من بكرة، بتلاقي نفسك محبوس في سجن الروتين والجمود ورافض أي فرصة حلوة لتغيير حياتك؟\nأكبر بلوك طاقي بتطارد صاحب مسار الحياة رقم (4) وبتوقف رزقه هو \"الجمود الفكري، العناد الأعمى، والخوف المرضي من المفاجآت\". إنت بتدمر نجاحك أحياناً لما بتتمسك بالقواعد القديمة وترفض أي تطوير خوفاً من الخروج من منطقة الأمان.\n\nأولاً: أنماط التعطيل والعيوب الخفية لمسار رقم (4) في نقاط سريعة:\n\n• العناد الشديد والتشبث بالرأي حتى لو غلط (مستحيل تعترف بسهولة إنك غلطت).\n• الخوف المبالغ فيه من التغيير، المجازفة، أو أي حاجة خارج الصندوق المألوف.\n• قسوة مفرطة في الحكم على نفسك وعلى اللي حواليك (معاييرك مستحيلة وصعبة).\n• إدمان الشغل وإهمال الجانب العاطفي، الصحي، والترفيهي في الحياة.\n• النظرة التشاؤمية والحذرة بزيادة (دايماً مستني الكارثة تحصل وتدبر لها).\n• التصلب في القواعد والروتين لدرجة تطفئ أي بهجة أو مرونة في بيتك أو شغلك.\n\nثانياً: التحليل العميق للبلوكات الطاقية الأربعة:\nطاقة الرقم (4) عاملة زي \"الخرسانة المسلحة\"؛ قوية جداً وثابتة، بس لو نشفت بزيادة بتتحول لسجن يخنِق صاحبه:\n\n• البلوك الأول: سجن الروتين والجمود الفكري:\nمن كتر ما إنت بتحب الأمان والنظام، بتخاف تاخد أي خطوة جديدة أو تغيير في حياتك لو مكنش مضمون بنسبة 100%. البلوك ده بيخليك تفوت على نفسك فرص ذهبية في الشغل أو الحياة، وتفضل قاعد في مكانك سنين طويلة لأنك \"بتخاف من المجهول\"، لحد ما تكتشف إن العالم كله اتحرك وسابك ورا. والحقيقة إن مفيش حاجة مضمونة 100%. حتى القعدة في مكانك فيها مخاطرة، مخاطرة إنك تفضل مكانك. فأحياناً المجازفة المحسوبة أقل خطر من الجمود.\n\n• البلوك الثاني: العناد الكارمي وصدام المطارح:\nعندك قناعة داخلية إن \"طريقتي هي الصح والباقي غلط\". العناد ده بيعملك بلوكات عنيفة في علاقاتك الشخصية والشريكة؛ لما بيحصل خلاف، بتفضل ناشف في مكانك ورافض تقدم خطوة للتنازل أو الحوار المرن، وبتفضل تحارب على تفاصيل تافهة لحد ما تخسر ناس غالية عليك. والحقيقة إن اللي بيكسب المعركة بالعند، بيخسر العلاقة. والعلاقة أغلى من المعركة.\n\n• البلوك الثالث: احتراق الضمير والمسؤولية المفرطة:\nشايل هم الكل وبتلعب دور \"المنقذ والمدير\" في شغل وفي البيت، ومابتسمحش لنفسك تغلط أو ترتاح. البلوك ده بيضرب جسمك بالتوتر العضلي، أوجاع الظهر، والقولون، لأن طاقتك متقفلة على الشغل وبس من غير أي متنفس روحي أو ترفيهي. والحقيقة إن جسمك مش ماكينة. لما بتتعب، بتتكلم. اتعلم تسمع جسمك قبل ما يصرخ.\n\n• البلوك الرابع: جفاف العواطف الظاهري:\nمن خوفك على نفسك من الضعف، بتبني سور حديدي حوالين مشاعرك. حتى لما تحب حد بجد وتموت فيه، مابتَعرفش تعبر عن ده بالكلام الحلو أو الحنان، وبتكتفي بـ \"توفير الفلوس والطلبات\"، فبيفتكرك شريكك أو عيالك شخص ناشف وبلا مشاعر. والحقيقة إن اللي بيحب ومبيقولهوش، بيبقى في نظر اللي بيحبه مش موجود. الحب محتاج يتقال، مش بس يتعمل.\n\nثالثاً: ثلاث خطوات لفك البلوك الطاقي (الروشتة الروحية والذهنية):\n\n• 1. الوعي والإدراك (تعديل البرمجة العقلية):\nحط القاعدة دي قدام عينك دايماً: \"المرونة مش ضعف، المرونة هي الشجرة اللي بتوطي مع العاصفة عشان متتكسرش!\". مش كل حاجة لازم تمشي بالمللي وبالخطط الصارمة. درب نفسك تقبل \"الفوضى البسيطة\" كجزء من جمال الحياة، واعرف إن التغيير مش عدوك، ده طوق النجاة اللي بينقلك للمستوى اللي بعده.\n\n• 2. السر الباطني والطاقي (توازن شاكرا الجذر والقلب):\nفي العلوم الباطنية، مسار الرقم (4) مرتبط بـ \"شاكرا الجذر\" مركز الأمان والثبات المادي. البلوك عندك بيحصل لما الخوف من الفقر أو ضياع السيطرة بيسيطر عليك، فبتتصلب طاقتك. السر الباطني لفك تعطيلك هو \"التسليم والثقة في تدفق الكون\": اعمل اللي عليك بدقة واجتهاد، وبعدين ارخي أعصابك وسيب المساحة للكون يدبر الباقي، وافتح قلبك لاستقبال المتعة والبهجة مش بس الشغل والمسؤولية.\n\n• 3. الصورة الذهنية للتشافي (حط الصورة دي في عقلك دايماً):\n\"تخيل إنك مش (جدار أسمنتي صلب) معرض لأي ضربة تخليه يتشقق ويتكسر من كتر العند.. تخيل إنك (شجرة بلوط عملاقة)، جذورها ثابتة في أرض صلبة تديها الأمان الكامل، بس فروعها وأوراقها بتتحرك بحرية ومرونة مع هواء ونسيم الحياة. الثبات في الجذور والأساس.. والمرونة في الفروع والتصرف!\"\n\nسؤال للتأمل: إيه الحاجة اللي إنت متمسك بيها وهي مش في صالحك؟ وإيه اللي بيمنعك تسيبها؟\"البلوكات الطاقية\" هنا تعبير رمزي عن أنماط متكررة، مش حقيقة كونية. الأنماط دي قابلة للتغيير بالوعي والتدريب."},"4":{"title":"القسم الرابع: الشفرة العاطفية، الجواز، وكارما العلاقات","text":"ليه بتحس أحياناً إن شريك حياتك مش مقدر تضحياتك، وإنك بتقدم أمان ومسؤولية بس مفيش مقابل عاطفي كافي؟\nالحب في حياة صاحب مسار رقم (4) مش كلام في الهوا ولا أشعار رومانسية، الحب بالنسبة لك هو \"مواقف، أمان مادي، وبيت متسند على أسس صح\". بس الكارما العاطفية الأخطر عندك هي الجفاف العاطفي، وصعوبة التعبير عن اللين، والتحكم الزيادة تحت مسمى الخوف على المصلحة.\n\nأولاً: ملامح طبيعتك العاطفية (مميزاتك وعيوبك في الحب والجواز):\n\nسماتك كشريك عاطفي (في طاقة النور):\n- أمان مطلق، إخلاص تام، ووفاء مبيتهزش مهما كانت الظروف والعواصف.\n- بتقدم الحب والاهتمام بـ \"الأفعال والمواقف الحقيقية\" مش بالشعارات (بتشيل عن شريكك كل هموم الدنيا).\n- شخص عاقل، راسي، وبتعرف تدبر أمور البيت والعيلة بحكمة بالغة في أشد الأزمات.\n- بتوفر استقرار مادي ومعنوي يخلي شريكك مطمن ومرتاح وهو في ضهرك.\n- وفاء طويل المدى؛ علاقتك مش مرتبطة بالمزاج، مرتبطة بالاختيار والالتزام.\n\nعيوبك العاطفية (في طاقة الظل):\n- جفاف عاطفي ظاهري وقلة الكلام الحلو أو التعبير بالرومانسية.\n- العناد والتشبث بالرأي لدرجة تحويل النقاش البسيط لـ \"جلسة تحقيق أو محكمة\".\n- حذر ورهبة مبالغ فيها من الارتباط في البداية (بتاخد وقت طويل جداً عشان تدي أمان وتثق في الشريك).\n- السيطرة وفرض القواعد والنظام الصارم جوه البيت (مبتطيقش الفوضى أو العشوائية من شريكك).\n- كتمان المشاعر وجلد الذات بصمت بدل ما تتكلم وتحضن شريكك وقت الزعل.\n\nثانياً: التحليل العميق لشفرة الحب والجواز لمسار رقم (4):\n\n• مواصفات الشريك اللي بيجيبك الأرض (فتى/فتاة أحلامك طاقياً):\nإنت مستحيل ترتبط بشخص مستهتر، عشوائي، أو مش مسؤول. اللي بيجيبك الأرض هو الشريك \"العاقل، المتزن، والداعم\" اللي يقدر مجهودك وتعبك، ويكون عنده وعي مالي وأخلاقي زيك. عايز شريك يحتوي جديتك بابتسامة، ويعرف يفك قسوة ملامحك بحنان وبدون استهتار. بس خد بالك: الشريك ده مش هيفضل يستحمل الجفاف العاطفي للأبد. لو مش عبرت عن حبك، ممكن يحس إنه مش محبوب، حتى لو إنت بتحبه بجد.\n\n• البلوك العاطفي وكارما العلاقات (ليه علاقاتك بتواجه جفاف؟):\nاللعنة العاطفية لمسار رقم (4) هي \"اعتقادك الخاطئ بأن توفير الفلوس والأمان المادي يكفي وحدَه عشان تسعد شريكك\". الكارما بتضربك لما تلاقي شريكك بيشتكي من الوحدة العاطفية والبرد رغم إنك وفرت له كل طلباته المادية! البلوك بيحصل لما تتحول في البيت لـ \"مدير أعمال\" أو \"أب قاسي\" بدل ما تكون الحبيب الحنون والونس. والحقيقة إن الفلوس بتجيب راحة، بس مش بتجيب حب. الحب بيجي من الحضور، والكلمة الحلوة، والاهتمام بالتفاصيل الصغيرة.\n\n• طبيعتك في الجواز والاستقرار:\nالجواز في نظرك هو \"مشروع حياة مقدس\"؛ بيت وبناء وعيلة متماسكة. في البيت إنت العمود الخرساني اللي مايميلش. بس عشان جوازك ينجح وميدخلش في مرحلة الملل والجمود، محتاج تتعلم تفك الكرافتة وأنت داخل باب البيت، وتدي مساحة للين، الهزار، والمشاعر الصريحة من غير خوف من إنك تطلع في صورة \"الضعيف\". والحقيقة إن اللي بيعرف يضحك مع شريكه، بيعرف يعيش معاه. الجدية لوحدها مش كفاية.\n\nثالثاً: خريطة التوافق الطاقي (مين ينورك ومين يطفيك؟):\n\n• أعلى توافق روحي وعاطفي (توأم الشعلة والانسجام):\n  - مع مسار رقم (2) ورقم (6): قمة الانسجام والاستقرار؛ هما بيدوك الحنان، الدبلوماسية، والاحتواء اللي محتاجه لقلبك، وإنت بتديهم الأمان المطلق والضهر اللي ميميلش.\n  - مع مسار رقم (4) زيك ورقم (8): شراكة مادية وعملية جبارة؛ بتفهموا لغة العمل، الالتزام، والطموح الطويل المدى.\n\n• علاقات التحدي والصدام (تحتاج مرونة وعي عالي):\n  - مع مسار رقم (3) ورقم (5): طاقاتهم العشوائية، المغامرة، وحبهم للحرية بيستفزوا حذرك ونظامك الصارم؛ لو مفيش تنازل من الطرفين، هتحس إنهم بيخنقوك أو إنك بتتحكم فيهم بزيادة.\n\nرابعاً: ثلاث خطوات لفك البلوك العاطفي (روشتة تشافي القلب):\n\n• 1. الوعي والإدراك العاطفي:\nاحفظ الجملة دي زي اسمك: \"المسؤولية المادية مهمة، بس الحضن والكلمة الحلوة أثمن بكتير عند شريك حياتك\". بطل تقيس حبك لشريكك بالفاتورة اللي بتدفعها أو الشغل اللي بتعمله؛ الشريك محتاج يحس إنه مرغوب ومحبوب لنفسه، مش عشان إنت بتوفر له الأكل والشرب وبس.\n\n• 2. السر الباطني والطاقي (تفتيت جدار شاكرا القلب):\nفي العلوم الباطنية، صاحب مسار رقم (4) بيبني درع حديدي (تجسيد لطاقة زحل) حوالين \"شاكرا القلب\" عشان يحمي نفسه من الوجع والصدمات. السر الباطني لشفاء مشاعرك هو \"تفعيل طاقة اللين والتقبل\": اسمح لنفسك تعيط، تشتكي، وتقول لشريكك \"أنا محتاج حضنك ومحتاج أرتاح\" من غير ما تخاف إنك تفقد هيبتك. القوة الحقيقية بتظهر في القدرة على اللين مش في الصلابة الدائمة.\n\n• 3. الصورة الذهنية لتشافي العلاقات (حط الصورة دي في عقلك دايماً):\n\"تخيل إن بيتك وعلاقتك مش (قلعة حجرية محصنة بأسوار عالية وأبواب حديد) ممنوع حد يقرب منها.. تخيل إن بيتك هو (حديقة خضراء مثمرة وليها بيت زجاجي دافئ). السور بيحمي من برة، بس جوه البيت فيه دفء، زرع، وروائح جميلة، وقزاز شفاف بيسمح لنور الشمس والمشاعر تدخل للقلب من غير خوف. امنح نفسك الأمان من برة.. والدفء واللين من جوه.\"\n\nسؤال للتأمل: في آخر خلاف، إنت كنت بتدافع عن وجهة نظرك، ولا عن العلاقة نفسها؟ وإيه اللي كان هيفرق؟"},"5":{"title":"القسم الخامس: مغناطيس المال، الوفرة، والمهنة","text":"ليه الفلوس عندك بتيجي بطلوع الروح وعن طريق الشغل الشاق، وليه بتحس إنك لو وقفت مكانك ثانية كل حاجة هتقع؟\nرزق صاحب مسار الحياة رقم (4) مش بيجي بالحظ ولا بالضربات السريعة؛ رزقك مربوط بـ \"الصبر، الهيكلة، والعمل الشاق طويل المدى\". بس البلوك المالي الأكبر عندك هو الخوف من المخاطرة، ورفضك لأي استثمار جديد حتى لو مضمون، مما يخليك تضيع فرص تضاعف دخلك.\n\nأولاً: ملامح طبيعتك المادية والمهنية (مميزاتك وعيوبك في الفلوس والشغل):\n\nسماتك المالية والمهنية (في طاقة النور):\n- أمانة منقطعة النظير وضمير مهني حديدي (الكل يأتمنك على أمواله وأسراره وأنت مغمض).\n- قدرة فطرية على إدارة الأزمات المالية، وضع الميزانيات، وحفظ المال من الضياع.\n- بناء الثروة بالطوب والأصل الحقيقي (استثماراتك دايماً طويلة المدى وعقارية أو ملموسة).\n- تفاني في العمل لا يعرف المستحيل، والتزام صارم بالمواعيد والدقة في كل تفصيلة.\n\nعيوبك المالية والمهنية (في طاقة الظل):\n- الحرص المبالغ فيه (البخل أو التقتير على النفس وعلى البيت أحياناً من كتر الخوف من بكرة).\n- رفض أي مجازفة مالية جديدة، والتمسك بالطرق القديمة في الشغل حتى لو بقت قديمة ومبتجبش عائد.\n- العمل بشراسة لحد الإرهاق الجسدي ونسيان إن الفلوس وسيلة لمتعة الحياة مش غاية لوحدها.\n- الصدام مع المديرين أو الشركاء اللي بيشتغلوا بعشوائية أو مبيحترموش القواعد والنظام.\n\nثانياً: التحليل العميق لشفرة المال والمهنة لمسار رقم (4):\n\n• إزاي الفلوس بتجيلك؟ (شفرة الرزق والوفرة):\nفلوسك وبركتك مربوطة بـ \"الهندسة، التأسيس، الإدارة، والتنظيم الصارم\". طاقة الرقم (4) هي طاقة المقاول، المهندس، المدير المالي، والمؤسس الحقيقي للشركات. الفلوس مش بتجيلك من الهوا؛ بتجيلك لما تبني مشروع خطوة بخطوة، أو لما تمسك إدارة كيان وتعيد هيكلته وترتيبه فيبقى مكنة فلوس. كل ما كان أساسك قوي، كل ما كانت ثروتك مستدامة ومابتقعش أبداً مع أي أزمة اقتصادية.\n\n• البلوك المالي والتعطيل (إيه اللي بيبوظ عليك الفلوس؟):\nاللعنة المالية عندك اسمها \"فوبيا الخسارة ورفض التطوير\". من كتر خوفك على الجنيه ليضيع، ممكن ترفض تستثمر في تكنولوجيا جديدة أو تطوير شغلك، فالمنافسين يسبقوك! بلوك تاني خطير هو \"شيل الشغل كله لوحدك\"؛ لأنك مابتثقش في حد يعمل الحسابات أو التفاصيل غيرك، فبتلاقي نفسك محشور في الشغل التشغيلي البسيط وبتمنع نمو وتوسع البيزنس بتاعك.\n\n• المجالات الأنسب لتحقيق الثروة:\nالهندسة المعمارية والإنشائية، المقاولات، الإدارة المالية والمحاسبة، البنوك والاستثمار العقاري، التأسيس والإدارة التشغيلية للشركات، القانون والمحاماة، تكنولوجيا المعلومات وبناء النظم، والزراعة والتجارة الملموسة.\n\nثالثاً: ثلاث خطوات لفك البلوك المالي (روشتة جذب الثروة):\n\n• 1. الوعي والإدراك المالي:\nحط القاعدة دي في دماغك: \"المال طاقة حركة، مش طاقة تجميد وخوف!\". الحرص الزيادة والبخل بيقفلوا طاقة الوفرة. اتعلم تخصص جزء من أموالك للاستثمار وجزء للترفيه عن نفسك وعيلتك من غير إحساس بالذنب، واعرف إن المخاطرة المدروسة هي السر اللي بيحول التعب لثروة ضخمة.\n\n• 2. السر الباطني والطاقي (تفعيل طاقة التدفق في شاكرا الجذر):\nطاقة رقم (4) مرتبطة بشاكرا الجذر (الأمان والبقاء). لما بيسيطر عليك خوف من الفقر، العقل بيقفل طاقياً وبتجذب لفلوسك طاقة انقباض. السر الباطني لوفرتك هو \"اليقين والصدقة\": كل ما طلعت جزء للصدقة بنية تبركة المال وأنت راضي ومبسوط، كل ما الكون فتحلك أبواب رزق أوسع بكتير من الحسبة الورقية الضيقة اللي في دماغك.\n\n• 3. الصورة الذهنية لجذب الثروة (حط الصورة دي في عقلك دايماً):\n\"تخيل إن ثروتك مش (صندوق حديدي مقفول بمفتاح وبتحرس عليه وأنت خائف) لتتسرق.. تخيل إن ثروتك هي (شجرة جذورها راسخة في الأرض بس أثمارها بتتساقط وتتجدد كل موسم وخيرها بيفيض على الكل). الأساس ثابت ومركّز.. لكن الخير بيتحرك وبيروح وبييجي بكل سلاسة وأمان.\"\n\nسؤال للتأمل: إيه الحاجة اللي إنت خايف تصرف عليها فلوس وهي هتفرحك؟ وإيه اللي بيمنعك؟\"شفرة الرزق\" و\"جذب الثروة\" هنا لغة رمزية للتأمل في عاداتك المالية، مش وعد بثراء مضمون. القرارات المالية الكبيرة محتاجة دراسة ومتخصصين."},"6":{"title":"القسم السادس: خطوات عملية تفرق معاك","text":"إزاي تتخلص من وطأة المسؤولية المستمرة، وتسمح لنفسك ترتاح وتستمتع بثمرة تعبك من غير ما تحس بالذنب؟\nالتشافي لصاحب مسار رقم (4) مش معناه إنك تبطل تبني أو تفرط في شغلك، التشافي معناه إنك تلاقي \"المرونة\" اللي تخلي شجرتك تتحمل العواصف من غير ما تنشف أو تتكسر، وتتعلم تفك كرافتة المسؤولية أول ما تدخل بيتك.\n\nالروشتة العملية الفورية لتغيير حياتك (3 خطوات للتطبيق المباشر):\n\n• 1. خطوة \"طوق المرونة الأسبوعي\" (تمرين كسر الروتين):\n  - إزاي تعملها: خصص يوم واحد في الأسبوع (أو حتى 4 ساعات منه) واعمل فيها حاجة بره جدولك الروتيني تماماً وبعشوائية مقصودة (امشي في طريق جديد، كل أكلة عمرك ما جربتها، سافر مكان مفاجئ من غير تخطيط مسبق بالورقة والقلم).\n  - النتيجة: هتكسر \"سجن الجمود الفكري\"، وتدرب عقلك وعصبك العصبي على إن الحياة مش هتقع لو خالفت الجدول المرسوم لمدة ساعتين، وده هيقلل التوتر والقلق عندك بشكل إعجازي.\n\n• 2. خطوة \"ساعة التفويض الكامل\" (علاج متلازمة أطلس):\n  - إزاي تعملها: ابطل تلعب دور المصلح والمدير لكل تفصيلة صغيرة في حياتك. من النهاردة، حدد شغلتين أو تلت مهام (سواء في البيت أو الشغل) واعتمد على شخص تاني إنه يعملهالك بالكامل من غير ما تدخل في التفاصيل أو تنتقد طريقته.\n  - النتيجة: هتخفف الحمل الهائل اللي على كتافك، وتدي فرصة لضهرك وأعصابك ترتاح، وتسمح لغيرك يتحمل المسؤولية معاك.\n\n• 3. خطوة \"طقوس تفتيت الجليد العاطفي\" (التعبير عن اللين):\n  - إزاي تعملها: قبل ما تنام، اقعد مع شريك حياتك أو ولادك، وبدل ما تتكلم عن الشغل، الفلوس، والمصاريف، قول جملة واحدة صريحة ودافية من غير خجل (زي: \"أنا متشكر لتعشكم معايا\" أو \"أنا بحبكم ومقدر تعبكم معايا\"). ولو حسيت برغبة في الهزار أو الحضن، اعملها فوراً من غير ما تحسبها.\n  - النتيجة: هتفك السور الحديدي اللي حوالين قلبك، وتدوب الجفاف العاطفي، وتخلي بيتك دافي ومليان سكينة بجد مش مجرد سكن مادي.\n\nسؤال للتأمل: إيه أصغر خطوة من التلاتة دي تقدر تبدأ بيها بكرة الصبح؟"},"7":{"title":"القسم السابع: جرح الطفولة، الدين الكارمي، وعلاقتك بالأطفال","text":"ليه حسيت وأنت لسه طفل صغير إنك لازم تكبر بسرعة، وتكون \"العاقل المسؤول\" اللي مبيغلطش عشان البيت ميوقعش؟\nالجدية الزيادة، والخوف المرضي من الفوضى، وصعوبة الاسترخاء، جذورها واقفة في جرح طفولة اتفرضت عليك فيه المسؤولية بدري.. زائد إن مسار رقم (4) بيحمل \"دين كارمي\" يخص التصلب، رفض التغيير، واستعباد النفس أو الآخرين بالقواعد الصارمة.\n\nأولاً: جرح الطفولة والطفل الداخلي:\nأغلب أصحاب مسار الحياة رقم (4) ماعاشوش طفولة فيها رفاهية اللعب العشوائي والغباء البريء، وجرحهم الأساسي بيتمثل في نقطتين:\n\n• تحمل المسؤولية المبكرة: في طفولتك، غالباً حسيت إنك لازم تكون \"الراجل أو الست الكبيرة\" في البيت بدري جداً؛ سواء بسبب غياب أو انشغال الأهل، أو لأنك كنت الأكبر ومطلوب منك تكون قدوة ومغلطش أبداً. طفلك الداخلي اتبرمج على إن: (الاسترخاء خطر، واللعب عيب، وأنا مش هكون في أمان إلا لو كنت مسيطر ومنظم طول الوقت).\n\n• الحب المشروط بالإنجاز: أو إنك حسيت إن أهلك مبيقدروكش ويحبوك إلا لو جبت درجات نهائية، كنت \"مؤدب ومطاع\"، ومبتعملش أي دوشة أو خسارة مادية. الجرح ده خلاك كبرت وأنت بتحسب كل خطوة بألف حساب وخايف تقع. والحقيقة إنك كنت طفل محتاج حب، مش موظف محتاج تقييم. الحب مش مكافأة، الحب حق.\n\nثانياً: الدين الكارمي لمسار (4) - (كارما التصلب واستعباد القواعد):\nفي علم الأرقام الكارمي، الرقم (4) (وخصوصاً لو جاي من مجموع 13 أو 22) بيحمل كارما تخص \"الجمود، العناد، وقسوة النظام المادي\".\n\n• رسالة الكارما بتاعتك: في الماضي (أو في حيوات سابقة)، إما إنك كنت شخص ديكتاتور بيمشي الناس بالقوانين الصارمة والعصا، أو كنت شخص مادي بحت بتعبد الشغل والفلوس وناسي الجانب الروحي والإنساني. الكون بعتك في المسار ده عشان تتعلم الدرس الأصعب: \"إزاي تبني نظام وأمان، من غير ما تتحول لسجان قاسي بيقتل الروح والمرونة\". الكارما بتعاقب مسار (4) بالخسائر الفجائية أو الانهيارات اللي بتجبره يهد ويرجع يبني تاني، عشان يتعلم إن الثبات الحقيقي مش في الحجر، بل في مرونة الروح.\n\nثالثاً: علاقتك بالأطفال والتربية (أنت كأب / أم):\n\n• مميزاتك في التربية: إنت أب أو أم \"الصخرة والسند الحقيقي\"! بتوفر لولادك أعلى مستوى من الأمان المادي، التعليم الصح، والاستقرار الأسري. بتعلمهم تحمل المسؤولية، الاعتماد على النفس، والأخلاق والالتزام من وهما صغار، وبتكون دايماً ضهرهم في كل أزمة.\n\n• عيوبك في التربية (احذر منها): بسبب جديتك وحبك للنظام، ممكن تكون أب/أم \"صارم، ناشف، ومتطلب جداً\"؛ عندك لستة قوانين ممنوع الخروج عنها، ومبتتقبلش الفوضى الطبيعية بتاعت الأطفال (الطفل اللي بيلعب ويبهدل الدنيا بيجيلك جنان!). أحياناً بتحرم ولادك من التعبير الحر عن مشاعرهم عشان \"عيب وما يصحش\".\n\n• نصيحة ذهبية: وفّر الأمان والنظام لولادك زي ما أنت متعود، بس أنزل لمستواهم، اسمح لهم يغلطوا، يبهدلوا الدنيا، ويخافوا أو يضعفوا من غير خوف من عقابك الصارم. حضنك الدافئ وقبولك لأخطائهم أثمن بكتير من كشكول القوانين اللي معلقّه في البيت!\n\nسؤال للتأمل: إيه الحاجة اللي كنت محتاج تسمعها وإنت صغير، ولسه محتاج تسمعها النهاردة؟"}},"5":{"1":{"title":"القسم الأول: شفرة الروح والجوهر","text":"(لمن مجموع تاريخ ميلاده الكامل يختزل إلى الرقم 5، أو وُلد يوم 5، 14، 23)\n\nالمعنى العاطفي والنفسي / طاقة القراءة (جوهر روحك الحقيقي):\n\nلو مسار حياتك هو الرقم (5)، فاعرف إنك مجيتش الدنيا دي عشان تتسجن في مكتب مقفول أو تعيش حياة روتينية مكررة. روحك شايلة شفرة \"الحرية المطلقة، التغيير، والاستكشاف\". إنت الطائر اللي مبيحبش القفص، وجوهرك بيتكون من التفاصيل دي:\n\n• روح مغامرة وعاشق للتغيير: الروتين هو عدوك الأول والقاتل البطيء لطاقتك. إنت بتزهد الأماكن والمواقف اللي بتثبتك في مكان واحد، ودايماً عينك على بكرة، السفر، التجارب الجديدة، وتكسير القواعد القديمة. مستحيل تعيش حياة مألوفة أو تشبه حد تاني. بس خد بالك: التغيير مش دايماً هروب. فيه تغيير بيبني، وفيه تغيير بيهد. اللي بيهد بيخليك داير في نفس الدايرة. اللي بيبني بيخليك تطلع سلم. اتعلم تفرق بينهم.\n\n• كاريزما اجتماعية وسحر لا يقاوم: زيك زي رقم 3 بس بخلطة أكتر جرأة وثورة؛ لسانك حلو، حضورك بينور المكان، وبتعرف تتأقلم مع أي نوع بشر في أي مكان في العالم. عندك قدرة فطرية على إقناع الناس بأفكارك التحريرية الجديدة بفضل ذكائك وسرعة بديهتك. والكاريزما دي مش مجرد شكل، دي طاقة. لما بتدخل مكان، الناس بتحس إن فيه حاجة جديدة هتحصل. إنت بتجيب معاك ريحة التغيير.\n\n• عقل متفتح ومرن لأقصى درجة: مابتؤمنش بالثوابت المطلقة ولا بالقيود المجتمعية العمياء. بتحب تفكر بره الصندوق، تجرب كل حاجة بنفسك، وتتعلم من تجارب الحياة الحية مش من الكتب والمجالس المغلقة. بس خد بالك: الانفتاح مش معناه إنك ترفض كل حاجة قديمة. فيه حكمة في القديم، وفيه تجديد في الجديد. اللي بيعرف ياخد أحسن الاثنين، هو اللي بيكسب.\n\n• جوهر طاقتك في الوضع الإيجابي (طاقة النور): لما بتكون في قمة اتزانك، بتكون المستكشف المُلهم، المجدد، الشخص اللي بيجيب أفكار خارج الصندوق تنقذ أي مشروع ميت، وبتكون صديق ممتع، متسامح، ومليان حيوية وحب للحياة. في الحالة دي، إنت زي الرياح اللي بتجدد أي مكان تدخله، وبتخلي الناس تحس إن الحياة فيها احتمالات لا نهائية.\n\n• جوهر طاقتك في الوضع السلبي (طاقة الظل والانحراف): لما طاقتك بتتقيد أو بتحس بالخنقة، بتحول لشخص \"متهور، ملول بسرعة، إنسان فوضوي\" مبيعرفش يلتزم بأي ميعاد أو مسؤولية. بتقع في فخ إدمان المشتتات، الهروب المستمر وقت الأزمات، أو تدمير علاقاتك ونجاحك لمجرد إنك حسيت إنك محتاج \"تغير جو\"! والحقيقة إن الهروب مش حرية. الهروب سجن بيتنقل معاك في كل مكان. الحرية الحقيقية إنك تختار تقعد، مش إنك مجبر تمشي.\n\nسؤال للتأمل: إمتى آخر مرة عملت حاجة جديدة أول مرة؟ وإمتى آخر مرة هربت من حاجة كنت محتاج تواجهها؟ وإيه الفرق بينهم؟"},"2":{"title":"القسم الثاني: المراية المزدوجة","text":"في مسار الحياة رقم (5)، إنت بتمتلك شخصية عاملة زي \"الزئبق\"؛ صعب جداً حد يمسكك أو يتوقع خطوتك الجاية، والفرق بين صورتك قدام الناس واللي بيدور في عقلك الباطن كبير جداً:\n\n• إزاي الناس بتشوفك من بره (القناع الخارجي والهالة):\nالناس بتشوفك \"الطائر الحر\" اللي مفيش حاجة في الدنيا تقدر تقيده أو تكسر عينه! هالتك الخارجية بتدي انطباع بالجرأة، الشجاعة، الانطلاق، وإنك شخص \"بايع القضية\" ومبيفرقش معاه كلام الناس ولا التقاليد. في عيونهم، إنت الشخص المغامر اللي دايماً حياته مليانة أكشن، سفر، وتجارب مجنونة، وبيحسدوك على قدرتك إنك تقلب الصفحة وتمشي من أي مكان ميعجبكش في ثانية. بس في نفس الوقت، كتير منهم بيشوفوك شخص \"هوائي، ملوش أمان، ومبيعرفش يستقر أو يشيل مسؤولية لحد الآخر\"! وده لأنهم بيشوفوا الصورة من بره بس، مش اللي جواك.\n\n• إيه اللي بيدور جواك فعلاً (حقيقتك وصراعك الداخلي السري - متلازمة الغريب التائه):\nالحقيقة اللي محدش يعرفها ورا قناع الجرأة والتمرد ده هي إنك من جوه بتعاني أحياناً من إحساس عميق بـ \"الغربة وعدم الانتماء\"! عقلك شغال بسرعة 1000 كم في الساعة مبيفصلش تفكير، ومن كتر ما جربت حاجات كتير وشوفت أماكن وناس، ساعات بتحس إن مفيش مكان واحد في الدنيا شبهك بجد أو سايِع طاقتك. جواك صراع سري مرعب بين حاجتين عكس بعض: رغبتك الفطرية في إنك تطير وتكون حر ومحدش يحاسبك، وبين خوفك الخفي من إنك تفضل تجري طول عمرك لحد ما تلاقي نفسك في الآخر وحيد وملوش \"جذر أو بيت\" يرجع يستريح فيه! والخوف ده هو اللي بيخليك تجري أسرع، مش لأنك عايز، لأنك خايف تقف وتسأل نفسك \"أنا فين؟\". الوقفة مش ضعف، الوقفة شجاعة.\n\n• السر النفسي في تعاملك مع الضغوط والصدمات:\nلما بتتحط تحت ضغط نفسي شديد أو تحس إن فيه مشكلة بتخنقك، رد فعلك التلقائي هو \"الهروب الجغرافي أو الحسي\"! إنت مبتقعدش تندب حظك؛ إنت يا إما بتلم شنطتك وتسافر وتغير المكان والناس تماماً، يا إما بتهرب في \"المشتتات الحسية\" (سهر، أكل، شوبينج، ألعاب، أو علاقات سريعة) عشان تخدر عقلك ومتفكرش في الوجع، وتبدأ صفحة جديدة كأن الماضي ده محصلش أصلاً. بس الحقيقة إن الوجع بيسافر معاك. اللي بتهرب منه، هيلحقك. اللي بتواجهه، هيخف. والفرق بين الاتنين هو الشجاعة.\n\nسؤال للتأمل: إمتى آخر مرة واجهت مشكلة بدل ما تهرب منها؟ وإيه اللي كان هيفرق لو كنت واجهت من الأول؟"},"3":{"title":"القسم الثالث: البلوكات الخفية ونقاط التعطيل","text":"ليه كل ما تقرب من استقرار أو نجاح كبير، بتجيلك حالة \"زهق مفاجئة\" وتلاقي نفسك بتهد المعبد على اللي فيه وتمشي؟\nأكبر بلوك طاقي بتطارد صاحب مسار الحياة رقم (5) وبتوقف حاله هو \"فوبيا الالتزام، التشتت الحسي، وهدم النجاح بالملل\". إنت عبقري في اقتناص الفرص، بس بتدمر حظك بإيدك في اللحظة اللي بتخلط فيها بين \"الحرية\" وبين \"الفوضى والهروب من المسؤولية\".\n\nأولاً: أنماط التعطيل والعيوب الخفية لمسار رقم (5) في نقاط سريعة:\n\n• الملل السريع جداً وفقدان الشغف بمجرد ما الحاجة تبقى مضمونة أو روتينية.\n• التهور والاندفاع في اتخاذ قرارات مصيرية (استقالة، فركشة، سفر) في لحظة انفعال أو زهق.\n• القابلية العالية لـ \"الإدمان الحسي\" (سهر، شوبينج، أكل، علاقات عابرة، أو تدخين) للهروب من الواقع.\n• كره القيود والمواعيد الصارمة، والتسويف في المهام اللي مفيهاش إثارة.\n• التشتت بين 100 اهتمام وموهبة في نفس الوقت من غير التعمق في حاجة واحدة للآخر.\n• العصبية الحادة والانفجار المفاجئ لو حسيت إن حد بيحاول يفرض سيطرته عليك أو يحاصرك.\n\nثانياً: التحليل العميق للبلوكات الطاقية الأربعة:\nطاقة الرقم (5) عاملة زي \"الرياح العاصفة\" أو \"الزئبق\"؛ لو مفيش ليها مجرى محدد، بتطير كل حاجة في سكتها وبتسيب صاحبها تايه في الهوا:\n\n• البلوك الأول: متلازمة \"العشب الأخضر\" والملل المدمر:\nعقلك مبرمج يدور دايماً على \"الإثارة الجديدة\". أول ما بتبدأ مشروع أو علاقة، بتكون طاير من الحماس، بس بمجرد ما تستقر الأمور وتفهم كل تفاصيلها، عقلك بيبدأ يزهق ويقولك: \"أكيد فيه فرصة أحلى أو مكان أمتع بره!\". البلوك ده بيخليك تسيب دهب في إيدك عشان تجري ورا سراب جديد، وتفضل طول عمرك تبدأ من الصفر. والحقيقة إن الدهب اللي في إيدك، لو اشتغلت عليه، ممكن يبقى كنز. لكن اللي بتسيبه، مش بيرجع.\n\n• البلوك الثاني: فخ \"الإفراط الحسي\" والهروب للمتعة اللحظية:\nلأن الرقم (5) بيحكم الحواس الخمسة، لما بتكون مضغوط أو تايه، البلوك بتاعك بيظهر في إنك \"تفرط في المتع الحسية\" عشان تسكّت صوت القلق اللي جواك. ممكن تضيع فلوسك ووقتك وصحتك في السهر، الأكل، الشراء العشوائي، أو العلاقات المؤقتة، وتصحى تلاقي نفسك استنزفت طاقتك في متعة وهمية مدتها ساعة، وعطلت مستقبلك الحقيقي. والمتعة اللحظية مش هتحل المشكلة، هي بس هتأجلها. والمشكلة المؤجلة، بتكبر.\n\n• البلوك الثالث: التمرد الأعمى وتدمير الذات:\nإنت عندك حساسية مفرطة من كلمة \"أوامر أو قوانين\". أحياناً البلوك بيحصلك لما بتعاند وتكسر القواعد لمجرد العند وإثبات إنك حر، حتى لو القواعد دي في مصلحتك! ممكن تخسر شغل ممتاز أو شريك بيحبك لمجرد إنك حسيت للحظة إنهم \"بيحجموك\"، فتضرب كرسي في الكلوب وتمشي قبل ما تفكر في العواقب. والتمرد مش حرية. التمرد رد فعل. الحرية اختيار. اللي بيعرف يختار، هو الحر.\n\n• البلوك الرابع: غياب الجذور ونقص الصبر:\nإنت عايز النتيجة تحصل \"امبارح\"! مفيش عندك صبر تستنى الزرعة تكبر على مهلها. لو المشروع مجابش فلوس بسرعة، أو الهدف مطلعش سهل، بتزهق وتغير المسار فوراً، وده بيمنعك من جني الثمار الكبيرة اللي بتحتاج وقت ونَفَس طويل. والحقيقة إن أحلى الثمار هي اللي بتاخد وقت. اللي بيتزرع النهاردة، بيتاكل بكرة. اللي بيتزرع كل يوم، بيتاكل كل يوم.\n\nثالثاً: ثلاث خطوات لفك البلوك الطاقي (الروشتة الروحية والذهنية):\n\n• 1. الوعي والإدراك (تعديل البرمجة العقلية):\nاحفظ القاعدة الذهبية دي وحطها قدام عينك: \"أعظم درجات الحرية لا تأتي من الفوضى، بل تأتي من الانضباط الذاتي!\". الشخص اللي مبيتحكمش في شهواته وملله ومزاجه هو في الحقيقة \"عبد\" ليهم مش حر! افهم إن الالتزام بهدف واحد هو اللي هيديك الفلوس والسلطة اللي تخليك تعيش حر بجد طول عمرك. غير طريقتك جوه نفس المشروع بدل ما تهد المشروع كله وتبدأ من أول وجديد.\n\n• 2. السر الباطني والطاقي (تأريض الطاقة الهوائية وتنشيط الجذر):\nفي العلوم الباطنية، صاحب مسار رقم (5) طاقته كلها متركزة فوق (في العقل والحواس - طاقة هوائية ونارية طايرة)، وعنده ضعف في \"شاكرا الجذر\" المسؤولة عن الثبات والاستقرار الأرضي. السر الباطني لفك تشتتك هو \"التأريض\": امشي حافي على رمل أو زرع، العب رياضة بدنية عنيفة تفرغ كهرباء جسمك الزيادة، والتزم بروتين صباحي ثابت حتى لو لمدة نص ساعة؛ أول ما بتربط رجلك بالأرض، عقلك العبقري بيبطل يطير في الهوا وبيبدأ يحول أفكاره لذهب ملموس.\n\n• 3. الصورة الذهنية للتشافي (حط الصورة دي في عقلك دايماً):\nكل ما تحس إنك مخنوق، زهقان، وعايز تسيب كل حاجة في إيدك وتهرب لمكان جديد، غمض عينك لـ 30 ثانية واستحضر الصورة دي:\n\"تخيل إن روحك هي (طائرة ورقية ملونة وجميلة) طايرة في أقصى ارتفاع في السما.. الطيارة دي بتعشق الهوا والانطلاق، بس إيه اللي مخليها عالية ومرفرفة فوق؟ هو (الخيط المتين) اللي رابطها بالأرض! لو الطيارة تمردت وقالت (الخيط ده بيقيدني أنا هقطعه عشان أبقى حرة).. أول ما الخيط هيتقطع، الطيارة مش هتعلى؛ الطيارة هتقع وتتحطم على الأرض! التزامك وقواعدك البسيطة هما الخيط اللي بيحميك ويخليك تطير أعلى، مش القيد اللي بيسجنك.\"\n\nسؤال للتأمل: إيه الحاجة اللي إنت خايف تلتزم بيها لأنك حاسس إنها هتقيدك؟ وإيه اللي كان هيحصل لو جربت تلتزم بيها شهر واحد؟\"البلوكات الطاقية\" هنا تعبير رمزي عن أنماط متكررة، مش حقيقة كونية. الأنماط دي قابلة للتغيير بالوعي والتدريب."},"4":{"title":"القسم الرابع: الشفرة العاطفية، الجواز، وكارما العلاقات","text":"ليه أول ما العلاقة العاطفية تبدأ تاخد شكل رسمي أو روتيني، بتحس بكرشة نفس وخنقة كأن حريتك بتتسرق منك؟\nالحب عند صاحب مسار الحياة رقم (5) هو رحلة استكشاف وشغف متجدد، مش سجن ولا قيود؛ بس الكارما العاطفية الأخطر عندك هي الخلط بين \"الاستقرار\" وبين \"الملل\"، والهروب من المواقف العاطفية التقيلة أول ما تحس إن الطرف التاني بيحاول يمتلكك.\n\nأولاً: ملامح طبيعتك العاطفية (مميزاتك وعيوبك في الحب والجواز):\n\nسماتك كشريك عاطفي (في طاقة النور):\n- شريك ساحر، متجدد، ومستحيل الشريك يحس معاك بلحظة ملل أو روتين كئيب.\n- متفتح جداً، متسامح، ومبتحبش تحكم على شريكك أو تقيده بتحكمات مريضة.\n- شغف عالي جداً، حب للمفاجآت، السفر، وتجربة كل ما هو جديد ومجنون مع شريك حياتك.\n- صديق وحبيب في نفس الوقت؛ بتعرف تسمع وتناقش أي موضوع في الدنيا بمرونة وذكاء.\n- بتدي شريكك إحساس بالحرية، فبيرتاح معاك ويحس إنه مش محبوس.\n\nعيوبك العاطفية (في طاقة الظل):\n- فوبيا الالتزام؛ الخوف الشديد من فقدان الحرية الشخصية بعد الارتباط أو الجواز.\n- الملل العاطفي السريع؛ بمجرد ما بتضمن الطرف التاني وتختفي إثارة البدايات، شغفك بيبدأ يبرد.\n- الهروب من المواجهات العاطفية التقيلة أو النكد؛ بتفضل تختفي أو تغير الموضوع بدل ما تحل المشكلة من جذورها.\n- القابلية للتشتت العاطفي أو تعدد العلاقات في فترات عدم النضج بحثاً عن \"الإثارة الجديدة\".\n- ردود فعل متهورة وقرارات انفصال مفاجئة في لحظة غضب لو حسيت بالحصار أو الغيرة الخانقة.\n\nثانياً: التحليل العميق لشفرة الحب والجواز لمسار رقم (5):\n\n• مواصفات الشريك اللي بيجيبك الأرض (فتى/فتاة أحلامك طاقياً):\nإنت مستحيل تكمل يومين مع شريك تقليدي، شكاك، نكدي، أو بيحب القعدة في البيت والروتين الممل. اللي بيجيبك الأرض هو الشريك \"المثقف، المستقل، والمغامر\" اللي عنده حياة وشغف خاص بيه ومبيبقاش لازق فيك 24 ساعة! بتعشق الشريك اللي يفهم إن \"مساحتك الشخصية خط أحمر\"، اللي يشاركك جنونك وسفرياتك، واللي يقدر يجدد من نفسه وفكره دايماً عشان يفضل يثير فضول عقلك. بس خد بالك: الشريك المستقل ده مش هيستحمل الغياب الدائم. لو مش موجود، هو هيمشي. الحرية اللي بتديها، لازم تكون مصحوبة بحضور.\n\n• البلوك العاطفي وكارما العلاقات (ليه علاقاتك بتتفركش؟):\nاللعنة العاطفية لمسار رقم (5) هي \"إدمان البدايات والهروب من العمق\". إنت بتعشق شرارة البداية، الإعجاب، والغموض؛ بس أول ما العلاقة تدخل في الجد، الفواتير، والمسؤوليات اليومية، بتحس إنك اتسجنت! الكارما بتضربك لما تفضل تبدل في العلاقات أو تهرب من شريك بيحبك بجد لمجرد إنك \"زهقت\"، فتلاقي نفسك بعد سنين لفيت الدنيا كلها بس قلبك لسه فاضي ووحيد مفيش ليه مرسى. والحقيقة إن العمق مش عدو المتعة. العمق هو اللي بيدي المتعة معنى. اللي بيعرف يعمق، بيعرف يستمتع أكتر.\n\n• طبيعتك في الجواز والاستقرار:\nالجواز التقليدي المبني على \"التملك والرقابة والروتين\" هو موت بالبطيء ليك. عشان جوازك ينجح ويعيش العمر كله، لازم يكون جواز على \"الطريقة العصرية الحرة\"؛ يعني بيت مبهج، فيه سفر وتغيير جو مستمر، ومفيش فيه استجوابات (رايح فين وجاي منين كل دقيقة). لو شريكك عطاك الثقة والحرية، إنت بترجعله لحد عنده بكامل إرادتك وبتكون أوفى وأمتع شريك في الكون. والحقيقة إن الثقة مش ضعف، الثقة قوة. اللي بيثق، بياخد أكتر من اللي بيراقب.\n\nثالثاً: خريطة التوافق الطاقي (مين ينورك ومين يطفيك؟):\n\n• أعلى توافق روحي وعاطفي (توأم الشعلة والانسجام):\n  - مع مسار رقم (1) ورقم (3): قمة الحيوية، الانطلاق، والشغف اللي مبيخلصش؛ بتفهموا لغة الحرية، الطموح، وحب الحياة من غير قيود.\n  - مع مسار رقم (5) زيك ورقم (7): مع (5) بتكون مغامرة مجنونة بس محتاجة حد فيكم يمسك الفرامل شوية؛ ومع (7) بيكون فيه احترام رهيب للمساحة الشخصية وحوارات فكرية وفلسفية عميقة جداً.\n\n• علاقات التحدي والصدام (تحتاج وعي وصبر كبير):\n  - مع مسار رقم (2) ورقم (4) ورقم (6): الأرقام دي بتدور على الأمان، الالتصاق العاطفي، البيت التقليدي، والنظام الصارم؛ لو متفاهمتوش، إنت هتحس إنهم \"سجانين بيخنقوك بغيرتهم أو بقوانينهم\"، وهما هيحسوا إنك \"شخص مستهتر وملوش أمان\"!\n\nرابعاً: ثلاث خطوات لفك البلوك العاطفي (روشتة تشافي القلب):\n\n• 1. الوعي والإدراك العاطفي:\nاحفظ القاعدة دي في قلبك: \"التجديد الحقيقي مش إنك تغير الشريك كل ما تزهق، التجديد الحقيقي هو إنك تكتشف عوالم جديدة مع نفس الشريك!\". افهم إن الهدوء اللي بيجي بعد فترة من العلاقة مش معناه إن الحب مات، ده معناه إن الحب اتحول لـ \"أمان وسكن\". بدل ما تهرب لما تحس بالملل، خد إيد شريكك واكسروا الروتين سوا بسفرية أو تجربة جديدة.\n\n• 2. السر الباطني والطاقي (توازن شاكرا العجز والقلب):\nفي العلوم الباطنية، مسار رقم (5) عنده نشاط مفرط في \"شاكرا العجز\" (مركز المتعة الحسية والشغف اللحظي) مقابل خوف في \"شاكرا القلب\" من التعلق والألم. السر الباطني لتشافي علاقاتك هو \"الارتقاء من المتعة الحسية إلى الاتصال الروحي\": لما تبطل تشوف العلاقات كـ \"مصدر إثارة وتسلية\" وتبدأ تشوفها كـ \"رحلة نمو روحي\"، خوفك من الالتزام هيتبخر وهتلاقي الحرية الحقيقية جوه حضن شريكك مش براه.\n\n• 3. الصورة الذهنية لتشافي العلاقات (حط الصورة دي في عقلك دايماً):\n\"تخيل إنك مش (طائر بري خايف يدخل القفص) فيتحبس للأبد.. تخيل إن علاقتك الناجحة هي (مرسى وسفينة في وسط المحيط). إنت القبطان اللي بيحب يبحر ويستكشف جزر الدنيا كلها، بس أي سفينة في العالم مهما كانت حرة، لو ملهاش (ميناء آمن ودافئ) ترجع ترمي الهلب بتاعها فيه وقت العواصف عشان ترتاح وتتشحن، هتغرق في نص البحر! شريك حياتك هو الميناء الآمن اللي بيديك القوة تبحر، مش السجن اللي بيمنعك من السفر.\"\n\nسؤال للتأمل: في آخر علاقة، إنت كنت عايز الحرية، ولا كنت خايف من القرب؟ وإيه اللي كان هيفرق؟"},"5":{"title":"القسم الخامس: مغناطيس المال، الوفرة، والمهنة","text":"ليه أحياناً بتلقط فرص دهب تجيبلك فلوس كتير في وقت قياسي، وفجأة تلاقي نفسك خسرت كل حاجة أو رجعت للصفر بسبب قرار متهور؟\nرزق صاحب مسار الحياة رقم (5) مربوط بـ \"الحركة، السفر، التنوع، واقتناص الفرص السريعة\". إنت تموت لو قعدت على مكتب روتيني بتقبض ملاليم آخر الشهر؛ بس البلوك المالي الأخطر عندك هو المقامرة غير المحسوبة، وترك المشاريع الناجحة في نص الطريق عشان زهقت من إدارتها.\n\nأولاً: ملامح طبيعتك المادية والمهنية (مميزاتك وعيوبك في الفلوس والشغل):\n\nسماتك المالية والمهنية (في طاقة النور):\n- رادار فطري لاقتناص الفرص والتريندات الجديدة قبل ما الناس تسمع عنها أصلاً.\n- قدرة رهيبة على تعدد مصادر الدخل (تقدر تشتغل في 3 أو 4 حاجات مختلفة في نفس الوقت وتنجح فيهم).\n- لباقة دبلوماسية ومهارة بيع وإقناع وتفاوض تخليك تقفل أصعب الصفقات بابتسامة.\n- شجاعة في المخاطرة وعدم الخوف من تغيير الكارير أو البدء من جديد في أي مكان في العالم.\n\nعيوبك المالية والمهنية (في طاقة الظل):\n- القفز من مهنة لمهنة ومن مشروع لمشروع قبل ما تحصد الثمرة الكبيرة (عدم الاستقرار المهني).\n- التهور المالي والميل للمقامرة أو الدخول في استثمارات عالية المخاطر طمعاً في المكسب السريع.\n- كره شديد للروتين والالتزام بمواعيد الحضور والانصراف، والتمرد على المديرين المتسلطين.\n- الصرف باندفاع على السفر، التجارب، المتع اللحظية، والترفيه من غير حساب لبكرة.\n\nثانياً: التحليل العميق لشفرة المال والمهنة لمسار رقم (5):\n\n• إزاي الفلوس بتجيلك؟ (شفرة الرزق والوفرة):\nفلوسك وبركتك مربوطة بـ \"الحرية، الحركة، التواصل، والتجديد المستمر\". طاقة الرقم (5) محكومة بعطارد (كوكب التجارة والذكاء والحركة). الفلوس بتجري وراك لما تشتغل في بيئة متغيرة مفيهاش يوم شبه التاني، ولما تعتمد على \"دماغك، علاقاتك، وحركتك السريعة\" مش على قعدتك في مكان ثابت. إنت مخلوق للعمل الحر، البيزنس الذكي، والتجارة اللي عابرة للحدود.\n\n• البلوك المالي والتعطيل (إيه اللي بيبوظ عليك الفلوس؟):\nاللعنة المالية عندك اسمها \"إدمان الأدرينالين المالي والملل من الإدارة\". إنت بتحب \"نشوة الصيد\" (إنك تجيب الفكرة وتعمل أول صفقة)، بس أول ما المشروع ينجح ويحتاج متابعة يومية وإدارة روتينية، بتزهق وتهمله فيقع! بلوك تاني قاتل هو \"استعجال الثراء\"؛ ممكن تحط تحويشة عمرك في صفقة مشبوهة أو مضاربة سريعة غير مدروسة عشان تكسب بسرعة، فتخسر كل حاجة في غمضة عين. والحقيقة إن الفلوس اللي بتيجي بسرعة، بتروح بسرعة. الفلوس اللي بتيجي بصبر، بتفضل.\n\n• المجالات الأنسب لتحقيق الثروة:\nالتجارة الإلكترونية والاستيراد والتصدير، السياحة والطيران والسفر، التسويق الرقمي والمبيعات، الإعلام والصحافة وصناعة المحتوى، التداول والبورصة (بشرط الدراسة الصارمة للتحكم في الاندفاع)، العلاقات العامة وتنظيم الفعاليات، والعمل الحر عن بُعد.\n\nثالثاً: ثلاث خطوات لفك البلوك المالي (روشتة جذب الثروة):\n\n• 1. الوعي والإدراك المالي:\nاحفظ القاعدة الذهبية دي: \"الحرية المالية الحقيقية بتتبني من استثمارات ثابتة، مش من ضربات حظ متقطعة!\". استغل عبقريتك في صيد الفرص وكسب الفلوس السريعة، بس خد جزء ثابت من أرباحك دي وحطه في \"أصول جامدة\" (عقار، دهب، أو ودائع مقفولة متقدرش تمد إيدك عليها وقت التهور) عشان تأمن ظهرك مهما اتقلبت بيك الأيام.\n\n• 2. السر الباطني والطاقي (ترويض طاقة عطارد وأورانوس المالية):\nطاقة الرقم (5) في الفلوس عاملة زي \"البرق\"؛ سريعة جداً وقوية بس بتختفي في ثانية. السر الباطني لجذب الوفرة المستدامة لمسارك هو \"خلق التنوع داخل إطار واحد\": بدل ما تهد شغلك كل سنة وتبدأ من الصفر، اختار مجال واحد كبير (زي التسويق أو التجارة مثلاً) وغير جواه المنتجات والعملاء والطرق براحتك؛ كده هتشبع رغبة عقلك في التجديد، وفي نفس الوقت هتبني خبرة وثروة تراكمية تكبر كل سنة.\n\n• 3. الصورة الذهنية لجذب الثروة (حط الصورة دي في عقلك دايماً):\n\"تخيل إنك (صياد لؤلؤ ماهر) معاك مركب سريع في وسط المحيط.. الصياد الشاطر بيستخدم سرعة مركبه عشان يروح لأماكن جديدة محدش وصلها ويصطاد أغلى اللآلئ، بس أول ما بيطلع اللؤلؤة، مبيسبهاش على ظهر المركب تضيع مع الموج؛ بيحطها في (خزنة حديد مقفولة) في بطن المركب! خليك حر وسريع في صيد الفرص.. بس خليك حريص وثابت في حفظ غنيمتك.\"\n\nسؤال للتأمل: إيه الفرصة اللي إنت سبتهل ومشيت؟ وإيه اللي كان ممكن يحصل لو كنت كملت؟\"شفرة الرزق\" و\"جذب الثروة\" هنا لغة رمزية للتأمل في عاداتك المالية، مش وعد بثراء مضمون. القرارات المالية الكبيرة محتاجة دراسة ومتخصصين."},"6":{"title":"القسم السادس: خطوات عملية تفرق معاك","text":"إزاي تعيش حر ومنطلق وتجرب كل حاجة في الدنيا، من غير ما تلاقي نفسك في الآخر تايه ومشتت ومعملتش حاجة ثابتة لنفسك؟\nالتشافي لصاحب مسار رقم (5) مش معناه إنك تقص جناحاتك وتقعد في قفص، التشافي معناه إنك تتعلم \"فن الطيران الموجه\"؛ تعرف إمتى تنطلق، وإمتى تهدي السرعة وترمي الهلب عشان متتحرقش من كتر الجري.\n\nالروشتة العملية الفورية لتغيير حياتك (3 خطوات للتطبيق المباشر):\n\n• 1. خطوة \"فرملة الـ 24 ساعة\" (علاج القرارات المتهورة):\n  - إزاي تعملها: لما تجيلك لحظة زهق مفاجئة أو عصبية وتلاقي نفسك عايز تاخد قرار مجنون (تقدم استقالتك، تفركش علاقة، تقفل مشروع، أو تصرف مبلغ كبير)، الزم نفسك بـ \"قانون التجميد لمدة 24 ساعة\". قول لنفسك: \"أنا حر وهنفذ القرار ده، بس بعد 24 ساعة بالظبط\". نام واصحى وخد دش بارد قبل ما تنطق بحرف أو تاخد خطوة.\n  - النتيجة: 90% من الكوارث اللي بتندم عليها في حياتك بتحصل في لحظة اندفاع؛ الفرملة دي هتحمي مستقبلك وعلاقاتك من قرارات \"الهروب اللحظي\"، وهتخليك تتصرف بحكمة مش بنزوة.\n\n• 2. خطوة \"صيام الدوبامين وتفريغ الكهرباء\" (علاج التشتت والإدمان الحسي):\n  - إزاي تعملها: لأن عقلك وحواسك شغالين بأقصى سرعة طول الوقت، إنت محتاج \"تأريض\" يومي. خصص كل يوم 30 دقيقة لـ \"الرياضة الحركية أو المشي السريع في الهوا الطلق من غير موبايل\" عشان تفرغ شحنة القلق والزهق اللي في جسمك. وحدد يوم في الأسبوع تقلل فيه المشتتات (سوشيال ميديا، سهر، منبهات) عشان ترجع حساسية عقلك للتركيز في الأهداف الكبيرة.\n  - النتيجة: هتتخلص من الأرق والتوتر العصبي، وهتحس بصفاء ذهني يخليك تنجز في ساعتين اللي كنت بتتشتت فيه أسبوع كامل.\n\n• 3. خطوة \"التغيير الذكي داخل الإطار\" (قتل الملل من غير هدم):\n  - إزاي تعملها: بدل ما تهد شغلك أو علاقتك لما تحس بالملل، طبق قاعدة \"تغيير الديكور مش هدم البيت\". زهقت من الشغل؟ غير مكان قعدتك، اشتغل من كافيه جديد، أو اتعلم مهارة جديدة جوه نفس مجالك. زهقت من روتين العلاقة؟ اخطف شريكك في خروجة مفاجئة لمكان مروحتهوش قبل كده.\n  - النتيجة: هتدي عقلك جرعة \"التجديد والإثارة\" اللي بيحتاجها عشان يفضل منور، وفي نفس الوقت هتحافظ على استقرارك وبنائك التراكمي من غير ما ترجع لنقطة الصفر.\n\nسؤال للتأمل: إيه أصغر خطوة من التلاتة دي تقدر تبدأ بيها بكرة الصبح؟"},"7":{"title":"القسم السابع: جرح الطفولة، الدين الكارمي، وعلاقتك بالأطفال","text":"ليه عندك حساسية مفرطة من إن حد يأمرك أو يسألك \"رايح فين وجاي منين\"، وبتحس إن أي التزام هو سجن هيخنق روحك؟\nتمردك الشرس وعشقك المفرط للحرية مجاش من فراغ؛ ده رد فعل عكسي بناه \"طفلك الداخلي\" بسبب بيئة كانت إما خانقة ومليانة أوامر، أو مليانة فوضى وعدم استقرار.. زائد إن مسار رقم (5) بيحمل واحداً من أخطر الديون الكارمية (كارما إساءة استخدام الحرية والحواس).\n\nأولاً: جرح الطفولة والطفل الداخلي:\nأغلب أصحاب مسار الحياة رقم (5) عاشوا طفولة شكلت جرحهم الأساسي في اتجاه من اتجاهين عكس بعض، بس نتيجتهم واحدة:\n\n• سجن الرقابة والتحكم الأبوي: في طفولتك، غالباً اتعرضت لسلطة أبوية أو بيئة صارمة جداً كانت بتعد عليك أنفاسك، بتفرض عليك قيود مشددة، ومبتسمحلكش تجرب أو تختار لنفسك. الكبت ده خلى \"طفلك الداخلي\" ياخد عهد سري على نفسه: (أول ما هكبر وأملك قراري، مستحيل أسمح لمخلوق يتحكم فيا أو يقيدني تاني أبداً!). عشان كده أي التزام عادي النهاردة بيفكر طفلك الداخلي بالسجن القديم فبيهرب فوراً. والحقيقة إنك دلوقتي كبير، ومحدش بيقيدك. اللي بيفكرك بالسجن، هو خوفك القديم، مش الواقع الجديد.\n\n• التشتت وعدم الاستقرار المبكر: أو العكس، إنك عشت في بيئة طفولة مليانة تنقلات، تغييرات مفاجئة، أو غياب للنظام والأمان الثابت؛ فاتبرمج عقلك على إن \"الاستقرار وهم ومبيكملش\"، وبقيت بتهرب وتفركش الحاجة الحلوة بإيدك قبل ما هي تضيع منك وتوجعك! والحقيقة إن الاستقرار مش وهم، هو قرار. اللي بيختار يستقر، بيلاقي الاستقرار.\n\nثانياً: الدين الكارمي لمسار (5) - (كارما الفوضى وإدمان الحواس - 14/5):\nفي علم الأرقام الكارمي، الرقم (5) (وخصوصاً لو جاي من يوم ميلاد 14 أو مجموع 14) يحمل واحداً من أشهر الديون الكارمية الأربعة الكبرى، وهو \"كارما إساءة استخدام الحرية والانغماس في الشهوات\".\n\n• رسالة الكارما بتاعتك: في الماضي (أو في حيوات سابقة)، روحك استخدمت الحرية بشكل أناني؛ إما بالهروب من المسؤوليات وترك الآخرين يشيلوا الليلة لوحدهم، أو بالانغماس المفرط في ملذات الحواس الخمسة (أكل، شرب، شهوات، مقامرة، وكسل). الكون بعتك في المسار ده عشان تتعلم الدرس الأصعب: \"الاعتدال والاتزان وسط الإغراءات\". الكارما هنا بتختبرك بتقلبات مفاجئة في الحياة تجبرك تتأقلم، ومش بتفتحلك خزائن النجاح المستقر إلا لما تثبت إنك بقيت سيد على شهواتك ومزاجك، وإن حريتك مابقتش تأذي حد ولا تدمر التزاماتك.\n\nثالثاً: علاقتك بالأطفال والتربية (أنت كأب / أم):\n\n• مميزاتك في التربية: إنت أروع وأروش أب/أم ممكن طفل يتمناه! مبتتعاملش مع ولادك بعقلية \"السيطرة والأوامر القديمة\"، بل بتصاحبهم وبتفتح عيونهم على الدنيا. بتشجعهم يجربوا، يسافروا، يعتمدوا على نفسهم، ويفكروا بحرية. بيتك معاهم مليان مغامرات، خروج، وحوارات متفتحة تخليهم مبيخافوش يحكولك أي حاجة.\n\n• عيوبك في التربية (احذر منها): لأنك بتكره القيود والروتين، ممكن تقع في فخ \"الفوضى التربوية وغياب النظام\"؛ تلاقي مفيش مواعيد ثابتة للنوم أو المذاكرة، وكل يوم بقرار ومزاج مختلف. وأحياناً لما بتحس إن مسؤولية العيال وتفاصيلهم اليومية المملة بقت \"بتكتفك وتمنعك من حريتك\"، ممكن تتعصب عليهم فجأة أو تهرب وتسيب المسؤولية كلها على الطرف التاني!\n\n• نصيحة ذهبية: حب ولادك بطريقتك المنطلقة وافتحلهم آفاق الدنيا، بس افتكر إن الطفل عشان يطلع سوي ومطمن بيحتاج \"روتين ثابت وقواعد واضحة\". اديهم الحرية في التفكير والتجربة، بس اديهم الثبات والأمان في المواعيد والالتزام والوجود المستمر جنبهم.\n\nسؤال للتأمل: إيه الحاجة اللي كنت محتاج تسمعها وإنت صغير، ولسه محتاج تسمعها النهاردة؟"}},"6":{"1":{"title":"القسم الأول: شفرة الروح والجوهر","text":"(لمن مجموع تاريخ ميلاده الكامل يختزل إلى الرقم 6، أو وُلد يوم 6، 15، 24)\n\nالمعنى العاطفي والنفسي / طاقة القراءة (جوهر روحك الحقيقي):\n\nلو مسار حياتك هو الرقم (6)، فاعرف إنك جيت الدنيا دي شايل في قلبك \"طاقة الأمومة/الأبوة الكونية، الاحتواء، وصناعة الجمال\". روحك متبرمجة على الحب، الرعاية، وتحمل مسؤولية اللي حواليك. إنت القلب الدافي اللي الكل بيهرب ليه لما الدنيا تقسى، وجوهرك بيتكون من التفاصيل دي:\n\n• المعالج الفطري وعمود العيلة: من وإنت صغير، عندك إحساس فطري بالمسؤولية تجاه أهلك، صحابك، وأي حد ضعيف أو محتاج مساعدة. إنت الشخص اللي بيلمّ الشمل، بيطبطب، وبيرمم القلوب المكسورة. راحتك النفسية مبتكملش غير لما تطمن إن كل الناس اللي بتحبهم مبسوطين، شبعانين، وفي أمان. بس خد بالك: الرعاية دي مش مسؤوليتك وحدك. الناس اللي بتحبهم ليهم مسؤولية على نفسهم، وإنت مش مطالب تحمل عنهم. اللي بيحب، بيدي مساحة، مش بيشيل بدل.\n\n• عاشق للجمال والتناغم: عينك فنانة بترفض القبح والعشوائية! عندك ذوق عالي جداً في اللبس، الديكور، الأكل، والألوان. بتحب تعيش في بيئة راقية، هادية، وريحتها حلوة؛ وأي مكان بتدخله لازم تسيب فيه لمسة جمال وترتيب تفتح النفس. والجمال ده مش رفاهية عندك، هو حاجة في عصبك. المكان القبيح بيتعبك نفسياً، والمكان الجميل بيريحك. بس خد بالك: الجمال الخارجي مش كل حاجة. الجمال الداخلي هو اللي بيدوم، والباقي بيتغير.\n\n• قدسية البيت والارتباط العاطفي: إنت مخلوق عشان تحِب وتتْحَب! فكرة إنك تعيش لوحدك من غير شريك حياة أو أسرة دافية هي فكرة مرعبة بالنسبة لك. الحب والبيت عندك مش مجرد كماليات، دول الأكسجين اللي بتتنفسه عشان تقدر تنجح وتنتج في أي مجال تاني في حياتك. بس خد بالك: الحب مش ملكية. الحب اختيار يومي. اللي بيحبك، بيختارك كل يوم، مش بيمسكك.\n\n• جوهر طاقتك في الوضع الإيجابي (طاقة النور): لما بتكون في قمة اتزانك، بتكون رمز الحنان، الكرم، والوفاء المطلق. بتبني بيت يشبه الجنة على الأرض، وبتكون شريك حياة مثالي، وصديق جدع بيشيل صحابه في الأزمات، ومبدع في أي شغلانة فيها فن أو خدمة للناس. في الحالة دي، إنت زي الشمس اللي بتنور وتدفي كل اللي حواليك، مش بس بتدي، لكن بتخلي الناس تحس إنهم محبوبين.\n\n• جوهر طاقتك في الوضع السلبي (طاقة الظل والانحراف): لما طاقتك بتستنزف أو بتفقد توازنك، حنانك الزيادة ده بيتقلب لـ \"تحكم خانق، وصاية على الناس، ولعب دور الضحية الشهيدة\"! بتلاقي نفسك بتتدخل في تفاصيل حياة اللي حواليك غصب عنهم بحجة \"إنك خايف على مصلحتهم\"، وبتدّي حب وتضحيات محدش طلبها منك، ولما متلاقيش المقابل اللي في خيالك، بتقلب الدنيا نكد وعتاب وتعيش في دور المظلوم اللي محدش مقدر تضحياته! والحقيقة إن العطاء اللي بيستنى مقابل، مش عطاء، ده تبادل تجاري. العطاء الحقيقي هو اللي بيدي من غير ما يستنى حاجة.\n\nسؤال للتأمل: إمتى آخر مرة عملت حاجة لنفسك من غير ما تحس بذنب؟ وإيه اللي بيمنعك تكررها؟"},"2":{"title":"القسم الثاني: المراية المزدوجة","text":"في مسار الحياة رقم (6)، إنت لابس قناع \"المنقذ الحنون والأم/الأب المثالي لكل الناس\"، والفرق بين الصورة الدافية اللي الناس بتشوفها فيك وبين الوجع السري اللي جواك بيخلق صراع نفسي كبير:\n\n• إزاي الناس بتشوفك من بره (القناع الخارجي والهالة):\nالناس بتشوفك \"الملاك الحارس\"، الشخص الطيب، الجدع، المريح نفسياً، واللي قلبه مفتوح للكل 24 ساعة! هالتك الخارجية بتدي انطباع بالدفء، الكرم، الأناقة، والاتزان العاطفي. في عيونهم، إنت الشخص اللي بيعرف يحل أي مشكلة عائلية، اللي بيته دايماً مفتوح، واللي عمره ما يرفض طلب لحد محتاجه. ولأنك دايماً بتطبطب على الكل وبتظهر بصورة الشخص المتماسك المعطاء، الناس بتتعامل معاك على إنك \"بئر حنان مبيخلصش\"، ومبيجيش في بالهم أبداً إن البئر ده ممكن ينشف أو يكون هو نفسه عطشان لقطرة اهتمام!\n\n• إيه اللي بيدور جواك فعلاً (حقيقتك وصراعك الداخلي السري - متلازمة المنقذ المنهك):\nالحقيقة اللي محدش بيشوفها ورا ابتسامتك الدافية هي إنك من جوه بتعاني من \"عقدة المثالية المفرطة وجلد الذات\"، وبتحس أحياناً بمرارة شديدة وخذلان لأنك \"بتدّي 100% ومبتاخدش غير 10%\"! إنت شايل هموم ناس كتير فوق كتافك لدرجة إنك ساعات بتنسى إنت مين وعايز إيه لنفسك أصلاً. جواك ناقد داخلي قاسي جداً بيحاسبك بالورقة والقلم لو قصرت في حق حد، وفي نفس الوقت جواك طفل مجروح بيموت ونفسه حد يحس بيه من غير ما يطلب، ويقوله: \"ارتاح إنت النهاردة، أنا اللي هشيل عنك وأهتم بيك\". بس مين اللي هيقولك الكلام ده وإنت اللي دايمًا اللي بتقوله لغيره؟ عشان كده لازم تسمعه لنفسك الأول.\n\n• السر النفسي في تعاملك مع الضغوط والصدمات:\nلما بتتعرض لصدمة عاطفية أو خذلان من حد ضحيت عشانه، إنت مبتعرفش تبقى أناني وتشتري دماغك؛ بالعكس، بتدخل في دايرة \"العتاب الصامت، القلق المرضي، أو الهروب في رعاية غيرك\"! ممكن تلاقي نفسك بتنظف البيت بهوس، أو بتطبخ، أو بتغرق نفسك في حل مشاكل شخص تاني خالص عشان تهرب من مواجهة جرحك إنت. ولو الكيل طفح بيك، بتتحول فجأة من \"الملاك الحنون\" لشخص قاسي جداً، لسانه بيحدف كلام يقطم الظهر في العتاب، وبتقفل باب قلبك بالضبة والمفتاح. والانفجار ده مش شر، ده إشارة إنك كتمت كتير أوي. الحل مش إنك تكتم أقل، الحل إنك تعبر أول بأول.\n\nسؤال للتأمل: إمتى آخر مرة قلت لحد \"أنا محتاج مساعدة\" أو \"أنا تعبان\" من غير ما تحس إنك ضيف تقيل؟"},"3":{"title":"القسم الثالث: البلوكات الخفية ونقاط التعطيل","text":"ليه كل ما تضحي وتقدم روّحك للناس على طبق من دهب، بتلاقيهم في الآخر بيتمردوا عليك، أو يركبوا فوق كتافك ومحدش يقدّر تعبك؟\nأكبر بلوك طاقي بتطارد صاحب مسار الحياة رقم (6) وبتوقف حاله هو \"عقدة المنقذ الشهيد، التدخل المفرط، وهوس المثالية\". إنت بتدمر سلامك النفسي وعلاقاتك في اللحظة اللي بتخلط فيها بين \"الحب والاحتواء\" وبين \"الوصاية والتحكم في حياة اللي بتحبهم\".\n\nأولاً: أنماط التعطيل والعيوب الخفية لمسار رقم (6) في نقاط سريعة:\n\n• التضحية المفرطة على حساب صحتك، وقتك، وأحلامك الشخصية لحد ما تتحرق وتفضى.\n• التدخل في شؤون الغير وفرض الوصاية عليهم تحت شعار \"أنا عارف مصلحتك أكتر منك!\".\n• هوس المثالية؛ مستحيل ترضى عن نفسك أو عن اللي حواليك بسهولة، ودايماً شايف النواقص.\n• لعب دور \"الضحية الشهيدة\" وقت الخلاف، واستخدام الابتزاز العاطفي بالذنب (\"بعد كل اللي عملته عشانكم تعملوا فيا كده؟\").\n• القلق المرضي المستمر على الأهل، الشريك، والأولاد، وتوقع الكوارث قبل ما تحصل.\n• صعوبة تقبل النقد، والشعور بالإهانة الشخصية لو حد رفض نصيحتك أو مساعدتك.\n\nثانياً: التحليل العميق للبلوكات الطاقية الأربعة:\nطاقة الرقم (6) عاملة زي \"حضن الأم الدافي\"؛ بس الحضن ده لو قفل بزيادة وبقى ناشف، بيتحول لقفص يخنق اللي جواه ويهدّ حيل صاحبه:\n\n• البلوك الأول: متلازمة \"المنقذ الكوني\" وسرقة كارما الآخرين:\nإنت عندك غريزة فطرية إنك لما تشوف حد واقع في مشكلة، تجري تشيله على كتفك وتحلها له بالكامل! البلوك الخطير هنا إنك لما بتشيل مسؤولية غيرك، إنت في الحقيقة \"بتسرق منه درسه الكارمي وبتعلمه الاتكالية والكسل\". النتيجة إن الناس اللي حواليها بتتحول لكائنات اعتمادية بترمي حملها عليك، وأول ما تتعب وتقول \"مش قادر\"، بيتهموك بالتقصير والندالة بدلاً من إنهم يشكروك! والحقيقة إن اللي بيساعد الناس إنهم يقفوا على رجليهم، مش إنه يشيلهم. اللي بيشيل حد طول عمره، بيمنعه من المشي.\n\n• البلوك الثاني: فخ \"السيطرة الناعمة\" والتدخل المفرط:\nمن كتر خوفك على اللي بتحبهم، بتبقى عايز ترسم لهم حياتهم بالورقة والقلم (ياكلوا إيه، يلبسوا إيه، يصاحبوا مين، ويشتغلوا إزاي). لما هما بيعترضوا عشان يعيشوا بشخصيتهم، بتزعل وتحس إنهم مبيحبوكش. البلوك ده بيخلي أقرب الناس ليك يهربوا منك أو يخبوا عليك تفاصيل حياتهم عشان يتجنبوا \"محاضراتك ونصايحك الإجبارية\". والحقيقة إن الحب اللي بيخنق، مش حب. الحب اللي بيخنق، خوف. والخوف مش بيبني، الخوف بيهد.\n\n• البلوك الثالث: لعنة \"المثالية المستحيلة\" وتأجيل النجاح:\nسواء في شغلك أو في بيتك، عينك دايماً بتجيب \"الغلط والنقص\" قبل الصح! لو بتعمل مشروع، ممكن تأجل إطلاقه شهور وسنين لأنك حاسس إنه \"لسه مش مثالي 100%\". هوس الكمال ده بيعملك شلل في الإنتاجية، وبيخليك عايش في حالة سخط داخلي مستمر لأن الواقع عمره ما بيكون بنفس الصورة الوردية المرسومة في خيالك. والحقيقة إن المثالي مش موجود. اللي بيدور على المثالي، بيفضل يدور طول عمره. اللي بيرضى بالكفاية، بيعيش.\n\n• البلوك الرابع: الإدمان على التقدير الخارجي والشعور بالذنب:\nإنت رابط قيمتك الذاتية بـ \"قد إيه الناس محتاجالي وبتشكر فيا\". عشان كده بتحس بذنب مرعب لو قولت \"لأ\" أو لو خصصت وقت وفلوس لرفاهيتك الشخصية لوحدك، وكأن إسعاد نفسك جريمة في حق اللي حواليك! والحقيقة إن قيمتك مش في خدمتك للناس، قيمتك فيك إنت. اللي بيحبك، بيحبك عشان إنت، مش عشان اللي بتعمله.\n\nثالثاً: ثلاث خطوات لفك البلوك الطاقي (الروشتة الروحية والذهنية):\n\n• 1. الوعي والإدراك (تعديل البرمجة العقلية):\nاحفظ القاعدة الذهبية دي وعلقها قدام عينك: \"مساعدة الناس واجب جميل، لكن إنقاذهم على حساب تدمير نفسك هو انتحار بطيء!\". افهم إن كل إنسان جه الدنيا دي عشان يتعلم من أخطائه ويشيل شيلته؛ لما إنت بتشيل عنه كل حاجة، إنت بتضره مبتنفعهوش. اتعلم تساعد بـ \"الإرشاد والدعم المعنوي\" مش بأنك تقوم بالدور مكانه، واتعلم تقبل الناس والدنيا بعيوبهم ونواقصهم من غير ما تحاول تصلح الكون كله لوحدك.\n\n• 2. السر الباطني والطاقي (توازن شاكرا القلب وفك التعلق المرضي):\nفي العلوم الباطنية، مسار الرقم (6) محكوم بـ \"شاكرا القلب\". البلوك بيحصلك لما شاكرا القلب بتتضخم في اتجاه \"العطاء المشروط\"؛ يعني بتدي طاقة حب رهيبة بس مربوطة بـ \"حبل طاقي خفي\" مستني مقابل (طاعة، تقدير، أو رد جميل). السر الباطني لفك تعطيلك هو \"التوازن بين الأخذ والعطاء\": درب نفسك تستقبل حب، تطلب مساعدة لما تتعب، وتفصل الأحبال الطاقية الخانقة عن أولادك وشريكك وتسيبهم في حفظ الله مش في حفظ قلقك إنت!\n\n• 3. الصورة الذهنية للتشافي (حط الصورة دي في عقلك دايماً):\nكل ما تلاقي نفسك محروق عشان تحل مشكلة لحد، أو متضايق عشان شخص مسمعش كلامك ونصيحتك، غمض عينك لـ 30 ثانية واستحضر الصورة دي:\n\"تخيل إنك (بستاني حكيم في حديقة ورد). البستاني الشاطر بيسقي الزرع، يحط له سماد، وينضف الأرض حواليه.. بس هل البستاني بيشد الوردة بإيده كل يوم عشان يطولها غصب عنها؟ لأ طبعاً، لو شدها هيقطعها ويموتها! هو بيعمل اللي عليه، وبعدين يقف بعيد ويسيب الوردة تكبر بسرعتها هي وتواجه الشمس والهوا لوحدها. قدم الحب والرعاية.. وبعدين ارجع خطوة لورا وسيب كل روح تخوض تجربتها وتنضج بطريقتها.\"\n\nسؤال للتأمل: إيه الحاجة اللي إنت شايلها لوحدك وممكن تسيبها لحد تاني يشاركك فيها؟ وإيه اللي بيمنعك؟\"البلوكات الطاقية\" هنا تعبير رمزي عن أنماط متكررة، مش حقيقة كونية. الأنماط دي قابلة للتغيير بالوعي والتدريب."},"4":{"title":"القسم الرابع: الشفرة العاطفية، الجواز، وكارما العلاقات","text":"ليه رغم إنك أكتر شريك مخلص، حنين، وبتفرش الأرض ورد للي بتحبه، بتلاقي شريكك ساعات بيهرب منك أو بيتهمك إنك \"بتخنقه\"؟\nالحب عند صاحب مسار الحياة رقم (6) هو عبادة مقدسة وبيت دافي وأمان، وإنت مستعد تضحي بعمرك كله عشان شريكك يكون مبسوط؛ بس الكارما العاطفية الأخطر عندك هي إنك بتتحول من \"حبيب\" لـ \"أب أو أم\" لشريك حياتك، وبتحاصره باهتمامك الزيادة لحد ما يزهق أو يتمرد.\n\nأولاً: ملامح طبيعتك العاطفية (مميزاتك وعيوبك في الحب والجواز):\n\nسماتك كشريك عاطفي (في طاقة النور):\n- قمة الرومانسية، الدفء، والاحتواء؛ حضنك هو الملجأ الآمن اللي بيمسح أي وجع أو تعب عند شريكك.\n- إخلاص ووفاء أسطوري؛ لما بتحب بجد، مفيش مخلوق تاني في الكون بيملا عينك غير شريكك.\n- بتعشق تفاصيل البيت والأسرة، وبتعرف تخلق جو عائلي مبهج، شيك، ومليان حب واستقرار.\n- داعم من الطراز الأول؛ بتقف في ضهر شريكك في أزماته المادية والنفسية لحد ما يقف على رجله.\n\nعيوبك العاطفية (في طاقة الظل):\n- الرعاية الخانقة؛ بتعامل شريكك كأنه طفل صغير محتاج توجيه ووصاية في كل خطوة.\n- الغيرة الشديدة وحب التملك؛ بتبقى عايز تكون إنت محور الكون الوحيد في حياة شريكك.\n- توقعات خيالية ومثالية مفرطة؛ بترسم صورة \"فارس أحلام أو أميرة خالية من العيوب\"، ولما بتتصدم بعيوب الواقع، بتحبط وتنكد على نفسك وعليه.\n- جذب الشركاء \"المكسورين أو المستغلين\" عشان تلعب معاهم دور المصلح والمنقذ.\n- العتاب القاسي واللوم المستمر لو حسيت إن شريكك مش بيبادلك نفس درجة التضحية والاهتمام بالمللي.\n\nثانياً: التحليل العميق لشفرة الحب والجواز لمسار رقم (6):\n\n• مواصفات الشريك اللي بيجيبك الأرض (فتى/فتاة أحلامك طاقياً):\nإنت مستحيل تعيش مع شخص بارد عاطفياً، أناني، أو بيستهزأ بقيمة العيلة والبيت. اللي بيجيبك الأرض هو الشريك \"الدافئ، الرومانسي، والمقدّر للجمال والعشرة\"؛ الشخص اللي يعرف يقولك كلمة حلوة من قلبه، اللي يلاحظ تعبك ويشكرك عليه من غير ما تطلب، واللي يشاركك حلم بناء أسرة مترابطة وبيت مستقر. بس خد بالك: الشريك ده مش هيفضل يستحمل الجفاف العاطفي للأبد. لو مش عبرت عن حبك، ممكن يحس إنه مش محبوب، حتى لو إنت بتحبه بجد.\n\n• البلوك العاطفي وكارما العلاقات (ليه قلبك بيتوجع في الحب؟):\nاللعنة العاطفية لمسار رقم (6) اسمها \"متلازمة إصلاح المكسورين\"! لأنك معالج بطبعك، لا شعورياً بتنجذب للأشخاص اللي عندهم عقد نفسية، مشاكل مادية، أو ظروف صعبة، وتقول لنفسك: \"أنا هحبه وهصلحه بحناني!\". وتفضل تديله من روحك وفلوسك وصحتك لحد ما يقف على رجله، وفي الآخر يسيبك ويمشي أو يتمرد عليك لأنك كنت بتعامله كـ \"مريض أو ابن\" مش كـ \"حبيب وندّ\"!\n\n• طبيعتك في الجواز والاستقرار:\nإنت مخلوق للجواز! العزوبية الطويلة بتطفي نورك وبتخليك حاسس إن حياتك ناقصة. في الجواز، إنت العمود الفقري للبيت؛ بس عشان جوازك يعيش في سعادة، لازم تبطل تلعب دور \"المدير العام والمصلح الاجتماعي\" جوه غرفة النوم، وتفتكر إن شريك حياتك محتاج منك \"حبيب وعشيق متدلع\" أكتر ما محتاج أم أو أب يملي عليه تعليمات! والحقيقة إن الجواز شراكة، مش وصاية. الشريك اللي بيحبك، بيحبك عشان إنت، مش عشان بتدير حياته.\n\nثالثاً: خريطة التوافق الطاقي (مين ينورك ومين يطفيك؟):\n\n• أعلى توافق روحي وعاطفي (توأم الشعلة والانسجام):\n  - مع مسار رقم (2) ورقم (6) زيك: قمة التناغم، الرومانسية، والدفء العاطفي؛ بتفهموا لغة المشاعر والاحتواء من نظرة عين، وبتبنوا بيت مثالي.\n  - مع مسار رقم (4) ورقم (8): توافق ممتاز لبناء إمبراطورية أسرية ومادية مستقرة؛ هما بيوفروا القوة والحماية والأمان المادي، وإنت بتوفر الحب والجمال والروح الدافية للبيت.\n  - مع مسار رقم (9): انسجام روحي وإنساني عميق جداً مبني على العطاء والرحمة والوعي العالي.\n\n• علاقات التحدي والصدام (تحتاج وعي وصبر كبير):\n  - مع مسار رقم (5) ورقم (7): رقم (5) بيعشق الحرية والانطلاق وبيترعب من اهتمامك الزيادة وغيرتك، ورقم (7) بيميل للعزلة والغموض وبرود المشاعر الظاهري؛ لو معرفتش تديهم مساحتهم وتبطل تحاصرهم، هتتعب معاهم جداً.\n\nرابعاً: ثلاث خطوات لفك البلوك العاطفي (روشتة تشافي القلب):\n\n• 1. الوعي والإدراك العاطفي:\nاحفظ القاعدة الذهبية دي: \"أنت شريك حياة ولست مصحة نفسية!\". بطل تدخل علاقات بنية \"الإنقاذ والإصلاح\"؛ اختار شريك ناضج، سوي، وجاهز يديك حب زي ما بتديله، مش شخص محتاج اللي يربيه من أول وجديد. وافهم إن الحب الحقيقي بيحتاج \"مساحة تنفس\"؛ كل ما فكيت قبضة خوفك وسيطرتك عن شريكك، كل ما جالك هو برجليه مشتاق لحضنك.\n\n• 2. السر الباطني والطاقي (استعادة طاقة الأنوثة/الذكورة المقدسة في شاكرا القلب والعجز):\nفي العلوم الباطنية، لما صاحب مسار رقم (6) بيلعب دور \"الأم أو الأب\" لشريك حياته، هو بيقتل \"القطبية الجنسية والجاذبية العاطفية\" في العلاقة! السر الباطني لتجديد شغفك العاطفي هو \"التخلي عن دور الراعي والعودة لدور المعشوق\": دلع نفسك، اهتم بجمالك وجاذبيتك، واطلب من شريكك يدلعك ويشيل عنك، بدل ما تكون إنت اللي شايل الليلة كلها لوحدك.\n\n• 3. الصورة الذهنية لتشافي العلاقات (حط الصورة دي في عقلك دايماً):\n\"تخيل إن الحب في إيدك هو (عصفور جميل وغالي جداً). لو من كتر خوفك عليه وحبك ليه قفلت إيدك عليه جامد عشان ميطيرش.. إنت في الحقيقة هتفعصه وتموته جوه إيدك! لكن لو فردت كف إيدك بحنان وحطيت فيه الحب والأمان وسيبت إيدك مفتوحة.. العصفور هيطير يلف لفته، ويرجع يقف على كف إيدك لوحده لأنه لقى فيها الدفء والحرية سوا. حب بوعي.. واحضن من غير ما تخنق.\"\n\nسؤال للتأمل: في آخر علاقة، إنت كنت بتحب، ولا كنت بتحاول تصلح؟ وإيه اللي كان هيفرق؟"},"5":{"title":"القسم الخامس: مغناطيس المال، الوفرة، والمهنة","text":"ليه رغم إن إيدك مبروكة في أي شغل تمسكه، بتلاقي نفسك أحياناً بتشتغل بـ \"بلاش\" أو بتتكسف تطلب حق تعبك من الناس؟\nرزق صاحب مسار الحياة رقم (6) مربوط بطاقة كوكب الزهرة؛ يعني مربوط بـ \"الجمال، الرعاية، التشافي، وخدمة الناس بضمير\". الفلوس بتحبك وبتجيلك لما تشتغل بقلبك، بس البلوك المالي الأكبر عندك هو خلط العواطف بالبيزنس، والصرف المفرط على الأهل والمظاهر الحلوة.\n\nأولاً: ملامح طبيعتك المادية والمهنية (مميزاتك وعيوبك في الفلوس والشغل):\n\nسماتك المالية والمهنية (في طاقة النور):\n- ضمير مهني حي وأمانة عالية تخلي العملاء أو المديرين يثقوا فيك ثقة عمياء.\n- حس فني وذوق راقٍ جداً يخليك تبدع في أي مجال يخص الجمال، التصميم، أو الرفاهية.\n- قدرة فطرية على خلق بيئة عمل دافية ومريحة (الكل بيحب يشتغل معاك أو تحت إدارتك).\n- مغناطيس للرزق العائلي؛ كل ما بتصرف على بيتك وأهلك بحب، ربنا بيفتحلك أبواب رزق أوسع.\n\nعيوبك المالية والمهنية (في طاقة الظل):\n- \"الكسوف المالي\" وتبخيس قيمة شغلك؛ بتستحرم تطلب أرقام كبيرة في مقابل خدماتك أو بتعمل خصومات تيجي على حساب مكسبك.\n- خلط الشغل بالعواطف؛ بتشيل شغل زمايلك مجاملة، أو بتدخل شراكات مع قرايب وصحاب فتخسر فلوسك عشان متزعلهمش.\n- الصرف الباذخ على الرفاهيات، الديكور، اللبس الشيك، الأكل الحلو، وهدايا الناس.\n- هوس المثالية المهني اللي بيخليك تاخد وقت طويل جداً في تنفيذ المهام عشان تطلع \"كاملة\"، فبتعطل حركة البيع والإنتاج.\n\nثانياً: التحليل العميق لشفرة المال والمهنة لمسار رقم (6):\n\n• إزاي الفلوس بتجيلك؟ (شفرة الرزق والوفرة):\nفلوسك وبركتك مربوطة بـ \"تحسين حياة الناس، إضافة الجمال للكون، وتقديم الرعاية الحقيقية\". إنت مستحيل تنجح أو تكسب في بيئة عمل شرسة مبنية على الخداع أو القسوة أو المنافسة غير الشريفة. الفلوس بتجري وراك لما تشتغل في مجال فيه \"روح وإنسانية وجمال\"؛ العملاء بيجولك إنت بالذات وبيسيبوا غيرك لأنهم بيحسوا معاك بالأمان، الاحتواء، والاهتمام بالتفاصيل.\n\n• البلوك المالي والتعطيل (إيه اللي بيبوظ عليك الفلوس؟):\nاللعنة المالية عندك اسمها \"عقدة المعالج الفقير والاستنزاف العائلي\". عندك قناعة خفية غلط في عقلك الباطن بتقول إن \"الناس الطيبة والروحانية مينفعش تطلب فلوس كتير\"! فبتلاقي نفسك بتدي استشارات أو خدمات أو مجهود جبار ببلاش أو بملاليم. والبلوك التاني هو إنك بتلعب دور \"البنك المركزي للعيلة\"؛ أي حد يتزنق في عيلتك أو صحابك يجري يستلف منك وميرجعش الفلوس، وإنت تتكسف تطالب بحقك فتتحمل ديون غيرك!\n\n• المجالات الأنسب لتحقيق الثروة:\nمجالات الطب والتمريض والعلاج النفسي والتشافي الطاقي (الكوتشينج والاستشارات الأسرية والعاطفية)، التصميم الداخلي والديكور، الموضة والأزياء والتجميل، الفنون والموسيقى، التعليم والتدريس، إدارة المطاعم والفنادق والكافيهات الراقية، والموارد البشرية والعمل الخيري أو المجتمعي.\n\nثالثاً: ثلاث خطوات لفك البلوك المالي (روشتة جذب الثروة):\n\n• 1. الوعي والإدراك المالي:\nاحفظ القاعدة الذهبية دي وكررها كل يوم: \"طلب حقي المادي كاملاً لا ينقص من طيبتي، بل يمنحني القوة لأساعد نفسي وغيري!\". افصل تماماً بين \"الصدقة والعمل التطوعي\" وبين \"الشغل والبيزنس\". في شغلك، حط تسعيرة عادلة تليق بجودة وإخلاص تعبك، ومتعملش خصم لحد لمجرد الكسوف. كل ما احترمت قيمة وقتك، كل ما الكون والناس احترموا قيمتك ودفعولك وهما مبسوطين.\n\n• 2. السر الباطني والطاقي (تفعيل طاقة كوكب الزهرة لاستقبال الوفرة):\nفي العلوم الفلكية والباطنية، كوكب الزهرة (حاكم رقم 6) مش بس كوكب الحب؛ ده كوكب \"الجاذبية المالية، الذهب، والنعيم المادي\". الزهرة مابتجريش ورا الفلوس؛ الزهرة بتقعد في مكانها متزينة ومقدرة لذاتها، فالفلوس هي اللي بتجري وراها! السر الباطني لثروتك هو \"رفع الاستحقاق الذاتي\": بطل تحس بالذنب لما تشتري حاجة غالية لنفسك، ونضف طاقتك من \"الناس الجاحدة\" اللي بتستنزف فلوسك، وهتلاقي طاقة الزهرة بتفتحلك خزائن الرزق بسهولة ويسر.\n\n• 3. الصورة الذهنية لجذب الثروة (حط الصورة دي في عقلك دايماً):\n\"تخيل إن طاقتك وموهبتك هي (شجرة فاكهة نادرة وجميلة جداً). عشان الشجرة دي تفضل تطرح فاكهة مسكرة وتأكل الناس كل سنة، صاحب البستان لازم يشتري لها (أغلى سماد، ويرويها بمية نضيفة، ويبني حواليها سور يحميها من اللي بيقطفوا ثمارها ويرموها على الأرض). الفلوس اللي بتاخدها مقابل شغلك هي المية والسماد والسور اللي بيحمي شجرتك من الجفاف.. خد حقك كامل، عشان تفضل مثمر ومنور العمر كله.\"\n\nسؤال للتأمل: إيه الخدمة اللي إنت بتقدمها للناس ببلاش أو بأقل من قيمتها؟ وإيه اللي بيمنعك تحط سعر عادل؟\"شفرة الرزق\" و\"جذب الثروة\" هنا لغة رمزية للتأمل في عاداتك المالية، مش وعد بثراء مضمون. القرارات المالية الكبيرة محتاجة دراسة ومتخصصين."},"6":{"title":"القسم السادس: خطوات عملية تفرق معاك","text":"إزاي تبطل تشيل هموم الكوكب كله فوق كتافك، وتتعلم تقول \"لأ\" وتشتري راحتك النفسية من غير ما ضميرك يأنبك؟\nالتشافي لصاحب مسار رقم (6) مش معناه إنك تقفل قلبك أو تبقى قاسي، التشافي معناه إنك تدرك إنك \"بني آدم ليك طاقة محدودة مش ملاك\"، وإن أول شخص أولى بحنانك ورعايتك على وش الأرض هو (إنت).\n\nالروشتة العملية الفورية لتغيير حياتك (3 خطوات للتطبيق المباشر):\n\n• 1. خطوة \"ممنوع التدخل بدون طلب صريح\" (علاج عقدة المنقذ):\n  - إزاي تعملها: خد عهد صارم على نفسك من النهاردة: \"مش هقدم نصيحة، ولا مساعدة، ولا هحل مشكلة لأي مخلوق إلا لو طلب مني ده بلسانه صراحةً!\". لو شفت حد بتحبه بيعك في حياته أو واقع في أزمة ومطلبش تدخلك، امسك لسانك وإيدك، وادعيله من بعيد وسيبه يتعلم درسه لوحده.\n  - النتيجة: هتوفر 80% من طاقتك المهدرة، وهتحمي نفسك من جحود الناس اللي كانت بتقلب عليك الترابيزة وتقولك \"ومين قالك تدخل؟\"، وهتجبر اللي حواليك ينضجوا ويشيلوا مسؤوليتهم.\n\n• 2. خطوة \"ساعة الأنانية المقدسة\" (علاج جلد الذات والاستنزاف):\n  - إزاي تعملها: خصص كل يوم ساعة واحدة على الأقل (أو يوم في الأسبوع) اسمها \"وقت الملك/الملكة\". في الوقت ده، اقفل تليفونك عن طلبات البيت والشغل والناس، واعمل حاجة تدلع بيها حواسك إنت وبس (جلسة مساج، حمام دافي بروائح عطرية، قعدة في مكان راقي لوحدك، أو شراء هدية لنفسك) من غير ما تجيب حاجة لحد معاك!\n  - النتيجة: هتكسر برمجة \"الشعور بالذنب عند الاستمتاع\"، وهتملا كوبايتك الفاضية عشان تقدر تدي اللي حواليك من الفائض بتاعك مش من لحمك الحي وأعصابك.\n\n• 3. خطوة \"قاعدة الـ 80% كفاية جداً\" (علاج هوس المثالية):\n  - إزاي تعملها: لما تيجي تعمل أي شغل أو ترتب بيتك أو تتعامل مع شريكك، ارضى بنسبة نجاح 80% بس، وبطل تدور على الـ 20% الناقصة! كل ما عقلك يطلعلك عيب في نفسك أو في اللي قدامك، قول بصوت مسموع: \"الحمد لله، كده جميل وكفاية أوي، والكمال لله وحده\".\n  - النتيجة: هترتاح من الصداع النصفي والقلق المستمر، وهتعيش في سلام وتصالح مع نفسك ومع عيوب الناس، وهتلاقي إنتاجيتك وسعادتك تضاعفوا لأنك بطلت تعقد الأمور.\n\nسؤال للتأمل: إيه أصغر خطوة من التلاتة دي تقدر تبدأ بيها بكرة الصبح؟"},"7":{"title":"القسم السابع: جرح الطفولة، الدين الكارمي، وعلاقتك بالأطفال","text":"ليه من وإنت طفل صغير حسيت إنك \"المصلح الاجتماعي والطبيب النفسي\" بتاع البيت، وإنك لازم ترضي الكل عشان تتحب؟\nخوفك المرعب من رفض الناس ليك، وإدمانك على التضحية وإنقاذ اللي حواليك، جذورهم مدفونة في جرح طفولة اتسرقت منك فيها براءتك عشان تشيل هموم الكبار.. زائد إن مسار رقم (6) بيحمل \"دين كارمي\" يخص التعلق المرضي، التدخل في أقدار الآخرين، ونسيان الذات.\n\nأولاً: جرح الطفولة والطفل الداخلي:\nأغلب أصحاب مسار الحياة رقم (6) اتولدوا في بيئة أسرية خلتهم ينضجوا عاطفياً بدري أوي عن سنهم، وجرحهم الأساسي بيتمثل في نقطتين:\n\n• لعب دور \"الإسفنجة العاطفية وحمامة السلام\": في طفولتك، غالباً عشت في بيت فيه توترات أسرية، خلافات بين الأب والأم، أو ظروف خلتك تلعب دور \"المعالج الصغير\" اللي بيطبطب على الأم الزعلانة، أو بيصلح الجو في البيت عشان المشاكل تهدى. طفلك الداخلي اتبرمج على معادلة خطيرة: (أنا ماليش قيمة ولا هكون في أمان غير لو خليت كل اللي حواليا مبسوطين ومرتاحين، حتى لو على حساب وجعي أنا!).\n\n• جرح \"الحب المشروط بالطيبة والطاعة\": اتعلمت وإنت صغير إنك لما تكون \"الولد المؤدب المطيع اللي مبيقولش لأ وبيخدم الكل\" بتاخد سقف وسكر وحب، ولما بتعترض أو تطلب حاجة لنفسك بتتسمى \"أناني أو عاق\". الجرح ده خلاك كبرت وإنت بترتعب من كلمة \"لأ\" وبتموت عشان ترضي الناس على حساب روحك. والحقيقة إنك كنت طفل محتاج حب، مش خادم محتاج تقييم. الحب مش مكافأة، الحب حق.\n\nثانياً: الدين الكارمي لمسار (6) - (كارما الوصاية والتعلق المرضي):\nفي علم الأرقام الكارمي، الرقم (6) (وخصوصاً لو جاي من مجموع 15 أو 24) بيحمل كارما دقيقة جداً تخص \"المسؤولية الأسرية، التعلق العاطفي، والتدخل في حرية الإرادة\".\n\n• رسالة الكارما بتاعتك: في الماضي (أو في حيوات سابقة)، إما إنك هربت من مسؤولياتك العائلية وتخليت عن ناس كانوا في رقبتك، فجيت الحياة دي عشان تسدد الدين بإنك تشيل مسؤولية الكل؛ أو العكس، إنك كنت شخص بيتحكم في مصائر اللي حواليه تحت ستار الحب والحماية. الكون بعتك في المسار ده عشان تتعلم الدرس الأصعب: \"الحب الحقيقي هو الحب الحر غير المشروط، مش الامتلاك ولا الوصاية!\". الكارما بتفضل تبتليك بـ \"جحود وتمرد\" أقرب الناس ليك لحد ما تتعلم ترفع إيدك عن التحكم في حياتهم، وتحب نفسك بنفس القدر اللي بتحبهم بيه.\n\nثالثاً: علاقتك بالأطفال والتربية (أنت كأب / أم):\n\n• مميزاتك في التربية: إنت حرفياً \"أعظم وأحن أب/أم في دائرة الأرقام كلها\"! أولادك هما روحك وعينك اللي بتشوف بيها الدنيا. بتغمرهم بحنان، دفا، ورعاية مفيش زيها، وبتعمل المستحيل عشان توفرلهم بيت جميل، أكل صحي، وتعليم راقي. إنت الأب/الأم اللي ولاده بيجروا يترموا في حضنه لما الدنيا تزعلهم لأنهم واثقين في حبك اللا محدود.\n\n• عيوبك في التربية (احذر منها): آفتك الكبرى في التربية هي \"الحماية المفرطة والخنق بالحب\"! من كتر خوفك عليهم، مبترضاش تسيبهم يغلطوا أو يواجهوا صعوبات الدنيا لوحدهم، وبتبقى عايز تختارلهم صحابهم، لبسهم، وكليتهم، وبتحسسهم بالذنب لو خالفوا رأيك. ده يا إما بيطلع طفل \"اعتمادي وضعيف الشخصية\" مبيعرفش يتصرف من غيرك، يا إما طفل \"متمرد بيهرب من حصارك\"!\n\n• نصيحة ذهبية: افتكر دايماً مقولة جبران خليل جبران: \"أولادكم ليسوا لكم، أولادكم أبناء الحياة\". اديهم كل الحنان والأمان اللي في قلبك، بس فك الحبل شوية، وسيبهم يقعوا ويقوموا ويتعلموا من تجاربهم عشان يطلعوا أقوياء يقدروا يشيلوا نفسهم لما يكبروا!\n\nسؤال للتأمل: إيه الحاجة اللي كنت محتاج تسمعها وإنت صغير، ولسه محتاج تسمعها النهاردة؟"}},"7":{"1":{"title":"القسم الأول: شفرة الروح والجوهر","text":"(لمن مجموع تاريخ ميلاده الكامل يختزل إلى الرقم 7، أو وُلد يوم 7، 16، 25)\n\nالمعنى العاطفي والنفسي / طاقة القراءة (جوهر روحك الحقيقي):\n\nلو مسار حياتك هو الرقم (7)، فاعرف إنك مختلف جذرياً عن كل الناس اللي حواليك؛ إنت \"الروح القديمة\" اللي جت الدنيا دي في مهمة خاصة جداً: \"البحث عن الحقيقة، كشف المستور، وفهم أسرار الكون والنفس البشرية\". إنت مستحيل تقتنع بالقشور أو الكلام السطحي اللي بيضحكوا بيه على الناس، وجوهرك بيتكون من التفاصيل دي:\n\n• عقل تحليلي خارق وحدس لا يخطئ (الحاسة السادسة): إنت عندك تركيبة نادرة جداً بتجمع بين حاجتين عكس بعض: \"عقل عالم وباحث\" بيفصص كل كلمة وكل موقف بالميكروسكوب ومبيصدقش حاجة من غير دليل، وفي نفس الوقت \"قلب شيخ أو عراف روحاني\" بيحس بالكدب والخيانة والطاقات الخفية قبل ما تحصل! مستحيل حد يقدر يغفلك أو يمثل عليك دور الضحية لأنك بتكشف اللي ورا الأقنعة من أول نظرة. بس خد بالك: الحدس ده مش دايماً دقيق 100%. أحياناً بيبقى خوفك هو اللي بيتكلم، مش حدسك. اتعلم تفرق بين الإحساس الهادي اللي بيجي من القلب، والوسواس اللي بييجي من العقل.\n\n• عشق العزلة المقدسة والهدوء: الزحمة، الصوت العالي، والنفاق الاجتماعي والحوارات التافهة بتستنزف روحك وبتفرغ بطاريتك! إنت بتلاقي راحتك وسعادتك القصوى لما تقفل بابك عليك، وتغوص في عالمك الخاص (قراءة، تأمل، بحث في الماورائيات، أو تفكير عميق). خلوّتك بنفسك مش \"توحّد\"، دي المصنع اللي بتشحن فيه طاقتك وحكمتك. بس خد بالك: العزلة لو زادت عن حدها، بتبقى سجن. اللي بيعرف يرجع من العزلة للعالم، هو اللي بيستفيد من حكمته.\n\n• الانتقائية الشديدة والغموض الجذاب: إنت كتاب مقفول بـ 7 أقفال؛ الكل يعرف عنك معلومات عامة، بس مفيش غير شخص أو اتنين بالكتير في الكوكب كله اللي شافوا روحك الحقيقية من جوه. مبتدخلش حد دايرتك الخاصة بسهولة، وبتختار صحابك وشريك حياتك بالملقاط. والغموض ده مش تكبر، ده حماية. إنت بتفتح قلبك بالتدريج، وده صح. بس خد بالك: لو مقفلت الباب خالص، محدش هيقدر يدخل، حتى اللي يستاهل.\n\n• جوهر طاقتك في الوضع الإيجابي (طاقة النور): لما بتكون في قمة اتزانك، بتكون الحكيم، المفكر العبقري، الخبير اللي محدش يشق له غبار في مجاله، والمعالج الروحي اللي بيهدي الحيرانين بنور بصيرته وعلمه العميق. في الحالة دي، إنت زي المنارة اللي بتنور في الضلمة، وبتوجه التايهين لبر الأمان.\n\n• جوهر طاقتك في الوضع السلبي (طاقة الظل والانحراف): لما طاقتك بتضلم أو بتفقد توازنك، بتتحول لشخص \"بارد عاطفياً، شكاك لدرجة الوسواس، متشائم، ومنعزل تماماً عن الواقع\"! بتغرق في التفكير المفرط اللي بيجيبلك صداع وأرق، وبتقفل قلبك بالضبة والمفتاح، وبتبص للناس من برج عاجي بغرور فكري كأن مفيش حد فاهم حاجة غيرك! والحقيقة إن الغرور الفكري هو أوحش أنواع الغرور، لأنه بيعزلك عن الناس اللي إنت محتاجهم.\n\nسؤال للتأمل: إمتى آخر مرة شاركت حكمة أو فكرة عميقة مع حد، وإمتى آخر مرة كتمتها؟ وإيه اللي كان هيفرق؟"},"2":{"title":"القسم الثاني: المراية المزدوجة","text":"في مسار الحياة رقم (7)، إنت لابس قناع \"الفيلسوف الغامض والحكيم الهادي\"، والفرق بين البرود الظاهري اللي الناس بتشوفه فيك وبين البركان الفكري والروحي اللي شغال جواك قصة كبيرة:\n\n• إزاي الناس بتشوفك من بره (القناع الخارجي والهالة):\nالناس بتشوفك \"شخصية غامضة جداً، تقيلة، ومهيبة\"! هالتك الخارجية بتدي انطباع بالهدوء العميق، الرزانة، الذكاء الحاد، والاستغناء التام عن البشر. في عيونهم، إنت الشخص اللي كلامه قليل بس بحساب، اللي نظراته بتخرق اللي قدامه كأنه بيقرا أفكاره، واللي مستحيل حد يعرف هو بيفكر في إيه أو حاسس بإيه. ولأنك بتحب العزلة ومبتندمجش في التجمعات السطحية بسهولة، كتير من الناس بيغلطوا في فهمك وبيشوفوك شخص \"مغرور، متكبر، بارد عاطفياً، أو معقد نفسياً ومبيعرفش يفرح زي الناس\"!\n\n• إيه اللي بيدور جواك فعلاً (حقيقتك وصراعك الداخلي السري - متلازمة الغريب الفضائي):\nالحقيقة اللي مخبيها ورا قناع البرود والهدوء ده هي إنك من جوه \"إنسان حساس لأقصى درجة، وعقلك مطحنة مبتقفش عن التفكير والأسئلة ثانية واحدة\"! إنت مش مغرور ولا كاره للناس؛ إنت بس حاسس طول عمرك إنك \"كائن فضائي نزل على كوكب غلط\"! بتحس بغربة روحية عميقة وسط الناس لأن اهتماماتهم السطحية مبتشبعش روحك، ونفسك تلاقي شخص واحد بس يفهم عمقك من غير ما تضطر تشرح نفسك. جواك خوف سري مرعب من \"الخذلان، الكدب، وإن حد يستغفلك أو يكشف نقطة ضعفك\"، وعشان كده بتلبس درع البرود كخط دفاع أول تحمي بيه قلبك الرقيق من قسوة وزيف العالم. والحقيقة إن الدرع ده بيحميك من الجرح، بس بيمنعك من القرب. القرب محتاج شجاعة، والشجاعة إنك تفتح قلبك رغم الخوف.\n\n• السر النفسي في تعاملك مع الضغوط والصدمات:\nلما بتتعرض لصدمة أو خيانة أو وجع نفسي، إنت مبتعيطش في حضن حد ولا بتشتكي لمخلوق؛ رد فعلك التلقائي هو \"الانسحاب التام والاختفاء في كهفك السري\"! بتقفل تليفونك، تقطع اتصالك بالعالم، وتقعد لوحدك في الضلمة تحلل اللي حصل بالميكروسكوب حتة حتة عشان تفهم \"ليه وإزاي ده حصل؟\". وبتحول وجعك لـ \"حكمة صامتة\"، ولما بتخرج من كهفك تاني، بتكون شطبت الشخص اللي أذاك من وجودك للأبد بهدوء قاتل ومن غير ولا كلمة عتاب واحدة! والانسحاب ده مش قوة، ده حماية. الحماية اللي بتحميك من الوجع، بس بتمنعك من الشفاء. الشفاء محتاج إنك تحكي، وتعبر، وتطلب دعم.\n\nسؤال للتأمل: إمتى آخر مرة سمحت لحد يشوف دموعك أو يسمع وجعك؟ وإيه اللي بيمنعك؟"},"3":{"title":"القسم الثالث: البلوكات الخفية ونقاط التعطيل","text":"ليه رغم إنك أذكى وأعمق واحد في قعدتك، بتلاقي نفسك ساعات محبوس جوه دماغك، وفرص كتير بتطير من إيدك بسبب كتر التفكير والشك؟\nأكبر بلوك طاقي بتطارد صاحب مسار الحياة رقم (7) وبتوقف حاله هو \"شلل التحليل المفرط، الشك الوسواسي، والهروب من الواقع للعزلة\". إنت بتدمر فرصك السعيدة بإيدك لما بتخلي عقلك يشتغل كـ \"محقق جنائي\" بيدور على العيب والخدعة في كل حاجة حلوة بتجيلك.\n\nأولاً: أنماط التعطيل والعيوب الخفية لمسار رقم (7) في نقاط سريعة:\n\n• التفكير المفرط اللي بيسببلك أرق بالليل وصداع مستمر وبيشل حركتك.\n• الشك المبالغ فيه في نوايا الناس، وتوقع الغدر والخيانة قبل ما تحصل.\n• الهروب من مواجهة المشاكل المادية أو العاطفية بالتقوقع في \"كهف العزلة\" وقطع الاتصال بالعالم.\n• البرود العاطفي الظاهري وصعوبة التعبير عن المشاعر بالكلام (بتعقلن المشاعر بدل ما تحسها).\n• الغرور الفكري الخفي؛ الإحساس بإنك أوعى من الكل وإن الناس سطحيين وميستاهلوش مجهودك.\n• التشاؤم الخفي والسخرية اللاذعة لما بتفقد الثقة في اللي حواليك.\n\nثانياً: التحليل العميق للبلوكات الطاقية الأربعة:\nطاقة الرقم (7) عاملة زي \"المحيط العميق\"؛ مليان كنوز ولآلئ في القاع، بس لو غرقت في ضلمته تحت ومطلعتش تتنفس هوا وشمس، هتنقطع عن الحياة:\n\n• البلوك الأول: شلل التحليل المفرط ومطحنة العقل:\nعقلك مبيقفلش! قبل ما تاخد أي خطوة في شغل أو جواز أو مشروع، بتقعد تحسب 1000 سيناريو، وتفصص كل تفصيلة، وتدور على الثغرات المحتملة. النتيجة؟ على ما بتخلص تحليل ودراسة، بتكون الفرصة طارت، والناس الأقل منك ذكاءً خدوا الخطوة ونجحوا وإنت لسه قاعد مكانك بتفكر! والحقيقة إن مفيش قرار في الدنيا مضمون 100%. اللي بياخد قرار، بيتعلم. اللي بيفضل يفكر، بيفضل مكانه.\n\n• البلوك الثاني: جدار الشك وفوبيا الخذلان:\nلأن حدسك قوي وبتلقط كدب الناس بسرعة، عقلك الباطن بنى \"قاعدة دفاعية\" بتقول: (الكل خاين وكداب لحد ما يثبت العكس). البلوك ده بيخليك تقفل قلبك، وتختبر الناس اختبارات مستحيلة، وتطفّش الفرص والعلاقات الحقيقية لأنك خايف تسلم فتتوجع أو تطلع \"مغفل\". والحقيقة إن الثقة مش ضعف، الثقة شجاعة. الشجاعة إنك تسلم قلبك لحد، وإنت عارف إنه ممكن يجرحك، بس بتختار تثق. اللي بيثق، بيعيش. اللي بيشك، بيعزل نفسه.\n\n• البلوك الثالث: الإدمان على العزلة والانفصال عن الواقع المادي:\nإنت بتستمتع بوحدتك لدرجة الإدمان! البلوك بيحصل لما العزلة تتحول من \"خلوة للتأمل والشحن\" لـ \"مخبأ للهروب من مسؤوليات الدنيا\". بتلاقي نفسك عايش في عالم الأفكار، الروحانيات، أو الخيال، وهامل جسمك، فلوسك، وعلاقاتك الاجتماعية لحد ما تلاقي نفسك وحيد وغريب في الواقع. والحقيقة إن الروحانيات مش بديل عن الحياة. الروحانيات هي اللي بتخليك تعيش الحياة أحسن. اللي بيهرب من الحياة باسم الروحانيات، مش روحاني، هو خايف.\n\n• البلوك الرابع: كبت المشاعر وتحويلها لأمراض جسدية:\nإنت بتعتبر البكاء أو الشكوى \"ضعف وإهانة لكرامتك وعقلك\". فلما بتتوجع، بتبلع الزلط وتسكت وتكتم جواك. الكبت ده بيتحول في جسمك لبلوكات صحية صريحة: قولون عصبي، صداع نصفي، أوجاع في المعدة، أو إرهاق غامض ملوش سبب طبي واضح. والحقيقة إن جسمك مش ماكينة. لما بتتعب، بتتكلم. اتعلم تسمع جسمك قبل ما يصرخ.\n\nثالثاً: ثلاث خطوات لفك البلوك الطاقي (الروشتة الروحية والذهنية):\n\n• 1. الوعي والإدراك (تعديل البرمجة العقلية):\nاحفظ القاعدة الذهبية دي وحطها قدام عينك: \"العقل أداة رائعة للبحث، لكنه سيد فاشل لو حكم حياتك لوحده!\". مش كل حاجة في الدنيا بتتحل بالمنطق والورقة والقلم؛ الحب، الرزق، والسعادة بيحتاجوا \"قفزة ثقة\" وتجربة حية مش بس تنظير من بعيد. درب نفسك تقفل زرار التحليل لما تيجي تعيش لحظة حلوة، واسمح لنفسك تكون \"إنسان عادي بيغلط ويجرب\" مش لازم تكون الحكيم اللي عارف كل حاجة طول الوقت.\n\n• 2. السر الباطني والطاقي (توازن شاكرا التاج والعين الثالثة مع شاكرا الجذر):\nفي العلوم الباطنية، صاحب مسار رقم (7) طاقته كلها مسحوبة لفوق في \"شاكرا العين الثالثة والتاج\" (الحدس، الفكر، والاتصال الروحي)، وده بيخلي عنده فراغ تحت في \"شاكرا الجذر والقلب\". السر الباطني لفك تعطيلك هو \"إنزال السماء إلى الأرض\": متكتفيش بإنك تقرا وتفهم الأسرار؛ انزل طبق العلم ده في مشروع مادي يجيبلك فلوس، وافتح شاكرا القلب بالتسامح مع ضعف البشر، واربط رجلك بالأرض بالحركة والرياضة والاندماج الواعي مع الناس.\n\n• 3. الصورة الذهنية للتشافي (حط الصورة دي في عقلك دايماً):\nكل ما تلاقي عقلك سحبك لدوامة الوساوس والشك، ولقيت نفسك عايز تقفل بابك وتنعزل عن الكون كله، غمض عينك لـ 30 ثانية واستحضر الصورة دي:\n\"تخيل إنك مش (راهب محبوس في كهف مظلم فوق جبل تلج) خايف ينزل للناس ليتلوث.. تخيل إنك (منارة عالية ومضيئة على شط البحر). المنارة واقفة شامخة لوحدها في هدوء، بس نورها مش محبوس جواها؛ نورها بيتمد لبعيد عشان ينور السفن التايهة في الضلمة ويرشدها لبر الأمان! عزلتك وحكمتك قيمتهم الحقيقية بتظهر لما تنور بيهم العالم وتشاركهم مع الناس، مش لما تدفنهم جوه كهفك.\"\n\nسؤال للتأمل: إيه الحكمة اللي إنت شايلها جواك ومشاركتهاش مع حد؟ وإيه اللي بيمنعك؟\"البلوكات الطاقية\" هنا تعبير رمزي عن أنماط متكررة، مش حقيقة كونية. الأنماط دي قابلة للتغيير بالوعي والتدريب."},"4":{"title":"القسم الرابع: الشفرة العاطفية، الجواز، وكارما العلاقات","text":"ليه كل ما حد يقرب منك زيادة عن اللزوم وتدخل العلاقة في الجد، بتحس برغبة غريزة في الهروب والانعزال؟\nالحب عند صاحب مسار الحياة رقم (7) هو رحلة بحث عن \"توأم الروح الفكري والروحي\"، مش مجرد جواز تقليدي وونس عابر؛ بس الكارما العاطفية الأخطر عندك هي البرود الظاهري، صعوبة التعبير عن المشاعر، ووضع الشريك تحت \"مجهر الشك\" لحد ما يطفش.\n\nأولاً: ملامح طبيعتك العاطفية (مميزاتك وعيوبك في الحب والجواز):\n\nسماتك كشريك عاطفي (في طاقة النور):\n- إخلاص مطلق، وفاء عميق، وشريك مستحيل يخون أو يلعب بديله لأن المبادئ والأخلاق عندك خط أحمر.\n- بتوفر لشريكك أمان فكري ونفسي نادر؛ بتفهم مشاكله بعمق وبتديله نصائح حكيمة تخليه يحل أي أزمة.\n- بتحترم مساحة شريكك الشخصية جداً ومبتحبش تخنقه أو تراقبه لأنك بتعشق حريتك وبتفهم حرية غيرك.\n- عشقك حقيقي وصادق؛ لما بتفتح باب قلبك لحد بجد، بتبقيله السكن والملاذ والوطن الآمن.\n\nعيوبك العاطفية (في طاقة الظل):\n- البرود الظاهري والتحفظ العاطفي؛ بتستخسر الكلمة الحلوة أو بتعتبر إن \"الفعل كفاية\" ومش لازم تقعد تعبر بمشاعر ورومانسية طول الوقت.\n- الهروب السريع واختفاؤك المفاجئ أول ما تحس بضغط عاطفي أو نكد مستمر من الشريك.\n- الشك الدائم واختبار نوايا الشريك؛ مابتسلمش دُغري، وبتقعد تراقب وتفسر كل حركة كأنك مباحث!\n- الصمت العقابي الطويل وقت الخناق؛ لما بتزعل، بتقفل على نفسك بابك وتتحول لـ \"تمثال تلج\" مبيناطقش بحرف ولا بيقبل النقاش.\n\nثانياً: التحليل العميق لشفرة الحب والجواز لمسار رقم (7):\n\n• مواصفات الشريك اللي بيجيبك الأرض (فتى/فتاة أحلامك طاقياً):\nإنت مستحيل تكمل يومين مع شخص تافه، صوت عالي، شكاك، أو بيحب النميمة والدراما والروتين! اللي بيجيبك الأرض هو الشريك \"المثقف، المستقل، الهادي، والعميق فكرياً\"؛ الشخص اللي عنده عالم خاص بيه، واللي بيفهم لغة \"الصمت المريح\" من غير ما يصدعك بأسئلة (ساكت ليه؟ بتفكر في إيه؟). بتعشق الشريك اللي بيحترم مساحتك وبيعرف يناقشك في أسرار الكون والحياة بوعي ونضج.\n\n• البلوك العاطفي وكارما العلاقات (ليه قلبك بيتوجع أو بيفضل وحيد؟):\nاللعنة العاطفية لمسار رقم (7) اسمها \"متلازمة الحصن المنيع وخوف التسليم\". إنت من جوه بتموت من الاحتياج للحب والاحتواء، بس من بره بتبني حوالين قلبك سور أسمنتي عالي جداً بأسلاك شائكة! الكارما بتضربك لما ترفض تظهر ضعفك الإنساني قدام شريكك، وتعامل العلاقة بمنطق \"الندية والتحليل\"، فتخلي الشريك يحس إنك مش محتاجه أصلاً، فيمشي ويسيبك لوحدك جوه حصنك!\n\n• طبيعتك في الجواز والاستقرار:\nالجواز التقليدي اللي فيه زن ودراما وتحكمات هو \"جحيم\" بالنسبة لك. عشان تتجوز وتستقر، لازم يكون شريك حياتك هو \"أعز أصدقائك\" قبل ما يكون شريكك العاطفي؛ بيت هادي، مفيش فيه صوت عالي، ومبني على الاحترام الفكري والمساحة الخاصة. لو شريكك سابك تتنفس وتقعد مع نفسك وقت ما تحتاج، هتكون أخلص وأوفى زوج في الدنيا. بس خد بالك: المساحة مش هروب. لو بتحتاج مساحة كتير دايماً، ممكن تكون بتستخدمها للهروب من العلاقة. الحب محتاج حضور.\n\nثالثاً: خريطة التوافق الطاقي (مين ينورك ومين يطفيك؟):\n\n• أعلى توافق روحي وعاطفي (توأم الشعلة والانسجام):\n  - مع مسار رقم (7) زيك ورقم (4): مع (7) بيكون في تفاهم روحي وفكري مرعب وتوأمة حقيقية، ومع (4) بتلاقوا الاستقرار والنظام والأرض الصلبة اللي بتحميك من تشتت أفكارك.\n  - مع مسار رقم (2) ورقم (3): مع (2) بتلاقي الحنان والاحتواء اللي بيطري جفافك العاطفي، ومع (3) بتلاقي البهجة والخفة اللي بتكسر كآبتك وعزلتك.\n\n• علاقات التحدي والصدام (تحتاج وعي وصبر كبير):\n  - مع مسار رقم (8) ورقم (1) ورقم (5): الأرقام دي نارية، مسيطرة، أو سريعة جداً؛ لو حصل صدام بين غرورك الفكري وعنادهم أو حبهم للسيطرة، البيت هيتحول لساحة معارك صامتة أو انفجار مفاجئ.\n\nرابعاً: ثلاث خطوات لفك البلوك العاطفي (روشتة تشافي القلب):\n\n• 1. الوعي والإدراك العاطفي:\nاحفظ القاعدة دي في قلبك: \"الحب مش ضعف، والحصن اللي بتبنيه عشان تحمي نفسك من الوجع هو هو نفس الحصن اللي بيحرمك من السعادة!\". افهم إن عيوبك البشرية واحتياجك لحضن يطبطب عليك مش بتقلل من حكمتك ولا ذكائك. اتعلم تفتح شباك قلبك للشمس وتستغنى عن درع الجفاء.\n\n• 2. السر الباطني والطاقي (فتح شاكرا القلب وتليين جدار الشك):\nفي العلوم الباطنية، مسار رقم (7) طاقته مقفولة تماماً في شاكرا القلب ومفتوحة بس لفوق. السر الباطني لتشافي علاقاتك هو \"التسليم والثقة العمياء\": بطل تحلل كل كلمة وكل نظرة من شريكك بميزان الذهب؛ سامح، عدي، وتنازل عن الرغبة في السيطرة العقلية على تفاصيل العلاقة، وسيب مشاعرك تسوقك من غير خوف.\n\n• 3. الصورة الذهنية لتشافي العلاقات (حط الصورة دي في عقلك دايماً):\n\"تخيل إنك (فارس عظيم لابس درع حديدي ثقيل وخايف يتجرح في المعركة). الفارس ده فضل لابس درعه 24 ساعة لدرجة إن الدرع صدأ على جسمه ومنعه يحضن أي حد بيحبه أو يحس بدفا النار في الشتا! التشافي العاطفي مش معناه إنك ترمي سلاحك وتترمي في النار.. التشافي هو إنك (تفخلع الدرع الثقيل ده ساعة ما تدخل بيتك وسط ناسك)، وتسمح لقلبك ينبض بحرية ويدوق طعم الدفا من غير خوف.\"\n\nسؤال للتأمل: في آخر علاقة، إنت كنت بتحمي نفسك، ولا كنت بتمنع نفسك من الحب؟ وإيه اللي كان هيفرق؟"},"5":{"title":"القسم الخامس: مغناطيس المال، الوفرة، والمهنة","text":"ليه بتحس بضيق وقرف فظيع في أي وظيفة تقليدية أو شغلانة فيها روتين ومديرين بياخدوا ويطردوا في الكلام؟\nرزق صاحب مسار الحياة رقم (7) مربوط بـ \"العلم العميق، الخبرة النادرة، الاستشارات، والتحليل المستقل\". الفلوس بتجيلك وتكبر لما تكون \"خبير لا غنى عنه في مجالك\"، بس البلوك المالي الأكبر عندك هو الكسل الإداري، والتأجيل المستمر، وكرهك لتسويق نفسك وبيع خدماتك.\n\nأولاً: ملامح طبيعتك المادية والمهنية (مميزاتك وعيوبك في الفلوس والشغل):\n\nسماتك المالية والمهنية (في طاقة النور):\n- ذكاء تحليلي خارق وقدرة فريدة على حل أصعب المشاكل المعقدة اللي الكل بيعجز قدامها.\n- استقلالية تامة؛ مش بتعرف تشتغل تحت إشراف مدير متسلط، وبتنجح بامتياز لو اشتغلت لحسابك أو كخبير ومستشار.\n- نظرة استباقية بعيدة المدى؛ بتشوف الثغرات والفرص اللي الناس مبتخدش بالها منها أصلاً.\n- دقة أمانة ومهنية لا تعوض؛ العميل أو الشركة اللي بتشتغل معاهم بيعتمدوا عليك ثقة عمياء.\n\nعيوبك المالية والمهنية (في طاقة الظل):\n- كرهك الشديد للتسويق والترويج لنفسك (بتستكبر أو بتتكسف تعمل \"براند\" لنفسك وتقول أنا بفهم في كذا).\n- البطء في اتخاذ القرارات المالية أو المهنية بسبب كتر الدراسة والتحليل.\n- الاستخفاف بالجانب المادي والتجاري والتركيز المفرط على الجانب الفكري أو العلمي البحت.\n- الملل السريع من الروتين الوظيفي، والتمرد المفاجئ وترك الشغل من غير خطة بديلة واضحة.\n\nثانياً: التحليل العميق لشفرة المال والمهنة لمسار رقم (7):\n\n• إزاي الفلوس بتجيلك؟ (شفرة الرزق والوفرة):\nفلوسك وبركتك مربوطة بـ \"الاحترافية المطلقة، التخصص النادر، وتقديم حلول عقلية وذهنية عالية القيمة\". إنت مش بتكسب من كتر الحركة والمجهود البدني؛ إنت بتكسب من \"كلمة واحدة في مكانها الصح\" أو \"استشارة ذكية\" توفر على الشركة ملايين. الفلوس بتجيلك لما تقعد على قمة هرم التخصص بتاعك وتبقى المرجع اللي الناس بتجيله لحد عنده عشان تحل مشاكلها.\n\n• البلوك المالي والتعطيل (إيه اللي بيبوظ عليك الفلوس؟):\nاللعنة المالية عندك اسمها \"عقدة الزاهد المتمرد على التجارة\". عندك فكرة غلط بتقول إن \"البحث عن المال والفلوس بيقلل من هيبة المفكر أو الباحث\". البلوك ده بيخليك تعيش طول عمرك مستمتاً بالعلم بس من غير مردود مادي يليق بقيمتك، وبتسيب غيرك يسرق أفكارك ويطلع هو منها الملايين لأنك كسلت تعملها بيزنس!\n\n• المجالات الأنسب لتحقيق الثروة:\nالبحث العلمي، البرمجة وتطوير الأنظمة والذكاء الاصطناعي، التحليل المالي والبورصة (بدراسة علمية دقيقة)، الاستشارات القانونية والفلسفية والنفسية، كتابة الأبحاث وصناعة المحتوى العميق (الكتب، الوثائقيات)، الطب والتخصصات الدقيقة، والتنجيم والفلك والعلوم الروحية والباطنية.\n\nثالثاً: ثلاث خطوات لفك البلوك المالي (روشتة جذب الثروة):\n\n• 1. الوعي والإدراك المالي:\nاحفظ القاعدة الذهبية دي: \"الثروة ليست عيباً ولا ضد الروحانية؛ بل هي أداة حريتك واستقلالك الكامل لتقوم بمهمتك في الأرض براحتك!\". بطل تحتقر الجانب المادي أو تعتبره سطحي. حط تسعيرة عالية لقيمة علمك ووقتك، وافهم إن المشتري اللي بيدفع لك كويس هو شخص بيقدر قيمة الخبرة النادرة اللي معاك.\n\n• 2. السر الباطني والطاقي (تحويل الطاقة الفكرية إلى مادة ملموسة):\nفي العلوم الباطنية، مسار رقم (7) طاقته هوائية فكرية بامتياز (أفكار في الهوا)، وده بيخليه يعاني من \"عجز مادي في تجسيد الأفكار لفلوس على أرض الواقع\". السر الباطني لثروتك هو \"توظيف مدير أعمال أو شريك تجاري من مسار أرضي (زي رقم 4 أو 8)\": إنت تطلع الفكرة والعبقرية، وهو ياخدها يسوقها وبيعها ويحولها لملايين.\n\n• 3. الصورة الذهنية لجذب الثروة (حط الصورة دي في عقلك دايماً):\n\"تخيل إن علمك وعقلك هو (بئر بترول خام عميق جداً تحت الأرض). البئر ده جواه ثروة لا تُقدر ولا تُثمن، بس لو فضل مقفول ومحدش حط عليه (أبراج استخراج وأنابيب وتكرير)، هيفضل مجرد حفرة طين سوداء ملوش أي قيمة مالية! الثروة مش في امتلاك العلم.. الثروة في بناء (منظومة تجارية ذكية) تخرج العلم ده للناس وتبيعه بقيمته الحقيقية.\"\n\nسؤال للتأمل: إيه العلم أو المهارة اللي إنت شايلها جواك ومطلعتهاش للناس؟ وإيه اللي بيمنعك؟\"شفرة الرزق\" و\"جذب الثروة\" هنا لغة رمزية للتأمل في عاداتك المالية، مش وعد بثراء مضمون. القرارات المالية الكبيرة محتاجة دراسة ومتخصصين."},"6":{"title":"القسم السادس: خطوات عملية تفرق معاك","text":"إزاي تفك شلل التفكير المفرط، وتطلع من عزلتك وتقدّم حكمتك للدنيا من غير ما تحس إن العالم بره مزعج ومستنزف؟\nالتشافي لصاحب مسار رقم (7) مش معناه إنك تبطل تفكر أو تحب وحدتك، التشافي معناه إنك تتعلم \"النزول من برجك العاجي للواقع\"؛ توازن بين خلوتك الروحية وبين نزولك للملعب عشان تعيش وتكسب مش بس تراقب من بعيد.\n\nالروشتة العملية الفورية لتغيير حياتك (3 خطوات للتطبيق المباشر):\n\n• 1. خطوة \"تفريغ الورقة والقلم\" (علاج مطحنة التفكير المفرط):\n  - إزاي تعملها: لما تلاقي عقلك اشتغل شات فكري بالليل، والسيناريوهات والشكوك والتحليلات بتقطع في دماغك، متسيبهاش جوه راسك! قوم هات ورقة وقلم واكتب كل الأفكار دي \"بالتفصيل\" زي ما هي طالعة من دماغك من غير ترتيب، وبعد ما تخلص، امسك الورقة دي وقطعها وارميها في الزبالة.\n  - النتيجة: العقل الباطن لما بيشوف الأفكار اتكتبت على ورق، بيحس إنها اتحفظت فبيوقف \"الاسطوانة المشروخة\" اللي كانت بتلف في دماغك، وهتنام نوم عميق من غير صداع ولا أرق.\n\n• 2. خطوة \"الخروج الآمن والتأريض الجسدي\" (علاج الهروب والعزلة المرضية):\n  - إزاي تعملها: لأن طاقة رقم (7) طايرة فوق في الأفكار والروحانيات، جسمك بينشف وبيحصلك خمول. الزم نفسك كل يوم بـ \"تمرين تأريض\"؛ امشي حافي على تراب أو نجيل لو قدرت، خد دش ماية ساقعة يصحيك، أو العب رياضة تلمس فيها عضلات جسمك عشان ترجع تتوصل بالواقع المادي. واخرج اتقابل مع صديق واحد بتحبه في مكان هادي من غير ما تعزل نفسك أيام طويلة.\n  - النتيجة: هتفصل الكابلات الوهمية من دماغك، هتحس بحيوية ونشاط في جسمك، وهتكسر حاجز الغربة والوحشة اللي بتجيلك من قعدة الكهف.\n\n• 3. خطوة \"قاعدة التجربة بلا توقعات\" (علاج الشك وفوبيا الخذلان):\n  - إزاي تعملها: بدل ما تقعد تحلل الشخص أو المشروع أو الفرصة 100 سنة قبل ما تاخد خطوة، طبق قاعدة \"ادخل التجربة كأني باحث بيجرب نظرية، ومش مهم النتيجة!\". لو نجحت خير وبركة، لو فشلت اتعلمت درس جديد يزود حكمتك. شيل الرهان الكبير والترقب العصبي من أي خطوة جديدة.\n  - النتيجة: هتشيل السكينة اللي كنت حاطتها على رقبتك، وهتكتشف إن الدنيا أبسط بكتير من تحليل الهندسة الفراغية اللي كنت عامله في دماغك!\n\nسؤال للتأمل: إيه أصغر خطوة من التلاتة دي تقدر تبدأ بيها بكرة الصبح؟"},"7":{"title":"القسم السابع: جرح الطفولة، الدين الكارمي، وعلاقتك بالأطفال","text":"ليه من وإنت طفل صغير حسيت إنك \"مش من المكان ده\"، وإن محدش فاهم دماغك ولا عمق أسئلتك الغريبة؟\nشعورك الدائم بالغربة وسط أهلك أو صحابك، وإدمانك على الانعزال جوه عالمك الخاص، جذورهم مدفونة في جرح طفولة حسيت فيه إنك وحيد ومحدش استوعب حساسية عقلك.. زائد إن مسار رقم (7) يحمل واحداً من أعمق الديون الكارمية (كارما الشك، العزلة، وإساءة استخدام العلم).\n\nأولاً: جرح الطفولة والطفل الداخلي:\nأغلب أصحاب مسار الحياة رقم (7) اتولدوا وهم حاسين إنهم \"أرواح قديمة في أجسام أطفال\"، وجرحهم الأساسي يتمثل في نقطتين:\n\n• جرح \"الطفل غير المفهوم\": في طفولتك، غالباً كنت طفل هادئ، مراقب جيد، وبتسأل أسئلة أكبر بكتير من سنك؛ بس اللي حواليك (أهلك أو مدرسيك) استهزأوا بأسئلتك، أو طلبوا منك تكون \"طفل عادي شقي وتلعب بدل قعدة الصمت دي\". طفلك الداخلي اتبرمج على شعور مؤلم: (محدش هنا فاهم أنا بحس بإيه ولا بيفكر في إيه، أحسن لي أقفل على نفسي وأكتفي بعالمي لوحدي!).\n\n• جرح صدمة الثقة المبكرة: غالباً اتعرضت في طفولة مبكرة لخذلان من شخص كبير كنت بتثق فيه أمانة تامة (أب، مدرس، أو صديق مقرب)، فالشخص ده كسر ثقتك أو كذب عليك. الجرح ده زرع جوه طفلك الداخلي \"جدار الشك الأسمنتي\" اللي بيفضل ماشي بيه لحد ما يكبر. والحقيقة إنك دلوقتي كبير، ومحدش بيقدر يجرحك من غير إذنك. اللي بيفكرك بالجرح القديم، هو خوفك القديم، مش الواقع الجديد.\n\nثانياً: الدين الكارمي لمسار (7) - (كارما الشك المفرط والانعزال عن الجماعة):\nفي علم الأرقام الكارمي، الرقم (7) (وخصوصاً لو جاي من مجموع 16 أو 25) يحمل ديناً كارمياً يخص \"الغرور الفكري، استخدام المعرفة بشكل يعزل الإنسان عن الناس، والشك الهدّام\".\n\n• رسالة الكارما بتاعتك: في الماضي (أو حيوات سابقة)، روحك ربما انغلقت على علمها أو فلسفتها وفضلت العزلة المتعالية على خدمة الناس، أو استخدمت ذكاءها وشكها في التلاعب بالآخرين. الكون بعتك في المسار ده عشان تتعلم الدرس الأصعب: \"الحكمة الحقيقية مش إنك تعتزل العالم وتعتبر نفسك أذكى منهم؛ الحكمة الحقيقية هي إنك تنزل وسط الناس، تتذوق طعم الحياة بكل فوضاها، وتنورهم بعلمك من غير تكبر\". الكارما بتختبرك بمواقف تتعرض فيها للخدعة أو الضياع لحد ما تتعلم إزاي توازن بين بصيرتك الروحية وبين نزولك للواقع البشري.\n\nثالثاً: علاقتك بالأطفال والتربية (أنت كأب / أم):\n\n• مميزاتك في التربية: إنت أب/أم استثنائي ومثقف جداً! مبتفرضش على ولادك أفكار عمياء، بل بتشجعهم يفكروا، يسألوا، يشغلوا عقلهم، ويعتمدوا على نفسهم. بتوفرلهم بيئة هادية، مليانة كتب، معرفة، واحترام كامل لمساحتهم الشخصية وأفكارهم مهما كانت غريبة.\n\n• عيوبك في التربية (احذر منها): آفتك الكبرى مع ولادك هي \"البرود العاطفي الظاهري وصعوبة التعبير عن الحضن والحنان بكلمات دافية\"! من كتر ما إنت بتميل للعقل والمنطق، ولادك ممكن يحسوا إنك \"أب/أم قاسي، ناشف، أو مشغول عنهم بعقلك وعالمك\". وأحياناً بتبقا مراقب صارم بتعد عليهم غلطاتهم بدل ما تطبطب عليهم.\n\n• نصيحة ذهبية: ولادك مش محتاجين \"بروفيسور أو فيلسوف\" في البيت؛ ولادك محتاجين \"أب أو أم يرموا العقل على جنب، ويحضنوهم، ويضحكوا معاهم من قلبهم، ويسمعوهم من غير تحليل نقدي\". انزل لمستوى سنهم واديهم الدفا العاطفي اللي يحسسهم بالأمان المطلق!\n\nسؤال للتأمل: إيه الحاجة اللي كنت محتاج تسمعها وإنت صغير، ولسه محتاج تسمعها النهاردة؟"}},"8":{"1":{"title":"القسم الأول: شفرة الروح والجوهر","text":"(لمن مجموع تاريخ ميلاده الكامل يختزل إلى الرقم 8، أو وُلد يوم 8، 17، 26)\n\nالمعنى العاطفي والنفسي / طاقة القراءة (جوهر روحك الحقيقي):\n\nلو مسار حياتك هو الرقم (8)، فاعرف إنك \"الرئيس التنفيذي\" بالفطرة في كوكب الأرض! إنت جيت الدنيا دي عشان تبني إمبراطورية، تسيطر على المادة، وتثبت إنك قد أي تحدي مهما كانت صعوبته. جوهرك بيتكون من التفاصيل دي:\n\n• طاقة قيادية جبارة وحضور طاغي: أول ما بتدخل أي مكان، هالتك بتفرض نفسها غصب عن الكل. إنت مش شخص عادي؛ إنت بتمتلك كاريزما القيادة، اتخاذ القرارات الصعبة في ثوانٍ، وإدارة الأزمات الكبرى بعقل استراتيجي بارد ومحسوب. بس خد بالك: القيادة مش بس إنك تتحمل المسؤولية، القيادة كمان إنك تعرف تشاركها. اللي بيمسك كل حاجة لوحده، بيتهد. اللي بيعرف يشارك، بيبني إمبراطورية.\n\n• عشق النجاح المادي والمكانة العالية: الفلوس بالنسبة لك مش رفاهية، الفلوس هي \"أداة السيطرة، الأمان، والحرية المطلقة\". إنت بتعرف كويس إزاي تدير البيزنس، تكبر الفلوس، وتبني مشاريع تخدم سنين قدام. مستحيل ترضى بالقليل أو تقبل تكون مجرد ترس في مكنة حد تاني. بس خد بالك: الفلوس أداة، مش هوية. لما بتربط قيمتك برصيدك، بتخسر نفسك لما الرصيد بيقل. اللي بيعرف قيمته من غير فلوس، بيحافظ على فلوسه، وعلى نفسه.\n\n• عدل مطلق ومسؤولية جبارة: جوه القناع القوي ده، إنت إنسان عادل جداً، وبتشيل همّ عيلتك والناس اللي شغالة معاك فوق كتافك كأنك المسؤول الأول والأخير عن رزقهم وحمايتهم. المسؤولية دي مش عبء، دي شرف عندك. بس خد بالك: مش كل حاجة مسؤوليتك. اللي بتحمله عن حد، بتمنعه من إنه يكبر. اللي بتديه مساحة، بتخليه يبقى قوي. القائد الحقيقي بيبني قادة، مش تابعين.\n\n• جوهر طاقتك في الوضع الإيجابي (طاقة النور): لما بتكون في قمة اتزانك، بتكون القائد العادل، الداعم المالي والسند لكل اللي حواليك، الملياردير أو المدير الناجح اللي بيفتح بيوت وبيعمل إنجازات تاريخية ملموسة. في الحالة دي، إنت زي الجبل اللي بيحمي اللي حواليه من العواصف، مش بس بثباته، لكن بعدله وكرمه.\n\n• جوهر طاقتك في الوضع السلبي (طاقة الظل والانحراف): لما طاقتك بتضلم أو بتفقد السيطرة، بتتحول لشخص \"ديكتاتور، متسلط، مادي لأقصى درجة، ومهووس بالتحكم في كل صغيرة وكبيرة\"! بتعامل الناس بمنطق المكسب والخسارة، وبتحرق أعصابك وصحتك في الشغل لدرجة تنسى فيها المشاعر الإنسانية تماماً. والحقيقة إن الديكتاتور مش قوي، الديكتاتور خايف. القوي الحقيقي هو اللي بيثق في الناس، ويعرف يدي مساحة، ويقبل إنه مش لازم يسيطر على كل حاجة.\n\nسؤال للتأمل: إمتى آخر مرة استخدمت سلطتك أو فلوسك عشان تساعد حد من غير ما تنتظر مقابل أو تقدير؟ وإيه اللي حسيت بيه؟"},"2":{"title":"القسم الثاني: المراية المزدوجة","text":"في مسار الحياة رقم (8)، إنت لابس قناع \"الجبل اللي مابيهزهوش ريح\"، والفرق بين الهيبة والصلابة اللي بتصدرها للناس وبين التعب السري اللي جواك بيخلق صراع نفسي محدش بيتخيله:\n\n• إزاي الناس بتشوفك من بره (القناع الخارجي والهالة):\nالناس بتشوفك \"السلطة، القوة، والشخص اللي مبيعرفش المستحيل\"! هالتك الخارجية بتدي انطباع بالسيطرة التامة، الثقة اللي بتوصل للغرور أحياناً، والبرود الانفعالي وقت الأزمات. في عيونهم، إنت الشخص اللي عنده حل لكل حاجة، اللي مبيضعفش ومبيعيطش، واللي بيمشي كلمته على التخين. ولأنك بتحسب خطواتك وبتهتم جداً بمظهرك ومكانتك، كتير من الناس بيغلطوا في فهمك وبيشوفوك شخص \"مادي، قاسي القلب، متسلط، وبيدوس على أي حاجة عشان يوصل لهدفه\"!\n\n• إيه اللي بيدور جواك فعلاً (حقيقتك وصراعك الداخلي السري - متلازمة التاج التقيل):\nالحقيقة اللي مخبيها ورا بدلة المدير وقناع القوة دي هي إنك من جوه بتعاني من \"رعب خفي من الفشل والفقر، وإرهاق قاتل من شيل مسؤولية الكوكب كله\"! إنت مش قاسي، إنت بس حاسس إنك لو رمشت أو ريحت ثانية، كل الإمبراطورية اللي بنيتها هتقع، والناس اللي مسنودة عليك هتضيع. جواك صراع سري بين رغبتك في السيطرة وبين أمنيتك إنك تلاقي شخص واحد بس يكون \"أقوى منك\" تقدر تسند عليه وتطمن معاه، بس المشكلة إنك مبتقدرش تثق في حد إنه يقود السفينة مكانك! والخوف ده هو اللي بيخليك ماسك كل حاجة. والخوف مش بيحمي، الخوف بيعزل. اللي بيعرف يثق، بيلاقي اللي يسنده.\n\n• السر النفسي في تعاملك مع الضغوط والصدمات:\nلما بتتعرض لصدمة، خيانة، أو خسارة مالية، إنت مبتنهارش وتشتكي؛ إنت بتكتم وجعك وتتحول لـ \"آلة شغل بلا مشاعر\"! بتدفن نفسك في الشغل والمشاريع عشان تهرب من المواجهة العاطفية. ولو حد غدر بيك أو كسر ثقتك، عقابك بيكون مرعب؛ مبتعملش دراما وصويت، إنت بتشطب الشخص ده من وجودك تماماً ببرود قاطع، وممكن تستخدم نفوذك أو نجاحك كأداة للانتقام الصامت (النجاح هو أفضل انتقام بالنسبة لك). بس خد بالك: الشطب مش حل. الشطب تأجيل. الوجع اللي ما اتحلش، بيرجع في وقت أضعف. الحل إنك تواجه، وتعبر، وتطلب دعم.\n\nسؤال للتأمل: إمتى آخر مرة قلت لحد \"أنا تعبان\" أو \"أنا محتاج دعم\" من غير ما تحس إنك هتبان ضعيف؟"},"3":{"title":"القسم الثالث: البلوكات الخفية ونقاط التعطيل","text":"ليه أحياناً بعد ما تبني إمبراطوريتك وتوصل لقمة النجاح، بتلاقي ضربة قاضية هدّت اللي بنيته، أو تلاقي نفسك وحيد والناس بتكره سيطرتك؟\nأكبر بلوك طاقي بتطارد صاحب مسار الحياة رقم (8) وبتوقف حاله هو \"هوس السيطرة المطلقة، الديكتاتورية، وربط قيمتك كإنسان برصيدك في البنك\". إنت بتدمر صحتك وعلاقاتك لما بتتعامل مع الحياة كأنها \"ساحة معركة\" لازم تكسب فيها لوحدك وتتحكم في كل نفس بيطلع من اللي حواليك.\n\nأولاً: أنماط التعطيل والعيوب الخفية لمسار رقم (8) في نقاط سريعة:\n\n• هوس السيطرة والتحكم؛ مابتعرفش تفوض مهام لغيرك لأنك مابتثقش إن حد هيعملها بكفاءتك.\n• الإدمان على العمل لدرجة إهمال صحتك الجسدية، وعيلتك، وحياتك الشخصية.\n• القسوة والجفاف العاطفي وقت الغضب، واستخدام نقاط ضعف الآخرين ضدهم لو حسيت بالتهديد.\n• ربط القيمة الذاتية بالنجاح المادي فقط (لو فلوسك قلت بتحس إنك نكرة ومالكش لازمة).\n• الغرور المادي والتباهي بالسلطة (في طاقة الظل)، واعتبار الناس الأقل نجاحاً أشخاص كسالى ميستاهلوش المساعدة.\n\nثانياً: التحليل العميق للبلوكات الطاقية الأربعة:\nطاقة الرقم (8) عاملة زي \"القطر السريع\"؛ لو مشي على قضبان التوازن بيوصل لأبعد مكان ويشيل معاه ناس كتير، بس لو داس على فرامل المشاعر والرحمة، بيتقلب ويدمر كل اللي فيه:\n\n• البلوك الأول: فخ \"الديكتاتورية وانعدام التفويض\":\nعشان إنت بتسعى للمثالية في الإنجاز، بتحاول تعمل كل حاجة بإيدك وتراقب كل صغيرة وكبيرة في شغلك وبيتك. النتيجة؟ بتستنزف طاقتك تماماً، والناس اللي معاك بتتحول لـ \"آلات مسلوبة الإرادة\" بيخافوا ياخدوا قرار من غيرك، فبتشيل إنت الشيلة كلها لوحدك لحد ما ضهرك يتقطم. والحقيقة إن اللي بيعمل كل حاجة لوحده، مش بيوصل أسرع، هو بس بيتعب أسرع. اللي بيعرف يفوض، بيوصل أسرع وأبعد.\n\n• البلوك الثاني: بلوك الإفلاس العاطفي:\nإنت بتتعامل مع المشاعر على إنها \"نقطة ضعف أو تضييع وقت\". البلوك بيحصل لما تستبدل الحب والاهتمام بـ \"الفلوس والهدايا الغالية\". بتدي لولادك وشريكك فلوس ومستوى معيشة فخم، بس بتحرمهم من حضنك ووقتك، فبتلاقي نفسك عايش في قصر من دهب بس بارد ومفيش فيه روح، ولما تقع محدش بيسندك بقلبه. والحقيقة إن الفلوس بتجيب راحة، بس مش بتجيب حب. الحب بيجي من الحضور، والكلمة الحلوة، والاهتمام بالتفاصيل الصغيرة.\n\n• البلوك الثالث: كارما استغلال السلطة والغرور:\nالرقم 8 هو رقم العدالة والكارما السريعة (تأثير كوكب زحل). لو استخدمت ذكاءك أو سلطتك عشان تظلم حد، تاكل حق حد، أو تتكبر على الضعيف، الكون بيعملك \"إعادة ضبط مصنع\" قاسية جداً! دي الكارما اللي بتخلي بعض أصحاب مسار 8 يفلسوا فجأة أو يخسروا منصبهم عشان يتعلموا درس التواضع. والحقيقة إن اللي بيكسب على حساب حد، بيخسر حاجة أغلى. اللي بيكسب بشرف، بيكسب ويحافظ.\n\n• البلوك الرابع: وهم \"المال هو هويتي\":\nأكبر تعطيل لطاقتك هو إنك بتشوف نفسك من خلال أرقام حسابك في البنك أو الماركات اللي بتلبسها. لو حصلتلك أزمة مادية طبيعية، مبتعتبرهاش مجرد خسارة بيزنس، دي بتضرب في \"صميم كرامتك وهويتك\" وبتحس إنك اتعريت قدام الناس، وده بيدخلك في اكتئاب أسود. والحقيقة إن قيمتك مش في الفلوس، قيمتك فيك إنت. اللي بيعرف قيمته بغض النظر عن الفلوس، بيحافظ على الاثنين.\n\nثالثاً: ثلاث خطوات لفك البلوك الطاقي (الروشتة الروحية والذهنية):\n\n• 1. الوعي والإدراك (تعديل البرمجة العقلية):\nاحفظ القاعدة الذهبية دي وحطها برواز في مكتبك: \"القائد الحقيقي ليس من يتحكم في كل شيء، بل من يصنع قادة آخرين يثق فيهم!\". اتعلم فن \"التفويض\". اسمح للناس إنها تغلط وتتعلم، وارفع إيدك شوية عن عجلة القيادة عشان تدي لنفسك فرصة تتنفس وتعيش. وافصل تماماً بين \"قيمتك كإنسان\" وبين \"حجم ثروتك\"؛ إنت غالي ومهم حتى لو جيبك فاضي.\n\n• 2. السر الباطني والطاقي (توازن شاكرا الضفيرة الشمسية والجذر مع شاكرا القلب):\nفي العلوم الباطنية، صاحب مسار (8) عنده نشاط جبار في \"شاكرا الضفيرة الشمسية\" (مركز السلطة والإرادة) و\"شاكرا الجذر\" (مركز المال والبقاء)، بس ده بيجي على حساب انغلاق \"شاكرا القلب\". السر الباطني لفك بلوكاتك هو \"دمج المادة بالرحمة\": خلي جزء ثابت من ثروتك للعمل الخيري السري اللي مفيهوش أي شو أو مجد شخصي، واجبر نفسك تخصص وقت للحب واللعب والضعف الإنساني بعيداً عن صرامة الشغل.\n\n• 3. الصورة الذهنية للتشافي (حط الصورة دي في عقلك دايماً):\nكل ما تلاقي نفسك هتموت من القلق عشان تسيطر على كل حاجة، أو لقيت قسوتك بتزيد على الناس اللي حواليك، غمض عينك لـ 30 ثانية واستحضر الصورة دي:\n\"تخيل إنك (ملك عظيم قاعد على عرشه). الملك الخايف والضعيف هو اللي بينزل بنفسه يمسك السيف ويقف حارس على باب القلعة 24 ساعة ومبينامش من الشك. لكن الملك الحكيم والقوي بجد، هو اللي بيختار (قادة وجنرالات) يثق فيهم، يسلمهم السلاح، ويروح هو يقعد في حديقة القصر يستمتع بوقته مع عيلته وهو مطمن إن مملكته في أمان. قوتك في ثقتك وتفويضك، مش في سيطرتك الخانقة.\"\n\nسؤال للتأمل: إيه الحاجة اللي إنت شايلها لوحدك وممكن تسيبها لحد تاني يشاركك فيها؟ وإيه اللي بيمنعك؟\"البلوكات الطاقية\" هنا تعبير رمزي عن أنماط متكررة، مش حقيقة كونية. الأنماط دي قابلة للتغيير بالوعي والتدريب."},"4":{"title":"القسم الرابع: الشفرة العاطفية، الجواز، وكارما العلاقات","text":"ليه رغم إنك بتوفر كل حاجة غالية ومريحة لشريك حياتك، دايماً بيشتكي من \"الجفاء والبعد\"، وتحس إن العلاقة قلبت لصفقة بيزنس باردة؟\nالحب عند صاحب مسار الحياة رقم (8) مش مجرد كلام رومانسي، الحب عنده يعني \"حماية، تأمين مستقبل، وبناء إمبراطورية مشتركة\". بس الكارما العاطفية الأخطر عندك هي إنك بتستبدل حضنك ووقتك بـ \"الفلوس والهدايا\"، وبتخاف تظهر ضعفك قدام شريكك لدرجة بتخليه يحس إنه متجوز \"مدير صارم\" مش حبيب.\n\nأولاً: ملامح طبيعتك العاطفية (مميزاتك وعيوبك في الحب والجواز):\n\nسماتك كشريك عاطفي (في طاقة النور):\n- حامي وصمام أمان من الدرجة الأولى؛ شريكك معاك بيحس إنه متحصن في قلعة، ومستحيل تسمح لأي مخلوق يمسه بكلمة.\n- بتعامل شريكك كأنه \"ملك أو ملكة\"؛ بتحب الرفاهية، الهدايا القيمة، وبتبني بيت مستواه المادي والاجتماعي راقي جداً.\n- وفي ومخلص لبيتك وعيلتك، ولو لقيت الشريك اللي يقدر مجهودك، بتشيله فوق دماغك وتعمل المستحيل عشان تسعده.\n- مسؤول ومستعد يتحمل عبء البيت والأسرة على كتفه من غير ما يشتكي.\n\nعيوبك العاطفية (في طاقة الظل):\n- الجفاف العاطفي والعملية المفرطة؛ بتعتبر الرومانسية \"تفاهة\" وتضييع وقت، ومبتقولش كلام حلو كفاية.\n- هوس السيطرة والتحكم في تفاصيل حياة الشريك (لبسه، خروجاته، شغله)، وكأنك بتدير موظف عندك مش بتشارك حبيب.\n- \"شراء الخاطر بالمال\"؛ لما بتغلط أو تقصر، بدل ما تعتذر وتتكلم، بتجيب هدية غالية وتعتبر إن الموضوع كده خلص!\n- الخوف من إظهار الضعف أو الاحتياج؛ بتخاف لو قلت \"أنا محتاجك\" هتبان ضعيف وتفقد هيبتك.\n\nثانياً: التحليل العميق لشفرة الحب والجواز لمسار رقم (8):\n\n• مواصفات الشريك اللي بيجيبك الأرض (فتى/فتاة أحلامك طاقياً):\nإنت مابيعجبكش الضعيف ولا الاعتمادي اللي بيبكي على كل حاجة. اللي بيخطف قلبك بجد هو الشريك \"القوي، الطموح، والراقي\"؛ شخص عنده كيان، ذكي، بيعرف يدير أزمات، ويقدر يقف في ضهرك ويسندك لما تقع. إنت بتدور على حد تفتخر بيه قدام الناس، ويكون \"الواجهة الفخمة\" لإمبراطوريتك. بس خد بالك: الشريك القوي ده مش هيفضل يستحمل الجفاف العاطفي للأبد. لو مش عبرت عن حبك، ممكن يحس إنه مش محبوب، حتى لو إنت بتحبه بجد.\n\n• البلوك العاطفي وكارما العلاقات (ليه قلبك بيتوجع أو بيعيش في جفاء؟):\nاللعنة العاطفية لمسار (8) اسمها \"صراع القوة والخوف من التسليم\". إنت بتخاف جداً إنك لو سلمت قلبك بالكامل، الشريك هيستغل ضعفك أو يكسرك، فعقلك الباطن بيخليك دايماً \"صاحب اليد العليا\" في العلاقة. الكارما هنا بتضربك لما تختار شخص ضعيف عشان تسيطر عليه، فتمل منه وتحتقر ضعفه؛ أو تختار شخص قوي زيك فتدخلوا في \"حرب سيطرة\" تكسر البيت نصين!\n\n• طبيعتك في الجواز والاستقرار:\nالجواز بالنسبة لك هو \"مؤسسة لازم تنجح\". لو الشريك فهم إن طريقتك في التعبير عن الحب هي \"الشغل والتأمين\"، وإنك بتشقى عشان راحتهم، البيت هيستقر. بس لو فضل يزن على \"وقت وكلام رومانسي\" وإنت تجاهلته، البيت هيتحول لفندق 5 نجوم.. فخم جداً، بس مفيهوش دفا! والحقيقة إن الجواز شراكة، مش مؤسسة. الشريك اللي بيحبك، بيحبك عشان إنت، مش عشان بتدير حياته.\n\nثالثاً: خريطة التوافق الطاقي (مين ينورك ومين يطفيك؟):\n\n• أعلى توافق روحي وعاطفي (توأم الشعلة والانسجام):\n  - مع مسار رقم (2) ورقم (6): مع (2) بتلاقي الدبلوماسية، الحنان، والقلب اللي بيمتص غضبك من غير ما يتحداك؛ ومع (6) بتلاقي الرعاية، البيت الدافي، والولاء العائلي المطلق اللي بيطمنك.\n  - مع مسار رقم (4): توافق مادي وعملي جبار! الاتنين بتبنوا إمبراطورية وتفهموا لغة العمل الشاق، بس محتاجين تفكروا بعض بالرومانسية عشان البيت مايقلبش شركة.\n\n• علاقات التحدي والصدام (تحتاج وعي وصبر كبير):\n  - مع مسار رقم (1) ورقم (8) زيك: هنا بتحصل \"حرب تكسير عظام\"! الاتنين ألفا، الاتنين عايزين يقودوا، والبيت مبيستحملش ريسين. لو متنازلتوش لبعض، العلاقة بتنتهي بصدام مدمر.\n  - مع مسار رقم (5): إنت عايز استقرار وسيطرة، وهو عايز حرية وطيران! علاقة متعبة جداً وبتستفز رغبتك في التحكم.\n\nرابعاً: ثلاث خطوات لفك البلوك العاطفي (روشتة تشافي القلب):\n\n• 1. الوعي والإدراك العاطفي:\nاحفظ القاعدة دي كويس: \"شريكك مش موظف عندك، والبيت مش فرع جديد لشركتك!\". الحب الحقيقي بيتبني على \"المشاركة مش السيطرة\". اتعلم إنك لو أظهرت تعبك وضعفك قدام شريكك، ده مش هيقلل من هيبتك، بالعكس.. ده هيخليه يحس بانسانيتك ويحبك أكتر ويقف في ضهرك بجد.\n\n• 2. السر الباطني والطاقي (تفعيل شاكرا القلب وفصل المادة عن الروح):\nفي العلوم الباطنية، مسار (8) بيتركز في شاكرا الجذر والضفيرة الشمسية (مادة وسيطرة). السر لنجاح علاقاتك هو \"فتح شاكرا القلب\". إزاي؟ افصل فلوسك عن قيمتك العاطفية. خصص وقت في الأسبوع تقفل فيه تليفون الشغل، وتدرب لسانك على كلمة \"بحبك\" و\"شكراً\" و\"أنا مقدرك\" بدون أي مبرر مادي.\n\n• 3. الصورة الذهنية لتشافي العلاقات (حط الصورة دي في عقلك دايماً):\n\"تخيل إنك (إمبراطور قوي جداً لابس تاج تقيل وماسك سيف طول النهار). بره قصرك، إنت بترعب الأعداء وبتحمي بلدك. بس لما بتدخل مخدعك بالليل مع شريكك، لازم (تقلع التاج ده وتسيب السيف على الباب). لو دخلت سريرك بالسيف والتاج، هتعور شريكك وتخوفه! البيت هو المكان الوحيد اللي مسموح لك فيه تكون (إنسان عادي) مش إمبراطور.\"\n\nسؤال للتأمل: في آخر خلاف، إنت كنت بتحمي نفسك، ولا كنت بتمنع نفسك من القرب؟ وإيه اللي كان هيفرق؟"},"5":{"title":"القسم الخامس: مغناطيس المال، الوفرة، والمهنة","text":"ليه دايماً عينك على الأرقام الكبيرة والمناصب القيادية، وبتحس باختناق لو اشتغلت موظف صغير أو حد اتحكم في رزقك؟\nمسار الحياة رقم (8) هو \"شفرة الثروة الكبرى والسلطة\" في علم الأرقام. الفلوس بتنجذب ليك لما تلعب دور \"الرئيس التنفيذي\" اللي بياخد قرارات جريئة وبيشغل فلوسه وفلوس غيره. بس البلوك المالي الأعنف اللي بيطير ثروتك هو \"كارما الظلم، الطمع، والغرور المادي\".\n\nأولاً: ملامح طبيعتك المادية والمهنية (مميزاتك وعيوبك في الفلوس والشغل):\n\nسماتك المالية والمهنية (في طاقة النور):\n- عقلية الملياردير: إنت مبتفكرش إزاي تجيب فلوس تاكل وتشرب بيها؛ إنت بتفكر إزاي تبني أصول، تشتري عقارات، وتأسس شركات تعيش أجيال.\n- إدارة الأزمات والمخاطر: في الوقت اللي الناس بتنهار فيه وقت الأزمات الاقتصادية، إنت عقلك بيلمع! بتعرف تصطاد الفرص من وسط الخراب وتحول التراب لدهب.\n- الكفاءة الإنتاجية الجبارة: بتعرف تدير الموارد (وقت، فلوس، موظفين) بأقصى كفاءة، ومبتسمحش بتضييع مليم واحد في مكان غلط.\n\nعيوبك المالية والمهنية (في طاقة الظل):\n- العبودية للمال: بتتحول لآلة شغل مبتوقفش، وبتضحي بصحتك وعيلتك عشان تزود الأصفار في حسابك البنكي.\n- الطمع أو احتكار النجاح: في طاقة الظل، ممكن تدوس على منافسينك بقسوة، أو تستخسر تدي الموظفين حقوقهم كاملة بحجة إن \"إنت اللي عملتهم\".\n- المقامرة غير المدروسة (أحياناً): من كتر ثقتك في نفسك، ممكن تاخد ريسك ضخم جداً يطير سيولة الشركة كلها في ضربة واحدة.\n\nثانياً: التحليل العميق لشفرة المال والمهنة لمسار رقم (8):\n\n• إزاي الفلوس بتجيلك؟ (شفرة الرزق والوفرة):\nرزقك مربوط بـ \"تحمل المسؤوليات الضخمة، التنظيم، والقيادة\". الفلوس مابتجيلكش من الحظ ولا من الشغل السهل، الفلوس بتجيلك لما تدير منظومة كبيرة، تحل مشاكل معقدة لشركات أو دول، وتأخذ قرارات حاسمة. إنت \"مغناطيس للتمويل\"؛ المستثمرين بيثقوا يحطوا فلوسهم معاك لأنهم بيشوفوا فيك القوة والالتزام الصارم (طاقة زحل).\n\n• البلوك المالي والتعطيل (إيه اللي بيبوظ عليك الفلوس؟):\nاللعنة المالية لمسار (8) اسمها \"كارما زحل الصارمة\". الرقم 8 عامل زي \"البوميرانج\"؛ اللي هترميه هيرجعلك أضعاف مضاعفة وفي نفس اللحظة! لو بنيت ثروتك بشرف، عدل، ومساعدة للناس، الكون هيفتحلك خزائنه. لكن لو بنيت ثروتك بظلم، نصب، أو أكل حقوق شركاء/عمال، كوكب زحل هينزل عليك بـ \"إفلاس كارمي مفاجئ\" يهد كل اللي بنيته عشان يربيك من أول وجديد ويعلمك التواضع!\n\n• المجالات الأنسب لتحقيق الثروة:\nإدارة الأعمال، الاستثمار العقاري والمقاولات، البنوك وأسواق المال (البورصة)، المناصب السياسية والحكومية العليا، القانون والمحاماة، ريادة الأعمال الشاملة، وأي مجال فيه إدارة لميزانيات ضخمة وموارد بشرية.\n\nثالثاً: ثلاث خطوات لفك البلوك المالي (روشتة جذب الثروة):\n\n• 1. الوعي والإدراك المالي:\nاحفظ القاعدة الذهبية دي: \"الثروة الحقيقية ليست في عدد الأصفار في البنك، بل في عدد البيوت التي تفتحها والمشاريع التي تخدم بها الناس!\". سر استمرار ثروتك هو (العدل). ادفع أجور الناس قبل ما عرقهم ينشف، متستغلش ضعف حد، وطلع جزء من مكسبك للخير دايماً، لأن ده هو \"الدرع الكارمي\" اللي بيحمي فلوسك من الزوال.\n\n• 2. السر الباطني والطاقي (تحويل السيطرة إلى تدفق مرن):\nفي العلوم الباطنية، البلوك المالي لرقم 8 بيجي من \"انقباض طاقة الجذر\" بسبب الخوف المستمر من الإفلاس. السر الباطني هو \"التدفق والتفويض\": الفلوس طاقة لازم تتحرك. بطل تمسك في الفلوس بخوف، استثمر، كبر الناس اللي تحتك واديهم صلاحيات، لأن الإمبراطورية مبتكبرش بجهد شخص واحد مهما كان قوي.\n\n• 3. الصورة الذهنية لجذب الثروة (حط الصورة دي في عقلك دايماً):\n\"تخيل إنك (مايسترو عظيم بيقود فرقة موسيقية ضخمة). المايسترو ده مابيمسكش كل آلة ويعزف عليها بنفسه؛ لو ساب العصاية وراح يعزف على الكمنجة والبيانو والدرامز في نفس الوقت، الأوركسترا هتبوظ وهيطلع صوت نشاز! المايسترو الناجح (بيقف بثقة، يوجه ده، ويدي إشارة لده)، وبيخلي كل واحد يطلع أحسن ما عنده عشان في النهاية المقطوعة تطلع أسطورية وتجيب ملايين. إنت المايسترو.. وجه، فوض، وابني منظومة تشتغل من غير ما تحرق أعصابك.\"\n\nسؤال للتأمل: إيه الحاجة اللي إنت ماسكها بخوف وممكن تسيبها تتحرك؟ وإيه اللي بيمنعك؟\"شفرة الرزق\" و\"جذب الثروة\" هنا لغة رمزية للتأمل في عاداتك المالية، مش وعد بثراء مضمون. القرارات المالية الكبيرة محتاجة دراسة ومتخصصين."},"6":{"title":"القسم السادس: خطوات عملية تفرق معاك","text":"إزاي تبطل تحرق في أعصابك وصحتك عشان تسيطر على كل حاجة، وترجع تحس بطعم الحياة والراحة من غير ما إمبراطوريتك تقع؟\nالتشافي لصاحب مسار رقم (8) مش معناه إنه يسيب طموحه أو يتنازل عن نجاحه؛ التشافي معناه إنه يتعلم فن \"التسليم، التفويض، والفصل بين قيمته الإنسانية كبشر وبين أرقام حسابه في البنك\".\n\nالروشتة العملية الفورية لتغيير حياتك (3 خطوات للتطبيق المباشر):\n\n• 1. خطوة \"التفويض الإجباري الأعمى\" (علاج هوس السيطرة والـ Micromanagement):\n  - إزاي تعملها: اختار مهمة واحدة في شغلك أو في بيتك (مهمة متوسطة مش مصيرية)، وكلّف بيها شخص شغال معاك أو شريكك، وامنع نفسك تماماً من إنك تراقبه، تعدل عليه، أو تسأله كل شوية \"عملت إيه؟\". سيبه يخلصها بطريقته حتى لو هيغلط غلطة صغيرة ويتعلم منها.\n  - النتيجة: عقلك الباطن هيبدأ يكسر \"فوبيا فقدان السيطرة\"، وهتكتشف إن الدنيا مماتش والمشروع مخربش لما غيرك استلم القيادة، وده هيوفرلك طاقة ذهنية جبارة كنت بتحرقها في المراقبة.\n\n• 2. خطوة \"قاعدة الـ 24 ساعة بدون بدلة الإمبراطور\" (علاج الإدمان على العمل):\n  - إزاي تعملها: حدد يوم واحد في الأسبوع (أو حتى نص يوم لو جدولك زحمة)، اقفل فيه تليفون الشغل تماماً، واقلع فيه \"بدلة المدير\". في الوقت ده ممنوع تتكلم في بيزنس، أو تحسب حسبة مالية. انزل العب مع ولادك، اخرج مع شريك حياتك خروجة بسيطة، أو اعمل هواية تافهة مبتجيبش فلوس أصلاً!\n  - النتيجة: هتفصل كابلات الضغط العالي عن أعصابك، هتنعش شاكرا القلب، وهترجع تحس بـ \"إنسانيتك\" اللي طحنتها مكنة الفلوس والمشاريع.\n\n• 3. خطوة \"دفع الفواتير العاطفية\" (علاج الجفاف العاطفي والغرور):\n  - إزاي تعملها: درّب لسانك على \"الشكر غير المادي\". لما شريكك يعمل حاجة حلوة، أو موظف عندك يتعب ويأدي كويس، متكافئهوش بفلوس أو هدية بس؛ بص في عينه وقوله كلام تقدير صريح: \"أنا فخور بيك جداً، أنا مقدر تعبك معايا، إنت غالي عندي ومجهودك متشاف\".\n  - النتيجة: هتبني رصيد عاطفي ضخم عند الناس اللي حواليك، ولما تقع في يوم أو تتعب، هتلاقي جيش من القلوب بيسندك حباً فيك، مش طمعاً في فلوسك أو خوفاً من بطشك.\n\nسؤال للتأمل: إيه أصغر خطوة من التلاتة دي تقدر تبدأ بيها بكرة الصبح؟"},"7":{"title":"القسم السابع: جرح الطفولة، الدين الكارمي، وعلاقتك بالأطفال","text":"ليه من وإنت طفل صغير حسيت إنك \"لازم تكبر بسرعة\"، وإن قيمتك في البيت مربوطة بنجاحك ودرجاتك، وإن مفيش حد هيحميك في الدنيا دي غير دراعك؟\nسعيك المجنون ورا الفلوس والسلطة، ورفضك التام للضعف، جذورهم مدفونة في جرح طفولة اتحرمت فيها من الدفا المجاني، واتعلمت إنك لازم \"تدفع ثمن وجودك\" بالنجاح والتفوق.. زائد إن مسار رقم (8) بيحمل أقوى دين كارمي في الأرقام يخص (العدل، الظلم، واستغلال النفوذ).\n\nأولاً: جرح الطفولة والطفل الداخلي:\nأغلب أصحاب مسار الحياة رقم (8) اتعرضوا في طفولتهم لظروف قاسية شكلت شخصيتهم الصارمة، وجرحهم الأساسي بيتمثل في نقطتين:\n\n• جرح \"الطفل اللي كبر قبل أوانه\": في طفولتك، غالباً مريت بظروف (سواء فقر، فقدان أب/أم، أو تحمل مسؤولية إخواتك) خلتك تفقد براءة الطفولة بدري جداً. طفلك الداخلي اتبرمج على فكرة مرعبة: (الدنيا دي غابة، والضعيف فيها بيتداس، عشان كده أنا لازم أبقى قوي ومحتاجش لحد عشان محدش يذلني!).\n\n• جرح \"الحب المشروط بالنجاح والإنجاز\": أهلك غالباً كانوا بيقيسوا قيمتك بـ \"جبت كام في الامتحان؟ طلعت الأول ولا لأ؟\". مكنتش بتاخد حضن مجاني لمجرد إنك ابنهم، كنت بتاخد الحب كمكافأة على نجاحك. الجرح ده خلاك كبرت مهووس بالشغل والإنجاز عشان تحس إن ليك قيمة، وبقيت بتترعب من الفشل لأنه في عقلك الباطن معناه (إنك هتترفض ومحدش هيحبك). والحقيقة إنك كنت طفل محتاج حب، مش موظف محتاج تقييم. الحب مش مكافأة، الحب حق.\n\nثانياً: الدين الكارمي لمسار (8) - (كارما السلطة، المال، والعدالة الكبرى):\nفي علم الأرقام الكارمي، الرقم (8) هو رقم \"زحل\" (كوكب الكارما الصارمة والجزاء الفوري). دينك الكارمي يخص \"إساءة استخدام السلطة والمادة\".\n\n• رسالة الكارما بتاعتك: في الماضي (أو في حيوات سابقة)، ربما كنت شخصية ذات نفوذ طاغي واستخدمت سلطتك لظلم الناس، أو كنت غني جداً واحتكرت الثروة لنفسك ورفضت تساعد المحتاجين. الكون بعتك في المسار ده عشان تتعلم الدرس الأكبر: \"تطويع المادة لخدمة الروح، واستخدام السلطة لحماية الضعفاء مش لدوسهم\". الكارما بتختبرك طوال حياتك باختبارات مالية شديدة (مكاسب ضخمة تليها خسائر مفاجئة) لحد ما تتعلم إزاي تكسب بشرف، تحكم بعدل، وتكون \"وكيل\" أمين على ثروات الأرض مش مالك مستبد ليها.\n\nثالثاً: علاقتك بالأطفال والتربية (أنت كأب / أم):\n\n• مميزاتك في التربية: إنت \"الممول الأعظم والحامي القوي\"! أولادك عمرهم ما هيحتاجوا حاجة مادياً. بتوفرلهم أرقى مستوى تعليم، أحسن لبس، وبتأمن مستقبلهم بفلوس ومشاريع وعقارات. إنت السند اللي بيترجاله ولادك وقت الأزمات الكبيرة لأنهم عارفين إنك هتحل أي مشكلة في ثواني.\n\n• عيوبك في التربية (احذر منها): آفتك الكبرى هي \"إدارة البيت كأنه شركة، وتربية ولادك كأنهم موظفين!\". إنت قاسي، متطلب جداً، ومبتقبلش من ولادك غير المركز الأول. ممكن تضغط عليهم نفسياً لدرجة تخليهم يكرهوا التعليم أو يخافوا منك، وبتبخل عليهم بالحضن واللعب بحجة إنك \"بتشقى عشانهم\".\n\n• نصيحة ذهبية: ولادك مش محتاجين يعيشوا في قصر لو القصر ده مفهوش ضحك ولعب وحضن دافي. متكررش جرح طفولتك معاهم؛ حبهم حب \"غير مشروط\"، افرح بيهم حتى لو فشلوا في امتحان، وعلمهم إن قيمتهم في قلوبهم وأخلاقهم مش بس في شهاداتهم ورصيدهم.\n\nسؤال للتأمل: إيه الحاجة اللي كنت محتاج تسمعها وإنت صغير، ولسه محتاج تسمعها النهاردة؟"}},"9":{"1":{"title":"القسم الأول: شفرة الروح والجوهر","text":"(لمن مجموع تاريخ ميلاده الكامل يختزل إلى الرقم 9، أو وُلد يوم 9، 18، 27)\n\nالمعنى العاطفي والنفسي / طاقة القراءة (جوهر روحك الحقيقي):\n\nلو مسار حياتك هو الرقم (9)، فاعرف إنك \"الروح الأقدم\" في دائرة الأرقام كلها! إنت خلاصة كل المسارات اللي قبلك (من 1 لـ 8)، وجيت الدنيا دي بمهمة روحية عظيمة: \"خدمة الإنسانية، نشر الحب غير المشروط، وتعلم الدرس الأصعب.. التخلي وفك التعلق\". جوهرك بيتكون من التفاصيل دي:\n\n• تعاطف كوني وإحساس بوجع العالم: إنت قلبك عامل زي \"الرادار\" اللي بيلقط حزن الناس من غير ما يتكلموا. مبتهتمش بس بعيلتك أو دايرتك القريبة، إنت بتشيل هم البشرية كلها! لو شفت حد مظلوم أو حيوان بيتأذى، قلبك بيتقطع كأنه حتة منك، وده بيخليك \"المعالج والملاذ\" لكل المجروحين. بس خد بالك: التعاطف لو زاد عن حده، بيتحول لاستنزاف. اللي بيشيل هموم كل الناس، بيلاقي نفسه فاضي. التعاطف الحقيقي بيدي من غير ما ياخد من نفسه.\n\n• حكمة الفيلسوف وقوة التسامح: عندك حكمة فطرية بتخليك تفهم إن كلنا بنغلط وإن البشر ضعاف، عشان كده قدرتك على التسامح والعفو مرعبة (حتى مع اللي أذوك). إنت بتشوف الصورة الكبيرة ومش بتقف عند صغائر الأمور والدراما التافهة اللي بتشغل باقي الناس. بس خد بالك: التسامح مش معناه إنك تفضل تستحمل الأذى. التسامح الحقيقي بيبدأ من نفسك. لو مش سامحت نفسك، مش هتقدر تسامح حد.\n\n• النهايات والتخلي (فن ترك الأشياء ترحل): حياة مسار (9) عبارة عن \"محطة نهايات\". دايماً مطلوب منك تقفل دوائر، تنهي علاقات استنزفتك، وتودع أماكن وناس عشان توسع مكان لغيرهم. إنت جيت تتعلم إزاي تفتح إيدك وتسيب الحاجة تطير بحب، مش تقبض عليها بخوف. بس خد بالك: التخلي مش هروب. التخلي الحقيقي هو إنك تسيب الحاجة وإنت مطمن، مش إنك تسيبها وإنت خايف. اللي بيسيب بخوف، بيرجع يمسك تاني. اللي بيسيب بثقة، بيلاقي نفسه.\n\n• جوهر طاقتك في الوضع الإيجابي (طاقة النور): لما بتكون في قمة اتزانك، بتكون \"الملهم، المحسن، المعلم الروحي والفنان العبقري\" اللي بيسخر كل طاقته وفلوسه ومواهبه عشان يسيب أثر حقيقي يخلي العالم مكان أحسن. في الحالة دي، إنت زي الشمس اللي بتنور للكل، من غير ما تستنى حاجة في المقابل.\n\n• جوهر طاقتك في الوضع السلبي (طاقة الظل والانحراف): لما طاقتك بتضلم، بتغرق في \"دور الضحية، جلد الذات، الاكتئاب، والتعلق المرضي بالماضي\"! بتحس إن العالم قاسي وميستاهلش حبك، فبتقفل قلبك وتحقد، أو بتعيش دور \"الشهيد\" اللي بيضحي بنفسه عشان ناس مبتطمرش فيهم وتفضل تشتكي من جحودهم. والحقيقة إن الشهيد مش قديس، الشهيد ضحية اختار إنه يفضل ضحية. اللي بيعرف يحط حدود، هو اللي بيقدر يدي من غير ما يتأذى.\n\nسؤال للتأمل: إيه الحاجة اللي إنت متمسك بيها ومش عارف تسيبها؟ وإيه اللي بيمنعك؟"},"2":{"title":"القسم الثاني: المراية المزدوجة","text":"في مسار الحياة رقم (9)، إنت لابس قناع \"كبير العيلة والمعالج القوي\"، بس ورا القناع ده في روح مرهقة جداً من كتر ما شالت هموم البشر:\n\n• إزاي الناس بتشوفك من بره (القناع الخارجي والهالة):\nالناس بتشوفك \"الجبل اللي مابيهزهوش ريح، والملاذ الآمن اللي بيلجأوله وقت الشدة\"! هالتك بتدي انطباع إنك قوي جداً، حكيم، مش محتاج مساعدة من حد، ودايماً عندك طاقة تدي وتطبطب. في عيونهم إنت \"الأب الروحي أو الأم الروحية\"، الشخص اللي بيسامح، بيسمع، ومبيشتكيش أبداً. وعشان كده، معظم الناس بتتعامل معاك على إنك \"مضمون وموجود دايماً عشانهم\"، وبينسوا تماماً إنك إنسان بيلحق يتعب أو يضعف ومحتاج اللي يسأل عليه!\n\n• إيه اللي بيدور جواك فعلاً (حقيقتك وصراعك الداخلي السري - متلازمة المعالج المجروح):\nالحقيقة اللي مخبيها ورا ابتسامتك الهادية هي إنك \"مستنزف، حزين، وحاسس بوحدة مرعبة وسط الزحمة\"! إنت من جوه بتموت من الاحتياج إن حد يطبطب عليك من غير ما تطلب، أو حد يقولك \"ارتاح إنت، أنا هشيل عنك الشيلة دي\". صراعك السري هو إنك بتدي حب وعطاء غير مشروط، بس بتتوجع في صمت وبتنزف من جوه لما تلاقي اللي قدامك بياخد ده كأنه \"حق مكتسب\" ومبيردش حتى ربع اهتمامك، فبتحس إنك محطة الناس بترتاح فيها وتكمل طريقها وتسيبك لوحدك. والحقيقة إن اللي بيدي كل حاجة، بيفضل فاضي. اللي بيدي بحدود، بيفضل معاه حاجة لنفسه.\n\n• السر النفسي في تعاملك مع الضغوط والصدمات:\nلما بتتعرض لخذلان متكرر أو صدمة من حد بتحبه، إنت مبتنتقمش ومبتعملش دراما؛ رد فعلك هو \"الانسحاب الصامت وتشميع القلب\"! إنت بتفضل تسامح وتدي فرص كتير جداً لدرجة بتستفز اللي حواليك وبتخليهم يستغلوك، بس لما رصيد المحبة بيخلص، بتقفل باب قلبك بالضبة والمفتاح وبتمشي بهدوء قاطع ومن غير كلمة عتاب واحدة. وفي أوقات الضغط العالي والاكتئاب، بتهرب لـ \"الماضي\" وتغرق في حنين موجع لأيام قديمة ومشاعر انتهت، لأنك بتلاقي صعوبة فظيعة في فك التعلق بالذكريات. والانسحاب ده مش قوة، ده حماية. الحماية اللي بتحميك من الوجع، بس بتمنعك من الشفاء.\n\nسؤال للتأمل: إمتى آخر مرة قلت لحد \"أنا تعبان\" أو \"أنا محتاج دعم\" من غير ما تحس إنك هتبان ضعيف؟"},"3":{"title":"القسم الثالث: البلوكات الخفية ونقاط التعطيل","text":"ليه دايماً بتجذب لحياتك الناس المكسورة والمدمرة، ولما بتعالجهم ويقفوا على رجليهم بيمشوا ويسيبوك؟ وليه الماضي دايماً بيطاردك ومش بتعرف تتخطى علاقات انتهت؟\nأكبر بلوك طاقي بتطارد صاحب مسار الحياة رقم (9) هو \"التعلق المرضي بالماضي، ولعب دور المنقذ للمستنزفين\". إنت بتعطل رزقك وطاقتك لأنك بترفض تقفل الدوائر القديمة، وبتسيب بابك مفتوح لناس بتاخد نورك وتمشي.\n\nأولاً: أنماط التعطيل والعيوب الخفية لمسار رقم (9) في نقاط سريعة:\n\n• صعوبة التخلي؛ الاحتفاظ بالكراكيب المادية، الذكريات، والأشخاص المؤذيين بحجة \"العشرة والشفقة\".\n• جذب مصاصي الطاقة؛ دايماً بتلاقي نفسك المغناطيس اللي بيشد الناس اللي عندها مشاكل نفسية وعاطفية عشان تعالجهم.\n• متلازمة الضحية والشهيد؛ لما بتدي من غير حدود ومبتلاقيش تقدير، بتدخل في حالة حزن وتقول \"أنا دايماً بدي ومحدش بيقدر\".\n• غياب الحدود الشخصية؛ مبتعرفش تقول \"لأ\" لحد قاصدك في خدمة حتى لو إنت تعبان ومش قادر تصلب طولك.\n• التشتت بين المادة والروح؛ بتهمل حساباتك وفلوسك ومستقبلك المادي لأنك بتشوف إن \"الروحانيات والعطاء أهم من الفلوس\".\n\nثانياً: التحليل العميق للبلوكات الطاقية الأربعة:\nطاقة الرقم (9) عاملة زي \"نهر النيل\"؛ بيفيض بالخير على كل اللي حواليه، بس لو معملتش سدود تحمي ميتك، النهر هيجف وأرضك إنت اللي هتبور:\n\n• البلوك الأول: فخ التعلق ورفض النهايات:\nالرقم 9 هو رقم \"النهايات وإتمام الدورات\". وظيفتك الكونية إنك تقفل أبواب عشان تفتح غيرها. البلوك بيحصل لما تعاند الكون وترفض تسيب علاقة سامة، أو شغل ملوش مستقبل، أو ذكرى بتوجعك! إنت بتخاف من الفقد، فبتمسك في الميت لحد ما طاقتك إنت اللي تموت معاه، وده بيوقف أي رزق أو حب جديد إنه يدخل حياتك. والحقيقة إن اللي بيمسك في الميت، بيمنع الحي إنه يدخل. اللي بيسيب، بيفتح الباب لغيره.\n\n• البلوك الثاني: مصحة الأرواح المكسورة:\nعشان قلبك مفتوح، هالتك بتنادي على كل حد مكسور، خاين، أو ضايع. بتدخل معاهم في علاقات مش عشان بتحبهم، بس عشان \"صعبانين عليك وعايز تنقذهم\". البلوك ده بيستنزف روحك، ولما بيتعافوا بيمشوا، وإنت اللي بتقع محتاج اللي يعالجك! والحقيقة إن اللي بينقذ حد، لازم يكون واقف على أرض صلبة. اللي بينزل في الغريق عشان ينقذه، بيغرق معاه.\n\n• البلوك الثالث: كارما انعدام الحدود:\nإنت بتعتبر إن كلمة \"لأ\" أنانية وقسوة. ده بيخلي الناس تستبيح وقتك، مجهودك، وفلوسك. البلوك ده بيعملك اختناق طاقي، لأن الكون بيشوفك \"مبتحترمش نفسك ولا وقتك\"، فبيبعتلك ناس تستغلك أكتر لحد ما تتعلم تحط حد فاصل بين العطاء وبين الاستباحة. والحقيقة إن \"لأ\" مش أنانية، \"لأ\" احترام لنفسك. اللي بيعرف يقول \"لأ\"، بيعرف يقول \"أه\" من قلبه.\n\n• البلوك الرابع: وهم \"أنا لا أحتاج شيئاً\":\nمن كتر ما إنت زاهد ومعطاء، بتدخل في كبرياء روحي خفي؛ بتستكبر تطلب مساعدة، وبتستكبر تطلب حقك المادي، وبتقنع نفسك إنك \"أعلى من الماديات\". البلوك ده بيضربلك شاكرا الجذر، وبيخليك تعاني مادياً أو تعيش في فوضى لأنك رافض تتأرض في الواقع. والحقيقة إن الروحانيات مش بديل عن الحياة. الروحانيات هي اللي بتخليك تعيش الحياة أحسن.\n\nثالثاً: ثلاث خطوات لفك البلوك الطاقي (الروشتة الروحية والذهنية):\n\n• 1. الوعي والإدراك (تعديل البرمجة العقلية):\nاحفظ القاعدة الذهبية دي وحطها حلقة في ودنك: \"الشفقة ليست حباً، وإنقاذ الغرقى ليس وظيفتك إذا كنت لا تجيد السباحة!\". اتعلم إن التخلي والمغادرة هما أعلى درجات النضج. لو حاجة انتهت، ادفنها بكرامة وامشي. ولما تحب تساعد حد، ساعده وإنت واقف على بر الأمان، متطُبش معاه في الغريق عشان تنقذه!\n\n• 2. السر الباطني والطاقي (قطع الحبال الأثيرية وتفعيل التوازن):\nفي العلوم الباطنية، صاحب مسار (9) هالتك بتكون مليانة \"حبال أثيرية\" بتربطك بكل شخص ساعدته أو اتعاطفت معاه. السر الباطني لفك البلوك هو تقطيع الحبال دي يومياً بالتأمل؛ رجع لكل واحد طاقته، واسترد طاقتك. وازن بين شاكرا التاج (الروحانيات) وبين شاكرا الضفيرة الشمسية (قوة الشخصية والحدود).\n\n• 3. الصورة الذهنية للتشافي (حط الصورة دي في عقلك دايماً):\nكل ما تحس إنك مستنزف أو مش قادر تسيب حد، غمض عينك لـ 30 ثانية واستحضر الصورة دي:\n\"تخيل إنك (الشمس). الشمس بتبعت نورها ودفاها لكل الكائنات على الأرض من غير تفرقة ومن غير شروط. بس هل الشمس بتنزل من مكانها وتوطي عشان تدفي شجرة معينة بردانه؟ لأ! الشمس بتفضل محتفظة بـ (مكانتها، مدارها، وقوتها فوق)، واللي عايز الدفا هو اللي بيخرج يقف في نورها. خليك زي الشمس؛ ادي نورك للكل، بس إياك تنزل من مقامك وتضحي بكيانك عشان تدفي حد.\"\n\nسؤال للتأمل: إيه الحاجة اللي إنت متمسك بيها ومش عارف تسيبها؟ وإيه اللي بيمنعك؟\"البلوكات الطاقية\" هنا تعبير رمزي عن أنماط متكررة، مش حقيقة كونية. الأنماط دي قابلة للتغيير بالوعي والتدريب."},"4":{"title":"القسم الرابع: الشفرة العاطفية، الجواز، وكارما العلاقات","text":"ليه رغم إنك بتدي شريك حياتك حب وتسامح يكفي كوكب بحاله، دايماً بتلاقي نفسك في علاقة بتستنزفك، أو بتجذب ناس محتاجة \"علاج\" مش محتاجة \"شريك حياة\"؟\nالحب عند صاحب مسار الحياة رقم (9) هو \"عطاء كوني غير مشروط\"، بس الكارما العاطفية الأخطر عندك هي إنك بتخلط بين \"الحب\" وبين \"الشفقة\"، فبتحول بيتك لمصحة نفسية بتعالج فيها شريكك المكسور، ولما بيخف بيمشي أو بيتمرد عليك.\n\nأولاً: ملامح طبيعتك العاطفية (مميزاتك وعيوبك في الحب والجواز):\n\nسماتك كشريك عاطفي (في طاقة النور):\n- رومانسي جداً، حالم، وبتدي حب خيالي وعميق مفيش أي مسار تاني يقدر يديه.\n- متسامح لأبعد الحدود؛ بتغفر الزلات، وبتفهم نقط ضعف شريكك ومبتعايرهوش بيها أبداً.\n- شريك داعم روحياً ونفسياً؛ بتقف في ضهر شريكك في أصعب أزماته وتكون ليه الملاذ الآمن اللي بيهرب فيه من قسوة الدنيا.\n- بتدي من غير ما تستنى مقابل، وده نادر في الدنيا.\n\nعيوبك العاطفية (في طاقة الظل):\n- متلازمة فلورانس نايتنجيل (حب الممرضة للمريض): بتعشق إنقاذ المجروحين، ولما الشريك بيبقى قوي ومستقل، بتحس إن دورك انتهى وممكن تفقد الشغف!\n- العمى العاطفي وتجاهل الريد فلاجز: من كتر ما إنت بتشوف الحلو اللي جوه الناس، بتتعمى عن سوء تصرفاتهم الحالية وتدي أعذار متخلصش لحد ما تتأذي بشدة.\n- التعلق المرضي ورفض النهايات: مبتقدرش تتخطى علاقة انتهت بسهولة، وبتقعد سنين عايش على الذكريات أو بتراقب شريكك القديم.\n\nثانياً: التحليل العميق لشفرة الحب والجواز لمسار رقم (9):\n\n• مواصفات الشريك اللي بيجيبك الأرض (فتى/فتاة أحلامك طاقياً):\nإنت محتاج شريك \"ناضج، واعي، وعنده رسالة في الحياة زيك\"؛ شخص يقدر عمقك الروحي وميتريقش على مثاليتك. بتعشق الشريك اللي بيفهم لغة الفن، الجمال، والإنسانية، والأهم من ده كله.. شريك \"سوي نفسياً ومستقل\" يقف جنبك، مش شريك مكسور ترميه على كتافك! بس خد بالك: الشريك الناضج ده مش هيفضل يستحمل دور المنقذ للأبد. لو مش عبرت عن حبك من غير شفقة، ممكن يحس إنه مش محبوب، حتى لو إنت بتحبه بجد.\n\n• البلوك العاطفي وكارما العلاقات (ليه قلبك بيتوجع؟):\nاللعنة العاطفية بتاعتك اسمها \"كوب الحب المخروم\". إنت بتصب كل طاقتك، مشاعرك، ووقتك في شخص مبيعرفش يستقبل أو مبيعرفش يرد ده، لأنك بتنجذب للـ سواء مش متاحين عاطفياً أو نفسياً. الكارما هنا بتضربك عشان تتعلم إنك \"تدي لنفسك الأول\"، وإنك تستحق تاخد زي ما بتدي بالظبط مش أقل. والحقيقة إن الحب مش عطاء بلا حدود. الحب تبادل. اللي بيدي من غير ما ياخد، بيفضل فاضي.\n\n• طبيعتك في الجواز والاستقرار:\nالجواز بالنسبة لك هو \"اتحاد روحين\" مش مجرد ورقة وشراكة سكن. لو اتجوزت شخص مادي جداً أو سطحي، روحك هتنطفي وهتعيش في غربة جوه بيتك. إنت محتاج بيت يكون عامل زي \"المعبد الهادي\" اللي بتشحن فيه طاقتك. والحقيقة إن الجواز شراكة، مش مصحة. الشريك اللي بيحبك، بيحبك عشان إنت، مش عشان بتعالجه.\n\nثالثاً: خريطة التوافق الطاقي (مين ينورك ومين يطفيك؟):\n\n• أعلى توافق روحي وعاطفي (توأم الشعلة والانسجام):\n  - مع مسار رقم (3) ورقم (6): مع (3) بتلاقي البهجة والخفة اللي بتكسر كآبتك وبتفهم فنك؛ ومع (6) بتلاقي الدفا، العيلة، والشخص الوحيد اللي بيقدر يطبطب عليك زي ما إنت بتطبطب على الناس.\n  - مع مسار (9) زيك: تفاهم كوني وروحانيات عالية، بس محتاجين حد يفوقكم للواقع عشان متغرقوش في الأحلام.\n\n• علاقات التحدي والصدام (تحتاج وعي وصبر كبير):\n  - مع مسار رقم (4) ورقم (8): أرقام مادية وعملية جداً! هيشوفوك \"مثالي بزيادة أو عايش في الخيال\"، وإنت هتشوفهم \"قاسيين وماديين\". العلاقة دي محتاجة تنازلات ضخمة وممكن تكون مستنزفة جداً ليك.\n\nرابعاً: ثلاث خطوات لفك البلوك العاطفي (روشتة تشافي القلب):\n\n• 1. الوعي والإدراك العاطفي:\nاحفظ القاعدة دي كويس جداً: \"الجواز هو مشاركة بين اتنين أصحاء، مش عيادة تأهيل نفسي!\". لو لقيت نفسك في علاقة إنت فيها المعالج، الأب، الأم، والمنقذ.. اعرف إنك في المكان الغلط. اختار شريك جاهز يحبك، مش شريك محتاجك تصلحه.\n\n• 2. السر الباطني والطاقي (إغلاق الهالة ورفع الاستحقاق):\nفي العلوم الباطنية، هالة مسار (9) بتكون \"إسفنجية\" بتمتص طاقات الشريك بالكامل. السر لنجاحك العاطفي هو تفعيل شاكرا \"الضفيرة الشمسية\" عشان تعرف تحط حدود وتقول \"لأ\" لما الشريك يستغلك. ارفع استحقاقك واعرف إنك تستاهل الدلع والاهتمام من غير ما تضحي وتلعب دور الشهيد.\n\n• 3. الصورة الذهنية لتشافي العلاقات (حط الصورة دي في عقلك دايماً):\n\"تخيل إن قلبك ده (قصر فخم جداً وواسع). إنت متعود تفتح باب القصر ده وتستضيف فيه المشردين واللاجئين والمجروحين عشان تعالجهم (علاقاتك القديمة). التشافي مش إنك تقفل القصر.. التشافي إنك تعمل للقصر ده (حراس على الباب)، وماتدخلش فيه غير (الملوك والأمراء) اللي يقلعوا جزمهم بره ويقدروا فخامة المكان ويضيفوا ليه زينة وجمال، مش يدخلوه عشان يسرقوا تحفه ويمشوا!\"\n\nسؤال للتأمل: في آخر علاقة، إنت كنت بتحب، ولا كنت بتحاول تنقذ؟ وإيه اللي كان هيفرق؟"},"5":{"title":"القسم الخامس: مغناطيس المال، الوفرة، والمهنة","text":"ليه كل ما تشتغل شغلانة تقليدية لمجرد إنك تقبض آخر الشهر بتحس باختناق وروحك بتنطفي، وليه دايماً فلوسك بتطير على مساعدة غيرك؟\nمسار الحياة رقم (9) هو مسار \"الوفرة الكونية\". الفلوس مابتجيلكش من الجري وراها أو الحسابات المادية المعقدة؛ الفلوس بتنجذب ليك لما تكون بتشتغل في حاجة \"بتخدم بيها البشرية أو بتعالج بيها جروح الناس\". بس البلوك المالي الأعنف اللي بيوقف رزقك هو \"عقدة الذنب المالي والإحساس إن الفلوس حاجة بتدنس الروحانيات\".\n\nأولاً: ملامح طبيعتك المادية والمهنية (مميزاتك وعيوبك في الفلوس والشغل):\n\nسماتك المالية والمهنية (في طاقة النور):\n- رؤية عالمية: إنت مابتفكرش محلياً؛ أفكارك ومشاريعك دايماً بتستهدف شريحة كبيرة من البشر أو بتحل مشكلة إنسانية عامة.\n- مغناطيس للرزق غير المتوقع: لأنك بتدي كتير وبنية صافية، الكون بيكافئك دايماً بـ \"فرص، هدايا، أو مكاسب مفاجئة\" بتجيلك في وقت زنقة كأنها معجزة.\n- إبداع فني وروحاني: عندك قدرة تحول الألم والحكمة لفن، كتابة، أو علاج يجيبلك عائد مادي ضخم لأن الناس بتحس بصدقك.\n\nعيوبك المالية والمهنية (في طاقة الظل):\n- الإدارة المالية الكارثية: إنت مابتعرفش تمسك فلوس! ممكن تصرف ميزانية بيتك عشان تساعد صديق بيمر بأزمة، ومبتحسبش لبكرة.\n- العمل المجاني: بتتكسف تطلب تمن مجهودك، ولما حد بيستغلك في شغل بتقول \"يلا مش مهم، ثواب\"، وده بيخليك تعيش دايماً على الحافة المادية.\n- الزهد السلبي: بتقنع نفسك إن \"الفلوس مش كل حاجة\" كحجة عشان متبذلش مجهود في تأسيس بيزنس مستقر يحميك.\n\nثانياً: التحليل العميق لشفرة المال والمهنة لمسار رقم (9):\n\n• إزاي الفلوس بتجيلك؟ (شفرة الرزق والوفرة):\nشفرة ثروتك هي \"التأثير الإنساني\". الفلوس بتجري وراك لما تبطل تركز على جيبك، وتركز على \"إزاي هفيد الناس باللي بعمله؟\". كل ما قاعدة الناس اللي بتخدمهم أو بتلهمهم بتوسع، كل ما أبواب الرزق بتتفتحلك بشكل جنوني. ثروتك بتتبني على \"الثقة والمحبة\" اللي الناس بتحطها فيك.\n\n• البلوك المالي والتعطيل (إيه اللي بيبوظ عليك الفلوس؟):\nاللعنة المالية بتاعتك اسمها \"كبرياء الزاهد وعقدة الذنب\". في عقلك الباطن، إنت رابط بين \"الروحانيات والطيبة\" وبين \"الفقر والبساطة\"، وشايف إن الأغنياء جشعين. البلوك ده بيخلي عقلك يرفض الغنى عشان متفقدش هويتك كـ \"ملاك طيب\". زائد إنك مبتعملش حدود بين (الصدقة) و(رأس مال البيزنس)، فبتوزع أرباحك قبل ما تكبر مشروعك.\n\n• المجالات الأنسب لتحقيق الثروة:\nالطب والتمريض، الطب النفسي والعلاج بالطاقة، الفنون بأنواعها (تمثيل، موسيقى، رسم)، الكتابة والإعلام، المنظمات الخيرية والدولية، المحاماة وحقوق الإنسان، السفر والسياحة، والتعليم.\n\nثالثاً: ثلاث خطوات لفك البلوك المالي (روشتة جذب الثروة):\n\n• 1. الوعي والإدراك المالي:\nاحفظ القاعدة الذهبية دي: \"لكي تنقذ الفقراء، يجب ألا تكون واحداً منهم!\". الثروة مش عيب ولا بتنجس الروح؛ الثروة في إيد شخص زيك هي (أداة نور). لما تكون غني، هتقدر تبني مستشفيات، وتساعد مئات المحتاجين بدل ما تساعد واحد بس وتفلس. ارفع استحقاقك واطلب تمن خدماتك بشجاعة.\n\n• 2. السر الباطني والطاقي (ربط التاج بالجذر):\nفي العلوم الباطنية، طاقتك كلها متركزة في الشاكرات العلوية (التاج والعين الثالثة). السر عشان تجذب الفلوس (اللي هي طاقة مادية أرضية) هو إنك تفعل \"شاكرا الجذر\". لازم تعمل نظام مالي صارم (أو تجيب محاسب)، تلتزم بمواعيد، وتهتم بجسمك وأكلك، عشان تنزل أفكارك العظيمة من السحاب لأرض الواقع.\n\n• 3. الصورة الذهنية لجذب الثروة (حط الصورة دي في عقلك دايماً):\n\"تخيل إنك (خزان مياه كبير بيسقي قرية عطشانة). لو الخزان ده فضل يوزع ماية من غير ما يتملي، هيجف ويشقق والقرية كلها هتموت من العطش! وظيفتك الأولى مش إنك توزع الماية؛ وظيفتك إنك (توصل الخزان بالنهر الرئيسي وتتأكد إنه مليان وواقف على أرض صلبة). لما الخزان يفيض، الماية الزيادة هتنزل لوحدها تروي الناس من غير ما إنت تفضى. املأ جيبك وطاقتك أولاً، ثم أعطِ من الفائض.\"\n\nسؤال للتأمل: إيه الخدمة اللي إنت بتقدمها للناس ببلاش أو بأقل من قيمتها؟ وإيه اللي بيمنعك تحط سعر عادل؟\"شفرة الرزق\" و\"جذب الثروة\" هنا لغة رمزية للتأمل في عاداتك المالية، مش وعد بثراء مضمون. القرارات المالية الكبيرة محتاجة دراسة ومتخصصين."},"6":{"title":"القسم السادس: خطوات عملية تفرق معاك","text":"إزاي تبطل تحرق في أعصابك عشان تنقذ كل اللي حواليك، وترجع تحس بالسلام النفسي من غير ما تحس بالذنب أو الأنانية؟\nالتشافي لصاحب مسار رقم (9) مش معناه إنه يقسى على الناس أو يوقف عطاء؛ التشافي معناه إنه يتعلم فن \"وضع الحدود، إغلاق الدوائر المفتوحة، وإنقاذ نفسه أولاً قبل ما يغرق مع الغرقانين\".\n\nالروشتة العملية الفورية لتغيير حياتك (3 خطوات للتطبيق المباشر):\n\n• 1. خطوة \"اللاء المقدسة\" (علاج متلازمة المنقذ وانعدام الحدود):\n  - إزاي تعملها: في الأسبوع ده، اختار طلب واحد بس من حد متعود يستغلك أو يرمي حمله عليك (طلب مش مصيري ولا حياة أو موت)، وقوله بمنتهى الهدوء: \"بعتذر جداً، مش هقدر أعمل ده دلوقتي لأن طاقتي متسمحش\". ممنوع تبرر، ممنوع تعتذر كتير، وممنوع تحس بالذنب!\n  - النتيجة: عقلك الباطن هيبدأ يكسر برمجة إن \"قيمتك في إنك تكون دايماً متاح\". ولما تلاقي إن الدنيا مخربتش والشخص التاني اتصرف، هتبدأ تسترد طاقتك وتحمي هالتك من الاستنزاف.\n\n• 2. خطوة \"التعزيل والتنظيف الكارمي\" (علاج التعلق بالماضي ورفض النهايات):\n  - إزاي تعملها: الرقم 9 هو رقم النهايات. عشان تسمح للجديد يدخل، لازم تفضي مكان! افتح دولابك، تليفونك، أو أدراجك.. وارمي أو اتبرع بأي حاجة مادية بتربطك بذكرى قديمة بتوجعك (هدايا من إكس، رسايل قديمة، هدوم مبقيتش تلبسها). اعمل ده بنية \"التحرر وفك الارتباط\".\n  - النتيجة: بمجرد ما تقطع الحبال المادية دي، هتحس بـ \"خفة طاقية\" رهيبة، كأنك شلت حجر من على صدرك، والكون هيفهم رسالتك إنك \"مستعد لاستقبال بدايات جديدة\".\n\n• 3. خطوة \"الاستقبال الإجباري\" (علاج كبرياء الزاهد والشهيد):\n  - إزاي تعملها: إنت متعود تدي بس. الأسبوع ده، اجبر نفسك \"تستقبل\". اطلب من حد بيحبك إنه يعملك خدمة صغيرة (يعملك كوباية شاي، يوصلك مشوار)، ولما حد يقولك كلمة حلوة أو يعرض عليك مساعدة، ممنوع تقول \"لا شكراً أنا تمام\".. قول: \"شكراً جداً، أنا ممتن لده\"، واستقبلها بقلب مفتوح.\n  - النتيجة: هتوازن طاقة \"الأخذ والعطاء\" في شاكرا القلب، وهتبطل تلعب دور الشهيد اللي بيعاني في صمت، وهتسمح للناس إنها تعبرلك عن حبها أفعال مش بس كلام.\n\nسؤال للتأمل: إيه أصغر خطوة من التلاتة دي تقدر تبدأ بيها بكرة الصبح؟"},"7":{"title":"القسم السابع: جرح الطفولة، الدين الكارمي، وعلاقتك بالأطفال","text":"ليه من وإنت طفل صغير كنت بتحس إنك \"عجوز\" أو أكبر من سنك، وإنك مش شبه باقي الأطفال اللي بيلعبوا ومش شايلين هم حاجة؟\nصاحب مسار الحياة رقم (9) بيتولد بـ \"روح قديمة\"، وغالباً طفولته بتنسرق منه لأنه بيلعب دور \"المعالج والمصلح\" لمشاكل أهله من وهو عيل صغير. زائد إن المسار ده بيحمل كارما \"الخواتيم والنهايات\"، يعني إنت جيت الدنيا دي عشان تقفل حسابات قديمة وتدفع دين كارمي يخص التسامح وفك التعلق.\n\nأولاً: جرح الطفولة والطفل الداخلي:\nمسار رقم (9) هو أكتر مسار بيعاني من جرح اسمه \"الطفل المنقذ أو المعالج\".\n\n• جرح سرقة الطفولة: في الأغلب، إنت نشأت في بيت فيه دراما، صراعات، أو أحد الأبوين كان ضعيف ومحتاج دعم نفسي. بدل ما تعيش طفولتك وتلعب، عقلك الباطن قرر إنه لازم يكون \"حكيم وعاقل\" عشان يخفف الحمل عن أهله. بقيت إنت اللي بتطبطب، وإنت اللي بتستوعب مشاكل الكبار، ولغيت احتياجاتك كطفل تماماً.\n\n• النتيجة الحالية: كبرت وعندك صعوبة فظيعة في إنك تطلب مساعدة، لأن طفلك الداخلي متبرمج إن \"طلب المساعدة عبء على الآخرين\"، وإنت جيت الدنيا عشان تدي بس مش عشان تاخد. والحقيقة إنك كنت طفل محتاج حب، مش معالج محتاج تقييم. الحب مش مكافأة، الحب حق.\n\nثانياً: الدين الكارمي لمسار (9) - (كارما الاكتمال، التخلي، والحب الكوني):\nفي علم الأرقام، الرقم (9) هو نهاية الدورة (من 1 لـ 9). ده معناه إن روحك عاشت تجارب المسارات اللي فاتت كلها، وجات في الحياة دي عشان تعمل \"تسوية نهائية\".\n\n• رسالة الكارما بتاعتك: دينك الكارمي هو \"تعلم التخلي والمغفرة\". في حيوات سابقة، يمكن كنت متمسك جداً بأشخاص أو سلطة أو أشياء مادية لدرجة دمرت روحك. الكون بعتك في المسار ده عشان يختبر قدرتك على إنك تحب الحاجة.. ولما يجي وقتها، تفتح إيدك وتسيبها تمشي بسلام من غير ما تنهار. الاختبارات الكارمية بتاعتك دايماً بتيجي في شكل \"فقدان أو نهايات مفاجئة\"، عشان تتعلم إن الأمان الحقيقي جوه روحك مش في الأشياء أو الأشخاص اللي بره.\n\nثالثاً: علاقتك بالأطفال والتربية (أنت كأب / أم):\n\n• مميزاتك في التربية: إنت \"الأب الروحي أو الأم الروحية\" العظيمة! إنت مابتربيش مجرد أطفال، إنت بتربي \"أرواح\". بتزرع فيهم الرحمة، الإنسانية، وتقبل الآخر. بيتك بيكون ملاذ آمن لولادك وأصحابهم كمان، ولادك مبيخافوش منك لأنهم عارفين إنك هتسامحهم مهما غلطوا وهتسمعهم بقلب مفتوح.\n\n• عيوبك في التربية (احذر منها): آفتك الكبرى هي \"التدليل المفرط وانعدام الحزم\". من كتر حنيتك ورفضك إنهم يعيشوا الوجع اللي إنت عشته، ممكن تشيل عنهم كل مسؤولياتهم وتمنعهم يواجهوا عواقب أخطائهم. ده ممكن يطلع أطفال اتكاليين جداً أو مستهترين.\n\n• نصيحة ذهبية: التربية مش بس حضن وتسامح؛ التربية أحياناً بتحتاج \"كلمة لأ قاطعة\". علم ولادك يتحملوا نتيجة غلطهم عشان يطلعوا أقوياء، وماتنساش تفصل بين دورك كأب/أم وبين دور \"المنقذ\"، عشان متستنزفش كل طاقتك وتسيب نفسك فاضي.\n\nسؤال للتأمل: إيه الحاجة اللي كنت محتاج تسمعها وإنت صغير، ولسه محتاج تسمعها النهاردة؟"}}};
const LP_MASTER_SOURCE_4_7 = {"11": {"4": {"title": "القسم الرابع: الشفرة العاطفية، الجواز، وكارما العلاقات — مجاني", "text": "ليه دايماً بتحس إن شريك حياتك مش فاهم عمقك الروحي، وليه بتخاف تسلّم قلبك وتنكشف بالكامل رغم رغبتك الشديدة في لقى \"توأم الشعلة\"؟\n\nالحب عند صاحب مسار الماستر رقم (11) مش مجرد مشاعر عادية؛ إنت بتبحث عن \"تخاطر روحي واتصال هالات كامل\". البلوك العاطفي الأخطر عندك هو \"الحساسية المفرطة وتوقع إن الشريك يقرا أفكارك\"، والهروب والانعزال أول ما تحس بسوء فهم.\n\n سماتك كشريك عاطفي (في طاقة النور):\n\n• اتصال تخاطري وعاطفي نادر: بتفهم شريكك من نظرة عين، وبتحس بوجعه وزعله حتى لو بينكم بلاد ومن غير ما ينطق حرف.\n\n• إخلاص وتفانٍ روحي: لما بتختار شريك، بتشوفه \"رحلة مقدسة\"؛ بتدعمه نفسياً، بتلهمه، وبتكون مرايته الإيجابية اللي بتخليه يحب نفسه.\n\n• رومانسية ساحرة وعميقة: مابتعتمدش على المظاهر السطحية، حبك فيه بعد شعري، دافئ، ومليان مشاعر صادقة بتلمس القلب.\n\n عيوبك العاطفية (في طاقة الظل):\n\n• قراءة الأفكار والظن: من كتر حساسيتك، بتفسّر سكوت الشريك أو نبرة صوته بشكل مبالغ فيه وتعتبر إنه زعلان أو بيبعد عنك.\n\n• الانسحاب الصامت: أول ما يحصل صدام، بتقفل على نفسك في قوقعتك وتمنع الكلام بدل ما تواجه وتتكلم بوضوح.\n\n• المثالية الخيالية: بتبحث عن شريك \"كامل روحياً\"، وممكن تصطدم بالعيوب الإنسانية الطبيعية وتصاب بخيبة أمل سريعة.\n\n مواصفات الشريك المثالي (مرساتك الطاقية):\n\nإنت مش محتاج شخص يطير معاك في السحاب؛ إنت محتاج شخص \"ثابت، هادئ، ومتأرض\"! شريك يكون صخرة أمان يستوعب تقلباتك وموجات طاقتك العالية، يطمنك بمنطقه العملي، ويسمع بصيرتك باحترام من غير ما يسخر من أفكارك أو يعتبرك \"درامي\".\n\n البلوك العاطفي وكارما العلاقات:\n\nاللعنة العاطفية لمسار (11) هي \"التباعد الروحي وسوء التعبير\". لأنك بتستقبل مشاعر ضخمة، بتفترض إن الشريك \"المفروض يحس بيا ويفهمني من غير ما أتكلم!\"، ولما مابيفهمش، بتدخل في عزلة وتعتبر إنه مبيحبكش. الكارما هنا بتعلمك درس التعبير اللفظي المباشر ونزولك من عالم التخاطر لأرض الواقع اليومي.\n\n طبيعتك في الجواز والاستقرار:\n\nالجواز بالنسبة لك هو \"مساحة أمان وتناغم\". لو البيت مليان دوشة وخناقات وطاقة توتر، جهازك العصبي هينهار وهتدخل في اكتئاب. إنت محتاج شريك يقدّر حاجتك لساعات العزلة الهادئة لإعادة شحن طاقتك من غير ما يحس إنك بتبعد عنه أو بتهمله.\n\n خريطة التوافق الطاقي:\n\nأعلى توافق روحي وعاطفي (التوازن والاستقرار):\n- مع مسار (2): تفاهم رقيق وانسجام نفسي.\n- مع مسار (4): بتلاقي \"المرساة الصلبة\" اللي بتحميك وتثبتك في الواقع وتديك الأمان العملي اللي ناقصك.\n- مع مسار (7): اتصال فكري وروحاني عميق، هتقضوا ساعات في حوارات فلسفية وروحية ملهمة ومحدش فيكم هيزهق من التاني.\n\nعلاقات التحدي (تحتاج وعي وحذر):\n- مع مسار (1) و (8): طاقات نارية ومادية قوية جداً؛ نبرتهم الصارمة وسيطرتهم ممكن تدوس على جهازك العصبي وتخليك تحس بالاختناق لو مفيش تقدير متبادل لحساسيتك.\n- مع مسار (5): حركته السريعة وعدم استقراره هيسببولك قلق وتوتر مستمر يرهق هالتك.\n\nثلاث خطوات لفك البلوك العاطفي:\n\n1. الوعي والإدراك العاطفي:\nاحفظ القاعدة دي: \"البشر لا يملكون رادارات تخاطرية مثلك؛ تكلّم بلسانك لكي تُفهَم!\". بطل تفترض إن الشريك قاصد يجرحك، وبطل تنتظر منه يقرا سكوتك. قول بوضوح: \"أنا محتاج كذا، والكلام الفلاني ضايقني\". البساطة في التعبير هتحميك من معظم دراما الخيال.\n\n2. السر الباطني والطاقي (درع الحماية المشترك):\nفي العلوم الباطنية، صاحب مسار (11) بيمتص عصبية ونكد الشريك ويدخله جواه. السر هو تقنية \"الفقاعة الضوئية\": قبل ما تقعد مع شريكك لو كان مشحون أو غضبان، تخيّل ضوءاً أبيض أو بنفسجياً بيحيط بيك وبيسمح بس للحب بالدخول، ويمنع امتصاص التوتر.\n\n3. الصورة الذهنية لتشافي العلاقات:\nتخيّل إنك طائرة ورقية ملونة وجميلة جداً بتطير عالي في السما بين السحاب والأفكار الملهمة. الشريك الصح في حياتك مش اللي يطير جنبك في الهوا — الشريك الصح هو الشخص اللي ماسك الخيط بتاعك بإيد ثابتة وواقف على الأرض. هو اللي بيحميك إن الريح تطيرك وتضيعك، وهو اللي بيسمحلك تعلى وترجع تنزل في حضنه بأمان. قدّر قيمة الخيط اللي ماسكك في الواقع.\n\n خطوة عملية واحدة النهارده: في أول موقف تحس فيه إن شريكك \"مش فاهمك\"، قول جملة واحدة صريحة: \"اللي حسيته دلوقتي إن… وأنا محتاج…\" — من غير اتهام.\n\n سؤال للتأمل: إنت بتحب الشريك اللي يشبهك في الحساسية، ولا اللي يثبتك في الأرض؟ وليه؟"}, "5": {"title": "القسم الخامس: مغناطيس المال، الوفرة، والمهنة — مجاني", "text": "ليه دايماً بتحس بصراع بين \"حبك للروحانيات والإلهام\" وبين \"متطلبات المادة والفلوس\"؟ وليه الوظائف التقليدية بتخنقك وتصيبك بالاكتئاب؟\n\nمسار الماستر رقم (11) هو مسار \"الرائي والملهم\". طاقتك مش معمولة للشغل الروتيني ولا لحسابات الورقة والقلم المملة؛ الفلوس بتنجذب ليك لما توظّف بصيرتك وأفكارك الاستثنائية في إلهام وتوجيه وتطوير غيرك. لكن البلوك المالي الأخطر اللي بيعطلك هو \"الخوف من التسويق لنفسك واحتقار العالم المادي\".\n\n سماتك المهنية والمالية (في طاقة النور):\n\n• أفكار سابقة لعصرها: بتشوف اتجاهات المستقبل قبل ما تحصل بسنين، وبتطرح أفكار مشاريع مبتكرة وغير تقليدية.\n\n• كاريزما التأثير والإلهام: لما بتتكلم بشغف عن فكرة أو منتج، الناس بتصدقك وتقتنع فوراً لأن طاقتك بتوصل للقلب قبل العقل.\n\n• القدرة على القيادة الروحية والفكرية: بتنجح جداً في توجيه الفرق وإخراج أفضل ما فيهم لما تكون في موقع استشاري أو قيادي ملهم.\n\n عيوبك المهنية والمالية (في طاقة الظل):\n\n• فوبيا الالتزام والروتين: مبتستحملش بيئة العمل المقيّدة بساعات حضور صارمة وقوانين جافة؛ طاقتك بتهرب وبتفقد شغفك بسرعة.\n\n• صعوبة التنفيذ على الأرض: بتولّد أفكار عبقرية بالمئات، بس بتكسل أو بتخاف تدخل في تفاصيل التنفيذ اللوجستية والمالية المعقدة.\n\n• الشعور بالذنب تجاه المكسب المادي: عقلك الباطن أحياناً بيربط بين \"أخذ مقابل عالي\" وبين \"فقدان النقاء الروحي\"، فبتطلب أسعار قليلة أو بتشتغل ببلاش.\n\n إزاي الفلوس بتجيلك؟ (شفرة الوفرة لـ 11):\n\nرزقك مربوط بـ \"مستوى اتصالك برسالتك وقدرتك على التأثير الإيجابي\". الفلوس بتجري وراك لما تقدّم استشارات، حلول مبتكرة، فن فريد، أو قيادة فكرية. لما الناس تحس إن وجودك بينوّرلهم طريقهم وبيوفر عليهم سنين من الحيرة، هيدفعوا أرقام ضخمة مقابل وقتك وخبرتك.\n\n البلوك المالي (إيه اللي بيوقف رزقك؟):\n\nاللعنة المالية لمسار (11) هي \"الانفصال التام عن الواقع\". تقعد ترسم خطط خيالية في دماغك وماتنزلش خطوة واحدة تبيع أو تعلن. لازم تدرك إن الفكرة اللي متتحولش لمنتج أو خدمة ملموسة في السوق ملهاش قيمة مادية.\n\n المجالات الأنسب لتحقيق الثروة:\n\nالإرشاد النفسي والروحي، الفنون البصرية والموسيقى، الكتابة والتأليف، العلاقات العامة والإعلام، التكنولوجيا المبتكرة والذكاء الاصطناعي، التصميم والإبداع، وإدارة الابتكار.\n\nثلاث خطوات لفك البلوك المالي:\n\n1. الوعي والإدراك المالي:\nاحفظ المعادلة دي: \"المال هو طاقة تُقاس بمدى القيمة التي تمنحها للآخرين!\". لما تطلب حقك المالي كاملاً، إنت بتدي لنفسك استقرار يسمحلك تكمل رسالتك وتلهم ناس أكتر. التقدير المادي هو احترام لبصيرتك وموهبتك.\n\n2. السر الباطني والطاقي (تحالف الرائي مع المنفّذ):\nفي العلوم الباطنية، رقم 11 هو طاقة هوائية/روحية عالية. عشان تجسّد الفلوس في المادة، شكّل فريق أو شراكة مع أشخاص يحملون مسارات أرضية وعملية (زي 4 أو 8)؛ إنت تولّد الرؤية والإلهام، وهما يمسكوا الأرقام والعقود والتنفيذ الصارم.\n\n3. الصورة الذهنية لجذب الثروة:\nتخيّل إن أفكارك الملهمة دي عبارة عن بروق ورعود بتنزل من السما شايلة طاقة هائلة. الطاقة دي لو نزلت في الصحراء في الهوا هتضيع وتتلاشى — لكن لو بنيت ليها محطة توربينات وأسلاك سميكة على الأرض، كل ومضة برق هتحولها لكهربا تنوّر مدينة كاملة وتدخل دهب ومكاسب مستمرة. انزل للأرض واصنع شبكة التنفيذ اللي تحوّل ومضاتك لثروة.\n\n خطوة عملية واحدة النهارده: اختار فكرة واحدة من أفكارك \"العبقرية\" واكتب لها 3 خطوات تنفيذ صغيرة جداً — ونفّذ أول خطوة النهارده قبل ما تنام.\n\n سؤال للتأمل: إيه الفكرة اللي إنت مأجلها من سنين بحجة \"مش وقتهاش\"؟ وإيه أصغر خطوة تقدر تاخدها فيها بكرة؟"}, "6": {"title": "القسم السادس: خطوات عملية تفرق معاك — مجاني", "text": "إزاي تطفي نيران التفكير الزائد والقلق والكهربا المشحونة في أعصابك، وتتعلم إزاي تحمي هالتك من الاستنزاف اليومي من غير ما تقفل بصيرتك؟\n\nالتشافي لصاحب مسار الماستر (11) مش معناه إنك تكتم حساسيتك الفطرية؛ التشافي هو إنك تتعلم تعمل لنفسك \"سلك أرضي\" يحميك من الصعق الطاقي ويثبت رجلك في الواقع.\n\n3 خطوات للتطبيق المباشر:\n\n1. خطوة \"تفريغ التيار العالي\":\n- إزاي تعملها: خصص 10 إلى 15 دقيقة يومياً للتأريض الجسدي المباشر: امشي حافي القدمين على رمل، نجيل، أو تراب، أو خد حمام ماية دافية بملح بحري خشن بنية تفريغ الطاقات اللي امتصتها هالتك طول اليوم.\n- النتيجة: الصداع النصفي والتوتر العضلي المجهول في الرقبة والكتفين هيبدأوا يختفوا، وهالتك هتتخلص من شوائب طاقات الناس اللي قعدت معاهم.\n\n2. خطوة \"قفل شبابيك الهالة\":\n- إزاي تعملها: قبل ما تنزل من بيتك أو تدخل مكان زحمة (مول، مواصلات، تجمعات عمل)، غمّض عينك 10 ثواني، وتخيّل فقاعة أو كبسولة من الضوء البنفسجي أو الأبيض الذهبي بتحيط بجسمك من كل اتجاه. انوِ بوضوح: \"هالتي تستقبل فقط النور والخير، ومغلقة تماماً أمام أي طاقة توتر أو حزن لا تخصني\".\n- النتيجة: هتبطل ترجع البيت منهك أو حاسس بنكد مش بتاعك، وهتحافظ على شحنتك النفسية والذهنية لنفسك بس.\n\n3. خطوة \"قاعدة الـ 5 دقايق للتنفيذ الفوري\":\n- إزاي تعملها: أول ما تجيلك ومضة إلهام أو فكرة مشروع ملهمة، امنع عقلك إنه يدخل في دوامة الشك وشلل التحليل. معاك 5 دقايق بس تاخد \"أول خطوة مادية صغيرة جداً\": اكتب الفكرة في نوتة، ابعت إيميل استفسار، أو احجز دومين للمشروع.\n- النتيجة: هتجبر الطاقة الروحية الهوائية إنها تتجسد في خطوة مادية على الأرض قبل ما يلحق الخوف يقتلها في مهدها.\n\n4. خطوة \"ورقة آخر اليوم\":\n- إزاي تعملها: قبل النوم بربع ساعة، اكتب 3 سطور: إيه اللي حسيت بيه النهارده؟ إيه اللي كان بتاعي؟ وإيه اللي كان من الناس حواليا؟ التفريق ده بيعلّم عقلك يميّز مشاعرك من مشاعر غيرك.\n- النتيجة: دماغك هتبطل تلف بالليل لأن الأفكار خرجت على ورق، وهتصحى أخف.\n\n حاجات تتجنبها وقت التعب: كتر الأخبار والسوشيال قبل النوم، والسهر في أماكن مزدحمة من غير راحة بعدها، وكتر المنبهات. الحساسية العالية بتحتاج مدخلات أقل وأهدى.\n\n مقياس الأسبوع: بعد 7 أيام شوف كام مرة قدرت تفرّق بين إحساس ليك وإحساس من حد تاني. الرقم ده هو مقياس التقدم الحقيقي، مش كمية التأمل.\n\n خطوة عملية واحدة النهارده: اعمل \"قفل الهالة\" قبل ما تنزل، وامشي 10 دقايق حافي، واكتب ومضة واحدة في نوتة — التلاتة دول مش هياخدوا منك نص ساعة.\n\n سؤال للتأمل: إيه أكتر حاجة بتستنزفك طاقياً في يومك؟ وإيه أصغر حد تقدر تحطه بينك وبينها؟"}, "7": {"title": "القسم السابع: جرح الطفولة، الدين الكارمي، وعلاقتك بالأطفال — مجاني", "text": "ليه من وإنت طفل صغير كنت بتحس بـ \"غربة مريبة\" وسط أهلك والمدرسة، وليه كنت بتشوف أو تحس بحاجات الكبار نفسهم مبيفهموهاش وبيعتبروها دلع أو تهيؤات؟\n\nأصحاب مسار الماستر (11) بيتولدوا بجهاز استقبال فائق الدقة في عالم مادي خشن. طفولتك غالباً كانت مسرحاً لجرح \"سوء الفهم والعزلة الإجبارية\"، حيث عوقبت حساسيتك وبصيرتك باعتبارها ضعفاً — بالإضافة إلى دين كارمي يخص الشجاعة في إظهار النور دون خوف من الرفض.\n\n جرح الطفولة والطفل الداخلي:\n\n• جرح \"الكائن الفضائي الغريب\":\nفي طفولتك، كنت طفلاً شديد الحساسية للمشاعر غير المنطوقة؛ بتحس بنكد الأب أو قلق الأم حتى لو كانوا بيضحكوا. ولما كنت تعبّر عن إحساسك أو تقول \"أنا حاسس إن في مصيبة هتحصل\" أو تشوف رؤى وأحلام غريبة، الرد الغالب من الأهل كان: \"إنت بتتدلع، بطل تخاريف وعيش زي إخواتك\". الجرح ده علّم طفلك الداخلي إنه \"غير طبيعي أو مجنون\"، فقرر يكتم حواسه ويشك في حدسه عشان يقدر يعيش وسط الناس.\n\n• جرح الصدمة العصبية المبكرة:\nالبيئات المليانة صراخ، خناقات أسرية، أو قسوة مدرسية كانت بالنسبة لجهازك العصبي الحساس أشبه بـ \"صعق كهربائي متواصل\". النتيجة هي كبت الطفل الداخلي جوه قوقعة خوف، وتفضيله للعوالم الخيالية، الرسم، أو القراءة كمهرب من الواقع المؤلم.\n\n الدين الكارمي لمسار (11) — كارما الشجاعة الروحية وكسر الصمت:\n\n• رسالة الكارما:\nالرقم الماستر 11 لا يأتي لروح مبتدئة؛ هو رقم لروح حملت الحكمة في حيوات سابقة، لكنها ربما \"سكتت عن الحق خوفاً من بطش المجتمع أو تراجعت عن رسالتها الروحية تحت وطأة التهديد\". دينك الكارمي في هذه الحياة هو \"امتلاك الشجاعة لمشاركة نورك وبصيرتك علناً\".\n\n• الاختبار الكارمي:\nالكون بيضعك في مواقف تتكرر فيها محاولات التشكيك في عقلك وقدراتك. الاختبار الحقيقي هو أن تثق في وحيك الداخلي دون الحاجة إلى موافقة أو تصفيق القطيع، وأن تقود الآخرين بالقدوة الروحية حتى لو واجهت الاستغراب في البداية.\n\n علاقتك بالأطفال والتربية:\n\n• مميزاتك في التربية:\nإنت الأب/الأم \"المستبصر(ة)\"! بتفهم طفلك من غير ما يتكلم، وبتلقط زعله وخوفه في ثوانٍ. بتوفر لأولادك بيئة آمنة نفسياً وروحياً، وبتنمي فيهم الخيال، حب الفنون، والتعاطف مع كل الكائنات الحية. أطفالك بيلاقوا فيك الصدر الحنين اللي مش هيحكم عليهم بقسوة ولا هيسخف من مشاعرهم.\n\n• عيوبك في التربية (احذر منها):\n- نقل التوتر والقلق الطاقي: لأنك كائن قلوق بطبعك، ممكن تنقل لأولادك فوبيا غير مبررة من العالم والأمراض والناس، وتخليهم مرعوبين ومترددين زيك.\n- غياب الحزم والقواعد الصلبة: حساسيتك الزيادة بتخليك تكره تعاقب أو تحط قوانين واضحة، وده بيخلي الأبناء يفتقدوا الإحساس بالحدود والأرضية الثابتة.\n\n نصيحة ذهبية:\nافصل بين هالتك وهالة أولادك؛ مش كل ما طفلك يحس بوجع معناه إن العالم انتهى. سيبه يغلط ويتعلم، ودربه على القوة والشجاعة في مواجهة الحياة العملية بجانب تنمية روحه ومشاعره.\n\n كيف بيظهر الجرح ده في حياتك اليوم:\n\n• لما حد يقول لك «إنت حساس زيادة»، بتحس بإحساس قديم في صدرك وبتسكت.\n• بتشرح أفكارك بحذر، وبتبدأ بـ«ممكن كلامي يبان غريب».\n• بتفضل تحكي عن الحاجات اللي حسيتها بعد ما تتأكد إنها اتحققت، عشان تحمي نفسك من «إنت بتتخيل».\n\n رسالة لطفلك الداخلي: إنك ماكنتش غريب، كنت بتشوف بدري. والحساسية ماكنتش عيب، كانت محتاجة حد يفهمها. اقعد 5 دقايق وقولها لنفسك بصوتك: «أنا صدقتك، وأنا هنا دلوقتي».\n\n ما يساعد في الشفاء: صحبة ناس بتسمعك من غير ما تقيّم، ومساحة تعبّر فيها بالكتابة أو الرسم، وتجارب صغيرة تثبت لك حدسك بالواقع بدل ما تكتمه.\n\n خطوة عملية واحدة النهارده: اكتب في نوتة جملة واحدة كنت محتاج تسمعها وإنت صغير — وقولها لنفسك بصوت مسموع.\n\n سؤال للتأمل: إيه الحاجة اللي كنت محتاج تسمعها وإنت صغير، ولسه محتاج تسمعها النهاردة؟"}}, "22": {"4": {"title": "القسم الرابع: الشفرة العاطفية، الجواز، وكارما العلاقات — مجاني", "text": "ليه دايماً شريك حياتك بيشتكي من إنك بتعامله كأنه \"مشروع أو موظف في شركتك\"، وليه بتلاقي صعوبة فظيعة في إنك تظهر ضعفك أو تعبر عن مشاعرك بكلمات دافية؟\n\nالحب عند صاحب مسار الماستر رقم (22) هو \"عهد أمان، شراكة استراتيجية، وبناء مستقبل مشترك\". البلوك العاطفي الأخطر عندك هو \"الجفاف العاطفي وتحويل العلاقة لجدول واجبات ومسؤوليات\"، والهروب للشغل كل ما المشاعر تزيد عن حدها.\n\n سماتك كشريك عاطفي (في طاقة النور):\n\n• حماية وأمان مطلق: إنت الصخرة الحقيقية؛ شريكك معاك بيكون متأكد إن مستقبله ومستقبل بيته في أمان تام، ومحدش يقدر يمسه بسوء.\n\n• إخلاص ووفاء طويل المدى: مابتلعبش بالمشاعر، ولما تدي كلمتك في علاقة، بتكون ملتزم بيها زي العقود الحديدية مدى الحياة.\n\n• شريك داعم للنجاح: بتبني شريك حياتك، بتشجعه ينجح، وبتديه خطط ودعم عملي يحقق بيه طموحاته.\n\n عيوبك العاطفية (في طاقة الظل):\n\n• البرود وإخفاء المشاعر: بتعتبر التعبير عن الضعف أو الرومانسية المفرطة عيباً أو مضيعة للوقت، فبتبخل بالكلام الحلو والأحضان.\n\n• التسلط وفرض الرأي: بتدير البيت بأسلوب \"مجلس الإدارة\"؛ قراراتك لازم تتنفذ، وأي اعتراض بتعتبره تمرد على النظام العام.\n\n• تقديم المادة على الوجود الإنساني: بتعوض غيابك وانشغالك بالفلوس، وتستغرب لما شريكك يزعل ويقولك \"أنا عايزك إنت مش عايز فلوسك!\".\n\n مواصفات الشريك المثالي (ملكة/ملك الإمبراطورية):\n\nإنت محتاج شريك \"قوي، ناضج، وعنده ذكاء عاطفي ودبلوماسي عالي\"؛ شخص يستوعب انشغالك بمسؤولياتك الكبرى وميعملش دراما على تفاهات، لكن في نفس الوقت يكون عنده \"حنية دافية\" تذوب قناع الجدية بتاعك وتفكرك بإنك إنسان محتاج يرتاح ويتحب.\n\n البلوك العاطفي وكارما العلاقات:\n\nاللعنة العاطفية لمسار (22) هي \"العلاقة التعاقدية الباردة\". الكارما بتختبرك بإنها تحطك مع شريك عاطفي جداً أو حساس، عشان يجبرك تكسر قشرة الحديد وتفتح شاكرا القلب. لو فضلت تقيس الحب بالخدمات والمصالح، هتعيش وحيداً جوه قصرك.\n\n طبيعتك في الجواز والاستقرار:\n\nالجواز عندك مشروع عمر كامل وهيكل استقرار. بتنجح جداً في تأسيس بيت منظم ومستقر مادياً واجتماعياً، بس التحدي الدائم هو الحفاظ على الدفء والرومانسية وسط زحمة مشاريعك وأهدافك.\n\n خريطة التوافق الطاقي:\n\nأعلى توافق روحي وعاطفي (الشراكة المتوازنة):\n- مع مسار (4) و (8): تفاهم استراتيجي خرافي؛ بيفهموا لغة البيزنس والمسؤولية والعمل، ومشاريعكم مع بعض هتكون إمبراطورية لا تُقهر.\n- مع مسار (2) و (6): هما \"القلب الحنون\" اللي بيعوض جفافك؛ هيدخلوا الدفا، الأولاد، والرعاية لبيتك وهيخلوك تحس بقيمة الحياة الأسرية.\n\nعلاقات التحدي (تحتاج مجهود ضخم):\n- مع مسار (5): عدم استقراره وتقلباته وتمرده على القواعد هيستفز عقليتك المنظمة ويعملك شلل عصبي.\n- مع مسار (9): صراع بين مثاليات 9 وتنازله عن الماديات، وبين واقعيتك وتأسيسك المادي الصارم.\n\nثلاث خطوات لفك البلوك العاطفي:\n\n1. الوعي والإدراك العاطفي:\nاحفظ القاعدة دي كويس: \"البيت مش فرع للشركة، وشريك حياتك ليس موظفاً في إمبراطوريتك!\". انزل من برج السيطرة لما تدخل باب البيت؛ اقلع رتبك ومسؤولياتك بره، واسمع لشريكك بقلبك مش بعقلك الاستراتيجي.\n\n2. السر الباطني والطاقي (إذابة درع الهالة وتفعيل القلب):\nفي العلوم الباطنية، هالة صاحب مسار 22 محمية بدرع سميك يمنع تدفق طاقة الحب اللطيفة. السر هو تخصيص وقت \"للصمت المشترك واللمس الحنون\" بدون كلام أو نقاشات في البيت؛ المساج، التأمل المشترك، أو حتى المشي في الطبيعة يفتح قنوات التواصل الروحي غير اللفظي.\n\n3. الصورة الذهنية لتشافي العلاقات:\nتخيّل إنك قلعة حربية ضخمة مبنية من أقوى صخور الجرانيت. القلعة دي بتحمي كل اللي جواها من العواصف والأعداء. بس القلعة دي لو مفهاش حديقة خضراء، ورد، ونافورة ماية بتجري، هتتحول لسجن كئيب يهرب منه أصحابه. شريك حياتك هو الوردة والحديقة دي؛ اهتم تسقيها عشان تفضل ريحة القلعة حلوة وتستاهل تعيش فيها.\n\n خطوة عملية واحدة النهارده: أول ما تدخل البيت النهارده، اقعد مع شريكك 10 دقايق من غير موبايل ولا كلام شغل — اسأله \"إنت عامل إيه النهارده؟\" واسمع بقلبك مش بعقلك.\n\n سؤال للتأمل: في آخر موقف بينكم، إنت كنت بتدير ولا كنت بتحب؟ وإيه اللي كان هيفرق لو سمعت بقلبك؟"}, "5": {"title": "القسم الخامس: مغناطيس المال، الوفرة، والمهنة — مجاني", "text": "ليه دايماً عقلك مبيعرفش يرضى بمرتب ثابت أو مشروع صغير، وليه بتحس إن كل أزمة اقتصادية هي فرصة ذهبية ليك لبناء ثروة ضخمة؟\n\nمسار الماستر رقم (22) هو مسار \"الهندسة المالية التاريخية وصناعة الأصول الكبرى\". الفلوس مابتجيلكش من المعاملات الفردية البسيطة؛ الفلوس بتنجذب ليك لما تصمم \"منظومات، مؤسسات، وبنية تحتية\" تشغّل مئات البشر. لكن البلوك المالي الأخطر اللي بيعطلك هو \"الخوف من اتخاذ خطوة الانطلاق الأولى، والغرق في حسابات المخاطر المفرطة\".\n\n سماتك المهنية والمالية (في طاقة النور):\n\n• عقلية الأصول الدائمة: مابتجريش ورا \"الكاش اللحظي\"؛ تفكيرك كله في بناء أصول وعقارات وشركات تورث لأجيال وتولد تدفقات نقدية مستمرة.\n\n• البراعة اللوجستية والتنظيمية: بتعرف تركب التروس المعقدة للبيزنس؛ إدارة سلاسل الإمداد، تمويل المشاريع الضخمة، والربط بين الكفاءات البشرية.\n\n• الهدوء التام وسط الانهيارات: لما الأسواق تنهار والكل يتخبط، عقلك الاستراتيجي بيشتغل بأعلى كفاءة لاقتناص الأصول بأفضل الأسعار وبناء قواعد التوسع القادم.\n\n عيوبك المهنية والمالية (في طاقة الظل):\n\n• التردد بداعي انتظار \"الوقت المثالي\": تفضل ترسم دراسات جدوى بالسنين، وماتنزلش السوق لأنك حاسس إن في ثغرة صغيرة محتاجة تعديل.\n\n• اختناق التفاصيل: بتستهلك طاقتك الذهنية في متابعة فواتير صغيرة كان ممكن موظف مبتدئ يخلصها، وده بيعطلك عن التفكير الاستراتيجي الكبير.\n\n• البخل في مكافأة الشركاء والكفاءات: في طاقة الظل، بتشوف إن نجاح المنظومة هو بفضل عبقريتك التخطيطية وحدك، فبتبخل في توزيع الأرباح بنسبة عادلة مما يدفع شركاءك للانسحاب.\n\n إزاي الفلوس بتجيلك؟ (شفرة الوفرة لـ 22):\n\nشفرة رزقك هي \"توسيع النطاق وخدمة المصلحة العامة\". الكون بيديك تمويل غير محدود لما يكون مشروعك بيهدف لحل مشكلة حقيقية لآلاف الناس (بناء مساكن، تطوير بنية تحتية، تصنيع، تكنولوجيا تخدم قطاعات كبرى). الفلوس بتجري وراك لما تبني \"السيستم\" مش لما تشتغل بإيدك.\n\n البلوك المالي (إيه اللي بيوقف تدفق أموالك؟):\n\nاللعنة المالية لمسار (22) هي \"كارما الاحتكار والجشع المادي\". لو استغليت ذكاءك التنظيمي عشان تبني احتكار يدوس على صغار المستثمرين أو تتهرب من مستحقات العاملين، طاقة بلوتو وزحل بتضربك بـ \"عقوبات تنظيمية وقانونية مفاجئة\" تهد أركان المؤسسة.\n\n المجالات الأنسب لتحقيق الثروة والسيادة:\n\nالتطوير العقاري والمقاولات العملاقة، التمويل الاستثماري والبنوك، التصنيع وسلاسل الإمداد، إدارة المدن الذكية، التكنولوجيا والبنية التحتية السحابية، والوزارات والمناصب التخطيطية الكبرى في الدولة.\n\nثلاث خطوات لفك البلوك المالي:\n\n1. الوعي والإدراك المالي:\nاحفظ المعادلة دي: \"القيمة ليست في حيازة المال، بل في تحريكه لبناء واقع جديد!\". الفلوس في يدك هي طاقة بناء حضاري. ادفع أجور من يعملون معك بسخاء، واجعلهم يشعرون بأنهم شركاء في الحلم، ليحملوا عنك عبء التفاصيل وتتفرغ أنت للقيادة.\n\n2. السر الباطني والطاقي (إطلاق سراح المركزية):\nفي العلوم الباطنية، البلوك المالي لرقم 22 ينتج عن احتباس الطاقة في رأس الهرم. السر لتفجير الوفرة هو بناء \"هيكل قيادي موثوق\". ضع نظام تفويض صارم مع مؤشرات أداء واضحة، ودع المنظومة تعمل دون الحاجة لوجودك اليومي في كل زاوية.\n\n3. الصورة الذهنية لجذب الثروة:\nتخيّل أنك مهندس السد العالي. السد لا يقف ليحجز كل قطرة ماء لنفسه، بل يبني الجدران الضخمة ويفتح التوربينات ليسمح للماء بالتدفق المنظم. كلما تدفقت المياه بقوة، كلما ولدت كهرباء تنور مدناً كاملة وتجلب عائدات مستمرة دون انقطاع. صمم التوربينات، واجعل الوفرة تتدفق من خلالك للجميع.\n\n خطوة عملية واحدة النهارده: اختار 3 مهام روتينية بتعملها بنفسك كل يوم، وفوض واحدة منهم لحد في فريقك النهارده — وسيبه ينفذها بطريقته.\n\n سؤال للتأمل: إيه اللي بيخليك متمسك بكل حاجة بإيدك؟ خوف من الفشل ولا حب للسيطرة؟ وإيه اللي ممكن يحصل لو سيبت شوية؟"}, "6": {"title": "القسم السادس: خطوات عملية تفرق معاك — مجاني", "text": "إزاي توقف استنزاف طاقتك وصحتك في تفاصيل الشغل اللوجستية، وتكسر فخ التردد عشان تبدأ تجسد مشاريعك الكبيرة على أرض الواقع؟\n\nالتشافي لصاحب مسار الماستر (22) مش معناه إنه يقلل طموحه أو يتنازل عن مشاريعه العملاقة؛ التشافي معناه إنه يتعلم فن \"تفكيك الأهداف الكبرى لخطوات صغيرة، وكسر هوس السيطرة والتفويض الذكي\".\n\n3 خطوات للتطبيق المباشر:\n\n1. خطوة \"قاعدة الـ MVP وكسر شلل الكمال\":\n- إزاي تعملها: لو عندك مشروع ضخم أو فكرة بيزنس معقدة في دماغك ومش عارف تبدأ منين، احذف 80% من التفاصيل والمميزات المتقدمة. ركّز بس على \"نسخة أولية مصغرة جداً\" تقدر تنزلها السوق أو تعرضها على شريك في خلال أسبوعين كحد أقصى.\n- النتيجة: هتكسر فوبيا البدايات وتتخلص من رعب الفشل التاريخي، وهتختبر السوق بأقل تكلفة ومجهود قبل ما تضخ استثماراتك الضخمة.\n\n2. خطوة \"التفويض الإداري الصارم\":\n- إزاي تعملها: اعمل قائمة بكل المهام اللي بتعملها يومياً. اختار أقل 3 مهام من حيث القيمة الاستراتيجية (زي الرد على رسائل روتينية، تنظيم مواعيد، أو مراجعة حسابات بسيطة)، وفوضها لمساعد أو موظف عندك فوراً، مع وضع مؤشر واضح لتقييم النتيجة في نهاية الأسبوع دون التدخل في طريقة التنفيذ.\n- النتيجة: هتوفر ما لا يقل عن ساعتين إلى 3 ساعات يومياً من طاقتك الذهنية، وهتفرغ مساحة في دماغك للتخطيط التوسعي وبناء العلاقات الاستراتيجية.\n\n3. خطوة \"التأريض الجسدي وفك التصلب\":\n- إزاي تعملها: لأن ضغط المسؤولية بيتخزن في عضلات رقبتك وضهرك وجهازك الهضمي، الزم نفسك بجلسة تدليك (مساج) أسبوعية أو 20 دقيقة تمدد وإطالات يومياً مع تمارين تنفس بطيء من البطن.\n- النتيجة: هتذيب التشنج العصبي اللي حبسته في جسمك طول أسبوع الشغل، وهتخفض هرمون الكورتيزول وتمنع الانهيار الجسدي المفاجئ.\n\n4. خطوة \"اجتماع مع نفسك كل أسبوع\":\n- إزاي تعملها: كل أسبوع خد 20 دقيقة تراجع فيها: إيه اللي اتنجز؟ إيه اللي اتأجل وليه؟ إيه اللي ممكن أشيله من القائمة تمامًا؟ الشطب مهم زي الإنجاز.\n- النتيجة: هتبطل تشيل مهام ميتة في دماغك، وتشوف الأولويات الحقيقية.\n\n علامات إنك بتبني صح: الشغل ماشي في غيابك ولو بسيط، وناسك بتاخد قرارات صغيرة من غير ما ترجعلك، وإنت لسه عندك طاقة تقعد مع ناسك بعد اليوم.\n\n علامات إنك بتستنزف: بتعيد شغل غيرك بنفسك كل مرة، وبتحس إن الراحة ذنب، وكلامك مع أهلك بقى كله عن الشغل. لو شفت علامتين، قلل حاجة من الحمل الأسبوع ده.\n\n خطوة عملية واحدة النهارده: اعمل تمرين تنفس بطيء 5 دقايق قبل ما تنام — شهيق 4 ثواني، حبس 4، زفير 6. وهتلاقي جسمك بدأ يفك.\n\n سؤال للتأمل: إيه أكتر حاجة بتستهلكك جسدياً في يومك؟ وإيه أصغر تعديل تقدر تعمله عشان تخفف الحمل ده؟"}, "7": {"title": "القسم السابع: جرح الطفولة، الدين الكارمي، وعلاقتك بالأطفال — مجاني", "text": "ليه من صغرك كنت حاسس إن مفيش مساحة للعب أو الغلط، وإن أهلك أو ظروفك حملوك مسؤوليات تكسر ضهر راجل كبير وإنت لسه طفل؟\n\nصاحب مسار الماستر (22) نادراً ما يعيش طفولة عادية. جرحك الدفين نابع من \"إلغاء مرحلة البراءة والتحول المبكر لدور العائل أو المنظم\"، مع دين كارمي صارم يتعلق بالعدالة المؤسسية وبناء الهياكل التي تحمي الضعفاء بدلاً من استعبادهم.\n\n جرح الطفولة والطفل الداخلي:\n\n• جرح \"الطفل المشيد والمسؤول مبكراً\":\nفي طفولتك، وُضعت غالباً في بيئة فرضت عليك الانضباط القاسي أو تحمّل أعباء أسرتك (مادياً أو تنظيمياً) بسبب غياب السند أو ظروف معيشية معقدة. طفلك الداخلي تبرمج على أن: \"البكاء واللعب لا يطعمان خبزاً، وعليّ أن أكون صلباً لأحمي نفسي ومن حولي\". هذا الجرح جعل صوتك الداخلي ناقداً قاسياً لا يسامحك على أدنى هفوة.\n\n• جرح قمع العفوية والروح الطفولية:\nغالباً ما عوملت كرجل بالغ في سن صغيرة، فقُمعت رغباتك في اللهو واكتشاف العالم دون قيود. النتيجة اليوم هي صعوبة بالغة في الاسترخاء أو الاستمتاع بالحاضر دون الشعور بالذنب تجاه إنجاز المهام.\n\n الدين الكارمي لمسار (22) — كارما السلطة والبناء العادل:\n\n• رسالة الكارما وتحدياتها:\nالرقم الماستر 22 يحمل أرثاً من حيوات سابقة كان لصاحبها نفوذ معماري أو سياسي أو اقتصادي ضخم. الدين الكارمي يختبرك في: \"كيف توظف قوتك التنظيمية؟\". هل ستستخدمها لبناء مشاريع ترفع من شأن الناس وتؤمن لهم حياة كريمة، أم ستنزلق إلى الاستبداد واستغلال من هم تحت إمرتك لمجرد تخليد اسمك؟\n\n• الاختبار المستمر:\nتتعرض طوال مسيرتك لاختبارات في النزاهة المؤسسية والمالية. أي محاولة للتلاعب بالقوانين أو أكل حقوق العمال والشركاء تُرد عليك بضربات كارمية قانونية أو انهيارات اقتصادية حاسمة تفرض عليك تصحيح البوصلة الأخلاقية.\n\n علاقتك بالأطفال والتربية:\n\n• مميزاتك في التربية:\nإنت الأب/الأم \"المؤسس للأجيال القوية\"! تزرع في أبنائك قيم المسؤولية، الانضباط، والتخطيط الاستراتيجي منذ الصغر. تؤمن لهم مستقبلاً مادياً وتعليمياً متيناً لا يهتز، وتكون السند الصخري الذي يحميهم من تقلبات الحياة وأطماع الآخرين.\n\n• عيوبك في التربية (احذر منها):\n- النمط العسكري والجمود العاطفي: إدارة المنزل ككتيبة عسكرية وفرض جداول صارمة على الأبناء يحرمهم من العفوية ويخلق مسافة جليدية بينك وبينهم.\n- سقف التوقعات الخانق: الرغبة في رؤيتهم أبطالاً متفوقين دائماً قد تُشعرهم بأن حبك لهم مشروط بإنجازاتهم، مما يورثهم نفس جرح طفولتك.\n\n نصيحة ذهبية:\nانزل لمستوى طفلك، العب معه في التراب دون حسابات، ودعه يرتكب حماقاته الصغيرة بأمان. الحب غير المشروط والحضن الدافئ هما اللبنة الحقيقية التي تبني ثقته بنفسه قبل أي أموال أو عقارات تؤمنها له.\n\n كيف بيظهر الجرح ده في حياتك اليوم:\n\n• لما تقعد من غير مهمة، بتحس إنك بتضيّع وقت وبتفتح الموبايل تشتغل.\n• لما حد يقولك «ارتاح»، جواك صوت بيقول «هرتاح لما أخلص».\n• لما ابنك أو حد قريب يلعب، بتحس بانزعاج بسيط وتتدخل تنظّم اللعب.\n\n رسالة لطفلك الداخلي: «ماكانش لازم تكبر بدري. اللي عملته وقتها كان بطولة، بس دلوقتي تقدر ترتاح». قولها لنفسك قدام المراية.\n\n ما يساعد في الشفاء: هواية من غير هدف (رسم، تركيب، رحلة)، ويوم في الأسبوع من غير قوائم، وناس بتضحك معاك مش بتقيّم إنجازك.\n\n خطوة عملية واحدة النهارده: العب مع طفلك (أو ابن أخوك/أختك) 10 دقايق لعبة هو مختارها، من غير ما تصححله ولا توجهه. سيبه يعيش طفولته.\n\n سؤال للتأمل: إيه الحاجة اللي كنت محتاج تعملها وإنت صغير ومسمحولكش؟ وإيه اللي بيمنعك تعملها دلوقتي؟"}}, "33": {"4": {"title": "القسم الرابع: الشفرة العاطفية، الجواز، وكارما العلاقات — مجاني", "text": "ليه دايماً حبك بيتحول لـ \"مسؤولية ورعاية مفرطة\"، وليه بتجذب شريك بيعتمد عليك في كل تفصيلة وبعدين يتمرد على حمايتك؟\n\nالحب عند صاحب مسار الماستر رقم (33) هو \"حب كوني غير مشروط\"، أرقى درجات العاطفة في علم الأرقام. البلوك العاطفي الأخطر عندك هو \"الخلط بين دور الشريك الحبيب وبين دور الأب/الأم\"، وتحويل العلاقة لساحة إنقاذ مستمر تحرمك من أن تكون محبوباً ومدللاً كما تستحق.\n\n سماتك كشريك عاطفي (في طاقة النور):\n\n• حنان واحتواء لا ينضب: بتقدم دفا وأمان نفسي نادر؛ شريكك معاك بيحس إنه في حضن الوطن، ومستحيل يلاقي حد يحبه بصدق ونقاء زيك.\n\n• التفهم والغفران العالي: بتستوعب عيوب شريكك وتساعده يتشافى منها بصبر، ومبتمسكش على غلطات الماضي بنية الانتقام.\n\n• صانع التناغم الأسري: بيتك بيكون جنة هادية؛ بتعرف تحتوي الخلافات، وتخلق جو دافئ يجمع الكل على المحبة والاحترام.\n\n عيوبك العاطفية (في طاقة الظل):\n\n• الخنق بالرعاية: بتعامل شريكك كأنه طفل محتاج وصاية وإشراف؛ بتتدخل في لبسه، أكله، وقراراته بحجة \"مصلحته\"، فبتقتل الرغبة والندّية بينكم.\n\n• الاعتمادية العاطفية المتبادلة: بتعلق قيمتك وسعادتك برضا شريكك وبمدى احتياجه ليك؛ لو بقى مستقل ومبقاش محتاج مساعدة، بتحس بالتهديد والفراغ.\n\n• كتمان الوجع والانفجار الصامت: بتفضل تبلع الإساءات وتسامح عشان \"المركب تمشي\"، لحد ما شاكرا القلب تتعب ويجيلك خذلان يخليك تنعزل تماماً.\n\n مواصفات الشريك المثالي (الشريك المتزن الناضج):\n\nإنت مش محتاج حد يحتاجك عشان تعالجه؛ إنت محتاج شخص \"ناضج نفسياً، مستقل بذاته، وعنده طاقة احتواء موازية لطاقتك\"! شريك يعرف يطبطب عليك لما تتعب، ويقولك: \"ارتاح إنت النهاردة، أنا اللي هشيل الحمل بدالك\". شخص يحب روحك مش خدماتك وتضحياتك.\n\n البلوك العاطفي وكارما العلاقات:\n\nاللعنة العاطفية لمسار (33) هي \"كارما الشفقة بدلاً من الشغف\". لما تختار شريك لمجرد إنه مكسور أو ظروفه صعبة، الكارما بتلف وتعاقبك؛ لأنك لما تعالجه ويقف على رجليه، هيبدأ يدور على شريك حقيقي يمارس معاه الشغف، مش شخص يفكره بضعفه القديم.\n\n طبيعتك في الجواز والاستقرار:\n\nالجواز عندك قداسة ومسؤولية كبرى. بتكون أروع زوج/زوجة وأعظم مربي أجيال، بس التحدي هو إنك تحافظ على \"الشرارة العاطفية كعشاق\" ومتخليش مسؤوليات البيت والأولاد تطغى على علاقتكم الخاصة.\n\n خريطة التوافق الطاقي:\n\nأعلى توافق روحي وعاطفي (التناغم والانسجام التام):\n- مع مسار (6): بتلاقي التوافق العائلي والحب والرعاية المتبادلة.\n- مع مسار (9): بتلاقي العمق الإنساني والرسالة الروحية المشتركة.\n- مع مسار (2) و (11): تناغم عاطفي وحدسي راقي؛ بيفهموا مشاعرك الرقيقة ويحموا حساسيتك من غير كلام.\n\nعلاقات التحدي (تحتاج وعي عميق):\n- مع مسار (1) و (5): استقلاليتهم المطلقة، تمردهم، ورغبتهم في المغامرة ممكن تخليك تحس بعدم الأمان أو إنهم مش مقدرين تضحياتك الأسرية.\n- مع مسار (8): لو الـ 8 في طاقة مادية جافة، هيشوف حنيتك ضعف وهتتألم من قسوته، إلا لو اتعلم يغمرك بالأمان المادي مقابل حنانك الروحي.\n\nثلاث خطوات لفك البلوك العاطفي:\n\n1. الوعي والإدراك العاطفي:\nاحفظ المعادلة دي: \"أنت حبيب وشريك حياة، ولست والداً/والدة لشريكك!\". بطل تلعب دور المربي والناصح الأمين 24 ساعة. سيب مساحة للشريك يغلط، واطلب منه هو اللي يهتم بيك ويدلعك عشان ترجع التوازن لعلاقتكم.\n\n2. السر الباطني والطاقي (درع العشق الواعي):\nفي العلوم الباطنية، درسك الأكبر هو \"حرية الاختيار\". اترك لشريكك مساحة حرية كاملة دون مراقبة أو تطويق طاقي؛ الحب الحقيقي بيتنفس في المساحات المفتوحة مش في الأقفاص المذهبة.\n\n3. الصورة الذهنية لتشافي العلاقات:\nتخيّل إن علاقتك بشريكك عبارة عن شجرتين متجاورتين في حديقة جميلة. كل شجرة ليها جذورها الخاصة، وفروعها المستقلة، وبتشرب من نبعها الخاص. الشجرتين بيظللوا على بعض وبيتبادلوا النسيم، بس جذوعهم مش ملفوفة حوالين بعض لدرجة تخنق النمو. خليك جنب شريكك، ظلل عليه بحبك، بس سيبله هوا ونور ينمو بيهم لوحده.\n\n خطوة عملية واحدة النهارده: في أول موقف شريكك يقدر يتصرف فيه لوحده، اسكت ومتتدخلش — سيبه ياخد قراره، وهتلاقي نفسك مرتاح أكتر.\n\n سؤال للتأمل: إنت بتحب شريكك، ولا بتحب إنه محتاجك؟ وإيه اللي كان هيفرق لو شفته قوي ومستقل؟"}, "5": {"title": "القسم الخامس: مغناطيس المال، الوفرة، والمهنة — مجاني", "text": "ليه دايماً بتحس بإحراج أو خجل لما تيجي تطلب تمن تعبك وشغلك، وليه لما بتفكر في \"الفلوس بس\" طاقتك بتتقفل والرزق بيهرب منك؟\n\nمسار الماستر رقم (33) هو مسار \"الوفرة الكونية المباركة\". أنت لم تُخلق للمضاربات الجافة ولا للبيزنس الخالي من الروح؛ الفلوس بتتدفق لحسابك كـ \"أثر جانبي تلقائي\" لما تركز على خدمة وشفاء وتعليم الناس. البلوك المالي الأخطر اللي بيعطلك هو \"عقدة الفقر الروحي\"، والاعتقاد المسموم بأن أخذ المقابل المادي العادل يقلل من طهارة رسالتك.\n\n سماتك المهنية والمالية (في طاقة النور):\n\n• بركة استثنائية في المال: الفلوس اللي بتجيلك بيكون فيها سر وبركة غريبة؛ مشاريعك بتكبر بسرعة لأن الناس بتثق في نزاهتك وإخلاصك غير المحدود.\n\n• القدرة الخارقة على التأثير والتوجيه: لما تتولى تدريب، تعليم، أو علاج أي مجموعة، بتطلع أفضل ما فيهم وبتحول الضعف لقوة، وده بيخليك مستشار وموجّه لا غنى عنه.\n\n• إلهام بيئات العمل: بتخلق بيئة عمل يسودها الهدوء والمحبة والولاء التام؛ الموظفين والشركاء بيشتغلوا معاك بحب وإخلاص مش بس عشان المرتب.\n\n عيوبك المهنية والمالية (في طاقة الظل):\n\n• الشعور بالذنب المالي: بتستحي تطلب أسعارك الحقيقية، وغالباً بتعمل استشارات وخدمات مجانية لناس قادرة تدفع، مما يوقعك في ضيق مالي مستمر.\n\n• الاستغلال المادي من الآخرين: طيبتك وثقتك العمياء بتخليك فريسة سهلة للمحتالين أو الشركاء اللي بياكلوا مجهودك وينسبوا النجاح لنفسهم.\n\n• إهمال العقود واللوائح الرسمية: بتتعامل بمبدأ \"الكلمة شرف\" وبتتجاهل كتابة العقود وتوثيق الحسابات، وده بيعرضك لخسائر قانونية ومالية فادحة.\n\n إزاي الفلوس بتجيلك؟ (شفرة الوفرة لـ 33):\n\nشفرة رزقك هي \"رفع القيمة الإنسانية والروحية للعميل\". الكون بيديك وفرة لا نهائية لما تكون أداة لإنقاذ حياة، تعليم مهارة تفتح بيوت، أو تقديم حلول شافية للأمراض النفسية والجسدية. الناس بتدفعلك بسخاء وفرحة لأنك بتديهم أمل وحياة جديدة مش مجرد خدمة عادية.\n\n البلوك المالي (إيه اللي بيوقف رزقك؟):\n\nاللعنة المالية لمسار (33) هي \"إنكار حق النفس في الوفرة\". لو فضلت تقول \"أنا مش فارق معايا الفلوس، المهم أساعد الناس\"، عقلك الباطن والكون هينفذوا رغبتك وهيخلوك على الحافة دايماً! لازم تؤمن إن وفرتك المالية هي اللي بتخليك تبني مدارس، مراكز علاج، وتساعد آلاف المحتاجين بحرية.\n\n المجالات الأنسب لتحقيق الثروة والرسالة:\n\nالطب البديل والعلاج بالطاقة والطب النفسي، التعليم والتدريب وتأسيس الأكاديميات، الإنتاج الفني والموسيقي الهادف، إدارة المنظمات الإنسانية والخيرية العالمية، كتابة الكتب الملهمة، والتصميم المعماري والديكور الحيوي المريح للأعصاب.\n\nثلاث خطوات لفك البلوك المالي:\n\n1. الوعي والإدراك المالي:\nاحفظ المعادلة دي: \"طلبك لمقابلك المالي العادل هو احترام لطاقة الشفاء التي تمنحها!\". لما الشخص يدفع تمن الخدمة أو الاستشارة، هو بيستثمر في نفسه وبيكون جاد في التطبيق، بينما المجاني غالباً بيضيع ومبيتقدرش.\n\n2. السر الباطني والطاقي (درع حماية الحقوق المادية):\nفي العلوم الباطنية، صاحب مسار 33 يحتاج دائماً إلى \"حاجز عقدي ومادي\". لا تتفاوض في الأمور المالية بنفسك؛ وظّف مديراً لأعمالك، محامياً، أو مسؤول مبيعات يتحدث بلغة الأرقام والعقود الصارمة، لتبقى أنت في مساحة العطاء والرسالة دون إحراج.\n\n3. الصورة الذهنية لجذب الثروة:\nتخيّل أنك بئر ماء عذب وصافٍ في وسط واحة صحراوية. البئر ده بيسقي كل القوافل التايهة والعطشانة. بس البئر ده عشان يفضل يفيض بالماية النقية ومايجفش ويموت، لازم المطر يفضل ينزل يملأ جوفه من تاني. قبولك للمال هو ماء المطر الذي يملأ بئرك، لكي تستمر في ري العطاشى دون أن تنضب.\n\n خطوة عملية واحدة النهارده: حدد سعر عادل لخدمة بتقدمها ببلاش، وقول لحد النهارده \"الخدمة دي تمنها كذا\" — واقبض أول مبلغ منها.\n\n سؤال للتأمل: إيه اللي بيخليك تستحي تطلب تمن تعبك؟ وإيه اللي كان هيحصل لو طلبت سعر عادل من أول مرة؟"}, "6": {"title": "القسم السادس: خطوات عملية تفرق معاك — مجاني", "text": "إزاي تتخلص من الشعور الدائم بالذنب لما ترتاح أو تقول \"لأ\"، وتوقف نزيف طاقتك وصحتك اللي بتقدمها قربان لراحة غيرك؟\n\nالتشافي لصاحب مسار الماستر (33) مش معناه إنك تبطل تحب الناس أو تتخلى عن عطائك الفطري؛ التشافي هو إنك تتعلم فن \"العطاء المشروط بالامتلاء الداخلي\"، ووضع حدود طاقية مقدسة تحمي هالتك وقلبك من الاحتراق.\n\n3 خطوات للتطبيق المباشر:\n\n1. خطوة \"خلوة الصمت وشحن القلب\":\n- إزاي تعملها: لأنك بتمتص أوجاع البشر طول الوقت، الزم نفسك بـ 30 دقيقة يومياً من \"الانعزال التام\": اقفل موبايلك، اقعد في مكان هادئ مفيهوش دوشة، وحط إيدك اليمين على منتصف صدرك (شاكرا القلب). تنفس ببطء وتخيل إنك بتغسل قلبك بنور أخضر زمردي أو وردي دافئ، مع ترديد نية: \"أنا أستعيد كل طاقتي التي وزعتها اليوم، وأعيد لكل إنسان طاقته وحمله بسلام\".\n- النتيجة: هتحس بتقل وانقباضة صدرك بتفك، ونبضات قلبك بتهدى، وهتفصل مشاعرك الحقيقية عن دراما ومشاكل اللي حواليك.\n\n2. خطوة \"قاعدة الـ 24 ساعة لقول 'نعم'\":\n- إزاي تعملها: امنع نفسك تماماً من الموافقة الفورية على أي طلب مساعدة، استشارة، أو سُلفة مالية. خلي ردك التلقائي الثابت دايماً: \"خليني أراجع جدولي والتزاماتي وأرد عليك بكرة\". المساحة الزمنية دي هتحميك من فخ الاستجابة العاطفية المندفعة وهتديك فرصة تقييم طاقتك وقدرتك الحقيقية.\n- النتيجة: هتقلل الاستنزاف بنسبة كبيرة، وهتبطل توافق على حاجات بتيجي على حساب نومك، صحتك، وراحتك الشخصية.\n\n3. خطوة \"تأريض الكلمة وتفويض المسؤولية\":\n- إزاي تعملها: لما شخص يجيلك غرقان في مشكلة، قاوم رغبتك في إنك تحلها بداله. بدل ما تقول: \"سيب الموضوع عليا وأنا هتصرف\"، استبدلها بـ: \"أنا واثق في قدرتك وحكمتك إنك تلاقي الحل المناسب، إيه أول خطوة ناوي تاخدها؟\". حوّل دورك من \"منقذ بديل\" إلى \"مرآة ملهمة\".\n- النتيجة: هتعلم اللي حواليك يعتمدوا على نفسهم، وهتحرر كتافك من أحمال مش بتاعتك أصلاً دون أن تفقد دورك كمرشد ومحب.\n\n4. خطوة \"جمل الحد اللطيف\":\n- إزاي تعملها: جهّز 3 جمل جاهزة تقولها من غير تبرير: «مش هقدر المرة دي»، «محتاج وقت أفكر»، «أنا معاك بس مش النهارده». ودرّب نفسك عليهم قدام المراية.\n- النتيجة: هتبطل تقول نعم بسرعة وبعدين تندم.\n\n تعليم الراحة: ضع في جدولك ساعة أسبوعيًا للراحة من غير هدف ولا ناس، بموعد ثابت زي أي مهمة.\n\n مقياس الأسبوع: عدّ كام مرة قلت «لا» بلطف وكان العالم لسه واقف. كل مرة دليل إن الحب مش مربوط بالإذعان.\n\n خطوة عملية واحدة النهارده: اعمل خلوة الصمت 10 دقايق النهارده قبل ما تنام، وقول لنفسك: \"طاقتي ملكي، وهستردها دلوقتي\".\n\n سؤال للتأمل: إيه أكتر حاجة بتستنزف قلبك في يومك؟ وإيه أصغر حد تقدر تحطه بينك وبينها؟"}, "7": {"title": "القسم السابع: جرح الطفولة، الدين الكارمي، وعلاقتك بالأطفال — مجاني", "text": "ليه من صغرك كنت الإسفنجة اللي بتمتص خناقات أهلك، وليه حسيت إنك اتولدت عشان تكون \"المصلح الاجتماعي\" اللي بيطبطب على البيت كله وينسى نفسه؟\n\nأصحاب مسار الماستر (33) بيحملوا في طفولتهم قلباً كبيراً في أجساد صغيرة. جرحك الغائر نشأ من \"تحملك للمسؤولية العاطفية لأهلك مبكراً، واضطرارك للعب دور الطبيب النفسي لمن ربوك\"، مع دين كارمي عظيم يتعلق بالموازنة بين الرحمة بالآخرين والعدل مع النفس.\n\n جرح الطفولة والطفل الداخلي:\n\n• جرح \"المعالج الصغير والدرع العاطفي\":\nفي طفولتك، كنت بتلقط موجات الحزن والتوتر بين والديك قبل ما ينطقوا. غالباً اضطررت تلعب دور المهدئ؛ تبتسم عشان تخفف عن أمك التعبانة، أو تتصرف بحكمة عشان تهدي غضب أبوك. طفلك الداخلي تبرمج على قناعة لا واعية مؤلمة: \"قيمتي ووجودي في الدنيا مرهون بقدرتي على إسعاد اللي حواليا ومسح دموعهم\".\n\n• جرح قمع الاحتياج الشخصي:\nلأنك شفت أهلك مضغوطين أو متألمين، استحرمت تطلب طلبات خاصة بيك أو تشتكي لما تتعب عشان \"ماتزودش الحمل عليهم\". النتيجة كبت مشاعرك ورغباتك الطبيعية في اللعب والطلب والدلع، وده خلاك تكبر بشعور إن طلب المساعدة هو عيب أو أنانية.\n\n الدين الكارمي لمسار (33) — كارما الاتزان بين الرحمة والعدل الذاتي:\n\n• رسالة الكارما وتحدياتها:\nالرقم الماستر 33 يمثل أرواحاً متطورة خدمت وقدّمت الكثير في حيوات سابقة، لكنها ربما \"سقطت في فخ الكبرياء الروحي أو فرضت رؤيتها الأخلاقية والإصلاحية بقسوة، أو استسلمت للشهادة السلبية وأهملت أمانة الجسد والنفس\". دينك الكارمي هو: \"الخدمة النقية المتوازنة دون انتظار تصفيق، ودون السماح لأحد باستغلالك أو هدم حدودك\".\n\n• الاختبار المستمر:\nالكون بيحط في طريقك أشخاصاً بارعين في استدرار العطف والابتزاز العاطفي. الاختبار الحقيقي هو أن تتعلم متى تمد يدك بالمساعدة، ومتى تنسحب وتترك للشخص مساحة ليتحمل عواقب اختياراته، إيماناً منك بأن الألم أحياناً هو المعلم الأكبر للروح.\n\n علاقتك بالأطفال والتربية:\n\n• مميزاتك في التربية:\nإنت الأب/الأم \"الملاك والمعلم الروحي\"! تمنح أطفالك فيضاً لا ينتهي من الحنان، التفهم، والأمان العاطفي. تعلمهم التسامح، احترام كل الكائنات الحية، والتعبير عن مشاعرهم بحرية دون خوف. بيتك بيكون مساحة علاجية ينمو فيها الأبناء بثقة نفسية عميقة.\n\n• عيوبك في التربية (احذر منها):\n- الحماية المفرطة والتدليل: خوفك الشديد عليهم من قسوة الحياة قد يدفعك لحمايتهم من أي مواجهة أو خطأ، مما يجعلهم غير مهيئين للتعامل مع واقع العالم الخارجي.\n- التضحية المرضية على حساب شريك الحياة: إعطاء الأولوية المطلقة للأطفال على حساب علاقتك بشريكك، وتبرير أي تقصير في حق نفسك بأنك تفعل ذلك \"من أجل الأولاد\".\n\n نصيحة ذهبية:\nعلّم أولادك كيف يتعاملون مع الألم والخطأ ولا تحرمهم من تجربة السقوط والقيام بمفردهم؛ فالحب الحقيقي ليس في إزالة كل الحجارة من طريقهم، بل في بناء عضلاتهم ليتعلموا كيف يتخطونها بثبات.\n\n كيف بيظهر الجرح ده في حياتك اليوم:\n\n• لما حد قريب يتضايق، جسمك بيتوتر وبتبدأ تدور على حل قبل ما تسأل نفسك إنت كويس ولا لأ.\n• لما حد يسألك «محتاج إيه؟» بتقول «ولا حاجة» بسرعة.\n• بتتعب من جو الخناق حتى لو مش عليك، وبتحس إنك مسؤول تصلحه.\n\n رسالة لطفلك الداخلي: «ماكانش دورك تصلح بيتهم. إنت كنت طفل، وكان من حقك تبقى حزين وتطلب». اقعد مع نفسك 5 دقايق وقولها بصوت واطي.\n\n ما يساعد في الشفاء: تطلب حاجة صغيرة من حد قريب كل أسبوع وتسمح له يلبيها، وتتعلم تتحمل إحساس الذنب من غير ما تتراجع، وتسيب خناقات الغير تنتهي من غير تدخلك.\n\n خطوة عملية واحدة النهارده: سيبة ابنك/طفلك يغلط ويحل غلطته بنفسه النهارده من غير ما تتدخل — وهتلاقي إنه أقوى مما تتخيل.\n\n سؤال للتأمل: إيه الحاجة اللي كنت محتاج تطلبها وإنت صغير ومطلبتش؟ وإيه اللي بيمنعك تطلبها دلوقتي؟"}}};
const LP_MASTER_SOURCE_1_3 = {"11": {"1": {"title": "القسم الأول: شفرة الروح والجوهر", "text": "المعنى العاطفي والنفسي / طاقة القراءة (جوهر مسارك الحقيقي):\n\nالماستر رقم (11) في علم الأعداد بيتقدّم باعتباره صورة مضاعفة للرقم (2): حساسية، استقبال، تعاون، وحدس، لكن مع رغبة أقوى في تحويل الإحساس إلى إلهام ورسالة. في القراءة الرمزية، هو جسر بين الفكرة والمعنى، وبين العالم الداخلي والتعبير عنه في الواقع. ده مش معناه إن كل شخص رقمه 11 لازم يكون عنده قدرات خارقة أو إن مستقبله مكتوب؛ دي لغة رمزية تساعدك تلاحظ أنماطك وتختار إزاي تستخدمها.\n\n• البصيرة والالتقاط السريع: ممكن تلاحظ تغيّر نبرة الصوت، تعبير الوجه، أو التناقض بين الكلام والتصرف. أحيانًا بتوصل لاستنتاج بسرعة قبل ما تقدر تشرح لنفسك إزاي وصلت له. الموهبة هنا مش إن كل إحساس يبقى حقيقة، لكن إنك تسمع حدسك وبعدها تختبره بالواقع والسؤال المباشر.\n\n• الملهم وصاحب الرسالة: عندك ميل إنك تحوّل تجربة شخصية أو فكرة عميقة لكلام يلمس الناس. ممكن تبرع في الكتابة، التعليم، الفن، الإرشاد، أو أي مجال بتساعد فيه الآخرين يشوفوا زاوية جديدة. تأثيرك بيكبر لما الإلهام يتحول لعمل واضح، مش لما تفضل مستني اللحظة المثالية أو علامة كونية.\n\n• حساسية الجهاز الداخلي: كثرة الملاحظة والتفكير ممكن تخليك تتعب من الزحمة، الضوضاء، التوقعات، أو كثرة التفاعل. أحيانًا تحتاج وقت هادي عشان تفرّق بين مشاعرك ومشاعر اللي حواليك. الحساسية مش عيب، لكنها تحتاج حدودًا وراحة وتنظيمًا.\n\n طاقة النور: الحدس الواعي، الخيال، التعاطف، الإلهام، والقدرة على تسمية مشاعر يصعب على غيرك التعبير عنها.\n\n طاقة الظل: القلق من الإشارات الغامضة، انتظار تأكيد خارجي، الانسحاب وقت الضغط، أو اعتبار كل مصادفة رسالة شخصية. لما يزيد الضغط، ممكن تتردد بين الشعور إن عندك رسالة كبيرة والخوف من إنك مش كفاية.\n\n• الرمز الفلكي في القراءة: يمكن ربط 11 رمزيًا بأورانوس باعتباره صورة للاستبصار والتجديد، وبنبتون باعتباره صورة للخيال والذوبان في المعنى. الربط ده تأويلي وليس قاعدة فلكية علمية أو دليلًا على قدرة خارقة.\n\n كيف يظهر الرقم في يومك العادي:\n\n• في الشغل: تحس إن فيه حاجة غلط في الاجتماع قبل ما حد يقولها، وبعد ساعة تتأكد إن الحدس كان صح أو إنك كنت متوتر وبس. اللعبة هنا إنك تتعلم تفرّق بين الحالتين بالتجربة، مش بالتخمين.\n\n• في البيت: تلاحظ إن حد من أهلك مش على بعضه من مجرد طريقة وضعه للكوباية. السؤال البسيط «مالك؟» بيوفر عليك ساعة تحليل في دماغك.\n\n• قبل النوم: ده الوقت اللي الأفكار بتعلى فيه. لو ما كتبتهاش على ورقة هتفضل تلف في راسك، ولو كتبتها بتهدى وتبان بحجمها الحقيقي.\n\n الفرق بين الإلهام والتوتر: الإلهام بييجي بإحساس إنك عايز تعمل حاجة، والتوتر بييجي بإحساس إنك لازم تتفادى حاجة. لو الإحساس بيدفعك لقدّام، اسمعه. لو بيشدك لورا، اختبره الأول.\n\n ما يناسبك في طريقة الحياة: شغل فيه معنى ومساحة هدوء، مش شغل سريع ومزدحم بلا نهاية. علاقات فيها صدق مش مجاملة طويلة. ووقت منتظم لوحدك، مش عزلة كاملة ولا زحمة دايمة."}, "2": {"title": "القسم الثاني: المرآة المزدوجة والقناع النفسي", "text": "التناقض بين صورتك قدام الناس والعالم اللي جواك ممكن يكون واضحًا لك حتى لو محدش واخد باله. في القراءة الرمزية للماستر 11، قد تظهر كأنك هادي، فاهم، ملهم، أو قادر تلتقط ما لا يراه الآخرون، بينما داخليًا بتراجع كل كلمة وموقف وتسأل نفسك هل فهمت الإشارة صح وهل قلت الشيء المناسب.\n\n القناع الخارجي:\n\n• الشخص اللي بيسمع بتركيز: الناس ممكن تلجأ لك لأنها تحس إنك بتدي مساحة للكلام والمشاعر، وإنك بتلاحظ التفاصيل الصغيرة.\n\n• الهادي صاحب الرؤية: قد تظهر متماسكًا حتى وأنت محتاج وقتًا لتفهم مشاعرك، أو تختار كلماتك بعناية عشان ما تجرحش حد.\n\n• الملهم: ممكن تشجع غيرك بكلمة أو فكرة، لكن ده لا يعني إنك لازم تكون متاحًا للجميع طوال الوقت أو إنك مسؤول عن حل مشاكلهم.\n\n العالم الداخلي:\n\n• ازدحام الأفكار: موقف بسيط ممكن يفضل يدور في ذهنك لأنك بتعيد تحليل نبرة الصوت والاحتمالات المختلفة.\n\n• الإحساس بالاختلاف: ممكن تحس إن اهتماماتك أو أسئلتك أعمق من المحادثات اليومية، فتنسحب بدل ما تشرح احتياجك للاتصال الحقيقي.\n\n• الاستنزاف بعد التفاعل: بعد فترة من الاستماع أو محاولة دعم الآخرين، قد تحتاج عزلة وهدوءًا. ده احتياج بشري للراحة، مش دليلًا على إنك امتصصت طاقة حرفية من الناس.\n\n• الخوف من سوء الفهم: لأنك تهتم بالمعنى، قد تفسّر الصمت أو التأخير على إنه رفض أو غضب، مع إن فيه تفسيرات أخرى كثيرة.\n\n سؤال المرآة: إمتى آخر مرة اعتبرت إحساسك دليلًا نهائيًا بدل ما تعتبره احتمالًا يستحق السؤال؟ وإيه اللي ممكن يتغير لو قلت بوضوح: «أنا حسّيت بكذا، هل فهمي صحيح؟»\n\nممارسة عملية: بعد موقف شاغلك، اكتب ثلاثة أعمدة: ما الذي حدث فعلًا؟ ما التفسير الذي خطر لي؟ ما التفسيرات الأخرى الممكنة؟ وبعدها اختار خطوة واحدة واقعية بدل الاستمرار في الدوران الذهني.\n\n في العلاقات القريبة:\n\n• مع الشريك: بتلتقط حالته من نبرة «تمام» اللي قالها. المشكلة لما تبني على الملاحظة دي قصة كاملة من غير ما تسأل. جرّب جملة: «حاسس إنك مضايق، ده صح؟» بدل ما تستنى يقولها هو.\n\n• مع الأهل: ممكن تكون الشخص اللي بيتقال له السر، وفي نفس الوقت اللي مش بيقول احتياجه. الناس اتعودت إنك الفاهم، فبتنسى تسألك إنت محتاج إيه.\n\n• مع الأصدقاء: بتحب الصحبة اللي فيها كلام بمعنى. بعد سهرة سطحية طويلة ممكن تحس بفراغ، مش لأن الناس وحشين، لكن لأن احتياجك للعمق ما اتلبّاش.\n\n موقف يتكرر: حد قرّب منك بعد غياب، وإنت من جواك بتسأل «عايز إيه؟». افتكر إن مش كل قرب وراه غرض. اديله فرصة صغيرة وشوف تصرفه قبل ما تحكم من إحساسك الأول.\n\n ما يريحك في العلاقة: وضوح في الكلام، ووقت للصمت من غير تفسيرات، واحترام لحاجتك للانسحاب المؤقت من غير ما يتعامل معاه كرفض."}, "3": {"title": "القسم الثالث: البلوكات الخفية والتخريب الذاتي", "text": "أحيانًا المشكلة مش في نقص الإلهام، لكن في إن الإلهام يفضل أكبر من الخطوة اللي تقدر تعملها اليوم. في قراءة الماستر 11، ممكن تتكرر أنماط تعطّل التعبير عن الموهبة: حساسية عالية للنقد، بحث عن يقين كامل، أو تردد بين الرغبة في الظهور والخوف من أن يراك الناس على حقيقتك.\n\n البلوك الأول: متلازمة المحتال والخوف من الانكشاف.\nممكن تقلل من إنجازك وتقول إن اللي عملته مجرد حظ، أو تخاف إن الناس تكتشف إنك مش فاهم كل شيء. بدل ما تستنى الثقة الكاملة، اعترف بما تعرفه وما لا تعرفه، واسمح لنفسك تتعلم أمام الآخرين.\n\n البلوك الثاني: فرط الحساسية وتحليل كل إشارة.\nقد تتحول الملاحظة الدقيقة إلى مراقبة مرهقة لكل كلمة ونظرة ورسالة. مش كل تأخير رفض، ومش كل اختلاف تهديد. اسأل مباشرة عندما يكون الأمر مهمًا، ودرّب نفسك على احتمال عدم اليقين من غير ما تملأ الفراغ بأسوأ تفسير.\n\n البلوك الثالث: شلل التحليل وانتظار الإشارة المثالية.\nقد تملك أفكارًا كثيرة لكنك تؤجل التنفيذ لأنك تنتظر أن تتضح الصورة كاملة. اختار تجربة صغيرة قابلة للتعديل، وحدد لها وقتًا وموعدًا نهائيًا. الفعل الصغير يعلّمك معلومات لا يمنحها التفكير وحده.\n\n البلوك الرابع: الهروب إلى الروحانيات أو الخيال.\nالمعنى والخيال ممكن يفتحوا أبوابًا للإبداع، لكنهم قد يصبحوا وسيلة لتجنب المال أو الالتزام أو الحوار الصعب. اسأل نفسك: ما الخطوة المادية البسيطة التي ستجعل الفكرة موجودة في العالم؟\n\nخطوات عملية:\n• فرّق بين الحدس واليقين: سجّل إحساسك، ثم اختبره بالوقائع.\n• اعمل تأريضًا بسيطًا: امشِ عشر دقائق، اشرب ماء، تناول وجبة مناسبة، أو رتّب مساحة العمل. ويمكنك استخدام تخيّل «المنارة» كتمرين رمزي للتركيز، لا كحماية خارقة مثبتة.\n• اكتب يوميًا ومضة واحدة وخطوة واحدة قابلة للقياس.\n• حط حدودًا للتفاعل: وقتًا للرد، ووقتًا للراحة، وحقًا في قول «مش قادر دلوقتي».\n• لو بتستخدم أحجارًا أو رموزًا روحية، اعتبرها تذكيرًا شخصيًا بالنية لا علاجًا أو ضمانًا لنتيجة.\n\n خطوة اليوم: اختار فكرة مؤجلة، وخصص لها خمس عشرة دقيقة فقط. ابدأ بالنسخة الصغيرة بدل انتظار الكمال.\n\n سؤال للتأمل: إيه أكتر حاجة بتستنزفك: خوفك من حكم الناس، ولا محاولة فهم كل شيء، ولا تأجيل التنفيذ؟ وإيه أصغر حد أو خطوة تقدر تبدأ بها؟\n\n البلوك الخامس: الخلط بين الحدس والخوف.\nالقلق ممكن يلبس شكل الحدس. الاتنين بييجوا كإحساس قوي في الصدر أو المعدة، لكن الحدس غالبًا هادي ومحدد، والخوف عالي وعام وبيكرر نفس السيناريو. جرّب تسأل: «هل ده إحساس عن حاجة معينة، ولا قلق عام بيدوّر على سبب؟»\n\n البلوك السادس: انتظار الإذن.\nتستنى حد يقول لك «اكتب» أو «قدّم» أو «ابدأ». الفكرة إنك بتديه سلطة على وقتك. اكتب لنفسك إذن بخط إيدك وحدد تاريخ.\n\n نقطة التحول في الماستر 11: لما تبطل تسأل «هل أنا مستعد؟» وتبدأ تسأل «إيه أصغر خطوة أقدر أعملها النهارده؟». الجملة الأولى بتأجل، والثانية بتحرّك.\n\n مثال من الحياة: شخص عنده فكرة محتوى بيشتغل عليها من سنتين وما نشرش منها حاجة. نشر أول فيديو غير مثالي، وجاله تعليق واحد صغير، بس ده كان كفاية يفك الحاجز. الخطوة الصغيرة مش بتثبت إنك شاطر، بتثبت إنك قدرت تبدأ."}}, "22": {"1": {"title": "القسم الأول: شفرة الروح والجوهر", "text": "الماستر رقم (22) يُعرف في علم الأعداد باسم «البنّاء الأعظم»؛ صورة رمزية تجمع رؤية واسعة مع القدرة على تحويلها إلى نظام وخطوات وأصول ملموسة. يُقرأ الرقم 22 أحيانًا بوصفه مزيجًا بين إلهام 11 وواقعية 4: رؤية لما يمكن أن يكون، ثم بناء الهيكل الذي يجعل الفكرة قابلة للاستمرار. ده وصف رمزي، مش ضمان إن صاحب الرقم سيبني إمبراطورية أو يحقق ثروة.\n\n• عقلية التصميم الكبير: ممكن تشوف العلاقات بين أجزاء المشروع قبل ما غيرك يلاحظها، وتفكر في البنية والموارد والناس والنتيجة طويلة المدى. قوتك تظهر لما تقسم الرؤية الكبيرة إلى مراحل ومهام قابلة للقياس.\n\n• المسؤولية والإرث: قد يهمك أن تترك شيئًا يعيش بعدك، مثل مشروع أو مؤسسة أو معرفة أو بيت آمن. لكن الرغبة في بناء أثر لا ينبغي أن تتحول إلى اعتقاد أنك مسؤول عن كل شيء أو أنك لا تستحق الراحة قبل اكتمال العمل.\n\n• القائد المؤسس: في أفضل حالاتك تجمع الناس حول هدف واضح، وتوزع الأدوار، وتبني نظامًا لا يعتمد على وجودك في كل تفصيلة. القيادة الناضجة تصنع فريقًا قادرًا على الاستمرار، لا شخصًا واحدًا يحمل المؤسسة على كتفيه.\n\n طاقة النور: التخطيط بعيد المدى، الانضباط، الصبر، تنظيم الموارد، تحويل الرؤية إلى بنية عملية، والقدرة على تحمل المسؤولية دون فقدان الإنسانية.\n\n طاقة الظل: السيطرة المفرطة، اعتبار الناس أدوات لتنفيذ الخطة، الخوف من التفويض، ربط القيمة الشخصية بالإنجاز، أو الإحساس بالشلل لأن الفكرة أكبر من الموارد المتاحة. قد يظهر «شلل العظمة» حين تكون الرؤية ضخمة لدرجة تجعل أول خطوة تبدو صغيرة أو غير جديرة بها.\n\n• الرموز الفلكية والروحية: يمكن استخدام زحل رمزًا للبناء والحدود والزمن، وبلوتو رمزًا للتحول والقوة، وأورانوس رمزًا للتجديد. كما يمكن الإشارة إلى الحروف الـ22 في بعض التقاليد الكابالية بوصفها شبكة رمزية للمعنى. هذه مقارنات تأويلية بين أنظمة رمزية مختلفة، وليست دليلًا علميًا أو ارتباطًا ثابتًا.\n\n كيف يظهر الرقم في يومك العادي:\n\n• في الشغل: عينك على الصورة الكاملة، فبتلاحظ الخلل في الترتيب قبل ما يظهر كمشكلة. لما تقوله بهدوء مع الحل، الناس بتسمعك. ولما تقوله وإنت متضايق، بيتفهم كنقد.\n\n• في المال: بتفكر في الاستقرار طويل المدى أكتر من الربح السريع. الميزانية والادخار والتخطيط بالنسبالك حاجة بتديك أمان، مش مجرد أرقام.\n\n• في البيت: ممكن تكون الشخص اللي بيرتب الأمور: المواعيد، الفواتير، الأدوار. حلو إنك منظم، بس لازم يبقى فيه مساحة للتلقائية والمرح من غير جدول.\n\n الفرق بين البنّاء والمستنزف: البنّاء بيبني نظام يشتغل بدونه، والمستنزف بيبقى هو النظام نفسه. اسأل نفسك: لو غبت أسبوع، هل الحاجات هتمشي؟\n\n ما يناسبك في طريقة الحياة: مشروع طويل المدى فيه مراحل واضحة، وناس تثق فيهم تشاركهم المسؤولية، ويوم راحة ثابت مش بيتلغي."}, "2": {"title": "القسم الثاني: المرآة المزدوجة والقناع النفسي", "text": "في صورة الماستر 22، قد يراك الناس الشخص الذي يعتمدون عليه: عملي، ثابت، صاحب خطة، ويعرف ماذا يفعل وقت الأزمات. لكن خلف صورة «الصخرة» قد يكون هناك ضغط صامت: الخوف من أن ينهار كل شيء لو توقفت، أو أن تكون النتيجة أقل من الصورة الكبيرة التي رسمتها لنفسك.\n\n الصورة الخارجية:\n\n• صانع الحلول: عندما تظهر مشكلة، تبدأ في ترتيب الوقائع والموارد والبدائل. الناس قد يشعرون بالأمان لأنك لا تستسلم بسرعة.\n\n• الشخص المسؤول: تميل إلى الوفاء بالوعود وحمل المهام حتى النهاية، وقد تفضّل أن تتولى الأمر بنفسك بدل أن تخاطر بأن ينجزه شخص آخر بطريقة مختلفة.\n\n• صاحب الرؤية: ترى المستقبل من خلال الخطوات الحالية، وتفكر في الاستدامة لا في المكسب السريع فقط.\n\n العالم الداخلي:\n\n• ضغط العظمة: قد تشعر أن أي مشروع صغير لا يليق بك، أو أن كل خطوة يجب أن تكون مثالية لأنها جزء من «شيء كبير». هذا التفكير قد يؤخر البداية ويستهلك طاقتك.\n\n• الانفصال عن المشاعر: عندما يصبح العمل هو اللغة الوحيدة التي تعرف التعبير بها عن الاهتمام، قد يجد المقربون صعوبة في معرفة ما تشعر به. وقد تستخدم الانشغال لتجنب الضعف أو المحادثات العاطفية.\n\n• الخوف من فقدان السيطرة: التفويض قد يبدو مخاطرة، فتراجع كل تفصيلة أو تعيد العمل بنفسك. النتيجة أن الفريق لا يتعلم، وأنت لا ترتاح.\n\n سؤال المرآة: لو توقفت عن العمل يومًا، هل ستشعر أن قيمتك اختفت؟ وهل تحاول بناء مشروع مستدام، أم نظام لا يستطيع الاستمرار إلا إذا استنزفك؟\n\nممارسة عملية: اكتب مهمة واحدة لا تحتاج أن تنفذها بنفسك، وحدد النتيجة المطلوبة ومعيار الجودة، ثم فوّضها واترك مساحة للطريقة المختلفة. وفي نهاية اليوم، سمِّ شعورًا واحدًا بدل الاكتفاء بوصف ما أنجزته.\n\n في العلاقات القريبة:\n\n• مع الشريك: بتعبّر عن الحب بالأفعال: بتحل مشكلة، بتجيب حاجة ناقصة، بتتولى الترتيب. ده حلو، لكن الشريك ممكن يحتاج كمان كلمة وحضور من غير مهمة.\n\n• مع الأهل: ممكن يعتمدوا عليك في القرارات الكبيرة، وتلاقي نفسك شايل ملفات العيلة. وضّح اللي تقدر تشيله واللي لأ.\n\n• مع الأصدقاء: بتختار الناس اللي بتحترم وقتك ووعودك. لو حد اتأخر أو خلف وعد، ممكن تحس بضيق أكبر من الموقف نفسه.\n\n موقف يتكرر: بتحضّر لحدث عائلي أو مشروع، وبتلاقي نفسك آخر واحد قاعد. حاول تقعد وسط الناس وتسيب حد يكمل الباقي، حتى لو الشكل مش زي ما رسمته.\n\n ما يريحك في العلاقة: ناس بتقدّر المجهود وبتشاركك فيه، ومساحة تحكي فيها عن تعبك من غير ما يتحول لمشكلة تتحل."}, "3": {"title": "القسم الثالث: البلوكات الخفية والتخريب الذاتي", "text": "أكبر عائق محتمل أمام البنّاء مش دائمًا نقص القدرة، بل العلاقة بين الرؤية الضخمة والخوف من الخطأ. حين تصبح النتيجة المتخيلة أكبر من أي خطوة ممكنة، قد يتحول الطموح إلى حمل ثقيل يمنعك من الحركة.\n\n البلوك الأول: الكمالية والخوف من الفشل التاريخي.\nتريد أن يكون المشروع متينًا من أول مرة، فتبحث طويلًا عن أفضل خطة وأقل مخاطرة. لكن لا توجد خطة تزيل كل عدم اليقين. ابدأ بنسخة صغيرة تختبر الفكرة وتسمح لك بالتعلم قبل التوسع.\n\n البلوك الثاني: التحكم ورفض التفويض.\nقد تظن أن الجودة لن تتحقق إلا إذا راقبت كل خطوة، أو تعتبر اختلاف أسلوب الآخرين تهديدًا. وضّح الهدف والمعايير، ثم اسمح للفريق بمساحة حقيقية للتنفيذ. التفويض ليس انسحابًا من المسؤولية، بل تصميم لنظام يستطيع العمل دون اختناق.\n\n البلوك الثالث: صلابة عاطفية وتحويل الحياة إلى جدول مهام.\nقد تتعامل مع الراحة أو اللعب أو العلاقة الحميمة كأنها عناصر ثانوية تأتي بعد الانتهاء من كل شيء. المشكلة أن قائمة المهام لا تنتهي. ضع الراحة والتواصل ضمن النظام نفسه بدل اعتبارهما مكافأة مؤجلة إلى أجل غير معروف.\n\n البلوك الرابع: القوة بوصفها دينًا كارميًا.\nفي لغة الكارما الرمزية، يمكن النظر إلى القوة باعتبارها مسؤولية: هل تستخدم النفوذ لبناء فرص عادلة أم لإجبار الناس على الخضوع؟ لا يلزم افتراض حيوات سابقة أو عقاب كوني كي يكون السؤال مفيدًا.\n\n البلوك الخامس: الانفصال عن الاحتياجات البسيطة.\nقد تنشغل بالمستقبل وتنسى النوم والطعام والحركة والوقت مع المقربين. لا يمكن بناء نظام مستدام إذا كان الشخص الذي يديره ينهار داخله.\n\nخطوات عملية:\n• قاعدة أصغر نسخة: اكتب خلال أسبوعين نموذجًا أوليًا يمكن عرضه أو اختباره، بدل الاكتفاء بخطة مثالية.\n• قائمة التفويض: اختر مهمة واحدة، واكتب النتيجة ومعيار النجاح وموعد التسليم.\n• ميزانية للراحة: احجز وقتًا ثابتًا لا يُلغى لمجرد ظهور مهمة إضافية.\n• فحص السلطة: قبل قرار مؤثر، اسأل من سيتحمل التكلفة؟ وهل سمعته؟ وهل توجد طريقة تحقق الهدف بأذى أقل؟\n• العودة للجسد: خذ فواصل منتظمة، وتحرك، واطلب تقييمًا صحيًا للأعراض المستمرة بدل تفسيرها رمزيًا فقط.\n\n خطوة اليوم: حوّل أكبر فكرة في بالك إلى ثلاث مهام لا تتجاوز كل واحدة منها ساعة، وابدأ بالأولى.\n\n سؤال للتأمل: إيه اللي بيمنعك من البدء فعلًا: حجم الرؤية، الخوف من الخطأ، ولا الاعتقاد إن محدش غيرك يقدر يعملها؟\n\n البلوك السادس: ربط القيمة بالإنجاز.\nلما ينجح مشروع تحس بقيمتك، ولما يتعثر تحس إنك أقل. القيمة مش بتتحدد بنتيجة واحدة. اكتب لنفسك ثلاث حاجات بتحب فيها نفسك ما لهاش علاقة بالشغل.\n\n البلوك السابع: تأجيل الراحة لحد «لما أخلص».\nمفيش «لما أخلص» في طريق البنّاء، لأن فيه دايمًا مرحلة بعدها. الراحة اللي ليها موعد ثابت أنجح من الراحة المشروطة بالنهاية.\n\n نقطة التحول في الماستر 22: لما تفهم إن الأساس القوي مش معناه إنك لازم تبنيه لوحدك. أقوى المباني بتتبني بإيدين كتير ومعايير واضحة.\n\n مثال من الحياة: صاحب مشروع صغير فضل سنة كاملة يحدّث الخطة من غير ما يفتح المحل. لما فتح بنسخة بسيطة، عرف من أول أسبوع إيه اللي الناس بتطلبه فعلًا، وغيّر الخطة كلها. التنفيذ الصغير علّمه أكتر من سنة تفكير."}}, "33": {"1": {"title": "القسم الأول: شفرة الروح والجوهر", "text": "الماستر رقم (33) يُقدَّم في علم الأعداد بوصفه «المعلّم الكوني» أو «المعالج الأكبر»، وهو رمز يجمع التعبير والإبداع المرتبطين بالرقم 3 مع الرعاية والمسؤولية المرتبطتين بالرقم 6. في القراءة التأملية، يشير إلى رغبة في تخفيف الألم، وتعليم ما تعلمته، وخلق مساحة يشعر فيها الآخرون بأنهم مفهومون. ده معنى رمزي، وليس دليلًا على أن شخصًا بعينه يمتلك قدرة علاج خارقة أو مسؤولية لإنقاذ الجميع.\n\n• الحضور المحتوي: قد تكون بارعًا في الإصغاء، وملاحظة ما لم يُقل، وإيجاد كلمات تساعد الشخص على ترتيب مشاعره. أحيانًا يكون الحضور الهادئ أو السؤال المناسب أهم من تقديم حل سريع.\n\n• المعلّم صاحب القلب: قد تميل إلى مشاركة المعرفة بطريقة رحيمة، وتؤمن أن التعلم لا يحتاج إلى الإهانة وأن الخطأ فرصة للفهم. يمكن أن يظهر ذلك في التعليم، الفن، الرعاية، الإرشاد، أو خدمة المجتمع.\n\n• الحب والمسؤولية: تريد أن يشعر من حولك بالأمان، وقد تبذل جهدًا كبيرًا لتقليل الخلافات. التحدي هو ألا يتحول التعاطف إلى حمل مسؤولية قرارات الآخرين أو محاولة حمايتهم من كل ألم.\n\n طاقة النور: الرحمة، الإبداع، الإصغاء، التوجيه، التسامح، القدرة على جمع الناس، والتعبير عن الرعاية في أفعال عملية.\n\n طاقة الظل: دور المنقذ، الشعور بالذنب عند قول «لا»، التضحية بالنفس لإثبات الحب، أو الاعتقاد أن قيمتك مرتبطة بمدى احتياج الآخرين إليك. وقد يظهر «الاستشهاد» حين تتجاهل احتياجاتك حتى تتراكم المرارة ثم تشعر أن لا أحد يقدّر ما تقدمه.\n\n• الرموز الفلكية: يمكن استخدام الزهرة رمزًا للمحبة والانسجام، ونبتون رمزًا للخيال والمثالية، والمشتري رمزًا للتعليم واتساع الرؤية. هذه روابط رمزية وليست أدلة على مصير أو مواهب مؤكدة. ويُستخدم تعبير «وعي المسيح» في بعض الأطر الروحية للدلالة على الرحمة والخدمة، وهو تعبير إيماني/رمزي لا حقيقة قابلة للقياس النفسي.\n\n كيف يظهر الرقم في يومك العادي:\n\n• في الشغل: الناس بتيجي لك بمشاكلها الشخصية حتى لو مش دورك. بتسمع وبتساعد، وبعدين تلاقي وقتك ضاع. حدد وقت للاستماع ووقت للشغل.\n\n• في البيت: بتلاحظ إن حد محتاج حاجة قبل ما يطلب، وبتتحرك تلقائي. حلو، بس سيبه يتعلم يطلب، عشان العطاء يتحول لتبادل مش عادة.\n\n• مع نفسك: لما تتعب، بتفكر الأول ازاي تخلص اللي عليك، مش ازاي ترتاح. الراحة عندك محتاجة إذن.\n\n الفرق بين العطاء والاستنزاف: العطاء بيسيبك حاسس بالامتلاء، والاستنزاف بيسيبك حاسس بالفراغ والضيق. لو بعد المساعدة بتحس بالضيق، راجع الدافع: هل ده اختيار ولا خوف من الرفض؟\n\n ما يناسبك في طريقة الحياة: شغل أو دور فيه تأثير إنساني واضح، وناس بتبادلك الاهتمام، وروتين فيه وقت لنفسك يتحمي من الطلبات."}, "2": {"title": "القسم الثاني: المرآة المزدوجة والقناع النفسي", "text": "قد يراك الناس الشخص الحنون الذي يعرف كيف يحتوي الموقف، يخفف التوتر، ويمنح الآخرين فرصة ثانية. لكن وراء صورة «الملاك الذي يساعد الجميع» قد تكون هناك وحدة أو إرهاق أو شعور بأنك لا تستطيع إظهار احتياجك، لأن الجميع اعتادوا أن تكون أنت الشخص القوي والرحيم.\n\n الصورة الخارجية: \n\n• مساحة آمنة: قد يشعر المقربون أنهم يستطيعون الحديث معك دون خوف من السخرية أو الحكم السريع.\n\n• المصلح وصانع الانسجام: تميل إلى تهدئة الخلافات وربط وجهات النظر، وقد تحاول أن تجعل كل شخص يشعر بأنه مسموع.\n\n• الشخص المعطاء: قد تبادر بالمساعدة قبل أن يُطلب منك ذلك، وتلاحظ الاحتياجات العملية والعاطفية للآخرين.\n\n العالم الداخلي: \n\n• الوحدة وسط الناس: قد تستمع طويلًا إلى الآخرين، لكنك لا تقول ما يؤلمك حتى لا تثقل عليهم أو تخيب الصورة التي يعرفونك بها.\n\n• ذنب الراحة: عندما تختار نفسك، قد تسمع صوتًا داخليًا يقول إن هناك شخصًا آخر يحتاجك أكثر. ومع الوقت، يتحول العطاء من اختيار حر إلى واجب لا ينتهي.\n\n• الحزن من الظلم: قد تتأثر بشدة عندما ترى قسوة أو معاناة لا تستطيع تغييرها. التعاطف لا يعني أنك مطالب بحمل كل ألم في العالم، ولا أن عدم قدرتك على إصلاحه فشل شخصي.\n\n• خيبة الأمل بعد العطاء: إذا قدمت أكثر مما تستطيع ثم انتظرت أن يفهم الآخرون احتياجك دون أن تقوله، قد تشعر بأنك مستغل أو غير مقدّر. التعبير المباشر عن الحدود أكثر عدلًا لك ولهم.\n\n سؤال المرآة: هل بتساعد لأنك اخترت المساعدة، أم لأنك تخاف أن يقل حب الناس لك إذا توقفت؟ وهل تسمح لنفسك أن تكون الشخص الذي يحتاج دعمًا أحيانًا؟\n\nممارسة عملية: قبل أي موافقة جديدة، اسأل نفسك: هل عندي وقت وطاقة؟ هل أنا الشخص المناسب؟ هل أوافق برغبة أم خوفًا من الذنب؟ ثم عبّر عن قرارك بوضوح دون تبرير طويل.\n\n في العلاقات القريبة:\n\n• مع الشريك: بتحب بكل قلبك، وممكن تنسى تقول إنك محتاج حاجة. الشريك مش بيقرا أفكارك، والتعبير الواضح بيحميك من تراكم الزعل.\n\n• مع الأولاد أو الأقارب الأصغر: بتحب تحميهم من أي ألم. لكن التجربة الصغيرة مفيدة، وتدخلك في كل مرة ممكن يحرمهم من ثقتهم بنفسهم.\n\n• مع الأصدقاء: بتبقى الشخص اللي بيتصل ويطمّن. حلو لو حد كمان بيتصل عليك. لاحظ مين بيسأل عنك من غير ما تبدأ إنت.\n\n موقف يتكرر: صاحبك بيحكي لك مشكلة جديدة كل أسبوع، وإنت تعبان بس بتسمع. ممكن تقول بلطف: «أنا معاك، بس النهارده طاقتي قليلة، نكمل بكرة؟» ده مش تخلي، ده حفاظ على العلاقة.\n\n ما يريحك في العلاقة: شخص بيسألك عن حالك فعلًا، ويقبل منك «لا» من غير ما يزعل، ويفتكر يرد الجميل بطريقته."}, "3": {"title": "القسم الثالث: البلوكات الخفية والتخريب الذاتي", "text": "في قراءة الماستر 33، التحدي ليس نقص المحبة، بل أن تتحول المحبة إلى إنقاذ مستمر يستهلك صاحبه ويضعف استقلال من يساعده. قد تعتقد أنك لو لم تتدخل فسوف ينهار كل شيء، أو أن وضع الحدود دليل قسوة، بينما الرعاية المتوازنة تحتاج حضورًا وصدقًا ومساحة للآخر كي يتحمل مسؤوليته.\n\n البلوك الأول: عقدة المنقذ والتضحية.\nقد تشعر أنك مسؤول عن إصلاح كل شخص تحبه، وتستمر في العطاء حتى بعد نفاد طاقتك. تذكّر أن مساندة شخص لا تعني تولي حياته بدلًا منه، وأن المساعدة الصحية تُعرض ولا تُفرض.\n\n البلوك الثاني: الحدود الضعيفة والذنب.\nقد تقول «حاضر» بينما داخلك يرفض، ثم تشعر بالغضب لأن الآخرين لا يلاحظون تعبك. قول «لا أقدر الآن» ليس تخليًا عن المحبة؛ إنه معلومة واضحة تمنح العلاقة فرصة لتكون متبادلة.\n\n البلوك الثالث: دور الضحية أو الشهيد.\nإذا كنت تؤجل احتياجاتك باستمرار، قد تتراكم المرارة وتصبح رسالتك الداخلية «أنا أعمل كل شيء ولا أحد يعمل لي شيئًا». بدل انتظار أن يلاحظ الآخرون، اطلب ما تحتاجه بصراحة، وراجع مقدار ما تقدمه قبل أن تصل إلى الإنهاك.\n\n البلوك الرابع: الإنهاك التعاطفي واعتقاد أنك تحمل مشاعر الجميع.\nقد تتعب بعد الاستماع الطويل أو التعرض لمواقف مؤلمة. يمكن وصف هذا مجازًا بأنك «امتصصت الطاقة».\n\n البلوك الخامس: الحماية التي تتحول إلى سيطرة.\nقد تتدخل في قرارات المقربين بدافع الخوف عليهم، لكن كثرة الإنقاذ تحرمهم فرصة التعلم، وتحرمك أنت من علاقة بين بالغين متساويين. اسأل قبل تقديم النصيحة، واترك مساحة لاختيار مختلف عن اختيارك.\n\nخطوات عملية: \n• قاعدة المسؤولية: أنت مسؤول عن نيتك وحدودك وأفعالك، لا عن كل قرار يتخذه الآخرون.\n• تمرين «قناع الأكسجين»: اعتنِ باحتياجاتك الأساسية أولًا حتى تستطيع تقديم مساعدة مستدامة. استخدمه كتذكير عملي، لا كحجة للأنانية أو إهمال الآخرين.\n• حماية رمزية: إذا كان تخيل ضوء أو حدود حولك يساعدك على التركيز، استخدمه كتأمل يذكرك بحقك في المساحة الشخصية، وليس كحاجز خارق مثبت.\n• مهلة 24 ساعة: قبل أن توافق على طلب كبير، قل إنك ستفكر وترد لاحقًا. استخدم الوقت لمراجعة قدرتك وبدائلك.\n• تبادل الدعم: اطلب من شخص موثوق أن يسمعك عشر دقائق دون أن تحوّل الحديث فورًا إلى مشكلته.\n\n خطوة اليوم: ارفض أو أجّل التزامًا واحدًا لا تملك له وقتًا كافيًا، أو اطلب مساعدة صغيرة كنت تحاول القيام بها وحدك.\n\n سؤال للتأمل: هل بتحب الشخص نفسه، أم بتحب الإحساس بأنه لا يستطيع الاستغناء عنك؟ ماذا سيتغير لو وثقت بقدرته على الاختيار والتعلم؟\n\n البلوك السادس: صعوبة قبول المساعدة.\nلما حد يعرض عليك مساعدة، بتقول «لا، أنا تمام» بسرعة. جزء منك شايف إن قبول المساعدة ضعف. بس العلاقات المتوازنة فيها أخد وعطا. اقبل عرض صغير النهارده وشوف إيه اللي بيحصل.\n\n البلوك السابع: الغضب المكتوم.\nلما تتجاهل غضبك عشان تحافظ على الهدوء، بيتراكم ويطلع في وقت مش مناسب أو في شكل برود. الغضب إشارة إن حد عدّى حد ليك. عبّر عنه بجملة هادية: «ده ضايقني، وعايز نتكلم فيه».\n\n نقطة التحول في الماستر 33: لما تفهم إن رعايتك لنفسك جزء من رسالتك مش تعارض معاها. اللي بيروي غيره من إناء فاضي بيجف قبل ما يوصل.\n\n مثال من الحياة: معلمة بتساعد طلابها بعد المدرسة كل يوم لحد ما تعبت. لما حددت يومين بس للدروس الإضافية، لقت الطلاب بيذاكروا أكتر لوحدهم، وهي رجعت تحب شغلها. الحد ما قلّلش من عطائها، خلّاه يستمر."}}};
const LP1_REVISED_SOURCE = [{"title":"القسم الأول: شفرة الروح والجوهر","text":"(لمن مجموع تاريخ ميلاده الكامل يختزل إلى الرقم 1، أو وُلد يوم 1، 10، 19، 28)\n\nالمعنى العاطفي والنفسي / طاقة القراءة (جوهر روحك الحقيقي):\n\nلو مسار حياتك هو الرقم (1)، فاعرف إنك مجيتش الدنيا دي عشان تمشي ورا القطيع، أو عشان تعيش حياة عادية متكررة مرسومة ليك من غيرك. روحك شايلة شفرة \"البداية\" وشرارة الخلق الأولى:\n\n• طاقة \"الخلق من العدم\" والعصا السحرية: إنت شخص اتولدت ومعاك \"عصا سحرية\" اسمها الفكرة والكلمة. عقلك مبيبطلش تفكير وابتكار لثانية واحدة، وعندك قدرة مرعبة على تحويل الأفكار اللي في دماغك لواقع ملموس. لما بتحط هدف في راسك، تؤمن بيه، وتركز عليه وتنطقه، الظروف والكون كله بيترتبوا بشكل غريب عشان يحققوهولك، وبتلاقي نفسك بتفتح أبواب كانت مقفولة بالضبة والمفتاح. المستحيل بالنسبة لك هو مجرد رأي مش حقيقة، لأنك مش بتستنى الفرصة تجيلك، إنت اللي بتصنعها من الهوا. بس خد بالك: العصا السحرية دي محتاجة تركيز. لو اشتتت طاقتك على كذا اتجاه في نفس الوقت، السحر بيقل. ركز على حاجة واحدة، وهتشوف العجب.\n\n• روح القائد الفطري (مستحيل تكون رقم 2): إنت بطبعك شخص مستقل لأقصى درجة، بتتنفس حرية، ومبتعرفش تكون \"كمالة عدد\" أو رقم 2 في حياة حد. عندك حساسية مفرطة من إن حد يملي عليك أوامره، يمشيك على مزاجه، أو يحجم طموحك؛ لو حد حاول يعمل كده بتتمرد فوراً. جواك صوت داخلي دايماً بيقولك: \"أنا أقدر أعمل ده بطريقتي، وأعمله أحسن من أي حد\". إنت مش بتدور على القيادة عشان المنظرة، إنت بتقود لأنك بتشوف الطريق بوضوح وقت ما الكل بيكون تايه. بس خد بالك: القيادة الحقيقية مش إنك تعمل كل حاجة لوحدك، القيادة الحقيقية إنك تعرف تختار فريقك وتديه مساحة.\n\n• شجاعة البدء من الصفر ومتلازمة \"الجبل\": إنت المبتكر اللي بيمشي في طريق مفيش رجل داست فيه قبله، ويمهده عشان غيره يمشي وراه. وإنت \"الجبل\" اللي الكل بيتسند عليه وقت الأزمات، بس من كتر ما اتعودت تشيل مسؤوليتك بدري وتحل مشاكلك بإيدك، بقى صعب جداً عليك تطلب مساعدة أو تبين ضعفك لمخلوق. قوتك الخارقة مش في إنك مابتقعش، قوتك في إن الدنيا كلها لو اتهدت فوق دماغك النهاردة، تقدر تقوم تاني يوم الصبح وتبدأ من الصفر كأن شيئاً لم يكن. بس خد بالك: الجبل لوحده صعب يتحرك. أحياناً تحتاج تسيب حد تاني يسندك.\n\n• جوهر طاقتك في الوضع الإيجابي (طاقة النور والاتزان): لما بتكون في قمة اتزانك ووعيك، بتعرف تسخر \"عصاك السحرية\" صح؛ بتكون قائد ملهم وحنون في نفس الوقت، مبدع، واثق في خطواتك من غير غرور، صاحب قرار حاسم، وطاقتك الإيجابية بتكون زي الشمس اللي بتنور وتدفي حياة كل اللي حواليك وتدفعهم للنجاح.\n\n• جوهر طاقتك في الوضع السلبي (طاقة الظل والانحراف): لما طاقتك بتستنزف أو بتفقد توازنك، القوة دي بتتقلب ضدك لواحد من طريقين عكس بعض تماماً: يا إما بتتحول لشخص ديكتاتور، عنيد لأقصى درجة، أناني مببيشوفش غير رأيه، عصبي ومندفع وبيدوس على مشاعر اللي حواليه عشان يوصل لهدفه.. يا إما بتقع في القطب العكسي وتتحول لشخص متردد، خايف يبدأ، فاقد الثقة في نفسه، حاسس بالعجز، وبيرمي لوم فشله على الظروف والناس. الاتنين مش إنت، دول نسختين مشوهتين من طاقتك لما بتفقد توازنها. الحل مش إنك تكتم قوتك، الحل إنك توازنها.\n\nطاقتك نارية، دافئة، وحضورك طاغي؛ مستحيل تدخل مكان وتكون شخص عادي أو مهمش. حتى لو قعدت ساكت متكلمتش ولا كلمة، هالتك بتملى المكان وبتلفت الأنظار ليك تلقائياً، لأنك خُلقت لتكون \"المركز\" والمحرك الأساسي في حياة اللي حواليك.\n\nسؤال للتأمل: إيه الحاجة اللي إنت مستني \"الظروف المثالية\" عشان تبدأها؟ وإيه أصغر خطوة تقدر تعملها النهاردة؟"},{"title":"القسم الثاني: المراية المزدوجة","text":"في مسار الحياة رقم (1)، فيه فجوة كبيرة جداً بين الهالة اللي بتصدرها للعالم، وبين اللي بيحصل جوه عقلك وقلبك لما بتقفل باب أوضتك عليك:\n\n• إزاي الناس بتشوفك من بره (القناع الخارجي والهالة):\nالناس بتشوفك \"شخصية حديدية\" مبتتهزش! في عيون اللي حواليك، إنت الشخص القوي، الواثق في نفسه لأقصى درجة، اللي دايماً عنده حل لأي مصيبة، واللي مبيخافش من حاجة. هالتك من بره بتدي انطباع إنك مستغني بنفسك عن الكل، وإن كلام الناس أو انتقادهم مبيأثرش فيك، بل إن بعض الناس قبل ما تتعامل معاك عن قرب ممكن تخاف من هيبتك أو تفتكرك شخص مغرور، متكبر، أو قاسي المشاعر لأنك مبتحبش المرقعة ولا المجاملات الكدابة.\n\n• إيه اللي بيدور جواك فعلاً (حقيقتك وصراعك الداخلي السري):\nالحقيقة اللي محدش يعرفها غيرك هي إنك من جوه \"بتجلد ذاتك\" بقسوة ميتحملهاش بشر! ورا قناع القوة ده، فيه عقل مبيبطلش تفكير وقلق لثانية واحدة، وخوف مرعب من الفشل أو إنك تطلع قدام الناس في صورة الشخص الضعيف أو المحتاج. إنت أوقات كتير بتحس بوحدة رهيبة حتى وإنت وسط الزحمة، لأن الكل بيتسند عليك ومحدش بيسأل نفسه: \"طب هو مين اللي بيطبطب عليه أو بيشيل عنه؟\". إنت من جوه حساس جداً للكلمة التقديرية، وبتتمنى تلاقي الشخص أو المكان اللي تخلع فيه \"درع المحارب\" ده وتستريح من غير ما حد يحكم عليك أو يستغل نقطة ضعفك. وكل ما تحس إنك \"مش متقدر\" أو \"مش متشاف\"، ده مش لأنك مش كفاية، ده لأنك بتدي من غير ما تطلب، وبتدي لحد ما تفضى. الحل مش إنك تبطل تدي، الحل إنك تتعلم تستقبل، وتطلب، وتقول \"أنا كمان محتاج\".\n\n• السر النفسي في تعاملك مع الضغوط:\nلما بتتوجع أو بتمر بأزمة، إنت مبتشتكيش ومبتعيطش قدام حد؛ إنت بتختفي في صمت أو بتدفن نفسك في الشغل والتفكير لحد ما تعالج جرحك بإيدك، وترجع تاني قدام الناس كأن مفيش حاجة هزتك. الانسحاب ده مش قوة، ده طريقة حماية اتعلمتها. بس خد بالك: الجرح اللي بيتعالج لوحده بيندمل بس بيسيب أثر. الجرح اللي بيتحكي ويتفهم، بيتشفي فعلاً.\n\nسؤال للتأمل: إمتى آخر مرة قلت لحد \"أنا محتاج مساعدة\" أو \"أنا تعبان\" من غير ما تحس إنك ضعيف؟"},{"title":"القسم الثالث: البلوكات الخفية ونقاط التعطيل","text":"ليه كل ما تقرب من هدفك الدنيا بتعاندك؟\nأكبر بلوك طاقي بتطارد صاحب مسار الحياة رقم (1) وبتوقف حاله هي فخ \"أنا هعمل كل حاجة لوحدي\" وعقدة \"إثبات الذات المستمر\". إنت أوقات بتدمر نجاحك بإيدك من غير ما تحس في اللحظة اللي بتتحول فيها قوتك لعناد، أو لما يسيطر عليك خوف سري بيخليك تأجل أهم خطوة في حياتك.\n\nتفاصيل البلوكات الطاقية ونقاط التعطيل في مسار الحياة رقم (1):\nطاقة الرقم (1) قوية جداً زي تيار الكهرباء العالي؛ لو متوجهتش صح بتتحول لـ \"بلوكات\" بتعطل رزقك، نجاحك، وراحتك النفسية. دي أخطر 4 نقاط تعطيل بتقع فيها وإزاي تفكها:\n\n• البلوك الأول: فخ \"السوبرمان\" ورفض التفويض:\nإنت عندك قناعة داخلية إن \"محدش هيعمل الشغلانة دي بنفس كفاءتي وضميري\". النتيجة إنك بتشيل فوق طاقتك، وبترفض تطلب مساعدة أو توزع المهام على غيرك، لحد ما توصل لمرحلة الاحتراق النفسي والجسدي، وتلاقي مشاريعك واقفة لأنك إنسان واحد في النهاية ومش قادر تلاحق على كل حاجة لوحدك. والحقيقة إن اللي بيعمل كل حاجة لوحده، مش بيوصل أسرع، هو بس بيتعب أسرع. اللي بيعرف يفوض، بيوصل أسرع وأبعد.\n\n• البلوك الثاني: متلازمة \"الكل أو لا شيء\" وشلل الكمال:\nمن كتر خوفك السري من الفشل أو إن شكلك يطلع وحش قدام الناس، ساعات بتقع في بلوك غريب جداً: إنك تأجل البداية وتفضل تخطط في دماغك بس! بتقول لنفسك \"لما الظروف كلها تبقى مثالية هبدأ\"، والحقيقة إن ده فخ من عقلك عشان يحميك من احتمالية الخسارة، فبتضيع على نفسك فرص ذهبية كان زمانها نقلتك في حتة تانية خالص. والحقيقة التانية إن مفيش حاجة بتبدأ مثالية. اللي بتبدأ 60% وتكمل، بتوصل. اللي مستني 100%، بيفضل مستني.\n\n• البلوك الثالث: العناد الكارمي وصدام الإيجو:\nتعطيل كبير في حياتك بيحصل بسبب \"الكبرياء الزيادة\". ساعات بتبقى عارف إن الطريق اللي إنت ماشي فيه غلط أو بيجيبلك خسارة، بس بترفض ترجع فيه عشان محدش يقول إنك غلطت! وكمان صدامك مع أي \"سلطة\" (مدير، أب، شريك متسلط، أو قوانين روتينية) بيخليك تخسر معارك مجانية كان ممكن تكسبها بالسياسة والمرونة مش بالعند وكسر العظم. والعند ده مش قوة، ده خوف. خوف إنك تبان ضعيف لو رجعت في كلامك. الرجوع في الغلط مش ضعف، ده شجاعة.\n\n• البلوك الرابع: الإدمان على البدايات والملل من التفاصيل:\nطاقة الرقم (1) بتعشق \"نشوة البداية\" والتحدي الجديد، بس أول ما المشروع أو الموضوع يدخل في مرحلة الروتين والتفاصيل المملة، طاقتك بتطفي وبتزهق بسرعة، فممكن تسيب الحاجة وهي خلاص فاضلها خطوة وتنجح، وتروح تبدأ حاجة جديدة من الصفر، وتفضل داير في ساقية البدايات من غير ما تحصد الثمرة النهائية. والحقيقة إن البداية هي 20% من الشغل، والـ 80% التانية هي التفاصيل. اللي بيكمل في التفاصيل، هو اللي بيحصد.\n\nكيف تفك هذا البلوك في مسارك:\nعشان تفتح مساراتك المقفولة فوراً، لازم تستوعب إن \"طلب المساعدة مش ضعف، ده ذكاء قيادي\". القائد الحقيقي هو اللي بيبني فريق يشيل معاه مش اللي بيشتغل عسكري ووزير وملك في نفس الوقت. درب نفسك تبدأ خطواتك حتى لو جاهز بنسبة 60% بس، واتعلم تفرق بين \"الثقة في النفس\" وبين \"العناد اللي بيخسرك\".\n\nسؤال للتأمل: إيه الحاجة اللي إنت شايلها لوحدك وممكن تسيبها لحد تاني يشاركك فيها؟ وإيه اللي بيمنعك؟\"البلوكات الطاقية\" هنا تعبير رمزي عن أنماط متكررة، مش حقيقة كونية. الأنماط دي قابلة للتغيير بالوعي والتدريب."}];


  function sourceTextToHTML(text) {
    const escapeHTML = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
    return String(text || "").split(/\n{2,}/).map(block => {
      const clean = block.trim();
      if (!clean) return "";
      const lines = clean.split("\n");
      if (lines.every(line => /^\s*[•●▪◦*-]\s+/.test(line))) {
        return "<ul>" + lines.map(line => "<li>" + escapeHTML(line.replace(/^\s*[•●▪◦*-]\s+/, "")) + "</li>").join("") + "</ul>";
      }
      return "<p>" + lines.map(escapeHTML).join("<br>") + "</p>";
    }).join("");
  }

  function renderLPBlueprintCard(lp) {
    const dataMap = window.LIFE_PATH_DATA || window.AqeeqLifePathData || {};
    const info = dataMap[lp] || dataMap[LP_BASE[lp] || lp];
    if (!info) return "";
    const cheatRows = Array.isArray(info.cheatSheet) && info.cheatSheet.length
      ? `<div class="aqm-cheat-sheet" style="margin-top:16px;">
          <h4 style="margin:0 0 10px 0;color:var(--burgundy);font-family:var(--serif);font-size:1.18rem;">جدول المقارنة السريعة: الاتزان والظل</h4>
          <div class="aqm-table-scroll">
            <table class="aqm-cheat-table">
              <thead><tr><th>المجال</th><th>حالة الاتزان والنور (+)</th><th>فخ الظل (-)</th></tr></thead>
              <tbody>
                ${info.cheatSheet.map(r => `<tr><td><b>${esc(r.area || "")}</b></td><td>${esc(r.balanced || r.light || "")}</td><td>${esc(r.shadow || "")}</td></tr>`).join("")}
              </tbody>
            </table>
          </div>
        </div>`
      : "";
    const blueprintSteps = Array.isArray(info.blueprint) && info.blueprint.length
      ? `<div class="aqm-protocol-box" style="margin-top:16px;padding:18px;background:#FAF7F0;border:1px solid var(--border-gold);border-radius:10px;">
          <h4 style="margin:0 0 10px 0;color:var(--burgundy);font-family:var(--serif);font-size:1.18rem;">خريطة التحول العملي (التحديات والحلول)</h4>
          <ol class="aqm-steps-list" style="margin:0;padding-right:20px;line-height:1.8;">
            ${info.blueprint.map(s => typeof s === "object" && s !== null ? `<li><b>التحدي:</b> ${esc(s.challenge || "")} — <b>الحل العملي:</b> ${esc(s.solution || "")}</li>` : `<li>${esc(s)}</li>`).join("")}
          </ol>
        </div>`
      : "";
    return `<section class="aq-lp-blueprint-summary" style="background:#FFFFFF;border:1px solid var(--border-gold);border-radius:12px;padding:28px;margin-bottom:22px;box-shadow:var(--aq-shadow-subtle);">
      <span class="eyebrow" dir="ltr">PYTHAGOREAN BLUEPRINT · LIFE PATH ${lp}</span>
      <h3 style="margin:6px 0 8px;color:var(--burgundy);font-family:var(--serif);font-size:1.55rem;">${esc(info.title)}</h3>
      <p style="margin:0 0 16px;color:var(--ink-brown);font-weight:600;line-height:1.8;">${esc(info.headline || "")}</p>
      <div class="aq-lp-pillars-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px;">
        <article style="background:#FAF7F0;border:1px solid var(--border-gold);border-radius:10px;padding:16px;">
          <h4 style="margin:0 0 6px;color:var(--burgundy);font-family:var(--serif);">الجوهر والرسالة الأساسية</h4>
          <p style="margin:0;font-size:0.93rem;line-height:1.75;">${esc(info.core || "")}</p>
        </article>
        <article style="background:#FAF7F0;border:1px solid rgba(78,110,88,0.35);border-radius:10px;padding:16px;">
          <h4 style="margin:0 0 6px;color:var(--aq-success);font-family:var(--serif);">طاقة النور ونقاط القوة (+)</h4>
          <p style="margin:0;font-size:0.93rem;line-height:1.75;">${esc(info.light || "")}</p>
        </article>
        <article style="background:#FAF7F0;border:1px solid rgba(120,47,59,0.28);border-radius:10px;padding:16px;">
          <h4 style="margin:0 0 6px;color:var(--burgundy);font-family:var(--serif);">فخ الظل والتحدي المتكرر (-)</h4>
          <p style="margin:0;font-size:0.93rem;line-height:1.75;">${esc(info.shadow || "")}</p>
        </article>
        <article style="background:#F4EFE5;border:1px solid var(--border-gold);border-radius:10px;padding:16px;">
          <h4 style="margin:0 0 6px;color:var(--ink-brown);font-family:var(--serif);">البصمة الجسدية والسوماتيكية</h4>
          <p style="margin:0;font-size:0.93rem;line-height:1.75;">${esc(info.psychosomatic || "")}</p>
        </article>
      </div>
      ${cheatRows}
      ${blueprintSteps}
    </section>`;
  }

  function renderPinnaclesBlock(name, d, m, y, lp) {
    if (name && String(name).trim()) {
      return "";
    }
    if (!window.AqeqNameReadings || typeof window.AqeqNameReadings.renderPinnaclesChallenges !== "function") {
      return "";
    }
    try {
      const html = window.AqeqNameReadings.renderPinnaclesChallenges(Number(d), Number(m), Number(y), Number(lp), null);
      return html ? `<div class="aq-lp-pinnacles-wrap" style="margin-top:24px;">${html}</div>` : "";
    } catch (_) {}
    return "";
  }

  function renderLP(name, d, m, y) {
    lastLP = [name, d, m, y];
    const lp = lifePath(d, m, y), base = LP_BASE[lp] || lp, F = LP_FREE[base];
    const root = $("#lpresult");
    const returnHomeBtn = `<div class="result-top-bar"><a href="#home" class="btn-return-home" role="button"><span>←</span> العودة للرئيسية</a></div>`;
    const MD = LP_BASE[lp] && window.AqeeqLifePathData && window.AqeeqLifePathData[lp], T0 = (MD && MD.title) || F.t;
    const titleName = name ? `مسار ${esc(name)}: ${esc(T0)}` : `مسارك: ${esc(T0)}`;
    const masterBadge = LP_BASE[lp] ? ` (رقم رئيسي ${lp})` : "";
    const summaryCard = `<div class="chart-summary-card">
      <div class="chart-summary-info">
        <div class="chart-summary-badge">مسار الحياة والأرقام • رقم ${lp}</div>
        <h3 class="chart-summary-title">${titleName}${masterBadge}</h3>
        <p class="chart-summary-meta">
          <span><span class="meta-glyph">☉</span> ${pad(d)}/${pad(m)}/${y}</span>
          <span class="meta-sep">•</span>
          <span><span class="meta-glyph">✧</span> ${esc(F.tag)}</span>
        </p>
      </div>
      <div class="chart-summary-actions">
        <button type="button" class="btn-edit-lp" id="btn-edit-lp"><svg class="edit-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> تعديل البيانات / مسار جديد</button>
      </div>
    </div>`;
    const blueprintHTML = renderLPBlueprintCard(lp);
    const pinnaclesHTML = renderPinnaclesBlock(name, d, m, y, lp);
    root.innerHTML = returnHomeBtn + summaryCard + `<div class="res-head"><div class="numbadge" aria-hidden="true">${lp}</div><h3>${name ? esc(name) + ": " : ""}${T0}${LP_BASE[lp] ? " (رقم رئيسي " + lp + ")" : ""}</h3><p class="tg2">${F.tag}</p></div>` + dailyHTML(lp) + blueprintHTML + `<div class="panel" style="margin-top:22px"><h3 style="margin:0 0 14px;color:var(--burgundy);font-family:var(--serif);font-size:1.45rem;">الفصول السبعة لرحلة مسار الحياة</h3>${lpHTML(lp)}</div>` + pinnaclesHTML + MX_NOTE;
    if ((LP_BASE[lp] || lp) === 1) {
      root.querySelectorAll("[data-lp-section]").forEach((el, i) => {
        const item = LP1_REVISED_SOURCE[i] || LP1_SOURCE_SECTIONS[i];
        if (!item) return;
        const title = el.querySelector(".lp-sec-title b"); if (title) title.textContent = (item.title || "").replace(/^القسم\s+[^:：]+[:：]\s*/, "");
        const body = el.querySelector(".lp-sec-body"); if (body) body.innerHTML = item.html || sourceTextToHTML(item.text);
      });
    }
    if (lp === 2) applyLP2Sections(root);
    // Render source text verbatim for standard paths 2–9; no summaries or automatic deduplication.
    const fullSections = LP_COMPLETE_SOURCE[String(lp)];
    const masterSections = LP_MASTER_SOURCE_4_7[String(lp)];
    if (fullSections || masterSections) {
      const sourceSections = fullSections || masterSections;
      root.querySelectorAll("[data-lp-section]").forEach((el) => {
        const num = Number(el.getAttribute("data-lp-section"));
        const item = sourceSections[String(num)];
        if (!item) return;
        const title = el.querySelector(".lp-sec-title b");
        if (title) title.textContent = item.title.replace(/^القسم\s+[^:：]+[:：]\s*/, "");
        const body = el.querySelector(".lp-sec-body");
        if (body) body.innerHTML = sourceTextToHTML(item.text);
      });
    }
    // Master numbers: use their dedicated complete source for sections 1–3 and 4–7.
    const masterFirstSections = LP_MASTER_SOURCE_1_3[String(lp)];
    if (masterFirstSections) {
      root.querySelectorAll("[data-lp-section]").forEach((el) => {
        const num = Number(el.getAttribute("data-lp-section"));
        const item = masterFirstSections[String(num)];
        if (!item) return;
        const title = el.querySelector(".lp-sec-title b");
        if (title) title.textContent = item.title.replace(/^القسم\s+[^:：]+[:：]\s*/, "");
        const body = el.querySelector(".lp-sec-body");
        if (body) body.innerHTML = sourceTextToHTML(item.text);
      });
    }
    root.hidden = false;
    root.style.display = "block";
    if (window.AqeqNameReadings) {
      window.AqeqNameReadings.render(name, root, {
        day: Number(d),
        month: Number(m),
        year: new Date().getFullYear(),
        birthYear: Number(y),
        lifePath: Number(lp)
      });
    }
  }
  const lpStart = $("#lp-start"), lpForm = $("#lpform"), lpResult = $("#lpresult");
  /* توافق المسارات صفحة مستقلة (#lifepath-compat)؛ الرابط القديم يحوّل إليها */
  function lpHashAlias() { if (location.hash === "#life-path-synastry") location.replace("#lifepath-compat"); }
  window.addEventListener("hashchange", lpHashAlias);
  lpHashAlias();

  $("#lpform").addEventListener("submit", e => {
    e.preventDefault();
    const err = $("#lperr"); err.hidden = true;
    const v = $("#lp-date").value, gender = $("#lp-gender").value;
    if (!v) { err.textContent = "اكتب تاريخ الميلاد."; err.hidden = false; return; }
    const [y, m, d] = v.split("-").map(Number);
    if (y < 1900 || y > 2100) { err.textContent = "التاريخ لازم يكون بين 1900 و 2100."; err.hidden = false; return; }
    if (new Date(y, m - 1, d) > new Date()) { err.textContent = "تاريخ الميلاد ده في المستقبل. راجع التاريخ."; err.hidden = false; return; }
    if (typeof isolateResultView === "function") isolateResultView("lifepath");
    renderLP($("#lp-name").value.trim(), d, m, y);
    window.AqeeqGender?.apply($("#lpresult"), gender);
    const lpf = $("#lpform"); if (lpf) { lpf.hidden = true; lpf.style.display = "none"; }
    const lps = $("#lp-start"); if (lps) { lps.hidden = true; lps.style.display = "none"; }
    const lpIntro = document.querySelector("#lifepath .center");
    if (lpIntro) { lpIntro.hidden = true; lpIntro.style.display = "none"; }
    const lpr = $("#lpresult");
    if (lpr) { lpr.hidden = false; lpr.style.display = "block"; lpr.scrollIntoView({behavior:'auto',block:'start'}); }
  });


  /* ============ بطاقتك: تاريخ واحد يفتح التلات أدوات ============ */
  const SUN_START = [[1, 20, 10], [2, 19, 11], [3, 21, 0], [4, 20, 1], [5, 21, 2], [6, 21, 3], [7, 23, 4], [8, 23, 5], [9, 23, 6], [10, 23, 7], [11, 22, 8], [12, 22, 9]];
  function sunIdx(d, m) {
    let k = 9;
    SUN_START.forEach(([sm, sd, idx]) => { if (m > sm || (m === sm && d >= sd)) k = idx; });
    return k;
  }
  const isoOf = (y, m, d) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  function openTool(id, d, m, y) {
    const iso = isoOf(y, m, d), gender = $("#q-gender").value;
    if ($("#m-gender")) $("#m-gender").value = gender;
    if ($("#lp-gender")) $("#lp-gender").value = gender;
    if ($("#f-gender")) $("#f-gender").value = gender;
    const syncDateField = (el) => {
      if (!el) return;
      el.value = iso;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    };
    if (id === "matrix") {
      syncDateField($("#m-date"));
      location.hash = "#matrix";
      const mf = $("#mform");
      if (mf) mf.requestSubmit();
    } else if (id === "life") {
      if ($("#lp-start")) $("#lp-start").hidden = true;
      const lpf = $("#lpform");
      if (lpf) {
        lpf.hidden = false;
        lpf.style.display = "";
        syncDateField($("#lp-date"));
        location.hash = "#lifepath";
        lpf.requestSubmit();
      }
    } else {
      syncDateField($("#f-date"));
      const cf = $("#cform"), res = $("#result"), intro = document.querySelector("#chart .center");
      if (cf) { cf.hidden = false; cf.style.display = ""; }
      if (intro) { intro.hidden = false; intro.style.display = ""; }
      if (res) { res.hidden = true; res.style.display = "none"; }
      location.hash = "#chart";
      setTimeout(() => {
        if (cf) cf.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  }
  $("#qform").addEventListener("submit", e => {
    e.preventDefault();
    const er = $("#qerr"); er.hidden = true;
    const v = $("#q-date").value, gender = $("#q-gender").value;
    if (!v) { er.textContent = "يرجى اختيار تاريخ الميلاد أولاً."; er.hidden = false; return; }
    const [y, m, d] = v.split("-").map(Number);
    if (y < 1900 || y > 2100) { er.textContent = "التاريخ يجب أن يكون بين 1900 و 2100."; er.hidden = false; return; }
    if (new Date(y, m - 1, d) > new Date()) { er.textContent = "تاريخ الميلاد في المستقبل، يرجى مراجعة التاريخ."; er.hidden = false; return; }
    const P = matrixCalc(d, m, y), lp = lifePath(d, m, y), base = LP_BASE[lp] || lp, F = LP_FREE[base];
    const a = ARC(P.A), c = ARC(P.E), sg = SIGNS[sunIdx(d, m)];
    $("#qtitle").textContent = "البصمة التأسيسية · " + `${d}/${m}/${y}`;
    $("#qgrid").innerHTML =
      `<article class="qt"><div class="qt-top"><span class="k">مصفوفة القدر</span><span class="nb" aria-hidden="true">${P.E}</span></div><h3 class="big">${c.n}</h3><p>طاقة المركز: ${c.core}. والسمة الفطرية للميلاد: ${a.n}.</p><button class="btn ghost sm" type="button" data-qopen="matrix">افتح مصفوفة القدر ←</button></article>` +
      `<article class="qt"><div class="qt-top"><span class="k">مسار الحياة</span><span class="nb" aria-hidden="true">${lp}</span></div><h3 class="big">${F.t}</h3><p>${F.tag}. ${F.essence.split(". ")[0]}.</p><button class="btn ghost sm" type="button" data-qopen="life">افتح مسار الحياة ←</button></article>` +
      `<article class="qt"><div class="qt-top"><span class="k">البرج الشمسي</span><span class="sg2" aria-hidden="true">${gl(sg.g)}</span></div><h3 class="big">${sg.n}</h3><p>الأسلوب: ${sg.way}. ونقطة القوة الأساسية: ${sg.strength}.</p><button class="btn ghost sm" type="button" data-qopen="chart">احسب الخريطة الكاملة ←</button></article>`;
    $$("[data-qopen]", $("#qgrid")).forEach(b => b.addEventListener("click", () => openTool(b.dataset.qopen, d, m, y)));
    const q = $("#quick");
    window.AqeeqGender?.apply(q, gender);
    window.AqeeqCopyMap?.attach(q, "بطاقة سريعة · " + d + "/" + m + "/" + y);
    q.hidden = false;
    q.style.display = "block";
    q.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  });

  /* ============ نمطك: قراءة شخصية بأسلوب مباشر (غرايز، نمو، علاقات، روابط) ============ */
  const PT = {
    feel: [
      "لما بتزعل بتتحرك بسرعة: بتتخانق أو تعمل حاجة تفرّغ بيها الغضب، وبعدين تندم على نبرتك. يمكن حاسس إن مفيش حد بيستحمل سرعة مشاعرك، لكن نفس السرعة دي هي الي بتخليك صادق مع نفسك.",
      "بتحتاج حاجات ثابتة عشان تحس بالأمان: ناس وأماكن وروتين. ولما حاجة تتغير فجأة بتتهز من جواك حتى لو مبينتش. ده مش جمود، ده إنك بتحب تبني حاجة تدوم.",
      "مشاعرك بتتحول لكلام وتحليل: بدل ما تعيش الإحساس بتفكر فيه وتحكيه. ممكن الناس تفتكر إنك مش متأثر لأنك بتحكي بخفة. الحكي هو طريقتك في الشفاء، فاختار حد يسمعك فعلًا.",
      "بتحس بكل حاجة وبتمتص مزاج الي حواليك. بتقلق على الناس ونادرًا حد بيسألك إنت كويس ولا لأ. ده مش ضعف، ده عمق في الاحتواء، بس محتاج تحمي نفسك.",
      "جواك طفل محتاج يتشاف ويتحب. لو حد اتجاهلك بتتجرح أكتر مما بتبين، وساعات بتتصرف بكبرياء عشان تداري. ده مش غرور، ده إنك بتدي بقلبك وعايز تتبادل.",
      "بتهدأ لما تكون مفيد ومنظم، ولما مشاعرك تتلخبط بتحللها لحد ما تتعب. بتقول لنفسك إنك لازم تكون كويس طول الوقت. محتاج تسمح لنفسك تحس من غير ما تصلّح كل حاجة.",
      "بتحس بالأمان وسط ناس مرتاحة معاك، والخناق بيوجعك أكتر من غيرك. ممكن تسكت عشان تحافظ على السلام وبعدين تتضايق جواك. ده حبك للانسجام، بس صوتك مهم.",
      "مشاعرك قوية جدًا وقليل الي بيشوفها. بتحس إنك لو فتحت قلبك هتتجرح، فبتختبر الناس بصمت. ده مش برود، ده إنك بتحب مرة واحدة وبعمق.",
      "بتحس بالأمان لما تكون حر ومتفائل، والقيود بتخنقك. لما بتتضايق بتهرب لفكرة أو مكان جديد. ده مش هروب بس، ده إيمانك إن فيه حاجة أحسن.",
      "اتعودت تتحمل لوحدك ومتبينش ضعفك. ممكن تحس إنك لازم تكون قوي طول الوقت. جواك احتياج لحد يطمنك من غير ما تضطر تطلب. اسمح لنفسك تحتاج.",
      "بتفهم مشاعرك بعقلك، ولما تتضايق بتبعد وتحلل. الناس ممكن تشوفك بارد وإنت جواك بتحس بكتير. محتاج مساحة، ومحتاج برضو حد يقرب بدون ضغط.",
      "بتحس بكل حاجة وبتتأثر بأجواء الناس لدرجة إنك ساعات متعرفش دي مشاعرك ولا مشاعرهم. بتهرب للخيال أو النوم لما الضغط يزيد. دي حساسية عالية، ومحتاجة حدود."
    ],
    drive: [
      "بتتحرك الأول وتفكر بعدين. الغضب عندك سريع ويروح سريع، والتحدي بيشعلك. عدّ لعشرة قبل الرد وهتوفر على نفسك ندم كتير.",
      "بتتحرك ببطء، لكن لما تقرر مفيش حد بيزحزحك. بتتضايق ببطء وممكن تنفجر مرة واحدة لو كتمت كتير. قوتك في الصبر، بس الكبت بيتعبك.",
      "بتتحرك بالكلام والأفكار، وبتبدأ حاجات كتير وبتفقد الحماس. لما تتضايق بتجادل أو بتسخر. وجّه طاقتك في مشروع واحد لحد ما يخلص.",
      "بتتحرك بالمشاعر مش بالمنطق، وبتدافع عن الي بتحبه بشراسة. لما تتضايق بتسكت أو تتجرح بدل ما تواجه. قول الي ضايقك صريح بدل التلميح.",
      "بتتحرك بثقة وبتحب تقود. لو اتقلل منك بتتحول لعناد وكبرياء. قوتك في الحماس الدافي، وتعلّم إن الخلاف مش إهانة.",
      "بتتحرك بالدقة والتنظيم، وبتنتقد نفسك أكتر من غيرك. لما تتضايق بتلاحظ كل الأخطاء بدل ما تقول إيه الي ضايقك فعلًا. شغلك قوة، بس ماتخليش الكمال يعطلك.",
      "بتتحرك بحذر وبتحب تتجنب المواجهة، فبتأجل قرارات. لما تتضايق بتبقى لطيف من بره وغاضب من جوه. قول لأ بوضوح وهتتفاجئ إن العلاقة مابتتهدش.",
      "بتتحرك بعمق وإصرار، ولما تقرر بتكمل للآخر. لما تتجرح بتفتكر وبتخطط بصمت. قوتك كبيرة، فركزها في البناء مش في الانتقام.",
      "بتتحرك بحماس ومغامرة وبتحب الحرية. لما تتضايق بتبالغ في الصراحة وتجرح من غير قصد. وجّه طاقتك في هدف كبير يستاهل.",
      "بتتحرك بخطة وانضباط وطموح. لما تتضايق بتبقى بارد وصارم. قوتك في التحمل، بس اسمح لنفسك ترتاح من غير ذنب.",
      "بتتحرك بأفكارك الخاصة ومابتحبش حد يملي عليك. لما تتضايق بتتمرد أو تنسحب. قوتك في الابتكار، بس ماتبعدش عن الي بيحبوك.",
      "بتتحرك بالحدس والمزاج، وطاقتك بتتقلب. لما تتضايق بتنسحب أو تتجنب. ابدأ بخطوات صغيرة ولاحظ مزاجك قبل ما تقرر."
    ],
    mind: [
      "بتفكر بسرعة وبتتكلم مباشر من غير تزويق. بتحب القرارات السريعة وبتمل من الشرح الطويل. الصراحة قوتك، بس خد بالك من نبرتك.",
      "بتفكر ببطء وبعملية، وبتاخد وقت قبل ما تغير رأيك. بتحب الحاجات الملموسة. الي بيشوفك عنيد قصده إنك مش بتتسرع.",
      "دماغك سريعة وفضولية وبتنط من فكرة لفكرة. بتحب الكلام والتعلم. التشتت هو تحديك، فاكتب أفكارك قبل ما تضيع.",
      "بتفكر بقلبك وبتفتكر كل حاجة بتحس بيها، حتى كلمة اتقالت من سنين. بتتكلم بحساسية. ماتخليش الماضي يتحكم في ردودك.",
      "بتتكلم بثقة ودفا وبتحب تقنع الناس. بتحب تتسمع. الكلام الجميل سلاحك، فاسمع بنفس القدر.",
      "بتفكر بدقة وتحليل وبتلاحظ التفاصيل. بتحب تصلّح وتحسّن. القلق الزايد بيخلي دماغك مابتهداش، فاكتب الأفكار وارميها.",
      "بتفكر بتوازن وبتشوف كل الجوانب، وده بيخليك مترددًا. بتتكلم بلطف. اكتب الإيجابيات والسلبيات وخد قرارك.",
      "بتفكر بعمق وبتشوف الي ورا الكلام. بتشك بسرعة وبتحب الحقيقة. اسأل بدل ما تفترض.",
      "بتفكر بالصورة الكبيرة وبتحب الفلسفة والأفكار. بتتكلم بصراحة ممكن تجرح. خد بالك من التفاصيل.",
      "بتفكر بخطط وأهداف وبتتكلم بإيجاز ومسؤولية. بتشك في الكلام الفاضي. اسمح للأفكار الحرة تدخل.",
      "بتفكر بشكل مختلف وبتشوف حلول غير تقليدية. بتتكلم بموضوعية وأحيانًا ببرود. اشرح أفكارك ببساطة.",
      "بتفكر بالصور والحدس والمشاعر مش بالمنطق البحت. أفكارك خيالية وساعات بتتوه. اكتب، وماتقررش وإنت مشتت."
    ],
    fear: [
      "خوفك الأساسي إنك تبان ضعيف أو ماتبقاش الأول. بتخاف تعتمد على حد، فبتعمل كل حاجة لوحدك. النمو إنك تطلب المساعدة، ومش هزيمة.",
      "خوفك الأساسي إنك تخسر الأمان والاستقرار. بتتمسك بالموجود حتى لو مش مريحك. النمو إنك تعتمد على قيمتك مش على الأشياء.",
      "خوفك الأساسي إنك ماتبقاش ذكي كفاية أو إن كلامك ملوش قيمة. بتتردد تعبّر عن نفسك. النمو إنك تتكلم حتى لو مش مثالي.",
      "خوفك الأساسي إنك ماتتحبش أو تتساب. بتتعلق بالأمان العاطفي. النمو إنك تبني أمانك بنفسك.",
      "خوفك الأساسي إنك ماتتشافش أو ماتبقاش مميز. بتحتاج التصفيق. النمو إنك تحب نفسك من غير جمهور.",
      "خوفك الأساسي إنك مش كفاية أو إنك تغلط. بتجلد نفسك. النمو إنك تقبل النقص.",
      "خوفك الأساسي إنك تتساب لو قلت لأ أو اتخذت موقف. بتتجنب الصدام. النمو إنك تحافظ على نفسك جوه العلاقة.",
      "خوفك الأساسي إنك تتخان أو تفقد السيطرة. بتتحصن وماتفتحش قلبك. النمو إنك تثق بالتدريج.",
      "خوفك الأساسي إنك تتحبس أو حياتك ماتبقاش ليها معنى. بتهرب من الالتزام. النمو إنك تلتزم بحاجة بتؤمن بيها.",
      "خوفك الأساسي إنك تفشل أو ماتبقاش ناجح. بتشتغل أكتر من طاقتك. النمو إنك تثبت لنفسك قيمتك من غير نجاح.",
      "خوفك الأساسي إنك تتحبس في مجموعة أو تفقد استقلالك. بتبعد. النمو إنك تقرب من غير ما تخسر نفسك.",
      "خوفك الأساسي من الفوضى وفقدان الاتجاه. بتهرب للخيال. النمو إنك تبني حدود وروتين بيحميك."
    ],
    love: [
      "بتحب بشغف وبتحب المطاردة، وبتمل لو العلاقة بقت رتيبة. محتاج حد صريح وقوي مايخافش منك. خد بالك من اندفاعك.",
      "بتحب ببطء وإخلاص، وبتعبّر عن الحب بالأفعال والوقت. محتاج أمان وثبات. العند في العلاقة هو خطرك.",
      "بتحب العقل قبل القلب، وبتنجذب للي بتتكلم معاه ساعات. بتمل من الكتمة. محتاج حبيب وصاحب في نفس الشخص.",
      "بتحب بعمق وحماية، وبتعتبر الحبيب بيت. محتاج أمان عاطفي وحنية. التعلق الزايد هو خطرك.",
      "بتحب بكرم وبدراما حلوة، وبتحب تدلّل وتتدلّل. محتاج إعجاب وصدق. الكبرياء ممكن يبعّد الي بتحبه.",
      "بتحب بالاهتمام بالتفاصيل وخدمة الحبيب. بتنتقد بدافع الحب. محتاج حد يقدّر مجهودك.",
      "بتحب الانسجام والرومانسية وبتحب الشريك اللطيف. بتتجنب الخلاف على حساب نفسك. محتاج توازن.",
      "بتحب كل حاجة أو مفيش، وبتحب العمق والإخلاص. الغيرة والشك خطرك. محتاج حد صادق ومستعد للعمق.",
      "بتحب الحرية والمغامرة وبتحب الشريك الصاحب. بتخاف من القيد. محتاج حد يشاركك الرحلة.",
      "بتحب ببطء وجدية، وبتختار الشريك بعقلك. بتتحفظ في التعبير. محتاج حد يدفّيك.",
      "بتحب الصداقة قبل الرومانسية وبتحب الاستقلال. بتبعد لو حسيت بخنق. محتاج حد يحترم مساحتك.",
      "بتحب بحلم وروحانية وبتتفانى. بتشوف الحبيب أحسن من الواقع. محتاج حد حقيقي، وحدودك لازم تكون واضحة."
    ],
    partner: [
      "بتنجذب لحد جريء ومباشر يحركك ويحمسك. لو غابت منه المبادرة هتحس بالملل.",
      "بتحتاج حد ثابت وحسّي يطمنك ويبني معاك خطوة بخطوة.",
      "بتحتاج حد ذكي وفضولي تتكلم معاه ساعات ويضحكك.",
      "بتحتاج حد حنون يحتويك ويحسسك بالأمان من غير ما تطلب.",
      "بتحتاج حد واثق ودافي يقدّرك ويبرز الي فيك.",
      "بتحتاج حد منظم وبيهتم بالتفاصيل ويساعدك تتوازن.",
      "بتحتاج حد لطيف ومتزن يشاركك الانسجام ويحترم رأيك.",
      "بتحتاج حد عميق وصادق مايخافش من الشدة ولا من الصمت.",
      "بتحتاج حد حر ومتفائل يوسّع عالمك ومايحبسكش.",
      "بتحتاج حد جاد وناضج تعتمد عليه وتحترمه.",
      "بتحتاج حد مستقل ومختلف يحترم مساحتك وأفكارك.",
      "بتحتاج حد حساس وحالم يفهمك من غير كلام كتير."
    ]
  };
  const SM_REL = {
    same: "الشمس والقمر عندك من نفس العنصر، فبتحس بنفسك متماسك: الي بتحسه قريب جدًا من الي بتبانه للناس.",
    comp: "الشمس والقمر عندك بيدعموا بعض: عقلك ومشاعرك بيكملوا بعض بسهولة، وده بيديك استقرار داخلي.",
    conf: "فيه فرق بين الي بتبانه والي بتحسه. أوقات بتبان حاجة وجواك حاجة تانية، وده بيخليك تحس إنك شخصين. ده تحدي، وهو برضو مصدر عمقك."
  };
  const DEEPQ = [
    "النهاردة اسأل نفسك: أنهي موقف الأسبوع ده فضل في دماغك أكتر من اللازم؟ وإيه الي كنت محتاجه فيه فعلًا؟",
    "اسأل نفسك: أنهي قرار بتأجله لأنك خايف من رد فعل حد؟ واكتب أسوأ حاجة ممكن تحصل، وهل هي فعلًا بالسوء ده؟",
    "فكّر: إمتى آخر مرة قلت لأ من غير ما تتبرر؟ وإيه الي حسيت بيه بعدها؟",
    "اكتب: إيه الحاجة الي بتعملها عشان الناس تحبك وإنت مش عايزها؟",
    "اسأل نفسك: أنهي علاقة في حياتك بتديك أكتر ما بتاخد؟ وأنهي واحدة العكس؟",
    "فكّر: إيه الحاجة الي بتقول عليها «أنا كده» وهي في الحقيقة عادة اتعلمتها زمان؟",
    "اكتب جملة واحدة لنفسك الصغيرة: إيه الي كانت محتاجة تسمعه؟",
    "اسأل نفسك: لو ماكنتش خايف، كنت هتعمل إيه الأسبوع ده؟"
  ];
  const sub = (t, p) => `<article class="rd"><h4>${t}</h4><p>${p}</p></article>`;

  function patternHTML(S) {
    const ch = S.ch, sg = k => body(ch, k).sign;
    const sun = sg("sun"), moon = sg("moon"), merc = sg("mercury"), ven = sg("venus"), mar = sg("mars"), sat = sg("saturn");
    const ea = SIGNS[sun].el, eb = SIGNS[moon].el;
    const rel = ea === eb ? "same" : ((ea + eb) % 2 === 0 ? "comp" : "conf");
    const nd = body(ch, "truenode").sign;
    let o = `<p class="lead2">ده مش توقع للنهاردة، ده وصف لنمطك الثابت: الطريقة الي بتتصرف وتحس بيها وتحب بيها. اقراه بهدوء وخد الي بيشبهك، وسيب الباقي.</p>`;
    o += `<h4 class="ph">غرايزك</h4>`;
    o += sub("إزاي بتحس", PT.feel[moon]);
    o += sub("إزاي بتتحرك وقت الضغط", PT.drive[mar]);
    o += sub("إزاي بتفكر وبتتكلم", PT.mind[merc]);
    if (ch.known) { const r = Math.floor(ch.asc / 30); o += sub("أول انطباع الناس بتاخده عنك", RISING_TXT[r]); }
    o += sub("بين الي بتبانه والي بتحسه", SM_REL[rel]);
    o += `<h4 class="ph">مناطق نموك</h4>`;
    o += sub("خوفك الأساسي", PT.fear[sat]);
    o += sub("الحاجة الي بتكبّرك", `${SIGNS[sun].growth}. وبالنسبة لاتجاه نموك الأبعد، حياتك بتشدك ناحية ${SIGNS[nd].strength}، يعني كل مرة بتتحرك ناحيتها بتحس إنك قريب من نفسك.`);
    o += `<h4 class="ph">علاقاتك</h4>`;
    o += sub("إزاي بتحب", PT.love[ven]);
    if (ch.known) { const dsc = (Math.floor(ch.asc / 30) + 6) % 12; o += sub("الشريك الي بيكملك", PT.partner[dsc]); }
    else o += `<p class="note">ولو عرفت وقت ميلادك هنقدر نقولك كمان إيه نوع الشريك الي بيكملك.</p>`;
    o += `<h4 class="ph">فكرة اليوم</h4>` + sub("للتأمل", DEEPQ[Math.floor(Date.now() / 864e5) % DEEPQ.length]);
    return o + NOTE_SYM;
  }

  /* ---------- روابط: تناغم بين اتنين ---------- */
  const BOND_KEYS = ["sun", "moon", "mercury", "venus", "mars", "saturn"];
  const BOND_IMP = { sun: 3, moon: 3, venus: 3, mars: 3, mercury: 2, saturn: 2 };
  const BOND_TXT = {
    high: ["تناغم عالي", "فيه ارتياح طبيعي بينكم، وبتحسوا إنكم فاهمين بعض من غير شرح كتير. الخطر إن السهولة تخليكم تسيبوا العلاقة من غير مجهود، فاشتغلوا عليها زي أي علاقة."],
    mean: ["علاقة ليها معنى", "دي علاقة فيها جذب وفيها احتكاك مع بعض، وبتعلّم كل واحد فيكم حاجة عن نفسه. مش سهلة ومش مستحيلة، ونجاحها بيعتمد على وعيكم بالاختلافات."],
    hard: ["علاقة تحدي", "بينكم توتر واضح، وكل واحد بيشوف في التاني حاجة بتضغط عليه. ده مش حكم إن العلاقة فاشلة، لكنه بيقول إنها محتاجة وضوح وحدود وصبر ومش بتمشي بالسهل."],
    soft: ["علاقة هادية", "مفيش ارتباط فلكي قوي بينكم، فالعلاقة ممكن تكون لطيفة وخفيفة. والعمق فيها بيتبني بالوقت والاختيار مش بالتأثير الفلكي."]
  };
  function bondsCalc(A, B) {
    const out = [];
    BOND_KEYS.forEach(ka => BOND_KEYS.forEach(kb => {
      if (ka === "saturn" && kb === "saturn") return;
      const d = Math.abs(d180(body(A, ka).lon - body(B, kb).lon));
      for (const AS of ASPECTS) {
        let lim = Math.min(AS.orb, 6); if (ka === "saturn" || kb === "saturn") lim = Math.min(lim, 4);
        const orb = Math.abs(d - AS.ang);
        if (orb <= lim) {
          const imp = (BOND_IMP[ka] + BOND_IMP[kb]) / 2, w = imp * (1 - orb / lim);
          const heavy = ka === "saturn" || kb === "saturn" || ka === "mars" || kb === "mars";
          let kind = ["tri", "sext"].includes(AS.k) ? "h" : (AS.k === "conj" ? (heavy ? "t" : "h") : "t");
          if (AS.k === "opp" && !heavy) kind = "m";
          out.push({ ka, kb, AS, w, kind });
          break;
        }
      }
    }));
    return out.sort((x, y) => y.w - x.w);
  }
  function bondsHTML(A, B) {
    const L = bondsCalc(A, B);
    let H = 0, T = 0;
    L.forEach(l => { if (l.kind === "h") H += l.w; else if (l.kind === "m") { H += l.w * .5; T += l.w * .5; } else T += l.w; });
    const cat = H + T < 5 ? "soft" : (H >= 6.5 && H > T * 2 ? "high" : (T >= 4 && T > H * 1.2 ? "hard" : "mean"));
    let o = `<div class="bond-cat"><strong>${BOND_TXT[cat][0]}</strong><p>${BOND_TXT[cat][1]}</p></div>`;
    o += `<h4 class="ph">أهم الروابط بينكم</h4>`;
    o += L.length ? L.slice(0, 5).map(l => {
      const tag = l.kind === "h" ? "دعم" : (l.kind === "m" ? "جذب وشد" : "احتكاك");
      return `<article class="rd"><h4>${gl(PLANETS[l.ka].g)} ${PLANETS[l.ka].n} عندك مع ${gl(PLANETS[l.kb].g)} ${PLANETS[l.kb].n} عنده <span class="orb">${tag}</span></h4><p>${themeOf(l.ka)} عندك مع ${themeOf(l.kb)} عنده: ${l.AS.nat}.</p></article>`;
    }).join("") : `<p>مفيش روابط قريبة واضحة بين الخريطتين.</p>`;
    o += `<p class="note">النتيجة بتتحسب من تاريخ الميلاد فقط للشخص التاني، فدقة القمر ممكن تفرق لحد ٦ درجات. للقراءة الكاملة بوقت الميلاد، كلمني.</p>` + NOTE_SYM;
    return o;
  }
  function wirePattern(root, S) {
    const go = $("#b-go", root); if (!go) return;
    go.addEventListener("click", () => {
      const err = $("#b-err", root), out = $("#b-out", root); err.hidden = true;
      const v = $("#b-date", root).value;
      if (!v) { err.textContent = "اكتب تاريخ ميلاد الشخص التاني."; err.hidden = false; return; }
      const [y, m, d] = v.split("-").map(Number);
      if (y < 1900 || y > 2100) { err.textContent = "التاريخ لازم يكون بين 1900 و 2100."; err.hidden = false; return; }
      const B = Astro.chart({ utcMs: Date.UTC(y, m - 1, d, 12, 0), lat: 30, lon: 31, known: false });
      out.innerHTML = bondsHTML(S.ch, B); out.hidden = false;
    });
  }

})();


(function () { try { document.querySelectorAll('img[src*="brand/logo-mark-160"]').forEach(im => { im.addEventListener("error", () => { if (!im.dataset.fb) { im.dataset.fb = "1"; im.src = "assets/images/brand/logo-mark-512.png"; } }); if (im.complete && im.naturalWidth === 0) im.src = "assets/images/brand/logo-mark-512.png"; }); } catch (e) {} })();

/* إعادة الرسم بعد تحميل نصوص الصفحة المؤجلة حتى لا تظهر النصوص القديمة الاحتياطية */
(function () { try { const rr = () => { try { if (window.AqLive && window.__aqSignsRerender) window.__aqSignsRerender(); } catch (e) {} }; if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", rr); else rr(); window.addEventListener("load", rr); } catch (e) {} })();

;
/* assets/js/inline/page-07.js */

/* Ivory Celestial Editorial Luxury: legacy dark starfield canvas disabled */
(function () {
  const cv = document.getElementById("sky-bg");
  const mw = document.getElementById("mw");
  if (cv) cv.style.display = "none";
  if (mw) mw.style.display = "none";
})();

;
/* assets/js/inline/page-08.js */

(function(){
  var F=["اللي بيستنى الإشارة الكاملة بيفوّت وقت الخطوة الصغيرة. ابدأ بحاجة صغيرة النهاردة.","مش لازم تكون مرتاح من كل حاجة عشان تتحرك. الخطوة وانت خايف برضه خطوة.","اللي بيحاول يرضي الكل بيخسر نفسه. قول لا مرة واحدة بهدوء وشوف الدنيا مش هتقع.","الهدوء مش ضعف. ممكن تكون ساكت وعارف انت رايح فين.","النهاردة فرصة تسمّي اللي بتحس بيه بدل ما تكبته. التسمية وحدها بتخفف.","بطّئ شوية في الرد. المسافة اللي بتاخدها قبل ما تتكلم بتحميك من كلام ماتقصدوهوش.","اللي تعبته امبارح مش لازم يتكرر بكرة. ابدأ من النهاردة بقرار صغير ومتابع له.","الناس اللي بتحبك مش محتاجة منك تكون كامل. محتاجين صدقك.","حدودك مش جفا. كل مرة تحافظ فيها على وقتك بتعلّم الناس تحترمه.","اللي ييجي بسهولة ممكن يكون مهم، واللي بيتأخر ممكن يكون بيعلّمك تحمّل.","متحكمش على نفسك من أول محاولة. الهدف إنك تتحرك، مش إنك تكون مثالي.","خد نفس عميق قبل القرار الجاي. الوضوح بييجي بعد الهدوء مش قبله.","اللي حواليك بيشوفوا أكتر مما بتتخيل. ابقى صادق معاهم وده هيكسبك احترامهم.","الماضي فسّر ليك ليه بتعمل كده، بس مش لازم يحدد بكرة."];
  var d=new Date(),doy=Math.floor((d-new Date(d.getFullYear(),0,0))/864e5);
  var f=document.getElementById("fortune-txt"); if(f) f.textContent=F[doy%F.length];
})();

;
/* assets/js/inline/page-09.js */

(function(){
  var mform=document.getElementById("mf-form");
  if(mform){
    var KEY="aqeeq_manifest", mlist=document.getElementById("mf-list");
    var mread=function(){try{return JSON.parse(localStorage.getItem(KEY)||"[]");}catch(x){return [];}};
    var mwrite=function(a){try{localStorage.setItem(KEY,JSON.stringify(a));return true;}catch(x){return false;}};
    var mesc=function(x){return String(x).replace(/&/g,"&amp;").replace(/</g,"&lt;");};
    var mrender=function(){
      var a=mread();
      mlist.innerHTML=a.length? a.slice().reverse().map(function(r){return '<li><small>'+mesc(r.d)+'</small><p>'+mesc(r.img)+'</p>'+(r.q?'<p class="sub">'+mesc(r.q)+'</p>':'')+'<button type="button" class="btn ghost sm" data-del="'+mesc(r.id)+'">امسح</button></li>';}).join("") : "";
    };
    mform.addEventListener("submit",function(e){
      e.preventDefault();
      var err=document.getElementById("mf-err"), img=document.getElementById("mf-img").value.trim(), q=document.getElementById("mf-q").value.trim();
      err.hidden=true;
      if(!img){err.textContent="اكتب الصورة اللي في بالك الأول.";err.hidden=false;return;}
      var a=mread(); a.push({id:Date.now(),d:new Date().toLocaleDateString("ar-EG"),img:img,q:q});
      if(!mwrite(a)){err.textContent="المتصفح مش سامح يحفظ هنا. جرب متصفح تاني أو وضع عادي.";err.hidden=false;return;}
      document.getElementById("mf-img").value=""; document.getElementById("mf-q").value=""; mrender();
    });
    mlist.addEventListener("click",function(e){
      var id=e.target && e.target.getAttribute && e.target.getAttribute("data-del");
      if(!id) return;
      mwrite(mread().filter(function(r){return String(r.id)!==id;})); mrender();
    });
    mrender();
  }
})();

;
/* assets/js/inline/page-10.js */

(function(){
  var esc=function(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");};
  var words={
    warmth:["بحب","وحشتني","مشتاق","حبيبي","حبيبتي","قلبي","بحبك","اشتقت","اهتمام","مبسوط"],
    conflict:["زعلان","متضايق","خناقة","مش فاهم","مش فاهمة","ليه كده","دايمًا","أبدًا","تعبت","مش قادر","مش قادرة","بتتجاهل","تجاهل"],
    boundary:["سيبني","مساحتي","مش عايز","مش عايزة","كفاية","حدود","ضغط","غصب","لازم","مجبور","مجبورة"],
    uncertainty:["مش عارف","مش عارفة","يمكن","مش متأكد","مش متأكدة","حاسس","حاسه","خايف","خايفة","محتار","محتارة"],
    repair:["آسف","آسفة","حقك عليا","خلينا نتكلم","نفهم بعض","نتفاهم","أصلح","نحل","سامحني","سامحيني"]
  };
  function countWords(t,arr){return arr.reduce(function(n,w){return n+(t.split(w).length-1);},0);}
  function reportCard(title,body,score){return '<div class="aq-report-card"><h4>'+esc(title)+'</h4><p>'+esc(body)+'</p><div class="aq-meter"><span style="--meter:'+Math.max(12,Math.min(92,score*18+18))+'%"></span></div></div>';}
  function localTextReport(text,kind){
    var t=text.toLowerCase(), c={};Object.keys(words).forEach(function(k){c[k]=countWords(t,words[k]);});
    var total=Object.values(c).reduce(function(a,b){return a+b;},0), tone=c.conflict>c.warmth?'في النص إشارات لغوية للخلاف أو الإحباط أكثر من كلمات الود':c.warmth>c.conflict?'في النص كلمات ود أو اهتمام ظاهرة':'الإشارات اللغوية مختلطة أو قليلة، فصعب تحديد نبرة واحدة';
    var items=[];
    items.push(reportCard('نبرة الكلام',tone,c.conflict+c.warmth));
    items.push(reportCard('الاحتياج المحتمل',c.boundary?'فيه إشارات لمساحة شخصية أو حدود؛ الأفضل السؤال عنها مباشرة بدل افتراض معناها':c.uncertainty?'فيه إشارات للحيرة أو عدم وضوح؛ سؤال محدد ممكن يساعد':'النص وحده مش كفاية لمعرفة الاحتياج؛ جرّب سؤالًا مفتوحًا ومحايدًا',c.boundary+c.uncertainty));
    items.push(reportCard('فرصة التفاهم',c.repair?'ظهرت كلمات مرتبطة بالاعتذار أو محاولة الإصلاح؛ تابع هل بيقابلها تغيير عملي':'ممكن تبدأ بجملة تصف إحساسك واحتياجك من غير اتهام، ثم تسمع رد الطرف الآخر',c.repair+1));
    var suggestions=kind==='chat'?[
      'اقرأ الرسائل في سياقها، مش كلمة واحدة بمعزل عن اللي قبلها وبعدها.',
      'فرّق بين اللي اتقال فعلًا وبين تفسيرك لسبب قوله. النوايا لا يمكن إثباتها من النص وحده.',
      'لو هترد، اكتب نقطة واحدة واضحة واسأل سؤالًا محددًا بدل فتح كل الخلافات مرة واحدة.'
    ]:[
      'اكتب الوقائع اللي حصلت فعلًا بعيدًا عن التخمين في نية الطرف الآخر.',
      'حدد احتياجك الأساسي: وضوح، اعتذار، وقت، احترام، أو اتفاق عملي.',
      'اطلب حوارًا هادئًا وحدد حدّك الشخصي لو السلوك المؤذي بيتكرر.'
    ];
    return '<div class="msg-card"><p class="msg-txt"><strong>قراءة أولية للنص، من غير ذكاء اصطناعي</strong><br>دي مؤشرات لغوية بسيطة من الكلمات اللي كتبتها، مش حكم على العلاقة ولا تشخيص نفسي، ومش بتكشف النوايا.</p></div><div class="aq-report-grid">'+items.join('')+'</div><h3 class="aq-section-title">خطوات عملية</h3><ul class="insight-list">'+suggestions.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul><p class="aq-note">عدد الإشارات اللغوية المرصودة: '+total+'. النتيجة تتأثر باللهجة والسياق والسخرية والرسائل الناقصة؛ استخدمها كبداية للتفكير فقط.</p>';
  }
  function localForm(id,kind){var f=document.getElementById(id);if(!f)return;f.addEventListener('submit',function(e){e.preventDefault();var ta=f.querySelector('textarea'),err=f.querySelector('.ferr'),out=document.getElementById(id.replace('-form','-out')),text=ta?ta.value.trim():'';if(err)err.hidden=true;if(!text){if(err){err.textContent='اكتب النص الأول.';err.hidden=false;}return;}if(kind==='chat'&&text.length<25){if(err){err.textContent='اكتب جزءًا أطول شوية عشان نقدر نلاحظ نمطًا لغويًا.';err.hidden=false;}return;}if(out){out.innerHTML=localTextReport(text,kind);out.hidden=false;out.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}});}
  localForm('chat-form','chat');
  localForm('ask-form','ask');
  var KEY="aqeeq_wishes", form=document.getElementById("wish-form"), list=document.getElementById("wish-list");
  if(form&&list){
    var read=function(){try{return JSON.parse(localStorage.getItem(KEY)||"[]");}catch(x){return [];}};
    var write=function(a){try{localStorage.setItem(KEY,JSON.stringify(a));return true;}catch(x){return false;}};
    var render=function(){var a=read();list.innerHTML=a.length?a.slice().reverse().map(function(r){return '<li><small>'+esc(r.d)+'</small><p>'+esc(r.t)+(r.s?'<br><span>خطوة: '+esc(r.s)+'</span>':'')+'</p><button type="button" class="btn ghost sm" data-del="'+esc(r.id)+'">امسح</button></li>';}).join(""):"<li>مفيش أمنيات محفوظة لسه.</li>";};
    form.addEventListener("submit",function(e){e.preventDefault();var err=document.getElementById("wish-err"),t=document.getElementById("wish-text").value.trim(),s=document.getElementById("wish-steps").value.trim();err.hidden=true;if(!t){err.textContent="اكتب الأمنية الأول.";err.hidden=false;return;}var a=read();a.push({id:Date.now(),d:new Date().toLocaleDateString("ar-EG"),t:t,s:s});if(!write(a)){err.textContent="المتصفح مش سامح يحفظ هنا. جرب متصفح تاني أو وضع عادي.";err.hidden=false;return;}document.getElementById("wish-text").value="";document.getElementById("wish-steps").value="";render();});
    list.addEventListener("click",function(e){var id=e.target&&e.target.getAttribute&&e.target.getAttribute("data-del");if(!id)return;write(read().filter(function(r){return String(r.id)!==id;}));render();});
    render();
  }
})();

;
/* assets/js/inline/page-11.js */

(function(){
  var links=[].slice.call(document.querySelectorAll(".bnav a"));
  var mark=function(){var h=location.hash||"#home";links.forEach(function(a){a.classList.toggle("on",a.getAttribute("href")===h);});};
  window.addEventListener("hashchange",mark); mark();
})();

;
/* assets/js/inline/page-12.js */

/* Aqeq Astro v2: interaction upgrades & light editorial theme compatibility */
(function(){
  var canvas=document.getElementById('aqeq-stars');if(canvas){canvas.style.display='none';}
  var resultIds=['result','mresult','lpresult','cp-out','chat-out','ask-out'];
  function addTools(el){
    return;
  }
  resultIds.forEach(function(id){var el=document.getElementById(id);if(!el)return;new MutationObserver(function(){if(!el.hidden&&el.innerHTML.trim())addTools(el);}).observe(el,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});if(!el.hidden&&el.innerHTML.trim())addTools(el);});
  document.addEventListener('click',function(e){var p=e.target.closest('[data-aq-print]'),t=e.target.closest('[data-aq-top]');if(p){window.print();}if(t){var el=t.closest('.result');if(el)el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}});
  document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(){var id=a.getAttribute('href').slice(1),el=document.getElementById(id);if(el){el.classList.add('aq-skyline');window.setTimeout(function(){el.classList.remove('aq-skyline');},1800);}});});
  document.querySelectorAll('.wg[role="button"]').forEach(function(g){g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();g.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});});
})();

// Added V2 tools: relationship reflection, tarot card, and searchable symbol libraries.
const aqRelSumDigits=n=>String(n).replace(/\D/g,'').split('').reduce((a,b)=>a+Number(b),0);
const aqRelReduce=n=>{while(n>9&&n!==11&&n!==22&&n!==33)n=String(n).split('').reduce((a,b)=>a+Number(b),0);return n;};
const aqRelLife=date=>{const p=String(date).split('-').map(Number);if(p.length===3){const ds=x=>String(x).split('').reduce((a,b)=>a+Number(b),0);return aqRelReduce(ds(p[2])+ds(p[1])+ds(p[0]));}return aqRelReduce(aqRelSumDigits(date));};
const aqRelMatrix=date=>{let n=aqRelSumDigits(date);while(n>22)n=String(n).split('').reduce((a,b)=>a+Number(b),0);return n||1;};
const aqRelNames={siblings:'الأخوات والإخوة',parent:'علاقة الأبوة أو الأمومة',marriage:'الزواج والارتباط العاطفي',partner:'شراكة الحياة',friend:'الصداقة',work:'شراكة العمل',other:'العلاقة بينكما'};
const aqRelInterpretations={
siblings:{strength:'التاريخ المشترك قد يكون مصدر دعم حتى مع اختلاف طرق التعبير.',friction:'المقارنة القديمة أو توزيع الأدوار داخل الأسرة قد يخلق حساسية.',step:'اتفقوا على حدود واضحة، وتكلموا عن الموقف الحالي بدل فتح كل الخلافات القديمة مرة واحدة.'},
parent:{strength:'العلاقة تقدر تجمع بين الخبرة والرعاية من جهة، والاستقلال وبناء الهوية من جهة أخرى.',friction:'اختلاف الأجيال قد يجعل النصيحة تبدو سيطرة أو الاستقلال يبدو رفضًا.',step:'اسأل قبل تقديم النصيحة، ووضّح الفرق بين الدعم واتخاذ القرار بدل الطرف الآخر.'},
marriage:{strength:'الاهتمام والالتزام اليومي والتواصل الصريح قد يبنوا إحساسًا بالأمان مع الوقت.',friction:'توقعات غير معلنة حول الاهتمام أو المسؤوليات قد تتحول إلى سوء فهم.',step:'كل طرف يقول احتياجه بوضوح، واختاروا اتفاقًا صغيرًا قابلًا للتطبيق هذا الأسبوع.'},
partner:{strength:'الشراكة تستفيد لما يكون لكل طرف مساحة شخصية وهدف مشترك في الوقت نفسه.',friction:'افتراض أن الطرف الآخر يفهم الاحتياج من غير كلام قد يخلق فجوة.',step:'اكتبوا هدفًا مشتركًا واحدًا وحددوا مسؤولية كل طرف وموعد مراجعة الاتفاق.'},
friend:{strength:'الصداقة تقوى بالفضول المتبادل والقبول والقدرة على الاختلاف دون تهديد الرابط.',friction:'تفاوت التوقعات حول التواصل أو الوقت قد يُفهم على أنه تجاهل.',step:'ناقشوا شكل التواصل المناسب لكل طرف من غير اختبار الولاء أو افتراض النوايا.'},
work:{strength:'اختلاف المهارات قد يصبح نقطة قوة إذا كانت الأدوار والنتائج المطلوبة واضحة.',friction:'الغموض في المسؤوليات أو التقدير أو المال قد يخلق توترًا.',step:'وثّقوا الأدوار والقرارات والمواعيد، واتفقوا على طريقة حل الخلاف.'},
other:{strength:'الوضوح والاحترام المتبادل يفتحان مساحة لفهم ما يقدمه كل طرف للعلاقة.',friction:'قد تنشأ الحساسية عندما تختلف التوقعات ولا يتم التعبير عنها.',step:'سمّوا توقعًا واحدًا لكل طرف، ثم اتفقوا على حد أو خطوة عملية قابلة للمراجعة.'}};
const aqRelationForm=document.getElementById('relation-form');
if(aqRelationForm)aqRelationForm.addEventListener('submit',e=>{e.preventDefault();const a=document.getElementById('rel-date-a').value,b=document.getElementById('rel-date-b').value;if(!a||!b)return;const type=document.getElementById('rel-type').value,method=document.getElementById('rel-method').value,la=aqRelLife(a),lb=aqRelLife(b),ma=aqRelMatrix(a),mb=aqRelMatrix(b),distance=Math.abs(la-lb),d=aqRelInterpretations[type]||aqRelInterpretations.other,nA=document.getElementById('rel-name-a').value.trim()||'الطرف الأول',nB=document.getElementById('rel-name-b').value.trim()||'الطرف الثاني',showLife=method!=='matrix',showMatrix=method!=='life',pairText=distance===0?'رقم مسار الحياة متشابه في هذه القراءة الرمزية، لكن التشابه لا يعني تطابق التجارب.':distance<=3?'الأرقام قريبة نسبيًا، لكن التشابه لا يعني أن الاحتياجات أو التجارب متطابقة.':'الأرقام مختلفة نسبيًا، وقد تفتح مساحة للتكامل إذا كان الاختلاف مفهومًا ومحترمًا.',out=document.getElementById('relation-output');out.hidden=false;out.innerHTML=`<span class="eyebrow">قراءة رمزية أولية · ${aqRelNames[type]||aqRelNames.other}</span><h3 style="margin:12px 0 4px;color:var(--burgundy);">${nA.replace(/[<>]/g,'')} + ${nB.replace(/[<>]/g,'')}</h3><p style="color:var(--ink-brown);line-height:1.8">${pairText}</p><div class="relation-score"><div class="score-ring">♡</div><div><strong style="display:block;color:var(--burgundy)">قراءة رمزية وليست درجة توافق</strong><span style="display:block;color:var(--muted-text);font-size:.82rem;line-height:1.7">لا توجد نسبة نجاح أو فشل هنا.</span></div></div><div class="result-points">${showLife?`<div class="result-point"><strong>مسار الحياة</strong><p>${nA.replace(/[<>]/g,'')}: ${la} · ${nB.replace(/[<>]/g,'')}: ${lb}<br>${pairText}</p></div>`:''}${showMatrix?`<div class="result-point"><strong>المصفوفة الرمزية</strong><p>الرقم المختزل لتاريخ الميلاد: ${ma} و${mb}. دي مقارنة مبسطة وليست حسابًا كاملًا لمصفوفة القدر.</p></div>`:''}<div class="result-point"><strong>منطقة القوة المحتملة</strong><p>${d.strength}</p></div><div class="result-point"><strong>نقطة تستحق الانتباه</strong><p>${d.friction}</p></div><div class="result-point" style="grid-column:1/-1"><strong>خطوة عملية للعلاقة</strong><p>${d.step}</p></div></div><p class="notice-soft">المحتوى رمزي وتأملي وليس تقييمًا نفسيًا أو علميًا. لا تعتمد عليه وحده في قرارات الزواج أو الانفصال أو القرارات الأسرية والمالية.</p>`;out.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});});
const aqTarotCards=[{n:'النجمة',g:'✶',d:'رمز للأمل الهادئ واستعادة الثقة بعد فترة مرهقة. لا تحتاج أن تحل كل شيء دفعة واحدة.',p:'ما الشيء الصغير الذي يعيد إليّ الإحساس بالاتجاه؟'},{n:'الناسك',g:'☾',d:'دعوة للهدوء والبحث عن إجابة من داخلك، مع تذكّر أن العزلة المفيدة تختلف عن الانقطاع عن الدعم.',p:'ما الذي أعرفه بالفعل لكنني أحتاج إلى وقت لأعترف به؟'},{n:'القوة',g:'♌',d:'القوة هنا ليست السيطرة، بل القدرة على التعامل مع المشاعر والحدود بصبر وشجاعة.',p:'كيف أستطيع أن أكون حازمًا من غير قسوة؟'},{n:'الاعتدال',g:'⚖',d:'رمز للموازنة بين احتياجات مختلفة، وتجربة حل تدريجي بدل القفز إلى أقصى موقف.',p:'ما الطرفان اللذان أحتاج أن أوازن بينهما الآن؟'},{n:'العربة',g:'✦',d:'ترمز إلى الاتجاه والانضباط. وضوح الوجهة وتقسيم الطريق خطوات صغيرة مهمان.',p:'ما القرار الذي أستطيع تحويله إلى خطوة محددة اليوم؟'},{n:'القمر',g:'☽',d:'يرتبط بالغموض والخيال والمشاعر التي لم تتضح بعد. لا تعتبر كل مخاوفك دليلًا على ما سيحدث.',p:'ما الذي أعرفه من الوقائع، وما الذي أملأه بالتوقعات؟'},{n:'العدالة',g:'⚖',d:'تذكير بالنظر إلى الوقائع والحدود والمسؤولية، لا إلى الرغبة وحدها.',p:'ما المعلومة التي أحتاجها قبل أن أحكم على الموقف؟'},{n:'الشمس',g:'☉',d:'رمز للوضوح والحيوية والاحتفاء بالتقدم الحقيقي، حتى لو كان بسيطًا.',p:'ما الشيء الذي يسير بشكل جيد ويستحق أن ألاحظه؟'},{n:'الموت والتحول',g:'♧',d:'في رمزية التاروت يشير غالبًا إلى نهاية مرحلة وتحولها، وليس إلى وفاة حرفية أو نبوءة.',p:'ما العادة أو المرحلة التي لم تعد تخدمني؟'},{n:'العالم',g:'◎',d:'رمز لإكمال دورة ودمج الخبرة. الإغلاق الجيد قد يكون بداية واعية لشيء جديد.',p:'ما الذي تعلمته من المرحلة التي أقترب من إنهائها؟'}];
const aqTarotDraw=document.getElementById('tarot-draw');if(aqTarotDraw)aqTarotDraw.addEventListener('click',()=>{const c=aqTarotCards[Math.floor(Math.random()*aqTarotCards.length)];document.getElementById('tarot-card').innerHTML=`<div><span class="card-glyph">${c.g}</span><strong>${c.n}</strong><span style="display:block;color:var(--muted-text);font-size:.8rem;margin-top:8px">رمز للتأمل</span></div>`;document.getElementById('tarot-title').textContent=c.n;document.getElementById('tarot-description').textContent=c.d;document.getElementById('tarot-prompt').textContent=c.p;});
const aqSymbolSearch=document.getElementById('symbol-search');if(aqSymbolSearch)aqSymbolSearch.addEventListener('input',()=>{const q=aqSymbolSearch.value.trim().toLowerCase();let count=0;document.querySelectorAll('#symbol-grid .symbol-card').forEach(card=>{const ok=(card.innerText+' '+(card.dataset.keywords||'')).toLowerCase().includes(q);card.hidden=!q||ok;if(!card.hidden)count++;});const empty=document.getElementById('symbol-empty');if(empty)empty.hidden=count>0;});
const aqDreamSearch=document.getElementById('dream-search');if(aqDreamSearch)aqDreamSearch.addEventListener('input',()=>{const q=aqDreamSearch.value.trim().toLowerCase();let count=0;document.querySelectorAll('#dream-grid .symbol-card').forEach(card=>{const ok=(card.innerText+' '+(card.dataset.keys||'')).toLowerCase().includes(q);card.hidden=!!q&&!ok;if(!card.hidden)count++;});const empty=document.getElementById('dream-empty');if(empty)empty.hidden=count>0;});

;
/* assets/js/inline/page-13.js */

(function () {
  /* لا نسجل Service Worker؛ ملف sw.js غير موجود ضمن أصول المشروع الحالية. */
  /* مشاركة الموقع: Web Share لو متاح، وإلا نسخ الرابط */
  var sb = document.getElementById('share-site');
  if (sb) {
    var label = sb.querySelector('span'), orig = label.textContent;
    sb.addEventListener('click', function () {
      var url = location.href.split('#')[0];
      var d = document.querySelector('meta[name="description"]');
      var data = { title: document.title, text: d ? d.content : '', url: url };
      var done = function (msg) { label.textContent = msg; setTimeout(function () { label.textContent = orig; }, 2200); };
      if (navigator.share) { navigator.share(data).catch(function () {}); return; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { done('تم نسخ الرابط'); }, function () { done('انسخ الرابط من المتصفح'); });
      } else { done('انسخ الرابط من المتصفح'); }
    });
  }
  /* تثبيت التطبيق: الزر يظهر بس لما المتصفح يسمح */
  var ib = document.getElementById('install-app'), deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; if (ib) ib.hidden = false; });
  if (ib) ib.addEventListener('click', function () {
    if (!deferred) return;
    deferred.prompt();
    deferred.userChoice.then(function () { deferred = null; ib.hidden = true; });
  });
  window.addEventListener('appinstalled', function () { if (ib) ib.hidden = true; });
})();
