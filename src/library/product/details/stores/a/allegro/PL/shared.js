
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/^ +| +$|( )+/g, ' ')
  // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();

  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        const availabilityText = row.availabilityText[0].text;
        if (availabilityText.includes('OutOfStock')) {
          row.availabilityText = [{ text: 'Out of Stock' }];
        } else {
          row.availabilityText = [{ text: 'In Stock' }];
        }
      }

      if (row.aggregateRating) {
        const ratingValue = row.aggregateRating[0].text;
        row.aggregateRating = [{ text: ratingValue.replace('.', ',') }];
      }

      if (row.price) {
        const price = row.price[0].text;
        row.price = [{ text: price.replace('.', ',') }];
      }

      if (!row.sku && row.skuSecondary) {
        row.sku = row.skuSecondary;
      }

      if (!row.manufacturerImages && row.manufacturerImagesLovela) {
        row.manufacturerImages = row.manufacturerImagesLovela;
      }

      if (!row.shippingInfo && row.shippingInfoLovela) {
        row.shippingInfo = row.shippingInfoLovela;
      }

      if (row.shippingInfo) {
        let shippingInfo = row.shippingInfo[0].text;
        const lastCharachter = shippingInfo.charAt(shippingInfo.length - 1);
        if (lastCharachter === '-') {
          shippingInfo = shippingInfo.substring(0, shippingInfo.length - 1);
          row.shippingInfo = [{ text: shippingInfo }];
        }
      }

      if (row.directions) {
        const directionsArray = row.directions;
        let directions = '';
        for (const direction of directionsArray) {
          directions += `${direction.text} `;
        }
        row.directions = [{ text: directions }];
      }

      if (row.manufacturerDescription) {
        const enhancedContentArray = row.manufacturerDescription;
        let enhancedContent = '';
        for (const content of enhancedContentArray) {
          enhancedContent += `${content.text} `;
        }
        row.manufacturerDescription = [{ text: enhancedContent }];
      }

      if (!row.imageAlt && row.nameExtended) {
        row.imageAlt = row.nameExtended;
      }

      // if (!row.nameExtended && row.nameExtendedFromH4) {
      //   row.nameExtended = row.nameExtendedFromH4;
      //   row.name = row.nameExtendedFromH4;
      // }

      if (!row.variantInformation && row.simpleColor) {
        row.variantInformation = row.simpleColor;
        row.color = row.simpleColor;
      }

      if (!row.quantity) {
        row.quantity = row.quantityFromProdTitle;
      }

      if (row.specifications) {
        let text = '';
        row.specifications.forEach(spec => {
          text = text + (text ? ' || ' : '') + spec.text;
        });
        text = text.replace(/:/g, ' : ');
        row.specifications = [{ text }];
      }

      if (row.inTheBoxText) {
        let text = '';
        row.inTheBoxText.forEach(item => {
          item.text = item.text.includes('Zakres dostawy:') ? item.text.replace('Zakres dostawy:', '') : item.text;
          if (item.text) {
            text = text + (text ? ' || ' : '') + item.text;
          }
        });
        row.inTheBoxText = [{ text }];
      }
    }
  }

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(function (header) {
    if (row[header]) {
      row[header].forEach(el => {
        el.text = clean(el.text);
      });
    }
  })));

  return data;
};

module.exports = { transform };
