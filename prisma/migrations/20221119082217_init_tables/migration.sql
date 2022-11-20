-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "fullname" TEXT,
    "email" TEXT,
    "gender" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "name" TEXT,
    "group_code" TEXT,
    "flag" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match" (
    "id" SERIAL NOT NULL,
    "home_team_id" INTEGER NOT NULL,
    "away_team_id" INTEGER NOT NULL,
    "code" TEXT,
    "start_time" TIMESTAMP(3),
    "current_score_url" TEXT,
    "type" TEXT,
    "fulltime_home" INTEGER,
    "fulltime_away" INTEGER,
    "matchtime_home" INTEGER,
    "matchtime_away" INTEGER,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "odd" (
    "id" SERIAL NOT NULL,
    "match_id" INTEGER,
    "type" TEXT,
    "code" TEXT,
    "ratio" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "odd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bet" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "match_id" INTEGER,
    "type" TEXT,
    "ratio" DOUBLE PRECISION,
    "code" TEXT,
    "status" TEXT,
    "money" DOUBLE PRECISION,
    "prize" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config" (
    "id" INTEGER NOT NULL,
    "max_money_can_bet" DOUBLE PRECISION,
    "min_time_can_create_bet_before_match_start" DOUBLE PRECISION,

    CONSTRAINT "config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "team_id_key" ON "team"("id");

-- CreateIndex
CREATE UNIQUE INDEX "team_code_key" ON "team"("code");

-- CreateIndex
CREATE UNIQUE INDEX "match_id_key" ON "match"("id");

-- CreateIndex
CREATE UNIQUE INDEX "match_code_key" ON "match"("code");

-- CreateIndex
CREATE UNIQUE INDEX "odd_id_key" ON "odd"("id");

-- CreateIndex
CREATE UNIQUE INDEX "bet_id_key" ON "bet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "config_id_key" ON "config"("id");

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "odd" ADD CONSTRAINT "odd_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bet" ADD CONSTRAINT "bet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bet" ADD CONSTRAINT "bet_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "match"("id") ON DELETE SET NULL ON UPDATE CASCADE;
