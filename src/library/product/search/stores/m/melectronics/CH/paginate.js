
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'melectronics',
    nextLinkSelector: 'div[class="p-product-listing--item p-product-listing--item__buttons"] button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,//'div[class="p-product-listing--row"] div[class="tiles-row row"] div a[class="u-reset"]',
    noResultsXPath: 'div[class="wysiwyg"] div h2',
    openSearchDefinition: null,
    domain: 'melectronics.ch',
    zipcode: '',
  },
};
