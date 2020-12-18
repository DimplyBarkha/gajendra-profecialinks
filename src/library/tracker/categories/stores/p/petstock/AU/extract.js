
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'AU',
    domain: 'petstock.com.au',
    store: 'petstock',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    const isSiteMapPresent = await context.evaluate(async () => {
      return document.querySelector('div.mega-menu-container') !== null;
    });

    if (isSiteMapPresent) {
      await context.evaluate(async () => {
        function addHiddenDiv (id, content, parentDiv = null) {
          const newDiv = document.createElement('div');
          newDiv.dataset.id = id;
          if (!content) content = '';
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          if (parentDiv) {
            parentDiv.appendChild(newDiv);
          } else {
            document.body.appendChild(newDiv);
          }
          return newDiv;
        }

        const mainCategoryContainers = document.querySelectorAll(
          'ul.root-categories-desktop > li div.categories',
        );
        mainCategoryContainers.forEach((mainCategory, index) => {
          if (index === mainCategoryContainers.length - 1) {
            return;
          }
          const categories = mainCategory.querySelectorAll(
            'ul > li > a',
          );
          categories.forEach((category) => {
            const wrapper = addHiddenDiv('cat-wrapper');
            addHiddenDiv(
              'cat',
              mainCategory.querySelector('div.categories__title > a')
                ? mainCategory.querySelector('div.categories__title > a').textContent
                : '',
              wrapper,
            );
            addHiddenDiv(
              'cat',
              category.textContent,
              wrapper,
            );
            addHiddenDiv(
              'cat-url',
              category.getAttribute('href'),
              wrapper,
            );
          });
        });
      });
    } else {
      throw new Error('No categories found');
    }
    return await context.extract(productMenu);
  },
};
