
async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  const jsonText = await context.evaluate(() => {
    return document.body.innerText;
  });

  const json = JSON.parse(jsonText);

  function loopCategory (obj, parent) {
    let result = [];
    for (let i = 0; i < Object.keys(obj).length; i++) {
      let categories = [];
      const key = Object.keys(obj)[i];
      if (parent) {
        const parentArr = parent.split('|');
        parentArr.pop();
        categories.push(`${parentArr.join('|')}|${obj[key].categoryName}|${obj[key].code}`);
      } else categories.push(`${obj[key].categoryName}|${obj[key].code}`);
      if (obj[key].children && Object.keys(obj[key].children).length) {
        categories = loopCategory(obj[key].children, `${obj[key].categoryName}|${obj[key].code}`);
      }
      const flattenedCategories = [].concat.apply([], categories);
      result = result.concat(flattenedCategories);
    }
    return result;
  }

  let categoriesArr = [];
  try {
    categoriesArr = loopCategory(json);
    console.log(categoriesArr.length + ' categories found.');
  } catch (e) {
    console.log('Error extracting categories');
  }

  if (categoriesArr.length) {
    await context.evaluate(({ categoriesArr }) => {
      console.log(categoriesArr.length);
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
      for (let i = 0; i < categoriesArr.length; i++) {
        const newDiv = addHiddenDiv('categories', '');
        const splitCategories = categoriesArr[i].split('|');
        if (splitCategories.length > 1) {
          splitCategories.forEach((val, idx) => {
            if (idx < splitCategories.length - 1) addHiddenDiv('category', val, newDiv);
          });
        }
        addHiddenDiv('categoryUrl', `https://www.eldorado.ru/c/${splitCategories[splitCategories.length - 1]}`, newDiv);
      }
    }, { categoriesArr });
  } else {
    throw new Error('No categories found');
  }
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'RU',
    domain: 'eldorado.ru',
    store: 'eldorado',
    zipcode: "''",
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
