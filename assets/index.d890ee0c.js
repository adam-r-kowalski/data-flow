(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerpolicy&&(s.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?s.credentials="include":r.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();const E={};function yt(e){E.context=e}const ht=(e,t)=>e===t,A=Symbol("solid-proxy"),Y=Symbol("solid-track"),gt=Symbol("solid-dev-component"),oe={equals:ht};let ze=Ke;const D=1,re=2,mt={owned:null,cleanups:null,context:null,owner:null};var h=null;let M=null,$=null,O=null,N=null,pe=0,pt=0;function ne(e,t){const n=$,o=h,r=e.length===0,s={owned:null,cleanups:null,context:null,owner:t||o},i=r?()=>e(()=>{throw new Error("Dispose method must be an explicit argument to createRoot function")}):()=>e(()=>V(()=>Pe(s)));o&&(s.name=`${o.name}-r${pt++}`),globalThis._$afterCreateRoot&&globalThis._$afterCreateRoot(s),h=s,$=null;try{return X(i,!0)}finally{$=n,h=o}}function B(e,t){t=t?Object.assign({},oe,t):oe;const n={value:e,observers:null,observerSlots:null,comparator:t.equals||void 0};t.internal||(n.name=Ue(t.name||Ve(e),n));const o=r=>(typeof r=="function"&&(r=r(n.value)),xe(n,r));return[Fe.bind(n),o]}function S(e,t,n){const o=fe(e,t,!1,D,n);H(o)}function bt(e,t,n){ze=At;const o=fe(e,t,!1,D,n);o.user=!0,N?N.push(o):H(o)}function se(e,t,n){n=n?Object.assign({},oe,n):oe;const o=fe(e,t,!0,0,n);return o.observers=null,o.observerSlots=null,o.comparator=n.equals||void 0,H(o),Fe.bind(o)}function R(e){return X(e,!1)}function V(e){let t,n=$;return $=null,t=e(),$=n,t}function Be(e){return h===null?console.warn("cleanups created outside a `createRoot` or `render` will never be run"):h.cleanups===null?h.cleanups=[e]:h.cleanups.push(e),e}function be(){return $}function wt(e,t){const n=fe(()=>V(()=>(Object.assign(e,{[gt]:!0}),e(t))),void 0,!0);return n.props=t,n.observers=null,n.observerSlots=null,n.state=0,n.componentName=e.name,H(n),n.tValue!==void 0?n.tValue:n.value}function Ve(e){const t=new Set;return`s${Ae(typeof e=="string"?e:V(()=>JSON.stringify(e,(n,o)=>{if(typeof o=="object"&&o!=null){if(t.has(o))return;t.add(o);const r=Object.keys(o),s=Object.getOwnPropertyDescriptors(o),i=r.reduce((l,c)=>{const u=s[c];return u.get||(l[c]=u),l},{});o=Object.create({},i)}return typeof o=="bigint"?`${o.toString()}n`:o})||""))}`}function Ue(e,t){let n=e;if(h){let o=0;for(h.sourceMap||(h.sourceMap={});h.sourceMap[n];)n=`${e}-${++o}`;h.sourceMap[n]=t}return n}function $t(e){return e||(e=h),e?{...qe(e.sourceMap),...e.owned?Ye(e):{}}:{}}function we(e,t){const n=Symbol("context");return{id:n,Provider:vt(n,t),defaultValue:e}}function $e(e){let t;return(t=Xe(h,e.id))!==void 0?t:e.defaultValue}function xt(e){const t=se(e),n=se(()=>ge(t()));return n.toArray=()=>{const o=n();return Array.isArray(o)?o:o!=null?[o]:[]},n}function Fe(){const e=M;if(this.sources&&(this.state||e))if(this.state===D||e)H(this);else{const t=O;O=null,X(()=>le(this),!1),O=t}if($){const t=this.observers?this.observers.length:0;$.sources?($.sources.push(this),$.sourceSlots.push(t)):($.sources=[this],$.sourceSlots=[t]),this.observers?(this.observers.push($),this.observerSlots.push($.sources.length-1)):(this.observers=[$],this.observerSlots=[$.sources.length-1])}return this.value}function xe(e,t,n){let o=e.value;return(!e.comparator||!e.comparator(o,t))&&(e.value=t,e.observers&&e.observers.length&&X(()=>{for(let r=0;r<e.observers.length;r+=1){const s=e.observers[r],i=M&&M.running;i&&M.disposed.has(s),(i&&!s.tState||!i&&!s.state)&&(s.pure?O.push(s):N.push(s),s.observers&&Ge(s)),i||(s.state=D)}if(O.length>1e6){throw O=[],new Error("Potential Infinite Loop Detected.");throw new Error}},!1)),t}function H(e){if(!e.fn)return;Pe(e);const t=h,n=$,o=pe;$=h=e,Pt(e,e.value,o),$=n,h=t}function Pt(e,t,n){let o;try{o=e.fn(t)}catch(r){e.pure&&(e.state=D),He(r)}(!e.updatedAt||e.updatedAt<=n)&&(e.updatedAt!=null&&"observers"in e?xe(e,o):e.value=o,e.updatedAt=n)}function fe(e,t,n,o=D,r){const s={fn:e,state:o,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:h,context:null,pure:n};return h===null?console.warn("computations created outside a `createRoot` or `render` will never be disposed"):h!==mt&&(h.owned?h.owned.push(s):h.owned=[s],s.name=r&&r.name||`${h.name||"c"}-${(h.owned||h.tOwned).length}`),s}function ie(e){const t=M;if(e.state===0||t)return;if(e.state===re||t)return le(e);if(e.suspense&&V(e.suspense.inFallback))return e.suspense.effects.push(e);const n=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<pe);)(e.state||t)&&n.push(e);for(let o=n.length-1;o>=0;o--)if(e=n[o],e.state===D||t)H(e);else if(e.state===re||t){const r=O;O=null,X(()=>le(e,n[0]),!1),O=r}}function X(e,t){if(O)return e();let n=!1;t||(O=[]),N?n=!0:N=[],pe++;try{const o=e();return _t(n),o}catch(o){O||(N=null),He(o)}}function _t(e){if(O&&(Ke(O),O=null),e)return;const t=N;N=null,t.length?X(()=>ze(t),!1):globalThis._$afterUpdate&&globalThis._$afterUpdate()}function Ke(e){for(let t=0;t<e.length;t++)ie(e[t])}function At(e){let t,n=0;for(t=0;t<e.length;t++){const o=e[t];o.user?e[n++]=o:ie(o)}for(E.context&&yt(),t=0;t<n;t++)ie(e[t])}function le(e,t){const n=M;e.state=0;for(let o=0;o<e.sources.length;o+=1){const r=e.sources[o];r.sources&&(r.state===D||n?r!==t&&ie(r):(r.state===re||n)&&le(r,t))}}function Ge(e){const t=M;for(let n=0;n<e.observers.length;n+=1){const o=e.observers[n];(!o.state||t)&&(o.state=re,o.pure?O.push(o):N.push(o),o.observers&&Ge(o))}}function Pe(e){let t;if(e.sources)for(;e.sources.length;){const n=e.sources.pop(),o=e.sourceSlots.pop(),r=n.observers;if(r&&r.length){const s=r.pop(),i=n.observerSlots.pop();o<r.length&&(s.sourceSlots[i]=o,r[o]=s,n.observerSlots[o]=i)}}if(e.owned){for(t=0;t<e.owned.length;t++)Pe(e.owned[t]);e.owned=null}if(e.cleanups){for(t=0;t<e.cleanups.length;t++)e.cleanups[t]();e.cleanups=null}e.state=0,e.context=null,delete e.sourceMap}function Ot(e){return e instanceof Error||typeof e=="string"?e:new Error("Unknown error")}function He(e){throw e=Ot(e),e}function Xe(e,t){return e?e.context&&e.context[t]!==void 0?e.context[t]:Xe(e.owner,t):void 0}function ge(e){if(typeof e=="function"&&!e.length)return ge(e());if(Array.isArray(e)){const t=[];for(let n=0;n<e.length;n++){const o=ge(e[n]);Array.isArray(o)?t.push.apply(t,o):t.push(o)}return t}return e}function vt(e,t){return function(o){let r;return S(()=>r=V(()=>(h.context={[e]:o.value},xt(()=>o.children))),void 0,t),r}}function Ae(e){for(var t=0,n=9;t<e.length;)n=Math.imul(n^e.charCodeAt(t++),9**9);return`${n^n>>>9}`}function qe(e={}){const t=Object.keys(e),n={};for(let o=0;o<t.length;o++){const r=t[o];n[r]=e[r].value}return n}function Ye(e){const t={};for(let n=0,o=e.owned.length;n<o;n++){const r=e.owned[n];t[r.componentName?`${r.componentName}:${r.name}`:r.name]={...qe(r.sourceMap),...r.owned?Ye(r):{}}}return t}const St=Symbol("fallback");function Oe(e){for(let t=0;t<e.length;t++)e[t]()}function Ct(e,t,n={}){let o=[],r=[],s=[],i=0,l=t.length>1?[]:null;return Be(()=>Oe(s)),()=>{let c=e()||[],u,f;return c[Y],V(()=>{let d=c.length,y,g,m,x,_,p,P,b,j;if(d===0)i!==0&&(Oe(s),s=[],o=[],r=[],i=0,l&&(l=[])),n.fallback&&(o=[St],r[0]=ne(ye=>(s[0]=ye,n.fallback())),i=1);else if(i===0){for(r=new Array(d),f=0;f<d;f++)o[f]=c[f],r[f]=ne(a);i=d}else{for(m=new Array(d),x=new Array(d),l&&(_=new Array(d)),p=0,P=Math.min(i,d);p<P&&o[p]===c[p];p++);for(P=i-1,b=d-1;P>=p&&b>=p&&o[P]===c[b];P--,b--)m[b]=r[P],x[b]=s[P],l&&(_[b]=l[P]);for(y=new Map,g=new Array(b+1),f=b;f>=p;f--)j=c[f],u=y.get(j),g[f]=u===void 0?-1:u,y.set(j,f);for(u=p;u<=P;u++)j=o[u],f=y.get(j),f!==void 0&&f!==-1?(m[f]=r[u],x[f]=s[u],l&&(_[f]=l[u]),f=g[f],y.set(j,f)):s[u]();for(f=p;f<d;f++)f in m?(r[f]=m[f],s[f]=x[f],l&&(l[f]=_[f],l[f](f))):r[f]=ne(a);r=r.slice(0,i=d),o=c.slice(0)}return r});function a(d){if(s[f]=d,l){const[y,g]=B(f);return l[f]=g,t(c[f],y)}return t(c[f])}}}function w(e,t){return wt(e,t||{})}function Q(){return!0}const Et={get(e,t,n){return t===A?n:e.get(t)},has(e,t){return e.has(t)},set:Q,deleteProperty:Q,getOwnPropertyDescriptor(e,t){return{configurable:!0,enumerable:!0,get(){return e.get(t)},set:Q,deleteProperty:Q}},ownKeys(e){return e.keys()}};function he(e){return(e=typeof e=="function"?e():e)==null?{}:e}function Nt(...e){if(e.some(n=>n&&(A in n||typeof n=="function")))return new Proxy({get(n){for(let o=e.length-1;o>=0;o--){const r=he(e[o])[n];if(r!==void 0)return r}},has(n){for(let o=e.length-1;o>=0;o--)if(n in he(e[o]))return!0;return!1},keys(){const n=[];for(let o=0;o<e.length;o++)n.push(...Object.keys(he(e[o])));return[...new Set(n)]}},Et);const t={};for(let n=e.length-1;n>=0;n--)if(e[n]){const o=Object.getOwnPropertyDescriptors(e[n]);for(const r in o)r in t||Object.defineProperty(t,r,{enumerable:!0,get(){for(let s=e.length-1;s>=0;s--){const i=(e[s]||{})[r];if(i!==void 0)return i}}})}return t}function ee(e){const t="fallback"in e&&{fallback:()=>e.fallback};return se(Ct(()=>e.each,e.children,t||void 0))}let I;I={writeSignal:xe,serializeGraph:$t,registerGraph:Ue,hashValue:Ve};globalThis&&(globalThis.Solid$$?console.warn("You appear to have multiple instances of Solid. This can lead to unexpected behavior."):globalThis.Solid$$=!0);const jt=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","hidden","indeterminate","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected"],kt=new Set(["className","value","readOnly","formNoValidate","isMap","noModule","playsInline",...jt]),Lt=new Set(["innerHTML","textContent","innerText","children"]),Dt=Object.assign(Object.create(null),{className:"class",htmlFor:"for"}),ve=Object.assign(Object.create(null),{class:"className",formnovalidate:"formNoValidate",ismap:"isMap",nomodule:"noModule",playsinline:"playsInline",readonly:"readOnly"}),Tt=new Set(["beforeinput","click","dblclick","contextmenu","focusin","focusout","input","keydown","keyup","mousedown","mousemove","mouseout","mouseover","mouseup","pointerdown","pointermove","pointerout","pointerover","pointerup","touchend","touchmove","touchstart"]),Mt={xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace"};function Rt(e,t,n){let o=n.length,r=t.length,s=o,i=0,l=0,c=t[r-1].nextSibling,u=null;for(;i<r||l<s;){if(t[i]===n[l]){i++,l++;continue}for(;t[r-1]===n[s-1];)r--,s--;if(r===i){const f=s<o?l?n[l-1].nextSibling:n[s-l]:c;for(;l<s;)e.insertBefore(n[l++],f)}else if(s===l)for(;i<r;)(!u||!u.has(t[i]))&&t[i].remove(),i++;else if(t[i]===n[s-1]&&n[l]===t[r-1]){const f=t[--r].nextSibling;e.insertBefore(n[l++],t[i++].nextSibling),e.insertBefore(n[--s],f),t[r]=n[s]}else{if(!u){u=new Map;let a=l;for(;a<s;)u.set(n[a],a++)}const f=u.get(t[i]);if(f!=null)if(l<f&&f<s){let a=i,d=1,y;for(;++a<r&&a<s&&!((y=u.get(t[a]))==null||y!==f+d);)d++;if(d>f-l){const g=t[i];for(;l<f;)e.insertBefore(n[l++],g)}else e.replaceChild(n[l++],t[i++])}else i++;else t[i++].remove()}}}const Se="_$DX_DELEGATE";function It(e,t,n,o={}){let r;return ne(s=>{r=s,t===document?e():v(t,e(),t.firstChild?null:void 0,n)},o.owner),()=>{r(),t.textContent=""}}function C(e,t,n){const o=document.createElement("template");if(o.innerHTML=e,t&&o.innerHTML.split("<").length-1!==t)throw`The browser resolved template HTML does not match JSX input:
${o.innerHTML}

${e}. Is your HTML properly formed?`;let r=o.content.firstChild;return n&&(r=r.firstChild),r}function We(e,t=window.document){const n=t[Se]||(t[Se]=new Set);for(let o=0,r=e.length;o<r;o++){const s=e[o];n.has(s)||(n.add(s),t.addEventListener(s,Ht))}}function T(e,t,n){n==null?e.removeAttribute(t):e.setAttribute(t,n)}function zt(e,t,n,o){o==null?e.removeAttributeNS(t,n):e.setAttributeNS(t,n,o)}function Bt(e,t){t==null?e.removeAttribute("class"):e.className=t}function Vt(e,t,n,o){if(o)Array.isArray(n)?(e[`$$${t}`]=n[0],e[`$$${t}Data`]=n[1]):e[`$$${t}`]=n;else if(Array.isArray(n)){const r=n[0];e.addEventListener(t,n[0]=s=>r.call(e,n[1],s))}else e.addEventListener(t,n)}function Ut(e,t,n={}){const o=Object.keys(t||{}),r=Object.keys(n);let s,i;for(s=0,i=r.length;s<i;s++){const l=r[s];!l||l==="undefined"||t[l]||(Ce(e,l,!1),delete n[l])}for(s=0,i=o.length;s<i;s++){const l=o[s],c=!!t[l];!l||l==="undefined"||n[l]===c||!c||(Ce(e,l,!0),n[l]=c)}return n}function ae(e,t,n){if(!t)return n?T(e,"style"):t;const o=e.style;if(typeof t=="string")return o.cssText=t;typeof n=="string"&&(o.cssText=n=void 0),n||(n={}),t||(t={});let r,s;for(s in n)t[s]==null&&o.removeProperty(s),delete n[s];for(s in t)r=t[s],r!==n[s]&&(o.setProperty(s,r),n[s]=r);return n}function Ft(e,t={},n,o){const r={};return o||S(()=>r.children=F(e,t.children,r.children)),S(()=>t.ref&&t.ref(e)),S(()=>Kt(e,t,n,!0,r,!0)),r}function ce(e,t,n){return V(()=>e(t,n))}function v(e,t,n,o){if(n!==void 0&&!o&&(o=[]),typeof t!="function")return F(e,t,o,n);S(r=>F(e,t(),r,n),o)}function Kt(e,t,n,o,r={},s=!1){t||(t={});for(const i in r)if(!(i in t)){if(i==="children")continue;r[i]=Ee(e,i,null,r[i],n,s)}for(const i in t){if(i==="children"){o||F(e,t.children);continue}const l=t[i];r[i]=Ee(e,i,l,r[i],n,s)}}function Gt(e){return e.toLowerCase().replace(/-([a-z])/g,(t,n)=>n.toUpperCase())}function Ce(e,t,n){const o=t.trim().split(/\s+/);for(let r=0,s=o.length;r<s;r++)e.classList.toggle(o[r],n)}function Ee(e,t,n,o,r,s){let i,l,c;if(t==="style")return ae(e,n,o);if(t==="classList")return Ut(e,n,o);if(n===o)return o;if(t==="ref")s||n(e);else if(t.slice(0,3)==="on:"){const u=t.slice(3);o&&e.removeEventListener(u,o),n&&e.addEventListener(u,n)}else if(t.slice(0,10)==="oncapture:"){const u=t.slice(10);o&&e.removeEventListener(u,o,!0),n&&e.addEventListener(u,n,!0)}else if(t.slice(0,2)==="on"){const u=t.slice(2).toLowerCase(),f=Tt.has(u);if(!f&&o){const a=Array.isArray(o)?o[0]:o;e.removeEventListener(u,a)}(f||n)&&(Vt(e,u,n,f),f&&We([u]))}else if((c=Lt.has(t))||!r&&(ve[t]||(l=kt.has(t)))||(i=e.nodeName.includes("-")))t==="class"||t==="className"?Bt(e,n):i&&!l&&!c?e[Gt(t)]=n:e[ve[t]||t]=n;else{const u=r&&t.indexOf(":")>-1&&Mt[t.split(":")[0]];u?zt(e,u,t,n):T(e,Dt[t]||t,n)}return n}function Ht(e){const t=`$$${e.type}`;let n=e.composedPath&&e.composedPath()[0]||e.target;for(e.target!==n&&Object.defineProperty(e,"target",{configurable:!0,value:n}),Object.defineProperty(e,"currentTarget",{configurable:!0,get(){return n||document}}),E.registry&&!E.done&&(E.done=!0,document.querySelectorAll("[id^=pl-]").forEach(o=>o.remove()));n!==null;){const o=n[t];if(o&&!n.disabled){const r=n[`${t}Data`];if(r!==void 0?o.call(n,r,e):o.call(n,e),e.cancelBubble)return}n=n.host&&n.host!==n&&n.host instanceof Node?n.host:n.parentNode}}function F(e,t,n,o,r){for(E.context&&!n&&(n=[...e.childNodes]);typeof n=="function";)n=n();if(t===n)return n;const s=typeof t,i=o!==void 0;if(e=i&&n[0]&&n[0].parentNode||e,s==="string"||s==="number"){if(E.context)return n;if(s==="number"&&(t=t.toString()),i){let l=n[0];l&&l.nodeType===3?l.data=t:l=document.createTextNode(t),n=U(e,n,o,l)}else n!==""&&typeof n=="string"?n=e.firstChild.data=t:n=e.textContent=t}else if(t==null||s==="boolean"){if(E.context)return n;n=U(e,n,o)}else{if(s==="function")return S(()=>{let l=t();for(;typeof l=="function";)l=l();n=F(e,l,n,o)}),()=>n;if(Array.isArray(t)){const l=[],c=n&&Array.isArray(n);if(me(l,t,n,r))return S(()=>n=F(e,l,n,o,!0)),()=>n;if(E.context){if(!l.length)return n;for(let u=0;u<l.length;u++)if(l[u].parentNode)return n=l}if(l.length===0){if(n=U(e,n,o),i)return n}else c?n.length===0?Ne(e,l,o):Rt(e,n,l):(n&&U(e),Ne(e,l));n=l}else if(t instanceof Node){if(E.context&&t.parentNode)return n=i?[t]:t;if(Array.isArray(n)){if(i)return n=U(e,n,o,t);U(e,n,null,t)}else n==null||n===""||!e.firstChild?e.appendChild(t):e.replaceChild(t,e.firstChild);n=t}else console.warn("Unrecognized value. Skipped inserting",t)}return n}function me(e,t,n,o){let r=!1;for(let s=0,i=t.length;s<i;s++){let l=t[s],c=n&&n[s];if(l instanceof Node)e.push(l);else if(!(l==null||l===!0||l===!1))if(Array.isArray(l))r=me(e,l,c)||r;else if(typeof l=="function")if(o){for(;typeof l=="function";)l=l();r=me(e,Array.isArray(l)?l:[l],Array.isArray(c)?c:[c])||r}else e.push(l),r=!0;else{const u=String(l);c&&c.nodeType===3&&c.data===u?e.push(c):e.push(document.createTextNode(u))}}return r}function Ne(e,t,n=null){for(let o=0,r=t.length;o<r;o++)e.insertBefore(t[o],n)}function U(e,t,n,o){if(n===void 0)return e.textContent="";const r=o||document.createTextNode("");if(t.length){let s=!1;for(let i=t.length-1;i>=0;i--){const l=t[i];if(r!==l){const c=l.parentNode===e;!s&&!i?c?e.replaceChild(r,l):e.insertBefore(r,n):c&&l.remove()}else s=!0}}else e.insertBefore(r,n);return[r]}const W=Symbol("store-raw"),k=Symbol("store-node"),L=Symbol("store-name");function Je(e,t){let n=e[A];if(!n){if(Object.defineProperty(e,A,{value:n=new Proxy(e,qt)}),!Array.isArray(e)){const o=Object.keys(e),r=Object.getOwnPropertyDescriptors(e);for(let s=0,i=o.length;s<i;s++){const l=o[s];if(r[l].get){const c=r[l].get.bind(n);Object.defineProperty(e,l,{enumerable:r[l].enumerable,get:c})}}}t&&Object.defineProperty(e,L,{value:t})}return n}function J(e){let t;return e!=null&&typeof e=="object"&&(e[A]||!(t=Object.getPrototypeOf(e))||t===Object.prototype||Array.isArray(e))}function z(e,t=new Set){let n,o,r,s;if(n=e!=null&&e[W])return n;if(!J(e)||t.has(e))return e;if(Array.isArray(e)){Object.isFrozen(e)?e=e.slice(0):t.add(e);for(let i=0,l=e.length;i<l;i++)r=e[i],(o=z(r,t))!==r&&(e[i]=o)}else{Object.isFrozen(e)?e=Object.assign({},e):t.add(e);const i=Object.keys(e),l=Object.getOwnPropertyDescriptors(e);for(let c=0,u=i.length;c<u;c++)s=i[c],!l[s].get&&(r=e[s],(o=z(r,t))!==r&&(e[s]=o))}return e}function K(e){let t=e[k];return t||Object.defineProperty(e,k,{value:t={}}),t}function ue(e,t,n){return e[t]||(e[t]=Qe(n))}function Xt(e,t){const n=Reflect.getOwnPropertyDescriptor(e,t);return!n||n.get||!n.configurable||t===A||t===k||t===L||(delete n.value,delete n.writable,n.get=()=>e[A][t]),n}function _e(e){if(be()){const t=K(e);(t._||(t._=Qe()))()}}function Ze(e){return _e(e),Reflect.ownKeys(e)}function Qe(e){const[t,n]=B(e,{equals:!1,internal:!0});return t.$=n,t}const qt={get(e,t,n){if(t===W)return e;if(t===A)return n;if(t===Y)return _e(e),n;const o=K(e),r=o.hasOwnProperty(t);let s=r?o[t]():e[t];if(t===k||t==="__proto__")return s;if(!r){const i=Object.getOwnPropertyDescriptor(e,t);be()&&(typeof s!="function"||e.hasOwnProperty(t))&&!(i&&i.get)&&(s=ue(o,t,s)())}return J(s)?Je(s,e[L]&&`${e[L]}:${t.toString()}`):s},has(e,t){if(t===W||t===A||t===Y||t===k||t==="__proto__")return!0;const n=K(e)[t];return n&&n(),t in e},set(){return console.warn("Cannot mutate a Store directly"),!0},deleteProperty(){return console.warn("Cannot mutate a Store directly"),!0},ownKeys:Ze,getOwnPropertyDescriptor:Xt};function G(e,t,n,o=!1){if(!o&&e[t]===n)return;const r=e[t],s=e.length;n===void 0?delete e[t]:e[t]=n;let i=K(e),l;(l=ue(i,t,r))&&l.$(()=>n),Array.isArray(e)&&e.length!==s&&(l=ue(i,"length",s))&&l.$(e.length),(l=i._)&&l.$()}function et(e,t){const n=Object.keys(t);for(let o=0;o<n.length;o+=1){const r=n[o];G(e,r,t[r])}}function Yt(e,t){if(typeof t=="function"&&(t=t(e)),t=z(t),Array.isArray(t)){if(e===t)return;let n=0,o=t.length;for(;n<o;n++){const r=t[n];e[n]!==r&&G(e,n,r)}G(e,"length",o)}else et(e,t)}function q(e,t,n=[]){let o,r=e;if(t.length>1){o=t.shift();const i=typeof o,l=Array.isArray(e);if(Array.isArray(o)){for(let c=0;c<o.length;c++)q(e,[o[c]].concat(t),n);return}else if(l&&i==="function"){for(let c=0;c<e.length;c++)o(e[c],c)&&q(e,[c].concat(t),n);return}else if(l&&i==="object"){const{from:c=0,to:u=e.length-1,by:f=1}=o;for(let a=c;a<=u;a+=f)q(e,[a].concat(t),n);return}else if(t.length>1){q(e[o],t,[o].concat(n));return}r=e[o],n=[o].concat(n)}let s=t[0];typeof s=="function"&&(s=s(r,n),s===r)||o===void 0&&s==null||(s=z(s),o===void 0||J(r)&&J(s)&&!Array.isArray(s)?et(r,s):G(e,o,s))}function Wt(...[e,t]){const n=z(e||{}),o=Array.isArray(n);if(typeof n!="object"&&typeof n!="function")throw new Error(`Unexpected type ${typeof n} received when initializing 'createStore'. Expected an object.`);const r=Je(n,t&&t.name||I.hashValue(n));{const i=t&&t.name||I.hashValue(n);I.registerGraph(i,{value:n})}function s(...i){R(()=>{o&&i.length===1?Yt(n,i[0]):q(n,i)})}return[r,s]}function Jt(e,t){const n=Reflect.getOwnPropertyDescriptor(e,t);return!n||n.get||n.set||!n.configurable||t===A||t===k||t===L||(delete n.value,delete n.writable,n.get=()=>e[A][t],n.set=o=>e[A][t]=o),n}const Zt={get(e,t,n){if(t===W)return e;if(t===A)return n;if(t===Y)return _e(e),n;const o=K(e),r=o.hasOwnProperty(t);let s=r?o[t]():e[t];if(t===k||t==="__proto__")return s;if(!r){const i=Object.getOwnPropertyDescriptor(e,t),l=typeof s=="function";if(be()&&(!l||e.hasOwnProperty(t))&&!(i&&i.get))s=ue(o,t,s)();else if(s!=null&&l&&s===Array.prototype[t])return(...c)=>R(()=>Array.prototype[t].apply(n,c))}return J(s)?tt(s,e[L]&&`${e[L]}:${t.toString()}`):s},has(e,t){if(t===W||t===A||t===Y||t===k||t==="__proto__")return!0;const n=K(e)[t];return n&&n(),t in e},set(e,t,n){return R(()=>G(e,t,z(n))),!0},deleteProperty(e,t){return R(()=>G(e,t,void 0,!0)),!0},ownKeys:Ze,getOwnPropertyDescriptor:Jt};function tt(e,t){let n=e[A];if(!n){Object.defineProperty(e,A,{value:n=new Proxy(e,Zt)});const o=Object.keys(e),r=Object.getOwnPropertyDescriptors(e);for(let s=0,i=o.length;s<i;s++){const l=o[s];if(r[l].get){const c=r[l].get.bind(n);Object.defineProperty(e,l,{get:c})}if(r[l].set){const c=r[l].set;Object.defineProperty(e,l,{set:f=>R(()=>c.call(n,f))})}}t&&Object.defineProperty(e,L,{value:t})}return n}function Qt(e,t){const n=z(e||{});if(typeof n!="object"&&typeof n!="function")throw new Error(`Unexpected type ${typeof n} received when initializing 'createMutable'. Expected an object.`);const o=tt(n,t&&t.name||I.hashValue(n));{const r=t&&t.name||I.hashValue(n);I.registerGraph(r,{value:n})}return o}const nt=we(),en=e=>w(nt.Provider,{get value(){return e.camera},get children(){return e.children}}),de=()=>$e(nt),tn=(e,t)=>{const[n,o,r,s,i,l,c,u,f]=e,[a,d,y,g,m,x,_,p,P]=t,b=n*a+o*g+r*_,j=n*d+o*m+r*p,ye=n*y+o*x+r*P,lt=s*a+i*g+l*_,ct=s*d+i*m+l*p,ut=s*y+i*x+l*P,ft=c*a+u*g+f*_,at=c*d+u*m+f*p,dt=c*y+u*x+f*P;return[b,j,ye,lt,ct,ut,ft,at,dt]},je=e=>{const[t,n,o,r,s,i,l,c,u]=e,f=s*u-i*c,a=r*u-i*l,d=r*c-s*l,y=n*u-o*c,g=t*u-o*l,m=t*c-n*l,x=n*i-o*s,_=t*i-o*r,p=t*s-n*r,b=1/(l*x-c*_+u*p);return[b*f,b*-y,b*x,b*-a,b*g,b*-_,b*d,b*-m,b*p]},te=(e,t)=>{const[n,o,r,s,i,l,c,u,f]=e,[a,d,y]=t,g=n*a+o*d+r*y,m=s*a+i*d+l*y,x=c*a+u*d+f*y;return[g,m,x]},ke=(e,t)=>[1,0,e,0,1,t,0,0,1],nn=e=>[e,0,0,0,e,0,0,0,1],ot=we(),on=e=>{const[t,n]=B(void 0),o={},r=Qt({}),s=(u,f)=>{o[u]=f,r[u]=f.getBoundingClientRect()},i=de(),l=()=>{const{x:u,y:f}=t().getBoundingClientRect(),a=je([i().zoom,0,i().x,0,i().zoom,i().y,0,0,1]);R(()=>{for(const[d,y]of Object.entries(o)){const g=y.getBoundingClientRect(),[m,x]=te(a,[g.x-u,g.y-f,1]),[_,p]=te(a,[g.x-u+g.width,g.y-f+g.height,1]);r[d]={x:m,y:x,width:_-m,height:p-x}}})},c=u=>{const{x:f,y:a}=t().getBoundingClientRect(),d=je([i().zoom,0,i().x,0,i().zoom,i().y,0,0,1]);R(()=>{for(const y of u){const m=o[y].getBoundingClientRect(),[x,_]=te(d,[m.x-f,m.y-a,1]),[p,P]=te(d,[m.x-f+m.width,m.y-a+m.height,1]);r[y]={x,y:_,width:p-x,height:P-_}}})};return w(ot.Provider,{value:{ports:r,setRef:s,recreateAllRects:l,recreateSomeRects:c,root:t,setRoot:n},get children(){return e.children}})},Z=()=>$e(ot),Le={id:-1,position:{x:0,y:0}},De=e=>({id:e.pointerId,position:{x:e.clientX,y:e.clientY}}),rt=(e,t)=>{const[n,o]=B(Le),r=t(),s=c=>{console.log("element"),o(De(c)),window.addEventListener("pointerup",i),window.addEventListener("pointermove",l),c.stopPropagation()},i=c=>{n().id===c.pointerId&&(o(Le),window.removeEventListener("pointerup",i),window.removeEventListener("pointermove",l))},l=c=>{if(n().id!==c.pointerId)return;const u=De(c);r({dx:n().position.x-u.position.x,dy:n().position.y-u.position.y}),o(u),c.stopPropagation()};e.addEventListener("pointerdown",s),Be(()=>{e.removeEventListener("pointerdown",s)})},rn=C("<div></div>",2),sn=e=>{const[t,n]=B({x:0,y:0,zoom:1}),o=i=>{n({x:t().x-i.dx,y:t().y-i.dy,zoom:t().zoom})},r=(i,l,c)=>Math.max(l,Math.min(c,i)),s=i=>{const l=r(t().zoom*(1-i.delta*.01),.1,5),c=[t().zoom,0,t().x,0,t().zoom,t().y,0,0,1],u=[ke(i.x,i.y),nn(l/t().zoom),ke(-i.x,-i.y),c].reduce(tn);n({zoom:u[0],x:u[2],y:u[5]})};return w(en,{camera:t,get children(){return w(on,{get children(){return(()=>{const{setRoot:i,root:l}=Z();return(()=>{const c=rn.cloneNode(!0);return c.$$contextmenu=u=>u.preventDefault(),c.addEventListener("wheel",u=>{if(u.preventDefault(),!u.ctrlKey)o({dx:u.deltaX,dy:u.deltaY});else{const[f,a]=(()=>{const d=l().getBoundingClientRect(),y=window.frameElement;if(!y)return[d.x,d.y];const g=y.getBoundingClientRect();return[d.x+g.x,d.y+g.y]})();s({x:u.clientX-f,y:u.clientY-a,delta:u.deltaY})}}),ce(rt,c,()=>u=>o(u)),ce(i,c),v(c,()=>e.children),S(u=>ae(c,{overflow:"hidden",position:"relative",...e.style},u)),c})()})()}})}})};We(["contextmenu"]);const ln=C("<div></div>",2),cn=e=>{const t=de(),n=()=>`translate(${t().x}px, ${t().y}px)`,o=()=>`scale(${t().zoom}, ${t().zoom})`,r=()=>`${n()} ${o()}`,{recreateAllRects:s}=Z();return bt(()=>requestAnimationFrame(s)),(()=>{const i=ln.cloneNode(!0);return i.style.setProperty("transform-origin","top left"),v(i,()=>e.children),S(()=>i.style.setProperty("transform",r())),i})()},st=we(),un=e=>{const[t,n]=B(new Set),o=r=>n(s=>s.add(r));return w(st.Provider,{value:{portIds:t,addPortId:o},get children(){return e.children}})},it=()=>$e(st),fn=C("<div></div>",2),an=e=>{const[t,n]=B({x:e.x,y:e.y}),o=()=>`translate(${t().x}px, ${t().y}px)`,{recreateSomeRects:r}=Z(),s=de();return w(un,{get children(){return(()=>{const{portIds:i}=it();return(()=>{const l=fn.cloneNode(!0);return ce(rt,l,()=>({dx:c,dy:u})=>{const f={dx:c/s().zoom,dy:u/s().zoom};n(a=>({x:a.x-f.dx,y:a.y-f.dy})),r(i())}),v(l,()=>e.children),S(c=>ae(l,{transform:o(),position:"absolute",...e.style},c)),l})()})()}})},dn=C("<div></div>",2),Te=e=>{const{setRef:t}=Z();return it().addPortId(e.id),(()=>{const n=dn.cloneNode(!0);return ce(o=>t(e.id,o),n),v(n,()=>e.children),S(o=>ae(n,e.style,o)),n})()},yn=C("<svg><g></g></svg>",4),hn=e=>{const t=de(),n=()=>`translate(${t().x} ${t().y})`,o=()=>`scale(${t().zoom} ${t().zoom})`,r=()=>`${n()} ${o()}`;return(()=>{const s=yn.cloneNode(!0),i=s.firstChild;return s.style.setProperty("width","100%"),s.style.setProperty("height","100%"),s.style.setProperty("position","absolute"),s.style.setProperty("pointer-events","none"),v(i,()=>e.children),S(()=>T(i,"transform",r())),s})()},gn=e=>{const{ports:t}=Z(),n=()=>{const o=({x:r,y:s,width:i,height:l})=>{const c=r,u=s;return{x:c,y:u,width:i,height:l,cx:c+i/2,cy:u+l/2}};return{from:o(t[e.from]),to:o(t[e.to])}};return e.children(n)},mn=C('<svg><path fill="none" stroke="black" stroke-width="2"></path></svg>',4,!0),pn=e=>{const t=()=>{const n=e.ports().from.cx,o=e.ports().to.cx,r=n<o,s=Math.min(Math.abs(o-n),50),i=r?n+s:n-s,l=r?o-s:o+s,c=e.ports().from.cy,u=c,f=e.ports().to.cy;return`M${n},${c} C${i},${u} ${l},${f} ${o},${f}`};return(()=>{const n=mn.cloneNode(!0);return Ft(n,Nt(e,{get d(){return t()}}),!0,!1),n})()},bn=e=>{const t={},n={},o={},r={},s={};for(let i=0;i<e;i+=3){const l=Math.random()*window.innerWidth*.7+100,c=Math.random()*window.innerHeight*.7+100;t[`node-${i}`]={uuid:`node-${i}`,name:"num",x:l,y:c,inputs:[],outputs:[`node-${i}_output-0`],body:`node-${i}_body`},t[`node-${i+1}`]={uuid:`node-${i+1}`,name:"num",x:l,y:c+200,inputs:[],outputs:[`node-${i+1}_output-0`],body:`node-${i+1}_body`},t[`node-${i+2}`]={uuid:`node-${i+2}`,name:"add",x:l+300,y:c+100,inputs:[`node-${i+2}_input-0`,`node-${i+2}_input-1`],outputs:[`node-${i+2}_output-0`],body:`node-${i+2}_body`},n[`edge-${i}`]={uuid:`edge-${i}`,input:`node-${i+2}_input-0`,output:`node-${i}_output-0`},n[`edge-${i+1}`]={uuid:`edge-${i+1}`,input:`node-${i+2}_input-1`,output:`node-${i+1}_output-0`},o[`node-${i+2}_input-0`]={uuid:`node-${i+2}_input-0`,name:"x"},o[`node-${i+2}_input-1`]={uuid:`node-${i+2}_input-1`,name:"y"},r[`node-${i}_output-0`]={uuid:`node-${i}_output-0`,name:"out"},r[`node-${i+1}_output-0`]={uuid:`node-${i+1}_output-0`,name:"out"},r[`node-${i+2}_output-0`]={uuid:`node-${i+2}_output-0`,name:"out"},s[`node-${i}_body`]={uuid:`node-${i}_body`,value:18},s[`node-${i+1}_body`]={uuid:`node-${i+1}_body`,value:24},s[`node-${i+2}_body`]={uuid:`node-${i+2}_body`,value:42}}return{nodes:t,edges:n,inputs:o,outputs:r,bodies:s}},Me=C("<div></div>",2),wn=C("<div><div></div><div></div></div>",6),Re=C("<div><div></div></div>",4),Ie=C('<svg><circle r="10" fill="black"></circle></svg>',4,!0),$n=()=>{const[e]=Wt(bn(10));return w(sn,{style:{background:"tan",width:"100%",height:"100%"},get children(){return[w(cn,{get children(){return w(ee,{get each(){return Object.values(e.nodes)},children:t=>w(an,{get x(){return t.x},get y(){return t.y},style:{background:"cornflowerblue",padding:"20px",display:"flex",gap:"20px"},get children(){return[(()=>{const n=Me.cloneNode(!0);return n.style.setProperty("display","flex"),n.style.setProperty("flex-direction","column"),n.style.setProperty("gap","10px"),v(n,w(ee,{get each(){return t.inputs},children:o=>{const r=e.inputs[o];return(()=>{const s=Re.cloneNode(!0),i=s.firstChild;return s.style.setProperty("display","flex"),s.style.setProperty("align-items","center"),s.style.setProperty("gap","10px"),v(s,w(Te,{get id(){return r.uuid},style:{background:"white",width:"40px",height:"40px"}}),i),v(i,()=>r.name),s})()}})),n})(),(()=>{const n=wn.cloneNode(!0),o=n.firstChild,r=o.nextSibling;return n.style.setProperty("display","flex"),n.style.setProperty("flex-direction","column"),n.style.setProperty("align-items","center"),n.style.setProperty("gap","10px"),v(o,()=>t.name),r.style.setProperty("background","white"),r.style.setProperty("padding","20px"),v(r,()=>e.bodies[t.body].value),n})(),(()=>{const n=Me.cloneNode(!0);return n.style.setProperty("display","flex"),n.style.setProperty("flex-direction","column"),n.style.setProperty("gap","10px"),v(n,w(ee,{get each(){return t.outputs},children:o=>{const r=e.outputs[o];return(()=>{const s=Re.cloneNode(!0),i=s.firstChild;return s.style.setProperty("display","flex"),s.style.setProperty("align-items","center"),s.style.setProperty("gap","10px"),v(i,()=>r.name),v(s,w(Te,{get id(){return r.uuid},style:{background:"white",width:"40px",height:"40px"}}),null),s})()}})),n})()]}})})}}),w(hn,{get children(){return w(ee,{get each(){return Object.values(e.edges)},children:t=>w(gn,{get from(){return t.output},get to(){return t.input},children:n=>{const o=()=>{const s=n().from.x+n().from.width/2,i=n().from.y+n().from.height/2,l=s+50,c=n().to.x+n().to.width/2,u=c-50,f=n().to.y+n().to.height/2;return{x0:s,y0:i,x1:l,x2:u,x3:c,y3:f}},r=se(()=>o());return[(()=>{const s=Ie.cloneNode(!0);return S(i=>{const l=r().x0,c=r().y0;return l!==i._v$&&T(s,"cx",i._v$=l),c!==i._v$2&&T(s,"cy",i._v$2=c),i},{_v$:void 0,_v$2:void 0}),s})(),(()=>{const s=Ie.cloneNode(!0);return S(i=>{const l=r().x3,c=r().y3;return l!==i._v$3&&T(s,"cx",i._v$3=l),c!==i._v$4&&T(s,"cy",i._v$4=c),i},{_v$3:void 0,_v$4:void 0}),s})(),w(pn,{ports:n})]}})})}})]}})},xn=C("<div></div>",2),Pn=()=>(()=>{const e=xn.cloneNode(!0);return e.style.setProperty("width","100vw"),e.style.setProperty("height","100vh"),v(e,w($n,{})),e})();It(()=>w(Pn,{}),document.getElementById("root"));
