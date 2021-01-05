const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    // wait for all products to load
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // Create Rank/rankOrganic
    const allProducts = document.querySelectorAll("div.findastic-content > div[class='views-row--product-teaser views-row']");
    let x = 1;
    allProducts.forEach(element => {
      // Change price separator
      const priceSelector = element.querySelector('span.price.final-price');
      if (priceSelector) {
        // @ts-ignore
        const newPrice = priceSelector.innerText.replace(/,/, '.');
        // @ts-ignore
        priceSelector.innerText = newPrice;
      }
      const div = element.querySelector('div');
      div.setAttribute('rank', `${x}`);
      x++;
    });
    // Load all thumbnails
    // @ts-ignore
    if (allProducts) {
      for (let y = 0; allProducts.length > y; y++) {
        allProducts[y].scrollIntoView();
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'GR',
    store: 'mymarket',
    transform,
    domain: 'mymarket.gr',
    zipcode: '',
  },
  implementation,
};
