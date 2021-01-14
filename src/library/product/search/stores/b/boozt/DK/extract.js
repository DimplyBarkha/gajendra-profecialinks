const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const info = await context.evaluate(async function () {
    const info = document.querySelector('script[type="application/ld+json"]') ? JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent) : '';
    return info;
  });
  const skuArray = [];
  const gtinArray = [];
  for (let i = 0; i < info.itemListElement.length; i++) {
    skuArray.push(info.itemListElement[i].item.sku);
    gtinArray.push(info.itemListElement[i].item.gtin8);
  };
  var data = await context.extract(productDetails, { transform });
  for (let i = 0; i < data[0].group.length; i++) {
    if (data[0].group[i].price) {
      if (data[0].group[i].price[0].text.includes('fra')) {
        data[0].group[i].price[0].text = data[0].group[i].price[0].text.replace(/fra /, '');
      }
    }
    if (data[0].group[i].id) {
      data[0].group[i].id[0].text = skuArray[i];
    }
    if (data[0].group[i].gtin) {
      data[0].group[i].gtin[0].text = gtinArray[i];
    }
  }
  return data;
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'boozt',
    transform: transform,
    domain: 'boozt.com',
    zipcode: '',
  },
  implementation,
};
