
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'bijenkorf',
    domain: 'debijenkorf.nl',
    loadedSelector: 'div.dbk-productdetail__container',
    noResultsXPath: '//*[@class="dbk-404--title"]',
    zipcode: '',
  },
};
