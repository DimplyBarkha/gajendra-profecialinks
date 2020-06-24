
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const clickNextBtn = () => {
    const nextBtn = document.querySelector('a[data-test="next"]');
    if (nextBtn != null && !nextBtn.hasAttribute('disabled')) {
      nextBtn.click();
    }
  };

  function stall (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  let counter = 1;
  let results = [];
  while (true) {
    await stall(500);
    await context.waitForXPath('//ul//li');
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 9000) {
        await stall(3000);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 9000) {
          break;
        }
      }
      function stall (ms) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      function addHiddenDiv (el, myClass, content) {
        const newDiv = document.createElement('div');
        newDiv.setAttribute('class', myClass);
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        el.appendChild(newDiv);
      }
      await stall(1000);
      const itemContainers = document.querySelectorAll('li.Col-favj32-0.h-padding-a-none.h-display-flex');
      let rank = 1;
      for (const itemContainer of itemContainers) {
        if (itemContainer.querySelector('a[data-test="product-title"]')) {
          addHiddenDiv(itemContainer, 'productUrl', 'https://target.com' + itemContainer.querySelector('a[data-test="product-title"]').getAttribute('href'));
          addHiddenDiv(itemContainer, 'product-name', itemContainer.querySelector('a[data-test="product-title"]').innerText);
          let itemId = itemContainer.querySelector('a[data-test="product-title"]').getAttribute('href').split('?')[0].split('/')[4];
          itemId = itemId.split('-')[1];
          addHiddenDiv(itemContainer, 'itemId', itemId);
          const picture = itemContainer.querySelector('picture');
          if (picture && picture.querySelector('source') && picture.querySelector('source').getAttribute('srcset')) {
            addHiddenDiv(itemContainer, 'thumbnail', picture.querySelector('source').getAttribute('srcset'));
          }
          if (itemContainer.querySelector('div[data-test="ratings"]')) {
            const rating = itemContainer.querySelector('div[data-test="ratings"]').innerText.split(' ')[0];
            addHiddenDiv(itemContainer, 'rating', rating);
          }
        }
        const pageNum = document.querySelector('button[data-test="select"]') ? document.querySelector('button[data-test="select"]').innerText.split(' ')[1] : 1;
        const totalRank = ((pageNum - 1) * 24) + rank;
        addHiddenDiv(itemContainer, 'rank', totalRank);
        const endorsement = itemContainer.querySelector('.AtTargetMessage__AtTargetMessageWrapper-sc-1gv6org-0.liCFqa.h-text-grayDark');
        if (endorsement) {
          addHiddenDiv(itemContainer, 'endorsement', endorsement.innerText.trim());
        }
        rank++;
      }
    });

    await stall(250);
    const extract = await context.extract(productDetails, { transform });
    results = [...results, ...extract];
    await stall(250);
    const hasNextBtn = await context.evaluate(function () {
      const nextBtn = document.querySelector('a[data-test="next"]');
      if (nextBtn && !nextBtn.hasAttribute('disabled')) {
        return true;
      }
      return false;
    });
    if (!hasNextBtn) {
      break;
    }
    await stall(250);
    await context.evaluate(clickNextBtn);
    if (counter === 15) {
      break;
    }
    counter++;
  }
  return results;
}

const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'target',
    transform: transform,
    domain: 'target.com',
  },
  implementation,
};
