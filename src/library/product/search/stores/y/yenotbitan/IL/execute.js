
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IL',
    store: 'yenotbitan',
    domain: 'ybitan.co.il',
    url: 'https://www.ybitan.co.il/search/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="no-results-message"]/h5',
    zipcode: '',
  },
};
