
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'perfumespremium',
    domain: 'perfumespremium.es',
    loadedSelector: 'div.fotorama__loaded--img',
    noResultsXPath: '//div[@class="img_404"]',
    zipcode: '',
  },
};
