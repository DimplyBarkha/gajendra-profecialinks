
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_deportes',
    nextLinkSelector: '#pagination-next > a',
    loadedSelector: 'img.js_preview_image.lazyloaded',
    zipcode: '',
    domain: 'elcorteingles.es',
  },
};
