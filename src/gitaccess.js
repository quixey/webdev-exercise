var request = new XMLHttpRequest();
request.open('get', 'https://api.github.com/users/andrewdonato')
request.send()


$(document).ready(function() {
  // This is called after the document has loaded in its entirety
  // This guarantees that any elements we bind to will exist on the page
  // when we try to bind to them

  // See: http://docs.jquery.com/Tutorials:Introducing_$(document).ready()

  makeGitRequest();

});


var makeGitRequest = function(){
  $('.githubaccess').on('submit', function(event){

    event.preventDefault();

    $('.githubdata').html('<div id="loader"><img src="css/l`xoader.gif" alt="loading..."></div>');

    var username = $('.githubusername').val();
    var requesturl   = 'https://api.github.com/users/'+username;
    var repourl  = 'https://api.github.com/users/'+username+'/repos';

    requestJSON(requesturl, function(json) {

       if(json.message == "Not Found" || username == '') {
        $('#githubdata').html("<h2>No User Info Found</h2>");
      }

      else {
        // else we have a user and we display their info
        var fullname   = json.name;
        var username   = json.login;
        var aviurl     = json.avatar_url;
        var profileurl = json.html_url;
        var location   = json.location;
        var followersnum = json.followers;
        var followingnum = json.following;
        var reposnum     = json.public_repos;

        if(fullname == undefined) { fullname = username; }
        var outhtml = '<h2>'+fullname+' <span class="smallname">(@<a href="'+profileurl+'" target="_blank">'+username+'</a>)</span></h2>';
        outhtml = outhtml + '<div class="ghcontent"><div class="avi"><a href="'+profileurl+'" target="_blank"><img src="'+aviurl+'" width="80" height="80" alt="'+username+'"></a></div>';
        outhtml = outhtml + '<p>Followers: '+followersnum+' - Following: '+followingnum+'<br>Repos: '+reposnum+'</p></div>';
        outhtml = outhtml + '<div class="repolist clearfix">';

        var repositories;
        $.getJSON(repouri, function(json){
          repositories = json;
          outputPageContent();
        });

        function outputPageContent() {
          if(repositories.length == 0) { outhtml = outhtml + '<p>No repos!</p></div>'; }
          else {
            outhtml = outhtml + '<p><strong>Repos List:</strong></p> <ul>';
            $.each(repositories, function(index) {
              outhtml = outhtml + '<li><a href="'+repositories[index].html_url+'" target="_blank">'+repositories[index].name + '</a></li>';
            });
            outhtml = outhtml + '</ul></div>';
          }
          $('#githubdata').html(outhtml);
        }
      }
    });
  });
}

//     var form = $(this);
//     var data = form.serialize();
//     var path = $('.create_project_form').attr('action')
//     var method = $('.create_project_form').attr('method')

//     var request = $.ajax({
//       url: path,
//       type: method,
//       data: data,
//       dataType: "json"
//     })
//     request.done(function(serverData){
//       console.log('success');
//       console.log(serverData, "hello");
//       $('div.project_index').children().last().append('<div> <a href="projects/'+serverData.id + '">'+ serverData.name+ '</a> </div>')
//       $('.hidden_project_form').toggle();
//       $('.create_project_form')[0].reset();
//     })
//     request.fail(function(serverData){
//       console.log(serverData);
//       console.log('server request failed');
//     })
//   });
// };

