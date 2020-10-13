
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonMsPromos',
    domain: 'amazon.com',
    loadedSelector: null,
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "GoldBox"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")]',
  },
};
