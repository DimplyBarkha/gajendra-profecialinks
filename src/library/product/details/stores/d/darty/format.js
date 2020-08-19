
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
          text = row.additionalDescBulletInfo.reduce((item, currentItem) => `${item} || ${currentItem}`, '').trim();
        }
        if (text) {
          row.description = [{
            text: text + ' | ' + row.description.replace(/\s\n\s\n\s\n\s/g, ' | '),
          },
          ];
        } else {
          row.description = [{
            text: row.description.replace(/\s\n\s\n\s\n\s/g, ' | '),
          },
          ];
        }
      }

      if (row.additionalDescBulletInfo) {
        row.descriptionBullets = [{
          text: row.additionalDescBulletInfo.length,
        },
        ];
        row.additionalDescBulletInfo = [{
          text: row.additionalDescBulletInfo.reduce((item, currentItem) => `${item} | ${currentItem}`, '').trim(),
        },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
