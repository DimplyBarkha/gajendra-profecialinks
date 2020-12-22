module.exports = {
    implements: 'product/search/execute',
    parameterValues: {
        country: 'DE',
        store: 'flaconi',
        domain: 'flaconi.de',
        url: 'https://www.flaconi.de/search?q={searchTerms}',
        loadedSelector: 'div.canvas-menu-wrapper',
        noResultsXPath: '//*[contains(text(),"0 Artikel")]',
        zipcode: '',
    },
    implementation: async function(
        inputs, { url, loadedSelector, noResultsXPath },
        context,
        dependencies,
    ) {
        const { keywords } = inputs;
        const destinationUrl = url.replace('{searchTerms}', encodeURIComponent(keywords));
        await context.goto(destinationUrl, { timeout: 10000 });

        if (loadedSelector) {
            await context.waitForFunction(function(sel, xp) {
                return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
            }, { timeout: 10000 }, loadedSelector, noResultsXPath);
        }
        console.log('Checking no results', noResultsXPath);
        return await context.evaluate((xp) => {
            const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            console.log(xp, r);
            const e = r.iterateNext();
            console.log(e);
            return !e;
        }, noResultsXPath);
    }
};