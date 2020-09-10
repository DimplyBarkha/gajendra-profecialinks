
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'retravision',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.hits',
    noResultsXPath: '//div[@class="no-results"]',
    openSearchDefinition: {
      template: 'https://www.retravision.com.au/#q={searchTerms}&idx=retravision_default_products&p={page}&is_v=1',
    },    
    domain: 'retravision.com.au',
    zipcode: '',
  },
};
