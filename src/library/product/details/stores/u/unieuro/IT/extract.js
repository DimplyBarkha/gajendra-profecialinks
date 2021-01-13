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
            async function add() {
                try {
                    const jsApi = document.querySelector('#flix-minisite no-script, #flix-inpage > script').getAttribute('src');
                    let response = await fetch(jsApi);
                    const js = await response.text();
                    eval(js);
                } catch (error) {
                    console.log(error);
                }
                const id = flixJsCallbacks.pid;
                response = await fetch(`https://media.flixcar.com/delivery/inpage/show/620/pt/${id}/json`);
                const html = JSON.parse((await response.text()).match(/^\((.+)\)$/)[1]).html;
                if (html) {
                    let manuDiv = document.createElement('div');
                    manuDiv.setAttribute('id', 'ecDiv');
                    manuDiv.innerHTML = html
                    document.body.append(manuDiv);
                }
            }
            try {
                await add();
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