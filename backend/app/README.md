# Translator API

A FastAPI-based translation service that supports multiple languages.

## Prerequisites

- Python 3.7+
- pip (Python package installer)

## Installation

1. Create a virtual environment:

```bash
python -m venv venv
```

2. Activate the virtual environment:

On Windows:
```bash
.\venv\Scripts\activate
```
On macOS and Linux:
```bash
source venv/bin/activate
```

3. Install the dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash
uvicorn app.main:app --reload
```
