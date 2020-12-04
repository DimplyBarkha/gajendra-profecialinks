const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'hayneedle',
    transform: cleanUp,
    domain: 'hayneedle.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      let specifications = document.querySelector("#specificationsTarget > div > div");
      if (specifications) {
        let specificationText = specifications.textContent.match(/(Specifications)(.+)/);
        if (specificationText) {
          document.body.setAttribute('specifications', specificationText[2]);
        }
      }
      document.body.setAttribute("producturl", window.location.href);

      let results = [];
      let query = document.evaluate(`//div[@id="productInfoTarget"]//ul[@data-automation-id="bullets"]//li`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
      if (query) {
        for (let i = 0, length = query.snapshotLength; i < length; ++i) {
          results.push(query.snapshotItem(i));
        }
      }

      const table = document.createElement('table');
      document.body.appendChild(table);
      const tBody = document.createElement('tbody');
      table.appendChild(tBody);

      for (let index = 0; index < results.length; index++) {
        const newlink = document.createElement('tr');
        newlink.setAttribute('class', 'bullets');
        newlink.setAttribute('bullet', results[index].textContent);
        tBody.appendChild(newlink);
      }
    });
    await context.extract(productDetails);
  },
};
