
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
        if (row.additionalDescBulletInfo) {
          text = row.additionalDescBulletInfo.reduce((item, currentItem) => `${item} || ${currentItem.text}`, '').trim();
        }
        if (text) {
          row.description = [{
            text: text + ' | ' + row.description[0].text.replace(/\s*\n\s*/g, ' '),
          },
          ];
        } else {
          row.description = [{
            text: row.description[0].text.replace(/\s*\n\s*/g, ' '),
          },
          ];
        }
      }

      if (row.manufacturerDescription) {
        row.manufacturerDescription[0].text = row.manufacturerDescription[0].text.replace(/\s*\n\s*/g, ' ');
      }
      if (row.specifications) {
        row.specifications = [{
          text: row.specifications.reduce((item, currentItem) => `${item} || ${currentItem.text.replace(/(\n\s*){4,}/g, ': ').replace(/\s*\n\s*/g, ' ')}`, '').slice(4).trim(),
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
