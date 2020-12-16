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
        console.log('cannot find or click the accept all button for cookies', err);
    }

    const link = await context.evaluate(function () {
        return window.location.href;
    });
    const src = await context.evaluate(async function () {
        const iframe = document.querySelector('#loadbeeTabContent');
        // const src = iframe ? (iframe.src||iframe._src) : '';
        let src = '';
        if (iframe) {
            if (iframe.hasAttribute('src')) {
                src = iframe.getAttribute('src');
            } else if (iframe.hasAttribute('_src')) {
                src = iframe.getAttribute('_src');
            } else {
                console.log('we do not have any src in iframe');
            }
        } else {
            console.log('we do not have the iframe');
        }
        console.log('iframe src to go to - ' + src);

        return src;
    });
    // await context.extract(productDetails, { transform });
    let content = null;
    let image = null;
    let comparisionText = null;
    let inBoxText = [];
    let inBoxUrls = [];
    let videoUrlIframe = [];
    if (src) {

        try {
            await context.goto(src, { timeout: 100000, waitUntil: 'load', checkBlocked: true });

            await context.evaluate(async () => {
                await new Promise((resolve) => setTimeout(resolve, 5000));

                async function infiniteScroll() {
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
            const witbData = await context.evaluate(async () => {
                const getInTheBox = document.querySelector('div.in-the-box img');
                const inBoxUrls = [];
                const inBoxText = [];
                if (getInTheBox) {
                    const getAllProducts = document.querySelectorAll('div.in-the-box div:not(.side-pics)');
                    for (let i = 0; i < getAllProducts.length; i++) {
                        inBoxUrls.push(getAllProducts[i].querySelector('img').getAttribute('data-src'));
                        inBoxText.push(getAllProducts[i].querySelector('p').innerText);
                    }
                }
                return { inBoxText, inBoxUrls };
            });
            inBoxText = witbData.inBoxText;
            inBoxUrls = witbData.inBoxUrls;

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


            videoUrlIframe = await context.evaluate(async function () {
                let videoElm = document.querySelectorAll('div[class*="play-btn"]');
                let videoIframeArr = [];
                if (videoElm.length === 0) {
                    console.log('we do not have video in iframe or need to update the selector');
                } else {
                    for (let i = 0; i < videoElm.length; i++) {
                        if (videoElm[i].hasAttribute('data-video') && !!(videoElm[i].getAttribute('data-video')) && !(videoIframeArr.includes(videoElm[i].getAttribute('data-video')))) {
                            videoIframeArr.push(videoElm[i].getAttribute('data-video'));
                            console.log(videoElm[i].getAttribute('data-video'));
                        } else {
                            console.log('we do not have this attribute anymore or this attribute is empty or it is already present');
                        }
                    }
                }
                return videoIframeArr;
            });


            await context.goto(link, { timeout: 100000 });
            await context.waitForSelector('div#main-section', { timeout: 45000 });


        } catch (error) {
            try {
                await context.evaluate(async function (src) {
                    window.location.assign(src);
                }, src);
                await context.waitForSelector('div.wrapper.preview, div#produkt');
                return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
            } catch (err) {
                console.log(err);
            }
        }
        // return await context.extract(productDetails, { transform });
    } else {
        console.log('we do not have the src for iframe');
    }

    async function addHiddenInfo(elementID, content, contentArr = []) {
        await context.evaluate(async function (elementID, content, contentArr) {
            if (contentArr.length == 0)
                contentArr.push(content);
            contentArr.forEach((element) => {
                const newDiv = document.createElement('div');
                newDiv.id = elementID;
                newDiv.textContent = element;
                newDiv.style.display = 'none';
                document.body.appendChild(newDiv);
            });
        }, elementID, content, contentArr);
    }


    addHiddenInfo('ii_inBoxUrls', "", inBoxUrls);

    addHiddenInfo('ii_comparisionText', comparisionText ? 'Yes' : 'No');
    console.log('inBoxText');
    console.log(inBoxText);
    addHiddenInfo('ii_inBoxText', "", inBoxText);

    addHiddenInfo('ii_manufContent', content);
    if (image && image.length) {
        addHiddenInfo('ii_manufContentImg', image.join(' || '));
    }

    await context.waitForFunction(function (sel) {
        return Boolean(document.querySelector(sel));
    }, { timeout: 20000 }, 'body');

    const uipdpProducts = await context.evaluate(async function () {
        const productCarousel = [...document.querySelectorAll('div.carousel-item')];
        const uipdpArr = [];
        productCarousel.forEach((element) => {
            const brand = element.querySelector('.carousel-brand') ? element.querySelector('.carousel-brand').innerText : '';
            const productName = element.querySelector('.carousel-name') ? element.querySelector('.carousel-name').innerText : '';
            uipdpArr.push(brand + ' ' + productName);
        });
        return uipdpArr.join(' || ');
    });
    addHiddenInfo('ii_uipdp', uipdpProducts);

    // need to add video urls links
    try {
        await context.evaluate(async function (videoUrlIframe) {
            async function addHiddenInfoAsync(elementID, content) {
                const newDiv = document.createElement('div');
                newDiv.id = elementID;
                newDiv.textContent = content;
                newDiv.style.display = 'none';
                document.body.appendChild(newDiv);
            }
            for (let i = 0; i < videoUrlIframe.length; i++) {
                await addHiddenInfoAsync(`iframe-video-${i + 1}`, videoUrlIframe[i]);
            }
        }, videoUrlIframe);
    } catch (err) {
        console.log('error while getting the video', err)
    }


    // return await context.extract(productDetails, { transform });
    return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
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