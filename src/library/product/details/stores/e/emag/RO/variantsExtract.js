async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }
    const skuArr = [];
    let uniqueVariantIds = [];
    const variantElements = document.querySelectorAll('div.product-highlights-wrapper ul.page-product-options-group.list-inline a');
    var scriptText = document.evaluate('//script[contains(.,"offer_id")]', document, null, XPathResult.STRING_TYPE, null).stringValue;
    const variantIds = scriptText.match(/offer_id":(.+?),/g);
    if (variantIds) {
      uniqueVariantIds = variantIds.filter(function onlyUnique (value, index, self) {
        return self.indexOf(value) === index;
      });
    }

    variantElements.forEach(element => {
      skuArr.push(element.getAttribute('href').match(/pd\/(.+)\//)[1]);
    });
    if (skuArr.length !== 0 && uniqueVariantIds.length !== 0) {
      for (let i = 0; i < skuArr.length; i++) {
        const pagePrefixUrl = window.location.href.replace(/pd\/.+\//g, `pd/${skuArr[i]}/`);
        addHiddenDiv('variantUrl', pagePrefixUrl);
        addHiddenDiv('variantId', uniqueVariantIds[i]);
      }
    }
  }, createUrl);
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'RO',
    store: 'emag',
    transform: null,
    domain: 'emag.ro',
    zipcode: '',
  },
  implementation,
};
