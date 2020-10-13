
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'amazonMsCategory',
    domain: 'amazon.es',
    url: 'https://www.amazon.es/gp/bestsellers/*/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "zeitgeist"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //img[contains(@alt,"Dogs of Amazon")] | //*[contains(text(),"Buscas algo")] | /html[not(//ol/li)]',
    zipcode: '',
  },
};
