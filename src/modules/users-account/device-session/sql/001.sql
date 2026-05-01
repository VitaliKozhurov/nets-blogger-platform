CREATE TABLE public."user_device_sessions"
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    userId uuid NOT NULL,
    deviceId uuid NOT NULL,
    deviceName text NOT NULL,
    ip character varying(50) NOT NULL,
    iat bigint NOT NULL,
    expirationAt bigint NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
);

ALTER TABLE IF EXISTS public."user_device_sessions"
    OWNER to "nest-admin";


