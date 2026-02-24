# Migracja SQLite → PostgreSQL (Supabase)

Dokument wyjaśnia każdą decyzję techniczną podjętą podczas migracji bazy danych. Skierowany do developera frontendowego, który chce zrozumieć backendowe wzorce produkcyjne.

---

## Dlaczego PostgreSQL zamiast SQLite?

| | SQLite | PostgreSQL |
|---|---|---|
| Architektura | Plik na dysku | Oddzielny serwer bazodanowy |
| Współbieżność | Tylko jeden zapis na raz | Wiele jednoczesnych zapisów (MVCC) |
| Typy danych | Uproszczone (TEXT, INTEGER, REAL, BLOB) | Bogate: UUID, JSONB, ARRAY, TIMESTAMPTZ, itd. |
| Hosting | Wymaga persistent disk w kontenerze | Managed service (Supabase, Neon, Railway) |
| Skalowalność | Ograniczona | Nieograniczona (replikacja, connection pooling) |

SQLite jest świetny do developmentu i małych projektów. PostgreSQL to **standard produkcyjny** — niemal każda firma używa PostgreSQL (lub kompatybilnej bazy jak AWS Aurora).

---

## Co to Supabase?

Supabase to **managed PostgreSQL** — czyli Postgres jako usługa. Zamiast stawiać własny serwer bazy danych, korzystasz z ich infrastruktury.

**Co dostajesz za darmo (Free tier):**
- 500 MB storage
- 2 projekty
- Dashboard z podglądem danych (jak phpMyAdmin, ale ładniejszy)
- Wbudowany connection pooler (PgBouncer)
- SSL domyślnie włączony
- Automatyczne backupy

**Nie mylić z Supabase Auth/Storage/Realtime** — te funkcje są opcjonalne. My używamy Supabase **wyłącznie jako hostingowego PostgreSQL**.

---

## DATABASE_URL — anatomy of a connection string

```
postgresql://postgres:twoje-haslo@db.abcxyz123.supabase.co:5432/postgres
     ^           ^         ^              ^                    ^      ^
  protokół    użytkownik  hasło           host               port  nazwa_bazy
```

- **`postgresql://`** — protokół, mówi driverowi jakiego typu to połączenie
- **`postgres`** — domyślny superuser w Supabase
- **`twoje-haslo`** — hasło ustawione przy tworzeniu projektu
- **`db.abcxyz123.supabase.co`** — adres serwera (unikalny per projekt)
- **`5432`** — standardowy port PostgreSQL (jak port 80 dla HTTP)
- **`/postgres`** — nazwa domyślnej bazy danych

Cały ten string trafia do zmiennej środowiskowej `DATABASE_URL`. Żaden z tych danych nie trafia do kodu — jest w `.env` (który jest w `.gitignore`).

---

## ssl: { rejectUnauthorized: false }

Supabase wymaga połączeń przez SSL (szyfrowanie jak HTTPS, ale dla bazy danych). Opcja `rejectUnauthorized: false` wyłącza weryfikację certyfikatu — to standardowa praktyka przy Supabase, bo używają self-signed certyfikatu na niektórych planach.

```typescript
// W app.module.ts i data-source.ts:
ssl: { rejectUnauthorized: false }
```

**Czy to bezpieczne?** — Tak. Połączenie jest szyfrowane. Wyłączamy tylko weryfikację tożsamości certyfikatu, nie samo szyfrowanie. Dla własnego serwera produkcyjnego ustawiłbyś `rejectUnauthorized: true` z własnym certyfikatem.

---

## synchronize: false — dlaczego to ważne?

### Poprzednio: `synchronize: true`

TypeORM przy każdym starcie serwera porównywał encje z aktualnym schematem bazy i automatycznie wprowadzał zmiany.

**Niebezpieczny scenariusz:**
```typescript
// Przed zmianą:
@Column()
firstName: string;

// Po zmianie (renaming kolumny):
@Column()
first_name: string;
```

Z `synchronize: true` TypeORM:
1. Widzi, że kolumna `firstName` nie istnieje w encji
2. **DROP COLUMN firstName** — usuwa kolumnę ze wszystkimi danymi
3. **ADD COLUMN first_name** — tworzy nową, pustą kolumnę

**Utrata danych gwarantowana.** Na produkcji to katastrofa.

### Teraz: `synchronize: false` + migracje

Ty kontrolujesz każdą zmianę schematu. TypeORM nie robi nic bez Twojej zgody.

---

## Czym są migracje TypeORM?

Migracja to **plik TypeScript z instrukcjami SQL** (opisanymi kodem), który TypeORM może wykonać (`up`) lub cofnąć (`down`).

### Jak wygląda wygenerowana migracja?

```typescript
// src/database/migrations/1709000000000-InitialSchema.ts
export class InitialSchema1709000000000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    // TypeORM sam generuje te instrukcje na podstawie encji
    await queryRunner.query(`
      CREATE TABLE "knowledge" (
        "id" SERIAL NOT NULL,
        "category" character varying NOT NULL,
        "level" character varying NOT NULL,
        "skills" text NOT NULL,
        CONSTRAINT "PK_knowledge" PRIMARY KEY ("id")
      )
    `);
    // ... reszta tabel
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Cofnięcie — usuwa to co up() stworzyło
    await queryRunner.query(`DROP TABLE "knowledge"`);
  }
}
```

### Tabela `migrations` w bazie danych

TypeORM automatycznie tworzy tabelę `migrations` w Twojej bazie:

```
id | timestamp         | name
---|-------------------|---------------------------
1  | 1709000000000     | InitialSchema1709000000000
```

Dzięki temu wie które migracje już zostały wykonane i nie wykonuje ich ponownie.

---

## migrationsRun: true

```typescript
// W app.module.ts:
migrationsRun: true,
migrations: ['dist/database/migrations/*.js'],
```

**Co to robi?** — Przy każdym starcie serwera TypeORM sprawdza tabelę `migrations` i jeśli są niewykonane migracje, wykonuje je automatycznie.

**Dlaczego to wygodne?** — Przy deploymencie na Railway/Render/Fly.io nie musisz ręcznie uruchamiać `migration:run`. Nowy deploy = automatyczne zastosowanie nowych migracji.

**Alternatywa:** `migrationsRun: false` + ręczne `npm run migration:run` przed/po deploymencie. Daje większą kontrolę.

---

## Przepływ pracy z migracjami

### Scenariusz: dodajesz nową kolumnę do encji

```typescript
// 1. Zmień encję:
@Column({ nullable: true })
linkedinUrl: string;

// 2. Wygeneruj migrację (TypeORM porówna encję z aktualnym schematem bazy):
npm run migration:generate -- src/database/migrations/AddLinkedinToProfile

// 3. Przejrzyj wygenerowany plik (zawsze sprawdź co SQL robi!)
// src/database/migrations/[timestamp]-AddLinkedinToProfile.ts

// 4. Zastosuj na bazie danych:
npm run migration:run

// 5. Commit obu plików (encja + migracja):
git add src/profile/profile.entity.ts src/database/migrations/
git commit -m "add linkedinUrl to Profile"
```

---

## Skrypty package.json — co robi każdy

```bash
# Generuje nową migrację porównując encje z aktualnym schematem bazy
# Wymasz podania nazwy: -- src/database/migrations/NazwaMigracji
npm run migration:generate -- src/database/migrations/InitialSchema

# Wykonuje wszystkie niewykonane migracje (w kolejności według timestamp)
npm run migration:run

# Cofa ostatnią migrację (wywołuje metodę down())
# Użyteczne gdy popełniłeś błąd w ostatniej migracji
npm run migration:revert

# Pokazuje listę migracji i ich status (wykonana / niewykonana)
npm run migration:show
```

---

## Seedy vs Migracje — czym się różnią?

| | Migracje | Seedy |
|---|---|---|
| Co zarządzają | **Schemat** (tabele, kolumny, indeksy) | **Dane** (wiersze w tabelach) |
| Kiedy uruchamiać | Przy każdej zmianie struktury bazy | Przy inicjalizacji (raz, lub po `seed:clear`) |
| Idempotentność | Tak — TypeORM nie wykona dwa razy tej samej | Tak — sprawdzają czy dane już istnieją |
| Przykład | `CREATE TABLE projects` | `INSERT INTO projects VALUES (...)` |

**Prawidłowa kolejność przy świeżym deploymencie:**
1. `migration:run` — tworzy tabele
2. `seed` — wypełnia tabelami danymi

---

## Krok po kroku: pierwsza konfiguracja Supabase

1. Utwórz projekt na [supabase.com](https://supabase.com)
2. **Project Settings → Database → Connection String → URI** → skopiuj
3. Wklej do `.env` jako `DATABASE_URL=...`
4. Wygeneruj pierwszą migrację:
   ```bash
   npm run migration:generate -- src/database/migrations/InitialSchema
   ```
5. Przejrzyj wygenerowany plik — upewnij się że SQL wygląda sensownie
6. Zastosuj migrację:
   ```bash
   npm run migration:run
   ```
7. Sprawdź w Supabase Dashboard → Table Editor — tabele powinny być widoczne
8. Uruchom seedy:
   ```bash
   npm run seed
   ```
9. Zweryfikuj: `npm run start:dev` → `http://localhost:3000/knowledge`
