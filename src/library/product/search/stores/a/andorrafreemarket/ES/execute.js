
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'andorrafreemarket',
    domain: 'andorrafreemarket.com',
    url: 'https://andorrafreemarket.com/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div[class="category-products"]',
    noResultsXPath: '//p[contains(@class,"empty-catalog")]',
    zipcode: '',
  },
}; 
