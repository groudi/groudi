var readyDataSource = function() {
    crud_issues();
    $( ".comment-box-name code strong" ).each(function() {

      var grid_value = $( this ).text().split('_');
      grid_name = $('body').find('tr:eq('+grid_value[0]+')').find('td:eq('+(parseInt(grid_value[1])-1)+')').find('input').attr('data-box');
      $(this).text('Box plot: ' +grid_name.replace('_',' / '));
    });
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

    $(document).on('click', '.button_to_link', function(e){
        var input = $( this ).attr('data-id');
        $.ajax({
          url: '/issues/'+ input,
          type: 'GET',
          dataType: 'json',
          beforeSend: function (xhr) {
              xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
          },
          success: function(data){
           $('.modal-title').val('Edit Issue');
           $('#issue_topic').val(data.issue.title);
           $('#issue_description').val(data.issue.desc);
           
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
              controlForm.find('.entry(:last) .btn-add-issue')
                    .addClass('btn-add-issue').removeClass('btn-remove')
                    .addClass('btn-success').removeClass('btn-danger')
                    .html('<span class="glyphicon glyphicon-plus"></span>');
           }
           if (data.issue.status){
                $('#active').prop("checked", true);
           }else{
                $('#active').prop("checked", false);
           }
           for(i=1; i<data.issue_attr.length; i++){

           }
            },
          error: function(xhr, status, response) {
            alert("Oops, there was an error while trying to get the details!");
            console.log(response);
            }
        });

    });

  $( ".vote_cast input" ).focusout(function() {
    count = $(this).attr('data-counter');
    var totalPoints = 0;

    $(this).closest('td').find('.vote_point').text($(this)[0].value*$(this).attr('data-weight'));
    $('.vote_'+count).each(function(){
        totalPoints = parseInt($(this).parent().find('.vote_point').text()) + totalPoints;
    });
    if(totalPoints>0)
    $('.column_sum_'+count).text(totalPoints);
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
