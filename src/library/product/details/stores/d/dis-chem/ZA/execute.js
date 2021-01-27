module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'ZA',
        store: 'dis-chem',
        domain: 'dischem.co.za',
        loadedSelector: '.product-image-photo',
        noResultsXPath: '//div[contains(@class,"message info empty")] | //body[@page="search"]',
        zipcode: '',
    },
    implementation: async(inputs, { loadedSelector, noResultsXPath }, context, dependencies) => {
        const { url, id } = inputs;
        let builtUrl;
        if (!url) {
            if (!id) throw new Error('No id provided');
            else builtUrl = await dependencies.createUrl(inputs);
        }
        await dependencies.goto({...inputs, url: builtUrl || url });
        if (id) {
            await context.waitForFunction((selector, xpath) => {
                return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
            }, { timeout: 10000 }, 'li[class="item product product-item"] a:nth-child(2)', noResultsXPath);
            if (await context.evaluate((xpath) => document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath)) {
                return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
            }

            let newUrl = await context.evaluate((id) => {
                if (parseInt(id) === parseInt(document.querySelector('li[class="item product product-item"] a:nth-child(2)').getAttribute('data-sku'))) {
                    return document.querySelector('li[class="item product product-item"] a:nth-child(2)').getAttribute('href')
                } else {
                    document.body.setAttribute('page', 'search')
                    return false;
                }

            }, id);
            if (newUrl) {
                newUrl = `${newUrl}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
                await context.goto(newUrl, { waitUntil: 'networkidle0', block_ads: false });
            }
        }

        if (loadedSelector) {
            await context.waitForFunction((selector, xpath) => {
                return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
            }, { timeout: 10000 }, loadedSelector, noResultsXPath);
        }
        return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
    },
};