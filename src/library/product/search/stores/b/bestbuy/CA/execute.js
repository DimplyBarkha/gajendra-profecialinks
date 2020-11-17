
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'bestbuy',
    domain: 'bestbuy.ca/en-ca',
    url: 'https://www.bestbuy.ca/en-ca/search?search={searchTerms}',
    loadedSelector: '#root > div > div > footer > div.middleFooterSection_2AzRo > div > div.footerRightContent_1yMpE > div > div.newsLetterInputContainer_16LLU > form > div > button > span.content_3dXxd',
    noResultsXPath: null,
    zipcode: '',
  },
};
