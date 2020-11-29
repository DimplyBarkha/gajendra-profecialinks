
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SK',
    store: 'nay',
    domain: 'nay.sk',
    url: 'https://www.nay.sk/vysledky-vyhladavanie?q={searchTerms}&do=searchBox-searchForm-submit',
    loadedSelector: '#lb-results > div > div > ul',
    noResultsXPath: '//p[@class="message message--error"]',
    zipcode: '',
  },
};
