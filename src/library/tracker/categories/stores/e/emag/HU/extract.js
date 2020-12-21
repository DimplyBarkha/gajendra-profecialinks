async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;

  await context.evaluate(async function () {
    function addHiddenDiv (id, content, parentDiv = null) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      if (parentDiv) {
        parentDiv.appendChild(newDiv);
      } else {
        document.body.appendChild(newDiv);
      }
      return newDiv;
    }
    const prefix = 'https://www.emag.hu';
    const mainCategory = document.querySelector('li[class*="main-megamenu"] ');
    // @ts-ignore
    const mainCatText = mainCategory.innerText.split('\n').shift();
    // @ts-ignore
    mainCategory.click();
    await new Promise((resolve, reject) => setTimeout(resolve, 1500));

    const lvl2Categories = document.querySelectorAll('ul.megamenu-list li[data-id]');

    for (let i = 0; i < lvl2Categories.length; i++) {
      const lvl2Text = lvl2Categories[i].querySelector('span').innerText;
      // @ts-ignore
      lvl2Categories[i].click();
      await new Promise((resolve, reject) => setTimeout(resolve, 1500));
      const lvl3 = lvl2Categories[i].parentElement.parentElement.nextElementSibling.querySelectorAll('div.megamenu-details-department')[i].querySelectorAll('a[class*="item-heading"], div[class*="item-heading"]');
      for (let j = 0; j < lvl3.length; j++) {
        // @ts-ignore
        const lvl3Text = lvl3[j].innerText;
        const lvl3Link = prefix.concat(lvl3[j].getAttribute('href'));
        if (lvl3[j].classList.contains('ph-collapse-one')) {
          // @ts-ignore
          lvl3[j].click();
          await new Promise((resolve, reject) => setTimeout(resolve, 1500));
          if (lvl3[j].nextElementSibling.classList.contains('megamenu-group')) {
            const lvl4 = lvl3[j].nextElementSibling.querySelectorAll('a');
            const lvl4Another = lvl3[j].parentElement.nextElementSibling
              ? lvl3[j].parentElement.nextElementSibling.querySelectorAll(':not([class*="megamenu-group"]) > a:not([class*="item-heading"]) ')
              : [];
            const lvl4Array = [];
            for (let l = 0; l < lvl4.length; l++) lvl4Array.push(lvl4[l]);
            for (let m = 0; m < lvl4Another.length; m++) if (lvl4Another.length !== 0) lvl4Array.push(lvl4Another);
            for (let k = 0; k < lvl4Array.length; k++) {
              // @ts-ignore
              const lvl4Text = lvl4Array[k].innerText !== undefined ? lvl4Array[k].innerText : lvl4Array[k][0].innerText;
              // @ts-ignore
              const lvl4Link = lvl4Array[k].getAttribute !== undefined
                // @ts-ignore
                ? prefix.concat(lvl4Array[k].getAttribute('href'))
                : prefix.concat(lvl4Array[k][0].getAttribute('href'));
              const newDiv = addHiddenDiv('categories', '');
              addHiddenDiv('category', mainCatText, newDiv);
              addHiddenDiv('category', lvl2Text, newDiv);
              // @ts-ignore
              addHiddenDiv('category', lvl3Text, newDiv);
              addHiddenDiv('category', lvl4Text, newDiv);
              addHiddenDiv('categoryUrl', lvl4Link, newDiv);
            }
          }
        } else {
          const newDiv = addHiddenDiv('categories', '');
          addHiddenDiv('category', mainCatText, newDiv);
          addHiddenDiv('category', lvl2Text, newDiv);
          // @ts-ignore
          addHiddenDiv('category', lvl3Text, newDiv);
          addHiddenDiv('categoryUrl', lvl3Link, newDiv);
        }
      }
      // @ts-ignore
      lvl2Categories[i].click();
      await new Promise((resolve, reject) => setTimeout(resolve, 1500));
    }
  });

  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'HU',
    domain: 'emag.hu',
    store: 'emag',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
