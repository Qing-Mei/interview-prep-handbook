import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from './marked.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, 'dist');
fs.mkdirSync(out, { recursive: true });
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'site.config.json'), 'utf8'));
const esc = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const copy = {
 zh: {title:'Coding 面试手册',eyebrow:'INTERVIEW PREP / 01',intro:'把每次练习，变成一次完整的面试。',desc:'从澄清题目到验证代码，一份可以反复使用的双语面试指南。',guide:'完整指南',quick:'模拟面试',search:'搜索内容、算法或复杂度…',searchLabel:'搜索手册',toc:'本页目录',progress:'本次练习',saved:'勾选保存在当前浏览器；切换语言共用进度。',reset:'重新开始',print:'打印 / PDF',download:'下载 Markdown',empty:'没有找到匹配内容，请换一个关键词。',skip:'跳到正文',footer:'先解释清楚，再写对代码，最后验证。',switch:'English',file:'en.html',local:'无账号 · 本地进度',minutes:'30 分钟',sections:'9 个章节',repo:'GitHub 项目'},
 en: {title:'Coding Interview Handbook',eyebrow:'INTERVIEW PREP / 01',intro:'Make every practice a complete interview.',desc:'A reusable bilingual guide, from clarifying the problem to verifying your code.',guide:'Full guide',quick:'Mock interview',search:'Search topics, algorithms, or complexity…',searchLabel:'Search handbook',toc:'ON THIS PAGE',progress:'THIS PRACTICE',saved:'Saved in this browser. Both languages share your progress.',reset:'Start over',print:'Print / PDF',download:'Download Markdown',empty:'No matching content. Try another keyword.',skip:'Skip to content',footer:'Explain your reasoning. Write correct code. Verify it.',switch:'中文',file:'index.html',local:'No account · Local progress',minutes:'30 minutes',sections:'9 chapters',repo:'GitHub repository'}
};
let expected;
for (const lang of ['zh','en']) {
 const md = fs.readFileSync(path.join(root,`${lang}.md`),'utf8');
 const ids = [...md.matchAll(/<!-- task:([\w-]+) -->/g)].map(m=>m[1]);
 if (new Set(ids).size!==ids.length) throw new Error('Duplicate task IDs');
 if (expected && JSON.stringify(expected)!==JSON.stringify(ids)) throw new Error('Translations have mismatched task IDs');
 expected=ids;
 const t=copy[lang];
 const chunks=md.split(/^## /m).slice(1);
 const nav=[];
 const articles=chunks.map((chunk,i)=>{
  const [heading,...body]=chunk.split('\n');
  const id=`section-${i+1}`;
  const title=heading.replace(/^\d+\.\s*/,'');
  nav.push(`<a href="#${id}" data-section="${id}"><span>${String(i+1).padStart(2,'0')}</span>${esc(title)}</a>`);
  let html=marked.parse(body.join('\n'), {gfm:true});
  html=html.replace(/<li><input[^>]*type="checkbox"[^>]*>\s*([\s\S]*?)<!-- task:([\w-]+) -->\s*<\/li>/g,(_,text,key)=>`<li class="task"><label><input type="checkbox" data-task="${key}"><span>${text.trim()}</span></label></li>`);
  if(/<!-- task:/.test(html)) throw new Error('Unprocessed checkbox in '+lang);
  html=html.replaceAll('<table>','<div class="table-wrap" role="region" tabindex="0" aria-label="'+(lang==='zh'?'参考表格':'Reference table')+'"><table>').replaceAll('</table>','</table></div>');
  let sub=0;
  html=html.replace(/<h3>(.*?)<\/h3>/g,(_,label)=>`<h3 id="${id}-${++sub}">${label}<a class="anchor" href="#${id}-${sub}" aria-label="${lang==='zh'?'链接到此处':'Link to section'}">#</a></h3>`);
  return `<article id="${id}" data-article><div class="section-heading"><span>${String(i+1).padStart(2,'0')}</span><h2>${esc(title)}</h2></div>${html}</article>`;
 }).join('\n');
 const repo=cfg.repository ? `<a href="${esc(cfg.repository)}" target="_blank" rel="noopener">${t.repo} ↗</a>`:'';
 const html=`<!doctype html>
<html lang="${lang==='zh'?'zh-CN':'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${t.desc}"><meta name="theme-color" content="#f5f6f2"><title>${t.title} · Interview Prep</title><link rel="icon" href="./assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="./assets/style.css"><script defer src="./assets/app.js"></script></head>
<body><a class="skip" href="#content">${t.skip}</a><header class="topbar"><a class="brand" href="./${lang==='zh'?'index.html':'en.html'}"><span class="logo">ip<span>.</span></span><span>Interview Prep<span class="brand-sub">THE HANDBOOK</span></span></a><div class="top-actions">${repo}<a id="language" href="./${t.file}" lang="${lang==='zh'?'en':'zh-CN'}">${t.switch} ↗</a></div></header>
<div class="layout"><aside><p class="nav-label">${t.toc}</p><nav aria-label="${t.toc}">${nav.join('')}</nav><div class="progress-card"><p class="nav-label">${t.progress}</p><div class="progress-number"><strong id="done">0</strong><span id="total"></span></div><progress id="progress" value="0" max="${ids.length}" aria-label="${t.progress}"></progress><p id="storage-note">${t.saved}</p><button id="reset" class="quiet">${t.reset} ↺</button></div></aside>
<main id="content"><section class="hero"><div class="eyebrow">${t.eyebrow}</div><h1>${t.intro}</h1><p>${t.desc}</p><div class="badges"><span>◷ ${t.minutes}</span><span>▤ ${t.sections}</span><span>✓ ${t.local}</span></div></section><div class="toolbar"><div class="tabs" role="group" aria-label="${lang==='zh'?'阅读模式':'Reading mode'}"><button id="guide" aria-pressed="true">${t.guide}</button><button id="quick" aria-pressed="false">${t.quick}</button></div><button id="print" class="quiet">${t.print}</button><a class="download" href="./${lang}.md" download>${t.download} ↓</a></div><div class="search-box"><span aria-hidden="true">⌕</span><input id="search" type="search" aria-label="${t.searchLabel}" placeholder="${t.search}"><span id="results" role="status"></span></div><p id="empty" hidden>${t.empty}</p><div id="articles">${articles}</div><footer>${t.footer}<span>Interview Prep Handbook · 中文 / English</span></footer></main></div></body></html>`;
 fs.writeFileSync(path.join(out,lang==='zh'?'index.html':'en.html'),html);
 fs.copyFileSync(path.join(root,`${lang}.md`),path.join(out,`${lang}.md`));
}
fs.mkdirSync(path.join(out,'assets'),{recursive:true});
for(const name of ['style.css','app.js','favicon.svg']) fs.copyFileSync(path.join(root,name),path.join(out,'assets',name));
fs.writeFileSync(path.join(out,'.nojekyll'),'');
console.log(`Built 2 languages, 9 sections each, ${expected.length} stable task IDs per language.`);
