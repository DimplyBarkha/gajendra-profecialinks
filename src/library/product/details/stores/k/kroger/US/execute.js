const implementation = async (
  inputs,
  parameters,
  context,
  dependencies,
) => {
  let { url, id, zipcode } = inputs;

  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode });

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
};

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    domain: 'kroger.com',
    // loadedSelector: 'div[data-qa="featured-product-tag"]', // 'div.ProductCard-promoContainer', the is the xpath of the featured tag in "you might also like section"
    loadedSelector: 'div[class*="ProductCard"][data-qa*="product-card"] div[data-qa*="cart-page-item-image"] img',
    noResultsXPath: "//p[@class='no-query-results heading-l font-medium mt-0'] | //span[contains(text(),'Please come back later')] | //*[not(ancestor::div[@id='product_similar'])]/h2[contains(text(),'currently no items to display')]",
  },
  implementation,
};
