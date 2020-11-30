
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'bellaffair',
    domain: 'bellaffair.at',
    url: "https://www.bellaffair.at/suche?keyword={searchTerms}",
    loadedSelector: 'div.productlist',
    noResultsXPath: '//div[@class="column-two clear"]/p',
  },
};
