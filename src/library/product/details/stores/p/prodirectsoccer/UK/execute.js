
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'prodirectsoccer',
    domain: 'prodirectsoccer.com',
    // loadedSelector: 'section.container-inner img',
    loadedSelector: 'div.product-title',
    noResultsXPath: null,
    zipcode: '',
  },
};
