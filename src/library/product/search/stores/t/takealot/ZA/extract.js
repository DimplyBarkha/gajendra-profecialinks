const { transform } = require("./transform");

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  try { await context.click('button.modal-module_close-button_asjao'); } catch (error) { }
  const applyScroll = async function (context) {
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
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  let loadMore = true;
  do {
    await applyScroll(context);
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const loadMoreButton = await context.evaluate(async function () {
      const button = document.querySelector('button.search-listings-module_load-more_OwyvW');
      console.log('nilesh', button);
      return button ? true : false;
    });
    console.log('loadMoreButton', loadMoreButton)
    if (loadMoreButton) {
      await context.click('button.search-listings-module_load-more_OwyvW');
      loadMore = true;
    } else {
      loadMore = false;
    }
  } while (loadMore);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ZA',
    store: 'takealot',
    transform,
    domain: 'takealot.com',
    zipcode: '',
  },
  implementation
};
