
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'supervalu',
    domain: 'supervalu.ie',
    url: 'https://shop.supervalu.ie/shopping/search/allaisles?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="no-search-result"]/p',
    zipcode: '',
  },
};
