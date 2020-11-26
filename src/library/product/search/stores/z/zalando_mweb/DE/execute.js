
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'zalando_mweb',
    domain: 'zalando.de',
    url: 'https://m-en.zalando.de/men/?q={searchTerms}',
    loadedSelector: 'script[id="z-nvg-cognac-props"]',
    noResultsXPath: '//span[contains(text(), "Try a different search term or check the spelling.")]',
    zipcode: '',
  },
};
