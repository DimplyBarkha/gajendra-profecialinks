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
    const upcDataResults = await context.evaluate(async () => {

      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      const upcData = {};
      let indexElement = 0;
      let offset = 0;

      async function collectUpdateData(offset) {
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        try {
          const items = document.querySelectorAll('.ais-Hits ol.ais-Hits-list li');
          items.forEach((item, index) => {
            try {
              indexElement = offset + index;
              const obj = JSON.parse(item.textContent);
              if (Object.keys(obj).length) {
                upcData[indexElement] = { upc: obj.upc, manufacturerModel: obj.manufacturerModel }
              }

            } catch (error) {
              console.log('Error =>', error);
            }
          });
          offset += items.length;
          return offset;
        } catch (error) {
          console.log('Error while collecting update data', error);
        }
      }

      async function scrollPage() {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(500);
            break;
          }
        }
      }

      const moreButton = document.evaluate('//button[@class="results-btn-viewmore"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (moreButton && moreButton.singleNodeValue != null) {
        while (document.querySelector('button[class="results-btn-viewmore"]').getAttribute('disabled') != "") {
          offset = await collectUpdateData(offset)
          moreButton.singleNodeValue.click();
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          scrollPage();
        }
        console.log('offset =>', offset);
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        offset = await collectUpdateData(offset)
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        scrollPage();
      } else {
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        offset = await collectUpdateData(offset);
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        await scrollPage();
      }
      return upcData
    });
    console.log('upcDataResults =>', upcDataResults);
    await context.evaluate(async (upcDataResults) => {
      const liItems = document.querySelectorAll('.product_listing_container ul.grid_mode.grid li.estore_product_container');
      liItems.forEach((item, index) => {
        const productDetails = upcDataResults[index];
        const alreadyExists = liItems[index].querySelector('div#upc');
        if (!alreadyExists && productDetails) {
          const upcDiv = document.createElement('div');
          upcDiv.id = 'upc';
          upcDiv.textContent = productDetails.upc;
          liItems[index].appendChild(upcDiv);
          const idDiv = document.createElement('div');
          idDiv.id = 'manufacturerModel';
          idDiv.textContent = productDetails.manufacturerModel;
          liItems[index].appendChild(idDiv);
        }
      })
    }, upcDataResults)

    return await context.extract(productDetails, { transform });
  },
};
