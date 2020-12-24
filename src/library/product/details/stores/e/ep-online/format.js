/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (text) =>
    text
      .toString()
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
      if (row.description) {
        row.description.forEach((descriptionItem) => {
          descriptionItem.text = cleanUp(descriptionItem.text);
        });
      }

      if (row.termsAndConditions) {
        row.termsAndConditions.forEach((termsAndConditionsItem) => {
          termsAndConditionsItem.text = cleanUp(termsAndConditionsItem.text);
        });
      }

      if (row.descriptionBullets) {
        row.descriptionBullets.forEach((descriptionBulletsItem) => {
          if (
            descriptionBulletsItem.text === 0 ||
            descriptionBulletsItem.text === '0'
          ) {
            descriptionBulletsItem.text = '';
          }
        });
      }

      if (row.weightNet) {
        row.weightNet.forEach((weightNetItem) => {
          weightNetItem.text = cleanUp(weightNetItem.text);
        });
      }

      if (row.price) {
        row.price.forEach((priceItem) => {
          priceItem.text = priceItem.text.replace(/'/gm, ',').replace(/(.*)\..*/gm, '$1');
        });
      }

      if (row.sku) {
        row.sku.forEach((skuItem) => {
          skuItem.text = skuItem.text.replace(/[^\d]/gm, '');
        });
      }

      if (row.variantId) {
        row.variantId.forEach((variantIdItem) => {
          variantIdItem.text = variantIdItem.text.replace(/[^\d]/gm, '');
        });
      }

      if (row.specifications) {
        row.specifications[0].text = row.specifications[0].text.replace(/(\n\s*){8,}/g, ' || ').replace(/(\n\s*){6,}/g, ' || ').replace(/(\n\s*){5,}/g, ' || ').replace(/(\n\s*){4,}/g, ' || ').replace(/(\n\s*){2,}/g, '');
      }

      const shippingDimensionsArray = [];
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach((shippingDimensionsItem) => {
          shippingDimensionsItem.text = shippingDimensionsItem.text.replace(/(\n\s*){2,}/g, ' : ');
          shippingDimensionsArray.push(shippingDimensionsItem.text);
        });
      }

      row.shippingDimensions = [{ text: shippingDimensionsArray.join(' | ') }];

      const additionalDescBulletInfoArray = [];
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo.forEach((additionalDescBulletInfoItem) => {
          additionalDescBulletInfoArray.push(additionalDescBulletInfoItem.text);
        });
      }

      row.additionalDescBulletInfo = [
        { text: additionalDescBulletInfoArray.join(' || ') },
      ];

      if (row.name && row.brandText) {
        row.nameExtended = [
          { text: row.brandText[0].text + ' - ' + row.name[0].text },
        ];
      }

      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach((manufacturerDescriptionItem) => {
          manufacturerDescriptionItem.text = cleanUp(manufacturerDescriptionItem.text);
        });
      }

      const info = [];
      if (row.inTheBoxText) {
        row.inTheBoxText.forEach((item) => {
          info.push(item.text);
        });
      }

      row.inTheBoxText = [{ text: info.join(' || ') }];

     
    }
  }
  return data;
};
module.exports = { transform };
