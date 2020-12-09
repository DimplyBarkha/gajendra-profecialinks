const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise(resolve => setTimeout(resolve, 2000));
  await context.evaluate(async function () {
    function addElementToDocument (doc, key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      doc.appendChild(catElement);
    }

    // function to get the json data from the string
    function findJsonData () {
      try {
        const xpath = '//script[@type="text/javascript"][contains(.,"SET_CATALOG_TAG")]';
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let scriptContent = element.textContent;
		    let startString = '"data":';
		    let endString = ',"first_page_url"';
        let startIdx = scriptContent.indexOf(startString);
        let endIdx = scriptContent.indexOf(endString);
        let jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
        jsonStr = jsonStr.trim();
        // console.log("jsonStr: ", jsonStr);
        return JSON.parse(jsonStr);
      } catch (error) {
        console.log(error.message);
      }
    }
    // elements from data Layer object
    const dataObj = findJsonData()
    const arr = document.querySelectorAll('div.row.products>div');
    for (let i = 0; i < arr.length; i++) {
      const doc = arr[i];
      // console.log('in loop i ===', i);
      addElementToDocument(doc, 'added-id', dataObj[i].id);
      addElementToDocument(doc, 'added-product-url', "https://www.e-fresh.gr/el/"+dataObj[i].slug);
    }
  }); // , { transform }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'GR',
    store: 'e-fresh',
    transform: transform,
    domain: 'e-fresh.gr',
    zipcode: "''",
  },
  implementation
};
