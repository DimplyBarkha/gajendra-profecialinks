const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'foodlion_28147',
    transform: cleanUp,
    domain: 'foodlion.com',
    zipcode: '28147',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    async function addElement ({ id, xp }) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const elementFound = document.evaluate(xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      elementFound && addHiddenDiv(id, elementFound.innerText);
    }
    try {
      await context.click('#tab-ingredients');
      await context.evaluate(addElement, { id: 'pd_ingredients', xp: '//div[contains(@id,"panel-ingredients")]' });
    } catch (error) {
      console.log('Ingredients not present');
    }
    try {
      await context.click('#tab-instructions');
      await context.evaluate(addElement, { id: 'pd_directions', xp: '//div[contains(@id,"panel-instructions")]' });
    } catch (error) {
      console.log('Directions not present');
    }
    try {
      await context.click('#tab-warnings');
      await context.evaluate(addElement, { id: 'pd_warnings', xp: '//div[contains(@id,"panel-warnings")]' });
    } catch (error) {
      console.log('warnining not present');
    }
    await context.extract(productDetails);
    return await context.extract(productDetails, { transform: transformParam });
  },
};
