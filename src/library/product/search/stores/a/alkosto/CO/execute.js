
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CO',
    store: 'alkosto',
    domain: 'alkosto.com',
    url: 'https://www.alkosto.com/salesperson/result/?q={searchTerms}',
    loadedSelector: 'div.toolbar',
    noResultsXPath: '//div[@class="bannerpro-pager"]',
    zipcode: '',
  },
};
