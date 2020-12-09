const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    transform: cleanUp,
    domain: 'bestbuy.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      let videoTab = document.querySelector("button.image-button")
      if (videoTab) {
        videoTab.click();
      }

      let videoLink = document.querySelector("#product-videos-tab")
      if (videoLink) {
        videoLink.click();
      }
    })
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));

    await context.evaluate(async function () {
      let videos = document.evaluate(`//video[@class="video-player"]//source//@src`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (videos) {
        document.body.setAttribute('video', videos.textContent);
      }

      let upc = document.evaluate('//div[contains(@class, "spec-categories")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
      if(upc) {
        document.body.setAttribute('upc', upc.textContent.match(/(UPC\s)(\d+)/)[2]);
      }

      let descEl = document.querySelector('.shop-product-description .html-fragment');
      let descriptionString = '';

      if (!descEl) {
        let scriptString = document.querySelector("div[id*='user-generated-content-ratings-and-reviews'] > script:last-child") ? 
          document.querySelector("div[id*='user-generated-content-ratings-and-reviews'] > script:last-child").innerText : null;
        
        if (scriptString) {
          scriptString = scriptString.split('description\\":\\"').length > 1 ? 
            scriptString.split('description\\":\\"')[1] : null;
          scriptString = scriptString ? scriptString.split('\\"') : null;
          scriptString = scriptString ?
          scriptString[0] : null;
          descriptionString = scriptString;
        }
      } else {
        descriptionString = descEl.innerText;
      }

      let newDescEl = document.createElement('import-description');
      newDescEl.innerText = descriptionString;
      document.body.appendChild(newDescEl);

      let loadMoreImagesEl = document.querySelector('.image-more-thumbnail button') ? document.querySelector('.image-more-thumbnail button') : document.querySelector('button.see-more-images-button');
      const productImages = [];

      if (loadMoreImagesEl) {
        loadMoreImagesEl.click();
        const images = document.querySelectorAll('.tab-content-wrapper.product-images .image-thumbnail-wrapper .carousel-indicate .thumbnail-content img');

        for (const image of images) {
          const src = image.src.split(';')[0];
          productImages.push(src);
        }
      } else {
        const images = document.querySelectorAll('.shop-media-gallery .thumbnail-list img');

        for (const image of images) {
          const src = image.src.split(';')[0];
          productImages.push(src);
        }
      }

      for (const item of productImages) {
        let imageEl = document.createElement('import-image');
        imageEl.setAttribute('src', item);
        document.body.appendChild(imageEl);
      }

      let jsonData = document.evaluate('//script[@type="application/ld+json"][contains(., "seller")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      jsonData = jsonData ? jsonData.innerText : null;

      if (jsonData) {
        jsonData = JSON.parse(jsonData);
        document.body.setAttribute('import-seller', jsonData.offers.seller.name);
      }
    });
    await context.extract(productDetails);
  },
};
