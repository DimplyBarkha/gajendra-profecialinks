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
    async function callWait () {
      await context.waitForSelector("video[data-test='wsp-video-element']");
    }

    const waitForVideo = await context.evaluate(async function () {
      const videoEle = document.querySelector("a[data-test='product-video']");
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
      console.log(err.message);
    }

    try {
      await context.evaluate(async function () {
        const ulInDesc = "div[data-test='description']>ul";
        const descBullets = document.querySelector(ulInDesc);
        const body = document.querySelector('body');

        const liInDesc = document.querySelectorAll("div[data-test='description']>ul>li");
        const divEle = document.createElement('div');
        liInDesc.length > 0 ? body.appendChild(divEle) : false;
        divEle.id = 'bulletCount';
        divEle.title = liInDesc.length.toString();

        if (descBullets) {
          body.appendChild(descBullets);
        }
      });
    } catch (err) {
      console.log(err.message);
    }

    return await context.extract(productDetails, { transform: transformParam });
  },
};
