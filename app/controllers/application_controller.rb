class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  protected
  def require_signed_in_user
    return redirect_to new_user_session_url, alert: 'Please sign in' unless current_user 
  end

  def current_user
    User.new(session[:current_user_attributes]) if session[:current_user_attributes]
  end
end
