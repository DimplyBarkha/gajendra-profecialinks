
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PT',
    store: 'skin',
    domain: 'skin.pt',
    // url:  'https://skin.pt/catalogsearch/result/index/?q={searchTerms}',
    url: 'https://skin.pt/catalogsearch/result/?q={searchTerms}',
    // loadedSelector: '#maincontent > div.columns > div.column.main > div.search.results  ol > li > div',
    // loadedSelector: '#maincontent > div.columns > div.column.main > div ol > li',
    // loadedSelector: 'li.item.product.product-item',
    loadedSelector: 'img[class="product-image-photo"]',
    // loadedSelector: 'div.ias-noneleft > em',
    // waitForSelector: 'div.ias-noneleft > em',
    // loadedSelector: 'ol.products.list.items.product-items',
    // noResultsXPath: null,
    zipcode: '',
  },
};
