--- write the schema related stuff here
CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   username VARCHAR(50) NOT NULL UNIQUE,
   email VARCHAR(100) NOT NULL UNIQUE,
   password VARCHAR(255) NOT NULL,
   name VARCHAR(100) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friends(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friend_id) REFERENCES users(id)
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creator_id INT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id),
    description TEXT
);

CREATE TABLE group_members (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE checklist(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creator_id INT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
);

CREATE TABLE checklist_properties(
    id SERIAL PRIMARY KEY,
    checklist_id INT NOT NULL,
    property_name VARCHAR(50) NOT NULL,
    property_type TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (checklist_id) REFERENCES checklist(id),
    display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE user_checklists(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    checklist_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (checklist_id) REFERENCES checklist(id)
);

CREATE TABLE categories(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parent_id INT DEFAULT NULL,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

CREATE TABLE items(
    id SERIAL PRIMARY KEY,
    checklist_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    max_steps INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (checklist_id) REFERENCES checklist(id),
    category_id INT DEFAULT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE item_progress(
    id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    user_id INT NOT NULL,
    completed_steps INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


