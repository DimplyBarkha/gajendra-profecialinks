
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'farmae',
    domain: 'farmae.it',
    url: 'https://www.farmae.it/catalogsearch/result/?cat=0&q={searchTerms}',
    loadedSelector: 'ul.products-grid',
    noResultsXPath: '//p[@class="note-msg" and contains(.,"Non ci sono prodotti corrispondenti alla selezione")]',
    zipcode: '',
  },
};
