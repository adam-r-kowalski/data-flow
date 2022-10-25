(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function t(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerpolicy&&(r.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?r.credentials="include":o.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(o){if(o.ep)return;o.ep=!0;const r=t(o);fetch(o.href,r)}})();const y={},ee=(e,n)=>e===n,te=Symbol("solid-track"),ne=Symbol("solid-dev-component"),T={equals:ee};let se=K;const w=1,_=2,oe={owned:null,cleanups:null,context:null,owner:null};var c=null;let g=null,a=null,d=null,b=null,M=0,re=0;function O(e,n){const t=a,s=c,o=e.length===0,r={owned:null,cleanups:null,context:null,owner:n||s},l=o?()=>e(()=>{throw new Error("Dispose method must be an explicit argument to createRoot function")}):()=>e(()=>S(()=>I(r)));s&&(r.name=`${s.name}-r${re++}`),globalThis._$afterCreateRoot&&globalThis._$afterCreateRoot(r),c=r,a=null;try{return E(l,!0)}finally{a=t,c=s}}function $(e,n){n=n?Object.assign({},T,n):T;const t={value:e,observers:null,observerSlots:null,comparator:n.equals||void 0};n.internal||(t.name=fe(n.name||ue(e),t));const s=o=>(typeof o=="function"&&(o=o(t.value)),Y(t,o));return[W.bind(t),s]}function m(e,n,t){const s=k(e,n,!1,w,t);P(s)}function ie(e,n,t){t=t?Object.assign({},T,t):T;const s=k(e,n,!0,0,t);return s.observers=null,s.observerSlots=null,s.comparator=t.equals||void 0,P(s),W.bind(s)}function S(e){let n,t=a;return a=null,n=e(),a=t,n}function X(e){return c===null?console.warn("cleanups created outside a `createRoot` or `render` will never be run"):c.cleanups===null?c.cleanups=[e]:c.cleanups.push(e),e}function le(e,n){const t=k(()=>S(()=>(Object.assign(e,{[ne]:!0}),e(n))),void 0,!0);return t.observers=null,t.observerSlots=null,t.state=0,t.componentName=e.name,P(t),t.tValue!==void 0?t.tValue:t.value}function ue(e){const n=new Set;return`s${B(typeof e=="string"?e:S(()=>JSON.stringify(e,(t,s)=>{if(typeof s=="object"&&s!=null){if(n.has(s))return;n.add(s);const o=Object.keys(s),r=Object.getOwnPropertyDescriptors(s),l=o.reduce((i,u)=>{const f=r[u];return f.get||(i[u]=f),i},{});s=Object.create({},l)}return typeof s=="bigint"?`${s.toString()}n`:s})||""))}`}function fe(e,n){let t=e;if(c){let s=0;for(c.sourceMap||(c.sourceMap={});c.sourceMap[t];)t=`${e}-${++s}`;c.sourceMap[t]=n}return t}function W(){const e=g;if(this.sources&&(this.state||e))if(this.state===w||e)P(this);else{const n=d;d=null,E(()=>L(this),!1),d=n}if(a){const n=this.observers?this.observers.length:0;a.sources?(a.sources.push(this),a.sourceSlots.push(n)):(a.sources=[this],a.sourceSlots=[n]),this.observers?(this.observers.push(a),this.observerSlots.push(a.sources.length-1)):(this.observers=[a],this.observerSlots=[a.sources.length-1])}return this.value}function Y(e,n,t){let s=e.value;return(!e.comparator||!e.comparator(s,n))&&(e.value=n,e.observers&&e.observers.length&&E(()=>{for(let o=0;o<e.observers.length;o+=1){const r=e.observers[o],l=g&&g.running;l&&g.disposed.has(r),(l&&!r.tState||!l&&!r.state)&&(r.pure?d.push(r):b.push(r),r.observers&&J(r)),l||(r.state=w)}if(d.length>1e6){throw d=[],new Error("Potential Infinite Loop Detected.");throw new Error}},!1)),n}function P(e){if(!e.fn)return;I(e);const n=c,t=a,s=M;a=c=e,ce(e,e.value,s),a=t,c=n}function ce(e,n,t){let s;try{s=e.fn(n)}catch(o){e.pure&&(e.state=w),Q(o)}(!e.updatedAt||e.updatedAt<=t)&&(e.updatedAt!=null&&"observers"in e?Y(e,s):e.value=s,e.updatedAt=t)}function k(e,n,t,s=w,o){const r={fn:e,state:s,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:n,owner:c,context:null,pure:t};return c===null?console.warn("computations created outside a `createRoot` or `render` will never be disposed"):c!==oe&&(c.owned?c.owned.push(r):c.owned=[r],r.name=o&&o.name||`${c.name||"c"}-${(c.owned||c.tOwned).length}`),r}function G(e){const n=g;if(e.state===0||n)return;if(e.state===_||n)return L(e);if(e.suspense&&S(e.suspense.inFallback))return e.suspense.effects.push(e);const t=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<M);)(e.state||n)&&t.push(e);for(let s=t.length-1;s>=0;s--)if(e=t[s],e.state===w||n)P(e);else if(e.state===_||n){const o=d;d=null,E(()=>L(e,t[0]),!1),d=o}}function E(e,n){if(d)return e();let t=!1;n||(d=[]),b?t=!0:b=[],M++;try{const s=e();return ae(t),s}catch(s){d||(b=null),Q(s)}}function ae(e){if(d&&(K(d),d=null),e)return;const n=b;b=null,n.length?E(()=>se(n),!1):globalThis._$afterUpdate&&globalThis._$afterUpdate()}function K(e){for(let n=0;n<e.length;n++)G(e[n])}function L(e,n){const t=g;e.state=0;for(let s=0;s<e.sources.length;s+=1){const o=e.sources[s];o.sources&&(o.state===w||t?o!==n&&G(o):(o.state===_||t)&&L(o,n))}}function J(e){const n=g;for(let t=0;t<e.observers.length;t+=1){const s=e.observers[t];(!s.state||n)&&(s.state=_,s.pure?d.push(s):b.push(s),s.observers&&J(s))}}function I(e){let n;if(e.sources)for(;e.sources.length;){const t=e.sources.pop(),s=e.sourceSlots.pop(),o=t.observers;if(o&&o.length){const r=o.pop(),l=t.observerSlots.pop();s<o.length&&(r.sourceSlots[l]=s,o[s]=r,t.observerSlots[s]=l)}}if(e.owned){for(n=0;n<e.owned.length;n++)I(e.owned[n]);e.owned=null}if(e.cleanups){for(n=0;n<e.cleanups.length;n++)e.cleanups[n]();e.cleanups=null}e.state=0,e.context=null,delete e.sourceMap}function de(e){return e instanceof Error||typeof e=="string"?e:new Error("Unknown error")}function Q(e){throw e=de(e),e}function B(e){for(var n=0,t=9;n<e.length;)t=Math.imul(t^e.charCodeAt(n++),9**9);return`${t^t>>>9}`}const R=Symbol("fallback");function H(e){for(let n=0;n<e.length;n++)e[n]()}function pe(e,n,t={}){let s=[],o=[],r=[],l=[],i=0,u;return X(()=>H(r)),()=>{const f=e()||[];return f[te],S(()=>{if(f.length===0)return i!==0&&(H(r),r=[],s=[],o=[],i=0,l=[]),t.fallback&&(s=[R],o[0]=O(h=>(r[0]=h,t.fallback())),i=1),o;for(s[0]===R&&(r[0](),r=[],s=[],o=[],i=0),u=0;u<f.length;u++)u<s.length&&s[u]!==f[u]?l[u](()=>f[u]):u>=s.length&&(o[u]=O(p));for(;u<s.length;u++)r[u]();return i=l.length=r.length=f.length,s=f.slice(0),o=o.slice(0,i)});function p(h){r[u]=h;const[x,C]=$(f[u]);return l[u]=C,n(x,u)}}}function A(e,n){return le(e,n||{})}function he(e){const n="fallback"in e&&{fallback:()=>e.fallback};return ie(pe(()=>e.each,e.children,n||void 0))}globalThis&&(globalThis.Solid$$?console.warn("You appear to have multiple instances of Solid. This can lead to unexpected behavior."):globalThis.Solid$$=!0);function ye(e,n,t){let s=t.length,o=n.length,r=s,l=0,i=0,u=n[o-1].nextSibling,f=null;for(;l<o||i<r;){if(n[l]===t[i]){l++,i++;continue}for(;n[o-1]===t[r-1];)o--,r--;if(o===l){const p=r<s?i?t[i-1].nextSibling:t[r-i]:u;for(;i<r;)e.insertBefore(t[i++],p)}else if(r===i)for(;l<o;)(!f||!f.has(n[l]))&&n[l].remove(),l++;else if(n[l]===t[r-1]&&t[i]===n[o-1]){const p=n[--o].nextSibling;e.insertBefore(t[i++],n[l++].nextSibling),e.insertBefore(t[--r],p),n[o]=t[r]}else{if(!f){f=new Map;let h=i;for(;h<r;)f.set(t[h],h++)}const p=f.get(n[l]);if(p!=null)if(i<p&&p<r){let h=l,x=1,C;for(;++h<o&&h<r&&!((C=f.get(n[h]))==null||C!==p+x);)x++;if(x>p-i){const z=n[l];for(;i<p;)e.insertBefore(t[i++],z)}else e.replaceChild(t[i++],n[l++])}else l++;else n[l++].remove()}}}const V="_$DX_DELEGATE";function ge(e,n,t){let s;return O(o=>{s=o,n===document?e():j(n,e(),n.firstChild?null:void 0,t)}),()=>{s(),n.textContent=""}}function U(e,n,t){const s=document.createElement("template");if(s.innerHTML=e,n&&s.innerHTML.split("<").length-1!==n)throw`The browser resolved template HTML does not match JSX input:
${s.innerHTML}

${e}. Is your HTML properly formed?`;let o=s.content.firstChild;return t&&(o=o.firstChild),o}function be(e,n=window.document){const t=n[V]||(n[V]=new Set);for(let s=0,o=e.length;s<o;s++){const r=e[s];t.has(r)||(t.add(r),n.addEventListener(r,me))}}function j(e,n,t,s){if(t!==void 0&&!s&&(s=[]),typeof n!="function")return N(e,n,s,t);m(o=>N(e,n(),o,t),s)}function me(e){const n=`$$${e.type}`;let t=e.composedPath&&e.composedPath()[0]||e.target;for(e.target!==t&&Object.defineProperty(e,"target",{configurable:!0,value:t}),Object.defineProperty(e,"currentTarget",{configurable:!0,get(){return t||document}}),y.registry&&!y.done&&(y.done=!0,document.querySelectorAll("[id^=pl-]").forEach(s=>s.remove()));t!==null;){const s=t[n];if(s&&!t.disabled){const o=t[`${n}Data`];if(o!==void 0?s.call(t,o,e):s.call(t,e),e.cancelBubble)return}t=t.host&&t.host!==t&&t.host instanceof Node?t.host:t.parentNode}}function N(e,n,t,s,o){for(y.context&&!t&&(t=[...e.childNodes]);typeof t=="function";)t=t();if(n===t)return t;const r=typeof n,l=s!==void 0;if(e=l&&t[0]&&t[0].parentNode||e,r==="string"||r==="number"){if(y.context)return t;if(r==="number"&&(n=n.toString()),l){let i=t[0];i&&i.nodeType===3?i.data=n:i=document.createTextNode(n),t=v(e,t,s,i)}else t!==""&&typeof t=="string"?t=e.firstChild.data=n:t=e.textContent=n}else if(n==null||r==="boolean"){if(y.context)return t;t=v(e,t,s)}else{if(r==="function")return m(()=>{let i=n();for(;typeof i=="function";)i=i();t=N(e,i,t,s)}),()=>t;if(Array.isArray(n)){const i=[],u=t&&Array.isArray(t);if(D(i,n,t,o))return m(()=>t=N(e,i,t,s,!0)),()=>t;if(y.context){if(!i.length)return t;for(let f=0;f<i.length;f++)if(i[f].parentNode)return t=i}if(i.length===0){if(t=v(e,t,s),l)return t}else u?t.length===0?q(e,i,s):ye(e,t,i):(t&&v(e),q(e,i));t=i}else if(n instanceof Node){if(y.context&&n.parentNode)return t=l?[n]:n;if(Array.isArray(t)){if(l)return t=v(e,t,s,n);v(e,t,null,n)}else t==null||t===""||!e.firstChild?e.appendChild(n):e.replaceChild(n,e.firstChild);t=n}else console.warn("Unrecognized value. Skipped inserting",n)}return t}function D(e,n,t,s){let o=!1;for(let r=0,l=n.length;r<l;r++){let i=n[r],u=t&&t[r];if(i instanceof Node)e.push(i);else if(!(i==null||i===!0||i===!1))if(Array.isArray(i))o=D(e,i,u)||o;else if(typeof i=="function")if(s){for(;typeof i=="function";)i=i();o=D(e,Array.isArray(i)?i:[i],u)||o}else e.push(i),o=!0;else{const f=String(i);u&&u.nodeType===3&&u.data===f?e.push(u):e.push(document.createTextNode(f))}}return o}function q(e,n,t){for(let s=0,o=n.length;s<o;s++)e.insertBefore(n[s],t)}function v(e,n,t,s){if(t===void 0)return e.textContent="";const o=s||document.createTextNode("");if(n.length){let r=!1;for(let l=n.length-1;l>=0;l--){const i=n[l];if(o!==i){const u=i.parentNode===e;!r&&!l?u?e.replaceChild(o,i):e.insertBefore(o,t):u&&i.remove()}else r=!0}}else e.insertBefore(o,t);return[o]}const F={pointerId:-1,clientX:0,clientY:0},Z=(e,n)=>{const[t,s]=$(F),o=n(),r=u=>s(u),l=()=>s(F),i=u=>{if(t().pointerId===-1)return;const f=u.clientX-t().clientX,p=u.clientY-t().clientY;o({x:f,y:p}),s(u)};e.addEventListener("pointerdown",r),document.addEventListener("pointerup",l),document.addEventListener("pointermove",i),X(()=>{e.removeEventListener("pointerdown",r),document.removeEventListener("pointerup",l),document.removeEventListener("pointermove",i)})},we=U("<div></div>",2),ve=()=>{const[e,n]=$({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight});return(()=>{const t=we.cloneNode(!0);return Z(t,()=>({x:s,y:o})=>n({x:e().x+s,y:e().y+o})),t.style.setProperty("position","absolute"),t.style.setProperty("width","50px"),t.style.setProperty("height","50px"),t.style.setProperty("background","rgba(255, 255, 255, 0.25)"),t.style.setProperty("border-radius","10px"),m(()=>t.style.setProperty("transform",`translate(${e().x}px, ${e().y}px)`)),t})()},xe=U("<div><div></div><div></div></div>",6),$e=e=>{const[n,t]=$({x:0,y:0});return(()=>{const s=xe.cloneNode(!0),o=s.firstChild,r=o.nextSibling;return Z(o,()=>({x:l,y:i})=>t({x:n().x+l,y:n().y+i})),o.style.setProperty("position","absolute"),o.style.setProperty("background-color","#0093E9"),o.style.setProperty("background-image","linear-gradient(180deg, #0093E9 0%, #80D0C7 100%)"),o.style.setProperty("width","100vw"),o.style.setProperty("height","100vh"),r.style.setProperty("position","absolute"),j(r,()=>e.children),m(()=>r.style.setProperty("transform",`translate(${n().x}px, ${n().y}px)`)),s})()},Se=U('<div><div><input type="range" min="1" max="10000"><div></div></div></div>',7),Pe=()=>{const[e,n]=$(25),t=()=>Array.from({length:e()});return[A($e,{get children(){return A(he,{get each(){return t()},children:()=>A(ve,{})})}}),(()=>{const s=Se.cloneNode(!0),o=s.firstChild,r=o.firstChild,l=r.nextSibling;return s.style.setProperty("position","absolute"),s.style.setProperty("display","flex"),s.style.setProperty("justify-content","center"),s.style.setProperty("align-items","end"),s.style.setProperty("pointer-events","none"),o.style.setProperty("margin-bottom","30px"),o.style.setProperty("display","flex"),o.style.setProperty("flex-direction","column"),o.style.setProperty("align-items","center"),o.style.setProperty("backdrop-filter","blur(4px)"),o.style.setProperty("-webkit-backdrop-filter","blur(4px)"),r.$$input=i=>n(i.target.value),r.style.setProperty("pointer-events","all"),l.style.setProperty("font-size","2em"),j(l,e),m(i=>{const u=`${window.innerWidth}px`,f=`${window.innerHeight}px`;return u!==i._v$&&s.style.setProperty("width",i._v$=u),f!==i._v$2&&s.style.setProperty("height",i._v$2=f),i},{_v$:void 0,_v$2:void 0}),m(()=>r.value=e()),s})()]};ge(()=>A(Pe,{}),document.getElementById("root"));be(["input"]);
