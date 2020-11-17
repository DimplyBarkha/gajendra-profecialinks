
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimeNow',
    // nextLinkSelector: 'ul[class*="pagination-container"] > li:last-child > a[class*="buttons__prev-next-button"]:not([class*="buttons__disabled"])',
    mutationSelector: null,
    // spinnerSelector: 'div[class*="product_grid__disabledCover"]',
    loadedSelector: 'li[class^=product_grid__item]',
    openSearchDefinition: {
      template: 'https://primenow.amazon.com/search?k={searchTerms}&p_95=&merchantId=&ref_=pn_sr_nav_sr_ALL&dc&page={page}',
    },
    noResultsXPath: '/html[not(//div[starts-with(@class,"index__keyword")]/ancestor::div[starts-with(@class,"index")]/following-sibling::div[starts-with(@class,"product_grid__root")]//ul[contains(@class,"product_grid__grid")]/li)]|//div[contains(.,"did not match any products.")]',
  },
};
