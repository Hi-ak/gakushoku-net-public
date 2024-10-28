
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS "cafeteria";

ALTER SCHEMA "cafeteria" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

ALTER SCHEMA "public" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."EmailFilterType" AS ENUM (
    'REGEXP',
    'EQUAL',
    'DOMAIN'
);

ALTER TYPE "public"."EmailFilterType" OWNER TO "postgres";

CREATE TYPE "public"."OrderStatus" AS ENUM (
    'ORDERED',
    'COOCKED',
    'RECEIVED'
);

ALTER TYPE "public"."OrderStatus" OWNER TO "postgres";

CREATE TYPE "public"."PaymentTypes" AS ENUM (
    'PAYPAY'
);

ALTER TYPE "public"."PaymentTypes" OWNER TO "postgres";

CREATE TYPE "public"."Role" AS ENUM (
    'ADMIN',
    'USER',
    'DEV'
);

ALTER TYPE "public"."Role" OWNER TO "postgres";

CREATE TYPE "public"."ServiceStatus" AS ENUM (
    'AVAILABLE',
    'SOLD_OUT',
    'UNAVAILABLE'
);

ALTER TYPE "public"."ServiceStatus" OWNER TO "postgres";

CREATE TYPE "public"."TicketStatus" AS ENUM (
    'UNUSED',
    'USED',
    'REFUNDED'
);

ALTER TYPE "public"."TicketStatus" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."Cafeteria" (
    "id" "uuid" NOT NULL,
    "orgHandle" "text" NOT NULL,
    "orgName" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE "public"."Cafeteria" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."Cafeteria_UserEmail" (
    "id" "uuid" NOT NULL,
    "cafeteriaHandle" "text" NOT NULL,
    "emailFilter" "text" NOT NULL,
    "emailFilterType" "public"."EmailFilterType" NOT NULL,
    "role" "public"."Role" NOT NULL
);

ALTER TABLE "public"."Cafeteria_UserEmail" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."CartTicket" (
    "id" "uuid" NOT NULL,
    "userId" "uuid" NOT NULL,
    "menuId" "uuid" NOT NULL,
    "quantity" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "merchantPaymentId" "uuid" NOT NULL
);

ALTER TABLE "public"."CartTicket" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."CartTicketOption" (
    "id" "uuid" NOT NULL,
    "optionId" "uuid" NOT NULL,
    "choiceId" "uuid" NOT NULL,
    "cartTicketId" "uuid" NOT NULL
);

ALTER TABLE "public"."CartTicketOption" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."Menu" (
    "id" "uuid" NOT NULL,
    "cafeteriaId" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "contents" "text"[],
    "price" integer NOT NULL,
    "serviceStatus" "public"."ServiceStatus" NOT NULL,
    "backgroundImageURL" "text" NOT NULL,
    "categoryHandle" "text" NOT NULL,
    "availableQuantity" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "defaultQuantity" integer DEFAULT 0 NOT NULL,
    "isDaily" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."Menu" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."MenuCategory" (
    "id" "uuid" NOT NULL,
    "categoryHandle" "text" NOT NULL,
    "categoryName" "text" NOT NULL,
    "index" integer NOT NULL,
    "cafeteriaId" "uuid" NOT NULL
);

ALTER TABLE "public"."MenuCategory" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."MenuOption" (
    "id" "uuid" NOT NULL,
    "cafeteriaId" "uuid" NOT NULL,
    "optionHandle" "text" NOT NULL,
    "optionName" "text" NOT NULL,
    "priority" integer NOT NULL,
    "choiceNum" integer DEFAULT 1 NOT NULL
);

ALTER TABLE "public"."MenuOption" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."OptionChoice" (
    "id" "uuid" NOT NULL,
    "cafeteriaId" "uuid" NOT NULL,
    "menuOptionHandle" "text" NOT NULL,
    "choiceHandle" "text" NOT NULL,
    "choiceName" "text" NOT NULL,
    "index" integer NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "priceDiff" integer NOT NULL
);

ALTER TABLE "public"."OptionChoice" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."Order" (
    "id" "uuid" NOT NULL,
    "issuerId" "uuid" NOT NULL,
    "orderNum" integer NOT NULL,
    "cafeteriaId" "uuid" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "orderStatus" "public"."OrderStatus" DEFAULT 'ORDERED'::"public"."OrderStatus" NOT NULL
);

ALTER TABLE "public"."Order" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."Receipt" (
    "id" "uuid" NOT NULL,
    "issuerId" "uuid" NOT NULL,
    "userId" "uuid" NOT NULL,
    "totalAmount" integer NOT NULL,
    "totalPrice" integer NOT NULL,
    "paymentType" "public"."PaymentTypes" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "paymentId" "text" NOT NULL
);

ALTER TABLE "public"."Receipt" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."Ticket" (
    "id" "uuid" NOT NULL,
    "holderId" "uuid" NOT NULL,
    "receiptId" "uuid" NOT NULL,
    "orderId" "uuid",
    "menuId" "uuid" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "status" "public"."TicketStatus" DEFAULT 'UNUSED'::"public"."TicketStatus" NOT NULL
);

ALTER TABLE "public"."Ticket" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."TicketOptions" (
    "id" "uuid" NOT NULL,
    "optionId" "uuid" NOT NULL,
    "choiceId" "uuid" NOT NULL,
    "ticketId" "uuid" NOT NULL
);

ALTER TABLE "public"."TicketOptions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."User" (
    "id" "uuid" NOT NULL,
    "cafeteriaId" "uuid",
    "role" "public"."Role" DEFAULT 'USER'::"public"."Role" NOT NULL,
    "email" "text" NOT NULL,
    "name" "text"
);

ALTER TABLE "public"."User" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."_MenuToMenuOption" (
    "A" "uuid" NOT NULL,
    "B" "uuid" NOT NULL
);

ALTER TABLE "public"."_MenuToMenuOption" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) NOT NULL,
    "logs" "text",
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "applied_steps_count" integer DEFAULT 0 NOT NULL
);

ALTER TABLE "public"."_prisma_migrations" OWNER TO "postgres";

ALTER TABLE ONLY "public"."Cafeteria_UserEmail"
    ADD CONSTRAINT "Cafeteria_UserEmail_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Cafeteria"
    ADD CONSTRAINT "Cafeteria_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."CartTicketOption"
    ADD CONSTRAINT "CartTicketOption_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."CartTicket"
    ADD CONSTRAINT "CartTicket_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."MenuCategory"
    ADD CONSTRAINT "MenuCategory_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."MenuOption"
    ADD CONSTRAINT "MenuOption_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Menu"
    ADD CONSTRAINT "Menu_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."OptionChoice"
    ADD CONSTRAINT "OptionChoice_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Receipt"
    ADD CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."TicketOptions"
    ADD CONSTRAINT "TicketOptions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Ticket"
    ADD CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."_prisma_migrations"
    ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "Cafeteria_UserEmail_id_key" ON "public"."Cafeteria_UserEmail" USING "btree" ("id");

CREATE UNIQUE INDEX "Cafeteria_id_key" ON "public"."Cafeteria" USING "btree" ("id");

CREATE UNIQUE INDEX "Cafeteria_orgHandle_key" ON "public"."Cafeteria" USING "btree" ("orgHandle");

CREATE UNIQUE INDEX "CartTicketOption_id_key" ON "public"."CartTicketOption" USING "btree" ("id");

CREATE UNIQUE INDEX "CartTicket_id_key" ON "public"."CartTicket" USING "btree" ("id");

CREATE UNIQUE INDEX "MenuCategory_categoryHandle_cafeteriaId_key" ON "public"."MenuCategory" USING "btree" ("categoryHandle", "cafeteriaId");

CREATE UNIQUE INDEX "MenuCategory_id_key" ON "public"."MenuCategory" USING "btree" ("id");

CREATE UNIQUE INDEX "MenuOption_id_key" ON "public"."MenuOption" USING "btree" ("id");

CREATE UNIQUE INDEX "MenuOption_optionHandle_cafeteriaId_key" ON "public"."MenuOption" USING "btree" ("optionHandle", "cafeteriaId");

CREATE UNIQUE INDEX "Menu_id_key" ON "public"."Menu" USING "btree" ("id");

CREATE UNIQUE INDEX "OptionChoice_choiceHandle_menuOptionHandle_cafeteriaId_key" ON "public"."OptionChoice" USING "btree" ("choiceHandle", "menuOptionHandle", "cafeteriaId");

CREATE UNIQUE INDEX "OptionChoice_id_key" ON "public"."OptionChoice" USING "btree" ("id");

CREATE UNIQUE INDEX "Order_cafeteriaId_orderNum_key" ON "public"."Order" USING "btree" ("cafeteriaId", "orderNum");

CREATE UNIQUE INDEX "Order_id_key" ON "public"."Order" USING "btree" ("id");

CREATE UNIQUE INDEX "Receipt_id_key" ON "public"."Receipt" USING "btree" ("id");

CREATE UNIQUE INDEX "TicketOptions_id_key" ON "public"."TicketOptions" USING "btree" ("id");

CREATE UNIQUE INDEX "Ticket_id_key" ON "public"."Ticket" USING "btree" ("id");

CREATE UNIQUE INDEX "User_email_key" ON "public"."User" USING "btree" ("email");

CREATE UNIQUE INDEX "User_id_key" ON "public"."User" USING "btree" ("id");

CREATE UNIQUE INDEX "_MenuToMenuOption_AB_unique" ON "public"."_MenuToMenuOption" USING "btree" ("A", "B");

CREATE INDEX "_MenuToMenuOption_B_index" ON "public"."_MenuToMenuOption" USING "btree" ("B");

ALTER TABLE ONLY "public"."Cafeteria_UserEmail"
    ADD CONSTRAINT "Cafeteria_UserEmail_cafeteriaHandle_fkey" FOREIGN KEY ("cafeteriaHandle") REFERENCES "public"."Cafeteria"("orgHandle") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."CartTicketOption"
    ADD CONSTRAINT "CartTicketOption_cartTicketId_fkey" FOREIGN KEY ("cartTicketId") REFERENCES "public"."CartTicket"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."CartTicketOption"
    ADD CONSTRAINT "CartTicketOption_choiceId_fkey" FOREIGN KEY ("choiceId") REFERENCES "public"."OptionChoice"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."CartTicketOption"
    ADD CONSTRAINT "CartTicketOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "public"."MenuOption"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."CartTicket"
    ADD CONSTRAINT "CartTicket_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."Menu"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."CartTicket"
    ADD CONSTRAINT "CartTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."MenuCategory"
    ADD CONSTRAINT "MenuCategory_cafeteriaId_fkey" FOREIGN KEY ("cafeteriaId") REFERENCES "public"."Cafeteria"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."MenuOption"
    ADD CONSTRAINT "MenuOption_cafeteriaId_fkey" FOREIGN KEY ("cafeteriaId") REFERENCES "public"."Cafeteria"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."Menu"
    ADD CONSTRAINT "Menu_cafeteriaId_fkey" FOREIGN KEY ("cafeteriaId") REFERENCES "public"."Cafeteria"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."Menu"
    ADD CONSTRAINT "Menu_categoryHandle_cafeteriaId_fkey" FOREIGN KEY ("categoryHandle", "cafeteriaId") REFERENCES "public"."MenuCategory"("categoryHandle", "cafeteriaId") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."OptionChoice"
    ADD CONSTRAINT "OptionChoice_cafeteriaId_fkey" FOREIGN KEY ("cafeteriaId") REFERENCES "public"."Cafeteria"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."OptionChoice"
    ADD CONSTRAINT "OptionChoice_cafeteriaId_menuOptionHandle_fkey" FOREIGN KEY ("cafeteriaId", "menuOptionHandle") REFERENCES "public"."MenuOption"("cafeteriaId", "optionHandle") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."Order"
    ADD CONSTRAINT "Order_cafeteriaId_fkey" FOREIGN KEY ("cafeteriaId") REFERENCES "public"."Cafeteria"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."Order"
    ADD CONSTRAINT "Order_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."Receipt"
    ADD CONSTRAINT "Receipt_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "public"."Cafeteria"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."Receipt"
    ADD CONSTRAINT "Receipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."TicketOptions"
    ADD CONSTRAINT "TicketOptions_choiceId_fkey" FOREIGN KEY ("choiceId") REFERENCES "public"."OptionChoice"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."TicketOptions"
    ADD CONSTRAINT "TicketOptions_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "public"."MenuOption"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."TicketOptions"
    ADD CONSTRAINT "TicketOptions_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."Ticket"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."Ticket"
    ADD CONSTRAINT "Ticket_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."Ticket"
    ADD CONSTRAINT "Ticket_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."Menu"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."Ticket"
    ADD CONSTRAINT "Ticket_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."Ticket"
    ADD CONSTRAINT "Ticket_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "public"."Receipt"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_cafeteriaId_fkey" FOREIGN KEY ("cafeteriaId") REFERENCES "public"."Cafeteria"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."_MenuToMenuOption"
    ADD CONSTRAINT "_MenuToMenuOption_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Menu"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."_MenuToMenuOption"
    ADD CONSTRAINT "_MenuToMenuOption_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."MenuOption"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;

RESET ALL;
