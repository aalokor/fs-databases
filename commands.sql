CREATE TABLE blogs (
    id SERIAL PRIMARY KEY, 
    author text, 
    url text NOT NULL, 
    title text NOT NULL, 
    likes integer DEFAULT 0
);

INSERT INTO blogs (author, url, title) 
VALUES ('Aatu Admin', 'http://adminblogi.fi', 'Adminblogi');

INSERT INTO blogs (author, url, title) 
VALUES ('Maija Matkaaja', 'http://matkalla.fi', 'Matkalla');

