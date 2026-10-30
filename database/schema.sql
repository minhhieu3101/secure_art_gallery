--
-- PostgreSQL database dump
--

\restrict wYBuTxXan98Y6VH97dDG6q6JtuW4gafbseDF83QD1yKZUxVTOdac78cf79FuePm

-- Dumped from database version 16.15 (Debian 16.15-1.pgdg13+2)
-- Dumped by pg_dump version 16.15 (Debian 16.15-1.pgdg13+2)

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

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: gallery_event_event_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.gallery_event_event_type_enum AS ENUM (
    'ENTER_GALLERY',
    'LEAVE_GALLERY',
    'ENTER_ROOM',
    'LEAVE_ROOM'
);


--
-- Name: room_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.room_status_enum AS ENUM (
    'open',
    'closed'
);


--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role_enum AS ENUM (
    'Admin',
    'Employee',
    'User'
);


--
-- Name: user_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_status_enum AS ENUM (
    'active',
    'inactive',
    'deleted'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    audit_id text NOT NULL,
    user_id text NOT NULL,
    action text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: gallery_event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gallery_event (
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    event_type public.gallery_event_event_type_enum NOT NULL,
    user_id uuid NOT NULL,
    "roomId" uuid,
    "recordedById" uuid NOT NULL
);


--
-- Name: room; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.room (
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    number integer NOT NULL,
    occupancy integer NOT NULL,
    people integer DEFAULT 0 NOT NULL,
    status public.room_status_enum DEFAULT 'open'::public.room_status_enum NOT NULL
);


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "refreshToken" character varying NOT NULL,
    expired_at timestamp without time zone NOT NULL,
    revoked_at timestamp without time zone,
    "fkUserId" uuid
);


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    email character varying NOT NULL,
    "activeCode" character varying(4) DEFAULT ''::character varying NOT NULL,
    role public.user_role_enum DEFAULT 'User'::public.user_role_enum NOT NULL,
    status public.user_status_enum DEFAULT 'inactive'::public.user_status_enum NOT NULL
);


--
-- Name: gallery_event PK_1078e78807d54efa1f5fe1626d9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_event
    ADD CONSTRAINT "PK_1078e78807d54efa1f5fe1626d9" PRIMARY KEY (id);


--
-- Name: room PK_c6d46db005d623e691b2fbcba23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: session PK_f55da76ac1c3ac420f444d2ff11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (audit_id);


--
-- Name: gallery_event FK_000120727fc6721c9af762af1d6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_event
    ADD CONSTRAINT "FK_000120727fc6721c9af762af1d6" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE RESTRICT;


--
-- Name: session FK_1083d90c42eaecc65fe229373ec; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "FK_1083d90c42eaecc65fe229373ec" FOREIGN KEY ("fkUserId") REFERENCES public."user"(id);


--
-- Name: gallery_event FK_a0314daffed75f5eae29d5aedde; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_event
    ADD CONSTRAINT "FK_a0314daffed75f5eae29d5aedde" FOREIGN KEY ("roomId") REFERENCES public.room(id) ON DELETE RESTRICT;


--
-- Name: gallery_event FK_df0d77788f7f4f6295a537695c6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_event
    ADD CONSTRAINT "FK_df0d77788f7f4f6295a537695c6" FOREIGN KEY ("recordedById") REFERENCES public."user"(id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict wYBuTxXan98Y6VH97dDG6q6JtuW4gafbseDF83QD1yKZUxVTOdac78cf79FuePm

