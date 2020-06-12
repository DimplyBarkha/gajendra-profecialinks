
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

      function addHiddenDiv (el, myClass, content) {
        const newDiv = document.createElement('div');
        newDiv.setAttribute('class', myClass);
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        el.appendChild(newDiv);
      }

      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          break;
        }
      }

      /*const iframe = document.createElement('iframe');
      iframe.setAttribute('id', 'tempFrame');
      document.getElementById('skipLinks').appendChild(iframe);
      iframe.onload = function() {
        iframe.contentWindow.scrollTo(0, 500);
      }
      document.getElementById('tempFrame').style.zIndex = 100;
      document.getElementById('tempFrame').style.height = "500px";
      document.getElementById('tempFrame').style.width = "500px";*/


      await stall(1000);
      const itemContainers = document.querySelectorAll('li.Col-favj32-0.bZxgbc.h-padding-a-none');
      let rank = 1;
      for (const itemContainer of itemContainers) {
        if (itemContainer.querySelector('a[data-test="product-title"]')) {
          addHiddenDiv(itemContainer, 'productUrl', "https://target.com" + itemContainer.querySelector('a[data-test="product-title"]').getAttribute('href'));
          addHiddenDiv(itemContainer, 'product-name', itemContainer.querySelector('a[data-test="product-title"]').innerText);
          let itemId = itemContainer.querySelector('a[data-test="product-title"]').getAttribute('href').split('?')[0].split('/')[4];
          itemId = itemId.split('-')[1];
          addHiddenDiv(itemContainer, 'itemId', itemId);
          if(itemContainer.querySelector('source') && itemContainer.querySelector('source').getAttribute('srcset')) {
            addHiddenDiv(itemContainer, 'thumbnail', itemContainer.querySelector('source').getAttribute('srcset'));
          } /*else {
            document.getElementById('tempFrame').setAttribute('src', "https://target.com/s?searchTerm=" + itemId);
            let thumbnail = false;
            while(!thumbnail) {
              await stall(1000);
              let productCard = document.getElementById('tempFrame').contentWindow.document.querySelector('div[data-test="product-card-default"]');
              if(productCard) {
                if(productCard.querySelector('source')) {
                  thumbnail = productCard.querySelector('source').getAttribute('srcset');
                }
              }
            }
            addHiddenDiv(itemContainer, 'thumbnail', thumbnail);
          }*/
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

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'target',
    transform: null,
    domain: 'target.com',
  },
  implementation,
};
