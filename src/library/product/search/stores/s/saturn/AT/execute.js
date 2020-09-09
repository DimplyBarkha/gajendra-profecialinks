
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'saturn',
    domain: 'saturn.at',
    url: 'https://www.saturn.at/de/search.html?query={searchTerms}&searchProfile=onlineshop&channel=seatde',
    loadedSelector: 'ul[class="products-list"] a[class="photo clickable"]',
    noResultsXPath: '//div[@id="search_no_result-bottom_right"] | /html[not(//script[contains(text(),"Search Results")])]',
    zipcode: '',
  },
};
