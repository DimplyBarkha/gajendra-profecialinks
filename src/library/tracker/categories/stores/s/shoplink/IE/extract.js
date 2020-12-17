async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  await context.evaluate((records) => {
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
    // @ts-ignore
    const categories = [...document.querySelectorAll('#department_select li')].map(el => {
      const obj = {};
      obj.id = el.getAttribute('data-listid');
      obj.name = el.innerText;
      return obj;
    });

    if (!categories.length) throw new Error('No categories found.');

    categories.forEach(category => {
      const newDiv = addHiddenDiv('categories', '');
      addHiddenDiv('category', category.name, newDiv);
      addHiddenDiv('categoryUrl', `http://www.shoplink.ie/?department_select=${category.id}`, newDiv);
    });
  });
  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'IE',
    domain: 'shoplink.ie',
    store: 'shoplink',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
