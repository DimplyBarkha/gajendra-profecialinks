
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    transform: null,
    domain: 'coolblue.nl',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // click on the image to get the alternate image info (no need to revert this as all the data is available in this situation too)
      const mainImageselector = document.querySelector('ul.product-media-gallery__wrapper>li');
      if (mainImageselector) {
        mainImageselector.click();
      }
    });
    await context.extract(productDetails);
  },
};
