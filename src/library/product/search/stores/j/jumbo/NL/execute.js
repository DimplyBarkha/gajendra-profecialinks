
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    domain: 'jumbo.com',
    url: 'https://www.jumbo.com/producten/?searchTerms={searchTerms}',
    loadedSelector: '.rw',
    noResultsXPath: '//div[@class="error-state-wrapper text-center cl ctr"]/div[@class="server-error"]',
    zipcode: '',
  },
};
