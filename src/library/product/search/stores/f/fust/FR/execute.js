
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'fust',
    domain: 'fust.ch',
    url: 'https://www.fust.ch/fr/search.html?searchtext={searchTerms}',
    loadedSelector: 'ul.results  div.product',
    noResultsXPath: '//p[contains(text(),"Aucun document correspondant n\'a été trouvé pour votre recherche.")]',
    zipcode: "''",
  },
};
