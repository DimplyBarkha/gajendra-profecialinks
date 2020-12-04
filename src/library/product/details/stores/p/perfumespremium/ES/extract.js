const { transform } = require('../../../../shared');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;


  await context.evaluate(async () => {
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    const productUrl = window.location.href ? window.location.href : null;
    addElementToDocument('url', productUrl);


    const productOtherInfo = document.querySelectorAll('tbody tr');
    const trArr = [productOtherInfo];
    const trArrSliced = trArr.slice(1);
    productOtherInfo.forEach(e => trArrSliced.push(e.textContent));
    const concatDesc = trArrSliced.join(' || ');
    addElementToDocument('productOtherInfo', concatDesc);

    const imgZoom = document.querySelector('div[data-gallery-role=magnifier-zoom]') ? 'div[data-gallery-role=magnifier-zoom]' : null;
    if (imgZoom !== null) {
      addElementToDocument('imgzoom', 'Yes')
    } else {
      addElementToDocument('imgzoom', 'No')
    }
  });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'perfumespremium',
    transform: transform,
    domain: 'perfumespremium.es',
    zipcode: '',
  },
  implementation,
};
