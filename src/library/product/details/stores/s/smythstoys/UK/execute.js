
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'smythstoys',
    domain: 'smythstoys.com',
    loadedSelector: 'div#cookieFreshchat + div',
    noResultsXPath: '//div[contains(@class,"catalouge-error-msg-16")]',
    zipcode: '',
  },
};
