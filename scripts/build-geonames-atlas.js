#!/usr/bin/env node
'use strict';

// Build a compact Arabic-country city atlas from GeoNames cities5000.txt.
// Download source data separately from https://download.geonames.org/export/dump/cities5000.zip
// GeoNames data is CC BY 4.0: retain attribution and review the license before redistribution.
// Usage: node scripts/build-geonames-atlas.js cities5000.txt data/atlas/cities-arab.json

const fs = require('node:fs');
const path = require('node:path');

const input = process.argv[2];
const output = process.argv[3] || 'data/atlas/cities-arab.json';
if (!input) {
  console.error('Usage: node scripts/build-geonames-atlas.js <cities5000.txt> [output.json]');
  process.exit(2);
}

const ARAB_COUNTRIES = new Set([
  'DZ','BH','KM','DJ','EG','IQ','JO','KW','LB','LY','MR','MA','OM','PS','QA',
  'SA','SO','SD','SY','TN','AE','YE'
]);
const COUNTRY_NAMES = {
  DZ:'الجزائر', BH:'البحرين', KM:'جزر القمر', DJ:'جيبوتي', EG:'مصر',
  IQ:'العراق', JO:'الأردن', KW:'الكويت', LB:'لبنان', LY:'ليبيا',
  MR:'موريتانيا', MA:'المغرب', OM:'عُمان', PS:'فلسطين', QA:'قطر',
  SA:'السعودية', SO:'الصومال', SD:'السودان', SY:'سوريا', TN:'تونس',
  AE:'الإمارات', YE:'اليمن'
};
const TZ_FALLBACK = {
  DZ:'Africa/Algiers', BH:'Asia/Bahrain', KM:'Indian/Comoro', DJ:'Africa/Djibouti',
  EG:'Africa/Cairo', IQ:'Asia/Baghdad', JO:'Asia/Amman', KW:'Asia/Kuwait',
  LB:'Asia/Beirut', LY:'Africa/Tripoli', MR:'Africa/Nouakchott', MA:'Africa/Casablanca',
  OM:'Asia/Muscat', PS:'Asia/Hebron', QA:'Asia/Qatar', SA:'Asia/Riyadh',
  SO:'Africa/Mogadishu', SD:'Africa/Khartoum', SY:'Asia/Damascus', TN:'Africa/Tunis',
  AE:'Asia/Dubai', YE:'Asia/Aden'
};
const ARABIC = /[\u0600-\u06FF]/;
const fields = fs.readFileSync(input, 'utf8').split(/\r?\n/);
const seen = new Set();
const cities = [];

for (const line of fields) {
  if (!line || line.startsWith('#')) continue;
  const f = line.split('\t');
  if (f.length < 18) continue;
  const [geonameId, name, asciiName, alternateNames, latText, lonText, featureClass, featureCode, countryCode, , admin1, admin2, , , populationText, , , timezone] = f;
  if (!ARAB_COUNTRIES.has(countryCode) || featureClass !== 'P') continue;
  const lat = Number(latText), lon = Number(lonText), population = Number(populationText) || 0;
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;
  const arabicName = (alternateNames || '').split(',').find(n => ARABIC.test(n));
  const displayName = arabicName || name;
  const dedupeKey = countryCode + ':' + geonameId;
  if (seen.has(dedupeKey)) continue;
  seen.add(dedupeKey);
  cities.push({
    id: Number(geonameId),
    name: displayName,
    nameLatin: asciiName || name,
    countryCode,
    country: COUNTRY_NAMES[countryCode],
    admin1: admin1 || null,
    admin2: admin2 || null,
    lat,
    lon,
    timezone: timezone || TZ_FALLBACK[countryCode],
    population,
    featureCode
  });
}

cities.sort((a, b) => a.country.localeCompare(b.country, 'ar') || b.population - a.population || a.name.localeCompare(b.name, 'ar'));
const payload = {
  schemaVersion: 1,
  source: 'GeoNames cities5000',
  attribution: 'GeoNames (https://www.geonames.org), CC BY 4.0; city names may use Arabic alternate names when available.',
  generatedAt: new Date().toISOString(),
  countries: [...ARAB_COUNTRIES].sort(),
  count: cities.length,
  cities
};
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(payload, null, 2) + '\n');
console.log('Wrote ' + cities.length + ' places to ' + output);
