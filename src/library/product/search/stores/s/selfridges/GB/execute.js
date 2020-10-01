
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'GB',
    store: 'selfridges',
    domain: 'selfridges.com',
    url: 'https://www.selfridges.com/GB/en/cat/dyson/',
    loadedSelector: 'body',
    noResultsXPath: '//div[@id="1640813798"]',
    zipcode: '',
  },
};
