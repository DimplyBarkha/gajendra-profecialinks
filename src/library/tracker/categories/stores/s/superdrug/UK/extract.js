
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'superdrug.com',
    store: 'superdrug',
    zipcode: '',
  }, implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;


    await context.evaluate(async () => {
      function addHiddenDiv(id, content, parentDiv = null) {
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
      const categories = document.querySelectorAll('div.hygiene-page__wrap:nth-of-type(1) div.sitemap-page__link-box');

      categories.forEach((category) => {
        const categoryName = category.querySelector('a.sdp__title-link').textContent;
        const subCategories = category.querySelectorAll('ul.sitemap-page__link-wrap li');

        subCategories.forEach((subCategory) => {
          const subCategoryName = subCategory.querySelector('a').textContent;
          const elements = subCategory.querySelectorAll('a');

          elements.forEach((element) => {
            const newDiv = addHiddenDiv('categories');
            const names = [categoryName, subCategoryName];
            names.forEach(name => addHiddenDiv('category', name, newDiv));
            addHiddenDiv('categoryUrl', element.getAttribute('href'), newDiv);
          });
        });
      });
    });
    return await context.extract(productMenu);
  },
};
