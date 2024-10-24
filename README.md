# E-Commerce Project

This project is an E-Commerce application built with a Django backend and a React frontend.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Additional Tips](#additional-tips)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Python** (version 3.11.8)
- **Node.js** (version 20.11.1 )
- **npm** (version 10.5.0)
- **Django** (version 5.0.3 or later)

## Project Structure

```bash
e-commerce/
├── backend/
│ └── electroshop/
│ ├── manage.py
│ ├── ...
├── frontend/
│ ├── package.json
│ ├── ...
└── README.md
```

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yike-cyber/E-commerce.git
   cd e-commerce
   ```

### Setting Up the Virtual Environment

2. **Navigate to the Backend Directory**:
   Open your terminal or command prompt and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
   **Create a Virtual Environment (if not already created):**
   If you haven't done this yet, run the following command to create a new virtual environment named myenv:
   ```bash
     python -m venv myenv
   ```
   **Activate the Virtual Environment:**
   On Windows:
   ```bash
   myenv\Scripts\activate
   ```

On macOS/Linux:

```bash
source myenv/bin/activate
```

After activation, your command prompt should change to indicate that the virtual environment is active (e.g., (myenv)).

**Install Django dependencies (if not already installed):**

```bash
python -m pip install -r electroshop/requirements.txt

```

**To deactivate the env**

```bash
deactivate
```

Running the Django Development Server
To start the development server, run:

```bash
cd electroshop/
```

```bash
python manage.py runserver

```

You can access the application at http://127.0.0.1:8000/.

3.**Set Up the Frontend**
_Navigate to the frontend directory:_

```bash
cd ../frontend/
```

**Install necessary packages:**

```bash
npm install
```

## Running React Application

Start the React Frontend
In a new terminal window, navigate to the frontend directory:

```bash
cd e-commerce/frontend
```

Run the React application:

```bash
npm start
```

This will start the React development server on http://localhost:3000/.
Usage
Open your browser and navigate to http://localhost:3000/ to view the React frontend.
