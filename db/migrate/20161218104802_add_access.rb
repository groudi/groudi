class AddAccess < ActiveRecord::Migration
  def change
  	add_column :issues, :invited_email, :text
  end
end
