async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  const jsonText = await context.evaluate(() => {
    return document.body.innerText;
  });
  

  const json = JSON.parse(jsonText);
  await context.evaluate(async (json) => {
    console.log(json);
  }, json);



  if (json && json.l1Categories && json.l1Categories.length >= 0) {
    await context.evaluate(async (records) => {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
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
        if (node.l2subcategories && node.l2subcategories.length > 0) {
        // https://groceries.asda.com/shelf/summer/bbq/burgers-sausages/burgers/2942053576
          for (let i = 0; i < node.subcategories.length; i++) {
            let category = categoryList.find(x => x.id === parentId);
            if (!category) {
              category = {};
              category.values = oldValues.slice();
              categoryList.push(category);
            } if (i === 0) {
              oldValues = category.values.slice();
              console.log(category.values);
            }
            const newNode = node.l2subcategories[i];
            category.id = newNode.dimvalid;
            category.values.push(newNode.displayName);
            getLeafCategoryValue(newNode, newNode.dimvalid, categoryList);
          }
        } else {
          const category = categoryList.find(x => x.id === parentId);
          if (category) category.values.push(node.dimvalid);
        }
      }
      document.body.innerText = '';
      for (let i = 0; i < records.length; i++) {
        console.log('lol', records[i]);
        await stall(500000);
        if (records[i]) {
          const categoryList = [];
          getLeafCategoryValue(records[i], '', categoryList);
          console.log(categoryList.length);
          categoryList.forEach(category => {
            const newDiv = addHiddenDiv('categories', '');
            category.values.forEach(val => addHiddenDiv('category', val, newDiv));
            addHiddenDiv('categoryUrl', `https://groceries.asda.com/shelf/${category.values.join('/')}`, newDiv);
          });
        }
      }
    }, json.l1Categories);
  } else {
    throw new Error('No categories found');
  }
  
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'MX',
    domain: 'liverpool.com.mx',
    store: 'liverpool',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
