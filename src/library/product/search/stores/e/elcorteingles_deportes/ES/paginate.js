
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_deportes',
    nextLinkSelector: 'li#pagination-next',
    loadedSelector: 'img.js_preview_image.lazyloaded',
    zipcode: '',
    domain: 'elcorteingles.es',
  },
};
