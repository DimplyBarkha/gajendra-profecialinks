
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'BR',
    domain: 'pontofrio.com.br',
    store: 'pontofrio',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    await context.evaluate(async () => {
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

      const categories = document.querySelectorAll('ul.dropdown-menu > li ul:first-child > li');

      categories.forEach((category) => {
        const categoryName = category.querySelector('a > span').textContent;
        const elements = category.querySelectorAll('ul > li > a.sub-menu-link');

        elements.forEach((element) => {
          const elementName = element.querySelector('span').textContent;
          const newDiv = addHiddenDiv('categories');
          addHiddenDiv('category', categoryName, newDiv);
          addHiddenDiv('category', elementName, newDiv);
          addHiddenDiv('categoryUrl', element.getAttribute('href'), newDiv);
        });
      });
    });
    return await context.extract(productMenu);
  },
};
