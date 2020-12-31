
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'MX',
    store: 'liverpool',
    domain: 'liverpool.mx',
    loadedSelector: 'section.o-product__detail',
    noResultsXPath: '//h1[@class="a-errorPage-title"]',
    zipcode: '',
  },
};
