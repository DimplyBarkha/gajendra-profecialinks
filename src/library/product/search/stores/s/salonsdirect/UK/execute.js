
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'salonsdirect',
    domain: 'salonsdirect.com',
    url: 'https://www.salonsdirect.com/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.products.wrapper.grid.products-grid',
    noResultsXPath: '//div[@class="message notice"]',
    zipcode: '',
  },
};
