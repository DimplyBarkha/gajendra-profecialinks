const transform = (data) => {
  const cleanUp = (data, context) => {
    const clean = text => text.toString()
      .replace(/\r\n|\r|\n/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    for (const { group } of data) {
      for (const row of group) {
        if (row.brand) {
          if (row.brand[0].text.includes('/')) {
            row.brand[0].text = row.brand[0].text.split('/')[0].trim();
          }
        }
        if (row.mediaURL) {
          const url = row.mediaURL[0].text;
          row.mediaURL[0].text = 'https://www.vapstore.de/' + url;
        }
        if (row.flavour) {
          row.flavour.forEach(item => {
            item.text = item.text.replace("4ER PACK","");
          });
        }
        if (row.productFamily) {
          let productFamily1 = '';
          row.productFamily.forEach(item => {
            productFamily1 += `${item.text}` + ' / ';
          });
          productFamily1 = productFamily1.slice(0, -1).trim();
          row.productFamily = [
            {
              text: productFamily1,
            },
          ];
        }

        if (row.aggregateRating) {
          let aggregateRating = row.aggregateRating[0].text;
          aggregateRating = aggregateRating.replace('Durchschnittliche Artikelbewertung: ', '');
          aggregateRating = aggregateRating.replace('/5', '');
          row.aggregateRating[0].text = aggregateRating;
        }
      }
    }

    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));

    return data;
  };
  return cleanUp(data);
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;
  const { transform } = parameters;

  await context.evaluate(async () => {
    function addHiddenDiv (elementID, content) {
      const newDiv = document.createElement('div');
      newDiv.className = elementID;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    var elePagination = document.querySelector('div.review');
    if (!elePagination) {
      addHiddenDiv('no_reviews', 'no reviews available');
    }

    var ele = document.querySelector('#buy_form');
    if (ele.length > 0) {
      var eleTag = ele.getAttribute('data-track-p-items');
      var tagVal = JSON.parse(eleTag);
      if (tagVal[0].id) {
        addHiddenDiv('vapstore_sku', tagVal[0].id);
      }
    }
  });

  const data = await context.extract(productReviews, { transform });

  return data;
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'vapstore',
    transform,
    domain: 'vapstore.de',
    zipcode: "''",
  },
  implementation,
};
