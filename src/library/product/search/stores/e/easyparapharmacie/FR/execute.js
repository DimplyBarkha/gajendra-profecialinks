// @ts-nocheck
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'easyparapharmacie',
    domain: 'easyparapharmacie.com',
    url: 'https://www.easyparapharmacie.com/catalogsearch/result/index/?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation: async (inputs, { url, loadedSelector, noResultsXPath }, context, dependencies) => {
    const { keywords, results } = inputs;
    const destinationUrl = url.replace('{searchTerms}', encodeURIComponent(keywords));
    await dependencies.goto({ ...inputs, url: destinationUrl });

    await context.evaluate(async (results) => {
      const waitForResults = async (prevResultsNum) => {
        let resultsNum = document.querySelectorAll('div.product-container').length;
        let iteration = 0;
        while (prevResultsNum === resultsNum && iteration < 10) {
          console.log(`Prev results: ${prevResultsNum}`);
          console.log(`Results now: ${resultsNum}`);
          await new Promise((resolve) => setTimeout(resolve, 500));
          resultsNum = document.querySelectorAll('div.product-container').length;
          iteration++;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      };

      let buttonShowMore = document.querySelector('.ais-infinite-hits--showmore').children[0];
      if (buttonShowMore) {
        let totalProducts = document.querySelectorAll('div.product-container').length;
        while (totalProducts < results && !buttonShowMore.disabled) {
          buttonShowMore.click();
          await waitForResults(totalProducts);
          totalProducts = document.querySelectorAll('div.product-container').length;
          buttonShowMore = document.querySelector('.ais-infinite-hits--showmore').children[0];
        }
      }
    }, results || 150);

    if (loadedSelector) {
      await context.waitForFunction(
        function (sel, xp) {
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
