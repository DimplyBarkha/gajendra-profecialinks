const { cleanUp } = require('../../wayfair/shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    transform: cleanUp,
    domain: 'wayfair.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productReviews } = dependencies;
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          scrollTop += 400;
          window.scroll(0, scrollTop);
          await stall(500);
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
      console.log("scroll");
    };

    await applyScroll(context);
    try {
    await context.clickAndWaitForNavigation('li[class*="pl-CollapsePanelBase"]>button[id*="CollapseToggle-14"]', { timeout: 20000 });
    await context.clickAndWaitForNavigation('.FullWidthReviewsContainer>div[class*="pl-Box"]>div[class*="Banner"]', { timeout: 20000 });
    await context.clickAndWaitForNavigation('div[class*="onImageBlock"]>header[class*="ProductDetailInfoBlock"]>div>button>.ProductRatingNumberWithCount>span[class*="ProductRatingNumberWithCount-count--link"]s', { timeout: 20000 });
    console.log("button clicked");
    }
    catch {
      console.log("error");
    }
    await applyScroll(context);  
    await context.waitForSelector('div[class*="pl-Box--mt"]>div>article[class="ProductReview"]', { timeout:20000 })
    return await context.extract(productReviews, { transform });

  },
};
