async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  await context.evaluate(async () => {
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

    const json = await fetch('https://lyko.com/mainmenu', {
      referrer: 'https://lyko.com/sv',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then(resp => resp.json());

    let categoriesArr = [];
    try {
      categoriesArr = loopCategory(json.primaryMenuItems);
    } catch (e) {
      console.log('Error extracting categories: ' + e);
    }
    if (!categoriesArr.length) throw new Error('Could not extract categories');

    for (let i = 0; i < categoriesArr.length; i++) {
      const newDiv = addHiddenDiv('categories', '');
      const splitCategories = categoriesArr[i].name.split('|');
      if (splitCategories.length) {
        splitCategories.forEach((val) => {
          addHiddenDiv('category', val, newDiv);
        });
      }
      addHiddenDiv('categoryUrl', `https://lyko.com${categoriesArr[i].url}`, newDiv);
    }
  });
  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'SE',
    domain: 'lyko.com',
    store: 'lyko',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
