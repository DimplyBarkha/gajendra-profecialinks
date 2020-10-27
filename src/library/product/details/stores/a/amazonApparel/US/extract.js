const { transform } = require('../../../../sharedAmazon/transformNew');
/**
 *
 * @param { { url?: string,  id?: string, parentInput?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'US',
        store: 'amazonApparel',
        transform,
        domain: 'amazon.com',
    },

    implementation: async({ parentInput, id }, { country, domain, transform }, context, { productDetails }) => {


        async function loadAllResources(timeout = 40000) {
            const loadManufacturerSelectors = async() => ((document.querySelector('div#dpx-aplus-product-description_feature_div') !== null) || (document.querySelector('div#aplus_feature_div div#aplus') !== null));

            const loadManufacturer = await context.evaluate(loadManufacturerSelectors);

            let shouldLoadAplusBody = false;
            if (loadManufacturer) {
                try {
                    await context.waitForSelector('div#aplus_feature_div div#aplus', { timeout });
                    shouldLoadAplusBody = true;
                } catch (err) {
                    console.log('Could not load div#aplus_feature_div div#aplus');
                }
                if (shouldLoadAplusBody) {
                    try {
                        await context.waitForSelector('div.aplus-v2', { timeout });
                    } catch (err) {
                        console.log('Could not load div.aplus-v2');
                    }
                }
            }

            const loadImportantInfoSelectors = async() => ((document.querySelector('div#dpx-default-important-information_feature_div div#importantInformation_feature_div') !== null));
            const loadImportantInfo = await context.evaluate(loadImportantInfoSelectors);
            if (loadImportantInfo) {
                try {
                    await context.waitForSelector('div#important-information', { timeout: 5000 });
                } catch (err) {
                    console.log('Could not load div#important-information');
                }
            }
        }

        async function addContent(parentInput, id) {
            await context.evaluate(async(parentInput, id) => {
                function addHiddenDiv(id, content) {
                    const newDiv = document.createElement('div');
                    newDiv.id = id;
                    newDiv.textContent = content;
                    newDiv.style.display = 'none';
                    document.body.appendChild(newDiv);
                }
                let allText = '';
                [...document.querySelectorAll('div.apm-hovermodule-slides')].filter(element => element.style.display !== 'block').forEach((element) => {
                    if (element.querySelector('.apm-hovermodule-slides-inner')) {
                        allText += element.querySelector('.apm-hovermodule-slides-inner').innerText;
                    }
                });
                const manufContent = document.querySelector('div#aplus') || document.querySelector('div.aplus');
                let manufContentText = '';
                if (manufContent) {
                    const clonedManufContent = manufContent.cloneNode(true);
                    if (clonedManufContent.getElementsByTagName('style')) {
                        [...clonedManufContent.getElementsByTagName('style')].forEach((styleElement) => styleElement.remove());
                    }
                    if (clonedManufContent.getElementsByTagName('script')) {
                        [...clonedManufContent.getElementsByTagName('script')].forEach((scriptElement) => scriptElement.remove());
                    }
                    manufContentText = clonedManufContent.innerHTML.replace(/<(li)[^>]+>/ig, '<$1>').replace(/<li>/gm, ' || ').replace(/<[^>]*>/gm, '').trim();
                }
                addHiddenDiv('added-enhanced-content', (manufContent ? manufContentText : '') + allText);
                if (parentInput) {
                    addHiddenDiv('added-parentInput', parentInput);
                }
                addHiddenDiv('added-url', window.location.href);
                addHiddenDiv('added-id', id);
            }, parentInput, id);
        }

        // const endUrlFirstItem = await context.evaluate(() => {
        //     const firstItem = document.querySelector('span[data-component-type="s-product-image"] a') ? document.querySelector('span[data-component-type="s-product-image"] a').getAttribute('href') : '';
        //     return firstItem;
        // });
        // const itemUrl = 'https://www.amazon.com' + endUrlFirstItem;
        // await context.setLoadAllResources(true)
        //     .then(async() => {
        //         await context.goto(itemUrl);
        //     });

        await context.waitForXPath('//span[@id="productTitle"]', { timeout: 20000 });

        await loadAllResources();
        addContent(parentInput, id);
        console.log('autoscroll end');
        await context.evaluate(async function() {
            let getDescriptionBullets = document.querySelectorAll('div#feature-bullets li');
            let getDescription = [];
            let description = '';
            getDescriptionBullets.forEach((element) => {
                if (element.innerText) {
                    getDescription.push(element.innerText)
                }
            });
            description = getDescription.join(' || ');
            getDescription = document.querySelector('#productDescription p') ? document.querySelector('#productDescription p').innerText : '';
            description = description + getDescription;

            document.head.setAttribute('description', description);

            let getBrand = document.querySelector('a[id="bylineInfo"]') ? document.querySelector('a[id="bylineInfo"]').innerText : null;
            if (getBrand && getBrand.includes('Visit the')) {
                getBrand = getBrand.split('Visit the')[1];
                getBrand = getBrand.split('Store')[0];
                document.head.setAttribute('brand', getBrand);
            }
            if (getBrand.includes('Brand:')) {
                getBrand = getBrand.split('Brand:')[1];
                document.head.setAttribute('brand', getBrand);
            }

            function removeDuplicates(array) {
                array.splice(0, array.length, ...(new Set(array)))
            };
            let getRank = document.querySelectorAll('li#SalesRank');
            let rankDetails;
            let product_rank = [];
            let product_rank_category = [];
            getRank.forEach((element) => {
                if (element.innerText && element.innerText.includes('Best Sellers Rank') && element.innerText.includes('#')) {

                    rankDetails = element.innerText.split('Best Sellers Rank: ')[1].split('\n');
                    if (rankDetails.length) {
                        for (let i = 0; i < rankDetails.length; i++) {
                            product_rank.push(rankDetails[i].split(' ')[0].trim().replace(/#/, '').replace(/,/g, "").trim());
                            product_rank_category.push(rankDetails[i].replace(/^[#,0-9 in]+/, '').trim());
                        }
                    }
                    console.log(rankDetails)
                }
            });
            removeDuplicates(product_rank);
            removeDuplicates(product_rank_category);
            for (let i = 0; i < product_rank.length; i++) {
                const div = document.createElement('div');
                div.className = 'rank';
                const getInput = document.createElement('li');
                getInput.id = 'rank';
                div.appendChild(getInput);
                document.body.appendChild(div);
                getInput.setAttribute('value', product_rank[i]);
            }
            let category = product_rank_category.join(' | ');
            document.head.setAttribute('category', category);
            let getFeatureBullets = document.querySelectorAll('#detailBulletsWrapper_feature_div li')
            let netweight = ''
            for (i = 0; i < getFeatureBullets.length; i++) {
                if (getFeatureBullets[i].innerText.includes('Dimensions') || getFeatureBullets[i].innerText.includes('Weight')) {
                    if (getFeatureBullets[i].innerText.includes(';'))
                        netweight = getFeatureBullets[i].innerText.split(';')[1];
                    else
                        netweight = getFeatureBullets[i].innerText.split(':')[1];
                }

            }
            document.head.setAttribute('netweight', netweight)
        });
        return await context.extract(productDetails, { transform });
    },
};