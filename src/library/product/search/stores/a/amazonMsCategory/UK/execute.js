
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'amazonMsCategory',
    domain: 'amazon.co.uk',
    url: 'https://www.amazon.co.uk/gp/bestsellers/*/{searchTerms}?_encoding=UTF8',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "zeitgeist"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] |//img[contains(@alt,"Dogs of Amazon")] | /html[not(//ol[@id="zg-ordered-list"]/li)] | //*[contains(text(),"Looking for something?")]',
    zipcode: '',
  },
};
