const {transform} = require('../format.js')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'melectronics',
    transform,
    domain: 'melectronics.ch',
    zipcode: '',
  }, implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    try {
      await context.waitForSelector(".detail-showcase--additional-img-box img[alt='Video']");
    } catch(er) {
      console.log("No video selector");
    }
    await context.evaluate(async function() {
      if(document.querySelector(".detail-showcase--additional-img-box img[alt='Video']")) {
        document.querySelector(".detail-showcase--additional-img-box img[alt='Video']").click();
        await new Promise((resolve, reject) => setTimeout(resolve, 4000));
      }
    })
  await context.extract(productDetails);
  }
};
