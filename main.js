import { sources, wars, variants, classes, ritual } from './archive.js';
import { research, warHistories, variantHistories, additionalVariants, timelineLanes } from './histories.js';
import { activateCatalog, classesPanel, masterPanel, sealPanel } from './catalog.js';
import { mountBgm } from './bgm.js';

const references = { ...sources, ...research };
const branchRecords = [...variants, ...additionalVariants];

const $=(s,el=document)=>el.querySelector(s);
const $$=(s,el=document)=>[...el.querySelectorAll(s)];
const paths={
  minus:'M5 12h14',plus:'M5 12h14M12 5v14',reset:'M5 11a7 7 0 1 1 1.9 5.8M5 5v6h6',
  spin:'M3 9a9 9 0 0 1 16.6-2M21 4v4h-4M21 15a9 9 0 0 1-16.6 2M3 20v-4h4',
  share:'M12 15V3m-4 4 4-4 4 4M7 11H5v9h14v-9h-2',sword:classes[0][3],
  arrow:'M3 12h17m-6-6 6 6-6 6',right:'m9 5 7 7-7 7',down:'m5 9 7 7 7-7',up:'M12 21V4m-6 6 6-6 6 6',
  close:'m6 6 12 12M18 6 6 18',
  play:'M8 5l11 7-11 7V5Z',pause:'M9 5v14m6-14v14',
  cup:'M6 4h12c0 5.5-1.7 9-6 10-4.3-1-6-4.5-6-10Zm6 10v5m-5 1h10M6 6H3c0 4 2 6 5 6m10-6h3c0 4-2 6-5 6',
  seal:'M12 2 10 7l2 4 2-4-2-5Zm0 20 1.5-7L12 11l-1.5 4 1.5 7ZM3 7c0 5 2 8 6 10l-1-3c-2-2-3-4-5-7Zm18 0c0 5-2 8-6 10l1-3c2-2 3-4 5-7Z',
  master:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 8v-2c0-3 3.6-4 8-4s8 1 8 4v2H4Z',
  rotate:'M4 8a8 8 0 1 1 0 8M4 5v4h4',
  sparkle:'M12 2c0 5-3 7-7 9 4 1 7 4 7 9 0-5 3-8 7-9-4-2-7-4-7-9ZM5 3v4M3 5h4m11 13v4m-2-2h4'
};
const svg=(path)=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+path+'"/></svg>';
const icon=(name)=>svg(paths[name]);
const hydrate=(root=document)=>$$('[data-icon]',root).forEach(el=>el.innerHTML=icon(el.dataset.icon));
const links=(ids)=>[...new Set(ids)].map(id=>{const [label,url]=references[id];return '<a href="'+url+'" target="_blank" rel="noopener noreferrer">'+label+'</a>';}).join('');
const refs=(ids)=>'<div class="refs" aria-label="条目来源">'+links(ids)+'</div>';
const spoiler=(words,label='展开关键剧透')=>'<details class="spoiler"><summary>'+label+'</summary><p>'+words+'</p></details>';
const timeline=(events)=>`<ol class="dossier-timeline">${events.map(([title,body])=>
  `<li><h4>${title}</h4><p>${body}</p></li>`).join('')}</ol>`;
const disclosure=(title,events)=>`<details class="dossier-disclosure"><summary>${title}</summary>${timeline(events)}</details>`;
const registryButton=(id,label='查看参战名录')=>`<button class="text-button" data-drawer="masters" data-war="${id}">${label} ${icon('arrow')}</button>`;

function diagram(){
  const cx=500,cy=500;
  let out='<svg viewBox="0 0 1000 1000" fill="none" stroke="currentColor" aria-hidden="true">';
  for(const [r,o,width] of [[459,.39,1],[449,.23,.7],[417,.52,1],[404,.32,1],[368,.31,.9],[343,.2,.6],[281,.17,.9],[163,.26,.8]])out+='<circle cx="500" cy="500" r="'+r+'" opacity="'+o+'" stroke-width="'+width+'"/>';
  out+='<g class="ritual-traces"><circle cx="500" cy="500" r="398" pathLength="360" stroke-dasharray="19 41" stroke-width="2" opacity=".7"/><circle cx="500" cy="500" r="349" pathLength="360" stroke-dasharray="3 7 15 35" stroke-width="1" opacity=".45"/></g>';
  const at=(r,a)=>[cx+r*Math.sin(a),cy-r*Math.cos(a)].map(x=>x.toFixed(2)).join(' ');
  for(let i=0;i<180;i++){const a=i*Math.PI/90;out+='<path d="M'+at(421,a)+' '+at(i%5===0?443:431,a)+'" opacity="'+(i%5===0?.62:.29)+'"/>';}
  for(let i=0;i<12;i++){const a=i*Math.PI/6;out+='<path d="M'+at(404,a)+' '+at(368,a)+'" stroke-width="1.5" opacity=".5"/><path d="M'+[at(397,a),at(385,a-.013),at(374,a),at(385,a+.013)].join(' L')+'Z" opacity=".75"/>';}
  for(let i=0;i<7;i++){const a=i*2*Math.PI/7;out+='<path d="M'+at(365,a)+' L'+at(365,a+6*Math.PI/7)+'" opacity=".2"/><circle cx="'+at(365,a).split(' ')[0]+'" cy="'+at(365,a).split(' ')[1]+'" r="4" fill="currentColor" opacity=".5"/>';}
  out+='<path d="M500 17v41m-18-24h36M500 942v41m-18-17h36M17 500h40m-25-17v34m910-17h41m-17-17v34" opacity=".56"/>';
  out+='<path d="M278 510h444m-222-222v444" stroke-dasharray="2 9" opacity=".27"/></svg>';
  $('#diagram').innerHTML=out;
}

const warTabs=$('#war-tabs');
const record=$('#war-record');
warTabs.innerHTML=wars.map((w,i)=>'<button type="button" role="tab" id="tab-'+w.id+'" aria-label="'+w.name+'" aria-controls="war-record" data-index="'+i+'"><b>'+w.no+'</b><span>'+w.name.replace('次圣杯战争','战')+'</span><small>'+w.period+'</small></button>').join('');
let warIndex=-1;
function renderWar(i){
  warIndex=i;const w=wars[i], history=warHistories[w.no];
  $$('.war-tabs button').forEach((t,j)=>{t.setAttribute('aria-selected',j===i);t.tabIndex=j===i?0:-1;});
  record.dataset.num=w.no;record.setAttribute('aria-labelledby','tab-'+w.id);
  record.innerHTML=`<div class="record-layout"><div>
    <p class="record-mark">${w.name} · ${w.mark}</p><h3>${w.title}</h3><p class="lead">${w.intro}</p>
    <h4 class="dossier-label">战事经过</h4>${timeline(history.chronology)}
    ${history.routes ? `<h4 class="dossier-label">分支与结局</h4><p class="archive-note">以下含关键剧透。</p>
      ${history.routes.map(([label,events])=>disclosure(label,events)).join('')}`
      : spoiler(w.secret,'查看仪式结果')}
    ${refs(history.refs)}
    </div><aside class="record-aside"><dl class="war-facts">
      ${w.facts.map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}
    </dl>${registryButton(w.no,'查看此战参战名录')}</aside></div>`;
  hydrate(record);
}
function selectWar(i) {
  if (warIndex === i) return;
  renderWar(i);
  const url = new URL(location.href);
  url.searchParams.set('war', wars[i].id);
  history.replaceState(null,'',url);
}
warTabs.addEventListener('click',e=>{const t=e.target.closest('[role=tab]');if(t)selectWar(+t.dataset.index);});
warTabs.addEventListener('keydown',e=>{
  let i=warIndex;switch(e.key){case 'ArrowLeft':i=(i+wars.length-1)%wars.length;break;case 'ArrowRight':i=(i+1)%wars.length;break;case 'Home':i=0;break;case 'End':i=wars.length-1;break;default:return;}
  e.preventDefault();selectWar(i);warTabs.children[i].focus();
});
function restoreWarFromUrl() {
  const savedWar = new URLSearchParams(location.search).get('war');
  const index = Math.max(0, wars.findIndex(war=>war.id===savedWar));
  if (index !== warIndex) renderWar(index);
}
addEventListener('popstate',restoreWarFromUrl);
restoreWarFromUrl();
$('#epilogue').innerHTML='<details><summary>编年附录：第五战之后</summary><p>据《Fate/complete material III》的设定，仍保留大圣杯的后续中，约十年后远坂凛与君主·埃尔梅罗二世着手拆解仪式。魔术协会方面也对它有所图谋，引发后来称作「解体战争」的冲突。它终结了这条记录中的冬木仪式，未编为第六届，也不适用于大圣杯已被关闭或移走的结局。</p>'+refs(['cm','fuyuki'])+'</details>';

$('#ritual-steps').innerHTML=ritual.map(([n,name,body])=>'<article class="ritual-step"><span>'+n+'</span><h3>'+name+'</h3><p>'+body+'</p></article>').join('');
$('#ritual-details').innerHTML=disclosure('展开仪式的规则与例外',[
  ['灵地与周期','冬木的地下大圣杯按照灵脉所能提供的魔力运作。约六十年是通常积蓄周期。第四战中止后仍有魔力留存，第五战约十年后就已启动。'],
  ['谁控制从者','冬木通常由七组御主与七骑从者参加。令咒能够强制命令，契约负责联结，供魔支撑现界。第四战肯尼斯与索拉的分工表明三件事可以由不同的人承担。'],
  ['败退的从者去哪','被击败的从者会从现世退场。小圣杯暂时收集其魂魄，达到仪式所需的条件时才能与大圣杯完成后续步骤。展开第四战与第五战可对照不同容器。'],
  ['从许愿到抵达根源','对参战者而言，圣杯是能够借庞大魔力实现愿望的装置。对御三家而言，这场争夺提供了召唤并集中英灵之魂的办法，以便最后打开通路。'],
  ['谁监督这场战争','圣堂教会派出监督者，常负责场外协调、收容失格者和令咒保管。罗马尼亚的Ruler则由仪式召来，权益和职责来自另一条机制。']
])+refs(['cm','cm3','fsn','apo','zguide','fakeworld']);
const filters=['全部','分歧与复制','独立系统','特殊记录'];
$('#filters').innerHTML=filters.map((f,i)=>'<button data-filter="'+f+'" aria-pressed="'+(i===0)+'">'+f+'</button>').join('');
const variantList = $('#variant-list');
variantList.innerHTML = branchRecords.map(([name,type,where,content,delta,...cites],index)=>{
    const dossier=variantHistories[name];
    return `<details class="variant" id="branch-${index}" data-type="${type}">
      <summary><strong>${name}</strong><span class="where">${where}</span><span>${type}</span><i data-icon="down"></i></summary>
      <div class="variant-body"><p>${content}</p><p class="variant-rule"><strong>规则变化</strong> ${delta}</p>
        ${disclosure('查看仪式经过 · 含剧透',dossier.stages)}
        ${dossier.roster ? registryButton(dossier.roster,dossier.otherRoster ? '查阅1991年名录' : undefined) : ''}
        ${dossier.otherRoster ? registryButton(dossier.otherRoster,'查阅1999年名录') : ''}
        ${refs([...cites, ...dossier.refs])}
      </div></details>`;
}).join('');
hydrate(variantList);
const variantRows = $$('.variant',variantList);
function filterVariants(filter) {
  $$('#filters button').forEach(button => button.setAttribute('aria-pressed', button.dataset.filter === filter));
  let visible = 0;
  for (const row of variantRows) {
    row.hidden = filter !== '全部' && row.dataset.type !== filter;
    if (!row.hidden) visible++;
  }
  $('#result-count').textContent = `${filter}：${visible}条记录`;
}
$('#filters').addEventListener('click',e=>{const b=e.target.closest('button');if(b)filterVariants(b.dataset.filter);});
filterVariants('全部');
$('#worldlines').innerHTML = timelineLanes.map(([title, ids, lead])=>
  `<article class="worldline"><div><h3>${title}</h3><p>${lead}</p></div><div class="worldline-links">${ids.map(id=>{
    const war=wars.find(entry=>entry.no===id);
    if(war) return `<a href="?war=${war.id}#archive" data-war-jump>${war.name}</a>`;
    const index=branchRecords.findIndex(branch=>branch[0]===id);
    return `<a href="#branch-${index}" data-branch-jump="${index}">${id}</a>`;
  }).join('')}</div></article>`).join('');

$('#worldlines').addEventListener('click',event=>{
  if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
  const warLink=event.target.closest('[data-war-jump]');
  if (warLink) {
    event.preventDefault();
    if (warLink.href !== location.href) history.pushState(null,'',warLink.href);
    restoreWarFromUrl();
    navState();
    $('#archive').scrollIntoView();
    warTabs.children[warIndex].focus({preventScroll:true});
    return;
  }
  const branch=event.target.closest('[data-branch-jump]');
  if(branch) revealBranch(branch.hash);
});
function revealBranch(hash) {
  if (!/^#branch-(0|[1-9]\d*)$/.test(hash)) return;
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  if (target.hidden) filterVariants('全部');
  target.open = true;
}
addEventListener('hashchange',()=>revealBranch(location.hash));
revealBranch(location.hash);
const group=(name,ids)=>'<div><h3>'+name+'</h3><ul>'+ids.map(id=>'<li>'+links([id])+'</li>').join('')+'</ul></div>';
$('#source-collections').innerHTML=group('原作与官方资料',['fsn','ubw','hf','hfStory','hfTerms','cm','zero','zguide','zstory','zeroCast','apo','apoworld','apoCast','apoFinal','fake','fakeworld','fakeCast','extraRecord','extraManual','extra','encore','proto','protoBk','protoTimeline','labyrinth','samurai','samuraiCast','ioriSeal','hollow','fgo','firstOrder','fgoClasses','fgoGuide','heian','redline','oslo','accel','seraph','paperMoon'])+
  group('设定索引与延伸阅读',['material','cm3','vessel','fuyuki','typemoon','wiki','mug','universe','wars','sealAtlas','sealWiki','sealref','rosterMooncell','moonRoster','redTerms','redRoster','video2','video3','video4']);

const drawer=$('#drawer'), body=$('#drawer-body');
const panels={
  artifact:['THE LESSER GRAIL','小圣杯',()=>`<p>展品参照《Fate/Zero》第24话出现的金色器皿。杯体比例与金属纹饰作展陈演绎。</p>
    <h3>收集退场从者的容器</h3>
    <p>小圣杯负责截留败退从者的魂。容器可以作为器物准备，也可以安置在人造人身上。随着收纳的从者增加，作为容器的人造人可能逐渐失去日常机能。</p>
    <h3>地下的大圣杯</h3>
    <p>大圣杯是设在冬木灵地的整套仪式，负责长时间积蓄魔力并支撑召唤。小圣杯满足条件后，可以触发打开通路的后续步骤。地上的杯形容器与地下系统分别承担这些工作。</p>
    ${spoiler('爱丽丝菲尔承担第四战容器的职责。切嗣命Saber破坏显现的杯形容器，地下的大圣杯继续留在冬木。','查看第四战的容器与结局')}
    ${spoiler('第五战的爱因兹贝伦容器是伊莉雅。Heaven’s Feel还记载樱体内有一只利用上届碎片形成的不完全容器。','查看第五战的两种容器')}
    <a href="#ritual" class="text-button" data-close>查看仪式图解 ${icon('arrow')}</a>${refs(['zstory','apo','vessel','hfStory'])}`],
  seals:['COMMAND SPELLS','令咒档案',()=>sealPanel(refs,spoiler)],
  classes:['SERVANT CLASSES','从者职阶',()=>classesPanel(svg,refs)],
  masters:['MASTER REGISTRY','御主与参战名录',masterPanel]
};
let opener=null;
let exitDestination=null;
function openDrawer(key,element,war='IV',activeClass=''){
  const [en,cn,content]=panels[key];
  if(!drawer.open)opener=element||document.activeElement;
  drawer.dataset.panel=key;
  $('#drawer-kicker').textContent=en;$('#drawer-title').textContent=cn;
  body.innerHTML=content(war,activeClass);hydrate(body);activateCatalog(body,refs,spoiler);
  if(!drawer.open)drawer.showModal();
  else $('#drawer-close').focus({preventScroll:true});
  drawer.scrollTop=0;
}
document.addEventListener('click',e=>{
  const action=e.target.closest('[data-drawer]');
  if(action)openDrawer(action.dataset.drawer,action,action.dataset.war,action.dataset.class);
  const exitLink=e.target.closest('a[data-close]');
  if (exitLink && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
    exitDestination=document.getElementById(exitLink.hash.slice(1));
    drawer.close();
  }
});
$('#drawer-close').addEventListener('click',()=>drawer.close());
drawer.addEventListener('click',e=>{if(e.target===drawer&&e.clientX<drawer.getBoundingClientRect().left)drawer.close();});
drawer.addEventListener('close',()=>{
  if (drawer.open) return;
  (exitDestination ?? opener)?.focus({preventScroll:true});
  exitDestination=null;
  opener=null;
});
let notification;
$('#share').addEventListener('click',async()=>{
  const message=$('#toast');clearTimeout(notification);
  try{await navigator.clipboard.writeText(location.href);message.textContent='链接已复制';}
  catch{message.textContent='请从地址栏复制链接';}
  notification=setTimeout(()=>message.textContent='',3000);
});
const navLinks=$$('.mast nav a');
function navState(){const hash=location.hash.startsWith('#branch-')?'#branches':location.hash||'#exhibit';navLinks.forEach(a=>{if(a.hash===hash)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
addEventListener('hashchange',navState);navState();hydrate();diagram();
mountBgm($('#bgm'));

const viewport=$('#viewport'),selectArtifact=()=>openDrawer('artifact',viewport);
const viewerControls=$$('.viewer-controls button');
const viewerInstructions=$('#viewer-hint').textContent;
const viewerLabel=viewport.getAttribute('aria-label');
function setViewerAvailable(available) {
  const controlHadFocus = viewerControls.includes(document.activeElement);
  viewport.classList.toggle('ready', available);
  $('#fallback').hidden=available;
  $('#viewer-hint').textContent=available ? viewerInstructions : '点选静态展品查看档案';
  viewport.setAttribute('aria-label', available ? viewerLabel : '小圣杯静态展品。按回车查看档案。');
  for (const button of viewerControls) button.disabled=!available;
  if (!available && controlHadFocus) viewport.focus({preventScroll:true});
}
viewport.addEventListener('click',()=>{
  if (!viewport.classList.contains('ready')) selectArtifact();
});
viewport.addEventListener('keydown',event=>{
  if (!viewport.classList.contains('ready') && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    selectArtifact();
  }
});
let scene;
try{
  const {mountScene}=await import('./scene.js');
  scene=mountScene(viewport,selectArtifact,setViewerAvailable);
}catch(err){
  console.warn('WebGL exhibit unavailable:',err.message);
  setViewerAvailable(false);
}
$('.viewer-controls').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||b.disabled||!scene)return;
  scene.command(b.dataset.action);
});
