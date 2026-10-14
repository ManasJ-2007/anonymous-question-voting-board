# Anonymous Question Collection and Voting Board

A lightweight question collection and upvoting platform built using Google Forms, Google Sheets, and Google Apps Script.

It helps classes, student groups, and organizations collect questions anonymously and prioritize them through community voting.

## Features

- Anonymous question submission through Google Forms.
- Duplicate-question prevention.
- Upvoting for individual questions.
- Questions ranked by popularity.
- Google Sheets used as the database.
- No separate server required.

## Tech Stack

- Google Forms
- Google Sheets
- Google Apps Script
- HTML, CSS, JavaScript

## Project Structure

- `Code.gs` — backend logic for questions and voting.
- `Index.html` — web interface.
- `README.md` — project documentation.
- `LICENSE` — project license.

## Setup Instructions

1. Create a Google Sheet with a `Questions` tab containing the columns `ID`, `Question`, `Category`, and `Active`.
2. Create a `Votes` tab containing `Timestamp`, `Voter Hash`, and `Question ID`.
3. Create a Google Form for question submissions and link it to the spreadsheet.
4. Add the Apps Script backend and HTML interface to an Apps Script project associated with the spreadsheet.
5. Configure the form-submission trigger.
6. Deploy the project as a web app with appropriate access permissions.
7. Test question submission, voting, and duplicate-vote prevention using separate test accounts before sharing it.

## Privacy and Security

- Do not publish real student questions, voting records, spreadsheet IDs, private codes, or credentials.
- Do not share the underlying spreadsheet publicly.
- Avoid collecting email addresses in the form if anonymous submissions are required.
- The voting implementation stores hashed account identifiers. Hashing is not equivalent to complete anonymity.
- Google account identification may depend on deployment settings. Test with the intended users before relying on one-vote-per-person enforcement.

## Limitations

This is a starting template. Additional setup and testing may be required depending on the organization, Google account type, and deployment configuration.

## License

This project is intended to be released under the MIT License. See `LICENSE` for the license terms.
