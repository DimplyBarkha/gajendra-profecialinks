
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'beautybox',
    domain: 'beautybox.com.br',
    url: 'https://www.beautybox.com.br/busca?q={searchTerms}',
    loadedSelector: 'div.showcase-item[data-event]',
    noResultsXPath: '//div[contains(@class, "alert-message")]',
    zipcode: '',
  },
};
