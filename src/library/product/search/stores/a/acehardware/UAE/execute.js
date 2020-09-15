
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UAE',
    store: 'acehardware',
    domain: 'aceuae.com',
    url: 'https://www.aceuae.com/en-AE/search/?q={searchTerms}',
    loadedXPath: '//ul[contains(@class,"js-products-grid")]//li//div[@data-itemid]',
    noResultsXPath: null,
    zipcode: '',
  },
};
