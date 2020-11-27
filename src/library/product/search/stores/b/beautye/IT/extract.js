const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await new Promise(resolve => setTimeout(resolve, 2000));

  // await context.waitForSelector('div>ol>li.product-item');
  await context.evaluate(async function () {
    function addElementToDocument (doc, key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      doc.appendChild(catElement);
    }

    // function to get the json data from the string
    function findJsonData (startString, endString) {
      try {
        const xpath = '//script[@data-ommit="true"][contains(.,"impressions")]';
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const scriptContent = element.textContent;
        const startIdx = scriptContent.indexOf(startString);
        const endIdx = scriptContent.indexOf(endString);
        let jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
        jsonStr = jsonStr.trim();
        return JSON.parse(jsonStr);
      } catch (error) {
        console.log(error.message);
      }
    }
    // elements from data Layer object
    const dataObj = findJsonData('(', ');')
    const data = dataObj.ecommerce.impressions;
    console.log('data ===', JSON.stringify(dataObj));
    const arr = document.querySelectorAll('div>ol>li.product-item');
    for (let i = 0; i < arr.length; i++) {
      const doc = arr[i];
      addElementToDocument(doc, 'added-id', data[i].id.replace('conf_', ''));
      let desc = '';
      const descSelc = doc.querySelector('div.product-item-description');
      if (descSelc) {
        desc = descSelc.textContent.trim();
      }
      const fullName = `${data[i].brand} ${data[i].name} ${desc}`;
      addElementToDocument(doc, 'added-name', fullName.trim());
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'beautye',
    transform: transform,
    domain: 'beautye.it',
    zipcode: '',
  },
  implementation,
};
