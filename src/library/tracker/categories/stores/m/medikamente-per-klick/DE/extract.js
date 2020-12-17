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
    const mainCategories = document.querySelectorAll('div[class="smallBoxCategories"] li[class="submenu01"]');
    mainCategories.forEach((categoryNode, index) => {
      const category = categoryNode.querySelector('a');
      const newCatDiv = addHiddenDiv('categories', '');
      addHiddenDiv('category', category.textContent, newCatDiv);
      addHiddenDiv('categoryUrl', category.getAttribute('href'), newCatDiv);
    });
  });

  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'medikamente-per-klick.de',
    store: 'medikamente-per-klick',
    zipcode: '',
  },
  implementation,
};
