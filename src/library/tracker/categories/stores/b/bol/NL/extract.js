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

    const categories = document.querySelectorAll('a[data-test="navigation-list-item"]');
    categories.forEach(category => {
      if (!category.getAttribute('href').startsWith('https')) {
        const newCatDiv = addHiddenDiv('categories', '');
        addHiddenDiv('category', category.textContent, newCatDiv);
        addHiddenDiv('categoryUrl', category.getAttribute('href'), newCatDiv);
      }
    });
  });

  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'NL',
    domain: 'bol.com',
    store: 'bol',
    zipcode: '',
  },
  implementation,
};
