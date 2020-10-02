
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'mediamarkt',
    domain: 'mediamarkt.at',
    url: 'https://www.mediamarkt.at/de/search.html?query={searchTerms}&searchProfile=onlineshop&channel=mmatde',
    loadedSelector: 'div[data-test^="mms-search-main"] div[data-test^="mms-search-srp-productlist"]',
    noResultsXPath: '//div[contains(@id,"search_no_result")]|//ul[contains(@class,"dysonnavi")]|//p[contains(text(), "Leider haben wir für Ihre Suche")]',
    zipcode: '',
  },
};
