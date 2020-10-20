
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FI',
    store: 'tokmanni',
    domain: 'tokmanni.fi',
    url: 'https://www.tokmanni.fi/search/?q=Embo%20Design',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
