
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(function () {
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

      const sponsored = e.querySelector('.is_sponsored_sku.depth_3');
      if (sponsored && sponsored.innerText) {
        addHiddenDiv(e, 'sponsored', 'yes');
      }
    });
  });

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
