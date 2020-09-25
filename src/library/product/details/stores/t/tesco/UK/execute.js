
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'tesco',
    domain: 'tesco.com',
    noResultsXPath: '//h1[contains(.,"Oops, nothing here (404)")]',
  },
};
