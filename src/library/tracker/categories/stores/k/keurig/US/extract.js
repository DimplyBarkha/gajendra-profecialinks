
async function implementation(inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  await context.evaluate(async function () {
    function addProp(selector, iterator, propName, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    }
    const allCategories = document.querySelectorAll('ul.top-nav-items ul.Lc li.sub-category>a, ul.top-nav-items li.top-header>a');
    if (allCategories.length) {
      for (let i = 0; i < allCategories.length; i++) {
        addProp('ul.top-nav-items ul.Lc li.sub-category>a, ul.top-nav-items li.top-header>a',
          i, 'category_url', allCategories[i].href);
      }
    }
  });
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'US',
    domain: 'keurig.com',
    store: 'keurig',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};