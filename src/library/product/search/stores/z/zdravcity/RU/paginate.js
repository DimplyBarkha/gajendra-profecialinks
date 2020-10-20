
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'zdravcity',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: 'li.b-issue-content__item--loader',
    loadedSelector: "ul.js-search-list",
    noResultsXPath: "//div[@class='b-issue__title-count']//span[text()=0]",
    openSearchDefinition: null,
    domain: 'zdravcity.ru',
    zipcode: '',
  },
};
