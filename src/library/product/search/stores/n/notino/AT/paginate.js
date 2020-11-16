
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'notino',
    nextLinkSelector: "div[id='paging-bottom'] span[class='pages'] a[class='next']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'notino.at',
    zipcode: '',
  },
};
