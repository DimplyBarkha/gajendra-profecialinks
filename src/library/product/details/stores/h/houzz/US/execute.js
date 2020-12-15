module.exports = {
  implements: "product/details/execute",
  parameterValues: {
    country: "US",
    store: "houzz",
    domain: "houzz.com",
    loadedSelector:
      "#hz-page-content-wrapper > div > div.container.view-product.vp-container-redesign > div > div.view-product-redesign > div.left-column > div.view-product-image__container.prxl > div.view-product-image.mbl.view-product-image--image",
    noResultsXPath: null,
    zipcode: "",
  },
};
