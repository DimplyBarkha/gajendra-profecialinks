
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'retravision',
    // nextLinkSelector: 'li.ais-pagination--item__next > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#instant-search-results-container > div.ais-hits',
    noResultsXPath: '//div[@class="no-results"]',
    domain: 'retravision.com.au',
    openSearchDefinition: {
      template: 'https://www.retravision.com.au/#q={searchTerms}&idx=retravision_default_products&p={page}&is_v=1',
    },
  },
};
