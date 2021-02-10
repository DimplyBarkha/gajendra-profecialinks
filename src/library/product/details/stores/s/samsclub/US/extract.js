const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    transform,
    domain: 'samsclub.com',
  },
  implementation
  // implementation: async ({ url }, { country, domain }, context, dependencies) => {
  //   await context.evaluate(() => {
  //     const imgAlt = document.querySelector('button[class="sc-image-viewer-img-button"] img') ? document.querySelector('button[class="sc-image-viewer-img-button"] img').alt : null;
  //     document.body.setAttribute('imagealt', imgAlt);
  //   });
  //   await context.extract(dependencies.productDetails);
  // },
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    const popUps = document.querySelector('div.sc-modal-content button.sc-modal-close-button')
    if (popUps) {
      popUps.click();
    }
    // await new Promise(resolve => setTimeout(resolve, 2000));
    // const video = document.querySelector('div.wc-media-wrap img[@wcobj]') ? document.querySelector('div.wc-media-wrap img [@wcobj]') : null;
    // document.body.setAttribute('imagealt', video);
    // function stall(ms) {
    //   return new Promise(resolve => {
    //     setTimeout(() => {
    //       resolve();
    //     }, ms);
    //   });
    // }
    // let scrollTop = 0;
    // while (scrollTop !== 20000) {
    //   await stall(500);
    //   scrollTop += 1000;
    //   window.scroll(0, scrollTop);
    //   if (scrollTop === 20000) {
    //     break;
    //   }
    // }

    // await stall(1000);

  });
  return await context.extract(productDetails, { transform });
}