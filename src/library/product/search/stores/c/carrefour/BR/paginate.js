
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'carrefour',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="dib relative vtex-product-summary-2-x-imageContainer vtex-product-summary-2-x-imageStackContainer vtex-product-summary-2-x-hoverEffect"] > img',
    noResultsXPath: '//div[@class="vtex-search-result-3-x-searchNotFound flex flex-column-s flex-row-ns justify-center-ns items-center h-auto-s h5-ns"]',
    openSearchDefinition: null,
    zipcode: '',
    domain: 'carrefour.com.br',
  },
};
