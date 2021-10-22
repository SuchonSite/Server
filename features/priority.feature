Feature: Priority

Scenario: Assign priority to each user

Given user who was born on 20-10-2000
When user is a teacher
Then user have been assigned to priority level 3

Given user who was born on 20-10-1950
When user is a teacher
Then user have been assigned to priority level 2

Given user who was born on 20-10-2000
When user is a nurse
Then user have been assigned to priority level 1

Given user who was born on 20-10-1950
When user is a nurse
Then user have been assigned to priority level 1

Given user who was born on 20-10-2000
When user is a doctor
Then user have been assigned to priority level 1

Given user who was born on 20-10-1950
When user is a doctor
Then user have been assigned to priority level 1

Given user who was born on 20-10-1960
When user is a teacher
Then user have been assigned to priority level 2

Given user who was born on 20-10-1962
When user is a teacher
Then user have been assigned to priority level 3

Given user who was born on 20-10-1961
When user is a teacher
Then user have been assigned to priority level 3

