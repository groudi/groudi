class IssuesController < ApplicationController
	require 'pp'
	before_action :authenticate_user!
	def index
		records = Issue.where("invited_email like ?", "%#{current_user.email}%")
		
		@issues = records
  	end


  	def get_issue
	  respond_to do |format|
	  	if !params[:id]
	  		params[:id]="1"
	  	end
	    @issue = Issue.find(params[:id])
	    @issue_attr = Standard.where(issue_id: params[:id])
	    format.html {
			votes = Vote.where(issue_id: params[:id], user_id: authenticate_user![:id])
	    	@votes_hash = Hash.new { |hash, key| hash[key] = Hash.new(&hash.default_proc) }
    		votes.each do | vote |
    			@votes_hash[vote.column][vote.row] = vote
    		end
	    	@comments = Comment.joins(:issue).where("comments.issue_id = "+params[:id]).order('grid ASC')
	    	render :show, :issue => @issue, :issue_attr => @issue_attr, :comments => @comments, :votes => @votes_hash
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
			:creator => authenticate_user![:id],
			:invited_email => current_user.email
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
  		data_source_hash = {
			:title => params[:issue_topic],
			:desc => params[:issue_desc],
			:status => params[:issue_status],
			:idea => params[:issue_idea],
			:creator => authenticate_user![:id]
		}
		issue_detail = Issue.update(params[:id],data_source_hash)
		issue_detail.save

		redirect_to action: "index"
  	end

  	def destroy
    	@issue = Issue.find(params[:format])
    	@issue.destroy
    	Vote.where( issue_id: params[:format]).destroy_all
    	Comment.where( issue_id: params[:format]).destroy_all
    	redirect_to action: "index"
  	end

  	def vote
  		row_count = params[:vote_cast]["1"].size
  		batch = []
  		# checking if we are going to edit the vote matrix ?
  		if params[:edit_vote_cast]["1"][0].length>0
  			(1..params[:vote_cast].length).each do |col|
				(1..row_count).each do |row|
					if(params[:vote_cast][col.to_s][row-1] != params[:edit_vote_cast][col.to_s][row-1])
						Vote.where( issue_id: params[:id], row: row, column: col, user_id: current_user.id ).first.update_column( :value, params[:vote_cast][col.to_s][row-1] )
		  			end
				end
  			end
  			flash[:notice] = "You have successfully edited your votes."
  		else
  			# or inserting a new matrix ?
	  		(1..params[:vote_cast].length).each do |col|
				(1..row_count).each do |row|
		  			vote_hash = {
					:integrated => false,
					:column => col,
					:row => row,
					:value => params[:vote_cast][col.to_s][row-1],
					:user_id => authenticate_user![:id],
					:issue_id => params[:id]
					}
					Vote.create(vote_hash)
				end
  			end
  			flash[:notice] = "You have successfully casted your votes."
  		end
  		redirect_to action: "result"
  	end

  	def result
  		@issue = Issue.find(params[:id])
  		@issue_attr = Standard.where(issue_id: params[:id])
  		votes = Vote.where(issue_id: params[:id])
    	@votes_hash = Hash.new { |hash, key| hash[key] = Hash.new(&hash.default_proc) }
    	@aggregate_hash = Hash.new { |hash, key| hash[key] = Hash.new(&hash.default_proc) }

		votes.each do | vote |
			@votes_hash[vote.user_id][vote.column][vote.row] = vote
			if @aggregate_hash[vote.column.to_s][vote.row.to_s].size>0
				@aggregate_hash[vote.column.to_s][vote.row.to_s] += vote[:value]
			else
				@aggregate_hash[vote.column.to_s][vote.row.to_s] = vote[:value]
			end
		end
		@votes_hash.each do | key, value |
			@votes_hash[key]["email"] = User.where(:id => key).select("email").first[:email]
		end
    	@comments = Comment.joins(:issue).where("comments.issue_id = "+params[:id]).order('grid ASC')
  	end

  	def invite
  		emails = params[:invited].split(",")
  		success = []
  		emails.each do | email |
  			# success = Notifier.invitation_email(email, params[:id]).deliver_now
		end
		invited_list = Issue.where(id: params[:id]).first[:invited_email]
		invited_list = invited_list | emails
		Issue.where(id: params[:id]).first.update_column(:invited_email, invited_list )
		respond_to do |format|
	    	format.json { render :json => {:message => "Email notification sent to valid emails."}}
	  	end
  	end

end
