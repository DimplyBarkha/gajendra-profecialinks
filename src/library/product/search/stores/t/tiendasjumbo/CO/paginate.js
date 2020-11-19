
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CO',
    store: 'tiendasjumbo',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section.grid',
    noResultsXPath: '//section[@class="not-found-terms"]',
    openSearchDefinition: null,
    domain: 'tiendasjumbo.co',
    zipcode: "''",
  },
};