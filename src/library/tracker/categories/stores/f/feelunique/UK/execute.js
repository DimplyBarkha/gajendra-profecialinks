
module.exports = {
  implements: 'tracker/categories/execute',
  parameterValues: {
    country: 'UK',
    store: 'feelunique',
    domain: 'feelunique.com',
    loadedSelector: 'div#brand-list',
    noResultsXPath: '//body[@id="global-home" and not(div[@id="brand-list"])]',
    zipcode: '',
  },
};
