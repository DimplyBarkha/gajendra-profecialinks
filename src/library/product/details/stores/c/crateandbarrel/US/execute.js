
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'crateandbarrel',
    domain: 'crateandbarrel.com',
    loadedSelector: 'div.availability-wrapper,div.dimension-content',
    noResultsXPath: '//h1[contains(text(), "Oops")]',
    zipcode: '',
  },
};
