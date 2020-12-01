module.exports = {
  implements: "product/search/execute",
  parameterValues: {
    country: "RU",
    store: "planetazdorovo",
    domain: "planetazdorovo.ru",
    url: "https://apteka.planetazdorovo.ru/search/?q={searchTerms}",
    loadedSelector: 'div[class*="card-list"] a[class*="product-card__image"]',
    noResultsXPath: '//p[contains(.,"Сожалеем, но ничего не найдено")]',
    zipcode: "",
  },
};
