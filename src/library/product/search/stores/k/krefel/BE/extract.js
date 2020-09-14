
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
    const numberOfDivs = await context.evaluate(() => document.querySelectorAll('div[class^="col-md-4"]').length);
    let y = 1;
    let z = 1;
    for (y; numberOfDivs >= y; y++) {
      await context.hover(`section[class="products-overview tile"] > div[class="row"] > div:nth-child(${y})`);
      await context.evaluate(async function (z) {
        const img = document.evaluate(`//div[contains(@class, 'col-md-4')][${z}]//img[@class='product-image']/@src`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        document.querySelector(`section[class="products-overview tile"] > div[class="row"] > div:nth-child(${z})`).setAttribute('img_src', img);
      }, z++);
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
