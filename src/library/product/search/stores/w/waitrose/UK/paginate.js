
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    nextLinkSelector: 'div.loadMoreWrapper___UneG1 > button',
    mutationSelector: null,
    spinnerSelector: 'div[class="spinner___1nvln lg___1_BF1 dark___WsJWk"]',
    loadedSelector: null,
    openSearchDefinition: null,
    domain: 'waitrose.com',
  },
};
