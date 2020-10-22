
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'lojasrenner',
    domain: 'lojasrenner.com',
    loadedSelector: 'section.main_product',
    noResultsXPath: '//div[contains(@class, "product_404")]//p',
    zipcode: '',
  },
};
