
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DK',
    store: 'magasin',
    domain: 'magasin.dk',
    loadedSelector: 'body',
    noResultsXPath: '//div[@class="heading"]/div[@class="text"]',
    zipcode: '',
  },
};
