// @ts-nocheck

const { transform } = require('../format');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const mainUrl = await context.evaluate(() => {
    return window.location.href;
  });
  console.log('mainUrl', mainUrl);
  const url = await context.evaluate(() => {
    return document.querySelector('a.product__details-more').href || '';
  });
  let ingredients = '';
  // let ingredientsOne = '';
  console.log('url', url);
  if (url) {
    await context.goto(url);
    try {
      await context.waitForSelector('p.category');
    } catch (error) {
      console.log('selector not present');
    }
    console.log('In second page');
    ingredients = await context.evaluate(() => {
      console.log('ingredientSelector', document.querySelector('h1'));
      const ingredientSelector = document.querySelector('h1');
      return ingredientSelector ? ingredientSelector.innerText : 'abcd';
    });
    console.log('ingredients', ingredients);
    // ingredientsOne = await context.evaluate(() => {
    //   return document.querySelector('p.brutto') || '';
    // });
    // ingredientsTwo = await context.evaluate(addUrl);
    await context.goto(mainUrl);
  }

  await context.evaluate(async ({ ingredients }) => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    addHiddenDiv('servingSize_added', ingredients);
    addHiddenDiv('imgredients', ingredients);
  }, { ingredients });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'colruyt',
    transform,
    domain: 'colruyt.be',
    zipcode: '',
  },
  implementation,
};
