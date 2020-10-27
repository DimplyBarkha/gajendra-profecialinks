module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
  country: 'US',
  store: 'vons',
  nextLinkSelector: "#searchGridLoading",
  mutationSelector: null,
  spinnerSelector: null,
  loadedSelector: 'body',
  noResultsXPath: null,
  openSearchDefinition: null,
  domain: 'vons.com',
  zipcode: '',
  },
  };