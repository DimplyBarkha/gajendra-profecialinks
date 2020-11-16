module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'costco',
    nextLinkSelector: 'div.paging ul li.forward > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.product-tile-set div[id*="price-"]',
    noResultsXPath: '//div[@id="no-results"]',
    openSearchDefinition: null,
    domain: 'costco.ca',
    zipcode: 'M5V 2A5',
  },
};