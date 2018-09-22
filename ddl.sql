DROP TABLE IF EXISTS questionnaires;
CREATE TABLE questionnaires (
  id integer primary key autoincrement,
  question text not null
);

DROP TABLE IF EXISTS choices;
CREATE TABLE choices (
  id integer primary key autoincrement,
  questionnaire_id integer not null,
  choice text not null,
  selected_number integer not null default 0
);
