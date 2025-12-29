var gu={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jc=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let i=r.charCodeAt(n);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(i=65536+((i&1023)<<10)+(r.charCodeAt(++n)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},If=function(r){const e=[];let t=0,n=0;for(;t<r.length;){const i=r[t++];if(i<128)e[n++]=String.fromCharCode(i);else if(i>191&&i<224){const s=r[t++];e[n++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=r[t++],a=r[t++],u=r[t++],c=((i&7)<<18|(s&63)<<12|(a&63)<<6|u&63)-65536;e[n++]=String.fromCharCode(55296+(c>>10)),e[n++]=String.fromCharCode(56320+(c&1023))}else{const s=r[t++],a=r[t++];e[n++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},Yc={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let i=0;i<r.length;i+=3){const s=r[i],a=i+1<r.length,u=a?r[i+1]:0,c=i+2<r.length,d=c?r[i+2]:0,m=s>>2,p=(s&3)<<4|u>>4;let E=(u&15)<<2|d>>6,P=d&63;c||(P=64,a||(E=64)),n.push(t[m],t[p],t[E],t[P])}return n.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(Jc(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):If(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let i=0;i<r.length;){const s=t[r.charAt(i++)],u=i<r.length?t[r.charAt(i)]:0;++i;const d=i<r.length?t[r.charAt(i)]:64;++i;const p=i<r.length?t[r.charAt(i)]:64;if(++i,s==null||u==null||d==null||p==null)throw new vf;const E=s<<2|u>>4;if(n.push(E),d!==64){const P=u<<4&240|d>>2;if(n.push(P),p!==64){const V=d<<6&192|p;n.push(V)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class vf extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Tf=function(r){const e=Jc(r);return Yc.encodeByteArray(e,!0)},bi=function(r){return Tf(r).replace(/\./g,"")},Xc=function(r){try{return Yc.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ef(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wf=()=>Ef().__FIREBASE_DEFAULTS__,Af=()=>{if(typeof process>"u"||typeof gu>"u")return;const r=gu.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},Rf=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&Xc(r[1]);return e&&JSON.parse(e)},$i=()=>{try{return wf()||Af()||Rf()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},Zc=r=>{var e,t;return(t=(e=$i())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[r]},bf=r=>{const e=Zc(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const n=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),n]:[e.substring(0,t),n]},el=()=>{var r;return(r=$i())===null||r===void 0?void 0:r.config},tl=r=>{var e;return(e=$i())===null||e===void 0?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pf{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sf(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},n=e||"demo-project",i=r.iat||0,s=r.sub||r.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${n}`,aud:n,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},r);return[bi(JSON.stringify(t)),bi(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function de(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Cf(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(de())}function Vf(){var r;const e=(r=$i())===null||r===void 0?void 0:r.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Df(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function kf(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function xf(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Nf(){const r=de();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function nl(){return!Vf()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function rl(){try{return typeof indexedDB=="object"}catch{return!1}}function Of(){return new Promise((r,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(n);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(n),r(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mf="FirebaseError";class st extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=Mf,Object.setPrototypeOf(this,st.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Sr.prototype.create)}}class Sr{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?Lf(s,n):"Error",u=`${this.serviceName}: ${a} (${i}).`;return new st(i,u,n)}}function Lf(r,e){return r.replace(Ff,(t,n)=>{const i=e[n];return i!=null?String(i):`<${n}?>`})}const Ff=/\{\$([^}]+)}/g;function Uf(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function Pi(r,e){if(r===e)return!0;const t=Object.keys(r),n=Object.keys(e);for(const i of t){if(!n.includes(i))return!1;const s=r[i],a=e[i];if(_u(s)&&_u(a)){if(!Pi(s,a))return!1}else if(s!==a)return!1}for(const i of n)if(!t.includes(i))return!1;return!0}function _u(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cr(r){const e=[];for(const[t,n]of Object.entries(r))Array.isArray(n)?n.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function Bf(r,e){const t=new jf(r,e);return t.subscribe.bind(t)}class jf{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let i;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");qf(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:n},i.next===void 0&&(i.next=Ms),i.error===void 0&&(i.error=Ms),i.complete===void 0&&(i.complete=Ms);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function qf(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function Ms(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xe(r){return r&&r._delegate?r._delegate:r}class Kt{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ot="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zf{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const n=new Pf;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&n.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Kf(e))try{this.getOrInitializeService({instanceIdentifier:Ot})}catch{}for(const[t,n]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const s=this.getOrInitializeService({instanceIdentifier:i});n.resolve(s)}catch{}}}}clearInstance(e=Ot){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Ot){return this.instances.has(e)}getOptions(e=Ot){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[s,a]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(s);n===u&&a.resolve(i)}return i}onInit(e,t){var n;const i=this.normalizeInstanceIdentifier(t),s=(n=this.onInitCallbacks.get(i))!==null&&n!==void 0?n:new Set;s.add(e),this.onInitCallbacks.set(i,s);const a=this.instances.get(i);return a&&e(a,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const i of n)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:Gf(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=Ot){return this.component?this.component.multipleInstances?e:Ot:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Gf(r){return r===Ot?void 0:r}function Kf(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $f{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new zf(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var H;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(H||(H={}));const Hf={debug:H.DEBUG,verbose:H.VERBOSE,info:H.INFO,warn:H.WARN,error:H.ERROR,silent:H.SILENT},Wf=H.INFO,Qf={[H.DEBUG]:"log",[H.VERBOSE]:"log",[H.INFO]:"info",[H.WARN]:"warn",[H.ERROR]:"error"},Jf=(r,e,...t)=>{if(e<r.logLevel)return;const n=new Date().toISOString(),i=Qf[e];if(i)console[i](`[${n}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class To{constructor(e){this.name=e,this._logLevel=Wf,this._logHandler=Jf,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in H))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Hf[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,H.DEBUG,...e),this._logHandler(this,H.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,H.VERBOSE,...e),this._logHandler(this,H.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,H.INFO,...e),this._logHandler(this,H.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,H.WARN,...e),this._logHandler(this,H.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,H.ERROR,...e),this._logHandler(this,H.ERROR,...e)}}const Yf=(r,e)=>e.some(t=>r instanceof t);let yu,Iu;function Xf(){return yu||(yu=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Zf(){return Iu||(Iu=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const il=new WeakMap,Hs=new WeakMap,sl=new WeakMap,Ls=new WeakMap,Eo=new WeakMap;function em(r){const e=new Promise((t,n)=>{const i=()=>{r.removeEventListener("success",s),r.removeEventListener("error",a)},s=()=>{t(It(r.result)),i()},a=()=>{n(r.error),i()};r.addEventListener("success",s),r.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&il.set(t,r)}).catch(()=>{}),Eo.set(e,r),e}function tm(r){if(Hs.has(r))return;const e=new Promise((t,n)=>{const i=()=>{r.removeEventListener("complete",s),r.removeEventListener("error",a),r.removeEventListener("abort",a)},s=()=>{t(),i()},a=()=>{n(r.error||new DOMException("AbortError","AbortError")),i()};r.addEventListener("complete",s),r.addEventListener("error",a),r.addEventListener("abort",a)});Hs.set(r,e)}let Ws={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return Hs.get(r);if(e==="objectStoreNames")return r.objectStoreNames||sl.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return It(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function nm(r){Ws=r(Ws)}function rm(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=r.call(Fs(this),e,...t);return sl.set(n,e.sort?e.sort():[e]),It(n)}:Zf().includes(r)?function(...e){return r.apply(Fs(this),e),It(il.get(this))}:function(...e){return It(r.apply(Fs(this),e))}}function im(r){return typeof r=="function"?rm(r):(r instanceof IDBTransaction&&tm(r),Yf(r,Xf())?new Proxy(r,Ws):r)}function It(r){if(r instanceof IDBRequest)return em(r);if(Ls.has(r))return Ls.get(r);const e=im(r);return e!==r&&(Ls.set(r,e),Eo.set(e,r)),e}const Fs=r=>Eo.get(r);function sm(r,e,{blocked:t,upgrade:n,blocking:i,terminated:s}={}){const a=indexedDB.open(r,e),u=It(a);return n&&a.addEventListener("upgradeneeded",c=>{n(It(a.result),c.oldVersion,c.newVersion,It(a.transaction),c)}),t&&a.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),u.then(c=>{s&&c.addEventListener("close",()=>s()),i&&c.addEventListener("versionchange",d=>i(d.oldVersion,d.newVersion,d))}).catch(()=>{}),u}const om=["get","getKey","getAll","getAllKeys","count"],am=["put","add","delete","clear"],Us=new Map;function vu(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(Us.get(e))return Us.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,i=am.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(i||om.includes(t)))return;const s=async function(a,...u){const c=this.transaction(a,i?"readwrite":"readonly");let d=c.store;return n&&(d=d.index(u.shift())),(await Promise.all([d[t](...u),i&&c.done]))[0]};return Us.set(e,s),s}nm(r=>({...r,get:(e,t,n)=>vu(e,t)||r.get(e,t,n),has:(e,t)=>!!vu(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class um{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(cm(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function cm(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Qs="@firebase/app",Tu="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tt=new To("@firebase/app"),lm="@firebase/app-compat",hm="@firebase/analytics-compat",dm="@firebase/analytics",fm="@firebase/app-check-compat",mm="@firebase/app-check",pm="@firebase/auth",gm="@firebase/auth-compat",_m="@firebase/database",ym="@firebase/data-connect",Im="@firebase/database-compat",vm="@firebase/functions",Tm="@firebase/functions-compat",Em="@firebase/installations",wm="@firebase/installations-compat",Am="@firebase/messaging",Rm="@firebase/messaging-compat",bm="@firebase/performance",Pm="@firebase/performance-compat",Sm="@firebase/remote-config",Cm="@firebase/remote-config-compat",Vm="@firebase/storage",Dm="@firebase/storage-compat",km="@firebase/firestore",xm="@firebase/vertexai-preview",Nm="@firebase/firestore-compat",Om="firebase",Mm="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Js="[DEFAULT]",Lm={[Qs]:"fire-core",[lm]:"fire-core-compat",[dm]:"fire-analytics",[hm]:"fire-analytics-compat",[mm]:"fire-app-check",[fm]:"fire-app-check-compat",[pm]:"fire-auth",[gm]:"fire-auth-compat",[_m]:"fire-rtdb",[ym]:"fire-data-connect",[Im]:"fire-rtdb-compat",[vm]:"fire-fn",[Tm]:"fire-fn-compat",[Em]:"fire-iid",[wm]:"fire-iid-compat",[Am]:"fire-fcm",[Rm]:"fire-fcm-compat",[bm]:"fire-perf",[Pm]:"fire-perf-compat",[Sm]:"fire-rc",[Cm]:"fire-rc-compat",[Vm]:"fire-gcs",[Dm]:"fire-gcs-compat",[km]:"fire-fst",[Nm]:"fire-fst-compat",[xm]:"fire-vertex","fire-js":"fire-js",[Om]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Si=new Map,Fm=new Map,Ys=new Map;function Eu(r,e){try{r.container.addComponent(e)}catch(t){tt.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function Tn(r){const e=r.name;if(Ys.has(e))return tt.debug(`There were multiple attempts to register component ${e}.`),!1;Ys.set(e,r);for(const t of Si.values())Eu(t,r);for(const t of Fm.values())Eu(t,r);return!0}function wo(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function Qe(r){return r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Um={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},vt=new Sr("app","Firebase",Um);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bm{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new Kt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw vt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xn=Mm;function jm(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const n=Object.assign({name:Js,automaticDataCollectionEnabled:!1},e),i=n.name;if(typeof i!="string"||!i)throw vt.create("bad-app-name",{appName:String(i)});if(t||(t=el()),!t)throw vt.create("no-options");const s=Si.get(i);if(s){if(Pi(t,s.options)&&Pi(n,s.config))return s;throw vt.create("duplicate-app",{appName:i})}const a=new $f(i);for(const c of Ys.values())a.addComponent(c);const u=new Bm(t,n,a);return Si.set(i,u),u}function ol(r=Js){const e=Si.get(r);if(!e&&r===Js&&el())return jm();if(!e)throw vt.create("no-app",{appName:r});return e}function Tt(r,e,t){var n;let i=(n=Lm[r])!==null&&n!==void 0?n:r;t&&(i+=`-${t}`);const s=i.match(/\s|\//),a=e.match(/\s|\//);if(s||a){const u=[`Unable to register library "${i}" with version "${e}":`];s&&u.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&a&&u.push("and"),a&&u.push(`version name "${e}" contains illegal characters (whitespace or "/")`),tt.warn(u.join(" "));return}Tn(new Kt(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qm="firebase-heartbeat-database",zm=1,yr="firebase-heartbeat-store";let Bs=null;function al(){return Bs||(Bs=sm(qm,zm,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(yr)}catch(t){console.warn(t)}}}}).catch(r=>{throw vt.create("idb-open",{originalErrorMessage:r.message})})),Bs}async function Gm(r){try{const t=(await al()).transaction(yr),n=await t.objectStore(yr).get(ul(r));return await t.done,n}catch(e){if(e instanceof st)tt.warn(e.message);else{const t=vt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});tt.warn(t.message)}}}async function wu(r,e){try{const n=(await al()).transaction(yr,"readwrite");await n.objectStore(yr).put(e,ul(r)),await n.done}catch(t){if(t instanceof st)tt.warn(t.message);else{const n=vt.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});tt.warn(n.message)}}}function ul(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Km=1024,$m=30*24*60*60*1e3;class Hm{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Qm(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Au();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const u=new Date(a.date).valueOf();return Date.now()-u<=$m}),this._storage.overwrite(this._heartbeatsCache))}catch(n){tt.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Au(),{heartbeatsToSend:n,unsentEntries:i}=Wm(this._heartbeatsCache.heartbeats),s=bi(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return tt.warn(t),""}}}function Au(){return new Date().toISOString().substring(0,10)}function Wm(r,e=Km){const t=[];let n=r.slice();for(const i of r){const s=t.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),Ru(t)>e){s.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),Ru(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class Qm{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return rl()?Of().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Gm(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return wu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return wu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Ru(r){return bi(JSON.stringify({version:2,heartbeats:r})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jm(r){Tn(new Kt("platform-logger",e=>new um(e),"PRIVATE")),Tn(new Kt("heartbeat",e=>new Hm(e),"PRIVATE")),Tt(Qs,Tu,r),Tt(Qs,Tu,"esm2017"),Tt("fire-js","")}Jm("");var Ym="firebase",Xm="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Tt(Ym,Xm,"app");function Ao(r,e){var t={};for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&e.indexOf(n)<0&&(t[n]=r[n]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,n=Object.getOwnPropertySymbols(r);i<n.length;i++)e.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(r,n[i])&&(t[n[i]]=r[n[i]]);return t}function cl(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Zm=cl,ll=new Sr("auth","Firebase",cl());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ci=new To("@firebase/auth");function ep(r,...e){Ci.logLevel<=H.WARN&&Ci.warn(`Auth (${xn}): ${r}`,...e)}function di(r,...e){Ci.logLevel<=H.ERROR&&Ci.error(`Auth (${xn}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ge(r,...e){throw bo(r,...e)}function Be(r,...e){return bo(r,...e)}function Ro(r,e,t){const n=Object.assign(Object.assign({},Zm()),{[e]:t});return new Sr("auth","Firebase",n).create(e,{appName:r.name})}function qt(r){return Ro(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function tp(r,e,t){const n=t;if(!(e instanceof n))throw n.name!==e.constructor.name&&Ge(r,"argument-error"),Ro(r,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function bo(r,...e){if(typeof r!="string"){const t=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=r.name),r._errorFactory.create(t,...n)}return ll.create(r,...e)}function B(r,e,...t){if(!r)throw bo(e,...t)}function Je(r){const e="INTERNAL ASSERTION FAILED: "+r;throw di(e),new Error(e)}function nt(r,e){r||Je(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xs(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.href)||""}function np(){return bu()==="http:"||bu()==="https:"}function bu(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rp(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(np()||kf()||"connection"in navigator)?navigator.onLine:!0}function ip(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vr{constructor(e,t){this.shortDelay=e,this.longDelay=t,nt(t>e,"Short delay should be less than long delay!"),this.isMobile=Cf()||xf()}get(){return rp()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Po(r,e){nt(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hl{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Je("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Je("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Je("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sp={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const op=new Vr(3e4,6e4);function So(r,e){return r.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:r.tenantId}):e}async function Nn(r,e,t,n,i={}){return dl(r,i,async()=>{let s={},a={};n&&(e==="GET"?a=n:s={body:JSON.stringify(n)});const u=Cr(Object.assign({key:r.config.apiKey},a)).slice(1),c=await r._getAdditionalHeaders();c["Content-Type"]="application/json",r.languageCode&&(c["X-Firebase-Locale"]=r.languageCode);const d=Object.assign({method:e,headers:c},s);return Df()||(d.referrerPolicy="no-referrer"),hl.fetch()(fl(r,r.config.apiHost,t,u),d)})}async function dl(r,e,t){r._canInitEmulator=!1;const n=Object.assign(Object.assign({},sp),e);try{const i=new up(r),s=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw ii(r,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const u=s.ok?a.errorMessage:a.error.message,[c,d]=u.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw ii(r,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw ii(r,"email-already-in-use",a);if(c==="USER_DISABLED")throw ii(r,"user-disabled",a);const m=n[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw Ro(r,m,d);Ge(r,m)}}catch(i){if(i instanceof st)throw i;Ge(r,"network-request-failed",{message:String(i)})}}async function ap(r,e,t,n,i={}){const s=await Nn(r,e,t,n,i);return"mfaPendingCredential"in s&&Ge(r,"multi-factor-auth-required",{_serverResponse:s}),s}function fl(r,e,t,n){const i=`${e}${t}?${n}`;return r.config.emulator?Po(r.config,i):`${r.config.apiScheme}://${i}`}class up{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,n)=>{this.timer=setTimeout(()=>n(Be(this.auth,"network-request-failed")),op.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function ii(r,e,t){const n={appName:r.name};t.email&&(n.email=t.email),t.phoneNumber&&(n.phoneNumber=t.phoneNumber);const i=Be(r,e,n);return i.customData._tokenResponse=t,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cp(r,e){return Nn(r,"POST","/v1/accounts:delete",e)}async function ml(r,e){return Nn(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dr(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function lp(r,e=!1){const t=xe(r),n=await t.getIdToken(e),i=Co(n);B(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:n,authTime:dr(js(i.auth_time)),issuedAtTime:dr(js(i.iat)),expirationTime:dr(js(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function js(r){return Number(r)*1e3}function Co(r){const[e,t,n]=r.split(".");if(e===void 0||t===void 0||n===void 0)return di("JWT malformed, contained fewer than 3 sections"),null;try{const i=Xc(t);return i?JSON.parse(i):(di("Failed to decode base64 JWT payload"),null)}catch(i){return di("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Pu(r){const e=Co(r);return B(e,"internal-error"),B(typeof e.exp<"u","internal-error"),B(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ir(r,e,t=!1){if(t)return e;try{return await e}catch(n){throw n instanceof st&&hp(n)&&r.auth.currentUser===r&&await r.auth.signOut(),n}}function hp({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dp{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const i=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zs{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=dr(this.lastLoginAt),this.creationTime=dr(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vi(r){var e;const t=r.auth,n=await r.getIdToken(),i=await Ir(r,ml(t,{idToken:n}));B(i==null?void 0:i.users.length,t,"internal-error");const s=i.users[0];r._notifyReloadListener(s);const a=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?pl(s.providerUserInfo):[],u=mp(r.providerData,a),c=r.isAnonymous,d=!(r.email&&s.passwordHash)&&!(u!=null&&u.length),m=c?d:!1,p={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:u,metadata:new Zs(s.createdAt,s.lastLoginAt),isAnonymous:m};Object.assign(r,p)}async function fp(r){const e=xe(r);await Vi(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function mp(r,e){return[...r.filter(n=>!e.some(i=>i.providerId===n.providerId)),...e]}function pl(r){return r.map(e=>{var{providerId:t}=e,n=Ao(e,["providerId"]);return{providerId:t,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pp(r,e){const t=await dl(r,{},async()=>{const n=Cr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=r.config,a=fl(r,i,"/v1/token",`key=${s}`),u=await r._getAdditionalHeaders();return u["Content-Type"]="application/x-www-form-urlencoded",hl.fetch()(a,{method:"POST",headers:u,body:n})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function gp(r,e){return Nn(r,"POST","/v2/accounts:revokeToken",So(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _n{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){B(e.idToken,"internal-error"),B(typeof e.idToken<"u","internal-error"),B(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Pu(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){B(e.length!==0,"internal-error");const t=Pu(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(B(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:i,expiresIn:s}=await pp(e,t);this.updateTokensAndExpiration(n,i,Number(s))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,t){const{refreshToken:n,accessToken:i,expirationTime:s}=t,a=new _n;return n&&(B(typeof n=="string","internal-error",{appName:e}),a.refreshToken=n),i&&(B(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(B(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new _n,this.toJSON())}_performRefresh(){return Je("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lt(r,e){B(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class Ye{constructor(e){var{uid:t,auth:n,stsTokenManager:i}=e,s=Ao(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new dp(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=n,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Zs(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await Ir(this,this.stsTokenManager.getToken(this.auth,e));return B(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return lp(this,e)}reload(){return fp(this)}_assign(e){this!==e&&(B(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Ye(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){B(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await Vi(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Qe(this.auth.app))return Promise.reject(qt(this.auth));const e=await this.getIdToken();return await Ir(this,cp(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var n,i,s,a,u,c,d,m;const p=(n=t.displayName)!==null&&n!==void 0?n:void 0,E=(i=t.email)!==null&&i!==void 0?i:void 0,P=(s=t.phoneNumber)!==null&&s!==void 0?s:void 0,V=(a=t.photoURL)!==null&&a!==void 0?a:void 0,x=(u=t.tenantId)!==null&&u!==void 0?u:void 0,D=(c=t._redirectEventId)!==null&&c!==void 0?c:void 0,G=(d=t.createdAt)!==null&&d!==void 0?d:void 0,j=(m=t.lastLoginAt)!==null&&m!==void 0?m:void 0,{uid:F,emailVerified:Q,isAnonymous:X,providerData:$,stsTokenManager:I}=t;B(F&&I,e,"internal-error");const g=_n.fromJSON(this.name,I);B(typeof F=="string",e,"internal-error"),lt(p,e.name),lt(E,e.name),B(typeof Q=="boolean",e,"internal-error"),B(typeof X=="boolean",e,"internal-error"),lt(P,e.name),lt(V,e.name),lt(x,e.name),lt(D,e.name),lt(G,e.name),lt(j,e.name);const y=new Ye({uid:F,auth:e,email:E,emailVerified:Q,displayName:p,isAnonymous:X,photoURL:V,phoneNumber:P,tenantId:x,stsTokenManager:g,createdAt:G,lastLoginAt:j});return $&&Array.isArray($)&&(y.providerData=$.map(v=>Object.assign({},v))),D&&(y._redirectEventId=D),y}static async _fromIdTokenResponse(e,t,n=!1){const i=new _n;i.updateFromServerResponse(t);const s=new Ye({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:n});return await Vi(s),s}static async _fromGetAccountInfoResponse(e,t,n){const i=t.users[0];B(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?pl(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),u=new _n;u.updateFromIdToken(n);const c=new Ye({uid:i.localId,auth:e,stsTokenManager:u,isAnonymous:a}),d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Zs(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(c,d),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Su=new Map;function Xe(r){nt(r instanceof Function,"Expected a class definition");let e=Su.get(r);return e?(nt(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,Su.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gl{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}gl.type="NONE";const Cu=gl;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fi(r,e,t){return`firebase:${r}:${e}:${t}`}class yn{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:i,name:s}=this.auth;this.fullUserKey=fi(this.userKey,i.apiKey,s),this.fullPersistenceKey=fi("persistence",i.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Ye._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new yn(Xe(Cu),e,n);const i=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let s=i[0]||Xe(Cu);const a=fi(n,e.config.apiKey,e.name);let u=null;for(const d of t)try{const m=await d._get(a);if(m){const p=Ye._fromJSON(e,m);d!==s&&(u=p),s=d;break}}catch{}const c=i.filter(d=>d._shouldAllowMigration);return!s._shouldAllowMigration||!c.length?new yn(s,e,n):(s=c[0],u&&await s._set(a,u.toJSON()),await Promise.all(t.map(async d=>{if(d!==s)try{await d._remove(a)}catch{}})),new yn(s,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vu(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(vl(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(_l(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(El(e))return"Blackberry";if(wl(e))return"Webos";if(yl(e))return"Safari";if((e.includes("chrome/")||Il(e))&&!e.includes("edge/"))return"Chrome";if(Tl(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=r.match(t);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function _l(r=de()){return/firefox\//i.test(r)}function yl(r=de()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Il(r=de()){return/crios\//i.test(r)}function vl(r=de()){return/iemobile/i.test(r)}function Tl(r=de()){return/android/i.test(r)}function El(r=de()){return/blackberry/i.test(r)}function wl(r=de()){return/webos/i.test(r)}function Vo(r=de()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function _p(r=de()){var e;return Vo(r)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function yp(){return Nf()&&document.documentMode===10}function Al(r=de()){return Vo(r)||Tl(r)||wl(r)||El(r)||/windows phone/i.test(r)||vl(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rl(r,e=[]){let t;switch(r){case"Browser":t=Vu(de());break;case"Worker":t=`${Vu(de())}-${r}`;break;default:t=r}const n=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${xn}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ip{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=s=>new Promise((a,u)=>{try{const c=e(s);a(c)}catch(c){u(c)}});n.onAbort=t,this.queue.push(n);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vp(r,e={}){return Nn(r,"GET","/v2/passwordPolicy",So(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tp=6;class Ep{constructor(e){var t,n,i,s;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=a.minPasswordLength)!==null&&t!==void 0?t:Tp,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(n=e.allowedNonAlphanumericCharacters)===null||n===void 0?void 0:n.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,n,i,s,a,u;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(t=c.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),c.isValid&&(c.isValid=(n=c.meetsMaxPasswordLength)!==null&&n!==void 0?n:!0),c.isValid&&(c.isValid=(i=c.containsLowercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(s=c.containsUppercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(a=c.containsNumericCharacter)!==null&&a!==void 0?a:!0),c.isValid&&(c.isValid=(u=c.containsNonAlphanumericCharacter)!==null&&u!==void 0?u:!0),c}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let n;for(let i=0;i<e.length;i++)n=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wp{constructor(e,t,n,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Du(this),this.idTokenSubscription=new Du(this),this.beforeStateQueue=new Ip(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=ll,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Xe(t)),this._initializationPromise=this.queue(async()=>{var n,i;if(!this._deleted&&(this.persistenceManager=await yn.create(this,e),!this._deleted)){if(!((n=this._popupRedirectResolver)===null||n===void 0)&&n._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await ml(this,{idToken:e}),n=await Ye._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Qe(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(u=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(u,u))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let i=n,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,u=i==null?void 0:i._redirectEventId,c=await this.tryRedirectSignIn(e);(!a||a===u)&&(c!=null&&c.user)&&(i=c.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(a){i=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return B(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Vi(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=ip()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Qe(this.app))return Promise.reject(qt(this));const t=e?xe(e):null;return t&&B(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&B(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Qe(this.app)?Promise.reject(qt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Qe(this.app)?Promise.reject(qt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Xe(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await vp(this),t=new Ep(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Sr("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(n.tenantId=this.tenantId),await gp(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Xe(e)||this._popupRedirectResolver;B(t,this,"argument-error"),this.redirectPersistenceManager=await yn.create(this,[Xe(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,i){if(this._deleted)return()=>{};const s=typeof t=="function"?t:t.next.bind(t);let a=!1;const u=this._isInitialized?Promise.resolve():this._initializationPromise;if(B(u,this,"internal-error"),u.then(()=>{a||s(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,n,i);return()=>{a=!0,c()}}else{const c=e.addObserver(t);return()=>{a=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return B(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Rl(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());n&&(t["X-Firebase-Client"]=n);const i=await this._getAppCheckToken();return i&&(t["X-Firebase-AppCheck"]=i),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&ep(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function Hi(r){return xe(r)}class Du{constructor(e){this.auth=e,this.observer=null,this.addObserver=Bf(t=>this.observer=t)}get next(){return B(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Do={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Ap(r){Do=r}function Rp(r){return Do.loadJS(r)}function bp(){return Do.gapiScript}function Pp(r){return`__${r}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sp(r,e){const t=wo(r,"auth");if(t.isInitialized()){const i=t.getImmediate(),s=t.getOptions();if(Pi(s,e??{}))return i;Ge(i,"already-initialized")}return t.initialize({options:e})}function Cp(r,e){const t=(e==null?void 0:e.persistence)||[],n=(Array.isArray(t)?t:[t]).map(Xe);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(n,e==null?void 0:e.popupRedirectResolver)}function Vp(r,e,t){const n=Hi(r);B(n._canInitEmulator,n,"emulator-config-failed"),B(/^https?:\/\//.test(e),n,"invalid-emulator-scheme");const i=!1,s=bl(e),{host:a,port:u}=Dp(e),c=u===null?"":`:${u}`;n.config.emulator={url:`${s}//${a}${c}/`},n.settings.appVerificationDisabledForTesting=!0,n.emulatorConfig=Object.freeze({host:a,port:u,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),kp()}function bl(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function Dp(r){const e=bl(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const n=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(n);if(i){const s=i[1];return{host:s,port:ku(n.substr(s.length+1))}}else{const[s,a]=n.split(":");return{host:s,port:ku(a)}}}function ku(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function kp(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pl{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Je("not implemented")}_getIdTokenResponse(e){return Je("not implemented")}_linkToIdToken(e,t){return Je("not implemented")}_getReauthenticationResolver(e){return Je("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function In(r,e){return ap(r,"POST","/v1/accounts:signInWithIdp",So(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xp="http://localhost";class rt extends Pl{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new rt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Ge("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:i}=t,s=Ao(t,["providerId","signInMethod"]);if(!n||!i)return null;const a=new rt(n,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return In(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,In(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,In(e,t)}buildRequest(){const e={requestUri:xp,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Cr(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ko{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class On extends ko{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}class mi extends On{static credentialFromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;return B("providerId"in t&&"signInMethod"in t,"argument-error"),rt._fromParams(t)}credential(e){return this._credential(Object.assign(Object.assign({},e),{nonce:e.rawNonce}))}_credential(e){return B(e.idToken||e.accessToken,"argument-error"),rt._fromParams(Object.assign(Object.assign({},e),{providerId:this.providerId,signInMethod:this.providerId}))}static credentialFromResult(e){return mi.oauthCredentialFromTaggedObject(e)}static credentialFromError(e){return mi.oauthCredentialFromTaggedObject(e.customData||{})}static oauthCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n,oauthTokenSecret:i,pendingToken:s,nonce:a,providerId:u}=e;if(!n&&!i&&!t&&!s||!u)return null;try{return new mi(u)._credential({idToken:t,accessToken:n,nonce:a,pendingToken:s})}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft extends On{constructor(){super("facebook.com")}static credential(e){return rt._fromParams({providerId:ft.PROVIDER_ID,signInMethod:ft.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ft.credentialFromTaggedObject(e)}static credentialFromError(e){return ft.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ft.credential(e.oauthAccessToken)}catch{return null}}}ft.FACEBOOK_SIGN_IN_METHOD="facebook.com";ft.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt extends On{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return rt._fromParams({providerId:mt.PROVIDER_ID,signInMethod:mt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return mt.credentialFromTaggedObject(e)}static credentialFromError(e){return mt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return mt.credential(t,n)}catch{return null}}}mt.GOOGLE_SIGN_IN_METHOD="google.com";mt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt extends On{constructor(){super("github.com")}static credential(e){return rt._fromParams({providerId:pt.PROVIDER_ID,signInMethod:pt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return pt.credentialFromTaggedObject(e)}static credentialFromError(e){return pt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return pt.credential(e.oauthAccessToken)}catch{return null}}}pt.GITHUB_SIGN_IN_METHOD="github.com";pt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt extends On{constructor(){super("twitter.com")}static credential(e,t){return rt._fromParams({providerId:gt.PROVIDER_ID,signInMethod:gt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return gt.credentialFromTaggedObject(e)}static credentialFromError(e){return gt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return gt.credential(t,n)}catch{return null}}}gt.TWITTER_SIGN_IN_METHOD="twitter.com";gt.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class En{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,i=!1){const s=await Ye._fromIdTokenResponse(e,n,i),a=xu(n);return new En({user:s,providerId:a,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const i=xu(n);return new En({user:e,providerId:i,_tokenResponse:n,operationType:t})}}function xu(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Di extends st{constructor(e,t,n,i){var s;super(t.code,t.message),this.operationType=n,this.user=i,Object.setPrototypeOf(this,Di.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,i){return new Di(e,t,n,i)}}function Sl(r,e,t,n){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Di._fromErrorAndOperation(r,s,e,n):s})}async function Np(r,e,t=!1){const n=await Ir(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return En._forOperation(r,"link",n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Op(r,e,t=!1){const{auth:n}=r;if(Qe(n.app))return Promise.reject(qt(n));const i="reauthenticate";try{const s=await Ir(r,Sl(n,i,e,r),t);B(s.idToken,n,"internal-error");const a=Co(s.idToken);B(a,n,"internal-error");const{sub:u}=a;return B(r.uid===u,n,"user-mismatch"),En._forOperation(r,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&Ge(n,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mp(r,e,t=!1){if(Qe(r.app))return Promise.reject(qt(r));const n="signIn",i=await Sl(r,n,e),s=await En._fromIdTokenResponse(r,n,i);return t||await r._updateCurrentUser(s.user),s}function Lp(r,e,t,n){return xe(r).onIdTokenChanged(e,t,n)}function Fp(r,e,t){return xe(r).beforeAuthStateChanged(e,t)}function Tv(r,e,t,n){return xe(r).onAuthStateChanged(e,t,n)}function Ev(r){return xe(r).signOut()}const ki="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cl{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(ki,"1"),this.storage.removeItem(ki),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Up=1e3,Bp=10;class Vl extends Cl{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Al(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),i=this.localCache[t];n!==i&&e(t,i,n)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,u,c)=>{this.notifyListeners(a,c)});return}const n=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(n);!t&&this.localCache[n]===a||this.notifyListeners(n,a)},s=this.storage.getItem(n);yp()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Bp):i()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const i of Array.from(n))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},Up)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Vl.type="LOCAL";const jp=Vl;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dl extends Cl{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Dl.type="SESSION";const kl=Dl;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qp(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const n=new Wi(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:i,data:s}=t.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:i});const u=Array.from(a).map(async d=>d(t.origin,s)),c=await qp(u);t.ports[0].postMessage({status:"done",eventId:n,eventType:i,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Wi.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xo(r="",e=10){let t="";for(let n=0;n<e;n++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zp{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((u,c)=>{const d=xo("",20);i.port1.start();const m=setTimeout(()=>{c(new Error("unsupported_event"))},n);a={messageChannel:i,onMessage(p){const E=p;if(E.data.eventId===d)switch(E.data.status){case"ack":clearTimeout(m),s=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),u(E.data.response);break;default:clearTimeout(m),clearTimeout(s),c(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ze(){return window}function Gp(r){ze().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xl(){return typeof ze().WorkerGlobalScope<"u"&&typeof ze().importScripts=="function"}async function Kp(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function $p(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)===null||r===void 0?void 0:r.controller)||null}function Hp(){return xl()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nl="firebaseLocalStorageDb",Wp=1,xi="firebaseLocalStorage",Ol="fbase_key";class Dr{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Qi(r,e){return r.transaction([xi],e?"readwrite":"readonly").objectStore(xi)}function Qp(){const r=indexedDB.deleteDatabase(Nl);return new Dr(r).toPromise()}function eo(){const r=indexedDB.open(Nl,Wp);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const n=r.result;try{n.createObjectStore(xi,{keyPath:Ol})}catch(i){t(i)}}),r.addEventListener("success",async()=>{const n=r.result;n.objectStoreNames.contains(xi)?e(n):(n.close(),await Qp(),e(await eo()))})})}async function Nu(r,e,t){const n=Qi(r,!0).put({[Ol]:e,value:t});return new Dr(n).toPromise()}async function Jp(r,e){const t=Qi(r,!1).get(e),n=await new Dr(t).toPromise();return n===void 0?null:n.value}function Ou(r,e){const t=Qi(r,!0).delete(e);return new Dr(t).toPromise()}const Yp=800,Xp=3;class Ml{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await eo(),this.db)}async _withRetries(e){let t=0;for(;;)try{const n=await this._openDb();return await e(n)}catch(n){if(t++>Xp)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return xl()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Wi._getInstance(Hp()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await Kp(),!this.activeServiceWorker)return;this.sender=new zp(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&!((e=n[0])===null||e===void 0)&&e.fulfilled&&!((t=n[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||$p()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await eo();return await Nu(e,ki,"1"),await Ou(e,ki),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>Nu(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(n=>Jp(n,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Ou(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=Qi(i,!1).getAll();return new Dr(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],n=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)n.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!n.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const i of Array.from(n))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Yp)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Ml.type="LOCAL";const Zp=Ml;new Vr(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ll(r,e){return e?Xe(e):(B(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class No extends Pl{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return In(e,this._buildIdpRequest())}_linkToIdToken(e,t){return In(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return In(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function eg(r){return Mp(r.auth,new No(r),r.bypassAuthState)}function tg(r){const{auth:e,user:t}=r;return B(t,e,"internal-error"),Op(t,new No(r),r.bypassAuthState)}async function ng(r){const{auth:e,user:t}=r;return B(t,e,"internal-error"),Np(t,new No(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fl{constructor(e,t,n,i,s=!1){this.auth=e,this.resolver=n,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:i,tenantId:s,error:a,type:u}=e;if(a){this.reject(a);return}const c={auth:this.auth,requestUri:t,sessionId:n,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(u)(c))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return eg;case"linkViaPopup":case"linkViaRedirect":return ng;case"reauthViaPopup":case"reauthViaRedirect":return tg;default:Ge(this.auth,"internal-error")}}resolve(e){nt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){nt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rg=new Vr(2e3,1e4);async function wv(r,e,t){if(Qe(r.app))return Promise.reject(Be(r,"operation-not-supported-in-this-environment"));const n=Hi(r);tp(r,e,ko);const i=Ll(n,t);return new jt(n,"signInViaPopup",e,i).executeNotNull()}class jt extends Fl{constructor(e,t,n,i,s){super(e,t,i,s),this.provider=n,this.authWindow=null,this.pollId=null,jt.currentPopupAction&&jt.currentPopupAction.cancel(),jt.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return B(e,this.auth,"internal-error"),e}async onExecution(){nt(this.filter.length===1,"Popup operations only handle one event");const e=xo();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Be(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Be(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,jt.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;if(!((n=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||n===void 0)&&n.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Be(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,rg.get())};e()}}jt.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ig="pendingRedirect",pi=new Map;class sg extends Fl{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=pi.get(this.auth._key());if(!e){try{const n=await og(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(n)}catch(t){e=()=>Promise.reject(t)}pi.set(this.auth._key(),e)}return this.bypassAuthState||pi.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function og(r,e){const t=cg(e),n=ug(r);if(!await n._isAvailable())return!1;const i=await n._get(t)==="true";return await n._remove(t),i}function ag(r,e){pi.set(r._key(),e)}function ug(r){return Xe(r._redirectPersistence)}function cg(r){return fi(ig,r.config.apiKey,r.name)}async function lg(r,e,t=!1){if(Qe(r.app))return Promise.reject(qt(r));const n=Hi(r),i=Ll(n,e),a=await new sg(n,i,t).execute();return a&&!t&&(delete a.user._redirectEventId,await n._persistUserIfCurrent(a.user),await n._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hg=10*60*1e3;class dg{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!fg(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!Ul(e)){const i=((n=e.error.code)===null||n===void 0?void 0:n.split("auth/")[1])||"internal-error";t.onError(Be(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=hg&&this.cachedEventUids.clear(),this.cachedEventUids.has(Mu(e))}saveEventToCache(e){this.cachedEventUids.add(Mu(e)),this.lastProcessedEventTime=Date.now()}}function Mu(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function Ul({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function fg(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Ul(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mg(r,e={}){return Nn(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pg=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,gg=/^https?/;async function _g(r){if(r.config.emulator)return;const{authorizedDomains:e}=await mg(r);for(const t of e)try{if(yg(t))return}catch{}Ge(r,"unauthorized-domain")}function yg(r){const e=Xs(),{protocol:t,hostname:n}=new URL(e);if(r.startsWith("chrome-extension://")){const a=new URL(r);return a.hostname===""&&n===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===n}if(!gg.test(t))return!1;if(pg.test(r))return n===r;const i=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ig=new Vr(3e4,6e4);function Lu(){const r=ze().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function vg(r){return new Promise((e,t)=>{var n,i,s;function a(){Lu(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Lu(),t(Be(r,"network-request-failed"))},timeout:Ig.get()})}if(!((i=(n=ze().gapi)===null||n===void 0?void 0:n.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=ze().gapi)===null||s===void 0)&&s.load)a();else{const u=Pp("iframefcb");return ze()[u]=()=>{gapi.load?a():t(Be(r,"network-request-failed"))},Rp(`${bp()}?onload=${u}`).catch(c=>t(c))}}).catch(e=>{throw gi=null,e})}let gi=null;function Tg(r){return gi=gi||vg(r),gi}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Eg=new Vr(5e3,15e3),wg="__/auth/iframe",Ag="emulator/auth/iframe",Rg={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},bg=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Pg(r){const e=r.config;B(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?Po(e,Ag):`https://${r.config.authDomain}/${wg}`,n={apiKey:e.apiKey,appName:r.name,v:xn},i=bg.get(r.config.apiHost);i&&(n.eid=i);const s=r._getFrameworks();return s.length&&(n.fw=s.join(",")),`${t}?${Cr(n).slice(1)}`}async function Sg(r){const e=await Tg(r),t=ze().gapi;return B(t,r,"internal-error"),e.open({where:document.body,url:Pg(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Rg,dontclear:!0},n=>new Promise(async(i,s)=>{await n.restyle({setHideOnLeave:!1});const a=Be(r,"network-request-failed"),u=ze().setTimeout(()=>{s(a)},Eg.get());function c(){ze().clearTimeout(u),i(n)}n.ping(c).then(c,()=>{s(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cg={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Vg=500,Dg=600,kg="_blank",xg="http://localhost";class Fu{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Ng(r,e,t,n=Vg,i=Dg){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-n)/2,0).toString();let u="";const c=Object.assign(Object.assign({},Cg),{width:n.toString(),height:i.toString(),top:s,left:a}),d=de().toLowerCase();t&&(u=Il(d)?kg:t),_l(d)&&(e=e||xg,c.scrollbars="yes");const m=Object.entries(c).reduce((E,[P,V])=>`${E}${P}=${V},`,"");if(_p(d)&&u!=="_self")return Og(e||"",u),new Fu(null);const p=window.open(e||"",u,m);B(p,r,"popup-blocked");try{p.focus()}catch{}return new Fu(p)}function Og(r,e){const t=document.createElement("a");t.href=r,t.target=e;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mg="__/auth/handler",Lg="emulator/auth/handler",Fg=encodeURIComponent("fac");async function Uu(r,e,t,n,i,s){B(r.config.authDomain,r,"auth-domain-config-required"),B(r.config.apiKey,r,"invalid-api-key");const a={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:n,v:xn,eventId:i};if(e instanceof ko){e.setDefaultLanguage(r.languageCode),a.providerId=e.providerId||"",Uf(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[m,p]of Object.entries({}))a[m]=p}if(e instanceof On){const m=e.getScopes().filter(p=>p!=="");m.length>0&&(a.scopes=m.join(","))}r.tenantId&&(a.tid=r.tenantId);const u=a;for(const m of Object.keys(u))u[m]===void 0&&delete u[m];const c=await r._getAppCheckToken(),d=c?`#${Fg}=${encodeURIComponent(c)}`:"";return`${Ug(r)}?${Cr(u).slice(1)}${d}`}function Ug({config:r}){return r.emulator?Po(r,Lg):`https://${r.authDomain}/${Mg}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qs="webStorageSupport";class Bg{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=kl,this._completeRedirectFn=lg,this._overrideRedirectResult=ag}async _openPopup(e,t,n,i){var s;nt((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const a=await Uu(e,t,n,Xs(),i);return Ng(e,a,xo())}async _openRedirect(e,t,n,i){await this._originValidation(e);const s=await Uu(e,t,n,Xs(),i);return Gp(s),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:s}=this.eventManagers[t];return i?Promise.resolve(i):(nt(s,"If manager is not set, promise should be"),s)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await Sg(e),n=new dg(e);return t.register("authEvent",i=>(B(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:n.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(qs,{type:qs},i=>{var s;const a=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[qs];a!==void 0&&t(!!a),Ge(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=_g(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Al()||yl()||Vo()}}const jg=Bg;var Bu="@firebase/auth",ju="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qg{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(n=>{e((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){B(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zg(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Gg(r){Tn(new Kt("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:u}=n.options;B(a&&!a.includes(":"),"invalid-api-key",{appName:n.name});const c={apiKey:a,authDomain:u,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Rl(r)},d=new wp(n,i,s,c);return Cp(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),Tn(new Kt("auth-internal",e=>{const t=Hi(e.getProvider("auth").getImmediate());return(n=>new qg(n))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Tt(Bu,ju,zg(r)),Tt(Bu,ju,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kg=5*60,$g=tl("authIdTokenMaxAge")||Kg;let qu=null;const Hg=r=>async e=>{const t=e&&await e.getIdTokenResult(),n=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>$g)return;const i=t==null?void 0:t.token;qu!==i&&(qu=i,await fetch(r,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Av(r=ol()){const e=wo(r,"auth");if(e.isInitialized())return e.getImmediate();const t=Sp(r,{popupRedirectResolver:jg,persistence:[Zp,jp,kl]}),n=tl("authTokenSyncURL");if(n&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(n,location.origin);if(location.origin===s.origin){const a=Hg(s.toString());Fp(t,a,()=>a(t.currentUser)),Lp(t,u=>a(u))}}const i=Zc("auth");return i&&Vp(t,`http://${i}`),t}function Wg(){var r,e;return(e=(r=document.getElementsByTagName("head"))===null||r===void 0?void 0:r[0])!==null&&e!==void 0?e:document}Ap({loadJS(r){return new Promise((e,t)=>{const n=document.createElement("script");n.setAttribute("src",r),n.onload=e,n.onerror=i=>{const s=Be("internal-error");s.customData=i,t(s)},n.type="text/javascript",n.charset="UTF-8",Wg().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Gg("Browser");var zu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var zt,Bl;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,g){function y(){}y.prototype=g.prototype,I.D=g.prototype,I.prototype=new y,I.prototype.constructor=I,I.C=function(v,T,R){for(var _=Array(arguments.length-2),$e=2;$e<arguments.length;$e++)_[$e-2]=arguments[$e];return g.prototype[T].apply(v,_)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(n,t),n.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(I,g,y){y||(y=0);var v=Array(16);if(typeof g=="string")for(var T=0;16>T;++T)v[T]=g.charCodeAt(y++)|g.charCodeAt(y++)<<8|g.charCodeAt(y++)<<16|g.charCodeAt(y++)<<24;else for(T=0;16>T;++T)v[T]=g[y++]|g[y++]<<8|g[y++]<<16|g[y++]<<24;g=I.g[0],y=I.g[1],T=I.g[2];var R=I.g[3],_=g+(R^y&(T^R))+v[0]+3614090360&4294967295;g=y+(_<<7&4294967295|_>>>25),_=R+(T^g&(y^T))+v[1]+3905402710&4294967295,R=g+(_<<12&4294967295|_>>>20),_=T+(y^R&(g^y))+v[2]+606105819&4294967295,T=R+(_<<17&4294967295|_>>>15),_=y+(g^T&(R^g))+v[3]+3250441966&4294967295,y=T+(_<<22&4294967295|_>>>10),_=g+(R^y&(T^R))+v[4]+4118548399&4294967295,g=y+(_<<7&4294967295|_>>>25),_=R+(T^g&(y^T))+v[5]+1200080426&4294967295,R=g+(_<<12&4294967295|_>>>20),_=T+(y^R&(g^y))+v[6]+2821735955&4294967295,T=R+(_<<17&4294967295|_>>>15),_=y+(g^T&(R^g))+v[7]+4249261313&4294967295,y=T+(_<<22&4294967295|_>>>10),_=g+(R^y&(T^R))+v[8]+1770035416&4294967295,g=y+(_<<7&4294967295|_>>>25),_=R+(T^g&(y^T))+v[9]+2336552879&4294967295,R=g+(_<<12&4294967295|_>>>20),_=T+(y^R&(g^y))+v[10]+4294925233&4294967295,T=R+(_<<17&4294967295|_>>>15),_=y+(g^T&(R^g))+v[11]+2304563134&4294967295,y=T+(_<<22&4294967295|_>>>10),_=g+(R^y&(T^R))+v[12]+1804603682&4294967295,g=y+(_<<7&4294967295|_>>>25),_=R+(T^g&(y^T))+v[13]+4254626195&4294967295,R=g+(_<<12&4294967295|_>>>20),_=T+(y^R&(g^y))+v[14]+2792965006&4294967295,T=R+(_<<17&4294967295|_>>>15),_=y+(g^T&(R^g))+v[15]+1236535329&4294967295,y=T+(_<<22&4294967295|_>>>10),_=g+(T^R&(y^T))+v[1]+4129170786&4294967295,g=y+(_<<5&4294967295|_>>>27),_=R+(y^T&(g^y))+v[6]+3225465664&4294967295,R=g+(_<<9&4294967295|_>>>23),_=T+(g^y&(R^g))+v[11]+643717713&4294967295,T=R+(_<<14&4294967295|_>>>18),_=y+(R^g&(T^R))+v[0]+3921069994&4294967295,y=T+(_<<20&4294967295|_>>>12),_=g+(T^R&(y^T))+v[5]+3593408605&4294967295,g=y+(_<<5&4294967295|_>>>27),_=R+(y^T&(g^y))+v[10]+38016083&4294967295,R=g+(_<<9&4294967295|_>>>23),_=T+(g^y&(R^g))+v[15]+3634488961&4294967295,T=R+(_<<14&4294967295|_>>>18),_=y+(R^g&(T^R))+v[4]+3889429448&4294967295,y=T+(_<<20&4294967295|_>>>12),_=g+(T^R&(y^T))+v[9]+568446438&4294967295,g=y+(_<<5&4294967295|_>>>27),_=R+(y^T&(g^y))+v[14]+3275163606&4294967295,R=g+(_<<9&4294967295|_>>>23),_=T+(g^y&(R^g))+v[3]+4107603335&4294967295,T=R+(_<<14&4294967295|_>>>18),_=y+(R^g&(T^R))+v[8]+1163531501&4294967295,y=T+(_<<20&4294967295|_>>>12),_=g+(T^R&(y^T))+v[13]+2850285829&4294967295,g=y+(_<<5&4294967295|_>>>27),_=R+(y^T&(g^y))+v[2]+4243563512&4294967295,R=g+(_<<9&4294967295|_>>>23),_=T+(g^y&(R^g))+v[7]+1735328473&4294967295,T=R+(_<<14&4294967295|_>>>18),_=y+(R^g&(T^R))+v[12]+2368359562&4294967295,y=T+(_<<20&4294967295|_>>>12),_=g+(y^T^R)+v[5]+4294588738&4294967295,g=y+(_<<4&4294967295|_>>>28),_=R+(g^y^T)+v[8]+2272392833&4294967295,R=g+(_<<11&4294967295|_>>>21),_=T+(R^g^y)+v[11]+1839030562&4294967295,T=R+(_<<16&4294967295|_>>>16),_=y+(T^R^g)+v[14]+4259657740&4294967295,y=T+(_<<23&4294967295|_>>>9),_=g+(y^T^R)+v[1]+2763975236&4294967295,g=y+(_<<4&4294967295|_>>>28),_=R+(g^y^T)+v[4]+1272893353&4294967295,R=g+(_<<11&4294967295|_>>>21),_=T+(R^g^y)+v[7]+4139469664&4294967295,T=R+(_<<16&4294967295|_>>>16),_=y+(T^R^g)+v[10]+3200236656&4294967295,y=T+(_<<23&4294967295|_>>>9),_=g+(y^T^R)+v[13]+681279174&4294967295,g=y+(_<<4&4294967295|_>>>28),_=R+(g^y^T)+v[0]+3936430074&4294967295,R=g+(_<<11&4294967295|_>>>21),_=T+(R^g^y)+v[3]+3572445317&4294967295,T=R+(_<<16&4294967295|_>>>16),_=y+(T^R^g)+v[6]+76029189&4294967295,y=T+(_<<23&4294967295|_>>>9),_=g+(y^T^R)+v[9]+3654602809&4294967295,g=y+(_<<4&4294967295|_>>>28),_=R+(g^y^T)+v[12]+3873151461&4294967295,R=g+(_<<11&4294967295|_>>>21),_=T+(R^g^y)+v[15]+530742520&4294967295,T=R+(_<<16&4294967295|_>>>16),_=y+(T^R^g)+v[2]+3299628645&4294967295,y=T+(_<<23&4294967295|_>>>9),_=g+(T^(y|~R))+v[0]+4096336452&4294967295,g=y+(_<<6&4294967295|_>>>26),_=R+(y^(g|~T))+v[7]+1126891415&4294967295,R=g+(_<<10&4294967295|_>>>22),_=T+(g^(R|~y))+v[14]+2878612391&4294967295,T=R+(_<<15&4294967295|_>>>17),_=y+(R^(T|~g))+v[5]+4237533241&4294967295,y=T+(_<<21&4294967295|_>>>11),_=g+(T^(y|~R))+v[12]+1700485571&4294967295,g=y+(_<<6&4294967295|_>>>26),_=R+(y^(g|~T))+v[3]+2399980690&4294967295,R=g+(_<<10&4294967295|_>>>22),_=T+(g^(R|~y))+v[10]+4293915773&4294967295,T=R+(_<<15&4294967295|_>>>17),_=y+(R^(T|~g))+v[1]+2240044497&4294967295,y=T+(_<<21&4294967295|_>>>11),_=g+(T^(y|~R))+v[8]+1873313359&4294967295,g=y+(_<<6&4294967295|_>>>26),_=R+(y^(g|~T))+v[15]+4264355552&4294967295,R=g+(_<<10&4294967295|_>>>22),_=T+(g^(R|~y))+v[6]+2734768916&4294967295,T=R+(_<<15&4294967295|_>>>17),_=y+(R^(T|~g))+v[13]+1309151649&4294967295,y=T+(_<<21&4294967295|_>>>11),_=g+(T^(y|~R))+v[4]+4149444226&4294967295,g=y+(_<<6&4294967295|_>>>26),_=R+(y^(g|~T))+v[11]+3174756917&4294967295,R=g+(_<<10&4294967295|_>>>22),_=T+(g^(R|~y))+v[2]+718787259&4294967295,T=R+(_<<15&4294967295|_>>>17),_=y+(R^(T|~g))+v[9]+3951481745&4294967295,I.g[0]=I.g[0]+g&4294967295,I.g[1]=I.g[1]+(T+(_<<21&4294967295|_>>>11))&4294967295,I.g[2]=I.g[2]+T&4294967295,I.g[3]=I.g[3]+R&4294967295}n.prototype.u=function(I,g){g===void 0&&(g=I.length);for(var y=g-this.blockSize,v=this.B,T=this.h,R=0;R<g;){if(T==0)for(;R<=y;)i(this,I,R),R+=this.blockSize;if(typeof I=="string"){for(;R<g;)if(v[T++]=I.charCodeAt(R++),T==this.blockSize){i(this,v),T=0;break}}else for(;R<g;)if(v[T++]=I[R++],T==this.blockSize){i(this,v),T=0;break}}this.h=T,this.o+=g},n.prototype.v=function(){var I=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);I[0]=128;for(var g=1;g<I.length-8;++g)I[g]=0;var y=8*this.o;for(g=I.length-8;g<I.length;++g)I[g]=y&255,y/=256;for(this.u(I),I=Array(16),g=y=0;4>g;++g)for(var v=0;32>v;v+=8)I[y++]=this.g[g]>>>v&255;return I};function s(I,g){var y=u;return Object.prototype.hasOwnProperty.call(y,I)?y[I]:y[I]=g(I)}function a(I,g){this.h=g;for(var y=[],v=!0,T=I.length-1;0<=T;T--){var R=I[T]|0;v&&R==g||(y[T]=R,v=!1)}this.g=y}var u={};function c(I){return-128<=I&&128>I?s(I,function(g){return new a([g|0],0>g?-1:0)}):new a([I|0],0>I?-1:0)}function d(I){if(isNaN(I)||!isFinite(I))return p;if(0>I)return D(d(-I));for(var g=[],y=1,v=0;I>=y;v++)g[v]=I/y|0,y*=4294967296;return new a(g,0)}function m(I,g){if(I.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(I.charAt(0)=="-")return D(m(I.substring(1),g));if(0<=I.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=d(Math.pow(g,8)),v=p,T=0;T<I.length;T+=8){var R=Math.min(8,I.length-T),_=parseInt(I.substring(T,T+R),g);8>R?(R=d(Math.pow(g,R)),v=v.j(R).add(d(_))):(v=v.j(y),v=v.add(d(_)))}return v}var p=c(0),E=c(1),P=c(16777216);r=a.prototype,r.m=function(){if(x(this))return-D(this).m();for(var I=0,g=1,y=0;y<this.g.length;y++){var v=this.i(y);I+=(0<=v?v:4294967296+v)*g,g*=4294967296}return I},r.toString=function(I){if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(V(this))return"0";if(x(this))return"-"+D(this).toString(I);for(var g=d(Math.pow(I,6)),y=this,v="";;){var T=Q(y,g).g;y=G(y,T.j(g));var R=((0<y.g.length?y.g[0]:y.h)>>>0).toString(I);if(y=T,V(y))return R+v;for(;6>R.length;)R="0"+R;v=R+v}},r.i=function(I){return 0>I?0:I<this.g.length?this.g[I]:this.h};function V(I){if(I.h!=0)return!1;for(var g=0;g<I.g.length;g++)if(I.g[g]!=0)return!1;return!0}function x(I){return I.h==-1}r.l=function(I){return I=G(this,I),x(I)?-1:V(I)?0:1};function D(I){for(var g=I.g.length,y=[],v=0;v<g;v++)y[v]=~I.g[v];return new a(y,~I.h).add(E)}r.abs=function(){return x(this)?D(this):this},r.add=function(I){for(var g=Math.max(this.g.length,I.g.length),y=[],v=0,T=0;T<=g;T++){var R=v+(this.i(T)&65535)+(I.i(T)&65535),_=(R>>>16)+(this.i(T)>>>16)+(I.i(T)>>>16);v=_>>>16,R&=65535,_&=65535,y[T]=_<<16|R}return new a(y,y[y.length-1]&-2147483648?-1:0)};function G(I,g){return I.add(D(g))}r.j=function(I){if(V(this)||V(I))return p;if(x(this))return x(I)?D(this).j(D(I)):D(D(this).j(I));if(x(I))return D(this.j(D(I)));if(0>this.l(P)&&0>I.l(P))return d(this.m()*I.m());for(var g=this.g.length+I.g.length,y=[],v=0;v<2*g;v++)y[v]=0;for(v=0;v<this.g.length;v++)for(var T=0;T<I.g.length;T++){var R=this.i(v)>>>16,_=this.i(v)&65535,$e=I.i(T)>>>16,Bn=I.i(T)&65535;y[2*v+2*T]+=_*Bn,j(y,2*v+2*T),y[2*v+2*T+1]+=R*Bn,j(y,2*v+2*T+1),y[2*v+2*T+1]+=_*$e,j(y,2*v+2*T+1),y[2*v+2*T+2]+=R*$e,j(y,2*v+2*T+2)}for(v=0;v<g;v++)y[v]=y[2*v+1]<<16|y[2*v];for(v=g;v<2*g;v++)y[v]=0;return new a(y,0)};function j(I,g){for(;(I[g]&65535)!=I[g];)I[g+1]+=I[g]>>>16,I[g]&=65535,g++}function F(I,g){this.g=I,this.h=g}function Q(I,g){if(V(g))throw Error("division by zero");if(V(I))return new F(p,p);if(x(I))return g=Q(D(I),g),new F(D(g.g),D(g.h));if(x(g))return g=Q(I,D(g)),new F(D(g.g),g.h);if(30<I.g.length){if(x(I)||x(g))throw Error("slowDivide_ only works with positive integers.");for(var y=E,v=g;0>=v.l(I);)y=X(y),v=X(v);var T=$(y,1),R=$(v,1);for(v=$(v,2),y=$(y,2);!V(v);){var _=R.add(v);0>=_.l(I)&&(T=T.add(y),R=_),v=$(v,1),y=$(y,1)}return g=G(I,T.j(g)),new F(T,g)}for(T=p;0<=I.l(g);){for(y=Math.max(1,Math.floor(I.m()/g.m())),v=Math.ceil(Math.log(y)/Math.LN2),v=48>=v?1:Math.pow(2,v-48),R=d(y),_=R.j(g);x(_)||0<_.l(I);)y-=v,R=d(y),_=R.j(g);V(R)&&(R=E),T=T.add(R),I=G(I,_)}return new F(T,I)}r.A=function(I){return Q(this,I).h},r.and=function(I){for(var g=Math.max(this.g.length,I.g.length),y=[],v=0;v<g;v++)y[v]=this.i(v)&I.i(v);return new a(y,this.h&I.h)},r.or=function(I){for(var g=Math.max(this.g.length,I.g.length),y=[],v=0;v<g;v++)y[v]=this.i(v)|I.i(v);return new a(y,this.h|I.h)},r.xor=function(I){for(var g=Math.max(this.g.length,I.g.length),y=[],v=0;v<g;v++)y[v]=this.i(v)^I.i(v);return new a(y,this.h^I.h)};function X(I){for(var g=I.g.length+1,y=[],v=0;v<g;v++)y[v]=I.i(v)<<1|I.i(v-1)>>>31;return new a(y,I.h)}function $(I,g){var y=g>>5;g%=32;for(var v=I.g.length-y,T=[],R=0;R<v;R++)T[R]=0<g?I.i(R+y)>>>g|I.i(R+y+1)<<32-g:I.i(R+y);return new a(T,I.h)}n.prototype.digest=n.prototype.v,n.prototype.reset=n.prototype.s,n.prototype.update=n.prototype.u,Bl=n,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=m,zt=a}).apply(typeof zu<"u"?zu:typeof self<"u"?self:typeof window<"u"?window:{});var si=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var jl,ur,ql,_i,to,zl,Gl,Kl;(function(){var r,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,l,h){return o==Array.prototype||o==Object.prototype||(o[l]=h.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof si=="object"&&si];for(var l=0;l<o.length;++l){var h=o[l];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var n=t(this);function i(o,l){if(l)e:{var h=n;o=o.split(".");for(var f=0;f<o.length-1;f++){var w=o[f];if(!(w in h))break e;h=h[w]}o=o[o.length-1],f=h[o],l=l(f),l!=f&&l!=null&&e(h,o,{configurable:!0,writable:!0,value:l})}}function s(o,l){o instanceof String&&(o+="");var h=0,f=!1,w={next:function(){if(!f&&h<o.length){var b=h++;return{value:l(b,o[b]),done:!1}}return f=!0,{done:!0,value:void 0}}};return w[Symbol.iterator]=function(){return w},w}i("Array.prototype.values",function(o){return o||function(){return s(this,function(l,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},u=this||self;function c(o){var l=typeof o;return l=l!="object"?l:o?Array.isArray(o)?"array":l:"null",l=="array"||l=="object"&&typeof o.length=="number"}function d(o){var l=typeof o;return l=="object"&&o!=null||l=="function"}function m(o,l,h){return o.call.apply(o.bind,arguments)}function p(o,l,h){if(!o)throw Error();if(2<arguments.length){var f=Array.prototype.slice.call(arguments,2);return function(){var w=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(w,f),o.apply(l,w)}}return function(){return o.apply(l,arguments)}}function E(o,l,h){return E=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?m:p,E.apply(null,arguments)}function P(o,l){var h=Array.prototype.slice.call(arguments,1);return function(){var f=h.slice();return f.push.apply(f,arguments),o.apply(this,f)}}function V(o,l){function h(){}h.prototype=l.prototype,o.aa=l.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(f,w,b){for(var k=Array(arguments.length-2),ne=2;ne<arguments.length;ne++)k[ne-2]=arguments[ne];return l.prototype[w].apply(f,k)}}function x(o){const l=o.length;if(0<l){const h=Array(l);for(let f=0;f<l;f++)h[f]=o[f];return h}return[]}function D(o,l){for(let h=1;h<arguments.length;h++){const f=arguments[h];if(c(f)){const w=o.length||0,b=f.length||0;o.length=w+b;for(let k=0;k<b;k++)o[w+k]=f[k]}else o.push(f)}}class G{constructor(l,h){this.i=l,this.j=h,this.h=0,this.g=null}get(){let l;return 0<this.h?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function j(o){return/^[\s\xa0]*$/.test(o)}function F(){var o=u.navigator;return o&&(o=o.userAgent)?o:""}function Q(o){return Q[" "](o),o}Q[" "]=function(){};var X=F().indexOf("Gecko")!=-1&&!(F().toLowerCase().indexOf("webkit")!=-1&&F().indexOf("Edge")==-1)&&!(F().indexOf("Trident")!=-1||F().indexOf("MSIE")!=-1)&&F().indexOf("Edge")==-1;function $(o,l,h){for(const f in o)l.call(h,o[f],f,o)}function I(o,l){for(const h in o)l.call(void 0,o[h],h,o)}function g(o){const l={};for(const h in o)l[h]=o[h];return l}const y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function v(o,l){let h,f;for(let w=1;w<arguments.length;w++){f=arguments[w];for(h in f)o[h]=f[h];for(let b=0;b<y.length;b++)h=y[b],Object.prototype.hasOwnProperty.call(f,h)&&(o[h]=f[h])}}function T(o){var l=1;o=o.split(":");const h=[];for(;0<l&&o.length;)h.push(o.shift()),l--;return o.length&&h.push(o.join(":")),h}function R(o){u.setTimeout(()=>{throw o},0)}function _(){var o=ds;let l=null;return o.g&&(l=o.g,o.g=o.g.next,o.g||(o.h=null),l.next=null),l}class $e{constructor(){this.h=this.g=null}add(l,h){const f=Bn.get();f.set(l,h),this.h?this.h.next=f:this.g=f,this.h=f}}var Bn=new G(()=>new Ld,o=>o.reset());class Ld{constructor(){this.next=this.g=this.h=null}set(l,h){this.h=l,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let jn,qn=!1,ds=new $e,ga=()=>{const o=u.Promise.resolve(void 0);jn=()=>{o.then(Fd)}};var Fd=()=>{for(var o;o=_();){try{o.h.call(o.g)}catch(h){R(h)}var l=Bn;l.j(o),100>l.h&&(l.h++,o.next=l.g,l.g=o)}qn=!1};function ot(){this.s=this.s,this.C=this.C}ot.prototype.s=!1,ot.prototype.ma=function(){this.s||(this.s=!0,this.N())},ot.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function ye(o,l){this.type=o,this.g=this.target=l,this.defaultPrevented=!1}ye.prototype.h=function(){this.defaultPrevented=!0};var Ud=function(){if(!u.addEventListener||!Object.defineProperty)return!1;var o=!1,l=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};u.addEventListener("test",h,l),u.removeEventListener("test",h,l)}catch{}return o}();function zn(o,l){if(ye.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,f=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=l,l=o.relatedTarget){if(X){e:{try{Q(l.nodeName);var w=!0;break e}catch{}w=!1}w||(l=null)}}else h=="mouseover"?l=o.fromElement:h=="mouseout"&&(l=o.toElement);this.relatedTarget=l,f?(this.clientX=f.clientX!==void 0?f.clientX:f.pageX,this.clientY=f.clientY!==void 0?f.clientY:f.pageY,this.screenX=f.screenX||0,this.screenY=f.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:Bd[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&zn.aa.h.call(this)}}V(zn,ye);var Bd={2:"touch",3:"pen",4:"mouse"};zn.prototype.h=function(){zn.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var Ur="closure_listenable_"+(1e6*Math.random()|0),jd=0;function qd(o,l,h,f,w){this.listener=o,this.proxy=null,this.src=l,this.type=h,this.capture=!!f,this.ha=w,this.key=++jd,this.da=this.fa=!1}function Br(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function jr(o){this.src=o,this.g={},this.h=0}jr.prototype.add=function(o,l,h,f,w){var b=o.toString();o=this.g[b],o||(o=this.g[b]=[],this.h++);var k=ms(o,l,f,w);return-1<k?(l=o[k],h||(l.fa=!1)):(l=new qd(l,this.src,b,!!f,w),l.fa=h,o.push(l)),l};function fs(o,l){var h=l.type;if(h in o.g){var f=o.g[h],w=Array.prototype.indexOf.call(f,l,void 0),b;(b=0<=w)&&Array.prototype.splice.call(f,w,1),b&&(Br(l),o.g[h].length==0&&(delete o.g[h],o.h--))}}function ms(o,l,h,f){for(var w=0;w<o.length;++w){var b=o[w];if(!b.da&&b.listener==l&&b.capture==!!h&&b.ha==f)return w}return-1}var ps="closure_lm_"+(1e6*Math.random()|0),gs={};function _a(o,l,h,f,w){if(Array.isArray(l)){for(var b=0;b<l.length;b++)_a(o,l[b],h,f,w);return null}return h=va(h),o&&o[Ur]?o.K(l,h,d(f)?!!f.capture:!1,w):zd(o,l,h,!1,f,w)}function zd(o,l,h,f,w,b){if(!l)throw Error("Invalid event type");var k=d(w)?!!w.capture:!!w,ne=ys(o);if(ne||(o[ps]=ne=new jr(o)),h=ne.add(l,h,f,k,b),h.proxy)return h;if(f=Gd(),h.proxy=f,f.src=o,f.listener=h,o.addEventListener)Ud||(w=k),w===void 0&&(w=!1),o.addEventListener(l.toString(),f,w);else if(o.attachEvent)o.attachEvent(Ia(l.toString()),f);else if(o.addListener&&o.removeListener)o.addListener(f);else throw Error("addEventListener and attachEvent are unavailable.");return h}function Gd(){function o(h){return l.call(o.src,o.listener,h)}const l=Kd;return o}function ya(o,l,h,f,w){if(Array.isArray(l))for(var b=0;b<l.length;b++)ya(o,l[b],h,f,w);else f=d(f)?!!f.capture:!!f,h=va(h),o&&o[Ur]?(o=o.i,l=String(l).toString(),l in o.g&&(b=o.g[l],h=ms(b,h,f,w),-1<h&&(Br(b[h]),Array.prototype.splice.call(b,h,1),b.length==0&&(delete o.g[l],o.h--)))):o&&(o=ys(o))&&(l=o.g[l.toString()],o=-1,l&&(o=ms(l,h,f,w)),(h=-1<o?l[o]:null)&&_s(h))}function _s(o){if(typeof o!="number"&&o&&!o.da){var l=o.src;if(l&&l[Ur])fs(l.i,o);else{var h=o.type,f=o.proxy;l.removeEventListener?l.removeEventListener(h,f,o.capture):l.detachEvent?l.detachEvent(Ia(h),f):l.addListener&&l.removeListener&&l.removeListener(f),(h=ys(l))?(fs(h,o),h.h==0&&(h.src=null,l[ps]=null)):Br(o)}}}function Ia(o){return o in gs?gs[o]:gs[o]="on"+o}function Kd(o,l){if(o.da)o=!0;else{l=new zn(l,this);var h=o.listener,f=o.ha||o.src;o.fa&&_s(o),o=h.call(f,l)}return o}function ys(o){return o=o[ps],o instanceof jr?o:null}var Is="__closure_events_fn_"+(1e9*Math.random()>>>0);function va(o){return typeof o=="function"?o:(o[Is]||(o[Is]=function(l){return o.handleEvent(l)}),o[Is])}function Ie(){ot.call(this),this.i=new jr(this),this.M=this,this.F=null}V(Ie,ot),Ie.prototype[Ur]=!0,Ie.prototype.removeEventListener=function(o,l,h,f){ya(this,o,l,h,f)};function we(o,l){var h,f=o.F;if(f)for(h=[];f;f=f.F)h.push(f);if(o=o.M,f=l.type||l,typeof l=="string")l=new ye(l,o);else if(l instanceof ye)l.target=l.target||o;else{var w=l;l=new ye(f,o),v(l,w)}if(w=!0,h)for(var b=h.length-1;0<=b;b--){var k=l.g=h[b];w=qr(k,f,!0,l)&&w}if(k=l.g=o,w=qr(k,f,!0,l)&&w,w=qr(k,f,!1,l)&&w,h)for(b=0;b<h.length;b++)k=l.g=h[b],w=qr(k,f,!1,l)&&w}Ie.prototype.N=function(){if(Ie.aa.N.call(this),this.i){var o=this.i,l;for(l in o.g){for(var h=o.g[l],f=0;f<h.length;f++)Br(h[f]);delete o.g[l],o.h--}}this.F=null},Ie.prototype.K=function(o,l,h,f){return this.i.add(String(o),l,!1,h,f)},Ie.prototype.L=function(o,l,h,f){return this.i.add(String(o),l,!0,h,f)};function qr(o,l,h,f){if(l=o.i.g[String(l)],!l)return!0;l=l.concat();for(var w=!0,b=0;b<l.length;++b){var k=l[b];if(k&&!k.da&&k.capture==h){var ne=k.listener,pe=k.ha||k.src;k.fa&&fs(o.i,k),w=ne.call(pe,f)!==!1&&w}}return w&&!f.defaultPrevented}function Ta(o,l,h){if(typeof o=="function")h&&(o=E(o,h));else if(o&&typeof o.handleEvent=="function")o=E(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(l)?-1:u.setTimeout(o,l||0)}function Ea(o){o.g=Ta(()=>{o.g=null,o.i&&(o.i=!1,Ea(o))},o.l);const l=o.h;o.h=null,o.m.apply(null,l)}class $d extends ot{constructor(l,h){super(),this.m=l,this.l=h,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:Ea(this)}N(){super.N(),this.g&&(u.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Gn(o){ot.call(this),this.h=o,this.g={}}V(Gn,ot);var wa=[];function Aa(o){$(o.g,function(l,h){this.g.hasOwnProperty(h)&&_s(l)},o),o.g={}}Gn.prototype.N=function(){Gn.aa.N.call(this),Aa(this)},Gn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var vs=u.JSON.stringify,Hd=u.JSON.parse,Wd=class{stringify(o){return u.JSON.stringify(o,void 0)}parse(o){return u.JSON.parse(o,void 0)}};function Ts(){}Ts.prototype.h=null;function Ra(o){return o.h||(o.h=o.i())}function ba(){}var Kn={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Es(){ye.call(this,"d")}V(Es,ye);function ws(){ye.call(this,"c")}V(ws,ye);var Vt={},Pa=null;function zr(){return Pa=Pa||new Ie}Vt.La="serverreachability";function Sa(o){ye.call(this,Vt.La,o)}V(Sa,ye);function $n(o){const l=zr();we(l,new Sa(l))}Vt.STAT_EVENT="statevent";function Ca(o,l){ye.call(this,Vt.STAT_EVENT,o),this.stat=l}V(Ca,ye);function Ae(o){const l=zr();we(l,new Ca(l,o))}Vt.Ma="timingevent";function Va(o,l){ye.call(this,Vt.Ma,o),this.size=l}V(Va,ye);function Hn(o,l){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return u.setTimeout(function(){o()},l)}function Wn(){this.g=!0}Wn.prototype.xa=function(){this.g=!1};function Qd(o,l,h,f,w,b){o.info(function(){if(o.g)if(b)for(var k="",ne=b.split("&"),pe=0;pe<ne.length;pe++){var Y=ne[pe].split("=");if(1<Y.length){var ve=Y[0];Y=Y[1];var Te=ve.split("_");k=2<=Te.length&&Te[1]=="type"?k+(ve+"="+Y+"&"):k+(ve+"=redacted&")}}else k=null;else k=b;return"XMLHTTP REQ ("+f+") [attempt "+w+"]: "+l+`
`+h+`
`+k})}function Jd(o,l,h,f,w,b,k){o.info(function(){return"XMLHTTP RESP ("+f+") [ attempt "+w+"]: "+l+`
`+h+`
`+b+" "+k})}function rn(o,l,h,f){o.info(function(){return"XMLHTTP TEXT ("+l+"): "+Xd(o,h)+(f?" "+f:"")})}function Yd(o,l){o.info(function(){return"TIMEOUT: "+l})}Wn.prototype.info=function(){};function Xd(o,l){if(!o.g)return l;if(!l)return null;try{var h=JSON.parse(l);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var f=h[o];if(!(2>f.length)){var w=f[1];if(Array.isArray(w)&&!(1>w.length)){var b=w[0];if(b!="noop"&&b!="stop"&&b!="close")for(var k=1;k<w.length;k++)w[k]=""}}}}return vs(h)}catch{return l}}var Gr={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Da={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},As;function Kr(){}V(Kr,Ts),Kr.prototype.g=function(){return new XMLHttpRequest},Kr.prototype.i=function(){return{}},As=new Kr;function at(o,l,h,f){this.j=o,this.i=l,this.l=h,this.R=f||1,this.U=new Gn(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new ka}function ka(){this.i=null,this.g="",this.h=!1}var xa={},Rs={};function bs(o,l,h){o.L=1,o.v=Qr(He(l)),o.m=h,o.P=!0,Na(o,null)}function Na(o,l){o.F=Date.now(),$r(o),o.A=He(o.v);var h=o.A,f=o.R;Array.isArray(f)||(f=[String(f)]),Wa(h.i,"t",f),o.C=0,h=o.j.J,o.h=new ka,o.g=du(o.j,h?l:null,!o.m),0<o.O&&(o.M=new $d(E(o.Y,o,o.g),o.O)),l=o.U,h=o.g,f=o.ca;var w="readystatechange";Array.isArray(w)||(w&&(wa[0]=w.toString()),w=wa);for(var b=0;b<w.length;b++){var k=_a(h,w[b],f||l.handleEvent,!1,l.h||l);if(!k)break;l.g[k.key]=k}l=o.H?g(o.H):{},o.m?(o.u||(o.u="POST"),l["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,l)):(o.u="GET",o.g.ea(o.A,o.u,null,l)),$n(),Qd(o.i,o.u,o.A,o.l,o.R,o.m)}at.prototype.ca=function(o){o=o.target;const l=this.M;l&&We(o)==3?l.j():this.Y(o)},at.prototype.Y=function(o){try{if(o==this.g)e:{const Te=We(this.g);var l=this.g.Ba();const an=this.g.Z();if(!(3>Te)&&(Te!=3||this.g&&(this.h.h||this.g.oa()||tu(this.g)))){this.J||Te!=4||l==7||(l==8||0>=an?$n(3):$n(2)),Ps(this);var h=this.g.Z();this.X=h;t:if(Oa(this)){var f=tu(this.g);o="";var w=f.length,b=We(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Dt(this),Qn(this);var k="";break t}this.h.i=new u.TextDecoder}for(l=0;l<w;l++)this.h.h=!0,o+=this.h.i.decode(f[l],{stream:!(b&&l==w-1)});f.length=0,this.h.g+=o,this.C=0,k=this.h.g}else k=this.g.oa();if(this.o=h==200,Jd(this.i,this.u,this.A,this.l,this.R,Te,h),this.o){if(this.T&&!this.K){t:{if(this.g){var ne,pe=this.g;if((ne=pe.g?pe.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!j(ne)){var Y=ne;break t}}Y=null}if(h=Y)rn(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Ss(this,h);else{this.o=!1,this.s=3,Ae(12),Dt(this),Qn(this);break e}}if(this.P){h=!0;let Ue;for(;!this.J&&this.C<k.length;)if(Ue=Zd(this,k),Ue==Rs){Te==4&&(this.s=4,Ae(14),h=!1),rn(this.i,this.l,null,"[Incomplete Response]");break}else if(Ue==xa){this.s=4,Ae(15),rn(this.i,this.l,k,"[Invalid Chunk]"),h=!1;break}else rn(this.i,this.l,Ue,null),Ss(this,Ue);if(Oa(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Te!=4||k.length!=0||this.h.h||(this.s=1,Ae(16),h=!1),this.o=this.o&&h,!h)rn(this.i,this.l,k,"[Invalid Chunked Response]"),Dt(this),Qn(this);else if(0<k.length&&!this.W){this.W=!0;var ve=this.j;ve.g==this&&ve.ba&&!ve.M&&(ve.j.info("Great, no buffering proxy detected. Bytes received: "+k.length),Ns(ve),ve.M=!0,Ae(11))}}else rn(this.i,this.l,k,null),Ss(this,k);Te==4&&Dt(this),this.o&&!this.J&&(Te==4?uu(this.j,this):(this.o=!1,$r(this)))}else _f(this.g),h==400&&0<k.indexOf("Unknown SID")?(this.s=3,Ae(12)):(this.s=0,Ae(13)),Dt(this),Qn(this)}}}catch{}finally{}};function Oa(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function Zd(o,l){var h=o.C,f=l.indexOf(`
`,h);return f==-1?Rs:(h=Number(l.substring(h,f)),isNaN(h)?xa:(f+=1,f+h>l.length?Rs:(l=l.slice(f,f+h),o.C=f+h,l)))}at.prototype.cancel=function(){this.J=!0,Dt(this)};function $r(o){o.S=Date.now()+o.I,Ma(o,o.I)}function Ma(o,l){if(o.B!=null)throw Error("WatchDog timer not null");o.B=Hn(E(o.ba,o),l)}function Ps(o){o.B&&(u.clearTimeout(o.B),o.B=null)}at.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(Yd(this.i,this.A),this.L!=2&&($n(),Ae(17)),Dt(this),this.s=2,Qn(this)):Ma(this,this.S-o)};function Qn(o){o.j.G==0||o.J||uu(o.j,o)}function Dt(o){Ps(o);var l=o.M;l&&typeof l.ma=="function"&&l.ma(),o.M=null,Aa(o.U),o.g&&(l=o.g,o.g=null,l.abort(),l.ma())}function Ss(o,l){try{var h=o.j;if(h.G!=0&&(h.g==o||Cs(h.h,o))){if(!o.K&&Cs(h.h,o)&&h.G==3){try{var f=h.Da.g.parse(l)}catch{f=null}if(Array.isArray(f)&&f.length==3){var w=f;if(w[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)ti(h),Zr(h);else break e;xs(h),Ae(18)}}else h.za=w[1],0<h.za-h.T&&37500>w[2]&&h.F&&h.v==0&&!h.C&&(h.C=Hn(E(h.Za,h),6e3));if(1>=Ua(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else xt(h,11)}else if((o.K||h.g==o)&&ti(h),!j(l))for(w=h.Da.g.parse(l),l=0;l<w.length;l++){let Y=w[l];if(h.T=Y[0],Y=Y[1],h.G==2)if(Y[0]=="c"){h.K=Y[1],h.ia=Y[2];const ve=Y[3];ve!=null&&(h.la=ve,h.j.info("VER="+h.la));const Te=Y[4];Te!=null&&(h.Aa=Te,h.j.info("SVER="+h.Aa));const an=Y[5];an!=null&&typeof an=="number"&&0<an&&(f=1.5*an,h.L=f,h.j.info("backChannelRequestTimeoutMs_="+f)),f=h;const Ue=o.g;if(Ue){const ri=Ue.g?Ue.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(ri){var b=f.h;b.g||ri.indexOf("spdy")==-1&&ri.indexOf("quic")==-1&&ri.indexOf("h2")==-1||(b.j=b.l,b.g=new Set,b.h&&(Vs(b,b.h),b.h=null))}if(f.D){const Os=Ue.g?Ue.g.getResponseHeader("X-HTTP-Session-Id"):null;Os&&(f.ya=Os,re(f.I,f.D,Os))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),f=h;var k=o;if(f.qa=hu(f,f.J?f.ia:null,f.W),k.K){Ba(f.h,k);var ne=k,pe=f.L;pe&&(ne.I=pe),ne.B&&(Ps(ne),$r(ne)),f.g=k}else ou(f);0<h.i.length&&ei(h)}else Y[0]!="stop"&&Y[0]!="close"||xt(h,7);else h.G==3&&(Y[0]=="stop"||Y[0]=="close"?Y[0]=="stop"?xt(h,7):ks(h):Y[0]!="noop"&&h.l&&h.l.ta(Y),h.v=0)}}$n(4)}catch{}}var ef=class{constructor(o,l){this.g=o,this.map=l}};function La(o){this.l=o||10,u.PerformanceNavigationTiming?(o=u.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(u.chrome&&u.chrome.loadTimes&&u.chrome.loadTimes()&&u.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Fa(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function Ua(o){return o.h?1:o.g?o.g.size:0}function Cs(o,l){return o.h?o.h==l:o.g?o.g.has(l):!1}function Vs(o,l){o.g?o.g.add(l):o.h=l}function Ba(o,l){o.h&&o.h==l?o.h=null:o.g&&o.g.has(l)&&o.g.delete(l)}La.prototype.cancel=function(){if(this.i=ja(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function ja(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let l=o.i;for(const h of o.g.values())l=l.concat(h.D);return l}return x(o.i)}function tf(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(c(o)){for(var l=[],h=o.length,f=0;f<h;f++)l.push(o[f]);return l}l=[],h=0;for(f in o)l[h++]=o[f];return l}function nf(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(c(o)||typeof o=="string"){var l=[];o=o.length;for(var h=0;h<o;h++)l.push(h);return l}l=[],h=0;for(const f in o)l[h++]=f;return l}}}function qa(o,l){if(o.forEach&&typeof o.forEach=="function")o.forEach(l,void 0);else if(c(o)||typeof o=="string")Array.prototype.forEach.call(o,l,void 0);else for(var h=nf(o),f=tf(o),w=f.length,b=0;b<w;b++)l.call(void 0,f[b],h&&h[b],o)}var za=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function rf(o,l){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var f=o[h].indexOf("="),w=null;if(0<=f){var b=o[h].substring(0,f);w=o[h].substring(f+1)}else b=o[h];l(b,w?decodeURIComponent(w.replace(/\+/g," ")):"")}}}function kt(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof kt){this.h=o.h,Hr(this,o.j),this.o=o.o,this.g=o.g,Wr(this,o.s),this.l=o.l;var l=o.i,h=new Xn;h.i=l.i,l.g&&(h.g=new Map(l.g),h.h=l.h),Ga(this,h),this.m=o.m}else o&&(l=String(o).match(za))?(this.h=!1,Hr(this,l[1]||"",!0),this.o=Jn(l[2]||""),this.g=Jn(l[3]||"",!0),Wr(this,l[4]),this.l=Jn(l[5]||"",!0),Ga(this,l[6]||"",!0),this.m=Jn(l[7]||"")):(this.h=!1,this.i=new Xn(null,this.h))}kt.prototype.toString=function(){var o=[],l=this.j;l&&o.push(Yn(l,Ka,!0),":");var h=this.g;return(h||l=="file")&&(o.push("//"),(l=this.o)&&o.push(Yn(l,Ka,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(Yn(h,h.charAt(0)=="/"?af:of,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",Yn(h,cf)),o.join("")};function He(o){return new kt(o)}function Hr(o,l,h){o.j=h?Jn(l,!0):l,o.j&&(o.j=o.j.replace(/:$/,""))}function Wr(o,l){if(l){if(l=Number(l),isNaN(l)||0>l)throw Error("Bad port number "+l);o.s=l}else o.s=null}function Ga(o,l,h){l instanceof Xn?(o.i=l,lf(o.i,o.h)):(h||(l=Yn(l,uf)),o.i=new Xn(l,o.h))}function re(o,l,h){o.i.set(l,h)}function Qr(o){return re(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function Jn(o,l){return o?l?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function Yn(o,l,h){return typeof o=="string"?(o=encodeURI(o).replace(l,sf),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function sf(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var Ka=/[#\/\?@]/g,of=/[#\?:]/g,af=/[#\?]/g,uf=/[#\?@]/g,cf=/#/g;function Xn(o,l){this.h=this.g=null,this.i=o||null,this.j=!!l}function ut(o){o.g||(o.g=new Map,o.h=0,o.i&&rf(o.i,function(l,h){o.add(decodeURIComponent(l.replace(/\+/g," ")),h)}))}r=Xn.prototype,r.add=function(o,l){ut(this),this.i=null,o=sn(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(l),this.h+=1,this};function $a(o,l){ut(o),l=sn(o,l),o.g.has(l)&&(o.i=null,o.h-=o.g.get(l).length,o.g.delete(l))}function Ha(o,l){return ut(o),l=sn(o,l),o.g.has(l)}r.forEach=function(o,l){ut(this),this.g.forEach(function(h,f){h.forEach(function(w){o.call(l,w,f,this)},this)},this)},r.na=function(){ut(this);const o=Array.from(this.g.values()),l=Array.from(this.g.keys()),h=[];for(let f=0;f<l.length;f++){const w=o[f];for(let b=0;b<w.length;b++)h.push(l[f])}return h},r.V=function(o){ut(this);let l=[];if(typeof o=="string")Ha(this,o)&&(l=l.concat(this.g.get(sn(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)l=l.concat(o[h])}return l},r.set=function(o,l){return ut(this),this.i=null,o=sn(this,o),Ha(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[l]),this.h+=1,this},r.get=function(o,l){return o?(o=this.V(o),0<o.length?String(o[0]):l):l};function Wa(o,l,h){$a(o,l),0<h.length&&(o.i=null,o.g.set(sn(o,l),x(h)),o.h+=h.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],l=Array.from(this.g.keys());for(var h=0;h<l.length;h++){var f=l[h];const b=encodeURIComponent(String(f)),k=this.V(f);for(f=0;f<k.length;f++){var w=b;k[f]!==""&&(w+="="+encodeURIComponent(String(k[f]))),o.push(w)}}return this.i=o.join("&")};function sn(o,l){return l=String(l),o.j&&(l=l.toLowerCase()),l}function lf(o,l){l&&!o.j&&(ut(o),o.i=null,o.g.forEach(function(h,f){var w=f.toLowerCase();f!=w&&($a(this,f),Wa(this,w,h))},o)),o.j=l}function hf(o,l){const h=new Wn;if(u.Image){const f=new Image;f.onload=P(ct,h,"TestLoadImage: loaded",!0,l,f),f.onerror=P(ct,h,"TestLoadImage: error",!1,l,f),f.onabort=P(ct,h,"TestLoadImage: abort",!1,l,f),f.ontimeout=P(ct,h,"TestLoadImage: timeout",!1,l,f),u.setTimeout(function(){f.ontimeout&&f.ontimeout()},1e4),f.src=o}else l(!1)}function df(o,l){const h=new Wn,f=new AbortController,w=setTimeout(()=>{f.abort(),ct(h,"TestPingServer: timeout",!1,l)},1e4);fetch(o,{signal:f.signal}).then(b=>{clearTimeout(w),b.ok?ct(h,"TestPingServer: ok",!0,l):ct(h,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(w),ct(h,"TestPingServer: error",!1,l)})}function ct(o,l,h,f,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),f(h)}catch{}}function ff(){this.g=new Wd}function mf(o,l,h){const f=h||"";try{qa(o,function(w,b){let k=w;d(w)&&(k=vs(w)),l.push(f+b+"="+encodeURIComponent(k))})}catch(w){throw l.push(f+"type="+encodeURIComponent("_badmap")),w}}function Jr(o){this.l=o.Ub||null,this.j=o.eb||!1}V(Jr,Ts),Jr.prototype.g=function(){return new Yr(this.l,this.j)},Jr.prototype.i=function(o){return function(){return o}}({});function Yr(o,l){Ie.call(this),this.D=o,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}V(Yr,Ie),r=Yr.prototype,r.open=function(o,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=l,this.readyState=1,er(this)},r.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const l={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(l.body=o),(this.D||u).fetch(new Request(this.A,l)).then(this.Sa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Zn(this)),this.readyState=0},r.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,er(this)),this.g&&(this.readyState=3,er(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof u.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Qa(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function Qa(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}r.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var l=o.value?o.value:new Uint8Array(0);(l=this.v.decode(l,{stream:!o.done}))&&(this.response=this.responseText+=l)}o.done?Zn(this):er(this),this.readyState==3&&Qa(this)}},r.Ra=function(o){this.g&&(this.response=this.responseText=o,Zn(this))},r.Qa=function(o){this.g&&(this.response=o,Zn(this))},r.ga=function(){this.g&&Zn(this)};function Zn(o){o.readyState=4,o.l=null,o.j=null,o.v=null,er(o)}r.setRequestHeader=function(o,l){this.u.append(o,l)},r.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],l=this.h.entries();for(var h=l.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=l.next();return o.join(`\r
`)};function er(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Yr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function Ja(o){let l="";return $(o,function(h,f){l+=f,l+=":",l+=h,l+=`\r
`}),l}function Ds(o,l,h){e:{for(f in h){var f=!1;break e}f=!0}f||(h=Ja(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):re(o,l,h))}function ue(o){Ie.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}V(ue,Ie);var pf=/^https?$/i,gf=["POST","PUT"];r=ue.prototype,r.Ha=function(o){this.J=o},r.ea=function(o,l,h,f){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);l=l?l.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():As.g(),this.v=this.o?Ra(this.o):Ra(As),this.g.onreadystatechange=E(this.Ea,this);try{this.B=!0,this.g.open(l,String(o),!0),this.B=!1}catch(b){Ya(this,b);return}if(o=h||"",h=new Map(this.headers),f)if(Object.getPrototypeOf(f)===Object.prototype)for(var w in f)h.set(w,f[w]);else if(typeof f.keys=="function"&&typeof f.get=="function")for(const b of f.keys())h.set(b,f.get(b));else throw Error("Unknown input type for opt_headers: "+String(f));f=Array.from(h.keys()).find(b=>b.toLowerCase()=="content-type"),w=u.FormData&&o instanceof u.FormData,!(0<=Array.prototype.indexOf.call(gf,l,void 0))||f||w||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[b,k]of h)this.g.setRequestHeader(b,k);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{eu(this),this.u=!0,this.g.send(o),this.u=!1}catch(b){Ya(this,b)}};function Ya(o,l){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=l,o.m=5,Xa(o),Xr(o)}function Xa(o){o.A||(o.A=!0,we(o,"complete"),we(o,"error"))}r.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,we(this,"complete"),we(this,"abort"),Xr(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Xr(this,!0)),ue.aa.N.call(this)},r.Ea=function(){this.s||(this.B||this.u||this.j?Za(this):this.bb())},r.bb=function(){Za(this)};function Za(o){if(o.h&&typeof a<"u"&&(!o.v[1]||We(o)!=4||o.Z()!=2)){if(o.u&&We(o)==4)Ta(o.Ea,0,o);else if(we(o,"readystatechange"),We(o)==4){o.h=!1;try{const k=o.Z();e:switch(k){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break e;default:l=!1}var h;if(!(h=l)){var f;if(f=k===0){var w=String(o.D).match(za)[1]||null;!w&&u.self&&u.self.location&&(w=u.self.location.protocol.slice(0,-1)),f=!pf.test(w?w.toLowerCase():"")}h=f}if(h)we(o,"complete"),we(o,"success");else{o.m=6;try{var b=2<We(o)?o.g.statusText:""}catch{b=""}o.l=b+" ["+o.Z()+"]",Xa(o)}}finally{Xr(o)}}}}function Xr(o,l){if(o.g){eu(o);const h=o.g,f=o.v[0]?()=>{}:null;o.g=null,o.v=null,l||we(o,"ready");try{h.onreadystatechange=f}catch{}}}function eu(o){o.I&&(u.clearTimeout(o.I),o.I=null)}r.isActive=function(){return!!this.g};function We(o){return o.g?o.g.readyState:0}r.Z=function(){try{return 2<We(this)?this.g.status:-1}catch{return-1}},r.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.Oa=function(o){if(this.g){var l=this.g.responseText;return o&&l.indexOf(o)==0&&(l=l.substring(o.length)),Hd(l)}};function tu(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function _f(o){const l={};o=(o.g&&2<=We(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let f=0;f<o.length;f++){if(j(o[f]))continue;var h=T(o[f]);const w=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const b=l[w]||[];l[w]=b,b.push(h)}I(l,function(f){return f.join(", ")})}r.Ba=function(){return this.m},r.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function tr(o,l,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||l}function nu(o){this.Aa=0,this.i=[],this.j=new Wn,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=tr("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=tr("baseRetryDelayMs",5e3,o),this.cb=tr("retryDelaySeedMs",1e4,o),this.Wa=tr("forwardChannelMaxRetries",2,o),this.wa=tr("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new La(o&&o.concurrentRequestLimit),this.Da=new ff,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}r=nu.prototype,r.la=8,r.G=1,r.connect=function(o,l,h,f){Ae(0),this.W=o,this.H=l||{},h&&f!==void 0&&(this.H.OSID=h,this.H.OAID=f),this.F=this.X,this.I=hu(this,null,this.W),ei(this)};function ks(o){if(ru(o),o.G==3){var l=o.U++,h=He(o.I);if(re(h,"SID",o.K),re(h,"RID",l),re(h,"TYPE","terminate"),nr(o,h),l=new at(o,o.j,l),l.L=2,l.v=Qr(He(h)),h=!1,u.navigator&&u.navigator.sendBeacon)try{h=u.navigator.sendBeacon(l.v.toString(),"")}catch{}!h&&u.Image&&(new Image().src=l.v,h=!0),h||(l.g=du(l.j,null),l.g.ea(l.v)),l.F=Date.now(),$r(l)}lu(o)}function Zr(o){o.g&&(Ns(o),o.g.cancel(),o.g=null)}function ru(o){Zr(o),o.u&&(u.clearTimeout(o.u),o.u=null),ti(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&u.clearTimeout(o.s),o.s=null)}function ei(o){if(!Fa(o.h)&&!o.s){o.s=!0;var l=o.Ga;jn||ga(),qn||(jn(),qn=!0),ds.add(l,o),o.B=0}}function yf(o,l){return Ua(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=l.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=Hn(E(o.Ga,o,l),cu(o,o.B)),o.B++,!0)}r.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const w=new at(this,this.j,o);let b=this.o;if(this.S&&(b?(b=g(b),v(b,this.S)):b=this.S),this.m!==null||this.O||(w.H=b,b=null),this.P)e:{for(var l=0,h=0;h<this.i.length;h++){t:{var f=this.i[h];if("__data__"in f.map&&(f=f.map.__data__,typeof f=="string")){f=f.length;break t}f=void 0}if(f===void 0)break;if(l+=f,4096<l){l=h;break e}if(l===4096||h===this.i.length-1){l=h+1;break e}}l=1e3}else l=1e3;l=su(this,w,l),h=He(this.I),re(h,"RID",o),re(h,"CVER",22),this.D&&re(h,"X-HTTP-Session-Id",this.D),nr(this,h),b&&(this.O?l="headers="+encodeURIComponent(String(Ja(b)))+"&"+l:this.m&&Ds(h,this.m,b)),Vs(this.h,w),this.Ua&&re(h,"TYPE","init"),this.P?(re(h,"$req",l),re(h,"SID","null"),w.T=!0,bs(w,h,null)):bs(w,h,l),this.G=2}}else this.G==3&&(o?iu(this,o):this.i.length==0||Fa(this.h)||iu(this))};function iu(o,l){var h;l?h=l.l:h=o.U++;const f=He(o.I);re(f,"SID",o.K),re(f,"RID",h),re(f,"AID",o.T),nr(o,f),o.m&&o.o&&Ds(f,o.m,o.o),h=new at(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),l&&(o.i=l.D.concat(o.i)),l=su(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),Vs(o.h,h),bs(h,f,l)}function nr(o,l){o.H&&$(o.H,function(h,f){re(l,f,h)}),o.l&&qa({},function(h,f){re(l,f,h)})}function su(o,l,h){h=Math.min(o.i.length,h);var f=o.l?E(o.l.Na,o.l,o):null;e:{var w=o.i;let b=-1;for(;;){const k=["count="+h];b==-1?0<h?(b=w[0].g,k.push("ofs="+b)):b=0:k.push("ofs="+b);let ne=!0;for(let pe=0;pe<h;pe++){let Y=w[pe].g;const ve=w[pe].map;if(Y-=b,0>Y)b=Math.max(0,w[pe].g-100),ne=!1;else try{mf(ve,k,"req"+Y+"_")}catch{f&&f(ve)}}if(ne){f=k.join("&");break e}}}return o=o.i.splice(0,h),l.D=o,f}function ou(o){if(!o.g&&!o.u){o.Y=1;var l=o.Fa;jn||ga(),qn||(jn(),qn=!0),ds.add(l,o),o.v=0}}function xs(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=Hn(E(o.Fa,o),cu(o,o.v)),o.v++,!0)}r.Fa=function(){if(this.u=null,au(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=Hn(E(this.ab,this),o)}},r.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Ae(10),Zr(this),au(this))};function Ns(o){o.A!=null&&(u.clearTimeout(o.A),o.A=null)}function au(o){o.g=new at(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var l=He(o.qa);re(l,"RID","rpc"),re(l,"SID",o.K),re(l,"AID",o.T),re(l,"CI",o.F?"0":"1"),!o.F&&o.ja&&re(l,"TO",o.ja),re(l,"TYPE","xmlhttp"),nr(o,l),o.m&&o.o&&Ds(l,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=Qr(He(l)),h.m=null,h.P=!0,Na(h,o)}r.Za=function(){this.C!=null&&(this.C=null,Zr(this),xs(this),Ae(19))};function ti(o){o.C!=null&&(u.clearTimeout(o.C),o.C=null)}function uu(o,l){var h=null;if(o.g==l){ti(o),Ns(o),o.g=null;var f=2}else if(Cs(o.h,l))h=l.D,Ba(o.h,l),f=1;else return;if(o.G!=0){if(l.o)if(f==1){h=l.m?l.m.length:0,l=Date.now()-l.F;var w=o.B;f=zr(),we(f,new Va(f,h)),ei(o)}else ou(o);else if(w=l.s,w==3||w==0&&0<l.X||!(f==1&&yf(o,l)||f==2&&xs(o)))switch(h&&0<h.length&&(l=o.h,l.i=l.i.concat(h)),w){case 1:xt(o,5);break;case 4:xt(o,10);break;case 3:xt(o,6);break;default:xt(o,2)}}}function cu(o,l){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*l}function xt(o,l){if(o.j.info("Error code "+l),l==2){var h=E(o.fb,o),f=o.Xa;const w=!f;f=new kt(f||"//www.google.com/images/cleardot.gif"),u.location&&u.location.protocol=="http"||Hr(f,"https"),Qr(f),w?hf(f.toString(),h):df(f.toString(),h)}else Ae(2);o.G=0,o.l&&o.l.sa(l),lu(o),ru(o)}r.fb=function(o){o?(this.j.info("Successfully pinged google.com"),Ae(2)):(this.j.info("Failed to ping google.com"),Ae(1))};function lu(o){if(o.G=0,o.ka=[],o.l){const l=ja(o.h);(l.length!=0||o.i.length!=0)&&(D(o.ka,l),D(o.ka,o.i),o.h.i.length=0,x(o.i),o.i.length=0),o.l.ra()}}function hu(o,l,h){var f=h instanceof kt?He(h):new kt(h);if(f.g!="")l&&(f.g=l+"."+f.g),Wr(f,f.s);else{var w=u.location;f=w.protocol,l=l?l+"."+w.hostname:w.hostname,w=+w.port;var b=new kt(null);f&&Hr(b,f),l&&(b.g=l),w&&Wr(b,w),h&&(b.l=h),f=b}return h=o.D,l=o.ya,h&&l&&re(f,h,l),re(f,"VER",o.la),nr(o,f),f}function du(o,l,h){if(l&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return l=o.Ca&&!o.pa?new ue(new Jr({eb:h})):new ue(o.pa),l.Ha(o.J),l}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function fu(){}r=fu.prototype,r.ua=function(){},r.ta=function(){},r.sa=function(){},r.ra=function(){},r.isActive=function(){return!0},r.Na=function(){};function ni(){}ni.prototype.g=function(o,l){return new De(o,l)};function De(o,l){Ie.call(this),this.g=new nu(l),this.l=o,this.h=l&&l.messageUrlParams||null,o=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(o?o["X-WebChannel-Content-Type"]=l.messageContentType:o={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.va&&(o?o["X-WebChannel-Client-Profile"]=l.va:o={"X-WebChannel-Client-Profile":l.va}),this.g.S=o,(o=l&&l.Sb)&&!j(o)&&(this.g.m=o),this.v=l&&l.supportsCrossDomainXhr||!1,this.u=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!j(l)&&(this.g.D=l,o=this.h,o!==null&&l in o&&(o=this.h,l in o&&delete o[l])),this.j=new on(this)}V(De,Ie),De.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},De.prototype.close=function(){ks(this.g)},De.prototype.o=function(o){var l=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=vs(o),o=h);l.i.push(new ef(l.Ya++,o)),l.G==3&&ei(l)},De.prototype.N=function(){this.g.l=null,delete this.j,ks(this.g),delete this.g,De.aa.N.call(this)};function mu(o){Es.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var l=o.__sm__;if(l){e:{for(const h in l){o=h;break e}o=void 0}(this.i=o)&&(o=this.i,l=l!==null&&o in l?l[o]:void 0),this.data=l}else this.data=o}V(mu,Es);function pu(){ws.call(this),this.status=1}V(pu,ws);function on(o){this.g=o}V(on,fu),on.prototype.ua=function(){we(this.g,"a")},on.prototype.ta=function(o){we(this.g,new mu(o))},on.prototype.sa=function(o){we(this.g,new pu)},on.prototype.ra=function(){we(this.g,"b")},ni.prototype.createWebChannel=ni.prototype.g,De.prototype.send=De.prototype.o,De.prototype.open=De.prototype.m,De.prototype.close=De.prototype.close,Kl=function(){return new ni},Gl=function(){return zr()},zl=Vt,to={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Gr.NO_ERROR=0,Gr.TIMEOUT=8,Gr.HTTP_ERROR=6,_i=Gr,Da.COMPLETE="complete",ql=Da,ba.EventType=Kn,Kn.OPEN="a",Kn.CLOSE="b",Kn.ERROR="c",Kn.MESSAGE="d",Ie.prototype.listen=Ie.prototype.K,ur=ba,ue.prototype.listenOnce=ue.prototype.L,ue.prototype.getLastError=ue.prototype.Ka,ue.prototype.getLastErrorCode=ue.prototype.Ba,ue.prototype.getStatus=ue.prototype.Z,ue.prototype.getResponseJson=ue.prototype.Oa,ue.prototype.getResponseText=ue.prototype.oa,ue.prototype.send=ue.prototype.ea,ue.prototype.setWithCredentials=ue.prototype.Ha,jl=ue}).apply(typeof si<"u"?si:typeof self<"u"?self:typeof window<"u"?window:{});const Gu="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ge{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}ge.UNAUTHENTICATED=new ge(null),ge.GOOGLE_CREDENTIALS=new ge("google-credentials-uid"),ge.FIRST_PARTY=new ge("first-party-uid"),ge.MOCK_USER=new ge("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Mn="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $t=new To("@firebase/firestore");function dn(){return $t.logLevel}function C(r,...e){if($t.logLevel<=H.DEBUG){const t=e.map(Oo);$t.debug(`Firestore (${Mn}): ${r}`,...t)}}function Re(r,...e){if($t.logLevel<=H.ERROR){const t=e.map(Oo);$t.error(`Firestore (${Mn}): ${r}`,...t)}}function Ht(r,...e){if($t.logLevel<=H.WARN){const t=e.map(Oo);$t.warn(`Firestore (${Mn}): ${r}`,...t)}}function Oo(r){if(typeof r=="string")return r;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(t){return JSON.stringify(t)}(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M(r="Unexpected state"){const e=`FIRESTORE (${Mn}) INTERNAL ASSERTION FAILED: `+r;throw Re(e),new Error(e)}function L(r,e){r||M()}function q(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class O extends st{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $l{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Qg{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(ge.UNAUTHENTICATED))}shutdown(){}}class Jg{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class Yg{constructor(e){this.t=e,this.currentUser=ge.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){L(this.o===void 0);let n=this.i;const i=c=>this.i!==n?(n=this.i,t(c)):Promise.resolve();let s=new et;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new et,e.enqueueRetryable(()=>i(this.currentUser))};const a=()=>{const c=s;e.enqueueRetryable(async()=>{await c.promise,await i(this.currentUser)})},u=c=>{C("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(c=>u(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?u(c):(C("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new et)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(n=>this.i!==e?(C("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(L(typeof n.accessToken=="string"),new $l(n.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return L(e===null||typeof e=="string"),new ge(e)}}class Xg{constructor(e,t,n){this.l=e,this.h=t,this.P=n,this.type="FirstParty",this.user=ge.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class Zg{constructor(e,t,n){this.l=e,this.h=t,this.P=n}getToken(){return Promise.resolve(new Xg(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(ge.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class e_{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class t_{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){L(this.o===void 0);const n=s=>{s.error!=null&&C("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const a=s.token!==this.R;return this.R=s.token,C("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>n(s))};const i=s=>{C("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.A.getImmediate({optional:!0});s?i(s):C("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(L(typeof t.token=="string"),this.R=t.token,new e_(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function n_(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hl{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let n="";for(;n.length<20;){const i=n_(40);for(let s=0;s<i.length;++s)n.length<20&&i[s]<t&&(n+=e.charAt(i[s]%e.length))}return n}}function z(r,e){return r<e?-1:r>e?1:0}function wn(r,e,t){return r.length===e.length&&r.every((n,i)=>t(n,e[i]))}function Wl(r){return r+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ae{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new O(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new O(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new O(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new O(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return ae.fromMillis(Date.now())}static fromDate(e){return ae.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor(1e6*(e-1e3*t));return new ae(t,n)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?z(this.nanoseconds,e.nanoseconds):z(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{constructor(e){this.timestamp=e}static fromTimestamp(e){return new U(e)}static min(){return new U(new ae(0,0))}static max(){return new U(new ae(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vr{constructor(e,t,n){t===void 0?t=0:t>e.length&&M(),n===void 0?n=e.length-t:n>e.length-t&&M(),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return vr.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof vr?e.forEach(n=>{t.push(n)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let i=0;i<n;i++){const s=e.get(i),a=t.get(i);if(s<a)return-1;if(s>a)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class Z extends vr{construct(e,t,n){return new Z(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new O(S.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(i=>i.length>0))}return new Z(t)}static emptyPath(){return new Z([])}}const r_=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class oe extends vr{construct(e,t,n){return new oe(e,t,n)}static isValidIdentifier(e){return r_.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),oe.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new oe(["__name__"])}static fromServerFormat(e){const t=[];let n="",i=0;const s=()=>{if(n.length===0)throw new O(S.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let a=!1;for(;i<e.length;){const u=e[i];if(u==="\\"){if(i+1===e.length)throw new O(S.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[i+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new O(S.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=c,i+=2}else u==="`"?(a=!a,i++):u!=="."||a?(n+=u,i++):(s(),i++)}if(s(),a)throw new O(S.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new oe(t)}static emptyPath(){return new oe([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N{constructor(e){this.path=e}static fromPath(e){return new N(Z.fromString(e))}static fromName(e){return new N(Z.fromString(e).popFirst(5))}static empty(){return new N(Z.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Z.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Z.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new N(new Z(e.slice()))}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ni{constructor(e,t,n,i){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=i}}function no(r){return r.fields.find(e=>e.kind===2)}function Mt(r){return r.fields.filter(e=>e.kind!==2)}Ni.UNKNOWN_ID=-1;class yi{constructor(e,t){this.fieldPath=e,this.kind=t}}class Tr{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new Tr(0,Ne.min())}}function i_(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,i=U.fromTimestamp(n===1e9?new ae(t+1,0):new ae(t,n));return new Ne(i,N.empty(),e)}function Ql(r){return new Ne(r.readTime,r.key,-1)}class Ne{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Ne(U.min(),N.empty(),-1)}static max(){return new Ne(U.max(),N.empty(),-1)}}function Mo(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=N.comparator(r.documentKey,e.documentKey),t!==0?t:z(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jl="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Yl{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tn(r){if(r.code!==S.FAILED_PRECONDITION||r.message!==Jl)throw r;C("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&M(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new A((n,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(n,i)},this.catchCallback=s=>{this.wrapFailure(t,s).next(n,i)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof A?t:A.resolve(t)}catch(t){return A.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):A.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):A.reject(t)}static resolve(e){return new A((t,n)=>{t(e)})}static reject(e){return new A((t,n)=>{n(e)})}static waitFor(e){return new A((t,n)=>{let i=0,s=0,a=!1;e.forEach(u=>{++i,u.next(()=>{++s,a&&s===i&&t()},c=>n(c))}),a=!0,s===i&&t()})}static or(e){let t=A.resolve(!1);for(const n of e)t=t.next(i=>i?A.resolve(i):n());return t}static forEach(e,t){const n=[];return e.forEach((i,s)=>{n.push(t.call(this,i,s))}),this.waitFor(n)}static mapArray(e,t){return new A((n,i)=>{const s=e.length,a=new Array(s);let u=0;for(let c=0;c<s;c++){const d=c;t(e[d]).next(m=>{a[d]=m,++u,u===s&&n(a)},m=>i(m))}})}static doWhile(e,t){return new A((n,i)=>{const s=()=>{e()===!0?t().next(()=>{s()},i):n()};s()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ji{constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.V=new et,this.transaction.oncomplete=()=>{this.V.resolve()},this.transaction.onabort=()=>{t.error?this.V.reject(new fr(e,t.error)):this.V.resolve()},this.transaction.onerror=n=>{const i=Lo(n.target.error);this.V.reject(new fr(e,i))}}static open(e,t,n,i){try{return new Ji(t,e.transaction(i,n))}catch(s){throw new fr(t,s)}}get m(){return this.V.promise}abort(e){e&&this.V.reject(e),this.aborted||(C("SimpleDb","Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}g(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new o_(t)}}class Et{constructor(e,t,n){this.name=e,this.version=t,this.p=n,Et.S(de())===12.2&&Re("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}static delete(e){return C("SimpleDb","Removing database:",e),Lt(window.indexedDB.deleteDatabase(e)).toPromise()}static D(){if(!rl())return!1;if(Et.v())return!0;const e=de(),t=Et.S(e),n=0<t&&t<10,i=Xl(e),s=0<i&&i<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||s)}static v(){var e;return typeof process<"u"&&((e=process.__PRIVATE_env)===null||e===void 0?void 0:e.C)==="YES"}static F(e,t){return e.store(t)}static S(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}async M(e){return this.db||(C("SimpleDb","Opening database:",this.name),this.db=await new Promise((t,n)=>{const i=indexedDB.open(this.name,this.version);i.onsuccess=s=>{const a=s.target.result;t(a)},i.onblocked=()=>{n(new fr(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},i.onerror=s=>{const a=s.target.error;a.name==="VersionError"?n(new O(S.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):a.name==="InvalidStateError"?n(new O(S.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+a)):n(new fr(e,a))},i.onupgradeneeded=s=>{C("SimpleDb",'Database "'+this.name+'" requires upgrade from version:',s.oldVersion);const a=s.target.result;this.p.O(a,i.transaction,s.oldVersion,this.version).next(()=>{C("SimpleDb","Database upgrade to version "+this.version+" complete")})}})),this.N&&(this.db.onversionchange=t=>this.N(t)),this.db}L(e){this.N=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,i){const s=t==="readonly";let a=0;for(;;){++a;try{this.db=await this.M(e);const u=Ji.open(this.db,e,s?"readonly":"readwrite",n),c=i(u).next(d=>(u.g(),d)).catch(d=>(u.abort(d),A.reject(d))).toPromise();return c.catch(()=>{}),await u.m,c}catch(u){const c=u,d=c.name!=="FirebaseError"&&a<3;if(C("SimpleDb","Transaction failed with error:",c.message,"Retrying:",d),this.close(),!d)return Promise.reject(c)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Xl(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class s_{constructor(e){this.B=e,this.k=!1,this.q=null}get isDone(){return this.k}get K(){return this.q}set cursor(e){this.B=e}done(){this.k=!0}$(e){this.q=e}delete(){return Lt(this.B.delete())}}class fr extends O{constructor(e,t){super(S.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function Pt(r){return r.name==="IndexedDbTransactionError"}class o_{constructor(e){this.store=e}put(e,t){let n;return t!==void 0?(C("SimpleDb","PUT",this.store.name,e,t),n=this.store.put(t,e)):(C("SimpleDb","PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),Lt(n)}add(e){return C("SimpleDb","ADD",this.store.name,e,e),Lt(this.store.add(e))}get(e){return Lt(this.store.get(e)).next(t=>(t===void 0&&(t=null),C("SimpleDb","GET",this.store.name,e,t),t))}delete(e){return C("SimpleDb","DELETE",this.store.name,e),Lt(this.store.delete(e))}count(){return C("SimpleDb","COUNT",this.store.name),Lt(this.store.count())}U(e,t){const n=this.options(e,t),i=n.index?this.store.index(n.index):this.store;if(typeof i.getAll=="function"){const s=i.getAll(n.range);return new A((a,u)=>{s.onerror=c=>{u(c.target.error)},s.onsuccess=c=>{a(c.target.result)}})}{const s=this.cursor(n),a=[];return this.W(s,(u,c)=>{a.push(c)}).next(()=>a)}}G(e,t){const n=this.store.getAll(e,t===null?void 0:t);return new A((i,s)=>{n.onerror=a=>{s(a.target.error)},n.onsuccess=a=>{i(a.target.result)}})}j(e,t){C("SimpleDb","DELETE ALL",this.store.name);const n=this.options(e,t);n.H=!1;const i=this.cursor(n);return this.W(i,(s,a,u)=>u.delete())}J(e,t){let n;t?n=e:(n={},t=e);const i=this.cursor(n);return this.W(i,t)}Y(e){const t=this.cursor({});return new A((n,i)=>{t.onerror=s=>{const a=Lo(s.target.error);i(a)},t.onsuccess=s=>{const a=s.target.result;a?e(a.primaryKey,a.value).next(u=>{u?a.continue():n()}):n()}})}W(e,t){const n=[];return new A((i,s)=>{e.onerror=a=>{s(a.target.error)},e.onsuccess=a=>{const u=a.target.result;if(!u)return void i();const c=new s_(u),d=t(u.primaryKey,u.value,c);if(d instanceof A){const m=d.catch(p=>(c.done(),A.reject(p)));n.push(m)}c.isDone?i():c.K===null?u.continue():u.continue(c.K)}}).next(()=>A.waitFor(n))}options(e,t){let n;return e!==void 0&&(typeof e=="string"?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.H?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function Lt(r){return new A((e,t)=>{r.onsuccess=n=>{const i=n.target.result;e(i)},r.onerror=n=>{const i=Lo(n.target.error);t(i)}})}let Ku=!1;function Lo(r){const e=Et.S(de());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(t)>=0){const n=new O("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return Ku||(Ku=!0,setTimeout(()=>{throw n},0)),n}}return r}class a_{constructor(e,t){this.asyncQueue=e,this.Z=t,this.task=null}start(){this.X(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}X(e){C("IndexBackfiller",`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{C("IndexBackfiller",`Documents written: ${await this.Z.ee()}`)}catch(t){Pt(t)?C("IndexBackfiller","Ignoring IndexedDB error during index backfill: ",t):await tn(t)}await this.X(6e4)})}}class u_{constructor(e,t){this.localStore=e,this.persistence=t}async ee(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",t=>this.te(t,e))}te(e,t){const n=new Set;let i=t,s=!0;return A.doWhile(()=>s===!0&&i>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(a=>{if(a!==null&&!n.has(a))return C("IndexBackfiller",`Processing collection: ${a}`),this.ne(e,a,i).next(u=>{i-=u,n.add(a)});s=!1})).next(()=>t-i)}ne(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next(i=>this.localStore.localDocuments.getNextDocuments(e,t,i,n).next(s=>{const a=s.changes;return this.localStore.indexManager.updateIndexEntries(e,a).next(()=>this.re(i,s)).next(u=>(C("IndexBackfiller",`Updating offset: ${u}`),this.localStore.indexManager.updateCollectionGroup(e,t,u))).next(()=>a.size)}))}re(e,t){let n=e;return t.changes.forEach((i,s)=>{const a=Ql(s);Mo(a,n)>0&&(n=a)}),new Ne(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oe{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.ie(n),this.se=n=>t.writeSequenceNumber(n))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Oe.oe=-1;function Yi(r){return r==null}function Er(r){return r===0&&1/r==-1/0}function c_(r){return typeof r=="number"&&Number.isInteger(r)&&!Er(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function be(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=$u(e)),e=l_(r.get(t),e);return $u(e)}function l_(r,e){let t=e;const n=r.length;for(let i=0;i<n;i++){const s=r.charAt(i);switch(s){case"\0":t+="";break;case"":t+="";break;default:t+=s}}return t}function $u(r){return r+""}function je(r){const e=r.length;if(L(e>=2),e===2)return L(r.charAt(0)===""&&r.charAt(1)===""),Z.emptyPath();const t=e-2,n=[];let i="";for(let s=0;s<e;){const a=r.indexOf("",s);switch((a<0||a>t)&&M(),r.charAt(a+1)){case"":const u=r.substring(s,a);let c;i.length===0?c=u:(i+=u,c=i,i=""),n.push(c);break;case"":i+=r.substring(s,a),i+="\0";break;case"":i+=r.substring(s,a+1);break;default:M()}s=a+2}return new Z(n)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hu=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ii(r,e){return[r,be(e)]}function Zl(r,e,t){return[r,be(e),t]}const h_={},d_=["prefixPath","collectionGroup","readTime","documentId"],f_=["prefixPath","collectionGroup","documentId"],m_=["collectionGroup","readTime","prefixPath","documentId"],p_=["canonicalId","targetId"],g_=["targetId","path"],__=["path","targetId"],y_=["collectionId","parent"],I_=["indexId","uid"],v_=["uid","sequenceNumber"],T_=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],E_=["indexId","uid","orderedDocumentKey"],w_=["userId","collectionPath","documentId"],A_=["userId","collectionPath","largestBatchId"],R_=["userId","collectionGroup","largestBatchId"],eh=["mutationQueues","mutations","documentMutations","remoteDocuments","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries"],b_=[...eh,"documentOverlays"],th=["mutationQueues","mutations","documentMutations","remoteDocumentsV14","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries","documentOverlays"],nh=th,Fo=[...nh,"indexConfiguration","indexState","indexEntries"],P_=Fo,S_=[...Fo,"globals"];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ro extends Yl{constructor(e,t){super(),this._e=e,this.currentSequenceNumber=t}}function fe(r,e){const t=q(r);return Et.F(t._e,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wu(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Ln(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function rh(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class se{constructor(e,t){this.comparator=e,this.root=t||_e.EMPTY}insert(e,t){return new se(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,_e.BLACK,null,null))}remove(e){return new se(this.comparator,this.root.remove(e,this.comparator).copy(null,null,_e.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const i=this.comparator(e,n.key);if(i===0)return t+n.left.size;i<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){const e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new oi(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new oi(this.root,e,this.comparator,!1)}getReverseIterator(){return new oi(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new oi(this.root,e,this.comparator,!0)}}class oi{constructor(e,t,n,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?n(e.key,t):1,t&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class _e{constructor(e,t,n,i,s){this.key=e,this.value=t,this.color=n??_e.RED,this.left=i??_e.EMPTY,this.right=s??_e.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,i,s){return new _e(e??this.key,t??this.value,n??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let i=this;const s=n(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,n),null):s===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,n)),i.fixUp()}removeMin(){if(this.left.isEmpty())return _e.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return _e.EMPTY;n=i.right.min(),i=i.copy(n.key,n.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,_e.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,_e.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw M();const e=this.left.check();if(e!==this.right.check())throw M();return e+(this.isRed()?0:1)}}_e.EMPTY=null,_e.RED=!0,_e.BLACK=!1;_e.EMPTY=new class{constructor(){this.size=0}get key(){throw M()}get value(){throw M()}get color(){throw M()}get left(){throw M()}get right(){throw M()}copy(e,t,n,i,s){return this}insert(e,t,n){return new _e(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class te{constructor(e){this.comparator=e,this.data=new se(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const i=n.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Qu(this.data.getIterator())}getIteratorFrom(e){return new Qu(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(n=>{t=t.add(n)}),t}isEqual(e){if(!(e instanceof te)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=n.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new te(this.comparator);return t.data=e,t}}class Qu{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function un(r){return r.hasNext()?r.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Me{constructor(e){this.fields=e,e.sort(oe.comparator)}static empty(){return new Me([])}unionWith(e){let t=new te(oe.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new Me(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return wn(this.fields,e.fields,(t,n)=>t.isEqual(n))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ih extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class he{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new ih("Invalid base64 string: "+s):s}}(e);return new he(t)}static fromUint8Array(e){const t=function(i){let s="";for(let a=0;a<i.length;++a)s+=String.fromCharCode(i[a]);return s}(e);return new he(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const n=new Uint8Array(t.length);for(let i=0;i<t.length;i++)n[i]=t.charCodeAt(i);return n}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return z(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}he.EMPTY_BYTE_STRING=new he("");const C_=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function it(r){if(L(!!r),typeof r=="string"){let e=0;const t=C_.exec(r);if(L(!!t),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:ie(r.seconds),nanos:ie(r.nanos)}}function ie(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function At(r){return typeof r=="string"?he.fromBase64String(r):he.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uo(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function Bo(r){const e=r.mapValue.fields.__previous_value__;return Uo(e)?Bo(e):e}function wr(r){const e=it(r.mapValue.fields.__local_write_time__.timestampValue);return new ae(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V_{constructor(e,t,n,i,s,a,u,c,d){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=i,this.ssl=s,this.forceLongPolling=a,this.autoDetectLongPolling=u,this.longPollingOptions=c,this.useFetchStreams=d}}class Wt{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new Wt("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Wt&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yt={mapValue:{fields:{__type__:{stringValue:"__max__"}}}},vi={nullValue:"NULL_VALUE"};function Qt(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Uo(r)?4:sh(r)?9007199254740991:Xi(r)?10:11:M()}function Ke(r,e){if(r===e)return!0;const t=Qt(r);if(t!==Qt(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return wr(r).isEqual(wr(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const a=it(i.timestampValue),u=it(s.timestampValue);return a.seconds===u.seconds&&a.nanos===u.nanos}(r,e);case 5:return r.stringValue===e.stringValue;case 6:return function(i,s){return At(i.bytesValue).isEqual(At(s.bytesValue))}(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return function(i,s){return ie(i.geoPointValue.latitude)===ie(s.geoPointValue.latitude)&&ie(i.geoPointValue.longitude)===ie(s.geoPointValue.longitude)}(r,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return ie(i.integerValue)===ie(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const a=ie(i.doubleValue),u=ie(s.doubleValue);return a===u?Er(a)===Er(u):isNaN(a)&&isNaN(u)}return!1}(r,e);case 9:return wn(r.arrayValue.values||[],e.arrayValue.values||[],Ke);case 10:case 11:return function(i,s){const a=i.mapValue.fields||{},u=s.mapValue.fields||{};if(Wu(a)!==Wu(u))return!1;for(const c in a)if(a.hasOwnProperty(c)&&(u[c]===void 0||!Ke(a[c],u[c])))return!1;return!0}(r,e);default:return M()}}function Ar(r,e){return(r.values||[]).find(t=>Ke(t,e))!==void 0}function Rt(r,e){if(r===e)return 0;const t=Qt(r),n=Qt(e);if(t!==n)return z(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return z(r.booleanValue,e.booleanValue);case 2:return function(s,a){const u=ie(s.integerValue||s.doubleValue),c=ie(a.integerValue||a.doubleValue);return u<c?-1:u>c?1:u===c?0:isNaN(u)?isNaN(c)?0:-1:1}(r,e);case 3:return Ju(r.timestampValue,e.timestampValue);case 4:return Ju(wr(r),wr(e));case 5:return z(r.stringValue,e.stringValue);case 6:return function(s,a){const u=At(s),c=At(a);return u.compareTo(c)}(r.bytesValue,e.bytesValue);case 7:return function(s,a){const u=s.split("/"),c=a.split("/");for(let d=0;d<u.length&&d<c.length;d++){const m=z(u[d],c[d]);if(m!==0)return m}return z(u.length,c.length)}(r.referenceValue,e.referenceValue);case 8:return function(s,a){const u=z(ie(s.latitude),ie(a.latitude));return u!==0?u:z(ie(s.longitude),ie(a.longitude))}(r.geoPointValue,e.geoPointValue);case 9:return Yu(r.arrayValue,e.arrayValue);case 10:return function(s,a){var u,c,d,m;const p=s.fields||{},E=a.fields||{},P=(u=p.value)===null||u===void 0?void 0:u.arrayValue,V=(c=E.value)===null||c===void 0?void 0:c.arrayValue,x=z(((d=P==null?void 0:P.values)===null||d===void 0?void 0:d.length)||0,((m=V==null?void 0:V.values)===null||m===void 0?void 0:m.length)||0);return x!==0?x:Yu(P,V)}(r.mapValue,e.mapValue);case 11:return function(s,a){if(s===yt.mapValue&&a===yt.mapValue)return 0;if(s===yt.mapValue)return 1;if(a===yt.mapValue)return-1;const u=s.fields||{},c=Object.keys(u),d=a.fields||{},m=Object.keys(d);c.sort(),m.sort();for(let p=0;p<c.length&&p<m.length;++p){const E=z(c[p],m[p]);if(E!==0)return E;const P=Rt(u[c[p]],d[m[p]]);if(P!==0)return P}return z(c.length,m.length)}(r.mapValue,e.mapValue);default:throw M()}}function Ju(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return z(r,e);const t=it(r),n=it(e),i=z(t.seconds,n.seconds);return i!==0?i:z(t.nanos,n.nanos)}function Yu(r,e){const t=r.values||[],n=e.values||[];for(let i=0;i<t.length&&i<n.length;++i){const s=Rt(t[i],n[i]);if(s)return s}return z(t.length,n.length)}function An(r){return io(r)}function io(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?function(t){const n=it(t);return`time(${n.seconds},${n.nanos})`}(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?function(t){return At(t).toBase64()}(r.bytesValue):"referenceValue"in r?function(t){return N.fromName(t).toString()}(r.referenceValue):"geoPointValue"in r?function(t){return`geo(${t.latitude},${t.longitude})`}(r.geoPointValue):"arrayValue"in r?function(t){let n="[",i=!0;for(const s of t.values||[])i?i=!1:n+=",",n+=io(s);return n+"]"}(r.arrayValue):"mapValue"in r?function(t){const n=Object.keys(t.fields||{}).sort();let i="{",s=!0;for(const a of n)s?s=!1:i+=",",i+=`${a}:${io(t.fields[a])}`;return i+"}"}(r.mapValue):M()}function jo(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function so(r){return!!r&&"integerValue"in r}function Rr(r){return!!r&&"arrayValue"in r}function Xu(r){return!!r&&"nullValue"in r}function Zu(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function Ti(r){return!!r&&"mapValue"in r}function Xi(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function mr(r){if(r.geoPointValue)return{geoPointValue:Object.assign({},r.geoPointValue)};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:Object.assign({},r.timestampValue)};if(r.mapValue){const e={mapValue:{fields:{}}};return Ln(r.mapValue.fields,(t,n)=>e.mapValue.fields[t]=mr(n)),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=mr(r.arrayValue.values[t]);return e}return Object.assign({},r)}function sh(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}const oh={mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{}}}}};function D_(r){return"nullValue"in r?vi:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?jo(Wt.empty(),N.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?Xi(r)?oh:{mapValue:{}}:M()}function k_(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?jo(Wt.empty(),N.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?oh:"mapValue"in r?Xi(r)?{mapValue:{}}:yt:M()}function ec(r,e){const t=Rt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?-1:!r.inclusive&&e.inclusive?1:0}function tc(r,e){const t=Rt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?1:!r.inclusive&&e.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ce{constructor(e){this.value=e}static empty(){return new Ce({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!Ti(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=mr(t)}setAll(e){let t=oe.emptyPath(),n={},i=[];e.forEach((a,u)=>{if(!t.isImmediateParentOf(u)){const c=this.getFieldsMap(t);this.applyChanges(c,n,i),n={},i=[],t=u.popLast()}a?n[u.lastSegment()]=mr(a):i.push(u.lastSegment())});const s=this.getFieldsMap(t);this.applyChanges(s,n,i)}delete(e){const t=this.field(e.popLast());Ti(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Ke(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let i=t.mapValue.fields[e.get(n)];Ti(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,n){Ln(t,(i,s)=>e[i]=s);for(const i of n)delete e[i]}clone(){return new Ce(mr(this.value))}}function ah(r){const e=[];return Ln(r.fields,(t,n)=>{const i=new oe([t]);if(Ti(n)){const s=ah(n.mapValue).fields;if(s.length===0)e.push(i);else for(const a of s)e.push(i.child(a))}else e.push(i)}),new Me(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce{constructor(e,t,n,i,s,a,u){this.key=e,this.documentType=t,this.version=n,this.readTime=i,this.createTime=s,this.data=a,this.documentState=u}static newInvalidDocument(e){return new ce(e,0,U.min(),U.min(),U.min(),Ce.empty(),0)}static newFoundDocument(e,t,n,i){return new ce(e,1,t,U.min(),n,i,0)}static newNoDocument(e,t){return new ce(e,2,t,U.min(),U.min(),Ce.empty(),0)}static newUnknownDocument(e,t){return new ce(e,3,t,U.min(),U.min(),Ce.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(U.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ce.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ce.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=U.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof ce&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new ce(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rn{constructor(e,t){this.position=e,this.inclusive=t}}function nc(r,e,t){let n=0;for(let i=0;i<r.position.length;i++){const s=e[i],a=r.position[i];if(s.field.isKeyField()?n=N.comparator(N.fromName(a.referenceValue),t.key):n=Rt(a,t.data.field(s.field)),s.dir==="desc"&&(n*=-1),n!==0)break}return n}function rc(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!Ke(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oi{constructor(e,t="asc"){this.field=e,this.dir=t}}function x_(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uh{}class W extends uh{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new N_(e,t,n):t==="array-contains"?new L_(e,n):t==="in"?new mh(e,n):t==="not-in"?new F_(e,n):t==="array-contains-any"?new U_(e,n):new W(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new O_(e,n):new M_(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Rt(t,this.value)):t!==null&&Qt(this.value)===Qt(t)&&this.matchesComparison(Rt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return M()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class ee extends uh{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new ee(e,t)}matches(e){return bn(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function bn(r){return r.op==="and"}function oo(r){return r.op==="or"}function qo(r){return ch(r)&&bn(r)}function ch(r){for(const e of r.filters)if(e instanceof ee)return!1;return!0}function ao(r){if(r instanceof W)return r.field.canonicalString()+r.op.toString()+An(r.value);if(qo(r))return r.filters.map(e=>ao(e)).join(",");{const e=r.filters.map(t=>ao(t)).join(",");return`${r.op}(${e})`}}function lh(r,e){return r instanceof W?function(n,i){return i instanceof W&&n.op===i.op&&n.field.isEqual(i.field)&&Ke(n.value,i.value)}(r,e):r instanceof ee?function(n,i){return i instanceof ee&&n.op===i.op&&n.filters.length===i.filters.length?n.filters.reduce((s,a,u)=>s&&lh(a,i.filters[u]),!0):!1}(r,e):void M()}function hh(r,e){const t=r.filters.concat(e);return ee.create(t,r.op)}function dh(r){return r instanceof W?function(t){return`${t.field.canonicalString()} ${t.op} ${An(t.value)}`}(r):r instanceof ee?function(t){return t.op.toString()+" {"+t.getFilters().map(dh).join(" ,")+"}"}(r):"Filter"}class N_ extends W{constructor(e,t,n){super(e,t,n),this.key=N.fromName(n.referenceValue)}matches(e){const t=N.comparator(e.key,this.key);return this.matchesComparison(t)}}class O_ extends W{constructor(e,t){super(e,"in",t),this.keys=fh("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class M_ extends W{constructor(e,t){super(e,"not-in",t),this.keys=fh("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function fh(r,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(n=>N.fromName(n.referenceValue))}class L_ extends W{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Rr(t)&&Ar(t.arrayValue,this.value)}}class mh extends W{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Ar(this.value.arrayValue,t)}}class F_ extends W{constructor(e,t){super(e,"not-in",t)}matches(e){if(Ar(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!Ar(this.value.arrayValue,t)}}class U_ extends W{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Rr(t)||!t.arrayValue.values)&&t.arrayValue.values.some(n=>Ar(this.value.arrayValue,n))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B_{constructor(e,t=null,n=[],i=[],s=null,a=null,u=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=i,this.limit=s,this.startAt=a,this.endAt=u,this.ue=null}}function uo(r,e=null,t=[],n=[],i=null,s=null,a=null){return new B_(r,e,t,n,i,s,a)}function Jt(r){const e=q(r);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(n=>ao(n)).join(","),t+="|ob:",t+=e.orderBy.map(n=>function(s){return s.field.canonicalString()+s.dir}(n)).join(","),Yi(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(n=>An(n)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(n=>An(n)).join(",")),e.ue=t}return e.ue}function kr(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!x_(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!lh(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!rc(r.startAt,e.startAt)&&rc(r.endAt,e.endAt)}function Mi(r){return N.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Li(r,e){return r.filters.filter(t=>t instanceof W&&t.field.isEqual(e))}function ic(r,e,t){let n=vi,i=!0;for(const s of Li(r,e)){let a=vi,u=!0;switch(s.op){case"<":case"<=":a=D_(s.value);break;case"==":case"in":case">=":a=s.value;break;case">":a=s.value,u=!1;break;case"!=":case"not-in":a=vi}ec({value:n,inclusive:i},{value:a,inclusive:u})<0&&(n=a,i=u)}if(t!==null){for(let s=0;s<r.orderBy.length;++s)if(r.orderBy[s].field.isEqual(e)){const a=t.position[s];ec({value:n,inclusive:i},{value:a,inclusive:t.inclusive})<0&&(n=a,i=t.inclusive);break}}return{value:n,inclusive:i}}function sc(r,e,t){let n=yt,i=!0;for(const s of Li(r,e)){let a=yt,u=!0;switch(s.op){case">=":case">":a=k_(s.value),u=!1;break;case"==":case"in":case"<=":a=s.value;break;case"<":a=s.value,u=!1;break;case"!=":case"not-in":a=yt}tc({value:n,inclusive:i},{value:a,inclusive:u})>0&&(n=a,i=u)}if(t!==null){for(let s=0;s<r.orderBy.length;++s)if(r.orderBy[s].field.isEqual(e)){const a=t.position[s];tc({value:n,inclusive:i},{value:a,inclusive:t.inclusive})>0&&(n=a,i=t.inclusive);break}}return{value:n,inclusive:i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zi{constructor(e,t=null,n=[],i=[],s=null,a="F",u=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=i,this.limit=s,this.limitType=a,this.startAt=u,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function j_(r,e,t,n,i,s,a,u){return new Zi(r,e,t,n,i,s,a,u)}function zo(r){return new Zi(r)}function oc(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function q_(r){return r.collectionGroup!==null}function pr(r){const e=q(r);if(e.ce===null){e.ce=[];const t=new Set;for(const s of e.explicitOrderBy)e.ce.push(s),t.add(s.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let u=new te(oe.comparator);return a.filters.forEach(c=>{c.getFlattenedFilters().forEach(d=>{d.isInequality()&&(u=u.add(d.field))})}),u})(e).forEach(s=>{t.has(s.canonicalString())||s.isKeyField()||e.ce.push(new Oi(s,n))}),t.has(oe.keyField().canonicalString())||e.ce.push(new Oi(oe.keyField(),n))}return e.ce}function Le(r){const e=q(r);return e.le||(e.le=z_(e,pr(r))),e.le}function z_(r,e){if(r.limitType==="F")return uo(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new Oi(i.field,s)});const t=r.endAt?new Rn(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new Rn(r.startAt.position,r.startAt.inclusive):null;return uo(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function co(r,e,t){return new Zi(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function es(r,e){return kr(Le(r),Le(e))&&r.limitType===e.limitType}function ph(r){return`${Jt(Le(r))}|lt:${r.limitType}`}function fn(r){return`Query(target=${function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map(i=>dh(i)).join(", ")}]`),Yi(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map(i=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(i)).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map(i=>An(i)).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map(i=>An(i)).join(",")),`Target(${n})`}(Le(r))}; limitType=${r.limitType})`}function xr(r,e){return e.isFoundDocument()&&function(n,i){const s=i.key.path;return n.collectionGroup!==null?i.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(s):N.isDocumentKey(n.path)?n.path.isEqual(s):n.path.isImmediateParentOf(s)}(r,e)&&function(n,i){for(const s of pr(n))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(r,e)&&function(n,i){for(const s of n.filters)if(!s.matches(i))return!1;return!0}(r,e)&&function(n,i){return!(n.startAt&&!function(a,u,c){const d=nc(a,u,c);return a.inclusive?d<=0:d<0}(n.startAt,pr(n),i)||n.endAt&&!function(a,u,c){const d=nc(a,u,c);return a.inclusive?d>=0:d>0}(n.endAt,pr(n),i))}(r,e)}function G_(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function gh(r){return(e,t)=>{let n=!1;for(const i of pr(r)){const s=K_(i,e,t);if(s!==0)return s;n=n||i.field.isKeyField()}return 0}}function K_(r,e,t){const n=r.field.isKeyField()?N.comparator(e.key,t.key):function(s,a,u){const c=a.data.field(s),d=u.data.field(s);return c!==null&&d!==null?Rt(c,d):M()}(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return M()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[i,s]of n)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),i=this.inner[n];if(i===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let i=0;i<n.length;i++)if(this.equalsFn(n[i][0],e))return n.length===1?delete this.inner[t]:n.splice(i,1),this.innerSize--,!0;return!1}forEach(e){Ln(this.inner,(t,n)=>{for(const[i,s]of n)e(i,s)})}isEmpty(){return rh(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $_=new se(N.comparator);function ke(){return $_}const _h=new se(N.comparator);function cr(...r){let e=_h;for(const t of r)e=e.insert(t.key,t);return e}function yh(r){let e=_h;return r.forEach((t,n)=>e=e.insert(t,n.overlayedDocument)),e}function qe(){return gr()}function Ih(){return gr()}function gr(){return new St(r=>r.toString(),(r,e)=>r.isEqual(e))}const H_=new se(N.comparator),W_=new te(N.comparator);function K(...r){let e=W_;for(const t of r)e=e.add(t);return e}const Q_=new te(z);function J_(){return Q_}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Go(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Er(e)?"-0":e}}function vh(r){return{integerValue:""+r}}function Y_(r,e){return c_(e)?vh(e):Go(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ts{constructor(){this._=void 0}}function X_(r,e,t){return r instanceof Pn?function(i,s){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&Uo(s)&&(s=Bo(s)),s&&(a.fields.__previous_value__=s),{mapValue:a}}(t,e):r instanceof Sn?Eh(r,e):r instanceof Cn?wh(r,e):function(i,s){const a=Th(i,s),u=ac(a)+ac(i.Pe);return so(a)&&so(i.Pe)?vh(u):Go(i.serializer,u)}(r,e)}function Z_(r,e,t){return r instanceof Sn?Eh(r,e):r instanceof Cn?wh(r,e):t}function Th(r,e){return r instanceof br?function(n){return so(n)||function(s){return!!s&&"doubleValue"in s}(n)}(e)?e:{integerValue:0}:null}class Pn extends ts{}class Sn extends ts{constructor(e){super(),this.elements=e}}function Eh(r,e){const t=Ah(e);for(const n of r.elements)t.some(i=>Ke(i,n))||t.push(n);return{arrayValue:{values:t}}}class Cn extends ts{constructor(e){super(),this.elements=e}}function wh(r,e){let t=Ah(e);for(const n of r.elements)t=t.filter(i=>!Ke(i,n));return{arrayValue:{values:t}}}class br extends ts{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function ac(r){return ie(r.integerValue||r.doubleValue)}function Ah(r){return Rr(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rh{constructor(e,t){this.field=e,this.transform=t}}function ey(r,e){return r.field.isEqual(e.field)&&function(n,i){return n instanceof Sn&&i instanceof Sn||n instanceof Cn&&i instanceof Cn?wn(n.elements,i.elements,Ke):n instanceof br&&i instanceof br?Ke(n.Pe,i.Pe):n instanceof Pn&&i instanceof Pn}(r.transform,e.transform)}class ty{constructor(e,t){this.version=e,this.transformResults=t}}class Ve{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Ve}static exists(e){return new Ve(void 0,e)}static updateTime(e){return new Ve(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Ei(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class ns{}function bh(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new rs(r.key,Ve.none()):new Fn(r.key,r.data,Ve.none());{const t=r.data,n=Ce.empty();let i=new te(oe.comparator);for(let s of e.fields)if(!i.has(s)){let a=t.field(s);a===null&&s.length>1&&(s=s.popLast(),a=t.field(s)),a===null?n.delete(s):n.set(s,a),i=i.add(s)}return new Ct(r.key,n,new Me(i.toArray()),Ve.none())}}function ny(r,e,t){r instanceof Fn?function(i,s,a){const u=i.value.clone(),c=cc(i.fieldTransforms,s,a.transformResults);u.setAll(c),s.convertToFoundDocument(a.version,u).setHasCommittedMutations()}(r,e,t):r instanceof Ct?function(i,s,a){if(!Ei(i.precondition,s))return void s.convertToUnknownDocument(a.version);const u=cc(i.fieldTransforms,s,a.transformResults),c=s.data;c.setAll(Ph(i)),c.setAll(u),s.convertToFoundDocument(a.version,c).setHasCommittedMutations()}(r,e,t):function(i,s,a){s.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function _r(r,e,t,n){return r instanceof Fn?function(s,a,u,c){if(!Ei(s.precondition,a))return u;const d=s.value.clone(),m=lc(s.fieldTransforms,c,a);return d.setAll(m),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(r,e,t,n):r instanceof Ct?function(s,a,u,c){if(!Ei(s.precondition,a))return u;const d=lc(s.fieldTransforms,c,a),m=a.data;return m.setAll(Ph(s)),m.setAll(d),a.convertToFoundDocument(a.version,m).setHasLocalMutations(),u===null?null:u.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(p=>p.field))}(r,e,t,n):function(s,a,u){return Ei(s.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):u}(r,e,t)}function ry(r,e){let t=null;for(const n of r.fieldTransforms){const i=e.data.field(n.field),s=Th(n.transform,i||null);s!=null&&(t===null&&(t=Ce.empty()),t.set(n.field,s))}return t||null}function uc(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!function(n,i){return n===void 0&&i===void 0||!(!n||!i)&&wn(n,i,(s,a)=>ey(s,a))}(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class Fn extends ns{constructor(e,t,n,i=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Ct extends ns{constructor(e,t,n,i,s=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function Ph(r){const e=new Map;return r.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}}),e}function cc(r,e,t){const n=new Map;L(r.length===t.length);for(let i=0;i<t.length;i++){const s=r[i],a=s.transform,u=e.data.field(s.field);n.set(s.field,Z_(a,u,t[i]))}return n}function lc(r,e,t){const n=new Map;for(const i of r){const s=i.transform,a=t.data.field(i.field);n.set(i.field,X_(s,a,e))}return n}class rs extends ns{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Sh extends ns{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ko{constructor(e,t,n,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=i}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&ny(s,e,n[i])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=_r(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=_r(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=Ih();return this.mutations.forEach(i=>{const s=e.get(i.key),a=s.overlayedDocument;let u=this.applyToLocalView(a,s.mutatedFields);u=t.has(i.key)?null:u;const c=bh(a,u);c!==null&&n.set(i.key,c),a.isValidDocument()||a.convertToNoDocument(U.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),K())}isEqual(e){return this.batchId===e.batchId&&wn(this.mutations,e.mutations,(t,n)=>uc(t,n))&&wn(this.baseMutations,e.baseMutations,(t,n)=>uc(t,n))}}class $o{constructor(e,t,n,i){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=i}static from(e,t,n){L(e.mutations.length===n.length);let i=function(){return H_}();const s=e.mutations;for(let a=0;a<s.length;a++)i=i.insert(s[a].key,n[a].version);return new $o(e,t,n,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ho{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iy{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var le,J;function sy(r){switch(r){default:return M();case S.CANCELLED:case S.UNKNOWN:case S.DEADLINE_EXCEEDED:case S.RESOURCE_EXHAUSTED:case S.INTERNAL:case S.UNAVAILABLE:case S.UNAUTHENTICATED:return!1;case S.INVALID_ARGUMENT:case S.NOT_FOUND:case S.ALREADY_EXISTS:case S.PERMISSION_DENIED:case S.FAILED_PRECONDITION:case S.ABORTED:case S.OUT_OF_RANGE:case S.UNIMPLEMENTED:case S.DATA_LOSS:return!0}}function Ch(r){if(r===void 0)return Re("GRPC error has no .code"),S.UNKNOWN;switch(r){case le.OK:return S.OK;case le.CANCELLED:return S.CANCELLED;case le.UNKNOWN:return S.UNKNOWN;case le.DEADLINE_EXCEEDED:return S.DEADLINE_EXCEEDED;case le.RESOURCE_EXHAUSTED:return S.RESOURCE_EXHAUSTED;case le.INTERNAL:return S.INTERNAL;case le.UNAVAILABLE:return S.UNAVAILABLE;case le.UNAUTHENTICATED:return S.UNAUTHENTICATED;case le.INVALID_ARGUMENT:return S.INVALID_ARGUMENT;case le.NOT_FOUND:return S.NOT_FOUND;case le.ALREADY_EXISTS:return S.ALREADY_EXISTS;case le.PERMISSION_DENIED:return S.PERMISSION_DENIED;case le.FAILED_PRECONDITION:return S.FAILED_PRECONDITION;case le.ABORTED:return S.ABORTED;case le.OUT_OF_RANGE:return S.OUT_OF_RANGE;case le.UNIMPLEMENTED:return S.UNIMPLEMENTED;case le.DATA_LOSS:return S.DATA_LOSS;default:return M()}}(J=le||(le={}))[J.OK=0]="OK",J[J.CANCELLED=1]="CANCELLED",J[J.UNKNOWN=2]="UNKNOWN",J[J.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",J[J.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",J[J.NOT_FOUND=5]="NOT_FOUND",J[J.ALREADY_EXISTS=6]="ALREADY_EXISTS",J[J.PERMISSION_DENIED=7]="PERMISSION_DENIED",J[J.UNAUTHENTICATED=16]="UNAUTHENTICATED",J[J.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",J[J.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",J[J.ABORTED=10]="ABORTED",J[J.OUT_OF_RANGE=11]="OUT_OF_RANGE",J[J.UNIMPLEMENTED=12]="UNIMPLEMENTED",J[J.INTERNAL=13]="INTERNAL",J[J.UNAVAILABLE=14]="UNAVAILABLE",J[J.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oy(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ay=new zt([4294967295,4294967295],0);function hc(r){const e=oy().encode(r),t=new Bl;return t.update(e),new Uint8Array(t.digest())}function dc(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new zt([t,n],0),new zt([i,s],0)]}class Wo{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new lr(`Invalid padding: ${t}`);if(n<0)throw new lr(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new lr(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new lr(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=zt.fromNumber(this.Ie)}Ee(e,t,n){let i=e.add(t.multiply(zt.fromNumber(n)));return i.compare(ay)===1&&(i=new zt([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=hc(e),[n,i]=dc(t);for(let s=0;s<this.hashCount;s++){const a=this.Ee(n,i,s);if(!this.de(a))return!1}return!0}static create(e,t,n){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),a=new Wo(s,i,t);return n.forEach(u=>a.insert(u)),a}insert(e){if(this.Ie===0)return;const t=hc(e),[n,i]=dc(t);for(let s=0;s<this.hashCount;s++){const a=this.Ee(n,i,s);this.Ae(a)}}Ae(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class lr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class is{constructor(e,t,n,i,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const i=new Map;return i.set(e,Nr.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new is(U.min(),i,new se(z),ke(),K())}}class Nr{constructor(e,t,n,i,s){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new Nr(n,t,K(),K(),K())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wi{constructor(e,t,n,i){this.Re=e,this.removedTargetIds=t,this.key=n,this.Ve=i}}class Vh{constructor(e,t){this.targetId=e,this.me=t}}class Dh{constructor(e,t,n=he.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=i}}class fc{constructor(){this.fe=0,this.ge=pc(),this.pe=he.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=K(),t=K(),n=K();return this.ge.forEach((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:n=n.add(i);break;default:M()}}),new Nr(this.pe,this.ye,e,t,n)}Ce(){this.we=!1,this.ge=pc()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,L(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class uy{constructor(e){this.Le=e,this.Be=new Map,this.ke=ke(),this.qe=mc(),this.Qe=new se(z)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const n=this.Ge(t);switch(e.state){case 0:this.ze(t)&&n.De(e.resumeToken);break;case 1:n.Oe(),n.Se||n.Ce(),n.De(e.resumeToken);break;case 2:n.Oe(),n.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(n.Ne(),n.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),n.De(e.resumeToken));break;default:M()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((n,i)=>{this.ze(i)&&t(i)})}He(e){const t=e.targetId,n=e.me.count,i=this.Je(t);if(i){const s=i.target;if(Mi(s))if(n===0){const a=new N(s.path);this.Ue(t,a,ce.newNoDocument(a,U.min()))}else L(n===1);else{const a=this.Ye(t);if(a!==n){const u=this.Ze(e),c=u?this.Xe(u,e,a):1;if(c!==0){this.je(t);const d=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,d)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:i=0},hashCount:s=0}=t;let a,u;try{a=At(n).toUint8Array()}catch(c){if(c instanceof ih)return Ht("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{u=new Wo(a,i,s)}catch(c){return Ht(c instanceof lr?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return u.Ie===0?null:u}Xe(e,t,n){return t.me.count===n-this.nt(e,t.targetId)?0:2}nt(e,t){const n=this.Le.getRemoteKeysForTarget(t);let i=0;return n.forEach(s=>{const a=this.Le.tt(),u=`projects/${a.projectId}/databases/${a.database}/documents/${s.path.canonicalString()}`;e.mightContain(u)||(this.Ue(t,s,null),i++)}),i}rt(e){const t=new Map;this.Be.forEach((s,a)=>{const u=this.Je(a);if(u){if(s.current&&Mi(u.target)){const c=new N(u.target.path);this.ke.get(c)!==null||this.it(a,c)||this.Ue(a,c,ce.newNoDocument(c,e))}s.be&&(t.set(a,s.ve()),s.Ce())}});let n=K();this.qe.forEach((s,a)=>{let u=!0;a.forEachWhile(c=>{const d=this.Je(c);return!d||d.purpose==="TargetPurposeLimboResolution"||(u=!1,!1)}),u&&(n=n.add(s))}),this.ke.forEach((s,a)=>a.setReadTime(e));const i=new is(e,t,this.Qe,this.ke,n);return this.ke=ke(),this.qe=mc(),this.Qe=new se(z),i}$e(e,t){if(!this.ze(e))return;const n=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,n),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,n){if(!this.ze(e))return;const i=this.Ge(e);this.it(e,t)?i.Fe(t,1):i.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),n&&(this.ke=this.ke.insert(t,n))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new fc,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new te(z),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||C("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new fc),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function mc(){return new se(N.comparator)}function pc(){return new se(N.comparator)}const cy={asc:"ASCENDING",desc:"DESCENDING"},ly={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},hy={and:"AND",or:"OR"};class dy{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function lo(r,e){return r.useProto3Json||Yi(e)?e:{value:e}}function Vn(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function kh(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function fy(r,e){return Vn(r,e.toTimestamp())}function Pe(r){return L(!!r),U.fromTimestamp(function(t){const n=it(t);return new ae(n.seconds,n.nanos)}(r))}function Qo(r,e){return ho(r,e).canonicalString()}function ho(r,e){const t=function(i){return new Z(["projects",i.projectId,"databases",i.database])}(r).child("documents");return e===void 0?t:t.child(e)}function xh(r){const e=Z.fromString(r);return L(qh(e)),e}function Fi(r,e){return Qo(r.databaseId,e.path)}function Gt(r,e){const t=xh(e);if(t.get(1)!==r.databaseId.projectId)throw new O(S.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new O(S.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new N(Mh(t))}function Nh(r,e){return Qo(r.databaseId,e)}function Oh(r){const e=xh(r);return e.length===4?Z.emptyPath():Mh(e)}function fo(r){return new Z(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function Mh(r){return L(r.length>4&&r.get(4)==="documents"),r.popFirst(5)}function gc(r,e,t){return{name:Fi(r,e),fields:t.value.mapValue.fields}}function my(r,e,t){const n=Gt(r,e.name),i=Pe(e.updateTime),s=e.createTime?Pe(e.createTime):U.min(),a=new Ce({mapValue:{fields:e.fields}}),u=ce.newFoundDocument(n,i,s,a);return t&&u.setHasCommittedMutations(),t?u.setHasCommittedMutations():u}function py(r,e){let t;if("targetChange"in e){e.targetChange;const n=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:M()}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=function(d,m){return d.useProto3Json?(L(m===void 0||typeof m=="string"),he.fromBase64String(m||"")):(L(m===void 0||m instanceof Buffer||m instanceof Uint8Array),he.fromUint8Array(m||new Uint8Array))}(r,e.targetChange.resumeToken),a=e.targetChange.cause,u=a&&function(d){const m=d.code===void 0?S.UNKNOWN:Ch(d.code);return new O(m,d.message||"")}(a);t=new Dh(n,i,s,u||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const i=Gt(r,n.document.name),s=Pe(n.document.updateTime),a=n.document.createTime?Pe(n.document.createTime):U.min(),u=new Ce({mapValue:{fields:n.document.fields}}),c=ce.newFoundDocument(i,s,a,u),d=n.targetIds||[],m=n.removedTargetIds||[];t=new wi(d,m,c.key,c)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const i=Gt(r,n.document),s=n.readTime?Pe(n.readTime):U.min(),a=ce.newNoDocument(i,s),u=n.removedTargetIds||[];t=new wi([],u,a.key,a)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const i=Gt(r,n.document),s=n.removedTargetIds||[];t=new wi([],s,i,null)}else{if(!("filter"in e))return M();{e.filter;const n=e.filter;n.targetId;const{count:i=0,unchangedNames:s}=n,a=new iy(i,s),u=n.targetId;t=new Vh(u,a)}}return t}function Ui(r,e){let t;if(e instanceof Fn)t={update:gc(r,e.key,e.value)};else if(e instanceof rs)t={delete:Fi(r,e.key)};else if(e instanceof Ct)t={update:gc(r,e.key,e.data),updateMask:Ty(e.fieldMask)};else{if(!(e instanceof Sh))return M();t={verify:Fi(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(n=>function(s,a){const u=a.transform;if(u instanceof Pn)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(u instanceof Sn)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:u.elements}};if(u instanceof Cn)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:u.elements}};if(u instanceof br)return{fieldPath:a.field.canonicalString(),increment:u.Pe};throw M()}(0,n))),e.precondition.isNone||(t.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:fy(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:M()}(r,e.precondition)),t}function mo(r,e){const t=e.currentDocument?function(s){return s.updateTime!==void 0?Ve.updateTime(Pe(s.updateTime)):s.exists!==void 0?Ve.exists(s.exists):Ve.none()}(e.currentDocument):Ve.none(),n=e.updateTransforms?e.updateTransforms.map(i=>function(a,u){let c=null;if("setToServerValue"in u)L(u.setToServerValue==="REQUEST_TIME"),c=new Pn;else if("appendMissingElements"in u){const m=u.appendMissingElements.values||[];c=new Sn(m)}else if("removeAllFromArray"in u){const m=u.removeAllFromArray.values||[];c=new Cn(m)}else"increment"in u?c=new br(a,u.increment):M();const d=oe.fromServerFormat(u.fieldPath);return new Rh(d,c)}(r,i)):[];if(e.update){e.update.name;const i=Gt(r,e.update.name),s=new Ce({mapValue:{fields:e.update.fields}});if(e.updateMask){const a=function(c){const d=c.fieldPaths||[];return new Me(d.map(m=>oe.fromServerFormat(m)))}(e.updateMask);return new Ct(i,s,a,t,n)}return new Fn(i,s,t,n)}if(e.delete){const i=Gt(r,e.delete);return new rs(i,t)}if(e.verify){const i=Gt(r,e.verify);return new Sh(i,t)}return M()}function gy(r,e){return r&&r.length>0?(L(e!==void 0),r.map(t=>function(i,s){let a=i.updateTime?Pe(i.updateTime):Pe(s);return a.isEqual(U.min())&&(a=Pe(s)),new ty(a,i.transformResults||[])}(t,e))):[]}function Lh(r,e){return{documents:[Nh(r,e.path)]}}function Fh(r,e){const t={structuredQuery:{}},n=e.path;let i;e.collectionGroup!==null?(i=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=Nh(r,i);const s=function(d){if(d.length!==0)return jh(ee.create(d,"and"))}(e.filters);s&&(t.structuredQuery.where=s);const a=function(d){if(d.length!==0)return d.map(m=>function(E){return{field:mn(E.field),direction:yy(E.dir)}}(m))}(e.orderBy);a&&(t.structuredQuery.orderBy=a);const u=lo(r,e.limit);return u!==null&&(t.structuredQuery.limit=u),e.startAt&&(t.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{_t:t,parent:i}}function Uh(r){let e=Oh(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let i=null;if(n>0){L(n===1);const m=t.from[0];m.allDescendants?i=m.collectionId:e=e.child(m.collectionId)}let s=[];t.where&&(s=function(p){const E=Bh(p);return E instanceof ee&&qo(E)?E.getFilters():[E]}(t.where));let a=[];t.orderBy&&(a=function(p){return p.map(E=>function(V){return new Oi(pn(V.field),function(D){switch(D){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(V.direction))}(E))}(t.orderBy));let u=null;t.limit&&(u=function(p){let E;return E=typeof p=="object"?p.value:p,Yi(E)?null:E}(t.limit));let c=null;t.startAt&&(c=function(p){const E=!!p.before,P=p.values||[];return new Rn(P,E)}(t.startAt));let d=null;return t.endAt&&(d=function(p){const E=!p.before,P=p.values||[];return new Rn(P,E)}(t.endAt)),j_(e,i,a,s,u,"F",c,d)}function _y(r,e){const t=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return M()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Bh(r){return r.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=pn(t.unaryFilter.field);return W.create(n,"==",{doubleValue:NaN});case"IS_NULL":const i=pn(t.unaryFilter.field);return W.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=pn(t.unaryFilter.field);return W.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=pn(t.unaryFilter.field);return W.create(a,"!=",{nullValue:"NULL_VALUE"});default:return M()}}(r):r.fieldFilter!==void 0?function(t){return W.create(pn(t.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return M()}}(t.fieldFilter.op),t.fieldFilter.value)}(r):r.compositeFilter!==void 0?function(t){return ee.create(t.compositeFilter.filters.map(n=>Bh(n)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return M()}}(t.compositeFilter.op))}(r):M()}function yy(r){return cy[r]}function Iy(r){return ly[r]}function vy(r){return hy[r]}function mn(r){return{fieldPath:r.canonicalString()}}function pn(r){return oe.fromServerFormat(r.fieldPath)}function jh(r){return r instanceof W?function(t){if(t.op==="=="){if(Zu(t.value))return{unaryFilter:{field:mn(t.field),op:"IS_NAN"}};if(Xu(t.value))return{unaryFilter:{field:mn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Zu(t.value))return{unaryFilter:{field:mn(t.field),op:"IS_NOT_NAN"}};if(Xu(t.value))return{unaryFilter:{field:mn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:mn(t.field),op:Iy(t.op),value:t.value}}}(r):r instanceof ee?function(t){const n=t.getFilters().map(i=>jh(i));return n.length===1?n[0]:{compositeFilter:{op:vy(t.op),filters:n}}}(r):M()}function Ty(r){const e=[];return r.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function qh(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze{constructor(e,t,n,i,s=U.min(),a=U.min(),u=he.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=u,this.expectedCount=c}withSequenceNumber(e){return new Ze(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Ze(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Ze(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Ze(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zh{constructor(e){this.ct=e}}function Ey(r,e){let t;if(e.document)t=my(r.ct,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const n=N.fromSegments(e.noDocument.path),i=Xt(e.noDocument.readTime);t=ce.newNoDocument(n,i),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return M();{const n=N.fromSegments(e.unknownDocument.path),i=Xt(e.unknownDocument.version);t=ce.newUnknownDocument(n,i)}}return e.readTime&&t.setReadTime(function(i){const s=new ae(i[0],i[1]);return U.fromTimestamp(s)}(e.readTime)),t}function _c(r,e){const t=e.key,n={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:Bi(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())n.document=function(s,a){return{name:Fi(s,a.key),fields:a.data.value.mapValue.fields,updateTime:Vn(s,a.version.toTimestamp()),createTime:Vn(s,a.createTime.toTimestamp())}}(r.ct,e);else if(e.isNoDocument())n.noDocument={path:t.path.toArray(),readTime:Yt(e.version)};else{if(!e.isUnknownDocument())return M();n.unknownDocument={path:t.path.toArray(),version:Yt(e.version)}}return n}function Bi(r){const e=r.toTimestamp();return[e.seconds,e.nanoseconds]}function Yt(r){const e=r.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function Xt(r){const e=new ae(r.seconds,r.nanoseconds);return U.fromTimestamp(e)}function Ft(r,e){const t=(e.baseMutations||[]).map(s=>mo(r.ct,s));for(let s=0;s<e.mutations.length-1;++s){const a=e.mutations[s];if(s+1<e.mutations.length&&e.mutations[s+1].transform!==void 0){const u=e.mutations[s+1];a.updateTransforms=u.transform.fieldTransforms,e.mutations.splice(s+1,1),++s}}const n=e.mutations.map(s=>mo(r.ct,s)),i=ae.fromMillis(e.localWriteTimeMs);return new Ko(e.batchId,i,t,n)}function hr(r){const e=Xt(r.readTime),t=r.lastLimboFreeSnapshotVersion!==void 0?Xt(r.lastLimboFreeSnapshotVersion):U.min();let n;return n=function(s){return s.documents!==void 0}(r.query)?function(s){return L(s.documents.length===1),Le(zo(Oh(s.documents[0])))}(r.query):function(s){return Le(Uh(s))}(r.query),new Ze(n,r.targetId,"TargetPurposeListen",r.lastListenSequenceNumber,e,t,he.fromBase64String(r.resumeToken))}function Gh(r,e){const t=Yt(e.snapshotVersion),n=Yt(e.lastLimboFreeSnapshotVersion);let i;i=Mi(e.target)?Lh(r.ct,e.target):Fh(r.ct,e.target)._t;const s=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:Jt(e.target),readTime:t,resumeToken:s,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:i}}function Kh(r){const e=Uh({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?co(e,e.limit,"L"):e}function zs(r,e){return new Ho(e.largestBatchId,mo(r.ct,e.overlayMutation))}function yc(r,e){const t=e.path.lastSegment();return[r,be(e.path.popLast()),t]}function Ic(r,e,t,n){return{indexId:r,uid:e,sequenceNumber:t,readTime:Yt(n.readTime),documentKey:be(n.documentKey.path),largestBatchId:n.largestBatchId}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wy{getBundleMetadata(e,t){return vc(e).get(t).next(n=>{if(n)return function(s){return{id:s.bundleId,createTime:Xt(s.createTime),version:s.version}}(n)})}saveBundleMetadata(e,t){return vc(e).put(function(i){return{bundleId:i.id,createTime:Yt(Pe(i.createTime)),version:i.version}}(t))}getNamedQuery(e,t){return Tc(e).get(t).next(n=>{if(n)return function(s){return{name:s.name,query:Kh(s.bundledQuery),readTime:Xt(s.readTime)}}(n)})}saveNamedQuery(e,t){return Tc(e).put(function(i){return{name:i.name,readTime:Yt(Pe(i.readTime)),bundledQuery:i.bundledQuery}}(t))}}function vc(r){return fe(r,"bundles")}function Tc(r){return fe(r,"namedQueries")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ss{constructor(e,t){this.serializer=e,this.userId=t}static lt(e,t){const n=t.uid||"";return new ss(e,n)}getOverlay(e,t){return rr(e).get(yc(this.userId,t)).next(n=>n?zs(this.serializer,n):null)}getOverlays(e,t){const n=qe();return A.forEach(t,i=>this.getOverlay(e,i).next(s=>{s!==null&&n.set(i,s)})).next(()=>n)}saveOverlays(e,t,n){const i=[];return n.forEach((s,a)=>{const u=new Ho(t,a);i.push(this.ht(e,u))}),A.waitFor(i)}removeOverlaysForBatchId(e,t,n){const i=new Set;t.forEach(a=>i.add(be(a.getCollectionPath())));const s=[];return i.forEach(a=>{const u=IDBKeyRange.bound([this.userId,a,n],[this.userId,a,n+1],!1,!0);s.push(rr(e).j("collectionPathOverlayIndex",u))}),A.waitFor(s)}getOverlaysForCollection(e,t,n){const i=qe(),s=be(t),a=IDBKeyRange.bound([this.userId,s,n],[this.userId,s,Number.POSITIVE_INFINITY],!0);return rr(e).U("collectionPathOverlayIndex",a).next(u=>{for(const c of u){const d=zs(this.serializer,c);i.set(d.getKey(),d)}return i})}getOverlaysForCollectionGroup(e,t,n,i){const s=qe();let a;const u=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return rr(e).J({index:"collectionGroupOverlayIndex",range:u},(c,d,m)=>{const p=zs(this.serializer,d);s.size()<i||p.largestBatchId===a?(s.set(p.getKey(),p),a=p.largestBatchId):m.done()}).next(()=>s)}ht(e,t){return rr(e).put(function(i,s,a){const[u,c,d]=yc(s,a.mutation.key);return{userId:s,collectionPath:c,documentId:d,collectionGroup:a.mutation.key.getCollectionGroup(),largestBatchId:a.largestBatchId,overlayMutation:Ui(i.ct,a.mutation)}}(this.serializer,this.userId,t))}}function rr(r){return fe(r,"documentOverlays")}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ay{Pt(e){return fe(e,"globals")}getSessionToken(e){return this.Pt(e).get("sessionToken").next(t=>{const n=t==null?void 0:t.value;return n?he.fromUint8Array(n):he.EMPTY_BYTE_STRING})}setSessionToken(e,t){return this.Pt(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ut{constructor(){}It(e,t){this.Tt(e,t),t.Et()}Tt(e,t){if("nullValue"in e)this.dt(t,5);else if("booleanValue"in e)this.dt(t,10),t.At(e.booleanValue?1:0);else if("integerValue"in e)this.dt(t,15),t.At(ie(e.integerValue));else if("doubleValue"in e){const n=ie(e.doubleValue);isNaN(n)?this.dt(t,13):(this.dt(t,15),Er(n)?t.At(0):t.At(n))}else if("timestampValue"in e){let n=e.timestampValue;this.dt(t,20),typeof n=="string"&&(n=it(n)),t.Rt(`${n.seconds||""}`),t.At(n.nanos||0)}else if("stringValue"in e)this.Vt(e.stringValue,t),this.ft(t);else if("bytesValue"in e)this.dt(t,30),t.gt(At(e.bytesValue)),this.ft(t);else if("referenceValue"in e)this.yt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.dt(t,45),t.At(n.latitude||0),t.At(n.longitude||0)}else"mapValue"in e?sh(e)?this.dt(t,Number.MAX_SAFE_INTEGER):Xi(e)?this.wt(e.mapValue,t):(this.St(e.mapValue,t),this.ft(t)):"arrayValue"in e?(this.bt(e.arrayValue,t),this.ft(t)):M()}Vt(e,t){this.dt(t,25),this.Dt(e,t)}Dt(e,t){t.Rt(e)}St(e,t){const n=e.fields||{};this.dt(t,55);for(const i of Object.keys(n))this.Vt(i,t),this.Tt(n[i],t)}wt(e,t){var n,i;const s=e.fields||{};this.dt(t,53);const a="value",u=((i=(n=s[a].arrayValue)===null||n===void 0?void 0:n.values)===null||i===void 0?void 0:i.length)||0;this.dt(t,15),t.At(ie(u)),this.Vt(a,t),this.Tt(s[a],t)}bt(e,t){const n=e.values||[];this.dt(t,50);for(const i of n)this.Tt(i,t)}yt(e,t){this.dt(t,37),N.fromName(e).path.forEach(n=>{this.dt(t,60),this.Dt(n,t)})}dt(e,t){e.At(t)}ft(e){e.At(2)}}Ut.vt=new Ut;function Ry(r){if(r===0)return 8;let e=0;return!(r>>4)&&(e+=4,r<<=4),!(r>>6)&&(e+=2,r<<=2),!(r>>7)&&(e+=1),e}function Ec(r){const e=64-function(n){let i=0;for(let s=0;s<8;++s){const a=Ry(255&n[s]);if(i+=a,a!==8)break}return i}(r);return Math.ceil(e/8)}class by{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Ct(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Ft(n.value),n=t.next();this.Mt()}xt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Ot(n.value),n=t.next();this.Nt()}Lt(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Ft(n);else if(n<2048)this.Ft(960|n>>>6),this.Ft(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Ft(480|n>>>12),this.Ft(128|63&n>>>6),this.Ft(128|63&n);else{const i=t.codePointAt(0);this.Ft(240|i>>>18),this.Ft(128|63&i>>>12),this.Ft(128|63&i>>>6),this.Ft(128|63&i)}}this.Mt()}Bt(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Ot(n);else if(n<2048)this.Ot(960|n>>>6),this.Ot(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Ot(480|n>>>12),this.Ot(128|63&n>>>6),this.Ot(128|63&n);else{const i=t.codePointAt(0);this.Ot(240|i>>>18),this.Ot(128|63&i>>>12),this.Ot(128|63&i>>>6),this.Ot(128|63&i)}}this.Nt()}kt(e){const t=this.qt(e),n=Ec(t);this.Qt(1+n),this.buffer[this.position++]=255&n;for(let i=t.length-n;i<t.length;++i)this.buffer[this.position++]=255&t[i]}Kt(e){const t=this.qt(e),n=Ec(t);this.Qt(1+n),this.buffer[this.position++]=~(255&n);for(let i=t.length-n;i<t.length;++i)this.buffer[this.position++]=~(255&t[i])}$t(){this.Ut(255),this.Ut(255)}Wt(){this.Gt(255),this.Gt(255)}reset(){this.position=0}seed(e){this.Qt(e.length),this.buffer.set(e,this.position),this.position+=e.length}zt(){return this.buffer.slice(0,this.position)}qt(e){const t=function(s){const a=new DataView(new ArrayBuffer(8));return a.setFloat64(0,s,!1),new Uint8Array(a.buffer)}(e),n=(128&t[0])!=0;t[0]^=n?255:128;for(let i=1;i<t.length;++i)t[i]^=n?255:0;return t}Ft(e){const t=255&e;t===0?(this.Ut(0),this.Ut(255)):t===255?(this.Ut(255),this.Ut(0)):this.Ut(t)}Ot(e){const t=255&e;t===0?(this.Gt(0),this.Gt(255)):t===255?(this.Gt(255),this.Gt(0)):this.Gt(e)}Mt(){this.Ut(0),this.Ut(1)}Nt(){this.Gt(0),this.Gt(1)}Ut(e){this.Qt(1),this.buffer[this.position++]=e}Gt(e){this.Qt(1),this.buffer[this.position++]=~e}Qt(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const i=new Uint8Array(n);i.set(this.buffer),this.buffer=i}}class Py{constructor(e){this.jt=e}gt(e){this.jt.Ct(e)}Rt(e){this.jt.Lt(e)}At(e){this.jt.kt(e)}Et(){this.jt.$t()}}class Sy{constructor(e){this.jt=e}gt(e){this.jt.xt(e)}Rt(e){this.jt.Bt(e)}At(e){this.jt.Kt(e)}Et(){this.jt.Wt()}}class ir{constructor(){this.jt=new by,this.Ht=new Py(this.jt),this.Jt=new Sy(this.jt)}seed(e){this.jt.seed(e)}Yt(e){return e===0?this.Ht:this.Jt}zt(){return this.jt.zt()}reset(){this.jt.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bt{constructor(e,t,n,i){this.indexId=e,this.documentKey=t,this.arrayValue=n,this.directionalValue=i}Zt(){const e=this.directionalValue.length,t=e===0||this.directionalValue[e-1]===255?e+1:e,n=new Uint8Array(t);return n.set(this.directionalValue,0),t!==e?n.set([0],this.directionalValue.length):++n[n.length-1],new Bt(this.indexId,this.documentKey,this.arrayValue,n)}}function ht(r,e){let t=r.indexId-e.indexId;return t!==0?t:(t=wc(r.arrayValue,e.arrayValue),t!==0?t:(t=wc(r.directionalValue,e.directionalValue),t!==0?t:N.comparator(r.documentKey,e.documentKey)))}function wc(r,e){for(let t=0;t<r.length&&t<e.length;++t){const n=r[t]-e[t];if(n!==0)return n}return r.length-e.length}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ac{constructor(e){this.Xt=new te((t,n)=>oe.comparator(t.field,n.field)),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.en=e.orderBy,this.tn=[];for(const t of e.filters){const n=t;n.isInequality()?this.Xt=this.Xt.add(n):this.tn.push(n)}}get nn(){return this.Xt.size>1}rn(e){if(L(e.collectionGroup===this.collectionId),this.nn)return!1;const t=no(e);if(t!==void 0&&!this.sn(t))return!1;const n=Mt(e);let i=new Set,s=0,a=0;for(;s<n.length&&this.sn(n[s]);++s)i=i.add(n[s].fieldPath.canonicalString());if(s===n.length)return!0;if(this.Xt.size>0){const u=this.Xt.getIterator().getNext();if(!i.has(u.field.canonicalString())){const c=n[s];if(!this.on(u,c)||!this._n(this.en[a++],c))return!1}++s}for(;s<n.length;++s){const u=n[s];if(a>=this.en.length||!this._n(this.en[a++],u))return!1}return!0}an(){if(this.nn)return null;let e=new te(oe.comparator);const t=[];for(const n of this.tn)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")t.push(new yi(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new yi(n.field,0))}for(const n of this.en)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new yi(n.field,n.dir==="asc"?0:1)));return new Ni(Ni.UNKNOWN_ID,this.collectionId,t,Tr.empty())}sn(e){for(const t of this.tn)if(this.on(t,e))return!0;return!1}on(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const n=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===n}_n(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $h(r){var e,t;if(L(r instanceof W||r instanceof ee),r instanceof W){if(r instanceof mh){const i=((t=(e=r.value.arrayValue)===null||e===void 0?void 0:e.values)===null||t===void 0?void 0:t.map(s=>W.create(r.field,"==",s)))||[];return ee.create(i,"or")}return r}const n=r.filters.map(i=>$h(i));return ee.create(n,r.op)}function Cy(r){if(r.getFilters().length===0)return[];const e=_o($h(r));return L(Hh(e)),po(e)||go(e)?[e]:e.getFilters()}function po(r){return r instanceof W}function go(r){return r instanceof ee&&qo(r)}function Hh(r){return po(r)||go(r)||function(t){if(t instanceof ee&&oo(t)){for(const n of t.getFilters())if(!po(n)&&!go(n))return!1;return!0}return!1}(r)}function _o(r){if(L(r instanceof W||r instanceof ee),r instanceof W)return r;if(r.filters.length===1)return _o(r.filters[0]);const e=r.filters.map(n=>_o(n));let t=ee.create(e,r.op);return t=ji(t),Hh(t)?t:(L(t instanceof ee),L(bn(t)),L(t.filters.length>1),t.filters.reduce((n,i)=>Jo(n,i)))}function Jo(r,e){let t;return L(r instanceof W||r instanceof ee),L(e instanceof W||e instanceof ee),t=r instanceof W?e instanceof W?function(i,s){return ee.create([i,s],"and")}(r,e):Rc(r,e):e instanceof W?Rc(e,r):function(i,s){if(L(i.filters.length>0&&s.filters.length>0),bn(i)&&bn(s))return hh(i,s.getFilters());const a=oo(i)?i:s,u=oo(i)?s:i,c=a.filters.map(d=>Jo(d,u));return ee.create(c,"or")}(r,e),ji(t)}function Rc(r,e){if(bn(e))return hh(e,r.getFilters());{const t=e.filters.map(n=>Jo(r,n));return ee.create(t,"or")}}function ji(r){if(L(r instanceof W||r instanceof ee),r instanceof W)return r;const e=r.getFilters();if(e.length===1)return ji(e[0]);if(ch(r))return r;const t=e.map(i=>ji(i)),n=[];return t.forEach(i=>{i instanceof W?n.push(i):i instanceof ee&&(i.op===r.op?n.push(...i.filters):n.push(i))}),n.length===1?n[0]:ee.create(n,r.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vy{constructor(){this.un=new Yo}addToCollectionParentIndex(e,t){return this.un.add(t),A.resolve()}getCollectionParents(e,t){return A.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return A.resolve()}deleteFieldIndex(e,t){return A.resolve()}deleteAllFieldIndexes(e){return A.resolve()}createTargetIndexes(e,t){return A.resolve()}getDocumentsMatchingTarget(e,t){return A.resolve(null)}getIndexType(e,t){return A.resolve(0)}getFieldIndexes(e,t){return A.resolve([])}getNextCollectionGroupToUpdate(e){return A.resolve(null)}getMinOffset(e,t){return A.resolve(Ne.min())}getMinOffsetFromCollectionGroup(e,t){return A.resolve(Ne.min())}updateCollectionGroup(e,t,n){return A.resolve()}updateIndexEntries(e,t){return A.resolve()}}class Yo{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),i=this.index[t]||new te(Z.comparator),s=!i.has(n);return this.index[t]=i.add(n),s}has(e){const t=e.lastSegment(),n=e.popLast(),i=this.index[t];return i&&i.has(n)}getEntries(e){return(this.index[e]||new te(Z.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ai=new Uint8Array(0);class Dy{constructor(e,t){this.databaseId=t,this.cn=new Yo,this.ln=new St(n=>Jt(n),(n,i)=>kr(n,i)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.cn.has(t)){const n=t.lastSegment(),i=t.popLast();e.addOnCommittedListener(()=>{this.cn.add(t)});const s={collectionId:n,parent:be(i)};return bc(e).put(s)}return A.resolve()}getCollectionParents(e,t){const n=[],i=IDBKeyRange.bound([t,""],[Wl(t),""],!1,!0);return bc(e).U(i).next(s=>{for(const a of s){if(a.collectionId!==t)break;n.push(je(a.parent))}return n})}addFieldIndex(e,t){const n=sr(e),i=function(u){return{indexId:u.indexId,collectionGroup:u.collectionGroup,fields:u.fields.map(c=>[c.fieldPath.canonicalString(),c.kind])}}(t);delete i.indexId;const s=n.add(i);if(t.indexState){const a=ln(e);return s.next(u=>{a.put(Ic(u,this.uid,t.indexState.sequenceNumber,t.indexState.offset))})}return s.next()}deleteFieldIndex(e,t){const n=sr(e),i=ln(e),s=cn(e);return n.delete(t.indexId).next(()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){const t=sr(e),n=cn(e),i=ln(e);return t.j().next(()=>n.j()).next(()=>i.j())}createTargetIndexes(e,t){return A.forEach(this.hn(t),n=>this.getIndexType(e,n).next(i=>{if(i===0||i===1){const s=new Ac(n).an();if(s!=null)return this.addFieldIndex(e,s)}}))}getDocumentsMatchingTarget(e,t){const n=cn(e);let i=!0;const s=new Map;return A.forEach(this.hn(t),a=>this.Pn(e,a).next(u=>{i&&(i=!!u),s.set(a,u)})).next(()=>{if(i){let a=K();const u=[];return A.forEach(s,(c,d)=>{C("IndexedDbIndexManager",`Using index ${function(F){return`id=${F.indexId}|cg=${F.collectionGroup}|f=${F.fields.map(Q=>`${Q.fieldPath}:${Q.kind}`).join(",")}`}(c)} to execute ${Jt(t)}`);const m=function(F,Q){const X=no(Q);if(X===void 0)return null;for(const $ of Li(F,X.fieldPath))switch($.op){case"array-contains-any":return $.value.arrayValue.values||[];case"array-contains":return[$.value]}return null}(d,c),p=function(F,Q){const X=new Map;for(const $ of Mt(Q))for(const I of Li(F,$.fieldPath))switch(I.op){case"==":case"in":X.set($.fieldPath.canonicalString(),I.value);break;case"not-in":case"!=":return X.set($.fieldPath.canonicalString(),I.value),Array.from(X.values())}return null}(d,c),E=function(F,Q){const X=[];let $=!0;for(const I of Mt(Q)){const g=I.kind===0?ic(F,I.fieldPath,F.startAt):sc(F,I.fieldPath,F.startAt);X.push(g.value),$&&($=g.inclusive)}return new Rn(X,$)}(d,c),P=function(F,Q){const X=[];let $=!0;for(const I of Mt(Q)){const g=I.kind===0?sc(F,I.fieldPath,F.endAt):ic(F,I.fieldPath,F.endAt);X.push(g.value),$&&($=g.inclusive)}return new Rn(X,$)}(d,c),V=this.In(c,d,E),x=this.In(c,d,P),D=this.Tn(c,d,p),G=this.En(c.indexId,m,V,E.inclusive,x,P.inclusive,D);return A.forEach(G,j=>n.G(j,t.limit).next(F=>{F.forEach(Q=>{const X=N.fromSegments(Q.documentKey);a.has(X)||(a=a.add(X),u.push(X))})}))}).next(()=>u)}return A.resolve(null)})}hn(e){let t=this.ln.get(e);return t||(e.filters.length===0?t=[e]:t=Cy(ee.create(e.filters,"and")).map(n=>uo(e.path,e.collectionGroup,e.orderBy,n.getFilters(),e.limit,e.startAt,e.endAt)),this.ln.set(e,t),t)}En(e,t,n,i,s,a,u){const c=(t!=null?t.length:1)*Math.max(n.length,s.length),d=c/(t!=null?t.length:1),m=[];for(let p=0;p<c;++p){const E=t?this.dn(t[p/d]):ai,P=this.An(e,E,n[p%d],i),V=this.Rn(e,E,s[p%d],a),x=u.map(D=>this.An(e,E,D,!0));m.push(...this.createRange(P,V,x))}return m}An(e,t,n,i){const s=new Bt(e,N.empty(),t,n);return i?s:s.Zt()}Rn(e,t,n,i){const s=new Bt(e,N.empty(),t,n);return i?s.Zt():s}Pn(e,t){const n=new Ac(t),i=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,i).next(s=>{let a=null;for(const u of s)n.rn(u)&&(!a||u.fields.length>a.fields.length)&&(a=u);return a})}getIndexType(e,t){let n=2;const i=this.hn(t);return A.forEach(i,s=>this.Pn(e,s).next(a=>{a?n!==0&&a.fields.length<function(c){let d=new te(oe.comparator),m=!1;for(const p of c.filters)for(const E of p.getFlattenedFilters())E.field.isKeyField()||(E.op==="array-contains"||E.op==="array-contains-any"?m=!0:d=d.add(E.field));for(const p of c.orderBy)p.field.isKeyField()||(d=d.add(p.field));return d.size+(m?1:0)}(s)&&(n=1):n=0})).next(()=>function(a){return a.limit!==null}(t)&&i.length>1&&n===2?1:n)}Vn(e,t){const n=new ir;for(const i of Mt(e)){const s=t.data.field(i.fieldPath);if(s==null)return null;const a=n.Yt(i.kind);Ut.vt.It(s,a)}return n.zt()}dn(e){const t=new ir;return Ut.vt.It(e,t.Yt(0)),t.zt()}mn(e,t){const n=new ir;return Ut.vt.It(jo(this.databaseId,t),n.Yt(function(s){const a=Mt(s);return a.length===0?0:a[a.length-1].kind}(e))),n.zt()}Tn(e,t,n){if(n===null)return[];let i=[];i.push(new ir);let s=0;for(const a of Mt(e)){const u=n[s++];for(const c of i)if(this.fn(t,a.fieldPath)&&Rr(u))i=this.gn(i,a,u);else{const d=c.Yt(a.kind);Ut.vt.It(u,d)}}return this.pn(i)}In(e,t,n){return this.Tn(e,t,n.position)}pn(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].zt();return t}gn(e,t,n){const i=[...e],s=[];for(const a of n.arrayValue.values||[])for(const u of i){const c=new ir;c.seed(u.zt()),Ut.vt.It(a,c.Yt(t.kind)),s.push(c)}return s}fn(e,t){return!!e.filters.find(n=>n instanceof W&&n.field.isEqual(t)&&(n.op==="in"||n.op==="not-in"))}getFieldIndexes(e,t){const n=sr(e),i=ln(e);return(t?n.U("collectionGroupIndex",IDBKeyRange.bound(t,t)):n.U()).next(s=>{const a=[];return A.forEach(s,u=>i.get([u.indexId,this.uid]).next(c=>{a.push(function(m,p){const E=p?new Tr(p.sequenceNumber,new Ne(Xt(p.readTime),new N(je(p.documentKey)),p.largestBatchId)):Tr.empty(),P=m.fields.map(([V,x])=>new yi(oe.fromServerFormat(V),x));return new Ni(m.indexId,m.collectionGroup,P,E)}(u,c))})).next(()=>a)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(t=>t.length===0?null:(t.sort((n,i)=>{const s=n.indexState.sequenceNumber-i.indexState.sequenceNumber;return s!==0?s:z(n.collectionGroup,i.collectionGroup)}),t[0].collectionGroup))}updateCollectionGroup(e,t,n){const i=sr(e),s=ln(e);return this.yn(e).next(a=>i.U("collectionGroupIndex",IDBKeyRange.bound(t,t)).next(u=>A.forEach(u,c=>s.put(Ic(c.indexId,this.uid,a,n)))))}updateIndexEntries(e,t){const n=new Map;return A.forEach(t,(i,s)=>{const a=n.get(i.collectionGroup);return(a?A.resolve(a):this.getFieldIndexes(e,i.collectionGroup)).next(u=>(n.set(i.collectionGroup,u),A.forEach(u,c=>this.wn(e,i,c).next(d=>{const m=this.Sn(s,c);return d.isEqual(m)?A.resolve():this.bn(e,s,c,d,m)}))))})}Dn(e,t,n,i){return cn(e).put({indexId:i.indexId,uid:this.uid,arrayValue:i.arrayValue,directionalValue:i.directionalValue,orderedDocumentKey:this.mn(n,t.key),documentKey:t.key.path.toArray()})}vn(e,t,n,i){return cn(e).delete([i.indexId,this.uid,i.arrayValue,i.directionalValue,this.mn(n,t.key),t.key.path.toArray()])}wn(e,t,n){const i=cn(e);let s=new te(ht);return i.J({index:"documentKeyIndex",range:IDBKeyRange.only([n.indexId,this.uid,this.mn(n,t)])},(a,u)=>{s=s.add(new Bt(n.indexId,t,u.arrayValue,u.directionalValue))}).next(()=>s)}Sn(e,t){let n=new te(ht);const i=this.Vn(t,e);if(i==null)return n;const s=no(t);if(s!=null){const a=e.data.field(s.fieldPath);if(Rr(a))for(const u of a.arrayValue.values||[])n=n.add(new Bt(t.indexId,e.key,this.dn(u),i))}else n=n.add(new Bt(t.indexId,e.key,ai,i));return n}bn(e,t,n,i,s){C("IndexedDbIndexManager","Updating index entries for document '%s'",t.key);const a=[];return function(c,d,m,p,E){const P=c.getIterator(),V=d.getIterator();let x=un(P),D=un(V);for(;x||D;){let G=!1,j=!1;if(x&&D){const F=m(x,D);F<0?j=!0:F>0&&(G=!0)}else x!=null?j=!0:G=!0;G?(p(D),D=un(V)):j?(E(x),x=un(P)):(x=un(P),D=un(V))}}(i,s,ht,u=>{a.push(this.Dn(e,t,n,u))},u=>{a.push(this.vn(e,t,n,u))}),A.waitFor(a)}yn(e){let t=1;return ln(e).J({index:"sequenceNumberIndex",reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(n,i,s)=>{s.done(),t=i.sequenceNumber+1}).next(()=>t)}createRange(e,t,n){n=n.sort((a,u)=>ht(a,u)).filter((a,u,c)=>!u||ht(a,c[u-1])!==0);const i=[];i.push(e);for(const a of n){const u=ht(a,e),c=ht(a,t);if(u===0)i[0]=e.Zt();else if(u>0&&c<0)i.push(a),i.push(a.Zt());else if(c>0)break}i.push(t);const s=[];for(let a=0;a<i.length;a+=2){if(this.Cn(i[a],i[a+1]))return[];const u=[i[a].indexId,this.uid,i[a].arrayValue,i[a].directionalValue,ai,[]],c=[i[a+1].indexId,this.uid,i[a+1].arrayValue,i[a+1].directionalValue,ai,[]];s.push(IDBKeyRange.bound(u,c))}return s}Cn(e,t){return ht(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(Pc)}getMinOffset(e,t){return A.mapArray(this.hn(t),n=>this.Pn(e,n).next(i=>i||M())).next(Pc)}}function bc(r){return fe(r,"collectionParents")}function cn(r){return fe(r,"indexEntries")}function sr(r){return fe(r,"indexConfiguration")}function ln(r){return fe(r,"indexState")}function Pc(r){L(r.length!==0);let e=r[0].indexState.offset,t=e.largestBatchId;for(let n=1;n<r.length;n++){const i=r[n].indexState.offset;Mo(i,e)<0&&(e=i),t<i.largestBatchId&&(t=i.largestBatchId)}return new Ne(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sc={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0};class Se{constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}static withCacheSize(e){return new Se(e,Se.DEFAULT_COLLECTION_PERCENTILE,Se.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wh(r,e,t){const n=r.store("mutations"),i=r.store("documentMutations"),s=[],a=IDBKeyRange.only(t.batchId);let u=0;const c=n.J({range:a},(m,p,E)=>(u++,E.delete()));s.push(c.next(()=>{L(u===1)}));const d=[];for(const m of t.mutations){const p=Zl(e,m.key.path,t.batchId);s.push(i.delete(p)),d.push(m.key)}return A.waitFor(s).next(()=>d)}function qi(r){if(!r)return 0;let e;if(r.document)e=r.document;else if(r.unknownDocument)e=r.unknownDocument;else{if(!r.noDocument)throw M();e=r.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Se.DEFAULT_COLLECTION_PERCENTILE=10,Se.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Se.DEFAULT=new Se(41943040,Se.DEFAULT_COLLECTION_PERCENTILE,Se.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Se.DISABLED=new Se(-1,0,0);class os{constructor(e,t,n,i){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=i,this.Fn={}}static lt(e,t,n,i){L(e.uid!=="");const s=e.isAuthenticated()?e.uid:"";return new os(s,t,n,i)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return dt(e).J({index:"userMutationsIndex",range:n},(i,s,a)=>{t=!1,a.done()}).next(()=>t)}addMutationBatch(e,t,n,i){const s=gn(e),a=dt(e);return a.add({}).next(u=>{L(typeof u=="number");const c=new Ko(u,t,n,i),d=function(P,V,x){const D=x.baseMutations.map(j=>Ui(P.ct,j)),G=x.mutations.map(j=>Ui(P.ct,j));return{userId:V,batchId:x.batchId,localWriteTimeMs:x.localWriteTime.toMillis(),baseMutations:D,mutations:G}}(this.serializer,this.userId,c),m=[];let p=new te((E,P)=>z(E.canonicalString(),P.canonicalString()));for(const E of i){const P=Zl(this.userId,E.key.path,u);p=p.add(E.key.path.popLast()),m.push(a.put(d)),m.push(s.put(P,h_))}return p.forEach(E=>{m.push(this.indexManager.addToCollectionParentIndex(e,E))}),e.addOnCommittedListener(()=>{this.Fn[u]=c.keys()}),A.waitFor(m).next(()=>c)})}lookupMutationBatch(e,t){return dt(e).get(t).next(n=>n?(L(n.userId===this.userId),Ft(this.serializer,n)):null)}Mn(e,t){return this.Fn[t]?A.resolve(this.Fn[t]):this.lookupMutationBatch(e,t).next(n=>{if(n){const i=n.keys();return this.Fn[t]=i,i}return null})}getNextMutationBatchAfterBatchId(e,t){const n=t+1,i=IDBKeyRange.lowerBound([this.userId,n]);let s=null;return dt(e).J({index:"userMutationsIndex",range:i},(a,u,c)=>{u.userId===this.userId&&(L(u.batchId>=n),s=Ft(this.serializer,u)),c.done()}).next(()=>s)}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=-1;return dt(e).J({index:"userMutationsIndex",range:t,reverse:!0},(i,s,a)=>{n=s.batchId,a.done()}).next(()=>n)}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,-1],[this.userId,Number.POSITIVE_INFINITY]);return dt(e).U("userMutationsIndex",t).next(n=>n.map(i=>Ft(this.serializer,i)))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=Ii(this.userId,t.path),i=IDBKeyRange.lowerBound(n),s=[];return gn(e).J({range:i},(a,u,c)=>{const[d,m,p]=a,E=je(m);if(d===this.userId&&t.path.isEqual(E))return dt(e).get(p).next(P=>{if(!P)throw M();L(P.userId===this.userId),s.push(Ft(this.serializer,P))});c.done()}).next(()=>s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new te(z);const i=[];return t.forEach(s=>{const a=Ii(this.userId,s.path),u=IDBKeyRange.lowerBound(a),c=gn(e).J({range:u},(d,m,p)=>{const[E,P,V]=d,x=je(P);E===this.userId&&s.path.isEqual(x)?n=n.add(V):p.done()});i.push(c)}),A.waitFor(i).next(()=>this.xn(e,n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,i=n.length+1,s=Ii(this.userId,n),a=IDBKeyRange.lowerBound(s);let u=new te(z);return gn(e).J({range:a},(c,d,m)=>{const[p,E,P]=c,V=je(E);p===this.userId&&n.isPrefixOf(V)?V.length===i&&(u=u.add(P)):m.done()}).next(()=>this.xn(e,u))}xn(e,t){const n=[],i=[];return t.forEach(s=>{i.push(dt(e).get(s).next(a=>{if(a===null)throw M();L(a.userId===this.userId),n.push(Ft(this.serializer,a))}))}),A.waitFor(i).next(()=>n)}removeMutationBatch(e,t){return Wh(e._e,this.userId,t).next(n=>(e.addOnCommittedListener(()=>{this.On(t.batchId)}),A.forEach(n,i=>this.referenceDelegate.markPotentiallyOrphaned(e,i))))}On(e){delete this.Fn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return A.resolve();const n=IDBKeyRange.lowerBound(function(a){return[a]}(this.userId)),i=[];return gn(e).J({range:n},(s,a,u)=>{if(s[0]===this.userId){const c=je(s[1]);i.push(c)}else u.done()}).next(()=>{L(i.length===0)})})}containsKey(e,t){return Qh(e,this.userId,t)}Nn(e){return Jh(e).get(this.userId).next(t=>t||{userId:this.userId,lastAcknowledgedBatchId:-1,lastStreamToken:""})}}function Qh(r,e,t){const n=Ii(e,t.path),i=n[1],s=IDBKeyRange.lowerBound(n);let a=!1;return gn(r).J({range:s,H:!0},(u,c,d)=>{const[m,p,E]=u;m===e&&p===i&&(a=!0),d.done()}).next(()=>a)}function dt(r){return fe(r,"mutations")}function gn(r){return fe(r,"documentMutations")}function Jh(r){return fe(r,"mutationQueues")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zt{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Zt(0)}static kn(){return new Zt(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ky{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.qn(e).next(t=>{const n=new Zt(t.highestTargetId);return t.highestTargetId=n.next(),this.Qn(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.qn(e).next(t=>U.fromTimestamp(new ae(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.qn(e).next(t=>t.highestListenSequenceNumber)}setTargetsMetadata(e,t,n){return this.qn(e).next(i=>(i.highestListenSequenceNumber=t,n&&(i.lastRemoteSnapshotVersion=n.toTimestamp()),t>i.highestListenSequenceNumber&&(i.highestListenSequenceNumber=t),this.Qn(e,i)))}addTargetData(e,t){return this.Kn(e,t).next(()=>this.qn(e).next(n=>(n.targetCount+=1,this.$n(t,n),this.Qn(e,n))))}updateTargetData(e,t){return this.Kn(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>hn(e).delete(t.targetId)).next(()=>this.qn(e)).next(n=>(L(n.targetCount>0),n.targetCount-=1,this.Qn(e,n)))}removeTargets(e,t,n){let i=0;const s=[];return hn(e).J((a,u)=>{const c=hr(u);c.sequenceNumber<=t&&n.get(c.targetId)===null&&(i++,s.push(this.removeTargetData(e,c)))}).next(()=>A.waitFor(s)).next(()=>i)}forEachTarget(e,t){return hn(e).J((n,i)=>{const s=hr(i);t(s)})}qn(e){return Cc(e).get("targetGlobalKey").next(t=>(L(t!==null),t))}Qn(e,t){return Cc(e).put("targetGlobalKey",t)}Kn(e,t){return hn(e).put(Gh(this.serializer,t))}$n(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.qn(e).next(t=>t.targetCount)}getTargetData(e,t){const n=Jt(t),i=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let s=null;return hn(e).J({range:i,index:"queryTargetsIndex"},(a,u,c)=>{const d=hr(u);kr(t,d.target)&&(s=d,c.done())}).next(()=>s)}addMatchingKeys(e,t,n){const i=[],s=_t(e);return t.forEach(a=>{const u=be(a.path);i.push(s.put({targetId:n,path:u})),i.push(this.referenceDelegate.addReference(e,n,a))}),A.waitFor(i)}removeMatchingKeys(e,t,n){const i=_t(e);return A.forEach(t,s=>{const a=be(s.path);return A.waitFor([i.delete([n,a]),this.referenceDelegate.removeReference(e,n,s)])})}removeMatchingKeysForTargetId(e,t){const n=_t(e),i=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(i)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),i=_t(e);let s=K();return i.J({range:n,H:!0},(a,u,c)=>{const d=je(a[1]),m=new N(d);s=s.add(m)}).next(()=>s)}containsKey(e,t){const n=be(t.path),i=IDBKeyRange.bound([n],[Wl(n)],!1,!0);let s=0;return _t(e).J({index:"documentTargetsIndex",H:!0,range:i},([a,u],c,d)=>{a!==0&&(s++,d.done())}).next(()=>s>0)}ot(e,t){return hn(e).get(t).next(n=>n?hr(n):null)}}function hn(r){return fe(r,"targets")}function Cc(r){return fe(r,"targetGlobal")}function _t(r){return fe(r,"targetDocuments")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vc([r,e],[t,n]){const i=z(r,t);return i===0?z(e,n):i}class xy{constructor(e){this.Un=e,this.buffer=new te(Vc),this.Wn=0}Gn(){return++this.Wn}zn(e){const t=[e,this.Gn()];if(this.buffer.size<this.Un)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();Vc(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Ny{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.jn=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Hn(6e4)}stop(){this.jn&&(this.jn.cancel(),this.jn=null)}get started(){return this.jn!==null}Hn(e){C("LruGarbageCollector",`Garbage collection scheduled in ${e}ms`),this.jn=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.jn=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Pt(t)?C("LruGarbageCollector","Ignoring IndexedDB error during garbage collection: ",t):await tn(t)}await this.Hn(3e5)})}}class Oy{constructor(e,t){this.Jn=e,this.params=t}calculateTargetCount(e,t){return this.Jn.Yn(e).next(n=>Math.floor(t/100*n))}nthSequenceNumber(e,t){if(t===0)return A.resolve(Oe.oe);const n=new xy(t);return this.Jn.forEachTarget(e,i=>n.zn(i.sequenceNumber)).next(()=>this.Jn.Zn(e,i=>n.zn(i))).next(()=>n.maxValue)}removeTargets(e,t,n){return this.Jn.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.Jn.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(C("LruGarbageCollector","Garbage collection skipped; disabled"),A.resolve(Sc)):this.getCacheSize(e).next(n=>n<this.params.cacheSizeCollectionThreshold?(C("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Sc):this.Xn(e,t))}getCacheSize(e){return this.Jn.getCacheSize(e)}Xn(e,t){let n,i,s,a,u,c,d;const m=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(p=>(p>this.params.maximumSequenceNumbersToCollect?(C("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${p}`),i=this.params.maximumSequenceNumbersToCollect):i=p,a=Date.now(),this.nthSequenceNumber(e,i))).next(p=>(n=p,u=Date.now(),this.removeTargets(e,n,t))).next(p=>(s=p,c=Date.now(),this.removeOrphanedDocuments(e,n))).next(p=>(d=Date.now(),dn()<=H.DEBUG&&C("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-m}ms
	Determined least recently used ${i} in `+(u-a)+`ms
	Removed ${s} targets in `+(c-u)+`ms
	Removed ${p} documents in `+(d-c)+`ms
Total Duration: ${d-m}ms`),A.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:s,documentsRemoved:p})))}}function My(r,e){return new Oy(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ly{constructor(e,t){this.db=e,this.garbageCollector=My(this,t)}Yn(e){const t=this.er(e);return this.db.getTargetCache().getTargetCount(e).next(n=>t.next(i=>n+i))}er(e){let t=0;return this.Zn(e,n=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}Zn(e,t){return this.tr(e,(n,i)=>t(i))}addReference(e,t,n){return ui(e,n)}removeReference(e,t,n){return ui(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return ui(e,t)}nr(e,t){return function(i,s){let a=!1;return Jh(i).Y(u=>Qh(i,u,s).next(c=>(c&&(a=!0),A.resolve(!c)))).next(()=>a)}(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),i=[];let s=0;return this.tr(e,(a,u)=>{if(u<=t){const c=this.nr(e,a).next(d=>{if(!d)return s++,n.getEntry(e,a).next(()=>(n.removeEntry(a,U.min()),_t(e).delete(function(p){return[0,be(p.path)]}(a))))});i.push(c)}}).next(()=>A.waitFor(i)).next(()=>n.apply(e)).next(()=>s)}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return ui(e,t)}tr(e,t){const n=_t(e);let i,s=Oe.oe;return n.J({index:"documentTargetsIndex"},([a,u],{path:c,sequenceNumber:d})=>{a===0?(s!==Oe.oe&&t(new N(je(i)),s),s=d,i=c):s=Oe.oe}).next(()=>{s!==Oe.oe&&t(new N(je(i)),s)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function ui(r,e){return _t(r).put(function(n,i){return{targetId:0,path:be(n.path),sequenceNumber:i}}(e,r.currentSequenceNumber))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yh{constructor(){this.changes=new St(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,ce.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?A.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fy{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return Nt(e).put(n)}removeEntry(e,t,n){return Nt(e).delete(function(s,a){const u=s.path.toArray();return[u.slice(0,u.length-2),u[u.length-2],Bi(a),u[u.length-1]]}(t,n))}updateMetadata(e,t){return this.getMetadata(e).next(n=>(n.byteSize+=t,this.rr(e,n)))}getEntry(e,t){let n=ce.newInvalidDocument(t);return Nt(e).J({index:"documentKeyIndex",range:IDBKeyRange.only(or(t))},(i,s)=>{n=this.ir(t,s)}).next(()=>n)}sr(e,t){let n={size:0,document:ce.newInvalidDocument(t)};return Nt(e).J({index:"documentKeyIndex",range:IDBKeyRange.only(or(t))},(i,s)=>{n={document:this.ir(t,s),size:qi(s)}}).next(()=>n)}getEntries(e,t){let n=ke();return this._r(e,t,(i,s)=>{const a=this.ir(i,s);n=n.insert(i,a)}).next(()=>n)}ar(e,t){let n=ke(),i=new se(N.comparator);return this._r(e,t,(s,a)=>{const u=this.ir(s,a);n=n.insert(s,u),i=i.insert(s,qi(a))}).next(()=>({documents:n,ur:i}))}_r(e,t,n){if(t.isEmpty())return A.resolve();let i=new te(xc);t.forEach(c=>i=i.add(c));const s=IDBKeyRange.bound(or(i.first()),or(i.last())),a=i.getIterator();let u=a.getNext();return Nt(e).J({index:"documentKeyIndex",range:s},(c,d,m)=>{const p=N.fromSegments([...d.prefixPath,d.collectionGroup,d.documentId]);for(;u&&xc(u,p)<0;)n(u,null),u=a.getNext();u&&u.isEqual(p)&&(n(u,d),u=a.hasNext()?a.getNext():null),u?m.$(or(u)):m.done()}).next(()=>{for(;u;)n(u,null),u=a.hasNext()?a.getNext():null})}getDocumentsMatchingQuery(e,t,n,i,s){const a=t.path,u=[a.popLast().toArray(),a.lastSegment(),Bi(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],c=[a.popLast().toArray(),a.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return Nt(e).U(IDBKeyRange.bound(u,c,!0)).next(d=>{s==null||s.incrementDocumentReadCount(d.length);let m=ke();for(const p of d){const E=this.ir(N.fromSegments(p.prefixPath.concat(p.collectionGroup,p.documentId)),p);E.isFoundDocument()&&(xr(t,E)||i.has(E.key))&&(m=m.insert(E.key,E))}return m})}getAllFromCollectionGroup(e,t,n,i){let s=ke();const a=kc(t,n),u=kc(t,Ne.max());return Nt(e).J({index:"collectionGroupIndex",range:IDBKeyRange.bound(a,u,!0)},(c,d,m)=>{const p=this.ir(N.fromSegments(d.prefixPath.concat(d.collectionGroup,d.documentId)),d);s=s.insert(p.key,p),s.size===i&&m.done()}).next(()=>s)}newChangeBuffer(e){return new Uy(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(t=>t.byteSize)}getMetadata(e){return Dc(e).get("remoteDocumentGlobalKey").next(t=>(L(!!t),t))}rr(e,t){return Dc(e).put("remoteDocumentGlobalKey",t)}ir(e,t){if(t){const n=Ey(this.serializer,t);if(!(n.isNoDocument()&&n.version.isEqual(U.min())))return n}return ce.newInvalidDocument(e)}}function Xh(r){return new Fy(r)}class Uy extends Yh{constructor(e,t){super(),this.cr=e,this.trackRemovals=t,this.lr=new St(n=>n.toString(),(n,i)=>n.isEqual(i))}applyChanges(e){const t=[];let n=0,i=new te((s,a)=>z(s.canonicalString(),a.canonicalString()));return this.changes.forEach((s,a)=>{const u=this.lr.get(s);if(t.push(this.cr.removeEntry(e,s,u.readTime)),a.isValidDocument()){const c=_c(this.cr.serializer,a);i=i.add(s.path.popLast());const d=qi(c);n+=d-u.size,t.push(this.cr.addEntry(e,s,c))}else if(n-=u.size,this.trackRemovals){const c=_c(this.cr.serializer,a.convertToNoDocument(U.min()));t.push(this.cr.addEntry(e,s,c))}}),i.forEach(s=>{t.push(this.cr.indexManager.addToCollectionParentIndex(e,s))}),t.push(this.cr.updateMetadata(e,n)),A.waitFor(t)}getFromCache(e,t){return this.cr.sr(e,t).next(n=>(this.lr.set(t,{size:n.size,readTime:n.document.readTime}),n.document))}getAllFromCache(e,t){return this.cr.ar(e,t).next(({documents:n,ur:i})=>(i.forEach((s,a)=>{this.lr.set(s,{size:a,readTime:n.get(s).readTime})}),n))}}function Dc(r){return fe(r,"remoteDocumentGlobal")}function Nt(r){return fe(r,"remoteDocumentsV14")}function or(r){const e=r.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function kc(r,e){const t=e.documentKey.path.toArray();return[r,Bi(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function xc(r,e){const t=r.path.toArray(),n=e.path.toArray();let i=0;for(let s=0;s<t.length-2&&s<n.length-2;++s)if(i=z(t[s],n[s]),i)return i;return i=z(t.length,n.length),i||(i=z(t[t.length-2],n[n.length-2]),i||z(t[t.length-1],n[n.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class By{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zh{constructor(e,t,n,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=i}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(i=>(n=i,this.remoteDocumentCache.getEntry(e,t))).next(i=>(n!==null&&_r(n.mutation,i,Me.empty(),ae.now()),i))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.getLocalViewOfDocuments(e,n,K()).next(()=>n))}getLocalViewOfDocuments(e,t,n=K()){const i=qe();return this.populateOverlays(e,i,t).next(()=>this.computeViews(e,t,i,n).next(s=>{let a=cr();return s.forEach((u,c)=>{a=a.insert(u,c.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const n=qe();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,K()))}populateOverlays(e,t,n){const i=[];return n.forEach(s=>{t.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((a,u)=>{t.set(a,u)})})}computeViews(e,t,n,i){let s=ke();const a=gr(),u=function(){return gr()}();return t.forEach((c,d)=>{const m=n.get(d.key);i.has(d.key)&&(m===void 0||m.mutation instanceof Ct)?s=s.insert(d.key,d):m!==void 0?(a.set(d.key,m.mutation.getFieldMask()),_r(m.mutation,d,m.mutation.getFieldMask(),ae.now())):a.set(d.key,Me.empty())}),this.recalculateAndSaveOverlays(e,s).next(c=>(c.forEach((d,m)=>a.set(d,m)),t.forEach((d,m)=>{var p;return u.set(d,new By(m,(p=a.get(d))!==null&&p!==void 0?p:null))}),u))}recalculateAndSaveOverlays(e,t){const n=gr();let i=new se((a,u)=>a-u),s=K();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const u of a)u.keys().forEach(c=>{const d=t.get(c);if(d===null)return;let m=n.get(c)||Me.empty();m=u.applyToLocalView(d,m),n.set(c,m);const p=(i.get(u.batchId)||K()).add(c);i=i.insert(u.batchId,p)})}).next(()=>{const a=[],u=i.getReverseIterator();for(;u.hasNext();){const c=u.getNext(),d=c.key,m=c.value,p=Ih();m.forEach(E=>{if(!s.has(E)){const P=bh(t.get(E),n.get(E));P!==null&&p.set(E,P),s=s.add(E)}}),a.push(this.documentOverlayCache.saveOverlays(e,d,p))}return A.waitFor(a)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.recalculateAndSaveOverlays(e,n))}getDocumentsMatchingQuery(e,t,n,i){return function(a){return N.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):q_(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,i):this.getDocumentsMatchingCollectionQuery(e,t,n,i)}getNextDocuments(e,t,n,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,i).next(s=>{const a=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,i-s.size):A.resolve(qe());let u=-1,c=s;return a.next(d=>A.forEach(d,(m,p)=>(u<p.largestBatchId&&(u=p.largestBatchId),s.get(m)?A.resolve():this.remoteDocumentCache.getEntry(e,m).next(E=>{c=c.insert(m,E)}))).next(()=>this.populateOverlays(e,d,s)).next(()=>this.computeViews(e,c,d,K())).next(m=>({batchId:u,changes:yh(m)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new N(t)).next(n=>{let i=cr();return n.isFoundDocument()&&(i=i.insert(n.key,n)),i})}getDocumentsMatchingCollectionGroupQuery(e,t,n,i){const s=t.collectionGroup;let a=cr();return this.indexManager.getCollectionParents(e,s).next(u=>A.forEach(u,c=>{const d=function(p,E){return new Zi(E,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)}(t,c.child(s));return this.getDocumentsMatchingCollectionQuery(e,d,n,i).next(m=>{m.forEach((p,E)=>{a=a.insert(p,E)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,n,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(a=>(s=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,s,i))).next(a=>{s.forEach((c,d)=>{const m=d.getKey();a.get(m)===null&&(a=a.insert(m,ce.newInvalidDocument(m)))});let u=cr();return a.forEach((c,d)=>{const m=s.get(c);m!==void 0&&_r(m.mutation,d,Me.empty(),ae.now()),xr(t,d)&&(u=u.insert(c,d))}),u})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jy{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return A.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(i){return{id:i.id,version:i.version,createTime:Pe(i.createTime)}}(t)),A.resolve()}getNamedQuery(e,t){return A.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(i){return{name:i.name,query:Kh(i.bundledQuery),readTime:Pe(i.readTime)}}(t)),A.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qy{constructor(){this.overlays=new se(N.comparator),this.Ir=new Map}getOverlay(e,t){return A.resolve(this.overlays.get(t))}getOverlays(e,t){const n=qe();return A.forEach(t,i=>this.getOverlay(e,i).next(s=>{s!==null&&n.set(i,s)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((i,s)=>{this.ht(e,t,s)}),A.resolve()}removeOverlaysForBatchId(e,t,n){const i=this.Ir.get(n);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.Ir.delete(n)),A.resolve()}getOverlaysForCollection(e,t,n){const i=qe(),s=t.length+1,a=new N(t.child("")),u=this.overlays.getIteratorFrom(a);for(;u.hasNext();){const c=u.getNext().value,d=c.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===s&&c.largestBatchId>n&&i.set(c.getKey(),c)}return A.resolve(i)}getOverlaysForCollectionGroup(e,t,n,i){let s=new se((d,m)=>d-m);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>n){let m=s.get(d.largestBatchId);m===null&&(m=qe(),s=s.insert(d.largestBatchId,m)),m.set(d.getKey(),d)}}const u=qe(),c=s.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((d,m)=>u.set(d,m)),!(u.size()>=i)););return A.resolve(u)}ht(e,t,n){const i=this.overlays.get(n.key);if(i!==null){const a=this.Ir.get(i.largestBatchId).delete(n.key);this.Ir.set(i.largestBatchId,a)}this.overlays=this.overlays.insert(n.key,new Ho(t,n));let s=this.Ir.get(t);s===void 0&&(s=K(),this.Ir.set(t,s)),this.Ir.set(t,s.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zy{constructor(){this.sessionToken=he.EMPTY_BYTE_STRING}getSessionToken(e){return A.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,A.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xo{constructor(){this.Tr=new te(me.Er),this.dr=new te(me.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const n=new me(e,t);this.Tr=this.Tr.add(n),this.dr=this.dr.add(n)}Rr(e,t){e.forEach(n=>this.addReference(n,t))}removeReference(e,t){this.Vr(new me(e,t))}mr(e,t){e.forEach(n=>this.removeReference(n,t))}gr(e){const t=new N(new Z([])),n=new me(t,e),i=new me(t,e+1),s=[];return this.dr.forEachInRange([n,i],a=>{this.Vr(a),s.push(a.key)}),s}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new N(new Z([])),n=new me(t,e),i=new me(t,e+1);let s=K();return this.dr.forEachInRange([n,i],a=>{s=s.add(a.key)}),s}containsKey(e){const t=new me(e,0),n=this.Tr.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class me{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return N.comparator(e.key,t.key)||z(e.wr,t.wr)}static Ar(e,t){return z(e.wr,t.wr)||N.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gy{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new te(me.Er)}checkEmpty(e){return A.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,i){const s=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new Ko(s,t,n,i);this.mutationQueue.push(a);for(const u of i)this.br=this.br.add(new me(u.key,s)),this.indexManager.addToCollectionParentIndex(e,u.key.path.popLast());return A.resolve(a)}lookupMutationBatch(e,t){return A.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,i=this.vr(n),s=i<0?0:i;return A.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return A.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return A.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new me(t,0),i=new me(t,Number.POSITIVE_INFINITY),s=[];return this.br.forEachInRange([n,i],a=>{const u=this.Dr(a.wr);s.push(u)}),A.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new te(z);return t.forEach(i=>{const s=new me(i,0),a=new me(i,Number.POSITIVE_INFINITY);this.br.forEachInRange([s,a],u=>{n=n.add(u.wr)})}),A.resolve(this.Cr(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,i=n.length+1;let s=n;N.isDocumentKey(s)||(s=s.child(""));const a=new me(new N(s),0);let u=new te(z);return this.br.forEachWhile(c=>{const d=c.key.path;return!!n.isPrefixOf(d)&&(d.length===i&&(u=u.add(c.wr)),!0)},a),A.resolve(this.Cr(u))}Cr(e){const t=[];return e.forEach(n=>{const i=this.Dr(n);i!==null&&t.push(i)}),t}removeMutationBatch(e,t){L(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let n=this.br;return A.forEach(t.mutations,i=>{const s=new me(i.key,t.batchId);return n=n.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.br=n})}On(e){}containsKey(e,t){const n=new me(t,0),i=this.br.firstAfterOrEqual(n);return A.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,A.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ky{constructor(e){this.Mr=e,this.docs=function(){return new se(N.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,i=this.docs.get(n),s=i?i.size:0,a=this.Mr(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:a}),this.size+=a-s,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return A.resolve(n?n.document.mutableCopy():ce.newInvalidDocument(t))}getEntries(e,t){let n=ke();return t.forEach(i=>{const s=this.docs.get(i);n=n.insert(i,s?s.document.mutableCopy():ce.newInvalidDocument(i))}),A.resolve(n)}getDocumentsMatchingQuery(e,t,n,i){let s=ke();const a=t.path,u=new N(a.child("")),c=this.docs.getIteratorFrom(u);for(;c.hasNext();){const{key:d,value:{document:m}}=c.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||Mo(Ql(m),n)<=0||(i.has(m.key)||xr(t,m))&&(s=s.insert(m.key,m.mutableCopy()))}return A.resolve(s)}getAllFromCollectionGroup(e,t,n,i){M()}Or(e,t){return A.forEach(this.docs,n=>t(n))}newChangeBuffer(e){return new $y(this)}getSize(e){return A.resolve(this.size)}}class $y extends Yh{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((n,i)=>{i.isValidDocument()?t.push(this.cr.addEntry(e,i)):this.cr.removeEntry(n)}),A.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hy{constructor(e){this.persistence=e,this.Nr=new St(t=>Jt(t),kr),this.lastRemoteSnapshotVersion=U.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Xo,this.targetCount=0,this.kr=Zt.Bn()}forEachTarget(e,t){return this.Nr.forEach((n,i)=>t(i)),A.resolve()}getLastRemoteSnapshotVersion(e){return A.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return A.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),A.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.Lr&&(this.Lr=t),A.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new Zt(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,A.resolve()}updateTargetData(e,t){return this.Kn(t),A.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,A.resolve()}removeTargets(e,t,n){let i=0;const s=[];return this.Nr.forEach((a,u)=>{u.sequenceNumber<=t&&n.get(u.targetId)===null&&(this.Nr.delete(a),s.push(this.removeMatchingKeysForTargetId(e,u.targetId)),i++)}),A.waitFor(s).next(()=>i)}getTargetCount(e){return A.resolve(this.targetCount)}getTargetData(e,t){const n=this.Nr.get(t)||null;return A.resolve(n)}addMatchingKeys(e,t,n){return this.Br.Rr(t,n),A.resolve()}removeMatchingKeys(e,t,n){this.Br.mr(t,n);const i=this.persistence.referenceDelegate,s=[];return i&&t.forEach(a=>{s.push(i.markPotentiallyOrphaned(e,a))}),A.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),A.resolve()}getMatchingKeysForTargetId(e,t){const n=this.Br.yr(t);return A.resolve(n)}containsKey(e,t){return A.resolve(this.Br.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ed{constructor(e,t){this.qr={},this.overlays={},this.Qr=new Oe(0),this.Kr=!1,this.Kr=!0,this.$r=new zy,this.referenceDelegate=e(this),this.Ur=new Hy(this),this.indexManager=new Vy,this.remoteDocumentCache=function(i){return new Ky(i)}(n=>this.referenceDelegate.Wr(n)),this.serializer=new zh(t),this.Gr=new jy(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new qy,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.qr[e.toKey()];return n||(n=new Gy(t,this.referenceDelegate),this.qr[e.toKey()]=n),n}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,n){C("MemoryPersistence","Starting transaction:",e);const i=new Wy(this.Qr.next());return this.referenceDelegate.zr(),n(i).next(s=>this.referenceDelegate.jr(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Hr(e,t){return A.or(Object.values(this.qr).map(n=>()=>n.containsKey(e,t)))}}class Wy extends Yl{constructor(e){super(),this.currentSequenceNumber=e}}class as{constructor(e){this.persistence=e,this.Jr=new Xo,this.Yr=null}static Zr(e){return new as(e)}get Xr(){if(this.Yr)return this.Yr;throw M()}addReference(e,t,n){return this.Jr.addReference(n,t),this.Xr.delete(n.toString()),A.resolve()}removeReference(e,t,n){return this.Jr.removeReference(n,t),this.Xr.add(n.toString()),A.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),A.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(i=>this.Xr.add(i.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(i=>{i.forEach(s=>this.Xr.add(s.toString()))}).next(()=>n.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return A.forEach(this.Xr,n=>{const i=N.fromPath(n);return this.ei(e,i).next(s=>{s||t.removeEntry(i,U.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(n=>{n?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return A.or([()=>A.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qy{constructor(e){this.serializer=e}O(e,t,n,i){const s=new Ji("createOrUpgrade",t);n<1&&i>=1&&(function(c){c.createObjectStore("owner")}(e),function(c){c.createObjectStore("mutationQueues",{keyPath:"userId"}),c.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",Hu,{unique:!0}),c.createObjectStore("documentMutations")}(e),Nc(e),function(c){c.createObjectStore("remoteDocuments")}(e));let a=A.resolve();return n<3&&i>=3&&(n!==0&&(function(c){c.deleteObjectStore("targetDocuments"),c.deleteObjectStore("targets"),c.deleteObjectStore("targetGlobal")}(e),Nc(e)),a=a.next(()=>function(c){const d=c.store("targetGlobal"),m={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:U.min().toTimestamp(),targetCount:0};return d.put("targetGlobalKey",m)}(s))),n<4&&i>=4&&(n!==0&&(a=a.next(()=>function(c,d){return d.store("mutations").U().next(m=>{c.deleteObjectStore("mutations"),c.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",Hu,{unique:!0});const p=d.store("mutations"),E=m.map(P=>p.put(P));return A.waitFor(E)})}(e,s))),a=a.next(()=>{(function(c){c.createObjectStore("clientMetadata",{keyPath:"clientId"})})(e)})),n<5&&i>=5&&(a=a.next(()=>this.ni(s))),n<6&&i>=6&&(a=a.next(()=>(function(c){c.createObjectStore("remoteDocumentGlobal")}(e),this.ri(s)))),n<7&&i>=7&&(a=a.next(()=>this.ii(s))),n<8&&i>=8&&(a=a.next(()=>this.si(e,s))),n<9&&i>=9&&(a=a.next(()=>{(function(c){c.objectStoreNames.contains("remoteDocumentChanges")&&c.deleteObjectStore("remoteDocumentChanges")})(e)})),n<10&&i>=10&&(a=a.next(()=>this.oi(s))),n<11&&i>=11&&(a=a.next(()=>{(function(c){c.createObjectStore("bundles",{keyPath:"bundleId"})})(e),function(c){c.createObjectStore("namedQueries",{keyPath:"name"})}(e)})),n<12&&i>=12&&(a=a.next(()=>{(function(c){const d=c.createObjectStore("documentOverlays",{keyPath:w_});d.createIndex("collectionPathOverlayIndex",A_,{unique:!1}),d.createIndex("collectionGroupOverlayIndex",R_,{unique:!1})})(e)})),n<13&&i>=13&&(a=a.next(()=>function(c){const d=c.createObjectStore("remoteDocumentsV14",{keyPath:d_});d.createIndex("documentKeyIndex",f_),d.createIndex("collectionGroupIndex",m_)}(e)).next(()=>this._i(e,s)).next(()=>e.deleteObjectStore("remoteDocuments"))),n<14&&i>=14&&(a=a.next(()=>this.ai(e,s))),n<15&&i>=15&&(a=a.next(()=>function(c){c.createObjectStore("indexConfiguration",{keyPath:"indexId",autoIncrement:!0}).createIndex("collectionGroupIndex","collectionGroup",{unique:!1}),c.createObjectStore("indexState",{keyPath:I_}).createIndex("sequenceNumberIndex",v_,{unique:!1}),c.createObjectStore("indexEntries",{keyPath:T_}).createIndex("documentKeyIndex",E_,{unique:!1})}(e))),n<16&&i>=16&&(a=a.next(()=>{t.objectStore("indexState").clear()}).next(()=>{t.objectStore("indexEntries").clear()})),n<17&&i>=17&&(a=a.next(()=>{(function(c){c.createObjectStore("globals",{keyPath:"name"})})(e)})),a}ri(e){let t=0;return e.store("remoteDocuments").J((n,i)=>{t+=qi(i)}).next(()=>{const n={byteSize:t};return e.store("remoteDocumentGlobal").put("remoteDocumentGlobalKey",n)})}ni(e){const t=e.store("mutationQueues"),n=e.store("mutations");return t.U().next(i=>A.forEach(i,s=>{const a=IDBKeyRange.bound([s.userId,-1],[s.userId,s.lastAcknowledgedBatchId]);return n.U("userMutationsIndex",a).next(u=>A.forEach(u,c=>{L(c.userId===s.userId);const d=Ft(this.serializer,c);return Wh(e,s.userId,d).next(()=>{})}))}))}ii(e){const t=e.store("targetDocuments"),n=e.store("remoteDocuments");return e.store("targetGlobal").get("targetGlobalKey").next(i=>{const s=[];return n.J((a,u)=>{const c=new Z(a),d=function(p){return[0,be(p)]}(c);s.push(t.get(d).next(m=>m?A.resolve():(p=>t.put({targetId:0,path:be(p),sequenceNumber:i.highestListenSequenceNumber}))(c)))}).next(()=>A.waitFor(s))})}si(e,t){e.createObjectStore("collectionParents",{keyPath:y_});const n=t.store("collectionParents"),i=new Yo,s=a=>{if(i.add(a)){const u=a.lastSegment(),c=a.popLast();return n.put({collectionId:u,parent:be(c)})}};return t.store("remoteDocuments").J({H:!0},(a,u)=>{const c=new Z(a);return s(c.popLast())}).next(()=>t.store("documentMutations").J({H:!0},([a,u,c],d)=>{const m=je(u);return s(m.popLast())}))}oi(e){const t=e.store("targets");return t.J((n,i)=>{const s=hr(i),a=Gh(this.serializer,s);return t.put(a)})}_i(e,t){const n=t.store("remoteDocuments"),i=[];return n.J((s,a)=>{const u=t.store("remoteDocumentsV14"),c=function(p){return p.document?new N(Z.fromString(p.document.name).popFirst(5)):p.noDocument?N.fromSegments(p.noDocument.path):p.unknownDocument?N.fromSegments(p.unknownDocument.path):M()}(a).path.toArray(),d={prefixPath:c.slice(0,c.length-2),collectionGroup:c[c.length-2],documentId:c[c.length-1],readTime:a.readTime||[0,0],unknownDocument:a.unknownDocument,noDocument:a.noDocument,document:a.document,hasCommittedMutations:!!a.hasCommittedMutations};i.push(u.put(d))}).next(()=>A.waitFor(i))}ai(e,t){const n=t.store("mutations"),i=Xh(this.serializer),s=new ed(as.Zr,this.serializer.ct);return n.U().next(a=>{const u=new Map;return a.forEach(c=>{var d;let m=(d=u.get(c.userId))!==null&&d!==void 0?d:K();Ft(this.serializer,c).keys().forEach(p=>m=m.add(p)),u.set(c.userId,m)}),A.forEach(u,(c,d)=>{const m=new ge(d),p=ss.lt(this.serializer,m),E=s.getIndexManager(m),P=os.lt(m,this.serializer,E,s.referenceDelegate);return new Zh(i,P,p,E).recalculateAndSaveOverlaysForDocumentKeys(new ro(t,Oe.oe),c).next()})})}}function Nc(r){r.createObjectStore("targetDocuments",{keyPath:g_}).createIndex("documentTargetsIndex",__,{unique:!0}),r.createObjectStore("targets",{keyPath:"targetId"}).createIndex("queryTargetsIndex",p_,{unique:!0}),r.createObjectStore("targetGlobal")}const Gs="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";class Zo{constructor(e,t,n,i,s,a,u,c,d,m,p=17){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.ui=s,this.window=a,this.document=u,this.ci=d,this.li=m,this.hi=p,this.Qr=null,this.Kr=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Pi=null,this.inForeground=!1,this.Ii=null,this.Ti=null,this.Ei=Number.NEGATIVE_INFINITY,this.di=E=>Promise.resolve(),!Zo.D())throw new O(S.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new Ly(this,i),this.Ai=t+"main",this.serializer=new zh(c),this.Ri=new Et(this.Ai,this.hi,new Qy(this.serializer)),this.$r=new Ay,this.Ur=new ky(this.referenceDelegate,this.serializer),this.remoteDocumentCache=Xh(this.serializer),this.Gr=new wy,this.window&&this.window.localStorage?this.Vi=this.window.localStorage:(this.Vi=null,m===!1&&Re("IndexedDbPersistence","LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.mi().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new O(S.FAILED_PRECONDITION,Gs);return this.fi(),this.gi(),this.pi(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.Ur.getHighestSequenceNumber(e))}).then(e=>{this.Qr=new Oe(e,this.ci)}).then(()=>{this.Kr=!0}).catch(e=>(this.Ri&&this.Ri.close(),Promise.reject(e)))}yi(e){return this.di=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.Ri.L(async t=>{t.newVersion===null&&await e()})}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.ui.enqueueAndForget(async()=>{this.started&&await this.mi()}))}mi(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>ci(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.wi(e).next(t=>{t||(this.isPrimary=!1,this.ui.enqueueRetryable(()=>this.di(!1)))})}).next(()=>this.Si(e)).next(t=>this.isPrimary&&!t?this.bi(e).next(()=>!1):!!t&&this.Di(e).next(()=>!0))).catch(e=>{if(Pt(e))return C("IndexedDbPersistence","Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return C("IndexedDbPersistence","Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.ui.enqueueRetryable(()=>this.di(e)),this.isPrimary=e})}wi(e){return ar(e).get("owner").next(t=>A.resolve(this.vi(t)))}Ci(e){return ci(e).delete(this.clientId)}async Fi(){if(this.isPrimary&&!this.Mi(this.Ei,18e5)){this.Ei=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",t=>{const n=fe(t,"clientMetadata");return n.U().next(i=>{const s=this.xi(i,18e5),a=i.filter(u=>s.indexOf(u)===-1);return A.forEach(a,u=>n.delete(u.clientId)).next(()=>a)})}).catch(()=>[]);if(this.Vi)for(const t of e)this.Vi.removeItem(this.Oi(t.clientId))}}pi(){this.Ti=this.ui.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.mi().then(()=>this.Fi()).then(()=>this.pi()))}vi(e){return!!e&&e.ownerId===this.clientId}Si(e){return this.li?A.resolve(!0):ar(e).get("owner").next(t=>{if(t!==null&&this.Mi(t.leaseTimestampMs,5e3)&&!this.Ni(t.ownerId)){if(this.vi(t)&&this.networkEnabled)return!0;if(!this.vi(t)){if(!t.allowTabSynchronization)throw new O(S.FAILED_PRECONDITION,Gs);return!1}}return!(!this.networkEnabled||!this.inForeground)||ci(e).U().next(n=>this.xi(n,5e3).find(i=>{if(this.clientId!==i.clientId){const s=!this.networkEnabled&&i.networkEnabled,a=!this.inForeground&&i.inForeground,u=this.networkEnabled===i.networkEnabled;if(s||a&&u)return!0}return!1})===void 0)}).next(t=>(this.isPrimary!==t&&C("IndexedDbPersistence",`Client ${t?"is":"is not"} eligible for a primary lease.`),t))}async shutdown(){this.Kr=!1,this.Li(),this.Ti&&(this.Ti.cancel(),this.Ti=null),this.Bi(),this.ki(),await this.Ri.runTransaction("shutdown","readwrite",["owner","clientMetadata"],e=>{const t=new ro(e,Oe.oe);return this.bi(t).next(()=>this.Ci(t))}),this.Ri.close(),this.qi()}xi(e,t){return e.filter(n=>this.Mi(n.updateTimeMs,t)&&!this.Ni(n.clientId))}Qi(){return this.runTransaction("getActiveClients","readonly",e=>ci(e).U().next(t=>this.xi(t,18e5).map(n=>n.clientId)))}get started(){return this.Kr}getGlobalsCache(){return this.$r}getMutationQueue(e,t){return os.lt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new Dy(e,this.serializer.ct.databaseId)}getDocumentOverlayCache(e){return ss.lt(this.serializer,e)}getBundleCache(){return this.Gr}runTransaction(e,t,n){C("IndexedDbPersistence","Starting transaction:",e);const i=t==="readonly"?"readonly":"readwrite",s=function(c){return c===17?S_:c===16?P_:c===15?Fo:c===14?nh:c===13?th:c===12?b_:c===11?eh:void M()}(this.hi);let a;return this.Ri.runTransaction(e,i,s,u=>(a=new ro(u,this.Qr?this.Qr.next():Oe.oe),t==="readwrite-primary"?this.wi(a).next(c=>!!c||this.Si(a)).next(c=>{if(!c)throw Re(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.ui.enqueueRetryable(()=>this.di(!1)),new O(S.FAILED_PRECONDITION,Jl);return n(a)}).next(c=>this.Di(a).next(()=>c)):this.Ki(a).next(()=>n(a)))).then(u=>(a.raiseOnCommittedEvent(),u))}Ki(e){return ar(e).get("owner").next(t=>{if(t!==null&&this.Mi(t.leaseTimestampMs,5e3)&&!this.Ni(t.ownerId)&&!this.vi(t)&&!(this.li||this.allowTabSynchronization&&t.allowTabSynchronization))throw new O(S.FAILED_PRECONDITION,Gs)})}Di(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return ar(e).put("owner",t)}static D(){return Et.D()}bi(e){const t=ar(e);return t.get("owner").next(n=>this.vi(n)?(C("IndexedDbPersistence","Releasing primary lease."),t.delete("owner")):A.resolve())}Mi(e,t){const n=Date.now();return!(e<n-t)&&(!(e>n)||(Re(`Detected an update time that is in the future: ${e} > ${n}`),!1))}fi(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.Ii=()=>{this.ui.enqueueAndForget(()=>(this.inForeground=this.document.visibilityState==="visible",this.mi()))},this.document.addEventListener("visibilitychange",this.Ii),this.inForeground=this.document.visibilityState==="visible")}Bi(){this.Ii&&(this.document.removeEventListener("visibilitychange",this.Ii),this.Ii=null)}gi(){var e;typeof((e=this.window)===null||e===void 0?void 0:e.addEventListener)=="function"&&(this.Pi=()=>{this.Li();const t=/(?:Version|Mobile)\/1[456]/;nl()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.ui.enterRestrictedMode(!0),this.ui.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Pi))}ki(){this.Pi&&(this.window.removeEventListener("pagehide",this.Pi),this.Pi=null)}Ni(e){var t;try{const n=((t=this.Vi)===null||t===void 0?void 0:t.getItem(this.Oi(e)))!==null;return C("IndexedDbPersistence",`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return Re("IndexedDbPersistence","Failed to get zombied client id.",n),!1}}Li(){if(this.Vi)try{this.Vi.setItem(this.Oi(this.clientId),String(Date.now()))}catch(e){Re("Failed to set zombie client id.",e)}}qi(){if(this.Vi)try{this.Vi.removeItem(this.Oi(this.clientId))}catch{}}Oi(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function ar(r){return fe(r,"owner")}function ci(r){return fe(r,"clientMetadata")}function Jy(r,e){let t=r.projectId;return r.isDefaultDatabase||(t+="."+r.database),"firestore/"+e+"/"+t+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ea{constructor(e,t,n,i){this.targetId=e,this.fromCache=t,this.$i=n,this.Ui=i}static Wi(e,t){let n=K(),i=K();for(const s of t.docChanges)switch(s.type){case 0:n=n.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new ea(e,t.fromCache,n,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yy{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class td{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return nl()?8:Xl(de())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,n,i){const s={result:null};return this.Yi(e,t).next(a=>{s.result=a}).next(()=>{if(!s.result)return this.Zi(e,t,i,n).next(a=>{s.result=a})}).next(()=>{if(s.result)return;const a=new Yy;return this.Xi(e,t,a).next(u=>{if(s.result=u,this.zi)return this.es(e,t,a,u.size)})}).next(()=>s.result)}es(e,t,n,i){return n.documentReadCount<this.ji?(dn()<=H.DEBUG&&C("QueryEngine","SDK will not create cache indexes for query:",fn(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),A.resolve()):(dn()<=H.DEBUG&&C("QueryEngine","Query:",fn(t),"scans",n.documentReadCount,"local documents and returns",i,"documents as results."),n.documentReadCount>this.Hi*i?(dn()<=H.DEBUG&&C("QueryEngine","The SDK decides to create cache indexes for query:",fn(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Le(t))):A.resolve())}Yi(e,t){if(oc(t))return A.resolve(null);let n=Le(t);return this.indexManager.getIndexType(e,n).next(i=>i===0?null:(t.limit!==null&&i===1&&(t=co(t,null,"F"),n=Le(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next(s=>{const a=K(...s);return this.Ji.getDocuments(e,a).next(u=>this.indexManager.getMinOffset(e,n).next(c=>{const d=this.ts(t,u);return this.ns(t,d,a,c.readTime)?this.Yi(e,co(t,null,"F")):this.rs(e,d,t,c)}))})))}Zi(e,t,n,i){return oc(t)||i.isEqual(U.min())?A.resolve(null):this.Ji.getDocuments(e,n).next(s=>{const a=this.ts(t,s);return this.ns(t,a,n,i)?A.resolve(null):(dn()<=H.DEBUG&&C("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),fn(t)),this.rs(e,a,t,i_(i,-1)).next(u=>u))})}ts(e,t){let n=new te(gh(e));return t.forEach((i,s)=>{xr(e,s)&&(n=n.add(s))}),n}ns(e,t,n,i){if(e.limit===null)return!1;if(n.size!==t.size)return!0;const s=e.limitType==="F"?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}Xi(e,t,n){return dn()<=H.DEBUG&&C("QueryEngine","Using full collection scan to execute query:",fn(t)),this.Ji.getDocumentsMatchingQuery(e,t,Ne.min(),n)}rs(e,t,n,i){return this.Ji.getDocumentsMatchingQuery(e,n,i).next(s=>(t.forEach(a=>{s=s.insert(a.key,a)}),s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xy{constructor(e,t,n,i){this.persistence=e,this.ss=t,this.serializer=i,this.os=new se(z),this._s=new St(s=>Jt(s),kr),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(n)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Zh(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function nd(r,e,t,n){return new Xy(r,e,t,n)}async function rd(r,e){const t=q(r);return await t.persistence.runTransaction("Handle user change","readonly",n=>{let i;return t.mutationQueue.getAllMutationBatches(n).next(s=>(i=s,t.ls(e),t.mutationQueue.getAllMutationBatches(n))).next(s=>{const a=[],u=[];let c=K();for(const d of i){a.push(d.batchId);for(const m of d.mutations)c=c.add(m.key)}for(const d of s){u.push(d.batchId);for(const m of d.mutations)c=c.add(m.key)}return t.localDocuments.getDocuments(n,c).next(d=>({hs:d,removedBatchIds:a,addedBatchIds:u}))})})}function Zy(r,e){const t=q(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",n=>{const i=e.batch.keys(),s=t.cs.newChangeBuffer({trackRemovals:!0});return function(u,c,d,m){const p=d.batch,E=p.keys();let P=A.resolve();return E.forEach(V=>{P=P.next(()=>m.getEntry(c,V)).next(x=>{const D=d.docVersions.get(V);L(D!==null),x.version.compareTo(D)<0&&(p.applyToRemoteDocument(x,d),x.isValidDocument()&&(x.setReadTime(d.commitVersion),m.addEntry(x)))})}),P.next(()=>u.mutationQueue.removeMutationBatch(c,p))}(t,n,e,s).next(()=>s.apply(n)).next(()=>t.mutationQueue.performConsistencyCheck(n)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(n,i,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,function(u){let c=K();for(let d=0;d<u.mutationResults.length;++d)u.mutationResults[d].transformResults.length>0&&(c=c.add(u.batch.mutations[d].key));return c}(e))).next(()=>t.localDocuments.getDocuments(n,i))})}function id(r){const e=q(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function eI(r,e){const t=q(r),n=e.snapshotVersion;let i=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const a=t.cs.newChangeBuffer({trackRemovals:!0});i=t.os;const u=[];e.targetChanges.forEach((m,p)=>{const E=i.get(p);if(!E)return;u.push(t.Ur.removeMatchingKeys(s,m.removedDocuments,p).next(()=>t.Ur.addMatchingKeys(s,m.addedDocuments,p)));let P=E.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(p)!==null?P=P.withResumeToken(he.EMPTY_BYTE_STRING,U.min()).withLastLimboFreeSnapshotVersion(U.min()):m.resumeToken.approximateByteSize()>0&&(P=P.withResumeToken(m.resumeToken,n)),i=i.insert(p,P),function(x,D,G){return x.resumeToken.approximateByteSize()===0||D.snapshotVersion.toMicroseconds()-x.snapshotVersion.toMicroseconds()>=3e8?!0:G.addedDocuments.size+G.modifiedDocuments.size+G.removedDocuments.size>0}(E,P,m)&&u.push(t.Ur.updateTargetData(s,P))});let c=ke(),d=K();if(e.documentUpdates.forEach(m=>{e.resolvedLimboDocuments.has(m)&&u.push(t.persistence.referenceDelegate.updateLimboDocument(s,m))}),u.push(tI(s,a,e.documentUpdates).next(m=>{c=m.Ps,d=m.Is})),!n.isEqual(U.min())){const m=t.Ur.getLastRemoteSnapshotVersion(s).next(p=>t.Ur.setTargetsMetadata(s,s.currentSequenceNumber,n));u.push(m)}return A.waitFor(u).next(()=>a.apply(s)).next(()=>t.localDocuments.getLocalViewOfDocuments(s,c,d)).next(()=>c)}).then(s=>(t.os=i,s))}function tI(r,e,t){let n=K(),i=K();return t.forEach(s=>n=n.add(s)),e.getEntries(r,n).next(s=>{let a=ke();return t.forEach((u,c)=>{const d=s.get(u);c.isFoundDocument()!==d.isFoundDocument()&&(i=i.add(u)),c.isNoDocument()&&c.version.isEqual(U.min())?(e.removeEntry(u,c.readTime),a=a.insert(u,c)):!d.isValidDocument()||c.version.compareTo(d.version)>0||c.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(c),a=a.insert(u,c)):C("LocalStore","Ignoring outdated watch update for ",u,". Current version:",d.version," Watch version:",c.version)}),{Ps:a,Is:i}})}function nI(r,e){const t=q(r);return t.persistence.runTransaction("Get next mutation batch","readonly",n=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e)))}function rI(r,e){const t=q(r);return t.persistence.runTransaction("Allocate target","readwrite",n=>{let i;return t.Ur.getTargetData(n,e).next(s=>s?(i=s,A.resolve(i)):t.Ur.allocateTargetId(n).next(a=>(i=new Ze(e,a,"TargetPurposeListen",n.currentSequenceNumber),t.Ur.addTargetData(n,i).next(()=>i))))}).then(n=>{const i=t.os.get(n.targetId);return(i===null||n.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.os=t.os.insert(n.targetId,n),t._s.set(e,n.targetId)),n})}async function yo(r,e,t){const n=q(r),i=n.os.get(e),s=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",s,a=>n.persistence.referenceDelegate.removeTarget(a,i))}catch(a){if(!Pt(a))throw a;C("LocalStore",`Failed to update sequence numbers for target ${e}: ${a}`)}n.os=n.os.remove(e),n._s.delete(i.target)}function Oc(r,e,t){const n=q(r);let i=U.min(),s=K();return n.persistence.runTransaction("Execute query","readwrite",a=>function(c,d,m){const p=q(c),E=p._s.get(m);return E!==void 0?A.resolve(p.os.get(E)):p.Ur.getTargetData(d,m)}(n,a,Le(e)).next(u=>{if(u)return i=u.lastLimboFreeSnapshotVersion,n.Ur.getMatchingKeysForTargetId(a,u.targetId).next(c=>{s=c})}).next(()=>n.ss.getDocumentsMatchingQuery(a,e,t?i:U.min(),t?s:K())).next(u=>(iI(n,G_(e),u),{documents:u,Ts:s})))}function iI(r,e,t){let n=r.us.get(e)||U.min();t.forEach((i,s)=>{s.readTime.compareTo(n)>0&&(n=s.readTime)}),r.us.set(e,n)}class Mc{constructor(){this.activeTargetIds=J_()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class sd{constructor(){this.so=new Mc,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,n){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new Mc,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sI{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lc{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){C("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){C("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let li=null;function Ks(){return li===null?li=function(){return 268435456+Math.round(2147483648*Math.random())}():li++,"0x"+li.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oI={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aI{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ee="WebChannelConnection";class uI extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const n=t.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Do=n+"://"+t.host,this.vo=`projects/${i}/databases/${s}`,this.Co=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${s}`}get Fo(){return!1}Mo(t,n,i,s,a){const u=Ks(),c=this.xo(t,n.toUriEncodedString());C("RestConnection",`Sending RPC '${t}' ${u}:`,c,i);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,s,a),this.No(t,c,d,i).then(m=>(C("RestConnection",`Received RPC '${t}' ${u}: `,m),m),m=>{throw Ht("RestConnection",`RPC '${t}' ${u} failed with error: `,m,"url: ",c,"request:",i),m})}Lo(t,n,i,s,a,u){return this.Mo(t,n,i,s,a)}Oo(t,n,i){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Mn}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((s,a)=>t[a]=s),i&&i.headers.forEach((s,a)=>t[a]=s)}xo(t,n){const i=oI[t];return`${this.Do}/v1/${n}:${i}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,n,i){const s=Ks();return new Promise((a,u)=>{const c=new jl;c.setWithCredentials(!0),c.listenOnce(ql.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case _i.NO_ERROR:const m=c.getResponseJson();C(Ee,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(m)),a(m);break;case _i.TIMEOUT:C(Ee,`RPC '${e}' ${s} timed out`),u(new O(S.DEADLINE_EXCEEDED,"Request time out"));break;case _i.HTTP_ERROR:const p=c.getStatus();if(C(Ee,`RPC '${e}' ${s} failed with status:`,p,"response text:",c.getResponseText()),p>0){let E=c.getResponseJson();Array.isArray(E)&&(E=E[0]);const P=E==null?void 0:E.error;if(P&&P.status&&P.message){const V=function(D){const G=D.toLowerCase().replace(/_/g,"-");return Object.values(S).indexOf(G)>=0?G:S.UNKNOWN}(P.status);u(new O(V,P.message))}else u(new O(S.UNKNOWN,"Server responded with status "+c.getStatus()))}else u(new O(S.UNAVAILABLE,"Connection failed."));break;default:M()}}finally{C(Ee,`RPC '${e}' ${s} completed.`)}});const d=JSON.stringify(i);C(Ee,`RPC '${e}' ${s} sending request:`,i),c.send(t,"POST",d,n,15)})}Bo(e,t,n){const i=Ks(),s=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=Kl(),u=Gl(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,t,n),c.encodeInitMessageHeaders=!0;const m=s.join("");C(Ee,`Creating RPC '${e}' stream ${i}: ${m}`,c);const p=a.createWebChannel(m,c);let E=!1,P=!1;const V=new aI({Io:D=>{P?C(Ee,`Not sending because RPC '${e}' stream ${i} is closed:`,D):(E||(C(Ee,`Opening RPC '${e}' stream ${i} transport.`),p.open(),E=!0),C(Ee,`RPC '${e}' stream ${i} sending:`,D),p.send(D))},To:()=>p.close()}),x=(D,G,j)=>{D.listen(G,F=>{try{j(F)}catch(Q){setTimeout(()=>{throw Q},0)}})};return x(p,ur.EventType.OPEN,()=>{P||(C(Ee,`RPC '${e}' stream ${i} transport opened.`),V.yo())}),x(p,ur.EventType.CLOSE,()=>{P||(P=!0,C(Ee,`RPC '${e}' stream ${i} transport closed`),V.So())}),x(p,ur.EventType.ERROR,D=>{P||(P=!0,Ht(Ee,`RPC '${e}' stream ${i} transport errored:`,D),V.So(new O(S.UNAVAILABLE,"The operation could not be completed")))}),x(p,ur.EventType.MESSAGE,D=>{var G;if(!P){const j=D.data[0];L(!!j);const F=j,Q=F.error||((G=F[0])===null||G===void 0?void 0:G.error);if(Q){C(Ee,`RPC '${e}' stream ${i} received error:`,Q);const X=Q.status;let $=function(y){const v=le[y];if(v!==void 0)return Ch(v)}(X),I=Q.message;$===void 0&&($=S.INTERNAL,I="Unknown error status: "+X+" with message "+Q.message),P=!0,V.So(new O($,I)),p.close()}else C(Ee,`RPC '${e}' stream ${i} received:`,j),V.bo(j)}}),x(u,zl.STAT_EVENT,D=>{D.stat===to.PROXY?C(Ee,`RPC '${e}' stream ${i} detected buffering proxy`):D.stat===to.NOPROXY&&C(Ee,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{V.wo()},0),V}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cI(){return typeof window<"u"?window:null}function Ai(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function us(r){return new dy(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class od{constructor(e,t,n=1e3,i=1.5,s=6e4){this.ui=e,this.timerId=t,this.ko=n,this.qo=i,this.Qo=s,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),n=Math.max(0,Date.now()-this.Uo),i=Math.max(0,t-n);i>0&&C("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,i,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ad{constructor(e,t,n,i,s,a,u,c){this.ui=e,this.Ho=n,this.Jo=i,this.connection=s,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=u,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new od(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===S.RESOURCE_EXHAUSTED?(Re(t.toString()),Re("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===S.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([n,i])=>{this.Yo===t&&this.P_(n,i)},n=>{e(()=>{const i=new O(S.UNKNOWN,"Fetching auth token failed: "+n.message);return this.I_(i)})})}P_(e,t){const n=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{n(()=>this.listener.Eo())}),this.stream.Ro(()=>{n(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(i=>{n(()=>this.I_(i))}),this.stream.onMessage(i=>{n(()=>++this.e_==1?this.E_(i):this.onNext(i))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return C("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(C("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class lI extends ad{constructor(e,t,n,i,s,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,i,a),this.serializer=s}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=py(this.serializer,e),n=function(s){if(!("targetChange"in s))return U.min();const a=s.targetChange;return a.targetIds&&a.targetIds.length?U.min():a.readTime?Pe(a.readTime):U.min()}(e);return this.listener.d_(t,n)}A_(e){const t={};t.database=fo(this.serializer),t.addTarget=function(s,a){let u;const c=a.target;if(u=Mi(c)?{documents:Lh(s,c)}:{query:Fh(s,c)._t},u.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){u.resumeToken=kh(s,a.resumeToken);const d=lo(s,a.expectedCount);d!==null&&(u.expectedCount=d)}else if(a.snapshotVersion.compareTo(U.min())>0){u.readTime=Vn(s,a.snapshotVersion.toTimestamp());const d=lo(s,a.expectedCount);d!==null&&(u.expectedCount=d)}return u}(this.serializer,e);const n=_y(this.serializer,e);n&&(t.labels=n),this.a_(t)}R_(e){const t={};t.database=fo(this.serializer),t.removeTarget=e,this.a_(t)}}class hI extends ad{constructor(e,t,n,i,s,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,i,a),this.serializer=s}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return L(!!e.streamToken),this.lastStreamToken=e.streamToken,L(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){L(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=gy(e.writeResults,e.commitTime),n=Pe(e.commitTime);return this.listener.g_(n,t)}p_(){const e={};e.database=fo(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(n=>Ui(this.serializer,n))};this.a_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dI extends class{}{constructor(e,t,n,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=i,this.y_=!1}w_(){if(this.y_)throw new O(S.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,n,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,a])=>this.connection.Mo(e,ho(t,n),i,s,a)).catch(s=>{throw s.name==="FirebaseError"?(s.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new O(S.UNKNOWN,s.toString())})}Lo(e,t,n,i,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,u])=>this.connection.Lo(e,ho(t,n),i,a,u,s)).catch(a=>{throw a.name==="FirebaseError"?(a.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new O(S.UNKNOWN,a.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class fI{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Re(t),this.D_=!1):C("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mI{constructor(e,t,n,i,s){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=s,this.k_._o(a=>{n.enqueueAndForget(async()=>{nn(this)&&(C("RemoteStore","Restarting streams for network reachability change."),await async function(c){const d=q(c);d.L_.add(4),await Or(d),d.q_.set("Unknown"),d.L_.delete(4),await cs(d)}(this))})}),this.q_=new fI(n,i)}}async function cs(r){if(nn(r))for(const e of r.B_)await e(!0)}async function Or(r){for(const e of r.B_)await e(!1)}function ud(r,e){const t=q(r);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),ia(t)?ra(t):Un(t).r_()&&na(t,e))}function ta(r,e){const t=q(r),n=Un(t);t.N_.delete(e),n.r_()&&cd(t,e),t.N_.size===0&&(n.r_()?n.o_():nn(t)&&t.q_.set("Unknown"))}function na(r,e){if(r.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(U.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Un(r).A_(e)}function cd(r,e){r.Q_.xe(e),Un(r).R_(e)}function ra(r){r.Q_=new uy({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>r.N_.get(e)||null,tt:()=>r.datastore.serializer.databaseId}),Un(r).start(),r.q_.v_()}function ia(r){return nn(r)&&!Un(r).n_()&&r.N_.size>0}function nn(r){return q(r).L_.size===0}function ld(r){r.Q_=void 0}async function pI(r){r.q_.set("Online")}async function gI(r){r.N_.forEach((e,t)=>{na(r,e)})}async function _I(r,e){ld(r),ia(r)?(r.q_.M_(e),ra(r)):r.q_.set("Unknown")}async function yI(r,e,t){if(r.q_.set("Online"),e instanceof Dh&&e.state===2&&e.cause)try{await async function(i,s){const a=s.cause;for(const u of s.targetIds)i.N_.has(u)&&(await i.remoteSyncer.rejectListen(u,a),i.N_.delete(u),i.Q_.removeTarget(u))}(r,e)}catch(n){C("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),n),await zi(r,n)}else if(e instanceof wi?r.Q_.Ke(e):e instanceof Vh?r.Q_.He(e):r.Q_.We(e),!t.isEqual(U.min()))try{const n=await id(r.localStore);t.compareTo(n)>=0&&await function(s,a){const u=s.Q_.rt(a);return u.targetChanges.forEach((c,d)=>{if(c.resumeToken.approximateByteSize()>0){const m=s.N_.get(d);m&&s.N_.set(d,m.withResumeToken(c.resumeToken,a))}}),u.targetMismatches.forEach((c,d)=>{const m=s.N_.get(c);if(!m)return;s.N_.set(c,m.withResumeToken(he.EMPTY_BYTE_STRING,m.snapshotVersion)),cd(s,c);const p=new Ze(m.target,c,d,m.sequenceNumber);na(s,p)}),s.remoteSyncer.applyRemoteEvent(u)}(r,t)}catch(n){C("RemoteStore","Failed to raise snapshot:",n),await zi(r,n)}}async function zi(r,e,t){if(!Pt(e))throw e;r.L_.add(1),await Or(r),r.q_.set("Offline"),t||(t=()=>id(r.localStore)),r.asyncQueue.enqueueRetryable(async()=>{C("RemoteStore","Retrying IndexedDB access"),await t(),r.L_.delete(1),await cs(r)})}function hd(r,e){return e().catch(t=>zi(r,t,e))}async function Mr(r){const e=q(r),t=bt(e);let n=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;II(e);)try{const i=await nI(e.localStore,n);if(i===null){e.O_.length===0&&t.o_();break}n=i.batchId,vI(e,i)}catch(i){await zi(e,i)}dd(e)&&fd(e)}function II(r){return nn(r)&&r.O_.length<10}function vI(r,e){r.O_.push(e);const t=bt(r);t.r_()&&t.V_&&t.m_(e.mutations)}function dd(r){return nn(r)&&!bt(r).n_()&&r.O_.length>0}function fd(r){bt(r).start()}async function TI(r){bt(r).p_()}async function EI(r){const e=bt(r);for(const t of r.O_)e.m_(t.mutations)}async function wI(r,e,t){const n=r.O_.shift(),i=$o.from(n,e,t);await hd(r,()=>r.remoteSyncer.applySuccessfulWrite(i)),await Mr(r)}async function AI(r,e){e&&bt(r).V_&&await async function(n,i){if(function(a){return sy(a)&&a!==S.ABORTED}(i.code)){const s=n.O_.shift();bt(n).s_(),await hd(n,()=>n.remoteSyncer.rejectFailedWrite(s.batchId,i)),await Mr(n)}}(r,e),dd(r)&&fd(r)}async function Fc(r,e){const t=q(r);t.asyncQueue.verifyOperationInProgress(),C("RemoteStore","RemoteStore received new credentials");const n=nn(t);t.L_.add(3),await Or(t),n&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await cs(t)}async function RI(r,e){const t=q(r);e?(t.L_.delete(2),await cs(t)):e||(t.L_.add(2),await Or(t),t.q_.set("Unknown"))}function Un(r){return r.K_||(r.K_=function(t,n,i){const s=q(t);return s.w_(),new lI(n,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(r.datastore,r.asyncQueue,{Eo:pI.bind(null,r),Ro:gI.bind(null,r),mo:_I.bind(null,r),d_:yI.bind(null,r)}),r.B_.push(async e=>{e?(r.K_.s_(),ia(r)?ra(r):r.q_.set("Unknown")):(await r.K_.stop(),ld(r))})),r.K_}function bt(r){return r.U_||(r.U_=function(t,n,i){const s=q(t);return s.w_(),new hI(n,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(r.datastore,r.asyncQueue,{Eo:()=>Promise.resolve(),Ro:TI.bind(null,r),mo:AI.bind(null,r),f_:EI.bind(null,r),g_:wI.bind(null,r)}),r.B_.push(async e=>{e?(r.U_.s_(),await Mr(r)):(await r.U_.stop(),r.O_.length>0&&(C("RemoteStore",`Stopping write stream with ${r.O_.length} pending writes`),r.O_=[]))})),r.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sa{constructor(e,t,n,i,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=i,this.removalCallback=s,this.deferred=new et,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,i,s){const a=Date.now()+n,u=new sa(e,t,a,i,s);return u.start(n),u}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new O(S.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function oa(r,e){if(Re("AsyncQueue",`${e}: ${r}`),Pt(r))return new O(S.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vn{constructor(e){this.comparator=e?(t,n)=>e(t,n)||N.comparator(t.key,n.key):(t,n)=>N.comparator(t.key,n.key),this.keyedMap=cr(),this.sortedSet=new se(this.comparator)}static emptySet(e){return new vn(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof vn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=n.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new vn;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uc{constructor(){this.W_=new se(N.comparator)}track(e){const t=e.doc.key,n=this.W_.get(t);n?e.type!==0&&n.type===3?this.W_=this.W_.insert(t,e):e.type===3&&n.type!==1?this.W_=this.W_.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.W_=this.W_.remove(t):e.type===1&&n.type===2?this.W_=this.W_.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):M():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,n)=>{e.push(n)}),e}}class Dn{constructor(e,t,n,i,s,a,u,c,d){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=i,this.mutatedKeys=s,this.fromCache=a,this.syncStateChanged=u,this.excludesMetadataChanges=c,this.hasCachedResults=d}static fromInitialDocuments(e,t,n,i,s){const a=[];return t.forEach(u=>{a.push({type:0,doc:u})}),new Dn(e,t,vn.emptySet(t),a,n,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&es(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==n[i].type||!t[i].doc.isEqual(n[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bI{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class PI{constructor(){this.queries=Bc(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,n){const i=q(t),s=i.queries;i.queries=Bc(),s.forEach((a,u)=>{for(const c of u.j_)c.onError(n)})})(this,new O(S.ABORTED,"Firestore shutting down"))}}function Bc(){return new St(r=>ph(r),es)}async function SI(r,e){const t=q(r);let n=3;const i=e.query;let s=t.queries.get(i);s?!s.H_()&&e.J_()&&(n=2):(s=new bI,n=e.J_()?0:1);try{switch(n){case 0:s.z_=await t.onListen(i,!0);break;case 1:s.z_=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(a){const u=oa(a,`Initialization of query '${fn(e.query)}' failed`);return void e.onError(u)}t.queries.set(i,s),s.j_.push(e),e.Z_(t.onlineState),s.z_&&e.X_(s.z_)&&aa(t)}async function CI(r,e){const t=q(r),n=e.query;let i=3;const s=t.queries.get(n);if(s){const a=s.j_.indexOf(e);a>=0&&(s.j_.splice(a,1),s.j_.length===0?i=e.J_()?0:1:!s.H_()&&e.J_()&&(i=2))}switch(i){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function VI(r,e){const t=q(r);let n=!1;for(const i of e){const s=i.query,a=t.queries.get(s);if(a){for(const u of a.j_)u.X_(i)&&(n=!0);a.z_=i}}n&&aa(t)}function DI(r,e,t){const n=q(r),i=n.queries.get(e);if(i)for(const s of i.j_)s.onError(t);n.queries.delete(e)}function aa(r){r.Y_.forEach(e=>{e.next()})}var Io,jc;(jc=Io||(Io={})).ea="default",jc.Cache="cache";class kI{constructor(e,t,n){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=n||{}}X_(e){if(!this.options.includeMetadataChanges){const n=[];for(const i of e.docChanges)i.type!==3&&n.push(i);e=new Dn(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const n=t!=="Offline";return(!this.options._a||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=Dn.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==Io.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class md{constructor(e){this.key=e}}class pd{constructor(e){this.key=e}}class xI{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=K(),this.mutatedKeys=K(),this.Aa=gh(e),this.Ra=new vn(this.Aa)}get Va(){return this.Ta}ma(e,t){const n=t?t.fa:new Uc,i=t?t.Ra:this.Ra;let s=t?t.mutatedKeys:this.mutatedKeys,a=i,u=!1;const c=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,d=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((m,p)=>{const E=i.get(m),P=xr(this.query,p)?p:null,V=!!E&&this.mutatedKeys.has(E.key),x=!!P&&(P.hasLocalMutations||this.mutatedKeys.has(P.key)&&P.hasCommittedMutations);let D=!1;E&&P?E.data.isEqual(P.data)?V!==x&&(n.track({type:3,doc:P}),D=!0):this.ga(E,P)||(n.track({type:2,doc:P}),D=!0,(c&&this.Aa(P,c)>0||d&&this.Aa(P,d)<0)&&(u=!0)):!E&&P?(n.track({type:0,doc:P}),D=!0):E&&!P&&(n.track({type:1,doc:E}),D=!0,(c||d)&&(u=!0)),D&&(P?(a=a.add(P),s=x?s.add(m):s.delete(m)):(a=a.delete(m),s=s.delete(m)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const m=this.query.limitType==="F"?a.last():a.first();a=a.delete(m.key),s=s.delete(m.key),n.track({type:1,doc:m})}return{Ra:a,fa:n,ns:u,mutatedKeys:s}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,i){const s=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const a=e.fa.G_();a.sort((m,p)=>function(P,V){const x=D=>{switch(D){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return M()}};return x(P)-x(V)}(m.type,p.type)||this.Aa(m.doc,p.doc)),this.pa(n),i=i!=null&&i;const u=t&&!i?this.ya():[],c=this.da.size===0&&this.current&&!i?1:0,d=c!==this.Ea;return this.Ea=c,a.length!==0||d?{snapshot:new Dn(this.query,e.Ra,s,a,e.mutatedKeys,c===0,d,!1,!!n&&n.resumeToken.approximateByteSize()>0),wa:u}:{wa:u}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new Uc,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=K(),this.Ra.forEach(n=>{this.Sa(n.key)&&(this.da=this.da.add(n.key))});const t=[];return e.forEach(n=>{this.da.has(n)||t.push(new pd(n))}),this.da.forEach(n=>{e.has(n)||t.push(new md(n))}),t}ba(e){this.Ta=e.Ts,this.da=K();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return Dn.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class NI{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class OI{constructor(e){this.key=e,this.va=!1}}class MI{constructor(e,t,n,i,s,a){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new St(u=>ph(u),es),this.Ma=new Map,this.xa=new Set,this.Oa=new se(N.comparator),this.Na=new Map,this.La=new Xo,this.Ba={},this.ka=new Map,this.qa=Zt.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function LI(r,e,t=!0){const n=Td(r);let i;const s=n.Fa.get(e);return s?(n.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.Da()):i=await gd(n,e,t,!0),i}async function FI(r,e){const t=Td(r);await gd(t,e,!0,!1)}async function gd(r,e,t,n){const i=await rI(r.localStore,Le(e)),s=i.targetId,a=r.sharedClientState.addLocalQueryTarget(s,t);let u;return n&&(u=await UI(r,e,s,a==="current",i.resumeToken)),r.isPrimaryClient&&t&&ud(r.remoteStore,i),u}async function UI(r,e,t,n,i){r.Ka=(p,E,P)=>async function(x,D,G,j){let F=D.view.ma(G);F.ns&&(F=await Oc(x.localStore,D.query,!1).then(({documents:I})=>D.view.ma(I,F)));const Q=j&&j.targetChanges.get(D.targetId),X=j&&j.targetMismatches.get(D.targetId)!=null,$=D.view.applyChanges(F,x.isPrimaryClient,Q,X);return zc(x,D.targetId,$.wa),$.snapshot}(r,p,E,P);const s=await Oc(r.localStore,e,!0),a=new xI(e,s.Ts),u=a.ma(s.documents),c=Nr.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",i),d=a.applyChanges(u,r.isPrimaryClient,c);zc(r,t,d.wa);const m=new NI(e,t,a);return r.Fa.set(e,m),r.Ma.has(t)?r.Ma.get(t).push(e):r.Ma.set(t,[e]),d.snapshot}async function BI(r,e,t){const n=q(r),i=n.Fa.get(e),s=n.Ma.get(i.targetId);if(s.length>1)return n.Ma.set(i.targetId,s.filter(a=>!es(a,e))),void n.Fa.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(i.targetId),n.sharedClientState.isActiveQueryTarget(i.targetId)||await yo(n.localStore,i.targetId,!1).then(()=>{n.sharedClientState.clearQueryState(i.targetId),t&&ta(n.remoteStore,i.targetId),vo(n,i.targetId)}).catch(tn)):(vo(n,i.targetId),await yo(n.localStore,i.targetId,!0))}async function jI(r,e){const t=q(r),n=t.Fa.get(e),i=t.Ma.get(n.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),ta(t.remoteStore,n.targetId))}async function qI(r,e,t){const n=Ed(r);try{const i=await function(a,u){const c=q(a),d=ae.now(),m=u.reduce((P,V)=>P.add(V.key),K());let p,E;return c.persistence.runTransaction("Locally write mutations","readwrite",P=>{let V=ke(),x=K();return c.cs.getEntries(P,m).next(D=>{V=D,V.forEach((G,j)=>{j.isValidDocument()||(x=x.add(G))})}).next(()=>c.localDocuments.getOverlayedDocuments(P,V)).next(D=>{p=D;const G=[];for(const j of u){const F=ry(j,p.get(j.key).overlayedDocument);F!=null&&G.push(new Ct(j.key,F,ah(F.value.mapValue),Ve.exists(!0)))}return c.mutationQueue.addMutationBatch(P,d,G,u)}).next(D=>{E=D;const G=D.applyToLocalDocumentSet(p,x);return c.documentOverlayCache.saveOverlays(P,D.batchId,G)})}).then(()=>({batchId:E.batchId,changes:yh(p)}))}(n.localStore,e);n.sharedClientState.addPendingMutation(i.batchId),function(a,u,c){let d=a.Ba[a.currentUser.toKey()];d||(d=new se(z)),d=d.insert(u,c),a.Ba[a.currentUser.toKey()]=d}(n,i.batchId,t),await Lr(n,i.changes),await Mr(n.remoteStore)}catch(i){const s=oa(i,"Failed to persist write");t.reject(s)}}async function _d(r,e){const t=q(r);try{const n=await eI(t.localStore,e);e.targetChanges.forEach((i,s)=>{const a=t.Na.get(s);a&&(L(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1),i.addedDocuments.size>0?a.va=!0:i.modifiedDocuments.size>0?L(a.va):i.removedDocuments.size>0&&(L(a.va),a.va=!1))}),await Lr(t,n,e)}catch(n){await tn(n)}}function qc(r,e,t){const n=q(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const i=[];n.Fa.forEach((s,a)=>{const u=a.view.Z_(e);u.snapshot&&i.push(u.snapshot)}),function(a,u){const c=q(a);c.onlineState=u;let d=!1;c.queries.forEach((m,p)=>{for(const E of p.j_)E.Z_(u)&&(d=!0)}),d&&aa(c)}(n.eventManager,e),i.length&&n.Ca.d_(i),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function zI(r,e,t){const n=q(r);n.sharedClientState.updateQueryState(e,"rejected",t);const i=n.Na.get(e),s=i&&i.key;if(s){let a=new se(N.comparator);a=a.insert(s,ce.newNoDocument(s,U.min()));const u=K().add(s),c=new is(U.min(),new Map,new se(z),a,u);await _d(n,c),n.Oa=n.Oa.remove(s),n.Na.delete(e),ua(n)}else await yo(n.localStore,e,!1).then(()=>vo(n,e,t)).catch(tn)}async function GI(r,e){const t=q(r),n=e.batch.batchId;try{const i=await Zy(t.localStore,e);Id(t,n,null),yd(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await Lr(t,i)}catch(i){await tn(i)}}async function KI(r,e,t){const n=q(r);try{const i=await function(a,u){const c=q(a);return c.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let m;return c.mutationQueue.lookupMutationBatch(d,u).next(p=>(L(p!==null),m=p.keys(),c.mutationQueue.removeMutationBatch(d,p))).next(()=>c.mutationQueue.performConsistencyCheck(d)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(d,m,u)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,m)).next(()=>c.localDocuments.getDocuments(d,m))})}(n.localStore,e);Id(n,e,t),yd(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await Lr(n,i)}catch(i){await tn(i)}}function yd(r,e){(r.ka.get(e)||[]).forEach(t=>{t.resolve()}),r.ka.delete(e)}function Id(r,e,t){const n=q(r);let i=n.Ba[n.currentUser.toKey()];if(i){const s=i.get(e);s&&(t?s.reject(t):s.resolve(),i=i.remove(e)),n.Ba[n.currentUser.toKey()]=i}}function vo(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Ma.get(e))r.Fa.delete(n),t&&r.Ca.$a(n,t);r.Ma.delete(e),r.isPrimaryClient&&r.La.gr(e).forEach(n=>{r.La.containsKey(n)||vd(r,n)})}function vd(r,e){r.xa.delete(e.path.canonicalString());const t=r.Oa.get(e);t!==null&&(ta(r.remoteStore,t),r.Oa=r.Oa.remove(e),r.Na.delete(t),ua(r))}function zc(r,e,t){for(const n of t)n instanceof md?(r.La.addReference(n.key,e),$I(r,n)):n instanceof pd?(C("SyncEngine","Document no longer in limbo: "+n.key),r.La.removeReference(n.key,e),r.La.containsKey(n.key)||vd(r,n.key)):M()}function $I(r,e){const t=e.key,n=t.path.canonicalString();r.Oa.get(t)||r.xa.has(n)||(C("SyncEngine","New document in limbo: "+t),r.xa.add(n),ua(r))}function ua(r){for(;r.xa.size>0&&r.Oa.size<r.maxConcurrentLimboResolutions;){const e=r.xa.values().next().value;r.xa.delete(e);const t=new N(Z.fromString(e)),n=r.qa.next();r.Na.set(n,new OI(t)),r.Oa=r.Oa.insert(t,n),ud(r.remoteStore,new Ze(Le(zo(t.path)),n,"TargetPurposeLimboResolution",Oe.oe))}}async function Lr(r,e,t){const n=q(r),i=[],s=[],a=[];n.Fa.isEmpty()||(n.Fa.forEach((u,c)=>{a.push(n.Ka(c,e,t).then(d=>{var m;if((d||t)&&n.isPrimaryClient){const p=d?!d.fromCache:(m=t==null?void 0:t.targetChanges.get(c.targetId))===null||m===void 0?void 0:m.current;n.sharedClientState.updateQueryState(c.targetId,p?"current":"not-current")}if(d){i.push(d);const p=ea.Wi(c.targetId,d);s.push(p)}}))}),await Promise.all(a),n.Ca.d_(i),await async function(c,d){const m=q(c);try{await m.persistence.runTransaction("notifyLocalViewChanges","readwrite",p=>A.forEach(d,E=>A.forEach(E.$i,P=>m.persistence.referenceDelegate.addReference(p,E.targetId,P)).next(()=>A.forEach(E.Ui,P=>m.persistence.referenceDelegate.removeReference(p,E.targetId,P)))))}catch(p){if(!Pt(p))throw p;C("LocalStore","Failed to update sequence numbers: "+p)}for(const p of d){const E=p.targetId;if(!p.fromCache){const P=m.os.get(E),V=P.snapshotVersion,x=P.withLastLimboFreeSnapshotVersion(V);m.os=m.os.insert(E,x)}}}(n.localStore,s))}async function HI(r,e){const t=q(r);if(!t.currentUser.isEqual(e)){C("SyncEngine","User change. New user:",e.toKey());const n=await rd(t.localStore,e);t.currentUser=e,function(s,a){s.ka.forEach(u=>{u.forEach(c=>{c.reject(new O(S.CANCELLED,a))})}),s.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await Lr(t,n.hs)}}function WI(r,e){const t=q(r),n=t.Na.get(e);if(n&&n.va)return K().add(n.key);{let i=K();const s=t.Ma.get(e);if(!s)return i;for(const a of s){const u=t.Fa.get(a);i=i.unionWith(u.view.Va)}return i}}function Td(r){const e=q(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=_d.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=WI.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=zI.bind(null,e),e.Ca.d_=VI.bind(null,e.eventManager),e.Ca.$a=DI.bind(null,e.eventManager),e}function Ed(r){const e=q(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=GI.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=KI.bind(null,e),e}class Pr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=us(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return nd(this.persistence,new td,e.initialUser,this.serializer)}Ga(e){return new ed(as.Zr,this.serializer)}Wa(e){return new sd}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Pr.provider={build:()=>new Pr};class QI extends Pr{constructor(e,t,n){super(),this.Ja=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Ja.initialize(this,e),await Ed(this.Ja.syncEngine),await Mr(this.Ja.remoteStore),await this.persistence.yi(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}za(e){return nd(this.persistence,new td,e.initialUser,this.serializer)}ja(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new Ny(n,e.asyncQueue,t)}Ha(e,t){const n=new u_(t,this.persistence);return new a_(e.asyncQueue,n)}Ga(e){const t=Jy(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?Se.withCacheSize(this.cacheSizeBytes):Se.DEFAULT;return new Zo(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,cI(),Ai(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Wa(e){return new sd}}class Gi{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>qc(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=HI.bind(null,this.syncEngine),await RI(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new PI}()}createDatastore(e){const t=us(e.databaseInfo.databaseId),n=function(s){return new uI(s)}(e.databaseInfo);return function(s,a,u,c){return new dI(s,a,u,c)}(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return function(n,i,s,a,u){return new mI(n,i,s,a,u)}(this.localStore,this.datastore,e.asyncQueue,t=>qc(this.syncEngine,t,0),function(){return Lc.D()?new Lc:new sI}())}createSyncEngine(e,t){return function(i,s,a,u,c,d,m){const p=new MI(i,s,a,u,c,d);return m&&(p.Qa=!0),p}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(i){const s=q(i);C("RemoteStore","RemoteStore shutting down."),s.L_.add(5),await Or(s),s.k_.shutdown(),s.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}Gi.provider={build:()=>new Gi};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JI{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):Re("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YI{constructor(e,t,n,i,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=i,this.user=ge.UNAUTHENTICATED,this.clientId=Hl.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(n,async a=>{C("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(n,a=>(C("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new et;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=oa(t,"Failed to shutdown persistence");e.reject(n)}}),e.promise}}async function $s(r,e){r.asyncQueue.verifyOperationInProgress(),C("FirestoreClient","Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener(async i=>{n.isEqual(i)||(await rd(e.localStore,i),n=i)}),e.persistence.setDatabaseDeletedListener(()=>r.terminate()),r._offlineComponents=e}async function Gc(r,e){r.asyncQueue.verifyOperationInProgress();const t=await XI(r);C("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener(n=>Fc(e.remoteStore,n)),r.setAppCheckTokenChangeListener((n,i)=>Fc(e.remoteStore,i)),r._onlineComponents=e}async function XI(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){C("FirestoreClient","Using user provided OfflineComponentProvider");try{await $s(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(i){return i.name==="FirebaseError"?i.code===S.FAILED_PRECONDITION||i.code===S.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(t))throw t;Ht("Error using user provided cache. Falling back to memory cache: "+t),await $s(r,new Pr)}}else C("FirestoreClient","Using default OfflineComponentProvider"),await $s(r,new Pr);return r._offlineComponents}async function wd(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(C("FirestoreClient","Using user provided OnlineComponentProvider"),await Gc(r,r._uninitializedComponentsProvider._online)):(C("FirestoreClient","Using default OnlineComponentProvider"),await Gc(r,new Gi))),r._onlineComponents}function ZI(r){return wd(r).then(e=>e.syncEngine)}async function ev(r){const e=await wd(r),t=e.eventManager;return t.onListen=LI.bind(null,e.syncEngine),t.onUnlisten=BI.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=FI.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=jI.bind(null,e.syncEngine),t}function tv(r,e,t={}){const n=new et;return r.asyncQueue.enqueueAndForget(async()=>function(s,a,u,c,d){const m=new JI({next:E=>{m.Za(),a.enqueueAndForget(()=>CI(s,p)),E.fromCache&&c.source==="server"?d.reject(new O(S.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(E)},error:E=>d.reject(E)}),p=new kI(u,m,{includeMetadataChanges:!0,_a:!0});return SI(s,p)}(await ev(r),r.asyncQueue,e,t,n)),n.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ad(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kc=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rd(r,e,t){if(!t)throw new O(S.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function nv(r,e,t,n){if(e===!0&&n===!0)throw new O(S.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function $c(r){if(!N.isDocumentKey(r))throw new O(S.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Hc(r){if(N.isDocumentKey(r))throw new O(S.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function ca(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=function(n){return n.constructor?n.constructor.name:null}(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":M()}function en(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new O(S.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=ca(r);throw new O(S.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wc{constructor(e){var t,n;if(e.host===void 0){if(e.ssl!==void 0)throw new O(S.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new O(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}nv("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Ad((n=e.experimentalLongPollingOptions)!==null&&n!==void 0?n:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new O(S.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new O(S.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new O(S.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(n,i){return n.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ls{constructor(e,t,n,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Wc({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new O(S.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new O(S.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Wc(e),e.credentials!==void 0&&(this._authCredentials=function(n){if(!n)return new Qg;switch(n.type){case"firstParty":return new Zg(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new O(S.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const n=Kc.get(t);n&&(C("ComponentProvider","Removing Datastore"),Kc.delete(t),n.terminate())}(this),Promise.resolve()}}function rv(r,e,t,n={}){var i;const s=(r=en(r,ls))._getSettings(),a=`${e}:${t}`;if(s.host!=="firestore.googleapis.com"&&s.host!==a&&Ht("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),r._setSettings(Object.assign(Object.assign({},s),{host:a,ssl:!1})),n.mockUserToken){let u,c;if(typeof n.mockUserToken=="string")u=n.mockUserToken,c=ge.MOCK_USER;else{u=Sf(n.mockUserToken,(i=r._app)===null||i===void 0?void 0:i.options.projectId);const d=n.mockUserToken.sub||n.mockUserToken.user_id;if(!d)throw new O(S.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new ge(d)}r._authCredentials=new Jg(new $l(u,c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hs{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new hs(this.firestore,e,this._query)}}class Fe{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new wt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Fe(this.firestore,e,this._key)}}class wt extends hs{constructor(e,t,n){super(e,t,zo(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Fe(this.firestore,null,new N(e))}withConverter(e){return new wt(this.firestore,e,this._path)}}function Sv(r,e,...t){if(r=xe(r),Rd("collection","path",e),r instanceof ls){const n=Z.fromString(e,...t);return Hc(n),new wt(r,null,n)}{if(!(r instanceof Fe||r instanceof wt))throw new O(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Z.fromString(e,...t));return Hc(n),new wt(r.firestore,null,n)}}function Cv(r,e,...t){if(r=xe(r),arguments.length===1&&(e=Hl.newId()),Rd("doc","path",e),r instanceof ls){const n=Z.fromString(e,...t);return $c(n),new Fe(r,null,new N(n))}{if(!(r instanceof Fe||r instanceof wt))throw new O(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Z.fromString(e,...t));return $c(n),new Fe(r.firestore,r instanceof wt?r.converter:null,new N(n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qc{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new od(this,"async_queue_retry"),this.Vu=()=>{const n=Ai();n&&C("AsyncQueue","Visibility state changed to "+n.visibilityState),this.t_.jo()},this.mu=e;const t=Ai();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=Ai();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new et;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Pt(e))throw e;C("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(n=>{this.Eu=n,this.du=!1;const i=function(a){let u=a.message||"";return a.stack&&(u=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),u}(n);throw Re("INTERNAL UNHANDLED ERROR: ",i),n}).then(n=>(this.du=!1,n))));return this.mu=t,t}enqueueAfterDelay(e,t,n){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const i=sa.createAndSchedule(this,e,t,n,s=>this.yu(s));return this.Tu.push(i),i}fu(){this.Eu&&M()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,n)=>t.targetTimeMs-n.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}class Fr extends ls{constructor(e,t,n,i){super(e,t,n,i),this.type="firestore",this._queue=new Qc,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Qc(e),this._firestoreClient=void 0,await e}}}function Vv(r,e){const t=typeof r=="object"?r:ol(),n=typeof r=="string"?r:"(default)",i=wo(t,"firestore").getImmediate({identifier:n});if(!i._initialized){const s=bf("firestore");s&&rv(i,...s)}return i}function bd(r){if(r._terminated)throw new O(S.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||Pd(r),r._firestoreClient}function Pd(r){var e,t,n;const i=r._freezeSettings(),s=function(u,c,d,m){return new V_(u,c,d,m.host,m.ssl,m.experimentalForceLongPolling,m.experimentalAutoDetectLongPolling,Ad(m.experimentalLongPollingOptions),m.useFetchStreams)}(r._databaseId,((e=r._app)===null||e===void 0?void 0:e.options.appId)||"",r._persistenceKey,i);r._componentsProvider||!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((n=i.localCache)===null||n===void 0)&&n._onlineComponentProvider)&&(r._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),r._firestoreClient=new YI(r._authCredentials,r._appCheckCredentials,r._queue,s,r._componentsProvider&&function(u){const c=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(c),_online:c}}(r._componentsProvider))}function Dv(r,e){Ht("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const t=r._freezeSettings();return iv(r,Gi.provider,{build:n=>new QI(n,t.cacheSizeBytes,void 0)}),Promise.resolve()}function iv(r,e,t){if((r=en(r,Fr))._firestoreClient||r._terminated)throw new O(S.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(r._componentsProvider||r._getSettings().localCache)throw new O(S.FAILED_PRECONDITION,"SDK cache is already specified.");r._componentsProvider={_online:e,_offline:t},Pd(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new kn(he.fromBase64String(e))}catch(t){throw new O(S.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new kn(he.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class la{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new O(S.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new oe(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ha{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class da{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new O(S.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new O(S.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return z(this._lat,e._lat)||z(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fa{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(n,i){if(n.length!==i.length)return!1;for(let s=0;s<n.length;++s)if(n[s]!==i[s])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sv=/^__.*__$/;class ov{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new Ct(e,this.data,this.fieldMask,t,this.fieldTransforms):new Fn(e,this.data,t,this.fieldTransforms)}}function Sd(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw M()}}class ma{constructor(e,t,n,i,s,a){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=i,s===void 0&&this.vu(),this.fieldTransforms=s||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new ma(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:n,xu:!1});return i.Ou(e),i}Nu(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:n,xu:!1});return i.vu(),i}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return Ki(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(Sd(this.Cu)&&sv.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class av{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||us(e)}Qu(e,t,n,i=!1){return new ma({Cu:e,methodName:t,qu:n,path:oe.emptyPath(),xu:!1,ku:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function uv(r){const e=r._freezeSettings(),t=us(r._databaseId);return new av(r._databaseId,!!e.ignoreUndefinedProperties,t)}function cv(r,e,t,n,i,s={}){const a=r.Qu(s.merge||s.mergeFields?2:0,e,t,i);kd("Data must be an object, but it was:",a,n);const u=Vd(n,a);let c,d;if(s.merge)c=new Me(a.fieldMask),d=a.fieldTransforms;else if(s.mergeFields){const m=[];for(const p of s.mergeFields){const E=lv(e,p,t);if(!a.contains(E))throw new O(S.INVALID_ARGUMENT,`Field '${E}' is specified in your field mask but missing from your input data.`);dv(m,E)||m.push(E)}c=new Me(m),d=a.fieldTransforms.filter(p=>c.covers(p.field))}else c=null,d=a.fieldTransforms;return new ov(new Ce(u),c,d)}class pa extends ha{_toFieldTransform(e){return new Rh(e.path,new Pn)}isEqual(e){return e instanceof pa}}function Cd(r,e){if(Dd(r=xe(r)))return kd("Unsupported field value:",e,r),Vd(r,e);if(r instanceof ha)return function(n,i){if(!Sd(i.Cu))throw i.Bu(`${n._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Bu(`${n._methodName}() is not currently supported inside arrays`);const s=n._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(n,i){const s=[];let a=0;for(const u of n){let c=Cd(u,i.Lu(a));c==null&&(c={nullValue:"NULL_VALUE"}),s.push(c),a++}return{arrayValue:{values:s}}}(r,e)}return function(n,i){if((n=xe(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return Y_(i.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const s=ae.fromDate(n);return{timestampValue:Vn(i.serializer,s)}}if(n instanceof ae){const s=new ae(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:Vn(i.serializer,s)}}if(n instanceof da)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof kn)return{bytesValue:kh(i.serializer,n._byteString)};if(n instanceof Fe){const s=i.databaseId,a=n.firestore._databaseId;if(!a.isEqual(s))throw i.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:Qo(n.firestore._databaseId||i.databaseId,n._key.path)}}if(n instanceof fa)return function(a,u){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(c=>{if(typeof c!="number")throw u.Bu("VectorValues must only contain numeric values.");return Go(u.serializer,c)})}}}}}}(n,i);throw i.Bu(`Unsupported field value: ${ca(n)}`)}(r,e)}function Vd(r,e){const t={};return rh(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Ln(r,(n,i)=>{const s=Cd(i,e.Mu(n));s!=null&&(t[n]=s)}),{mapValue:{fields:t}}}function Dd(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof ae||r instanceof da||r instanceof kn||r instanceof Fe||r instanceof ha||r instanceof fa)}function kd(r,e,t){if(!Dd(t)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(t)){const n=ca(t);throw n==="an object"?e.Bu(r+" a custom object"):e.Bu(r+" "+n)}}function lv(r,e,t){if((e=xe(e))instanceof la)return e._internalPath;if(typeof e=="string")return xd(r,e);throw Ki("Field path arguments must be of type string or ",r,!1,void 0,t)}const hv=new RegExp("[~\\*/\\[\\]]");function xd(r,e,t){if(e.search(hv)>=0)throw Ki(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new la(...e.split("."))._internalPath}catch{throw Ki(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function Ki(r,e,t,n,i){const s=n&&!n.isEmpty(),a=i!==void 0;let u=`Function ${e}() called with invalid data`;t&&(u+=" (via `toFirestore()`)"),u+=". ";let c="";return(s||a)&&(c+=" (found",s&&(c+=` in field ${n}`),a&&(c+=` in document ${i}`),c+=")"),new O(S.INVALID_ARGUMENT,u+r+c)}function dv(r,e){return r.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nd{constructor(e,t,n,i,s){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new Fe(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new fv(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Od("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class fv extends Nd{data(){return super.data()}}function Od(r,e){return typeof e=="string"?xd(r,e):e instanceof la?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mv(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new O(S.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class pv{convertValue(e,t="none"){switch(Qt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ie(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(At(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw M()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return Ln(e,(i,s)=>{n[i]=this.convertValue(s,t)}),n}convertVectorValue(e){var t,n,i;const s=(i=(n=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||n===void 0?void 0:n.values)===null||i===void 0?void 0:i.map(a=>ie(a.doubleValue));return new fa(s)}convertGeoPoint(e){return new da(ie(e.latitude),ie(e.longitude))}convertArray(e,t){return(e.values||[]).map(n=>this.convertValue(n,t))}convertServerTimestamp(e,t){switch(t){case"previous":const n=Bo(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(wr(e));default:return null}}convertTimestamp(e){const t=it(e);return new ae(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=Z.fromString(e);L(qh(n));const i=new Wt(n.get(1),n.get(3)),s=new N(n.popFirst(5));return i.isEqual(t)||Re(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gv(r,e,t){let n;return n=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hi{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class _v extends Nd{constructor(e,t,n,i,s,a){super(e,t,n,i,a),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Ri(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(Od("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}}class Ri extends _v{data(e={}){return super.data(e)}}class yv{constructor(e,t,n,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new hi(i.hasPendingWrites,i.fromCache),this.query=n}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(n=>{e.call(t,new Ri(this._firestore,this._userDataWriter,n.key,n,new hi(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new O(S.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let a=0;return i._snapshot.docChanges.map(u=>{const c=new Ri(i._firestore,i._userDataWriter,u.doc.key,u.doc,new hi(i._snapshot.mutatedKeys.has(u.doc.key),i._snapshot.fromCache),i.query.converter);return u.doc,{type:"added",doc:c,oldIndex:-1,newIndex:a++}})}{let a=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(u=>s||u.type!==3).map(u=>{const c=new Ri(i._firestore,i._userDataWriter,u.doc.key,u.doc,new hi(i._snapshot.mutatedKeys.has(u.doc.key),i._snapshot.fromCache),i.query.converter);let d=-1,m=-1;return u.type!==0&&(d=a.indexOf(u.doc.key),a=a.delete(u.doc.key)),u.type!==1&&(a=a.add(u.doc),m=a.indexOf(u.doc.key)),{type:Iv(u.type),doc:c,oldIndex:d,newIndex:m}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function Iv(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return M()}}class vv extends pv{constructor(e){super(),this.firestore=e}convertBytes(e){return new kn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Fe(this.firestore,null,t)}}function kv(r){r=en(r,hs);const e=en(r.firestore,Fr),t=bd(e),n=new vv(e);return mv(r._query),tv(t,r._query).then(i=>new yv(e,n,r,i))}function xv(r,e,t){r=en(r,Fe);const n=en(r.firestore,Fr),i=gv(r.converter,e,t);return Md(n,[cv(uv(n),"setDoc",r._key,i,r.converter!==null,t).toMutation(r._key,Ve.none())])}function Nv(r){return Md(en(r.firestore,Fr),[new rs(r._key,Ve.none())])}function Md(r,e){return function(n,i){const s=new et;return n.asyncQueue.enqueueAndForget(async()=>qI(await ZI(n),i,s)),s.promise}(bd(r),e)}function Ov(){return new pa("serverTimestamp")}(function(e,t=!0){(function(i){Mn=i})(xn),Tn(new Kt("firestore",(n,{instanceIdentifier:i,options:s})=>{const a=n.getProvider("app").getImmediate(),u=new Fr(new Yg(n.getProvider("auth-internal")),new t_(n.getProvider("app-check-internal")),function(d,m){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new O(S.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Wt(d.options.projectId,m)}(a,i),a);return s=Object.assign({useFetchStreams:t},s),u._setSettings(s),u},"PUBLIC").setMultipleInstances(!0)),Tt(Gu,"4.7.3",e),Tt(Gu,"4.7.3","esm2017")})();export{mt as G,mi as O,Vv as a,Ev as b,Sv as c,kv as d,Dv as e,Ov as f,Av as g,Cv as h,jm as i,xv as j,Nv as k,Tv as o,wv as s};
