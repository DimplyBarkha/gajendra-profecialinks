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
        await context.waitForSelector('div[id="inpage_container"] img', { timeout: 10000 });
    } catch (error) {
        console.log("Manufacturer Description did not loaded....");
    }
    await context.evaluate(async function() {
        const ecDiv = document.querySelector('div[id="inpage_container"]');
        if (!ecDiv) {
            async function addEnhancedContent() {
                const jsApi = document.querySelector('[src*="ws.cnetcontent.com"]') && document.querySelector('[src*="ws.cnetcontent.com"]').src;
                let jsApi2 = document.querySelector('#flix-minisite no-script, #flix-inpage > script') && document.querySelector('#flix-minisite no-script, #flix-inpage > script').getAttribute('src');
                if (jsApi) {
                    const clean = text => text.toString()
                        .replace(/\r\n|\r|\n/g, ' ')
                        .replace(/&amp;nbsp;/g, ' ')
                        .replace(/&amp;#160/g, ' ')
                        .replace(/\u00A0/g, ' ')
                        .replace(/\s{2,}/g, ' ')
                        .replace(/"\s{1,}/g, '"')
                        .replace(/\s{1,}"/g, '"')
                        .replace(/^ +| +$|( )+/g, ' ')
                        // eslint-disable-next-line no-control-regex
                        .replace(/[\x00-\x1F]/g, '')
                        .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
                    const response = await fetch(jsApi);
                    const text = await response.text();
                    const text2 = clean(text);
                    const array = text2.match(/"htmlBlocks"\s*:\s*(\[.+])\s*,\s*"sites"/)[1];
                    const html = unescape(array.match(/ccs-inline-content","html":"(.+)"/)[1].replace(/\\n/g, '')).replace(/\\"/g, '"').replace(/\\'/g, "'");
                    const div = document.createElement('div');
                    div.id = 'enhanced-content';
                    div.innerHTML = html;
                    document.body.append(div);
                } else {
                    const ean = document.querySelector('div[data-module="productdetail"]').getAttribute('data-productdetail-productean');
                    jsApi2 = `https://media.flixcar.com/delivery/js/inpage/353/it/ean/${ean}`;
                    let response = await fetch(jsApi2);
                    if (response.status !== 200) throw Error('Enhanced content API Failed');
                    const js = await response.text();
                    if (js.match(/flixJsCallbacks.pid\s*='([^']+)/)) {
                        const id = js.match(/flixJsCallbacks.pid\s*='([^']+)/)[1];
                        response = await fetch(`https://media.flixcar.com/delivery/inpage/show/353/it/${id}/json`);
                        const html = JSON.parse((await response.text()).match(/^\((.+)\)$/)[1]).html;
                        const div = document.createElement('div');
                        div.id = 'enhanced-content';
                        div.innerHTML = html;
                        document.body.append(div);
                    }
                }
            }
            try {
                await addEnhancedContent();
            } catch (error) {
                console.log(error);
            }

        }
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
        let nodeListAplusImg = document.querySelectorAll('div[id="inpage_container"] img[data-flixsrcset]');
        nodeListAplusImg.forEach(imge => { aplusImgArr.push("https:" + imge.getAttribute('data-flixsrcset').match(/(?<=\s)((\/\/)[^\s]+)/g).pop()) });
        if (aplusImgArr.length === 0) {
            window.scrollTo(0, 0);
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 50;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 500);
            });
            nodeListAplusImg = document.querySelectorAll('div[id="inpage_container"] img[data-flixsrcset]');
            nodeListAplusImg.forEach(imge => { aplusImgArr.push("https:" + imge.getAttribute('data-flixsrcset').match(/(?<=\s)((\/\/)[^\s]+)/g).pop()) });
        }
        document.body.setAttribute('aplus-img', aplusImgArr.join(" | "));
    });
    if (await context.evaluate(() => { return document.querySelector('div[id*="no-results-message"]') })) {
        return;
    }

    let lezyBeeUrl = await context.evaluate(() => {
        return document.querySelector('iframe#loadbeeIframeId').getAttribute('src')
    });

    if (lezyBeeUrl) {
        let url = await context.evaluate(() => {
            return window.location.href
        })
        await context.goto(lezyBeeUrl, { timwout: 10000, waitUntil: 'networkidle0', block_ads: false, js_enabled: true });
        await context.waitForSelector("#body");
        let cloneEC = await context.evaluate(() => {
            let div = document.querySelectorAll('body>div.wrapper')
            let str = "";
            div.forEach((node) => {
                str = str + node.innerText
            })
            return str;
        })
        await context.goto(url, { timwout: 10000, waitUntil: 'networkidle0', block_ads: false, js_enabled: true });
        await context.waitForSelector('.container');
        await context.evaluate((cloneEC) => {
            let div = document.createElement('div');
            div.setAttribute('id', "inpage_container")
            div.innerText = cloneEC;
            document.body.append(div);
        }, cloneEC)
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