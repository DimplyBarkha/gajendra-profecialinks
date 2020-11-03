async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    let { url, id, zipcode, storeId } = inputs;
    if (!url) {
        if (!id) {
            throw new Error('no id provided');
        }
        url = await dependencies.createUrl({ id });
    }
    await dependencies.goto({ url, zipcode, storeId });

    if (parameters.loadedSelector) {
        await context.waitForFunction(function(sel, xp) {
            return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
        }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }

    await context.waitForSelector('.product-image-link');
    const pageLink = await context.evaluate(() => document.querySelector('.product-image-link').getAttribute('href'));

    await context.goto(pageLink, {
        blockAds: false,
        loadAllResources: true,
        imagesEnabled: true,
        timeout: 100000,
        waitUntil: 'networkidle0',
    });
    await context.waitForSelector('.custom-product.is-small>div>div>div>a>img', { timeout: 100000 });
    await context.waitForSelector('.product-detail-description-text');
    await context.waitForSelector('.custom-product.is-small>div>div>div>a>img');
}
module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'AT',
        store: '0815',
        domain: '0815.at',
        loadedSelector: "div[class*='product-listing-wrapper']",
        noResultsXPath: '//h1[not(contains(.,"1 Produ"))]',
        zipcode: '',
    },
    implementation,
};