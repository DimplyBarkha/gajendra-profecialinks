
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'cobasi',
    domain: 'cobasi.com',
    url: "https://busca.cobasi.com.br/busca?q={searchTerms}",
    loadedSelector: null,
    noResultsXPath: '//div[@class="nm-not-found-message"]//h3',
    zipcode: '',
  },
};
