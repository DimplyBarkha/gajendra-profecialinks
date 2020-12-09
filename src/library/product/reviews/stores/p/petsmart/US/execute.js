module.exports = {
    implements: 'product/reviews/execute',
    parameterValues: {
        country: 'US',
        store: 'petsmart',
        domain: 'petsmart.com',
        loadedSelector: 'ol[class*="content-list-reviews"]',
        noResultsXPath: '//p[contains(@class,"showing-result-msg")]',
        reviewUrl: 'https://www.petsmart.com/search/?q={id}',
        sortButtonSelectors: 'div[data-bv-target="review"] button[role="menuitem"] | li[data-bv-dropdown-value="mostRecent"]',
        zipcode: '',
    },
    implementation: async function({ url, id, zipcode, date, days }, { reviewUrl, sortButtonSelectors, loadedSelector, noResultsXPath },
        context,
        dependencies,
    ) {
        const patternReplace = () => {
            if (!reviewUrl) throw new Error('No pattern provided to generate a valid URL');
            let tempUrl = reviewUrl;
            if (id) tempUrl = tempUrl.replace(/{id}/g, encodeURIComponent(id));
            if (date) tempUrl = tempUrl.replace(/{date}/g, encodeURIComponent(date));
            if (days) tempUrl = tempUrl.replace(/{days}/g, encodeURIComponent(days));
            return tempUrl;
        };
        const destinationUrl = url || patternReplace();

        await context.goto(destinationUrl, {
            block_ads: false,
            load_all_resources: true,
            images_enabled: true,
            timeout: 100000,
            waitUntil: 'load',
        });

        if (loadedSelector) {
            await context.waitForFunction((sel, xp) => {
                return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
            }, { timeout: 100000 }, loadedSelector, noResultsXPath);
        }


        if (sortButtonSelectors) {
            const selectors = sortButtonSelectors.split('|');
            for (const selector of selectors) {
                await context.click(selector);
            }
            await context.evaluate(async() => {
                document.body.setAttribute('url', window.location.href);

                function stall(ms) {
                    return new Promise((resolve, reject) => {
                        setTimeout(()  =>  {
                            resolve();
                        }, ms);
                    });
                }
                await stall(5000);

            });
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