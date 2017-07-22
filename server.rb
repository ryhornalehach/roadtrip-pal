require 'dotenv/load'
require "sinatra"
require 'pry'

GOOGLE_KEY = ENV['GOOGLE_KEY']

set :bind, '0.0.0.0'

current_trip = {}
current_origin = []
current_waypoints = []

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

post '/places' do
  current_trip = params
  current_origin = []
  current_waypoints = []
    current_trip.each do |item|
      if item[0] != 'origin'
        current_waypoints << item
      else
        current_origin << item
      end
    end
  redirect to '/roadtrip'
end

get '/api' do
  trip = [current_origin, current_waypoints]
  JSON(trip)
end
