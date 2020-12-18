
async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  await context.click('span.menu-icon');
  await context.waitForSelector('div.flyout-categories > ul');
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

    function getCategories (parentObj, iteration, parentNode) {
      const currentIteration = iteration || 1;
      let selector = !parentObj ? 'li.category.category-list > ul > li' : `li.category.category-list ~ ul[data-node="${parentObj.childId}"] ul > li.menugrid-item`;
      if (currentIteration === 3) selector = 'ul[data-node] li';
      // @ts-ignore
      const node = parentNode || document;
      if (!node.querySelectorAll(selector).length) return [parentObj];
      return [...node.querySelectorAll(selector)].map(childNode => {
        const obj = {};
        if (!childNode.querySelector('a')) return obj;
        const categoryName = childNode.querySelector('a').innerText.replace(/\n/g, '');
        obj.name = !parentObj ? categoryName : `${parentObj.name}|${categoryName}`;
        obj.url = childNode.querySelector('a').getAttribute('href');
        if (!parentObj || (currentIteration === 2 && childNode.querySelector('ul[data-node]'))) {
          obj.childId = !parentObj ? `1.${childNode.querySelector('a').getAttribute('data-node-target')}` : parentObj.childId;
          if (currentIteration === 2) return getCategories(obj, currentIteration + 1, childNode);
          return getCategories(obj, currentIteration + 1);
        }
        return obj;
      }).flat();
    }

    let categoriesArr = [];
    try {
      categoriesArr = getCategories();
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
      addHiddenDiv('categoryUrl', `https://www.londondrugs.com${categoriesArr[i].url}`, newDiv);
    }
  });
  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'CA',
    domain: 'londondrugs.com',
    store: 'londondrugs',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
