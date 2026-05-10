CREATE TABLE public.blogs
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text NOT NULL,
    "websiteUrl" text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
    "deletedAt" timestamp with time zone DEFAULT NULL,
    "isMembership" boolean NOT NULL DEFAULT false,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.blogs
    OWNER to "nest-admin";


CREATE TABLE public.posts
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL,
    "shortDescription" text NOT NULL,
    content text NOT NULL,
    "blogId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
    "deletedAt" timestamp with time zone DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY ("blogId")
        REFERENCES public.blogs (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public.posts
    OWNER to "nest-admin";