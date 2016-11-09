class IssuesController < ApplicationController
	before_action :authenticate_user!
	def index
		records = Issue.all;
		
		@issues = records
  	end


  	def create_issue
  		data_source_hash = {
			:title => params[:issue_topic],
			:desc => params[:issue_desc],
			:status => params[:issue_status],
			# :idea => params[:issue_idea],
			:creator => 'user_default'
			# :standards => params[:issue_attr]
		}
  		@issue_detail = Issue.new(data_source_hash)
		 
		@issue_detail.save
		redirect_to action: "index"
  	end

  	def update_issue
  	end

  	def delete_issue
  	end

end
