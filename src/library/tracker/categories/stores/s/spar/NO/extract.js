module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'NO',
    domain: 'spar.no',
    store: 'spar',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productMenu }) => {
    await context.evaluate(async () => {
      const addedCategoriesList = document.createElement('ol');
      addedCategoriesList.id = 'added_categories_list';
      addedCategoriesList.style.display = 'none';
      document.body.appendChild(addedCategoriesList);

      const addedUrls = [];
      const allMenuUrls = document.querySelectorAll('ul.product-categories__list > li.product-categories__item.product-categories__item--inactive > a');
      for (let i = 0; i < allMenuUrls.length; i++) {
        const elem = allMenuUrls[i];
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
        const allCategoryUrls = doc.querySelectorAll('ul.product-categories__sublist > li > a');
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
