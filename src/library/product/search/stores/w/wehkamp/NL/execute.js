
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'wehkamp',
    domain: 'wehkamp.nl',
    url: 'https://www.wehkamp.nl/zoeken/?term={searchTerms}',
    loadedSelector: '#app > div.blaze-row > section',
    noResultsXPath: '//*[@id="app"]/div[@class="blaze-row"]/section//h1[contains(text(),"kunnen we niet vinden")]',
    zipcode: "''",
  },
};
