const { transform } = require('../format');

async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(async function() {
        try {
            if (document.querySelector('section[class*="hits"] section:first-child')) {
                document.querySelector('section[class*="hits"] section:first-child div[class*="title product-tile__title"] >a').click();
            }
        } catch (err) {
            console.log(err);
        }
    });

    await context.waitForSelector('.container', { timeout: 60000 });

    await context.evaluate(async function() {

        window.scrollTo(0, 700);
        await stall(1000);
        window.scrollTo(0, 1000);
        await stall(3000);
        window.scrollTo(0, 300);
        await stall(1000);
        window.scrollTo(0, 700);
        await stall(3000);

        let scrollTop = 0;
        while (scrollTop <= 20000) {
            await stall(500);
            scrollTop += 1000;
            window.scroll(0, scrollTop);
            if (scrollTop === 20000) {
                await stall(1000);
                break;
            }
        }

        function stall(ms) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, ms);
            });
        }
        const vidArr = document.querySelectorAll('iframe[class*="youtube-container"]');
        let str;
        vidArr.forEach(ele => {
            if (!str) {
                str = ele.getAttribute('src');
            } else {
                str += ' | ' + ele.getAttribute('src');
            }
        });
        if (str) {
            document.body.setAttribute('video', str);
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