
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'costco',
    nextLinkSelector: 'li.forward > a > i',
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div[class="product-list list"]',
    noResultsXPath: '//div[@class="toolbar"][contains(.,"Try another search")]',
    // openSearchDefinition: null,
    domain: 'costco.com',
    zipcode: '',
  },
};
