
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    domain: 'selfridges.com',
    loadedSelector: 'section.c-product-hero',
    noResultsXPath: '//h2[contains(text(), "Oops, sorry we")]',
    zipcode: '',
  },
};
