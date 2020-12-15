async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  const jsonText = await context.evaluate(() => {
    return document.body.innerText;
  });

  const json = JSON.parse(jsonText);
  if (json && json.subcategories && json.subcategories.length >= 0) {
    await context.evaluate((json) => {
      function addHiddenDiv (id, content, parentDiv = null) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        if (!content) content = '';
        newDiv.textContent = content;
        if (parentDiv) {
          parentDiv.appendChild(newDiv);
        } else {
          document.body.appendChild(newDiv);
        }
        return newDiv;
      }
      function getLeafCategoryValue (node, parentId, categoryList) {
        let oldValues = [];
        if (node.subcategories && node.subcategories.length > 0) {
          for (let i = 0; i < node.subcategories.length; i++) {
            let category = categoryList.find(x => x.id === parentId);
            if (!category) {
              category = {};
              category.values = oldValues.slice();
              categoryList.push(category);
            } if (i === 0) {
              oldValues = category.values.slice();
            }
            const newNode = node.subcategories[i];
            category.id = newNode.id;
            category.url = newNode.url;
            category.values.push(newNode.name);
            getLeafCategoryValue(newNode, newNode.id, categoryList);
          }
        } else {
          const url = categoryList.find(x => x.id === parentId);
          if (url) url.values.push(node.url);
        }
      }
      document.body.innerText = '';

      const categoryList = [];
      getLeafCategoryValue(json, '', categoryList);
      categoryList.forEach(category => {
        const newDiv = addHiddenDiv('categories', '');
        category.values.forEach(val => addHiddenDiv('category', val, newDiv));
        addHiddenDiv('categoryUrl', `https://www.meijer.com${category.url}`, newDiv);
      });
    }, json);
  } else {
    throw new Error('No categories found');
  }
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'US',
    domain: 'meijer.com',
    store: 'meijer',
    zipcode: '',
  },
  implementation,
};
