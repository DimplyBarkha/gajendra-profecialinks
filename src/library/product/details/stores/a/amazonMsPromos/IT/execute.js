
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'amazonMsPromos',
    domain: 'amazon.it',
    noResultsXPath: '//a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")]',
    zipcode: '',
  },
};
