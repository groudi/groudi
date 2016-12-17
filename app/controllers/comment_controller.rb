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

  	def likes
  		like = Like.where( creator: current_user.id )
  		if like.size > 0
	  		like_hash = {
				:like => params[:like],
				:creator => current_user.id
			}
			Like.where(creator: current_user.id ).first.update_column( :like, params[:like])
		else
			like_hash = {
				:like => params[:like],
				:creator => current_user.id
			}
			like_insert = Like.new(like_hash)
			like_insert.save
		end
  		respond_to do |format|
	    	format.json { render :json => {:stars => like} }
	  	end
  	end
end
