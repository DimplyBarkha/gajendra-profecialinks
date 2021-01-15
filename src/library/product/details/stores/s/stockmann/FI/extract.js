const { transform } = require('./format');
async function implementation (
  inputs,
  { transform: transformParam },
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  try {
    await context.click('body > div.cookie-dialog-screen.open > div > div > div.buttons > button');
    console.log("buttton clicked")
    }  catch(err) {
     console.log("couldn't click");
    }
  return await context.extract(productDetails, {transform});
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'stockmann',
    transform,
    domain: 'stockmann.com',
    zipcode: '',
  },
  implementation,
};
