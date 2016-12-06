class ApplicationMailer < ActionMailer::Base
  default from: "groudi.startup@gmail.com"
  layout 'mail_template'
end
