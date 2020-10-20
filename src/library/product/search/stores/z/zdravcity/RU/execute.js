
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'zdravcity',
    domain: 'zdravcity.ru',
    url: null,
    loadedSelector: "ul.js-search-list",
    noResultsXPath: "//div[@class='b-issue__title-count']//span[text()=0]",
    zipcode: '',
  },
};
