class IssuesController < ApplicationController
	require 'pp'
	before_action :authenticate_user!
	def index
		records = Issue.all;
		
		@issues = records
  	end


  	def get_issue
	  respond_to do |format|

	    @issue = Issue.find(params[:id])
	    @issue_attr = Standard.where(issue_id: params[:id])
	    format.html {
	    	@comments = Comment.joins(:issue).where("comments.issue_id = "+params[:id]).order('grid ASC')
	    	render :show, :issue => @issue, :issue_attr => @issue_attr, :comments => @comments
	 	}
	    format.json { render :json => {:issue => @issue, :issue_attr => @issue_attr } }

	  end
	end

  	def create_issue
  		
  		data_source_hash = {
			:title => params[:issue_topic],
			:desc => params[:issue_desc],
			:status => params[:issue_status],
			:idea => params[:issue_idea],
			:creator => authenticate_user![:id]
		}
		issue_detail = Issue.new(data_source_hash)
		issue_detail.save

		(0..params[:attr_desc].length-1).each do |i|
  			data_attribute_hash = {
			:title => params[:attr_title][i],
			:desc => params[:attr_desc][i],
			:weight => params[:attr_weight][i],
			:issue_id => issue_detail[:id]
		}
		criterion =  Standard.new(data_attribute_hash) 
  		criterion.save
  		end
		redirect_to action: "index"
  	end

  	def update_issue
  	end

  	def destroy
    	@issue = Issue.find(params[:format])
    	@issue.destroy
    	redirect_to action: "index"
  	end

end
