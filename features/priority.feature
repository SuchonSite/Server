Feature: Priority

Scenario: Assign priority to each user

Given user who was born on 2000-10-20
When user is a teacher
Then user have been assigned to priority level 3

Given user who was born on 1950-10-20
When user is a teacher
Then user have been assigned to priority level 2

Given user who was born on 2000-10-20
When user is a nurse
Then user have been assigned to priority level 1

Given user who was born on 1950-10-20
When user is a nurse
Then user have been assigned to priority level 1

Given user who was born on 2000-10-20
When user is a doctor
Then user have been assigned to priority level 1

Given user who was born on 1950-10-20
When user is a doctor
Then user have been assigned to priority level 1

Given user who was born on 1960-10-20
When user is a teacher
Then user have been assigned to priority level 2

Given user who was born on 1962-10-20
When user is a teacher
Then user have been assigned to priority level 3

Given user who was born on 1961-10-20
When user is a teacher
Then user have been assigned to priority level 3

