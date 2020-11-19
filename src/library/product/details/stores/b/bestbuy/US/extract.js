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
    });
    await context.extract(productDetails);
  },
};
