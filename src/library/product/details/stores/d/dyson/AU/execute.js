
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'dyson',
    domain: 'dyson.com.au',
    loadedSelector: 'div.hero__body',
    noResultsXPath: '//p[contains(text(), "The page you’re looking for can’t be found.")]',
    zipcode: '',
  },
};
