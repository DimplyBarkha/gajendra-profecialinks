
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'comet',
    domain: 'comet.it',
    loadedSelector: "div[class*='img__img-big'] img",
    noResultsXPath: null,
    zipcode: '',
  },
};
