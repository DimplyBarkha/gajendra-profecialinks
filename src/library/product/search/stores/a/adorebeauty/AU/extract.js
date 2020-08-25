const { transform } = require('../format');

/**
 *
 * @param { { } } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // await context.evaluate(async () => {
  //   let loadMore = document.querySelector('button[class="flex items-center mx-auto text-center uppercase text-white bg-black my-4 px-4 py-3 rounded-sm"]');
  //   while(loadMore && loadMore.getAttribute('disabled') !== "disabled"){
  //     await loadMore.click();
  //     await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  //     loadMore = document.querySelector('button[class="flex items-center mx-auto text-center uppercase text-white bg-black my-4 px-4 py-3 rounded-sm"]');
  //   }
  // });
  await context.evaluate(async () => {
    let btnView = document.querySelectorAll('button[class="md:hidden group-hover:inline-flex w-1/2 text-15 font-montserrat bg-white hover:bg-black text-black hover:text-white border border-black py-3 px-4 mr-2"]');
    let btnViewLength = btnView.length;
    async function clickButtonAndGetData() {
      btnViewLength = btnViewLength - 1;
      await btnView[btnViewLength].click();
      let productId = document.getElementsByTagName("META")[7].content;
      console.log(productId);
      let modalClose = document.querySelector('div[class="dialog__close"]');
      await modalClose.click();
      if(btnViewLength) {
        clickButtonAndGetData();
      }
    }

    if(btnViewLength) {
      clickButtonAndGetData();
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'adorebeauty',
    transform,
    domain: 'adorebeauty.com.au',
    zipcode: '',
  },
  implementation
};
