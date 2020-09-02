async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    console.log('params', parameters);
    const inputKeyWord = inputs.keywords.replace(' ', '-');
    const url = parameters.url.replace('{searchTerms}', inputKeyWord);
    await dependencies.goto({ url, zipcode: inputs.zipcode });
    if (parameters.loadedSelector) {
        await context.waitForFunction(function(sel, xp) {
            return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
        }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
    console.log('Checking no results', parameters.noResultsXPath);
    return await context.evaluate(function(xp) {
        const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        console.log(xp, r);
        const e = r.iterateNext();
        console.log(e);
        return !e;
    }, parameters.noResultsXPath);
}

module.exports = {
    implements: 'product/search/execute',
    parameterValues: {
        country: 'FR',
        store: 'ubaldi',
        domain: 'ubaldi.com',
        url: 'https://www.ubaldi.com/recherche/{searchTerms}.php',
        loadedSelector: '#main-liste-articles',
        noResultsXPath: 'div.recherche-vide',
        zipcode: '',
    },
    implementation,
};