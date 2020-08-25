
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
      // click on the image to get the alternate image info
      const mainImageselector = document.querySelector('ul.product-media-gallery__wrapper>li');
      if (mainImageselector) {
        console.log('main image selector found');
        mainImageselector.click();
        console.log('main image selector Clicked');
      }
      // Get categories info
      const breacrumb = Array.from(document.querySelectorAll('ol.breadcrumbs li')).map(elm => {
        const value = elm.textContent.trim();
        return `${value}`;
      }).filter(elm => elm);
      document.body.setAttribute('category', breacrumb.join('>'));
      console.log('category set');
    });
    await context.extract(productDetails);
  },
};
