const { cleanUp } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(function () {
    // Function for creating Specification and productOtherInformation
    function specifiationFunc (xpath, div) {
      const specifications = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const specificationsLength = specifications.snapshotLength;
      if (specificationsLength > 0) {
        const specificationsDict = [];
        for (let x = 0; specificationsLength > x; x++) {
          // @ts-ignore
          const text = specifications.snapshotItem(x).innerText;
          specificationsDict.push(text);
        }
        const elem = document.createElement('div');
        elem.innerHTML = specificationsDict.toString();
        elem.classList.add(div);
        document.body.appendChild(elem);
      }
    }
    // Getting price
    const priceXpath = document.evaluate('(//span[@data-price])[1]', document, null, XPathResult.STRING_TYPE, null);
    if (priceXpath.stringValue !== '') {
      document.body.setAttribute('price', priceXpath.stringValue);
    }
    // Getting listPrice
    const listPriceXpath = document.evaluate('(//span[@data-price-old])[1]', document, null, XPathResult.STRING_TYPE, null);
    if (listPriceXpath.stringValue !== '') {
      document.body.setAttribute('listprice', listPriceXpath.stringValue);
    }
    // Creating availabilityText
    // @ts-ignore
    const availabilitySelector = [...document.querySelectorAll('span')].map(span => span.innerHTML)
      .filter(txt => txt.includes('Add to cart'));
    if (availabilitySelector.length > 0) {
      document.body.setAttribute('availability', 'In Stock');
    } else if (availabilitySelector.length === 0) {
      document.body.setAttribute('availability', 'Out of Stock');
    }
    // Create Specifiation
    specifiationFunc("//h2[contains(text(), 'Specifications')]//following-sibling::ul/li", 'specadded');
    // Create productOtherInformation
    specifiationFunc("//h2[contains(text(), 'Key Features')]//following-sibling::div/ul/li | //h2[contains(text(), 'What’s in the box')]//following-sibling::div", 'otheradded');
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'KE',
    store: 'jumia',
    transform: cleanUp,
    domain: 'jumia.co.ke',
    zipcode: '',
  },
  implementation,
};
