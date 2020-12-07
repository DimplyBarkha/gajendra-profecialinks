module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ZA',
    store: 'dis-chem',
    domain: 'dischem.co.za',
    loadedSelector: '.product-image-photo',
    noResultsXPath: null,
    zipcode: '',
  },
  implementation: async ({ url, id, zipcode, storeId }, { loadedSelector, noResultsXPath }, context, dependencies) => {
    if (!url) {
      if (!id) throw new Error('No id provided');
      else url = await dependencies.createUrl({ id });
    }
    await dependencies.goto({ url, zipcode, storeId });

    if (id) {
      await context.waitForSelector('li[class="item product product-item"] img');
      const selectedUrl = await context.evaluate(async (id) => {
        const selected = document.querySelector('li[class="item product product-item"] a:nth-child(2)');
        if (selected) {
          if (parseInt(selected.getAttribute('data-sku')).toString() === id) {
            return selected.getAttribute('href');
          } else {
            document.body.setAttribute('loaded', 'false');
          }
        } else {
          return null;
        }
      }, id.toString());
      if (selectedUrl) {
        await context.goto(selectedUrl, {
          block_ads: false,
          load_all_resources: true,
          images_enabled: true,
          timeout: 50000,
          waitUntil: 'load',
        });
      } else {
        return false;
      }
    }

    if (loadedSelector) {
      await context.waitForFunction(
        (selector, xpath) => {
          return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
        }, { timeout: 10000 },
        loadedSelector,
        noResultsXPath,
      );
    }
    return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
  },
};
