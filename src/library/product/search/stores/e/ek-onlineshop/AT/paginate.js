
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'ek-onlineshop',
    nextLinkSelector: 'ul[class*="page-list"] > li:last-child > a[class*="js-search-link"]:not([class*="disabled"])',    
    loadedSelector: 'div[id="js-product-list"]',
    noResultsXPath: '//section[@class="page-content page-not-found"]',  
    openSearchDefinition: {
      template: 'https://ek-onlineshop.at/suche?controller=search&orderby=position&orderway=desc&search_query={searchTerms}&page={page}',
    },  
    domain: 'ek-onlineshop.at',
    zipcode: '',
  },
};
