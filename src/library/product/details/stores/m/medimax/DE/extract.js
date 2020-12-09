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
        await context.click('button.cookies-overlay-dialog__accept-all-btn');
    } catch (err) {

    }

    const link = await context.evaluate(function () {
      return window.location.href;
    });
    const src = await context.evaluate(async function() {
        const iframe = document.querySelector('#loadbeeTabContent');
        const src = iframe ? iframe.src : '';
        return src;
    });
    // await context.extract(productDetails, { transform });
    if (src) {
        let content = null;
        let image = null;
        let comparisionText = null;
        let inBoxText = null;
        let inBoxUrls = null;
        try {
            await context.goto(src, { timeout: 100000, waitUntil: 'load', checkBlocked: true });

            await context.evaluate(async () => {
                await new Promise((resolve) => setTimeout(resolve, 5000));
        
                async function infiniteScroll () {
                let prevScroll = document.documentElement.scrollTop;
                while (true) {
                    window.scrollBy(0, document.documentElement.clientHeight);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const currentScroll = document.documentElement.scrollTop;
                    if (currentScroll === prevScroll) {
                    break;
                    }
                    prevScroll = currentScroll;
                }
                }
                await infiniteScroll();
                await new Promise((resolve) => setTimeout(resolve, 8000));
            });
            inBoxText = await context.evaluate(async function () {
                const boxContent = document.querySelectorAll('.in-the-box p');
                const boxText = [];
                [...boxContent].forEach((element) => {
                  boxText.push(element.innerText);
                });
                return boxText;
            });
            inBoxUrls = await context.evaluate(async function () {
                const images = document.querySelectorAll('.in-the-box img');
                const imagesSrc = [];
                [...images].forEach((element) => {
                    imagesSrc.push(element.getAttribute('data-src'));
                });
                return imagesSrc;
            });

            comparisionText = await context.evaluate(async function () {
                return (!!document.querySelector('.compare-headline') && document.querySelector('.compare-headline').offsetHeight > 0 && document.querySelector('.compare-headline').offsetWidth) > 0;
            });

            content = await context.evaluate(async function () {
                return document.querySelector('body').innerText;
            });

            image = await context.evaluate(async function () {
              const images = document.querySelectorAll('div.wrapper img[data-src]');
              const imagesSrc = [];
              [...images].forEach((element) => {
                imagesSrc.push(element.getAttribute('data-src'));
              });
              return imagesSrc;
            });


            await context.goto(link, { timeout: 100000 });
            await context.waitForSelector('div#main-section', { timeout: 45000 });

            async function addHiddenInfo (elementID, content) {
                await context.evaluate(async function (elementID, content) {
                    const newDiv = document.createElement('div');
                    newDiv.id = elementID;
                    newDiv.textContent = content;
                    newDiv.style.display = 'none';
                    document.body.appendChild(newDiv);
                }, elementID, content);
            }
            if (inBoxUrls && inBoxUrls.length) {
                inBoxUrls.forEach((element) => {
                    addHiddenInfo('ii_inBoxUrls', element);
                });
            }
            addHiddenInfo('ii_comparisionText', comparisionText);
            console.log('inBoxText');
            console.log(inBoxText);
    
            if (inBoxText.length) {
                inBoxText.forEach((element) => {
                    addHiddenInfo('ii_inBoxText', element);
                });
            }

            addHiddenInfo('ii_manufContent', content);
            if (image && image.length) {
                addHiddenInfo('ii_manufContentImg', image.join(' || '));
            }
            return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
        } catch (error) {
            try {
                await context.evaluate(async function(src) {
                    window.location.assign(src);
                }, src);
                await context.waitForSelector('div.wrapper.preview, div#produkt');
                return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
            } catch (err) {
                console.log(err);
            }
        }
    }
}

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'DE',
        store: 'medimax',
        transform,
        domain: 'medimax.de',
        zipcode: '',
    },
    implementation,
};