// module.exports = {
//   implements: 'product/search/execute',
//   parameterValues: {
//     country: 'CZ',
//     store: 'rohlik',
//     domain: 'rohlik.cz',
//     url: null,
//     loadedSelector: null,
//     noResultsXPath: null,
//     zipcode: '',
//   },
// };
async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    console.log('params', parameters);
    const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
    await dependencies.goto({ url, zipcode: inputs.zipcode });

    if (parameters.loadedSelector) {
        await context.waitForFunction(function(sel, xp) {
            return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
        }, { timeout: 50000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }

    // Apply scroll
    const applyScroll = async function(context) {
        await context.evaluate(async function() {
            let scrollTop = 0;
            while (scrollTop !== 40000) {
                const products = document.evaluate("//img[contains(@class,'productCard__img')]", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                const productsCount = products.snapshotLength;
                console.log('Length: ' + productsCount);
                await stall(1000);
                scrollTop += 1000;
                window.scroll(0, scrollTop);
                if (scrollTop === 40000 || productsCount > 160) {
                    await stall(5000);
                    break;
                }
            }

            function stall(ms) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                    }, ms);
                });
            }
        });
    };

    await applyScroll(context);

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
        country: 'CZ',
        store: 'rohlik',
        domain: 'rohlik.cz',
        url: 'https://www.rohlik.cz/hledat/{searchTerms}',
        loadedSelector: "img[class*='productCard__img']",
        noResultsXPath: '//div[@data-test="no-products-found"]/p',
        zipcode: '',
    },
    implementation,
};