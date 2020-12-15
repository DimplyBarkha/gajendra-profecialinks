
async function implementation (
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
    }, { timeout: 60000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  // TODO: Check for not found?
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles',
    domain: 'elcorteingles.es',
    loadedSelector: '.pdp-title a',
    noResultsXPath: '//div[contains(@class,"artwork-toolbar ")]',
    // loadedSelector: 'img[class="js-zoom-to-modal-image"]',
    // noResultsXPath: '//span[contains(.,"No hemos")]',
  },
  implementation,
};
