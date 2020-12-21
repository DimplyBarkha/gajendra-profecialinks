
async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  const json = await context.evaluate(() => {
    return fetch('https://www.kicks.se/appshell/data', {
      referrer: 'https://www.kicks.se/',
      referrerPolicy: 'strict-origin-when-cross-origin',
      method: 'GET',
      mode: 'cors',
    }).then(resp => resp.json()).catch(() => { throw new Error('Error fetching data'); });
  });

  function loopCategory (obj, parent) {
    let result = [];
    for (let i = 0; i < Object.keys(obj).length; i++) {
      let categories = [];
      const key = Object.keys(obj)[i];
      if (parent) {
        categories.push({ name: `${parent.name}|${obj[key].name}`, url: obj[key].url });
      } else categories.push({ name: obj[key].name, url: obj[key].url });
      if (obj[key].children && Object.keys(obj[key].children).length) {
        categories = loopCategory(obj[key].children, categories[categories.length - 1]);
      }
      const flattenedCategories = [].concat.apply([], categories);
      result = result.concat(flattenedCategories);
    }
    return result;
  }

  let categoriesArr = [];

  try {
    categoriesArr = loopCategory(json.mainMenu.menuSections[1]);
    console.log(categoriesArr.length + ' categories found.');
  } catch (e) {
    console.log('Error extracting categories');
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
        splitCategories.forEach(val => {
          addHiddenDiv('category', val, newDiv);
        });
        addHiddenDiv('categoryUrl', `https://www.kicks.se${categoriesArr[i].url}`, newDiv);
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
    domain: 'kicks.se',
    store: 'kicks',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
