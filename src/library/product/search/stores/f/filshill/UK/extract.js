
const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const { keywords } = inputs;
  try {
    await new Promise(resolve => setTimeout(resolve, 5000));
  //  await context.waitForXPath("//*[@id='dijit__WidgetBase_1]", {}, { timeout: 100000 });
    await context.waitForSelector('#dijit__WidgetBase_1', {}, { timeout: 10000 });
  } catch (error) {
    console.log(error);
  }
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

    const priceText = getAllXpath("//div[@class='PromoPrice']", 'innerText');
    var priceTextValue = priceText;

    const nameText = getAllXpath("//*[contains(@class,'ProdDetails')]//div//a//text()", 'nodeValue');
    var nameTextValue = nameText;

    const productURLText = getAllXpath("//*[contains(@class,'ProdDetails2')]//div[2]/input/@value", 'nodeValue');
    var productURLTextValue = productURLText;

    const thumbNailText = getAllXpath("//img[contains(@id,'prod')]/@src", 'nodeValue');
    var thumbNailTextValue = thumbNailText;

    const availabilityText = getAllXpath("//table[@class='ProductBox']/tbody/tr/td/div[1]/span/text()", 'nodeValue');
    var availabilityTextValue = availabilityText;

    const idPath = getAllXpath("//*[contains(@class,'ProdDetails2')]//div[2]/input/@value", 'nodeValue');
    for (var i = 0; i < idPath.length; i++) {
      try {
        addElementToDocumentOld('id', idPath[i]);
        addElementToDocumentOld('price', priceTextValue[i]);
        addElementToDocumentOld('name', nameTextValue[i]);
        addElementToDocumentOld('productUrl', 'https://sales.filshill.co.uk/products/ProdDetails.asp?product_code='+productURLTextValue[i]);
        addElementToDocumentOld('thumbnail', thumbNailTextValue[i]);
        if(availabilityTextValue[i] == 'In Stock'){
          addElementToDocumentOld('availability', 'In Stock');
        } else {
          addElementToDocumentOld('availability', 'Out of Stock');
        }
        addElementToDocumentOld('added-searchurl','https://sales.filshill.co.uk/products/gridlistsearch.asp?product_desc='+inputs.keywords);
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
    country: 'UK',
    store: 'filshill',
    transform: transform,
    domain: 'filshill.co.uk',
    zipcode: '',
  },
  implementation,
};
