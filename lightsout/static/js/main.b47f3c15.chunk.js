(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{15:function(e,t,s){},17:function(e,t,s){},19:function(e,t,s){"use strict";s.r(t);var i=s(0),a=s.n(i),n=s(8),c=s.n(n),r=(s(15),s(1)),l=s(2),h=s(3),o=s(6),u=s(4),k=s(5),m=(s(17),function(e){function t(e){return Object(l.a)(this,t),Object(o.a)(this,Object(u.a)(t).call(this,e))}return Object(k.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){var e=1/this.props.numTiles*100+"%";return a.a.createElement("button",{onClick:this.props.onClick,className:this.props.lit?"gametile light":"gametile dark",style:{width:e,height:e}})}}]),t}(i.Component)),b=function(e){function t(e){var s;Object(l.a)(this,t),s=Object(o.a)(this,Object(u.a)(t).call(this,e));for(var i=[],a=0;a<s.props.size*s.props.size;a++)i.push(!1);return s.state={size:s.props.size,lights:i,clicks:[],numClicks:s.props.numClicks},s.init=s.init.bind(Object(r.a)(Object(r.a)(s))),s.reset=s.reset.bind(Object(r.a)(Object(r.a)(s))),s.increaseClicks=s.increaseClicks.bind(Object(r.a)(Object(r.a)(s))),s.decreaseClicks=s.decreaseClicks.bind(Object(r.a)(Object(r.a)(s))),s.increaseSize=s.increaseSize.bind(Object(r.a)(Object(r.a)(s))),s.decreaseSize=s.decreaseSize.bind(Object(r.a)(Object(r.a)(s))),s.flipPos=s.flipPos.bind(Object(r.a)(Object(r.a)(s))),s}return Object(k.a)(t,e),Object(h.a)(t,[{key:"init",value:function(){for(var e=[],t=[],s=0;s<this.state.size*this.state.size;s++)e.push(!1);for(var i=0;i<this.state.numClicks;i++)t.push(Math.floor(Math.random()*this.state.size*this.state.size)),this.flipPos(e,t[i]);this.setState({size:this.state.size,lights:e,clicks:t,numClicks:this.state.numClicks})}},{key:"reset",value:function(){for(var e=[],t=0;t<this.state.size*this.state.size;t++)e.push(!1);for(var s=0;s<this.state.numClicks;s++)this.flipPos(e,this.state.clicks[s]);this.setState({size:this.state.size,lights:e,clicks:this.state.clicks,numClicks:this.state.numClicks})}},{key:"flipPos",value:function(e,t){for(var s=t%this.state.size,i=Math.floor(t/this.state.size),a=-1;a<2;a++)for(var n=-1;n<2;n++)s+a>=0&&s+a<this.state.size&&i+n>=0&&i+n<this.state.size&&(e[(i+n)*this.state.size+s+a]=!e[(i+n)*this.state.size+s+a]);return e}},{key:"getEmptyLightsArray",value:function(e){for(var t=[],s=0;s<e*e;s++)t.push(!1);return t}},{key:"increaseClicks",value:function(){var e=this.getEmptyLightsArray(this.state.size);this.setState({size:this.state.size,lights:e,clicks:this.state.clicks,numClicks:this.state.numClicks+1})}},{key:"decreaseClicks",value:function(){var e=this.getEmptyLightsArray(this.state.size);this.setState({size:this.state.size,lights:e,clicks:this.state.clicks,numClicks:this.state.numClicks-1})}},{key:"increaseSize",value:function(){var e=this.getEmptyLightsArray(this.state.size+1);this.setState({size:this.state.size+1,lights:e,clicks:this.state.clicks,numClicks:this.state.numClicks})}},{key:"decreaseSize",value:function(){var e=this.getEmptyLightsArray(this.state.size-1);this.setState({size:this.state.size-1,lights:e,clicks:this.state.clicks,numClicks:this.state.numClicks})}},{key:"getClickHandler",value:function(e,t){var s=this;return function(){var e=s.flipPos(s.state.lights,t);s.setState({size:s.state.size,lights:e,clicks:s.state.clicks})}}},{key:"render",value:function(){var e=this,t=this.state.lights.map(function(t,s){return a.a.createElement(m,{numTiles:e.state.size,key:s,lit:t,onClick:e.getClickHandler(t,s)})});return a.a.createElement("div",{id:"Container"},a.a.createElement("div",{id:"GameBoard"},t),a.a.createElement("div",null,a.a.createElement("div",{className:"flexContainer"},a.a.createElement("button",{className:"shrinkable50",onClick:this.init},"New Game"),a.a.createElement("button",{className:"shrinkable50",onClick:this.reset},"Reset")),a.a.createElement("div",{className:"flexContainer"},a.a.createElement("button",{className:"shrinkable50",onClick:this.decreaseClicks},"Decrease clicks"),a.a.createElement("span",{className:"width2em"},this.state.numClicks),a.a.createElement("button",{className:"shrinkable50",onClick:this.increaseClicks},"Increase clicks")),a.a.createElement("div",{className:"flexContainer"},a.a.createElement("button",{className:"shrinkable50",onClick:this.decreaseSize},"Decrease size"),a.a.createElement("span",{className:"width2em"},this.state.size),a.a.createElement("button",{className:"shrinkable50",onClick:this.increaseSize},"Increase size"))))}}]),t}(i.Component),z=function(e){function t(){return Object(l.a)(this,t),Object(o.a)(this,Object(u.a)(t).call(this))}return Object(k.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){return a.a.createElement(b,{size:6,numClicks:3})}}]),t}(i.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(a.a.createElement(z,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},9:function(e,t,s){e.exports=s(19)}},[[9,2,1]]]);
//# sourceMappingURL=main.b47f3c15.chunk.js.map