
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'ES',
    domain: 'keshop.com',
    store: 'keshop',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    const isMenuPresent = await context.evaluate(async () => {
      return document.querySelector('ul[id="iqitmegamenu-accordion"]') !== null;
    });

    if (isMenuPresent) {
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
        const mainCategoryContainers = document.querySelectorAll('div[class="cbp-mobilesubmenu"] ul[id="iqitmegamenu-accordion"]>li');
        mainCategoryContainers.forEach(mainCategory => {
          const subCategories = mainCategory.querySelector('ul');
          if (subCategories) {
            subCategories.querySelectorAll('li').forEach(Category => {
              const wrapper = addHiddenDiv('category-wrapper');
              addHiddenDiv('category', mainCategory.querySelector('a') ? mainCategory.querySelector('a').textContent : '', wrapper);
              const subcat = addHiddenDiv('category', Category.querySelector('a') ? Category.querySelector('a').textContent : '', wrapper);
              addHiddenDiv('categoryUrl', Category.querySelector('a') ? Category.querySelector('a').getAttribute('href') : '', wrapper);
            });
          } else {
            const wrapper = addHiddenDiv('category-wrapper');
            const parent = addHiddenDiv('category', mainCategory.querySelector('a') ? mainCategory.querySelector('a').textContent : '', wrapper);
            addHiddenDiv('categoryUrl', mainCategory.querySelector('a') ? mainCategory.querySelector('a').getAttribute('href') : '', wrapper);
          }
        });
      });
    } else {
      throw new Error('No categories found');
    }
    return await context.extract(productMenu);
  },
};
