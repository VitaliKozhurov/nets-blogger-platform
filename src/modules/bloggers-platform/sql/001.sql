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

CREATE TABLE public.comments
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    content text NOT NULL,
    "postId" uuid NOT NULL,
    "ownerId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
    "deletedAt" timestamp with time zone DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY ("postId")
        REFERENCES public.posts (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY ("ownerId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

ALTER TABLE IF EXISTS public.comments
    OWNER to "nest-admin";


CREATE TABLE public.post_likes
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    "userId" uuid NOT NULL,
    "postId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
    status text NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uniq_post_likes UNIQUE ("userId", "postId"),
    FOREIGN KEY ("postId")
        REFERENCES public.posts (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public.post_likes
    OWNER to "nest-admin";


CREATE TABLE public.comment_likes
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    "userId" uuid NOT NULL,
    "commentId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
    status like_status_type NOT NULL,
    PRIMARY KEY (id),
    UNIQUE ("userId", "commentId"),
    FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    FOREIGN KEY ("commentId")
        REFERENCES public.comments (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public.comment_likes
    OWNER to "nest-admin";