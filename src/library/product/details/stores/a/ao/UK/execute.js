
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'ao',
    domain: 'ao.com',
    loadedSelector: '.productInformation',
    noResultsXPath: '//h1[contains(text(), "Sorry - this page no longer exists") or contains(text(), "Oops - we can\'t find any results for")]',
    zipcode: '',
  },
};
