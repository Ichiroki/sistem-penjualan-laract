CREATE TABLE IF NOT EXISTS "migrations" (
	"id"	integer NOT NULL,
	"migration"	varchar NOT NULL,
	"batch"	integer NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "users" (
	"id"	integer NOT NULL,
	"name"	varchar NOT NULL,
	"email"	varchar NOT NULL,
	"email_verified_at"	datetime,
	"password"	varchar NOT NULL,
	"remember_token"	varchar,
	"created_at"	datetime,
	"updated_at"	datetime,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
	"email"	varchar NOT NULL,
	"token"	varchar NOT NULL,
	"created_at"	datetime,
	PRIMARY KEY("email")
);
CREATE TABLE IF NOT EXISTS "sessions" (
	"id"	varchar NOT NULL,
	"user_id"	integer,
	"ip_address"	varchar,
	"user_agent"	text,
	"payload"	text NOT NULL,
	"last_activity"	integer NOT NULL,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "cache" (
	"key"	varchar NOT NULL,
	"value"	text NOT NULL,
	"expiration"	integer NOT NULL,
	PRIMARY KEY("key")
);
CREATE TABLE IF NOT EXISTS "cache_locks" (
	"key"	varchar NOT NULL,
	"owner"	varchar NOT NULL,
	"expiration"	integer NOT NULL,
	PRIMARY KEY("key")
);
CREATE TABLE IF NOT EXISTS "jobs" (
	"id"	integer NOT NULL,
	"queue"	varchar NOT NULL,
	"payload"	text NOT NULL,
	"attempts"	integer NOT NULL,
	"reserved_at"	integer,
	"available_at"	integer NOT NULL,
	"created_at"	integer NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "job_batches" (
	"id"	varchar NOT NULL,
	"name"	varchar NOT NULL,
	"total_jobs"	integer NOT NULL,
	"pending_jobs"	integer NOT NULL,
	"failed_jobs"	integer NOT NULL,
	"failed_job_ids"	text NOT NULL,
	"options"	text,
	"cancelled_at"	integer,
	"created_at"	integer NOT NULL,
	"finished_at"	integer,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "failed_jobs" (
	"id"	integer NOT NULL,
	"uuid"	varchar NOT NULL,
	"connection"	text NOT NULL,
	"queue"	text NOT NULL,
	"payload"	text NOT NULL,
	"exception"	text NOT NULL,
	"failed_at"	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "products" (
	"code"	varchar NOT NULL,
	"name"	varchar NOT NULL,
	"quantity"	integer NOT NULL,
	"created_at"	datetime,
	"updated_at"	datetime,
	PRIMARY KEY("code")
);
CREATE TABLE IF NOT EXISTS "deliveries" (
	"id"	integer NOT NULL,
	"vehicle_id"	integer NOT NULL,
	"product_code"	varchar NOT NULL,
	"quantity"	integer NOT NULL,
	"target_delivery"	integer NOT NULL,
	"actual_delivery"	integer NOT NULL,
	"percentage"	numeric NOT NULL,
	"created_at"	datetime,
	"updated_at"	datetime,
	FOREIGN KEY("vehicle_id") REFERENCES "vehicles"("id") on update cascade,
	FOREIGN KEY("product_code") REFERENCES "products"("code") on update cascade,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "incomings" (
	"id"	integer NOT NULL,
	"input_date"	datetime NOT NULL,
	"delivery_id"	integer NOT NULL,
	"product_code"	varchar NOT NULL,
	"created_at"	datetime,
	"updated_at"	datetime,
	FOREIGN KEY("delivery_id") REFERENCES "deliveries"("id"),
	FOREIGN KEY("product_code") REFERENCES "products"("code"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "vehicles" (
	"id"	integer NOT NULL,
	"number_plates"	varchar NOT NULL,
	"vehicle_type"	varchar NOT NULL,
	"target"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("target") REFERENCES "deliveries"("id")
);
INSERT INTO "migrations" VALUES (1,'0001_01_01_000000_create_users_table',1);
INSERT INTO "migrations" VALUES (2,'0001_01_01_000001_create_cache_table',1);
INSERT INTO "migrations" VALUES (3,'0001_01_01_000002_create_jobs_table',1);
INSERT INTO "migrations" VALUES (4,'2024_04_02_225904_create_products_table',1);
INSERT INTO "migrations" VALUES (5,'2024_04_03_001010_create_deliveries_table',1);
INSERT INTO "migrations" VALUES (6,'2024_04_03_122549_create_incomings_table',1);
INSERT INTO "migrations" VALUES (7,'2024_04_23_114000_create_vehicles_table',1);
INSERT INTO "users" VALUES (1,'Test User','test@example.com','2024-04-29 12:20:12','$2y$12$vk2IpeZI7ukSZ8/DJoKS/OTOZ36d4yJTucfJunYkdJ7Bhk/wa41GS','kxUJwnCWlz','2024-04-29 12:20:12','2024-04-29 12:20:12');
INSERT INTO "sessions" VALUES ('WBTwHy765QpyeZRIgU6GPYgF8SDhbwi3cTjtwlpj',1,'127.0.0.1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36','YTo1OntzOjY6Il90b2tlbiI7czo0MDoiNU0zVnBUb2o3STY0ZVREMzZ4cmJGWTdlNmhlM0oydU9uUjY3bWxrZiI7czozOiJ1cmwiO2E6MDp7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTY6Imh0dHA6Ly90ZXN0LnRlc3QiO319',1714477130);
INSERT INTO "products" VALUES ('NLE-1001','Botol 220ml',600,'2024-04-29 12:20:12','2024-04-29 12:25:23');
INSERT INTO "products" VALUES ('NLE-1012','Botol 330ml',550,'2024-04-29 12:20:12','2024-04-29 12:24:23');
INSERT INTO "products" VALUES ('NLE-1052','Botol 500ml',1000,'2024-04-29 12:20:12','2024-04-29 12:20:12');
INSERT INTO "products" VALUES ('NLE-1943','Botol 1500ml',1500,'2024-04-29 12:20:12','2024-04-29 12:36:25');
INSERT INTO "products" VALUES ('NLE-4556','Galon 19 L',750,'2024-04-29 12:20:13','2024-04-29 12:24:36');
INSERT INTO "deliveries" VALUES (1,1,'NLE-1943',500,500,300,60,'2024-04-29 12:24:04','2024-04-29 12:24:04');
INSERT INTO "deliveries" VALUES (2,1,'NLE-1001',800,200,150,75,'2024-04-29 12:24:14','2024-04-29 12:24:14');
INSERT INTO "deliveries" VALUES (3,3,'NLE-1012',550,450,200,44.444444444444,'2024-04-29 12:24:23','2024-04-29 12:24:23');
INSERT INTO "deliveries" VALUES (4,3,'NLE-4556',750,250,100,40,'2024-04-29 12:24:36','2024-04-29 12:24:36');
INSERT INTO "deliveries" VALUES (5,3,'NLE-1001',600,200,100,50,'2024-04-29 12:25:23','2024-04-29 12:25:23');
INSERT INTO "deliveries" VALUES (6,3,'NLE-1943',0,500,250,50,'2024-04-29 12:25:32','2024-04-29 12:25:32');
INSERT INTO "vehicles" VALUES (1,'F8601HK','Grandmax',NULL,'2024-04-29 12:20:13','2024-04-29 12:23:52');
INSERT INTO "vehicles" VALUES (2,'F8171HP','Traga',NULL,'2024-04-29 12:20:13','2024-04-29 12:20:13');
INSERT INTO "vehicles" VALUES (3,'F8716HR','Traga',NULL,'2024-04-29 12:20:13','2024-04-29 12:20:13');
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" (
	"email"
);
CREATE INDEX IF NOT EXISTS "sessions_user_id_index" ON "sessions" (
	"user_id"
);
CREATE INDEX IF NOT EXISTS "sessions_last_activity_index" ON "sessions" (
	"last_activity"
);
CREATE INDEX IF NOT EXISTS "jobs_queue_index" ON "jobs" (
	"queue"
);
CREATE UNIQUE INDEX IF NOT EXISTS "failed_jobs_uuid_unique" ON "failed_jobs" (
	"uuid"
);
