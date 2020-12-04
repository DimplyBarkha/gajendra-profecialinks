const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  function stall (ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  await stall(5000);

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    document.querySelectorAll('.icon-info__body').forEach(el => {
      if (el.innerText.includes('year guarantee')) {
        addHiddenDiv('warranty', el.innerText);
      }
    });

    if (!document.getElementById('warranty')) {
      document.querySelectorAll('p').forEach(el => {
        if (el.innerText.includes('year guarantee') && !document.getElementById('warranty')) {
          addHiddenDiv('warranty', el.innerText);
        }
      });
    }

    let outOfStock = false;
    if (document.querySelector('.legacy__product__availability-messaging') &&
    document.querySelector('.legacy__product__availability-messaging').innerText.includes('Unfortunately, this product is no longer available.')) {
      outOfStock = true;
    }

    if (document.querySelector('.hero__pricing__sold-out') || outOfStock) {
      addHiddenDiv('availabilityText', 'Out of Stock');
    } else {
      addHiddenDiv('availabilityText', 'In Stock');
    }

    let enhancedContent = '';
    document.querySelectorAll('.layout').forEach(el => {
      if (el.querySelector('h2') &&
      (el.querySelector('h2').innerText.includes('In the box') ||
      el.querySelector('h2').innerText.includes('Key features') ||
      el.querySelector('h2').innerText.includes('All features'))) {
        enhancedContent += el.innerText + ' ';
      }
    });
    if (enhancedContent) {
      addHiddenDiv('hasEnhancedContent', 'Yes');
    }
    addHiddenDiv('enhancedContent', enhancedContent);

    if (document.querySelector('button[data-modal="product_mini_gallery_video"]')) {
      if (document.querySelector('video')) {
        addHiddenDiv('videos', document.querySelector('video').querySelector('source').getAttribute('src'));
      };
    };

    const specifications = [];
    document.querySelectorAll('.spec').forEach(spec => {
      if (!spec.querySelector('strong')) {
        return;
      }
      const headerText = spec.querySelector('strong').innerText;
      const specText = spec.querySelector('.spec__text').innerText;
      if (headerText === 'Height' || headerText === 'Length' || headerText === 'Width') {
        specifications.push(headerText + ' ' + specText);
      }
      if (headerText === 'Weight') {
        addHiddenDiv('weight', specText);
      }
    });
    addHiddenDiv('specifications', specifications.join(' | '));
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'dyson',
    transform,
    domain: 'dyson.co.nz',
    zipcode: '',
  },
  implementation,
};
