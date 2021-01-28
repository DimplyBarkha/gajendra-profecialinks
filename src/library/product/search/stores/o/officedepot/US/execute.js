module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'officedepot',
    domain: 'officedepot.com',
    url: 'https://www.officedepot.com/catalog/search.do?Ntt={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="h3 brandColor_tp2 section no_result_break"] | //h1[contains(.,"We are sorry")]',
    zipcode: '',
  },
};
