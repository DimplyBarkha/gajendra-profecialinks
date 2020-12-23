
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    domain: 'allegro.pl',
    loadedSelector: 'div[data-box-name*="Description"]',
    noResultsXPath: '//div[contains(@data-box-name,"Non existing offer")]',
    zipcode: '',
  },
};
