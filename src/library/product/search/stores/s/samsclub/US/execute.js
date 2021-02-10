
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    domain: 'samsclub.com',
    url: 'https://samsclub.com/s/{searchTerms}',
    loadedSelector: 'div.sc-plp-layout',
    noResultsXPath: '//div[@class="sc-error-page-title"]',
  },
};
