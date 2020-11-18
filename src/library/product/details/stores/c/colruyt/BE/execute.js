
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'colruyt',
    domain: 'colruyt.be',
    loadedSelector: '#mainContent img',
    noResultsXPath: '//div[contains(@id,"searchResultsContainer")]',
    zipcode: '',
  },
};
