async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { variants } = dependencies;
  await context.evaluate(async function () {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    let skuNumber = document.evaluate('//span[contains(text(),"Online-Artikel-Nr")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    // @ts-ignore
    skuNumber = skuNumber ? skuNumber.innerText.match(/\d+/)[0] : '';
    if (skuNumber) {
      // @ts-ignore
      const dataObj = window.__INITIAL_STATE__.products[skuNumber];
      try {
        if (dataObj) {
          if (dataObj.productVariants) {
            dataObj.productVariants[0].options.forEach(item => {
              console.log('item--->', item);
              addElementToDocument('pd_variantId', item.product.code);
              addElementToDocument('pd_variantUrl', `${window.location.origin}/de/--p${item.product.code}`);
            });
          }
        }
      } catch (error) {
        console.log('Adding element to Dom Failed!!');
      }
    }
  });
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CH',
    store: 'interdiscount',
    transform: null,
    domain: 'interdiscount.ch',
    zipcode: '',
  },
  implementation,
};
