module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IN',
    store: 'tatacliq',
    domain: 'tatacliq.com',
    loadedSelector: '#root>div>div:nth-child(3)>div>div>div',
    noResultsXPath: null,
    zipcode: '',
  },
};
