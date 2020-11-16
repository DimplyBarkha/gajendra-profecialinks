
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'EE',
    store: 'selver',
    nextLinkSelector: 'a.next.i-next i.b-icon.b-icon--arrow-right', //'i svg.b-icon__container',
    spinnerSelector: 'div.blockajax-loader[style*="display: block;"] span',
    loadedSelector: 'ol[id="products-grid"] li',
    noResultsXPath: '//p[@class="note-msg"]',
    domain: 'selver.ee',
    zipcode: '',
  },
};
