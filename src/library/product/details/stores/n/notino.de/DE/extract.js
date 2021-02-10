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
    var a = ''
    // @ts-ignore
    const c = document.querySelector('script[type="application/ld+json"]').innerText;
    console.log(c, 'ggggggggggggggg')
    // @ts-ignore
    if (c.includes('OutOfStock')) {
      a = "Out of Stock"
    }
    else {
      a = "In Stock"
    }
    addElementToDocument('a', a);
  });
  return await context.extract(productDetails, { transform });
  // return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}