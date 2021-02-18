
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'Sainsburys',
    domain: 'sainsburys.co.uk',
    loadedSelector: 'h1[class="pd__header"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
