
const { cleanUp } = require('../../../../shared.js');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'sopo',
    transform: cleanUp,
    domain: 'sopo.at',
    zipcode: '',
  },
  implementation: async ({ x }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const numberOfDimensions = document.evaluate("//li[contains(text(), 'Verpackungs')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const text = [];
      for (x = 1; x < numberOfDimensions.snapshotLength + 1; x++) {
        const abc = document.evaluate(`//li[contains(text(), 'Verpackungs')][${x}]`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        text.push(abc);
      }
      const properText = text.toString();
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', 'dimension');
      newDiv.innerHTML = properText;
      document.body.appendChild(newDiv);

      const descBullets = document.querySelectorAll('div[class="box"]>ul>li');
      for (let y = 0; y < descBullets.length; y++) {
        const content = descBullets[y].textContent.replace(/(.+)/, '$1||');
        descBullets[y].innerHTML = content;
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
