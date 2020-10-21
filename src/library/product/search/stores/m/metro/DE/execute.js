async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    console.log('params', parameters);
    const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
    await dependencies.goto({ url, zipcode: inputs.zipcode });
    // Check if accept cookies dialog pops up
    const doesAcceptCookiesBtnExists = await context.evaluate(function() {
        return Boolean(document.querySelector("cms-cookie-disclaimer") && document.querySelector("cms-cookie-disclaimer").shadowRoot.querySelector("button.field-accept-button-name"));
    });

    if (doesAcceptCookiesBtnExists) {
        console.log('Clicking on accept cookies btn');
        await context.click('button.field-accept-button-name');
        await context.waitForNavigation();
    }

    if (parameters.loadedSelector) {
        await context.waitForFunction(function(sel, xp) {
            return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
        }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }

    // Apply scroll
    const applyScroll = async function(context) {
        await context.evaluate(async function() {
            let scrollTop = 0;
            while (scrollTop !== 20000) {
                // Check if load more exists
                const doesLoadMoreExists = document.querySelector('i.icon-plus.icon-lg');

                if (doesLoadMoreExists) {
                    console.log('Clicking on load more btn');
                    // @ts-ignore
                    document.querySelector('i.icon-plus.icon-lg').click();
                    await stall(10000);
                } else {
                    console.log('load more btn is not present - ' + doesLoadMoreExists);
                    break;
                }

                const products = document.evaluate('//div[@class="well-sm well"]//div[@class="mfcss_card-article-2--container-flex"]//img[@class="img-responsive"]', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                const productsCount = products.snapshotLength;
                scrollTop += 1000;
                window.scroll(0, scrollTop);
                if (scrollTop === 20000 || productsCount > 160) {
                    await stall(10000);
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
        country: 'DE',
        store: 'metro',
        domain: 'metro.de',
        url: 'https://produkte.metro.de/shop/search?q={searchTerms}',
        loadedSelector: '.img-responsive',
        noResultsXPath: '//div[@class="ex-search-header"]',
        zipcode: '',
    },
    implementation,
};