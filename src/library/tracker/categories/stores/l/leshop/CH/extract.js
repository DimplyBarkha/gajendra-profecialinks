module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'CH',
    domain: 'leshop.ch',
    store: 'leshop',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productMenu }) => {
    const categoriesTotal = await context.evaluate(
      async () => document.querySelectorAll('nav#sidebar-navigation ul.menu-1 > li > a').length,
    );

    let allCategoriesArr = [];
    for (let i = 1; i <= categoriesTotal; i++) {
      await context.click(`nav#sidebar-navigation ul.menu-1 > li:nth-child(${i}) > a`);
      await context.waitForNavigation({ timeout: 20000 });
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const currCategoriesArr = await context.evaluate(async () => {
        const categories = document.querySelectorAll(
          'ul.subcategory-container a, div#special-diets div.products-view-body a',
        );
        const resultArr = [];
        categories.forEach((elem) => {
          let name = elem.textContent.trim();
          if (!name) {
            name = elem.querySelector('img') ? elem.querySelector('img').getAttribute('alt') : '';
          }
          resultArr.push({ category: name, categoryUrl: elem.href });
        });
        return resultArr;
      });
      allCategoriesArr = [...allCategoriesArr, ...currCategoriesArr];
    }

    await context.evaluate(async (allCategoriesArr) => {
      const addedCategoriesList = document.createElement('ol');
      addedCategoriesList.id = 'added_categories_list';
      addedCategoriesList.style.display = 'none';
      document.body.appendChild(addedCategoriesList);

      allCategoriesArr.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('category', item.category);
        listItem.setAttribute('categoryUrl', item.categoryUrl);
        addedCategoriesList.appendChild(listItem);
      });
    }, allCategoriesArr);

    await context.extract(productMenu);
  },
};
