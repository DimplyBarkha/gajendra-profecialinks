async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;

  await context.evaluate(async function () {
    function addHiddenDiv (id, content, parentDiv = null) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      if (parentDiv) {
        parentDiv.appendChild(newDiv);
      } else {
        document.body.appendChild(newDiv);
      }
      return newDiv;
    }

    // categories
    const mainCategories = document.querySelectorAll('ol.alphabetical-list a.category-name');
    mainCategories.forEach((categoryNode, index) => {
      const newCatDiv = addHiddenDiv('categories', '');
      addHiddenDiv('category', categoryNode.textContent, newCatDiv);
      addHiddenDiv('categoryUrl', categoryNode.getAttribute('href'), newCatDiv);
    });
  });

  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'hair-shop.com',
    store: 'hair-shop',
    zipcode: '',
  },
  implementation,
};
