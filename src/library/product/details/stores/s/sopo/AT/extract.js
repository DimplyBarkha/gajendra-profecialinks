
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
  implementation: async ({ x }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const numberOfDimensions = document.evaluate("//li[contains(text(), 'Verpackungs')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const text = [];
      for (x = 1; x < numberOfDimensions.snapshotLength + 1; x++) {
        const abc = document.evaluate(`//li[contains(text(), 'Verpackungs')][${x}]`, document, null, XPathResult.STRING_TYPE, null).stringValue;
        text.push(abc);
      }
      /* for future if shipping details will fail QA again
      const shippingDetails = document.querySelector("a[title='Versandkosten']");
      if (shippingDetails) {
        // @ts-ignore
        shippingDetails.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        const shippingSelector = document.querySelectorAll("div[class='panel--body is--wide'] > table > tbody > tr");
        console.log(shippingSelector.length);
        for (let y = 0; shippingSelector.length - 1 >= y; y++) {
          const shippingDiv = document.createElement('div');
          shippingDiv.setAttribute('class', `shippingdetails${y}`);
          // @ts-ignore
          shippingDiv.innerHTML = shippingSelector[y].innerText;
          document.body.appendChild(shippingDiv);
        }
      } */
      const properText = text.toString();
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', 'dimension');
      newDiv.innerHTML = properText;
      document.body.appendChild(newDiv);
    });
    await context.extract(productDetails);
  },
};
