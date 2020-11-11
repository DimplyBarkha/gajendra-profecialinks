module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'alloffice',
    domain: 'alloffice.se',
    loadedSelector: 'button[data-test-id="add-to-cart-button"]',
    noResultsXPath: '//font[contains(text(),"no hits")] | //font[contains(text(),"try another")] | //*[contains(text(),"Kan inte köpas i webbutiken")]',
    zipcode: '',
  },
};
