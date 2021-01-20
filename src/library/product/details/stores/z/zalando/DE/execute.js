
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'zalando',
    domain: 'zalando.de',
    loadedSelector: 'x-wrapper-re-1-5 button[id="picker-trigger"]',
    noResultsXPath: '//section[@lang="en"]/h1[contains(text(), "We couldn")]',
    zipcode: '',
  },
};
