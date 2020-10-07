module.exports = {
    implements: 'product/search/execute',
    parameterValues: {
        country: 'ES',
        store: 'elcorteingles_perfumeria',
        domain: 'elcorteingles.es',
        url: 'https://www.elcorteingles.es/perfumeria/search/1/?s={searchTerms}',
        loadedSelector: 'li.products_list-item',
        noResultsXPath: '//p[contains(text(),"No se han encontrado ") or contains(text(),"0 resultados")]',
        zipcode: '',
    },
    implementation: async(
        inputs,
        parameters,
        context,
        dependencies,
    ) => {
        console.log('params', parameters);
        const url = parameters.url.replace('{searchTerms}', inputs.keywords.replace(/\s+/g, '+'));
        console.log(`URL =============> ${url}`);
        await dependencies.goto({ url, zipcode: inputs.zipcode });
        if (parameters.loadedSelector) {
            await context.waitForFunction(function(sel, xp) {
                return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
            }, { timeout: 30000 }, parameters.loadedSelector, parameters.noResultsXPath);
        }
        console.log('Checking no results', parameters.noResultsXPath);
        return await context.evaluate(function(xp) {
            const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            console.log(xp, r);
            const e = r.iterateNext();
            console.log(e);
            return !e;
        }, parameters.noResultsXPath);
    },
};