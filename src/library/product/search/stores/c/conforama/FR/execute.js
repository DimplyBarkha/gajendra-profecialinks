
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'conforama',
    domain: 'conforama.fr',
    url: 'https://www.conforama.fr/recherche-conforama/{searchTerms}',
    // loadedSelector: 'section[class="main-section"]',
    noResultsXPath: '//section[@class="main-section emptySearch"]',
    loadedSelector: 'section#contentSegment',
    zipcode: '',
  },
};
// https://www.conforama.fr/recherche-conforama/refrigerator?p=2
