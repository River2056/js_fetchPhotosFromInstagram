const axios = require('axios');
const fs = require('fs');
const uuid = require('uuid');

const urls = fs.readFileSync('./output/urls.txt', { encoding: 'utf-8' });
const urlList = urls.split('\n');

urlList.forEach((url, index) => {
    axios({
        method: 'get',
        url,
        responseType: 'stream'
    })
    .then(res => {
        if(res.status === 200) {
            res.data.pipe(fs.createWriteStream(`./output/photos/image_${uuid.v4()}.jpg`));
        }
        console.log(`done writing photo ${index + 1}`);
    })
    .catch(err => console.log(`Error: ${err}`));
});