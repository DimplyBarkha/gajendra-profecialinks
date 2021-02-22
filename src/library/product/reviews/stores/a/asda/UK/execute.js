
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'asda',
    domain: 'asda.com',
    loadedSelector: 'main.product-detail-page.layout__main',
    noResultsXPath: '//section[@class="layout__section page-not-found-layout__section"] | //div[@class="pdp-description-reviews__no-reviews"]',
    reviewUrl: 'https://groceries.asda.com/product/{id}',
    sortButtonSelectors: 'null',
    zipcode: "''",
  },
  implementation: async function (
    { id },
    { loadedSelector, noResultsXPath },
    context,
    dependencies,
  ) {
    const url = 'https://groceries.asda.com/product/{id}'.replace(
      '{id}',
      encodeURIComponent(id),
    );

    await context.goto(url);

    await context.waitForNavigation();

    if (loadedSelector) {
      await context.waitForFunction((sel, xp) => {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, loadedSelector, noResultsXPath);
    }

    // clicking in reviews section if there are results

    await new Promise((resolve) => setTimeout(resolve, 3000));

    await context.evaluate(() => {
      const reviewsSection = document.querySelector('button[data-auto-id="tab-1"]');

      if (reviewsSection !== null) {
        // @ts-ignore
        reviewsSection.click();
      }
    });

    // waiting for noResultXpath if exists

    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log('Checking no results', noResultsXPath);
    return await context.evaluate((xp) => {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      console.log(e);
      return !e;
    }, noResultsXPath);
  },
};
