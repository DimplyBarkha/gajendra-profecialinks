const {transform}=require('../RU/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'tmall',
    transform,
    domain: 'tmall.ru',
    zipcode: '',
  },
  implementation: async (inputs, { country, domain, transform }, context, { productDetails }) => {
    try {
      await context.evaluate(async() => {
        console.log('Scroll to recommendatrions section');
        function timeout(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        
        if (document.querySelector('.bottom-recommendation')) {
          document.querySelector('.bottom-recommendation').scrollIntoView();
          console.log('Waiting for 3 seconds.');
          await timeout(3000);
        }
      });
      // async function autoScroll(page){
      //   await page.evaluate(async () => {
      //     await new Promise((resolve, reject) => {
      //       var totalHeight = 0;
      //       var distance = 100;
      //       var timer = setInterval(() => {
      //         var scrollHeight = document.body.scrollHeight;
      //         window.scrollBy(0, distance);
      //         totalHeight += distance;
        
      //         if(totalHeight >= scrollHeight){
      //           clearInterval(timer);
      //           resolve();
      //         }
      //       }, 100);
      //     });
      //   });
      // }

      // await autoScroll(context);
    } catch (er) {
      console.log('Failed to scroll to bottom of page', er);
    }

    await context.extract(productDetails, {
      transform
    });
  },
};
