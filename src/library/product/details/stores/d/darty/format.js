
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
      if (row.description || row.additionalDescBulletInfo) {
        let text = '';
        if (row.additionalDescBulletInfo) {
          text = row.additionalDescBulletInfo.reduce((item, currentItem) => `${item} || ${currentItem.text}`, '').trim();
        }
        if (text !== '' && row.description && row.description[0]) {
          row.description = [{
            text: text + ' | ' + row.description[0].text.replace(/\s*\n\s*/g, ' '),
          },
          ];
        } else {
          if (row.description && row.description[0]) {
            row.description = [{
              text: row.description[0].text.replace(/\s*\n\s*/g, ' '),
            },
            ];
          } else {
            if (text) {
              row.description = [{
                text: text,
              }];
            }
          }
        }
      }
      // if (row.description) {
      //   const descriptionArr = row.description.map((item) => {
      //     return item.text;
      //   });
      //   row.description = [{ text: descriptionArr.join('|'), xpath: row.description[0].xpath }];
      // }
      if (row.manufacturerDescription) {
        row.manufacturerDescription[0].text = row.manufacturerDescription[0].text.replace(/\s*\n\s*/g, ' ');
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          if (item.text.match(/(\/\/)(.*?)(,?)/g)) {
            item.text = item.text.replace(/(\/\/)(.*?)(,?)/g, 'https:$1$2');
          }
          item.text = item.text.replace(/\s200w/g, '').replace(/\s400w/g, '').replace(/\s600w/g, '').replace(/\s800w/g, '').replace(/\s1000w/g, '');
          item.text = item.text.startsWith('https:') ? item.text : `https:${item.text}`;
          if (item.text.includes(',')) { item.text = item.text.split(',')[0]; }
        });
      }
      if (row.manufacturerImages1 && !row.manufacturerImages) {
        row.manufacturerImages1.forEach(item => {
          if (item.text.match(/(\/\/)(.*?)(,?)/g)) {
            item.text = item.text.replace(/(\/\/)(.*?)(,?)/g, 'https:$1$2');
          }
          item.text = item.text.replace(/\s200w/g, '').replace(/\s400w/g, '').replace(/\s600w/g, '').replace(/\s800w/g, '').replace(/\s1000w/g, '');
          item.text = item.text.startsWith('https:') ? item.text : `https:${item.text}`;
        });
        row.manufacturerImages = row.manufacturerImages1;
      }
      if (row.videos) {
        row.videos.forEach(video => {
          if (video.text.includes('file')) {
            video.text = video.text.replace(/.*?"file":"(.*?)".*/, '$1').replace(/\\/g, '');
          }
          if (!video.text.startsWith('http')) {
            video.text = `https:${video.text}`;
          }
        });
      }
      if (row.galleryVideos) {
        row.galleryVideos.forEach(video => {
          if (video.text.includes('file')) {
            video.text = video.text.replace(/.*?"file":"(.*?)".*/, '$1').replace(/\\/g, '');
          }
          if (!video.text.startsWith('http')) {
            video.text = `https:${video.text}`;
          }
        });
      }
      if (row.specifications) {
        const specificationsArr = row.specifications.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/http.*?html/g, '').replace(/\n \n \n \n \n \n \n/g, ' || ').replace(/\n \n \n \n \n \n/g, ' || ').replace(/\n \n \n \n/g, ': ').replace(/\n \n/g, ' ').replace(/\n/g, '') : '|';
        });
        row.specifications = [{ text: specificationsArr.join('|'), xpath: row.specifications[0].xpath }];
      }
      // if (row.additionalDescBulletInfo) {
      //   row.descriptionBullets = [{
      //     text: row.additionalDescBulletInfo.length,
      //   },
      //   ];
      // }
      if (row.secondaryImageTotal) {
        var secondaryImageTotalCount = row.secondaryImageTotal[0].text === '0' ? '' : row.secondaryImageTotal[0].text;
        row.secondaryImageTotal = [{ text: secondaryImageTotalCount, xpath: row.secondaryImageTotal[0].xpath }];
      }
      if(row.unInterruptedPDP){
          let updp= [];
          row.unInterruptedPDP.forEach(item=>{
            updp.push(item.text);
          })
          // @ts-ignore
          let updpUnique = [...new Set(updp)];
          console.log(updpUnique.length);
          let text = '';
          updpUnique.forEach(item=>{
            text = text + (text ? ' || ' : '') + item;
          })
          row.unInterruptedPDP = [{text}];
        }
    }
  }
  return data;
};

module.exports = { transform };
