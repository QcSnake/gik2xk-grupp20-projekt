# Snabbis E-handelsplattform

En modern e-handelsplattform som uppfyller följande tekniska krav:

- MySQL-databas
- Node.js/Express backend
- Sequelize ORM
- React frontend med Material UI
- Fokus på användbarhet och design

## Funktioner

### För kunder
- Bläddra bland produkter
- Se detaljvyer för produkter med information och recensioner
- Betygsätta produkter
- Hantera kundvagn med flera produkter

### För administratörer
- Hantera produkter (skapa, redigera, ta bort)
- Se beställningar

## Installation

1. Klona projektet
2. Installera beroenden:
   ```
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Konfigurera databasen i `backend/config/config.json`
4. Starta backend: `cd backend && npm start`
5. Starta frontend: `cd frontend && npm start`

## Användning

- Frontend körs på http://localhost:3000
- Backend körs på http://localhost:5000

### Testanvändare
- Admin: admin@example.com / Admin123
- Kund: customer@example.com / Customer123

