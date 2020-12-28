
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'argos.co.uk',
    store: 'argos',
    zipcode: '',
  },
  implementation,
};
async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  const jsonText = await context.evaluate(() => {
    return document.body.innerText;
  });

  const json = JSON.parse(jsonText);
  // console.log('json: ', json);

  if (json && json.body.data && json.body.data.length >= 0) {
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
        if (node.title && node.title.length > 0) {
        // https://groceries.asda.com/shelf/summer/bbq/burgers-sausages/burgers/2942053576
          for (let i = 0; i < node.title.length; i++) {
            let category = categoryList.find(x => x.id === parentId);
            if (!category) {
              category = {};
              category.values = oldValues.slice();
              categoryList.push(category);
            } if (i === 0) {
              oldValues = category.values.slice();
              console.log(category.values);
            }
            const newNode = node.title[i];
            category.id = newNode.link;
            category.values.push(newNode.displayName);
            getLeafCategoryValue(newNode, newNode.link, categoryList);
          }
        } else {
          const category = categoryList.find(x => x.id === parentId);
          if (category) category.values.push(node.link);
        }
      }
      function js_traverse(o) {
        var type = typeof o 
        if (type == "object") {
            for (var key in o) {
                console.log("key: ", key);
                let newDiv = addHiddenDiv('categories', '');
                addHiddenDiv('category', JSON.stringify(o[key].title), newDiv);
                js_traverse(o[key])
            }
        } else {
            console.log(o)
        }
    }
    
    js_traverse(records);
    console.log('records: ', records);
    }, json.body.data);
  } else {
    throw new Error('No categories found');
  }
  return await context.extract(productMenu);
}
