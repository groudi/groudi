class AnalyticsController < ApplicationController
	require 'pp'
	require 'descriptive_statistics'
	before_action :authenticate_user!
	def show
		@issue = Issue.find(params[:id])
		@issue_attr = Standard.where(issue_id: params[:id])
		votes = Vote.where(issue_id: params[:id])
		plain_votes = Vote.where(issue_id: params[:id]).pluck(:value)
		@stars = Like.where(creator: current_user.id).first
		@key_stats =  plain_votes.descriptive_statistics
		pp "=============================================="
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
end
