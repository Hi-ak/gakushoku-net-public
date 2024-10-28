import { getWeekday } from "@/app/api/sales/excelStyles";

// 明日からの7日間をゲット
export const get7Days = () => {
  const DAYS: Date[] = [];
  for (let i = 1; i < 8; i++) {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + i);
    DAYS.push(newDate);
  }
  return DAYS;
};

// Date Object -> m月d日(w)の形式に
export const getDateString = (date: Date) => {
  return `${date.getMonth() + 1}月${date.getDate()}日 (${getWeekday(
    date.getDay()
  )})`;
};

export const removeEmptyElements = (strings: string[]) => {
  return strings.filter(
    (str) =>
      str != null &&
      str != "" &&
      str != "\t" &&
      str != " " &&
      str != "  " &&
      str != "   "
  );
};
