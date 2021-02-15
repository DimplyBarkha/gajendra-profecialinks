module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    domain: 'bol.com',
    loadedSelector: 'div#product-reviews',
    noResultsXPath: '//div[@data-test="non-deliverable"] | //div[@data-test="reviews-no-reviews"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
  implementation: async (
    { url, zipcode },
    { sortButtonSelectors, loadedSelector, noResultsXPath },
    context,
    dependencies,
  ) => {
    await dependencies.goto({ url, zipcode });

    if (sortButtonSelectors) {
      const selectors = sortButtonSelectors.split('|');
      for (const selector of selectors) {
        await context.click(selector);
      }
    }
    if (loadedSelector) {
      try {
        await context.waitForFunction(
          (sel, xp) => {
            return Boolean(
              document.querySelector(sel) ||
                document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(),
            );
          },
          { timeout: 10000 },
          loadedSelector,
          noResultsXPath,
        );
      } catch (err) {
        console.log('Checking if the input URL was not leading to the search results page');
        const productUrl = await context.evaluate(async () => {
          const productElem = document.querySelector('ul[data-test="products"] > li a.product-title');
          return productElem ? productElem.href : null;
        });
        if (productUrl) {
          console.log('Input URL leading to search results page. Going to a product page');
          await dependencies.goto({ url: productUrl, zipcode });
          await context.waitForFunction(
            (sel, xp) => {
              return Boolean(
                document.querySelector(sel) ||
                  document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(),
              );
            },
            { timeout: 10000 },
            loadedSelector,
            noResultsXPath,
          );
        }
      }
    }

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
