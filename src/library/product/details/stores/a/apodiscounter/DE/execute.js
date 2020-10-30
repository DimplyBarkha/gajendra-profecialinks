
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'apodiscounter',
    domain: 'apodiscounter.de',
    loadedSelector: 'div#content_wrapper',
    noResultsXPath: "//div[@id='advanced_search_no_result_wrapper']",
    zipcode: '',
  },
};
