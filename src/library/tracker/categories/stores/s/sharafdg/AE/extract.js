
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

      const categories = document.querySelectorAll('div.mega-menu-wrap:nth-child(-n+7) > ul > li');

      categories.forEach((category) => {
        const categoryName = category.querySelector('a').textContent;
        const subCategories = category.querySelectorAll('ul > li[class*="columns"]');

        subCategories.forEach((subCategory) => {
          const subCategoryName = subCategory.querySelector('a').textContent;
          const elements = subCategory.querySelectorAll('ul > li');

          elements.forEach((element) => {
            element = element.querySelector('a');
            const newDiv = addHiddenDiv('categories');
            const names = [categoryName, subCategoryName, element.textContent];
            names.forEach(name => addHiddenDiv('category', name, newDiv));
            addHiddenDiv('categoryUrl', `https://uae.sharafdg.com/${element.getAttribute('href')}`, newDiv);
          });
        });
      });
    });
    return await context.extract(productMenu);
  },
};
