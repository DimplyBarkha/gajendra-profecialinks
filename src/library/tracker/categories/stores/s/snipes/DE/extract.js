
async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;

  await context.evaluate(() => {
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

    function getNodes (selector, node = document, parent = null, currentLevel) {
      const level = currentLevel || 1;
      // @ts-ignore
      return [...node.querySelectorAll(selector)].map(childNode => {
        const obj = {};
        const categoryName = childNode.querySelector('a').innerText.replace(/\n|\s{1,}/g, ' ').trim();
        obj.category = parent ? `${parent.category}|${categoryName}` : categoryName;
        obj.url = childNode.querySelector('a').getAttribute('href') || childNode.querySelector('a').getAttribute('data-href');
        if (childNode.querySelector(`ul[class*="b-menu-list--level-${level + 1}"][data-cat] > li`)) {
          return getNodes(`ul[class*="b-menu-list--level-${level + 1}"][data-cat] > li`, childNode, obj, level + 1);
        }
        return obj;
      }).flat();
    }

    let categoriesArr = [];

    try {
      categoriesArr = getNodes('ul[class*="b-menu-list--level-1"][data-cat] > li');
      // Filter-out duplicates
      categoriesArr = categoriesArr.filter((el, index, self) =>
        index === self.findIndex((e) => (
          e.category === el.category && e.url === el.url
        )),
      );
    } catch (e) {
      console.log('Error extracting categories: ' + e);
    }

    if (!categoriesArr.length) throw new Error('Could not extract categories');

    for (let i = 0; i < categoriesArr.length; i++) {
      const newDiv = addHiddenDiv('categories', '');
      const splitCategories = categoriesArr[i].category.split('|');
      if (splitCategories.length) {
        splitCategories.forEach((val) => {
          addHiddenDiv('category', val, newDiv);
        });
      }
      addHiddenDiv('categoryUrl', `https://www.snipes.com${categoriesArr[i].url}`, newDiv);
    }
  });
  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'snipes.com',
    store: 'snipes',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
