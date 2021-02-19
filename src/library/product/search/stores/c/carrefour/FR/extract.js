const { transform } = require('../FR/shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'carrefour',
    transform,
    domain: 'carrefour.fr',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { results } = inputs;
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async (results) => {
    try {
      let ul = document.querySelectorAll('ul#data-plp_produits');
      let finalUL;
      if (ul) {
        finalUL = ul[1];
      }
      let totalProducts = finalUL.querySelectorAll('li.product-grid-item').length;
      if (totalProducts) {
        // await new Promise(resolve => setTimeout(resolve, 5000));
        try {
          await context.waitForSelector('li.product-grid-item');
        } catch (error) {
          console.log('All products not loaded after scrolling!!');
        }
      }
      if (document.querySelector('div.pagination__button-wrap button')) {
        let loadMoreBtn = true;
        while (loadMoreBtn) {
          document.querySelector('div.pagination__button-wrap button').click();
          await new Promise(resolve => setTimeout(resolve, 2000));
          let ul1 = document.querySelectorAll('ul#data-plp_produits');
          let finalUL1;
          if (ul1) {
            finalUL1 = ul1[1];
          }
          let currentCount = finalUL1.querySelectorAll('li.product-grid-item').length;
          console.log(currentCount)
          // if (currentCount >= results) {
          if (currentCount >= 150) {
            loadMoreBtn = false;
          }
        }
      }
      //----------------
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
      //--------------------
      
    } catch (e) {
      console.log('error in load more reviews');
    }
  }, results);
  try {
    await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (error) {
    console.log('All products not loaded after scrolling!!');
  }

  return await context.extract(productDetails, { transform });
}