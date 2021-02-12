const { transform } = require('../format');
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   await context.evaluate(async function () {
//     const clickOnImages = async function () {
//       function timeout (ms) {
//         return new Promise((resolve) => setTimeout(resolve, ms));
//       }
//       const nextButton = document.querySelector('a.button.button_default.button_sm.button_block_xs.j-confirm-city-modal-button');
//       if (nextButton) {
//         nextButton.click();
//         await timeout(5000);
//       }
//     };
//   });
//   // await new Promise((resolve, reject) => setTimeout(resolve, 8000));
//   // const button = document.getElementsByClassName('button.button_default.button_sm.button_block_xs.j-confirm-city-modal-button')[1];


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
    for (let i = 0; i < 12; i++) {
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
