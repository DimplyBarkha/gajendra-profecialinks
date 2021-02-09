module.exports = {
  implements: "product/search/paginate",
  parameterValues: {
    country: "RU",
    store: "planetazdorovo",
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="card-list"] a[class*="product-card__image"]',
    noResultsXPath: '//p[contains(.,"Сожалеем, но ничего не найдено")]',
    openSearchDefinition: {
      template: 'https://planetazdorovo.ru/search/?PAGEN_1={page}&q={searchTerms}'
    },
    domain: "planetazdorovo.ru",
    zipcode: "",
  },
};
