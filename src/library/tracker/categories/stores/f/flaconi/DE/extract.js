
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

    function getNodes (node = document, parent) {
      // @ts-ignore
      return [...node.querySelector('ul').children].map(childNode => {
        if (childNode.querySelector('a').getAttribute('title') === 'Marken') return null;
        const obj = {};
        const categoryName = childNode.querySelector('a').innerText.replace(/\n|\s{1,}/g, ' ').trim();
        obj.category = parent ? `${parent.category}|${categoryName}` : categoryName;
        obj.url = childNode.querySelector('a').getAttribute('href');
        if (!obj.url.match(/https:\/\/www.flaconi.de\//)) obj.url = `https://www.flaconi.de${obj.url}`;
        if (childNode.querySelector('ul') && childNode.querySelector('ul').children) {
          return getNodes(childNode, obj);
        }
        return obj;
      }).flat().filter(el => !!el);
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
    country: 'DE',
    domain: 'flaconi.de',
    store: 'flaconi',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
