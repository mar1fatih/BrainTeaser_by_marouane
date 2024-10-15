# BrainTeaser

Inspired by the Arabic TV show Who Wants to Be a Millionaire, this web application is an interactive trivia quiz where users answer multiple-choice questions. Instead of cash prizes, users compete to climb the leaderboard based on their quiz scores. The app provides a dynamic and engaging quiz experience by fetching questions from the Open Trivia API.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Features](#features)
4. [Contributing](#contributing)
5. [License](#license)

## Installation

To install BrainTeaser, follow these steps:

1. Clone the repository:
	```sh
	https://github.com/mar1fatih/BrainTeaser_by_marouane

2. Navigate to the project directory:
	```sh
	cd BrainTeaser_by_marouane

3. Install the dependencies:
	```sh
	pip install -r requirements.txt

4. start all servers in multiple terminals:
	```sh
	redis-server
	sudo mongod --dbpath /var/lib/mongodb
	
5. Start the node server:
	cd auth/
	```sh
	npm run start-server

6. Start the application:
	```sh
	python3 -m web_dynamic.index


You're All Set:
Enjoy using BrainTeaser!

## Usage

Access the Web Application:
Open your browser and go to http://localhost:5000/.

Create an account if you don't have one

Log-in to play

Score more points to climb the leaderboard

## Features

- User authentication and account creation
- Multiple-choice trivia questions
- Scoreboarding system to track user performance
- Dynamic question fetching using Open Trivia API
- Frontend built with HTML, CSS, and jQuery for a responsive user experience
- Backend powered by Node.js for API management and Flask for routing

## Contributing

We welcome contributions to BrainTeaser! To contribute:
1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature-branch
3. Make your changes.
4. Commit your changes:
   ```sh
   git commit -m 'Add new feature'
5. Push to the branch:
   ```sh
   git push origin feature-branch
6. Open a Pull Request.

## License

This project uses the Open Trivia API. Make sure to comply with their terms of service.
Acknowledgments

This project is a solo effort.
