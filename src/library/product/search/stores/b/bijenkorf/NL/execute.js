module.exports = {
    implements: 'product/search/execute',
    parameterValues: {
        country: 'NL',
        store: 'bijenkorf',
        domain: 'bijenkorf.nl',
        url: 'https://www.debijenkorf.nl/product-lister-page.html?SearchTerm={searchTerms}',
        loadedSelector: 'li[data-at="lister-product-item"]:nth-last-child(1)',
        noResultsXPath: '//div[contains(@class,"dbk-search-empty")]',
        zipcode: '',
    },
    implementation: async function(
        inputs, { url, loadedSelector, noResultsXPath },
        context,
        dependencies,
    ) {
        const { keywords, query } = inputs;
        console.log(url);
        const destinationUrl = url
            .replace('{searchTerms}', encodeURIComponent(keywords))
            .replace('{queryParams}', query);
        await dependencies.goto({...inputs, url: destinationUrl });

        if (loadedSelector) {
            await context.waitForFunction(function(sel, xp) {
                return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
            }, { timeout: 10000 }, loadedSelector, noResultsXPath);
        }
        console.log(`noResultsXPath: ${noResultsXPath}`);
        if (await context.evaluate((xp) => document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(), noResultsXPath)) {
            throw Error;
        }
        return await context.evaluate((xp) => !document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(), noResultsXPath);
    }
};