-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DEV', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "SpecialCartTicketStatus" AS ENUM ('AUTO_PURCHASED', 'NOT_PURCHASED', 'PROCESSING');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('UNUSED', 'USED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentTypes" AS ENUM ('PAYPAY');

-- CreateEnum
CREATE TYPE "ProcessingTypes" AS ENUM ('AUTO_PURCHASED', 'NORMAL');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('ORDERED', 'COOCKED', 'RECEIVED');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('AVAILABLE', 'SOLD_OUT', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "EmailFilterType" AS ENUM ('REGEXP', 'EQUAL', 'DOMAIN');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('PROCESSING', 'SUCCEEDED', 'FAILED', 'ERROR', 'EMPTY');

-- CreateEnum
CREATE TYPE "SalesExportStatus" AS ENUM ('PARTIAL', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "cafeteriaId" UUID,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartTicket" (
    "id" UUID NOT NULL,
    "merchantPaymentId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "menuId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "specialStatus" "SpecialCartTicketStatus" NOT NULL DEFAULT 'NOT_PURCHASED',

    CONSTRAINT "CartTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartTicketOption" (
    "id" UUID NOT NULL,
    "optionId" UUID NOT NULL,
    "choiceId" UUID NOT NULL,
    "cartTicketId" UUID NOT NULL,

    CONSTRAINT "CartTicketOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" UUID NOT NULL,
    "holderId" UUID NOT NULL,
    "receiptId" UUID NOT NULL,
    "orderId" UUID,
    "menuId" UUID NOT NULL,
    "menuPrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "TicketStatus" NOT NULL DEFAULT 'UNUSED',

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketOptions" (
    "id" UUID NOT NULL,
    "optionId" UUID NOT NULL,
    "choiceId" UUID NOT NULL,
    "choicePrice" INTEGER NOT NULL,
    "ticketId" UUID NOT NULL,

    CONSTRAINT "TicketOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" UUID NOT NULL,
    "issuerId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "paymentType" "PaymentTypes" NOT NULL,
    "processingType" "ProcessingTypes" NOT NULL DEFAULT 'NORMAL',
    "paymentId" TEXT NOT NULL,
    "taxRate" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL,
    "issuerId" UUID NOT NULL,
    "orderNum" INTEGER NOT NULL,
    "orderStatus" "OrderStatus" NOT NULL DEFAULT 'ORDERED',
    "cafeteriaId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cafeteria" (
    "id" UUID NOT NULL,
    "orgHandle" TEXT NOT NULL,
    "orgName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cafeteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" UUID NOT NULL,
    "cafeteriaId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "contents" TEXT[],
    "price" INTEGER NOT NULL,
    "serviceStatus" "ServiceStatus" NOT NULL,
    "backgroundImageURL" TEXT NOT NULL,
    "categoryHandle" TEXT NOT NULL,
    "availableQuantity" INTEGER NOT NULL,
    "defaultQuantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDaily" BOOLEAN NOT NULL DEFAULT false,
    "index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuCategory" (
    "id" UUID NOT NULL,
    "categoryHandle" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "cafeteriaId" UUID NOT NULL,

    CONSTRAINT "MenuCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuOption" (
    "id" UUID NOT NULL,
    "cafeteriaId" UUID NOT NULL,
    "optionHandle" TEXT NOT NULL,
    "optionName" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "choiceNum" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "MenuOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionChoice" (
    "id" UUID NOT NULL,
    "cafeteriaId" UUID NOT NULL,
    "menuOptionHandle" TEXT NOT NULL,
    "choiceHandle" TEXT NOT NULL,
    "choiceName" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "priceDiff" INTEGER NOT NULL,

    CONSTRAINT "OptionChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresetInfo" (
    "id" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "date" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PresetInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresetMenu" (
    "id" UUID NOT NULL,
    "presetInfoId" UUID NOT NULL,
    "menuId" UUID NOT NULL,
    "contents" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PresetMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cafeteria_UserEmail" (
    "id" UUID NOT NULL,
    "cafeteriaHandle" TEXT NOT NULL,
    "emailFilter" TEXT NOT NULL,
    "emailFilterType" "EmailFilterType" NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Cafeteria_UserEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutoRefundHistory" (
    "id" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "status" "RefundStatus" NOT NULL DEFAULT 'PROCESSING',
    "message" TEXT,
    "succeededTicketIds" TEXT[],
    "failedTicketIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutoRefundHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxSettings" (
    "id" UUID NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "taxRate" INTEGER NOT NULL,

    CONSTRAINT "TaxSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesExportHistory" (
    "id" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "status" "SalesExportStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalesExportHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MenuToMenuOption" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CartTicket_id_key" ON "CartTicket"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CartTicketOption_id_key" ON "CartTicketOption"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_id_key" ON "Ticket"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TicketOptions_id_key" ON "TicketOptions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_id_key" ON "Receipt"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_paymentId_key" ON "Receipt"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_id_key" ON "Order"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_cafeteriaId_orderNum_key" ON "Order"("cafeteriaId", "orderNum");

-- CreateIndex
CREATE UNIQUE INDEX "Cafeteria_id_key" ON "Cafeteria"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Cafeteria_orgHandle_key" ON "Cafeteria"("orgHandle");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_id_key" ON "Menu"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MenuCategory_id_key" ON "MenuCategory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MenuCategory_categoryHandle_cafeteriaId_key" ON "MenuCategory"("categoryHandle", "cafeteriaId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuOption_id_key" ON "MenuOption"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MenuOption_optionHandle_cafeteriaId_key" ON "MenuOption"("optionHandle", "cafeteriaId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuOption_cafeteriaId_optionHandle_key" ON "MenuOption"("cafeteriaId", "optionHandle");

-- CreateIndex
CREATE UNIQUE INDEX "OptionChoice_id_key" ON "OptionChoice"("id");

-- CreateIndex
CREATE UNIQUE INDEX "OptionChoice_choiceHandle_menuOptionHandle_cafeteriaId_key" ON "OptionChoice"("choiceHandle", "menuOptionHandle", "cafeteriaId");

-- CreateIndex
CREATE UNIQUE INDEX "PresetInfo_id_key" ON "PresetInfo"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PresetInfo_year_month_date_key" ON "PresetInfo"("year", "month", "date");

-- CreateIndex
CREATE UNIQUE INDEX "PresetMenu_id_key" ON "PresetMenu"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PresetMenu_presetInfoId_menuId_key" ON "PresetMenu"("presetInfoId", "menuId");

-- CreateIndex
CREATE UNIQUE INDEX "Cafeteria_UserEmail_id_key" ON "Cafeteria_UserEmail"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AutoRefundHistory_id_key" ON "AutoRefundHistory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TaxSettings_id_key" ON "TaxSettings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SalesExportHistory_id_key" ON "SalesExportHistory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SalesExportHistory_year_month_key" ON "SalesExportHistory"("year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "_MenuToMenuOption_AB_unique" ON "_MenuToMenuOption"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuToMenuOption_B_index" ON "_MenuToMenuOption"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cafeteriaId_fkey" FOREIGN KEY ("cafeteriaId") REFERENCES "Cafeteria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartTicket" ADD CONSTRAINT "CartTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartTicket" ADD CONSTRAINT "CartTicket_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartTicketOption" ADD CONSTRAINT "CartTicketOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "MenuOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartTicketOption" ADD CONSTRAINT "CartTicketOption_choiceId_fkey" FOREIGN KEY ("choiceId") REFERENCES "OptionChoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartTicketOption" ADD CONSTRAINT "CartTicketOption_cartTicketId_fkey" FOREIGN KEY ("cartTicketId") REFERENCES "CartTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketOptions" ADD CONSTRAINT "TicketOptions_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "MenuOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketOptions" ADD CONSTRAINT "TicketOptions_choiceId_fkey" FOREIGN KEY ("choiceId") REFERENCES "OptionChoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketOptions" ADD CONSTRAINT "TicketOptions_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "Cafeteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cafeteriaId_fkey" FOREIGN KEY ("cafeteriaId") REFERENCES "Cafeteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_cafeteriaId_fkey" FOREIGN KEY ("cafeteriaId") REFERENCES "Cafeteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_categoryHandle_cafeteriaId_fkey" FOREIGN KEY ("categoryHandle", "cafeteriaId") REFERENCES "MenuCategory"("categoryHandle", "cafeteriaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuCategory" ADD CONSTRAINT "MenuCategory_cafeteriaId_fkey" FOREIGN KEY ("cafeteriaId") REFERENCES "Cafeteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuOption" ADD CONSTRAINT "MenuOption_cafeteriaId_fkey" FOREIGN KEY ("cafeteriaId") REFERENCES "Cafeteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionChoice" ADD CONSTRAINT "OptionChoice_cafeteriaId_fkey" FOREIGN KEY ("cafeteriaId") REFERENCES "Cafeteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionChoice" ADD CONSTRAINT "OptionChoice_cafeteriaId_menuOptionHandle_fkey" FOREIGN KEY ("cafeteriaId", "menuOptionHandle") REFERENCES "MenuOption"("cafeteriaId", "optionHandle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresetMenu" ADD CONSTRAINT "PresetMenu_presetInfoId_fkey" FOREIGN KEY ("presetInfoId") REFERENCES "PresetInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresetMenu" ADD CONSTRAINT "PresetMenu_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cafeteria_UserEmail" ADD CONSTRAINT "Cafeteria_UserEmail_cafeteriaHandle_fkey" FOREIGN KEY ("cafeteriaHandle") REFERENCES "Cafeteria"("orgHandle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuToMenuOption" ADD CONSTRAINT "_MenuToMenuOption_A_fkey" FOREIGN KEY ("A") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuToMenuOption" ADD CONSTRAINT "_MenuToMenuOption_B_fkey" FOREIGN KEY ("B") REFERENCES "MenuOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
