(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{330:function(e,t,l){"use strict";l.r(t);var r={name:"Email",props:{address:String,placeholder:{type:String,default:"Shoot him an email!"}},data:function(){return{label:this.placeholder,url:"#"}},methods:{scambleAddress:function(){this.label=this.address,this.url="mailto:"+this.address}}},n=l(10),component=Object(n.a)(r,(function(){var e=this,t=e.$createElement;return(e._self._c||t)("a",{staticClass:"mail",attrs:{href:this.url},on:{mouseover:this.scambleAddress}},[e._v(e._s(this.label))])}),[],!1,null,null,null);t.default=component.exports}}]);