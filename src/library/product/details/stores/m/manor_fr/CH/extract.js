const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'manor_fr',
    transform: cleanUp,
    domain: 'manor.ch',
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
    // Single Pipe Concatenation
    const pipeSeparatorSingle = (id, data) => {
      var singleSeparatorText = data.join(' | ');
      addElementToDocument(id, singleSeparatorText);
    };
    // space Pipe Concatenation
    const spaceSeparatorSingle = (id, data) => {
      var singleSeparatorText = data.join(' ');
      addElementToDocument(id, singleSeparatorText);
    };
    // Method to Retrieve Xpath content of a Multiple Nodes
    const getAllXpath = (xpath, prop) => {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const result = [];
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
        const element = nodeSet.snapshotItem(index);
        if (element) result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
    };

    // @ts-ignore
    const nameEmpty = document.querySelectorAll('div[class="m-productdetailareaa__areaA__title-line g-col g-col-1"] h1')[0].innerText;
    addElementToDocument('nameEmpty', nameEmpty);

    // @ts-ignore
    const scriptData = window.dataLayer[0];
    addElementToDocument('gtin', scriptData.transactionProducts[0].ean);
    const variants = getAllXpath('//div[@class="m-productcolorselect-v-2__colors js-only-colors"]/div/a/@title', 'nodeValue');
    pipeSeparatorSingle('variants', variants);

    try {
       // @ts-ignore
      const allData = window.dataLayer;
      // @ts-ignore
      let name = document.querySelectorAll('div[class="m-productdetailareaa__areaA__title-line g-col g-col-1"]')[0].innerText;
      if (name !== null && name.length > 0) {
        let size, color;
        try {
          size = allData[0].transactionProducts[0].size;
          if (size != 'none') {
            addElementToDocument('size', size);
            name = name + ' ' + size;
          }
        } catch (error) {

        }
        try {
          color = allData[0].transactionProducts[0].colour;
          if (color != 'none') {
            addElementToDocument('variantInformation', color);
            name = name + ' ' + color;
          }
        } catch (error) {

        }
        addElementToDocument('name', name);
      }
    } catch (error) {

    }
    let alternateImages = [];
    let temp;
    try {
      const alImages = document.querySelectorAll('div[class="m-productgallery__thumbnails__single__bg"]');
      for (let i = 0; i < alImages.length; i++) {
        // @ts-ignore
        temp = alImages[i].style.backgroundImage;
        if (temp !== null && temp.length > 0) {
          temp = temp.replace(/url\("/g, '');
          temp = temp.replace('")', '');
          alternateImages.push(temp);
        }
      }
    } catch (error) {

    }
    addElementToDocument('Images', alternateImages[0]);
    for (let k = 1; k < alternateImages.length; k++) {
      addElementToDocument('alternateImages', alternateImages[k]);
    }
    try {
      // @ts-ignore
      const specifications = document.querySelector('div[class="m-productfactslist"]').innerText;
      addElementToDocument('specifications', specifications);
    } catch (error) {

    }
    try {
      const descriptionFinal = [];
      const description = getAllXpath('//div[@class="m-productdescription__description js-desc"]//text()[not(ancestor::span)]', 'nodeValue');
      for (let i = 0; i < description.length; i++) {
        if (description[i].length > 1) {
          descriptionFinal.push(description[i]);
        }
      }
      spaceSeparatorSingle('description', descriptionFinal)
    } catch (error) {

    }
    try {
      const ingredientsList = getAllXpath('//span[@class="m-productfacts__single__name" and contains(text(),"Zutaten")]/parent::div/div/span/text() | //span[@class="m-productfacts__single__name" and contains(text(),"Ingrédients")]/parent::div/div/span/text()', 'nodeValue');
      addElementToDocument('ingredientsList', ingredientsList[0]);
    } catch (error) {
      
    }
  });
  return await context.extract(productDetails, { transform });
}



