
async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;

  console.log(productMenu);
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  const allCategories = await context.evaluate(async () => document.querySelectorAll('nav#main-navigation ul li a[data-webtrekk-link-id="header.subnav"]').length);

  if (allCategories) {

  } else {
    throw new Error('No categories found');
  }
  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'flaconi.de',
    store: 'flaconi',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
