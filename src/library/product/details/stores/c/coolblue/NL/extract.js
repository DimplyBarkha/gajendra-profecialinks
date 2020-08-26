
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
      // checking if one of the not extracted xpath is loaded in time (wait for selector says its available)
      console.log(`THIS IS LOADED : ${document.querySelector('body > footer > div.grid-wrapper-xs--layout-wrapper.grid-wrapper-xs--padding.grid-wrapper-m--padding.grid-section-xs--gap-1.grid-section-m--gap-8 > ul > li:nth-child(3) > div.is-hidden-until-size-m > a > h5').textContent}`);
    });
    await context.extract(productDetails);
  },
};
