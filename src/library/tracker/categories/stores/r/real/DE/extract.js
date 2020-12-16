module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'real.de',
    store: 'real',
    zipcode: '',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.evaluate(async () => {
      const addedCatList = document.createElement('ul');
      addedCatList.id = 'added_categories_list';
      addedCatList.style.display = 'none';
      document.body.appendChild(addedCatList);

      const allCatElements = document.evaluate(
        '//div[contains(@class, "nav-categories")]//a[not(contains(@class, "-head"))]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      for (let i = 0; i < allCatElements.snapshotLength; i++) {
        const elem = allCatElements.snapshotItem(i);
        if (elem.getAttribute('href')) {
          let categoryName = elem.textContent;
          if (!categoryName) {
            // @ts-ignore
            categoryName = elem.querySelector('span') ? elem.querySelector('span').textContent : '';
          }
          const listItem = document.createElement('li');
          listItem.setAttribute('category', categoryName);
          // @ts-ignore
          listItem.setAttribute(
            'categoryUrl',
            `${window.location.protocol}//${window.location.hostname}${elem.getAttribute('href')}`,
          );
          addedCatList.appendChild(listItem);
        }
      }
    });

    await context.extract(productMenu);
  },
};
