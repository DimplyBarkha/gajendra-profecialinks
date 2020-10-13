
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'amazonMsPromos',
    domain: 'amazon.es',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "GoldBox"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")]',
    zipcode: '',
  },
};
