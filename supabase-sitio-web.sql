-- =====================================================================
-- Sitio web Subway Chile  →  Supabase
-- Ejecutar UNA vez en Supabase: SQL Editor → New query → pegar todo → Run.
--
-- Todo queda en un esquema aparte llamado "web" para NO tocar las tablas
-- de The Feed (Prisma usa el esquema "public"; así Prisma no ve ni borra nada).
--
-- Seguridad:
--   * El sitio público (clave anon) SOLO puede CREAR registros en los
--     formularios y LEER la lista pública de locales y el contenido del sitio.
--     Nunca puede leer postulaciones, reclamos ni datos de otros.
--   * La página de administración / CRM lee y gestiona todo desde su
--     servidor con la service_role key (que nunca va en el sitio público).
-- =====================================================================

create schema if not exists web;
grant usage on schema web to anon, authenticated, service_role;

-- ---------------------------------------------------------------------
-- 1) Lista pública de locales (solo datos que se pueden mostrar)
--    Sale de public."Store". El número de restaurante es la columna "code".
-- ---------------------------------------------------------------------
create or replace view web.locales_publicos as
select
  s.code      as numero,
  s.name      as nombre,
  s.address   as direccion,
  s.commune   as comuna,
  s.region    as region
from public."Store" s
where s."operationalStatus"::text = 'ABIERTO'
  and s."closedAt" is null;

grant select on web.locales_publicos to anon, authenticated;

-- ---------------------------------------------------------------------
-- 2) Campos comunes de seguimiento (CRM) en cada tabla:
--    estado, responsable, notas, cerrado_en
-- ---------------------------------------------------------------------
do $$ begin
  create type web.estado_caso as enum ('NUEVO', 'EN_REVISION', 'CONTACTADO', 'CERRADO', 'DESCARTADO');
exception when duplicate_object then null; end $$;

-- 2a) Postulaciones (Trabaja con Nosotros)
create table if not exists web.postulaciones (
  id             uuid primary key default gen_random_uuid(),
  creado_en      timestamptz not null default now(),
  nombre         text not null check (char_length(nombre) between 2 and 120),
  rut            text not null check (char_length(rut) <= 12),
  email          text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telefono       text not null check (char_length(telefono) <= 20),
  region         text not null,
  comuna         text not null check (char_length(comuna) <= 60),
  mensaje        text check (char_length(mensaje) <= 1500),
  cv_path        text,                          -- ruta del CV en Storage (bucket "cv-postulaciones")
  consentimiento boolean not null check (consentimiento),
  estado         web.estado_caso not null default 'NUEVO',
  responsable    text,
  notas          text,
  cerrado_en     timestamptz
);

-- 2b) Reclamos y sugerencias (Contáctanos)
create table if not exists web.reclamos (
  id                  uuid primary key default gen_random_uuid(),
  creado_en           timestamptz not null default now(),
  restaurante_numero  text,                     -- = public."Store".code
  restaurante_texto   text not null check (char_length(restaurante_texto) <= 120), -- lo que escribió el cliente
  store_id            text,                     -- se completa solo (ver trigger)
  nombre              text not null check (char_length(nombre) between 2 and 120),
  email               text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telefono            text check (char_length(telefono) <= 20),
  ubicacion           text check (char_length(ubicacion) <= 120),
  fecha_visita        date not null,
  tipo                text not null,
  canal               text not null,
  mensaje             text not null check (char_length(mensaje) <= 2000),
  consentimiento      boolean not null check (consentimiento),
  estado              web.estado_caso not null default 'NUEVO',
  responsable         text,
  notas               text,
  cerrado_en          timestamptz
);

-- 2c) Interesados en franquicias
create table if not exists web.franquicias (
  id             uuid primary key default gen_random_uuid(),
  creado_en      timestamptz not null default now(),
  nombre         text not null check (char_length(nombre) between 2 and 120),
  rut            text not null check (char_length(rut) <= 12),
  email          text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telefono       text not null check (char_length(telefono) <= 20),
  region         text not null,
  comuna         text not null check (char_length(comuna) <= 60),
  capital        text not null,
  experiencia    text not null,
  local          text,
  cantidad       text,
  mensaje        text check (char_length(mensaje) <= 2000),
  consentimiento boolean not null check (consentimiento),
  estado         web.estado_caso not null default 'NUEVO',
  responsable    text,
  notas          text,
  cerrado_en     timestamptz
);

-- 2d) Solicitudes del Centro de Privacidad
create table if not exists web.solicitudes_privacidad (
  id             uuid primary key default gen_random_uuid(),
  creado_en      timestamptz not null default now(),
  nombre         text not null check (char_length(nombre) between 2 and 120),
  rut            text not null check (char_length(rut) <= 12),
  email          text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telefono       text check (char_length(telefono) <= 20),
  tipo           text not null,
  mensaje        text not null check (char_length(mensaje) <= 2000),
  consentimiento boolean not null check (consentimiento),
  estado         web.estado_caso not null default 'NUEVO',
  responsable    text,
  notas          text,
  cerrado_en     timestamptz
);

-- Amarra cada reclamo al local de The Feed según el número de restaurante
create or replace function web.vincular_local() returns trigger
language plpgsql security definer set search_path = public, web as $$
begin
  if new.restaurante_numero is not null then
    select s.id into new.store_id from public."Store" s where s.code = new.restaurante_numero limit 1;
  end if;
  -- El sitio público no puede fijar campos de seguimiento
  new.estado := 'NUEVO'; new.responsable := null; new.notas := null; new.cerrado_en := null;
  return new;
end $$;
drop trigger if exists trg_reclamos_local on web.reclamos;
create trigger trg_reclamos_local before insert on web.reclamos
  for each row execute function web.vincular_local();

-- En las demás tablas, el público tampoco puede fijar campos de seguimiento
create or replace function web.limpiar_seguimiento() returns trigger
language plpgsql as $$
begin
  if auth.role() = 'anon' then
    new.estado := 'NUEVO'; new.responsable := null; new.notas := null; new.cerrado_en := null;
  end if;
  return new;
end $$;
drop trigger if exists trg_post_seg on web.postulaciones;
create trigger trg_post_seg before insert on web.postulaciones for each row execute function web.limpiar_seguimiento();
drop trigger if exists trg_fran_seg on web.franquicias;
create trigger trg_fran_seg before insert on web.franquicias for each row execute function web.limpiar_seguimiento();
drop trigger if exists trg_priv_seg on web.solicitudes_privacidad;
create trigger trg_priv_seg before insert on web.solicitudes_privacidad for each row execute function web.limpiar_seguimiento();

-- Índices útiles para el CRM
create index if not exists reclamos_store_idx on web.reclamos (store_id, creado_en desc);
create index if not exists reclamos_estado_idx on web.reclamos (estado, creado_en desc);
create index if not exists post_estado_idx on web.postulaciones (estado, creado_en desc);
create index if not exists fran_estado_idx on web.franquicias (estado, creado_en desc);
create index if not exists priv_estado_idx on web.solicitudes_privacidad (estado, creado_en desc);

-- Permisos + RLS: el público SOLO inserta
alter table web.postulaciones          enable row level security;
alter table web.reclamos               enable row level security;
alter table web.franquicias            enable row level security;
alter table web.solicitudes_privacidad enable row level security;

grant insert on web.postulaciones, web.reclamos, web.franquicias, web.solicitudes_privacidad to anon;
grant all    on web.postulaciones, web.reclamos, web.franquicias, web.solicitudes_privacidad to service_role;

drop policy if exists "publico_inserta" on web.postulaciones;
create policy "publico_inserta" on web.postulaciones          for insert to anon with check (true);
drop policy if exists "publico_inserta" on web.reclamos;
create policy "publico_inserta" on web.reclamos               for insert to anon with check (true);
drop policy if exists "publico_inserta" on web.franquicias;
create policy "publico_inserta" on web.franquicias            for insert to anon with check (true);
drop policy if exists "publico_inserta" on web.solicitudes_privacidad;
create policy "publico_inserta" on web.solicitudes_privacidad for insert to anon with check (true);
-- (Sin políticas de SELECT/UPDATE para anon: no puede leer ni modificar nada.)

-- ---------------------------------------------------------------------
-- 3) Contenido editable del sitio (banners, promociones, pie de página)
--    Lo edita la página de administración; el sitio solo lo lee.
-- ---------------------------------------------------------------------
create table if not exists web.contenido_sitio (
  clave           text primary key,             -- 'home' | 'footer'
  datos           jsonb not null,
  actualizado_en  timestamptz not null default now(),
  actualizado_por text
);
alter table web.contenido_sitio enable row level security;
grant select on web.contenido_sitio to anon, authenticated;
grant all    on web.contenido_sitio to service_role;
drop policy if exists "publico_lee" on web.contenido_sitio;
create policy "publico_lee" on web.contenido_sitio for select to anon, authenticated using (true);

-- ---------------------------------------------------------------------
-- 4) CVs: carpeta privada en Storage. El público solo puede SUBIR.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cv-postulaciones', 'cv-postulaciones', false, 5242880,
        array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;

drop policy if exists "publico_sube_cv" on storage.objects;
create policy "publico_sube_cv" on storage.objects for insert to anon
  with check (bucket_id = 'cv-postulaciones');
