
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UA',
    store: 'pampik',
    domain: 'pampik.com',
    url: 'https://pampik.com/search?q={searchTerms}',
    loadedSelector: 'ul#products-list > li.listing__item',
    noResultsXPath: "//div[@class='l-search-empty']/h1",
    zipcode: '',
  },
};
