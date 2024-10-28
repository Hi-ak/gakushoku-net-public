-- DropForeignKey
ALTER TABLE "OptionChoice" DROP CONSTRAINT "OptionChoice_cafeteriaId_menuOptionHandle_fkey";

-- AddForeignKey
ALTER TABLE "OptionChoice" ADD CONSTRAINT "OptionChoice_cafeteriaId_menuOptionHandle_fkey" FOREIGN KEY ("cafeteriaId", "menuOptionHandle") REFERENCES "MenuOption"("cafeteriaId", "optionHandle") ON DELETE CASCADE ON UPDATE CASCADE;
