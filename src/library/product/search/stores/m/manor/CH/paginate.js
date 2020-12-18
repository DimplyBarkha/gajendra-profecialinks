
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    noResultsXPath: '//html//div[@id="noresults"]',
    openSearchDefinition: {
      offset: 24,
      template: 'https://search.epoq.de/inbound-servletapi/getSearchResult?full&tenantId=manor-ch&sessionId=e4d65ffc818d529604652f9cb7725&orderBy=&order=desc&limit=24&offset={offset}&locakey=de&style=compact&format=json&nrf=&query={searchTerms}',
    },
    domain: 'manor.ch',
    zipcode: '',
  },
};
