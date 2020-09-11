module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'MX',
    store: 'mercadolibre',
    transform: null,
    domain: 'mercadolibre.com.mx',
    zipcode: '',
  },
  implementation
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(async (parentInput) => {
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    let skusList1 = document.querySelectorAll('div[class="ui-pdp-variations"] div[class="ui-pdp-variations__picker"] a');
    console.log('skusList1: ', skusList1);
    let skusList2 = document.querySelectorAll('div.ui-pdp-thumbnail--BLOCKED');
    console.log('skusList2: ', skusList2);
    let skus = [];
    if (skusList1 && skusList2) {
       // @ts-ignore
       skus = [...skusList1, ...skusList2]
       // @ts-ignore
       console.log('skus: ', skus);
    }
    else if(skusList1){
      console.log("In else if")
      // @ts-ignore
      skus = skusList1;
    }else {
      // @ts-ignore
      skus = skusList2;
    }
    for (let index = 0; index < skus.length; index++) {
      // @ts-ignore
      let element = skus[index].getAttribute('href');
      if (element.includes('https:')) {
        element = element;
      } else {
        element = 'https://www.mercadolibre.com.mx' + element
      }
      addElementToDocument('pd_variantid', element);
      addElementToDocument('pd_variantUrl', element);
    }

  });
  return await context.extract(variants, { transform });
}