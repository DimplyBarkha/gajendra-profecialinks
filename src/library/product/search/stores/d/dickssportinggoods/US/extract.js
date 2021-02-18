
const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  await context.evaluate(async function () {
    function addElementToDocument (doc, key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      doc.appendChild(catElement);
    }
    const searchUrl = window.location.href;
    document.querySelectorAll('div.rs_product_card_container.dsg-flex.flex-wrap > div.dsg-react-product-cards.dsg-flex.flex-wrap.align-content-flex-start.justify-content-space-between > div').forEach(product => {
      addElementToDocument(product,'searchUrl',searchUrl);
    });
    function getElementByXpath(path) {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    var price = getElementByXpath("//div[@class='rs_product_price']/p[@class='final-price']  |  //div[@class='rs_product_price']/p[@class='offer-price'] | //div[@class='rs_product_price']/p[@class='was-price']")

    
  });
  return await context.extract(productDetails, { transform });
}


module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'dickssportinggoods',
    transform: transform,
    domain: 'dickssportinggoods.com',
    zipcode: '',
  },
  implementation,
};
