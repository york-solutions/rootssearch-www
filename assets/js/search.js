$(function(){
  for(var prop in personData){
    $('#data_' + prop).val(personData[prop]);
  }
});