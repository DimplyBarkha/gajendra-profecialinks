
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'amazonMsCategory',
    domain: 'amazon.de',
    url: 'https://www.amazon.de/gp/bestsellers/*/{searchTerms}?_encoding=UTF8',
    loadedSelector: null,
    noResultsXPath: '//a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //img[contains(@alt,"Dogs of Amazon")] | /html[not(//ol/li)] | //*[contains(text(),"Suchen Sie bestimmte Informationen")]',
    zipcode: '',
  },
};
