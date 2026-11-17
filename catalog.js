import { rosters, regularClasses, classNotes, extraClasses } from './registry.js';
import { sealEntries, sealMechanics, sealCases } from './seals.js';

const classLabels = new Map(regularClasses.concat(extraClasses).map(([en, cn]) => [en, `${en} ${cn}`]));
const sealGroups = [...new Set(sealEntries.map(entry => entry.group))];
const sealClasses = new Set(sealEntries.flatMap(entry => entry.classes));
const specialStatus = 'exception';
const optionList = (values, active) => values.map(([value, label]) =>
  `<option value="${value}"${value === active ? ' selected' : ''}>${label}</option>`).join('');

function selectField(label, field, values, active) {
  return `<label>${label}<select name="${field}">${optionList(values, active)}</select></label>`;
}

function searchField(label, placeholder) {
  return `<label>${label}<input name="query" type="search" placeholder="${placeholder}"></label>`;
}

const results = '<p class="catalog-count" role="status"></p><div class="catalog-results"></div>';
const rosterOptions = Object.entries(rosters).map(([key, group]) => [key, group.label]);
const filterOptions = [['','全部职阶'], ...classLabels];

export function masterPanel(war, activeClass = '') {
  return `<p>按仪式或职阶查询已知参战记录。可搜索御主、从者真名及阵营，真名和契约详情默认折叠。</p>
    <form class="catalog-filters" data-catalog="masters">
      ${selectField('仪式','war',[['','全部仪式'], ...rosterOptions],war)}
      ${selectField('职阶','class',filterOptions,activeClass)}
      ${searchField('检索','御主、从者或阵营')}
    </form>${results}`;
}

const bookSeals = [
  'sealAtlas','ioriSeal','sealWiki','zguide','hfTerms','hollow','ubw','extraManual','moonRoster',
  'extraCcc','protoTimeline','rosterMooncell','samuraiCast','fgoGuide'
];
export function sealPanel(refs, spoiler) {
  return `<p>职阶标签指持有者在对应仪式中的从者契约。多枚标签表示不同契约或路线，具体关系见卡片说明。</p>
    <form class="catalog-filters seal-filters" data-catalog="seals">
      ${selectField('来源','group',[['','全部来源'], ...sealGroups.map(group=>[group,group])],'')}
      ${selectField('从者职阶','class',[['','全部职阶'], ...[...classLabels].filter(([name])=>sealClasses.has(name)),
        [specialStatus,'位阶、备用及未明确项']],'')}
      ${searchField('检索','持有者、仪式或职阶')}
      <label class="segment-switch"><input type="checkbox" name="segments"> 显示分划配色</label>
    </form>${results}
    <p class="archive-note">图样据参考资料描绘。三色用于说明图集的分划，角色画面中的实际颜色以作品为准。</p>
    <h3>令咒怎样生效</h3>
    <dl class="detail-terms">${sealMechanics.map(([term, text])=>`<div><dt>${term}</dt><dd>${text}</dd></div>`).join('')}</dl>
    <details class="dossier-disclosure"><summary>查看五个使用案例 · 含剧透</summary>
      ${sealCases.map(([label,text])=>spoiler(text,label)).join('')}
    </details>${refs(bookSeals)}`;
}

export function classesPanel(svg, refs) {
  return `<p>职阶是英灵现界时的容器。不同仪式规定可用席位，同一位英灵也可以不同职阶现界。</p>
    <h3>冬木七个常规职阶</h3>
    <div class="class-list">${regularClasses.map(([en,cn,description,path])=>classRow(en,cn,description+' '+classNotes[en],svg(path))).join('')}</div>
    <h3>特殊与额外职阶</h3>
    <div class="class-list">${extraClasses.map(([en,cn,description])=>classRow(en,cn,description,'')).join('')}</div>
    <p class="archive-note">Grand是冠位召唤资格与身份。不同世界的额外职阶可能纳入不同的召唤系统。</p>
    ${refs(['fakeworld','zguide','apoworld','apoCast','extraRecord','moonRoster','fakeCast','firstOrder','fgoClasses','requiem','voyager'])}`;
}

function classRow(en, cn, description, glyph) {
  const count = Object.values(rosters).flatMap(group => group.rows).filter(row => row[1] === en).length;
  const link = count ? `<button class="text-button class-link" data-drawer="masters" data-war="" data-class="${en}">查阅 ${count} 条参战记录</button>` : '';
  return `<article class="class-row">
    <span class="class-icon">${glyph}</span>
    <div><h4>${cn}<span>${en}</span></h4><p>${description}</p>${link}</div>
  </article>`;
}

function normalize(value) {
  return value.normalize('NFKC').toLocaleLowerCase();
}

function terms(value) {
  return normalize(value).trim().split(/\s+/u).filter(Boolean);
}

function matches(query, fields) {
  if (!query.length) return true;
  const text = normalize(fields.join(' '));
  return query.every(term => text.includes(term));
}

function refreshMasterResults(form, values, refs, spoiler) {
  const war = values.get('war');
  const cls = values.get('class');
  const query = terms(values.get('query'));
  const visible = Object.entries(rosters)
    .filter(([id]) => !war || id === war)
    .map(([, dossier]) => ({ ...dossier, rows:dossier.rows.filter(row =>
      (!cls || row[1] === cls) && matches(query, [dossier.label, ...row, classLabels.get(row[1]) ?? ''])) }))
    .filter(dossier => dossier.rows.length);

  const count = visible.reduce((n, dossier) => n + dossier.rows.length, 0);
  form.parentElement.querySelector('.catalog-count').textContent = `${visible.length} 份名录，${count} 条记录`;
  form.parentElement.querySelector('.catalog-results').innerHTML = count ? visible.map(dossier =>
    `<section class="registry-section"><h3>${dossier.label}</h3><p>${dossier.lead}</p>
      <div class="master-list">${dossier.rows.map(([name,role,identity,affiliation,note]) =>
        `<article class="master-row"><span>${role}</span><div><h4>${name}</h4><small>${affiliation}</small>
          ${spoiler(`${identity}。 ${note}`,'查看真名与关系')}</div></article>`).join('')}
      </div>${refs(dossier.refs)}</section>`).join('') : '<p>没有匹配的档案。可切换仪式、职阶或更换关键词。</p>';
}

function refreshSealResults(form, values) {
  const group = values.get('group');
  const cls = values.get('class');
  const query = terms(values.get('query'));
  const segments = values.has('segments');
  const visible = sealEntries.filter(({name, group:entryGroup, note, classes, classStatus}) => {
    if (group && group !== entryGroup) return false;
    if (cls === specialStatus && classes.length) return false;
    if (cls && cls !== specialStatus && !classes.includes(cls)) return false;
    return matches(query, [name,entryGroup,note,classStatus ?? '',...classes.map(name=>classLabels.get(name))]);
  });
  form.parentElement.querySelector('.catalog-count').textContent = `${visible.length} 个图样`;
  form.parentElement.querySelector('.catalog-results').innerHTML = visible.length ? `<div class="seal-grid${segments?' segmented':''}">
    ${visible.map(({ name, group, note, paths, classes, classStatus }) => `<figure class="seal-sample"><svg viewBox="0 0 100 100" fill="currentColor" fill-rule="evenodd" aria-hidden="true">
      ${paths.map((path,index)=>`<path class="stroke-${index}" d="${path}"/>`).join('')}</svg>
      <figcaption><strong>${name}</strong><small>${group}</small>
        <div class="seal-classes" aria-label="对应职阶">
          ${classes.length ? classes.map(name=>`<span class="seal-class">${classLabels.get(name)}</span>`).join('')
           : `<span class="seal-class seal-class-status">${classStatus}</span>`}
        </div><span>${note}</span></figcaption></figure>`).join('')}</div>` :
    '<p>没有匹配的图样。可调整来源、职阶或关键词。</p>';
}

export function activateCatalog(root, refs, spoiler) {
  const form = root.querySelector('[data-catalog]');
  if (!form) return;
  function refresh() {
    const values = new FormData(form);
    if (form.dataset.catalog === 'masters') refreshMasterResults(form, values, refs, spoiler);
    else refreshSealResults(form, values);
  }
  form.addEventListener('input', refresh);
  form.addEventListener('submit', event => event.preventDefault());
  refresh();
}
