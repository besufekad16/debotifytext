/**
 * Script to generate v2 XML sitemaps from pseo-data-v2 keyword arrays.
 * Run: node src/scripts/generate-v2-sitemaps.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://www.humanifylab.com';
const PUBLIC_DIR = join(__dirname, '../../public');

function toSlug(k) {
  return k.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

// Inline the keyword arrays (same as pseo-data-v2.ts)
// We just need the slugs for XML generation

const COMPETITOR_KEYWORDS = [
  "undetectable ai alternative","undetectable ai vs humanifylab","undetectable ai free alternative",
  "undetectable ai better option","undetectable ai competitor","undetectable ai replacement",
  "undetectable ai similar tool","undetectable ai comparison","undetectable ai review alternative",
  "best alternative to undetectable ai","undetectable ai pricing alternative","undetectable ai cheaper option",
  "undetectable ai free plan alternative","undetectable ai bulk alternative","undetectable ai api alternative",
  "switch from undetectable ai","why switch from undetectable ai","undetectable ai vs humanifylab comparison",
  "undetectable ai humanifylab which is better","undetectable ai substitute","undetectable ai equivalent",
  "undetectable ai like tool","tools like undetectable ai","undetectable ai 2026 alternative",
  "undetectable ai accuracy comparison","undetectable ai bypass rate comparison","undetectable ai word limit alternative",
  "undetectable ai no watermark alternative","undetectable ai quality comparison","undetectable ai reddit alternative",
  "bypassgpt alternative","bypassgpt vs humanifylab","bypassgpt free alternative","bypassgpt competitor",
  "bypassgpt replacement","bypassgpt similar tool","bypassgpt comparison","best alternative to bypassgpt",
  "bypassgpt cheaper option","bypassgpt pricing alternative","switch from bypassgpt","bypassgpt substitute",
  "bypassgpt equivalent","tools like bypassgpt","bypassgpt 2026 alternative","bypassgpt accuracy comparison",
  "bypassgpt bypass rate comparison","bypassgpt word limit alternative","bypassgpt quality comparison",
  "bypassgpt reddit alternative","bypassgpt humanifylab which is better","bypassgpt review alternative",
  "bypassgpt free plan alternative","bypassgpt bulk alternative","bypassgpt api alternative",
  "stealthgpt alternative","stealthgpt vs humanifylab","stealthgpt free alternative","stealthgpt competitor",
  "stealthgpt replacement","stealthgpt similar tool","stealthgpt comparison","best alternative to stealthgpt",
  "stealthgpt cheaper option","stealthgpt pricing alternative","switch from stealthgpt","stealthgpt substitute",
  "stealthgpt equivalent","tools like stealthgpt","stealthgpt 2026 alternative","stealthgpt accuracy comparison",
  "stealthgpt bypass rate comparison","stealthgpt word limit alternative","stealthgpt quality comparison",
  "stealthgpt reddit alternative","stealthgpt humanifylab which is better","stealthgpt review alternative",
  "stealthgpt free plan alternative","stealthgpt bulk alternative","stealthgpt api alternative",
  "writehuman alternative","writehuman vs humanifylab","writehuman free alternative","writehuman competitor",
  "writehuman replacement","writehuman similar tool","writehuman comparison","best alternative to writehuman",
  "writehuman cheaper option","writehuman pricing alternative","switch from writehuman","writehuman substitute",
  "writehuman equivalent","tools like writehuman","writehuman 2026 alternative","writehuman accuracy comparison",
  "writehuman bypass rate comparison","writehuman quality comparison","writehuman reddit alternative",
  "writehuman humanifylab which is better",
  "quillbot humanizer alternative","quillbot ai humanizer alternative","quillbot vs humanifylab",
  "quillbot humanizer free alternative","quillbot humanizer competitor","quillbot humanizer replacement",
  "quillbot humanizer comparison","best alternative to quillbot humanizer","quillbot humanizer cheaper option",
  "switch from quillbot humanizer","quillbot humanizer substitute","quillbot humanizer equivalent",
  "tools like quillbot humanizer","quillbot humanizer 2026 alternative","quillbot humanizer accuracy comparison",
  "quillbot humanizer bypass rate","quillbot humanizer quality comparison","quillbot humanizer reddit alternative",
  "quillbot humanizer humanifylab","quillbot paraphraser vs humanifylab",
  "hix ai humanizer alternative","hix ai vs humanifylab","hix ai free alternative","hix ai competitor",
  "hix ai replacement","hix ai similar tool","hix ai comparison","best alternative to hix ai",
  "hix ai cheaper option","hix ai pricing alternative","switch from hix ai","hix ai substitute",
  "hix ai equivalent","tools like hix ai","hix ai 2026 alternative","hix ai accuracy comparison",
  "hix ai bypass rate comparison","hix ai quality comparison","hix ai reddit alternative",
  "hix ai humanifylab which is better",
  "humanizeai pro alternative","humanizeai pro vs humanifylab","humanizeai pro free alternative",
  "humanizeai pro competitor","humanizeai pro replacement","humanizeai pro similar tool",
  "humanizeai pro comparison","best alternative to humanizeai pro","humanizeai pro cheaper option",
  "switch from humanizeai pro","humanizeai pro substitute","humanizeai pro equivalent",
  "tools like humanizeai pro","humanizeai pro 2026 alternative","humanizeai pro accuracy comparison",
  "humanizeai pro bypass rate","humanizeai pro quality comparison","humanizeai pro reddit alternative",
  "humanizeai pro humanifylab","humanizeai pro pricing alternative",
  "wordtune humanizer alternative","wordtune vs humanifylab","wordtune ai humanizer alternative",
  "wordtune free alternative","wordtune competitor","wordtune replacement","wordtune comparison",
  "best alternative to wordtune","wordtune cheaper option","switch from wordtune","wordtune substitute",
  "wordtune equivalent","tools like wordtune","wordtune 2026 alternative","wordtune accuracy comparison",
  "wordtune bypass rate","wordtune quality comparison","wordtune reddit alternative",
  "wordtune humanifylab which is better","wordtune pricing alternative",
  "jasper ai humanizer alternative","jasper ai vs humanifylab","jasper ai free alternative",
  "jasper ai competitor","jasper ai replacement","jasper ai similar tool","jasper ai comparison",
  "best alternative to jasper ai","jasper ai cheaper option","switch from jasper ai","jasper ai substitute",
  "jasper ai equivalent","tools like jasper ai","jasper ai 2026 alternative","jasper ai accuracy comparison",
  "jasper ai bypass rate","jasper ai quality comparison","jasper ai reddit alternative",
  "jasper ai humanifylab which is better","jasper ai pricing alternative",
  "copy ai humanizer alternative","copy ai vs humanifylab","copy ai free alternative",
  "copy ai competitor","copy ai replacement","copy ai comparison","best alternative to copy ai",
  "copy ai cheaper option","switch from copy ai","copy ai substitute","copy ai equivalent",
  "tools like copy ai","copy ai 2026 alternative","copy ai bypass rate","copy ai humanifylab",
  "rytr humanizer alternative","rytr vs humanifylab","rytr free alternative","rytr competitor",
  "rytr replacement","rytr comparison","best alternative to rytr","rytr cheaper option",
  "switch from rytr","rytr substitute","rytr equivalent","tools like rytr",
  "rytr 2026 alternative","rytr bypass rate","rytr humanifylab which is better",
  "sudowrite humanizer alternative","sudowrite vs humanifylab","sudowrite free alternative",
  "sudowrite competitor","sudowrite replacement","sudowrite comparison","best alternative to sudowrite",
  "sudowrite cheaper option","switch from sudowrite","sudowrite substitute","sudowrite equivalent",
  "tools like sudowrite","sudowrite 2026 alternative","sudowrite bypass rate","sudowrite humanifylab",
  "jenni ai humanizer alternative","jenni ai vs humanifylab","jenni ai free alternative",
  "jenni ai competitor","jenni ai replacement","jenni ai comparison","best alternative to jenni ai",
  "jenni ai cheaper option","switch from jenni ai","jenni ai substitute","jenni ai equivalent",
  "tools like jenni ai","jenni ai 2026 alternative","jenni ai bypass rate","jenni ai humanifylab",
  "smodin humanizer alternative","smodin vs humanifylab","smodin free alternative","smodin competitor",
  "smodin replacement","smodin comparison","best alternative to smodin","smodin cheaper option",
  "switch from smodin","smodin substitute","smodin equivalent","tools like smodin",
  "smodin 2026 alternative","smodin bypass rate","smodin humanifylab which is better",
  "paraphraser io humanizer alternative","paraphraser io vs humanifylab","paraphraser io free alternative",
  "paraphraser io competitor","paraphraser io replacement","paraphraser io comparison",
  "best alternative to paraphraser io","paraphraser io cheaper option","switch from paraphraser io",
  "paraphraser io substitute","paraphraser io equivalent","tools like paraphraser io",
  "paraphraser io 2026 alternative","paraphraser io bypass rate","paraphraser io humanifylab",
  "spinbot humanizer alternative","spinbot vs humanifylab","spinbot free alternative","spinbot competitor",
  "spinbot replacement","spinbot comparison","best alternative to spinbot","spinbot cheaper option",
  "spinbot substitute","spinbot humanifylab which is better",
  "spin rewriter humanizer alternative","spin rewriter vs humanifylab","spin rewriter free alternative",
  "spin rewriter competitor","spin rewriter replacement","spin rewriter comparison",
  "best alternative to spin rewriter","spin rewriter cheaper option","spin rewriter substitute",
  "spin rewriter humanifylab",
  "article forge humanizer alternative","article forge vs humanifylab","article forge free alternative",
  "article forge competitor","article forge replacement","article forge comparison",
  "best alternative to article forge","article forge cheaper option","article forge substitute",
  "article forge humanifylab",
  "surfer seo humanizer alternative","surfer seo vs humanifylab","surfer seo free alternative",
  "surfer seo competitor","surfer seo replacement","surfer seo comparison",
  "best alternative to surfer seo","surfer seo cheaper option","surfer seo substitute",
  "surfer seo humanifylab",
  "frase humanizer alternative","frase vs humanifylab","frase free alternative","frase competitor",
  "frase replacement","frase comparison","best alternative to frase","frase cheaper option",
  "frase substitute","frase humanifylab which is better",
  "writesonic humanizer alternative","writesonic vs humanifylab","writesonic free alternative",
  "writesonic competitor","writesonic replacement","writesonic comparison",
  "best alternative to writesonic","writesonic cheaper option","writesonic substitute",
  "writesonic humanifylab",
  "anyword humanizer alternative","anyword vs humanifylab","anyword free alternative",
  "anyword competitor","anyword replacement","anyword comparison",
  "best alternative to anyword","anyword cheaper option","anyword substitute","anyword humanifylab",
  "hypotenuse ai humanizer alternative","hypotenuse ai vs humanifylab","hypotenuse ai free alternative",
  "hypotenuse ai competitor","hypotenuse ai replacement","hypotenuse ai comparison",
  "best alternative to hypotenuse ai","hypotenuse ai cheaper option","hypotenuse ai substitute",
  "hypotenuse ai humanifylab",
  "longshot ai humanizer alternative","longshot ai vs humanifylab","longshot ai free alternative",
  "longshot ai competitor","longshot ai replacement","longshot ai comparison",
  "best alternative to longshot ai","longshot ai cheaper option","longshot ai substitute",
  "longshot ai humanifylab",
  "peppertype humanizer alternative","peppertype vs humanifylab","peppertype free alternative",
  "peppertype competitor","peppertype replacement","peppertype comparison",
  "best alternative to peppertype","peppertype cheaper option","peppertype substitute",
  "peppertype humanifylab",
  "scalenut humanizer alternative","scalenut vs humanifylab","scalenut free alternative",
  "scalenut competitor","scalenut replacement","scalenut comparison",
  "best alternative to scalenut","scalenut cheaper option","scalenut substitute","scalenut humanifylab",
  "aithor humanizer alternative","aithor vs humanifylab","aithor free alternative",
  "aithor competitor","aithor replacement","aithor comparison",
  "best alternative to aithor","aithor cheaper option","aithor substitute","aithor humanifylab",
  "conch ai humanizer alternative","conch ai vs humanifylab","conch ai free alternative",
  "conch ai competitor","conch ai replacement","conch ai comparison",
  "best alternative to conch ai","conch ai cheaper option","conch ai substitute","conch ai humanifylab",
  "netus ai humanizer alternative","netus ai vs humanifylab","netus ai free alternative",
  "netus ai competitor","netus ai replacement","netus ai comparison",
  "best alternative to netus ai","netus ai cheaper option","netus ai substitute","netus ai humanifylab",
  "humbot alternative","humbot vs humanifylab","humbot free alternative","humbot competitor",
  "humbot replacement","humbot comparison","best alternative to humbot","humbot cheaper option",
  "humbot substitute","humbot humanifylab which is better",
  "phrasly alternative","phrasly vs humanifylab","phrasly free alternative","phrasly competitor",
  "phrasly replacement","phrasly comparison","best alternative to phrasly","phrasly cheaper option",
  "phrasly substitute","phrasly humanifylab",
];

function generateXml(keywords, cluster) {
  const slugs = [...new Set(keywords.map(toSlug))];
  const urls = slugs.map(slug => `  <url>
    <loc>${BASE_URL}/${slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

writeFileSync(join(PUBLIC_DIR, 'sitemap-competitor.xml'), generateXml(COMPETITOR_KEYWORDS, 'competitor'));
console.log('Generated sitemap-competitor.xml with', COMPETITOR_KEYWORDS.length, 'URLs');
