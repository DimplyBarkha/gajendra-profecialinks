
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AR',
    store: 'gpsfarma',
    nextLinkSelector: null,//"div[class='toolbar-bottom'] div[class='pages'] ol li[class='current'] + li",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'gpsfarma.com',
    zipcode: '',
  },
};
