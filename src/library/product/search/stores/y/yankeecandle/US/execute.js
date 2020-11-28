
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'yankeecandle',
    domain: 'yankeecandle.com',
    url: 'https://www.yankeecandle.com/search?Ntt=baby bottles',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
