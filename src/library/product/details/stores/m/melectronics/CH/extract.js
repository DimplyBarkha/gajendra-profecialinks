const { transform } = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'melectronics',
    transform,
    domain: 'melectronics.ch',
    zipcode: '',
  }, implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {

    try {
      await context.waitForSelector(".detail-showcase--additional-img-box img[alt='Video']");
    } catch (er) {
      console.log("No video selector");
    }
    await context.evaluate(async function () {
      if (document.querySelector(".detail-showcase--additional-img-box img[alt='Video']")) {
        //@ts-ignore
        document.querySelector(".detail-showcase--additional-img-box img[alt='Video']").click();
        await new Promise((resolve, reject) => setTimeout(resolve, 4000));
      }
    })
    //fixing for gtin
    try {
      await context.evaluate(() => {
        //@ts-ignore
        const dataFromScript = document.evaluate('//script[@type="application/ld+json"][contains(.,"gtin")]', document, null, 7, null).snapshotItem(0).innerText;
        const jsonData = JSON.parse(dataFromScript);
        const gtin = jsonData.gtin13;
        document.querySelector('body').setAttribute('gtin', gtin);
      })
    } catch (e) {
      console.log('gtin not present');
    }


    await context.evaluate(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      async function infiniteScroll() {
          let prevScroll = document.documentElement.scrollTop;
          while (true) {
              window.scrollBy(0, document.documentElement.clientHeight);
              await new Promise(resolve => setTimeout(resolve, 3000));
              const currentScroll = document.documentElement.scrollTop;
              if (currentScroll === prevScroll) {
                  break;
              }
              prevScroll = currentScroll;
          }
      }
      await infiniteScroll();
      await new Promise((resolve) => setTimeout(resolve, 8000));
  });

    await context.extract(productDetails, { transform: transformParam });
  }
};
