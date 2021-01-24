
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
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

  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.specifications = [
          {
            text: text,
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.description = [
          {
            text: text,
          },
        ];
      }
      if (row.manufacturerImages) {
        let manufacturerImages = [];
        row.manufacturerImages.forEach(item => {
          if (item.text.indexOf('https:') === -1) {
            item.text = `https:${item.text}`;
          }
        });
      }
      if ((!row.description || !row.description.length) && row.description1) {
        console.log('description1',row.description1);
        row.description = row.description1;
        console.log("description", row.description);
      }
      if (row.alternateImages) {
        const variantIds = [];
        let dup = '';
        let urls = [];
        row.alternateImages.forEach(item => {
          urls = row.alternateImages.filter(it => item.text === it.text);
          if (urls && urls.length === 1) {
            variantIds.push(item);
          } else {
            if (dup !== item.text) {
              dup = item.text;
              variantIds.push(item);
            }
          }
        });
        row.alternateImages = variantIds;
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
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')}||`;
        });
        row.specifications = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      if (row.variants) {
        let text = '';
        row.variants.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')}|`;
        });
        row.variants = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.unInterruptedPDP) {
        const pdps = [];

        row.unInterruptedPDP.forEach(item => {
          console.log('item:: ', item.text);

          if (pdps.indexOf(item.text) === -1) {
            pdps.push(item.text);
          }
          // console.log("variantUrls:: ", pdps);
          // if (urls && urls.length === 1) {
          //   variantUrls.push(item);
          // } else {
          //   if (dupUrl !== item.text) {
          //     dupUrl = item.text;
          //     variantUrls.push(item);
          //   }
          // }
        });
        row.unInterruptedPDP = pdps.map((el) => {
          return {
            text: el,
          };
        });
      }
      if (row.variantInformation) {
        let text = '';
        row.variantInformation.forEach(item => {
          text += item.text.replace(':', ' ').trim();
        });
        row.variantInformation = [
          {
            text: text,
          },
        ];
      }
      if ((!row.variantId || !row.variantId.length) && row.variantId1) {
        console.log('variantId1',row.variantId1);
        row.variantId = row.variantId1;
        console.log("variantId", row.variantId);
      }
      if ((!row.variantUrl || !row.variantUrl.length) && row.variantUrl1) {
        console.log('variantUrl1',row.variantUrl1);
        row.variantUrl = row.variantUrl1;
        console.log("variantUrl", row.variantUrl);
      }
      if (row.variantId) {
        let text = '';
        row.variantId.forEach(item => {
          text += item.text.replace('Réf.', ' ').trim();
        });
        row.variantId = [
          {
            text: text,
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
