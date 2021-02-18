
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
    if (!id) {
      if (!url) {
        throw new Error('No id/url provided');
      } else {
        url = await dependencies.createUrl({ id: url });
      }
    } else url = await dependencies.createUrl({ id });
    await dependencies.goto({ url, zipcode, storeId });

    await context.evaluate(async (zipcode) => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
        return newDiv;
      }

      const store = document.querySelector('span.jum-homestore-selected') ? document.querySelector('span.jum-homestore-selected').textContent : '';
      addHiddenDiv('retailerName', store);
      addHiddenDiv('drive', zipcode);
    }, zipcode);

    if (loadedSelector) {
      await context.waitForFunction(
        (selector, xpath) => {
          return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
        },
        { timeout: 25000 },
        loadedSelector,
        noResultsXPath,
      );
    }

    return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
  },
};
