create database project_database;
use project_database;

create table users (
    id int primary key auto_increment,
    name varchar(50) not null,
    email varchar(50) unique not null,
    password varchar(50) not null,
    age int null
);

create table workouts (
	id int primary key auto_increment,
    date date null,
    user_id int,
    foreign key (user_id) references users(id) on delete cascade
);

create table exercises (
	id int primary key auto_increment,
    name varchar(30) not null,
	sets int null,
    workout_id int,
    foreign key (workout_id) references workout(id) on delete cascade
);

create table sets (
	id int primary key auto_increment,
    set_info varchar(50),
    exercise_id	 int,
    foreign key (exercise_id) references exercises(id) on delete cascade
);
