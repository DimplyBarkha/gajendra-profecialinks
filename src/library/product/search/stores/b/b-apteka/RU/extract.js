const {transform} = require('../format')


async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  await context.evaluate(async function () {
    const overlay = document.querySelector('div.confirm-city-modal__actions button');

    if (overlay) {
      // overlay.click();
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));


    // let scrollTop = 0;
    // while (scrollTop <= 10000) {
    //   await stall(500);
    //   scrollTop += 1000;
    //   window.scroll(0, scrollTop);
    //   if (scrollTop === 10000) {
    //     await stall(1000);
    //     break;
    //   }
    // }
    // function stall (ms) {
    //   return new Promise(resolve => {
    //     setTimeout(() => {
    //       resolve();
    //     }, ms);
    //   });
    // }

    let cnt = 0;
    for (let i = 0; i < 13; i++) {
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      const noResButton = document.querySelector('button[class*="button button_block button_xl button_default pagination__button j-more-button hidden"]');
      if (noResButton) {
        console.log('not available');
        break;
      } else {
        const nxtButton = document.querySelector('button[class*="button button_block button_xl button_default pagination__button j-more-button"]');
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        if (nxtButton) {
          try {
            nxtButton.click();
            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          } catch (err) {}
        }
      }
    }
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'b-apteka',
    transform,
    domain: 'b-apteka.ru',
    zipcode: "''",
  },
  implementation,
};
