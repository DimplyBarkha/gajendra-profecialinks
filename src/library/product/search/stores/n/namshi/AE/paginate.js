
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AE',
    store: 'namshi',
    nextLinkSelector: 'a#next_page',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section#catalog_container',
    noResultsXPath: '//div[@id="section_404_container"]',
    openSearchDefinition: null,
    domain: 'namshi.com',
    zipcode: "''",
  },
};
