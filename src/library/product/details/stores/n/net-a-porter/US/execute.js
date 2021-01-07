
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'net-a-porter',
    domain: 'net-a-porter.com',
    loadedSelector: 'div[itemprop="mainEntity"]',
    noResultsXPath: '//div[contains(@class,"EmptyList")]',
    zipcode: '',
  },
};
