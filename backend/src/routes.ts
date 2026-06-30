import { Router, Request, Response } from 'express';
import db from './db';

const router = Router();

// Aircraft layouts
const aircraftLayouts: Record<string, { rows: number; seats: string[] }> = {
  'ATR': { rows: 18, seats: ['A', 'C', 'D', 'F'] },
  'Airbus 320': { rows: 32, seats: ['A', 'B', 'C', 'D', 'E', 'F'] },
  'Boeing 737 Max': { rows: 32, seats: ['A', 'B', 'C', 'D', 'E', 'F'] }
};

// Check if vouchers exist for given flight and date
router.post('/check', (req: Request, res: Response) => {
  try {
    const { flightNumber, date } = req.body;

    if (!flightNumber || !date) {
      return res.status(400).json({ error: 'Missing flightNumber or date' });
    }

    const stmt = db.prepare(`SELECT 1 FROM vouchers WHERE flight_number = ? AND flight_date = ? LIMIT 1`);
    const exists = stmt.get(flightNumber, date);

    res.json({ exists: !!exists });
  } catch (error) {
    console.error('Check error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Generate vouchers
router.post('/generate', (req: Request, res: Response) => {
  try {
    const { name, id, flightNumber, date, aircraft } = req.body;

    if (!name || !id || !flightNumber || !date || !aircraft) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Double check existence to prevent race conditions
    const checkStmt = db.prepare(`SELECT 1 FROM vouchers WHERE flight_number = ? AND flight_date = ? LIMIT 1`);
    if (checkStmt.get(flightNumber, date)) {
      return res.status(400).json({ error: 'Vouchers already generated for this flight and date' });
    }

    const layout = aircraftLayouts[aircraft];
    if (!layout) {
      return res.status(400).json({ error: 'Invalid aircraft type' });
    }

    // Generate 3 unique random seats
    const seats = new Set<string>();
    while (seats.size < 3) {
      const row = Math.floor(Math.random() * layout.rows) + 1;
      const seatLetter = layout.seats[Math.floor(Math.random() * layout.seats.length)];
      seats.add(`${row}${seatLetter}`);
    }
    const generatedSeats = Array.from(seats);

    // Save to database
    const insertStmt = db.prepare(`
      INSERT INTO vouchers (
        crew_name, crew_id, flight_number, flight_date, aircraft_type,
        seat1, seat2, seat3, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      name, id, flightNumber, date, aircraft,
      generatedSeats[0], generatedSeats[1], generatedSeats[2],
      new Date().toISOString()
    );

    res.json({ success: true, seats: generatedSeats });
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
