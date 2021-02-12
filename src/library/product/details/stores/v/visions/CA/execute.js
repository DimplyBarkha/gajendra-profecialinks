
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'visions',
    domain: 'visions.ca',
    loadedSelector: "div[id='productimg-box'] img",
    noResultsXPath: "//h1[contains(.,'Server Error')] | //div[contains(@id,'iconcate-container')]",
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
      try {
        await context.waitForFunction(function (sel, xp) {
          return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
        }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
      } catch(err) {
        console.log('got some error', err.message);
      }
    }

    if(parameters.noResultsXPath) {
      console.log('need to check parameters.noResultsXPath', parameters.noResultsXPath);
      let noResultsPage = await context.evaluate(async (noResultsXPath) => {
        let elm = document.evaluate(noResultsXPath, document, null, 7, null);
        if(elm && elm.snapshotLength > 0) {
          return true;
        }
        return false;
      }, parameters.noResultsXPath)

      if(noResultsPage) {
        return false;
      } else {
        return true;
      }
    }
  
    // TODO: Check for not found?
  },
};
