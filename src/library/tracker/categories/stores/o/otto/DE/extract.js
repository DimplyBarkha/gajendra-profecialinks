
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'otto.de',
    store: 'otto',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    await context.evaluate(async () => {
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
      const categories = document.querySelectorAll('ul[class="nav_navi-list"] > li');

      categories.forEach((category) => {
        const categoryName = category.querySelector('a[class="nav_navi-elem--level-1"]').textContent;
        const subCategories = category.querySelectorAll('ul[class="nav_navi-list"]');

        subCategories.forEach((subCategory) => {
          const subCategoryName = subCategory.querySelector('li[class="nav_navi-elem"] > a').textContent;
          const elements = subCategory.querySelectorAll('a');

          elements.forEach((element) => {
            const newDiv = addHiddenDiv('categories');
            const names = [categoryName, subCategoryName, element.textContent];
            names.forEach(name => addHiddenDiv('category', name, newDiv));
            addHiddenDiv('categoryUrl', element.getAttribute('href'), newDiv);
          });
        });
      });
    });
    return await context.extract(productMenu);
  },
};
