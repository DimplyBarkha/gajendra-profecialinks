const { transform } = require('./format.js');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'US',
        store: 'lowes',
        transform: transform,
        domain: 'lowes.com',
        zipcode: '',
    },
    implementation: async(inputs,
        parameters,
        context,
        dependencies,
    ) => {
        async function loadContent() {
            try {
                await context.evaluate(() => {
                    document.querySelector('div.recommendation ,div.product-desc').scrollIntoView({
                        behavior: 'smooth',
                    });
                });
                await context.waitForNavigation({ waitUntil: 'networkidle0' });
                await context.waitForSelector('section#main');
                return true;
            } catch (err) {
                return false;
            }
        }

        const MAX_TRIES = 5;
        let counter = 1;
        let loaded = false;
        const pageUrl = await context.evaluate(() => window.location.href);
        do {
            loaded = await loadContent();

            counter++;
        } while (!loaded && counter <= MAX_TRIES);
        if (!loaded) {
            console.log('Product detail not loaded.');
        }
        const applyScroll = async function(context) {
            await context.evaluate(async function() {
                let scrollTop = 0;
                while (scrollTop !== 20000) {
                    scrollTop += 1000;
                    window.scroll(0, scrollTop);
                    await stall(3000);
                }

                function stall(ms) {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve();
                        }, ms);
                    });
                }
            });
        };
        const MAX_SCROLL = 5;
        let count = 1;
        do {
            await applyScroll(context);
            count++;
        } while (count <= MAX_SCROLL);
        await context.evaluate(async function() {
            let scrollSelector = document.querySelector('div#footerApp');
            let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
            let yPos = 0;
            while (scrollLimit && yPos < scrollLimit) {
                yPos = yPos + 350;
                window.scrollTo(0, yPos);
                scrollSelector = document.querySelector('div#footerApp');
                scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            try {
                const button = document.querySelector('div[id="preview-specifications"] div[class*="preview-btn"] button');
                // @ts-ignore
                button && button.click();
            } catch (error) {
                console.log('failed to click view all spec');
            }
        });
        // await applyScroll(context);
        await context.evaluate(async function() {
            const images = JSON.parse(document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent &&
                document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent.match(/"additionalImages":([^\]]+])/) &&
                document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent.match(/"additionalImages":([^\]]+])/)[1]);
            const alternateImagesCount = images ? images.length : null;
            if (alternateImagesCount) {
                images.map(ele => {
                    const secondaryImageLink = document.createElement('a');
                    secondaryImageLink.setAttribute('class', 'alternateImages');
                    secondaryImageLink.setAttribute('href', ele.baseUrl);
                    document.body.appendChild(secondaryImageLink);
                });
                const secondaryImageCount = document.createElement('a');
                secondaryImageCount.setAttribute('class', 'alternateImagesCount');
                secondaryImageCount.setAttribute('href', alternateImagesCount);
                document.body.appendChild(secondaryImageCount);
            }

            function addElementToDocument(key, value) {
                const catElement = document.createElement('div');
                catElement.id = key;
                catElement.textContent = value;
                catElement.style.display = 'none';
                document.body.appendChild(catElement);
            }
            const enhancedContent = document.querySelector('div[class*="syndi_powerpage"]');
            if (enhancedContent) {
                const witbData = Array.from([...enhancedContent.shadowRoot.querySelectorAll('[class="syndigo-widget-section-header"]')].find(elm => elm.innerText.match(/in the box/i)).nextElementSibling.querySelectorAll('[class="syndigo-featureset-feature"]'))
                witbData.forEach(element => {
                    element.querySelector('h3') && addElementToDocument('witbText', element.querySelector('h3').innerText);
                    element.querySelector('img') && addElementToDocument('witbImg', element.querySelector('img').src);
                });
            }
            const comparisonTable = document.querySelector('div[class*="syndi_powerpage"]');
            if (comparisonTable) {
                const witbData1 = [...comparisonTable.shadowRoot.querySelectorAll('div[class="syndi_powerpage"] div[class*="syndigo"]')]
                witbData1.forEach(element => {
                    element.querySelector('h2[class="syndigo-widget-section-header"]') && addElementToDocument('witbTable', element.querySelector('h2[class="syndigo-widget-section-header"]'));
                });
            }

            // const expandDataT = document.querySelector('div[class="prev-container"]>div[class="prev-body"] div[class="divTableRow"]:first-child div[class="optionCont"]');
            // if (expandDataT) {
            //   let witbData1 = expandDataT.querySelectorAll('a');
            //   let finalValue;
            //   witbData1.forEach(element => {
            //     if (element.querySelector('b').innerText.match(/dyson/i)) {
            //       finalValue = 'Yes';
            //     }
            //     else {
            //       finalValue = 'No';
            //       return false;
            //     }
            //   });

            //   addElementToDocument('elementDataT', finalValue);
            // }
            console.log(document.querySelector('b').innerText == "Dyson")
            console.log(document.querySelector('b').innerText.match(/dyson/i))
            const videoApi = JSON.parse(document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent &&
                document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent.match(/videos":([^\]]+])/) &&
                document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent.match(/videos":([^\]]+])/)[1]);
            if (videoApi && videoApi.length) {
                videoApi.map(ele => {
                    const newlink = document.createElement('a');
                    newlink.setAttribute('class', 'videoUrls');
                    newlink.setAttribute('href', `https://lda.lowes.com/is/content/Lowes/${ele}`);
                    document.body.appendChild(newlink);
                });
            }
        });
        await applyScroll(context);
        const { transform } = parameters;
        const { productDetails } = dependencies;
        await context.extract(productDetails, { transform });
    },
};