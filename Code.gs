
/**
 * Anonymous Question Collection and Voting Board
 * Built with Google Forms, Google Sheets, and Apps Script.
 *
 * Setup:
 * 1. Create a Google Sheet with a "Questions" tab.
 * 2. Add headers: ID, Question, Category, Active.
 * 3. Create a "Votes" tab with headers:
 *    Timestamp, Voter Hash, Question ID.
 * 4. Link your Google Form to the spreadsheet.
 * 5. Deploy as a web app and test account identity.
 *
 * Do not publish private spreadsheet IDs or real user data.
 */

function onFormSubmit(e) {
  const response = e.namedValues;
  const questionText =
    response[
      'What question or concern would you like to raise with the Faculty Advisor?'
    ]?.[0]?.trim();

  if (!questionText) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Questions');
  if (!sheet) throw new Error('Create a Questions sheet first.');

  const rows = sheet.getDataRange().getValues();
  const duplicate = rows.slice(1).some(
    row =>
      String(row[1]).trim().toLowerCase() ===
      questionText.toLowerCase()
  );

  if (duplicate) return;

  sheet.appendRow([
    Utilities.getUuid(),
    questionText,
    'General',
    true
  ]);
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Question Voting Board');
}

function getQuestions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const questionsSheet = ss.getSheetByName('Questions');
  const votesSheet = ss.getSheetByName('Votes');

  if (!questionsSheet || !votesSheet) {
    throw new Error('Create the Questions and Votes sheets first.');
  }

  const questions = questionsSheet.getDataRange().getValues();
  const votes = votesSheet.getDataRange().getValues();

  const counts = {};

  votes.slice(1).forEach(row => {
    const id = String(row[2]);
    counts[id] = (counts[id] || 0) + 1;
  });

  return questions.slice(1)
    .filter(row => row[3] === true || String(row[3]).toLowerCase() === 'true')
    .map(row => ({
      id: String(row[0]),
      question: String(row[1]),
      category: String(row[2]),
      votes: counts[String(row[0])] || 0
    }))
    .sort((a, b) => b.votes - a.votes);
}

function castVote(questionId) {
  const email = String(
    Session.getActiveUser().getEmail() || ''
  ).trim().toLowerCase();

  if (!email) {
    throw new Error(
      'Your Google account could not be identified. Please sign in.'
    );
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const questionsSheet = ss.getSheetByName('Questions');
  const votesSheet = ss.getSheetByName('Votes');

  if (!questionsSheet || !votesSheet) {
    throw new Error('Create the Questions and Votes sheets first.');
  }

  const questionRows = questionsSheet.getDataRange().getValues();
  const validQuestion = questionRows.slice(1).some(row =>
    String(row[0]) === String(questionId) &&
    (row[3] === true || String(row[3]).toLowerCase() === 'true')
  );

  if (!validQuestion) {
    throw new Error('This question is not available for voting.');
  }

  const voterHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    email
  ).map(b => (b + 256).toString(16).slice(-2)).join('');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const voteRows = votesSheet.getDataRange().getValues();

    const alreadyVoted = voteRows.slice(1).some(row =>
      String(row[1]) === voterHash &&
      String(row[2]) === String(questionId)
    );

    if (alreadyVoted) {
      throw new Error('You have already voted for this question.');
    }

    votesSheet.appendRow([new Date(), voterHash, questionId]);

    return {
      success: true,
      message: 'Your vote has been recorded.'
    };
  } finally {
    lock.releaseLock();
  }
}
