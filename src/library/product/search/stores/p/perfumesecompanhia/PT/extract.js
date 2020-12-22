
const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // Without such high wait when you search by brand name site will often not have enough time to load.
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));

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
      const productsOnPage = document.querySelectorAll('div.col.active').length;
      var check = howMuch === undefined ? true : (productsOnPage < howMuch);
      console.log(productsOnPage);
      if (moreProductsButton && check) {
        moreProductsButton.click();
        console.log('click done')
        await stall(5000);
        loadAllProducts(howMuch);
      }
    };

    // if you want to load
    await loadAllProducts(150);

    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    const addProp = (selector, iterator, propName, value) => {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    };

    const curentUrl = window.location.href;

    const allProducts = document.querySelectorAll('div.col.active');
    console.log(allProducts.length)
    for (let i = 0; i < allProducts.length; i++) {
      console.log(`All products length is ${allProducts.length}`);
      addProp('div.col.active', i, 'searchurl', curentUrl);
      // addProp('span.c3-product__name', i, 'searchurl', curentUrl);
    }
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
