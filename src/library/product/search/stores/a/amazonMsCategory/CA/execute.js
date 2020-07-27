
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'amazonMsCategory',
    domain: 'amazon.ca',
    url: 'https://www.amazon.ca/gp/bestsellers/*/{searchTerms}?_encoding=UTF8',
    loadedSelector: null,
    noResultsXPath: '//img[contains(@alt,"Dogs of Amazon")] | /html[not(//ol[@id="zg-ordered-list"]/li)] | //*[contains(text(),"Looking for something?")]',
    zipcode: '',
  },
};
