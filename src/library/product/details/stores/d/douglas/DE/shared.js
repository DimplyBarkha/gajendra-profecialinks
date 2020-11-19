/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        const availabilityText = row.availabilityText[0].text.trim() === 'Auf Lager' ? 'In stock' : 'Out of stock';
        row.availabilityText[0].text = availabilityText;
      }

      if (row.gtin) {
        const upcObj = JSON.parse(row.gtin[0].text);
        row.gtin[0].text = upcObj.gtin13;
      }

      if (row.variantId) {
        const productInfo = row.variantId[0].text;
        const referenceText = 'window.customExactagConfig =';
        const productData = JSON.parse(productInfo.substring((productInfo.indexOf(referenceText) + referenceText.length), productInfo.indexOf('}') + 1));
        row.variantId[0].text = productData.product_id;
      }

      if (row.aggregateRating) {
        const aggregateRating2 = row.aggregateRating[0].text;
        const ratingValue = JSON.parse(aggregateRating2);
        if (ratingValue && ratingValue.aggregateRating && ratingValue.aggregateRating.ratingValue !== null) {
          row.aggregateRating[0].text = JSON.parse(aggregateRating2).aggregateRating.ratingValue.toFixed(1).toString().replace('.', ',');
        } else {
          delete row.aggregateRating;
        }
      }

      if (row.aggregateRating2) {
        const aggregateRating2 = row.aggregateRating2[0].text;
        const ratingValue = JSON.parse(aggregateRating2);
        if (ratingValue && ratingValue.aggregateRating && ratingValue.aggregateRating.ratingValue !== null) {
          row.aggregateRating2[0].text = JSON.parse(aggregateRating2).aggregateRating.ratingValue.toFixed(1).toString().replace('.', ',');
        } else {
          delete row.aggregateRating2;
        }
      }

      if (row.manufacturerDescription) {
        var finalDescription = '';
        for (const description of row.manufacturerDescription) {
          finalDescription += ' ' + description.text;
        }
        row.manufacturerDescription = [{ text: finalDescription.trim() }];
      }

      if (row.color) {
        const color = row.color[0].text;
        row.color[0].text = color.substring(color.lastIndexOf(':') + 1).trim();
      }

      if (row.descriptionChunck) {
        let text = '';
        row.descriptionChunck.forEach(item => {
          text += `${item.text} `;
        });
        row.descriptionChunck = [
          {
            text: text.trim(),
          },
        ];
      }

      if (row.description) {
        // row.description[0].text = `|| ${row.description[0].text}`;
        for (let i = 0; i < row.description.length; i++) {
          row.description[i].text = `|| ${row.description[i].text}`;
        }

        if (row.descriptionChunck) {
          row.description[row.description.length - 1].text = `${row.description[row.description.length - 1].text} ${row.descriptionChunck[0].text}`;
        }

        if (row.descriptionliChunck) {
          let liChunk = row.descriptionliChunck;
          for (let i = 0; i < liChunk.length; i++) {
            liChunk[i].text = `|| ${liChunk[i].text}`;
          }
          row.description = row.description.concat(liChunk);
        }
      }

      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo[0].text = `|| ${row.additionalDescBulletInfo[0].text}`;
      }

      if (row.sku) {
        let skuStr = row.sku[0].text;
        skuStr = skuStr.replace('var dglDataLayer =', '').trim();
        skuStr = skuStr.replace(';', '');
        skuStr = JSON.parse(skuStr);
        row.sku = [{ text: skuStr.master_id }];
      }

      if (row.variantInformation) {
        if (row.color) {
          row.variantInformation = [{ text: row.color[0].text }];
          if (row.color[0].text === 'ProductName' && row.quantity) {
            row.variantInformation = [{ text: row.quantity[0].text }];
          }
        }
      }

      if (row.nameExtended) {
        let nameExtended = row.nameExtended[0].text;
        if (row.variantInformation) {
          nameExtended += ` ${row.variantInformation[0].text}`;
        } else if (row.quantity) {
          nameExtended += ` ${row.quantity[0].text}`;
        };
        row.nameExtended = [{ text: nameExtended }];
      }
    }
  }

  // Clean up data
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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };
