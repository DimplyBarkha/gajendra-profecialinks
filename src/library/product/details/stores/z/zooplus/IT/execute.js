
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'zooplus',
    domain: 'zooplus.it',
    loadedSelector: '*[class*="producttitle"]',
    noResultsXPath: '//*[contains(@class,"pagetitle__info exo-noResults")][not(//*[contains(@id,"exo-result-list")]//*[contains(@class,"exo-result")])]',
    zipcode: '',
  },
  implementation: async (inputs, { loadedSelector, noResultsXPath }, context, dependencies) => {
    const { url, id } = inputs;
    let builtUrl;
    if (!url) {
      if (!id) throw new Error('No id provided');
      else builtUrl = await dependencies.createUrl(inputs);
      if (!builtUrl) return false; // graceful exit when not able to create a url
    }
  
    await dependencies.goto({ ...inputs, url: builtUrl || url });
  
    // if (loadedSelector) {
    //   await context.waitForFunction(
    //     (selector, xpath) => {
    //       return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
    //     },
    //     { timeout: 30000 },
    //     loadedSelector,
    //     noResultsXPath,
    //   );
    // }
    let pageHasResults = false;
    console.log('loadedSelector', loadedSelector);
    if(loadedSelector) {
      try {
        await context.waitForSelector(loadedSelector);
      } catch(err) {
        console.log('got some error while waiting for loadedselector', err.message);
      }
      pageHasResults = await context.evaluate(async (loadedSelector) => {
        console.log('need to check', loadedSelector);
        let elm = document.querySelectorAll(loadedSelector);
        if(elm && elm.length > 0) {
          return true;
        }
        return false;
      }, loadedSelector);
    }

    if(pageHasResults) {
      return pageHasResults;
    }

    if(noResultsXPath) {
      pageHasResults = await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
    }
    return pageHasResults;
  }
};
