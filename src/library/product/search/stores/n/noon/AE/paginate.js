
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AE',
    store: 'noon',
    nextLinkSelector: 'a#next_page',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.site_width_container',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'noon.com',
    zipcode: "''",
  },
};
