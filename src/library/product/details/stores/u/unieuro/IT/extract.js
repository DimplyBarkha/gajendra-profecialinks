const { transform } = require('../format');

async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    try {
        await context.waitForSelector('div[id="inpage_container"]', { timeout: 10000 });
    } catch (error) {
        console.log("Manufacturer Description did not loaded....");
    }
    await context.evaluate(async function() {
        const vidArr = document.querySelectorAll('iframe[class*="youtube-container"]');
        let str = [];
        vidArr.forEach(ele => {
            str.push(ele.getAttribute('src'))
        });
        if (str) {
            document.body.setAttribute('video', str.join(' | '));
        }
        let arrstr = [];
        const manVid = document.querySelectorAll('input[class="flix-jw"]');
        if (manVid) {
            manVid.forEach(ele => { arrstr.push(ele.getAttribute('value').match(/(?<=file":")([^"]+)/g)[0].replace(/\\/g, '')) })
            document.body.setAttribute('manVideo', arrstr.join(' | '));
        }

        let aplusImgArr = [];
        const nodeListAplusImg = document.querySelectorAll('div[id="flix-inpage"] img[data-flixsrcset]');
        nodeListAplusImg.forEach(imge => { aplusImgArr.push(imge.getAttribute('data-flixsrcset').match(/(?<=\s)((\/\/)[^\s]+)/g).pop()) });
        document.body.setAttribute('aplus-img', aplusImgArr.join(" | "));
    });
    if (await context.evaluate(() => { return document.querySelector('div[id*="no-results-message"]') })) {
        return;
    }
    return await context.extract(productDetails, { transform });
}

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'IT',
        store: 'unieuro',
        transform: transform,
        domain: 'unieuro.it',
        zipcode: '',
    },
    implementation,
};