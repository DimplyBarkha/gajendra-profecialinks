
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'well',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product_image_link.product-item-image img',
    noResultsXPath: '(//div[@class="search_results_message"]//p)[1]',
    openSearchDefinition: null,
    domain: 'well.ca',
    zipcode: '',
  },
};
