module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'kalamazoo',
    domain: 'kalamazoo.es',
    url: 'https://www.kalamazoo.es/INTERSHOP/web/WFS/RAJA-KALAMAZOO-Site/es_ES/-/EUR/ViewParametricSearch-SimpleOfferSearch?SearchTerm={searchTerms}',
    loadedSelector: 'section[class="page-category__products-cards"]',
    noResultsXPath: '//h3[@class="page-category__search"]',
    zipcode: '',
  },
};
