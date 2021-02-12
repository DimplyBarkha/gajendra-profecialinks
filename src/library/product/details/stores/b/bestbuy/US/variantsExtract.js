async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(function () {
    function addHiddenDiv(className, content) {
      const newDiv = document.createElement('div');
      newDiv.className = className;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      return newDiv;
    }
    function addHiddenDivs (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const variantUrls = [];
    const variantUrlArr = [];
    let url = window.location.href;
    const outerDiv = addHiddenDiv('variants_outer', '');
    if (document.querySelector('div.shop-product-variations a.carousel-anchor')) {
      document.querySelectorAll('div.shop-product-variations a.carousel-anchor').forEach(variant => {
        const innerDiv = addHiddenDiv('variants_ul', '');
        let skuId = variant.href.replace(/.*skuId=(.*)/, '$1');
        if (skuId.match(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/)) {
          skuId = skuId.match(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/)[0];
        }
        const skudiv = addHiddenDiv('sku_id', skuId);
        let sku = variant.href;
        if (sku.includes('?')) {
          sku = `${sku.replace(/#(.*)/g, '')}&intl=nosplash`;
        } else {
          sku = `${sku.replace(/#(.*)/g, '')}?intl=nosplash`;
        }
        const skuUrl = addHiddenDiv('sku_url', sku);
        innerDiv.appendChild(skudiv);
        innerDiv.appendChild(skuUrl);
        outerDiv.appendChild(innerDiv);
      });
    } else {
      const allScripts = document.querySelectorAll('script');
      if (allScripts) {
        for (let i = 0; i < allScripts.length; i++) {
          if (allScripts[i].innerText.includes('seoPdpUrl')) {
            variantUrls.push(allScripts[i].innerText.match(/seoPdpUrl\\":\\"(.*?)\\",/g));
          }
        }
        if (variantUrls[0]) {
          variantUrlArr.push(...variantUrls[0]);
        }
        if (variantUrlArr.length) {
          for (let i = 0; i < variantUrlArr.length; i++) {
            let variantUrl = variantUrlArr[i].replace(/seoPdpUrl\\":\\"/g, '').replace(/\\"/g, '').replace(/\\/g, '').replace(/u002Fu002F/, '//').replace(/u002Fu002F/g, '').replace(/u002F/g, '/').replace(',', '');
            if (variantUrl.includes('?')) {
              variantUrl = `${variantUrl}&intl=nosplash`;
            } else {
              variantUrl = `${variantUrl}?intl=nosplash`;
            }
            let variantId = variantUrlArr[i].replace(/.*skuId=(.*)/, '$1').replace(/\\/g, '').replace('/', '').replace(',', '').replace('"', '');
            if (variantId.match(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/)) {
              variantId = variantId.match(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/)[0];
            }
            addHiddenDivs('sku_url2', variantUrl);
            addHiddenDivs('sku_id2', variantId);
          };
        }
      }
    }
    const innerDiv = addHiddenDiv('variants_ul', '');
    let sku = window.location.href
    let skuId = sku.replace(/.*skuId=(.*)/, '$1');
    if (skuId.match(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/)) {
      skuId = skuId.match(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/)[0];
    }
    const skudiv = addHiddenDiv('sku_id', skuId.replace(/#(.*)/g, ''));
    if (sku.includes('?')) {
      sku = `${sku.replace(/#(.*)/g, '')}&intl=nosplash`;
    } else {
      sku = `${sku.replace(/#(.*)/g, '')}?intl=nosplash`;
    }
    let skuUrl = addHiddenDiv('sku_url', sku)
    innerDiv.appendChild(skudiv);
    innerDiv.appendChild(skuUrl);
    outerDiv.appendChild(innerDiv);
    document.body.appendChild(outerDiv);
  }, createUrl);
  return await context.extract(variants);
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    transform: null,
    domain: 'bestbuy.com',
    zipcode: '',
  },
  implementation,
};
