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
      // if (row.image) {
      //   row.image = [{ text: 'https://www.mechta.kz' + row.image[0].text }];
      // }
      // if (row.imageAlt) {
      //   row.imageAlt = [{ text: row.imageAlt[0].text }];
      // }
      // if (row.description) {
      //   const descs = [];
      //   let newTxt = '';
      //   let cnt = 0;
      //   row.description.forEach(item => {
      //     descs[0] = item;
      //     item.text = item.text.replace(/(\s?\n)+/g, ' ').trim();
      //     if (cnt > 0) newTxt = newTxt + '||' + item.text;
      //     else newTxt = newTxt + item.text;
      //     cnt++;
      //   });
      //   descs.forEach(item => {
      //     item.text = newTxt;
      //   });
      //   row.description = descs;
      // }
      if (row.specifications) {
        const specs = [];
        let newTxt = '';
        let cnt = 0;
        row.specifications.forEach(item => {
          specs[0] = item;
          item.text = item.text.replace(/(\s?\n)+/g, ' ');
          if (cnt > 0) newTxt = newTxt + ' || ' + item.text;
          else newTxt = newTxt + item.text;
          cnt++;
        });
        specs.forEach(item => {
          item.text = newTxt;
        });
        row.specifications = specs;
      }
      if (row.alternateImages) {
        row.alternateImages.splice(0, 1);
        row.alternateImages.forEach(item => {
          item.text = 'https://www.mechta.kz' + item.text;
        });
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          item.text = 'https://www.mechta.kz' + item.text;
        });
      }
      if (row.videos) {
        row.videos.forEach(item => {
          if (item.text.indexOf('http') < 0) {
            item.text = 'https:' + item.text;
          }
        });
      }
      if (row.sku) {
        row.sku.forEach(item => {
          item.text = item.text.replace('Код:', '');
          item.text = item.text.trim();
        });
        row.variantId = [{ text: row.sku[0].text }];
      }
      if (row.manufacturerDescription) {
        var descMfr = [];
        row.manufacturerDescription.forEach(item => {
          descMfr.push(item.text);
        });
        row.manufacturerDescription = [{ text: descMfr.join(' ') }];
      }
      if (row.nameExtended) {
        if (row.brandText) {
          row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.nameExtended[0].text }];
        }
      }
      if (row.weightNet) {
        row.weightNet.forEach(item => {
          item.text = item.text.replace(',', '.');
        });
      }
      // if (row.brand) {
      //   row.brand.forEach(item => {
      //     item.text = item.text.trim();
      //     item.text = item.text.replace(/\s+.+/, '');
      //     item.text = item.text.trim();
      //   });
      // }
      if ((!row.brandText || !row.brandText.length) && row.brandText1) {
        console.log('brandText1',row.brandText1);
        row.brandText = row.brandText1;
        console.log("brandText", row.brandText);
      }
      if ((!row.availabilityText || !row.availabilityText.length) && row.availabilityText1) {
        console.log('availabilityText1', row.availabilityText1);
        row.availabilityText = row.availabilityText1;
        console.log("availabilityText", row.availabilityText);
      }
      if (row.videos) {
        const unInterruptedPDPs = [];
        let dup = '';
        let urls = [];
        row.videos.forEach(item => {
          // console.log('item:: ', item.text);
          urls = row.videos.filter(it => item.text === it.text);
          if (urls && urls.length === 1) {
            unInterruptedPDPs.push(item);
          } else {
            if (dup !== item.text) {
              dup = item.text;
              unInterruptedPDPs.push(item);
            }
          }
        });
        row.videos = unInterruptedPDPs;
      }
      if (row.specificationsKey && row.specificationsValue) {
        var arrSpecs = [];
        for (var i = 0; i < row.specificationsKey.length; i++) {
          arrSpecs.push(row.specificationsKey[i].text + row.specificationsValue[i].text);
        }
        delete row.specificationsKey;
        delete row.specificationsValue;
        if (arrSpecs.length) {
          row.specifications = [{ text: arrSpecs.join(' || ') }];
        }
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
