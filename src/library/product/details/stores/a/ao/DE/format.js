/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '" ')
    .replace(/\s{1,}"/g, ' "')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  for (const { group } of data) {
    for (let row of group) {
      try {
        if (row.manufacturerImages) {
          row.manufacturerImages.forEach(item => {
            if (!(item.text.startsWith('http'))) {
              const img = item.text;
              const imgText = 'https:' + img;
              item.text = imgText;
            }
          });
        }

        if (row.image2 && !row.image) {
          row.image = [{
            text: row.image2[0].text,
          }];
        }

        if (row.specifications) {
          let specificationsText = 'Produkt-Eigenschaften Highlights ';
          row.specifications.forEach(item => {
            if (item.text) {
              specificationsText += `${item.text} `;
            }
          });
          row.specifications = [{
            text: specificationsText.trim(),
          }];
        }

        // if (row.manufacturerDescription) {
        //   let text = '';
        //   row.manufacturerDescription.forEach(item => {
        //     text = text + (text ? ' ' : '') + item.text;
        //   });
        //   row.manufacturerDescription = [{ text }];
        // }
        if (row.manufacturerDescription) {
          let text = '';
          row.manufacturerDescription.forEach(item => {
            text = row.manufacturerDescription.map(elm => elm.text).join(' ');
          });
          row.manufacturerDescription = [{ text }];
        }

        if (row.mpc) {
          let text = '';
          text = row.mpc[0].text.split('_')[0];
          row.mpc = [{ text }];
        }

        if (row.descriptionAdd) {
          let text = '';
          row.descriptionAdd.forEach(item => {
            text += `|| ${item.text} `;
          });

          row.descriptionAdd = [
            {
              text: text.trim(),
            },
          ];
        }

        if (row.description) {
          let text = '';
          row.description.forEach(item => {
            text += `${item.text} `;
          });

          if (row.descriptionAdd) {
            text += row.descriptionAdd[0].text;
          }

          row.description = [
            {
              text: text.trim(),
            },
          ];
        }

        if (!row.description && row.descriptionAdd) {
          row.description = row.descriptionAdd;
        }

        if (row.descriptionBullets) {
          row.descriptionBullets = [
            {
              text: row.descriptionBullets.length,
            },
          ];
        }

        if (row.videos) {
          const videoArr = [];
          const items = [];
          row.videos.forEach(item => {
            if (videoArr.indexOf(item.text) < 0) {
              videoArr.push(item.text);
              items.push({
                text: item.text,
              });
            }
          });
          row.videos = items;
        }

        row = clean(row);
      } catch (exception) {
        console.log(exception);
      }
    }
  }
  return data;
};

module.exports = { transform };