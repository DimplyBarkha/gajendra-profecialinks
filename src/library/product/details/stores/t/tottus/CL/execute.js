
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CL',
    store: 'tottus',
    domain: 'tottus.cl',
    loadedSelector: 'section.Product',
    noResultsXPath: "//div[@class='error-image']",
    zipcode: '',
  },
};
