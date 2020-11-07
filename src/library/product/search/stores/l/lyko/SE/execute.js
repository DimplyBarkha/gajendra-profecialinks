
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'lyko',
    domain: 'lyko.com',
    url: 'https://lyko.com/sv/sok?q=ansiktsvatten',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
