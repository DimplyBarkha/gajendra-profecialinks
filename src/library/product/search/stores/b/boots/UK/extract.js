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
      const moreButton = document.evaluate('//button[@class="results-btn-viewmore"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (moreButton && moreButton.singleNodeValue != null) {
        let offset = 0
        while (document.querySelector('button[class="results-btn-viewmore"]').getAttribute('disabled') != "") {
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          try {
            const items = document.querySelectorAll('.ais-Hits ol.ais-Hits-list li');
            items.forEach((item, index) => {
              try {
                indexElement = offset + index;
                const obj = JSON.parse(item.textContent);
                upcData[indexElement] = { upc: obj.upc, manufacturerModel: obj.manufacturerModel }
              } catch (error) {
                console.log('Error =>', error);
              }
            });
            offset += items.length;
          } catch (error) {
            console.log('IN div Error =>', error);
          }
          moreButton.singleNodeValue.click();
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
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
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        try {
          const items = document.querySelectorAll('.ais-Hits ol.ais-Hits-list li');
          items.forEach((item, index) => {
            try {
              indexElement = offset + index;
              const obj = JSON.parse(item.textContent);
              upcData[indexElement] = { upc: obj.upc, manufacturerModel: obj.manufacturerModel }
              //upcData.push({ index: indexElement, upc: obj.upc, manufacturerModel: obj.manufacturerModel })
            } catch (error) {
              console.log('Error =>', error);
            }
          });
          offset += items.length;
        } catch (error) {
          console.log('IN div Error =>', error);
        }
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
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
      } else {
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        try {
          let offset = 0
          const items = document.querySelectorAll('.ais-Hits ol.ais-Hits-list li');
          items.forEach((item, index) => {
            try {
              indexElement = offset + index;
              const obj = JSON.parse(item.textContent);
              upcData[indexElement] = { upc: obj.upc, manufacturerModel: obj.manufacturerModel }
            } catch (error) {
              console.log('Error =>', error);
            }
          });
          offset += items.length;
        } catch (error) {
          console.log('IN div Error =>', error);
        }
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
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
      return upcData
    });
    await context.evaluate(async (upcDataResults) => {
      const liItems = document.querySelectorAll('.product_listing_container ul.grid_mode.grid li.estore_product_container');
      liItems.forEach((item, index) => {
        const productDetails = upcDataResults[index];
        const alreadyExists = liItems[index].querySelector('div#upc');
        if (!alreadyExists) {
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
