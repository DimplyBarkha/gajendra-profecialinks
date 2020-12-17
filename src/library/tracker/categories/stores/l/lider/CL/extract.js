
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'CL',
    domain: 'lider.cl',
    store: 'lider',
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

      const siteUrl = 'https://www.lider.cl';
      const categories = document.querySelectorAll('div.department');

      categories.forEach((category) => {
        const categoryName = category.querySelector('h2 > a').textContent;
        const subCategories = category.querySelectorAll('div[class="category"]');

        subCategories.forEach((subCategory) => {
          const subCategoryName = subCategory.querySelector('h3 > a').textContent;
          const elements = subCategory.querySelectorAll('ul.subcats > li > a');

          elements.forEach((element) => {
            const newDiv = addHiddenDiv('categories');
            const names = [categoryName, subCategoryName, element.textContent];
            names.forEach(name => addHiddenDiv('category', name, newDiv));

            let categoryUrl = element.getAttribute('href');
            if (!categoryUrl.includes(siteUrl) && categoryUrl) {
              categoryUrl = siteUrl + categoryUrl;
            }
            addHiddenDiv('categoryUrl', categoryUrl, newDiv);
          });
        });
      });
    });
    return await context.extract(productMenu);
  },
};
