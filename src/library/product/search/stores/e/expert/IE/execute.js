
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'expert',
    domain: 'expert.ie',
    url: 'https://www.expert.ie/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.product-item-info',
    noResultsXPath: '//*[contains(text(), "no results")]',
    zipcode: '',
  },
};
