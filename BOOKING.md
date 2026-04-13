# Booking Concept

User sends booking request with date range and number of rooms with number of people per room.

```http request
/avaiability/search
```

```json lines
{
  from: Date,
  to: Date,
  rooms: [
    { people: 2 },
    { people: 1 }
  ]
}
```

Backend queries blocked rooms for that date range:
```sql
SELECT br.room_id
FROM booking_rooms br
JOIN bookings b ON b.id = br.booking_id
WHERE b.status IN ('pending', 'confirmed', 'checked-in')
AND NOT (b.to <= :from OR b.from >= :to)
```

And queries all active holds (rooms that are currently on hold of a booking)
```sql
SELECT room_id
FROM room_holds
WHERE expires_at > NOW()
AND NOT (to <= :from OR from >= :to)
```

Using the returned tables it queries for the available rooms:

```sql
SELECT *
FROM rooms
WHERE id NOT IN (blocked_booking_ids + blocked_hold_ids)
```

And returns a response like this:

```typescript
type availableRoomsResponse = {
  sessionId: "abc123",
  roomOptions: [
    {
      requestIndex: 0,
      people: 2,
      rooms: Room[]
    },
    {
      requestIndex: 1,
      people: 1,
      rooms: Room[],
    }
  ]
}
```

Type for storing a booked room in db. A Booking itself should not have the room data

```typescript
type BookingRoom = {
  bookingId: string
  roomId: string
  adults: number
  children: number
}
```

A temporary storing of selected rooms to avoid concurrency issues. Object is created on selecting an available room type. 
If at this time, the room type is not available anymore (because of concurrency), user should be informed and availability check should be refetched.

```
room_holds {
  id: string (PK)
  room_id: string (FK)

  from: timestamp
  to: timestamp

  session_id: string
  expires_at: timestamp

  created_at: timestamp
}
```

(option) Complete session to store in the db for the whole booking

```
booking_sessions {
  id: string (PK)

  from: timestamp
  to: timestamp

  requested_rooms: jsonb   // [{ people: 2 }, { people: 1 }]
  expires_at: timestamp

  created_at: timestamp
}
```

Booking should have no sub object for room but instead be linked to it through BookingRoom.
```
bookings {
  id: string (PK)
  from: timestamp
  to: timestamp
  people: number

  first_name: string
  last_name: string
  email: string
  phone: string | null
  message: string | null

  status: enum
  created_at: timestamp
}
```

On confirmation of a booking:
1. RoomHolds (and BookingSession) should be checked for Expiration.
2. A new booking should be created
3. BookingRooms should be created for all booked rooms
4. Created RoomHolds should be removed
5. The confirmation email should be send

On Mocking this for development:
1. Created MOCK_BOOKING_ROOMS to make rooms unavailable as they are tied to existing bookings
2. On enter create a MOCK_BOOKING_SESSION. Start a timer and navigate away when the timer runs out.
3. On hitting the availability/search endpoint query MOCK_ROOMS for any that are not in MOCK_BOOKING_ROOMS at the requested date range and that also match the requested capacity.
4. On room selection, just store in session storage and hit some endpoint for a mocked Room Holds creation
5. On confirmation hit an endpoint and print the request to console