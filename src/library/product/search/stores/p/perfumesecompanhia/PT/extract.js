
const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise((resolve, reject) => setTimeout(resolve, 1500));

  // kill cookie popup
  // await context.evaluate(() => {
  //   if (document.querySelector('div.uc-banner-content')) {
  //     document.querySelector('button#uc-btn-accept-banner').click();
  //   }
  // });

  // scrol to the end of the page
  // const applyScroll = async function (context) {
  //   await context.evaluate(async function () {
  //     let scrollTop = 0;
  //     while (scrollTop !== 80000) {
  //       await stall(100);
  //       scrollTop += 1080;
  //       window.scroll(0, scrollTop);
  //       if (scrollTop >= 80000) {
  //         await stall(100);
  //         break;
  //       }
  //     }
  //     function stall (ms) {
  //       return new Promise((resolve, reject) => {
  //         setTimeout(() => {
  //           resolve();
  //         }, ms);
  //       });
  //     }
  //   });
  // };
  // await applyScroll(context);  

  //Real work
  await context.evaluate(async () => {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    const loadAllProducts = async (howMuch) => {
      const moreProductsButton = document.querySelector('button#btnVerMais');
      let productsOnPage = document.querySelectorAll('div.col.active').length;
      var check = howMuch === undefined ? true : (productsOnPage < howMuch);
      console.log(productsOnPage);
      if (moreProductsButton && check) {
        moreProductsButton.click();
        await stall(5000);
        loadAllProducts(howMuch);
      }
    };

    // if you want to load
    await loadAllProducts(150);

    // const addProp = (selector, iterator, propName, value) => {
    //   document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    // };

    // const curentUrl = window.location.href.match(/(.+)\?/)[1];

    // const allProducts = document.querySelectorAll('a[class*="c3-product-grid__item"]');
    // for (let i = 0; i < allProducts.length; i++) {
    //   console.log(`All products length is ${allProducts.length}`);
    //   addProp('span.c3-product__name', i, 'rank', `${i + 1}`);
    //   addProp('span.c3-product__name', i, 'searchurl', curentUrl);
    // }
  });

  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PT',
    store: 'perfumesecompanhia',
    transform: null,
    domain: 'perfumesecompanhia.pt',
    zipcode: '',
  },
  implementation,
};
