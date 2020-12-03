
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'paodeacucar',
    domain: 'paodeacucar.com',
    url: 'https://www.paodeacucar.com/busca?w=${searchTerms}&qt=12&p=1&gt=grid',
    loadedSelector: 'div[class*="product-cardstyles__Container"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
