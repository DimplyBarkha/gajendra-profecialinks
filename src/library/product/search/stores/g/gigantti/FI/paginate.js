
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FI',
    store: 'gigantti',
    nextLinkSelector: null,
    loadedSelector: 'div.product-list-container > div.mini-product-list',
    noResultsXPath: '//section[contains(@class, "no-search-result")]',
    domain: 'gigantti.fi',
    zipcode: '',
  },
  /* implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { keywords, page, offset } = inputs;
    const { nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, spinnerSelector, openSearchDefinition } = parameters;

    const scroll = async function (context) {
      await context.evaluate( function () {
        let scrollTop = 0;
        let recordCount = 0;
        while (scrollTop !== 20000) {
          recordCount = keepScrolling(recordCount, 150);
          if(recordCount > 0){
          scrollTop += 10000;
          window.parent.scroll(0, scrollTop);
          }
          else break;
          if (scrollTop === 20000) {
            break;
          }  
        }
        function keepScrolling (recordsCollected, maxRecords) {
          const recordSelector ='div.col-mini-product';
          const recordsOnPage = 
             document.querySelectorAll(recordSelector).length;
             
          console.log(recordsOnPage);
          //if(recordsOnPage == recordsCollected) return -1;
          if(recordsOnPage < maxRecords) return recordsOnPage;
          return -1;
        }
      });
    };
    await scroll(context);
    if (loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, loadedSelector, noResultsXPath);
    }
    console.log('Checking no results', noResultsXPath);
    return await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      console.log(e);
      return !e;
    }, noResultsXPath);
  } */
};
