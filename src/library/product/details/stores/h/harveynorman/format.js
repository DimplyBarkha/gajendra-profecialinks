/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (!row.manufacturerImages && !row.videos) {
        row.description = row.manufacturerDescription;
        delete row.manufacturerDescription;
      }

      if (row.manufacturerDescription) {
        row.manufacturerDescription[0].text = row.manufacturerDescription[0].text.replace(/\s*\n\s*/g, ' ');
      }
      if (row.description) {
        row.description[0].text = row.description[0].text.replace(/\n\s\n/g, ' || ').replace(/\s*\n\s*/g, ' ');
      }
      if (row.warranty) {
        row.warranty[0].text = row.warranty[0].text.replace(/\n\s\n/g, ': ');
      }
      if (row.specifications) {
        row.specifications = [{
          text: row.specifications.reduce((item, currentItem) => `${item} || ${currentItem.text.replace(/(\n\s\n)+/g, ': ')}`, '').slice(4).trim(),
        },
        ];
      }
      if (row.additionalDescBulletInfo) {
        row.descriptionBullets = [{
          text: row.additionalDescBulletInfo.length,
        },
        ];
        row.additionalDescBulletInfo = [{
          text: row.additionalDescBulletInfo.reduce((item, currentItem) => `${item} | ${currentItem.text}`, '').trim(),
        },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };