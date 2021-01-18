
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'eldorado',
    nextLinkSelector: 'li[class="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: '//div[@class="digi-not-found"]/p[2]',
    openSearchDefinition: null,
    domain: 'eldorado.ru',
    zipcode: '',
  },
};
