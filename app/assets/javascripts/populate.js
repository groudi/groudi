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