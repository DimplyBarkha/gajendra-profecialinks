
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    transform: null,
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
    const name = document.querySelectorAll('div[class="m-productdetailareaa__areaA__title-line g-col g-col-1"]')[0].innerText;
    addElementToDocument('name', name);
    // @ts-ignore
    const nameEmpty = document.querySelectorAll('div[class="m-productdetailareaa__areaA__title-line g-col g-col-1"] h1')[0].innerText;
    addElementToDocument('nameEmpty', nameEmpty);

    // @ts-ignore
    const scriptData = window.dataLayer[0];
    addElementToDocument('gtin', scriptData.transactionProducts[0].ean);
    const variants = getAllXpath('//div[@class="m-productcolorselect-v-2__colors js-only-colors"]/div/a/@title', 'nodeValue');
    pipeSeparatorSingle('variants', variants);
  });
  return await context.extract(productDetails, { transform });
}


