module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'kogan',
    mutationSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,"yFdVB")]',
    domain: 'kogan.com',
    zipcode: '',    
  },
};
