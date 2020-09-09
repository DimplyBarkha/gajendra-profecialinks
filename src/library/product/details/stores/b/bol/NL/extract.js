const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    transform,
    domain: 'bol.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    let videoSelector = null;
    await context.evaluate(async function () {
      let videoEle = document.querySelector("a[data-test='product-video']")
      if (videoEle) {
        videoEle.click();
        console.log('video clicked')
        videoSelector = "video[data-test='wsp-video-element']";
      }
    });
    // if (true) {
    //   console.log('came in here')
    //   console.log(videoSelector)
    //   await context.waitForFunction(function (videoSelector) {
    //     return Boolean(document.querySelector(videoSelector));
    //   }, { timeout: 30000 }, videoSelector);
    // }
    return await context.extract(productDetails, { transform: transformParam });
  },
};
