
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PE',
    store: 'linio',
    mutationSelector: null,
    spinnerSelector: null,
    // nextLinkXpath: '//ul/li[@class="page-item"][last()]/preceding::li[1]/a/span',
    loadedSelector: 'body',
    noResultsXPath: null,
    domain: 'linio.com',
    zipcode: '',
  },
};
