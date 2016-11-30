class AnalyticsController < ApplicationController
	require 'pp'
	before_action :authenticate_user!
	def show
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
		pp @votes_hash
		@votes_hash.each do | key, value |
			@votes_hash[key]["email"] = User.where(:id => key).select("email").first[:email]
		end
		@comments = Comment.joins(:issue).where("comments.issue_id = "+params[:id]).order('grid ASC')
	end
end
