const {Given, When, Then} = require('@cucumber/cucumber')
const assert = require('assert')
const helper = require('../src/helpers/helper')

let date,occupations;

Given('user who was born on {word}', function (birthday) {
    date = birthday;
});

When('user is a {word}', function (occupation) {
    occupations = occupation;
});

Then('user have been assigned to priority level {int}', function (level) {

    const user = {reservation_id: 000};
    user['register_timestamp'] = "string";
    user['name'] = "string";
    user['surname'] = "string";
    user['birth_date'] = date;
    user['citizen_id'] = "string";
    user['occupation'] = occupations;
    user['address'] = "string";
    assert.equal(helper.setPriorityPerson(user), level);
});