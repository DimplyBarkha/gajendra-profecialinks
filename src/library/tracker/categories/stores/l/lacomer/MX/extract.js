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
    const categories = [...document.querySelectorAll('#menu_pasillo ul > li > a')].map(el => {
      const obj = {};
      obj.name = decodeURIComponent(`${el.href.match(/key=(.*?)&/)[1]}|${el.href.match(/dep=(.*?)&/)[1]}`.replace(/-/g, ' '));
      obj.url = el.href;
      return obj;
    });

    if (!categories.length) throw new Error('No categories found.');

    categories.forEach(category => {
      const newDiv = addHiddenDiv('categories', '');
      category.name.split('|').forEach(val => addHiddenDiv('category', val, newDiv));
      addHiddenDiv('categoryUrl', category.url, newDiv);
    });
  });
  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'MX',
    domain: 'lacomer.com.mx',
    store: 'lacomer',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
