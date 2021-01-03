// @ts-nocheck
const { transform } = require('../transform');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'DE',
        store: 'mediamarkt',
        transform: transform,
        domain: 'mediamarkt.de',
        zipcode: '',
    },
    dependencies: {
        productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
        Helpers: 'module:helpers/helpers',
        SharedHelpers: 'module:product/details/stores/${store[0:1]}/${store}/helpersShared',
    },
    implementation: async({ inputString }, { country, domain, transform }, context, { productDetails, Helpers, SharedHelpers }) => {
        const sharedhelpers = new SharedHelpers(context);

        const popUpsButton = await context.evaluate(async function() {
            return !!document.querySelector('button#privacy-layer-accept-all-button');
        });

        const popUps = async function() {
            await context.evaluate(async function() {
                if (document.querySelector('button#privacy-layer-accept-all-button')) {
                    document.querySelector('button#privacy-layer-accept-all-button').click();
                }
            });
        };

        try {
            await context.waitForSelector('button#privacy-layer-accept-all-button', { timout: 35000 });
        } catch (error) {
            console.log('No pop-ups!');
        }

        if (popUpsButton) {
            await context.click('button#privacy-layer-accept-all-button');
        }

        popUps();

        try {
            await context.evaluate(async() => {
                async function infiniteScroll() {
                    let prevScroll = document.documentElement.scrollTop;
                    while (true) {
                        window.scrollBy(0, document.documentElement.clientHeight);
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        const currentScroll = document.documentElement.scrollTop;
                        if (currentScroll === prevScroll) {
                            break;
                        }
                        prevScroll = currentScroll;
                    }
                }
                await infiniteScroll();
            });
            await context.waitForSelector('div[class^="RichProductDescription"] button', { timeout: 45000 });
        } catch (error) {
            console.log('Not loading manufacturer button');
        }

        const manufDescButton = await context.evaluate(async function() {
            return !!document.querySelector('div[class^="RichProductDescription"] button');
        });

        console.log('manufDescButton');
        console.log(manufDescButton);

        const expandDetailsButton = await context.evaluate(async function() {
            return !!document.querySelector('div[class^="ProductFeatures"] a[class*="ExpandLink"]');
        });

        if (expandDetailsButton) {
            await context.click('div[class^="ProductFeatures"] a[class*="ExpandLink"]');

            await context.evaluate(async function() {
                if (document.querySelector('div[class^="ProductFeatures"] a[class*="ExpandLink"]') && !(document.querySelector('div[class^="ProductFeatures"] a[class*="ExpandLink"]').textContent.includes('Details ausblenden'))) {
                    document.querySelector('div[class^="ProductFeatures"] a[class*="ExpandLink"]').click();
                }
            });
        }

        const link = await context.evaluate(async function() {
            return window.location.href;
        });

        if (manufDescButton) {
            let content = null;
            let image = null;
            let inBoxText = null;
            let inBoxUrls = null;
            let comparisionText = null;
            await context.click('div[class^="RichProductDescription"] button');

            try {
                await context.waitForSelector('iframe[id^="loadbee"]', { timeout: 55000 });
                const iframeURLLink = await context.evaluate(async function() {
                    return document.querySelector('iframe[id^="loadbee"]').getAttribute('src');
                });
                const obj = await sharedhelpers.goToiFrameLink(iframeURLLink, link, 'body img', 'src', null, null, '.in-the-box', '.compare-headline');
                image = obj.image;
                content = obj.content;
                inBoxText = obj.inBoxText;
                inBoxUrls = obj.inBoxUrls;
                comparisionText = obj.comparisionText;

                if (inBoxUrls.length) {
                    sharedhelpers.addHiddenInfo('ii_inBoxUrls', '', inBoxUrls);
                }
                if (inBoxText.length) {
                    sharedhelpers.addHiddenInfo('ii_inBoxText', '', inBoxText);
                }
                sharedhelpers.addHiddenInfo('ii_comparisionText', comparisionText);

                await sharedhelpers.addHiddenInfo('manufContent', content);
                await sharedhelpers.addHiddenInfo('manufImg', image.join(' | '));
            } catch (err) {
                try {
                    await context.click('div[class^="RichProductDescription"] button');
                    await context.waitForSelector('#inpage_container', { timeout: 30000 });
                    const loadMore = await context.evaluate(() => document.querySelector('div.flix-more'));
                    if (loadMore) {
                        await context.click('div.flix-more');
                    }
                    await context.waitForSelector('.flix-feature-image img', { timeout: 30000 });
                    await context.evaluate(() => {
                        const imgs = [...document.querySelectorAll('.flix-feature-image img')];
                        const images = [];
                        imgs.forEach(img => {
                            const src = img.dataset.srcset;
                            const value = src.includes('https:') ? src : 'https:' + src;
                            images.push(value);
                        });
                        const manuImages = images.join(' | ');
                        const div = document.createElement('div');
                        div.id = 'manufImg';
                        div.innerText = manuImages;
                        document.body.append(div);
                    });
                    await context.evaluate(() => {
                        const desc = document.evaluate(
                            '//div[@class="flix-std-title"] | //div[contains(@class,"showlesscontent")]/text() | //div[contains(@class,"showlesscontent")]//span[@class="flix-sec"]',
                            document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                        const des = [];
                        for (let i = 0; i < desc.snapshotLength; i++) {
                            des.push(desc.snapshotItem(i).textContent);
                        }
                        const manuContent = des.join('');
                        const div = document.createElement('div');
                        div.id = 'manufContent';
                        div.innerText = manuContent;
                        document.body.append(div);
                    });
                } catch (e) {
                    console.log('Looks like the website may not have manufacturer content');
                }
            }
        } else {
            try {
                await context.waitForSelector('div[class*="PDPSpecialImageAndText"]');
                await context.evaluate(() => {
                    const manDesc = [...document.querySelectorAll('div[class*="PDPSpecialImageAndText"] div[class*="StyledText"] *')];
                    let text = '';
                    manDesc.forEach(item => {
                        text = text + (text ? ' ' : '') + item.innerText;
                    });
                    const div = document.createElement('div');
                    div.id = 'manufContent';
                    div.innerText = text;
                    document.body.append(div);
                });

                await context.evaluate(() => {
                    const manImage = [...document.querySelectorAll('div[class*="PDPSpecialImageAndText"] div[class*="StyledImage"] img')];
                    let imgSrc = '';
                    manImage.forEach(img => {
                        imgSrc = imgSrc + (imgSrc ? ' | ' : '') + img.getAttribute('src');
                    });
                    const div = document.createElement('div');
                    div.id = 'manufImg';
                    div.innerText = imgSrc;
                    document.body.append(div);
                });
            } catch (e) {
                console.log(e.message);
            }
        }

        await sharedhelpers.addHiddenInfo('ii_producturl', link);

        const productID = await sharedhelpers.getEleByXpath('(//span[contains(@class, "DetailsHeader__")]//span)[1]');

        async function graphQLCallObj(productID) {
            const upc = await context.evaluate(async function(productID) {
                const productIDText = productID.replace('| Art.-Nr. ', '').replace(' | ', '').trim();
                const graphQLCall = `GraphqlProduct:${productIDText}`;
                console.log(graphQLCall);
                const videos = [];
                let ean = null;
                let allVideos = '';
                if (window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.apolloState && window.__PRELOADED_STATE__.apolloState[graphQLCall]) {
                    console.log(window.__PRELOADED_STATE__.apolloState[graphQLCall]);
                    if (window.__PRELOADED_STATE__.apolloState[graphQLCall].ean) {
                        ean = window.__PRELOADED_STATE__.apolloState[graphQLCall].ean;
                    }
                    if (window.__PRELOADED_STATE__.apolloState[graphQLCall].assets) {
                        const totalAssets = window.__PRELOADED_STATE__.apolloState[graphQLCall].assets;
                        totalAssets.forEach(async function(element) {
                            if (element.usageType === 'Video') {
                                const url = element.link;
                                const response = await fetch(url, {
                                    accept: 'application/json, text/plain, */*',
                                    referrer: window.location.href,
                                    referrerPolicy: 'no-referrer-when-downgrade',
                                    body: null,
                                    method: 'GET',
                                    mode: 'cors',
                                });

                                if (response && response.status === 404) {
                                    console.log('Product Not Found!!!!');
                                }

                                if (response && response.status === 200) {
                                    console.log('Product Found!!!!');
                                    const data = await response.json();
                                    console.log(data);
                                    if (data.length === 1) {
                                        const vids = data[0].videos;
                                        vids.forEach(vid => {
                                            let link = vid.links[0].location;
                                            link = link.replace('/thumb/', '/vm/');
                                            videos.push(link);
                                        });
                                        allVideos = videos.join(' | ');
                                        console.log('ALL VIDEOS: ' + allVideos);
                                        const div = document.createElement('div');
                                        div.id = 'all-videos';
                                        div.innerText = allVideos;
                                        document.body.append(div);
                                    }
                                }
                            }
                        });
                    }
                }
                return ean;
            }, productID);
            return upc;
        }
        const UPC = await graphQLCallObj(productID);

        if (UPC !== null) {
            await sharedhelpers.addHiddenInfo('ii_ean', UPC);
        }

        // For alternate images
        try {
            await context.evaluate(() => {
                const next = document.querySelector('div[data-test="mms-th-gallery"] div[direction="next"][style*="block"]');
                if (next) {
                    next.click();
                }
            });
        } catch (e) {
            console.log(e.message);
        }

        // For additional description
        try {
            await context.evaluate(() => {
                const desc = document.evaluate(
                    '//section[@id="description"]//div[@data-test="mms-accordion-description"]/*',
                    document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null,
                );
                let text = '';
                let counter = 0;
                for (let i = 0; i < desc.snapshotLength; i++) {
                    const item = desc.snapshotItem(i);
                    let t = '';
                    let z = '';
                    if (item.querySelector('style')) {
                        const styles = [...item.querySelectorAll('style')];
                        styles.forEach(style => style.remove());
                    }
                    if (item.querySelector('a')) {
                        item.querySelector('a').innerText = '';
                        z = item.innerText;
                    } else if (item.querySelector('button')) {
                        item.querySelector('button').innerText = '';
                    } else if (item.nodeName === 'UL') {
                        const lis = [...item.querySelectorAll('li')];
                        lis.forEach(li => {
                            counter++;
                            t = t + (t ? ' || ' : '') + li.innerText;
                        });
                        z = ' || ' + t + ' ';
                    } else if (item.querySelector('ul')) {
                        let temp1 = '';
                        let temp2 = '';
                        const y = [...item.querySelectorAll('*')];
                        for (let i = 0; i < y.length; i++) {
                            if (y[i].nodeName === 'UL') {
                                continue;
                            }
                            if (y[i].nodeName === 'LI') {
                                counter++;
                                temp1 = temp1 + (temp1 ? ' || ' : '') + y[i].innerText;
                            } else {
                                temp1 = temp1 + ' ' + y[i].innerText;
                            }
                        }
                        const tmp = temp1.match(/^(\s?\|)/g);
                        if (tmp) {
                            temp2 = temp1;
                        } else {
                            temp2 = ' || ' + temp1;
                        }
                        z = temp2;
                    } else if (item.className.includes('PDPSpecialImageAndText') || item.querySelector('div[class*="specials-gallery"]') || item.querySelector('div[class*="PDPSpecialImageAndText"]')) {
                        z = '';
                    } else {
                        z = item.innerText;
                    }
                    text = text + (text ? ' ' : '') + z;
                }
                if (text === '' || text === null) {
                    const d = document.querySelector('div[class*="FallbackDescription"]');
                    if (d) {
                        text = d.innerText;
                    }
                }
                text = text.replace(/(\|\s?)$/, '').replace(/^(\s?\|)/, '').replace(/\|\s{1,}\|/g, '');
                const div = document.createElement('div');
                div.id = 'additional-description';
                div.innerText = text;
                document.body.append(div);
                document.body.setAttribute('bullets', counter);
            });
        } catch (e) {
            console.log(e.message);
        }

        await context.evaluate(() => {
            const moreFeatures = document.querySelector('button[class*="ProductFeatures"]');
            if (moreFeatures) {
                moreFeatures.click();
            }
        });

        // For unInterruptedPDP
        try {
            await context.evaluate(async() => {
                const scrollDiv = document.querySelector('#accessories');
                if (scrollDiv) {
                    console.log('SCROLL DIV EXISTS');
                    scrollDiv.scrollIntoView({ behavior: 'smooth' });
                }
            });
            await context.waitForXPath('//div[contains(@class, "RecommendationSlider")]//p[@data-test="product-title"] | //div[contains(@class, "slick-slide")]//p[@data-test="product-title"]');
        } catch (e) {
            console.log(e.message);
        }

        await context.extract(productDetails, { transform });
    },
};