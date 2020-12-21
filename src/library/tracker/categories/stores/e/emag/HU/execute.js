
module.exports = {
  implements: 'tracker/categories/execute',
  parameterValues: {
    country: 'HU',
    store: 'emag',
    domain: 'emag.hu',
    loadedSelector: 'ul.megamenu-list',
    noResultsXPath: null,
    zipcode: '',
  },
  implementation: async (inputs, { loadedSelector, noResultsXPath }, context, dependencies) => {
    const { url } = inputs;
    const builtUrl = url || await dependencies.createUrl(inputs);
    await context.setViewPort({ height: 800, width: 800 });
    await dependencies.goto({ ...inputs, url: builtUrl });

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
    return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
  },
};
