var readyDataSource = function() {
    crud_issues();
    $( ".comment-box-name code strong" ).each(function() {

      var grid_value = $( this ).text().split('_');
      grid_name = $('body').find('tr:eq('+grid_value[0]+')').find('td:eq('+(parseInt(grid_value[1])-1)+')').find('input').attr('data-box');
      $(this).text('Box plot: ' +grid_name.replace('_',' / '));
    });
    $( "tbody input" ).each(function() {
      $(this).focus();
      $(this).trigger('focusout');
    });
    $('.aggregate').attr('disabled','disabled');
    current_page = window.location.pathname;
    if(current_page.split('/')[1]=="result"){
      set_winner();
    }

    // create new user clicking the link in the welcome mt groudi email from subscription
    if(current_page.split('/')[2]=="sign_up"){
      $("#user_session_email").val(sessionStorage.getItem("user_email"));
      $("#user_session_password").val("default");
      $("#user_password_confirmation").val("default");
      $("#login-btn").click();
      
    }

    if(current_page.split('/')[2]=="sign_in" && $(".alert-danger").length>0){
        window.location.href = window.location.protocol + "//" + window.location.host + "/users/sign_up";
      }
    else if(current_page.split('/')[2]=="sign_in"){
      var user_email = window.location.hash.split('#')[1];
      sessionStorage.setItem("user_email", user_email);
      $("#user_session_email").val(user_email);
      $("#user_session_password").val("default");
      $("#login-btn").click();
    }
 };

 function crud_issues(){
 	$(document).on('click', '.btn-add-issue', function(e)
    {
        e.preventDefault();

        var controlForm = $('.issue_idea .form_add:first'),
            currentEntry = $(this).parents('.entry:first'),
            newEntry = $(currentEntry.clone()).appendTo(controlForm);
        newEntry.find('input').val('');
        controlForm.find('.entry:not(:last) .btn-add-issue')
            .removeClass('btn-add-issue').addClass('btn-remove')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
    }).on('click', '.btn-remove', function(e)
    {
		$(this).parents('.entry:first').remove();

		e.preventDefault();
		return false;
	});

	$(document).on('click', '.btn-add-attribute', function(e)
    {
        e.preventDefault();

        var controlForm = $('.issue_attribute .form_add:first'),
            currentEntry = $(this).parents('.entry:first'),
            newEntry = $(currentEntry.clone()).appendTo(controlForm);
        //newEntry.find('input').val('');
        controlForm.find('.entry:not(:last) .btn-add-attribute')
            .removeClass('btn-add-attribute').addClass('btn-remove')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
    }).on('click', '.btn-remove', function(e)
    {
		$(this).parents('.entry:first').remove();

		e.preventDefault();
		return false;
	});

    $(document).on('click', '.post-comment', function(e)
    {
        e.preventDefault();
        var comment = $( this ).parent().parent().find('input')[0].value;
        if(comment.length>0)
        {
          var bodyParam = new FormData();
          var user = me;
          var issue_id = current_issue;
          var grid = $(this).attr('data-grid');
          $.ajax({
            url: '/comment',
            type: 'POST',
            data: {user_name:user, comment:comment, issue_id: current_issue, grid: grid},
            dataType: 'json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
            },
            success: function(data){
              $('.modal-body').find('input').val('');
              $('.modal').modal('hide');
              },
            error: function(xhr, status, response) {
              alert("Oops, there was an error while trying to comment !");
              console.log(response);
              }
          });
        }else{
          alert('empty comment feild cannot be saved');
        }
  });

    $(document).on('click', '.trash-red', function(e)
    {
        e.preventDefault();
          var id = $(this).attr('data-id');
          $.ajax({
            url: '/comment/'+id,
            type: 'DELETE',
            success: function(data){
              console.log($(this))
              $(this).closest('.row').fadeOut();
              },
            error: function(xhr, status, response) {
              alert("Oops, there was an error while trying to comment !");
              console.log(response);
              }
          });
  });
    $(document).on('click', '.invite_button', function(e){
        // var input = $( this ).attr('data-id');
        $('.invite').attr('data-id',$( this ).attr('data-id'));
    });
    $(document).on('click', '.invite', function(e){
        var input = $( this ).attr('data-id');
        $.ajax({
          url: '/invite/'+ input,
          type: 'POST',
          data: {invited:$('.invite_users').val()},
          dataType: 'json',
          beforeSend: function (xhr) {
              xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
          },
          success: function(data){
            $('.ajax-alert p').text(data.message);
            $('.ajax-alert').css("display","block");

            setTimeout(function(){
              $('.ajax-alert').fadeOut();
            }, 3000);
           $('.modal').modal('hide');
          },
          error: function(xhr, status, response) {
            alert("Oops, there was an error while trying to invite the contributors!");
            console.log(response);
            }
        });

    });
    $(document).on('click', '.add', function(e){
      $('.modal-title').text('Add Discussion');
     $('#create-edit-issues-form').attr('action', '/create_issue');
     $('input.form-control').val('');

    });
    $(document).on('click', '.button_to_result', function(e){
      id = $( this ).attr('data-id');
      window.location.href = window.location.protocol + "//" + window.location.host + "/result/"+id;

    });
    $(document).on('click', '.button_to_vote', function(e){
      id = $( this ).attr('data-id');
      window.location.href = window.location.protocol + "//" + window.location.host + "/discussion/"+id;

    });
    $(document).on('click', '.button_to_link', function(e){
        var input = $( this ).attr('data-id');
        $.ajax({
          url: '/discussion/'+ input,
          type: 'GET',
          dataType: 'json',
          beforeSend: function (xhr) {
              xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
          },
          success: function(data){
           $('.modal-title').text('Edit Discussion');
           $('#issue_topic').val(data.issue.title);
           $('#issue_description').val(data.issue.desc);
           $('#create-edit-issues-form').attr('action', '/edit_issue/'+ input);
           $('.issue_idea input').val(data.issue.idea[0]);
           if(data.issue.idea.length>1){
              var controlForm = $('.issue_idea .form_add:first'),
            currentEntry = $('.issue_idea').find('.entry:first');
              for(i=1; i<data.issue.idea.length; i++){
                  var newEntry = $(currentEntry.clone()).appendTo(controlForm);
                  newEntry.find('input').val(data.issue.idea[i]);
                    controlForm.find('.entry:not(:last) .btn-add-issue')
                    .removeClass('btn-add-issue').addClass('btn-remove')
                    .removeClass('btn-success').addClass('btn-danger')
                    .html('<span class="glyphicon glyphicon-minus"></span>');
              }
              $('.idea_block .entry:last-child .btn-remove')
                    .addClass('btn-add-issue').removeClass('btn-remove')
                    .addClass('btn-success').removeClass('btn-danger')
                    .html('<span class="glyphicon glyphicon-plus"></span>');
           }
           if (data.issue.status){
                $('#active').prop("checked", true);
           }else{
                $('#active').prop("checked", false);
           }
           $('input.c_title').val(data.issue_attr[0].title);
           $('.c_weight').val(data.issue_attr[0].weight);
           $('.c_desc').val(data.issue_attr[0].desc);
           for(i=1; i<data.issue_attr.length; i++){
            console.log(data.issue_attr[i].title);
            $('.attribute_block .btn-add-attribute').trigger('click');
            $('.issue_attribute .entry:last .c_title').val(data.issue_attr[i].title);
            $('.issue_attribute .entry:last .c_desc').val(data.issue_attr[i].desc);
            $('.issue_attribute .entry:last .c_weight').val(data.issue_attr[i].weight);
          }
         },
          error: function(xhr, status, response) {
            alert("Oops, there was an error while trying to get the details!");
            console.log(response);
            }
        });

    });

  $( ".vote_cast input" ).focusout(function() {
    parent_table = $(this).closest('table');
    count = $(this).attr('data-counter');
    var totalPoints = 0;

    $(this).closest('td').find('.vote_point').text($(this)[0].value*$(this).attr('data-weight'));
    $(parent_table).find('.vote_'+count).each(function(){
        totalPoints = parseFloat($(this).parent().find('.vote_point').text()) + totalPoints;
    });
    if(totalPoints>0)
    $(parent_table).find('.column_sum_'+count).text(totalPoints);
  });

  $( ".vote_cast" ).dblclick(function() {
    var grid_name = $(this).find('input').attr('data-box');
    var grid_pos = $(this).find('input').attr('data-grid');
    var pop = $("#com_"+grid_pos).modal('show');
    if(pop.length==0){
      $("#com_template").find('code').text('Box plot: ' +grid_name.replace('_',' / '));
      pop = $("#com_template").modal('show');
    }else{
      $(pop).find('code').text('Box plot:' +grid_name.replace('_',' / '));
    }
    pop.find('.post-comment').attr('data-grid',grid_pos);
  });
}

function set_winner(){
  var winner_value = 0.0;
  var winner=[];
  var message = "The winner are: ";
  $('.bs-callout-info *[class^="column_sum_"]').each(function(){
    $(this).text(parseFloat($(this).text()).toFixed(2));
    winner.push($(this).attr('class'));
    if(parseFloat($(this).text()) >= winner_value){
      winner_value = parseFloat($(this).text());
    }
  });
  $('.bs-callout-info *[class^="column_sum_"]').each(function(){
    if(parseInt($(this).text()) < parseInt(winner_value)){
      winner.splice( $.inArray($(this).attr('class'), winner), 1 );
    }
  });

  
  $.each(winner, function(index, value){
    $('.bs-callout-info  table tr th:nth-child('+(parseInt(value.split('_')[2])+1)+')').css('color','#c7254e');
    if(winner.length==1){
      message = "The winner is: " + $('table tr th:nth-child('+(parseInt(value.split('_')[2])+1)+')').first().text()+ " with total points of "+ $('.bs-callout-info table tr th:nth-child('+(parseInt(value.split('_')[2])+1)+')').last().text();
    }else{
      message += $('.bs-callout-info table tr th:nth-child('+(parseInt(value.split('_')[2])+1)+')').first().text() + " / ";
    }
  });
  $('.winner_declaration').text(message)

  table_counter = 0;
  $('.individual table').each(function(){
    table_counter += 1;
    winner_value = 0;
    winner=[];
    $(this).find('*[class^="column_sum_"]').each(function(){
      winner.push($(this).attr('class'));
      if(parseInt($(this).text()) >= winner_value){
        winner_value = parseInt($(this).text());
      }
    });
    $(this).find('*[class^="column_sum_"]').each(function(){
      if(parseInt($(this).text()) < parseInt(winner_value)){
        winner.splice( $.inArray($(this).attr('class'), winner), 1 );
      }
    });
      
    $.each(winner, function(index, value){
      var high = parseInt(value.split('_')[2])+1;
      $('.tbl_'+table_counter+' tr th:nth-child('+high+')').css('color','#c7254e'); 
    });
  });
}
