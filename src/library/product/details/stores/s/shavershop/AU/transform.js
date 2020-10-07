/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {

  for (const { group } of data) {
    for (const row of group) {

      try {

        if (row.Image360Present) {
          row.Image360Present = [{ text: row.Image360Present[0].text == 'true' ? 'YES' : 'NO' }];
        }

        // if (row.manufacturerImages) {
        //   row.manufacturerImages = [{ text: "https://www.shavershop.com.au"+row.manufacturerImages[0].text  }];
        // } 

        if (row.warranty) {
          var text = row.warranty[0].text.toString().split('/');
          var textContent = text[text.length - 1];
          textContent = textContent.replace('.jpg', '').replace('_', ' ');
          textContent = textContent.replace('.png', '').replace('_', ' ');
          row.warranty = [{ text: textContent }];
        }
        if (row.description) {
          let text = '';
          row.description.forEach(item => {
            text += item.text + "||"
          });
          text = text.substring(0, text.length - 2);
          row.description = [
            {
              text: text,
            },
          ];
        }

        if (row.directions) {
          let text = '';
          row.directions.forEach(item => {
            text += item.text + "|"
          });
          text = text.substring(0, text.length - 1);
          row.directions = [
            {
              text: text,
            },
          ];
        }

        if (row.videos) {
          let text = '';
          row.videos.forEach(item => {
            text += item.text + "|"
          });
          text = text.substring(0, text.length - 1);
          row.videos = [
            {
              text: text,
            },
          ];
        }

        if (row.manufacturerDescription) {
          let text = '';
          row.manufacturerDescription.forEach(item => {
            text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
          });

          row.manufacturerDescription = [
            {
              text: text,
            },
          ];
        }

      } catch (exception) { console.log('Error in transform', exception); }
    }
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
  return data;
};

module.exports = { transform };