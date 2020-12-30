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
    if (document.querySelector('div.shop-product-variations a.carousel-anchor')) {
      document.querySelectorAll('div.shop-product-variations a.carousel-anchor').forEach(variant => {
        const innerDiv = addHiddenDiv('variants_ul', '');
        const skuId = variant.href.replace(/.*skuId=(.*)/, '$1');
        const skudiv = addHiddenDiv('sku_id', skuId);
        const skuUrl = addHiddenDiv('sku_url', variant.href);
        innerDiv.appendChild(skudiv);
        innerDiv.appendChild(skuUrl);
        outerDiv.appendChild(innerDiv);
      });
    }
    const innerDiv = addHiddenDiv('variants_ul', '');
    const sku = window.location.href
    const skuId = sku.replace(/.*skuId=(.*)/, '$1');
    const skudiv = addHiddenDiv('sku_id', skuId);
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
