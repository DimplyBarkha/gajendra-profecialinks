module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'extra',
    domain: 'extra.com.br',
    loadedSelector: "div.area-root",
    noResultsXPath: "//div[@class='not-found']",
    zipcode: '',
  },
};
