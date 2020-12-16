
module.exports = {
  implements: 'tracker/categories/execute',
  parameterValues: {
    country: 'US',
    store: 'kohls',
    domain: 'kohls.com',
    loadedSelector: 'div#sitemap-content',
    noResultsXPath: null,
    zipcode: '',
  },
};
