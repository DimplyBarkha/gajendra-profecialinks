
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
    const hoverDivs = await context.evaluate(async function (y) {
      const allProducts = document.querySelectorAll('div[class^="col-md-4"]');
      hoverDivs[y].setAttribute('abc', `${y}`);
      return allProducts;
    });
    for (let y = 1; hoverDivs.length <= y; y++) {
      hoverDivs;
    }
    await context.evaluate(async function () {
      const allProducts = document.querySelectorAll('div[class^="col-md-4"]');
      let x;
      for (x = 0; allProducts.length - 1 >= x; x++) {
        allProducts[x].setAttribute('count', `${x + 1}`);
      }
    });

    return await context.extract(productDetails);
  },
};
