
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'GLOBAL',
    store: 'amazonMsCategory',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/gp/bestsellers/{searchTerms}',
    noResultsXPath: '//a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //img[contains(@alt,"Dogs of Amazon")] | /html[not(//ol[@id="zg-ordered-list"]/li)] | //*[contains(text(),"Looking for something?")]',
  },
};
