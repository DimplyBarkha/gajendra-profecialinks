
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NZ',
    store: 'dyson',
    domain: 'dyson.co.nz',
    loadedSelector: 'div.hero__content',
    noResultsXPath: '//div[@class="layout"][contains(text(), "The page you’re looking for can’t be found.")]',
    zipcode: '',
  },
};
