
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'foodlion_28147',
    domain: 'foodlion.com',
    url: 'https://shop.foodlion.com/search?search_term={searchTerms}',
    loadedSelector: 'ol[class*=cell-container] div[class*="cell-image-wrapper"]',
    noResultsXPath: '//div[contains(text(),"No results found for")]',
    zipcode: '28147',
  },
};
