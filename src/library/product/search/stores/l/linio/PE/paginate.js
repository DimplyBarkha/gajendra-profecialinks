
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PE',
    store: 'linio',
    mutationSelector: null,
    nextLinkXpath: '//ul/li[@class="page-item"][last()]/preceding::li[1]/a/span',
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    domain: 'linio.com',
    zipcode: '',
  },
};
