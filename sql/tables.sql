CREATE TABLE category (
    id serial primary key,
    category_type text NOT NULL
);

CREATE TABLE expense (
    id serial primary key,
    expense_text text NOT NULL,
    amount numeric not null,
    total numeric not null,
    category_id int not null,
    foreign key (category_id) references category(id)
);

