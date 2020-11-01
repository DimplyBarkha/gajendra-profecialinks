const { transform } = require('../shared');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log("inputs:: ", inputs);
  const { url, id } = inputs;
  console.log("parameters:: ", parameters);
  if (id) {
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.waitForXPath('//div[@data-impressions="search-results-grid"]//div[@class="product-picture"]/a/@href');
    await context.waitForSelector('div[data-impressions="search-results-grid"] div.product-picture a');
    console.log('everything fine !!!');
    await context.evaluate(() => {
      const firstItem = document.querySelector('div[data-impressions="search-results-grid"] div.product-picture a');
      if (firstItem) {
        firstItem.click();
      }

    });
  }

  await new Promise((resolve, reject) => setTimeout(resolve, 10000));

  // await context.evaluate(async function () {
  //   function addHiddenDiv (id, content) {
  //     const newDiv = document.createElement('div');
  //     newDiv.id = id;
  //     newDiv.textContent = content;
  //     newDiv.style.display = 'none';
  //     document.body.appendChild(newDiv);
  //   }
  //   });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'Avansas',
    transform: transform,
    domain: 'avansas.com',
    zipcode: "''",
  },
  implementation,
};
