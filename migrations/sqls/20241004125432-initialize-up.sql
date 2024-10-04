/* Replace with your SQL commands */
-- Database: saas

-- DROP DATABASE IF EXISTS saas;

CREATE DATABASE saas
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE user_profiles_gender_enum AS ENUM ('male', 'female', 'other');
CREATE TYPE user_profiles_profile_type_enum AS ENUM ('personal', 'professional');
CREATE TYPE user_profiles_learning_pace_enum AS ENUM ('slow', 'medium', 'fast');
CREATE TYPE user_socials_type_enum AS ENUM ('facebook', 'google', 'twitter', 'linkedin');
-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    email character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default",
    email_verified timestamp without time zone,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    role character varying COLLATE pg_catalog."default" NOT NULL DEFAULT 'user'::character varying,
    status character varying COLLATE pg_catalog."default" NOT NULL DEFAULT 'pending'::character varying,
    name character varying COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    username character varying COLLATE pg_catalog."default" NOT NULL,
    diamonds integer NOT NULL DEFAULT 0,
    CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id),
    CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email),
    CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

-- Table: public.files

-- DROP TABLE IF EXISTS public.files;

CREATE TABLE IF NOT EXISTS public.files
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    path character varying COLLATE pg_catalog."default" NOT NULL,
    mimetype character varying COLLATE pg_catalog."default" NOT NULL,
    size integer NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY (id),
    CONSTRAINT "UQ_332d10755187ac3c580e21fbc02" UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.files
    OWNER to postgres;
-- Index: IDX_332d10755187ac3c580e21fbc0

-- DROP INDEX IF EXISTS public."IDX_332d10755187ac3c580e21fbc0";

CREATE INDEX IF NOT EXISTS "IDX_332d10755187ac3c580e21fbc0"
    ON public.files USING btree
    (name COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: public.users_friends

-- DROP TABLE IF EXISTS public.users_friends;

CREATE TABLE IF NOT EXISTS public.users_friends
(
    user_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    friend_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    initiator_id uuid NOT NULL,
    confirmed boolean NOT NULL DEFAULT false,
    CONSTRAINT "PK_160752e50a8572eafe1100a3c25" PRIMARY KEY (user_id, friend_id),
    CONSTRAINT "FK_3433a322621967fe462ae9e6a3a" FOREIGN KEY (initiator_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "FK_da2a42ba5b9efdff96e51933580" FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "FK_e34138e1a57cc876f9f0cf0f5a2" FOREIGN KEY (friend_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users_friends
    OWNER to postgres;

-- Table: public.soft_skills

-- DROP TABLE IF EXISTS public.soft_skills;

CREATE TABLE IF NOT EXISTS public.soft_skills
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "PK_88c886b3eaaece0553df719bae1" PRIMARY KEY (id),
    CONSTRAINT "UQ_3c913a9929456dcb626cf46f0a1" UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.soft_skills
    OWNER to postgres;

-- Table: public.users_soft_skills

-- DROP TABLE IF EXISTS public.users_soft_skills;

CREATE TABLE IF NOT EXISTS public.users_soft_skills
(
    user_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    soft_skill_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    CONSTRAINT "PK_80e8c793d037108daba229ab015" PRIMARY KEY (user_id, soft_skill_id),
    CONSTRAINT "FK_52979b8024d9bdb1b8fcf9a0e28" FOREIGN KEY (soft_skill_id)
        REFERENCES public.soft_skills (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "FK_ef0549e4f36cde32a8d8f12a528" FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users_soft_skills
    OWNER to postgres;

-- Table: public.users_verification_tokens

-- DROP TABLE IF EXISTS public.users_verification_tokens;

CREATE TABLE IF NOT EXISTS public.users_verification_tokens
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    type character varying COLLATE pg_catalog."default" NOT NULL,
    submitted_at timestamp without time zone NOT NULL DEFAULT now(),
    token character varying COLLATE pg_catalog."default",
    expire_at timestamp without time zone DEFAULT now(),
    user_id uuid NOT NULL,
    CONSTRAINT "PK_89e8a37ed0f9e05b477bca81e71" PRIMARY KEY (id),
    CONSTRAINT "FK_51ed3e55a36e8100aac43e8383f" FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users_verification_tokens
    OWNER to postgres;
-- Index: IDX_488c35bac4fae1d53ac47eb68b

-- DROP INDEX IF EXISTS public."IDX_488c35bac4fae1d53ac47eb68b";

CREATE UNIQUE INDEX IF NOT EXISTS "IDX_488c35bac4fae1d53ac47eb68b"
    ON public.users_verification_tokens USING btree
    (user_id ASC NULLS LAST, type COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: public.user_socials

-- DROP TABLE IF EXISTS public.user_socials;

CREATE TABLE IF NOT EXISTS public.user_socials
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    social_id character varying COLLATE pg_catalog."default" NOT NULL,
    type user_socials_type_enum NOT NULL,
    user_id uuid NOT NULL,
    CONSTRAINT "PK_b83c619b4b264f307240eb419ec" PRIMARY KEY (id),
    CONSTRAINT "UQ_2632a167a414578b3bd0c2c543a" UNIQUE (social_id),
    CONSTRAINT "FK_5c54c2fb2b23d26200fe67514bd" FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_socials
    OWNER to postgres;

-- Table: public.user_progress

-- DROP TABLE IF EXISTS public.user_progress;

CREATE TABLE IF NOT EXISTS public.user_progress
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    level integer NOT NULL DEFAULT 1,
    experience integer NOT NULL DEFAULT 1000,
    user_id uuid NOT NULL,
    rubies integer NOT NULL DEFAULT 0,
    exp integer NOT NULL DEFAULT 0,
    energy integer NOT NULL DEFAULT 0,
    powers json DEFAULT '{}'::json,
    status integer NOT NULL DEFAULT 1,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT "PK_7b5eb2436efb0051fdf05cbe839" PRIMARY KEY (id),
    CONSTRAINT "REL_c41601eeb8415a9eb15c8a4e55" UNIQUE (user_id),
    CONSTRAINT "FK_c41601eeb8415a9eb15c8a4e557" FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_progress
    OWNER to postgres;

-- Table: public.user_profiles

-- DROP TABLE IF EXISTS public.user_profiles;

CREATE TABLE IF NOT EXISTS public.user_profiles
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    age integer,
    gender user_profiles_gender_enum,
    profile_type user_profiles_profile_type_enum,
    learning_pace user_profiles_learning_pace_enum,
    file_id uuid,
    user_id uuid NOT NULL,
    phone_number character varying COLLATE pg_catalog."default",
    profile_level integer NOT NULL DEFAULT 1,
    rubies integer NOT NULL DEFAULT 0,
    exp integer NOT NULL DEFAULT 0,
    energy integer NOT NULL DEFAULT 0,
    experience integer NOT NULL DEFAULT 1000,
    deleted smallint NOT NULL DEFAULT '0'::smallint,
    status smallint NOT NULL DEFAULT '1'::smallint,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    tickets integer NOT NULL DEFAULT 0,
    powers json DEFAULT '[]'::json,
    streak_saver integer NOT NULL DEFAULT 0,
    elite_status smallint NOT NULL DEFAULT '0'::smallint,
    elite_subscription_id character varying COLLATE pg_catalog."default",
    chest_boxes json DEFAULT '{"rare":0,"epic":0,"legendary":0}'::json,
    spent_in timestamp without time zone,
    energy_backup integer NOT NULL DEFAULT 0,
    CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY (id),
    CONSTRAINT "UQ_3ad486d7e9d4f6f462c1830e0b2" UNIQUE (file_id),
    CONSTRAINT "UQ_6ca9503d77ae39b4b5a6cc3ba88" UNIQUE (user_id),
    CONSTRAINT "FK_3ad486d7e9d4f6f462c1830e0b2" FOREIGN KEY (file_id)
        REFERENCES public.files (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88" FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_profiles
    OWNER to postgres;

-- Table: public.user_notification_groups

-- DROP TABLE IF EXISTS public.user_notification_groups;

CREATE TABLE IF NOT EXISTS public.user_notification_groups
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    condition text COLLATE pg_catalog."default",
    status boolean DEFAULT true,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now()
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_notification_groups
    OWNER to postgres;

-- Table: public.user_game_progress

-- DROP TABLE IF EXISTS public.user_game_progress;

CREATE TABLE IF NOT EXISTS public.user_game_progress
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    trivia_current_game_level_reached integer NOT NULL DEFAULT 0,
    grid_based_current_game_level_reached integer NOT NULL DEFAULT 0,
    learning_path_current_game_level_reached integer NOT NULL DEFAULT 0,
    role_playing_current_game_level_reached integer NOT NULL DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    deleted smallint NOT NULL DEFAULT '0'::smallint,
    status smallint NOT NULL DEFAULT '1'::smallint,
    consecutive_right_answers_count json DEFAULT '{}'::json,
    CONSTRAINT "PK_b93107c2c8bddd2a4ab9016b21e" PRIMARY KEY (id, user_id),
    CONSTRAINT "FK_d2beffe7453e89628239465eae1" FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_game_progress
    OWNER to postgres;

-- Table: public.session

-- DROP TABLE IF EXISTS public.session;

CREATE TABLE IF NOT EXISTS public.session
(
    sid character varying COLLATE pg_catalog."default" NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL,
    CONSTRAINT session_pkey PRIMARY KEY (sid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.session
    OWNER to postgres;
-- Index: IDX_session_expire

-- DROP INDEX IF EXISTS public."IDX_session_expire";

CREATE INDEX IF NOT EXISTS "IDX_session_expire"
    ON public.session USING btree
    (expire ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: public.notifications

-- DROP TABLE IF EXISTS public.notifications;

CREATE TABLE IF NOT EXISTS public.notifications
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid,
    from_user_id uuid,
    notification_message text COLLATE pg_catalog."default",
    notification_link character varying(255) COLLATE pg_catalog."default",
    user_action character varying(20) COLLATE pg_catalog."default" NOT NULL DEFAULT 'unread'::character varying,
    expiry_date timestamp without time zone,
    status boolean DEFAULT true,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    user_request_action character varying(30) COLLATE pg_catalog."default" NOT NULL DEFAULT 'no-action'::character varying,
    system_notification_readed_by text COLLATE pg_catalog."default",
    system_notification_deleted_by text COLLATE pg_catalog."default",
    notification_type_id uuid,
    group_id uuid
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.notifications
    OWNER to postgres;

-- Table: public.notification_types

-- DROP TABLE IF EXISTS public.notification_types;

CREATE TABLE IF NOT EXISTS public.notification_types
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    notification_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    is_system_generated boolean DEFAULT false,
    status boolean DEFAULT true,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT notification_types_id_key UNIQUE (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.notification_types
    OWNER to postgres;

