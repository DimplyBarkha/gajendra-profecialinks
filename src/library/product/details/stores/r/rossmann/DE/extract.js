const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'rossmann',
    transform,
    domain: 'rossmann.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(function () {
      const xpath = '//article[contains(@itemprop,"description")]//h2[contains(., "Produktbeschreibung") or contains(., "Produktdetails")]/following-sibling::div[contains(@class, "rm-accordion__detail-info")]//ul/li';
      const descUl = getEleByXpath(xpath);
      function getEleByXpath (xpath) {
        const element = document.evaluate(xpath, document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        console.log('Element' + element);
        return element;
      }
      if (descUl) {
        for (let i = 0; i < descUl.snapshotLength; i++) {
          descUl.snapshotItem(i).textContent = `|| ${descUl.snapshotItem(i).textContent}`;
        }
      }
    });
    return await context.extract(productDetails, { transform: transformParam });
  },
};
