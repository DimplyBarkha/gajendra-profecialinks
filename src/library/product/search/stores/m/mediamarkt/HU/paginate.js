
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'HU',
    store: 'mediamarkt',
    nextLinkSelector: '#category div:last-child ul li.pagination-next a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[data-gtm-prop-list-name="Search result list"]',
    noResultsXPath: '//div[@id="nincstalalat"]',
    openSearchDefinition: null,
    domain: 'mediamarkt.hu',
    zipcode: "''",
  },
};
