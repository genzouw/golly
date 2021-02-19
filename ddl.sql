DROP TABLE IF EXISTS questionnaires;
CREATE TABLE questionnaires (
  id int not null auto_increment primary key,
  question text not null,
  qcode text not null
);

DROP TABLE IF EXISTS choices;
CREATE TABLE choices (
  id int not null auto_increment primary key,
  questionnaire_id int not null,
  choice text not null,
  selected_number int not null default 0
);
