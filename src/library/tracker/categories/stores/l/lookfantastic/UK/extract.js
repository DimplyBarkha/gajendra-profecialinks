async function implementation(inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  await context.evaluate(async function () {
    function addElementToDocument(key) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    function addChildDiv(parentKey, key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.getElementById(parentKey).appendChild(catElement);
    }

    const allCategories = document.evaluate('//ul[@class="responsiveFlyoutMenu_levelThree"]/li/a|//ul[@class="responsiveFlyoutMenu_levelOne"]/li/a',
      document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    let categoryDivName;
    for (let i = 0; i < allCategories.snapshotLength; i++) {
      categoryDivName = 'added_category_' + i;
      addElementToDocument(categoryDivName);
      addChildDiv(categoryDivName, 'category_name', allCategories.snapshotItem(i).textContent);
      addChildDiv(categoryDivName, 'category_url', allCategories.snapshotItem(i).href);
    }
  });
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'lookfantastic.com',
    store: 'lookfantastic',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};