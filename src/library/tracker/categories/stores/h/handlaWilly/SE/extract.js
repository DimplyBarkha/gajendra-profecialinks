async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productMenu } = dependencies;
  const jsonText = await context.evaluate(() => {
    return document.body.innerText;
  });
  const json = JSON.parse(jsonText);
  if (json && json.children && json.children.length >= 0) {
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
        if (node.children && node.children.length > 0) {
          for (let i = 0; i < node.children.length; i++) {
            let category = categoryList.find(x => x.id === parentId);
            if (!category) {
              category = {};
              category.values = oldValues.slice();
              categoryList.push(category);
            } if (i === 0) {
              oldValues = category.values.slice();
              console.log('category values', category.values);
            }
            const newNode = node.children[i];
            category.id = newNode.id;
            category.url = newNode.url;
            category.values.push(newNode.title);
            console.log('CATEGORY OBJECT', category);
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
        addHiddenDiv('categoryUrl', `https://www.willys.se/sortiment/${category.url}`, newDiv);
      });
    }, json);
  } else {
    throw new Error('No categories found');
  }
  console.log(json.children[20]);
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'SE',
    domain: 'willys.se',
    store: 'handlaWilly',
    zipcode: '',
  },
  implementation,
};
