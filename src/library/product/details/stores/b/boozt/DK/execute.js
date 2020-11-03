
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DK',
    store: 'boozt',
    domain: 'boozt.com',
    loadedSelector: 'div.related__content',
    noResultsXPath: '//h2[@class="fsearchnoresults__header"]',
    zipcode: '',
  },
};
