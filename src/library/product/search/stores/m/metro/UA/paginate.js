
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UA',
    store: 'metro',
    nextLinkSelector: 'li[class=pagination__direction] span.icon-arrow-right',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.products-box',
    noResultsXPath: '//span[contains(text(), "Мы не смогли найти результаты")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'metro.ua',
    zipcode: '',
  },
};
