
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_electronica',
    domain: 'elcorteingles.es',
    loadedSelector: null,
    noResultsXPath: "//article[contains(@class, 'msg')]//*[contains(@class, 'explain')]",
    zipcode: '',
  },
  IMPLEMENTATION : async function implementation (
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
      }, { timeout: 30000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
  
    // TODO: Check for not found?
  }
};
