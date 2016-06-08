$(document).ready(function() {
  blogPage.init();
})

var blogPage = {
  url: 'http://tiny-tiny.herokuapp.com/collections/tomaybedo',
  blogs: [],
  init: function() {
    blogPage.styling();
    blogPage.events();
  },
  styling: function() {
    blogPage.getBlogs();
  },
  events: function() {
    //Submit Edit
    $('body').on('click', '.submit', function(event) {
      event.preventDefault();
      var $submit = $('.reminder')
      var objToSubmit = {
        isDone:false,
        description:$(".reminder").val()
      }
      console.log("TEST", objToUpdate)
      blogPage.updateBlog(objToUpdate)
      $edit.remove();


    })

    // Show Edit Fields
    $('.blogs').on('click','.edit',function(event) {
      event.preventDefault();
      var that = this;
      $.ajax({
        method: 'GET',
        url: blogPage.url + "/" + $(that).parent().data('id'),
        success: function(data) {
          var htmlToAppend = blogPage.htmlGenerator(blogTemplates.edit,data)
          $(that).parent().append(htmlToAppend)
        },
        error: function(err) {
          console.error("NO LIKEY", err);
        }
      })

    })

    //Add New Post
    $("form button").on('click', function(event) {
      event.preventDefault();
      var newBlogPost = {
        isDone:false,
        description:$(".reminder").val()
      };
      blogPage.createBlog(newBlogPost);
      $('.reminder').val("");
    })//end click event

    //Change pages
    $('header nav li').on('click', function(event) {
      event.preventDefault();
      var thingWeClickText = $(this).text();
      var ourClassToShow = "." + thingWeClickText.toLowerCase();

      if(thingWeClickText.toLowerCase() === 'home') {
        $(ourClassToShow).removeClass('hidden')
        $(ourClassToShow).siblings().addClass('hidden')
      } else {
        var htmlStr = blogPage.htmlGenerator(blogTemplates[thingWeClickText.toLowerCase()])
        $(ourClassToShow).removeClass('hidden').append(htmlStr);
        $(ourClassToShow).siblings().addClass('hidden')
      }
    })

    $('.blogs').on('click','.delete', function(event) {
      event.preventDefault();
      var blogId = $(this).parent().data('id');
      blogPage.deleteBlog(blogId);
    })
  },

  createBlog: function(blog) {
    $.ajax({
      url: blogPage.url,
      method: "POST",
      data: blog,
      success: function(data) {
        console.log("WE CREATED SOMETHING", data);
        var htmlStr = blogPage.htmlGenerator(blogTemplates.blogTmpl,data)
        blogPage.blogs.push(data);
        $('.blogs ul').append(htmlStr);

      },
      error: function(err) {
        console.error("OH CRAP", err);
      }
    })
  },

  updateBlog: function(blog) {

    $.ajax({
      method: 'PUT',
      url: blogPage.url + "/" + blog.id,
      data: blog,
      success: function(data) {
        console.log("UPDATED SUCCESSFULLY!!!", data);
        blogPage.getBlogs();
      },
      error: function(err) {
        console.error("I HAVE NO IDEA WHATS GOIGN ON", err);
      }
    })
  },

  getBlogs: function() {
    $.ajax({
      url: blogPage.url,
      method: "GET",
      success: function(data) {
        console.log("WE GOT SOMETHING", data);
        $('.blogs ul').html("");
        data.forEach(function(element,idx) {
          var blogHtmlStr = blogPage.htmlGenerator(blogTemplates.blogTmpl,element);
          $('.blogs ul').append(blogHtmlStr)
          blogPage.blogs.push(element);
        });
      },
      error: function(err) {
        console.error("OH CRAP", err);
      }
    })
  },
  deleteBlog: function(blogId) {
    // find blog to delete from our blog data;
    var deleteUrl = blogPage.url + "/" + blogId;
    $.ajax({
      url: deleteUrl,
      method: "DELETE",
      success: function(data) {
        console.log("WE DELETED SOMETHING", data);
        blogPage.getBlogs();
      },
      error: function(err) {
        console.error("OH CRAP", err);
      }
    })
  },

  templification: function(template) {
    return _.template(template);
  },

  htmlGenerator: function(template,data) {
    var tmpl = blogPage.templification(template);
    return tmpl(data);
  }

};


var blogTemplates = {
    blogTmpl: `
      <li data-id='<%= _id %>'>
        <%= isDone %>
        <br>
          <button class="delete">Delete</button>
          <button class="edit">Edit</button>
      </li>
    `,
    about: `
        <h1>This is the about page</h1>
        <p>
          We are at the same level as the law.
        </p>
    `,
    contact:`
            <h1>Please do not contact me</h1>
            <p>
              I am above the law.
            </p>
    `,
    edit: `
      <div id="edit-fields" data-id='<%= _id %>'>
        <input type="text" name="title" value="<%= title %>" />
        <textarea><%= content %></textarea>
        <input name="author" type="text" value="<%= author %>" />
        <input type="submit" value="EDIT ME" id="change-btn" />
      </div>
    `
  }
