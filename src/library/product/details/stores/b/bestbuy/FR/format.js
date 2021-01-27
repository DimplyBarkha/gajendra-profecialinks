/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
    return data;
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = text + (text === '' ? '' : ' | ') + item.text;
        });

        if (row.additionalDescBulletInfo) {
          row.additionalDescBulletInfo.forEach(item => {
            text = text + ' || ' + item.text;
          });
        }
        row.description = [{ text }];
      }

      if (row.manufacturerDescription) {
        const manufacturerDescriptions = [];
        let dupUrl = '';
        let urls = [];
        row.manufacturerDescription.forEach(item => {
          console.log('item:: ', item.text);
          urls = row.manufacturerDescription.filter(it => item.text === it.text);
          if (urls && urls.length === 1) {
            manufacturerDescriptions.push(item);
          } else {
            if (dupUrl !== item.text) {
              dupUrl = item.text;
              manufacturerDescriptions.push(item);
            }
          }
        });
        row.manufacturerDescription = manufacturerDescriptions;
      }

      if (row.manufacturerImages) {
        const manufacturerImage = [];
        let dupUrl = '';
        let urls = [];
        row.manufacturerImages.forEach(item => {
          console.log('item:: ', item.text);
          urls = row.manufacturerImages.filter(it => item.text === it.text);
          if (urls && urls.length === 1) {
            manufacturerImage.push(item);
          } else {
            if (dupUrl !== item.text) {
              dupUrl = item.text;
              manufacturerImage.push(item);
            }
          }
        });
        row.manufacturerImages = manufacturerImage;
      }

      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace('/500x500/', '/1500x1500/');
        });
      }

      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace('/100x100/', '/1500x1500/');
        });
      }

      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.text.replace('.', ',');
        });
      }

      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace('.', ',');
        });
      }

      if (row.name) {
        if (row.brandText) {
          if (!row.name[0].text.toLowerCase().startsWith(row.brandText[0].text.toLowerCase())) {
            const text = row.name[0].text;
            row.name = [
              {
                text: row.brandText[0].text + ' - ' + text,
              },
            ];
          }
        }
      }

      if (row.nameExtended) {
        if (row.brandText) {
          if (!row.nameExtended[0].text.toLowerCase().startsWith(row.brandText[0].text.toLowerCase())) {
            const text = row.nameExtended[0].text;
            row.nameExtended = [
              {
                text: row.brandText[0].text + ' - ' + text,
              },
            ];
          }
        }
      }

      if (row.specifications) {
        let text = '';
        for (let i = 0; i < row.specifications.length; i++) {
          text += `${row.specificationsLabel[i].text} : ${row.specifications[i].text} || `;
        }
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
        delete row.specificationsLabel;
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };
