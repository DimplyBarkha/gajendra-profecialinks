
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IL',
    store: 'victoryonline',
    domain: 'victoryonline.co.il',
    loadedSelector: 'div.ShoppingLayout',
    noResultsXPath: "//div[@id='ListTextContent']",
    zipcode: '',
  },
  implementation: async (inputs, { loadedSelector, noResultsXPath }, context, dependencies) => {
    const { url, id } = inputs;
    let builtUrl;
    if (!url) {
      if (!id) throw new Error('No id provided');
      else builtUrl = await dependencies.createUrl(inputs);
    }

    await dependencies.goto({ ...inputs, url: builtUrl || url });
    context.goto(url, {
      firstRequestTimeout: 60000,
      timeout: 60000,
      waitUntil: 'load',
      checkBlocked: false,
    });

    await context.waitForNavigation();
    const currentUrl = await context.evaluate(async () => {
      return window.location.href;
    });
    if (currentUrl.includes('FindProducts')) {
      const newUrl = await context.evaluate(() => {
        return document.evaluate('//li[@id="NgMspProductCell"]//h3[@class="Name"]/a/@href', document, null, XPathResult.STRING_TYPE, null).stringValue;
      });
      if (newUrl) {
        await context.goto(newUrl, {
          firstRequestTimeout: 60000,
          timeout: 60000,
          waitUntil: 'load',
          checkBlocked: false,
        });
        await context.waitForNavigation();
      }
    }
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
