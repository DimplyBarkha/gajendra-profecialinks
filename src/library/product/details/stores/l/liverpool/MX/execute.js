
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'MX',
    store: 'liverpool',
    domain: 'liverpool.com.mx',
    loadedSelector: 'section[class="o-product__detail"]',
    noResultsXPath: '//p[@class="a-errorPage-paragraph"]',
    zipcode: '',
  },
};
