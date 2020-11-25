const { transform } = require('../../../../shared');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    await new Promise((resolve, reject) => setTimeout(resolve, 750));

    function addElementToDocument(id, value, key) {
      const catElement = document.createElement('div');
      catElement.id = id;
      catElement.innerText = value;
      catElement.setAttribute('content', key);
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };

    const isAvailable = document.querySelector('section.c-filter button[data-action="add-to-bag"]')
      ? document.querySelector('section.c-filter button[data-action="add-to-bag"]') : null;
    // @ts-ignore
    if (isAvailable !== null && isAvailable.innerText === 'Add to bag') {
      addElementToDocument('isAvailable', 'In Stock', 'Yes');
    } else if (document.querySelector('div.sorrymessage')) {
      addElementToDocument('isAvailable', 'Out of Stock', 'No');
    } else {
      addElementToDocument('isAvailable', '', 'No');
    }


    const isImgZoom = document.querySelector('span.hero-zoom')
      ? document.querySelector('span.hero-zoom') : null;
    // @ts-ignore
    if (isImgZoom !== null) {
      addElementToDocument('isImgZoom', 'Yes', 'Yes');
    } else {
      addElementToDocument('isImgZoom', 'No', 'No');
    }

  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    transform: transform,
    domain: 'selfridges.com',
    zipcode: '',
  }, implementation,
};
