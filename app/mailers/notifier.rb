class Notifier < ApplicationMailer
	default from: 'umesh.riverbed@gmail.com'
	layout "mail_template"

	def invitation_email(user, id)
	    @user = user
	    @url  = 'http://localhost:3000/issues/'+id
	    success = mail(to: @user,
         subject: 'New discussion topic') do |format|
	      format.html { render 'invitation_email' }
	    end
	    return success
	  end
end
