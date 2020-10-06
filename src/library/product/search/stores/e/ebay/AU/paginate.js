
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'ebay',
    nextLinkSelector: 'div.p-wrapper > div#p-items > div.dynpg > table.pgbc > tbody td.next > a.enabled',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.p-box',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'ebay.com.au',
    zipcode: '',
  },
};
