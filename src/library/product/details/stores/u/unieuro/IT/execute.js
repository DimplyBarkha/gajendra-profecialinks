const implementation = async(inputs, { loadedSelector, noResultsXPath }, context, dependencies) => {
    const { url, id } = inputs;
    let builtUrl;
    if (!url) {
        if (!id) throw new Error('No id provided');
        else builtUrl = await dependencies.createUrl(inputs);
    }

    await context.goto({ url: builtUrl || url }, {
        timeout: 50000,
        waitUntil: 'load',
        checkBlocked: true,
        block_ads: false,
    });
    await context.evaluate(() => {
        document.cookie = 'flixgvid=flix60124ae8000000.95115196';
        document.cookie = 'privacyAccepted=1';
    });
    await dependencies.goto({...inputs, url: builtUrl || url });

    if (loadedSelector) {
        await context.waitForFunction(
            (selector, xpath) => {
                return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
            }, { timeout: 10000 },
            loadedSelector,
            noResultsXPath,
        );
    }
    return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
};
module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'IT',
        store: 'unieuro',
        domain: 'unieuro.it',
        zipcode: '',
        loadedSelector: '.container',
        noResultsXPath: '//div[@id="no-results-message"]',
    },
    implementation,
};