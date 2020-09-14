/**
 *
 * @param { { keywords: string, zipcode: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    console.log('params', parameters);
    let url;
    if (inputs.keywords) {
        if (inputs.keywords.toLowerCase() == 'dyson') {
            url = parameters.url.replace('{searchTerms}', '`dyson`');
        } else {
            url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
        }
    }
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
        country: 'AU',
        store: 'thegoodguys',
        domain: 'thegoodguys.com.au',
        url: 'https://www.thegoodguys.com.au/SearchDisplay?categoryId=&storeId=900&catalogId=30000&langId=-1&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&searchSource=Q&pageView=&beginIndex=0&orderBy=0&pageSize=60&searchTerm={searchTerms}',
        loadedSelector: '#product_listing_tab ul>li:last-child',
        noResultsXPath: '//*[contains(@class,"results_description")]',
        zipcode: '',
    },
    implementation,
};