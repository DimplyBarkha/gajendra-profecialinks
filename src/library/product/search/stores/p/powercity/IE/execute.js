
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'powercity',
    domain: 'powercity.ie',
    url: 'https://powercity.ie/groups/search?search={searchTerms}',
    loadedSelector: 'div#product-list',
    noResultsXPath: '//div[@class="site-error"]',
    zipcode: '',
  },
};
