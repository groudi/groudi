var readyDataSource = function() {
    crud_issues();
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
        var bodyParam = new FormData();
        var user = me;
        var issue_id = current_issue;
        var comment = $( this ).parent().parent().find('input')[0].value;
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
    var grid = $(this).find('input').attr('data-box');
    var grid_pos = $(this).find('input').attr('data-grid');
    var pop = $("#com_"+grid).modal('show');
    if(pop.length==0){
      $("#com_template").find('code').text('Box plot:' +grid.replace('_',' / '));
      pop = $("#com_template").modal('show');
    }
    pop.find('.post-comment').attr('data-grid',grid_pos);
  });
 }