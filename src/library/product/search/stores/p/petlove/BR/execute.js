module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'petlove',
    domain: 'petlove.com.br',
    url: 'https://www.petlove.com.br/busca?q={searchTerms}',
    loadedSelector: null, // 'div[id="catalog-desktop"]',
    noResultsXPath: null, // '//div[@class="container container--limited"]',
    zipcode: "''",
  },
};
