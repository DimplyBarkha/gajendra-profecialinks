
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'nocibe',
    domain: 'nocibe.fr',
    loadedSelector: 'section#productPage',
    noResultsXPath: '//div[contains(@class, "404")]',
    zipcode: '',
  },
};
