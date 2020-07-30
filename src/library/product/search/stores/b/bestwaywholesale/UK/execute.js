module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'bestwaywholesale',
    domain: 'bestwaywholesale.co.uk',
    url: 'https://www.bestwaywholesale.co.uk',
    loadedSelector: '#shop-products',
    noResultsXPath: '//div[contains(@class,"no-search-results")]',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const clickPopup = async function (context) {
      const allowCookies = await context.evaluate((selector) => !!document.querySelector(selector), 'a.cc-primary-btn');

      if (allowCookies) {
        await context.click('a.cc-primary-btn');
      }

      const deliveryType = await context.evaluate((selector) => !!document.querySelector(selector), '#fulf-select-D');

      if (deliveryType) {
        await context.click('#fulf-select-D');
        await context.waitForNavigation();
      }
    };
    await dependencies.goto({ url: parameters.url });
    console.log('Execute--------------');
    // Hack : We are getting more number of results when searched with keyword on the webpage
    // rather than loading the direct search term url
    await context.waitForSelector('input.textinput');
    await context.evaluate(function (inputs) {
      document.querySelector('input.textinput').value = inputs.keywords;
    }, inputs);
    await context.clickAndWaitForNavigation('input.search', {}, { timeout: 30000 });
    await clickPopup(context);
    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
    console.log('Checking no results', parameters.noResultsXPath);
    return await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      console.log(e);
      return !e;
    }, parameters.noResultsXPath);
  },
};
