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
    const scriptHTML = document.evaluate('//script[contains(text(),"skus")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    // const scriptHTML = document.querySelectorAll('//div[@class="product-highlights-wrapper"]//ul[@class="page-product-options-group list-inline"]//a/@href');
    const JSstring = scriptHTML && scriptHTML.textContent ? scriptHTML.textContent.split('var skus = ')[1].split(';')[0] : '';
    const idArr = JSstring ? JSstring.match(/id:\s\d+/g) : '';
    if (idArr.length !== 0) {
      for (let i = 0; i < idArr.length; i++) {
        const sku = idArr[i].replace(/[^\d+]/g, '');
        const pagePrefixUrl = window.location.href.replace(/\d+$/g, '');
        const variantUrl = pagePrefixUrl.concat(sku);
        addHiddenDiv('variantUrl', variantUrl);
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
