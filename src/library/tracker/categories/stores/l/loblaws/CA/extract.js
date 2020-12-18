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
    const mainCategories = document.querySelectorAll('li.primary-nav__list__item:nth-child(1) li.primary-nav__list__item');
    mainCategories.forEach(categoryNode => {
      const category = categoryNode.querySelector('span.primary-nav__list__item__link__text').textContent;
      const categoryUrl = categoryNode.querySelector('a.primary-nav__list__item__link').getAttribute('href');
      const newCatDiv = addHiddenDiv('categories', '');
      addHiddenDiv('category', category, newCatDiv);
      addHiddenDiv('categoryUrl', categoryUrl, newCatDiv);
    });
  });

  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'CA',
    domain: 'loblaws.ca',
    store: 'loblaws',
    zipcode: '',
  },
  implementation,
};
