(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{460:function(t,e,n){"use strict";n(8),n(9),n(6),n(36),n(107),n(131),n(285),n(22),n(11),n(12),n(10),n(18),n(33),n(50),n(61),n(76),n(7),n(52);var r=n(2),o=(n(204),n(0)),c=n(70),l=n(1);function f(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function d(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?f(Object(source),!0).forEach((function(e){Object(r.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):f(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}var v=["sm","md","lg","xl"],m=v.reduce((function(t,e){return t[e]={type:[Boolean,String,Number],default:!1},t}),{}),y=v.reduce((function(t,e){return t["offset"+Object(l.D)(e)]={type:[String,Number],default:null},t}),{}),O=v.reduce((function(t,e){return t["order"+Object(l.D)(e)]={type:[String,Number],default:null},t}),{}),w={col:Object.keys(m),offset:Object.keys(y),order:Object.keys(O)};function j(t,e,n){var r=t;if(null!=n&&!1!==n){if(e){var o=e.replace(t,"");r+="-".concat(o)}return"col"!==t||""!==n&&!0!==n?(r+="-".concat(n)).toLowerCase():r.toLowerCase()}}var h=new Map;e.a=o.a.extend({name:"v-col",functional:!0,props:d(d(d(d({cols:{type:[Boolean,String,Number],default:!1}},m),{},{offset:{type:[String,Number],default:null}},y),{},{order:{type:[String,Number],default:null}},O),{},{alignSelf:{type:String,default:null,validator:function(t){return["auto","start","end","center","baseline","stretch"].includes(t)}},tag:{type:String,default:"div"}}),render:function(t,e){var n=e.props,data=e.data,o=e.children,l=(e.parent,"");for(var f in n)l+=String(n[f]);var d=h.get(l);return d||function(){var t,e;for(e in d=[],w)w[e].forEach((function(t){var r=n[t],o=j(e,t,r);o&&d.push(o)}));var o=d.some((function(t){return t.startsWith("col-")}));d.push((t={col:!o||!n.cols},Object(r.a)(t,"col-".concat(n.cols),n.cols),Object(r.a)(t,"offset-".concat(n.offset),n.offset),Object(r.a)(t,"order-".concat(n.order),n.order),Object(r.a)(t,"align-self-".concat(n.alignSelf),n.alignSelf),t)),h.set(l,d)}(),t(n.tag,Object(c.a)(data,{class:d}),o)}})},469:function(t,e,n){var content=n(525);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(14).default)("9fc73dcc",content,!0,{sourceMap:!1})},524:function(t,e,n){"use strict";var r=n(469);n.n(r).a},525:function(t,e,n){(e=n(13)(!1)).push([t.i,"#card[data-v-e090bf06]{border-radius:30px}@-webkit-keyframes spin-data-v-e090bf06{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes spin-data-v-e090bf06{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}.spin[data-v-e090bf06]{-webkit-animation-name:spin-data-v-e090bf06;animation-name:spin-data-v-e090bf06;-webkit-animation-duration:4s;animation-duration:4s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-timing-function:linear;animation-timing-function:linear}",""]),t.exports=e},569:function(t,e,n){"use strict";n.r(e);var r=n(42),o={layout:"admin",head:function(){return{title:"Aidline users"}},data:function(){return{i:{mdiCog:r.d}}}},c=(n(524),n(30)),l=n(92),f=n.n(l),d=n(198),v=n(460),m=n(458),y=n(439),O=n(196),w=n(448),component=Object(c.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("v-container",[n("h1",{staticClass:"text-center"},[t._v("User panel")]),t._v(" "),n("v-divider"),t._v(" "),n("p",{staticClass:"text-center"},[t._v("In this panel, you can access send a request, check the status of you request, and your settings.  "),n("v-icon",{staticClass:"spin"},[t._v(t._s(t.i.mdiCog))])],1)],1),t._v(" "),n("v-container",[n("v-row",{attrs:{justify:"center"}},[n("v-col",{attrs:{cols:"10"}},[n("v-row",{attrs:{justify:"center"}},[n("v-col",{attrs:{cols:"12",md:"6",lg:"4"}},[n("v-card",{staticClass:"accent d-flex align-center",attrs:{id:"card",elevation:"3",height:"130",nuxt:"",link:"",to:"/user/sendrequest"}},[n("div",{staticClass:"display-2 flex-grow-1 text-center white--text"},[t._v("Send Request")])])],1),t._v(" "),n("v-col",{attrs:{cols:"12",md:"6",lg:"4"}},[n("v-card",{staticClass:"accent d-flex align-center",attrs:{id:"card",elevation:"3",height:"130",nuxt:"",link:"",to:"/user/currentrequest"}},[n("div",{staticClass:"display-2 flex-grow-1 text-center white--text"},[t._v("Current Request")])])],1)],1)],1)],1)],1)],1)}),[],!1,null,"e090bf06",null);e.default=component.exports;f()(component,{VCard:d.a,VCol:v.a,VContainer:m.a,VDivider:y.a,VIcon:O.a,VRow:w.a})}}]);