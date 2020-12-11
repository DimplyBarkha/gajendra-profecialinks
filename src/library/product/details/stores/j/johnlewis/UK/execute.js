
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'johnlewis',
    domain: 'johnlewis.com',
    loadedSelector: null,
    noResultsXPath: `//h1[@data-test='heading-term'][contains(.,"Sorry, we couldn't find any results for")]`,
    zipcode: '',
  },
};
