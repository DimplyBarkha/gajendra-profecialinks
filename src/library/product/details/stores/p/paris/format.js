/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  for (const { group } of data) {
    for (const row of group) {
      const specificationArray = [];
      if (row.specifications) {
        row.specifications.forEach(specificationItem => {
          specificationArray.push(specificationItem.text);
        });
      }
      row.specifications = [{ text: specificationArray.join(' | ') }];
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(shippingDimensionsItem => {
          shippingDimensionsItem.text = shippingDimensionsItem.text.replace(/\([^()]*\)/gm, '').trim();
        });
      }
      if (row.price) {
        row.price.forEach((priceItem) => {
          priceItem.text = priceItem.text.replace(/[^\d]/gm, '');
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach((listPriceItem) => {
          listPriceItem.text = listPriceItem.text.replace(/[^\d]/gm, '');
        });
      }
      if (row.imageAlt) {
        row.imageAlt.forEach((imageAltItem) => {
          imageAltItem.text = imageAltItem.text.replace(/[,]/gm, '');
        });
      }
      if (row.aggregateRatingText) {
        row.aggregateRatingText.forEach((aggregateRatingTextItem) => {
          aggregateRatingTextItem.text = aggregateRatingTextItem.text.replace(/[^\d]/gm, '');
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach((ratingCountItem) => {
          ratingCountItem.text = ratingCountItem.text.replace(/[,]/gm, '');
        });
      }
      if (row.sku) {
        row.sku.forEach((skuItem) => {
          skuItem.text = skuItem.text.replace('SKU', '').trim();
        });
      }
      if (row.variantId) {
        row.variantId.forEach((variantIdItem) => {
          variantIdItem.text = variantIdItem.text.replace('SKU', '').trim();
        });
      }
      const descriptionArray = [];
      if (row.manufacturerImages) {
        row.description = [{ text: '' }];
      }
      if (row.description) {
        row.description.forEach(descriptionItem => {
          descriptionArray.push(descriptionItem.text);
        });
        row.description = [{ text: descriptionArray.join() }];

        row.description.forEach(descriptionItem => {
          descriptionItem.text = descriptionItem.text.replace(',Ver toda la descripción,Cerrar descripción', '').replace(/[,]/gm, '');
        });
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          item.text = (item.text.includes('http')) ? item.text : 'https:' + item.text;
        });
      }

      if (row.mpc) {
        row.mpc.forEach(item => {
          item.text = (item.text.includes('Modelo:')) ? item.text.replace('Modelo:', '') : item.text;
        });
      }
      if (row.name && row.brandText) {
        row.nameExtended = [
          { text: row.brandText[0].text + ' - ' + row.name[0].text },
        ];
        const brandText = row.brandText[0].text;
        row.nameExtended.forEach(nameExtendedItem => {
          row.name.forEach(nameItem => {
            console.log('nameExtendedItem.text.includes(brandText)', nameExtendedItem.text.includes(brandText));
            nameExtendedItem.text = nameItem.text.includes(brandText) ? nameExtendedItem.text.replace(brandText, '').replace(' - ', '') : nameExtendedItem.text;
          });
        });
      }
      if (row.category) {
        var dups = [];
        row.category = row.category.filter(function (el) {
          // If it is not a duplicate, return true
          if (dups.indexOf(el.text) === -1) {
            dups.push(el.text);
            console.log(dups);
            return true;
          }

          return false;
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
