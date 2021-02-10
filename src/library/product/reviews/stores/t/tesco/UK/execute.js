module.exports = {
    implements: 'product/reviews/execute',
    parameterValues: {
        country: 'UK',
        store: 'tesco',
        domain: 'tesco.com',
        loadedSelector: 'div#review-data',
        noResultsXPath: '//h2[contains(.,"No reviews")] | //p[contains(.,"We’re really sorry")] | //section[contains(@class, "error-container")] | //div[contains(@class,"signin-register")] | //*[contains(.,"Quick and convenient shopping")]',
        reviewUrl: 'https://www.tesco.com/groceries/en-GB/products/{id}#review-data',
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

        await dependencies.goto({ url: destinationUrl, zipcode });

        if (sortButtonSelectors) {
            const selectors = sortButtonSelectors.split('|');
            for (const selector of selectors) {
                await context.click(selector);
            }
        }
        if (loadedSelector) {
            await context.waitForFunction((sel, xp) => {
                return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
            }, { timeout: 10000 }, loadedSelector, noResultsXPath);
        }

        console.log('Checking no results', noResultsXPath);
        return await context.evaluate((xp) => {
            const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            console.log(xp, r);
            const e = r.iterateNext();
            console.log(e);
            if (e) {
                throw new Error();
            }
            return !e;
        }, noResultsXPath);
    }
};