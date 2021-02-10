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
      { timeout: 20000 },
      loadedSelector,
      noResultsXPath,
    );
    const productPageSelector = await context.evaluate(async () => {
      return document.querySelector('div.product-list div.product-name-priceMarked>p:first-child.product-name');
    });
    if (productPageSelector) {
      await context.click('div.product-list div.product-name-priceMarked>p:first-child.product-name');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await context.waitForSelector('main#product_detail');
    }
  }
  return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
};

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'booker',
    domain: 'booker.co.uk',
    loadedSelector: 'main.container-fluid, div.mainSubcategories',
    // noResultsXPath: '//div[@id="filters"]//h2[contains(text(), "0 Results")] | //div[@id="TempRegLeft"] | //div[@id="OHPLeft"] | //div[@class="YourBookerLeft"] | //h1[contains(text(),"The website is undergoing essential maintenance")] | //h1[contains(text(),"Sorry, this page does not exist")]',
    noResultsXPath: '//p[contains(text(),"search returned no results")] | //h1[contains(text(),"The website is undergoing essential maintenance")] | //h1[contains(text(),"Sorry, this page does not exist")] | //div[contains(@class,"product-list rowUnGrouped")][not(//div[contains(@class,"product-model")])]',
    zipcode: '',
  },
  implementation,
};
