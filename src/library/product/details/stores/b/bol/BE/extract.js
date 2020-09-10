const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'bol',
    transform,
    domain: 'bol.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {

    async function callWait() {
      await context.waitForSelector("video[data-test='wsp-video-element']")
    }

    const waitForVideo = await context.evaluate(async function () {
      let videoEle = document.querySelector("a[data-test='product-video']")
      if (videoEle) {
        videoEle.click();
        return true;
      }
      return false;
    });
    
    try {
      if (waitForVideo) {
        await callWait();
      }
    } catch (err) {
      console.log(err.message)
    }
 
    return await context.extract(productDetails, { transform: transformParam });
  },
};
