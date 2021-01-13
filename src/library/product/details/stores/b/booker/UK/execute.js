const implementation = async (inputs, { loadedSelector, noResultsXPath }, context, dependencies) => {
  const { url, id } = inputs;
  let builtUrl;
  if (!url) {
    if (!id) throw new Error('No id provided');
    else builtUrl = await dependencies.createUrl(inputs);
  }
  await dependencies.goto({ ...inputs, url: builtUrl || url });

  if (loadedSelector) {
    await context.waitForFunction(
      (selector, xpath) => {
        return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
      },
      { timeout: 10000 },
      loadedSelector,
      noResultsXPath,
    );
    const productPageSelector = await context.evaluate(
      async () => document.querySelector('div.resultTable td.info div.info_r1>div>a'),
    );
    if (productPageSelector) {
      await context.click('div.resultTable td.info div.info_r1>div>a');
      await context.waitForSelector('div#mainContent');
    } else return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
  }
  return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
};

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'booker',
    domain: 'booker.co.uk',
    loadedSelector: 'td.siteContent',
    noResultsXPath: '//div[@id="filters"]//h2[contains(text(), "0 Results")] | //div[@id="TempRegLeft"] | //div[@id="OHPLeft"] | //div[@class="YourBookerLeft"]',
    zipcode: '',
  },
  implementation,
};
