class Issue < ActiveRecord::Base
	serialize :idea, Array 
	has_many :standards
	has_many :comment
end
