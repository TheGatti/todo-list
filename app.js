$(document).ready(function() {
  toDoPage.init();
})

var toDoPage = {
  url: 'http://tiny-tiny.herokuapp.com/collections/tomaybedo',
  thingstoDo: [],
  init: function() {
    toDoPage.styling();
    toDoPage.events();
  },
  styling: function() {
    toDoPage.getToDos();
  },
  events: function() {
      //Add New ToDo to the page
      $('form').on('submit', function(event){
       event.preventDefault();
       var newToDo = {
         todo: $(this).children('input').val(),
         completed: false
       }
       toDoPage.createToDo(newToDo)
       $(this).children('input').val('');
     })
      $('ul').on('keypress', 'li',function(event){
        if (event.which === 13) {
          event.preventDefault();
          var update = $(this).data('id');
          var newText = $(this).text();
          var newCompleted = $(this).data('completed');
          var objToUpdate = {
           _id: update,
           todo: newText,
           completed: newCompleted,
         }
         console.log("TEST", objToUpdate)
         toDoPage.updateToDos(objToUpdate)

        }
      })

  //Delete ToDo item
   $('ul').on('click', 'a', function(event){
     event.preventDefault();
     var deleteToDoId = $(this).parent().data('id');
     console.log("cleared",deleteToDoId);
     $(this).parent().remove();
     toDoPage.deleteToDos(deleteToDoId);
   })
 },

 createToDo: function(newToDo) {
   $.ajax({
     url: toDoPage.url,
     method: "POST",
     data: newToDo,
     success: function(data){
       console.log("To-Do added woooooooo!!!",data);
       $('form ul').append(`<li contenteditable="true" data-id="${data._id}" data-completed="${data.completed}"><a href="">&#10008;</a>${data.todo}</li>`);
       toDoPage.thingstoDo.push(data);
     },
     error: function(err) {
       console.error("To-do NOT added, damnit");
     }
   })
 },
 getToDos: function() {
   $.ajax({
     url: toDoPage.url,
     method: "GET",
     success: function(data){
       console.log("Server got To-do",data);
       $('.whatsLeft').find('h3').text('toDos Left: ' + data.length);
       $('form ul').html("")
       data.forEach(function(element){
         toDoPage.thingstoDo.push(element);
        $('form ul').append(`<li contenteditable="true" data-id="${element._id}" data-completed="${element.completed}"><a href="#">&#10008;</a>${element.todo}</li>`);
       })
     },
     error: function(err) {
       console.error("C'mon Server!");
     }
   })
 },
 updateToDos: function(updateToDos){
  var updateUrl = toDoPage.url + "/" + updateToDos._id;
  $.ajax({
    url: updateUrl,
    method: "PUT",
    data: updateToDos,
    success: function(data){
      console.log("Edited to-do",data);
      toDoPage.getToDos();
    },
    error: function(err) {
      console.error("Could not edit to-do");
    }
  })
},
deleteToDos: function(deleteToDoId) {
  var deleteUrl = toDoPage.url + "/" + deleteToDoId;
  $.ajax({
    url: deleteUrl,
    method: "DELETE",
    success: function(){
      console.log("see-ya to-do!");
      toDoPage.getToDos();
    },
    error: function(err) {
      console.error("didn't delete to-do. argh.");
    }
})
}
}
