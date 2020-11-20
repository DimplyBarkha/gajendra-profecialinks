
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = text + (text ? ' || ' : '') + item.text;
        });
        row.description = [{ text }];
      }

      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text = text + (text ? ' || ' : '') + item.text;
        });
        row.specifications = [{ text }];
      }

      if (row.featureBullets) {
        let text = '';
        row.featureBullets.forEach(item => {
          text = text + (text ? ' ' : ' ') + item.text;
        });
        row.featureBullets = [{ text }];
      }

      if (row.variantInformation) {
        let text = '';
        row.variantInformation.forEach(item => {
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.variantInformation = [{ text }];
      }

      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.manufacturerDescription = [{ text }];
      }

      if (row.nameExtended) {
        let text = '';
        row.nameExtended.forEach(item => {
          if (item.text.endsWith('-')) {
            text = item.text.slice(0, -1);
          } else {
            text = item.text;
          }
        });
        row.nameExtended = [
          {
            text,
          },
        ];
      }
      if (row.alternateImages) {
        let text = '';
        row.alternateImages.forEach(item => {
          if (item.text.includes(',')) {
            text = item.text.replace(/,/g, ' | ');
          } else {
            text = item.text;
          }
        });
        row.alternateImages = [
          {
            text,
          },
        ];
      }
      if (row.variants) {
        let text = '';
        row.variants.forEach(item => {
          if (item.text.includes(',')) {
            text = item.text.replace(/,/g, ' | ');
          } else {
            text = item.text;
          }
        });
        row.variants = [
          {
            text,
          },
        ];
      }

      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text = text + (`|| ${text}` ? ' || ' : '') + item.text;
        });
        row.additionalDescBulletInfo = [{ text }];
      }

      if (row.highQualityImages) {
        let text = '';
        row.highQualityImages.forEach(item => {
          text = text + (text ? ',' : '') + item.text;
        });
        row.highQualityImages = [
          {
            text,
          },
        ];
      }

      if (row.highQualityImages) {
        let text = '';
        row.highQualityImages.forEach(item => {
          text = item.text.replace(/150/g, '1500');
        });
        row.highQualityImages = [{ text }];
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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
    el.text = el.text.trim();
  }))));

  return data;
};

module.exports = { transform };
