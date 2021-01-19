
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'heb',
    domain: 'heb.com',
    url: 'https://www.heb.com/search/?q=cheese+chips',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
