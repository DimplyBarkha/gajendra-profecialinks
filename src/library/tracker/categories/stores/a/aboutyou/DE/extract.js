async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  const jsonText = await context.evaluate(() => {
    return document.body.innerText;
  });

  const json = JSON.parse(jsonText);

  if (json && json.length >= 0) {
    await context.evaluate((records) => {
      function addHiddenDiv (id, content, parentDiv = null) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        if (!content) content = '';
        newDiv.textContent = content;
        // newDiv.style.display = 'none';
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

              // console.log(category.values);
            }

            const newNode = node.children[i];
            category.id = newNode.id;
            category.values.push(newNode.name);
            if (newNode.children.length === 0) {
              category.values.push(newNode.path);
            }

            getLeafCategoryValue(newNode, newNode.id, categoryList);
          }
        }
      }
      document.body.innerText = '';
      for (let i = 0; i < records.length; i++) {
        if (records[i]) {
          const categoryList = [];
          getLeafCategoryValue(records[i], records[i].id, categoryList);

          categoryList.forEach(category => {
            const newDiv = addHiddenDiv('categories', '');
            addHiddenDiv('category', records[i].name, newDiv);
            // category.values.forEach(val => addHiddenDiv('category', val, newDiv));
            for (let i = 0; i < category.values.length; i++) {
              if (i === category.values.length - 1) {
                addHiddenDiv('categoryUrl', `https://www.aboutyou.de${category.values[i]}`, newDiv);
                continue;
              }
              addHiddenDiv('category', category.values[i], newDiv);
            }
          });
        }
      }
    }, json);
  } else {
    throw new Error('No categories found');
  }
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'aboutyou.de',
    store: 'aboutyou',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
