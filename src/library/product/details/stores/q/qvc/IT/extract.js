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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await context.evaluate(async (index, variants) => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      var descNode = document.evaluate("//div[@class='tab-pane-title' and contains(.,'Descrizione')]/following-sibling::div[@class='tab-pane-content']", document, null, XPathResult.ANY_TYPE, null);
      var descEle = descNode.iterateNext();
      if (index == 0 && descEle) {
        // @ts-ignore
        const description = descEle.innerHTML.replace(/<li.*?>/gm, '|| ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/&nbsp;/gm, '').replace(/\s{2,}/gm, ' ').trim();
        description && addHiddenDiv('ii_desc', description);
      }
      const productVariable = JSON.parse(document.querySelector("meta[name='data-product-details']").getAttribute('content'));
      if (variants > 1) {
        let newText = 'Out Of Stock';
        const currentAvail = productVariable.sku[index].inventory.stockPhase;
        if (currentAvail.trim() == 'InStock') {
          newText = 'In Stock';
        }
        addHiddenDiv('availabilityText', newText);
      } else {
        var availNode = document.evaluate("//div[contains(@class,'inventory') and not(contains(@class,'hide'))]/span | //div[contains(@class,'alert-stock') and not(contains(@class,'hide'))]/span ", document, null, XPathResult.ANY_TYPE, null);
        const descEle = availNode.iterateNext();
        if (descEle) {
          addHiddenDiv('availabilityText', descEle.textContent);
        } else {
          addHiddenDiv('availabilityText', 'Out of Stock');
        }
      }
      addHiddenDiv('sku', productVariable.sku[index].sku);
      addHiddenDiv('ratingCount', productVariable.summaryReview.totalReviews);
      addHiddenDiv('aggregateRating', productVariable.summaryReview.summaryRating);
      addHiddenDiv('variantCount', productVariable.sku.length);
      const account = document.querySelectorAll('a[data-account-id]:not([data-account-id=""])');

      productVariable.assets.forEach(element => {
        if (element.type === 'video') {
          const dataAccountId = account[0].getAttribute('data-account-id');
          const dataPlayerId = account[0].getAttribute('data-player-id');
          const url = 'https://players.brightcove.net/' + dataAccountId + '/' + dataPlayerId + '_default/index.html?videoId=' + element.id;
          addHiddenDiv('video', url);
        }
      });

      if (productVariable.sku.length > 1 && index == 0) {
        productVariable.sku.forEach(element => {
          addHiddenDiv('ii_variants', element.sku);
        });
        productVariable.assets.forEach(element => {
          if (element.type == 'image') {
            addHiddenDiv('ii_secondary_image', element.url);
          }
        });
      }

      if (productVariable.sku.length > 1) { // done
        addHiddenDiv('ii_sku', productVariable.sku[0].sku);
      }

      if (productVariable.sku.length == 1) {
        for (let i = 0; i < productVariable.assets.length; i++) {
          if (productVariable.assets[i].sequence == 0 && productVariable.assets[i].type == 'image') {
            addHiddenDiv('primary_image', productVariable.assets[i].url);
          } else if (productVariable.assets[i].type == 'image') {
            addHiddenDiv('ii_secondary_image', productVariable.assets[i].url);
          }
        }
      }
   if (document.querySelector('a.btn.btn-primary')) {
      document.querySelector('a.btn.btn-primary').click();
    }
      function addFields (index) {
        addHiddenDiv('brandText', productVariable.brand.name);
        if (productVariable.sku.length > 1) {
          addHiddenDiv('ii_color', productVariable.sku[index].variantAxis[0].variantName);
          addHiddenDiv('ii_colorCode', productVariable.sku[index].variantAxis[0].variantCode);
          for (let i = 0; i < productVariable.assets.length; i++) {
            if (productVariable.assets[i].type == 'image') {
              if (productVariable.sku[index].variantAxis[0].variantCode == productVariable.assets[i].tags[0] && productVariable.assets[i].sequence == 0) {
                addHiddenDiv('primary_image', productVariable.assets[i].url);
              }
            }
          }
        }
      }
      await addFields(index);
    }, index, variants);
  }
  for (let index = 0; index < variants - 1; index++) {
    await preparePage(index, variants);
    await context.extract(productDetails, { transform }, { type: 'APPEND' });
  }
  variants <= 1 && await preparePage(0, variants);
  variants > 1 && await preparePage(variants - 1, variants);
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
