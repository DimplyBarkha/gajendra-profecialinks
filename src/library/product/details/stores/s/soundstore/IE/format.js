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
      if (row.inTheBoxText2) {
        if (!row.inTheBoxText) {
          row.inTheBoxText = row.inTheBoxText2;
        }
        delete row.inTheBoxText2;
      }
      const boxUrl = [];
      if (row.inTheBoxUrl1) {
        row.inTheBoxUrl1.forEach(item => {
          boxUrl.push(item.text);
        });
      }

      if (row.inTheBoxUrl) {
        row.inTheBoxUrl.forEach(item => {
          boxUrl.push(item.text);
        });
        const txt = boxUrl.join(' || ');
        row.inTheBoxUrl = [{ text: txt }];
      }

      // let descTxt = '';
      // if (row.inTheBoxUrl) {
      //   // let text = '';
      //   row.inTheBoxUrl.forEach(item => {
      //     descTxt = `${descTxt} ${text.slice(0, -1)}`;
      //   });
      //   row.inTheBoxUrl = [
      //     {
      //       text: descTxt,
      //     },
      //   ];
      // }
      // if (row.inTheBoxUrl1) {
      //   let text = '';
      //   row.inTheBoxUrl1.forEach(item => {
      //     text += `${item.text.replace(/\n \n/g, ':')} || `;
      //   });
      //   row.inTheBoxUrl1 = [
      //     {
      //       text: text.slice(0, -1),
      //     },
      //   ];
      //   descTxt = `${descTxt} ${text.slice(0, -1)}`;
      //   row.inTheBoxUrl1 = [
      //     {
      //       text: descTxt,
      //     },
      //   ];
      // }
      if (row.inTheBoxUrl2) {
        if (!row.inTheBoxUrl) {
          row.inTheBoxUrl = row.inTheBoxUrl2;
        }
        delete row.inTheBoxUrl2;
      }
      if (row.inTheBoxUrl3) {
        if (!row.inTheBoxUrl) {
          row.inTheBoxUrl = row.inTheBoxUrl3;
        }
        delete row.inTheBoxUrl3;
      }
      // if (row.alternateImages) {
      //   row.alternateImages.splice(0, 1);
      //   if (row.alternateImages.length === 0) {
      //     delete row.alternateImages;
      //   }
      // }
      // if (row.descriptionBullets) {
      //   var bulletArr = [];
      //   row.descriptionBullets.forEach(item => {
      //     bulletArr.push(item.text.replace(/^\s*-\s*/, ''));
      //   });
      //   row.descriptionBullets = [{ text: '|| ' + bulletArr.join(' || ') }];
      // }
      // if (row.specifications) {
      //   var arrSpecs = [];
      //   row.specifications.forEach(item => {
      //     item.text = item.text.replace(/\n\s+\n/, ':');
      //     arrSpecs.push(item.text);
      //   });
      //   row.specifications = [{ text: arrSpecs.join(' || ') }];
      // }
      // if (row.price) {
      //   row.price.forEach(item => {
      //     item.text = item.text.replace(',', '');
      //   });
      // }
      // if (row.listPrice) {
      //   row.listPrice.forEach(item => {
      //     item.text = item.text.replace(',', '');
      //   });
      // }
      // if (row.variantCount) {
      //   row.variantCount = [{ text: row.variantCount.length }];
      // }
      // if (row.variants) {
      //   var scriptJSON = JSON.parse(row.variants[0].text);
      //   if (scriptJSON.productVariants) {
      //     var objectsInVariants = Object.keys(scriptJSON.productVariants).length;
      //     var varientIds = [];
      //     for (var i = 0; i < objectsInVariants; i++) {
      //       var keyName = Object.keys(scriptJSON.productVariants)[i];
      //       var variants = scriptJSON.productVariants[keyName].variants;
      //       variants.forEach(function (item, index) {
      //         varientIds.push(item.fupid);
      //       });
      //     }
      //   }
      //   row.variants = [{ text: varientIds.join(' | ') }];
      // }
      // if (row.additionalDescBulletInfo) {
      //   var arrBullets = [];
      //   row.additionalDescBulletInfo.forEach(item => {
      //     arrBullets.push(item.text);
      //   });
      //   row.additionalDescBulletInfo = [{ text: '||' + arrBullets.join('||') }];
      // }
      // if (row.aggregateRating) {
      //   row.aggregateRating.forEach(item => {
      //     item.text = (item.text * 5) / 10;
      //   });
      // }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
