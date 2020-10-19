
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'ajmadison',
    transform: null,
    domain: 'ajmadison.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain }, context, dependencies) => {
    await context.evaluate(() => {

      function addElementToDocument(key, value) {

        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // @ts-ignore
      const variantInformation = window.dataLayer[0].ecommerce.detail.products[0].variant;
      addElementToDocument('variant', variantInformation)

      // // Method to Retrieve Xpath content of a Multiple Nodes
      // const getAllXpath = (xpath, prop) => {
      //   const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      //   const result = [];
      //   for (let index = 0; index < nodeSet.snapshotLength; index++) {
      //     const element = nodeSet.snapshotItem(index);
      //     if (element) result.push(prop ? element[prop] : element.nodeValue);
      //   }
      //   return result;
      // };
      // // Double Pipe Concatenation
      // const pipeSeparatorDouble = (id, data) => {
      //   var doubleSeparatorText = data.join(' | ');
      //   addElementToDocument(id, doubleSeparatorText)
      // };
      // const addDescription = getAllXpath("//div[@id='quick_specs']//div[@class='bold black-0'][.//text()[contains(.,'Dimensions')]]//following::div[1]", 'nodeValue');
      // pipeSeparatorDouble('addDescription', addDescription);
    });
    await context.extract(dependencies.productDetails);
  },
};
