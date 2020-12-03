
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    nextLinkSelector: null, // 'span[class="content"] span[class="d-xs-inline d-l-none"]', // not pushed, check out if selector is fine
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.rw',
    noResultsXPath: '//div[@class="error-state-wrapper text-center cl ctr"]/div[@class="server-error"]',
    openSearchDefinition: {
      template: 'https://www.jumbo.com/producten/?offSet=100&searchTerms={searchTerms}&pageSize={page}',
    },
    domain: 'jumbo.com',
    zipcode: '',
  },
};
