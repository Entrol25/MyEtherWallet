(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2e914b0f"],{"03c4":function(t,e,a){"use strict";a.r(e);var i,n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"manage-cdp"},[a("div",{directives:[{name:"show",rawName:"v-show",value:!t.finishMigration,expression:"!finishMigration"}],staticClass:"manage-container"},[a("div",{staticClass:"title-content-container"},[a("p",{staticClass:"cpd-title"},[t._v(t._s(t.$t("dappsMaker.vault-portal")))]),a("p",{staticClass:"cdp-id"},[t._v("\n        "+t._s(t.$t("dappsMaker.vault-position-label",{value:t.cdpIdDisplay,symbol:t.vaultType}))+"\n      ")])]),a("div",{staticClass:"information-blocks"},[a("div",{staticClass:"block-item"},[a("div",{staticClass:"block-title"},[a("div",{staticClass:"for-pop"},[a("p",[t._v("\n              "+t._s(t.$t("dappsMaker.liquid-price"))+" ("+t._s(t.collateralType)+"/"+t._s(t.$t("common.currency.usd"))+")\n            ")]),"--"===t.liquidationPriceDisplay?a("p",{staticClass:"pop-icon"},[a("popover",{attrs:{popcontent:t.$t("dappsMaker.what-is-dashes-vault")}})],1):t._e()]),a("div",{staticClass:"blue"},[a("span",{staticClass:"blue-bold"},[t._v(t._s(t.liquidationPriceDisplay))]),t._v("\n            "+t._s(t.$t("common.currency.usd"))+"\n          ")])]),a("div",{staticClass:"block-content"},[a("div",{staticClass:"item"},[a("p",[t._v("\n              "+t._s(t.$t("dappsMaker.current-price"))+"("+t._s(t.collateralType)+"/"+t._s(t.$t("common.currency.usd"))+")\n            ")]),a("div",[t._v("\n              "+t._s(t.ethPriceDisplay)+"\n              "),a("span",[t._v(t._s(t.$t("common.currency.usd")))])])]),a("div",{staticClass:"item"},[a("p",[t._v(t._s(t.$t("dappsMaker.liquidation-penalty")))]),a("div",[t._v(t._s(t.liquidationPenaltyDisplay)+"%")])])])]),a("div",{staticClass:"block-item"},[a("div",{staticClass:"block-title"},[a("div",{staticClass:"for-pop"},[a("p",[t._v(t._s(t.$t("dappsMaker.collateral-ratio")))]),"--"===t.liquidationPriceDisplay?a("p",{staticClass:"pop-icon"},[a("popover",{attrs:{popcontent:t.$t("dappsMaker.what-is-dashes-vault")}})],1):t._e()]),a("div",{class:t.collateralRatioColoring},[a("span",[t._v(t._s(t.collaterlizationRatioDisplay)+"%")])])]),a("div",{staticClass:"block-content"},[a("div",{staticClass:"item"},[a("p",[t._v(t._s(t.$t("dappsMaker.minimum-ratio")))]),a("div",[t._v(t._s(t.liquidationRatioDisplay)+"%")])]),a("div",{staticClass:"item"},[a("p",[t._v(t._s(t.$t("dappsMaker.stability-fee")))]),a("div",[t._v(t._s(t.stabilityFeeDisplay)+"%")])])])])]),a("div",{staticClass:"information-single-block"},[a("div",{staticClass:"block-item"},[a("div",{staticClass:"block-title"},[a("p",[t._v("\n            "+t._s(t.$t("dappsMaker.collateral-label",{symbol:t.collateralType}))+"\n          ")])]),a("div",{staticClass:"block-content-container"},[a("div",{staticClass:"block-content"},[a("div",{staticClass:"item"},[a("p",[t._v(t._s(t.$t("dappsMaker.deposited")))]),a("div",[t._v("\n                "+t._s(t.ethCollateral)+"\n                "),a("span",[t._v(t._s(t.collateralType))])]),a("div",[t._v("\n                "+t._s(t.usdCollateral)+"\n                "),a("span",[t._v(t._s(t.$t("common.currency.usd")))])]),a("button",{on:{click:t.showDeposit}},[t._v("\n                "+t._s(t.$t("dappsMaker.deposit"))+" >\n              ")])])]),a("div",{staticClass:"block-content"},[a("div",{staticClass:"item"},[a("p",[t._v(t._s(t.$t("dappsMaker.max-withdraw")))]),a("div",[t._v("\n                "+t._s(t.maxEthDrawDisplay)+"\n                "),a("span",[t._v(t._s(t.collateralType))])]),a("div",[t._v("\n                "+t._s(t.maxUsdDrawDisplay)+"\n                "),a("span",[t._v(t._s(t.$t("common.currency.usd")))])]),a("button",{on:{click:t.showWithdraw}},[t._v("\n                "+t._s(t.$t("dappsMaker.withdraw"))+" >\n              ")])])])])])]),a("div",{staticClass:"information-single-block"},[a("div",{staticClass:"block-item"},[a("div",{staticClass:"block-title"},[a("p",[t._v(t._s(t.$t("dappsMaker.dai-position")))])]),a("div",{staticClass:"block-content-container"},[a("div",{staticClass:"block-content"},[a("div",{staticClass:"item"},[a("p",[t._v(t._s(t.$t("dappsMaker.generated")))]),a("div",[t._v("\n                "+t._s(t.debtValue)+" "),a("span",[t._v(t._s(t.$t("dappsMaker.dai")))])]),a("div",[t._v("\n                "+t._s(t.debtValueDisplay)+"\n                "),a("span",[t._v(t._s(t.$t("common.currency.usd")))])]),a("button",{on:{click:t.showPayback}},[t._v("\n                "+t._s(t.$t("dappsMaker.payback"))+" >\n              ")])])]),a("div",{staticClass:"block-content"},[a("div",{staticClass:"item"},[a("p",[t._v(t._s(t.$t("dappsMaker.max-available")))]),a("div",[t._v("\n                "+t._s(t.maxDai)+"\n                "),a("span",[t._v(t._s(t.$t("dappsMaker.dai")))])]),a("div",[t._v("\n                "+t._s(t.maxUsd)+"\n                "),a("span",[t._v(t._s(t.$t("common.currency.usd")))])]),a("button",{on:{click:t.showGenerate}},[t._v("\n                "+t._s(t.$t("dappsMaker.generate"))+" >\n              ")])])])])])])]),a("help-link")],1)},s=[],r=(a("8e6e"),a("456d"),a("96cf"),a("3b8d")),c=(a("ac6a"),a("bd86")),o=(a("c5f6"),a("2f62")),d=a("55c1"),l=a("539d"),u=a("8e13"),p=a("c8e5"),h=a("901e"),v=a.n(h),b=a("d1fb");function f(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,i)}return a}function C(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?f(a,!0).forEach((function(e){Object(c["a"])(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):f(a).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var y={components:{"interface-container-title":d["a"],"interface-bottom-text":l["a"],blockie:p["a"],"help-link":u["a"]},props:{openCloseModal:{type:Boolean,default:!1},openMoveModal:{type:Boolean,default:!1},tokensWithBalance:{type:Array,default:function(){return[]}},getBalance:{type:Function,default:function(){}},makerActive:{type:Boolean,default:!1},cdps:{type:Array,default:function(){return[]}},availableCdps:{type:Object,default:function(){return{}}},valuesUpdated:{type:Number,default:0},getCdp:{type:Function,default:function(){}},hasCdp:{type:Function,default:function(){}},getValueOrFunction:{type:Function,default:function(){}},values:{type:Object,default:function(){return{maxEthDraw:"",maxUsdDraw:"",ethCollateral:"",usdCollateral:"",debtValue:"",maxDai:"",collateralRatio:"",cdpId:"",stabilityFee:"",minEth:"",liquidationRatio:"",liquidationPenalty:"",targetPrice:""}}},ethPrice:{type:v.a,default:Object(b["F"])(0)},liquidationPenalty:{type:v.a,default:Object(b["F"])(0)},stabilityFee:{type:v.a,default:Object(b["F"])(0)},liquidationRatio:{type:v.a,default:Object(b["F"])(0)},priceService:{type:Object,default:function(){return{}}},cdpService:{type:Object,default:function(){return{}}},proxyService:{type:Object,default:function(){return{}}},updated:{type:Number,default:0}},data:function(){return{currentCdpLoaded:!1,activeCdp:{},loaded:!1,ethQty:0,daiQty:0,selectedCdp:"",cdpId:"",cdp:{},maxDaiDraw:Object(b["F"])(0),maxWithDraw:Object(b["F"])(0),maxWithDrawUSD:Object(b["F"])(0),maxEthDraw:Object(b["F"])(0),vaultType:"ETH-A",updatedValue:0}},computed:C({},Object(o["b"])(["account","gasPrice","web3","network","ens"]),{noProxy:function(){if(this.activeCdp)return this.activeCdp.noProxy},finishMigration:function(){if(this.activeCdp)return this.activeCdp.needToFinishMigrating},collateralRatioColoring:function(){return this.currentCdpLoaded&&this.updatedValue>-1?this.currentCdp.collateralStatus:""},liquidationPriceDisplay:function(){if(this.currentCdpLoaded&&this.updatedValue>-1){var t=Object(b["p"])(this.currentCdp.liquidationPrice,2);return new v.a(t).gt(0)?t:"--"}return"--"},collaterlizationRatioDisplay:function(){return this.currentCdpLoaded&&this.updatedValue>-1?Object(b["o"])(this.getCollateralizationRatio()):"--"},cdpIdDisplay:function(){return this.values?this.values.cdpId:"--"},liquidationRatioDisplay:function(){return this.currentCdpLoaded&&this.updatedValue>-1?Object(b["p"])(Object(b["q"])(this.currentCdp.liquidationRatio)):"--"},liquidationPenaltyDisplay:function(){return this.currentCdpLoaded&&this.updatedValue>-1?Object(b["p"])(Object(b["q"])(this.currentCdp.liquidationPenalty)):"--"},stabilityFeeDisplay:function(){return this.currentCdpLoaded&&this.updatedValue>-1?Object(b["p"])(Object(b["q"])(this.currentCdp.stabilityFee)):"--"},ethPriceDisplay:function(){return this.currentCdpLoaded&&this.updatedValue>-1?Object(b["p"])(this.currentCdp.currentPrice,2):"--"},zeroDebt:function(){return Object(b["F"])(this.values.debtValue).eq(0)},maxEthDrawDisplay:function(){return this.currentCdpLoaded&&this.updatedValue>-1?Object(b["p"])(this.currentCdp.maxEthDraw,5):"--"},maxUsdDrawDisplay:function(){return this.values?Object(b["p"])(this.values.maxUsdDraw,2):"--"},ethCollateral:function(){return this.currentCdpLoaded&&this.updatedValue>-1?Object(b["p"])(this.getCollateralAmount(),5):"--"},collateralType:function(){return this.currentCdpLoaded&&this.updatedValue>-1?this.currentCdp.cdpCollateralType:"ETH"},usdCollateral:function(){return this.currentCdpLoaded&&this.updatedValue>-1?Object(b["p"])(this.currentCdp.collateralValue,2):"--"},debtValueDisplay:function(){return this.currentCdpLoaded&&this.updatedValue>-1?Object(b["p"])(this.currentCdp.debtValue,2):"--"},debtValue:function(){return this.currentCdpLoaded&&this.updatedValue>-1?Object(b["p"])(this.currentCdp.debtValue,5,!0,!0,!0):"--"},maxDai:function(){return this.currentCdpLoaded&&this.updatedValue>-1?Object(b["p"])(this.currentCdp.maxDai,5):"--"},maxUsd:function(){return this.currentCdpLoaded&&this.updatedValue>-1?Object(b["p"])(this.currentCdp.maxDai,2):"--"}}),watch:(i={},Object(c["a"])(i,"activeCdp.ready",(function(){this.isReady()})),Object(c["a"])(i,"valuesUpdated",(function(){this.updatedValue++})),Object(c["a"])(i,"openCloseModal",(function(t){t&&this.showClose()})),Object(c["a"])(i,"openMoveModal",(function(t){t&&this.showMove()})),Object(c["a"])(i,"makerActive",(function(t){t&&this.getActiveCdp()})),Object(c["a"])(i,"$route.params",(function(){this.updatedValue++,this.getActiveCdp()})),i),beforeDestroy:function(){this.makerCDP={}},mounted:function(){var t=Object(r["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:this.activeCdp={},this.cdpId=this.$route.params.cdpId,this.makerActive&&(this.loaded=!0,this.cdpId&&this.$emit("activeCdpId",this.cdpId)),this.cdpId&&void 0!==this.cdpId&&this.getActiveCdp();case 4:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),methods:{getActiveCdp:function(){this.cdpId=this.$route.params.cdpId;var t="number"===typeof this.cdpId?this.cdpId:this.cdpId.id;this.currentCdp=this.getValueOrFunction("getCdp")(t),this.currentCdp&&(this.currentCdpLoaded=!0,this.$forceUpdate(),this.vaultType=this.currentCdp.cdpType),this.getTotalDebt()},getTotalDebt:function(){var t=Object(r["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(this.currentCdp&&(this.currentCdpLoaded=!0),this.currentCdp){t.next=3;break}return t.abrupt("return",Object(b["F"])(0));case 3:return t.next=5,this.currentCdp.getCombinedDebtValue();case 5:return t.abrupt("return",t.sent);case 6:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),getCollateralAmount:function(){return this.currentCdp&&(this.currentCdpLoaded=!0),this.currentCdp?this.currentCdp.collateralAmount:0},getCollateralValue:function(){return this.currentCdp&&(this.currentCdpLoaded=!0),this.currentCdp?this.currentCdp.getCollateralValue:Object(b["F"])(0)},getCollateralizationRatio:function(){return this.currentCdp&&(this.currentCdpLoaded=!0),this.currentCdp?this.currentCdp.collateralizationRatio:Object(b["F"])(0)},showDeposit:function(){this.$emit("showDeposit")},showWithdraw:function(){this.$emit("showWithdraw")},showPayback:function(){this.$emit("showPayback")},showGenerate:function(){this.$emit("showGenerate")},displayPercentValue:b["q"],displayFixedValue:b["p"],isReady:function(){var t=Object(r["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:case"end":return t.stop()}}),t)})));function e(){return t.apply(this,arguments)}return e}()}},m=y,_=(a("d3cc"),a("2877")),k=Object(_["a"])(m,n,s,!1,null,"2f7997f6",null),O=k.exports;e["default"]=O},"48a03":function(t,e,a){},"4c1b":function(t,e,a){},"7f58":function(t,e,a){"use strict";var i=a("4c1b"),n=a.n(i);n.a},"8e13":function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"Bottom-help-link"},["issues"==t.type?a("div",{staticClass:"issues"},[t._v("\n    "+t._s(t.$t("common.having-issues"))+"\n    "),a("a",{attrs:{href:"https://kb.myetherwallet.com/",target:"_blank",rel:"noopener noreferrer"}},[t._v(t._s(t.$t("common.help-center")))])]):t._e()])},n=[],s={props:{type:{type:String,default:"issues"}},data:function(){return{popOverId:"popoverid"+String(Math.floor(1e8*Math.random()))}}},r=s,c=(a("7f58"),a("2877")),o=Object(c["a"])(r,i,n,!1,null,"16b84c17",null),d=o.exports;a.d(e,"a",(function(){return d}))},d3cc:function(t,e,a){"use strict";var i=a("48a03"),n=a.n(i);n.a}}]);
//# sourceMappingURL=chunk-2e914b0f.d573066c.js.map