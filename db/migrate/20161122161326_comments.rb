class Comments < ActiveRecord::Migration
  def change
  	add_column :comments, :user_id, :string
  	add_column :comments, :grid, :string
  end
end
