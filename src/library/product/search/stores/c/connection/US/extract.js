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
    
    const priceText = getAllXpath("//table[@class='table']//tbody//tr[@class='product-container']//span[@class='priceDisplay']/text()", 'nodeValue').join('|');
    var priceTextValue = priceText.split('|');

    const manufacturerText = getAllXpath("//table[@class='table']/tbody/tr[@class='product-container'][1]/td[@class='list-info']/div[2]", 'nodeValue').join('|');
    var manufacturerTextValue = manufacturerText.split('|');

    const nameText = getAllXpath("//div[@class='product-name-list']/a/@title", 'nodeValue').join('|');
    var nameTextValue = nameText.split('|');

    const productURLText = getAllXpath("//table[@class='table']/tbody/tr[@class='product-container']/td/div[@class='product-name-list']/a/@href", 'nodeValue').join('|');
    var productURLTextValue = productURLText.split('|');

    const thumbNailText = getAllXpath("//table[@class='table']//tbody//tr[@class='product-container']//td[@class='list-image']/div/a/div/img/@src", 'nodeValue').join('|');
    var thumbNailTextValue = thumbNailText.split('|');


    const availabilityText = getAllXpath("//table[@class='table']//tbody//tr[@class='product-container']//td[@class='list-availability']/div/span/text()", 'nodeValue').join('|');
    var availabilityTextValue = availabilityText.split('|');

    const idPath = getAllXpath("//table[@class='table']//tbody//tr[@class='product-container']/@data-id", 'nodeValue').join('|');
    var myIdArr = idPath.split('|');
    for (var i = 0; i < myIdArr.length; i++) {
      try {
        addElementToDocumentOld('id', myIdArr[i]);
        addElementToDocumentOld('price', priceTextValue[i]);
        addElementToDocumentOld('name', nameTextValue[i]);
        addElementToDocumentOld('manufacturer', manufacturerTextValue[i]);
        addElementToDocumentOld('productUrl', 'https://www.connection.com'+productURLTextValue[i]);
        addElementToDocumentOld('thumbnail', thumbNailTextValue[i]);
        if(availabilityTextValue[i] == 'In Stock'  || availabilityTextValue[i] == 'Pre-Order' || availabilityTextValue[i] == 'Limited Quantity Available' || availabilityTextValue[i] == 'Temporarily Out-of-Stock'){
          addElementToDocumentOld('availability', 'In Stock');
        } else {
          addElementToDocumentOld('availability', 'Out of Stock');
        }
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
    country: 'US',
    store: 'connection',
    transform: transform,
    domain: 'connection.com',
    zipcode: '',
  },
  implementation,
};
