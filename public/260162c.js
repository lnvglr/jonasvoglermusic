(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{258:function(t,e,n){t.exports={"fast-01":"70","fast-02":"110","moderate-01":"150","moderate-02":"240","slow-01":"400","slow-02":"700","extraslow-01":"1200","extraslow-02":"2000"}},260:function(t,e,n){},264:function(t,e,n){"use strict";n(260)},266:function(t,e,n){"use strict";n.r(e);var o=n(258),r=n.n(o),l={name:"TransitionExpand",props:["scrollReference"],data:function(){return{variables:r.a}},methods:{enter:function(element){window.scrollTo({top:this.scrollReference,behavior:"smooth"});var t=getComputedStyle(element).width;element.style.width=t,element.style.position="absolute",element.style.visibility="hidden",element.style.height="auto";var e=getComputedStyle(element).height;element.style.width=null,element.style.position=null,element.style.visibility=null,element.style.height=0,getComputedStyle(element).height,requestAnimationFrame((function(){element.style.height=e}))},afterEnter:function(element){requestAnimationFrame((function(){element.style.height="auto"})),this.afterTransition()},leave:function(element){var t=getComputedStyle(element).height;element.style.height=t,getComputedStyle(element).height,requestAnimationFrame((function(){element.style.height=0}))},afterLeave:function(element){this.afterTransition()},afterTransition:function(){window.dispatchEvent(new CustomEvent("afterTransition"))}}},h=(n(264),n(10)),component=Object(h.a)(l,(function(){var t=this,e=t.$createElement;return(t._self._c||e)("transition",{attrs:{name:"expand"},on:{enter:t.enter,"after-enter":t.afterEnter,leave:t.leave,"after-leave":t.afterLeave}},[t._t("default")],2)}),[],!1,null,"58cd22f8",null);e.default=component.exports}}]);