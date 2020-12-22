
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '" ')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    .replace(/\\"/gm, '"')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        let finalDesc = '';
        for (let i = 0; i < row.description.length; i++) {
          if (row.description[i].xpath.includes('li')) {
            finalDesc = finalDesc + ' || ' + row.description[i].text;
          } else {
            finalDesc = finalDesc + row.description[i].text + ' ';
          }
        }
        if (finalDesc.trim().endsWith('||')) {
          finalDesc = finalDesc.trim().substring(0, finalDesc.length - 2);
        }
        row.description = [
          {
            text: finalDesc,
          },
        ];
      }
      if (row.nameExtended && row.brandText) {
        let finalDescription = '';
        row.brandText.forEach(item => {
          finalDescription += item.text + ' - ';
        });
        row.nameExtended.forEach(item => {
          finalDescription += item.text;
        });
        row.nameExtended = [
          {
            text: finalDescription,
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ': ')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      //   if (row.specifications) {
      //     console.log('specifications available ');
      //     let finalSpecifications = '';
      //     row.specifications.forEach(item => {
      //       finalSpecifications += item.text + ' || ';
      //     });
      //     if (finalSpecifications.trim().endsWith('||')) {
      //       finalSpecifications = finalSpecifications.trim().substring(0, finalSpecifications.length - 3);
      //     }
      //     row.specifications = [
      //       {
      //         text: finalSpecifications,
      //       },
      //     ];
      //   }
      if (row.alternateImages) {
        const alternateImagesArr = row.alternateImages.map((item) => {
          const regExV1 = /(.+)_thumb_(.+)/;
          if (regExV1.test(item.text)) {
            return { text: `${item.text.match(regExV1)[1]}${item.text.match(regExV1)[2]}` };
          }
          const regExV2 = /(.+)\?\$web_Lineitem\$&amp;wid=60&amp;hei=60/;
          if (regExV2.test(item.text)) {
            return { text: `${item.text.match(regExV2)[1]}` };
          }
        });
        const alternateImagesResult = alternateImagesArr;
        row.alternateImages = alternateImagesResult;
      }
      if (row.aggregateRating) {
        let rating = '';
        row.aggregateRating.forEach(item => {
          if (item.text.includes('out')) {
            rating = item.text.replace(/(.+)\s*out(.+)/g, '$1');
            rating = Number(rating).toFixed(3);
          } else {
            rating = item.text;
          }
        });
        row.aggregateRating = [
          {
            text: rating,
          },
        ];
      }
      //   if (row.aggregateRating2) {
      //     let rating = '';
      //     row.aggregateRating2.forEach(item => {
      //       if (item.text !== '') {
      //         rating = parseFloat(item.text).toFixed(3);
      //       }
      //     });
      //     row.aggregateRating2 = [
      //       {
      //         text: rating,
      //       },
      //     ];
      //   }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
