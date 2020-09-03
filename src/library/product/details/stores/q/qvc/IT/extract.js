/* eslint-disable eqeqeq */
const { transform } = require('./shared');

async function implementation (
  // @ts-ignore
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const variants = await context.evaluate(async () => {
    console.log('Length of all', document.querySelectorAll("meta[name='data-product-details']").length);
    return (document.querySelectorAll("meta[name='data-product-details']")) ? JSON.parse(document.querySelector("meta[name='data-product-details']").getAttribute('content')).sku.length : 0;
  });
  console.log('Length', variants);
  async function preparePage (index, variants) {
    await context.evaluate(async (index) => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      const productVariable = JSON.parse(document.querySelector("meta[name='data-product-details']").getAttribute('content'));

      addHiddenDiv('sku', productVariable.sku[index].sku);
      addHiddenDiv('price', productVariable.price[0].value);
      addHiddenDiv('availabilityText', productVariable.sku[index].inventory.stockPhase);
      addHiddenDiv('ratingCount', productVariable.summaryReview.totalReviews);
      addHiddenDiv('aggregateRating', productVariable.summaryReview.summaryRating);

      const account = document.querySelectorAll('a[data-account-id]:not([data-account-id=""])');

      productVariable.assets.forEach(element => {
        if (element.type === 'video') {
          const dataAccountId = account[0].getAttribute('data-account-id');
          const dataPlayerId = account[0].getAttribute('data-player-id');
          const url = 'https://players.brightcove.net/' + dataAccountId + '/' + dataPlayerId + '_default/index.html?videoId=' + element.id;
          addHiddenDiv('video', url);
        }
      });

      if (productVariable.sku.length > 1) {
        addHiddenDiv('ii_sku', productVariable.sku[0].sku);
        addHiddenDiv('variantCount', productVariable.sku.length);
        addHiddenDiv('ii_variants', productVariable.sku[index].sku);
      }

      // eslint-disable-next-line eqeqeq
      if (productVariable.sku.length == 1) {
        for (let i = 0; i < productVariable.assets.length; i++) {
          if (productVariable.assets[i].sequence == 0 && productVariable.assets[i].type == 'image') {
            addHiddenDiv('primary_image', productVariable.assets[i].url);
          } else if (productVariable.assets[i].type == 'image') {
            addHiddenDiv('ii_secondary_image', productVariable.assets[i].url);
          }
        }
      }

      function addFields (index) {
        addHiddenDiv('description', productVariable.description);
        addHiddenDiv('brandText', productVariable.brand.name);
        if (productVariable.sku.length > 1) {
          addHiddenDiv('ii_color', productVariable.sku[index].variantAxis[0].variantName);
          addHiddenDiv('ii_colorCode', productVariable.sku[index].variantAxis[0].variantCode);
          for (let i = 0; i < productVariable.assets.length; i++) {
            if (productVariable.sku[index].variantAxis[0].variantCode == productVariable.assets[i].tags[0] && productVariable.assets[i].sequence == 0 && productVariable.assets[i].type == 'image') {
              addHiddenDiv('primary_image', productVariable.assets[i].url);
            } else if (productVariable.sku[index].variantAxis[0].variantCode == productVariable.assets[i].tags[0] && productVariable.assets[i].type == 'image') {
              addHiddenDiv('ii_secondary_image', productVariable.assets[i].url);
            }
          }
        }
      }
      await addFields(index);
    }, index, variants);
  }
  for (let index = 0; index < variants - 1; index++) {
    await preparePage(index);
    await context.extract(productDetails, { transform }, { type: 'APPEND' });
  }
  variants <= 1 && await preparePage(0);
  variants > 1 && await preparePage(variants - 1);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'qvc',
    transform,
    domain: 'qvc.it',
    zipcode: '',
  },
  implementation,
};
