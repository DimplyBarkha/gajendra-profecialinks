
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AT',
    store: 'ep',
    domain: 'ep.at',
    loadedSelector: 'body',
    noResultsXPath: 'div[class="page-not-found-component component content"]',
    zipcode: '',
  },
};
