CREATE TABLE public.users
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    login character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    "passwordHash" text NOT NULL,
    "isConfirmed" boolean NOT NULL DEFAULT false,
    "confirmationCode" uuid,
    "confirmationCodeExpirationDate" timestamp with time zone,
    "passwordRecoveryCode" uuid,
    "passwordRecoveryCodeExpirationDate" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
    "deletedAt" timestamp with time zone,
    PRIMARY KEY (id),
    CONSTRAINT check_login_unique UNIQUE (login),
    CONSTRAINT check_email_unique UNIQUE (email)
);

ALTER TABLE IF EXISTS public.users
    OWNER to "nest-admin";