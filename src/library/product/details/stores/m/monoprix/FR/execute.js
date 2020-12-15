
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'monoprix',
    domain: 'monoprix.fr',
    loadedSelector: 'body',
    noResultsXPath: '//h2[@class="ui header error__message"] | //h1[contains(text(), "400 Bad")]',
    zipcode: '',
  },
};
