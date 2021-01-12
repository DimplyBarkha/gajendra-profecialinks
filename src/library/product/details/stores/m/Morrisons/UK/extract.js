const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function addElementToDocument (id, value, key) {
      const catElement = document.createElement('div');
      catElement.id = id;
      catElement.innerText = value;
      catElement.setAttribute('content', key);
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    const warningParentDiv = document.querySelector('div.gn-accordionElement__wrapper div.gn-content:last-child');
    const warningDiv = warningParentDiv.querySelector('div').innerText;
    if (warningDiv.match(/(Safety Warning:)([\s\S]+)Origin/) != null) {
      addElementToDocument('warnings', warningDiv.match(/(Safety Warning:)([\s\S]+)Origin/)[2]);
    }

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

    const addCalories = async () => {
      const table = document.querySelector('.bop-nutritionData__origin > table');
      if (table) {
        const energyHeadings = document.evaluate(
          '//td[contains(., "Energy")]',
          document,
          null,
          XPathResult.ANY_TYPE,
          null,
        );
        const energyElementTD = energyHeadings.iterateNext();
        let energyValue = energyElementTD.nextSibling.textContent;
        const tableSecondRowFirstTD =
          energyElementTD.parentElement.nextElementSibling.firstChild;
        // if tableSecondRowFirstTD is empty or includes 'Energy', it is another row for energy
        if (
          !tableSecondRowFirstTD.textContent ||
          tableSecondRowFirstTD.textContent.includes('Energy')
        ) {
          energyValue =
            energyValue + '/' + tableSecondRowFirstTD.nextSibling.textContent;
        }
        energyValue = energyValue.replace(/ /g, '');

        const regexDoubleSlash = /\/\//;
        if (energyValue.match(regexDoubleSlash)) {
          energyValue = energyValue.replace(/\/\//g, '/');
          console.log(energyValue);
        }
        addElementToDocument('caloriesValue', '', energyValue);
      }
    };
    addCalories();
  });

  // return await context.extract(productDetails, { transform });
  const dataRef = await context.extract(productDetails, { transform });

  if (dataRef[0].group[0].alcoholContent === undefined) {
    delete dataRef[0].group[0].alcoholContent;
  } else if (dataRef[0].group[0].alcoholContent[0]) {
    dataRef[0].group[0].alcoholContent[0].text = dataRef[0].group[0].alcoholContent[0].text + '% | ' + dataRef[0].group[0].alcoholContent[0].text;
  }
  return dataRef;
}

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
