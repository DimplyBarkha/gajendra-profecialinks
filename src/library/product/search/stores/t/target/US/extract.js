
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
  while (true) {
    await stall(1000);
    await context.evaluate(async function () {
      function stall (ms) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(300);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          break;
        }
      }
    });

    const noImages = await context.evaluate(async function () {
      const itemContainers = document.querySelectorAll('li.Col-favj32-0.h-padding-a-none.h-display-flex');
      const products = [];
      for (const itemContainer of itemContainers) {
        let itemId = itemContainer.querySelector('a[data-test="product-title"]').getAttribute('href').split('?')[0].split('/')[4];
        itemId = itemId.split('-')[1];
        if (!itemContainer.querySelector('source') || !itemContainer.querySelector('source').getAttribute('srcset')) {
          products.push('https://target.com' + itemContainer.querySelector('a[data-test="product-title"]').getAttribute('href'));
        }
      }
      return products;
    });

    const currentUrl = await context.evaluate(function () {
      return window.location.href;
    });

    const fetchedImages = [];
    for (const productLink of noImages) {
      await context.goto(productLink);
      await context.waitForXPath("//div[@data-test='product-price']");
      let itemId = productLink.replace('https://target.com', '').split('?')[0].split('/')[4];
      itemId = itemId.split('-')[1];
      const image = await context.evaluate(function () {
        if (document.querySelectorAll('.styles__ThumbnailImage-beej2j-11').length && document.querySelectorAll('.styles__ThumbnailImage-beej2j-11')[0].getAttribute('src')) {
          return document.querySelectorAll('.styles__ThumbnailImage-beej2j-11')[0].getAttribute('src');
        }
        const pictureDiv = document.querySelector('.slideDeckPicture');
        if (pictureDiv.querySelector('img') && pictureDiv.querySelector('img').getAttribute('src')) {
          return pictureDiv.querySelector('img').getAttribute('src').replace(/700/g, '325');
        }
      });
      fetchedImages.push(itemId + ',' + image);
    }

    console.log(fetchedImages);

    await context.goto(currentUrl);
    await context.waitForXPath('//ul//li');
    await context.evaluate(async function () {
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.id = 'missingImages';
      document.getElementById('header').appendChild(input);
    });
    await context.setInputValue('#missingImages', fetchedImages.join(' '));
    await context.evaluate(async function () {
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
          if (itemContainer.querySelector('source') && itemContainer.querySelector('source').getAttribute('srcset')) {
            addHiddenDiv(itemContainer, 'thumbnail', itemContainer.querySelector('source').getAttribute('srcset'));
          } else {
            let image = '-';
            document.getElementById('missingImages').value.split(' ').forEach(imageStr => {
              if(imageStr && imageStr.split(',')[0] === itemId) {
                image = imageStr.split(',')[1];
              }
            });
            addHiddenDiv(itemContainer, 'thumbnail', image);
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

    await stall(1000);
    const extract = await context.extract(productDetails, { transform });
    await stall(500);
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
    await stall(500);
    await context.evaluate(clickNextBtn);
    if (counter === 7) {
      break;
    }
    counter++;
    return extract;
  }
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
