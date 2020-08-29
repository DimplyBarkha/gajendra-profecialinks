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
    let url = window.location.href;
    const outerDiv = addHiddenDiv('variants_outer', '');
    if (document.querySelector('div.ProductSwatches__Cell div[class=""] img')) {
      document.querySelectorAll('div.ProductSwatches__Cell div[class=""] img').forEach(variant => {
        const skuId = variant.src.replace(/.*\/(.*?)\?.*/, '$1');
        const skudiv = addHiddenDiv('sku_id', skuId);
        const skuUrl = addHiddenDiv('sku_url', `${url}&sku=${skuId}`);
        const innerDiv = addHiddenDiv('variants_ul', '');
        innerDiv.appendChild(skudiv);
        innerDiv.appendChild(skuUrl);
        outerDiv.appendChild(innerDiv);
      });
    } else {
      const sku = document.querySelector('div.ProductMainSection__itemNumber');
      const skuId = sku ? sku.innerText.replace(/Item\s*(.*)/, '$1') : '';
      const skudiv = addHiddenDiv('sku_id', skuId);
      let skuUrl;
      if (skuId) {
        skuUrl = addHiddenDiv('sku_url', `${url}&sku=${skuId}`);
      } else {
        skuUrl = addHiddenDiv('sku_url', url);
      }
      const innerDiv = addHiddenDiv('variants_ul', '');
      innerDiv.appendChild(skudiv);
      innerDiv.appendChild(skuUrl);
      outerDiv.appendChild(innerDiv);
    }
    document.body.appendChild(outerDiv);
  }, createUrl);
  return await context.extract(variants);
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'ulta',
    transform: null,
    domain: 'ulta.com',
    zipcode: '',
  },
  implementation,
};
