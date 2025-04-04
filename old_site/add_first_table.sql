-- Create the database
CREATE DATABASE exhall_curriculum;

-- Use the created database
USE exhall_curriculum;

-- Create the table with an additional 'subject' field
CREATE TABLE subject_overview (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(50),
    Year VARCHAR(60),
    Term VARCHAR(10),
    Area_of_study VARCHAR(2047),
    Literacy_focus VARCHAR(1023),
    Numeracy_focus VARCHAR(1023),
    SMSC VARCHAR(1023)
);

-- Insert data into the table
INSERT INTO subject_overview (subject, Year, Term, Area_of_study, Literacy_focus, Numeracy_focus, SMSC) VALUES
('computing', 'Year 1', 'Autumn 1', 'Technology around us', 'Listening for meaning in non-fiction texts', 'Ordering numbers', 'Impact of technology on society'),
('computing', 'Year 1', 'Autumn 2', 'Digital painting', 'Describing images', 'Shapes', 'Expressing emotions and feelings'),
('computing', 'Year 1', 'Spring 1', 'Moving a robot', 'Instructions', 'Small numbers', 'Using technology responsibly'),
('computing', 'Year 1', 'Spring 2', 'Grouping data', 'Explaining thoughts', 'Grouping by criteria', 'Sharing information with others in a constructive way'),
('computing', 'Year 1', 'Summer 1', 'Digital writing', 'Writing simple words', 'Counting', 'Communication with others'),
('computing', 'Year 1', 'Summer 2', 'Programming animations', 'Sequencing', 'Logic', 'Representing diversity in animations'),
('computing', 'Year 2', 'Autumn 1', 'Information technology around us', 'Listening for meaning in non-fiction texts', 'Ordering numbers', 'Digital divide'),
('computing', 'Year 2', 'Autumn 2', 'Digital photography', 'Describing images', 'Shapes', 'Personal choices'),
('computing', 'Year 2', 'Spring 1', 'Robot algorithms', 'Describing and explaining concepts', 'Sequencing', 'Using technology responsibly'),
('computing', 'Year 2', 'Spring 2', 'Pictograms', 'Writing explanation texts', 'Graphs and charts', 'Sharing information with others in a constructive way'),
('computing', 'Year 2', 'Summer 1', 'Making music', 'Creating sequences', 'Time calculations', 'Using art to communicate emotions'),
('computing', 'Year 2', 'Summer 2', 'Programming quizzes', 'Writing questions and answers', 'Logic', 'Making games accessible to all'),
('computing', 'Year 3', 'Autumn 1', 'Connecting computers', 'Listening for meaning in non-fiction texts. Explaining ideas', 'Ordering numbers', 'Communicating safely'),
('computing', 'Year 3', 'Autumn 2', 'Stop-frame animation', 'Creating and following a storyboard. Using direct speech', 'Time calculations', 'Representing diversity in animations'),
('computing', 'Year 3', 'Spring 1', 'Sequencing sounds', 'Creating sequences', 'Time calculations', 'Using art to communicate emotions'),
('computing', 'Year 3', 'Spring 2', 'Branching databases', 'Writing explanation texts', 'Graphs and charts', 'Sharing information with others in a constructive way'),
('computing', 'Year 3', 'Summer 1', 'Desktop publishing', 'Creating non-fiction texts to clearly communicate a message', 'Measurements', 'Responsibility to represent data accurately'),
('computing', 'Year 3', 'Summer 2', 'Events and actions in programs', 'Describing and explaining concepts. Sequencing', 'Logic and adding', 'Using technology to communicate a message honestly'),
('computing', 'Year 4', 'Autumn 1', 'The Internet', 'Reading for meaning, non-fiction texts', 'Understanding large numbers', 'Safe communication and respecting differences'),
('computing', 'Year 4', 'Autumn 2', 'Audio editing', 'Creating and reading scripts', 'Time calculations', 'Respectfully expressing emotions in art'),
('computing', 'Year 4', 'Spring 1', 'Repetition in shapes', 'Describing pictures', 'Shapes and angles', 'Understand the impact algorithms can have'),
('computing', 'Year 4', 'Spring 2', 'Data logging', 'Writing explanation texts', 'Graphs and charts', 'Respecting privacy when collecting data'),
('computing', 'Year 4', 'Summer 1', 'Photo editing', 'Reading and understanding instructions', 'x and y co-ordinates', 'Responsibility to represent data accurately'),
('computing', 'Year 4', 'Summer 2', 'Repetition in games', 'Describing and explaining concepts', 'Logic and adding', 'Respecting other''s ownership of work'),
('computing', 'Year 5', 'Autumn 1', 'Sharing information', 'Reading for meaning, non-fiction texts', 'Understanding large numbers', 'Safe communication and respecting differences'),
('computing', 'Year 5', 'Autumn 2', 'Video editing', 'Creating and reading scripts', 'Time calculations', 'Communicating respectfully'),
('computing', 'Year 5', 'Spring 1', 'Selection in physical computing', 'Describing and explaining concepts', 'Logic and adding', 'Respecting other''s ownership of work'),
('computing', 'Year 5', 'Spring 2', 'Flat-file databases', 'Exploring non-fiction texts', 'Types of numbers', 'Understand the impact that algorithms can have'),
('computing', 'Year 5', 'Summer 1', 'Vector drawing', 'Reading and understanding instructions', 'x and y co-ordinates', 'Respecting privacy when collecting data'),
('computing', 'Year 5', 'Summer 2', 'Selection in quizzes', 'Writing questions and answers', 'Logic', 'Responsibility to represent data accurately'),
('computing', 'Year 6', 'Autumn 1', 'Internet communication', 'Reading for meaning, non-fiction texts', 'Understanding large numbers', 'Safe communication and respecting differences opinions'),
('computing', 'Year 6', 'Autumn 2', 'Webpage creation', 'Writing for meaning, non-fiction texts', 'Understanding large numbers', 'Communicating respectfully'),
('computing', 'Year 6', 'Spring 1', 'Variables in games', 'Describing and explaining concepts', 'Logic and arithmetic', 'Safe communication and respecting differences opinions'),
('computing', 'Year 6', 'Spring 2', 'Introduction to spreadsheets', 'Exploring non-fiction texts', 'Types of numbers', 'Communicating respectfully'),
('computing', 'Year 6', 'Summer 1', '3D modelling', 'Reading and understanding instructions', 'Charts and graphs', 'Understand the need for accessibility in games'),
('computing', 'Year 6', 'Summer 2', 'Sensing', 'Describing and explaining concepts', 'Logic and adding', 'Respecting privacy when collecting data'),
('computing', 'Year 7', 'Autumn 1', 'Impact of technology – Collaborating online respectfully', 'Persuasive texts, precise writing, non fiction writing, writing for meaning', 'Statistics and presenting data', 'Online bullying- Online relationships- Privacy and security'),
('computing', 'Year 7', 'Autumn 2', 'Using computers to present information to a specific audience', 'Communion skills', 'Number bases', 'Privacy and security'),
('computing', 'Year 7', 'Spring 1', 'Networks from semaphores to the Internet', 'Persuasive texts, reading for meaning', 'Shapes and proportions', 'Copyright and ownership- Managing online information'),
('computing', 'Year 7', 'Spring 2', 'Protocols and hardware Wired and wireless networks', 'Precise writing and writing instructions', 'Logic and operations', 'The affect that computer programs can have on individuals'),
('computing', 'Year 7', 'Summer 1', 'Using media – Gaining support for a cause', 'Precise writing and writing instructions Editing', 'Logic and operations', 'The affect that computer programs can have on individuals'),
('computing', 'Year 7', 'Summer 2', 'Using appropriate software Copyright Using computers for research', 'Reading for meaning and exploring the author''s intention', 'Data and statistics', 'Taking responsibility for data'),
('computing', 'Year 8', 'Autumn 1', 'Developing for the web', 'Non-fiction texts, reading for meaning and following instructions', 'Shapes and positions', 'Access to the internet for others'),
('computing', 'Year 8', 'Autumn 2', 'How to construct a web page How to use the WWW effectively', 'Reading and writing non-fiction texts', 'Number bases', 'ASCII and limited character sets (English only)'),
('computing', 'Year 8', 'Spring 1', 'Representations – from clay to silicon Binary and data representation Storage on computers', 'Writing instructional texts Creating texts for a defined audience', 'Shapes and position', 'How apps can gather data and affect users actions'),
('computing', 'Year 8', 'Spring 2', 'Mobile app development Defining apps Designing and implementing an app', 'Writing and interpreting instructions', 'Shapes and position', 'How different media can be used to change opinions'),
('computing', 'Year 8', 'Summer 1', 'Media – Vector graphics Defining vector graphics Creating and editing vector graphics', 'Non-fiction texts Reading for meaning', 'Logic and mathematical operations', 'Environmental impact of computers'),
('computing', 'Year 8', 'Summer 2', 'Computing systems Parts of a computer system Logic in computer systems Sharing data between computers', 'Precise instructions and structure of texts', 'Logic and mathematical operations', 'The effect that programs have on people'),
('computing', 'Year 9', 'Autumn 1', 'Python programming with sequences of data Sequencing, variables, selection and loops', 'Precise instructions and structure of texts', 'Logic and mathematical operations', 'The effect that programs have on people'),
('computing', 'Year 9', 'Autumn 2', 'Media – Animations Types of animation Models and colours Lights and cameras', 'Writing and interpreting instructions Structure of narrative stories', 'Shapes and position', 'How different media can be used to change opinions and is influenced by cultural background'),
('computing', 'Year 9', 'Spring 1', 'Data science Defining data and big data Statistics and computers Legal data protection', 'Reading for meaning and exploring the author''s intention', 'Data and statistics', 'Taking responsibility for data'),
('computing', 'Year 9', 'Spring 2', 'Representations – going audio-visual Digital representation of images and audio Mixing media', 'Writing and interpreting instructions', 'Shapes and position and time', 'How different media can be used to change opinions and is influenced by cultural background'),
('computing', 'Year 9', 'Summer 1', 'Cybersecurity Ethical data protection Types of cyber attacks Network vulnerabilities', 'Reading for meaning Persuasive texts', 'Graph theory and number bases', 'Managing online information- Privacy and security'),
('computing', 'Year 9', 'Summer 2', 'Physical computing Planning physical computing devices Connecting electrical components Programming external components', 'Writing and following instructions Recording actions Writing clearly', 'Logic and mathematical operations', 'Use of computing devices in society – privacy, availability and biases'),
('computing', 'Year 10', 'Autumn 1', 'Algorithms part 1 Computational thinking Representing algorithms Tracing algorithms', 'Accurate written language', 'Mathematical operations', 'Impact of algorithms on society'),
('computing', 'Year 10', 'Autumn 2', 'Algorithms part 2 Searches Sorts Implementing algorithms', 'Accurate written language', 'Mathematical operations', 'Impact of algorithms on society'),
('computing', 'Year 10', 'Spring 1', 'Computer Systems 1 How a CPU works Computer storage', 'Reading for information', 'Logic', 'History of computer system design'),
('computing', 'Year 10', 'Spring 2', 'Computer systems 2 Computer systems Use of logic Assembly language', 'Reading for information', 'Logic', 'Character sets and lack of space for other languages'),
('computing', 'Year 10', 'Summer 1', 'Data representation Using different number bases Representing text Representing images and sound', 'Writing as symbols', 'Number systems and mathematical operations', 'Storing data on computers'),
('computing', 'Year 10', 'Summer 2', 'Programming Part 1 IDEs Variables, input and output Expressions, selection and logic', 'Accurate writing', 'Mathematical operations and logic', 'Unseen impacts on programs'),
('computing', 'Year 11', 'Autumn 1', 'Programming Part 2 Loops and data validation Subroutines, functions and structure Strings, arrays and files', 'Accurate writing', 'Mathematical operations and logic', 'Unseen impacts on programs'),
('computing', 'Year 11', 'Autumn 2', 'Cyber Security Types of cybercrime Designing defences Implementing solutions', 'Reading for meaning networks', 'Writing concisely', 'Criminal behaviour'),
('computing', 'Year 11', 'Spring 1', 'Databases Types of database Where are databases SQL', 'Persuasive texts', 'Large numbers statistics', 'Storing personal data'),
('computing', 'Year 11', 'Spring 2', 'Networks Types of networks Network protocols Internet and WWW', 'Accurate writing', 'Mathematical operations and logic', 'Use of networks'),
('computing', 'Year 11', 'Summer 1', 'Impacts of Technology The law and technology Cultural and environmental impacts Ethics of technology', 'Persuasive texts', 'Large numbers statistics', 'Impacts of technology and related ethics'),
('computing', 'Year 11', 'Summer 2', 'Review of course through programming activities Physical computing using previous areas of study', 'Accurate writing', 'Mathematical operations and logic', 'Unseen impacts on programs'),
('computing', 'Post 16', 'Autumn 1', 'Understanding cyber security', 'Accurate written language', 'Mathematical operations and logic', 'Impact of cyber attacks on society'),
('computing', 'Post 16', 'Autumn 2', 'Assessing different methods to keep computers safe from cyber-attacks', 'Accurate written language', 'Mathematical operations and logic', 'Impact of cyber attacks on society'),
('computing', 'Post 16', 'Spring 1', 'Practical ways to keep computers safe from cyber-criminals', 'Reading for information', 'Logic', 'The importance to society of preventing cyber attacks'),
('computing', 'Post 16', 'Spring 2', 'Practical ways to keep humans safe from cyber-criminals', 'Reading for information', 'Logic', 'The importance of people being safeguarded'),
('computing', 'Post 16', 'Summer 1', 'Understand the legal aspects for online business to keep data safe from cyber-criminals GDPR', 'Writing as symbols', 'Number systems and mathematical operations', 'Storing data on computers and the GDPR legal aspects'),
('computing', 'Post 16', 'Summer 2', 'Understand the legal aspects for online business to keep data safe from cyber-criminals Other laws', 'Accurate writing', 'Mathematical operations and logic', 'Understanding the legal responsibilities of businesses');

