const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform, urlTemplate, resultsCountSelector, numberResultPerPage, regExpForIdFromUrl } = parameters;
  const { productDetails, Helpers: { Helpers } } = dependencies;
  const helper = new Helpers(context);

  const resultsCount = await context.evaluate((resultsCountSelector) => {
    return document.querySelector(resultsCountSelector).textContent.replace(',', '');
  }, resultsCountSelector);

  const totalPages = Number(resultsCount) / numberResultPerPage;

  const currentUrl = await context.evaluate(() => {
    return window.location.href;
  });
  const urlArray = [currentUrl];

  const itemId = regExpForIdFromUrl ? String(currentUrl).match(regExpForIdFromUrl)[0] : '';

  for (let i = 1; i < totalPages; i++) {
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
    country: 'UK',
    store: 'reviews',
    urlTemplate: 'https://www.reviews.io/company-reviews/store/{id}/{page}',
    resultsCountSelector: 'span.statistics__totalReviews span:nth-child(2) strong',
    numberResultPerPage: 20,
    regExpForIdFromUrl: '([^\/]+$)',
    transform,
    domain: 'reviews.co.uk',
    zipcode: '',
  },
  implementation,
};
