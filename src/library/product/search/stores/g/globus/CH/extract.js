const { transform } = require('./format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // const applyScroll = async function (context) {
  //   console.log('calling applyScroll-----------');
  //   await context.evaluate(async function () {
  //     let scrollTop = 0;
  //     while (scrollTop !== 20000) {
  //       await stall(1000);
  //       scrollTop += 1000;
  //       console.log('calling applyScroll evaluate-----------', window);
  //       window.scroll(0, scrollTop);
  //       if (scrollTop === 20000) {
  //         await stall(5000);
  //         break;
  //       }
  //     }
  //     function stall (ms) {
  //       return new Promise((resolve, reject) => {
  //         setTimeout(() => {
  //           resolve();
  //         }, ms);
  //       });
  //     }
  //   });
  // };
  // await applyScroll(context);
 await context.evaluate(async () => {
   await new Promise((resolve) => setTimeout(resolve, 5000));

      async function infiniteScroll() {
          let prevScroll = document.documentElement.scrollTop;
          while (true) {
              window.scrollBy(0, document.documentElement.clientHeight);
              await new Promise(resolve => setTimeout(resolve, 1000));
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
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'globus',
    transform,
    domain: 'globus.ch',
    zipcode: '',
  },
  implementation,
};
