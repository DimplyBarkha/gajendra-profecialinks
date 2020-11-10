const { transform } = require('../format');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {


  await context.evaluate(async function () {
    while (document.querySelector('button.results-btn-viewmore').disabled === false) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      document.querySelector('button.results-btn-viewmore').click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(1000);
        scrollTop += 1000;
        window.scroll(0, scrollTop);

        await new Promise(resolve => setTimeout(resolve, 1000));
        const items = document.querySelectorAll('.ais-Hits ol.ais-Hits-list li');
        const liItems = document.querySelectorAll('.product_listing_container ul.grid_mode.grid li.estore_product_container');
        items.forEach((item, index) => {
          try {
            const obj = JSON.parse(item.textContent);
            if (obj) {
              const alreadyExists = liItems[index].querySelector('div#upc');
              if (!alreadyExists) {
                const div = document.createElement('div')
                div.id = "upc"
                div.textContent = obj.upc
                liItems[index].appendChild(div)
              }
            }
          } catch (error) {
            console.log('Error =>', error);
          }
        })
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
    }
  })
  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform });
  //return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'boots',
    transform,
    domain: 'boots.com',
    zipcode: '',
  },
  implementation,
};
