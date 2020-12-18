
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'US',
    domain: 'macys.com',
    store: 'macys',
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

      const categories = document.querySelectorAll('div#mainNavigation div[role="group"]');

      categories.forEach((category) => {
        const categoryName = category.getAttribute('aria-label');
        const subCategories = category.querySelectorAll('div.flexLabelLinksContainer');

        subCategories.forEach((subCategory) => {
          const elements = subCategory.querySelectorAll('h5 ~ a');

          elements.forEach((element) => {
            const newDiv = addHiddenDiv('categories');
            const names = [categoryName, subCategory.querySelector('h5').textContent, element.textContent];
            names.forEach(name => addHiddenDiv('category', name, newDiv));
            addHiddenDiv('categoryUrl', element.href, newDiv);
          });
        });
      });
    });

    return await context.extract(productMenu);
  },
};
