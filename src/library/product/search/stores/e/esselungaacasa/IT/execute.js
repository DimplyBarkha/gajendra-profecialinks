
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'esselungaacasa',
    domain: 'esselungaacasa.it',
    url: 'https://www.esselungaacasa.it/ecommerce/nav/auth/supermercato/home.html#!/negozio/ricerca/{searchTerms}',
    loadedSelector: 'div#mainContent',
    noResultsXPath: '//div[@ng-if="productSetCtrl.emptyProductSet"]',
    zipcode: '',
  },
};
