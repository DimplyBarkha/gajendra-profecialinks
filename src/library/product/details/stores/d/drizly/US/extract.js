module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'US',
        store: 'drizly',
        transform: null,
        domain: 'drizly.com',
        zipcode: '',
        storeaddress: '',
        storecity: ''
    },
    implementation: async function implementation(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        let { url, zipcode, storecity, storeaddress } = inputs;
        if (url) {
            let addressText = zipcode + ' ' + storeaddress + ' ' + storecity;
            console.log(addressText);

            await context.waitForSelector('div[class^="ProductMetaInformation__VariantSelectorDesktopContainer"] span[class="MuiButton-label"]');
            await context.click('div[class^="ProductMetaInformation__VariantSelectorDesktopContainer"] span[class="MuiButton-label"]')
            console.log('Searching for adding input')
            if (await context.waitForSelector('input[type="search"]')) {
                await context.waitForSelector('input[type="search"]')
                console.log('Found search for adding input')
            }
            await context.evaluate(async function(addressText) {

                if (document.querySelector('input[placeholder="Enter address to shop"]')) {
                    document.querySelector('input[placeholder="Enter address to shop"]').remove();
                    let setVal = document.querySelector('input[placeholder="Enter address to shop"]');
                    setVal.value = addressText;
                    console.log('Set Value address');
                    await new Promise((resolve) => setTimeout(resolve, 60000));
                }

                if (document.querySelector('div[class^="RadioVariantSelector__ButtonContainer"] span.MuiButton-label')) {
                    document.querySelector('div[class^="RadioVariantSelector__ButtonContainer"] span.MuiButton-label').remove();
                    let checkAvailability = document.querySelector('div[class^="RadioVariantSelector__ButtonContainer"] span.MuiButton-label')
                    checkAvailability.click();
                }
            }, addressText);
        }
        if (parameters.loadedSelector) {
            await context.waitForFunction(function(sel, xp) {
                return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
            }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
        }
    },
};