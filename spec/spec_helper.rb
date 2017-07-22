ENV["RACK_ENV"] ||= "test"
require "rspec"
require "capybara/rspec"

require_relative "../server"

Capybara.app = Sinatra::Application
