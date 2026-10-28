#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const Library = require('../assets/js/content-library.js');

const root = path.resolve(process.argv[2] || 'assets/data/content');
const errors = [];
const seen = new Set();
let checked = 0;
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const item of fs.readdirSync(dir, { withFileTypes: true }).sort((a,b)=>a.name.localeCompare(b.name))) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) walk(full);
    else if (item.isFile() && item.name.endsWith('.json')) {
      checked++;
      let entry;
      try { entry = JSON.parse(fs.readFileSync(full, 'utf8')); }
      catch (error) { errors.push(full + ': invalid JSON: ' + error.message); continue; }
      const result = Library.validateEntry(entry);
      if (!result.valid) errors.push(full + ': ' + result.errors.join('; '));
      if (entry && typeof entry.id === 'string' && Library.domains.includes(entry.domain)) {
        const key = entry.domain + ':' + entry.id;
        if (seen.has(key)) errors.push(full + ': duplicate id ' + key);
        seen.add(key);
      }
      if (result.valid && entry.workflow.status !== 'draft' && entry.workflow.status !== 'in-review') {
        errors.push(full + ': batch validation refuses non-draft/non-review content; publish through a reviewed release');
      }
    }
  }
}
walk(root);
if (errors.length) {
  console.error('Content validation failed (' + errors.length + ' issue(s), ' + checked + ' file(s) checked):');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('Content validation passed: ' + checked + ' JSON file(s), unique domain/id pairs, valid schema, draft/review-only workflow.');
}
