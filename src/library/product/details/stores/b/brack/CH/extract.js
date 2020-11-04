
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'brack',
    transform: null,
    domain: 'brack.ch',
    zipcode: '',
  },
  implementation: async (
    { inputString },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    // await context.evaluate(async () => {
    //   let scrollTop = 0;
    //   while (scrollTop !== 15000) {
    //     await stall(1000);
    //     scrollTop += 1000;
    //     window.scroll(0, scrollTop);
    //     if (scrollTop === 15000) {
    //       await stall(1000);
    //       break;
    //     }
    //   }
    //   function stall (ms) {
    //     return new Promise((resolve, reject) => {
    //       setTimeout(() => {
    //         resolve();
    //       }, ms);
    //     });
    //   }
    // });

    // await new Promise(resolve => setTimeout(resolve, 1000));

    // await context.evaluate(async () => {
    //   const producturl = window.location.href;
    //   const body = document.querySelector('body');
    //   body.setAttribute('producturl', producturl);
    // });

    const dataRef = await context.extract(productDetails);

    const alternateImages = dataRef[0].group[0].alternateImages;
    if (alternateImages) {
      alternateImages.forEach(image => {
        image.text = image.text.replace('xs3', 'xxl');
      });
    }
  },
};
