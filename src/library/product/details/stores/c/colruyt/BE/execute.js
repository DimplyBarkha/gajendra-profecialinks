
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'colruyt',
    domain: 'colruyt.be',
    loadedSelector: 'div.product.product--detail',
    noResultsXPath: '//div[contains(@id,"searchResultsContainer")]',
    zipcode: '',
  },
};
