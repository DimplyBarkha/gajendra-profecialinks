
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'expert',
    domain: 'expertonline.it',
    url: 'https://www.expertonline.it/it-IT-it/Ricerca.aspx?ev0={searchTerms}',
    loadedSelector: 'div[class="skywalker_riga_nome"] h3',
    noResultsXPath: '//h1/*[contains(text(), "non ha dato risultati")]',
    zipcode: '',
  },
};
