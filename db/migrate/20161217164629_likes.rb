class Likes < ActiveRecord::Migration
  def change
  	create_table :likes do |t|
	    t.integer   :like
	    t.text     :creator
	    t.timestamps
	end
  end
end
