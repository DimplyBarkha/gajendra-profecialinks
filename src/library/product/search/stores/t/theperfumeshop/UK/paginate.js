
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'theperfumeshop',
    nextLinkSelector: 'button[aria-label="Load next 36 products"]',
    mutationSelector: null,
    spinnerSelector: 'div.spinner',
    loadedSelector: 'div.product_grid__results',
    noResultsXPath: '//h2[@class="page_subtitle" and text()="No search results for"]',
    openSearchDefinition: null,
    domain: 'theperfumeshop.com',
    zipcode: '',
  },
};
