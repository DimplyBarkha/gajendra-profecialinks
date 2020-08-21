
const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    transform,
    domain: 'flaconi.de',
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

    function addElementToDocument1 (key, value) {
      const catElement1 = document.createElement('ul[id="makeup-color-list"] li a div');
      catElement1.id = key;
      catElement1.textContent = value;
      catElement1.style.display = 'none';
      document.body.appendChild(catElement1);
    }
    function addElementToDocument2 (key, value) {
      const catElement2 = document.createElement('ul[class="product-list multiple-variants"] li');
      catElement2.id = key;
      catElement2.textContent = value;
      catElement2.style.display = 'none';
      document.body.appendChild(catElement2);
    }
    let skuList1 = document.querySelectorAll('ul[id="makeup-color-list"] li a');
    let skuList2 = document.querySelectorAll('ul[class="product-list multiple-variants"] li');
    let sku = [];
    if(skuList1.length !== 0){
      // @ts-ignore
      sku = skuList1;
      for (let index = 0; index < sku.length; index++) {
        let element = sku[index];
        // @ts-ignore
        element = element ? element.getAttribute('data-sku') : '';
        addElementToDocument1('fl_variantUrl1',element)
      }
    }else if(skuList2.length !== 0){
      // @ts-ignore
      sku = skuList2;
      for (let index = 0; index < sku.length; index++) {
        let element = sku[index];
        // @ts-ignore
        element = element ? element.getAttribute('data-sku') : '';
        addElementToDocument2('fl_variantUrl2',element)
      }
    }
    
  });
  return await context.extract(variants, { transform });
}
