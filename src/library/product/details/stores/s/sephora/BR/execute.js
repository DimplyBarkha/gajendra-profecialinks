
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'sephora',
    domain: 'sephora.com.br',
    loadedSelector: null,
    noResultsXPath: "(//div[@class='std']//div//img)[1]",
    zipcode: '',
  },
};
