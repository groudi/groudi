class Comment < ActiveRecord::Base
	belongs_to :issue, foreign_key: "issue_id"
end
