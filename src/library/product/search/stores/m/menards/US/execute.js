
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'menards',
    domain: 'menards.com',
    url: 'https://www.menards.com/main/search.html?sf_categoryHierarchy=&search=bar+sink',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
