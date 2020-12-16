
async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;

  const jsonText = await context.evaluate(() => {
    const scriptText = document.evaluate('//script/text()[contains(.,"window.__PRELOADED_STATE__")]', document, null, XPathResult.STRING_TYPE, null).stringValue;
    return scriptText.match(/= ({.*})?/) ? scriptText.match(/= ({.*})?/)[1] : '';
  });

  const json = jsonText ? JSON.parse(jsonText) : null;

  function loopCategory (obj, parent) {
    let result = [];
    for (let i = 0; i < Object.keys(obj).length; i++) {
      let categories = [];
      const key = Object.keys(obj)[i];
      if (parent) {
        categories.push({ name: `${parent.name}|${obj[key].name}`, path: `${parent.path}/${obj[key].slug}` });
      } else categories.push({ name: obj[key].name, path: obj[key].slug });
      if (obj[key].categories && Object.keys(obj[key].categories).length) {
        categories = loopCategory(obj[key].categories, categories[categories.length - 1]);
      }
      const flattenedCategories = [].concat.apply([], categories);
      result = result.concat(flattenedCategories);
    }
    return result;
  }

  let categoriesArr = [];
  if (json) {
    try {
      categoriesArr = loopCategory(json.categories.normal);
      console.log(categoriesArr.length + ' categories found.');
    } catch (e) {
      console.log('Error extracting categories');
    }
  }

  if (categoriesArr.length) {
    await context.evaluate(({ categoriesArr }) => {
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
        const splitCategories = categoriesArr[i].name.split('|');
        splitCategories.forEach((val) => {
          addHiddenDiv('category', val, newDiv);
        });
        addHiddenDiv('categoryUrl', `https://simple.ripley.com.pe/${categoriesArr[i].path}`, newDiv);
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
    country: 'PE',
    domain: 'simple.ripley.com.pe',
    store: 'ripley',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
