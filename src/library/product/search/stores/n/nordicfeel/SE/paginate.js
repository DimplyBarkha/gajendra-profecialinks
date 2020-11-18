
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'nordicfeel',
    nextLinkSelector: "div[class='nf-paginator'] a",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'nordicfeel.se',
    zipcode: '',
  },
};
