
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'ChemistWarehouse_Mweb',
    domain: 'chemistwarehouse.com.au',
    url: 'https://www.chemistwarehouse.com.au/search?searchtext={searchTerms}&fh=1',
    loadedSelector: 'div.search__result__product__list',
    noResultsXPath: '//div[@class="search__result__products-no-result"]',
    zipcode: '',
  },
};
