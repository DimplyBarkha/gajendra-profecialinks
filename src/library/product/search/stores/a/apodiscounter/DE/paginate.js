
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'apodiscounter',
    nextLinkSelector: 'a.next_and_prev_button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product_listing_container',
    noResultsXPath: "//div[@id='advanced_search_no_result_wrapper']",
    openSearchDefinition: null,
    domain: 'apodiscounter.de',
    zipcode: '',
  },
};
