
module.exports = {
  // implements: 'product/search/paginate',
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'IT',
    store: 'beautye',
    // nextLinkSelector: '#amasty-shopby-product-list > div:nth-child(4) > div.pages > ul > li.item.pages-item-next > a',
    nextLinkSelector: '#amasty-shopby-product-list > div:nth-child(4) div.pages ul li.pages-item-next a.action.next[title="Successivo"]',
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div.products-grid li.product-item', // 'li.item.product.product-item',
    noResultsXPath: '//div[@class="message notice"]/div',
    /*openSearchDefinition: {
      template: 'https://www.beautye.it/catalogsearch/result/index/?p={page}&q={searchTerms}',
      //'https://www.beautye.it/search/{searchTerms}?p={page}',
      //https://www.beautye.it/catalogsearch/result/index/?p={page}&q={searchTerms}
      //'https://www.beautye.it/catalogsearch/result/?q=abbronzante?p=2

    },*/
    // openSearchDefinition: null,
    // openSearchDefinition: {
    //  template: 'https://www.beautye.it/catalogsearch/result/index/?q={searchTerms}&p={page}',
    //  template: 'https://www.beautye.it/search/{searchTerms}?p={page}',
    // },
    domain: 'beautye.it',
    zipcode: '',
    
  },
  };
  