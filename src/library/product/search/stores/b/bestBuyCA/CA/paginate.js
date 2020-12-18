
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'bestbuyCA',
    // nextLinkSelector: '//main//span[@class="content_3dXxd"]',
    // spinnerSelector: 'div[class*=loadingContainer_]',
    loadedSelector: 'div[class="productList_31W-E"]',
    // loadedSelector: 'div[class*=x-productListItem]',
    noResultsXPath: '//body[@id="page-not-found"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'bestbuy.ca',
    zipcode: '',
  },
};
