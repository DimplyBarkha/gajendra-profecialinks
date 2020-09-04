
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'MX',
    store: 'bestbuy',
    transform: null,
    domain: 'bestbuy.com.mx',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(async (parentInput) => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    let skus = document.querySelectorAll('div.variant-img-box img');
    let arrayUrl;
    let arrayUrlFinal;
    let url = window.location.href;
    arrayUrl = url ? url.split('/') :'';
    // @ts-ignore
    arrayUrl.pop();
    console.log('arrayUrl: ', arrayUrl);
    // @ts-ignore
    arrayUrlFinal = arrayUrl.join('/');
    console.log('arrayUrlFinal: ', arrayUrlFinal);
    for (let index = 0; index < skus.length; index++) {
      // @ts-ignore
      const element = skus[index].getAttribute('data-sku');
      console.log('element: ', element);
      addElementToDocument('pd_variantid',element);
      addElementToDocument('pd_variantUrl',arrayUrlFinal+'/'+element);
    }
    
  });
  return await context.extract(variants, { transform });
}