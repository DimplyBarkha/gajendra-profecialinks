
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'galaxus',
    domain: 'galaxus.ch',
    loadedSelector: 'picture.mediaPicture img',
    noResultsXPath: "//h2[contains(@class, 'ZZ5g')] = 'Nothing found for'",
    zipcode: '',
  },
};
