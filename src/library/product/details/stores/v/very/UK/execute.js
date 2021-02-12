
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'very',
    domain: 'very.co.uk',
    loadedSelector: 'div#recs_1,div[class*=productImage]',
    noResultsXPath: '//div[contains(@class, "productListWrap gridView")]|//div[contains(@id, "sliderTarget--primaryCell")]|//span[@id="noSearchResultsString"] | //h1[contains(text(),"Uh oh! Page not found!")] | //h2[contains(text(), "Oops")]',
    zipcode: '',
  },
};
