
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'apodiscounter',
    domain: 'apodiscounter.de',
    url: 'https://www.apodiscounter.de/advanced_search_result.php?keywords={searchTerms}',
    loadedSelector: 'div.product_listing_container',
    noResultsXPath: "//div[@id='advanced_search_no_result_wrapper']",
    zipcode: '',
  },
};
