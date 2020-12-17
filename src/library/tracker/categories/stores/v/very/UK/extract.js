
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'very.co.uk',
    store: 'very',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    const isMenuPresent = await context.evaluate(async () => {
      return document.querySelector('div[id="topNav"]') !== null;
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
        const mainCategoryContainers = document.querySelectorAll('div[id="topNav"] a');
        mainCategoryContainers.forEach(mainCategory => {
          const subMenuContainer = document.querySelectorAll('div[class="topNavMenu"]');
          console.log(subMenuContainer.length);
          subMenuContainer.forEach(categories => {
            if (categories.id.includes(mainCategory.textContent.split(' ')[0])) {
              const subCategoriesContainer = categories.querySelectorAll('div[class="topNavCol"]');
              subCategoriesContainer.forEach(subCategory => {
                const subCategotyName = subCategory.querySelectorAll('h3')
                const subSubategoryName = subCategory.querySelectorAll('a')
                subCategotyName.forEach(subCategory => {
                  console.log(subCategory.textContent);
                });              
              });
            } else {
              // const wrapper = addHiddenDiv('category-wrapper');
              // addHiddenDiv('category', mainCategory ? mainCategory.textContent : '', wrapper);
              // addHiddenDiv('categoryUrl', mainCategory ? mainCategory.getAttribute('href') : '', wrapper);
            }
          });
        });
      });
    } else {
      throw new Error('No categories found');
    }
    return await context.extract(productMenu);
  },
};
