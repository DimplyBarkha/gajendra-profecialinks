async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  // create category-subcategory pairs
  const categoriesStructure = await context.evaluate(() => {
    let allCategories = document.querySelectorAll('td[align="center"] a>font[face="Verdana,Arial,Helvetica"]');
    let structure = [];
    let currentCategory = "";
    for (let i = 0; i < allCategories.length; i++){
      if (allCategories[i].getAttribute('size') == '2') {
        currentCategory = allCategories[i].innerText;
      }
      else {
        structure.push({
          'category': currentCategory,
          'subcategory': allCategories[i].innerText
        })
      }
    }
    return structure;
  });
  // create data ref
  let data = await context.extract(productMenu);
  // insert categories matched by subcategories
  for (let i = 0; i < data[0].group.length; i++){
    let currentSubcategory = data[0].group[i].category[0].text;
    for (let j = 0; j < categoriesStructure.length; j++){
      if (categoriesStructure[j].subcategory == currentSubcategory) {
        data[0].group[i].category.unshift(
          {'text': categoriesStructure[j].category}
        );
        break;
      }
    }
  }
  return data;
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'US',
    domain: 'frys.com',
    store: 'frys',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};