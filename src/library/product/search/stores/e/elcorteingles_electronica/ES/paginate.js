module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_electronica',
    loadedSelector: 'img.js_preview_image.lazyloaded',
    nextLinkSelector: 'li#pagination-next>a',
    domain: 'elcorteingles.es',
  },
};