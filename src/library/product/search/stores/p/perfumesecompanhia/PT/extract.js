
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
    const addProp = (selector, iterator, propName, value) => {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    };

    let productsBeforeUploading = 0;

    const loadAllProducts = async (howMuch) => {
      const moreProductsButton = document.querySelector('button#btnVerMais');
      const productsOnPage = document.querySelectorAll('div.col.active').length;
      var check = howMuch === undefined ? true : (productsOnPage < howMuch);
      console.log(productsOnPage);
      const currentUrl = window.location.href;
      // since the searchurl changes after loading more records and the old records become assigned to the newest url, it is neceaary to link the urls before the click event
      for (let i = productsBeforeUploading; i < productsOnPage; i++) {
        console.log(`All products length is ${productsOnPage}`);
        console.log(currentUrl);
        console.log(productsOnPage);
        console.log(productsBeforeUploading);
        addProp('div.col.active', i, 'searchurl', currentUrl);
      }
      productsBeforeUploading = productsOnPage;
      if (moreProductsButton.style.display !== 'none' && check) {
        moreProductsButton.click();
        console.log('click done');
        await stall(5000);
        loadAllProducts(howMuch);
      }
    };
    // if you want to load
    await loadAllProducts(150);
    // it is necessary to set such a big wait time - shorter time limits numer of collected records and there is a lot of epmty searchurls
    await new Promise((resolve, reject) => setTimeout(resolve, 20000));
    // rating
    const allProducts = document.querySelectorAll('div.col.active');
    allProducts.forEach((product) => {
      const rating = product.querySelector(':scope .star-ratings-css-top');
      if (rating) {
        const percentage = rating.style.width;
        const re = /\d+.?\d+(?=%)/;
        const valuePercent = re.exec(percentage);
        const value = (Math.round((valuePercent/100*5 + Number.EPSILON)*100)/100).toFixed(2);
        product.setAttribute('rating', value);
      }
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PT',
    store: 'perfumesecompanhia',
    transform: transform,
    domain: 'perfumesecompanhia.pt',
    zipcode: '',
  },
  implementation,
};
