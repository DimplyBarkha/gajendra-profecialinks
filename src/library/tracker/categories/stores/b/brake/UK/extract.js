
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'brake.co.uk',
    store: 'brake',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    const isSiteMapPresent = await context.evaluate(async () => {
      return document.querySelector('ul[data-destination-id="main-nav"]') !== null;
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

        const mainCategoryContainers = document.querySelectorAll('li[class="nav__links--category auto nav__links--primary nav__links--primary-has__sub js-enquire-has-sub "]') 
        mainCategoryContainers.forEach(mainCategory => {
          const subCategoryContainers = mainCategory.querySelectorAll('div[class="yCmsComponent title js-navLinkLevel2"]');
          subCategoryContainers.forEach(subContainer => {
            const subSubCategory = mainCategory.querySelectorAll('div[class="sub-navigation-list__item"]');
            subSubCategory.forEach(category => {
              if (category.querySelector('a')) {
                const subWrapper = addHiddenDiv('cat-wrapper');
                const parent = addHiddenDiv('cat',' ', subWrapper );
                addHiddenDiv('category', mainCategory.querySelector('span>a').textContent, parent);
                addHiddenDiv('category', subContainer.querySelector('a').textContent, parent);
                addHiddenDiv('category', category.querySelector('li>a').textContent, parent);
                // if (category.querySelector('li>a').getAttribute('href')) {
                //   const url = 'https://www.brake.co.uk' + category.querySelector('li>a').getAttribute('href');
                //   addHiddenDiv('cat-url', url, subWrapper);
                // }
              } 
            });
          });
        });
      });
    } else {
      throw new Error('No categories found');
    }
    return await context.extract(productMenu);
  },
};
