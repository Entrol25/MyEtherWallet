(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-cb9211e8"],{"8b12":function(t,e,n){"use strict";var a=n("dce8"),r=n.n(a);r.a},a20a:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("div",{staticClass:"container-maker"},[n("div",{staticClass:"manage-container"},[n("div",{staticClass:"manage-container-blocks"},[n("div",{staticClass:"information-single-block"},[n("div",{staticClass:"block-item"},[n("div",{staticClass:"block-title"},[n("div",{staticClass:"select-label"},[n("p",[t._v(t._s(t.$t("dappsMaker.position-label",{value:t.cdpId})))]),n("p",[n("span",{staticClass:"standard-button__green-border"},[t.hasProxy?n("button",{staticClass:"the-button-box",on:{click:function(e){return t.openManage(t.cdpId)}}},[t._v("\n                      "+t._s(t.$t("dappsMaker.manage"))+"\n                    ")]):t._e(),t.hasProxy?t._e():n("button",{staticClass:"the-button-box",on:{click:function(e){return t.openMigrate(t.cdpId)}}},[t._v("\n                      "+t._s(t.$t("dappsMaker.view"))+"\n                    ")])])])])]),n("div",{staticClass:"block-content-container"},[n("div",{staticClass:"block-content"},[n("div",{staticClass:"item"},[n("div",[n("p",[t._v(t._s(t.$t("dappsMaker.deposited")))])]),n("div",[t._v("\n                    "+t._s(t.displayFixedValue(t.aCdp.ethCollateral,5,!1))+"\n                    "),n("span",[t._v(t._s(t.$t("common.currency.eth")))])]),n("div",[t._v("\n                    "+t._s(t.displayFixedValue(t.aCdp.pethCollateral,5,!0))+"\n                    "),n("span",[t._v(t._s(t.$t("common.currency.peth")))]),t._v("\n                    "+t._s(t.displayFixedValue(t.aCdp.usdCollateral,2))+"\n                    "),n("span",[t._v(t._s(t.$t("common.currency.usd")))])]),n("div",[n("br"),n("div",[t._v("\n                      "+t._s(t.$t("dappsMaker.liquid-price"))+" ("+t._s(t.$t("common.currency.eth"))+"/"+t._s(t.$t("common.currency.usd"))+")\n                    ")]),n("span",{class:t.safeRank(t.aCdp.collatRatio)},[t._v(t._s(t.aCdp?t.displayFixedValue(t.aCdp.liquidationPrice,2):0))]),n("span",{staticClass:"liq-usd"},[t._v("\n                      "+t._s(t.$t("common.currency.usd")))])])])]),n("div",{staticClass:"block-content"},[n("div",{staticClass:"item"},[n("div",[n("p",[t._v(t._s(t.$t("dappsMaker.generated")))])]),n("div",[t._v("\n                    "+t._s(t.aCdp.debtValue)+"\n                    "),n("span",[t._v(t._s(t.$t("dappsMaker.dai")))])]),n("div",[t._v("\n                    "+t._s(t.displayFixedValue(t.aCdp.debtValue,2))+"\n                    "),n("span",[t._v(t._s(t.$t("common.currency.usd")))])]),n("div",[n("br"),n("div",[t._v(t._s(t.$t("dappsMaker.collateral-ratio")))]),n("span",{class:t.safeRank(t.aCdp.collatRatio)},[t._v("\n                      "+t._s(t.aCdp?t.displayFixedValue(t.displayPercentValue(t.aCdp.collatRatio)):0)+"%\n                    ")])])])])])])])])])])])},r=[],i=(n("8e6e"),n("ac6a"),n("456d"),n("6b54"),n("6762"),n("2fdb"),n("96cf"),n("3b8d")),s=n("bd86"),c=n("2f62"),o=n("55c1"),u=n("539d"),d=n("c8e5"),p=n("901e"),l=n.n(p);function v(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function f(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?v(n,!0).forEach((function(e){Object(s["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):v(n).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var b=function(t){return new l.a(t)},m={components:{"interface-container-title":o["a"],"interface-bottom-text":u["a"],blockie:d["a"]},props:{cdpId:{type:String,default:"0"},aCdp:{type:Object,default:function(){return{}}}},data:function(){return{}},computed:f({},Object(c["b"])(["account","gasPrice","web3","network","ens"]),{hasProxy:function(){return!this.aCdp||!this.aCdp.noProxy}}),mounted:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:case"end":return t.stop()}}),t)})));function e(){return t.apply(this,arguments)}return e}(),methods:{openManage:function(){this.$route.path.includes("maker-dai")&&this.$router.push({name:"manage",params:{cdpId:this.cdpId}})},openMigrate:function(){this.$route.path.includes("maker-dai")&&this.$router.push({name:"migrate",params:{cdpId:this.cdpId}})},displayPercentValue:function(t){return l.a.isBigNumber(t)||(t=new l.a(t)),t.times(100).toString()},displayFixedValue:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3;return l.a.isBigNumber(t)||(t=new l.a(t)),t.isFinite()?t.toFixed(e).toString():"--"},safeRank:function(t){return b(t).gte(2)?"green":b(t).lt(1.6)?"red":"orange"}}},h=m,y=(n("c79c"),n("2877")),g=Object(y["a"])(h,a,r,!1,null,"0c4a2837",null),_=g.exports;e["a"]=_},c79c:function(t,e,n){"use strict";var a=n("d312"),r=n.n(a);r.a},d312:function(t,e,n){},dce8:function(t,e,n){},e814:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("div",{staticClass:"currency-ops-new"},[n("div",{staticClass:"info-box"},[t._v("\n      "+t._s(t.$t("dappsMaker.upgrade-informational"))+"\n    ")]),n("div",{staticClass:"currency-picker-container"},[n("div",{staticClass:"interface__block-title"},[t._v("\n        "+t._s(t.$t("dappsMaker.upgrade-sai-to-dai"))+"\n        "),n("img",{staticClass:"icon-size",attrs:{src:t.DaiIcon}})]),n("div",{staticClass:"top-buttons"},[n("p",{on:{click:t.setMax}},[t._v(t._s(t.$t("dappsMaker.entire-sai-balance")))])]),n("div",{staticClass:"dropdown-text-container dropdown-container no-point"},[n("p",[n("span",{staticClass:"cc DAI cc-icon cc-icon-dai currency-symbol"}),t._v("\n          "+t._s(t.$t("dappsMaker.sai"))+"\n        ")])]),n("input",{directives:[{name:"model",rawName:"v-model",value:t.daiQty,expression:"daiQty"}],class:["currency-picker-container","dropdown-text-container","dropdown-container"],domProps:{value:t.daiQty},on:{input:function(e){e.target.composing||(t.daiQty=e.target.value)}}}),n("div",{staticClass:"buttons-container"},[n("div",{class:[t.validInputs?"":"disabled","submit-button large-round-button-green-filled"],on:{click:t.submitTransaction}},[t._v("\n          "+t._s(t.$t("dappsMaker.upgrade"))+"\n        ")])])]),n("div")])])},r=[],i=(n("8e6e"),n("456d"),n("ac6a"),n("5df3"),n("6b54"),n("7514"),n("96cf"),n("3b8d")),s=n("bd86"),c=n("2f62"),o=n("55c1"),u=n("539d"),d=n("c8e5"),p=n("9b76"),l=n.n(p),v=n("901e"),f=n.n(v),b=n("a20a"),m=n("d1fb"),h=n("70c1"),y=n.n(h),g=n("ce96");function _(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function w(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?_(n,!0).forEach((function(e){Object(s["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):_(n).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var k=function(t){return new f.a(t)},O={components:{"interface-container-title":o["a"],"interface-bottom-text":u["a"],blockie:d["a"],"select-cdp-entry":b["a"]},props:{tokensWithBalance:{type:Array,default:function(){return[]}},ethPrice:{type:f.a,default:function(){return new f.a(0)}},makerActive:{type:Boolean,default:!1},cdps:{type:Array,default:function(){return[]}},availableCdps:{type:Object,default:function(){return{}}},cdpDetailsLoaded:{type:Boolean,default:!1}},data:function(){return{daiQty:0,gasLimit:-1,DaiIcon:l.a}},computed:w({},Object(c["b"])(["account","gasPrice","web3","network","ens"]),{validInputs:function(){return k(this.daiQty).gt(0)}}),mounted:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:case"end":return t.stop()}}),t)})));function e(){return t.apply(this,arguments)}return e}(),methods:{migrate:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(e){var n,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n=new this.web3.eth.Contract(m["B"],m["h"].MIGRATION),a=n.methods.swapSaiToDai(e).encodeABI(),t.abrupt("return",{from:this.account.address,to:m["h"].MIGRATION,value:0,gas:5e5,data:a});case 3:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}(),setMax:function(){var t=this.tokensWithBalance.find((function(t){return"SAI"===t.symbol}));this.daiQty=t?t.balance:0},approve:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(e){var n,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n=new this.web3.eth.Contract(m["c"],m["h"].SAI),a=n.methods.approve(m["h"].MIGRATION,e).encodeABI(),t.abrupt("return",{from:this.account.address,to:m["h"].SAI,value:0,data:a});case 3:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}(),submitTransaction:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){var e,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return window.scrollTo(0,0),t.prev=1,e=y.a.toWei(this.daiQty,"ether").toString(),t.next=5,Promise.all([this.approve(e),this.migrate(e)]);case 5:n=t.sent,this.web3.mew.sendBatchTransactions(n).catch((function(t){g["e"].responseHandler(t,g["e"].ERROR)})),t.next=12;break;case 9:t.prev=9,t.t0=t["catch"](1),g["e"].responseHandler(t.t0,g["e"].ERROR);case 12:case"end":return t.stop()}}),t,this,[[1,9]])})));function e(){return t.apply(this,arguments)}return e}(),displayPercentValue:function(t){return f.a.isBigNumber(t)||(t=new f.a(t)),t.times(100).toString()},displayFixedValue:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3;return f.a.isBigNumber(t)||(t=new f.a(t)),t.toFixed(e).toString()}}},C=O,x=(n("8b12"),n("2877")),j=Object(x["a"])(C,a,r,!1,null,"7990c4b2",null),P=j.exports;e["default"]=P}}]);
//# sourceMappingURL=chunk-cb9211e8.e7fa162f.js.map