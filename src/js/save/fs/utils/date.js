const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

module.exports = {
  
  displayString: function(date){
    return [date.getDate(), months[date.getMonth()], date.getFullYear()].join(' ') || '';
  }
  
};