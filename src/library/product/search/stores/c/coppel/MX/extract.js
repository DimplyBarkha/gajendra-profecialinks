const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {

    const url = window.location.href;

    function addElementToDocumentOld (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      // catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
      if (Array.isArray(value)) {
        const innerHTML = value.reduce((acc, val) => {
          return `${acc}<li>${val}</li>`;
        }, '<ul>') + '</ul>';
        catElement.innerHTML = innerHTML;
      } else {
        catElement.textContent = value;
      }
      return catElement;
    }

    const getAllXpath = (xpath, prop) => {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const result = [];
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
        const element = nodeSet.snapshotItem(index);
        if (element) result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
    };
    
    const priceText = getAllXpath("//input[contains(@id,'ProductInfoPrice_')]/@value", 'nodeValue').join('|');
    var priceTextValue = priceText.split('|');

    const manufacturerText = getAllXpath("//*[contains(@id,'ProductInfoBrand_')]/@value", 'nodeValue').join('|');
    var manufacturerTextValue = manufacturerText.split('|');

    const nameText = getAllXpath("//*[contains(@id,'ProductInfoName_')]/@value", 'nodeValue').join('|');
    var nameTextValue = nameText.split('|');

    const productURLText = getAllXpath("//*[contains(@id,'catalogEntry_img')]/@href", 'nodeValue').join('|');
    var productURLTextValue = productURLText.split('|');

    const thumbNailText = getAllXpath("//*[contains(@id,'catalogEntry_img')]/img/@src", 'nodeValue').join('|');
    var thumbNailTextValue = thumbNailText.split('|');

    const idPath = getAllXpath("//input[contains(@id,'comparebox_')]/@value", 'nodeValue').join('|');
    var myIdArr = idPath.split('|');
    for (var i = 0; i < myIdArr.length; i++) {
      try {
        addElementToDocumentOld('id', myIdArr[i]);
        addElementToDocumentOld('price', priceTextValue[i].replace(/,/g, '.'));
        addElementToDocumentOld('name', nameTextValue[i]);
        addElementToDocumentOld('manufacturer', manufacturerTextValue[i]);
        addElementToDocumentOld('productUrl', productURLTextValue[i]);
        addElementToDocumentOld('thumbnail', thumbNailTextValue[i]);
        addElementToDocumentOld('added-searchurl', url);
      } catch (err) {
        console.log('Error =>', err);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'coppel',
    transform,
    domain: 'coppel.com',
    zipcode: '',
  },
  implementation,
};