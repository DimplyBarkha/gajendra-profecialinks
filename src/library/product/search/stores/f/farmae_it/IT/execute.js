
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'farmae_it',
    domain: 'farmae.it',
    url: 'https://www.farmae.it/catalogsearch/result/?cat=0&q={searchTerms}',
    loadedSelector: 'div.category-products' ,
    noResultsXPath: '//p[contains(text(),"Non ci sono prodotti corrispondenti alla selezione")]',
    zipcode: '',
  },
};
