const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'boxed',
    transform: cleanUp,
    domain: 'boxed.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const isPopupPresent = document.querySelector('div[aria-label="Close modal"]');
      // @ts-ignore
      if (isPopupPresent) isPopupPresent.click();
      const productDetails = document.querySelector('a[data-tab-key="productDetails"]');
      // @ts-ignore
      if (productDetails) productDetails.click();

      function addElementToDocument (id, value, key) {
        const catElement = document.createElement('div');
        catElement.id = id;
        catElement.innerText = value;
        catElement.setAttribute('content', key);
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      const imageLink = document.querySelector('div.product-image div.zoomed-image')
        ? document.querySelector('div.product-image div.zoomed-image').baseURI : null;
      // @ts-ignore
      if (imageLink !== null) {
        // @ts-ignore
        addElementToDocument('imageLink', '', imageLink);
      }

      const ImageThumb = document.querySelectorAll('div.product-image-thumbs li img');
      // @ts-ignore
      const alt = ImageThumb ? ImageThumb[0].alt : null;
      if (alt !== null) {
        // @ts-ignore
        addElementToDocument('altText', '', alt);
      }

      if (ImageThumb) {
        ImageThumb.forEach(e => {
        // @ts-ignore
          const src = e.currentSrc.replace('-100-100/', '/');
          e.setAttribute('fullIMG', src);
        });
      }

      const nutritionalInfo = document.querySelectorAll('div.nutritional-details-title-data span');

      if (nutritionalInfo) {
        nutritionalInfo.forEach(e => {
          const val = e.textContent.match(/^[^(]+\((\w+)\)/)[1];
          e.setAttribute('unitOfMeasure', val);
        });
      }
    });

    await context.extract(productDetails);
  },
};
