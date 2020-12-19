
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'HU',
    store: 'mediamarkt',
    domain: 'mediamarkt.hu',
    url: 'https://www.mediamarkt.hu/hu/search.html?query={searchTerms}&searchProfile=onlineshop&channel=mmhuhu',
    loadedSelector: 'ul[data-gtm-prop-list-name="Search result list"]',
    noResultsXPath: '//div[@id="nincstalalat"]',
    zipcode: '',
  },
};
