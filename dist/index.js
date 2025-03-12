!function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";function t(t,e){return Math.random()*(e-t)+t}const e={disableConnection:.1,enableConnection:.1,newConnection:.1,newNode:.1,removeConnection:.1,removeNode:.1,weightModification:.9};class n{static getInnovationNumber(t,e){const n=`${t}-${e}`;if(this.innovationHistory.has(n))return this.innovationHistory.get(n);const i=this.currentInnovationNumber++;return this.innovationHistory.set(n,i),i}}n.currentInnovationNumber=0,n.innovationHistory=new Map;class i{constructor(e){var s,o,h,r,a;this.enabled=!0,this.innovationNumber=n.getInnovationNumber(e.from.id,e.to.id),this.from=e.from,this.to=e.to,this.weight=null!==(s=e.weight)&&void 0!==s?s:t(null!==(h=null===(o=e.weightRange)||void 0===o?void 0:o[0])&&void 0!==h?h:i.DEFAULT_WEIGHT_RANGE[0],null!==(a=null===(r=e.weightRange)||void 0===r?void 0:r[1])&&void 0!==a?a:i.DEFAULT_WEIGHT_RANGE[1])}toJson(){return{innovationNumber:this.innovationNumber,enabled:this.enabled,fromId:this.from.id,toId:this.to.id,weight:this.weight}}clone(){const t=new i({from:this.from,to:this.to,weight:this.weight});return t.enabled=this.enabled,t}}var s;i.DEFAULT_WEIGHT_RANGE=[-.5,.5],function(t){t[t.HIDDEN=0]="HIDDEN",t[t.INPUT=1]="INPUT",t[t.OUTPUT=2]="OUTPUT",t[t.BIAS=3]="BIAS"}(s||(s={}));class o{constructor(t){this.output=0,this.id=t.id,this.nodeType=t.nodeType,this.nodeType===s.BIAS&&(this.output=1)}toJson(){return{id:this.id,nodeType:this.nodeType}}clone(){return new o({id:this.id,nodeType:this.nodeType})}}class h{constructor(t){var e,n;if(this.currentNodeId=0,this.fitness=0,this.connections=[],this.nodes=[],this.inputLength=t.inputLength,this.outputLength=t.outputLength,this.weightRange=t.weightRange,t.hiddenLength&&t.hiddenLength.length!==t.hiddenLayers)throw new Error(`Invalide parameter "hiddenLength": ${t.hiddenLength.length} (should be an array of the same size as "hiddenLayers": ${t.hiddenLayers}).`);this.hiddenLayers=null!==(e=t.hiddenLayers)&&void 0!==e?e:0,this.hiddenLength=null!==(n=t.hiddenLength)&&void 0!==n?n:[]}toJson(){return{connections:this.connections.map((t=>t.toJson())),hiddenLayers:this.hiddenLayers,hiddenLength:this.hiddenLength,inputLength:this.inputLength,nodes:this.nodes.map((t=>t.toJson())),outputLength:this.outputLength,weightRange:this.weightRange}}generateFullNetwork(){let t=[];const e=new o({id:++this.currentNodeId,nodeType:s.BIAS});this.nodes.push(e),t.push(e);for(let e=0;e<this.inputLength;++e){const e=new o({id:++this.currentNodeId,nodeType:s.INPUT});t.push(e),this.nodes.push(e)}for(let e=0;e<this.hiddenLayers;++e){const n=this.hiddenLength[e],h=[new o({id:++this.currentNodeId,nodeType:s.BIAS})];for(let e=0;e<n;++e){const e=new o({id:++this.currentNodeId,nodeType:s.HIDDEN});for(const n of t){const t=new i({from:n,to:e,weightRange:this.weightRange});this.connections.push(t)}h.push(e),this.nodes.push(e)}t=h}for(let e=0;e<this.outputLength;++e){const e=new o({id:++this.currentNodeId,nodeType:s.OUTPUT});for(const n of t){const t=new i({from:n,to:e,weightRange:this.weightRange});this.connections.push(t)}this.nodes.push(e)}}input(t){if(t.length!==this.inputLength)throw new Error('Number of inputs must match the number of "inputLength".');const e=this.nodes.filter((t=>t.nodeType===s.INPUT)),n=this.nodes.filter((t=>t.nodeType===s.OUTPUT)),i=this.nodes.filter((t=>t.nodeType!==s.INPUT&&t.nodeType!==s.BIAS)),o=this.nodes.filter((t=>t.nodeType!==s.INPUT));for(const t of i)t.output=0;for(let n=0;n<e.length;++n)e[n].output=t[n];for(const t of this.connections){const e=t.to,n=t.from.output*t.weight;e.output+=n}for(const t of o)t.output=(h=t.output,1/(1+Math.exp(-h)));var h;return n.map((t=>t.output))}removeConnection(t){const e=this.connections.findIndex((e=>t===e));-1!==e&&this.connections.splice(e,1)}removeNode(t){this.nodes=this.nodes.filter((e=>e!==t)),this.connections=this.connections.filter((e=>e.from!==t&&e.to!==t))}addNodeInConnection(t){this.removeConnection(t);const e=new o({id:++this.currentNodeId,nodeType:s.HIDDEN});this.nodes.push(e);const n=new i({from:t.from,to:e,weightRange:this.weightRange}),h=new i({from:e,to:t.to,weightRange:this.weightRange});this.connections.push(n,h)}addRandomConnection(){let e=0;const n=this.nodes.length*this.nodes.length;for(;e<n;){const n=Math.floor(t(0,this.nodes.length)),s=Math.floor(t(0,this.nodes.length));if(n===s){e++;continue}const o=new i({from:this.nodes[n],to:this.nodes[s],weightRange:this.weightRange});if(!this.connections.some((t=>t.from===o.from&&t.to===o.to)))return this.connections.push(o),o;e++}throw new Error("Failed to add a new connection: too many attempts.")}getWeightRange(){var t;return null!==(t=this.weightRange)&&void 0!==t?t:i.DEFAULT_WEIGHT_RANGE}getConnections(){return this.connections}getNodes(){return this.nodes}setConnections(t){this.connections=t}setNodes(t){this.nodes=t}clone(){const t=new h({inputLength:this.inputLength,outputLength:this.outputLength,hiddenLayers:this.hiddenLayers,hiddenLength:this.hiddenLength,weightRange:this.weightRange}),e=[...this.getNodes().map((t=>t.clone()))];t.setNodes(e);const n=[...this.getConnections().map((t=>{const n=t.clone();return n.from=e.find((t=>t.id===n.from.id)),n.to=e.find((t=>t.id===n.to.id)),n}))];return t.setConnections(n),t}}class r{constructor(t){this.sprite=new Image,this.sprite.src=`./sprites/${t}`}}const a=new r("base.png").sprite;class c{constructor(t){this.x=0,this.canvas=t.canvas,this.ctx=t.ctx}update(){this.x-=4,this.x<=-this.canvas.width&&(this.x=0)}draw(){this.ctx.drawImage(a,this.x,this.canvas.height-c.BASE_SIZE,this.canvas.width,c.BASE_SIZE),this.ctx.drawImage(a,this.x+this.canvas.width,this.canvas.height-c.BASE_SIZE,this.canvas.width,c.BASE_SIZE)}}c.BASE_SIZE=100;const d=new r("background.png").sprite;const u=new r("pipedown.png").sprite,g=new r("pipeup.png").sprite;class l{constructor(t){this.width=70,this.passed=!1,this.canvas=t.canvas,this.ctx=t.ctx,this.x=t.x,this.height=Math.max(Math.random()*this.canvas.height-c.BASE_SIZE-1.5*l.PIPE_DISTANCE,200)}update(){this.x-=4,this.x<=-this.canvas.width&&(this.x=0)}draw(){this.ctx.drawImage(u,0,u.height-this.height,u.width,this.height,this.x,0,this.width,this.height);const t=this.height+l.PIPE_DISTANCE;this.ctx.drawImage(g,0,0,g.width,this.canvas.height-c.BASE_SIZE-t,this.x,t,this.width,this.canvas.height-c.BASE_SIZE-t)}}l.PIPE_DISTANCE=150,l.PIPE_RANGE=250;const w=new r("bird.png").sprite;class p{constructor(t){this.score=0,this.x=p.BIRD_START_POSITION,this.vy=0,this.rotation=0,this.isDead=!1,this.canvas=t.canvas,this.ctx=t.ctx,this.y=this.canvas.height/2,t.brain?this.brain=t.brain:(this.brain=new h({inputLength:4,outputLength:1}),this.brain.generateFullNetwork())}checkCollision(t){if(!this.isDead){if(this.canvas.height-this.y<=c.BASE_SIZE)return this.isDead=!0,void(this.y=this.canvas.height-c.BASE_SIZE);if(this.y<=0)return this.isDead=!0,void(this.y=0);for(const e of t)if(this.x>=e.x&&this.x<=e.x+e.width&&(this.y<=e.height||this.y>=e.height+l.PIPE_DISTANCE))return void(this.isDead=!0)}}getFitness(){return this.score}getY(){return this.y}jump(){this.isDead||(this.vy=-15,this.rotation=-55)}update(){this.isDead?this.x>-w.width&&(this.x-=4):(this.score++,this.vy+=1,this.y+=this.vy,this.rotation+=5,this.rotation>90&&(this.rotation=90))}draw(){this.ctx.save();const t=this.rotation*(Math.PI/180),e=this.x+w.width/2;this.ctx.setTransform(1,0,0,1,e,this.y),this.ctx.rotate(t),this.ctx.drawImage(w,-w.width/2,-w.height/2),this.ctx.restore()}}p.BIRD_START_POSITION=40;const f=[];for(let t=0;t<10;++t){const e=new r(`${t}.png`);f.push(e.sprite)}let m=50;let I,v=2;const x=document.querySelector("canvas"),N=x.getContext("2d"),T=document.querySelector("#speed-container"),E=document.querySelector("#birds-count-container"),y=document.querySelector("#generation"),S=document.querySelector("#best-score"),L=document.querySelector("#model"),b=new class{constructor(t={}){this.mutationsChances=Object.assign({},e,t.mutationsChances)}crossover(){}mutate(e){const n=e.getConnections(),i=e.getNodes();if(Math.random()<=this.mutationsChances.weightModification&&n.length>0){const i=Math.floor(t(0,n.length)),[s,o]=e.getWeightRange(),h=t(s,o);n[i].weight=h}if(Math.random()<=this.mutationsChances.newConnection&&e.addRandomConnection(),Math.random()<=this.mutationsChances.removeConnection&&n.length>0){const i=Math.floor(t(0,n.length));e.removeConnection(n[i])}if(Math.random()<=this.mutationsChances.newNode&&n.length>0){const i=Math.floor(t(0,n.length));e.addNodeInConnection(n[i])}if(Math.random()<=this.mutationsChances.removeNode&&i.length>0){const n=Math.floor(t(0,i.length));e.removeNode(i[n])}if(Math.random()<=this.mutationsChances.disableConnection&&n.length>0){n[Math.floor(t(0,n.length))].enabled=!1}if(Math.random()<=this.mutationsChances.enableConnection){const e=n.filter((t=>!t.enabled));if(e.length>0){e[Math.floor(t(0,e.length))].enabled=!0}}}generateChildrens(t,e){return[]}},C=new class{constructor(t){this.canvas=t.canvas,this.ctx=t.ctx}draw(){this.ctx.drawImage(d,0,0,this.canvas.width,this.canvas.height-c.BASE_SIZE)}}({canvas:x,ctx:N}),R=new c({canvas:x,ctx:N}),A=new class{constructor(t){this.score=0,this.canvas=t.canvas,this.ctx=t.ctx}getScore(){return this.score}reset(){this.score=0}increase(){this.score++}draw(){const t=this.score.toString().split("");for(let e=0;e<t.length;++e){const n=Number(t[e]),i=f[n];this.ctx.drawImage(i,this.canvas.width/2-i.width/2*t.length+e*i.width,20)}}}({canvas:x,ctx:N}),_=[],P=[];function D(t){y.textContent=String(Number(y.textContent)+1),S.textContent=String(Math.max(Number(S.textContent),A.getScore()));for(let t=0;t<x.height;t+=l.PIPE_RANGE){const e=new l({canvas:x,ctx:N,x:x.width+t});_.push(e)}const e=t=>new p({canvas:x,ctx:N,brain:t});let n=m;if(t){const i=e(t.clone());P.push(i),n-=1}for(let i=0;i<n;++i){let n;t&&i%10!=0&&(n=t.clone(),b.mutate(n));const s=e(n);P.push(s)}A.reset()}function M(){N.clearRect(0,0,x.width,x.height),C.draw();let t=!1;for(const e of _)e.update(),e.draw(),!e.passed&&e.x+e.width<p.BIRD_START_POSITION&&(e.passed=!0,A.increase()),e.x+e.width<0&&(t=!0,_.push(new l({canvas:x,ctx:N,x:_[_.length-1].x+l.PIPE_RANGE})));t&&_.shift(),R.update(),R.draw(),A.draw();let e=!1;const n=_.find((t=>t.x+t.width>p.BIRD_START_POSITION));for(const t of P){const i=n.x-p.BIRD_START_POSITION,s=n.height,o=n.height+l.PIPE_DISTANCE;t.brain.input([t.getY(),i,s,o])[0]>.5&&t.jump(),t.update(),t.checkCollision(_),t.isDead||(e=!0),t.draw()}if(!e){P.sort(((t,e)=>e.getFitness()-t.getFitness()));const t=P[0];_.length=0,P.length=0,D(t.brain),L.value=JSON.stringify(t.brain.toJson())}}E.addEventListener("click",(()=>{const t=E.querySelector("input:checked");m=Number(t.value)})),T.addEventListener("click",(()=>{const t=T.querySelector("input:checked");v=Number(t.value),clearInterval(I),I=setInterval(M,1e3/30/v)})),D(),I=setInterval(M,1e3/30/v)}));
//# sourceMappingURL=index.js.map
