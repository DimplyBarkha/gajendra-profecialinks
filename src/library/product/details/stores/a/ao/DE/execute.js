
const implementation = async ({ url, id, zipcode, storeId }, { loadedSelector, noResultsXPath }, context, dependencies) => {
  if (!url) {
    if (!id) throw new Error('No id provided');
    else url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId });

  if (loadedSelector) {
    await context.waitForFunction(
      (selector, xpath) => {
        return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
      },
      { timeout: 10000 },
      loadedSelector,
      noResultsXPath,
    );
  }

  // Check if we are on results page
  const productLink = await context.evaluate(function () {
    const ele = document.evaluate('(//div[@data-testid=\'product-card-list-view\']//a[@itemprop=\'url\'])[1]', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
    if (!ele) {
      return false;
    }
    return ele.href;
  });

  if (productLink) {
    await dependencies.goto({ url: productLink, zipcode, storeId });
    if (loadedSelector) {
      await context.waitForFunction(
        (selector, xpath) => {
          return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
        },
        { timeout: 10000 },
        loadedSelector,
        noResultsXPath,
      );
    }
  }
  return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
};

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'ao',
    domain: 'ao.de',
    loadedSelector: '.productInformation, section[data-tag-section="lister product list"]',
    noResultsXPath: '//h1[contains(text(), "Diese Seite existiert leider nicht") or contains(text(), "Oh nein – Wir konnten leider nichts zu")]',
    zipcode: '',
  },
  implementation,
};