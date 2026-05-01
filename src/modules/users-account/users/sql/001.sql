CREATE TABLE public.users
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    login character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    "passwordHash" text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
    "deletedAt" timestamp with time zone,
    PRIMARY KEY (id),
    CONSTRAINT check_email_unique UNIQUE (email)
);

ALTER TABLE IF EXISTS public.users
    OWNER to "nest-admin";



CREATE TABLE public."user_confirmations"
(
    "userId" uuid NOT NULL,
    "isConfirmed" boolean NOT NULL DEFAULT false,
    code uuid,
    "expirationDate" timestamp with time zone,
    PRIMARY KEY ("userId"),
    FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT check_confirmation_values CHECK (("isConfirmed" = true AND code IS NULL AND "expirationDate" IS NULL) OR ("isConfirmed" = false AND code IS NOT NULL AND "expirationDate" IS NOT NULL))
);

ALTER TABLE IF EXISTS public."user_confirmations"
    OWNER to "nest-admin";


CREATE TABLE public."user_recovery_codes"
(
    "userId" uuid NOT NULL,
    code uuid NOT NULL,
    "expirationDate" timestamp with time zone NOT NULL,
    PRIMARY KEY ("userId"),
    FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT check_recovery_password_values CHECK ((code IS NULL AND "expirationDate" IS NULL) OR (code IS NOT NULL AND "expirationDate" IS NOT NULL))
);

ALTER TABLE IF EXISTS public.user_recovery_codes
    OWNER to "nest-admin";