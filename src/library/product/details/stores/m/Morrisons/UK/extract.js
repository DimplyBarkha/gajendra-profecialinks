

const { cleanUp } = require('../../../../shared');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {

    function addElementToDocument(id, value, key) {
      const catElement = document.createElement('div');
      catElement.id = id;
      catElement.innerText = value;
      catElement.setAttribute('content', key);
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };


    let warningParentDiv = document.querySelector('div.gn-accordionElement__wrapper div.gn-content:last-child');
    let warningDiv = warningParentDiv.querySelector("div").innerText;
    addElementToDocument('warnings', warningDiv.match(/(Safety Warning:)([\s\S]+)Origin/)[2]);

    const isAvailable = document.querySelector('li > div.basketControls__wrapper > button.gn-button--buy')
      ? document.querySelector('li > div.basketControls__wrapper > button.gn-button--buy') : null;
    // @ts-ignore
    if (isAvailable !== null && isAvailable.textContent === 'Add to trolley') {
      addElementToDocument('isAvailable', 'In Stock', 'Yes');
    } else if (document.querySelector('div.bop-outOfStock')) {
      addElementToDocument('isAvailable', 'Out Of Stock', 'No');
    } else {
      addElementToDocument('isAvailable', '', 'No');
    }

  });

  // return await context.extract(productDetails, { transform });
  const dataRef = await context.extract(productDetails, { transform });
  if (dataRef[0].group[0].caloriesPerServing[0].text === "") {
    delete dataRef[0].group[0].caloriesPerServing;
  }
  if (dataRef[0].group[0].alcoholContent == undefined) {
    delete dataRef[0].group[0].alcoholContent
  } else if (dataRef[0].group[0].alcoholContent[0]) {
    dataRef[0].group[0].alcoholContent[0].text = dataRef[0].group[0].alcoholContent[0].text + "% | " + dataRef[0].group[0].alcoholContent[0].text;
  }
  return dataRef;
};

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'morrisons',
    transform: cleanUp,
    domain: 'groceries.morrisons.com',
    zipcode: '',
  },
  implementation,
};