
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    domain: 'jumbo.com',
    loadedSelector: 'div[data-testautomation="pdp-card"],body>section[class="jum-additional-info row"]',
    noResultsXPath: '//div[@class="jum-error-message"]',
    zipcode: '',
  },
  implementation: async ({ url, id, zipcode, storeId }, { loadedSelector, noResultsXPath }, context, dependencies) => {
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

    const isGeoButtonPresent = await context.evaluate(async () => {
      return document.querySelector('div[data-testautomation="navbar-store-finder"]') !== null;
    });
    if (isGeoButtonPresent) {
      await context.click('div[data-testautomation="navbar-store-finder"]');
      await context.waitForNavigation();
    }
    const store = await context.evaluate(async () => {
      return document.querySelector('div[data-testautomation="navbar-store-finder"] h6+span') ? document.querySelector('div[data-testautomation="navbar-store-finder"] h6+span').textContent : '';
    });

    await context.evaluate(async (store, zipcode) => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
        return newDiv;
      }

      addHiddenDiv('retailerName', store);
      addHiddenDiv('drive', zipcode);
    }, store, zipcode);

    return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
  },
};
