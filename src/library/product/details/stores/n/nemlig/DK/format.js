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
      if (row.name) {
        var scriptJSON = JSON.parse(row.name[0].text);
        if (scriptJSON.MetaData) {
          var objMetaData = scriptJSON.MetaData;
          var tempName = objMetaData.PageTitle;
          if (objMetaData.PageTitle) {
            row.name = [{ text: tempName }];
          }
          if (objMetaData.TrackingId) {
            row.sku = row.variantId = [{ text: objMetaData.TrackingId }];
          }
          if (row.brandText) {
            row.nameExtended = [{ text: row.brandText[0].text + ' - ' + tempName }];
          }
        }
        if (scriptJSON.content) {
          var objContent = scriptJSON.content;
          if (objContent.length) {
            if (objContent[0].Price) {
              row.price = [{ text: objContent[0].Price }];
            }
            if (objContent[0].UnitPrice) {
              row.pricePerUnit = [{ text: objContent[0].UnitPrice }];
            }
            if (objContent[0].Campaign) {
              if (objContent[0].Campaign.DiscountSavings) {
                row.promotion = [{ text: objContent[0].Campaign.DiscountSavings }];
              }
            }
            
            if (objContent[0].Campaign) {
              if (objContent[0].Campaign.CampaignPrice) {
                row.listPrice = [{ text: objContent[0].Campaign.CampaignPrice }];
              }
            }
          }
        }
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
      if (row.specifications) {
        var arrSpecs = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\s*:\s*/, ' : ');
          arrSpecs.push(item.text);
        });
        row.specifications = [{ text: arrSpecs.join(' || ') }];
      }
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
      // if (row.additionalDescBulletInfo) {
      //   var arrBullets = [];
      //   row.price.forEach(item => {
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