
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'parfumdreams.de',
    store: 'parfumdreams',
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

      const categories = document.querySelectorAll('div.box-tab + div > div');

      categories.forEach((category) => {
        const categoryName = category.querySelector('h2').textContent;
        const subCategories = category.querySelectorAll('ul > a');
        const elementsContainer = category.querySelectorAll('ul > ul');

        for (let i = 0; i < subCategories.length; ++i) {
          if (elementsContainer.item(i) && subCategories.item(i)) {
            const elements = elementsContainer.item(i).querySelectorAll('li > a');
            const subCategoryName = subCategories.item(i).textContent;

            elements.forEach((element) => {
              const newDiv = addHiddenDiv('categories');
              const names = [categoryName, subCategoryName, element.textContent];
              names.forEach(name => addHiddenDiv('category', name, newDiv));
              addHiddenDiv('categoryUrl', `https://www.parfumdreams.de${element.getAttribute('href')}`, newDiv);
            });
          }
        }
      });
    });
    return await context.extract(productMenu);
  },
};
