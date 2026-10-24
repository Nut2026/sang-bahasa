-- PostgreSQL extensions for Sang Bahasa search (run once per database).
-- FTS uses tsvector columns; ranking uses plainto_tsquery + ts_rank_cd.
-- Trigram search uses similarity / % on unaccent-normalised text.

CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
