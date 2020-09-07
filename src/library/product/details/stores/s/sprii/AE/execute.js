
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AE',
    store: 'sprii',
    domain: 'sprii.ae',
    loadedSelector: 'div.fotorama__loaded--img img',
    noResultsXPath: '//span[@data-ui-id="page-title-wrapper"]',
    zipcode: '',
  },
};
