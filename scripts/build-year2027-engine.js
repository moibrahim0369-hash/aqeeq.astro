#!/usr/bin/env node
// Extract the exact existing calculation engine for the server. No editorial text.
const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..'),out=path.join(root,'supabase/functions/_shared');fs.mkdirSync(out,{recursive:true});
const source=fs.readFileSync(path.join(root,'assets/js/inline/page-06.js'),'utf8'),match=source.match(/const Astro = \(\(\) => \{[\s\S]*?\n\}\)\(\);/);if(!match)throw Error('Astro engine not found');
fs.writeFileSync(path.join(out,'astro-engine.js'),'import Astronomy from "./astronomy-engine.js";\n'+match[0]+'\nexport default Astro;\n');
fs.writeFileSync(path.join(out,'astronomy-engine.js'),'const exports = {}; const module = {exports};\n'+fs.readFileSync(path.join(root,'astronomy.min.js'),'utf8')+'\nexport default module.exports;\n');
const ext=fs.readFileSync(path.join(root,'assets/js/extended-astro-charts.js'),'utf8'),ay=ext.match(/function ayanamsa\(jde\)\{[\s\S]*?\n  \}/);if(!ay)throw Error('Lahiri function not found');
const vx=fs.readFileSync(path.join(root,'assets/js/vedic-extras.js'),'utf8'),dash=vx.match(/function dashas\(moonLon, birthMs\) \{[\s\S]*?\n  \}/),antar=vx.match(/function antars\(m\) \{[\s\S]*?\n  \}/);if(!dash||!antar)throw Error('Dasha functions not found');
fs.writeFileSync(path.join(out,'vedic-engine.js'),'import Astro from "./astro-engine.js";\nconst YRS=[7,20,6,10,7,18,16,19,17], DAY=365.25*864e5;\n'+ay[0]+'\n'+dash[0]+'\n'+antar[0]+'\nexport {ayanamsa,dashas,antars};\n');
fs.copyFileSync(path.join(root,'assets/js/year2027-core.js'),path.join(out,'year2027-core.js'));
console.log('Server calculation engine synced.');
