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
  const productPageBtn = await context.evaluate(async () => {
    return document.querySelector('tr.pr div a');
  });
  if (productPageBtn) {
    await context.click('tr.pr div a');
    await context.waitForNavigation();
  };

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'booker',
    domain: 'booker.co.uk',
    loadedSelector: 'div#mainContent',
    noResultsXPath: '//div[@id="TempRegLeft"] | //div[@id="OHPLeft"]',
    zipcode: '',
  },
  implementation,
};
