async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  const jsonText = await context.evaluate(() => {
    return document.evaluate('//script/text()[contains(.,"updateCategory")]', document, null, XPathResult.STRING_TYPE, null).stringValue;
  });

  function getMappings (path, mappings) {
    const result = {};
    const keys = path.split('/');
    result.categories = keys.map((key, index) => {
      if (index === keys.length - 1) result.id = key;
      return mappings[key] ? mappings[key].name : '';
    }).splice(1);
    return result;
  }

  function searchCategories (facets, mappings) {
    const keys = Object.keys(facets);
    return keys.map(key => getMappings(key, mappings));
  }

  const facetsObj = JSON.parse(`{${jsonText.match(/facets: ({.*})/g)[0].replace('facets', '"facets"')}}`);
  const mappingsObj = JSON.parse(`{${jsonText.match(/mappings: ({.*})/g)[0].replace('mappings', '"mappings"')}}`);

  let categoriesArr = [];
  try {
    categoriesArr = searchCategories(facetsObj.facets, mappingsObj.mappings);
  } catch (e) {
    console.log(e);
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
        categoriesArr[i].categories.forEach((val) => {
          addHiddenDiv('category', val, newDiv);
        });
        addHiddenDiv('categoryUrl', `https://www.mat.se/search.html?categoryId=${categoriesArr[i].id}`, newDiv);
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
    country: 'SE',
    domain: 'mat.se',
    store: 'mat',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
