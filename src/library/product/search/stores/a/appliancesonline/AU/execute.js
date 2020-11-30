
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    domain: 'appliancesonline.com.au',
    store: 'appliancesonline',
    url: 'https://www.appliancesonline.com.au/search/{searchTerms}',
    loadedSelector: 'div.grid-container-flex',
    noResultsXPath: '//h2[text()="Sorry, no results found for \'dyson\'"] | //picture[@class="overlay-image"] | //div[@class="ngxcarousel"]',
    zipcode: '',
  },
};
