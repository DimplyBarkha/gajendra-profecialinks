module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'FR',
    domain: 'jpg.fr',
    store: 'jpg',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productMenu }) => {
    await context.evaluate(async () => {
      const addedCategoriesList = document.createElement('ol');
      addedCategoriesList.id = 'added_categories_list';
      addedCategoriesList.style.display = 'none';
      document.body.appendChild(addedCategoriesList);

      const staticMenuUrls = document.querySelectorAll('nav#menu ul > li > a.nav-static');
      staticMenuUrls.forEach((elem) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('category', elem.textContent.trim());
        listItem.setAttribute('category_url', elem.href);
        addedCategoriesList.appendChild(listItem);
      });
    });

    await context.evaluate(async () => {
      const addedCategoriesList = document.getElementById('added_categories_list');
      const addedUrls = [];
      const totalBurgerUrls = document.querySelectorAll('nav#menu ul > li > a.burger-menu-item');
      for (let i = 0; i < totalBurgerUrls.length; i++) {
        const elem = totalBurgerUrls[i];
        const categoryUrl = elem.href;
        const listItem = document.createElement('li');
        listItem.setAttribute('category', elem.textContent.trim());
        listItem.setAttribute('category_url', categoryUrl);
        addedCategoriesList.appendChild(listItem);

        const doc = await fetch(categoryUrl)
          .then((resp) => resp.text())
          .then((resp) => {
            const parser = new DOMParser();
            return parser.parseFromString(resp, 'text/html');
          })
          .catch((err) => {
            console.log(err);
            throw new Error('Failed to fetch category DOM');
          });
        const allCategoryUrls = doc.querySelectorAll('article.top-first-level__item a:not(.card-link-all)');
        allCategoryUrls.forEach((elem) => {
          const url = elem.href;
          if (!addedUrls.includes(url)) {
            const listItem = document.createElement('li');
            listItem.setAttribute('category', elem.textContent.trim());
            listItem.setAttribute('category_url', url);
            addedCategoriesList.appendChild(listItem);
          }
        });
      }
    });

    await context.extract(productMenu);
  },
};
