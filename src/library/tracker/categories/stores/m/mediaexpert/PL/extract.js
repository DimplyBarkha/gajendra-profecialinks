
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
    /**
     * @param {Node} node
     * @param {Object} [parentObj]
     * @param {number} [currentLevel]
     */
    function getNodes (node = document, parentObj, currentLevel) {
      const level = currentLevel || 0;
      // @ts-ignore
      return [...node.querySelectorAll(`${level === 0
        ? 'ul.c-menu_list.is-list ul[data-zone="MAINMENU"] ' : ''}li[class*="c-menu_item is-item${level}"]`)].map(childNode => {
        const obj = {};
        if (childNode.querySelector('a')) {
          const categoryName = childNode.querySelector('a').innerText.trim();
          obj.category = parentObj ? `${parentObj.category}|${categoryName}` : categoryName;
          obj.url = `https://www.mediaexpert.pl${childNode.querySelector('a').getAttribute('href')}`;
        }
        if (childNode.querySelector(`li[class*="c-menu_item is-item${level + 1}"]`)) {
          return getNodes(childNode, obj, level + 1);
        }
        return obj;
      }).flat().filter(obj => Object.keys(obj).length);
    }

    let categoriesArr = [];
    try {
      categoriesArr = getNodes();
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
      addHiddenDiv('categoryUrl', categoriesArr[i].url, newDiv);
    }
  });
  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'PL',
    domain: 'mediaexpert.pl',
    store: 'mediaexpert',
    zipcode: "''",
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
