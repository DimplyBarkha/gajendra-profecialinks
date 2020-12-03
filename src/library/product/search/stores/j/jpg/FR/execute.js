
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    domain: 'jpg.fr',
    url: "https://www.jpg.fr/INTERSHOP/web/WFS/RAJA-JPG-Site/fr_FR/-/EUR/ViewParametricSearch-SimpleOfferSearch?SearchTerm={searchTerms}&SearchCat=natural&SearchQuery=serviette",   
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
