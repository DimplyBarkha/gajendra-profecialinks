
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'viking',
    domain: 'viking-direct.co.uk',
    loadedSelector: 'main#siteContent',
    noResultsXPath: '//div[@id="searchEmpty"] | //ol[@class="search-results__results"]',
    zipcode: '',
  },
};
