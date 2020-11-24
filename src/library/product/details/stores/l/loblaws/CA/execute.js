module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'loblaws',
    domain: 'loblaws.ca',
    loadedSelector: '.product-image-list__item',
    noResultsXPath: '//div[contains(text(),"The PC Insiders Report")]',
    zipcode: '',
  },
};
