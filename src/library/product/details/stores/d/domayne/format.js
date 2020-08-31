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
          if (descriptionBulletsItem.text === 0 || descriptionBulletsItem.text === '0') {
            descriptionBulletsItem.text = '';
          }
        });
      }

      const specificationsArray = [];
      if (row.specifications) {
        row.specifications.forEach((specificationsItem) => {
          specificationsItem.text = specificationsItem.text.replace(/(\n\s*){2,}/g, ' : ');
          specificationsArray.push(specificationsItem.text);
        });
      }
      row.specifications = [{ text: specificationsArray.join(' || ') }];

      const additionalDescBulletInfoArray = [];
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo.forEach((additionalDescBulletInfoItem) => {
          additionalDescBulletInfoArray.push(additionalDescBulletInfoItem.text);
        });
      }
      row.additionalDescBulletInfo = [{ text: additionalDescBulletInfoArray.join(' || ') }];

      if (row.name) {
        row.name.forEach((nameItem) => {
          nameItem.text = cleanUp(nameItem.text);
        });
      }

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

      if (row.ratingCount) {
        row.ratingCount.forEach((ratingCountItem) => {
          ratingCountItem.text = ratingCountItem.text.replace(/[^\d]/gm, '');
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
