
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    domain: 'jpg.fr',
    loadedSelector: 'body',
    noResultsXPath: '//section[@class="error-pages__container col mb-8"]',
    zipcode: '',
  },
};
