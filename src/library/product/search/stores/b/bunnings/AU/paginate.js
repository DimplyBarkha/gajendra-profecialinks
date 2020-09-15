
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'bunnings',
    nextLinkSelector: 'ul > li > button[icon="bui-icon-chevron-right"]',
    loadedSelector: 'section.product-list',
    noResultsXPath: '//div[contains(@class, "responsive-search-no-result")]',
    domain: 'bunnings.com.au',
    zipcode: '',
  },
};
