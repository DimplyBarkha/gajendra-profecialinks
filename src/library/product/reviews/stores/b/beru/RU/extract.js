const { transform } = require('./shared');
async function preExtraction (context) {
  await context.evaluate(async function () {
    const reviews = document.querySelectorAll('div[data-zone-name="review"]');
    reviews.forEach((review) => {
      const upperDiv = document.createElement('div');
      upperDiv.setAttribute('class', 'iio_reviews');
      upperDiv.style.display = 'none';

      const reviewText = review.querySelector('span').closest('div[data-tid]').parentNode.parentNode.textContent;
      let reviewNum = '';
      switch (reviewText) {
        case 'Ужасный товар':
          reviewNum = '1';
          break;
        case 'Плохой товар':
          reviewNum = '2';
          break;
        case 'Обычный товар':
          reviewNum = '3';
          break;
        case 'Хороший товар':
          reviewNum = '4';
          break;
        case 'Отличный товар':
          reviewNum = '5';
          break;
        default:
          reviewNum = '';
      }
      upperDiv.setAttribute('data-reviewRating', reviewNum);
      review.append(upperDiv);
    });
  });
  try {
    await context.evaluate(() => {
      Array.from(document.querySelectorAll('.commentText .b_8lynrUTtGG')).forEach(elm => elm.click());
    });
    const weekDaysMap = {
      понедельник: 'monday',
      вторник: 'tuesday',
      среда: 'wednesday',
      четверг: 'thursday',
      пятница: 'friday',
      суббота: 'saturday',
      воскресенье: 'sunday',
    };

    const monthsMap1 = {
      январь: 'January',
      февраль: 'February',
      март: 'March',
      апрель: 'April',
      май: 'May',
      июнь: 'June',
      июль: 'July',
      август: 'August',
      сентябрь: 'September',
      октябрь: 'October',
      ноябрь: 'November',
      декабрь: 'December',
    };

    const monthsMap2 = {
      января: 'January',
      февраля: 'February',
      марта: 'March',
      апреля: 'April',
      мая: 'May',
      июня: 'June',
      июля: 'July',
      августа: 'August',
      сентября: 'September',
      октября: 'October',
      ноября: 'November',
      декабря: 'December',
    };
    const wordsToReplace = [...Object.keys(monthsMap2), ...Object.keys(monthsMap1), ...Object.keys(weekDaysMap)];
    const wordMap = { ...monthsMap2, ...monthsMap1, ...weekDaysMap };
    Array.from(document.querySelectorAll('.b_I_N6IMOcwb')).forEach(elm => {
      let elmString = elm.innerText;
      wordsToReplace.forEach(elm => {
        elmString = elmString.replace(elm, wordMap[elm]);
      });
      elm.innerText = elmString;
    });
  } catch (err) {
    console.log('Error clicking more text and date formatting.');
  }
}
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    transform,
    preExtraction,
    mergeType: 'MERGE_ROWS',
    filterReviews: true,
    domain: 'beru.ru',
    zipcode: '',
  },
};
