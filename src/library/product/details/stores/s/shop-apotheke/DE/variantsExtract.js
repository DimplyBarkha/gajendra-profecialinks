const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'shop-apotheke',
    transform,
    domain: 'shop-apotheke.com',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(async function () {
    function getElementsByXPath (xpath, parent) {
      const results = [];
      const query = document.evaluate(xpath, parent || document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        const node = query.snapshotItem(i) && query.snapshotItem(i).textContent && query.snapshotItem(i).textContent.trim();
        results.push(node);
      }
      return results.filter(e => e);
    }
    const dataArr = getElementsByXPath('//span[@data-qa-id="product-attribute-pzn"]|//div[@id="h_ProductVariants"]//ul//li//*/@data-product-variant-id');
    dataArr.forEach(element => {
      const newlink = document.createElement('a');
      newlink.setAttribute('class', 'variants');
      newlink.href = `https://www.shop-apotheke.com/arzneimittel/${element}`;
      newlink.innerHTML = element;
      document.body.appendChild(newlink);
    });
  }, createUrl);
  return await context.extract(variants);
}
