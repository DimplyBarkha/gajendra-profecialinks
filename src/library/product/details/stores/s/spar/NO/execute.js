
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NO',
    store: 'spar',
    domain: 'spar.no',
    loadedSelector: 'div.cw-product-detail-wrapper__product',
    noResultsXPath: '//div[@class="cw-section"]/h1[contains(text(), "Ukjent vare")] | //div[@class="content"]//h1[contains(text(),"Uff")]',
    zipcode: '',
  },
};
