module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SA',
    store: 'noon',
    domain: 'noon.com',
    url: 'https://www.noon.com/uae-en/search?q={searchTerms}',
    loadedSelector: '.productContainer',
    noResultsXPath: '//div/p[contains(text(),"We couldn’t find what you were looking for")]',
    zipcode: "''",
  },
};
