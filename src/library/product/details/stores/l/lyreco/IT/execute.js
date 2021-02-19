module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'lyreco',
    domain: 'lyreco.it',
    loadedSelector: 'div[class*="product-container"]',
    noResultsXPath: '//*[contains(@class,"DidYouMeanPoint")]',
    zipcode: '',
  },
  implementation: async (inputs, { loadedSelector, noResultsXPath }, context, dependencies) => {
    const { url, id } = inputs;
    let builtUrl;
    if (!url) {
      if (!id) throw new Error('No id provided');
      else builtUrl = await dependencies.createUrl(inputs);
      if (!builtUrl) return false; // graceful exit when not able to create a url
    }

    await dependencies.goto({ ...inputs, url: builtUrl || url });

    if (loadedSelector) {
      await context.waitForFunction(
        (selector, xpath) => {
          return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
        }, { timeout: 10000 },
        loadedSelector,
        noResultsXPath,
      );
    }
    if (await context.evaluate(() => document.evaluate('//*[contains(@class,"DidYouMeanPoint")] ', document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue)) {
      return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
    } else {
      console.log('div[id*="' + inputs.id + '"] a[id*="roduct"]');
      const newUrl = await context.evaluate((inputs) => { return document.querySelector('div[id*="' + inputs.id + '"] a[id*="roduct"]').getAttribute('href'); }, inputs);
      await dependencies.goto({ ...inputs, url: newUrl });
      await context.waitForFunction(() => !!document.querySelector('div[class="product__info"]'));
      return true;
    }
  },
};
