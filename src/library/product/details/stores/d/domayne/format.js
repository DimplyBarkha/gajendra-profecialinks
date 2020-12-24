/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.termsAndConditions) {
        row.termsAndConditions = [{ text: 'Yes' }];
      } else {
        row.termsAndConditions = [{ text: 'No' }];
      }

      if (row.descriptionBullets) {
        row.descriptionBullets.forEach((descriptionBulletsItem) => {
          if (descriptionBulletsItem.text === 0 || descriptionBulletsItem.text === '0') {
            descriptionBulletsItem.text = '';
          }
        });
      }

      if (row.specifications) {
        row.specifications.forEach((specificationsItem) => {
          specificationsItem.text = specificationsItem.text.replace(/(\n\s*){4,}/g, ' || ').replace(/(\n\s*){2,}/g, ' : ');
        });
      }

      const additionalDescBulletInfoArray = [];
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo.forEach((additionalDescBulletInfoItem) => {
          additionalDescBulletInfoArray.push(additionalDescBulletInfoItem.text);
        });
      }
      row.additionalDescBulletInfo = [{ text: additionalDescBulletInfoArray.join(' || ') }];

      if (row.warranty) {
        row.warranty.forEach((warrantyItem) => {
          warrantyItem.text = warrantyItem.text.replace(/(\n\s*){2,}/g, ' : ');
        });
      }

      if (row.name && row.brandText) {
        row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.name[0].text }];
      }

      if (row.variantCount) {
        row.variantCount.forEach((variantItemCount) => {
          if (variantItemCount.text === 0 || variantItemCount.text === '0') {
            variantItemCount.text = '';
          }
        });
      }

      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.manufacturerDescription = [{ text }];
      }

      if (row.ratingCount) {
        row.ratingCount.forEach((ratingCountItem) => {
          ratingCountItem.text = ratingCountItem.text.replace(/[^\d]/gm, '');
        });
      }

      if (row.aggregateRating) {
        row.aggregateRating.forEach((aggregateRatingItem) => {
          if (aggregateRatingItem.text.includes('no rating')) {
            aggregateRatingItem.text = '';
          } else {
            aggregateRatingItem.text = aggregateRatingItem.text.replace(/(.*?) out of.*/gm, '$1');
          }
        });
      }
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
    }
  }
  return data;
};
module.exports = { transform };
