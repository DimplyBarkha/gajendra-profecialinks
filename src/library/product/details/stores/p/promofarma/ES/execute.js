
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'promofarma',
    domain: 'promofarma.com',
    loadedSelector: 'body',
    noResultsXPath: '//div[@class="box-white not-found-box my-2 text-center"]/h3/text()',
    zipcode: '',
  },
};
