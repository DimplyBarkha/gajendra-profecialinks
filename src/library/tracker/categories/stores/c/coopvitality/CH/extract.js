
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'CH',
    domain: 'coopvitality.ch',
    store: 'coopvitality',
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

      const categories = document.querySelectorAll('li[class="mega has-child"]');

      categories.forEach((category) => {
        const categoryName = category.querySelector('a').textContent;
        const subCategories = category.querySelectorAll('div.group');

        subCategories.forEach((subCategory) => {
          const subCategoryName = subCategory.querySelector('div.group-title > a').textContent;
          const elements = subCategory.querySelectorAll('div.group-content li a');

          elements.forEach((element) => {
            const newDiv = addHiddenDiv('categories');
            const names = [categoryName, subCategoryName, element.textContent];
            names.forEach(name => addHiddenDiv('category', name, newDiv));
            addHiddenDiv('categoryUrl', `https://www.coopvitality.ch${element.getAttribute('href')}`, newDiv);
          });
        });
      });
    });
    return await context.extract(productMenu);
  },
};
