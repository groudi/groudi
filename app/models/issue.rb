class Issue < ActiveRecord::Base
	serialize :idea, Array 
	serialize :invited_email, Array 
	has_many :standards
	has_many :votes
	has_many :comment
end
