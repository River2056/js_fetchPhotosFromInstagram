const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const uuid = require('uuid');
const accounts = require('./accounts.json');
const account = accounts.filter(e => e.username.startsWith('tommy'))[0];

const baseUrl = 'https://www.instagram.com/';
const username = account.username;
const password = account.password;
const typeOption = { delay: 100 };
const timeOut = 4000;
const timeOutLonger = 7000;

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(baseUrl);
    await page.waitForTimeout(timeOut);

    await page.type('input[name=username]', username, typeOption);
    await page.type('input[name=password]', password, typeOption);
    await page.waitForTimeout(timeOut);
    await page.waitForSelector('#loginForm > div > div:nth-child(3) > button');
    await page.click('#loginForm > div > div:nth-child(3) > button');
    await page.waitForTimeout(timeOut);

    // document.querySelector("#react-root > section > main > div > div > div > div > button")
    // 儲存你的資料頁面 => 選稍後再說
    await page.waitForSelector('#react-root > section > main > div > div > div > div > button');
    await page.click('#react-root > section > main > div > div > div > div > button');
    await page.waitForTimeout(timeOut);

    // document.querySelector("body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm")
    // 開啟通知 => 選稍後再說
    await page.waitForSelector('body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm');
    await page.click('body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm');
    page.waitForTimeout(timeOut);

    // if you reach this point, that means you have reached the main page
    // start fetching photos and scroll down
    // loop
    let photoCount = 0;
    if(!fs.existsSync('./output/photos')) {
        fs.mkdirSync('./output/photos')
    }
    while(true) {
        let imageElementHandlers = await page.$$('.FFVAD');
        for(const el of imageElementHandlers) {
            const src = await (await el.getProperty('src')).jsonValue();
            let imageName = uuid.v4();
            axios({
                method: 'get',
                url: src,
                responseType: 'stream'
            })
            .then(res => {
                if(res.status === 200) {
                    res.data.pipe(fs.createWriteStream(`./output/photos/image_${imageName}.jpg`));
                    photoCount++;
                    console.log(`done writing ${imageName}`);
                    console.log(`photo count: ${photoCount}`);
                }
            })
            .catch(err => console.log(err));
        }
        // scroll down the page to get more photos
        for(let i = 0; i < 4; i++) {
            await page.evaluate(() => {
                // scroll more to avoid getting repeated photos
                window.scrollTo(0, window.document.body.scrollHeight);
            });
            await page.waitForTimeout(timeOut);
        }
        await page.waitForTimeout(timeOutLonger);
    }
})();