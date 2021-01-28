
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'chemistWarehouse_Mweb',
    domain: 'chemistwarehouse.com.au',
    url: 'https://www.chemistwarehouse.com.au/search?searchtext={searchTerms}&fh=1',
    loadedSelector: 'div.search__result__product__list, div.category-product-grid',
    noResultsXPath: '//div[contains(@class,"search-results-category-list--empty")]',
    zipcode: '',
  },
};
