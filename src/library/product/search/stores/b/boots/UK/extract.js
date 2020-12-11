const { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'boots',
    transform,
    domain: 'boots.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      async function addDummyDiv () {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const items = document.querySelectorAll('.ais-Hits ol.ais-Hits-list li');
        const liItems = document.querySelectorAll('.product_listing_container ul.grid_mode.grid li.estore_product_container');
        items.forEach((item, index) => {
          try {
            const obj = JSON.parse(item.textContent);
            if (obj) {
              const alreadyExists = liItems[index].querySelector('div#upc');
              if (!alreadyExists) {
                const upcDiv = document.createElement('div');
                upcDiv.id = 'upc';
                upcDiv.textContent = obj.upc;
                liItems[index].appendChild(upcDiv);
                const idDiv = document.createElement('div');
                idDiv.id = 'manufacturerModel';
                idDiv.textContent = obj.manufacturerModel;
                liItems[index].appendChild(idDiv);
              }
            }
          } catch (error) {
            console.log('Error =>', error);
          }
        });
      }
      const moreButton = document.evaluate('//button[@class="results-btn-viewmore"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (moreButton && moreButton.singleNodeValue != null) {
        while (document.evaluate('//button[@class="results-btn-viewmore"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          await addDummyDiv();
          moreButton.singleNodeValue.click();
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          let scrollTop = 0;
          while (scrollTop !== 7000) {
            await stall(500);
            scrollTop += 1000;
            window.scroll(0, scrollTop);
            if (scrollTop === 7000) {
              await stall(500);
              break;
            }
          }
        }
      } else {
        await addDummyDiv();
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
