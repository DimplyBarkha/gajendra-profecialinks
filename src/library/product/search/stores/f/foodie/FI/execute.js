module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FI',
    store: 'foodie',
    domain: 'foodie.fi',
    url: 'https://www.foodie.fi/products/search2?term={searchTerms}',
    loadedSelector: 'ul.products-shelf > li.item',
    noResultsXPath: '//h2[contains(@class,"category-header") and contains(text(),"0 tuotetta")]',
    zipcode: '',
  },
};
