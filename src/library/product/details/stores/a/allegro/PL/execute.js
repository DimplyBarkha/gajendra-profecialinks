
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    domain: 'allegro.pl',
    loadedSelector: 'a[name="description"]+div img',
    noResultsXPath: null,
    zipcode: '',
  },
};
