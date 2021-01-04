
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'darty',
    domain: 'darty.com',
    loadedSelector: 'div.product_body',
    noResultsXPath: '//div[@id="darty_page_title"]',
    zipcode: '',
  },
};
