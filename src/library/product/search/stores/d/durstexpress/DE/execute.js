
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'durstexpress',
    domain: 'durstexpress.de',
    url: "https://www.durstexpress.de/berlin1/catalogsearch/result/?q=Apfel",
    loadedSelector: "body",
    noResultsXPath: null,
    zipcode: '',
  },
};
