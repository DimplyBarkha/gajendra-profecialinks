const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log('inputs:: ', inputs);
  let { url, id } = inputs;
  console.log('parameters:: ', parameters);
  if (id) {
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.waitForXPath('//a[@class="productTile "]/@href');

    await context.waitForSelector('a.productTile');
    console.log('everything fine !!!');
    await context.evaluate(() => {
      const firstItem = document.querySelector('a.productTile');
      console.log('https://www.coop.ch/de' + firstItem);
      detailsurl = 'https://www.coop.ch/de' + firstItem;
      console.log('firstItem', firstItem);
      // firstItem.click();
      url = `${detailsurl}#[!opt!]{"first_request_timeout":50000, "force200": true}[/!opt!]`;
      context.goto(url, {
        block_ads: false,
        load_all_resources: true,
        images_enabled: true,
        timeout: 10000,
        waitUntil: 'load',
      });
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'coopathome',
    transform: transform,
    domain: 'coop.ch',
    zipcode: '',
  },
  implementation,
};
