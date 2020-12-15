
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'CH',
    domain: 'brack.ch',
    store: 'brack',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    const isNavPresent = await context.evaluate(async () => {
      return document.querySelector('nav#topNavigation') !== null;
    });

    if (isNavPresent) {
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

        const mainCategoryContainers = document.querySelectorAll('nav#topNavigation > ul > li');
        mainCategoryContainers.forEach(mainCategory => {
          const categoryContainers = mainCategory.querySelectorAll('li[aria-level="2"][aria-expanded]');
          categoryContainers.forEach(category => {
            const subCategories = category.querySelectorAll('li:not([hidden]):not([class*="image"]) > a');
            if (subCategories && subCategories.length > 0) {
              subCategories.forEach(subCategory => {
                const subWrapper = addHiddenDiv('cat-wrapper');
                addHiddenDiv('cat', mainCategory.querySelector('li[aria-level="1"] > span > a') ? mainCategory.querySelector('li[aria-level="1"] > span > a').textContent : '', subWrapper);
                addHiddenDiv('cat', category.querySelector('li[aria-level="2"] > span > a') ? category.querySelector('li[aria-level="2"] > span > a').textContent : '', subWrapper);
                addHiddenDiv('cat', subCategory.textContent, subWrapper);
                addHiddenDiv('cat-url', subCategory.getAttribute('href'), subWrapper);
              });
            }// else {
            //   const wrapper = addHiddenDiv('cat-wrapper');
            //   addHiddenDiv('cat', mainCategory.querySelector('h3 a') ? mainCategory.querySelector('h3 a').textContent : '', wrapper);
            //   addHiddenDiv('cat', category.querySelector('a') ? category.querySelector('a').textContent : '', wrapper);
            //   addHiddenDiv('cat-url', category.querySelector('a') ? category.querySelector('a').getAttribute('href') : '', wrapper);
            // }
          });
        });
      });
    } else {
      throw new Error('No categories found');
    }
    return await context.extract(productMenu);
  },
};
