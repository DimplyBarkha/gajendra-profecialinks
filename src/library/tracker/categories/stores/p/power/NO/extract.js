module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'NO',
    domain: 'power.no',
    store: 'power',
    zipcode: '',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.evaluate(async () => {
      const addedCatList = document.createElement('ul');
      addedCatList.id = 'added_categories_list';
      addedCatList.style.display = 'none';
      document.body.appendChild(addedCatList);

      const allCatElements = document.evaluate(
        '//div[@id="menu-desktop"]//ul[contains(@class, "cat-list")]/li[not(contains(@class, "menu-show-all"))]/a',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      for (let i = 0; i < allCatElements.snapshotLength; i++) {
        console.log(i);
        const elem = allCatElements.snapshotItem(i);
        let categoryName = elem.textContent;
        if (!categoryName) {
          // @ts-ignore
          categoryName = elem.querySelector('h3') ? elem.querySelector('h3').textContent : '';
        }
        const listItem = document.createElement('li');
        listItem.setAttribute('category', categoryName);
        // @ts-ignore
        listItem.setAttribute('categoryUrl', `${window.location.protocol}//${window.location.hostname}${elem.getAttribute('href')}`);
        addedCatList.appendChild(listItem);
      }
    });

    await context.extract(productMenu);
  },
};
