# University Tuition Payment System
An API allowing students to check their tuition fee status through the mobile app.

An API enabling students to check their tuition fee status through the bank.

An API facilitating students to pay their tuition fee via online banking.

## Technologies and Programming Languages Used:
Nodejs , Express , Azure, Postgresql, Postman , JavaScript

## Requirements:

### University Mobile App:

1.Query Tuition

balanceandtotaltuition endpoints

Method: POST

Parameters:

studentno: Student number(string)

### Banking App:
1.Query Tuition

balanceandtotaltuition endpoints

Method: POST

Parameters: 

studentno: Student number(string)

2.Pay Tuition
paytuition endpoints

Method: POST

Parameters:

studentno: Student number(string)

term: Term(string)

### University Web Site:
1.Add Tuition

addtuition endpoints

Method: POST

Parameters:

studentno: Student number (String)

term: Term (String)

2.Unpaid Tuition Status

unpaidTuitionStatus endpoints

Method: POST

Parameters:

term: Term (String)

## DATA MODEL (ER DIAGRAM)

![ER Diagram](https://github.com/gultenguzel/maya/assets/140374859/24843e46-8597-404a-9a20-e444129dce5c)

## PRESENTATION

https://drive.google.com/file/d/14hTzhCg2npycGlgxTCDQYftM8iNR_Ujk/view

## Issues I Encountered:

While creating the APIs, I also had difficulty executing the logic in the relationship I would establish with the database.
I tried to make postgre public without ip restriction, I couldn't.




