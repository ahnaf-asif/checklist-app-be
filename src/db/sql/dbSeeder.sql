INSERT INTO users (username, email, password, name) VALUES
    ('user1', 'user1@example.com', 'password1', 'User One'),
    ('user2', 'user2@example.com', 'password2', 'User Two'),
    ('user3', 'user3@example.com', 'password3', 'User Three'),
    ('user4', 'user4@example.com', 'password4', 'User Four'),
    ('user5', 'user5@example.com', 'password5', 'User Five'),
    ('user6', 'user6@example.com', 'password6', 'User Six'),
    ('user7', 'user7@example.com', 'password7', 'User Seven'),
    ('user8', 'user8@example.com', 'password8', 'User Eight'),
    ('user9', 'user9@example.com', 'password9', 'User Nine'),
    ('user10', 'user10@example.com', 'password10', 'User Ten'),
    ('user11', 'user11@example.com', 'password11', 'User Eleven'),
    ('user12', 'user12@example.com', 'password12', 'User Twelve'),
    ('user13', 'user13@example.com', 'password13', 'User Thirteen'),
    ('user14', 'user14@example.com', 'password14', 'User Fourteen'),
    ('user15', 'user15@example.com', 'password15', 'User Fifteen'),
    ('user16', 'user16@example.com', 'password16', 'User Sixteen'),
    ('user17', 'user17@example.com', 'password17', 'User Seventeen'),
    ('user18', 'user18@example.com', 'password18', 'User Eighteen'),
    ('user19', 'user19@example.com', 'password19', 'User Nineteen'),
    ('user20', 'user20@example.com', 'password20', 'User Twenty'),
    ('user21', 'user21@example.com', 'password21', 'User Twenty-One'),
    ('user22', 'user22@example.com', 'password22', 'User Twenty-Two'),
    ('user23', 'user23@example.com', 'password23', 'User Twenty-Three'),
    ('user24', 'user24@example.com', 'password24', 'User Twenty-Four'),
    ('user25', 'user25@example.com', 'password25', 'User Twenty-Five'),
    ('user26', 'user26@example.com', 'password26', 'User Twenty-Six'),
    ('user27', 'user27@example.com', 'password27', 'User Twenty-Seven'),
    ('user28', 'user28@example.com', 'password28', 'User Twenty-Eight'),
    ('user29', 'user29@example.com', 'password29', 'User Twenty-Nine'),
    ('user30', 'user30@example.com', 'password30', 'User Thirty'),
    ('user31', 'user31@example.com', 'password31', 'User Thirty-One'),
    ('user32', 'user32@example.com', 'password32', 'User Thirty-Two'),
    ('user33', 'user33@example.com', 'password33', 'User Thirty-Three'),
    ('user34', 'user34@example.com', 'password34', 'User Thirty-Four'),
    ('user35', 'user35@example.com', 'password35', 'User Thirty-Five'),
    ('user36', 'user36@example.com', 'password36', 'User Thirty-Six'),
    ('user37', 'user37@example.com', 'password37', 'User Thirty-Seven'),
    ('user38', 'user38@example.com', 'password38', 'User Thirty-Eight'),
    ('user39', 'user39@example.com', 'password39', 'User Thirty-Nine'),
    ('user40', 'user40@example.com', 'password40', 'User Forty'),
    ('user41', 'user41@example.com', 'password41', 'User Forty-One'),
    ('user42', 'user42@example.com', 'password42', 'User Forty-Two'),
    ('user43', 'user43@example.com', 'password43', 'User Forty-Three'),
    ('user44', 'user44@example.com', 'password44', 'User Forty-Four'),
    ('user45', 'user45@example.com', 'password45', 'User Forty-Five'),
    ('user46', 'user46@example.com', 'password46', 'User Forty-Six'),
    ('user47', 'user47@example.com', 'password47', 'User Forty-Seven'),
    ('user48', 'user48@example.com', 'password48', 'User Forty-Eight'),
    ('user49', 'user49@example.com', 'password49', 'User Forty-Nine'),
    ('user50', 'user50@example.com', 'password50', 'User Fifty');

INSERT INTO friends (user_id, friend_id) VALUES
    (1, 2), (1, 3), (2, 4), (2, 5), (3, 6), (3, 7), (4, 8), (5, 9), (6, 10), (7, 11),
    (8, 12), (9, 13), (10, 14), (11, 15), (12, 16), (13, 17), (14, 18), (15, 19), (16, 20), (17, 21),
    (18, 22), (19, 23), (20, 24), (21, 25), (22, 26), (23, 27), (24, 28), (25, 29), (26, 30), (27, 31),
    (28, 32), (29, 33), (30, 34), (31, 35), (32, 36), (33, 37), (34, 38), (35, 39), (36, 40), (37, 41),
    (38, 1), (39, 2), (40, 3), (41, 4), (2, 18), (3, 19), (4, 20), (5, 21), (6, 22), (7, 23),
    (8, 24), (9, 25), (10, 26), (11, 27), (12, 28), (13, 29), (14, 30), (15, 31), (16, 32), (17, 33),
    (18, 34), (19, 35), (20, 36), (21, 37), (22, 38), (23, 39), (24, 40), (25, 41);

INSERT INTO groups (name, creator_id, description) VALUES
    ('Group A', 1, 'Description for Group A'),
    ('Group B', 2, 'Description for Group B'),
    ('Group C', 3, 'Description for Group C'),
    ('Group D', 4, 'Description for Group D'),
    ('Group E', 5, 'Description for Group E');

INSERT INTO group_members (group_id, user_id) VALUES
    (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
    (2, 6), (2, 7), (2, 8), (2, 9), (2, 10),
    (3, 11), (3, 12), (3, 13), (3, 14), (3, 15),
    (4, 16), (4, 17), (4, 18), (4, 19), (4, 20),
    (5, 21), (5, 22), (5, 23), (5, 24), (5, 25);

INSERT INTO checklist (name, description, creator_id) VALUES
    ('Checklist A', 'Description for Checklist A', 1),
    ('Checklist B', 'Description for Checklist B', 2),
    ('Checklist C', 'Description for Checklist C', 3),
    ('Checklist D', 'Description for Checklist D', 4),
    ('Checklist E', 'Description for Checklist E', 5);

INSERT INTO checklist_properties (checklist_id, property_name, property_type, display_order) VALUES
    (1, 'Due Date', 'DATE', 1),
    (1, 'Priority', 'TEXT', 2),
    (2, 'Status', 'TEXT', 1),
    (2, 'Assigned To', 'TEXT', 2),
    (3, 'Category', 'TEXT', 1),
    (3, 'Due Date', 'DATE', 2),
    (4, 'Tags', 'TEXT', 1),
    (4, 'Completion', 'NUMBER', 2),
    (5, 'Description', 'TEXT', 1);

INSERT INTO user_checklists (user_id, checklist_id) VALUES
    (1, 1), (2, 1), (3, 1), (4, 1), (5, 1),
    (6, 2), (7, 2), (8, 2), (9, 2), (10, 2),
    (11, 3), (12, 3), (13, 3), (14, 3), (15, 3),
    (16, 4), (17, 4), (18, 4), (19, 4), (20, 4),
    (21, 5), (22, 5), (23, 5), (24, 5), (25, 5);

INSERT INTO categories (name, parent_id) VALUES
     ('Work', NULL),
     ('Home', NULL),
     ('Personal', NULL),
     ('Subcategory A', 1),
     ('Subcategory B', 2);

INSERT INTO items (checklist_id, name, max_steps, category_id) VALUES
    (1, 'Item 1 for Checklist A', 3, 1),
    (1, 'Item 2 for Checklist A', 4, 1),
    (2, 'Item 1 for Checklist B', 5, 2),
    (2, 'Item 2 for Checklist B', 6, 2),
    (3, 'Item 1 for Checklist C', 7, 3),
    (3, 'Item 2 for Checklist C', 8, 3),
    (4, 'Item 1 for Checklist D', 9, 4),
    (4, 'Item 2 for Checklist D', 10, 4),
    (5, 'Item 1 for Checklist E', 11, 5),
    (5, 'Item 2 for Checklist E', 12, 5);

INSERT INTO item_progress (item_id, user_id, completed_steps) VALUES
    (1, 1, 2), (2, 1, 1), (3, 6, 5), (4, 6, 4), (5, 11, 7),
    (6, 11, 6), (7, 16, 9), (8, 16, 8), (9, 21, 11), (10, 21, 10);
