class Notifier < ApplicationMailer
	default from: 'groudi.startup@gmail.com'
	layout "mail_template"

	def invitation_email(user, id)
	    @user = user
	    @url  = 'https://groudi.herokuapp.com/discussion/'+id
	    success = mail(to: @user,
         subject: 'New discussion topic') do |format|
	      format.html { render 'invitation_email' }
	    end
	    return success
	  end
end
