
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UA',
    store: 'comfy',
    domain: 'comfy.ua',
    url: 'https://comfy.ua/catalogsearch/result?search_provider=anyquery&strategy=vectors_extended,zero_queries&q={searchTerms}',
    loadedSelector: 'div.js-products-list-wrap',
    noResultsXPath: '//div[@class="search-top"]',
    zipcode: '',
  },
};
