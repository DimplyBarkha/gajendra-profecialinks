
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  function stall (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  await context.evaluate(function() {

    function addHiddenDiv (el, myClass, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', myClass);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }

    if (!document.querySelectorAll('td.Item.depth_2>table>tbody>tr').length) {
      return [];
    }

    document.querySelectorAll('td.Item.depth_2>table>tbody>tr').forEach(e => {
      const baseUrl = e.querySelector('.base_url.depth_4') ? e.querySelector('.base_url.depth_4').innerText : '';
      const imageUrl = e.querySelector('.primary.depth_4') ? e.querySelector('.primary.depth_4').innerText : '';
      if (baseUrl.length && imageUrl.length) {
        addHiddenDiv(e, 'thumbnail', baseUrl + imageUrl);
      }

      const productUrl = e.querySelector('.url.depth_3').innerText;
      addHiddenDiv(e, 'url', 'https://www.target.com' + productUrl);

      const brand = e.querySelector('.brand.depth_3') ? e.querySelector('.brand.depth_3').innerText : '';
      if (brand.length) {
        addHiddenDiv(e, 'brand', brand);
      }

      const reviewCount = e.querySelector('.total_review_count.depth_3') ? e.querySelector('.total_review_count.depth_3').innerText : '';
      if (reviewCount.length && reviewCount > 0) {
        addHiddenDiv(e, 'reviewCount', reviewCount);
      }

      const sponsored = e.querySelector('.is_sponsored_sku.depth_3')
      if(sponsored && sponsored.innerText) {
        addHiddenDiv(e, 'sponsored', 'yes');
      }

    });
  });

  /*await context.waitForXPath("//li[@class='Col-favj32-0 diyyNr h-padding-a-none h-display-flex']");
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop !== 5000) {
      await stall(2500);
      scrollTop += 500;
      window.scroll(0, scrollTop);
      if (scrollTop === 5000) {
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
    for (const itemContainer of itemContainers) {
      if (itemContainer.querySelector('a[data-test="product-title"]')) {
        addHiddenDiv(itemContainer, 'productUrl', 'https://target.com' + itemContainer.querySelector('a[data-test="product-title"]').getAttribute('href'));
        addHiddenDiv(itemContainer, 'product-name', itemContainer.querySelector('a[data-test="product-title"]').getAttribute('aria-label'));
        let itemId = '';
        if (itemContainer.querySelector('a[data-test="product-title"]').getAttribute('href').indexOf('preselect=') > -1) {
          itemId = itemContainer.querySelector('a[data-test="product-title"]').getAttribute('href').split('preselect=')[1];
          itemId = itemId.split('#')[0];
        } else {
          itemId = itemContainer.querySelector('a[data-test="product-title"]').getAttribute('href').split('?')[0].split('/')[4];
          itemId = itemId.split('-')[1];
        }
        addHiddenDiv(itemContainer, 'itemId', itemId);
        const picture = itemContainer.querySelector('picture');
        if (picture && picture.querySelector('source') && picture.querySelector('source').getAttribute('srcset')) {
          addHiddenDiv(itemContainer, 'thumbnail', picture.querySelector('source').getAttribute('srcset'));
        }
        if (itemContainer.querySelector('div[data-test="ratings"]')) {
          const rating = itemContainer.querySelector('div[data-test="ratings"]').innerText.split(' ')[0];
          addHiddenDiv(itemContainer, 'rating', rating);
        }
        addHiddenDiv(itemContainer, 'ratingCount', itemContainer.querySelector('span[data-test="product-rating-count"]') ? itemContainer.querySelector('span[data-test="product-rating-count"]').innerText : '');
      }

      const endorsement = itemContainer.querySelector('.AtTargetMessage__AtTargetMessageWrapper-sc-1gv6org-0.liCFqa.h-text-grayDark');
      if (endorsement) {
        addHiddenDiv(itemContainer, 'endorsement', endorsement.innerText.trim());
      }
    }
  });

  await stall(250);*/
  const extract = await context.extract(productDetails, { transform });
  return extract;
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
