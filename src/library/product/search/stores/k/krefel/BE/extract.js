
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'krefel',
    transform: null,
    domain: 'krefel.be',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const numberOfResults = document.querySelectorAll('div[class^="col-md-4"]');
      for (let x = 0; numberOfResults.length > x; x++) {
        numberOfResults[x].classList.replace('col-md-4', 'col-md-1');
        // @ts-ignore
        numberOfResults[x].style.height = '20px';
      }
      window.scroll(1, 1);
    });
    await context.evaluate(async function () {
      const allProducts = document.querySelectorAll('div[class^="col-md-1"]');
      let x;
      for (x = 0; allProducts.length - 1 >= x; x++) {
        allProducts[x].setAttribute('count', `${x + 1}`);
      }
    });

    return await context.extract(productDetails);
  },
};
