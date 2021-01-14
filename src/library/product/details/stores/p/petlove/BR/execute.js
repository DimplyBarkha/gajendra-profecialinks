module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'petlove',
    domain: 'petlove.com.br',
    loadedSelector: null,
    noResultsXPath: '//div[@class="empty-page"]',
    zipcode: '',
  },
  implementation: async (inputs, { loadedSelector, noResultsXPath }, context, dependencies) => {
    const { url, id } = inputs;
    let builtUrl;
    if (!url) {
      if (!id) throw new Error('No id provided');
      else builtUrl = await dependencies.createUrl(inputs);
    }
    if (!builtUrl) return;
    await dependencies.goto({ ...inputs, url: builtUrl || url });

    if (loadedSelector) {
      await context.waitForFunction(
        (selector, xpath) => {
          return !!(
            document.querySelector(selector) ||
            document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue
          );
        },
        { timeout: 10000 },
        loadedSelector,
        noResultsXPath,
      );
    }
    return await context.evaluate(
      (xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue,
      noResultsXPath,
    );
  },
};
