module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'petlove',
    domain: 'petlove.com.br',
    url: 'https://www.petlove.com.br/busca?q={searchTerms}',
    loadedSelector: 'div[id="catalog-desktop"]',
    noResultsXPath: '//div[@class="container container--limited"]',
    zipcode: "''",
  },
};
