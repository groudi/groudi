class Votes < ActiveRecord::Migration
  def change
  	create_table :votes do |t|
	    t.integer  :issue_id
	    t.integer  :row
	    t.integer  :column
	    t.integer  :value
	    t.integer  :user_id
	    t.boolean  :integrated
	    t.timestamps
	end
  end
end
