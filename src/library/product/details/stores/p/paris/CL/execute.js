
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CL',
    store: 'paris',
    domain: 'paris.cl',
    loadedSelector: 'div.product-primary-image img.primary-image',
    noResultsXPath: '//p[@class="not-found-search"]',
    zipcode: '',
  },
  implementation: async function implementation (
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
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
    let pageHasLoaded = false;
    pageHasLoaded = await context.evaluate(async (loadedSelector) => {
      console.log('loadedSelector', loadedSelector);
      let elm = document.querySelectorAll(loadedSelector);
      if(elm && elm.length > 0) {
        return true;
      }
      return false;
    }, parameters.loadedSelector);
    if(pageHasLoaded) {
      return pageHasLoaded;
    }

    let noResultsPage = false;
    noResultsPage = await context.evaluate(async (noResultsXPath) => {
      console.log('noResultsXPath', noResultsXPath);
      let elm = document.evaluate(noResultsXPath, document, null, 7, null);
      if(elm && elm.snapshotLength > 0) {
        return true;
      }
      return false;
    }, parameters.noResultsXPath);
    if(noResultsPage) {
      return false;
    }
    // TODO: Check for not found?

  },
};
