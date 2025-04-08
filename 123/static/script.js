let selectedNoteIndex = null;
const editor = document.getElementById('editor');
const notes = document.querySelectorAll('#notes-list li');

function selectNote(index) {
  selectedNoteIndex = index;
  document.querySelectorAll('#notes-list li').forEach((n, i) => {
    n.classList.toggle('active', i === index);
  });

  editor.innerHTML = notes[index].querySelector('span').innerHTML;
  localStorage.setItem('draft', editor.innerHTML);
}

function format(cmd, value = null) {
  document.execCommand(cmd, false, value);
  saveNote();
}

function saveNote() {
  if (selectedNoteIndex !== null) {
    fetch(`/update/${selectedNoteIndex}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editor.innerHTML })
    }).then(res => res.json()).then(data => {
      if (data.status === 'success') {
        document.querySelectorAll('#notes-list li')[selectedNoteIndex].querySelector('span').innerHTML = editor.innerHTML;
      }
    });
  }
  localStorage.setItem('draft', editor.innerHTML);
}

editor.addEventListener('input', saveNote);

function deleteNote(index, event) {
  event.stopPropagation();

  if (confirm('Delete this note?')) {
    fetch(`/delete/${index}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'deleted') location.reload();
      });
  }
}

function addNote(event) {
  event.preventDefault();
  const input = document.getElementById('new-note');
  fetch('/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `note=${encodeURIComponent(input.value)}`
  }).then(() => {
    input.value = '';
    location.reload();
  });
  return false;
}

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') document.body.classList.add('dark');

  const draft = localStorage.getItem('draft');
  if (draft) editor.innerHTML = draft;
});

document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
});
