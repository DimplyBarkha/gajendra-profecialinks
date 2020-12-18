
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    transform: null,
    domain: 'dm.de',
    zipcode: '',
  },
  implementation: async ({ reviewUrl }, { country, domain, transform }, context, { productReviews }) => {

    // to load all images
    await context.waitForXPath('//h1[@data-dmid="detail-page-headline-product-title"]');
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });

    // await context.evaluate(async () => {
    //   function stall (ms) {
    //     return new Promise((resolve, reject) => {
    //       setTimeout(() => {
    //         resolve();
    //       }, ms);
    //     });
    //   }
    //   stall(9000);
    //   console.log(document.querySelector('span.bv-content-btn-pages-next') , 'sssssssssss');

    //   if (document.querySelector('span.bv-content-btn-pages-next') ) {
    //       await new Promise((resolve, reject) => setTimeout(resolve, 12000));
    //       setInterval(async function(){
    //         document.querySelector('span.bv-content-btn-pages-next').click();
    //         document.querySelectorAll('ol.')
    //         let scrollTop = 0;
    //         while (scrollTop !== 20000) {
    //           await stall(500);
    //           scrollTop += 1000;
    //           window.scroll(0, scrollTop);
    //           if (scrollTop === 20000) {
    //             await stall(5000);
    //             break;
    //           }
    //         }
    //         function stall (ms) {
    //           return new Promise((resolve, reject) => {
    //             setTimeout(() => {
    //               resolve();
    //             }, ms);
    //           });
    //         }
    //       },8000);
    //       await new Promise((resolve, reject) => setTimeout(resolve, 12000));
    //   } else {
    //     const applyScroll = async function (context) {
    //       await context.evaluate(async function () {
    //         let scrollTop = 0;
    //         while (scrollTop !== 20000) {
    //           await stall(500);
    //           scrollTop += 1000;
    //           window.scroll(0, scrollTop);
    //           if (scrollTop === 20000) {
    //             await stall(5000);
    //             break;
    //           }
    //         }
    //         function stall (ms) {
    //           return new Promise((resolve, reject) => {
    //             setTimeout(() => {
    //               resolve();
    //             }, ms);
    //           });
    //         }
    //       });
    //     };
    //     // applyScroll();
    //   }
    // });
    return await context.extract(productReviews);
  },
};
