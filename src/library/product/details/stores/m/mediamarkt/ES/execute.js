
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'mediamarkt',
    domain: 'mediamarkt.es',
    loadedSelector: '.preview img',
    noResultsXPath: '//div[@id="search_no_result-bottom_right"]',
    zipcode: '',
  },
};
