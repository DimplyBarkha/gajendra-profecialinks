
async function implementation(
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
  const request = await context.searchAllRequests('https://api.intermarche.com/produits/v2/pdvs/02111/produits/*');
  console.log(`Request: ${request}`);
  if (request && request[0]) {
    if (request[0].status == 404) {
      console.log('Page not found')
      return false;
    }
  }
  try {
    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 60000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
  }
  catch (exception) {
    console.log('Page not loaded')
  } 
}


module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'intermarche',
    domain: 'intermarche.com',
    loadedSelector: 'div[class*="ProductV2__ProductWrapper"]',
    noResultsXPath: '',
    zipcode: '',
  },
  implementation
};
