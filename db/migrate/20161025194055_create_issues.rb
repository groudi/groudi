class CreateIssues < ActiveRecord::Migration
  	def change
     	create_table :comments do |t|
		    t.integer  :issue_id
		    t.text     :comment
		    t.timestamps
		end

	  create_table :issues do |t|
		    t.string   :title
		    t.text     :desc
		    t.text     :idea
		    t.boolean  :status
		    t.text     :creator
		    t.timestamps
	  end

	  create_table :standards do |t|
		    t.string   :title
		    t.integer :weight
		    t.integer  :issue_id
		    t.text     :desc
		    t.timestamps
	  end
	end
end
