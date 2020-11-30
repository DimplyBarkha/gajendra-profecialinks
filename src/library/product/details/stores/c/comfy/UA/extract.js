async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);
  await context.evaluate(() => {
    function addHiddenDiv (el, myClass, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', myClass);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }
    const links = [];
    document.querySelectorAll('#featuresList > li').forEach(e => {
      var TP = e.getElementsByTagName('p');
      if (TP[0].textContent === 'Технические характеристики') {
        var divs = e.querySelectorAll('div.features-item__list-wr > dl');
        divs.forEach(Item => {
          var text1 = Item.getElementsByTagName('dt')[0].childNodes[0].textContent;
          text1 = text1.replace('\n', '').trim();
          console.log(text1);
          var text2 = Item.getElementsByTagName('dd')[0].textContent;
          text2 = text2.replace('\n', '').trim();
          console.log(text2);
          links.push(text1 + ': ' + text2);
        });
        addHiddenDiv(document.body, 'specifications', links.join(' || '));
      }
    });

    const aggregateRating = document.querySelectorAll('#galleryPopupInfo > div.product-card__reviews.js-open-tab > div > div.rating-box__active');
    for (let k = 0; k < aggregateRating.length; k++) {
      // @ts-ignore
      let singleRating = aggregateRating[k].style.width;
      singleRating = singleRating.slice(0, singleRating.length - 1);
      singleRating = (5 * singleRating) / 100;
      singleRating = singleRating.toFixed(1);
      addHiddenDiv(aggregateRating[k], 'aggregateRating', singleRating);
    }

    const itemContainers = document.querySelectorAll('div.lblock.lft');
    let rank = 1;
    for (const itemContainer of itemContainers) {
      console.log(itemContainer);
      const totalRank = itemContainer + rank;
      addHiddenDiv(itemContainer, 'rank', totalRank);
      rank++;
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UA',
    store: 'comfy',
    transform: null,
    domain: 'comfy.ua',
    zipcode: '',

  },
  implementation,
};
