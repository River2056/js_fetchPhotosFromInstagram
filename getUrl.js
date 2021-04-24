const cheerio = require('cheerio');
const fs = require('fs');

const page = fs.readFileSync('./test/page.html', { encoding: 'utf-8' });
const $ = cheerio.load(page);
const srcArray = [];
$('.FFVAD').each(function(i, elem) {
    const src = $(this)['0'].attribs.src
    srcArray.push(src);
});

fs.writeFileSync('./output/urls.txt', srcArray.join('\n'));