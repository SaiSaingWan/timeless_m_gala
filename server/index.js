const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory student ticket storage (Mock DB for local development)
const tickets = [];

// Register / Buy Ticket Route
app.post('/api/tickets/buy', (req, res) => {
  const { fullName, studentId, email, phone, passcode } = req.body;

  if (!fullName || !studentId || !email || !phone || !passcode) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Check if student already registered
  const existing = tickets.find((t) => t.studentId === studentId);
  if (existing) {
    return res.status(400).json({ error: 'A ticket has already been registered for this Student ID.' });
  }

  const newTicket = {
    fullName,
    studentId,
    email,
    phone,
    passcode,
    status: 'PAID',
    amount: '89 THB',
    createdAt: new Date().toISOString()
  };

  tickets.push(newTicket);
  res.status(201).json({ message: 'Ticket registered successfully!', ticket: newTicket });
});

// Login Route
app.post('/api/auth/login', (req, res) => {
  const { studentId, passcode } = req.body;

  const ticket = tickets.find((t) => t.studentId === studentId && t.passcode === passcode);

  if (!ticket) {
    return res.status(401).json({ error: 'Invalid Student ID or 6-digit passcode. Make sure you bought a ticket first!' });
  }

  res.json({ message: 'Login successful', student: { studentId: ticket.studentId, fullName: ticket.fullName } });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));