const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { maxPages } = inputs;
  const { transform, urlTemplate, resultsCountSelector, regExpForIdFromUrl } = parameters;
  const { productDetails, Helpers: { Helpers } } = dependencies;
  const helper = new Helpers(context);

  const resultsCount = await context.evaluate((resultsCountSelector) => {
    return document.querySelector(resultsCountSelector).textContent.match(/\d+/g).join('');
  }, resultsCountSelector);

  const numberResultPerPage = 120;

  const totalPages = Number(resultsCount) / Number(numberResultPerPage);

  const currentUrl = await context.evaluate(() => {
    return window.location.href;
  });

  const itemId = regExpForIdFromUrl ? String(currentUrl).match(regExpForIdFromUrl)[0] : '';

  const urlArray = [];

  for (let i = 1; i <= (Number(maxPages) + 1 || Math.ceil(totalPages) + 1); i++) {
    urlArray.push(urlTemplate
      .replace('{id}', itemId)
      .replace('{page}', i));
  }

  await helper.addArrayToDocument('my-urls', urlArray);
  await helper.addItemToDocument('my-results-count', resultsCount);

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/listing/extract',
  parameterValues: {
    country: 'US',
    store: 'neimanmarcus',
    urlTemplate: '{id}?page={page}',
    resultsCountSelector: 'div.product-list__header__items,span#numItems',
    /* eslint-disable */
    regExpForIdFromUrl: '(?<=com\/).*$',
    /* eslint-enable */
    transform,
    zipcode: '',
    domain: 'neimanmarcus.com',
  },
  implementation,
};
