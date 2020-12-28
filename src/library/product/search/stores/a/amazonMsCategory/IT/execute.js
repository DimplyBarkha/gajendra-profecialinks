
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'amazonMsCategory',
    domain: 'amazon.it',
    url: 'https://www.amazon.it/gp/bestsellers/*/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "zeitgeist"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //img[contains(@alt,"Dogs of Amazon")] | //*[contains(text(),"Cerchi qualcosa in particolare")] | /html[not(//ol/li)] | //a[contains(@href,"ref=cs_503_link")]',
    zipcode: '',
  },
};
