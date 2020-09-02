async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { keywords, page, offset } = inputs;
    const { nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, spinnerSelector, openSearchDefinition } = parameters;
    const { pager } = dependencies;

    const success = await pager({ keywords, nextLinkSelector, loadedSelector, mutationSelector, spinnerSelector });
    if (success) {
        return true;
    }

    let url = await context.evaluate(function() {
        /** @type { HTMLLinkElement } */
        const next = document.querySelector('head link[rel="next"]');
        if (!next) {
            return false;
        }
        return next.href;
    });

    if (!url) {
        return false;
    }

    console.log('Going to url', url);
    await dependencies.goto({ url });
    if (loadedSelector) {

        await context.waitForSelector('#scroll_loading_point_up');
        console.log("Removing");
        await context.evaluate(() => {
            document.getElementById('scroll_loading_point_up').remove();
        })
        await context.waitForFunction(function(sel, xp) {
            return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
        }, { timeout: 10000 }, loadedSelector, noResultsXPath);
    }

    console.log('Checking no results', noResultsXPath);
    return await context.evaluate(function(xp) {
        const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        console.log(xp, r);
        const e = r.iterateNext();
        console.log(e);
        return !e;
    }, noResultsXPath);
}
module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'FR',
        store: 'ubaldi',
        nextLinkSelector: null,
        mutationSelector: null,
        spinnerSelector: null,
        loadedSelector: null,
        noResultsXPath: '//div[@class="recherche-vide"]',
        openSearchDefinition: null,
        domain: 'ubaldi.com',
        zipcode: '',
    },

};