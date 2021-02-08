
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'zalando',
    domain: 'zalando.it',
    loadedSelector: "meta[content='product']",
    noResultsXPath: "//div[contains(@class, 'div.z-pathfinder-404')]",
    zipcode: '',
  },
  implementation,
};
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

  await context.evaluate(function () {
    const noResultsFound = Boolean(document.querySelector('div.z-pathfinder-404'));
    if (noResultsFound) {
      throw new Error('Product not found');
    }
  });
  return true;
  // if (parameters.loadedSelector) {
  //   await context.waitForFunction(function (sel, xp) {
  //     return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
  //   }, { timeout: 20000 }, parameters.loadedSelector, parameters.noResultsXPath);
  // }
}
