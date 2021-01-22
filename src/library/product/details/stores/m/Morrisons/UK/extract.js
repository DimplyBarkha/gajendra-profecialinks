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

    /** Function used to extract all paragraph's text between two given titles.
   * If no 'startTitle' provided, it starts adding from the beginning.
   * If no 'stopTitle' provided, it doesn't stop and adds everything to the end
   * @param {object} node Parent node of all elements we want to iterate over
   * @param {Array} startTitle List of paragraph's textContent that once we meet we start adding following paragraph's text
   * @param {Array} stopTitleArray Lisf of paragraph's textContent that once we meet we stop adding following paragraph's text
   */

    const addFollowingParagraphs = (key, node, startTitle, stopTitleArray) => {
      const elements = document.createElement('div');
      elements.id = key;
      let reading;
      const allElements = node.childNodes;
      for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];
        if (!startTitle || startTitle.some((startTitleElem) => element.textContent.toLowerCase().trim() === startTitleElem.toLowerCase())) reading = true;
        if (stopTitleArray && stopTitleArray.length && stopTitleArray.some((stopTitleElem) => element.textContent.toLowerCase().trim() === stopTitleElem.toLowerCase())) break;
        if (reading) {
          elements.appendChild(element.cloneNode(true));
        }
      }
      document.body.appendChild(elements);
    };

    const warningParentDiv = document.querySelector('div.bop-productDetails div:nth-child(2) > div.gn-accordionElement__content.gn-accordionElement__content > div.gn-accordionElement__wrapper > div:last-child >div.bop-info__content');
    const warningHeading = ['Safety Warning:'];
    const warningEnd = ['Origin:', 'Usage:', 'Additional Information:'];
    console.log(warningParentDiv);
    if (warningParentDiv) addFollowingParagraphs('warnings', warningParentDiv, warningHeading, warningEnd);

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
  if (dataRef[0].group[0].totalSugarsPerServing === undefined) {
    delete dataRef[0].group[0].totalSugarsPerServing;
  } else if (dataRef[0].group[0].totalSugarsPerServing[0]) {
    dataRef[0].group[0].totalSugarsPerServing[0].text = dataRef[0].group[0].totalSugarsPerServing[0].text.replace('g', '').trim();
  }
  if (dataRef[0].group[0].totalFatPerServing === undefined) {
    delete dataRef[0].group[0].totalFatPerServing;
  } else if (dataRef[0].group[0].totalFatPerServing[0]) {
    dataRef[0].group[0].totalFatPerServing[0].text = dataRef[0].group[0].totalFatPerServing[0].text.replace('g', '').trim();
    dataRef[0].group[0].totalFatPerServing[0].text = dataRef[0].group[0].totalFatPerServing[0].text.replace('%', '').trim();
    dataRef[0].group[0].totalFatPerServing[0].text = dataRef[0].group[0].totalFatPerServing[0].text.replace('<', '').trim();
  }
  if (dataRef[0].group[0].warnings === undefined) {
    delete dataRef[0].group[0].warnings;
  } else if (dataRef[0].group[0].warnings[0]) {
    dataRef[0].group[0].warnings[0].text = dataRef[0].group[0].warnings[0].text.replace('Safety Warning:', '').trim();
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
