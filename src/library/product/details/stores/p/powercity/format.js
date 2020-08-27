
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
        row.description.forEach(desc => {
          if (desc.text.includes('Key Features') || desc.text.includes('Key features')) {
            let txt = '';
            if (desc.text.includes('Key features')) {
              txt = desc.text.split('Key features:');
            } else {
              txt = desc.text.split('Key Features:');
            }
            if (txt.length === 2) {
              text = text + ' | ' + txt[0].replace(/(\s*\n\s*)+/g, ' ') + ' Key Features:' + txt[1].replace(/(\s\n)+/g, ' ').replace(/(\n\s\n)+/g, ' ').replace(/\n/g, ' || ');
            }
          } else if (desc.text.includes('Features:')) {
            text = text + ' | ' + desc.text.replace(/(\s*\n\s*)+/g, ' || ');
          } else {
            text = text + ' | ' + desc.text.replace(/(\s*\n\s*)+/g, ' ');
          }
        });
        row.description = [{
          text: text.slice(3),
        },
        ];
      }

      if (row.additionalDescBulletInfo) {
        row.descriptionBullets = [{
          text: row.additionalDescBulletInfo.length,
        },
        ];

        row.additionalDescBulletInfo.forEach(ele => {
          ele.text = ele.text.replace(/\s*\n/g, ' ');
        });
      }

      if (row.manufacturerDescription) {
        row.manufacturerDescription[0].text = row.manufacturerDescription[0].text.replace(/(\s*\n*\s*)+/g, ' ');
      }

      if (row.image && !row.image[0].text.startsWith('http')) {
        row.image[0].text = `https:${row.image[0].text}`;
      }

      if (row.alternateImages) {
        row.alternateImages.forEach(image => {
          if (!image.text.startsWith('http')) {
            image.text = `https:${image.text}`;
          }
        });
      }

      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(image => {
          if (!image.text.startsWith('http')) {
            image.text = `https:${image.text}`;
          }
        });
      }

      if (row.videos && !row.videos[0].text.startsWith('http')) {
        row.videos[0].text = `https:${row.videos[0].text}`;
      }

      if (!row.brandText && row.name) {
        row.brandText = [{
          text: row.name[0].text.replace(/^([^\s]+).*/, '$1'),
        }];
      }

      if (row.specifications) {
        row.specifications = [{
          text: row.specifications.reduce((item, currentItem) => `${item} || ${currentItem.text.replace(/(\s*\n\s*)+/g, ': ')}`, '').slice(4).trim(),
        },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
