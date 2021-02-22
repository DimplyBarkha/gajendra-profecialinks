module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'TR',
        store: 'trendyol',
        zipcode: '',
        domain: 'trendyol.com',
        loadedSelector: 'body pre',
        noResultsXPath: null,
        openSearchDefinition: {
            template: 'https://api.trendyol.com/websearchgw/api/infinite-scroll/tum--urunler?q={searchTerms}&pi={page}',
            offset: '24',
        }
    },
    implementation: async function(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        const { keywords, page, offset } = inputs;
        const { nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, spinnerSelector, openSearchDefinition } = parameters;
        let url = openSearchDefinition.template
            .replace(/{searchTerms}/g, encodeURIComponent(keywords))
            .replace('{page}', (page + (openSearchDefinition.pageOffset || 0)).toString())
            .replace('{offset}', (offset + (openSearchDefinition.indexOffset || 0)).toString());
        if (!url) {
            return false;
        }
        console.log('Going to url', url);
        await dependencies.goto({ url });
        if (loadedSelector) {
            await context.waitForFunction(function(sel, xp) {
                return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
            }, { timeout: 10000 }, loadedSelector, noResultsXPath);
        }
        console.log('Checking no results');
        return await context.evaluate(function(xp) {
            const e = document.querySelector('pre').innerHTML.match(/(products":\[\])/g)
            return !e;
        }, );
    },
};