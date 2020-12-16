
module.exports = {
  implements: 'tracker/categories/execute',
  parameterValues: {
    country: 'IT',
    store: 'mediaworld',
    domain: 'mediaworld.it',
    loadedSelector: 'div.content-map-site',
    noResultsXPath: 'div.notfound-container',
    zipcode: '',
  },
};
