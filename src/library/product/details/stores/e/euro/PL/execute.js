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
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('url in details2 -- execute js is :::::::::::::::::', url);
  // TODO: Check for not found?
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PL',
    store: 'euro',
    domain: 'euro.com.pl',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
