
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'notino',
    transform: null,
    domain: 'notino.de',
    zipcode: '',
  },
  implementation,
};
async function implementation(
inputs,
parameters,
context,
dependencies,
) {
const { transform } = parameters;
const { productDetails } = dependencies;
await context.evaluate(async function () {
  function addElementToDocument(key, value) {
    const catElement = document.createElement('div');
    catElement.id = key;
    catElement.textContent = value;
    catElement.style.display = 'none';
    document.body.appendChild(catElement);
    }

  // @ts-ignore
  var a=''
  // @ts-ignore
  const c = document.querySelector('script[type="application/ld+json"]').innerText;
  const jsondata = JSON.parse(c);
  const gtin = jsondata.gtin13;
  if(c.includes('OutOfStock')){
    a="Out of Stock"

  }
  else{
    a= "In Stock"
  }
  addElementToDocument('a', a);
  addElementToDocument('b', gtin);
  // @ts-ignore
  const d = document.querySelector('div[id="pd-price"]').innerText;
  var v=d.replace(',','.')
  addElementToDocument('price', v);


});
return await context.extract(productDetails, { transform });
// return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}
