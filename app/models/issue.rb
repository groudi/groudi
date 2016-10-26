class Issue < ActiveRecord::Base
	has_many :standards
	has_many :comments
	has_many :ideas
end
