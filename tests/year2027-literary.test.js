'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../scripts/build-year2027-content.js'),'utf8').split('const lex=')[0];
const ctx={require,__dirname:path.join(__dirname,'../scripts'),process};vm.runInNewContext(source+'\nglobalThis.parseReading=body;',ctx);
const sample='### عنوان تجريبي\n\nافتتاح تجريبي.\n\n#### عنوان أول\n\nفقرة أولى.\n\nفقرة ثانية.\n\n#### كيف يُستثمر\n\nفقرة تطبيقية.\n\n[طبقة الحكم: داخلي]\n\n**خطوتك:** خطوة تجريبية.\n\n**سؤالك:** سؤال تجريبي؟';
const r=ctx.parseReading(sample);assert.equal(r.sections.length,2);assert.equal(r.sections[0].paragraphs.length,2);assert.equal(r.introParagraphs.length,1);assert.equal(r.paragraphs.length,4);assert.equal(r.action,'خطوة تجريبية.');assert.equal(r.question,'سؤال تجريبي؟');assert.ok(!r.paragraphs.join(' ').includes('داخلي'));assert.ok(!r.paragraphs.join(' ').includes('خطوة تجريبية'));
const joined=ctx.parseReading('#### عنوان\nفقرة مباشرة.\n\nفقرة أخرى.');assert.equal(joined.sections[0].paragraphs.length,2);
const legacy=ctx.parseReading('### عنوان\n\nفقرة أولى.\n\nفقرة ثانية.\n\n**خطوتك:** خطوة.\n\n**سؤالك:** سؤال؟');assert.equal(legacy.sections,undefined);assert.equal(legacy.paragraphs.length,2);
console.log('PASS literary headings, paragraph order, intro, metadata exclusion, legacy compatibility.');
