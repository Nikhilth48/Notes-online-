from flask import Flask, render_template, request, jsonify
import os
import json

app = Flask(__name__)

NOTES_FILE = 'notes.json'

def read_notes():
    if os.path.exists(NOTES_FILE):
        with open(NOTES_FILE, 'r') as f:
            return json.load(f)
    return []

def save_notes(notes):
    with open(NOTES_FILE, 'w') as f:
        json.dump(notes, f)

@app.route('/')
def index():
    notes = read_notes()
    return render_template('index.html', notes=notes)

@app.route('/add', methods=['POST'])
def add():
    notes = read_notes()
    new_note = request.form['note']
    notes.append(new_note)
    save_notes(notes)
    return jsonify({'status': 'success'}), 200

@app.route('/update/<int:note_id>', methods=['POST'])
def update(note_id):
    notes = read_notes()
    content = request.json.get('content', '')
    if 0 <= note_id < len(notes):
        notes[note_id] = content
        save_notes(notes)
    return jsonify({'status': 'success'})

@app.route('/delete/<int:note_id>', methods=['POST'])
def delete(note_id):
    notes = read_notes()
    if 0 <= note_id < len(notes):
        notes.pop(note_id)
        save_notes(notes)
    return jsonify({'status': 'deleted'})

if __name__ == '__main__':
    app.run(debug=True)
