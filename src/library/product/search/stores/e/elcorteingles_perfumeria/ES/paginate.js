module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_deportes',
    nextLinkSelector: 'li[id = "pagination-next"]>a.event._pagination_link',
    loadedSelector: 'img.js_preview_image.lazyloaded',
    zipcode: '',
    domain: 'elcorteingles.es',
  },
};
