const { cleanUp } = require('../../../../shared');
async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    function stall(ms) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, ms)
        })
    }


    await stall(5000);


    const gtin = await context.evaluate(function() {
        let gtin = null;
        document.querySelectorAll('.margin-10-0').forEach(el => {
            if (el.innerText.includes('EAN:')) {
                gtin = el.innerText.replace('EAN:', '').trim();
            }
        });
        return gtin;
    })

    const currentUrl = await context.evaluate(function() {
        return window.location.href;
    });

    async function scrollToRec () {
      await context.evaluate(async () => {
        var element = (document.querySelector('div.product--description')) ? document.querySelector('div.product--description') : null;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
          });
        }
      });
    }
    await scrollToRec();

    try {
        await context.waitForSelector('iframe[id^="loadbee"]', {timeout: 20000});
    } catch (error) {
        console.log('No enhanced content');
    }

    const loadbeeUrl = await context.evaluate(function() {
        return document.querySelector('iframe[id^="loadbee"]') ? document.querySelector('iframe[id^="loadbee"]').src : null;
    });

    let enhancedContent = '';
    let manufacturerImages = '';
    let boxContent = null;
    let videos = '';
    let comparisionText = '';
    if (loadbeeUrl || gtin) {
        let gtinUrl = gtin ? 'https://service.loadbee.com/ean/' + gtin + '/de_DE?css=default&template=default&data=%7B%22shop%22%3A%22www.euronics.de%22%2C%22source%22%3A%22inpage%22%2C%22api%22%3A%22fGy5uftNFDeUaTCCGbzAfZhpZZH5xnbC%22%7D' : null;
        console.log('going to loadbeeUrl');
        await context.goto(loadbeeUrl || gtinUrl, {
            timeout: 100000,
            waitUntil: 'load',
          });
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
        enhancedContent = await context.evaluate(function() {
            if (document.querySelector('.logo-wrapper')) {
                return document.body.innerText;
            }
        });

        manufacturerImages = await context.evaluate(function() {
            if (document.querySelector('.legal')) {
                document.querySelector('.legal').remove();
            }
            if (document.querySelector('.logo-wrapper')) {
                let imgs = [];
                document.querySelectorAll('img').forEach(img => {
                    if (img.parentElement && !img.parentElement.classList.contains('logo-wrapper')) {
                        imgs.push((img.getAttribute('src').includes('https:') ? '' : 'https:') + img.getAttribute('src'));
                    }
                });
                return imgs.join(' | ');
            }
        });

        videos = await context.evaluate(function() {
            if (document.querySelector('.logo-wrapper')) {
                let videos = [];
                document.querySelectorAll('video').forEach(video => {
                    if (video.querySelector('source')) {
                        videos.push(video.querySelector('source').getAttribute('src'));
                    }
                });
                document.querySelectorAll('.play-btn').forEach(btn => {
                    if (!videos.includes(btn.getAttribute('data-video'))) {
                        videos.push(btn.getAttribute('data-video'));
                    }
                });
                return videos.join(' | ');
            }
        });

        boxContent = await context.evaluate(function() {
            const getInTheBox = document.querySelector('div.in-the-box img');
            const inTheBoxImages = [];
            const inTheBoxTexts = [];
            let imagesUrl = '';
            let inBoxText = '';
            if (getInTheBox) {
                const getAllProducts = document.querySelectorAll('div.in-the-box div:not(.side-pics)');
                for (let i = 0; i < getAllProducts.length; i++) {
                    inTheBoxImages.push(getAllProducts[i].querySelector('img').getAttribute('src'));
                    inTheBoxTexts.push(getAllProducts[i].querySelector('p').innerText);
                }
                imagesUrl = inTheBoxImages.join(' || ');
                inBoxText = inTheBoxTexts.join(' || ');
            }
            return { text: inBoxText, images: imagesUrl };
        });

        comparisionText = await context.evaluate(async function () {
            return (!!document.querySelector('.compare-headline') && document.querySelector('.compare-headline').offsetHeight > 0 && document.querySelector('.compare-headline').offsetWidth) > 0;
        });

        await context.goto(currentUrl);
        await stall(5000);

    }

    await context.evaluate(async function(enhancedContent, manufacturerImages, videos, boxContent, comparisionText) {

        function stall(ms) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, ms)
            })
        }

        function addHiddenDiv(id, text) {
            let div = document.createElement('div');
            div.id = id;
            div.innerHTML = text;
            document.body.appendChild(div);
        }

        function addHiddenDivWithClass(name, text) {
            let div = document.createElement('div');
            div.classList.add(name);
            div.innerHTML = text;
            document.body.appendChild(div);
        }

        addHiddenDiv('enhancedContent', enhancedContent);
        addHiddenDiv('manufacturerImages', manufacturerImages);
        addHiddenDiv('videos', videos);

        addHiddenDiv('intheboxurl', boxContent ? boxContent.images : '');
        addHiddenDiv('intheboxtext', boxContent ? boxContent.text : '');

        addHiddenDiv('comparisionText', comparisionText ? 'Yes' : 'No');

        const alternateImages = [];
        document.querySelectorAll('.image--box').forEach((el, ind) => {
            if (ind === 0) {
                addHiddenDiv('primaryImage', 'https:' + el.querySelector('span').getAttribute('data-img-large'));
                addHiddenDiv('imageAlt', el.querySelector('img').getAttribute('alt'));
            } else {
                alternateImages.push('https:' + el.querySelector('span').getAttribute('data-img-large'));
            }
        });

        const categories = [];
        document.querySelectorAll('.breadcrumb--title').forEach(el => {
            categories.push(el.innerText);
        });
        categories.pop();
        categories.shift();
        categories.forEach(category => {
            addHiddenDivWithClass('category', category);
        });

        addHiddenDiv('price', '€' + document.querySelector('meta[itemprop="price"]').getAttribute('content').replace('.', ','));

        let inStore = false;
        let delivery = false;
        if (document.getElementById('buybox--button') && document.querySelector('.buy-btn--cart-add')) {
            delivery = true;
        }

        if (document.getElementById('product--details-merchant-information')) {
            inStore = true;
        }

        let description = '';
        let additionalDescBulletInfo = '';
        let bulletCount = 0;
        if (document.querySelector('.product-highlights--block')) {
            document.querySelector('.product-highlights--block').querySelectorAll('li').forEach(el => {
                description += '|| ' + el.innerText + ' ';
                additionalDescBulletInfo += '|| ' + el.innerText + ' ';
                bulletCount++;
            });
        }
        if (document.querySelector('.product--description') && document.querySelector('.product--description')) {
            description += '|| ' + document.querySelector('.product--description').innerText;
        }
        addHiddenDiv('description', description);
        addHiddenDiv('additionalDescBulletInfo', additionalDescBulletInfo);
        addHiddenDiv('descriptionBullets', bulletCount);

        document.querySelectorAll('script').forEach(el => {
            const match = el.innerHTML.match(/\"productBrand\"\: \'[0-9a-zA-Z]+\'/);
            if (match && match.length) {
                addHiddenDiv('brand', match[0].replace(/\"productBrand\"/g, '').replace(": '", '').replace("'", ''));
            }
        })

        if (delivery) {
            addHiddenDiv('availabilityText', 'In Stock');
        } else if (inStore) {
            addHiddenDiv('availabilityText', 'In Store Only');
        } else {
            addHiddenDiv('availabilityText', 'Out of Stock');
        }

        addHiddenDiv('alternateImages', alternateImages.join(' | '));

        if (document.querySelector('meta[itemprop="ratingValue"]')) {
            const rating = document.querySelector('meta[itemprop="ratingValue"]').getAttribute('content') / 2;
            addHiddenDiv('aggregateRating', rating.toString().replace('.', ','));
            addHiddenDiv('aggregateRatingText', rating.toString().replace('.', ',') + ' out of 5');
        }

        document.querySelectorAll('.margin-10-0').forEach(el => {
            if (el.innerText.includes('Artikelnummer:')) {
                addHiddenDiv('sku', el.innerText.replace('Artikelnummer:', '').trim());
                addHiddenDiv('variantId', el.innerText.replace('Artikelnummer:', '').trim());
            }
            if (el.innerText.includes('EAN:')) {
                addHiddenDiv('gtin', el.innerText.replace('EAN:', '').trim());
            }
            if (el.innerText.includes('Hersteller Artikelnummer:')) {
                addHiddenDiv('mpc', el.innerText.replace('Hersteller Artikelnummer:', '').trim());
            }
        });

        const specifications = [];
        if (document.querySelector('a[data-tabname="technical_details"]')) {
            document.querySelector('a[data-tabname="technical_details"]').click();
            await stall(200);
            document.querySelectorAll('.table-row').forEach(el => {
                if (el.querySelector('.table-attribut').innerText.includes('Gewicht (kg)')) {
                    addHiddenDiv('weightNet', el.querySelector('.table-attribut-value').innerText + ' kg');
                }
                if (el.querySelector('.table-attribut').innerText.includes('Gehäuse-Farben')) {
                    addHiddenDiv('color', el.querySelector('.table-attribut-value').innerText);
                }
                if (el.querySelector('.table-attribut').innerText.includes('Breite (cm)')) {
                    specifications.push(el.querySelector('.table-attribut-value').innerText + ' Breite (cm)');
                }
                if (el.querySelector('.table-attribut').innerText.includes('Höhe (cm)')) {
                    specifications.push(el.querySelector('.table-attribut-value').innerText + ' Höhe (cm)');
                }
                if (el.querySelector('.table-attribut').innerText.includes('Tiefe (cm)')) {
                    specifications.push(el.querySelector('.table-attribut-value').innerText + ' Tiefe (cm)');
                }
            })
        }
        addHiddenDiv('specifications', specifications.join(' x '));


        addHiddenDiv('pageTimeStamp', new Date());
        addHiddenDiv('url', window.location.href);
        addHiddenDiv('terms', 'Yes');
        addHiddenDiv('privacy', 'Yes');
        addHiddenDiv('customerServiceAvailability', 'Yes');
        addHiddenDiv('zoomInfo', 'Yes');
        addHiddenDiv('pdf', 'No');
        await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    }, enhancedContent, manufacturerImages, videos, boxContent, comparisionText);


    return await context.extract(productDetails, { transform });
}

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'DE',
        store: 'euronics',
        transform: cleanUp,
        domain: 'euronics.de',
    },
    implementation,
};