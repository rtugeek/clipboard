import{d as W,r,G as A,T as k,B as i,a as x,k as B,C as f,b,u as S,c as _,w as E,S as h,H as P,o as v,e as w,f as m,t as $,F,g as G,h as l,_ as I}from"./index-kqS5jR-h.js";import{s as T,a as O}from"./SearchPlatform-Hd4bbxEl.js";const D=W("searchWindowStore",()=>{const u=r(600),a=r(56),s=r(!1),o=r(0),c=r(o.value-a.value);let n=-1;function t(){clearTimeout(n)}function e(){t(),n=window.setTimeout(()=>{g()},3e3)}async function d(){return(await i.getPosition()).y<=c.value}const p=A({duration:500,transition:k.easeOutCubic,onStarted:async()=>{await i.showInactive()},onFinished:async()=>{await d()&&(s.value=!1,await i.hide())}}),y=async()=>{await i.showInactive(),p.animate(o.value),s.value=!0,e()},g=async()=>{p.animate(c.value)};async function C(){await i.setup({width:u.value,height:a.value,maxHeight:a.value,maxWidth:u.value,movable:!1,resizable:!1,alwaysOnTop:!0}),await i.alignToScreen("top-center"),await i.setPosition({y:o.value}),e()}return{show:y,showing:s,hide:g,isHide:d,clearHideTimer:t,startHideTimer:e,setup:C}}),L={class:"content"},M={class:"actions"},N=["onClick"],V=["src","alt"],Y=x({__name:"SearchWidgetView",setup(u){const a=r(""),s=D();s.setup(),B([f.CHANGED,b.FOCUS],async n=>{n.event==f.CHANGED&&(a.value=n.payload.content,await i.setAlwaysOnTop(!0),s.show())});const o=S(`${_.name}.shortcut`,"Meta+Alt+S",{listenToStorageChanges:!0}),c=S(`${_.name}.platform`,"google",{listenToStorageChanges:!0});return E(o,(n,t)=>{h.unregister(t),h.register(n)}),h.register(o.value),P(()=>{a.value&&T(c.value,a.value)}),(n,t)=>(v(),w("div",{class:"hover-wrapper",onMouseenter:t[0]||(t[0]=e=>l(s).clearHideTimer()),onMouseleave:t[1]||(t[1]=e=>l(s).startHideTimer())},[m("div",L,$(a.value),1),m("div",M,[(v(!0),w(F,null,G(l(O),e=>(v(),w("div",{key:e.value,class:"search-engine",onClick:d=>l(T)(e.value,a.value)},[m("img",{src:e.icon,alt:e.title},null,8,V)],8,N))),128))])],32))}}),j=I(Y,[["__scopeId","data-v-2402021a"]]);export{j as default};