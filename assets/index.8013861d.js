(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerpolicy&&(r.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?r.credentials="include":s.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();const B={},Ke=(e,t)=>e===t,D=Symbol("solid-proxy"),ie=Symbol("solid-track"),He=Symbol("solid-dev-component"),W={equals:Ke};let ze=Ee;const k=1,X=2,Ge={owned:null,cleanups:null,context:null,owner:null};var y=null;let E=null,b=null,P=null,T=null,fe=0,We=0;function z(e,t){const n=b,o=y,s=e.length===0,r={owned:null,cleanups:null,context:null,owner:t||o},l=s?()=>e(()=>{throw new Error("Dispose method must be an explicit argument to createRoot function")}):()=>e(()=>q(()=>he(r)));o&&(r.name=`${o.name}-r${We++}`),globalThis._$afterCreateRoot&&globalThis._$afterCreateRoot(r),y=r,b=null;try{return R(l,!0)}finally{b=n,y=o}}function oe(e,t){t=t?Object.assign({},W,t):W;const n={value:e,observers:null,observerSlots:null,comparator:t.equals||void 0};t.internal||(n.name=Oe(t.name||_e(e),n));const o=s=>(typeof s=="function"&&(s=s(n.value)),de(n,s));return[Ce.bind(n),o]}function C(e,t,n){const o=pe(e,t,!1,k,n);K(o)}function Xe(e,t,n){n=n?Object.assign({},W,n):W;const o=pe(e,t,!0,0,n);return o.observers=null,o.observerSlots=null,o.comparator=n.equals||void 0,K(o),Ce.bind(o)}function Ye(e){return R(e,!1)}function q(e){let t,n=b;return b=null,t=e(),b=n,t}function ae(e){return y===null?console.warn("cleanups created outside a `createRoot` or `render` will never be run"):y.cleanups===null?y.cleanups=[e]:y.cleanups.push(e),e}function Se(){return b}function Je(e,t){const n=pe(()=>q(()=>(Object.assign(e,{[He]:!0}),e(t))),void 0,!0);return n.observers=null,n.observerSlots=null,n.state=0,n.componentName=e.name,K(n),n.tValue!==void 0?n.tValue:n.value}function _e(e){const t=new Set;return`s${we(typeof e=="string"?e:q(()=>JSON.stringify(e,(n,o)=>{if(typeof o=="object"&&o!=null){if(t.has(o))return;t.add(o);const s=Object.keys(o),r=Object.getOwnPropertyDescriptors(o),l=s.reduce((i,c)=>{const f=r[c];return f.get||(i[c]=f),i},{});o=Object.create({},l)}return typeof o=="bigint"?`${o.toString()}n`:o})||""))}`}function Oe(e,t){let n=e;if(y){let o=0;for(y.sourceMap||(y.sourceMap={});y.sourceMap[n];)n=`${e}-${++o}`;y.sourceMap[n]=t}return n}function Qe(e){return e||(e=y),e?{...je(e.sourceMap),...e.owned?ke(e):{}}:{}}function Ce(){const e=E;if(this.sources&&(this.state||e))if(this.state===k||e)K(this);else{const t=P;P=null,R(()=>Y(this),!1),P=t}if(b){const t=this.observers?this.observers.length:0;b.sources?(b.sources.push(this),b.sourceSlots.push(t)):(b.sources=[this],b.sourceSlots=[t]),this.observers?(this.observers.push(b),this.observerSlots.push(b.sources.length-1)):(this.observers=[b],this.observerSlots=[b.sources.length-1])}return this.value}function de(e,t,n){let o=e.value;return(!e.comparator||!e.comparator(o,t))&&(e.value=t,e.observers&&e.observers.length&&R(()=>{for(let s=0;s<e.observers.length;s+=1){const r=e.observers[s],l=E&&E.running;l&&E.disposed.has(r),(l&&!r.tState||!l&&!r.state)&&(r.pure?P.push(r):T.push(r),r.observers&&Te(r)),l||(r.state=k)}if(P.length>1e6){throw P=[],new Error("Potential Infinite Loop Detected.");throw new Error}},!1)),t}function K(e){if(!e.fn)return;he(e);const t=y,n=b,o=fe;b=y=e,Ze(e,e.value,o),b=n,y=t}function Ze(e,t,n){let o;try{o=e.fn(t)}catch(s){e.pure&&(e.state=k),De(s)}(!e.updatedAt||e.updatedAt<=n)&&(e.updatedAt!=null&&"observers"in e?de(e,o):e.value=o,e.updatedAt=n)}function pe(e,t,n,o=k,s){const r={fn:e,state:o,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:y,context:null,pure:n};return y===null?console.warn("computations created outside a `createRoot` or `render` will never be disposed"):y!==Ge&&(y.owned?y.owned.push(r):y.owned=[r],r.name=s&&s.name||`${y.name||"c"}-${(y.owned||y.tOwned).length}`),r}function Ne(e){const t=E;if(e.state===0||t)return;if(e.state===X||t)return Y(e);if(e.suspense&&q(e.suspense.inFallback))return e.suspense.effects.push(e);const n=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<fe);)(e.state||t)&&n.push(e);for(let o=n.length-1;o>=0;o--)if(e=n[o],e.state===k||t)K(e);else if(e.state===X||t){const s=P;P=null,R(()=>Y(e,n[0]),!1),P=s}}function R(e,t){if(P)return e();let n=!1;t||(P=[]),T?n=!0:T=[],fe++;try{const o=e();return et(n),o}catch(o){P||(T=null),De(o)}}function et(e){if(P&&(Ee(P),P=null),e)return;const t=T;T=null,t.length?R(()=>ze(t),!1):globalThis._$afterUpdate&&globalThis._$afterUpdate()}function Ee(e){for(let t=0;t<e.length;t++)Ne(e[t])}function Y(e,t){const n=E;e.state=0;for(let o=0;o<e.sources.length;o+=1){const s=e.sources[o];s.sources&&(s.state===k||n?s!==t&&Ne(s):(s.state===X||n)&&Y(s,t))}}function Te(e){const t=E;for(let n=0;n<e.observers.length;n+=1){const o=e.observers[n];(!o.state||t)&&(o.state=X,o.pure?P.push(o):T.push(o),o.observers&&Te(o))}}function he(e){let t;if(e.sources)for(;e.sources.length;){const n=e.sources.pop(),o=e.sourceSlots.pop(),s=n.observers;if(s&&s.length){const r=s.pop(),l=n.observerSlots.pop();o<s.length&&(r.sourceSlots[l]=o,s[o]=r,n.observerSlots[o]=l)}}if(e.owned){for(t=0;t<e.owned.length;t++)he(e.owned[t]);e.owned=null}if(e.cleanups){for(t=0;t<e.cleanups.length;t++)e.cleanups[t]();e.cleanups=null}e.state=0,e.context=null,delete e.sourceMap}function tt(e){return e instanceof Error||typeof e=="string"?e:new Error("Unknown error")}function De(e){throw e=tt(e),e}function we(e){for(var t=0,n=9;t<e.length;)n=Math.imul(n^e.charCodeAt(t++),9**9);return`${n^n>>>9}`}function je(e={}){const t=Object.keys(e),n={};for(let o=0;o<t.length;o++){const s=t[o];n[s]=e[s].value}return n}function ke(e){const t={};for(let n=0,o=e.owned.length;n<o;n++){const s=e.owned[n];t[s.componentName?`${s.componentName}:${s.name}`:s.name]={...je(s.sourceMap),...s.owned?ke(s):{}}}return t}const nt=Symbol("fallback");function be(e){for(let t=0;t<e.length;t++)e[t]()}function ot(e,t,n={}){let o=[],s=[],r=[],l=0,i=t.length>1?[]:null;return ae(()=>be(r)),()=>{let c=e()||[],f,u;return c[ie],q(()=>{let m=c.length,x,S,_,L,d,p,h,g,a;if(m===0)l!==0&&(be(r),r=[],o=[],s=[],l=0,i&&(i=[])),n.fallback&&(o=[nt],s[0]=z($=>(r[0]=$,n.fallback())),l=1);else if(l===0){for(s=new Array(m),u=0;u<m;u++)o[u]=c[u],s[u]=z(v);l=m}else{for(_=new Array(m),L=new Array(m),i&&(d=new Array(m)),p=0,h=Math.min(l,m);p<h&&o[p]===c[p];p++);for(h=l-1,g=m-1;h>=p&&g>=p&&o[h]===c[g];h--,g--)_[g]=s[h],L[g]=r[h],i&&(d[g]=i[h]);for(x=new Map,S=new Array(g+1),u=g;u>=p;u--)a=c[u],f=x.get(a),S[u]=f===void 0?-1:f,x.set(a,u);for(f=p;f<=h;f++)a=o[f],u=x.get(a),u!==void 0&&u!==-1?(_[u]=s[f],L[u]=r[f],i&&(d[u]=i[f]),u=S[u],x.set(a,u)):r[f]();for(u=p;u<m;u++)u in _?(s[u]=_[u],r[u]=L[u],i&&(i[u]=d[u],i[u](u))):s[u]=z(v);s=s.slice(0,l=m),o=c.slice(0)}return s});function v(m){if(r[u]=m,i){const[x,S]=oe(u);return i[u]=S,t(c[u],x)}return t(c[u])}}}function N(e,t){return Je(e,t||{})}function J(e){const t="fallback"in e&&{fallback:()=>e.fallback};return Xe(ot(()=>e.each,e.children,t||void 0))}let G;G={writeSignal:de,serializeGraph:Qe,registerGraph:Oe,hashValue:_e};globalThis&&(globalThis.Solid$$?console.warn("You appear to have multiple instances of Solid. This can lead to unexpected behavior."):globalThis.Solid$$=!0);function st(e,t,n){let o=n.length,s=t.length,r=o,l=0,i=0,c=t[s-1].nextSibling,f=null;for(;l<s||i<r;){if(t[l]===n[i]){l++,i++;continue}for(;t[s-1]===n[r-1];)s--,r--;if(s===l){const u=r<o?i?n[i-1].nextSibling:n[r-i]:c;for(;i<r;)e.insertBefore(n[i++],u)}else if(r===i)for(;l<s;)(!f||!f.has(t[l]))&&t[l].remove(),l++;else if(t[l]===n[r-1]&&n[i]===t[s-1]){const u=t[--s].nextSibling;e.insertBefore(n[i++],t[l++].nextSibling),e.insertBefore(n[--r],u),t[s]=n[r]}else{if(!f){f=new Map;let v=i;for(;v<r;)f.set(n[v],v++)}const u=f.get(t[l]);if(u!=null)if(i<u&&u<r){let v=l,m=1,x;for(;++v<s&&v<r&&!((x=f.get(t[v]))==null||x!==u+m);)m++;if(m>u-i){const S=t[l];for(;i<u;)e.insertBefore(n[i++],S)}else e.replaceChild(n[i++],t[l++])}else l++;else t[l++].remove()}}}function rt(e,t,n){let o;return z(s=>{o=s,t===document?e():j(t,e(),t.firstChild?null:void 0,n)}),()=>{o(),t.textContent=""}}function H(e,t,n){const o=document.createElement("template");if(o.innerHTML=e,t&&o.innerHTML.split("<").length-1!==t)throw`The browser resolved template HTML does not match JSX input:
${o.innerHTML}

${e}. Is your HTML properly formed?`;let s=o.content.firstChild;return n&&(s=s.firstChild),s}function I(e,t,n){n==null?e.removeAttribute(t):e.setAttribute(t,n)}function j(e,t,n,o){if(n!==void 0&&!o&&(o=[]),typeof t!="function")return Q(e,t,o,n);C(s=>Q(e,t(),s,n),o)}function Q(e,t,n,o,s){for(B.context&&!n&&(n=[...e.childNodes]);typeof n=="function";)n=n();if(t===n)return n;const r=typeof t,l=o!==void 0;if(e=l&&n[0]&&n[0].parentNode||e,r==="string"||r==="number"){if(B.context)return n;if(r==="number"&&(t=t.toString()),l){let i=n[0];i&&i.nodeType===3?i.data=t:i=document.createTextNode(t),n=M(e,n,o,i)}else n!==""&&typeof n=="string"?n=e.firstChild.data=t:n=e.textContent=t}else if(t==null||r==="boolean"){if(B.context)return n;n=M(e,n,o)}else{if(r==="function")return C(()=>{let i=t();for(;typeof i=="function";)i=i();n=Q(e,i,n,o)}),()=>n;if(Array.isArray(t)){const i=[],c=n&&Array.isArray(n);if(le(i,t,n,s))return C(()=>n=Q(e,i,n,o,!0)),()=>n;if(B.context){if(!i.length)return n;for(let f=0;f<i.length;f++)if(i[f].parentNode)return n=i}if(i.length===0){if(n=M(e,n,o),l)return n}else c?n.length===0?me(e,i,o):st(e,n,i):(n&&M(e),me(e,i));n=i}else if(t instanceof Node){if(B.context&&t.parentNode)return n=l?[t]:t;if(Array.isArray(n)){if(l)return n=M(e,n,o,t);M(e,n,null,t)}else n==null||n===""||!e.firstChild?e.appendChild(t):e.replaceChild(t,e.firstChild);n=t}else console.warn("Unrecognized value. Skipped inserting",t)}return n}function le(e,t,n,o){let s=!1;for(let r=0,l=t.length;r<l;r++){let i=t[r],c=n&&n[r];if(i instanceof Node)e.push(i);else if(!(i==null||i===!0||i===!1))if(Array.isArray(i))s=le(e,i,c)||s;else if(typeof i=="function")if(o){for(;typeof i=="function";)i=i();s=le(e,Array.isArray(i)?i:[i],c)||s}else e.push(i),s=!0;else{const f=String(i);c&&c.nodeType===3&&c.data===f?e.push(c):e.push(document.createTextNode(f))}}return s}function me(e,t,n){for(let o=0,s=t.length;o<s;o++)e.insertBefore(t[o],n)}function M(e,t,n,o){if(n===void 0)return e.textContent="";const s=o||document.createTextNode("");if(t.length){let r=!1;for(let l=t.length-1;l>=0;l--){const i=t[l];if(s!==i){const c=i.parentNode===e;!r&&!l?c?e.replaceChild(s,i):e.insertBefore(s,n):c&&i.remove()}else r=!0}}else e.insertBefore(s,n);return[s]}const ue=Symbol("store-raw"),V=Symbol("store-node"),Z=Symbol("store-name");function Le(e,t){let n=e[D];if(!n){if(Object.defineProperty(e,D,{value:n=new Proxy(e,ut)}),!Array.isArray(e)){const o=Object.keys(e),s=Object.getOwnPropertyDescriptors(e);for(let r=0,l=o.length;r<l;r++){const i=o[r];if(s[i].get){const c=s[i].get.bind(n);Object.defineProperty(e,i,{get:c})}}}t&&Object.defineProperty(e,Z,{value:t})}return n}function ee(e){let t;return e!=null&&typeof e=="object"&&(e[D]||!(t=Object.getPrototypeOf(e))||t===Object.prototype||Array.isArray(e))}function F(e,t=new Set){let n,o,s,r;if(n=e!=null&&e[ue])return n;if(!ee(e)||t.has(e))return e;if(Array.isArray(e)){Object.isFrozen(e)?e=e.slice(0):t.add(e);for(let l=0,i=e.length;l<i;l++)s=e[l],(o=F(s,t))!==s&&(e[l]=o)}else{Object.isFrozen(e)?e=Object.assign({},e):t.add(e);const l=Object.keys(e),i=Object.getOwnPropertyDescriptors(e);for(let c=0,f=l.length;c<f;c++)r=l[c],!i[r].get&&(s=e[r],(o=F(s,t))!==s&&(e[r]=o))}return e}function te(e){let t=e[V];return t||Object.defineProperty(e,V,{value:t={}}),t}function ce(e,t,n){return e[t]||(e[t]=Re(n))}function it(e,t){const n=Reflect.getOwnPropertyDescriptor(e,t);return!n||n.get||!n.configurable||t===D||t===V||t===Z||(delete n.value,delete n.writable,n.get=()=>e[D][t]),n}function Me(e){if(Se()){const t=te(e);(t._||(t._=Re()))()}}function lt(e){return Me(e),Reflect.ownKeys(e)}function Re(e){const[t,n]=oe(e,{equals:!1,internal:!0});return t.$=n,t}const ut={get(e,t,n){if(t===ue)return e;if(t===D)return n;if(t===ie)return Me(e),n;const o=te(e),s=o.hasOwnProperty(t);let r=s?o[t]():e[t];if(t===V||t==="__proto__")return r;if(!s){const l=Object.getOwnPropertyDescriptor(e,t);Se()&&(typeof r!="function"||e.hasOwnProperty(t))&&!(l&&l.get)&&(r=ce(o,t,r)())}return ee(r)?Le(r,e[Z]&&`${e[Z]}:${t.toString()}`):r},has(e,t){if(t===ue||t===D||t===ie||t===V||t==="__proto__")return!0;const n=te(e)[t];return n&&n(),t in e},set(){return console.warn("Cannot mutate a Store directly"),!0},deleteProperty(){return console.warn("Cannot mutate a Store directly"),!0},ownKeys:lt,getOwnPropertyDescriptor:it};function ne(e,t,n,o=!1){if(!o&&e[t]===n)return;const s=e[t],r=e.length;n===void 0?delete e[t]:e[t]=n;let l=te(e),i;(i=ce(l,t,s))&&i.$(()=>n),Array.isArray(e)&&e.length!==r&&(i=ce(l,"length",r))&&i.$(e.length),(i=l._)&&i.$()}function Be(e,t){const n=Object.keys(t);for(let o=0;o<n.length;o+=1){const s=n[o];ne(e,s,t[s])}}function ct(e,t){if(typeof t=="function"&&(t=t(e)),t=F(t),Array.isArray(t)){if(e===t)return;let n=0,o=t.length;for(;n<o;n++){const s=t[n];e[n]!==s&&ne(e,n,s)}ne(e,"length",o)}else Be(e,t)}function U(e,t,n=[]){let o,s=e;if(t.length>1){o=t.shift();const l=typeof o,i=Array.isArray(e);if(Array.isArray(o)){for(let c=0;c<o.length;c++)U(e,[o[c]].concat(t),n);return}else if(i&&l==="function"){for(let c=0;c<e.length;c++)o(e[c],c)&&U(e,[c].concat(t),n);return}else if(i&&l==="object"){const{from:c=0,to:f=e.length-1,by:u=1}=o;for(let v=c;v<=f;v+=u)U(e,[v].concat(t),n);return}else if(t.length>1){U(e[o],t,[o].concat(n));return}s=e[o],n=[o].concat(n)}let r=t[0];typeof r=="function"&&(r=r(s,n),r===s)||o===void 0&&r==null||(r=F(r),o===void 0||ee(s)&&ee(r)&&!Array.isArray(r)?Be(s,r):ne(e,o,r))}function se(...[e,t]){const n=F(e||{}),o=Array.isArray(n);if(typeof n!="object"&&typeof n!="function")throw new Error(`Unexpected type ${typeof n} received when initializing 'createStore'. Expected an object.`);const s=Le(n,t&&t.name||G.hashValue(n));{const l=t&&t.name||G.hashValue(n);G.registerGraph(l,{value:n})}function r(...l){Ye(()=>{o&&l.length===1?ct(n,l[0]):U(n,l)})}return[s,r]}const ft=[0,0],$e=([e,t],[n,o])=>[e+n,t+o],at=([e,t],[n,o])=>[n-e,o-t],ve={id:-1,position:ft},Pe=e=>({id:e.pointerId,position:[e.clientX,e.clientY]}),Ie=(e,t)=>{const[n,o]=oe(ve),s=t(),r=c=>{o(Pe(c)),c.stopPropagation()},l=c=>{n().id===c.pointerId&&o(ve)},i=c=>{if(n().id!==c.pointerId)return;const f=Pe(c);s(at(n().position,f.position)),o(f)};e.addEventListener("pointerdown",r),document.addEventListener("pointerup",l),document.addEventListener("pointermove",i),ae(()=>{e.removeEventListener("pointerdown",r),document.removeEventListener("pointerup",l),document.removeEventListener("pointermove",i)})},dt=(e,t)=>{const n=t(),o=new MutationObserver(s=>{for(const r of s)n(r)});o.observe(e,{attributes:!0,childList:!1,subtree:!1}),ae(()=>o.disconnect())},re=H("<div></div>",2),pt=H("<div><div></div><svg></svg></div>",6),xe=H('<svg><circle r="10" fill="white"></circle></svg>',4,!0),ht=H('<svg><path stroke="white" stroke-width="3" fill="none"></path></svg>',4,!0),yt=e=>{const t=()=>{const[n,o]=e.node.position;return`translate(${n}px, ${o}px)`};return(()=>{const n=re.cloneNode(!0);return Ie(n,()=>o=>e.onDrag(e.node.uuid,o)),dt(n,()=>()=>e.onMutation(e.node.uuid)),n.style.setProperty("padding","20px"),n.style.setProperty("background-color","blue"),n.style.setProperty("position","absolute"),j(n,N(J,{get each(){return e.node.inputs},children:o=>(()=>{const s=re.cloneNode(!0);return(r=>e.onRef(o.uuid,r))(s),s.style.setProperty("width","30px"),s.style.setProperty("height","30px"),s.style.setProperty("background-color","red"),s})()}),null),j(n,N(J,{get each(){return e.node.outputs},children:o=>(()=>{const s=re.cloneNode(!0);return(r=>e.onRef(o.uuid,r))(s),s.style.setProperty("width","30px"),s.style.setProperty("height","30px"),s.style.setProperty("background-color","green"),s})()}),null),C(()=>n.style.setProperty("transform",t())),n})()},Ae=e=>{const[t,n]=oe([0,0]),[o,s]=se({"node-0":{uuid:"node-0",position:[50,50],inputs:[],outputs:[{uuid:"node-0_output-0",name:"out 0"}]},"node-1":{uuid:"node-1",position:[150,150],inputs:[{uuid:"node-1_input-0",name:"in 0"}],outputs:[{uuid:"node-1_output-0",name:"out 0"}]}}),[r,l]=se({"edge-0":{uuid:"edge-0",input:"node-1_input-0",output:"node-0_output-0"}}),i=()=>{const[d,p]=t();return`translate(${d}px, ${p}px)`},[c,f]=se({}),u={},v=d=>{n($e(t(),d));const p={};for(const[h,g]of Object.entries(u))p[h]=g.getBoundingClientRect();f(p)},m=(d,p)=>{s(d,"position",h=>$e(h,p))},x=(d,p)=>u[d]=p,S=d=>{const p=o[d];for(const h of p.inputs){const g=u[h.uuid].getBoundingClientRect();f(h.uuid,g)}for(const h of p.outputs){const g=u[h.uuid].getBoundingClientRect();f(h.uuid,g)}};let _;const L=()=>{const{x:d,y:p}=_.getBoundingClientRect(),h=[];for(const g of Object.values(r)){const a=c[g.input],$=c[g.output];if(!a||!$)continue;const w=a.width/2,[A,O]=[$.x+w-d,$.y+w-p],[ye,ge]=[a.x+w-d,a.y+w-p],[Ue,Ve]=[A+50,O],[Fe,qe]=[ye-50,ge];h.push({p0:[A,O],p1:[Ue,Ve],p2:[Fe,qe],p3:[ye,ge],r:w})}return h};return(()=>{const d=pt.cloneNode(!0),p=d.firstChild,h=p.nextSibling,g=_;return typeof g=="function"?g(d):_=d,Ie(d,()=>v),d.style.setProperty("display","block"),d.style.setProperty("background-color","cornflowerblue"),d.style.setProperty("overflow","hidden"),d.style.setProperty("position","relative"),d.style.setProperty("flex-shrink","0"),j(p,N(J,{get each(){return Object.values(o)},children:a=>N(yt,{node:a,onMutation:S,onRef:x,onDrag:m})})),h.style.setProperty("width","100%"),h.style.setProperty("height","100%"),h.style.setProperty("position","absolute"),h.style.setProperty("pointer-events","none"),j(h,N(J,{get each(){return L()},children:a=>[(()=>{const $=xe.cloneNode(!0);return C(w=>{const A=a.p0[0],O=a.p0[1];return A!==w._v$4&&I($,"cx",w._v$4=A),O!==w._v$5&&I($,"cy",w._v$5=O),w},{_v$4:void 0,_v$5:void 0}),$})(),(()=>{const $=xe.cloneNode(!0);return C(w=>{const A=a.p3[0],O=a.p3[1];return A!==w._v$6&&I($,"cx",w._v$6=A),O!==w._v$7&&I($,"cy",w._v$7=O),w},{_v$6:void 0,_v$7:void 0}),$})(),(()=>{const $=ht.cloneNode(!0);return C(()=>I($,"d",`M${a.p0[0]},${a.p0[1]} C${a.p1[0]},${a.p1[1]} ${a.p2[0]},${a.p2[1]} ${a.p3[0]},${a.p3[1]}`)),$})()]})),C(a=>{const $=`${e.width}px`,w=`${e.height}px`,A=i();return $!==a._v$&&d.style.setProperty("width",a._v$=$),w!==a._v$2&&d.style.setProperty("height",a._v$2=w),A!==a._v$3&&p.style.setProperty("transform",a._v$3=A),a},{_v$:void 0,_v$2:void 0,_v$3:void 0}),d})()},gt=H("<div></div>",2),wt=()=>(()=>{const e=gt.cloneNode(!0);return e.style.setProperty("display","flex"),e.style.setProperty("flex-direction","column"),e.style.setProperty("gap","20px"),e.style.setProperty("width","100vw"),e.style.setProperty("height","100vh"),e.style.setProperty("min-height","700px"),e.style.setProperty("justify-content","center"),e.style.setProperty("align-items","center"),j(e,N(Ae,{width:300,height:300}),null),j(e,N(Ae,{width:300,height:300}),null),e})();rt(()=>N(wt,{}),document.getElementById("root"));
