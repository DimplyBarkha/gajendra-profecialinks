
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'eldorado',
    domain: 'eldorado.ru',
    loadedSelector: 'div.main',
    noResultsXPath: "//div[@class='page-404']",
    zipcode: '',
  },
};
