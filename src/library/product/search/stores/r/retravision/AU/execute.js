
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'retravision',
    domain: 'retravision.com.au',
    url: 'https://www.retravision.com.au/#q={searchTerms}&idx=retravision_default_products&p=0&is_v=1',
    loadedSelector: 'div#instant-search-results-container > div.ais-hits',
    noResultsXPath: '//div[@class="no-results"]',
    zipcode: '',
  },
};
