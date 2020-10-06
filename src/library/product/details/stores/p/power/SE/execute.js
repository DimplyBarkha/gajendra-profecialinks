
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'power',
    domain: 'power.se',
    loadedSelector: 'div#product-image-carousel',
    noResultsXPath: '//h1[contains(text(),"Sidan hittades inte")]',
    zipcode: '',
  },
};
