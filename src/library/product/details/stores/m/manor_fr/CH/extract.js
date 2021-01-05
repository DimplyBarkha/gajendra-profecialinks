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
      const name = document.querySelectorAll('div[class="m-productdetailareaa__areaA__title-line g-col g-col-1"]')[0].innerText;
      if (name !== null && name.length > 0) {
        addElementToDocument('name', name);
      }
    } catch (error) {

    }
    try {
      // @ts-ignore
      let size = document.querySelector('span[class="m-productsizeselect-v-2__title"]').outerText.replace(/INHALT: /g, '')
      if (size !== null && size.length > 0 && !size.includes('INHALT')) {
        addElementToDocument('size', size);
      }
      else {
        // @ts-ignore
        size = document.querySelector('a[class="m-productsizeselect-v-2__variant m-productsizeselect-v-2__variant__title js-size-selector-title"]').outerText
        if (size !== null && size.length > 0) {
          addElementToDocument('size', size);
        }
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
      const specifications=document.querySelector('div[class="m-productfactslist"]').innerText;
      addElementToDocument('specifications', specifications);
    } catch (error) {
      
    }
  });
  return await context.extract(productDetails, { transform });
}



