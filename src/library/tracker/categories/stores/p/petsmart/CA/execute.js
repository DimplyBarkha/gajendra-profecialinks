
module.exports = {
  implements: 'tracker/categories/execute',
  parameterValues: {
    country: 'CA',
    store: 'petsmart',
    domain: 'petsmart.ca',
    loadedSelector: 'li#shop-by-pet',
    noResultsXPath: null,
    zipcode: '',
  },
};
