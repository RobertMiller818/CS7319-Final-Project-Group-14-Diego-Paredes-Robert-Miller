BEGIN TRANSACTION;

DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS sources;

CREATE TABLE topics (
    topic_id serial PRIMARY KEY, -- Topic ID
    topic_name varchar(100) NOT NULL, --  Topic Name
    source1_id integer NOT NULL,   -- Source 1 ID
    source2_id integer,
    source3_id integer
);

CREATE TABLE sources (
    source_id serial PRIMARY KEY,
    source_name varchar(100) NOT NULL,
    source_url varchar(256) NOT NULL,
    summary varchar(5000),
    credibility_score integer
);

COMMIT TRANSACTION;