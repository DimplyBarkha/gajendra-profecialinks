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

    try {
      await context.evaluate(async function () {
        const ulInDesc = "div[data-test='description']>ul";
        const descBullets = document.querySelector(ulInDesc);
        const body = document.querySelector('body');
        if (descBullets) {
          body.appendChild(descBullets);
        }
      })
    } catch (err) {
      console.log(err.message)
    }
    
    return await context.extract(productDetails, { transform: transformParam });
  },
};
