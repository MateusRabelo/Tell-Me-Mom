import{d as b,r as d,D as k,E as S,F as x,c as p,w as n,u as s,a as C,m,o,b as l,v as U,x as E,h as N,A as w,L as v,M as B,e as h,N as M,O as P,P as T,k as V,l as A,S as q,T as D,t as F,U as O,V as j,I as H,g as R,y as _}from"./index-BGNe5PAX.js";import{L as W}from"./ListItemsModal-UwcQ5Qrz.js";const $={key:0,class:"flex justify-center items-center h-full"},z={key:1,class:"p-4 text-center"},Q=b({__name:"SharedListsPage",setup(G){const L=C(),c=d([]),u=d(!0),i=d(null),f=d(!1),g=d(null),I=async()=>{if(m.currentUser)try{u.value=!0,i.value&&i.value();const t=q(D(F,"lists"),O("sharedWith","array-contains",m.currentUser.uid)),e=j(t,a=>{c.value=a.docs.map(r=>({id:r.id,...r.data()})),u.value=!1},a=>{console.error("Erro ao carregar listas compartilhadas:",a),alert("Erro ao carregar listas. Por favor, recarregue a página."),u.value=!1});i.value=e}catch(t){console.error("Erro ao configurar listener:",t),u.value=!1}};k(()=>{const t=S(m,e=>{e?I():L.push("/login")});x(()=>{t(),i.value&&i.value()})});const y=t=>{g.value=t,f.value=!0};return(t,e)=>(o(),p(s(A),null,{default:n(()=>[l(s(w),null,{default:n(()=>[l(s(U),null,{default:n(()=>[l(s(E),null,{default:n(()=>e[1]||(e[1]=[N("Listas Compartilhadas")])),_:1})]),_:1})]),_:1}),l(s(V),{fullscreen:!0},{default:n(()=>[u.value?(o(),v("div",$,[l(s(B))])):c.value.length===0?(o(),v("div",z,e[2]||(e[2]=[h("p",null,"Nenhuma lista compartilhada encontrada",-1)]))):(o(),p(s(M),{key:2},{default:n(()=>[(o(!0),v(T,null,P(c.value,a=>(o(),p(s(H),{key:a.id,onClick:r=>y(a)},{default:n(()=>[l(s(R),null,{default:n(()=>{var r;return[h("h2",null,_(a.name),1),h("p",null,_(((r=a.items)==null?void 0:r.length)||0)+" items",1)]}),_:2},1024)]),_:2},1032,["onClick"]))),128))]),_:1}))]),_:1}),l(W,{"is-open":f.value,"onUpdate:isOpen":e[0]||(e[0]=a=>f.value=a),list:g.value,onListUpdated:I},null,8,["is-open","list"])]),_:1}))}});export{Q as default};