System.register(["./index-legacy-CrO6uvyO.js"],(function(l,e){"use strict";var a,u,t,o,r,n,d,i,s,c,f,v,m,p,_,y,h,g,k,x,V,w,U,b,P,E;return{setters:[l=>{a=l.d,u=l.r,t=l.m,o=l.c,r=l.w,n=l.u,d=l.a,i=l.o,s=l.b,c=l.v,f=l.x,v=l.h,m=l.A,p=l.e,_=l.ae,y=l.L,h=l.H,g=l.af,k=l.I,x=l.g,V=l.i,w=l.j,U=l.k,b=l.l,P=l.ag,E=l.ah}],execute:function(){const e={class:"p-4"},L=["src"],N={class:"mt-4"};l("default",a({__name:"ProfilePage",setup(l){var a,S;const j=d(),z=u(t.currentUser),A=u((null===(a=z.value)||void 0===a?void 0:a.displayName)||""),C=u((null===(S=z.value)||void 0===S?void 0:S.email)||""),R=async()=>{if(z.value)try{await P(z.value,{displayName:A.value})}catch(l){console.error("Erro ao atualizar perfil:",l)}},H=async()=>{try{await E(t),j.push("/login")}catch(l){console.error("Erro ao fazer logout:",l)}};return(l,a)=>(i(),o(n(b),null,{default:r((()=>[s(n(m),null,{default:r((()=>[s(n(c),null,{default:r((()=>[s(n(f),null,{default:r((()=>a[2]||(a[2]=[v("Perfil")]))),_:1})])),_:1})])),_:1}),s(n(U),{fullscreen:!0},{default:r((()=>[p("div",e,[s(n(_),{class:"w-24 h-24 mx-auto mb-4"},{default:r((()=>{var l;return[null!==(l=z.value)&&void 0!==l&&l.photoURL?(i(),y("img",{key:0,src:z.value.photoURL,alt:"Profile photo"},null,8,L)):(i(),o(n(h),{key:1,icon:n(g),class:"w-full h-full"},null,8,["icon"]))]})),_:1}),s(n(k),null,{default:r((()=>[s(n(x),{position:"stacked"},{default:r((()=>a[3]||(a[3]=[v("Nome")]))),_:1}),s(n(V),{modelValue:A.value,"onUpdate:modelValue":a[0]||(a[0]=l=>A.value=l),type:"text"},null,8,["modelValue"])])),_:1}),s(n(k),null,{default:r((()=>[s(n(x),{position:"stacked"},{default:r((()=>a[4]||(a[4]=[v("Email")]))),_:1}),s(n(V),{modelValue:C.value,"onUpdate:modelValue":a[1]||(a[1]=l=>C.value=l),type:"email",readonly:""},null,8,["modelValue"])])),_:1}),p("div",N,[s(n(w),{expand:"block",onClick:R},{default:r((()=>a[5]||(a[5]=[v(" Salvar Alterações ")]))),_:1}),s(n(w),{expand:"block",color:"danger",onClick:H,class:"mt-4"},{default:r((()=>a[6]||(a[6]=[v(" Sair ")]))),_:1})])])])),_:1})])),_:1}))}}))}}}));
