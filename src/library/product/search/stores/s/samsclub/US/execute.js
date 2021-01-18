
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    domain: 'samsclub.com',
    url: 'https://samsclub.com/s/{searchTerms}',
    loadedSelector: 'div[class="sc-image-wrapper"] > img',
    noResultsXPath: '//div[@class="sc-error-page-title"]',
  },
};
