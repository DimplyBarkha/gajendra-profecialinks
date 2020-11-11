
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'HU',
    store: 'edigital',
    nextLinkSelector: "div[id='paginator'] button[class='prefixbox-active'] + button",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: "div[class='product-list'] ul[id='prefixbox-search-engine'] li[id *='ed-prod-'] div[class='image'] img[class='img-responsive'][src *='product_images']",
    openSearchDefinition: null,
    domain: 'edigital.hu',
    zipcode: '',
  },
};
