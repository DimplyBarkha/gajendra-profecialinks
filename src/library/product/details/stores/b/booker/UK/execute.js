
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'booker',
    domain: 'booker.co.uk',
    loadedSelector: 'div#MainMenu',
    noResultsXPath: '//div[@id="TempRegLeft"] | //div[@id="OHPLeft"] | //div[@class="YourBookerLeft"]',
    zipcode: '',
  },
};
