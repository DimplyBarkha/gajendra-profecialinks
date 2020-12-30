
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FI',
    store: 'tokmanni',
    domain: 'tokmanni.fi',
    url: 'https://www.tokmanni.fi/search/?q=Lotus',
    loadedSelector: '#kuLandingProductsListUl >li',
    noResultsXPath: null,
    zipcode: '',
  },
};
