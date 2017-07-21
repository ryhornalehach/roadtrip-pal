require 'dotenv/load'
require "sinatra"
require 'pry'

GOOGLE_KEY = ENV['GOOGLE_KEY']

set :bind, '0.0.0.0'

get '/' do
  redirect '/index'
end

get '/index' do
  erb :index
end

get '/roadtrip' do
  erb :roadtrip
end

get '/mylocation' do
  erb :mylocation
end
