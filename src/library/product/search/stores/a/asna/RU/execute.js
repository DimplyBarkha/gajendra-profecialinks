
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'asna',
    domain: 'asna.ru',
    url: "https://www.asna.ru/search/?q={searchTerms}",
    loadedSelector: "div[class *='js-test-productWrap'] span[class *='js-test-productTitle']",
    noResultsXPath: "//div[text()='По вашему запросу ничего не найдено']",
    zipcode: '',
  },
};
