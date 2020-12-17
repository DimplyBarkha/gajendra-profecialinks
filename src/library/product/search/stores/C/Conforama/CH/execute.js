
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'Conforama',
    domain: 'Conforama.ch',
    url: 'https://www.conforama.ch/fr/recherche-conforama/{searchTerms}',
    loadedSelector: 'article.box-product',
    noResultsXPath: '//section[contains(@class,"emptySearch")]',
    zipcode: '',
  },
};
