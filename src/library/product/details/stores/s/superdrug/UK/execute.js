
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'superdrug',
    domain: 'superdrug.com',
    noResultsXPath: '//title[contains(.,"Access Denied")]',
  },
};
