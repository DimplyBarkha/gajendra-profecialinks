const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'ao',
    transform,
    domain: 'ao.de',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      const accCookie = document.querySelector('button.ao-cb__button.ao-cb__button--accept');
      if (accCookie) {
        // @ts-ignore
        accCookie.click();
      }
    });
    await context.evaluate(async () => {
      const promoClose = document.querySelector('button.promotionModalClose.icon-close.c-modal-close.u-pos--absolute.ico.ico-close.ico-lg');
      if (promoClose) {
        // @ts-ignore
        promoClose.click();
      }
    });

    await context.evaluate(async () => {
      const addElementToDocument = (key, value) => {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      // Using the old code to extract alternate images
      const altImagesList = document.createElement('ol');
      altImagesList.id = 'alternate_images';
      altImagesList.style.display = 'none';
      const initImg = document.evaluate(
        "//li[@id='carousel-centre-image']//img/@src",
        document,
        null,
        XPathResult.STRING_TYPE,
        null,
      );
      if (initImg && initImg.stringValue) {
        do {
          var nextButt = document.getElementById('mediaGalleryPrev');
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          if (nextButt) {
            nextButt.click();
            var currImg = document.evaluate(
              "//li[@id='carousel-left-image' and @data-media-type='image']//img/@src",
              document,
              null,
              XPathResult.STRING_TYPE,
              null,
            );
          }
          if (currImg === undefined) {
            break;
          }
          if (currImg && currImg.stringValue !== initImg.stringValue) {
            const imgElem = document.createElement('img');
            imgElem.setAttribute('src', currImg.stringValue.replace(/https:\/\//g, '//').replace(/\/\//g, 'https://'));
            altImagesList.appendChild(imgElem);
            // addDivClass('altImages', currImg.stringValue.replace(/https:\/\//g, '//').replace(/\/\//g, 'https://'));
          }
        } while (currImg.stringValue !== initImg.stringValue);
      }
      document.body.appendChild(altImagesList);

      const productObj = window.digitalData.page.product;
      const reviewsString = productObj.reviewsInfo !== '0|0' ? productObj.reviewsInfo : '';
      const ratingCount = reviewsString.match(/(.+)\|(\d+)/) ? reviewsString.match(/(.+)\|(\d+)/)[2] : '';
      const aggregateRating = reviewsString.match(/(.+)\|(\d+)/) ? reviewsString.match(/(.+)\|(\d+)/)[1] : '';

      addElementToDocument('product_url', window.location.href);
      addElementToDocument('availability', productObj.isInStock ? 'In stock' : 'Out of stock');
      addElementToDocument('sku', productObj.sku);
      addElementToDocument('rating_count', ratingCount);
      addElementToDocument('aggregate_rating', aggregateRating.replace('.', ','));
      addElementToDocument('customer_service_availability', document.querySelector('div#liveChatApp') ? 'Yes' : 'No');
      addElementToDocument('image_zoom_present', document.querySelector('div[data-tag-area="product zoom"] > img') ? 'Yes' : 'No');

      const extraScript = document.querySelector('script#product-json')
        ? document.querySelector('script#product-json').textContent
        : '{}';
      const extraProductObj = JSON.parse(extraScript);

      const image360Present =
        Object.keys(extraProductObj).length && extraProductObj.Gallery && extraProductObj.Gallery.threeSixty && extraProductObj.Gallery.threeSixty.enabled
          ? 'Yes'
          : 'No';
      addElementToDocument('image_360_present', image360Present);
    });

    await context.extract(productDetails, { transform });
  },
};
