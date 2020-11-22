
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DK',
    store: 'nicehair',
    domain: 'nicehair.dk',
    loadedSelector: "img[id='image']",
    noResultsXPath: "//h1[text()='404']",
    zipcode: '',
  },
};
