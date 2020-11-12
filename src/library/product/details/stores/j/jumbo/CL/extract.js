const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CL',
    store: 'jumbo',
    transform: cleanUp,
    domain: 'jumbo.cl',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await context.evaluate(async function () {
      function addElementToDocument (id, value, key) {
        const catElement = document.createElement('div');
        catElement.id = id;
        catElement.innerText = value;
        catElement.setAttribute('content', key);
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      const imageLink = document.querySelector('div.product-image div.zoomed-image') ? 
      (document.querySelector('div.product-image div.zoomed-image').getAttribute('style') ? 
        (document.querySelector('div.product-image div.zoomed-image').getAttribute('style').match(/url\("([^"]+)/)? 
        document.querySelector('div.product-image div.zoomed-image').getAttribute('style').match(/url\("([^"]+)/)[1] : null) : null) : null
      // @ts-ignore
      if (imageLink !== null) {
        // @ts-ignore
        addElementToDocument('imageLink', '', imageLink);
      }

      const ImageThumb = document.querySelectorAll('div.product-image-thumbs li img');
      // @ts-ignore
      const alt = ImageThumb ? (ImageThumb[0] ? ImageThumb[0].alt : null) : null;
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

      const nutritionalInfo = document.querySelectorAll('li.nutritional-details-title-data');

      if (nutritionalInfo) {
        nutritionalInfo.forEach(e => {
          const val = e.textContent.match(/^[^(]+\((\w+)\)/) ? e.textContent.match(/^[^(]+\((\w+)\)/)[1] : null ;
          e.setAttribute('unitOfMeasure', val);
        });
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
