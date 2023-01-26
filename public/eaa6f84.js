(window.webpackJsonp=window.webpackJsonp||[]).push([[1,19,20,21],{258:function(e,t,n){e.exports={"fast-01":"70","fast-02":"110","moderate-01":"150","moderate-02":"240","slow-01":"400","slow-02":"700","extraslow-01":"1200","extraslow-02":"2000"}},259:function(e,t,n){"use strict";var o=n(2),r=n(67).find,l=n(121),c="find",d=!0;c in[]&&Array(1).find((function(){d=!1})),o({target:"Array",proto:!0,forced:d},{find:function(e){return r(this,e,arguments.length>1?arguments[1]:void 0)}}),l(c)},261:function(e,t,n){},262:function(e,t,n){},271:function(e,t,n){"use strict";n(261)},272:function(e,t,n){},274:function(e,t,n){"use strict";n(262)},275:function(e,t,n){},276:function(e,t,n){},289:function(e,t,n){"use strict";n.r(t);n(19),n(15),n(11),n(25),n(14),n(26);var o=n(6),r=(n(44),n(292),n(119),n(309)),l=n(310),c=n(8),d=n(290),f=n(122);function v(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function h(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?v(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):v(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var m={name:"Hero",props:{open:Boolean,project:Object},components:{LazyImage:d.default,youtube:r.Youtube,vimeo:l.a},data:function(){return{srcSet:"",sizes:"",hero:{type:"",data:""},player:null}},computed:h(h({},Object(c.b)({cookieConsent:"getCookieConsent"})),{},{imageSizes:function(){return this.generateSrcSet()},isExternalVideo:function(){return["vimeo","youtube"].includes(this.hero.type)},cookieMessage:function(){var e;switch(this.hero.type){case"youtube":e="https://www.youtube.com/watch?v=".concat(this.hero.data);break;case"vimeo":e="https://vimeo.com/".concat(this.hero.data);break;default:e=this.hero.data}return f.default.methods.blockedCookies(e)}}),mounted:function(){this.$nextTick((function(){this.heroType(),this.heroLoaded()}))},methods:{heroLoaded:function(e){var t=!this.project.thumbnail||e;this.$emit("loaded",t)},generateSrcSet:function(){var e=["thumbnail","cinema-small","cinema-medium","cinema-large","cinema-xlarge"],t=[],n=[],o=[];if(this.project.thumbnail){for(var r in this.project.thumbnail)e.includes(r)&&o.push([this.project.thumbnail[r][0],this.project.thumbnail[r][1]]);o.sort((function(a,b){return a[1]-b[1]})),o.forEach((function(e,i,o){if(t.push(e[0]+" "+e[1]+"w"),i===o.length-1)n.push(e[1]+"px");else;})),this.srcSet=t.join(", "),this.sizes="100vw"}},heroType:function(){var e,t;if(null!==(e=this.project.field)&&void 0!==e&&null!==(t=e.hero)&&void 0!==t&&t.type){var n=this.project.field.hero.type;this.project.field.hero[n]&&(this.hero.type=n,this.hero.data=this.project.field.hero[n])}},playing:function(){this.$emit("playing",!0)},paused:function(){this.$emit("playing",!1)},updatePlaying:function(e){1===e?this.playing():this.paused()}},watch:{imageSizes:function(e){this.generateSrcSet()}}},y=(n(295),n(10)),component=Object(y.a)(m,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e.project.thumbnail&&e.project.thumbnail["cinema-small"]?n("LazyImage",{class:e.hero.type,attrs:{lazySrc:e.project.thumbnail["cinema-small"][0],lazySrcset:e.srcSet,alt:e.project.title.rendered},on:{loaded:e.heroLoaded}}):e._e(),e._v(" "),n("transition",{attrs:{name:"slide-in",mode:"out-in"}},[e.open&&e.hero.type?n("div",{ref:"hero-container",staticClass:"hero-container"},["vimeo"===e.hero.type&&e.cookieConsent?n("client-only",[n("vimeo",{ref:"video",class:e.hero.type,attrs:{"video-id":e.hero.data},on:{playing:e.playing,pause:e.paused}})],1):e._e(),e._v(" "),"youtube"===e.hero.type&&e.cookieConsent?n("youtube",{ref:"video",class:e.hero.type,attrs:{host:"https://www.youtube-nocookie.com","video-id":e.hero.data,"player-vars":{rel:0},nocookie:!0},on:{playing:e.playing,paused:e.paused}}):"video_local"===e.hero.type?n("figure",{ref:"video"},[n("video",{class:e.hero.type,attrs:{controls:"",controlsList:"nodownload",src:e.hero.data,alt:e.project.title.rendered},on:{playing:e.updatePlaying}})]):"image_link"===e.hero.type?n("figure",[n("img",{class:e.hero.type,attrs:{src:e.hero.data,alt:e.project.title.rendered}})]):e.isExternalVideo&&!e.cookieConsent?n("div",{staticClass:"cookie-consent",domProps:{innerHTML:e._s(e.cookieMessage)}}):e._e()],1):e._e()])],1)}),[],!1,null,"16404328",null);t.default=component.exports},290:function(e,t,n){"use strict";n.r(t);var o=n(288),r=n.n(o),l={name:"LazyImage",props:{lazySrc:{type:String,default:null},lazySrcset:{type:String,default:null}},data:function(){return{loaded:!1}},mounted:function(){r()(this.$el).observe(),this.heroLoaded()},methods:{heroLoaded:function(){var e=this;this.$el.onload=function(){this.setAttribute("data-fully-loaded",!0),e.$emit("loaded",!0)}}}},c=(n(271),n(10)),component=Object(c.a)(l,(function(){var e=this,t=e.$createElement;return(e._self._c||t)("img",{staticClass:"lazy-image",attrs:{"data-srcset":e.lazySrcset,"data-src":e.lazySrc,src:e.lazySrc}})}),[],!1,null,"7cb16528",null);t.default=component.exports},291:function(e,t,n){"use strict";n.r(t);n(188);var o={name:"Details",props:{festival:Object,small:{type:Boolean,default:!1},active:{type:Boolean,default:!0},delay:{type:Number,default:100}},computed:{laurel:function(){return'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="415.4px" height="801.7px" viewBox="0 0 415.4 801.7" style="enable-background:new 0 0 415.4 801.7;" xml:space="preserve">\n        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#laurel"/>\n      </svg>'}}},r=(n(274),n(10)),component=Object(r.a)(o,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"festival-container",class:{small:e.small,active:e.active},style:"--delay: "+e.delay+"ms"},[n("div",{staticClass:"laurel-part",domProps:{innerHTML:e._s(e.laurel)}}),e._v(" "),e.festival.placement?n("div",{staticClass:"festival"},[n("span",{staticClass:"placement"},[e._v(e._s(e.festival.placement))]),e._v(" "),e.festival.category?n("span",{staticClass:"category"},[e._v(e._s(e.festival.category))]):e._e(),e._v(" "),n("span",[e.festival.title?n("span",{staticClass:"title"},[e._v(e._s(e.festival.title))]):e._e(),e._v(" "),e.festival.subtitle?n("span",{staticClass:"subtitle"},[e._v(" – "+e._s(e.festival.subtitle))]):e._e()]),e._v(" "),e.festival.year?n("span",{staticClass:"year"},[e._v(e._s(e.festival.year))]):e._e()]):n("div",{staticClass:"festival"},[e.festival.title?n("span",{staticClass:"title"},[e._v(e._s(e.festival.title))]):e._e(),e._v(" "),e.festival.subtitle?n("span",{staticClass:"subtitle"},[e._v(e._s(e.festival.subtitle))]):e._e(),e._v(" "),e.festival.year?n("span",{staticClass:"year"},[e._v(e._s(e.festival.year))]):e._e()]),e._v(" "),n("div",{staticClass:"laurel-part mirror",domProps:{innerHTML:e._s(e.laurel)}})])}),[],!1,null,"37e6e15d",null);t.default=component.exports},295:function(e,t,n){"use strict";n(272)},297:function(e,t,n){"use strict";n(275)},298:function(e,t,n){"use strict";n(276)},306:function(e,t,n){"use strict";n.r(t);n(188);var o=n(291),r=n(258),l=n.n(r),c={name:"Details",components:{Festival:o.default},props:{festivals:[Array,Boolean],small:{type:Boolean,default:!1},active:{type:Boolean,default:!0}},data:function(){return{variables:l.a}},methods:{delay:function(i){var e;return this.festivals?null!==(e=this.variables)&&void 0!==e&&e["moderate-01"]?Number(this.variables["moderate-01"])/this.festivals.length*(this.festivals.length-i):50*(this.festivals.length-i):100}}},d=(n(297),n(298),n(10)),component=Object(d.a)(c,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.festivals?n("div",{staticClass:"festivals",class:{active:e.active}},e._l(e.festivals,(function(t,i){return n("Festival",{key:i,attrs:{delay:e.delay(i),festival:t,small:e.small,active:e.active}})})),1):e._e()}),[],!1,null,"6b7b0568",null);t.default=component.exports},311:function(e,t,n){},312:function(e,t,n){},325:function(e,t,n){"use strict";n.r(t);n(19),n(15),n(25),n(14),n(26);var o=n(6),r=(n(43),n(51),n(38),n(259),n(44),n(58),n(56),n(119),n(50),n(11),n(8)),l=n(113),c=n.n(l),d=n(289),f=n(306);function v(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function h(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?v(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):v(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var m={name:"ProjectHeader",components:{ProjectHero:d.default,FestivalContainer:f.default},props:{project:Object,isOpen:Boolean,heroIsVideo:Boolean},data:function(){return{cinemaScope:.4189,description:null,hover:null}},computed:h(h({},Object(r.b)({experimental:"getExperimental"})),{},{projectTitle:function(){var title=this.project.title.rendered;return title.length>30?title.replace(/([.,!;:–])/g,"$1<br>"):title},projectSubtitle:function(){var e,t,n,o,r;return[null===(e=this.project.field)||void 0===e||null===(t=e.genre)||void 0===t?void 0:t.name,(null===(n=this.project.field)||void 0===n?void 0:n.details.length)>0?null===(o=this.project.field)||void 0===o||null===(r=o.details.find((function(e){return e.label.toLowerCase().includes("year")})))||void 0===r?void 0:r.value:""].filter((function(e){return null!==e})).map((function(e){return"<span>".concat(e,"</span>")})).join('<span class="sr-only">,</span><span class="em-space"> </span>').concat('<span class="sr-only">:</span>')},headerFestivals:function(){var e;if(null!==(e=this.project.field)&&void 0!==e&&e.festivals)return this.project.field.festivals.filter((function(e){return e.show_in_header}))},aspectRatio:function(){var e,t,n;switch(this.isOpen&&null!==(e=this.project.field)&&void 0!==e&&e.hero?null===(t=this.project.field)||void 0===t||null===(n=t.hero)||void 0===n?void 0:n.ratio:""){case"21_9":return 41.89;case"16_9":return 56.25;case"4_3":return 75;case"custom":var o,r,l,c,d,f,v,h;if(null===(o=this.project.field)||void 0===o||null===(r=o.hero)||void 0===r||!r.custom_ratio.num||null===(l=this.project.field)||void 0===l||null===(c=l.hero)||void 0===c||!c.custom_ratio.den)break;var m=this.reduce(null===(d=this.project.field)||void 0===d||null===(f=d.hero)||void 0===f?void 0:f.custom_ratio.num,null===(v=this.project.field)||void 0===v||null===(h=v.hero)||void 0===h?void 0:h.custom_ratio.den);return 100/m[0]*m[1];default:return 100*this.cinemaScope}}}),methods:{open:function(e){this.$store.dispatch("changeRoute",e),this.$emit("open",e)},reduce:function(e,t){var n=function e(a,b){return b?e(b,a%b):a};return[e/(n=n(e,t)),t/n]},isScrolledIntoView:function(){if(this.$el&&("ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0)){var rect=this.$el.getBoundingClientRect();this.hover=rect.bottom<window.innerHeight-100&&rect.top>100}}},mounted:function(){this.$nextTick((function(){this.isScrolledIntoView()})),window.addEventListener("scroll",c()(this.isScrolledIntoView,50))},unmounted:function(){window.removeEventListener("scroll",c()(this.isScrolledIntoView,50))}},y=(n(352),n(353),n(10)),component=Object(y.a)(m,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"project-header",class:{hasControls:e.heroIsVideo,active:e.isOpen}},[n("div",{staticClass:"clipped cinema",class:{hover:e.hover},style:"padding-bottom: "+e.aspectRatio+"%;",on:{click:function(t){return e.open(e.project.slug)},mouseover:function(t){e.hover=!0},mouseleave:function(t){e.hover=!1}}},[n("div",{staticClass:"header-copy"},[n(e.isOpen?"h2":"span",{tag:"component",staticClass:"title-container"},[e.projectSubtitle?n("span",{staticClass:"project-category",domProps:{innerHTML:e._s(e.projectSubtitle)}}):e._e(),e._v(" "),n("span",{staticClass:"project-title",domProps:{innerHTML:e._s(e.projectTitle)}})]),e._v(" "),n("FestivalContainer",{staticClass:"hide-medium-down",attrs:{festivals:e.headerFestivals,small:!0,active:e.hover||e.isOpen}})],1),e._v(" "),n("ProjectHero",{staticClass:"hero",attrs:{open:e.isOpen,project:e.project},on:{playing:function(t){return e.$emit("playing",t)}}})],1)])}),[],!1,null,"51755fbb",null);t.default=component.exports;installComponents(component,{ProjectHero:n(289).default})},352:function(e,t,n){"use strict";n(311)},353:function(e,t,n){"use strict";n(312)}}]);