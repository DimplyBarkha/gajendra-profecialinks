
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    nextLinkSelector: 'div.loadMoreWrapper___UneG1 > button',
    mutationSelector: 'div.flexGrid___1DH6K',
    spinnerSelector: null,
    loadedSelector: 'div.flexGrid___1DH6K > article',
    openSearchDefinition: null,
    domain: 'waitrose.com',
  },
};
