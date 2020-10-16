
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'keurig',
    nextLinkSelector: 'a[aria-label="Next Arrow"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.top_content img,img#base_image',
    noResultsXPath: '//div[@class="search-result-heading-empty"] | //h1[contains(.,"Sorry...")] | //div[contains(@class,"grid-area") and contains(.,"No products found")] | //div[contains(@class,"availablity-form")]',
    openSearchDefinition: null,
    domain: 'keurig.com',
    zipcode: '',
  },
};
