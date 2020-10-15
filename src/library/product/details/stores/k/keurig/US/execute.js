
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'keurig',
    domain: 'keurig.com',
    loadedSelector: 'img#base_image',
    noResultsXPath: '//h1[contains(.,"Sorry...")]',
    zipcode: '',
  },
};
