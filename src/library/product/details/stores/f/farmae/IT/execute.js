
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'farmae',
    domain: 'farmae.it',
    loadedSelector: 'body',
    noResultsXPath: '//*[@id="mm-0"]/div[8]/div[2]/div/p[contains(@class,"note-msg")]',
    zipcode: '',
  },
};
