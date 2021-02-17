module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'zalando',
    domain: 'zalando.de',
    loadedSelector: 'x-wrapper-re-1-5 button[id="picker-trigger"]',
    noResultsXPath: '//section[@lang="en"]/h1[contains(text(), "We couldn")]',
    zipcode: '',
  },
  implementation: async (inputs, { loadedSelector, noResultsXPath }, context, dependencies) => {
    const { url, id } = inputs;
    let builtUrl;
    if (!url) {
      if (!id) throw new Error('No id provided');
      else builtUrl = await dependencies.createUrl(inputs);
    }

    await context.setBlockAds(false);
    await context.setFirstRequestTimeout(90000);
    await context.setBypassCSP(true);
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
