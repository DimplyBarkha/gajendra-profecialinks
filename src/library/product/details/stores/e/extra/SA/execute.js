
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SA',
    store: 'extra',
    domain: 'extra.com',
    loadedSelector: '#content > div:nth-child(4) > div',
    noResultsXPath: "//div[@class='c_error-page']",
    zipcode: "''",
  },
};
