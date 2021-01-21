const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { maxPages } = inputs;
  const { transform, urlTemplate, resultsCountSelector, numberResultPerPageXPath, regExpForIdFromUrl } = parameters;
  const { productDetails, Helpers: { Helpers } } = dependencies;
  const helper = new Helpers(context);

  const resultsCount = await context.evaluate((resultsCountSelector) => {
    return document.querySelector(resultsCountSelector).textContent
      .replace(',', '')
      .replace(')', '')
      .replace('(', '');
  }, resultsCountSelector);

  const numberResultPerPage = await context.evaluate((numberResultPerPageXPath) => {
    return document.evaluate(numberResultPerPageXPath, document, null, XPathResult.NUMBER_TYPE, null).numberValue;
  }, numberResultPerPageXPath);

  const totalPages = Number(resultsCount) / (Number(numberResultPerPage) - 1);
  console.log(`totalPages:${totalPages}`);

  const currentUrl = await context.evaluate(() => {
    return window.location.href;
  });

  const itemId = regExpForIdFromUrl ? String(currentUrl).match(regExpForIdFromUrl)[0] : '';

  const urlArray = [];

  for (let i = 0; i < (Number(maxPages) + 1 || Math.ceil(totalPages)); i++) {
    urlArray.push(urlTemplate
      .replace('{id}', itemId)
      .replace('{page}', i + 1));
  }

  await helper.addArrayToDocument('my-urls', urlArray);
  await helper.addItemToDocument('my-results-count', resultsCount);

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/listing/extract',
  parameterValues: {
    country: 'US',
    store: 'njoy',
    urlTemplate: 'https://shop.njoy.com/shop/{id}?yoReviewsPage={page}',
    resultsCountSelector: 'div.yotpo-nav-wrapper span[class*="nav-tab-sum"]',
    numberResultPerPageXPath: 'count(//div[@class="yotpo-review-wrapper"])',
    /* eslint-disable */
    regExpForIdFromUrl: '(?<=shop\/).*$',
    /* eslint-enable */
    transform,
    domain: 'shop.njoy.com',
    zipcode: '',
  },
  implementation,
};
