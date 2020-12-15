
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    // nextLinkSelector: 'span.d-xs-inline.d-l-none',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.rw',
    noResultsXPath: '//div[@class="error-state-wrapper text-center cl ctr"]/div[@class="server-error"]',
    openSearchDefinition: {
      template: 'https://www.jumbo.com/producten/?offSet={offset}&searchTerms={searchTerms}&pageSize=25',
    },
    domain: 'jumbo.com',
    zipcode: '',
  },
};
