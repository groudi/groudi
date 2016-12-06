class ApplicationMailer < ActionMailer::Base
  default from: "umesh.riverbed@gmail.com"
  layout 'mail_template'
end
