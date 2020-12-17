
async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  const doesPopupExist = await context.evaluate(function () {
    return !!document.querySelector('#fancy-warning-cy > button');
  });
  if (doesPopupExist) {
    console.log('Close popup');
    await context.click('#fancy-warning-cy > button');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
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
     * @param {number} [currentIteration]
     */
    function getNodes (node = document, parentObj, currentIteration) {
      const iteration = currentIteration || 1;
      let selector = `span.categories-text ~ ul.nav-${iteration} > li[class*=item][class*=hasChildren]`;
      if (iteration === 2) selector = 'ul[class*=nav-3] li';
      else if (iteration === 3)selector = 'div[class=nav-4] ul li';
      // @ts-ignore
      return [...node.querySelectorAll(selector)].map(childNode => {
        const obj = {};
        let categoryName = '';
        if (childNode.querySelector('a')) {
          if (childNode.querySelector('a.title')) categoryName += childNode.querySelector('a.title').getAttribute('title');
          else if (childNode.querySelector('div[class*=category-title], a[class*=category-title]')) categoryName += childNode.querySelector('div[class*=category-title], a[class*=category-title]').innerText.trim();
          else categoryName += childNode.querySelector('a > span').innerText;
          categoryName = categoryName.replace(/\(\d+\)/, '').trim();
          obj.category = parentObj ? `${parentObj.category}|${categoryName}` : categoryName;
          obj.url = `https://www.hondoscenter.com${childNode.querySelector('a').getAttribute('href')}`;
        }
        if ((iteration === 2 && childNode.querySelector('div[class=nav-4] ul li')) || iteration === 1) {
          return getNodes(childNode, obj, iteration + 1);
        }
        return obj;
      }).flat();
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
    country: 'GR',
    domain: 'hondoscenter.com',
    store: 'hondoscenter',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
