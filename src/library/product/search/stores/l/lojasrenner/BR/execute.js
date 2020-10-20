
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'lojasrenner',
    domain: 'lojasrenner.com.br',
    url: 'https://www.lojasrenner.com.br/b?Ntt={searchTerms}',
    loadedSelector: 'div[class="wrapper results-list"]',
    noResultsXPath: '//div[contains(@class , "no_result")]',
    zipcode: '',
  },
};
