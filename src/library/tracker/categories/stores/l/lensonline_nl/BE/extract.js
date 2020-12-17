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
    const categories = [...document.querySelectorAll('div[class*=categ_item] a')].map(el => {
      const obj = {};
      obj.name = el.innerText;
      obj.url = el.getAttribute('href');
      return obj;
    });

    if (!categories.length) throw new Error('No categories found.');

    categories.forEach(category => {
      const newDiv = addHiddenDiv('categories', '');
      addHiddenDiv('category', category.name, newDiv);
      addHiddenDiv('categoryUrl', category.url, newDiv);
    });
  });
  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'BE',
    domain: 'lensonline.be',
    store: 'lensonline_nl',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
