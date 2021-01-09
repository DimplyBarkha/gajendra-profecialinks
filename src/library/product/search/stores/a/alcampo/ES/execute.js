
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'alcampo',
    domain: 'alcampo.es',
    url: 'https://www.alcampo.es/compra-online/search/?department=&text={searchTerms}',
    loadedSelector: 'div.caja.caja-reposo.productGridItem ',
    noResultsXPath: '//div[@class="span-24"] | //div[@class="page-not-found-content"] | //div[@class="title_holder titleNoResult"]',
    zipcode: '',
  },
};
