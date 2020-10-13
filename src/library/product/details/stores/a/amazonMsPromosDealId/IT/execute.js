
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'amazonMsPromosDealId',
    domain: 'amazon.it',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "GoldBox"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")]',
    zipcode: '',
  },
};
