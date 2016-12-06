class CommentController < ApplicationController
	def new
		comment_hash = {
			:comment => params[:comment],
			:issue_id => params[:issue_id],
			:user_id => params[:user_name],
			:grid => params[:grid]
		}
		comment = Comment.new(comment_hash)
		comment.save
		respond_to do |format|
	    format.json { render :json => {:comment_hash => "super, comment is saved" } }

	  end
	end

	def destroy
    	@comment = Comment.find(params[:id])
    	@comment.destroy
    	respond_to do |format|
	    	format.json { render :json => {:comment => @comment } }
		end
  	end
end
