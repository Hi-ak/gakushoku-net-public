-- CreateTable
CREATE TABLE "Parameter" (
    "id" UUID NOT NULL,
    "cafeteriaHandle" TEXT NOT NULL,
    "cafeteriaOpenAtHour" INTEGER NOT NULL,
    "cafeteriaOpenAtMinute" INTEGER NOT NULL,
    "cafeteriaCloseAtHour" INTEGER NOT NULL,
    "cafeteriaCloseAtMinute" INTEGER NOT NULL,
    "ticketBuyableStartAtHour" INTEGER NOT NULL,
    "ticketBuyableStartAtMinute" INTEGER NOT NULL,
    "ticketBuyableEndAtHour" INTEGER NOT NULL,
    "ticketBuyableEndAtMinute" INTEGER NOT NULL,
    "timezoneHourTimeDelta" INTEGER NOT NULL,
    "timezoneMinuteTimeDelta" INTEGER NOT NULL,
    "timeToDeleteCartTicketMilliseconds" INTEGER NOT NULL,
    "timeToTimeoutAtPurchaseMilliseconds" INTEGER NOT NULL,
    "orderDurationMilliseconds" INTEGER NOT NULL,

    CONSTRAINT "Parameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DaySetting" (
    "id" UUID NOT NULL,
    "cafeteriaHandle" TEXT NOT NULL,
    "sun" BOOLEAN NOT NULL,
    "mon" BOOLEAN NOT NULL,
    "tue" BOOLEAN NOT NULL,
    "wed" BOOLEAN NOT NULL,
    "thu" BOOLEAN NOT NULL,
    "fri" BOOLEAN NOT NULL,
    "sat" BOOLEAN NOT NULL,

    CONSTRAINT "DaySetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DateSetting" (
    "id" UUID NOT NULL,
    "cafeteriaHandle" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "date" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL,

    CONSTRAINT "DateSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Parameter_id_key" ON "Parameter"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Parameter_cafeteriaHandle_key" ON "Parameter"("cafeteriaHandle");

-- CreateIndex
CREATE UNIQUE INDEX "DaySetting_id_key" ON "DaySetting"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DaySetting_cafeteriaHandle_key" ON "DaySetting"("cafeteriaHandle");

-- CreateIndex
CREATE UNIQUE INDEX "DateSetting_id_key" ON "DateSetting"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DateSetting_year_month_date_cafeteriaHandle_key" ON "DateSetting"("year", "month", "date", "cafeteriaHandle");

-- AddForeignKey
ALTER TABLE "Parameter" ADD CONSTRAINT "Parameter_cafeteriaHandle_fkey" FOREIGN KEY ("cafeteriaHandle") REFERENCES "Cafeteria"("orgHandle") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaySetting" ADD CONSTRAINT "DaySetting_cafeteriaHandle_fkey" FOREIGN KEY ("cafeteriaHandle") REFERENCES "Cafeteria"("orgHandle") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateSetting" ADD CONSTRAINT "DateSetting_cafeteriaHandle_fkey" FOREIGN KEY ("cafeteriaHandle") REFERENCES "Cafeteria"("orgHandle") ON DELETE RESTRICT ON UPDATE CASCADE;
