require "spec_helper"

feature "User can enter trip's details and get the best route",
%Q{As a user
 I want to be able to specify the details of the trip
 So that I can see the best route} do

# Acceptance Criteria:
#  [] If I am logged in as an admin, I can visit the list of all locations page

  scenario "User visits index page and fills the form" do
    visit '/'

    fill_in 'origin', with: 'Quincy, MA'
    fill_in 'waypoint1', with: 'Boston, MA'
    click_button "Calculate trip"


    expect(page).to have_content 'Roadtrip'
  end
end
