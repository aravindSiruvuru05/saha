# leadraft-server



Adapter Layer (/internal/adapters)
This layer facilitates interaction between the application and the external world (UI, databases, APIs). This can include:
Controllers , repositories , notificaitons, redis calls ,...


Domain Layer (/internal/domain)
This is the core of your application, containing:

Entities: Business objects with lifecycle (e.g., User, Ride, Carpool).

Infrastructure Layer (/infra)
This is where you deal with technical details. It includes:

HTTP Routers: Handle route definitions and mapping to controllers.


dbdiagram.io 

Enum user_role {
  admin
  member
}

Table users as U {
  id uuid [pk]
  name varchar [not null]
  email varchar [not null]
  password varchar [not null]
  photo varchar
  role user_role
  password_changed_at timestamptz [not null, default: `now()`]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table posts as P {
  id uuid [pk]
  user_id uuid [not null,ref: > U.id]
  details varchar
  created_at timestamptz [not null,default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table locations as L {
  id uuid [pk]
  name varchar [not null]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table car_poolings as CP {
  id uuid [pk]
  post_id uuid [not null,ref: > P.id]
  start_location_id uuid [not null,ref: > L.id]
  end_location_id uuid [not null,ref: > L.id]
  start_time timestamptz [not null]
  end_time timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

