const { transform } = require('../../../../shared');
const { getStockFunc } = require('../sharedExtract');

module.exports = {
  implements: 'product/sellerInventory/extract',
  parameterValues: {
    country: 'ES',
    store: 'mifarma',
    transform,
    // getStockFunc,
    domain: 'mifarma.es',
    loadedSelector: null,
    zipcode: '',
  },
  implementation: async (
    { inputString },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    async function validInventory (stockNum) {
      await context.setInputValue('input[title="Cantidad"]', (stockNum-1).toString());
      await context.waitForSelector('span#mas-qty');
      await context.evaluate(async function () {
        document.querySelector('span#mas-qty').click();
      });
      await new Promise((resolve, reject) => setTimeout(resolve, 10000));


      const cartErrorMessage = await context.evaluate(async function () {
        return !!document.querySelector('p.item-msg.error');
      });

      if (cartErrorMessage) {
        return false;
      }
      return true;
    }
    async function binSearch (low, high) {
      const mid = Math.floor(((low + high) / 2));

      if (mid < 0) {
        return false;
      }

      console.log('mid ', mid);

      const testMid = await validInventory(mid);
      // const testPrevMid = await validInventory(mid - 1);
      // const testAfterMid = await validInventory(mid + 1);

      if (testMid) {
        const testPrevMid = await validInventory(mid - 1);
        const testAfterMid = await validInventory(mid + 1);
        if (testPrevMid && testAfterMid === false) {
          return mid;
        }

        if (testAfterMid) {
          return await binSearch(mid + 1, high);
        }
      }
      // if (testMid && testPrevMid && testAfterMid === false) {
      //   return mid;
      // }

      // if (testMid && testAfterMid) {
      //   console.log('enter here');
      //   return await binSearch(mid + 1, high);
      // }

      return await binSearch(low, mid - 1);
    }


    // const linkURL = await context.evaluate(function () {
    //   const element = document.querySelector('link[rel="canonical"]');
    //   if (element) {
    //     return element.href;
    //   } else {
    //     return null;
    //   }
    // });
    await context.setInputValue('input#qty', '1');
    await context.click('button[title="Añadir"]');
    await new Promise((resolve, reject) => setTimeout(resolve, 7000));
    await context.waitForSelector('div#msg-anadircarrito');

    const cartMessage = await context.evaluate(async function () {
      return document.querySelector('div#msg-anadircarrito').textContent;
    });

    if (cartMessage.includes('no está disponible')) {
      console.log('No product')
    } else if (cartMessage.includes('fue agregado al carrito')) {
      console.log('Product here!')
      const { timeout = 60000, waitUntil = 'load', checkBlocked = true } = {};
      const mainUrl = 'https://www.mifarma.es/checkout/cart';
      await context.goto(mainUrl, { timeout, waitUntil, checkBlocked });
    }

    const { timeout = 60000, waitUntil = 'load', checkBlocked = true } = {};
    const mainUrl = 'https://www.mifarma.es/checkout/cart';
    await context.goto(mainUrl, { timeout, waitUntil, checkBlocked });
    const lastSearch = await binSearch(1, 1000);
    console.log('lastSearch ', lastSearch);
    // });
    // await context.goto(linkURL);
    return await context.extract(productDetails, { transform });
  },
};
